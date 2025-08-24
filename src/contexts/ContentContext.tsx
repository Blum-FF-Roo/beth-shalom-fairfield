'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getContentSectionByKey, getAllContentSections } from '@/lib/content-schema';
import { ContentSection } from '@/types/content';

interface ContentContextType {
  getContent: (key: string) => Promise<unknown>;
  refreshContent: (key: string) => void;
  refreshAllContent: () => void;
  isLoading: (key: string) => boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
}

export function ContentProvider({ children }: ContentProviderProps) {
  const [contentCache, setContentCache] = useState<Map<string, unknown>>(new Map());
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());

  const refreshContent = useCallback((key: string) => {
    // Clear from cache
    setContentCache(prev => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });

    // Trigger re-fetch for any components using this content
    window.dispatchEvent(new CustomEvent('contentUpdated', { detail: { key } }));
  }, []);

  const refreshAllContent = useCallback(() => {
    // Clear entire cache
    setContentCache(new Map());
    
    // Trigger re-fetch for all content
    window.dispatchEvent(new CustomEvent('contentUpdated', { detail: { key: null } }));
  }, []);

  // Listen for content refresh events
  useEffect(() => {
    const handleContentRefresh = (event: CustomEvent) => {
      const { key } = event.detail;
      if (key) {
        refreshContent(key);
      } else {
        refreshAllContent();
      }
    };

    window.addEventListener('refreshContent', handleContentRefresh as EventListener);
    return () => window.removeEventListener('refreshContent', handleContentRefresh as EventListener);
  }, [refreshContent, refreshAllContent]);

  const getContent = async (key: string): Promise<unknown> => {
    // Return cached content if available
    if (contentCache.has(key)) {
      return contentCache.get(key);
    }

    // Return null if already loading to prevent duplicate requests
    if (loadingKeys.has(key)) {
      return null;
    }

    try {
      setLoadingKeys(prev => new Set(prev).add(key));
      
      const section = await getContentSectionByKey(key);
      const content = section?.content || null;
      
      // Cache the result
      setContentCache(prev => new Map(prev).set(key, content));
      
      return content;
    } catch (error) {
      console.error(`Failed to load content for key "${key}":`, error);
      return null;
    } finally {
      setLoadingKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const isLoading = (key: string): boolean => {
    return loadingKeys.has(key);
  };

  return (
    <ContentContext.Provider value={{
      getContent,
      refreshContent,
      refreshAllContent,
      isLoading
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}