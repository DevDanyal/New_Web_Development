import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-mono text-text-secondary mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`input-cyber ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400 font-mono">⚠️ {error}</p>
      )}
    </div>
  );
}
