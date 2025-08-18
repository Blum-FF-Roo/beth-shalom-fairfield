import { useState, useEffect } from 'react';
import { getContentSectionByKey, initializeContentSections } from '@/lib/content';
import { ContentSection } from '@/types/content';

// Hook to get content by key with fallback to static data
export function useContent(key: string, fallbackContent?: unknown) {
  const [content, setContent] = useState<unknown>(fallbackContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize content sections if they don't exist
        await initializeContentSections();
        
        // Get content section by key
        const section = await getContentSectionByKey(key);
        
        if (mounted) {
          if (section) {
            setContent(section.content);
          } else {
            // Use fallback content if section doesn't exist
            setContent(fallbackContent);
          }
        }
      } catch (err) {
        console.error(`Error loading content for key "${key}":`, err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load content');
          // Use fallback content on error
          setContent(fallbackContent);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      mounted = false;
    };
  }, [key, fallbackContent]);

  return { content, loading, error };
}

// Hook to get multiple content sections at once
export function useMultipleContent(keys: string[], fallbackData: Record<string, unknown> = {}) {
  const [content, setContent] = useState<Record<string, unknown>>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize content sections if they don't exist
        await initializeContentSections();
        
        // Load all content sections
        const contentMap: Record<string, unknown> = { ...fallbackData };
        
        await Promise.all(
          keys.map(async (key) => {
            try {
              const section = await getContentSectionByKey(key);
              if (section) {
                contentMap[key] = section.content;
              }
            } catch (err) {
              console.error(`Error loading content for key "${key}":`, err);
              // Keep fallback data for this key
            }
          })
        );
        
        if (mounted) {
          setContent(contentMap);
        }
      } catch (err) {
        console.error('Error loading multiple content sections:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load content');
          // Use fallback content on error
          setContent(fallbackData);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      mounted = false;
    };
  }, [keys.join(','), JSON.stringify(fallbackData)]);

  return { content, loading, error };
}