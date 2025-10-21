import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/session';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/supabase/queries';

export async function GET(request, { params }) {
  try {
    await requireAuth();
    const { id } = await params;
    
    const category = await getCategoryById(id);
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAuth();
    const { id } = await params;
    const data = await request.json();
    
    const category = await updateCategory(id, data);
    
    // Revalidate categories page, products page, and dashboard
    revalidatePath('/categories');
    revalidatePath('/products');
    revalidatePath('/');
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth();
    const { id } = await params;
    
    await deleteCategory(id);
    
    // Revalidate categories page and dashboard
    revalidatePath('/categories');
    revalidatePath('/');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
