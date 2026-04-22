'use client';

import React, { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`relative inline-block ${isGlitching ? 'animate-glitch' : ''} ${className}`}
      data-text={text}
    >
      {text}
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-neon-cyan opacity-70"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-neon-magenta opacity-70"
            style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}
