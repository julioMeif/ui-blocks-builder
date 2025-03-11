'use client';

import React, { useState } from 'react';
import { UIBlock } from '@/utils/cosmosClient';
import Editor from "@monaco-editor/react";

interface BlockEditorProps {
  initialBlock?: Partial<UIBlock>;
  onSave: (blockData: Partial<UIBlock>) => Promise<void>;
  onCancel: () => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  initialBlock,
  onSave,
  onCancel,
}) => {
  const [block, setBlock] = useState<Partial<UIBlock>>(
    initialBlock || {
      name: '',
      type: 'base',
      category: '',
      metadata: {
        industry: [],
        tone: [],
        features: [],
        tags: [],
      },
      component: '',
      defaultProps: {},
      code: '',
    }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBlock((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetadataChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    metadataType: 'industry' | 'tone' | 'features' | 'tags'
  ) => {
    const values = e.target.value.split(',').map((item) => item.trim());
    setBlock((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [metadataType]: values,
      },
    }));
  };

  const handleDefaultPropsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const props = JSON.parse(e.target.value);
      setBlock((prev) => ({
        ...prev,
        defaultProps: props,
      }));
    } catch (error) {
      // Handle JSON parse error if needed
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(block);
    } catch (error) {
      console.error('Error saving block:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">{initialBlock?.id ? 'Edit Block' : 'Create New Block'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={block.name || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Type:</label>
          <select
            name="type"
            value={block.type || 'base'}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="base">Base</option>
            <option value="composite">Composite</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Category:</label>
          <input
            type="text"
            name="category"
            value={block.category || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Component:</label>
          <input
            type="text"
            name="component"
            value={block.component || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium">Industries (comma separated):</label>
          <input
            type="text"
            value={block.metadata?.industry?.join(', ') || ''}
            onChange={(e) => handleMetadataChange(e, 'industry')}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Tones (comma separated):</label>
          <input
            type="text"
            value={block.metadata?.tone?.join(', ') || ''}
            onChange={(e) => handleMetadataChange(e, 'tone')}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Features (comma separated):</label>
          <input
            type="text"
            value={block.metadata?.features?.join(', ') || ''}
            onChange={(e) => handleMetadataChange(e, 'features')}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Tags (comma separated):</label>
          <input
            type="text"
            value={block.metadata?.tags?.join(', ') || ''}
            onChange={(e) => handleMetadataChange(e, 'tags')}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-2 font-medium">Default Props (JSON):</label>
        <Editor
          height="200px"
          defaultLanguage="json"
          value={JSON.stringify(block.defaultProps || {}, null, 2)}
          onChange={(value) => {
            try {
              const props = JSON.parse(value || '{}');
              setBlock((prev) => ({
                ...prev,
                defaultProps: props,
              }));
            } catch (error) {
              // Handle invalid JSON silently
            }
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            // Disable linting features
            formatOnPaste: true,
            formatOnType: true,
          }}
          theme="vs-dark"
        />
      </div>
      
      <div>
        <label className="block mb-2 font-medium">Component Code:</label>
        // For the Component Code editor:
        <Editor
          height="400px"
          defaultLanguage="typescript"
          value={block.code || ''}
          onChange={(value) => {
            setBlock((prev) => ({
              ...prev,
              code: value || '',
            }));
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            // Disable various warnings
            suggestOnTriggerCharacters: false,
            quickSuggestions: false,
            snippetSuggestions: "none"
          }}
          theme="vs-dark"
          beforeMount={(monaco) => {
            // This will disable all the built-in validations
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true,
              noSyntaxValidation: true
            });
          }}
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialBlock?.id ? 'Update Block' : 'Create Block'}
        </button>
      </div>
    </form>
  );
};