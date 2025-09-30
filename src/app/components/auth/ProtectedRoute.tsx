'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/utils/AuthContext';
import { UserRole } from '@/app/utils/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

// Helper function to check if user has required role
function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  // Super-admin can access everything
  if (userRole === 'super-admin') {
    return true;
  }
  
  // Exact role match
  return userRole === requiredRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }

      if (!userData) {
        // User exists but no userData, sign them out
        router.push('/admin/login');
        return;
      }

      if (requiredRole && !hasRequiredRole(userData.role, requiredRole)) {
        // User doesn't have required role
        router.push('/admin');
        return;
      }
    }
  }, [user, userData, loading, router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: '#F58C28'}}>
              <span className="text-white font-bold text-xl">BS</span>
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-lg">Loading admin panel...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{borderColor: '#F58C28'}}></div>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  if (requiredRole && !hasRequiredRole(userData.role, requiredRole)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}