'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import RichTextEditor from '@/app/components/admin/RichTextEditor';
import ImageUpload from '@/app/components/admin/ImageUpload';
import { useAuth } from '@/app/utils/AuthContext';
import { useToast } from '@/app/utils/ToastContext';
import { ContactInfo, SlideItem } from '@/app/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContentSection, getContentSectionById, updateContentSection, setContent } from '@/app/utils/firebase-operations';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function EditContentPage({ params }: Props) {
  const router = useRouter();
  const { userData } = useAuth();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [contentSection, setContentSection] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [paramsId, setParamsId] = useState<string>('');
  
  // TanStack Query mutations for direct content updates
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, content, key }: { id: string; content: string | ContactInfo | SlideItem[] | string[]; key: string }) => {
      // Update both the content section and the simple content using the section's key
      await updateContentSection(id, { content });
      await setContent(key, content);
      return { success: true };
    },
    onSuccess: (data, variables) => {
      // Invalidate specific content key that was just updated
      queryClient.invalidateQueries({ queryKey: ['content', variables.key] });
      queryClient.invalidateQueries({ queryKey: ['content-sections'] });
      showSuccess('Content Updated', 'Content has been successfully updated.');
      router.push('/admin');
    },
    onError: (error) => {
      console.error('Error updating content:', error);
      showError('Update Failed', 'Failed to update content. Please try again.');
    },
  });

  // Form state for different content types
  const [textContent, setTextContent] = useState('');
  const [richTextContent, setRichTextContent] = useState('');
  const [listContent, setListContent] = useState<string[]>([]);
  const [contactContent, setContactContent] = useState<ContactInfo | null>(null);
  const [slideContent, setSlideContent] = useState<SlideItem[]>([]);
  const [toggleContent, setToggleContent] = useState('');
  const [imageContent, setImageContent] = useState('');

  useEffect(() => {
    // Resolve params promise
    params.then(resolvedParams => {
      setParamsId(resolvedParams.id);
    });
  }, [params]);

  const loadContentSection = useCallback(async () => {
    try {
      setLoading(true);
      const section = await getContentSectionById(paramsId);
      
      if (!section) {
        showError('Not Found', 'Content section not found.');
        router.push('/admin');
        return;
      }

      setContentSection(section);

      // Initialize form state based on content type
      switch (section.type) {
        case 'text':
          setTextContent(section.content as string);
          break;
        case 'rich_text':
          setRichTextContent(section.content as string);
          break;
        case 'list':
          setListContent(section.content as string[]);
          break;
        case 'contact':
          setContactContent(section.content as ContactInfo);
          break;
        case 'slide_array':
          setSlideContent(section.content as SlideItem[]);
          break;
        case 'toggle':
          setToggleContent(section.content as string);
          break;
        case 'image':
          setImageContent(section.content as string);
          break;
      }
    } catch (error) {
      console.error('Error loading content section:', error);
      showError('Load Failed', 'Failed to load content section. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [paramsId, showError, router]);

  useEffect(() => {
    if (paramsId) {
      loadContentSection();
    }
  }, [paramsId, loadContentSection]);

  const handleSave = async () => {
    if (!contentSection || !userData?.uid) return;

    let contentToSave: string | ContactInfo | SlideItem[] | string[];
    
    switch (contentSection.type) {
      case 'text':
        contentToSave = textContent;
        break;
      case 'rich_text':
        contentToSave = richTextContent;
        break;
      case 'list':
        contentToSave = listContent;
        break;
      case 'contact':
        contentToSave = contactContent!;
        break;
      case 'slide_array':
        contentToSave = slideContent;
        break;
      case 'toggle':
        contentToSave = toggleContent;
        break;
      case 'image':
        contentToSave = imageContent;
        break;
      default:
        showError('Error', 'Unknown content type');
        return;
    }

    updateContentMutation.mutate({
      id: contentSection.id,
      content: contentToSave,
      key: contentSection.key
    });
  };

  const addListItem = () => {
    setListContent([...listContent, '']);
  };

  const updateListItem = (index: number, value: string) => {
    const newList = [...listContent];
    newList[index] = value;
    setListContent(newList);
  };

  const removeListItem = (index: number) => {
    setListContent(listContent.filter((_, i) => i !== index));
  };

  const addSlide = () => {
    const newSlide: SlideItem = {
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      linkText: 'Learn More'
    };
    setSlideContent([...slideContent, newSlide]);
  };

  const updateSlide = (index: number, field: keyof SlideItem, value: string) => {
    const newSlides = [...slideContent];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlideContent(newSlides);
  };

  const removeSlide = (index: number) => {
    setSlideContent(slideContent.filter((_, i) => i !== index));
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

  if (!contentSection) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Content section not found</h2>
            <Link href="/admin" className="mt-4 text-blue-600 hover:text-blue-800">
              Return to Admin Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
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
                Back to Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit: {contentSection.title}</h1>
                <p className="mt-2 text-gray-600">{contentSection.description}</p>
              </div>
              <button
                onClick={handleSave}
                disabled={updateContentMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                style={{backgroundColor: '#F58C28'}}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateContentMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              {contentSection.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter content..."
                  />
                </div>
              )}

              {contentSection.type === 'rich_text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <RichTextEditor
                    value={richTextContent}
                    onChange={setRichTextContent}
                  />
                </div>
              )}

              {contentSection.type === 'list' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      List Items
                    </label>
                    <button
                      onClick={addListItem}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      style={{backgroundColor: '#10B981'}}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </button>
                  </div>
                  <div className="space-y-3">
                    {listContent.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateListItem(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder={`Item ${index + 1}`}
                        />
                        <button
                          onClick={() => removeListItem(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {contentSection.type === 'contact' && contactContent && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={contactContent.name}
                      onChange={(e) => setContactContent({...contactContent, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={contactContent.address.street}
                      onChange={(e) => setContactContent({
                        ...contactContent, 
                        address: {...contactContent.address, street: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={contactContent.address.city}
                        onChange={(e) => setContactContent({
                          ...contactContent, 
                          address: {...contactContent.address, city: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={contactContent.address.state}
                        onChange={(e) => setContactContent({
                          ...contactContent, 
                          address: {...contactContent.address, state: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP
                      </label>
                      <input
                        type="text"
                        value={contactContent.address.zip}
                        onChange={(e) => setContactContent({
                          ...contactContent, 
                          address: {...contactContent.address, zip: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={contactContent.phone}
                      onChange={(e) => setContactContent({...contactContent, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={contactContent.email}
                      onChange={(e) => setContactContent({...contactContent, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook URL (optional)
                    </label>
                    <input
                      type="url"
                      value={contactContent.facebook || ''}
                      onChange={(e) => setContactContent({...contactContent, facebook: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {contentSection.type === 'slide_array' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Hero Slides
                    </label>
                    <button
                      onClick={addSlide}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      style={{backgroundColor: '#10B981'}}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Slide
                    </button>
                  </div>
                  <div className="space-y-6">
                    {slideContent.map((slide, index) => (
                      <div key={slide.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Slide {index + 1}</h4>
                          <button
                            onClick={() => removeSlide(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-4">
                          {/* Text Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => updateSlide(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtitle
                              </label>
                              <input
                                type="text"
                                value={slide.subtitle || ''}
                                onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea
                              value={slide.description}
                              onChange={(e) => updateSlide(index, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>

                          {/* Image Upload */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Slide Image
                            </label>
                            <ImageUpload
                              currentImageUrl={slide.imageUrl}
                              onImageChange={(imageUrl) => updateSlide(index, 'imageUrl', imageUrl)}
                              onImageDelete={() => updateSlide(index, 'imageUrl', '')}
                              disabled={updateContentMutation.isPending}
                            />
                          </div>

                          {/* Manual Image URL (fallback) */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Image URL (Manual Override)
                              <span className="text-xs text-gray-500 ml-2">Optional: Enter URL directly if not using upload</span>
                            </label>
                            <input
                              type="url"
                              value={slide.imageUrl}
                              onChange={(e) => updateSlide(index, 'imageUrl', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>

                          {/* Link Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Link URL
                              </label>
                              <input
                                type="url"
                                value={slide.linkUrl}
                                onChange={(e) => updateSlide(index, 'linkUrl', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Link Text
                              </label>
                              <input
                                type="text"
                                value={slide.linkText}
                                onChange={(e) => updateSlide(index, 'linkText', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {contentSection.type === 'toggle' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    {contentSection.title}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="toggle-option"
                        value="highHolyDays"
                        checked={toggleContent === 'highHolyDays'}
                        onChange={(e) => setToggleContent(e.target.value)}
                        className="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-900">High Holy Days</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="toggle-option"
                        value="passover"
                        checked={toggleContent === 'passover'}
                        onChange={(e) => setToggleContent(e.target.value)}
                        className="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-900">Passover</span>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    This controls which program appears in the Programs section of the home page.
                  </p>
                </div>
              )}

              {/* Image Upload Form */}
              {contentSection.type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {contentSection.title}
                  </label>
                  <ImageUpload
                    currentImageUrl={imageContent || undefined}
                    onImageChange={setImageContent}
                    disabled={updateContentMutation.isPending}
                    className="max-w-md"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    {contentSection.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}