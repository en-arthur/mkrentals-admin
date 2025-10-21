import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/session';
import { getQuoteById, updateQuoteStatus } from '@/lib/supabase/queries';

export async function GET(request, { params }) {
  try {
    await requireAuth();
    const { id } = await params;
    
    const quote = await getQuoteById(id);
    
    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const admin = await requireAuth();
    const { id } = await params;
    const { status, admin_notes } = await request.json();
    
    const quote = await updateQuoteStatus(
      id, 
      status, 
      admin_notes,
      admin.full_name || admin.username
    );
    
    // Revalidate quotes page and dashboard
    revalidatePath('/quotes');
    revalidatePath('/');
    
    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}
