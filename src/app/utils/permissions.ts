import { collection, query, where, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/app/utils/firebase';
import { PostCategory } from '@/app/utils';

interface Permission {
  userId: string;
  contentSectionId: string;
  canEdit: boolean;
  grantedBy: string;
  grantedAt: Date;
}

export class PermissionService {
  private static readonly COLLECTION = 'content_permissions';

  static async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        where('canEdit', '==', true)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data().contentSectionId);
    } catch {
      return [];
    }
  }

  static async hasContentPermission(userId: string, sectionId: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, `${userId}_${sectionId}`);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return false;
      
      const permission = docSnap.data() as Permission;
      return permission.canEdit;
    } catch {
      return false;
    }
  }

  static async grantPermission(userId: string, sectionId: string, grantedBy: string): Promise<void> {
    const permission: Permission = {
      userId,
      contentSectionId: sectionId,
      canEdit: true,
      grantedBy,
      grantedAt: new Date()
    };

    const docRef = doc(db, this.COLLECTION, `${userId}_${sectionId}`);
    await setDoc(docRef, permission);
  }

  static async revokePermission(userId: string, sectionId: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, `${userId}_${sectionId}`);
    await deleteDoc(docRef);
  }

  static async getUsersWithPermission(sectionId: string): Promise<string[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('contentSectionId', '==', sectionId),
        where('canEdit', '==', true)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data().userId);
    } catch {
      return [];
    }
  }

  // Post-specific permission methods
  static async hasPostPermission(userId: string, category: PostCategory): Promise<boolean> {
    const sectionId = `posts-${category}`;
    return this.hasContentPermission(userId, sectionId);
  }

  static async grantPostPermission(userId: string, category: PostCategory, grantedBy: string): Promise<void> {
    const sectionId = `posts-${category}`;
    return this.grantPermission(userId, sectionId, grantedBy);
  }

  static async revokePostPermission(userId: string, category: PostCategory): Promise<void> {
    const sectionId = `posts-${category}`;
    return this.revokePermission(userId, sectionId);
  }

  static async getUserPostPermissions(userId: string): Promise<PostCategory[]> {
    const permissions = await this.getUserPermissions(userId);
    return permissions
      .filter(id => id.startsWith('posts-'))
      .map(id => id.replace('posts-', '')) as PostCategory[];
  }
}