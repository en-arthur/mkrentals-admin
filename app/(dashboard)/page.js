import { 
  Package, 
  CheckCircle, 
  TrendingUp,
  FolderOpen
} from 'lucide-react';
import Link from 'next/link';
import { getAllProducts } from '@/lib/supabase/queries';

// Disable caching to always show fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
  try {
    const products = await getAllProducts();
    const availableProducts = products.filter(p => p.is_available).length;

    return {
      totalProducts: products.length,
      availableProducts
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalProducts: 0,
      availableProducts: 0
    };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      subtitle: `${stats.availableProducts} available`,
      icon: Package,
      color: 'bg-secondary',
      href: '/products'
    },
    {
      title: 'Available Products',
      value: stats.availableProducts,
      subtitle: 'Ready to rent',
      icon: CheckCircle,
      color: 'bg-primary',
      href: '/products'
    },
    {
      title: 'Active Status',
      value: 'Online',
      subtitle: 'System operational',
      icon: CheckCircle,
      color: 'bg-secondary',
      href: '/'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Monitor your rental business at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>


      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/products/new"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <Package className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-gray-900">Add Product</h3>
          <p className="text-sm text-gray-500 mt-1">Add a new product to your inventory</p>
        </Link>

        <Link
          href="/products"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <Package className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-gray-900">View Products</h3>
          <p className="text-sm text-gray-500 mt-1">Browse and manage your inventory</p>
        </Link>

        <Link
          href="/categories"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <FolderOpen className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-gray-900">Manage Categories</h3>
          <p className="text-sm text-gray-500 mt-1">Organize your product categories</p>
        </Link>
      </div>
    </div>
  );
}
