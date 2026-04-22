import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'magenta' | 'purple';
}

export default function Card({ children, className = '', glowColor = 'cyan' }: CardProps) {
  const glowClass = glowColor === 'cyan' ? 'hover:border-neon-cyan/50' :
                    glowColor === 'magenta' ? 'hover:border-neon-magenta/50' :
                    'hover:border-neon-purple/50';

  return (
    <div className={`glass-card p-6 rounded-lg transition-all duration-300 hover:scale-105 ${glowClass} ${className}`}>
      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${
        glowColor === 'cyan' ? 'border-neon-cyan' :
        glowColor === 'magenta' ? 'border-neon-magenta' :
        'border-neon-purple'
      }`} />
      <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${
        glowColor === 'cyan' ? 'border-neon-cyan' :
        glowColor === 'magenta' ? 'border-neon-magenta' :
        'border-neon-purple'
      }`} />
      <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${
        glowColor === 'cyan' ? 'border-neon-cyan' :
        glowColor === 'magenta' ? 'border-neon-magenta' :
        'border-neon-purple'
      }`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${
        glowColor === 'cyan' ? 'border-neon-cyan' :
        glowColor === 'magenta' ? 'border-neon-magenta' :
        'border-neon-purple'
      }`} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
