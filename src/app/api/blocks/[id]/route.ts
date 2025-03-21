// app/api/blocks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getComponentById, updateComponent, deleteComponent } from '@/utils/cosmosClient';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Await params to ensure we have a resolved object
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const component = await getComponentById(id);
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    return NextResponse.json(component);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await params;
  try {
    const data = await request.json();
    const updated = await updateComponent(id, data);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await params;
  try {
    await deleteComponent(id);
    return NextResponse.json({ message: 'Component deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}