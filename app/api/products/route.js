import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getAllProducts, createProduct } from '@/lib/supabase/queries';

export async function GET() {
  try {
    await requireAuth();
    
    const products = await getAllProducts(true);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await requireAuth();
    const data = await request.json();
    
    const product = await createProduct(data);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
