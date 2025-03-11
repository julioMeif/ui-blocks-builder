import { NextRequest, NextResponse } from 'next/server';
import { getUIBlocks, createUIBlock } from '@/utils/cosmosClient';

export async function GET() {
  try {
    const blocks = await getUIBlocks();
    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newBlock = await createUIBlock(data);
    return NextResponse.json(newBlock);
  } catch (error) {
    console.error('Error creating block:', error);
    return NextResponse.json({ error: 'Failed to create block' }, { status: 500 });
  }
}