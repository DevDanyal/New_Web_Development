# Technical Architecture & Implementation

## Project Structure

```
aidevdanyal-portfolio/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Homepage (all sections)
│   ├── globals.css                # Global styles + Tailwind
│   ├── api/
│   │   ├── chat/route.ts          # Gemini chatbot endpoint
│   │   ├── leads/route.ts         # Lead capture endpoint
│   │   ├── github/route.ts        # GitHub repos fetch
│   │   └── contact/route.ts       # Contact form endpoint
│   ├── cyberstore/                # E-commerce demo (separate app)
│   └── workflow-ai/               # SaaS demo (separate app)
├── components/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── TechStack.tsx
│   ├── Process.tsx
│   ├── Contact.tsx
│   ├── ChatWidget.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── ui/                        # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── GlitchText.tsx
├── lib/
│   ├── db/
│   │   ├── index.ts               # Database client
│   │   └── schema.ts              # Drizzle schema
│   ├── gemini.ts                  # Gemini API client
│   ├── rate-limiter.ts            # Rate limiting logic
│   ├── email.ts                   # Resend email client
│   └── utils.ts                   # Utility functions
├── public/
│   ├── images/
│   ├── videos/
│   └── fonts/
├── docs/                          # Project documentation
├── .env.local                     # Environment variables
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Environment Variables

```bash
# .env.local

# Database
DATABASE_URL="postgres://..."

# AI
GEMINI_API_KEY="your-gemini-api-key"

# Email
RESEND_API_KEY="re_..."
NOTIFICATION_EMAIL="your-email@example.com"

# Rate Limiting (optional - use Upstash Redis)
UPSTASH_REDIS_URL="https://..."
UPSTASH_REDIS_TOKEN="..."

# Cal.com
NEXT_PUBLIC_CAL_LINK="https://cal.com/aidevdanyal/30min"

# GitHub
GITHUB_USERNAME="yourusername"
GITHUB_TOKEN="ghp_..." # Optional, for higher rate limits

# Analytics (optional)
NEXT_PUBLIC_GA_ID="G-..."

# Site
NEXT_PUBLIC_SITE_URL="https://aidevdanyal.com"
```

---

## Database Setup

### Using Vercel Postgres + Drizzle ORM

**Install dependencies:**
```bash
npm install drizzle-orm @vercel/postgres
npm install -D drizzle-kit
```

**Database schema:**
```typescript
// lib/db/schema.ts
import { pgTable, serial, varchar, text, jsonb, timestamp, boolean, decimal, integer } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  projectType: varchar('project_type', { length: 50 }),
  timeline: varchar('timeline', { length: 50 }),
  budgetRange: varchar('budget_range', { length: 50 }),
  message: text('message'),
  conversationHistory: jsonb('conversation_history'),
  source: varchar('source', { length: 50 }).default('chatbot'),
  status: varchar('status', { length: 50 }).default('new'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// For CYBERSTORE
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  category: varchar('category', { length: 100 }),
  stock: integer('stock').default(0),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0'),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }),
  items: jsonb('items').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Database client:**
```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
```

**Drizzle config:**
```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

**Run migrations:**
```bash
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

---

## API Routes Implementation

### 1. Chat API (Gemini)

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimiter } from '@/lib/rate-limiter';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are NEXUS-AI, the AI assistant for Danyal, an AI-driven developer specializing in e-commerce, SaaS, and AI automation.

PERSONALITY: Professional, efficient, helpful. Use cyberpunk-themed language occasionally.

YOUR GOALS:
1. Qualify leads by understanding project needs
2. Collect email addresses
3. Offer Cal.com booking
4. Answer questions about Danyal's work

DANYAL'S EXPERTISE:
- E-commerce: AI-powered stores, Shopify/custom, payment integration
- SaaS: Full-stack web apps, dashboards, real-time features
- AI Automation: Chatbots, workflow automation, AI agents
- Tech: Next.js, React, TypeScript, Node.js, Python, PostgreSQL, Gemini/OpenAI

PROJECTS:
- CYBERSTORE: AI e-commerce demo
- WORKFLOW_AI: SaaS task automation
- GitHub: 20+ open source projects

LEAD QUALIFICATION:
1. Project type? (e-commerce, SaaS, AI automation)
2. Timeline? (urgent, 1-2 weeks, 1 month, 2-3 months)
3. Budget? (<$5k, $5k-$10k, $10k-$25k, $25k+)

BOOKING: https://cal.com/aidevdanyal/30min

RULES:
- Keep responses under 50 words
- Don't make up information
- Be respectful and professional
- Don't be pushy about email collection
- Suggest booking after understanding project basics`;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await rateLimiter.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { messages, sessionId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build chat history
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    // Send message
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response.text();

    return NextResponse.json({ 
      message: response,
      sessionId 
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process message. Please try again or email contact@aidevdanyal.com' },
      { status: 500 }
    );
  }
}
```

### 2. Leads API

```typescript
// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate email
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert lead
    const [lead] = await db.insert(leads).values({
      email: data.email,
      name: data.name,
      projectType: data.projectType,
      timeline: data.timeline,
      budgetRange: data.budgetRange,
      message: data.message,
      conversationHistory: data.conversationHistory,
    }).returning();

    // Send notification to you
    await resend.emails.send({
      from: 'NEXUS-AI <nexus@aidevdanyal.com>',
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `🚀 New Lead: ${data.email}`,
      html: `
        <h2>New Lead from aidevdanyal.com</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
        <p><strong>Project Type:</strong> ${data.projectType || 'Not specified'}</p>
        <p><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</p>
        <p><strong>Budget:</strong> ${data.budgetRange || 'Not specified'}</p>
        <p><strong>Message:</strong> ${data.message || 'None'}</p>
        <hr>
        <p><small>Lead ID: ${lead.id} | Created: ${new Date().toISOString()}</small></p>
      `,
    });

    // Send confirmation to lead
    await resend.emails.send({
      from: 'Danyal <danyal@aidevdanyal.com>',
      to: data.email,
      subject: 'Thanks for reaching out!',
      html: `
        <h2>Hey${data.name ? ' ' + data.name : ''}!</h2>
        <p>Thanks for your interest in working together. I'll review your project details and get back to you within 24 hours.</p>
        
        <h3>In the meantime, check out my work:</h3>
        <ul>
          <li><a href="https://aidevdanyal.com/cyberstore">CYBERSTORE - AI E-commerce Demo</a></li>
          <li><a href="https://aidevdanyal.com/workflow-ai">WORKFLOW_AI - SaaS Platform Demo</a></li>
          <li><a href="https://github.com/${process.env.GITHUB_USERNAME}">GitHub Projects</a></li>
        </ul>
        
        <p>Need to talk sooner? <a href="${process.env.NEXT_PUBLIC_CAL_LINK}">Book a call directly</a></p>
        
        <p>Best,<br>Danyal</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          AI Dev Danyal | E-commerce & SaaS Developer<br>
          <a href="https://aidevdanyal.com">aidevdanyal.com</a>
        </p>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id 
    });

  } catch (error: any) {
    console.error('Lead API error:', error);
    
    // Handle duplicate email
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    );
  }
}
```

### 3. GitHub API

```typescript
// app/api/github/route.ts
import { NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';
const USERNAME = process.env.GITHUB_USERNAME!;
const TOKEN = process.env.GITHUB_TOKEN;

export async function GET() {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (TOKEN) {
      headers['Authorization'] = `token ${TOKEN}`;
    }

    const response = await fetch(
      `${GITHUB_API}/users/${USERNAME}/repos?sort=updated&per_page=20`,
      { 
        headers,
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('GitHub API error');
    }

    const repos = await response.json();

    // Filter and format repos
    const filteredRepos = repos
      .filter((repo: any) => !repo.fork && !repo.private)
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics,
        updatedAt: repo.updated_at,
      }));

    return NextResponse.json({ repos: filteredRepos });

  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
```

### 4. Contact Form API

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to database
    await db.insert(contactSubmissions).values({
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
    });

    // Send email notification
    await resend.emails.send({
      from: 'Contact Form <contact@aidevdanyal.com>',
      to: process.env.NOTIFICATION_EMAIL!,
      replyTo: email,
      subject: `Contact Form: ${subject || 'New Message'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject || 'None'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
```

---

## Rate Limiting

### Using Upstash Redis (Recommended)

```typescript
// lib/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, '1 m'), // 15 requests per minute
  analytics: true,
  prefix: 'ratelimit',
});
```

### Alternative: In-Memory (Development Only)

```typescript
// lib/rate-limiter.ts
const requests = new Map<string, number[]>();

export const rateLimiter = {
  limit: async (identifier: string) => {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 15;

    const userRequests = requests.get(identifier) || [];
    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return { success: false };
    }

    recentRequests.push(now);
    requests.set(identifier, recentRequests);

    return { success: true };
  },
};
```

---

## Email Setup (Resend)

**Install:**
```bash
npm install resend
```

**Configure domain:**
1. Go to resend.com
2. Add domain: aidevdanyal.com
3. Add DNS records (SPF, DKIM, DMARC)
4. Verify domain

**Email client:**
```typescript
// lib/email.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLeadNotification(lead: any) {
  return await resend.emails.send({
    from: 'NEXUS-AI <nexus@aidevdanyal.com>',
    to: process.env.NOTIFICATION_EMAIL!,
    subject: `🚀 New Lead: ${lead.email}`,
    html: `...`,
  });
}

export async function sendLeadConfirmation(lead: any) {
  return await resend.emails.send({
    from: 'Danyal <danyal@aidevdanyal.com>',
    to: lead.email,
    subject: 'Thanks for reaching out!',
    html: `...`,
  });
}
```

---

## Deployment (Vercel)

### 1. Connect GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/aidevdanyal-portfolio.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to vercel.com
2. Import GitHub repository
3. Configure project:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### 3. Add Environment Variables
Add all variables from `.env.local` in Vercel dashboard

### 4. Configure Custom Domain
1. Add domain: aidevdanyal.com
2. Update DNS records:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```
3. Wait for SSL certificate

### 5. Configure Subdomains (for demos)
```
CNAME cyberstore    cname.vercel-dns.com
CNAME workflow-ai   cname.vercel-dns.com
```

---

## Performance Optimization

### 1. Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/images/project.jpg"
  alt="Project"
  width={800}
  height={600}
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

### 2. Font Optimization
```typescript
// app/layout.tsx
import { Space_Grotesk, JetBrains_Mono, Orbitron } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
```

### 3. Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
});
```

### 4. Caching Strategy
```typescript
// API routes with caching
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

---

## Security Best Practices

### 1. Environment Variables
- Never commit `.env.local`
- Use Vercel environment variables
- Rotate API keys regularly

### 2. Input Validation
```typescript
import { z } from 'zod';

const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100).optional(),
  projectType: z.enum(['ecommerce', 'saas', 'ai', 'other']).optional(),
  message: z.string().max(1000).optional(),
});

// Validate input
const result = leadSchema.safeParse(data);
if (!result.success) {
  return NextResponse.json({ error: result.error }, { status: 400 });
}
```

### 3. Rate Limiting
- Implement on all API routes
- Use Upstash Redis for distributed rate limiting
- Return 429 status code

### 4. CORS
```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}
```

### 5. SQL Injection Prevention
- Use Drizzle ORM (parameterized queries)
- Never concatenate user input into SQL

---

## Monitoring & Analytics

### 1. Vercel Analytics
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking (Optional - Sentry)
```bash
npm install @sentry/nextjs
```

### 3. Custom Analytics
```typescript
// lib/analytics.ts
export function trackEvent(event: string, data?: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, data);
  }
}

// Usage
trackEvent('lead_captured', { projectType: 'ecommerce' });
trackEvent('chatbot_opened');
trackEvent('booking_clicked');
```

---

## Testing

### Unit Tests (Vitest)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### E2E Tests (Playwright)
```bash
npm install -D @playwright/test
```

### Test Checklist
- [ ] All API routes return correct responses
- [ ] Rate limiting works
- [ ] Email sending works
- [ ] Database operations work
- [ ] Form validation works
- [ ] Chatbot responds correctly
- [ ] GitHub API integration works
- [ ] Mobile responsive
- [ ] Accessibility (WCAG AA)
- [ ] Performance (Lighthouse 90+)

---

## Launch Checklist

- [ ] Domain configured and SSL active
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Email domain verified
- [ ] Cal.com booking link works
- [ ] Chatbot tested with real Gemini API
- [ ] Lead capture tested end-to-end
- [ ] GitHub repos fetching correctly
- [ ] Demo projects deployed
- [ ] Analytics tracking active
- [ ] SEO meta tags complete
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] 404 page styled
- [ ] Error boundaries in place
- [ ] Loading states polished
- [ ] Mobile tested on real devices
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Accessibility tested
- [ ] Social media cards working (og:image)
