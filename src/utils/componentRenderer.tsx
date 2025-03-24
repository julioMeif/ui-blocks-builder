// src/utils/componentRenderer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ComponentMetadata } from '@/types/component';
import { Button } from '@/components/blocks/base/Button';
import { Card } from '@/components/blocks/base/Card';
import { HeroSection } from '@/components/blocks/composite/HeroSection';
import * as Babel from '@babel/standalone';
import * as ReactJsxRuntime from 'react/jsx-runtime';


// Static registry of pre-imported components
const componentMap: Record<string, React.ComponentType<any>> = {
  Button,
  Card,
  HeroSection,
  // Other pre-coded components...
};

interface ComponentRendererProps {
  component: ComponentMetadata;
  customProps?: Record<string, any>;
}

export const ComponentRenderer = ({
  component,
  customProps = {},
}: ComponentRendererProps) => {
  // Determine component name (you might also parse the importStatement)
  const componentName =
    component.importStatement
      ? component.importStatement.match(/import\s+(\w+)/)?.[1] || component.name
      : component.name;

  // Try to get the component from the static map first
  let StaticComponent = componentMap[componentName];

  // State to hold a dynamically evaluated component (if needed)
  const [DynamicComponent, setDynamicComponent] =
    useState<React.ComponentType<any> | null>(null);
  
  const dummyRequire = (moduleName: string) => {
    if (moduleName === 'react') return React;
    if (moduleName === 'react/jsx-runtime') return ReactJsxRuntime;
    throw new Error(`Module "${moduleName}" is not available in dynamic eval.`);
  };
  
    // If not found in static registry, attempt dynamic compilation
    useEffect(() => {
      if (!StaticComponent) {
        try {
          const compiledCode = Babel.transform(component.sourceCode, {
            filename: 'component.tsx',
            presets: [
              ['react', { runtime: 'automatic' }],
              ['typescript', { isTSX: true, allExtensions: true }],
            ],
            plugins: [Babel.availablePlugins['transform-modules-commonjs']],
          }).code;
    
          // Create a dummy module environment
          const module = { exports: {} };
          const fn = new Function('module', 'exports', 'require', compiledCode);
          fn(module, module.exports, dummyRequire);
    
          // Retrieve the component from the exports.
          const evaluated = module.exports as any;;
          const Comp =
            evaluated.default || evaluated[componentName] || evaluated;
    
          if (Comp) {
            setDynamicComponent(() => Comp);
          } else {
            console.error('Component not found in evaluated code.');
          }
        } catch (error) {
          console.error('Error dynamically rendering component:', error);
        }
      }
    }, [StaticComponent, component.sourceCode, componentName]);
    
  
  console.log("Rendering with props:", customProps); 

  // Decide which component to render
  const RenderComponent = StaticComponent || DynamicComponent;

  if (!RenderComponent) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <p className="text-red-600">
          Component "{componentName}" not found in component registry.
        </p>
      </div>
    );
  }

  try {
    return <RenderComponent {...customProps} />;
  } catch (error: any) {
    console.error('Error rendering component:', error);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <p className="text-red-600">
          Error rendering component: {error.message}
        </p>
      </div>
    );
  }
};

// Preview page wrapper with styling
export const PreviewWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="mb-2 pb-2 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-500">PREVIEW</span>
      </div>
      <div>{children}</div>
    </div>
  );
};
