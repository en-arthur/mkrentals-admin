/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Redirect old local image paths to Supabase storage
  async rewrites() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) return [];
    
    return [
      {
        source: '/product_images/:path*',
        destination: `${supabaseUrl}/storage/v1/object/public/product-images/:path*`,
      },
      {
        source: '/product_videos/:path*',
        destination: `${supabaseUrl}/storage/v1/object/public/product-videos/:path*`,
      },
      {
        source: '/category_images/:path*',
        destination: `${supabaseUrl}/storage/v1/object/public/category-images/:path*`,
      },
    ];
  },
};

export default nextConfig;
