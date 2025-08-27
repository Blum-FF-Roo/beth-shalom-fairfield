'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Users, Edit, FileText } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useToast } from '@/contexts/ToastContext';
import { ContentSection } from '@/types/content';
import { getAllContentSections } from '@/lib/content-schema';
import { PermissionService } from '@/lib/permissions';
import { useAuth } from '@/contexts/AuthContext';
import { mapContentCategoryToNav } from '@/components/shared/MenuItemsConfig';
import Menu from '@/components/shared/Menu';
import { POST_CATEGORIES } from '@/lib/admin-permissions';
import { PostCategory } from '@/types';

export default function AdminDashboard() {
  const { showError } = useToast();
  const { user, userData } = useAuth();

  const [authorizedSections, setAuthorizedSections] = useState<ContentSection[]>([]);
  const [authorizedPostCategories, setAuthorizedPostCategories] = useState<PostCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadContent = useCallback(async (): Promise<void> => {
    if (!user || !userData) return;

    try {
      const allSections = await getAllContentSections();

      let authorized: ContentSection[];

      let authorizedPosts: PostCategory[] = [];

      if (userData.role === 'super-admin') {
        authorized = allSections;
        authorizedPosts = POST_CATEGORIES.map(cat => cat.category);
      } else {
        const userPermissions = await PermissionService.getUserPermissions(user.uid);
        authorized = allSections.filter(section => userPermissions.includes(section.id));
        authorizedPosts = await PermissionService.getUserPostPermissions(user.uid);
      }

      setAuthorizedSections(authorized);
      setAuthorizedPostCategories(authorizedPosts);
      
    } catch {
      showError('Error', 'Failed to load content sections');
    } finally {
      setLoading(false);
    }
  }, [user, userData, showError]);

  useEffect(() => {
    if (!user || !userData) return;
    loadContent();
  }, [user, userData, loadContent]);


  const getFilteredSections = (): ContentSection[] => {
    if (selectedCategory === 'all') return authorizedSections;
    
    return authorizedSections.filter(section => {
      if (section.category === selectedCategory) return true;
      return mapContentCategoryToNav(section.category as Parameters<typeof mapContentCategoryToNav>[0]) === selectedCategory;
    });
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'home': '🏠',
      'about': 'ℹ️',
      'services': '⛪',
      'media': '🎬',
      'contact': '📞',
      'membership': '👥',
      'history': '📚',
      'hero': '🌟',
      'logo': '🎨',
      'articles': '📄',
      'judaism': '✡️',
      'parshah': '📖',
      'tzedakah': '💝',
      'sermons': '🎤',
      'links': '🔗'
    };
    return icons[category] || '📄';
  };

  const getTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      'text': '📝',
      'rich_text': '📄',
      'list': '📋',
      'contact': '📞',
      'slide_array': '🎞️',
      'toggle': '🎛️',
      'image': '🖼️'
    };
    return icons[type] || '📄';
  };

  const handleFilterClick = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#F58C28'}}></div>
              <p className="text-gray-600">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const filteredSections = getFilteredSections();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage your website content</p>
              </div>

              <div className="flex items-center space-x-4">
                {userData?.role === 'super-admin' && (
                  <Link
                    href="/admin/users"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                    style={{ backgroundColor: '#F58C28' }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Link>
                )}

                {authorizedPostCategories.length > 0 && (
                  <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                    style={{ backgroundColor: '#F58C28' }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Menu
              mode="filter"
              selectedCategory={selectedCategory}
              onFilterClick={handleFilterClick}
              showAdminButtons={true}
            />
          </div>

          {filteredSections.length === 0 && authorizedPostCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content sections found</h3>
              <p className="text-gray-500">
                {selectedCategory === 'all' 
                  ? 'You do not have permission to edit any content sections.'
                  : `No content sections found for ${selectedCategory}.`
                }
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className={`grid grid-cols-1 ${authorizedPostCategories.length > 0 ? 'lg:grid-cols-2 divide-x divide-gray-200' : ''}`}>
                
                {/* Website Sections Column */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <span className="text-2xl mr-2">🌐</span>
                      Website Sections
                    </h2>
                    <span className="text-sm text-gray-500">{filteredSections.length} sections</span>
                  </div>
                  
                  {filteredSections.length > 0 ? (
                    <div className="space-y-3">
                      {filteredSections.map(section => (
                        <div key={section.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <span className="text-lg flex-shrink-0">{getCategoryIcon(section.category)}</span>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-medium text-gray-900 truncate">{section.title}</h3>
                              <p className="text-xs text-gray-500 capitalize">{section.category} • {getTypeIcon(section.type)}</p>
                            </div>
                          </div>
                          <Link
                            href={`/admin/content/edit/${section.id}`}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex-shrink-0"
                            style={{ backgroundColor: '#F58C28' }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-2">🌐</div>
                      <p className="text-gray-500 text-sm">No website sections available</p>
                    </div>
                  )}
                </div>

                {/* Posts Column - Only show if user has post permissions */}
                {authorizedPostCategories.length > 0 && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <span className="text-2xl mr-2">📝</span>
                        Posts
                      </h2>
                      <span className="text-sm text-gray-500">{authorizedPostCategories.length} categories</span>
                    </div>
                    
                    <div className="space-y-3">
                      {authorizedPostCategories.map(category => {
                        const postInfo = POST_CATEGORIES.find(p => p.category === category);
                        if (!postInfo) return null;
                        
                        return (
                          <div key={category} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <span className="text-lg flex-shrink-0">📝</span>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-medium text-gray-900 truncate">{postInfo.title}</h3>
                                <p className="text-xs text-gray-500 truncate">{postInfo.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <Link
                                href={`/admin/posts?category=${category}`}
                                className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Manage
                              </Link>
                              <Link
                                href={`/admin/posts/new?category=${category}`}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                                style={{ backgroundColor: '#F58C28' }}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                New
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}