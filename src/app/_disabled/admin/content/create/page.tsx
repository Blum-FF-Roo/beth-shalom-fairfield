'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import { useAuth } from '@/app/utils/AuthContext';
import { useToast } from '@/app/utils/ToastContext';
import { ContactInfo, SlideItem } from '@/app/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContentSection, createContentSection, setContent } from '@/app/utils/firebase-operations';

const contentTypes = [
  { value: 'text', label: 'Plain Text' },
  { value: 'rich_text', label: 'Rich Text (HTML)' },
  { value: 'list', label: 'List (Array of strings)' },
  { value: 'contact', label: 'Contact Information' },
  { value: 'slide_array', label: 'Slide Array' },
  { value: 'toggle', label: 'Toggle Setting' },
  { value: 'image', label: 'Image URL' },
] as const;

const categories = [
  { value: 'home', label: 'Home Page' },
  { value: 'about', label: 'About Page' },
  { value: 'contact', label: 'Contact Page' },
  { value: 'membership', label: 'Membership' },
  { value: 'history', label: 'History' },
  { value: 'hero', label: 'Hero Section' },
  { value: 'logo', label: 'Logo' },
  { value: 'services', label: 'Services' },
  { value: 'articles', label: 'Articles' },
  { value: 'judaism', label: 'Judaism' },
  { value: 'media', label: 'Media' },
  { value: 'parshah', label: 'Parshah' },
  { value: 'tzedakah', label: 'Tzedakah' },
  { value: 'sermons', label: 'Sermons' },
  { value: 'links', label: 'Links' },
] as const;

export default function CreateContentPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  
  const [keyError, setKeyError] = useState('');

  // TanStack Query mutation for creating content section
  const createContentMutation = useMutation({
    mutationFn: async (sectionData: Omit<ContentSection, 'createdAt' | 'updatedAt'>) => {
      // Create both the content section and the simple content
      await createContentSection(sectionData);
      await setContent(sectionData.key, sectionData.content);
      return { success: true };
    },
    onSuccess: (data, variables) => {
      // Invalidate specific content key that was just created
      queryClient.invalidateQueries({ queryKey: ['content', variables.key] });
      queryClient.invalidateQueries({ queryKey: ['content-sections'] });
      showSuccess('Content Section Created', 'New content section has been successfully created.');
      router.push('/admin');
    },
    onError: (error) => {
      console.error('Error creating content section:', error);
      showError('Creation Failed', 'Failed to create content section. Please try again.');
    },
  });

  // Form state
  const [id, setId] = useState('');
  const [key, setKey] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ContentSection['type']>('text');
  const [category, setCategory] = useState<ContentSection['category']>('home');
  const [defaultContent, setDefaultContent] = useState('');
  const [isEditable, setIsEditable] = useState(true);

  // Auto-generate ID and key from title
  useEffect(() => {
    if (title) {
      const generatedKey = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_'); // Replace spaces with underscores
      
      const generatedId = `${category}-${generatedKey}`;
      
      setKey(generatedKey);
      setId(generatedId);
    } else {
      setKey('');
      setId('');
    }
  }, [title, category]);

  // Check if key already exists when it changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (key) {
      timeoutId = setTimeout(async () => {
        try {
          // For now, we'll skip key checking since we're using simple content system
          setKeyError('');
        } catch (error) {
          console.error('Error checking key:', error);
        }
      }, 500);
    } else {
      setKeyError('');
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [key]);

  // Only super-admins can create new content sections
  if (!userData || userData.role !== 'super-admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only super-administrators can create new content sections.</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!userData?.uid) return;

    // Validation
    if (!title.trim()) {
      showError('Validation Error', 'Title is required');
      return;
    }
    
    if (!key.trim()) {
      showError('Validation Error', 'Key is required');
      return;
    }
    
    if (!description.trim()) {
      showError('Validation Error', 'Description is required');
      return;
    }

    if (keyError) {
      showError('Validation Error', keyError);
      return;
    }

    // Prepare default content based on type
    let processedDefaultContent: string | ContactInfo | SlideItem[] | string[];
    
    switch (type) {
      case 'text':
      case 'rich_text':
      case 'toggle':
      case 'image':
        processedDefaultContent = defaultContent;
        break;
      case 'list':
        processedDefaultContent = defaultContent ? defaultContent.split('\n').filter(line => line.trim()) : [];
        break;
      case 'contact':
        processedDefaultContent = {
          name: '',
          address: { street: '', city: '', state: '', zip: '' },
          phone: '',
          email: '',
        };
        break;
      case 'slide_array':
        processedDefaultContent = [];
        break;
      default:
        processedDefaultContent = defaultContent;
    }

    const contentSection: Omit<ContentSection, 'createdAt' | 'updatedAt'> = {
      id,
      key,
      title,
      description,
      type,
      category,
      content: processedDefaultContent,
      defaultContent: processedDefaultContent,
      isEditable,
      createdBy: userData.uid,
      updatedBy: userData.uid,
    };

    createContentMutation.mutate(contentSection);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin?tab=content"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Management
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Content Section</h1>
                <p className="text-gray-600 mt-2">Add a new editable content section to the website</p>
              </div>
              
              <button
                onClick={handleSave}
                disabled={createContentMutation.isPending || !!keyError}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createContentMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Section
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., About Section Text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key * {keyError && <span className="text-red-500 text-xs">({keyError})</span>}
                  </label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      keyError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., about_section_text"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated from title. Used to identify this content in code.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe what this content section is used for..."
                  />
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ContentSection['type'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {contentTypes.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ContentSection['category'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isEditable}
                      onChange={(e) => setIsEditable(e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Editable by content editors</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated ID
                  </label>
                  <input
                    type="text"
                    value={id}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated from category and key.
                  </p>
                </div>
              </div>
            </div>

            {/* Default Content */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Content
              </label>
              {type === 'list' ? (
                <textarea
                  value={defaultContent}
                  onChange={(e) => setDefaultContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter each list item on a new line..."
                />
              ) : type === 'contact' || type === 'slide_array' ? (
                <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                  Default content for {type === 'contact' ? 'contact information' : 'slide arrays'} will be automatically created as an empty structure.
                </div>
              ) : (
                <textarea
                  value={defaultContent}
                  onChange={(e) => setDefaultContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={`Default ${type} content...`}
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Initial content when the section is first created.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}