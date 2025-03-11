'use client';

import React, { useState } from 'react';
import { UIBlock } from '@/utils/cosmosClient';
import { Button } from '../blocks/base/Button';
import Link from 'next/link';

interface BlockListProps {
  blocks: UIBlock[];
  onEdit: (block: UIBlock) => void;
  onDelete: (blockId: string) => Promise<void>;
  onRefresh: () => void;
}

export const BlockList: React.FC<BlockListProps> = ({
  blocks,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'base' | 'composite'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  // Get unique categories from blocks
  const categories = Array.from(
    new Set(blocks.map((block) => block.category))
  ).sort();

  const filteredBlocks = blocks.filter((block) => {
    const matchesSearchTerm = block.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              block.component.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || block.type === filterType;
    const matchesCategory = filterCategory === '' || block.category === filterCategory;
    
    return matchesSearchTerm && matchesType && matchesCategory;
  });

  const handleDelete = async (blockId: string) => {
    setDeleting(blockId);
    try {
      await onDelete(blockId);
      onRefresh();
    } catch (error) {
      console.error('Error deleting block:', error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Types</option>
            <option value="base">Base</option>
            <option value="composite">Composite</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <Button 
            variant="outline" 
            size="sm" 
            label="Refresh" 
            onClick={onRefresh} 
          />
        </div>
      </div>
      
      {filteredBlocks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No blocks found. Try adjusting your filters or creating new blocks.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlocks.map((block) => (
            <div 
              key={block.id} 
              className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{block.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    block.type === 'base' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {block.type}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  Category: {block.category}
                </p>
                
                <p className="text-sm text-gray-600 mb-2">
                  Component: {block.component}
                </p>
                
                {block.metadata?.tags && block.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {block.metadata.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex border-t">
                <button
                  onClick={() => onEdit(block)}
                  className="flex-1 py-2 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Edit
                </button>
                <Link
                  href={`/preview?id=${block.id}`}
                  className="flex-1 py-2 text-green-600 hover:bg-green-50 transition-colors text-center"
                >
                  Preview
                </Link>
                <button
                  onClick={() => handleDelete(block.id)}
                  disabled={deleting === block.id}
                  className="flex-1 py-2 text-red-600 hover:bg-red-50 transition-colors disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                  {deleting === block.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};