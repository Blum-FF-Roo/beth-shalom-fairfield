'use client';

import Link from 'next/link';

interface HoverButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function HoverButton({ href, children, variant = 'primary' }: HoverButtonProps) {
  if (variant === 'secondary') {
    return (
      <Link
        href={href}
        className="inline-flex items-center px-6 py-3 border-2 text-base font-medium rounded-md transition-colors duration-200"
        style={{ 
          borderColor: '#F58C28', 
          color: '#F58C28' 
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F58C28';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#F58C28';
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors duration-200"
      style={{ backgroundColor: '#F58C28' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E67C1F'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F58C28'}
    >
      {children}
    </Link>
  );
}