'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Calendar, Mail, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuotesTable({ quotes: initialQuotes }) {
  const router = useRouter();
  const [quotes, setQuotes] = useState(initialQuotes);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotes = quotes.filter(quote => {
    const searchLower = searchTerm.toLowerCase();
    return (
      quote.customer_name.toLowerCase().includes(searchLower) ||
      quote.customer_email.toLowerCase().includes(searchLower) ||
      quote.quote_number.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or quote number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quote #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuotes.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  {searchTerm ? 'No quotes found matching your search' : 'No quotes yet'}
                </td>
              </tr>
            ) : (
              filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-gray-900">
                      {quote.quote_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{quote.customer_name}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {quote.customer_email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {quote.customer_phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {quote.event_type || 'Event'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {quote.guest_count ? `${quote.guest_count} guests` : 'Guest count not specified'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {quote.event_date 
                        ? new Date(quote.event_date).toLocaleDateString()
                        : 'Not specified'
                      }
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(quote.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/quotes/${quote.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
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
          Showing {filteredQuotes.length} of {quotes.length} quotes
        </p>
      </div>
    </div>
  );
}
