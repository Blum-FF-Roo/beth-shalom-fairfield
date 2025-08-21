import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentSection, ContactInfo, SlideItem, ContentPermission } from '@/types/content';

const CONTENT_COLLECTION = 'content_sections';
const PERMISSIONS_COLLECTION = 'content_permissions';

// Create a new content section
export async function createContentSection(
  sectionData: Omit<ContentSection, 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<ContentSection> {
  try {
    const now = new Date();
    const contentSection: ContentSection = {
      ...sectionData,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    };

    const docRef = doc(db, CONTENT_COLLECTION, contentSection.id);
    await setDoc(docRef, contentSection);
    
    return contentSection;
  } catch (error) {
    console.error('Error creating content section:', error);
    throw error;
  }
}

// Get all content sections from database
export async function getAllContentSections(): Promise<ContentSection[]> {
  try {
    const querySnapshot = await getDocs(collection(db, CONTENT_COLLECTION));
    
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
    console.error('Error fetching all content sections:', error);
    throw error;
  }
}

// Get content section by key
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

// Get content section by ID
export async function getContentSectionById(id: string): Promise<ContentSection | null> {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, id);
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
    return null;
  }
}

// Update content section
export async function updateContentSection(
  id: string,
  updates: Partial<Omit<ContentSection, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>>,
  userId: string
): Promise<void> {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, id);
    const updateData = {
      ...updates,
      updatedAt: new Date(),
      updatedBy: userId,
    };
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating content section:', error);
    throw error;
  }
}

// Update only content (most common operation)
export async function updateContentSectionContent(
  id: string,
  content: string | ContactInfo | SlideItem[] | string[],
  userId: string
): Promise<void> {
  return updateContentSection(id, { content }, userId);
}

// Delete content section
export async function deleteContentSection(id: string): Promise<void> {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting content section:', error);
    throw error;
  }
}

// Check if a content section key already exists
export async function contentSectionKeyExists(key: string, excludeId?: string): Promise<boolean> {
  try {
    const sections = await getAllContentSections();
    return sections.some(s => s.key === key && s.id !== excludeId);
  } catch (error) {
    console.error('Error checking if content section key exists:', error);
    return false;
  }
}

// Get content sections by category
export async function getContentSectionsByCategory(category: ContentSection['category']): Promise<ContentSection[]> {
  try {
    const sections = await getAllContentSections();
    return sections.filter(s => s.category === category);
  } catch (error) {
    console.error(`Error fetching content sections for category "${category}":`, error);
    return [];
  }
}

// Content Permission Functions

// Check if user has permission to edit content section
export async function userHasContentPermission(
  userId: string,
  contentSectionId: string
): Promise<boolean> {
  try {
    const permissionId = `${userId}_${contentSectionId}`;
    const docRef = doc(db, PERMISSIONS_COLLECTION, permissionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const permission = docSnap.data() as ContentPermission;
      return permission.canEdit;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking content permission:', error);
    return false;
  }
}

// Get all permissions for a user
export async function getUserContentPermissions(userId: string): Promise<ContentPermission[]> {
  try {
    const q = query(
      collection(db, PERMISSIONS_COLLECTION),
      where('userId', '==', userId),
      where('canEdit', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      grantedAt: doc.data().grantedAt?.toDate() || new Date()
    })) as ContentPermission[];
  } catch (error) {
    console.error('Error fetching user content permissions:', error);
    return [];
  }
}

// Grant content permission to a user
export async function grantContentPermission(
  userId: string,
  contentSectionId: string,
  grantedBy: string
): Promise<void> {
  try {
    const permissionId = `${userId}_${contentSectionId}`;
    const permission: ContentPermission = {
      userId,
      contentSectionId,
      canEdit: true,
      grantedAt: new Date(),
      grantedBy
    };
    
    const docRef = doc(db, PERMISSIONS_COLLECTION, permissionId);
    await setDoc(docRef, permission);
  } catch (error) {
    console.error('Error granting content permission:', error);
    throw error;
  }
}

// Revoke content permission from a user
export async function revokeContentPermission(
  userId: string,
  contentSectionId: string
): Promise<void> {
  try {
    const permissionId = `${userId}_${contentSectionId}`;
    const docRef = doc(db, PERMISSIONS_COLLECTION, permissionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error revoking content permission:', error);
    throw error;
  }
}