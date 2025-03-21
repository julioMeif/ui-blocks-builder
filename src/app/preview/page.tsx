// app/preview/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ComponentMetadata } from '@/types/component';
import { ComponentRenderer, PreviewWrapper } from '@/utils/componentRenderer';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const componentId = searchParams.get('id');
  
  const [component, setComponent] = useState<ComponentMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customProps, setCustomProps] = useState<Record<string, any>>({});
  const [customPropsJson, setCustomPropsJson] = useState('{}');

  useEffect(() => {
    const fetchComponent = async () => {
      if (!componentId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/blocks/${componentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch component');
        }
        
        const data: ComponentMetadata = await response.json();
        setComponent(data);
        
        // If defaultProps exist, use them to pre-populate
        if (data.defaultProps) {
          setCustomPropsJson(JSON.stringify(data.defaultProps, null, 2));
          setCustomProps(data.defaultProps);
        } else {
          // Fallback: if no defaultProps, keep it empty or set something minimal
          setCustomPropsJson('{}');
          setCustomProps({});
        }
      } catch (error) {
        console.error('Error fetching component:', error);
        setError('Failed to load component. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchComponent();
  }, [componentId]);

  const handleApplyChanges = () => {
    try {
      const parsed = JSON.parse(customPropsJson);
      setCustomProps(parsed);
    } catch (error) {
      alert('Invalid JSON. Please fix the errors before applying.');
    }
  };

  const handleCustomPropsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPropsJson(e.target.value);
  };

  if (!componentId) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Component Preview</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-700">No component selected. Please select a component to preview.</p>
          <Link href="/blocks" className="text-blue-600 hover:underline mt-2 inline-block">
            Go to Component Library
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Component Preview</h1>
        
        <Link
          href="/blocks"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Library
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Loading component...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : component ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Component: {component.name}</h2>
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    component.componentType === 'base' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {component.componentType}
                  </span>
                  
                  {component.businessType?.map((type, index) => (
                    <span key={`business-${index}`} className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                      {type}
                    </span>
                  ))}
                  
                  {component.style?.map((style, index) => (
                    <span key={`style-${index}`} className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                      {style}
                    </span>
                  ))}
                  
                  {component.features?.map((feature, index) => (
                    <span key={`feature-${index}`} className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <PreviewWrapper>
                <ComponentRenderer component={component} customProps={customProps} />
              </PreviewWrapper>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-3">Component Properties</h2>
              <p className="text-sm text-gray-600 mb-3">
                Edit the properties (in JSON format) below to see how the component changes.
              </p>
              
              <textarea
                value={customPropsJson}
                onChange={handleCustomPropsChange}
                className="w-full h-80 font-mono text-sm p-3 border rounded-md"
                spellCheck="false"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleApplyChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply Changes
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-3">Component Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Description</h3>
                  <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Import Statement</h3>
                  <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                    {component.importStatement}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Required Props</h3>
                  {component.props?.required?.length ? (
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {component.props.required.map((prop, idx) => (
                        <li key={idx}>{prop}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">No required props</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Optional Props</h3>
                  {component.props?.optional?.length ? (
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {component.props.optional.map((prop, idx) => (
                        <li key={idx}>{prop}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">No optional props</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-700">Component not found.</p>
        </div>
      )}
    </main>
  );
}
