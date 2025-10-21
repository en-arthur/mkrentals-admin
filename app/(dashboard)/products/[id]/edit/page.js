import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getProductById, getAllCategories } from '@/lib/supabase/queries';
import ProductForm from '@/components/products/product-form';

export default async function EditProductPage({ params }) {
  const { id } = await params;

  try {
    const [product, categories] = await Promise.all([
      getProductById(id),
      getAllCategories(true)
    ]);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-500 mt-1">{product.name}</p>
          </div>
        </div>

        {/* Form */}
        <ProductForm product={product} categories={categories} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
