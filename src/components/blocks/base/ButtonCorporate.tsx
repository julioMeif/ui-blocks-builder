'use client'

import React, { ReactNode } from 'react';

interface ButtonCorporateProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

/**
 * ButtonCorporate: Structured and solid buttons suitable for corporate or serious business environments.
 */
export const ButtonCorporate: React.FC<ButtonCorporateProps> = ({
  variant = 'primary',
  size = 'md',
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
    md: 'px-6 py-2.5',
    lg: 'px-10 py-4 text-lg',
  };

  return (
    <button
      className={`rounded-md font-medium shadow-sm transition ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
