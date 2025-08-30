'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import PostForm from '@/app/components/admin/PostForm';
import { PermissionService } from '@/app/utils/permissions';
import { useAuth } from '@/app/utils/AuthContext';
import { PostCategory } from '@/app/utils';

function NewPostContent() {
  const { user, userData } = useAuth();
  const searchParams = useSearchParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const requestedCategory = searchParams?.get('category') as PostCategory | null;

  useEffect(() => {
    async function checkPermission() {
      if (!user || !userData) return;
      
      if (userData.role === 'super-admin') {
        setHasPermission(true);
        return;
      }

      if (requestedCategory) {
        const permitted = await PermissionService.hasPostPermission(user.uid, requestedCategory);
        setHasPermission(permitted);
      } else {
        // If no category specified, check if user has any post permissions
        const postPermissions = await PermissionService.getUserPostPermissions(user.uid);
        setHasPermission(postPermissions.length > 0);
      }
    }

    checkPermission();
  }, [user, userData, requestedCategory]);

  if (hasPermission === null) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#F58C28'}}></div>
              <p className="text-gray-600">Checking permissions...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!hasPermission) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚫</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-500">You don't have permission to create posts in this category.</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PostForm initialCategory={requestedCategory || undefined} />
    </ProtectedRoute>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#F58C28'}}></div>
    </div>}>
      <NewPostContent />
    </Suspense>
  );
}