'use client';

import { useQuery } from '@tanstack/react-query';
import { getContent } from './firebase-operations';

export const PAYPAL_BUSINESS_EMAIL_KEY = 'paypalBusinessEmail';
export const PAYPAL_SANDBOX_MODE_KEY = 'paypalSandboxMode';

/**
 * Reads the settings for the shopping-cart checkout (High Holy Days,
 * Passover, Membership, Donate), which uses PayPal's classic redirect-based
 * checkout (a business email, not a developer Client ID) so that clicking
 * "Checkout with PayPal" is a real navigation to paypal.com and correctly
 * recognizes an already-logged-in PayPal account.
 */
export function usePayPalBusinessEmail() {
  const emailQuery = useQuery({
    queryKey: ['content', PAYPAL_BUSINESS_EMAIL_KEY],
    queryFn: () => getContent(PAYPAL_BUSINESS_EMAIL_KEY),
  });
  const sandboxQuery = useQuery({
    queryKey: ['content', PAYPAL_SANDBOX_MODE_KEY],
    queryFn: () => getContent(PAYPAL_SANDBOX_MODE_KEY),
  });

  const businessEmail = typeof emailQuery.data === 'string' ? emailQuery.data.trim() : '';
  const sandboxMode = sandboxQuery.data === 'true';
  const isConfigured = !!businessEmail;
  const isLoading = emailQuery.isLoading || sandboxQuery.isLoading;
  const checkoutUrl = sandboxMode
    ? 'https://www.sandbox.paypal.com/cgi-bin/webscr'
    : 'https://www.paypal.com/cgi-bin/webscr';

  return { businessEmail, sandboxMode, checkoutUrl, isConfigured, isLoading };
}
