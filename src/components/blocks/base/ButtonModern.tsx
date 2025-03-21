'use client'

import React, { ReactNode } from 'react';

interface ButtonModernProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'md';
  children: ReactNode;
  className?: string;
  animated: boolean;
}

export const ButtonModern: React.FC<ButtonModernProps> = ({
  variant = 'primary',
  size = 'md',
  rounded = 'md',
  className = '',
  children,
  ...props
}) => {
    const variants: Record<string, string> = {
    primary: 'bg-primary text-onPrimary hover:bg-secondary',
    secondary: 'bg-secondary text-onSecondary hover:bg-primary',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-onPrimary',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`rounded-${rounded} font-semibold transition ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};