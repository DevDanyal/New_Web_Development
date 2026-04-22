# AI Dev Danyal Portfolio

## Project Overview
Full cyberpunk portfolio for AI-driven developer specializing in e-commerce, SaaS, and AI automation.

**Domain:** aidevdanyal.com  
**Status:** Planning → Implementation  
**Launch:** May 20, 2026 (4 weeks)  
**Started:** April 22, 2026

## Core Features
- Cyberpunk aesthetic (neon cyan/magenta, glitch effects, holographic UI)
- AI chatbot (Google Gemini API) - central feature, 24/7 lead capture
- Email collection + Cal.com booking integration
- GitHub projects showcase + 2 live demos
- Text logo: "AI//DEV//DANYAL"

## Tech Stack
**Frontend:** Next.js 14, TypeScript, Tailwind CSS  
**Animation:** Framer Motion, Three.js, GSAP  
**AI:** Google Gemini 1.5 Pro (free tier: 15 req/min, 1500/day)  
**Database:** Vercel Postgres + Drizzle ORM  
**Email:** Resend (3k/month free)  
**Booking:** Cal.com  
**Deploy:** Vercel

## Documentation
See `/docs` for detailed specs:
- `design-system.md` - Colors, typography, effects, components
- `site-structure.md` - Page layouts, sections, navigation, SEO
- `chatbot-implementation.md` - Gemini integration, lead flows, rate limiting
- `demo-projects.md` - CYBERSTORE (e-commerce) + WORKFLOW_AI (SaaS) specs
- `technical-architecture.md` - APIs, database schema, deployment
- `content-copy.md` - Messaging, voice, all site copy
- `development-roadmap.md` - 4-week timeline, tasks, milestones

## Quick Reference
**Building hero?** → `site-structure.md` + `design-system.md`  
**Implementing chatbot?** → `chatbot-implementation.md` + `technical-architecture.md`  
**Writing copy?** → `content-copy.md`  
**Planning work?** → `development-roadmap.md`

## Critical Notes
- Optimize animations for mobile (reduce particles, simplify 3D)
- Rate limit Gemini API (cache conversations, fallback messages)
- Accessibility: high contrast mode, keyboard nav, reduced motion
- Performance target: Lighthouse 90+ all metrics
- Lead storage: Vercel Postgres with email notifications via Resend

## Project Structure
```
/app - Next.js pages
/components - React components
/lib - Utilities, API clients, database
/docs - Project documentation
/public - Static assets
```
