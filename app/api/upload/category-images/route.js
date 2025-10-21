import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { uploadCategoryImage } from '@/lib/supabase/storage';

export async function POST(request) {
  try {
    await requireAuth();
    
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    const url = await uploadCategoryImage(file);
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading category image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload category image' },
      { status: 500 }
    );
  }
}
