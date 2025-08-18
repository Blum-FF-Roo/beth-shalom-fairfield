import { collection, doc, getDocs, getDoc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentSection, ContentPermission } from '@/types/content';
import { contentSections } from '@/data/content-sections';

const CONTENT_COLLECTION = 'content_sections';
const PERMISSIONS_COLLECTION = 'content_permissions';

// Initialize content sections in Firestore if they don't exist
export async function initializeContentSections(): Promise<void> {
  try {
    for (const sectionDef of contentSections) {
      const docRef = doc(db, CONTENT_COLLECTION, sectionDef.id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const contentSection: ContentSection = {
          id: sectionDef.id,
          key: sectionDef.key,
          title: sectionDef.title,
          description: sectionDef.description,
          type: sectionDef.type,
          category: sectionDef.category,
          content: sectionDef.defaultContent,
          isEditable: true,
          updatedAt: new Date(),
          updatedBy: 'system'
        };
        
        await setDoc(docRef, contentSection);
      }
    }
  } catch (error) {
    console.error('Error initializing content sections:', error);
    throw error;
  }
}

// Get all content sections
export async function getAllContentSections(): Promise<ContentSection[]> {
  try {
    const querySnapshot = await getDocs(collection(db, CONTENT_COLLECTION));
    
    const sections = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as ContentSection[];
    
    // Sort on the client side to avoid needing a composite index
    return sections.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error('Error getting content sections:', error);
    throw error;
  }
}

// Get content section by ID
export async function getContentSection(id: string): Promise<ContentSection | null> {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as ContentSection;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting content section:', error);
    throw error;
  }
}

// Get content section by key
export async function getContentSectionByKey(key: string): Promise<ContentSection | null> {
  try {
    const q = query(collection(db, CONTENT_COLLECTION), where('key', '==', key));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as ContentSection;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting content section by key:', error);
    throw error;
  }
}

// Update content section
export async function updateContentSection(
  id: string, 
  content: string | object | string[], 
  userId: string
): Promise<void> {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, id);
    await updateDoc(docRef, {
      content,
      updatedAt: new Date(),
      updatedBy: userId
    });
  } catch (error) {
    console.error('Error updating content section:', error);
    throw error;
  }
}

// Get content sections by category
export async function getContentSectionsByCategory(category: string): Promise<ContentSection[]> {
  try {
    const q = query(
      collection(db, CONTENT_COLLECTION), 
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    
    const sections = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as ContentSection[];
    
    // Sort on the client side
    return sections.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error getting content sections by category:', error);
    throw error;
  }
}

// Permission management functions

// Grant permission to user for content section
export async function grantContentPermission(
  userId: string,
  contentSectionId: string,
  grantedBy: string
): Promise<void> {
  try {
    const permissionId = `${userId}_${contentSectionId}`;
    const docRef = doc(db, PERMISSIONS_COLLECTION, permissionId);
    
    const permission: ContentPermission = {
      userId,
      contentSectionId,
      canEdit: true,
      grantedAt: new Date(),
      grantedBy
    };
    
    await setDoc(docRef, permission);
  } catch (error) {
    console.error('Error granting content permission:', error);
    throw error;
  }
}

// Revoke permission from user for content section
export async function revokeContentPermission(
  userId: string,
  contentSectionId: string
): Promise<void> {
  try {
    const permissionId = `${userId}_${contentSectionId}`;
    const docRef = doc(db, PERMISSIONS_COLLECTION, permissionId);
    await updateDoc(docRef, { canEdit: false });
  } catch (error) {
    console.error('Error revoking content permission:', error);
    throw error;
  }
}

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
    console.error('Error getting user content permissions:', error);
    throw error;
  }
}

// Get all permissions for a content section
export async function getContentSectionPermissions(contentSectionId: string): Promise<ContentPermission[]> {
  try {
    const q = query(
      collection(db, PERMISSIONS_COLLECTION),
      where('contentSectionId', '==', contentSectionId),
      where('canEdit', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      grantedAt: doc.data().grantedAt?.toDate() || new Date()
    })) as ContentPermission[];
  } catch (error) {
    console.error('Error getting content section permissions:', error);
    throw error;
  }
}