'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductsTable({ products: initialProducts }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category?.name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleAvailability = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}/toggle`, {
        method: 'PATCH'
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => 
          p.id === productId ? { ...p, is_available: updatedProduct.is_available } : p
        ));
        router.refresh();
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update product availability');
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="p-4 border-b space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
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
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 font-mono">{product.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleAvailability(product.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.is_available ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Available
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Unavailable
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
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

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
}
