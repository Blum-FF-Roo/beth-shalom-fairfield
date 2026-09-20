'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, ExternalLink } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import { useToast } from '@/app/utils/ToastContext';
import { getContent, setContent } from '@/app/utils/firebase-operations';
import { PAYPAL_CLIENT_ID_KEY } from '@/app/utils/usePayPalConfig';

export default function PaymentSettingsPage() {
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [clientId, setClientId] = useState('');

  const { data: currentClientId, isLoading } = useQuery({
    queryKey: ['content', PAYPAL_CLIENT_ID_KEY],
    queryFn: () => getContent(PAYPAL_CLIENT_ID_KEY),
  });

  useEffect(() => {
    if (typeof currentClientId === 'string') {
      setClientId(currentClientId);
    }
  }, [currentClientId]);

  const saveMutation = useMutation({
    mutationFn: (value: string) => setContent(PAYPAL_CLIENT_ID_KEY, value.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', PAYPAL_CLIENT_ID_KEY] });
      showSuccess('Saved', 'PayPal Client ID has been updated. It takes effect immediately on all pages.');
    },
    onError: (error) => {
      console.error('Error saving PayPal Client ID:', error);
      showError('Save Failed', 'Failed to save the PayPal Client ID. Please try again.');
    },
  });

  const isLivePlaceholder = clientId.trim() === '' || clientId.trim() === 'test';

  return (
    <ProtectedRoute requiredRole="super-admin">
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto py-8 px-4">
          <Link
            href="/admin"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Settings</h1>
          <p className="text-gray-600 mb-8">
            Controls PayPal checkout on the High Holy Days, Passover, Membership, and Tzedakah pages.
          </p>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <label htmlFor="paypal-client-id" className="block text-sm font-medium text-gray-700 mb-2">
              PayPal Client ID
            </label>
            {isLoading ? (
              <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
            ) : (
              <input
                id="paypal-client-id"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Paste your PayPal Client ID here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              />
            )}
            <p className="mt-2 text-xs text-gray-500">
              This is a public identifier, not a secret &mdash; PayPal designs it to be safe to use directly in browser code.
              Leave this blank to keep checkout in PayPal&apos;s sandbox/test mode (no real payments are possible).
            </p>

            {!isLoading && (
              <div className={`mt-3 text-xs px-3 py-2 rounded-md ${isLivePlaceholder ? 'bg-yellow-50 text-yellow-800' : 'bg-green-50 text-green-800'}`}>
                {isLivePlaceholder
                  ? 'Currently in sandbox/test mode &mdash; PayPal buttons on the site will not accept real payments.'
                  : 'A Client ID is set &mdash; PayPal buttons on the site will accept real payments.'}
              </div>
            )}

            <button
              onClick={() => saveMutation.mutate(clientId)}
              disabled={saveMutation.isPending || isLoading}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#F58C28' }}
            >
              {saveMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Where to get a Client ID</h2>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-5">
              <li>You need a PayPal <strong>Business</strong> account (sign up at paypal.com if you don&apos;t have one).</li>
              <li>
                Log into{' '}
                <a
                  href="https://developer.paypal.com/dashboard/applications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline inline-flex items-center"
                >
                  developer.paypal.com <ExternalLink className="w-3 h-3 ml-1" />
                </a>{' '}
                with that account.
              </li>
              <li>Go to <strong>Apps &amp; Credentials</strong> and switch to the <strong>Live</strong> tab (not Sandbox &mdash; Sandbox is fake test money).</li>
              <li>Click <strong>Create App</strong>, name it anything (e.g. &quot;Beth Shalom Fairfield Website&quot;).</li>
              <li>Copy the <strong>Client ID</strong> shown and paste it above. You do not need the Secret &mdash; this site never uses it.</li>
            </ol>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
