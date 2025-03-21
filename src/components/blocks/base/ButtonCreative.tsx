'use client'

import React, { ReactNode } from 'react';

interface ButtonCreativeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'accent' | 'outline' | 'vibrant';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
  animated: boolean;
}

export const ButtonCreative: React.FC<ButtonCreativeProps> = ({
  variant = 'accent',
  size = 'md',
  className = '',
  children,
  animated = false,
  ...props
}) => {
    const variants: Record<string, string> = {
    accent: 'bg-accent text-onAccent hover:bg-secondary',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-onAccent',
    vibrant: 'bg-gradient-to-r from-primary to-accent text-onDark shadow-lg',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-7 py-2.5',
    lg: 'px-10 py-4 text-lg',
  };

  const animationClass = animated ? 'hover:scale-105 duration-200' : '';

  return (
    <button
      className={`rounded-lg font-bold transition transform ${variants[variant]} ${sizes[size]} ${animationClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
