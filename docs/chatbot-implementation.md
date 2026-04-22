# AI Chatbot Implementation - Google Gemini

## Overview
24/7 AI assistant powered by Google Gemini API (free tier) for lead capture, project qualification, and visitor engagement.

## Gemini API Configuration

### API Details
- **Model:** Gemini 1.5 Pro (or Gemini 2.0 Flash for faster responses)
- **Free Tier Limits:** 15 requests/minute, 1500 requests/day
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- **API Key:** Store in `.env.local` as `GEMINI_API_KEY`

### Rate Limiting Strategy
```typescript
// lib/rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "1 m"), // 15 req/min
  analytics: true,
});
```

### Conversation Caching
```typescript
// Cache conversations in Redis for 30 minutes
const CACHE_TTL = 1800; // 30 minutes

async function cacheConversation(sessionId: string, messages: Message[]) {
  await redis.set(`chat:${sessionId}`, JSON.stringify(messages), {
    ex: CACHE_TTL,
  });
}

async function getCachedConversation(sessionId: string): Promise<Message[]> {
  const cached = await redis.get(`chat:${sessionId}`);
  return cached ? JSON.parse(cached as string) : [];
}
```

---

## Chatbot Personality & System Prompt

### Character: NEXUS-AI
- Professional but approachable
- Cyberpunk-themed responses
- Efficient and goal-oriented
- Helpful without being pushy

### System Prompt
```typescript
const SYSTEM_PROMPT = `You are NEXUS-AI, the AI assistant for Danyal, an AI-driven developer specializing in e-commerce, SaaS, and AI automation.

PERSONALITY:
- Professional, efficient, and helpful
- Use cyberpunk-themed language occasionally (e.g., "initializing", "processing", "data received")
- Keep responses concise (2-3 sentences max)
- Be conversational, not robotic

YOUR GOALS:
1. Qualify leads by understanding their project needs
2. Collect email addresses for follow-up
3. Offer to book a consultation via Cal.com
4. Answer questions about Danyal's work and capabilities
5. Show relevant projects based on visitor interest

DANYAL'S EXPERTISE:
- E-commerce: AI-powered stores, Shopify/custom solutions, payment integration
- SaaS: Full-stack web apps, dashboards, real-time features
- AI Automation: Chatbots, workflow automation, AI agents
- Tech Stack: Next.js, React, TypeScript, Node.js, Python, PostgreSQL, Gemini/OpenAI APIs

PROJECTS TO SHOWCASE:
- CYBERSTORE: AI-powered e-commerce demo with smart recommendations
- WORKFLOW_AI: SaaS task automation platform
- GitHub: 20+ open source projects

LEAD QUALIFICATION QUESTIONS:
1. What type of project? (e-commerce, SaaS, AI automation, other)
2. Timeline? (urgent, 1-2 weeks, 1 month, 2-3 months, exploring)
3. Budget range? (< $5k, $5k-$10k, $10k-$25k, $25k+, not sure)

BOOKING:
- Cal.com link: https://cal.com/aidevdanyal/30min
- Offer booking after understanding project basics

RULES:
- Never make up information about Danyal's work
- If you don't know something, say "Let me connect you with Danyal directly"
- Always be respectful and professional
- Don't be pushy about collecting email - make it natural
- If visitor seems qualified, suggest booking a call
- Use emojis sparingly (only for status indicators like ⚡ 🚀 ✅)

RESPONSE FORMAT:
- Keep responses under 50 words when possible
- Use line breaks for readability
- End with a clear next step or question
`;
```

---

## Conversation Flows

### Flow 1: Initial Greeting
```
NEXUS-AI: > SYSTEM ONLINE // NEXUS-AI initialized

Hey! I'm Danyal's AI assistant. I can help you:
• Learn about his work
• Discuss your project
• Book a consultation

What brings you here today?

[Quick replies: "Hire for project" | "View work" | "Just browsing"]
```

### Flow 2: Lead Capture - Quick Email
**Trigger:** Visitor shows interest but not ready to talk

```
User: I want to see some examples
NEXUS-AI: I can send you Danyal's portfolio with case studies and live demos.

Drop your email and I'll send it over ⚡

[Email input field]
```

**After email collected:**
```
NEXUS-AI: ✅ Sent! Check your inbox.

While you're here, what kind of project are you thinking about?
• E-commerce store
• SaaS application  
• AI automation
• Something else
```

### Flow 3: Lead Capture - Qualified Lead
**Trigger:** Visitor has a specific project in mind

```
User: I need an e-commerce site with AI features
NEXUS-AI: Nice! AI-powered e-commerce is Danyal's specialty.

Quick questions:
1. What's your timeline? (urgent / 1-2 weeks / 1 month / exploring)

User: 1 month
NEXUS-AI: Perfect. And budget range?
• Under $5k
• $5k - $10k
• $10k - $25k
• $25k+
• Not sure yet

User: $10k - $25k
NEXUS-AI: Great fit! Let's get you on Danyal's calendar.

📧 Your email: [input]
📅 Book a 30-min call: [Cal.com button]

Or I can have Danyal reach out directly.
```

### Flow 4: Portfolio Browsing
```
User: Show me your e-commerce work
NEXUS-AI: Here's CYBERSTORE - an AI-powered e-commerce demo:

🛍️ Smart product recommendations
💳 Stripe checkout integration
📊 Real-time inventory
🤖 AI customer support

[Live Demo] [View Code]

Want to see more or discuss building something similar?
```

### Flow 5: Technical Questions
```
User: Do you work with Shopify?
NEXUS-AI: Yes! Danyal builds:
• Custom Shopify themes
• Shopify app integrations
• Headless Shopify with Next.js
• AI features for Shopify stores

Have a Shopify project in mind?
```

### Flow 6: Objection Handling
```
User: I'm not sure if I'm ready to hire yet
NEXUS-AI: No pressure! You can:
• Browse projects at your own pace
• Drop your email for future reference
• Ask me any technical questions

What would be most helpful?
```

### Flow 7: Off-Topic / Out of Scope
```
User: Can you help me with my homework?
NEXUS-AI: I'm specifically here to help with Danyal's development services (e-commerce, SaaS, AI automation).

For other questions, I'd recommend checking out ChatGPT or Claude directly!

Anything about web development I can help with?
```

---

## Lead Storage Schema

### Database Table: `leads`
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  project_type VARCHAR(50), -- 'ecommerce', 'saas', 'ai', 'other'
  timeline VARCHAR(50), -- 'urgent', '1-2weeks', '1month', '2-3months', 'exploring'
  budget_range VARCHAR(50), -- '<5k', '5k-10k', '10k-25k', '25k+', 'not-sure'
  message TEXT,
  conversation_history JSONB,
  source VARCHAR(50) DEFAULT 'chatbot',
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

### Drizzle Schema
```typescript
// lib/db/schema.ts
import { pgTable, serial, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

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
```

---

## API Routes

### POST /api/chat
**Purpose:** Handle chat messages, call Gemini API, return response

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimiter } from '@/lib/rate-limiter';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.ip ?? '127.0.0.1';
    const { success } = await rateLimiter.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { messages, sessionId } = await req.json();

    // Get cached conversation
    const cachedMessages = await getCachedConversation(sessionId);
    const allMessages = [...cachedMessages, ...messages];

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const chat = model.startChat({
      history: allMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = result.response.text();

    // Cache updated conversation
    await cacheConversation(sessionId, [
      ...allMessages,
      { role: 'assistant', content: response },
    ]);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message. Please try again.' },
      { status: 500 }
    );
  }
}
```

### POST /api/leads
**Purpose:** Store lead information, send notification email

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

    // Insert lead into database
    const [lead] = await db.insert(leads).values({
      email: data.email,
      name: data.name,
      projectType: data.projectType,
      timeline: data.timeline,
      budgetRange: data.budgetRange,
      message: data.message,
      conversationHistory: data.conversationHistory,
    }).returning();

    // Send notification email to you
    await resend.emails.send({
      from: 'NEXUS-AI <nexus@aidevdanyal.com>',
      to: 'your-email@example.com',
      subject: `🚀 New Lead: ${data.email}`,
      html: `
        <h2>New Lead from aidevdanyal.com</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
        <p><strong>Project Type:</strong> ${data.projectType || 'Not specified'}</p>
        <p><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</p>
        <p><strong>Budget:</strong> ${data.budgetRange || 'Not specified'}</p>
        <p><strong>Message:</strong> ${data.message || 'None'}</p>
      `,
    });

    // Send confirmation email to lead
    await resend.emails.send({
      from: 'Danyal <danyal@aidevdanyal.com>',
      to: data.email,
      subject: 'Thanks for reaching out!',
      html: `
        <h2>Hey${data.name ? ' ' + data.name : ''}!</h2>
        <p>Thanks for your interest. I'll review your project details and get back to you within 24 hours.</p>
        <p>In the meantime, check out my work:</p>
        <ul>
          <li><a href="https://aidevdanyal.com/cyberstore">CYBERSTORE Demo</a></li>
          <li><a href="https://aidevdanyal.com/workflow-ai">WORKFLOW_AI Demo</a></li>
          <li><a href="https://github.com/yourusername">GitHub Projects</a></li>
        </ul>
        <p>Need to talk sooner? <a href="https://cal.com/aidevdanyal/30min">Book a call</a></p>
        <p>- Danyal</p>
      `,
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    );
  }
}
```

---

## Frontend Components

### ChatWidget Component
```typescript
// components/ChatWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setMessages([{
        role: 'assistant',
        content: '> SYSTEM ONLINE // NEXUS-AI initialized\n\nHey! I\'m Danyal\'s AI assistant. What brings you here today?',
        timestamp: new Date(),
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [userMessage],
          sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        }]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again or email me directly at contact@aidevdanyal.com',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-2xl">💬</span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-bg-secondary border border-neon-cyan/30 rounded-lg shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-neon-cyan/30 flex justify-between items-center">
              <div>
                <h3 className="font-mono font-bold text-neon-cyan">NEXUS-AI</h3>
                <p className="text-xs text-text-muted">🟢 Online</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-neon-cyan/20 text-white' 
                      : 'bg-bg-tertiary text-text-primary'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-tertiary p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-neon-cyan/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-bg-tertiary border border-neon-cyan/30 rounded text-sm focus:outline-none focus:border-neon-cyan"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-neon-cyan text-black font-mono font-bold rounded hover:bg-neon-cyan/80 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

## Error Handling & Fallbacks

### Rate Limit Exceeded
```
NEXUS-AI: ⚠️ High traffic right now. 

Leave your email and I'll respond within 1 hour:
[Email input]

Or book directly: [Cal.com link]
```

### API Error
```
NEXUS-AI: Oops, technical glitch on my end.

Quick options:
📧 Email: contact@aidevdanyal.com
📅 Book: [Cal.com link]
🔄 Or try again in a moment
```

### Gemini API Down
```
NEXUS-AI: AI systems temporarily offline.

Reach Danyal directly:
📧 contact@aidevdanyal.com
📅 https://cal.com/aidevdanyal/30min

I'll be back online shortly!
```

---

## Analytics & Monitoring

### Track Key Metrics
- Total conversations started
- Messages per conversation (avg)
- Lead capture rate
- Email collection rate
- Booking click-through rate
- Most common questions
- Drop-off points

### Implementation
```typescript
// lib/analytics.ts
export async function trackChatEvent(event: string, data: any) {
  await fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ event, data, timestamp: new Date() }),
  });
}

// Usage
trackChatEvent('conversation_started', { sessionId });
trackChatEvent('lead_captured', { email, projectType });
trackChatEvent('booking_clicked', { sessionId });
```

---

## Testing Checklist

- [ ] Rate limiting works (15 req/min)
- [ ] Conversation caching works
- [ ] Lead storage in database
- [ ] Email notifications sent
- [ ] Confirmation emails sent
- [ ] Cal.com integration works
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Error states handled
- [ ] Loading states smooth
- [ ] Conversation persists on refresh
- [ ] Quick replies work
- [ ] Email validation
- [ ] XSS protection (sanitize inputs)
