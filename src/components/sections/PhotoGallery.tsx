'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LazyImage from '@/components/ui/LazyImage';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { latestPhotos } from '@/data/site-data';

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const goToPrevious = () => {
    if (selectedPhoto === null) return;
    setSelectedPhoto((selectedPhoto - 1 + latestPhotos.length) % latestPhotos.length);
  };

  const goToNext = () => {
    if (selectedPhoto === null) return;
    setSelectedPhoto((selectedPhoto + 1) % latestPhotos.length);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedPhoto === null) return;
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
    }
  };

  if (latestPhotos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Latest Photos
          </h2>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {latestPhotos.slice(0, 18).map((photo, index) => (
            <div
              key={photo.id}
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square bg-gray-300 rounded-lg overflow-hidden relative">
                <LazyImage
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* See More Photos Link */}
        <div className="text-center">
          <Link
            href="/photos"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            See More Photos
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          {latestPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-60"
              >
                <ChevronLeft size={48} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-60"
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}

          {/* Image Container */}
          <div 
            className="max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={latestPhotos[selectedPhoto].imageUrl}
                alt={latestPhotos[selectedPhoto].title}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
                priority
              />
              
              {/* Image Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">
                  {latestPhotos[selectedPhoto].title}
                </h3>
                <p className="text-sm text-gray-300">
                  {new Date(latestPhotos[selectedPhoto].createdDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Photo Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedPhoto + 1} of {latestPhotos.length}
          </div>
        </div>
      )}
    </section>
  );
}