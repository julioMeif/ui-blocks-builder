// src/utils/componentRenderer.tsx
'use client';

import React from 'react';
import { UIBlock } from './cosmosClient';
import { Button } from '@/components/blocks/base/Button';
import { Card } from '@/components/blocks/base/Card';
import { HeroSection } from '@/components/blocks/composite/HeroSection';

// Component map to match component names to their implementations
const componentMap: Record<string, React.ComponentType<any>> = {
  Button,
  Card,
  HeroSection,
  // Add more components as they are created
};

interface ComponentRendererProps {
  block: UIBlock;
  customProps?: Record<string, any>;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ 
  block, 
  customProps = {} 
}) => {
  // Get the component implementation based on the component name
  const Component = componentMap[block.component];
  
  if (!Component) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <p className="text-red-600">
          Component "{block.component}" not found in component registry.
        </p>
      </div>
    );
  }

  // Merge default props with custom props
  const mergedProps = {
    ...block.defaultProps,
    ...customProps
  };
  
  try {
    // Render the component with the merged props
    return <Component {...mergedProps} />;
  } catch (error) {
    console.error('Error rendering component:', error);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <p className="text-red-600">
          Error rendering component: {(error as Error).message}
        </p>
      </div>
    );
  }
};

// Preview page wrapper with styling
export const PreviewWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="mb-2 pb-2 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-500">PREVIEW</span>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};