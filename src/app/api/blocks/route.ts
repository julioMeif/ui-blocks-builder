// app/api/blocks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getComponents, createComponent } from '@/utils/cosmosClient';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse filter parameters
    const filters = {
      componentType: searchParams.get('componentType') as 'base' | 'composite' | undefined,
      businessType: searchParams.getAll('businessType'),
      style: searchParams.getAll('style'),
      features: searchParams.getAll('features'),
      searchText: searchParams.get('search') || undefined,
    };
    
    const components = await getComponents(filters);
    return NextResponse.json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    return NextResponse.json({ error: 'Failed to fetch components' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the required fields
    const requiredFields = ['name', 'description', 'componentType', 'sourceCode', 'importStatement'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    const newComponent = await createComponent(data);
    return NextResponse.json(newComponent, { status: 201 });
  } catch (error) {
    console.error('Error creating component:', error);
    return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
  }
}