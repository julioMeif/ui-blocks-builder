'use client';

import React, { useState, useEffect } from 'react';
import { ComponentMetadata, BUSINESS_TYPES, STYLE_TYPES, FEATURE_TYPES } from '@/types/component';
import Editor from "@monaco-editor/react";

interface BlockEditorProps {
  initialBlock?: Partial<ComponentMetadata>;
  onSave: (blockData: Partial<ComponentMetadata>) => Promise<void>;
  onCancel: () => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  initialBlock,
  onSave,
  onCancel,
}) => {
  // Initialize with default values or existing block data
  const [block, setBlock] = useState<Partial<ComponentMetadata>>(
    initialBlock || {
      name: '',
      description: '',
      componentType: 'base',
      businessType: [],
      style: [],
      features: [],
      props: {
        required: [],
        optional: [],
        types: {},
      },
      examples: [],
      sourceCode: '',
      importStatement: '',
      defaultProps: {}
    }
  );

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Optional: Fetch dropdown options from API instead of using constants
  const [options, setOptions] = useState({
    businessTypes: BUSINESS_TYPES,
    styles: STYLE_TYPES,
    features: FEATURE_TYPES,
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/blocks/options');
        if (response.ok) {
          const data = await response.json();
          setOptions(data);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    // Uncomment to fetch from API
    // fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBlock((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name } = e.target;
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    
    setBlock((prev) => ({
      ...prev,
      [name]: selectedOptions,
    }));
  };

  const handlePropsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    propsType: 'required' | 'optional'
  ) => {
    const values = e.target.value.split(',').map((item) => item.trim());
    setBlock((prev) => ({
      ...prev,
      props: {
        ...((prev.props) || { required: [], optional: [], types: {} }),
        [propsType]: values,
      },
    }));
  };

  const handlePropTypesChange = (value: string | undefined) => {
    try {
      const types = JSON.parse(value || '{}');
      setBlock((prev) => ({
        ...prev,
        props: {
          ...((prev.props) || { required: [], optional: [], types: {} }),
          types, // directly update the types property
        },
      }));
    } catch (error) {
      // Handle JSON parse error silently
    }
  };

  const handleExamplesChange = (value: string | undefined) => {
    try {
      const examples = JSON.parse(value || '[]');
      setBlock((prev) => ({
        ...prev,
        examples,
      }));
    } catch (error) {
      // Handle JSON parse error silently
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(block);
    } catch (error) {
      console.error('Error saving component:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">{initialBlock?.id ? 'Edit Component' : 'Create New Component'}</h2>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['general', 'metadata', 'props', 'code', 'default'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      
      {/* General Tab */}
      <div className={activeTab === 'general' ? 'block' : 'hidden'}>
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
            <label className="block mb-2 font-medium">Component Type:</label>
            <select
              name="componentType"
              value={block.componentType || 'base'}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="base">Base</option>
              <option value="composite">Composite</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Description:</label>
            <textarea
              name="description"
              value={block.description || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Import Statement:</label>
            <input
              type="text"
              name="importStatement"
              value={block.importStatement || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Metadata Tab */}
      <div className={activeTab === 'metadata' ? 'block' : 'hidden'}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-2 font-medium">Business Types:</label>
            <select
              name="businessType"
              multiple
              value={block.businessType || []}
              onChange={handleMultiSelectChange}
              className="w-full p-2 border rounded-md"
              size={5}
            >
              {options.businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Hold Ctrl (or Cmd) to select multiple options
            </p>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Styles:</label>
            <select
              name="style"
              multiple
              value={block.style || []}
              onChange={handleMultiSelectChange}
              className="w-full p-2 border rounded-md"
              size={5}
            >
              {options.styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Hold Ctrl (or Cmd) to select multiple options
            </p>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Features:</label>
            <select
              name="features"
              multiple
              value={block.features || []}
              onChange={handleMultiSelectChange}
              className="w-full p-2 border rounded-md"
              size={5}
            >
              {options.features.map((feature) => (
                <option key={feature} value={feature}>
                  {feature}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Hold Ctrl (or Cmd) to select multiple options
            </p>
          </div>
        </div>
      </div>
      
      {/* Props Tab */}
      <div className={activeTab === 'props' ? 'block' : 'hidden'}>
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Required Props (comma separated):</label>
            <input
              type="text"
              value={block.props?.required?.join(', ') || ''}
              onChange={(e) => handlePropsChange(e, 'required')}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Optional Props (comma separated):</label>
            <input
              type="text"
              value={block.props?.optional?.join(', ') || ''}
              onChange={(e) => handlePropsChange(e, 'optional')}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Prop Types (JSON):</label>
            <Editor
              height="200px"
              defaultLanguage="json"
              value={JSON.stringify(block.props?.types || {}, null, 2)}
              onChange={handlePropTypesChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
              }}
              theme="vs-dark"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Examples (JSON array):</label>
            <Editor
              height="200px"
              defaultLanguage="json"
              value={JSON.stringify(block.examples || [], null, 2)}
              onChange={handleExamplesChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
              }}
              theme="vs-dark"
            />
            <p className="mt-1 text-xs text-gray-600">
              Format: [&#123;"description": "Example description", "code": "Example code"&#125;]
            </p>
          </div>
        </div>
      </div>
      
      {/* Code Tab */}
      <div className={activeTab === 'code' ? 'block' : 'hidden'}>
        <div>
          <label className="block mb-2 font-medium">Source Code:</label>
          <Editor
            height="400px"
            defaultLanguage="typescript"
            value={block.sourceCode || ''}
            onChange={(value) => {
              setBlock((prev) => ({
                ...prev,
                sourceCode: value || '',
              }));
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
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
      </div>
      
      {/* Default Props Tab */}
      <div className={activeTab === 'default' ? 'block' : 'hidden'}>
        <div>
          <label className="block mb-2 font-medium">Default Props (JSON):</label>
          <Editor
            height="200px"
            defaultLanguage="json"
            value={JSON.stringify(block.defaultProps || {}, null, 2)}
            onChange={(value) => {
              try {
                const parsed = JSON.parse(value || '{}');
                setBlock((prev) => ({
                  ...prev,
                  defaultProps: parsed,
                }));
              } catch {
                // Handle parse errors silently or show a warning
              }
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
            }}
            theme="vs-dark"
          />
        </div>
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
          {loading ? 'Saving...' : initialBlock?.id ? 'Update Component' : 'Create Component'}
        </button>
      </div>
    </form>
  );
};
