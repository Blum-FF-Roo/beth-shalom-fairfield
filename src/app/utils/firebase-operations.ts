import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Collections
const CONTENT_COLLECTION = 'site_content';
const SECTIONS_COLLECTION = 'content_sections';

// Type definitions
export interface ContentSection {
  id: string;
  key: string;
  title: string;
  description: string;
  type: 'text' | 'rich_text' | 'list' | 'contact' | 'slide_array' | 'toggle' | 'image';
  category: string;
  content: unknown;
  defaultContent?: unknown;
  isEditable: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}



// Simple content operations
export async function getContent(key: string): Promise<unknown> {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, key);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data()?.value;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting content for key ${key}:`, error);
    throw error;
  }
}

export async function setContent(key: string, value: unknown): Promise<void> {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, key);
    await setDoc(docRef, { 
      value, 
      updatedAt: new Date(),
      key
    });
  } catch (error) {
    console.error(`Error setting content for key ${key}:`, error);
    throw error;
  }
}

export async function getMultipleContentByKeys(keys: string[]): Promise<Record<string, unknown>> {
  try {
    const results: Record<string, unknown> = {};
    
    // First try to get content from site_content collection
    for (const key of keys) {
      const content = await getContent(key);
      results[key] = content;
    }
    
    // For any keys that returned null, fallback to content_sections (like the old implementation)
    const missingKeys = keys.filter(key => results[key] === null);
    
    if (missingKeys.length > 0) {
      const contentSections = await getAllContentSections();
      
      for (const key of missingKeys) {
        const section = contentSections.find(s => s.key === key);
        if (section && section.content !== null && section.content !== undefined) {
          results[key] = section.content;
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error getting multiple content:', error);
    throw error;
  }
}

// Content sections for admin management
export async function getAllContentSections(): Promise<ContentSection[]> {
  try {
    const querySnapshot = await getDocs(collection(db, SECTIONS_COLLECTION));
    
    const sections = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    }) as ContentSection[];
    
    return sections;
  } catch (error) {
    console.error('Error fetching content sections:', error);
    throw error;
  }
}

export async function getContentSectionById(id: string): Promise<ContentSection | null> {
  try {
    const docRef = doc(db, SECTIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    } as ContentSection;
  } catch (error) {
    console.error(`Error fetching content section with ID "${id}":`, error);
    throw error;
  }
}

export async function getContentSectionByKey(key: string): Promise<ContentSection | null> {
  try {
    const sections = await getAllContentSections();
    const section = sections.find(s => s.key === key);
    return section || null;
  } catch (error) {
    console.error(`Error fetching content section for key "${key}":`, error);
    return null;
  }
}

export async function updateContentSection(id: string, updates: Partial<ContentSection>): Promise<void> {
  try {
    const docRef = doc(db, SECTIONS_COLLECTION, id);
    await setDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating content section:', error);
    throw error;
  }
}

export async function createContentSection(section: Omit<ContentSection, 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const docRef = doc(db, SECTIONS_COLLECTION, section.id);
    await setDoc(docRef, {
      ...section,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error creating content section:', error);
    throw error;
  }
}

export async function deleteContentSection(id: string): Promise<void> {
  try {
    const docRef = doc(db, SECTIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting content section:', error);
    throw error;
  }
}