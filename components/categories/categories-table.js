'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CategoriesTable({ categories: initialCategories }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? This will also affect all products in this category.')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCategories(categories.filter(c => c.id !== categoryId));
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                No categories yet
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {category.icon || '📁'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 font-mono">{category.slug}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{category.display_order}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.is_active ? (
                      <>
                        <Eye className="h-3 w-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" />
                        Inactive
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/categories/${category.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
