import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllCategories } from '@/lib/supabase/queries';
import ProductForm from '@/components/products/product-form';

export default async function NewProductPage() {
  const categories = await getAllCategories(true);

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
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-500 mt-1">Create a new product in your inventory</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm categories={categories} />
    </div>
  );
}
