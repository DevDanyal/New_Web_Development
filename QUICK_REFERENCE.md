# Quick Reference - Adding Your Projects

## 📍 File Location
```
components/Projects.tsx (line ~27)
```

## 📝 Template to Copy

```typescript
{
  title: 'YOUR PROJECT NAME',
  description: 'Brief description of what your project does (1-2 sentences)',
  image: '/images/your-image.jpg',
  tags: ['Tech1', 'Tech2', 'Tech3'],
  demoUrl: 'https://your-live-demo.com',
  codeUrl: 'https://github.com/yourusername/repo',
  color: 'cyan', // or 'magenta' or 'purple'
}
```

## 🎨 Color Options

- **cyan** - Blue/cyan glow (for tech/web projects)
- **magenta** - Pink/magenta glow (for creative/design projects)  
- **purple** - Purple glow (for AI/data projects)

## 📸 Adding Images

1. Create folder: `public/images/`
2. Add your images: `project1.jpg`, `project2.jpg`, etc.
3. Reference in code: `image: '/images/project1.jpg'`

## ✅ What's Fixed

1. **"Talk to My AI" button** - Now opens chatbot ✅
2. **Projects section** - Now customizable with your projects ✅

## 🚀 Next Steps

1. Open http://localhost:3000
2. Test the "Talk to My AI" button
3. Add your projects to `components/Projects.tsx`
4. Add project images to `public/images/`
5. Refresh and see your projects!

---

**Need help?** Check `HOW_TO_ADD_PROJECTS.md` for detailed guide.
