'use client';

import { useState, useEffect, useCallback } from 'react';
import { getContentSectionByKey } from '@/lib/content-schema';

/**
 * Hook for components that need to refresh their content when admin updates occur
 * @param key - The content section key to watch for updates
 * @returns [content, loading, refreshContent]
 */
export function useContentRefresh<T = unknown>(key: string): [T | null, boolean, () => void] {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const section = await getContentSectionByKey(key);
      setContent(section?.content as T || null);
    } catch (error) {
      console.error(`Failed to load content for key "${key}":`, error);
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const refreshContent = useCallback(() => {
    loadContent();
  }, [loadContent]);

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Listen for content updates
  useEffect(() => {
    const handleContentUpdate = (event: CustomEvent) => {
      const { key: updatedKey } = event.detail;
      // Refresh if this key was updated, or if all content was refreshed
      if (!updatedKey || updatedKey === key) {
        loadContent();
      }
    };

    window.addEventListener('contentUpdated', handleContentUpdate as EventListener);
    return () => window.removeEventListener('contentUpdated', handleContentUpdate as EventListener);
  }, [key, loadContent]);

  // Listen for global content refresh events
  useEffect(() => {
    const handleGlobalRefresh = () => {
      loadContent();
    };

    window.addEventListener('refreshAllContent', handleGlobalRefresh);
    return () => window.removeEventListener('refreshAllContent', handleGlobalRefresh);
  }, [loadContent]);

  return [content, loading, refreshContent];
}