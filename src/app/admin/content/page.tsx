'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Users, Settings } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ContentSection } from '@/types/content';
import { getAllContentSections, initializeContentSections } from '@/lib/content';

export default function ContentManagementPage() {
  const { userData } = useAuth();
  const { showSuccess, showError } = useToast();
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Sections' },
    { value: 'home', label: 'Home Page' },
    { value: 'hero', label: 'Hero Slider' },
    { value: 'about', label: 'About Page' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'membership', label: 'Membership Page' }
  ];

  useEffect(() => {
    loadContentSections();
  }, []);

  const loadContentSections = async () => {
    try {
      setLoading(true);
      // Initialize content sections if they don't exist
      await initializeContentSections();
      
      const sections = await getAllContentSections();
      setContentSections(sections);
    } catch (error) {
      console.error('Error loading content sections:', error);
      showError('Load Failed', 'Failed to load content sections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSections = selectedCategory === 'all' 
    ? contentSections 
    : contentSections.filter(section => section.category === selectedCategory);

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
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#F58C28'}}></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
                <p className="mt-2 text-gray-600">Edit website content sections</p>
              </div>
              {userData?.role === 'super-admin' && (
                <Link
                  href="/admin/content/permissions"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Permissions
                </Link>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category.value
                      ? 'text-white shadow-sm'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  style={selectedCategory === category.value ? {backgroundColor: '#F58C28'} : {}}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections Grid */}
          {filteredSections.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No content sections found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedCategory === 'all' 
                  ? 'No content sections are available.'
                  : `No content sections found for ${categories.find(c => c.value === selectedCategory)?.label}.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSections.map((section) => (
                <div key={section.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getTypeIcon(section.type)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {section.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(section.category)}`}>
                            {categories.find(c => c.value === section.category)?.label || section.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {section.description}
                    </p>

                    {/* Content Preview */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Content Preview:</p>
                      <div className="bg-gray-50 rounded p-2 text-xs text-gray-700 max-h-20 overflow-hidden">
                        {section.type === 'slide_array' ? (
                          <span>Hero slider with {Array.isArray(section.content) ? section.content.length : 0} slides</span>
                        ) : section.type === 'list' ? (
                          <span>List with {Array.isArray(section.content) ? section.content.length : 0} items</span>
                        ) : section.type === 'contact' ? (
                          <span>Contact information</span>
                        ) : (
                          <span className="line-clamp-3">
                            {typeof section.content === 'string' 
                              ? section.content.substring(0, 100) + '...'
                              : 'Complex content'
                            }
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <p>Updated: {section.updatedAt.toLocaleDateString()}</p>
                        <p>By: {section.updatedBy}</p>
                      </div>
                      <Link
                        href={`/admin/content/edit/${section.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                        style={{backgroundColor: '#F58C28'}}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}