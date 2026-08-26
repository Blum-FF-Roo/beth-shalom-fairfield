import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { AuthProvider } from "@/app/utils/AuthContext";
import PayPalProvider from "@/app/components/PayPalProvider";
import { ToastProvider } from "@/app/utils/ToastContext";
import ToastContainer from "@/app/components/ui/ToastContainer";
import QueryProvider from "@/app/components/providers/QueryProvider";
import ErrorBoundary from "@/app/components/ui/ErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beth Shalom Fairfield - Jewish Community in Fairfield, Iowa",
  description:
    "Welcome to Beth Shalom Fairfield, a warm and welcoming Jewish community in Fairfield, Iowa. Join us for worship, learning, and community.",
  keywords:
    "Beth Shalom, Fairfield, Iowa, Jewish, synagogue, community, worship, High Holy Days, Parashah",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <ToastProvider>
            <PayPalProvider>
              <AuthProvider>
                <Header />
                <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
                  <main role="main">{children}</main>
                </ErrorBoundary>
                <Footer />
                <ToastContainer />
              </AuthProvider>
            </PayPalProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
