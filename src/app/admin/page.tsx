'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Filter, ArrowLeft } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PostCard from '@/components/admin/PostCard';
import { Post, PostCategory } from '@/types';
import { getAllPosts, deletePost, togglePublishStatus } from '@/lib/posts';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | PostCategory>('all');
  const [error, setError] = useState('');

  const filterPosts = useCallback(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory));
    }
  }, [posts, selectedCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, filterPosts]);

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      await togglePublishStatus(id, isPublished);
      setPosts(posts.map(post => 
        post.id === id 
          ? { ...post, isPublished, updatedAt: new Date() }
          : post
      ));
    } catch (err) {
      setError('Failed to update post status');
      console.error('Error updating post status:', err);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#F58C28'}}></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Website
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage your posts and content</p>
              </div>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-sm"
                style={{backgroundColor: '#F58C28'}}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex space-x-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    selectedCategory === 'all'
                      ? 'text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  style={selectedCategory === 'all' ? {backgroundColor: '#F58C28'} : {}}
                >
                  All Posts ({posts.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('parshah')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    selectedCategory === 'parshah'
                      ? 'text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  style={selectedCategory === 'parshah' ? {backgroundColor: '#F58C28'} : {}}
                >
                  Parshah ({posts.filter(p => p.category === 'parshah').length})
                </button>
                <button
                  onClick={() => setSelectedCategory('high-holy-day')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    selectedCategory === 'high-holy-day'
                      ? 'text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  style={selectedCategory === 'high-holy-day' ? {backgroundColor: '#F58C28'} : {}}
                >
                  High Holy Days ({posts.filter(p => p.category === 'high-holy-day').length})
                </button>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {selectedCategory === 'all' ? 'No posts found' : `No ${selectedCategory} posts found`}
              </div>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                style={{backgroundColor: '#F58C28'}}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                  onTogglePublish={handleTogglePublish}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}