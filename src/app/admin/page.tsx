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
import { getAllContentSections, initializeContentSections, userHasContentPermission } from '@/lib/content';
import { getUserById, UserData } from '@/lib/users';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'articles' | 'content';

export default function AdminDashboard() {
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
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [authorizedContentSections, setAuthorizedContentSections] = useState<ContentSection[]>([]);
  const [selectedContentCategory, setSelectedContentCategory] = useState<string>('all');

  // Loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // User data cache for display names
  const [usersCache, setUsersCache] = useState<Record<string, UserData>>({});

  const contentCategories = [
    { value: 'all', label: 'All Sections' },
    { value: 'home', label: 'Home Page' },
    { value: 'hero', label: 'Hero Slider' },
    { value: 'about', label: 'About Page' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'membership', label: 'Membership Page' }
  ];

  const filterPosts = useCallback(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory));
    }
  }, [posts, selectedCategory]);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading posts:', err);
    }
  };

  const loadContentSections = async () => {
    try {
      // Initialize content sections if they don't exist
      await initializeContentSections();
      
      const sections = await getAllContentSections();
      setContentSections(sections);

      // Filter sections based on user permissions
      if (user && userData) {
        // Super admins can see all sections
        if (userData.role === 'super-admin') {
          setAuthorizedContentSections(sections);
        } else {
          // Regular admins only see sections they have permission to edit
          const authorizedSections = [];
          for (const section of sections) {
            try {
              const hasPermission = await userHasContentPermission(user.uid, section.id);
              if (hasPermission) {
                authorizedSections.push(section);
              }
            } catch (error) {
              console.error(`Error checking permission for section ${section.id}:`, error);
            }
          }
          setAuthorizedContentSections(authorizedSections);
        }
      } else {
        // No user, show no sections
        setAuthorizedContentSections([]);
      }

      // Cache user data for display names
      const uniqueUserIds = [...new Set(sections.map(s => s.updatedBy).filter(id => id && id !== 'system'))];
      const userPromises = uniqueUserIds.map(async (userId) => {
        try {
          const userData = await getUserById(userId);
          return userData ? { [userId]: userData } : {};
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return {};
        }
      });
      
      const userResults = await Promise.all(userPromises);
      const newUsersCache = userResults.reduce((acc, userObj) => ({ ...acc, ...userObj }), {});
      setUsersCache(prev => ({ ...prev, ...newUsersCache }));
    } catch (error) {
      console.error('Error loading content sections:', error);
      showError('Load Failed', 'Failed to load content sections. Please try again.');
    }
  };

  // Helper function to get display name for a user ID
  const getUserDisplayName = (userId: string): string => {
    if (userId === 'system') return 'System';
    const user = usersCache[userId];
    return user ? user.email : userId;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadPosts(), loadContentSections()]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, filterPosts]);

  // Reload content sections when user data changes
  useEffect(() => {
    if (user && userData) {
      loadContentSections();
    }
  }, [user, userData]);

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
      'membership': 'bg-red-100 text-red-800'
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
                    Articles
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
                    Website Sections
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
              {filteredContentSections.length === 0 ? (
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