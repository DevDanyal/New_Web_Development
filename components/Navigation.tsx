'use client';

import Link from 'next/link';
import { useState } from 'react';
import GlitchText from './ui/GlitchText';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'HOME', href: '#' },
    { label: 'ABOUT', href: '#about' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-bg-primary/80 backdrop-blur-md border-b border-neon-cyan/20 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-display font-bold text-neon-cyan hover:neon-glow-cyan transition-all">
          <GlitchText text="AI//DEV//DANYAL" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 font-mono">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-text-secondary hover:text-neon-cyan transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-neon-cyan focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-bg-secondary border-t border-neon-cyan/20">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4 font-mono">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-neon-cyan transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
