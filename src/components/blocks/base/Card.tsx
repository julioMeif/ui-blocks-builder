import React from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  footer?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  content,
  imageUrl,
  footer,
  className = '',
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-white',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md',
  };

  return (
    <div className={`rounded-lg overflow-hidden ${variantStyles[variant]} ${className}`}>
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img src={imageUrl} alt={title || 'Card image'} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        {title && <h3 className="font-semibold text-lg mb-1">{title}</h3>}
        {subtitle && <h4 className="text-gray-600 text-sm mb-2">{subtitle}</h4>}
        {content && <p className="text-gray-700">{content}</p>}
      </div>
      {footer && <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">{footer}</div>}
    </div>
  );
};