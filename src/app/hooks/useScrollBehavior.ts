'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseScrollBehaviorOptions {
  threshold?: number;
  debounce?: number;
}

export function useScrollBehavior({ 
  threshold = 10, 
  debounce = 10 
}: UseScrollBehaviorOptions = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    setIsScrolled(currentScrollY > threshold);
    
    if (Math.abs(currentScrollY - scrollY) > debounce) {
      setScrollDirection(currentScrollY > scrollY ? 'down' : 'up');
      setScrollY(currentScrollY);
    }
  }, [scrollY, threshold, debounce]);

  useEffect(() => {
    // Set initial scroll position
    setScrollY(window.scrollY);
    setIsScrolled(window.scrollY > threshold);

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, threshold]);

  return {
    isScrolled,
    scrollY,
    scrollDirection
  };
}