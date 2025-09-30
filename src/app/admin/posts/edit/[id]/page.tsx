'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import PostForm from '@/app/components/admin/PostForm';
import { Post, PostCategory } from '@/app/utils';
import { getPostById } from '@/app/utils';
import { PermissionService } from '@/app/utils/permissions';
import { useAuth } from '@/app/utils/AuthContext';

export default function EditPostPage() {
  const { user, userData } = useAuth();
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const checkPermission = useCallback(async (category: string) => {
    if (!user || !userData) return;
    
    if (userData.role === 'super-admin') {
      setHasPermission(true);
    } else {
      const permitted = await PermissionService.hasPostPermission(user.uid, category as PostCategory);
      setHasPermission(permitted);
    }
    
    setLoading(false);
  }, [user, userData]);

  const loadPost = useCallback(async (id: string) => {
    try {
      const fetchedPost = await getPostById(id);
      if (fetchedPost) {
        setPost(fetchedPost);
        // Check permission for this specific post category
        await checkPermission(fetchedPost.category);
      } else {
        setError('Post not found');
        setLoading(false);
      }
    } catch {
      setError('Failed to load post');
      setLoading(false);
    }
  }, [checkPermission]);

  useEffect(() => {
    if (params.id) {
      loadPost(params.id as string);
    }
  }, [params.id, loadPost]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#F58C28'}}></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !post) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Post not found'}
            </h1>
            <a
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              style={{backgroundColor: '#F58C28'}}
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (hasPermission === false) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚫</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-500">You don't have permission to edit posts in this category.</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PostForm post={post} isEditing={true} />
    </ProtectedRoute>
  );
}