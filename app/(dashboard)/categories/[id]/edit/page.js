import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getCategoryById } from '@/lib/supabase/queries';
import CategoryForm from '@/components/categories/category-form';

export default async function EditCategoryPage({ params }) {
  const { id } = await params;

  try {
    const category = await getCategoryById(id);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/categories"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-500 mt-1">{category.name}</p>
          </div>
        </div>

        {/* Form */}
        <CategoryForm category={category} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
