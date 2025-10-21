import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Package, Truck } from 'lucide-react';
import { getQuoteById } from '@/lib/supabase/queries';

export default async function QuoteDetailPage({ params }) {
  const { id } = await params;
  
  try {
    const quote = await getQuoteById(id);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/quotes"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quote Details</h1>
              <p className="text-gray-500 mt-1">Quote #{quote.quote_number}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900 mt-1">{quote.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900 mt-1">
                    <a href={`mailto:${quote.customer_email}`} className="text-blue-600 hover:underline">
                      {quote.customer_email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900 mt-1">
                    <a href={`tel:${quote.customer_phone}`} className="text-blue-600 hover:underline">
                      {quote.customer_phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Event Type</label>
                    <p className="text-gray-900">{quote.event_type || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Event Date</label>
                    <p className="text-gray-900">
                      {quote.event_date 
                        ? new Date(quote.event_date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Not specified'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">{quote.event_location || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Guest Count</label>
                    <p className="text-gray-900">{quote.guest_count || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Rental Period</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(quote.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(quote.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery</h2>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Delivery Required</label>
                  <p className="text-gray-900">
                    {quote.needs_delivery ? 'Yes' : 'No'}
                  </p>
                  {quote.needs_delivery && quote.delivery_address && (
                    <p className="text-sm text-gray-600 mt-1">{quote.delivery_address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Items Requested */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Items Requested</h2>
              <div className="space-y-2">
                {quote.items && quote.items.length > 0 ? (
                  quote.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Package className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name || item.productName}</p>
                        {item.quantity && (
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items specified</p>
                )}
              </div>
            </div>

            {/* Additional Message */}
            {quote.message && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Message</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{quote.message}</p>
              </div>
            )}

            {/* Submission Info */}
            <div className="bg-gray-50 rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h2>
              <div>
                <p className="text-sm font-medium text-gray-500">Submitted On</p>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(quote.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
