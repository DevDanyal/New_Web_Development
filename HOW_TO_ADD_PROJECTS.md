# How to Add Your Own Projects

## ✅ Fixed Issues

1. **"Talk to My AI" button** - Now opens the chatbot instead of scrolling
2. **Projects section** - Now supports custom projects with images and URLs

---

## 📸 Adding Your Projects

### Step 1: Add Project Images

1. Create images folder (if not exists):
   ```bash
   mkdir public/images
   ```

2. Add your project images to `public/images/`:
   - `project1.jpg`
   - `project2.jpg`
   - etc.

### Step 2: Edit Projects Component

Open `components/Projects.tsx` and find this section (around line 27):

```typescript
// ⭐ ADD YOUR CUSTOM PROJECTS HERE ⭐
const customProjects: CustomProject[] = [
  {
    title: 'PROJECT 1',
    description: 'Your project description here.',
    image: '/images/project1.jpg',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    demoUrl: 'https://your-demo-url.com',
    codeUrl: 'https://github.com/yourusername/project1',
    color: 'cyan',
  },
  // Add more projects...
];
```

### Step 3: Replace with Your Projects

Example:

```typescript
const customProjects: CustomProject[] = [
  {
    title: 'E-COMMERCE STORE',
    description: 'Full-featured online store with payment integration and admin dashboard.',
    image: '/images/ecommerce-store.jpg',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
    demoUrl: 'https://mystore.com',
    codeUrl: 'https://github.com/yourusername/ecommerce',
    color: 'cyan',
  },
  {
    title: 'AI CHATBOT',
    description: 'Intelligent chatbot with natural language processing and context awareness.',
    image: '/images/chatbot.jpg',
    tags: ['Python', 'OpenAI', 'FastAPI'],
    demoUrl: 'https://mychatbot.com',
    codeUrl: 'https://github.com/yourusername/chatbot',
    color: 'magenta',
  },
  {
    title: 'TASK MANAGER',
    description: 'Collaborative task management app with real-time updates.',
    image: '/images/taskmanager.jpg',
    tags: ['React', 'Node.js', 'Socket.io'],
    demoUrl: 'https://mytasks.com',
    codeUrl: 'https://github.com/yourusername/tasks',
    color: 'purple',
  },
];
```

---

## 🎨 Project Options

### Required Fields:
- `title` - Project name
- `description` - Brief description
- `image` - Path to image in `/public/images/`
- `tags` - Array of tech stack tags
- `color` - 'cyan', 'magenta', or 'purple'

### Optional Fields:
- `demoUrl` - Live demo link (if available)
- `codeUrl` - GitHub repository link (if available)

### Colors:
- `cyan` - Blue/cyan glow effect
- `magenta` - Pink/magenta glow effect
- `purple` - Purple glow effect

---

## 🖼️ Image Guidelines

**Recommended Image Specs:**
- **Size:** 1200x675px (16:9 aspect ratio)
- **Format:** JPG or PNG
- **File size:** Under 500KB (optimize for web)
- **Content:** Screenshot or mockup of your project

**Free Image Tools:**
- [TinyPNG](https://tinypng.com/) - Compress images
- [Canva](https://canva.com) - Create mockups
- [Figma](https://figma.com) - Design screenshots

---

## 📝 Example: Complete Project Entry

```typescript
{
  title: 'CYBERSTORE',
  description: 'AI-powered e-commerce platform with smart recommendations, real-time inventory, and seamless checkout experience.',
  image: '/images/cyberstore.jpg',
  tags: ['Next.js 14', 'Stripe', 'Gemini API', 'PostgreSQL'],
  demoUrl: 'https://cyberstore.aidevdanyal.com',
  codeUrl: 'https://github.com/yourusername/cyberstore',
  color: 'cyan',
}
```

---

## 🔗 Without Images

If you don't have images yet, the component will show an emoji placeholder:

```typescript
{
  title: 'MY PROJECT',
  description: 'Project description here.',
  image: '', // Leave empty for emoji placeholder
  tags: ['React', 'Node.js'],
  demoUrl: 'https://myproject.com',
  codeUrl: 'https://github.com/yourusername/project',
  color: 'cyan',
}
```

---

## ✅ Testing Your Changes

1. Save `components/Projects.tsx`
2. Refresh http://localhost:3000
3. Scroll to Projects section
4. Check that your projects appear
5. Test the demo and code links

---

## 🎯 Quick Checklist

- [ ] Add project images to `public/images/`
- [ ] Update `customProjects` array in `Projects.tsx`
- [ ] Add title, description, and tags
- [ ] Add demo and code URLs
- [ ] Choose a color (cyan, magenta, purple)
- [ ] Test links work correctly
- [ ] Check mobile responsive view

---

## 💡 Pro Tips

1. **Use high-quality images** - First impressions matter
2. **Keep descriptions concise** - 1-2 sentences max
3. **Highlight key tech** - Show your best skills in tags
4. **Test all links** - Make sure demos and repos work
5. **Add 2-4 projects** - Quality over quantity
6. **Update regularly** - Keep your best work featured

---

## 🐛 Troubleshooting

**Images not showing?**
- Check file path is correct: `/images/filename.jpg`
- Verify image exists in `public/images/`
- Check file extension matches (jpg vs jpeg)
- Try refreshing the page

**Links not working?**
- Ensure URLs start with `https://`
- Test links in a new tab
- Check for typos in URLs

**Layout broken?**
- Check all commas in the array
- Verify quotes are closed properly
- Make sure color is 'cyan', 'magenta', or 'purple'

---

**Your projects are now ready to showcase! 🚀**
