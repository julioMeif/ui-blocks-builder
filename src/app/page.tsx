import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">UI Blocks Builder Interface</h1>
        <p className="text-xl text-gray-600 mb-8">
          Create, manage, and organize UI components for your Next.js applications</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/blocks" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Blocks
          </Link>
          <Link 
            href="/blocks/new" 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg text-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Create New Block
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Create UI Blocks</h2>
          <p className="text-gray-600 mb-4">
            Design and implement reusable UI components with custom properties and metadata
          </p>
          <Link href="/blocks/new" className="text-blue-600 hover:underline">
            Get Started →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Manage Block Library</h2>
          <p className="text-gray-600 mb-4">
            Organize, search, and filter your UI blocks by type, category, or custom tags
          </p>
          <Link href="/blocks" className="text-blue-600 hover:underline">
            View Library →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Preview Components</h2>
          <p className="text-gray-600 mb-4">
            Visualize and interact with your UI components in the browser
          </p>
          <Link href="/preview" className="text-blue-600 hover:underline">
            Open Component Preview →
          </Link>
        </div>
      </div>
    </main>
  );
}