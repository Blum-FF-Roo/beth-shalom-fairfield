import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentSection } from '@/types/content';
import { contentSections } from '@/data/content-sections';

const CONTENT_COLLECTION = 'content_sections';

// Server-side content fetching (for Server Components)
export async function getContentByKey(key: string): Promise<unknown> {
  try {
    // Use cached sections to avoid redundant Firebase calls
    const sections = await getCachedSections();
    
    const section = sections.find(s => s.key === key);
    
    if (section) {
      return section.content;
    }
    // Fallback to default content from static data
    const defaultSection = contentSections.find(s => s.key === key);
    return defaultSection?.defaultContent || null;
  } catch (error) {
    console.error(`Error fetching content for key "${key}":`, error);
    
    // Return static fallback on error
    const defaultSection = contentSections.find(s => s.key === key);
    return defaultSection?.defaultContent || null;
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
  
  // Fetch fresh data
  const querySnapshot = await getDocs(collection(db, CONTENT_COLLECTION));
  const sections = querySnapshot.docs.map(doc => doc.data()) as ContentSection[];
  
  // Update cache
  cachedQueryResult = { sections, timestamp: now };
  
  return sections;
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
        // Use default content as fallback
        const defaultSection = contentSections.find(s => s.key === key);
        if (defaultSection) {
          contentMap[key] = defaultSection.defaultContent;
        }
      }
    }
    
    return contentMap;
  } catch (error) {
    console.error('Error fetching multiple content sections:', error);
    
    // Return static fallbacks on error
    const contentMap: Record<string, unknown> = {};
    for (const key of keys) {
      const defaultSection = contentSections.find(s => s.key === key);
      if (defaultSection) {
        contentMap[key] = defaultSection.defaultContent;
      }
    }
    return contentMap;
  }
}

// Lightweight function to check if content exists (for conditional rendering)
export async function contentExists(key: string): Promise<boolean> {
  try {
    const querySnapshot = await getDocs(collection(db, CONTENT_COLLECTION));
    const sections = querySnapshot.docs.map(doc => doc.data()) as ContentSection[];
    return sections.some(s => s.key === key);
  } catch (error) {
    console.error(`Error checking if content exists for key "${key}":`, error);
    return contentSections.some(s => s.key === key);
  }
}