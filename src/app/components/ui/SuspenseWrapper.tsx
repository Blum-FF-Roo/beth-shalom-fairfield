'use client';

import { Suspense, ReactNode } from 'react';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

// Default loading component with accessibility
const DefaultFallback = ({ className }: { className?: string }) => (
  <div 
    className={`flex items-center justify-center py-8 ${className || ''}`}
    role="status"
    aria-label="Loading content"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

// Reusable Suspense wrapper with consistent fallback patterns
export default function SuspenseWrapper({ 
  children, 
  fallback, 
  className 
}: SuspenseWrapperProps) {
  return (
    <Suspense fallback={fallback || <DefaultFallback className={className} />}>
      {children}
    </Suspense>
  );
}

// Specific wrappers for common use cases
export function SuspenseSection({ 
  children, 
  title 
}: { 
  children: ReactNode; 
  title?: string; 
}) {
  return (
    <SuspenseWrapper 
      fallback={
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            {title && (
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {title}
                </h2>
              </div>
            )}
            <DefaultFallback />
          </div>
        </section>
      }
    >
      {children}
    </SuspenseWrapper>
  );
}

export function SuspenseCard({ children }: { children: ReactNode }) {
  return (
    <SuspenseWrapper 
      fallback={
        <div className="bg-white rounded-lg shadow-md p-6">
          <DefaultFallback />
        </div>
      }
    >
      {children}
    </SuspenseWrapper>
  );
}