// features/home/components/NewsWidget.tsx
'use client';

import { useState } from 'react';
import { useLatestPosts } from '../api';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export function NewsWidget() {
  const { data: posts, isLoading, error } = useLatestPosts();
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  const togglePost = (index: number) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 text-sm">Nie udało się załadować ogłoszeń</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-gray-700 font-semibold text-lg mb-4 text-center pb-3 border-b border-gray-300">
          Ogłoszenia
        </h2>
        <p className="text-gray-500 text-sm text-center py-8">Brak aktualności</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="border-b border-gray-300 pb-3 mb-6">
        <h2 className="text-gray-700 font-semibold text-lg text-center">
          Ogłoszenia
        </h2>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.slice(0, 5).map((post, index) => {
          const isExpanded = expandedPosts.has(index);
          
          return (
            <article key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
              {/* Post Header with Logo */}
              <div className="flex items-start gap-3 mb-3">
                {/* Logo placeholder - customize based on source */}
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">MOST</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Source name */}
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {post.source || 'Salezjańskie Duszpasterstwo Akademickie MOST'}
                  </h3>
                  
                  {/* Date */}
                  <p className="text-gray-500 text-xs">
                    {post.publishedDate 
                      ? format(new Date(post.publishedDate), 'd MMMM HH:mm', { locale: pl })
                      : 'Niedawno'
                    }
                  </p>
                </div>
              </div>

              {/* Post Title (if exists as hashtag) */}
              {post.title && post.title.startsWith('#') && (
                <h4 className="text-green-600 font-bold text-base mb-2">
                  {post.title}
                </h4>
              )}

              {/* Post Content */}
              <div className="text-gray-700 text-sm leading-relaxed">
                <div 
                  className={`${!isExpanded ? 'line-clamp-3' : ''}`}
                  dangerouslySetInnerHTML={{ 
                    __html: post.excerpt || post.fullContent.substring(0, 300) 
                  }}
                />
                
                {/* Expand/Collapse button */}
                {post.fullContent && post.fullContent.length > 300 && (
                  <button
                    onClick={() => togglePost(index)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        Zobacz mniej <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Zobacz więcej <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Link to original post */}
              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium mt-3"
                >
                  View on Facebook <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}