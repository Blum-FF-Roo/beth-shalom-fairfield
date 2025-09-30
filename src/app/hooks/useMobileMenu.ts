'use client';

import { useState, useEffect, useCallback, RefObject } from 'react';
import { useFocusTrap } from './useKeyboardNavigation';

interface UseMobileMenuOptions {
  closeOnRouteChange?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;
  containerRef: RefObject<HTMLElement | null>;
}

export function useMobileMenu({
  closeOnRouteChange = true,
  closeOnEscape = true,
  trapFocus = true,
  containerRef
}: UseMobileMenuOptions) {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => {
    setIsOpen(true);
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    // Restore body scroll
    document.body.style.overflow = '';
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen, openMenu, closeMenu]);

  // Close menu on escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, closeMenu]);

  // Close menu on route change (if enabled)
  useEffect(() => {
    if (!closeOnRouteChange) return;

    const handleRouteChange = () => {
      if (isOpen) {
        closeMenu();
      }
    };

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isOpen, closeOnRouteChange, closeMenu]);

  // Focus trap for accessibility  
  useFocusTrap(containerRef, isOpen && trapFocus);

  // Clean up body scroll on unmount
  useEffect(() => {
    return () => {
      if (isOpen) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu
  };
}