'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { Post, PostFormData, PostCategory } from '@/app/utils';
import { createPost, updatePost } from '@/app/utils';
import { useAuth } from '@/app/utils/AuthContext';

interface PostFormProps {
  post?: Post;
  isEditing?: boolean;
  initialCategory?: PostCategory;
}

export default function PostForm({ post, isEditing = false, initialCategory }: PostFormProps) {
  const router = useRouter();
  const { userData } = useAuth();
  
  const [formData, setFormData] = useState<PostFormData>({
    title: post?.title || '',
    content: post?.content || '',
    category: post?.category || initialCategory || 'parshah',
    isPublished: post?.isPublished || false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent, saveAndPublish = false) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    if (!userData) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dataToSubmit = {
        ...formData,
        isPublished: saveAndPublish || (isEditing && formData.isPublished)
      };

      if (isEditing && post) {
        await updatePost(post.id, dataToSubmit);
      } else {
        await createPost(dataToSubmit, userData.uid, userData.email);
      }
      
      router.push('/admin');
    } catch (err: unknown) {
      setError(isEditing ? 'Failed to update post' : 'Failed to create post');
      console.error('Error saving post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PostFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter post title"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value as PostCategory)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="parshah">Parshah</option>
                  <option value="high-holy-day">High Holy Day</option>
                  <option value="articles">Articles of Interest</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => handleInputChange('content', value)}
                />
              </div>

            </div>

            {/* Form Actions */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </Link>
              
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Draft'}
                </button>
                
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  style={{backgroundColor: '#F58C28'}}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {loading ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}