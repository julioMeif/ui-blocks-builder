// app/api/blocks/options/route.ts
import { NextResponse } from 'next/server';
import { getComponentOptions } from '@/utils/cosmosClient';

export async function GET() {
  try {
    const options = await getComponentOptions();
    return NextResponse.json(options);
  } catch (error) {
    console.error('Error fetching component options:', error);
    return NextResponse.json({ error: 'Failed to fetch component options' }, { status: 500 });
  }
}