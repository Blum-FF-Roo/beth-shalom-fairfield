'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LazyYouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

export default function LazyYouTubeEmbed({ videoId, title, className = '' }: LazyYouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (isLoaded) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        className={`w-full h-full ${className}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div 
      className={`relative cursor-pointer group ${className}`}
      onClick={handleLoad}
    >
      {/* YouTube thumbnail */}
      <Image
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized
      />
      
      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200" />
      
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-red-600 group-hover:bg-red-700 rounded-full p-4 transition-colors duration-200">
          <svg 
            className="w-8 h-8 text-white ml-1" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      
      {/* Duration badge (optional) */}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded">
        Video
      </div>
    </div>
  );
}