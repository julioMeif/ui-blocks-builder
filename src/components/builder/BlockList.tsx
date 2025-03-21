'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ComponentMetadata } from '@/types/component';

interface BlockListProps {
  components: ComponentMetadata[];
  onEdit: (component: ComponentMetadata) => void;
  onDelete: (componentId: string) => Promise<void>;
  onRefresh: () => void;
}

export const BlockList: React.FC<BlockListProps> = ({
  components,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'base' | 'composite'>('all');

  // Handle component deletion with loading state
  const handleDelete = async (component: ComponentMetadata) => {
    if (!window.confirm(`Are you sure you want to delete "${component.name}"?`)) {
      return;
    }
    
    setDeleteLoading(component.id);
    
    try {
      await onDelete(component.id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete component:', error);
      alert('Failed to delete component. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter components based on search and type filter
  const filteredComponents = components.filter((component) => {
    const matchesSearch = component.name.toLowerCase().includes(filter.toLowerCase()) ||
      component.description?.toLowerCase().includes(filter.toLowerCase()) ||
      component.businessType?.some(type => type.toLowerCase().includes(filter.toLowerCase())) ||
      component.style?.some(style => style.toLowerCase().includes(filter.toLowerCase())) ||
      component.features?.some(feature => feature.toLowerCase().includes(filter.toLowerCase()));
      
    const matchesType = typeFilter === 'all' || component.componentType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search components..."
            className="w-full p-2 border rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <div>
          <select
            className="w-full sm:w-auto p-2 border rounded-md bg-white"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
          >
            <option value="all">All Types</option>
            <option value="base">Base Components</option>
            <option value="composite">Composite Components</option>
          </select>
        </div>
      </div>
      
      {filteredComponents.length === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded-md">
          <p className="text-gray-500">No components found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <div key={component.id} className="border rounded-md bg-white shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold">{component.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    component.componentType === 'base' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {component.componentType}
                  </span>
                </div>
                
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{component.description}</p>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {component.businessType?.slice(0, 3).map((type, i) => (
                    <span key={`${component.id}-business-${i}`} className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 rounded">
                      {type}
                    </span>
                  ))}
                  
                  {component.style?.slice(0, 2).map((style, i) => (
                    <span key={`${component.id}-style-${i}`} className="text-xs px-1.5 py-0.5 bg-yellow-50 text-yellow-700 rounded">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex border-t">
                <button
                  className="flex-1 p-2 text-center text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => onEdit(component)}
                >
                  Edit
                </button>
                
                <Link
                  href={`/preview?id=${component.id}`}
                  className="flex-1 p-2 text-center text-green-600 hover:bg-green-50 transition-colors"
                >
                  Preview
                </Link>
                
                <button
                  className="flex-1 p-2 text-center text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  onClick={() => handleDelete(component)}
                  disabled={deleteLoading === component.id}
                >
                  {deleteLoading === component.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};