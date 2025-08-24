import { getAllContentSections } from '@/lib/content-schema';
import { ContentSection } from '@/types/content';

// Server-side content fetching (for Server Components)
export async function getContentByKey(key: string): Promise<unknown> {
  try {
    // Use cached sections to avoid redundant Firebase calls
    const sections = await getCachedSections();
    
    const section = sections.find(s => s.key === key);
    
    if (section) {
      return section.content;
    }
    
    // No fallback - all content should be in database
    console.warn(`Content section not found for key "${key}"`);
    return null;
  } catch (error) {
    console.error(`Error fetching content for key "${key}":`, error);
    return null;
  }
}

// Cached query result to avoid multiple Firebase calls
let cachedQueryResult: { sections: ContentSection[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all sections with caching
async function getCachedSections(): Promise<ContentSection[]> {
  const now = Date.now();
  
  // Return cached result if still valid
  if (cachedQueryResult && (now - cachedQueryResult.timestamp) < CACHE_DURATION) {
    return cachedQueryResult.sections;
  }
  
  // Fetch fresh data from database
  const sections = await getAllContentSections();
  
  // Update cache
  cachedQueryResult = { sections, timestamp: now };
  
  return sections;
}

// Cache invalidation function
export function clearContentCache(): void {
  cachedQueryResult = null;
  console.log('Content cache cleared');
}

// Get multiple content sections server-side with batch loading
export async function getMultipleContentByKeys(keys: string[]): Promise<Record<string, unknown>> {
  try {
    const sections = await getCachedSections();
    
    const contentMap: Record<string, unknown> = {};
    
    for (const key of keys) {
      const section = sections.find(s => s.key === key);
      if (section) {
        contentMap[key] = section.content;
      } else {
        console.warn(`Content section not found for key "${key}"`);
        contentMap[key] = null;
      }
    }
    
    return contentMap;
  } catch (error) {
    console.error('Error fetching multiple content sections:', error);
    
    // Return nulls on error - no static fallbacks
    const contentMap: Record<string, unknown> = {};
    for (const key of keys) {
      contentMap[key] = null;
    }
    return contentMap;
  }
}

// Lightweight function to check if content exists (for conditional rendering)
export async function contentExists(key: string): Promise<boolean> {
  try {
    const sections = await getCachedSections();
    return sections.some(s => s.key === key);
  } catch (error) {
    console.error(`Error checking if content exists for key "${key}":`, error);
    return false;
  }
}