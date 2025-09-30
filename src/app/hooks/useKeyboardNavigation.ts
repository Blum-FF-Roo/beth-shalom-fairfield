'use client';

import { useEffect, useCallback, RefObject } from 'react';

interface UseKeyboardNavigationOptions {
  containerRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: (event: KeyboardEvent) => void;
  disabled?: boolean;
}

export function useKeyboardNavigation({
  containerRef,
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onTab,
  disabled = false
}: UseKeyboardNavigationOptions = {}) {
  
  const handleKeyDown = useCallback((event: Event) => {
    const keyboardEvent = event as KeyboardEvent;
    if (disabled) return;

    switch (keyboardEvent.key) {
      case 'Escape':
        if (onEscape) {
          keyboardEvent.preventDefault();
          onEscape();
        }
        break;
      
      case 'Enter':
      case ' ': // Space key
        if (onEnter) {
          keyboardEvent.preventDefault();
          onEnter();
        }
        break;
      
      case 'ArrowUp':
        if (onArrowUp) {
          keyboardEvent.preventDefault();
          onArrowUp();
        }
        break;
      
      case 'ArrowDown':
        if (onArrowDown) {
          keyboardEvent.preventDefault();
          onArrowDown();
        }
        break;
      
      case 'ArrowLeft':
        if (onArrowLeft) {
          keyboardEvent.preventDefault();
          onArrowLeft();
        }
        break;
      
      case 'ArrowRight':
        if (onArrowRight) {
          keyboardEvent.preventDefault();
          onArrowRight();
        }
        break;
      
      case 'Tab':
        if (onTab) {
          onTab(keyboardEvent);
        }
        break;
      
      default:
        break;
    }
  }, [disabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab]);

  useEffect(() => {
    const element = containerRef?.current || document;
    
    element.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, containerRef]);

  return { handleKeyDown };
}

// Hook for managing focus trap in modals/dropdowns
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean = true
) {
  const getFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    
    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  const handleTab = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current || !isActive) return;

    const focusableElements = getFocusableElements(containerRef.current);
    
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab (forward)
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [containerRef, isActive, getFocusableElements]);

  useKeyboardNavigation({
    containerRef,
    onTab: handleTab,
    disabled: !isActive
  });

  // Focus first element when trap becomes active
  useEffect(() => {
    if (isActive && containerRef.current) {
      const focusableElements = getFocusableElements(containerRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isActive, containerRef, getFocusableElements]);
}