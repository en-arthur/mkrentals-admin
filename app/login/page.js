'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FirstTimeSetupDialog from '@/components/setup/first-time-setup-dialog';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(null);
  const [setupCredentials, setSetupCredentials] = useState(null);

  // Check if setup is needed on component mount
  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    console.log('🔍 Checking setup status...');
    try {
      const response = await fetch('/api/setup/check');
      const data = await response.json();

      console.log('🔍 Setup check response:', data);

      if (response.ok) {
        console.log('🔍 Setting needsSetup to:', data.needsSetup);
        setNeedsSetup(data.needsSetup);
      } else {
        // If check fails, default to showing login form (safer)
        console.warn('Setup check failed, defaulting to login form');
        setNeedsSetup(false);
      }
    } catch (error) {
      console.error('Setup check failed:', error);
      // Default to showing login form if check fails (safer)
      setNeedsSetup(false);
    }
  };

  const handleSetupComplete = (credentials) => {
    setSetupCredentials(credentials);
    setNeedsSetup(false);
    // Pre-fill login form with generated credentials
    setFormData({
      username: credentials.username,
      password: credentials.password
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Login attempt with:', { username: formData.username });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('🔐 Login response status:', response.status);

      const data = await response.json();

      console.log('🔐 Login response data:', data);

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      console.log('🔐 Login successful, redirecting to /');

      // Use window.location for hard redirect to ensure cookie is properly set
      // This forces a full page reload which allows the middleware to read the cookie
      window.location.href = '/';
    } catch (err) {
      console.error('🔐 Login error:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Show setup dialog if needed */}
      {needsSetup && (
        <FirstTimeSetupDialog onComplete={handleSetupComplete} />
      )}

      {/* Show login form if setup not needed or completed */}
      {!needsSetup && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                MK Rentals Admin
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
