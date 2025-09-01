'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

// Default error UI component
const DefaultErrorFallback = ({ 
  error, 
  retry, 
  showDetails = false 
}: { 
  error: Error; 
  retry: () => void; 
  showDetails?: boolean;
}) => (
  <div 
    className="min-h-[400px] flex items-center justify-center p-8"
    role="alert"
    aria-live="assertive"
  >
    <div className="text-center max-w-md">
      <div className="mb-6">
        <AlertTriangle 
          className="h-16 w-16 text-red-500 mx-auto mb-4" 
          aria-hidden="true"
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. Please try refreshing the page or contact us if the problem persists.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={retry}
          className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          aria-label="Retry loading the content"
        >
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          Try Again
        </button>
        
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Go to homepage"
        >
          <Home className="h-4 w-4 mr-2" aria-hidden="true" />
          Go Home
        </Link>
      </div>

      {showDetails && process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
            Error Details (Development)
          </summary>
          <div className="bg-gray-100 rounded-lg p-4 text-sm font-mono text-gray-800 overflow-auto max-h-40">
            <div className="mb-2">
              <strong>Error:</strong> {error.message}
            </div>
            {error.stack && (
              <div>
                <strong>Stack:</strong>
                <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  </div>
);

// Main Error Boundary Class Component
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { errorInfo } });
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.retry);
      }

      // Use default fallback
      return (
        <DefaultErrorFallback 
          error={this.state.error} 
          retry={this.retry}
          showDetails={this.props.showDetails}
        />
      );
    }

    return this.props.children;
  }
}

// Specific error boundaries for common use cases
export function SectionErrorBoundary({ 
  children, 
  title 
}: { 
  children: ReactNode; 
  title?: string; 
}) {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            {title && (
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {title}
                </h2>
              </div>
            )}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-700 mb-4">
                Unable to load this section. Please try again.
              </p>
              <button
                onClick={retry}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export function CardErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 text-sm mb-3">Failed to load content</p>
          <button
            onClick={retry}
            className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}