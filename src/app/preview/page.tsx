// app/preview/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UIBlock } from '@/utils/cosmosClient';
import { ComponentRenderer, PreviewWrapper } from '@/utils/componentRenderer';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const blockId = searchParams.get('id');
  
  const [block, setBlock] = useState<UIBlock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customProps, setCustomProps] = useState<Record<string, any>>({});
  const [customPropsJson, setCustomPropsJson] = useState('{}');

  useEffect(() => {
    const fetchBlock = async () => {
      if (!blockId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/blocks/${blockId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch block');
        }
        
        const data = await response.json();
        setBlock(data);
        setCustomPropsJson(JSON.stringify(data.defaultProps, null, 2));
      } catch (error) {
        console.error('Error fetching block:', error);
        setError('Failed to load block. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlock();
  }, [blockId]);

  const handleCustomPropsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPropsJson(e.target.value);
    try {
      const parsedProps = JSON.parse(e.target.value);
      setCustomProps(parsedProps);
    } catch (error) {
      // Don't update customProps if JSON is invalid
    }
  };

  if (!blockId) {
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
      ) : block ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Component: {block.name}</h2>
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    block.type === 'base' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {block.type}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                    {block.category}
                  </span>
                  {block.metadata?.tags?.map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <PreviewWrapper>
                <ComponentRenderer block={block} customProps={customProps} />
              </PreviewWrapper>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-3">Component Properties</h2>
              <p className="text-sm text-gray-600 mb-3">
                Edit the properties below to see how the component changes.
              </p>
              
              <textarea
                value={customPropsJson}
                onChange={handleCustomPropsChange}
                className="w-full h-80 font-mono text-sm p-3 border rounded-md"
                spellCheck="false"
              />
              
              <div className="text-right mt-2">
                <button
                  onClick={() => setCustomPropsJson(JSON.stringify(block.defaultProps, null, 2))}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Reset to defaults
                </button>
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