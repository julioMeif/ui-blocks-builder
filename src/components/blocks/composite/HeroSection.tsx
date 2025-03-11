import React from 'react';
import { Button } from '../base/Button';

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundOverlay?: boolean;
  alignment?: 'left' | 'center' | 'right';
  height?: 'small' | 'medium' | 'large' | 'full';
  ctaButtons?: Array<{
    label: string;
    variant: 'primary' | 'secondary' | 'outline';
    onClick?: () => void;
  }>;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundOverlay = true,
  alignment = 'center',
  height = 'medium',
  ctaButtons = [],
  className = '',
}) => {
  const heightClasses = {
    small: 'min-h-[30vh]',
    medium: 'min-h-[50vh]',
    large: 'min-h-[70vh]',
    full: 'min-h-screen',
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <section 
      className={`relative flex flex-col justify-center ${heightClasses[height]} ${className}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {backgroundImage && backgroundOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}
      
      <div className={`relative z-10 container mx-auto px-4 flex flex-col ${alignmentClasses[alignment]}`}>
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${backgroundImage ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h1>
        
        {subtitle && (
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${backgroundImage ? 'text-white' : 'text-gray-700'}`}>
            {subtitle}
          </h2>
        )}
        
        {description && (
          <p className={`text-base md:text-lg max-w-2xl mb-6 ${backgroundImage ? 'text-gray-200' : 'text-gray-600'}`}>
            {description}
          </p>
        )}
        
        {ctaButtons.length > 0 && (
          <div className={`flex flex-wrap gap-4 mt-4 ${alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
            {ctaButtons.map((btn, index) => (
              <Button
                key={index}
                variant={btn.variant}
                size="lg"
                label={btn.label}
                onClick={btn.onClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};