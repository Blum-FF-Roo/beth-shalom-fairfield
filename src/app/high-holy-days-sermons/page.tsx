'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Post } from '@/app/utils';
import { getPostsByCategory } from '@/app/utils';

export default function HighHolyDaysSermonsPage() {
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
      const fetchedPosts = await getPostsByCategory('high-holy-day', true); // Only published posts
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load High Holy Days sermons');
      console.error('Error loading High Holy Days sermons:', err);
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
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
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
            High Holy Days Sermons
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meaningful sermons and teachings from our High Holy Days services
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
              placeholder="Search sermons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Results Info */}
        {searchTerm && (
          <div className="mb-4 text-gray-600">
            Found {filteredPosts.length} sermon{filteredPosts.length !== 1 ? 's' : ''} 
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? `No sermons found for "${searchTerm}"` : 'No sermons available'}
              </p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <Link 
                      href={`/high-holy-days/${post.id}`}
                      className="block group"
                    >
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 mb-2">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="text-gray-700 mb-4 line-clamp-3">
                      {post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <time dateTime={post.createdAt.toISOString()}>
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}