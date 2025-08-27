import { PermissionService } from '../permissions';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

jest.mock('../firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDoc: jest.fn()
}));

const mockCollection = collection as jest.Mock;
const mockQuery = query as jest.Mock;
const mockWhere = where as jest.Mock;
const mockGetDocs = getDocs as jest.Mock;
const mockDoc = doc as jest.Mock;
const mockSetDoc = setDoc as jest.Mock;
const mockDeleteDoc = deleteDoc as jest.Mock;
const mockGetDoc = getDoc as jest.Mock;

describe('PermissionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserPermissions', () => {
    it('should return array of permission IDs for user', async () => {
      const mockSnapshot = {
        docs: [
          { data: () => ({ contentSectionId: 'section1' }) },
          { data: () => ({ contentSectionId: 'section2' }) }
        ]
      };
      
      mockGetDocs.mockResolvedValue(mockSnapshot);
      
      const result = await PermissionService.getUserPermissions('user123');
      
      expect(result).toEqual(['section1', 'section2']);
      expect(mockCollection).toHaveBeenCalledWith(db, 'content_permissions');
      expect(mockQuery).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalledWith('userId', '==', 'user123');
      expect(mockWhere).toHaveBeenCalledWith('canEdit', '==', true);
    });

    it('should return empty array when user has no permissions', async () => {
      const mockSnapshot = { docs: [] };
      mockGetDocs.mockResolvedValue(mockSnapshot);
      
      const result = await PermissionService.getUserPermissions('user123');
      
      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firestore error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await PermissionService.getUserPermissions('user123');
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user permissions:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('hasContentPermission', () => {
    it('should return true when user has permission', async () => {
      const mockDocSnap = {
        exists: () => true,
        data: () => ({ canEdit: true })
      };
      mockGetDoc.mockResolvedValue(mockDocSnap);
      
      const result = await PermissionService.hasContentPermission('user123', 'section1');
      
      expect(result).toBe(true);
      expect(mockDoc).toHaveBeenCalledWith(db, 'content_permissions', 'user123_section1');
    });

    it('should return false when document does not exist', async () => {
      const mockDocSnap = {
        exists: () => false
      };
      mockGetDoc.mockResolvedValue(mockDocSnap);
      
      const result = await PermissionService.hasContentPermission('user123', 'section1');
      
      expect(result).toBe(false);
    });

    it('should return false when canEdit is false', async () => {
      const mockDocSnap = {
        exists: () => true,
        data: () => ({ canEdit: false })
      };
      mockGetDoc.mockResolvedValue(mockDocSnap);
      
      const result = await PermissionService.hasContentPermission('user123', 'section1');
      
      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      mockGetDoc.mockRejectedValue(new Error('Firestore error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await PermissionService.hasContentPermission('user123', 'section1');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error checking permission:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('grantPermission', () => {
    it('should create permission document', async () => {
      const mockDocRef = { id: 'user123_section1' };
      mockDoc.mockReturnValue(mockDocRef);
      mockSetDoc.mockResolvedValue(undefined);
      
      await PermissionService.grantPermission('user123', 'section1', 'admin456');
      
      expect(mockDoc).toHaveBeenCalledWith(db, 'content_permissions', 'user123_section1');
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, {
        userId: 'user123',
        contentSectionId: 'section1',
        canEdit: true,
        grantedBy: 'admin456',
        grantedAt: expect.any(Date)
      });
    });
  });

  describe('revokePermission', () => {
    it('should delete permission document', async () => {
      const mockDocRef = { id: 'user123_section1' };
      mockDoc.mockReturnValue(mockDocRef);
      mockDeleteDoc.mockResolvedValue(undefined);
      
      await PermissionService.revokePermission('user123', 'section1');
      
      expect(mockDoc).toHaveBeenCalledWith(db, 'content_permissions', 'user123_section1');
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });

  describe('getUsersWithPermission', () => {
    it('should return array of user IDs with permission to section', async () => {
      const mockSnapshot = {
        docs: [
          { data: () => ({ userId: 'user1' }) },
          { data: () => ({ userId: 'user2' }) }
        ]
      };
      mockGetDocs.mockResolvedValue(mockSnapshot);
      
      const result = await PermissionService.getUsersWithPermission('section1');
      
      expect(result).toEqual(['user1', 'user2']);
      expect(mockWhere).toHaveBeenCalledWith('contentSectionId', '==', 'section1');
      expect(mockWhere).toHaveBeenCalledWith('canEdit', '==', true);
    });

    it('should return empty array on error', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firestore error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await PermissionService.getUsersWithPermission('section1');
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching users with permission:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });
});