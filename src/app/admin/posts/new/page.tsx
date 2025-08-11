'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PostForm from '@/components/admin/PostForm';

export default function NewPostPage() {
  return (
    <ProtectedRoute>
      <PostForm />
    </ProtectedRoute>
  );
}