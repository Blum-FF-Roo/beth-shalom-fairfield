'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  url?: string;
  title?: string;
  className?: string;
}

export default function ShareButton({ url, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        copied 
          ? 'text-green-700 bg-green-100 border border-green-300' 
          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </>
      )}
    </button>
  );
}