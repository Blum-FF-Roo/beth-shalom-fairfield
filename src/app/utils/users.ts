import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
 
  updateDoc,
  setDoc,
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp,
  DocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from './firebase';
import { UserRole } from '@/app/utils/AuthContext';

const USERS_COLLECTION = 'users';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// Convert Firestore document to UserData interface
function convertFirestoreUser(doc: DocumentSnapshot<DocumentData>): UserData {
  const data = doc.data();
  if (!data) {
    throw new Error('Document data is undefined');
  }
  return {
    uid: doc.id,
    email: data.email,
    role: data.role,
    isActive: data.isActive,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    lastLogin: data.lastLogin?.toDate ? data.lastLogin.toDate() : undefined
  };
}

// Get all users
export async function getAllUsers(): Promise<UserData[]> {
  try {
    const usersCollection = collection(db, USERS_COLLECTION);
    const usersQuery = query(usersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(usersQuery);
    
    return snapshot.docs.map(convertFirestoreUser);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Get single user by ID
export async function getUserById(uid: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (userDoc.exists()) {
      return convertFirestoreUser(userDoc);
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Create new user
export async function createUser(email: string, password: string, role: UserRole = 'admin'): Promise<string> {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Create user document in Firestore with the UID as the document ID
    await setDoc(doc(db, USERS_COLLECTION, uid), {
      email,
      role,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return uid;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update user
export async function updateUser(uid: string, updates: Partial<Pick<UserData, 'role' | 'isActive'>>): Promise<void> {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete user (this will delete both auth and firestore record)
export async function deleteUser(uid: string): Promise<void> {
  try {
    // Delete user document from Firestore
    await deleteDoc(doc(db, USERS_COLLECTION, uid));
    // Note: Deleting auth user requires admin SDK on backend
    // For now, we'll just deactivate the user
    console.warn('User document deleted, but auth user still exists. Consider deactivating instead.');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Deactivate user
export async function deactivateUser(uid: string): Promise<void> {
  try {
    await updateUser(uid, { isActive: false });
  } catch (error) {
    console.error('Error deactivating user:', error);
    throw error;
  }
}

// Activate user
export async function activateUser(uid: string): Promise<void> {
  try {
    await updateUser(uid, { isActive: true });
  } catch (error) {
    console.error('Error activating user:', error);
    throw error;
  }
}

// Send password reset email
export async function sendUserPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error;
  }
}

// Update last login timestamp
export async function updateLastLogin(uid: string): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating last login:', error);
    throw error;
  }
}