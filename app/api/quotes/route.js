import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getAllQuotes } from '@/lib/supabase/queries';

export async function GET(request) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const filters = {};
    if (status && status !== 'all') {
      filters.status = status;
    }
    
    const quotes = await getAllQuotes(filters);
    
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
