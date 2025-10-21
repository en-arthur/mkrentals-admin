import Link from 'next/link';
import { Plus, Search, Package } from 'lucide-react';
import { getAllProducts } from '@/lib/supabase/queries';
import ProductsTable from '@/components/products/products-table';

export default async function ProductsPage() {
  const products = await getAllProducts(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your rental inventory</p>
        </div>
        <Link
          href="/products/new"
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {products.filter(p => p.is_available).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-600">Unavailable</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {products.filter(p => !p.is_available).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}
