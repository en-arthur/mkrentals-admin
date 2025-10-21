import { getAllQuotes } from '@/lib/supabase/queries';
import QuotesTable from '@/components/quotes/quotes-table';

export default async function QuotesPage() {
  const quotes = await getAllQuotes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quote Requests</h1>
        <p className="text-gray-500 mt-1">View all customer quote requests</p>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <QuotesTable quotes={quotes} />
      </div>
    </div>
  );
}
