'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Eye, Trash2, ArrowLeft, Calendar, User } from 'lucide-react';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import { Post, PostCategory } from '@/app/utils';
import { getAllPosts } from '@/app/utils';
import { PermissionService } from '@/app/utils/permissions';
import { deletePost as deletePostAction } from '@/app/utils';
import { useAuth } from '@/app/utils/AuthContext';
import { useToast } from '@/app/utils/ToastContext';
import { POST_CATEGORIES } from '@/app/utils/admin-permissions';

function PostsListContent() {
  const { user, userData } = useAuth();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as PostCategory;

  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>(categoryParam || 'all');

  // Get user post permissions (only if not super-admin)
  const { data: userPostPermissions } = useQuery({
    queryKey: ['permissions', 'posts', user?.uid],
    queryFn: () => PermissionService.getUserPostPermissions(user!.uid),
    enabled: !!user && !!userData && userData.role !== 'super-admin',
  });

  // Calculate authorized categories
  const authorizedCategories: PostCategory[] = 
    userData?.role === 'super-admin' 
      ? POST_CATEGORIES.map(cat => cat.category)
      : userPostPermissions || [];

  // Get all posts
  const { data: allPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getAllPosts(),
    enabled: !!user && !!userData && authorizedCategories.length > 0,
  });

  // Filter posts to only show ones the user has permission for
  const posts = allPosts ? allPosts.filter(post => 
    authorizedCategories.includes(post.category as PostCategory)
  ) : [];

  const loading = postsLoading || (userData?.role !== 'super-admin' && !userPostPermissions);

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      await deletePostAction(id);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showSuccess('Success', 'Post deleted successfully');
    },
    onError: (error) => {
      showError('Error', 'Failed to delete post');
      console.error('Error deleting post:', error);
    },
  });

  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      return;
    }

    deletePostMutation.mutate(postId);
  };

  const getFilteredPosts = (): Post[] => {
    if (selectedCategory === 'all') return posts;
    return posts.filter(post => post.category === selectedCategory);
  };

  const getCategoryTitle = (category: PostCategory): string => {
    const categoryInfo = POST_CATEGORIES.find(cat => cat.category === category);
    return categoryInfo?.title || category;
  };

  const getPostViewUrl = (category: PostCategory, postId: string): string => {
    switch (category) {
      case 'articles':
        return `/articles/${postId}`;
      case 'high-holy-day':
        return `/high-holy-days/${postId}`;
      case 'parshah':
        return `/parshah/${postId}`;
      default:
        return `/${category}/${postId}`;
    }
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#F58C28'}}></div>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (authorizedCategories.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚫</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Post Access</h3>
              <p className="text-gray-500">You don't have permission to manage any post categories.</p>
              <Link
                href="/admin"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                style={{ backgroundColor: '#F58C28' }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const filteredPosts = getFilteredPosts();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <Link
                href="/admin"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Posts</h1>
                <p className="mt-2 text-gray-600">
                  View and manage your {selectedCategory === 'all' ? 'posts' : getCategoryTitle(selectedCategory as PostCategory).toLowerCase()}
                </p>
              </div>

              <Link
                href={`/admin/posts/new${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                style={{ backgroundColor: '#F58C28' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Link>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  selectedCategory === 'all'
                    ? 'text-white shadow-sm'
                    : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                }`}
                style={selectedCategory === 'all' ? {backgroundColor: '#F58C28'} : {}}
              >
                All Posts ({posts.length})
              </button>
              {authorizedCategories.map(category => {
                const categoryPosts = posts.filter(post => post.category === category);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'text-white shadow-sm'
                        : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                    }`}
                    style={selectedCategory === category ? {backgroundColor: '#F58C28'} : {}}
                  >
                    {getCategoryTitle(category)} ({categoryPosts.length})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-500 mb-4">
                {selectedCategory === 'all' 
                  ? 'You haven\'t created any posts yet.' 
                  : `No ${getCategoryTitle(selectedCategory as PostCategory).toLowerCase()} have been created yet.`}
              </p>
              <Link
                href={`/admin/posts/new${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                style={{ backgroundColor: '#F58C28' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <li key={post.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-medium text-gray-900 truncate">
                                {post.title}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                post.isPublished 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {post.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(post.createdAt)}
                              </span>
                              <span className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {post.authorName || 'Unknown Author'}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {getCategoryTitle(post.category as PostCategory)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {post.isPublished && (
                          <Link
                            href={getPostViewUrl(post.category as PostCategory, post.id)}
                            target="_blank"
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Link>
                        )}
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                          style={{ backgroundColor: '#F58C28' }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          disabled={deletePostMutation.isPending}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function PostsListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#F58C28'}}></div>
    </div>}>
      <PostsListContent />
    </Suspense>
  );
}