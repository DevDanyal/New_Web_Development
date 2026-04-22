# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Configure Environment Variables

Create `.env.local` in the project root:

```bash
# Minimum required for chatbot to work
GEMINI_API_KEY=your-gemini-api-key-here

# Optional but recommended
GITHUB_USERNAME=yourusername
NEXT_PUBLIC_CAL_LINK=https://cal.com/yourusername/30min

# Optional - for production features
DATABASE_URL=postgres://...
RESEND_API_KEY=re_...
NOTIFICATION_EMAIL=your-email@example.com
```

### Step 2: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Paste it in `.env.local` as `GEMINI_API_KEY=...`

### Step 3: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 - Your portfolio is live! 🎉

---

## ✅ What You Can Do Right Now

### Without Any Configuration:
- ✅ View the full homepage
- ✅ Navigate between sections
- ✅ See animations and effects
- ✅ Test responsive design
- ✅ View UI components

### With Gemini API Key:
- ✅ Chat with NEXUS-AI
- ✅ Test lead qualification flow
- ✅ See AI responses

### With GitHub Username:
- ✅ Display your real repositories
- ✅ Filter projects by topic
- ✅ Show stars and languages

### With Database (Optional):
- ✅ Store leads permanently
- ✅ Track conversations
- ✅ Manage contacts

### With Resend (Optional):
- ✅ Send email notifications
- ✅ Auto-reply to leads
- ✅ Get notified of new contacts

---

## 🎨 Customization Guide

### 1. Update Personal Info

**File:** `components/Footer.tsx`
```tsx
// Update social links
<a href="https://github.com/YOUR_USERNAME">
<a href="https://linkedin.com/in/YOUR_PROFILE">
<a href="https://twitter.com/YOUR_HANDLE">
```

**File:** `app/layout.tsx`
```tsx
// Update meta tags
title: "Your Name | Your Title"
description: "Your description"
```

### 2. Customize Colors

**File:** `tailwind.config.ts`
```ts
colors: {
  'neon-cyan': '#00f0ff',    // Change to your color
  'neon-magenta': '#ff00ff', // Change to your color
  'neon-purple': '#b000ff',  // Change to your color
}
```

### 3. Update Content

**File:** `components/Hero.tsx`
- Change headline text
- Update subheadline
- Modify CTA button text

**File:** `components/About.tsx`
- Edit capability descriptions
- Update tech stack tags
- Change icons

**File:** `components/Contact.tsx`
- Update email address
- Change availability status
- Modify CTA text

### 4. Add Your Projects

**File:** `components/Projects.tsx`
- Update featured project descriptions
- Add live demo links
- Change project images

---

## 🐛 Troubleshooting

### Chatbot Not Working?
- ✅ Check `.env.local` has `GEMINI_API_KEY`
- ✅ Restart dev server after adding env vars
- ✅ Check browser console for errors
- ✅ Verify API key is valid

### GitHub Projects Not Showing?
- ✅ Add `GITHUB_USERNAME` to `.env.local`
- ✅ Make sure repos are public
- ✅ Check API rate limits (60 req/hour without token)
- ✅ Add `GITHUB_TOKEN` for higher limits

### Styles Not Loading?
- ✅ Run `npm install` again
- ✅ Delete `.next` folder and restart
- ✅ Check `tailwind.config.ts` is correct

### Build Errors?
- ✅ Check all imports are correct
- ✅ Verify TypeScript types
- ✅ Run `npm run build` to see errors
- ✅ Check Node.js version (18+)

---

## 📱 Testing Checklist

### Desktop (1920x1080)
- [ ] All sections visible
- [ ] Animations smooth
- [ ] Chatbot opens/closes
- [ ] Navigation works
- [ ] Links clickable

### Tablet (768x1024)
- [ ] Layout adjusts
- [ ] Cards stack properly
- [ ] Text readable
- [ ] Buttons accessible

### Mobile (375x667)
- [ ] Mobile menu works
- [ ] Content fits screen
- [ ] Chatbot usable
- [ ] No horizontal scroll
- [ ] Touch targets 44px+

### Browsers
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 🚢 Deployment to Vercel

### Option 1: GitHub + Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Add environment variables
   - Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add GEMINI_API_KEY
vercel env add GITHUB_USERNAME

# Deploy to production
vercel --prod
```

### Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:
- `GEMINI_API_KEY`
- `GITHUB_USERNAME`
- `GITHUB_TOKEN` (optional)
- `DATABASE_URL` (if using database)
- `RESEND_API_KEY` (if using email)
- `NOTIFICATION_EMAIL`
- `NEXT_PUBLIC_CAL_LINK`

---

## 🎯 Next Steps

### Immediate (Today):
1. Add your Gemini API key
2. Test the chatbot
3. Update personal info
4. Customize colors/content

### Short-term (This Week):
1. Add your GitHub username
2. Deploy to Vercel
3. Configure custom domain
4. Test on real devices

### Long-term (Next Month):
1. Build CYBERSTORE demo
2. Build WORKFLOW_AI demo
3. Add blog section
4. Collect testimonials

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## 💬 Need Help?

- Check `PROJECT_STATUS.md` for detailed status
- Review `docs/` folder for full documentation
- Check browser console for errors
- Review API responses in Network tab

---

**You're all set! Start customizing and make it yours! 🚀**
