# Design System - Cyberpunk Aesthetic

## Color Palette

### Primary Colors
```css
--neon-cyan: #00f0ff
--neon-magenta: #ff00ff
--neon-purple: #b000ff
--electric-blue: #0080ff
--acid-green: #00ff41
```

### Background Colors
```css
--bg-primary: #0a0a0f
--bg-secondary: #12121a
--bg-tertiary: #1a1a28
--bg-card: rgba(18, 18, 26, 0.8)
--bg-glass: rgba(255, 255, 255, 0.05)
```

### Text Colors
```css
--text-primary: #ffffff
--text-secondary: #b4b4c8
--text-muted: #6e6e8c
--text-neon: #00f0ff
```

### Accent Colors
```css
--glow-cyan: rgba(0, 240, 255, 0.5)
--glow-magenta: rgba(255, 0, 255, 0.5)
--glow-purple: rgba(176, 0, 255, 0.5)
```

## Typography

### Font Families
```css
--font-primary: 'Space Grotesk', sans-serif
--font-mono: 'JetBrains Mono', monospace
--font-display: 'Orbitron', sans-serif
```

### Font Sizes
```css
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)
--text-4xl: 2.25rem (36px)
--text-5xl: 3rem (48px)
--text-6xl: 3.75rem (60px)
--text-7xl: 4.5rem (72px)
```

### Font Weights
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

## Effects

### Neon Glow
```css
.neon-glow-cyan {
  text-shadow: 
    0 0 10px rgba(0, 240, 255, 0.8),
    0 0 20px rgba(0, 240, 255, 0.6),
    0 0 30px rgba(0, 240, 255, 0.4);
}

.neon-glow-magenta {
  text-shadow: 
    0 0 10px rgba(255, 0, 255, 0.8),
    0 0 20px rgba(255, 0, 255, 0.6),
    0 0 30px rgba(255, 0, 255, 0.4);
}

.box-glow-cyan {
  box-shadow: 
    0 0 20px rgba(0, 240, 255, 0.4),
    0 0 40px rgba(0, 240, 255, 0.2),
    inset 0 0 20px rgba(0, 240, 255, 0.1);
}
```

### Glitch Effect
```css
.glitch {
  position: relative;
  animation: glitch 3s infinite;
}

@keyframes glitch {
  0%, 90%, 100% { transform: translate(0); }
  91% { transform: translate(-2px, 2px); }
  92% { transform: translate(2px, -2px); }
  93% { transform: translate(-2px, 2px); }
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  color: #00f0ff;
  animation: glitch-1 2.5s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch::after {
  color: #ff00ff;
  animation: glitch-2 2.5s infinite;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}
```

### Scanline Effect
```css
.scanlines {
  position: relative;
  overflow: hidden;
}

.scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    transparent 50%,
    rgba(0, 240, 255, 0.03) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  animation: scanline 8s linear infinite;
}

@keyframes scanline {
  0% { transform: translateY(0); }
  100% { transform: translateY(100%); }
}
```

### Holographic Glass
```css
.glass-card {
  background: rgba(18, 18, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 240, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-card:hover {
  border-color: rgba(0, 240, 255, 0.5);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(0, 240, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Grid Overlay
```css
.cyber-grid {
  background-image: 
    linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

## Components

### Buttons

**Primary Button:**
```tsx
<button className="
  px-6 py-3 
  bg-transparent 
  border-2 border-neon-cyan 
  text-neon-cyan 
  font-mono font-semibold 
  uppercase tracking-wider
  relative overflow-hidden
  transition-all duration-300
  hover:text-black
  hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]
  group
">
  <span className="relative z-10">Execute</span>
  <span className="
    absolute inset-0 
    bg-neon-cyan 
    transform -translate-x-full 
    group-hover:translate-x-0 
    transition-transform duration-300
  "></span>
</button>
```

**Secondary Button:**
```tsx
<button className="
  px-6 py-3 
  bg-gradient-to-r from-neon-magenta to-neon-purple
  text-white 
  font-mono font-semibold 
  uppercase tracking-wider
  relative overflow-hidden
  transition-all duration-300
  hover:shadow-[0_0_30px_rgba(255,0,255,0.6)]
  before:absolute before:inset-0 
  before:bg-white before:opacity-0 
  hover:before:opacity-10
">
  Initialize
</button>
```

### Input Fields
```tsx
<input className="
  w-full px-4 py-3
  bg-bg-secondary
  border border-neon-cyan/30
  text-text-primary
  font-mono
  placeholder:text-text-muted
  focus:border-neon-cyan
  focus:outline-none
  focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]
  transition-all duration-300
" />
```

### Cards
```tsx
<div className="
  p-6
  bg-bg-card
  backdrop-blur-lg
  border border-neon-cyan/20
  rounded-lg
  relative
  overflow-hidden
  group
  hover:border-neon-cyan/50
  transition-all duration-300
">
  {/* Corner accents */}
  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan"></div>
  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan"></div>
  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan"></div>
  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan"></div>
  
  {/* Content */}
  <div className="relative z-10">
    {children}
  </div>
</div>
```

### Navigation
```tsx
<nav className="
  fixed top-0 w-full
  bg-bg-primary/80
  backdrop-blur-md
  border-b border-neon-cyan/20
  z-50
">
  <div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <div className="text-2xl font-display font-bold text-neon-cyan glitch" data-text="AI//DEV//DANYAL">
      AI//DEV//DANYAL
    </div>
    <div className="flex gap-8 font-mono">
      <a className="text-text-secondary hover:text-neon-cyan transition-colors">PROJECTS</a>
      <a className="text-text-secondary hover:text-neon-cyan transition-colors">SKILLS</a>
      <a className="text-text-secondary hover:text-neon-cyan transition-colors">CONTACT</a>
    </div>
  </div>
</nav>
```

## Animations

### Page Transitions
```tsx
// Framer Motion variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const pageTransition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96]
}
```

### Scroll Animations
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}
```

### Hover Effects
```tsx
const cardHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.3 }
  }
}
```

## Responsive Breakpoints
```css
--screen-sm: 640px
--screen-md: 768px
--screen-lg: 1024px
--screen-xl: 1280px
--screen-2xl: 1536px
```

## Accessibility

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  :root {
    --neon-cyan: #00ffff;
    --neon-magenta: #ff00ff;
    --text-primary: #ffffff;
    --bg-primary: #000000;
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus States
```css
.focus-visible:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 4px;
}
```
