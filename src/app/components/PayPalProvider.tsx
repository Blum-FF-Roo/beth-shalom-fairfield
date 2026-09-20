'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import { usePayPalConfig } from "@/app/utils/usePayPalConfig";

interface PayPalProviderProps {
  children: React.ReactNode;
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { clientId, isLoading } = usePayPalConfig();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Wait for the real clientId to resolve before ever mounting the PayPal
  // SDK -- PayPalScriptProvider loads its <script> tag once on mount and
  // does not reload it if options change afterward, so mounting early with
  // a placeholder "test" id would lock the page into sandbox mode even
  // after the real id loads a moment later.
  if (!isMounted || isLoading) {
    return <>{children}</>;
  }

  return (
    <PayPalScriptProvider
      key={clientId}
      options={{
        clientId,
        currency: "USD",
        intent: "capture"
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}