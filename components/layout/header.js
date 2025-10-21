'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

export default function Header() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setAdmin(data.admin);
        }
      } catch (error) {
        console.error('Error fetching admin:', error);
      }
    }

    fetchAdmin();
  }, []);

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your rental business efficiently
          </p>
        </div>

        {admin && (
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{admin.full_name}</p>
              <p className="text-xs text-gray-500 capitalize">{admin.role.replace('_', ' ')}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
