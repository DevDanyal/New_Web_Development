import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-neon-cyan transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
      )}
    </button>
  );
}
