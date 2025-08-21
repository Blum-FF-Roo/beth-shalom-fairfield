import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentSection } from '@/types/content';
import { contentSections } from '@/data/content-sections';

const CONTENT_COLLECTION = 'content_sections';

// Server-side content fetching (for Server Components)
export async function getContentByKey(key: string): Promise<unknown> {
  try {
    // First try to get from Firestore
    const querySnapshot = await getDocs(collection(db, CONTENT_COLLECTION));
    const sections = querySnapshot.docs.map(doc => doc.data()) as ContentSection[];
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

// Get multiple content sections server-side
export async function getMultipleContentByKeys(keys: string[]): Promise<Record<string, unknown>> {
  try {
    const querySnapshot = await getDocs(collection(db, CONTENT_COLLECTION));
    const sections = querySnapshot.docs.map(doc => doc.data()) as ContentSection[];
    
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