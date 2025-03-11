'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlockList } from '@/components/builder/BlockList';
import { UIBlock } from '@/utils/cosmosClient';

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<UIBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/blocks');
      
      if (!response.ok) {
        throw new Error('Failed to fetch blocks');
      }
      
      const data = await response.json();
      setBlocks(data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
      setError('Failed to load blocks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleEdit = (block: UIBlock) => {
    window.location.href = `/blocks/edit/${block.id}`;
  };

  const handleDelete = async (blockId: string) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete block');
      }
      
    } catch (error) {
      console.error('Error deleting block:', error);
      throw error;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">UI Blocks Library</h1>
        
        <Link
          href="/blocks/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Block
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Loading blocks...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
          <button
            onClick={fetchBlocks}
            className="ml-3 underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <BlockList
          blocks={blocks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={fetchBlocks}
        />
      )}
    </main>
  );
}