import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentSection, ContentPermission } from '@/types/content';
import { getAllContentSections, initializeContentSections } from '@/lib/content';
import { getUserById, UserData } from '@/lib/users';

// Optimized batch permission checking
export async function getBatchContentPermissions(userId: string, sectionIds: string[]): Promise<Record<string, boolean>> {
  try {
    // Query all permissions for this user at once
    const permissionsQuery = query(
      collection(db, 'content_permissions'),
      where('userId', '==', userId),
      where('contentSectionId', 'in', sectionIds.slice(0, 10)) // Firestore 'in' limit is 10
    );
    
    const permissionsSnapshot = await getDocs(permissionsQuery);
    const permissions: Record<string, boolean> = {};
    
    // Initialize all as false
    sectionIds.forEach(id => permissions[id] = false);
    
    // Set true for found permissions
    permissionsSnapshot.forEach(doc => {
      const permission = doc.data() as ContentPermission;
      if (permission.canEdit) {
        permissions[permission.contentSectionId] = true;
      }
    });
    
    return permissions;
  } catch (error) {
    console.error('Error batch checking permissions:', error);
    // Return all false on error
    const permissions: Record<string, boolean> = {};
    sectionIds.forEach(id => permissions[id] = false);
    return permissions;
  }
}

// Batch user data fetching
export async function getBatchUserData(userIds: string[]): Promise<Record<string, UserData>> {
  const userCache: Record<string, UserData> = {};
  
  try {
    const userPromises = userIds.map(async (userId) => {
      if (userId === 'system') return null;
      
      try {
        const userData = await getUserById(userId);
        return userData ? { userId, userData } : null;
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return null;
      }
    });
    
    const userResults = await Promise.all(userPromises);
    
    userResults.forEach(result => {
      if (result) {
        userCache[result.userId] = result.userData;
      }
    });
    
    return userCache;
  } catch (error) {
    console.error('Error batch fetching users:', error);
    return userCache;
  }
}

// Optimized content sections loading
export async function loadContentSectionsOptimized(userId?: string, userRole?: string): Promise<{
  sections: ContentSection[];
  authorizedSections: ContentSection[];
  usersCache: Record<string, UserData>;
}> {
  try {
    // Try to load existing sections first
    let sections = await getAllContentSections();
    
    // Only initialize if we have very few sections (likely not initialized)
    if (sections.length < 10) {
      await initializeContentSections();
      sections = await getAllContentSections();
    }
    
    let authorizedSections: ContentSection[] = [];
    
    // Handle authorization
    if (userId && userRole) {
      if (userRole === 'super-admin') {
        // Super admins see all sections
        authorizedSections = sections;
      } else {
        // Batch check permissions for regular admins
        const sectionIds = sections.map(s => s.id);
        const permissions = await getBatchContentPermissions(userId, sectionIds);
        authorizedSections = sections.filter(section => permissions[section.id]);
      }
    }
    
    // Batch fetch user data for display names
    const uniqueUserIds = [...new Set(sections.map(s => s.updatedBy).filter(id => id && id !== 'system'))];
    const usersCache = await getBatchUserData(uniqueUserIds);
    
    return {
      sections,
      authorizedSections,
      usersCache
    };
  } catch (error) {
    console.error('Error loading content sections optimized:', error);
    throw error;
  }
}