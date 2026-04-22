import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'neon-cyan': '#00f0ff',
        'neon-magenta': '#ff00ff',
        'neon-purple': '#b000ff',
        'electric-blue': '#0080ff',
        'acid-green': '#00ff41',

        // Background colors
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#12121a',
        'bg-tertiary': '#1a1a28',
        'bg-card': 'rgba(18, 18, 26, 0.8)',
        'bg-glass': 'rgba(255, 255, 255, 0.05)',

        // Text colors
        'text-primary': '#ffffff',
        'text-secondary': '#b4b4c8',
        'text-muted': '#6e6e8c',
        'text-neon': '#00f0ff',
      },
      fontFamily: {
        primary: ['var(--font-space-grotesk)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        display: ['var(--font-orbitron)', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.2)',
        'glow-magenta': '0 0 20px rgba(255, 0, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2)',
        'glow-purple': '0 0 20px rgba(176, 0, 255, 0.4), 0 0 40px rgba(176, 0, 255, 0.2)',
      },
      animation: {
        'glitch': 'glitch 3s infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '91%': { transform: 'translate(-2px, 2px)' },
          '92%': { transform: 'translate(2px, -2px)' },
          '93%': { transform: 'translate(-2px, 2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
