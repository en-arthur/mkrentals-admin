import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { uploadProductVideo } from '@/lib/supabase/storage';

export async function POST(request) {
  try {
    await requireAuth();
    
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }
    
    // Upload all files
    const uploadPromises = files.map(file => uploadProductVideo(file));
    const urls = await Promise.all(uploadPromises);
    
    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Error uploading videos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload videos' },
      { status: 500 }
    );
  }
}
