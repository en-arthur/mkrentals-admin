import { 
  Package, 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { getAllProducts, getAllQuotes, getQuoteStats } from '@/lib/supabase/queries';

// Disable caching to always show fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
  try {
    const [products, quotes, quoteStats] = await Promise.all([
      getAllProducts(),
      getAllQuotes(),
      getQuoteStats()
    ]);

    const availableProducts = products.filter(p => p.is_available).length;
    const recentQuotes = quotes.slice(0, 5);

    return {
      totalProducts: products.length,
      availableProducts,
      totalQuotes: quotes.length,
      pendingQuotes: quoteStats.pending,
      recentQuotes
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalProducts: 0,
      availableProducts: 0,
      totalQuotes: 0,
      pendingQuotes: 0,
      recentQuotes: []
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
      title: 'Total Quotes',
      value: stats.totalQuotes,
      subtitle: 'All time',
      icon: FileText,
      color: 'bg-primary',
      href: '/quotes'
    },
    {
      title: 'Pending Quotes',
      value: stats.pendingQuotes,
      subtitle: 'Needs attention',
      icon: Clock,
      color: 'bg-primary',
      href: '/quotes?status=pending'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Recent Quotes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Quotes</h2>
            <Link 
              href="/quotes"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View all →
            </Link>
          </div>
        </div>

        <div className="divide-y">
          {stats.recentQuotes.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No quotes yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Quotes will appear here when customers submit requests
              </p>
            </div>
          ) : (
            stats.recentQuotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/quotes/${quote.id}`}
                className="p-6 hover:bg-gray-50 transition-colors block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{quote.customer_name}</h3>
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${quote.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : ''}
                        ${quote.status === 'contacted' ? 'bg-purple-100 text-purple-800' : ''}
                        ${quote.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                        ${quote.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                        ${quote.status === 'completed' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {quote.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{quote.customer_email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {quote.event_type || 'Event'} • {new Date(quote.event_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{quote.quote_number}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
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
          href="/quotes?status=pending"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <Clock className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-gray-900">Pending Quotes</h3>
          <p className="text-sm text-gray-500 mt-1">Review and respond to quote requests</p>
        </Link>

        <Link
          href="/categories"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <TrendingUp className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-gray-900">Manage Categories</h3>
          <p className="text-sm text-gray-500 mt-1">Organize your product categories</p>
        </Link>
      </div>
    </div>
  );
}
