'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Post } from '@/app/utils';
import { getPostsByCategory } from '@/app/utils';

export default function ParashahPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [posts, searchTerm]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getPostsByCategory('parshah', true); // Only published posts
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load Parshah posts');
      console.error('Error loading Parshah posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>
            <div className="h-12 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#F58C28'}}>
            Parshah Articles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Weekly Torah portion insights and commentary from Congregation Beth Shalom
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Articles List */}
        {filteredPosts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchTerm ? `No articles found for "${searchTerm}"` : 'No Parshah articles available yet.'}
            </div>
            <p className="text-gray-400 mt-2">
              {searchTerm ? 'Try adjusting your search terms.' : 'Please check back later for new content.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {searchTerm ? `Search Results (${filteredPosts.length})` : `All Articles (${filteredPosts.length})`}
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/parshah/${post.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 hover:text-orange-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}