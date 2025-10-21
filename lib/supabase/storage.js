import { createAdminClient } from './admin';

// ============ STORAGE HELPERS ============

/**
 * Upload a product image to Supabase Storage
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadProductImage(file) {
  const supabase = createAdminClient();
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `products/${fileName}`;
  
  // Upload file
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);
  
  return publicUrl;
}

/**
 * Upload a product video to Supabase Storage
 * @param {File} file - The video file to upload
 * @returns {Promise<string>} - The public URL of the uploaded video
 */
export async function uploadProductVideo(file) {
  const supabase = createAdminClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `products/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('product-videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('product-videos')
    .getPublicUrl(filePath);
  
  return publicUrl;
}

/**
 * Upload a category image to Supabase Storage
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadCategoryImage(file) {
  const supabase = createAdminClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `categories/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('category-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('category-images')
    .getPublicUrl(filePath);
  
  return publicUrl;
}

/**
 * Delete an asset from Supabase Storage
 * @param {string} url - The public URL of the asset to delete
 * @returns {Promise<void>}
 */
export async function deleteAsset(url) {
  const supabase = createAdminClient();
  
  // Extract bucket and path from URL
  // URL format: https://xxxxx.supabase.co/storage/v1/object/public/bucket-name/path/to/file
  const urlParts = url.split('/storage/v1/object/public/');
  if (urlParts.length !== 2) {
    throw new Error('Invalid Supabase Storage URL');
  }
  
  const [bucketAndPath] = urlParts[1].split('/');
  const bucket = bucketAndPath;
  const path = urlParts[1].substring(bucket.length + 1);
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) throw error;
}

/**
 * Get public URL for a file in storage
 * @param {string} bucket - The bucket name
 * @param {string} path - The file path
 * @returns {string} - The public URL
 */
export function getPublicUrl(bucket, path) {
  const supabase = createAdminClient();
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return publicUrl;
}

/**
 * Upload multiple files
 * @param {File[]} files - Array of files to upload
 * @param {string} type - 'image' or 'video'
 * @returns {Promise<string[]>} - Array of public URLs
 */
export async function uploadMultipleFiles(files, type = 'image') {
  const uploadPromises = files.map(file => {
    if (type === 'video') {
      return uploadProductVideo(file);
    }
    return uploadProductImage(file);
  });
  
  return Promise.all(uploadPromises);
}
