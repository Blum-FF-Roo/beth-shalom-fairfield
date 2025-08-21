'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Filter, ArrowLeft, Edit, Settings, FileText, Globe, Users } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PostCard from '@/components/admin/PostCard';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { Post, PostCategory } from '@/types';
import { getAllPosts, deletePost, togglePublishStatus } from '@/lib/posts';
import { useToast } from '@/contexts/ToastContext';
import { ContentSection } from '@/types/content';
import { loadContentSectionsOptimized } from '@/lib/content-admin-optimized';
import { UserData } from '@/lib/users';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'articles' | 'content';

export default function AdminDashboardOptimized() {
  const [activeTab, setActiveTab] = useState<TabType>('articles');
  const { showSuccess, showError } = useToast();
  const { user, userData } = useAuth();

  // Handle URL params for tab switching
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'content') {
      setActiveTab('content');
    }
  }, []);

  // Articles state
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | PostCategory>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Content state
  const [authorizedContentSections, setAuthorizedContentSections] = useState<ContentSection[]>([]);
  const [selectedContentCategory, setSelectedContentCategory] = useState<string>('all');

  // Loading states - separated for progressive loading
  const [postsLoading, setPostsLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState('');

  // User data cache for display names
  const [usersCache, setUsersCache] = useState<Record<string, UserData>>({});

  const contentCategories = [
    { value: 'all', label: 'All Sections' },
    { value: 'home', label: 'Home Page' },
    { value: 'hero', label: 'Hero Slider' },
    { value: 'about', label: 'About Page' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'membership', label: 'Membership Page' },
    { value: 'services', label: 'Services Pages' },
    { value: 'articles', label: 'Articles of Interest' },
    { value: 'judaism', label: 'All About Judaism' },
    { value: 'media', label: 'Media Archive' },
    { value: 'parshah', label: 'Parshah' },
    { value: 'tzedakah', label: 'Tzedakah/Donate' },
    { value: 'sermons', label: 'High Holy Days Sermons' },
    { value: 'links', label: 'Media Links' }
  ];

  const filterPosts = useCallback(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory));
    }
  }, [posts, selectedCategory]);

  const loadPosts = async () => {
    setPostsLoading(true);
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadContentSections = async () => {
    if (!user || !userData) return;
    
    setContentLoading(true);
    try {
      const { authorizedSections, usersCache } = await loadContentSectionsOptimized(
        user.uid, 
        userData.role
      );
      
      setAuthorizedContentSections(authorizedSections);
      setUsersCache(usersCache);
    } catch (error) {
      console.error('Error loading content sections:', error);
      showError('Load Failed', 'Failed to load content sections. Please try again.');
    } finally {
      setContentLoading(false);
    }
  };

  // Helper function to get display name for a user ID
  const getUserDisplayName = (userId: string): string => {
    if (userId === 'system') return 'System';
    const user = usersCache[userId];
    return user ? user.email : userId;
  };

  // Load posts immediately
  useEffect(() => {
    loadPosts();
  }, []);

  // Load content sections when user is ready
  useEffect(() => {
    if (user && userData) {
      loadContentSections();
    }
  }, [user, userData]);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, filterPosts]);

  const handleDeletePost = (id: string) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete);
      setPosts(posts.filter(post => post.id !== postToDelete));
      showSuccess('Post Deleted', 'The post has been successfully deleted.');
    } catch (err) {
      setError('Failed to delete post');
      showError('Delete Failed', 'There was an error deleting the post. Please try again.');
      console.error('Error deleting post:', err);
    } finally {
      setPostToDelete(null);
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'home': 'bg-blue-100 text-blue-800',
      'hero': 'bg-purple-100 text-purple-800',
      'about': 'bg-green-100 text-green-800',
      'contact': 'bg-yellow-100 text-yellow-800',
      'membership': 'bg-red-100 text-red-800',
      'services': 'bg-indigo-100 text-indigo-800',
      'articles': 'bg-orange-100 text-orange-800',
      'judaism': 'bg-teal-100 text-teal-800',
      'media': 'bg-pink-100 text-pink-800',
      'parshah': 'bg-cyan-100 text-cyan-800',
      'tzedakah': 'bg-emerald-100 text-emerald-800',
      'sermons': 'bg-violet-100 text-violet-800',
      'links': 'bg-amber-100 text-amber-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rich_text':
        return '📝';
      case 'text':
        return '📄';
      case 'list':
        return '📋';
      case 'contact':
        return '📞';
      case 'slide_array':
        return '🎞️';
      case 'toggle':
        return '🎛️';
      default:
        return '📄';
    }
  };

  const filteredContentSections = selectedContentCategory === 'all' 
    ? authorizedContentSections 
    : authorizedContentSections.filter(section => section.category === selectedContentCategory);

  // Filter content categories to only show those with authorized sections
  const availableContentCategories = contentCategories.filter(category => {
    if (category.value === 'all') return true; // Always show "All Sections"
    return authorizedContentSections.some(section => section.category === category.value);
  });

  // Reset selected category if it's no longer available
  useEffect(() => {
    if (!availableContentCategories.some(cat => cat.value === selectedContentCategory)) {
      setSelectedContentCategory('all');
    }
  }, [availableContentCategories, selectedContentCategory]);

  // Show loading only if both are loading initially
  const isInitialLoading = postsLoading && contentLoading && posts.length === 0 && authorizedContentSections.length === 0;

  if (isInitialLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#F58C28'}}></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
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
                <p className="mt-2 text-gray-600">Manage your articles and website content</p>
              </div>
              <div className="flex items-center space-x-3">
                {activeTab === 'articles' && (
                  <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-sm"
                    style={{backgroundColor: '#F58C28'}}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Post
                  </Link>
                )}
                {userData?.role === 'super-admin' && (
                  <Link
                    href="/admin/users"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-sm"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Link>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'articles'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Articles {postsLoading && <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b border-orange-500" />}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'content'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Website Sections {contentLoading && <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b border-orange-500" />}
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Articles Tab Content */}
          {activeTab === 'articles' && (
            <>
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
              {postsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{borderColor: '#F58C28'}}></div>
                  <div className="text-gray-500">Loading articles...</div>
                </div>
              ) : filteredPosts.length === 0 ? (
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
            </>
          )}

          {/* Website Sections Tab Content */}
          {activeTab === 'content' && (
            <>
              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {availableContentCategories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedContentCategory(category.value)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        selectedContentCategory === category.value
                          ? 'text-white shadow-sm'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                      style={selectedContentCategory === category.value ? {backgroundColor: '#F58C28'} : {}}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Sections List */}
              {contentLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{borderColor: '#F58C28'}}></div>
                  <div className="text-gray-500">Loading website sections...</div>
                </div>
              ) : filteredContentSections.length === 0 ? (
                <div className="text-center py-12">
                  <Settings className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No content sections found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedContentCategory === 'all' 
                      ? 'No content sections are available.'
                      : `No content sections found for ${contentCategories.find(c => c.value === selectedContentCategory)?.label}.`
                    }
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {filteredContentSections.map((section) => (
                      <div key={section.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {/* Icon */}
                            <span className="text-2xl flex-shrink-0">{getTypeIcon(section.type)}</span>
                            
                            {/* Content Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                  {section.title}
                                </h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(section.category)}`}>
                                  {contentCategories.find(c => c.value === section.category)?.label || section.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {section.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>Updated: {section.updatedAt.toLocaleDateString()}</span>
                                <span>By: {getUserDisplayName(section.updatedBy)}</span>
                                <span>
                                  {section.type === 'slide_array' ? (
                                    `${Array.isArray(section.content) ? section.content.length : 0} slides`
                                  ) : section.type === 'list' ? (
                                    `${Array.isArray(section.content) ? section.content.length : 0} items`
                                  ) : section.type === 'contact' ? (
                                    'Contact information'
                                  ) : (
                                    `${typeof section.content === 'string' ? section.content.length : 0} characters`
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Edit Button */}
                          <Link
                            href={`/admin/content/edit/${section.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200 ml-4"
                            style={{backgroundColor: '#F58C28'}}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPostToDelete(null);
        }}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </ProtectedRoute>
  );
}