'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

const statuses = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'reviewed', label: 'Reviewed', color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted', label: 'Contacted', color: 'bg-purple-100 text-purple-800' },
  { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
];

export default function QuoteStatusUpdater({ quote }) {
  const router = useRouter();
  const [status, setStatus] = useState(quote.status);
  const [notes, setNotes] = useState(quote.admin_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(`/api/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          admin_notes: notes
        })
      });

      if (response.ok) {
        router.refresh();
        alert('Quote updated successfully!');
      } else {
        alert('Failed to update quote');
      }
    } catch (error) {
      console.error('Error updating quote:', error);
      alert('Failed to update quote');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = status !== quote.status || notes !== (quote.admin_notes || '');

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
      
      <div className="space-y-4">
        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="space-y-2">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={`
                  w-full flex items-center justify-between px-4 py-2 rounded-lg border-2 transition-all
                  ${status === s.value 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <span className={`text-sm font-medium ${s.color} px-2 py-1 rounded-full`}>
                  {s.label}
                </span>
                {status === s.value && (
                  <Check className="h-5 w-5 text-orange-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Add internal notes about this quote..."
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`
            w-full py-2 px-4 rounded-lg font-medium transition-colors
            ${hasChanges && !saving
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
