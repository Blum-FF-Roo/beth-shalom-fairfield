import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentPermission } from '@/types/content';

const PERMISSIONS_COLLECTION = 'content_permissions';

// Batch fetch permissions for multiple users
export async function getBatchUserContentPermissions(userIds: string[]): Promise<Record<string, string[]>> {
  if (userIds.length === 0) {
    return {};
  }

  const permissions: Record<string, string[]> = {};
  
  // Initialize all users with empty arrays
  userIds.forEach(userId => {
    permissions[userId] = [];
  });

  try {
    // Firestore 'in' queries are limited to 10 items, so we need to batch
    const batches: string[][] = [];
    for (let i = 0; i < userIds.length; i += 10) {
      batches.push(userIds.slice(i, i + 10));
    }

    // Execute all batches in parallel
    const batchPromises = batches.map(async (batch) => {
      const permissionsQuery = query(
        collection(db, PERMISSIONS_COLLECTION),
        where('userId', 'in', batch),
        where('canEdit', '==', true)
      );
      
      const snapshot = await getDocs(permissionsQuery);
      return snapshot.docs.map(doc => doc.data() as ContentPermission);
    });

    const batchResults = await Promise.all(batchPromises);
    
    // Flatten results and organize by user
    const allPermissions = batchResults.flat();
    allPermissions.forEach(permission => {
      if (permissions[permission.userId] && permission.canEdit) {
        permissions[permission.userId].push(permission.contentSectionId);
      }
    });

    return permissions;
  } catch (error) {
    console.error('Error batch fetching user permissions:', error);
    return permissions; // Return empty arrays for all users on error
  }
}