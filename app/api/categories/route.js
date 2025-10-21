import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/session';
import { getAllCategories, createCategory } from '@/lib/supabase/queries';

export async function GET() {
  try {
    await requireAuth();
    
    const categories = await getAllCategories(true);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await requireAuth();
    const data = await request.json();
    
    const category = await createCategory(data);
    
    // Revalidate categories page and products page
    revalidatePath('/categories');
    revalidatePath('/products');
    revalidatePath('/');
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
