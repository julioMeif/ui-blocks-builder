import React from 'react';

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  label: string;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  onClick,
  className = '',
}) => {
  // Base styles applied to all buttons
  const baseStyles =
    "font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Map variants to Tailwind classes referencing your extended theme colors.
  const variantStyles = {
    primary: "bg-primary hover:bg-primary/90 text-onPrimary focus:ring-primary",
    secondary: "bg-secondary hover:bg-secondary/90 text-onSecondary focus:ring-secondary",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary/10 focus:ring-primary",
  };

  // Size mapping based on your extended spacing configuration.
  // Note: Adjust the spacing classes to your preferred Tailwind classes or your custom spacing keys.
  const sizeStyles = {
    sm: "py-1 px-3 text-sm", // You could also use your custom keys like `py-xs px-sm` if defined.
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  // Combine the classes
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={buttonStyles} onClick={onClick}>
      {label}
    </button>
  );
};
