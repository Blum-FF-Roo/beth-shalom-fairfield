'use client';

import { useQuery } from '@tanstack/react-query';
import { getContent } from './firebase-operations';

export const PAYPAL_CLIENT_ID_KEY = 'paypalClientId';

/**
 * Reads the PayPal Client ID set via Admin > Payment Settings, falling back
 * to the NEXT_PUBLIC_PAYPAL_CLIENT_ID env var (kept for backwards
 * compatibility), and finally to PayPal's own sandbox "test" client ID.
 */
export function usePayPalConfig() {
  const { data, isLoading } = useQuery({
    queryKey: ['content', PAYPAL_CLIENT_ID_KEY],
    queryFn: () => getContent(PAYPAL_CLIENT_ID_KEY),
  });

  const firestoreClientId = typeof data === 'string' ? data.trim() : '';
  const envClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const envIsReal = !!envClientId && envClientId !== 'test-mock-client-id';

  const isConfigured = !!firestoreClientId || envIsReal;
  const clientId = firestoreClientId || (envIsReal ? envClientId : 'test');

  return { clientId, isConfigured, isLoading };
}
