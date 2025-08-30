'use client';

import Link from 'next/link';
import { Post } from '@/app/utils';
import ShareButton from '@/app/components/ui/ShareButton';

interface PostListProps {
  posts: Post[];
  category: 'parshah' | 'high-holy-day';
}

export default function PostList({ posts, category }: PostListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getExcerpt = (content: string, maxLength: number = 200) => {
    const plainText = content.replace(/[*>#-]/g, '').replace(/\s+/g, ' ').trim();
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          No {category === 'parshah' ? 'Parshah' : 'High Holy Day'} posts available yet.
        </div>
        <p className="text-gray-400 mt-2">
          Please check back later for new content.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
          <div className="p-6 sm:p-8">
            {/* Category and Date */}
            <div className="flex items-center justify-between mb-4">
              {/* <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ */}
              {/*   post.category === 'parshah'  */}
              {/*     ? 'bg-blue-100 text-blue-800'  */}
              {/*     : 'bg-purple-100 text-purple-800' */}
              {/* }`}> */}
              {/*   {post.category === 'parshah' ? 'Parshah' : 'High Holy Day'} */}
              {/* </span> */}
              
              <div className="text-sm text-gray-500">
                {formatDate(post.createdAt)}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              <Link 
                href={`/${post.category}/${post.id}`}
                className="hover:text-orange-600 transition-colors duration-200"
              >
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {getExcerpt(post.content)}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Link
                href={`/${post.category}/${post.id}`}
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                Read More →
              </Link>
              
              <ShareButton 
                url={`${window.location.origin}/${post.category}/${post.id}`}
                title={post.title}
                className="text-sm"
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}