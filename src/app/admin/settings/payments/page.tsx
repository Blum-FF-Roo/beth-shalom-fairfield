'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, ExternalLink } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import { useToast } from '@/app/utils/ToastContext';
import { getContent, setContent } from '@/app/utils/firebase-operations';
import { PAYPAL_CLIENT_ID_KEY, PAYPAL_BUSINESS_EMAIL_KEY, PAYPAL_SANDBOX_MODE_KEY } from '@/app/utils/usePayPalConfig';

export default function PaymentSettingsPage() {
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [clientId, setClientId] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [sandboxMode, setSandboxMode] = useState(false);

  const { data: currentClientId, isLoading } = useQuery({
    queryKey: ['content', PAYPAL_CLIENT_ID_KEY],
    queryFn: () => getContent(PAYPAL_CLIENT_ID_KEY),
  });
  const { data: currentBusinessEmail, isLoading: isLoadingBusinessEmail } = useQuery({
    queryKey: ['content', PAYPAL_BUSINESS_EMAIL_KEY],
    queryFn: () => getContent(PAYPAL_BUSINESS_EMAIL_KEY),
  });
  const { data: currentSandboxMode, isLoading: isLoadingSandboxMode } = useQuery({
    queryKey: ['content', PAYPAL_SANDBOX_MODE_KEY],
    queryFn: () => getContent(PAYPAL_SANDBOX_MODE_KEY),
  });

  useEffect(() => {
    if (typeof currentClientId === 'string') {
      setClientId(currentClientId);
    }
  }, [currentClientId]);

  useEffect(() => {
    if (typeof currentBusinessEmail === 'string') {
      setBusinessEmail(currentBusinessEmail);
    }
  }, [currentBusinessEmail]);

  useEffect(() => {
    setSandboxMode(currentSandboxMode === 'true');
  }, [currentSandboxMode]);

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

  const saveCartSettingsMutation = useMutation({
    mutationFn: async ({ email, sandbox }: { email: string; sandbox: boolean }) => {
      await setContent(PAYPAL_BUSINESS_EMAIL_KEY, email.trim());
      await setContent(PAYPAL_SANDBOX_MODE_KEY, sandbox ? 'true' : 'false');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', PAYPAL_BUSINESS_EMAIL_KEY] });
      queryClient.invalidateQueries({ queryKey: ['content', PAYPAL_SANDBOX_MODE_KEY] });
      showSuccess('Saved', 'Shopping cart checkout settings have been updated.');
    },
    onError: (error) => {
      console.error('Error saving PayPal business email:', error);
      showError('Save Failed', 'Failed to save the shopping cart checkout settings. Please try again.');
    },
  });

  const isLivePlaceholder = clientId.trim() === '' || clientId.trim() === 'test';
  const isCartLoading = isLoadingBusinessEmail || isLoadingSandboxMode;

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
            <h2 className="text-lg font-bold text-gray-900 mb-1">Shopping Cart Checkout</h2>
            <p className="text-sm text-gray-600 mb-4">
              Used by the header shopping cart (currently the High Holy Days tickets). Clicking &quot;Checkout with PayPal&quot; opens a real PayPal page in a new tab &mdash; no developer app or Client ID needed, just your PayPal email address.
            </p>

            <label htmlFor="paypal-business-email" className="block text-sm font-medium text-gray-700 mb-2">
              PayPal Business Email
            </label>
            {isCartLoading ? (
              <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
            ) : (
              <input
                id="paypal-business-email"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="bethshalomfairfield@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              />
            )}
            <p className="mt-2 text-xs text-gray-500">
              The PayPal account that receives ticket/donation payments. Must be a real PayPal account email (business or personal).
            </p>

            <label className="flex items-center gap-2 mt-4 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={sandboxMode}
                onChange={(e) => setSandboxMode(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              Use PayPal Sandbox (for safe testing &mdash; no real charges)
            </label>
            <p className="mt-1 text-xs text-gray-500">
              When checked, enter a <strong>Sandbox</strong> test account email instead (from{' '}
              <a
                href="https://developer.paypal.com/dashboard/accounts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline inline-flex items-center"
              >
                developer.paypal.com/dashboard/accounts <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              ) above, so you can test the full checkout without spending real money. Remember to uncheck this and restore the real email when you&apos;re done testing.
            </p>

            {!isCartLoading && (
              <div className={`mt-3 text-xs px-3 py-2 rounded-md ${sandboxMode ? 'bg-yellow-50 text-yellow-800' : businessEmail.trim() ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                {sandboxMode
                  ? 'Sandbox mode is ON — checkout goes to PayPal’s sandbox, no real payments are possible.'
                  : businessEmail.trim()
                    ? 'Live mode — checkout will accept real payments to this email.'
                    : 'No business email set — the cart checkout button will show as unavailable.'}
              </div>
            )}

            <button
              onClick={() => saveCartSettingsMutation.mutate({ email: businessEmail, sandbox: sandboxMode })}
              disabled={saveCartSettingsMutation.isPending || isCartLoading}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#F58C28' }}
            >
              {saveCartSettingsMutation.isPending ? (
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Legacy PayPal Checkout</h2>
            <p className="text-sm text-gray-600 mb-4">
              Used by the older Donate, Passover, and Membership checkout forms (not yet migrated to the shopping cart above).
            </p>
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
