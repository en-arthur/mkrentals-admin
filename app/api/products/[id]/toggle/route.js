import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { toggleProductAvailability } from '@/lib/supabase/queries';

export async function PATCH(request, { params }) {
  try {
    await requireAuth();
    const { id } = await params;
    
    const product = await toggleProductAvailability(id);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error toggling product availability:', error);
    return NextResponse.json(
      { error: 'Failed to toggle product availability' },
      { status: 500 }
    );
  }
}
