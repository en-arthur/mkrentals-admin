import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getProductById, updateProduct, deleteProduct } from '@/lib/supabase/queries';

export async function GET(request, { params }) {
  try {
    await requireAuth();
    const { id } = await params;
    
    const product = await getProductById(id);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAuth();
    const { id } = await params;
    const data = await request.json();
    
    const product = await updateProduct(id, data);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth();
    const { id } = await params;
    
    await deleteProduct(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
