'use client';

import { memo } from 'react';

// Base skeleton component with accessibility
const SkeletonBase = memo(({ className }: { className?: string }) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded ${className || ''}`}
    role="progressbar"
    aria-label="Loading content"
  />
));

SkeletonBase.displayName = 'SkeletonBase';

// Hero slider skeleton
export const HeroSliderSkeleton = memo(() => (
  <div className="relative w-full h-156 overflow-hidden bg-gray-300 animate-pulse">
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        {/* Title skeleton */}
        <SkeletonBase className="h-12 md:h-16 w-3/4 mx-auto" />
        {/* Description skeleton */}
        <div className="space-y-2">
          <SkeletonBase className="h-6 w-full max-w-2xl mx-auto" />
          <SkeletonBase className="h-6 w-4/5 max-w-2xl mx-auto" />
        </div>
        {/* Button skeleton */}
        <SkeletonBase className="h-12 w-32 mx-auto mt-6" />
      </div>
    </div>
    {/* Pagination dots skeleton */}
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
      {[...Array(3)].map((_, i) => (
        <SkeletonBase key={i} className="w-3 h-3 rounded-full" />
      ))}
    </div>
  </div>
));

HeroSliderSkeleton.displayName = 'HeroSliderSkeleton';

// About section skeleton
export const AboutSectionSkeleton = memo(() => (
  <section className="py-12 bg-white">
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-gray-50 rounded-lg p-8 md:p-12">
        <div className="text-center mb-8">
          <SkeletonBase className="h-10 w-32 mx-auto mb-4" />
        </div>
        <div className="space-y-4">
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-11/12" />
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-3/4" />
          <div className="mt-8 pt-6 border-t border-gray-200">
            <SkeletonBase className="h-6 w-24" />
          </div>
        </div>
      </div>
    </div>
  </section>
));

AboutSectionSkeleton.displayName = 'AboutSectionSkeleton';

// Programs section skeleton
export const ProgramsSectionSkeleton = memo(() => (
  <section className="py-12 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <SkeletonBase className="h-10 w-40 mx-auto mb-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <SkeletonBase className="h-48 w-full" />
            <div className="p-6 text-center">
              <SkeletonBase className="h-6 w-32 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

ProgramsSectionSkeleton.displayName = 'ProgramsSectionSkeleton';

// Admin card skeleton
export const AdminCardSkeleton = memo(() => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <SkeletonBase className="h-6 w-32 mb-2" />
        <SkeletonBase className="h-4 w-24 mb-1" />
        <SkeletonBase className="h-4 w-20" />
      </div>
      <SkeletonBase className="h-8 w-16" />
    </div>
    <div className="space-y-2">
      <SkeletonBase className="h-3 w-full" />
      <SkeletonBase className="h-3 w-3/4" />
    </div>
  </div>
));

AdminCardSkeleton.displayName = 'AdminCardSkeleton';

// Post list skeleton
export const PostListSkeleton = memo(() => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start space-x-4">
          <SkeletonBase className="w-16 h-16 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBase className="h-6 w-3/4" />
            <SkeletonBase className="h-4 w-1/2" />
            <SkeletonBase className="h-4 w-full" />
            <SkeletonBase className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    ))}
  </div>
));

PostListSkeleton.displayName = 'PostListSkeleton';

// Header logo skeleton
export const HeaderLogoSkeleton = memo(() => (
  <div className="flex items-center space-x-2 lg:space-x-2 p-2">
    <div className="relative w-12 h-12 lg:w-12 lg:h-12 xl:w-18 xl:h-18 flex-shrink-0 bg-gray-200 rounded-full animate-pulse" />
    <div className="flex flex-col justify-center space-y-1">
      <SkeletonBase className="h-6 w-48" />
      <SkeletonBase className="h-4 w-40" />
    </div>
  </div>
));

HeaderLogoSkeleton.displayName = 'HeaderLogoSkeleton';

// Generic list skeleton
export const ListSkeleton = memo(({ items = 5 }: { items?: number }) => (
  <div className="space-y-4">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
        <SkeletonBase className="w-12 h-12 rounded" />
        <div className="flex-1 space-y-2">
          <SkeletonBase className="h-5 w-1/2" />
          <SkeletonBase className="h-4 w-3/4" />
        </div>
        <SkeletonBase className="h-8 w-16" />
      </div>
    ))}
  </div>
));

ListSkeleton.displayName = 'ListSkeleton';

// Generic text skeleton
export const TextSkeleton = memo(({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <SkeletonBase 
        key={i} 
        className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
));

TextSkeleton.displayName = 'TextSkeleton';