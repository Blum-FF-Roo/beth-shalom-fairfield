'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/app/utils/firebase';
import { updateLastLogin } from '@/app/utils/users';

export type UserRole = 'admin' | 'super-admin';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmReset: (code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      
      if (user) {
        setUser(user);
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.isActive) {
              setUserData({
                uid: user.uid,
                email: user.email!,
                role: data.role,
                isActive: data.isActive,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                lastLogin: data.lastLogin?.toDate()
              });
              
              // If login time is not set (e.g., browser refresh), set it now
              if (!localStorage.getItem('loginTime')) {
                localStorage.setItem('loginTime', Date.now().toString());
              }
            } else {
              // User is deactivated, sign them out
              await signOut(auth);
              setUser(null);
              setUserData(null);
            }
          } else {
            // User document doesn't exist, sign them out
            await signOut(auth);
            setUser(null);
            setUserData(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Session expiry checking - logout after 24 hours
  useEffect(() => {
    const checkSessionExpiry = () => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime && user) {
        const timeElapsed = Date.now() - parseInt(loginTime);
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (timeElapsed > twentyFourHours) {
          logout();
        }
      }
    };

    // Check immediately when user is authenticated
    if (user) {
      checkSessionExpiry();
    }

    // Set up interval to check every minute
    const interval = setInterval(checkSessionExpiry, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Update last login timestamp
    if (result.user) {
      try {
        await updateLastLogin(result.user.uid);
        // Store login time in localStorage for session expiry checking
        localStorage.setItem('loginTime', Date.now().toString());
      } catch (error) {
        console.error('Error updating last login:', error);
      }
    }
  };

  const logout = async () => {
    // Clear login time from localStorage
    localStorage.removeItem('loginTime');
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const confirmReset = async (code: string, newPassword: string) => {
    await confirmPasswordReset(auth, code, newPassword);
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    logout,
    resetPassword,
    confirmReset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}