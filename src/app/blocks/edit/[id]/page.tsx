'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { BlockEditor } from '@/components/builder/BlockEditor';
import { ComponentMetadata } from '@/types/component';

export default function EditBlockPage() {
  const router = useRouter();
  const params = useParams();
  const blockId = params?.id as string;

  const [component, setComponent] = useState<ComponentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/blocks/${blockId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch component');
        }
        
        const data = await response.json();
        setComponent(data);
      } catch (error) {
        console.error('Error fetching component:', error);
        setError('Failed to load component. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (blockId) {
      fetchComponent();
    }
  }, [blockId]);

  const handleSave = async (componentData: Partial<ComponentMetadata>) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(componentData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update component');
      }
      
      router.push('/blocks');
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/blocks');
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Loading component...</p>
        </div>
      </main>
    );
  }

  if (error || !component) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || 'Component not found'}
          <button
            onClick={() => router.push('/blocks')}
            className="ml-3 underline"
          >
            Go Back to Components
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Edit UI Component: {component.name}</h1>
      
      <BlockEditor
        initialBlock={component}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </main>
  );
}