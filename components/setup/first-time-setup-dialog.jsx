'use client';

import { useState } from 'react';
import { Copy, Download, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function FirstTimeSetupDialog({ onComplete }) {
  const [step, setStep] = useState('welcome'); // welcome, generating, credentials, success
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');

  const generateCredentials = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = 'Failed to generate credentials';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      setCredentials(data.credentials);
      setStep('credentials');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCredentials = () => {
    if (!credentials) return;

    const content = `MK Rentals Admin Credentials
=============================

Generated: ${new Date().toLocaleString()}

Username: ${credentials.username}
Password: ${credentials.password}

⚠️  IMPORTANT:
- Save these credentials securely
- You won't be able to see the password again
- Change your password after first login

Admin Dashboard: ${window.location.origin}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mk-rentals-admin-credentials.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const completeSetup = () => {
    setStep('success');
    // Auto-redirect after 3 seconds
    setTimeout(() => {
      if (onComplete) {
        onComplete(credentials);
      } else {
        window.location.href = '/';
      }
    }, 3000);
  };

  // Welcome step
  if (step === 'welcome') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              🔐 First-Time Setup Required
            </h2>

            <p className="text-gray-600 mb-6">
              No admin accounts exist yet. Let's create your first admin account with simple, memorable credentials.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-2">Your credentials will be:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-mono text-gray-900">mkrentals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Password:</span>
                  <span className="font-mono text-gray-900">MKRentals2024!</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              onClick={generateCredentials}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Admin Account...
                </span>
              ) : (
                'Create Admin Account'
              )}
            </button>

            <p className="text-xs text-gray-500 mt-3">
              ⚠️ Important: Save these credentials securely!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Credentials display step
  if (step === 'credentials') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ✅ Admin Credentials Generated
            </h2>

            <p className="text-gray-600 mb-6">
              Your admin account has been created successfully.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex-1 font-mono text-gray-900 bg-white px-3 py-2 rounded border">
                      {credentials?.username}
                    </span>
                    <button
                      onClick={() => copyToClipboard(credentials?.username || '', 'username')}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title="Copy username"
                    >
                      {copiedField === 'username' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex-1 font-mono text-gray-900 bg-white px-3 py-2 rounded border">
                      {credentials?.password}
                    </span>
                    <button
                      onClick={() => copyToClipboard(credentials?.password || '', 'password')}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title="Copy password"
                    >
                      {copiedField === 'password' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <button
                  onClick={downloadCredentials}
                  className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
                >
                  <Download className="h-4 w-4" />
                  Download Credentials File
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Important:</strong> Save these credentials now! You won't be able to see the password again.
              </p>
            </div>

            <button
              onClick={completeSetup}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Continue to Login
            </button>

            <p className="text-xs text-gray-500 mt-3">
              💡 Tip: You can change your password after logging in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success step
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            🎉 Setup Complete!
          </h2>

          <p className="text-gray-600 mb-6">
            Your admin account has been created successfully.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-green-800">
              Redirecting to dashboard in 3 seconds...
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Use these credentials to log in:
          </p>
          <div className="mt-2 text-left bg-gray-50 rounded p-3">
            <div className="text-sm">
              <span className="font-medium">Username:</span> {credentials?.username}<br/>
              <span className="font-medium">Password:</span> {credentials?.password}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
