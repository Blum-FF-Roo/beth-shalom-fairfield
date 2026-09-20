'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import { usePayPalConfig } from "@/app/utils/usePayPalConfig";

interface PayPalProviderProps {
  children: React.ReactNode;
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { clientId } = usePayPalConfig();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <PayPalScriptProvider
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