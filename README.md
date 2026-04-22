# AI Dev Danyal Portfolio

A cyberpunk-themed portfolio website for an AI-driven developer specializing in e-commerce, SaaS, and AI automation.

## 🚀 Features

- **Cyberpunk Design System** - Neon colors, glitch effects, holographic UI
- **AI Chatbot** - Google Gemini-powered assistant for lead capture
- **GitHub Integration** - Automatically fetch and display repositories
- **Responsive Design** - Mobile-first approach with smooth animations
- **Lead Capture** - Email collection with notifications
- **Projects Showcase** - Featured demos (CYBERSTORE, WORKFLOW_AI)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **AI:** Google Gemini API
- **Database:** Vercel Postgres + Drizzle ORM
- **Email:** Resend
- **Deployment:** Vercel

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
# Required for chatbot
GEMINI_API_KEY=your-gemini-api-key

# Optional - for lead capture
DATABASE_URL=postgres://...
RESEND_API_KEY=re_...
NOTIFICATION_EMAIL=your-email@example.com

# Optional - for GitHub integration
GITHUB_USERNAME=yourusername
GITHUB_TOKEN=ghp_...

# Optional - for booking
NEXT_PUBLIC_CAL_LINK=https://cal.com/aidevdanyal/30min
```

## 🗄️ Database Setup

If using Vercel Postgres:

```bash
# Generate migrations
npx drizzle-kit generate:pg

# Push to database
npx drizzle-kit push:pg
```

## 📁 Project Structure

```
├── app/
│   ├── api/          # API routes (chat, leads, github)
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Homepage
│   └── globals.css   # Global styles
├── components/
│   ├── ui/           # Reusable UI components
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   ├── ChatWidget.tsx
│   ├── Navigation.tsx
│   └── Footer.tsx
├── lib/
│   └── db/           # Database schema and client
├── docs/             # Project documentation
└── public/           # Static assets
```

## 🎨 Design System

- **Colors:** Neon cyan, magenta, purple
- **Fonts:** Space Grotesk, JetBrains Mono, Orbitron
- **Effects:** Glitch, neon glow, scanlines, glass morphism

## 🚢 Deployment

Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📝 To-Do

- [ ] Build CYBERSTORE e-commerce demo
- [ ] Build WORKFLOW_AI SaaS demo
- [ ] Add more animations and effects
- [ ] Implement rate limiting for APIs
- [ ] Add analytics tracking
- [ ] SEO optimization
- [ ] Performance optimization

## 📄 License

MIT License - feel free to use this as a template for your own portfolio!

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

## 📧 Contact

- Email: contact@aidevdanyal.com
- Website: [aidevdanyal.com](https://aidevdanyal.com)
- GitHub: [@yourusername](https://github.com/yourusername)

---

Built with ❤️ and AI by Danyal
