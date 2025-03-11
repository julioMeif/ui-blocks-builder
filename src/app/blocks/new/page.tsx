'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BlockEditor } from '@/components/builder/BlockEditor';

export default function NewBlockPage() {
  const router = useRouter();

  const handleSave = async (blockData: any) => {
    try {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blockData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create block');
      }
      
      router.push('/blocks');
    } catch (error) {
      console.error('Error creating block:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/blocks');
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Create New UI Block</h1>
      
      <BlockEditor
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </main>
  );
}