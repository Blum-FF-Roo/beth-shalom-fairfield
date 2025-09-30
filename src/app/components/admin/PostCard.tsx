'use client';

import Link from 'next/link';
import { Post } from '@/app/utils';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canPublish?: boolean;
}

export default function PostCard({ 
  post, 
  onDelete, 
  onTogglePublish, 
  canEdit = true, 
  canDelete = true, 
  canPublish = true 
}: PostCardProps) {

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'parshah': 'bg-blue-100 text-blue-800',
      'high-holy-day': 'bg-purple-100 text-purple-800',
      'articles': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link 
              href={`/${post.category === 'high-holy-day' ? 'high-holy-days' : post.category}/${post.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              {post.title}
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                {post.category === 'parshah' ? 'Parshah' : 
                 post.category === 'high-holy-day' ? 'High Holy Days Sermons' :
                 post.category === 'articles' ? 'Articles of Interest' : 
                 post.category}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                post.isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {post.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>


        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {canEdit && (
              <Link
                href={`/admin/posts/edit/${post.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            )}
            
            {canDelete && (
              <button
                onClick={() => onDelete(post.id)}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            )}
            
            {!canEdit && !canDelete && (
              <span className="text-sm text-gray-500 italic">View only</span>
            )}
          </div>

          {canPublish && (
            <button
              onClick={() => onTogglePublish(post.id, !post.isPublished)}
              className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                post.isPublished
                  ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500'
                  : 'border-green-300 text-green-700 bg-white hover:bg-green-50 focus:ring-green-500'
              }`}
            >
              {post.isPublished ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  Publish
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}