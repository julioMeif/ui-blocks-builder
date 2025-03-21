'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlockList } from '@/components/builder/BlockList';
import { ComponentMetadata } from '@/types/component';

export default function BlocksPage() {
  const [components, setComponents] = useState<ComponentMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComponents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/blocks');
      
      if (!response.ok) {
        throw new Error('Failed to fetch components');
      }
      
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error('Error fetching components:', error);
      setError('Failed to load components. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleEdit = (component: ComponentMetadata) => {
    window.location.href = `/blocks/edit/${component.id}`;
  };

  const handleDelete = async (componentId: string) => {
    try {
      const response = await fetch(`/api/blocks/${componentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete component');
      }
      
      // Refresh the list after successful deletion
      fetchComponents();
    } catch (error) {
      console.error('Error deleting component:', error);
      throw error;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">UI Components Library</h1>
        
        <Link
          href="/blocks/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Component
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Loading components...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
          <button
            onClick={fetchComponents}
            className="ml-3 underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <BlockList
          components={components}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={fetchComponents}
        />
      )}
    </main>
  );
}