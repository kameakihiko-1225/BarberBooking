import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { Calendar, Tag, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Navigation from '@/components/navigation';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  image: string | null;
  tag: string | null;
  createdAt: string;
}

export default function BlogPostPage() {
  const [match, params] = useRoute<{ slug: string }>('/blog/:slug');
  const [isVisible, setIsVisible] = useState(false);
  
  if (!match) return null;

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['blog', 'post', params.slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${params.slug}`);
      if (!res.ok) throw new Error('Post not found');
      return res.json();
    }
  });

  const { data: otherPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['blog', 'other-posts'],
    queryFn: async () => {
      const res = await fetch('/api/blog');
      if (!res.ok) return [];
      const posts = await res.json();
      return posts.filter((p: BlogPost) => p.slug !== params.slug).slice(0, 4);
    },
    enabled: !!post
  });

  useEffect(() => {
    if (post) {
      setIsVisible(true);
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/blog" className="inline-flex items-center px-6 py-3 bg-[var(--premium-accent)] text-white rounded-full hover:bg-[var(--golden-bronze)] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedContent = post.content.replace(/\n/g, '<br />').replace(/## (.*?)(?=<br|$)/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-800">$1</h2>').replace(/### (.*?)(?=<br|$)/g, '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-700">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>').replace(/- (.*?)(?=<br|$)/g, '<li class="ml-6 mb-2">$1</li>');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Use main navigation */}

      {/* Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {post.tag && (
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-[var(--premium-accent)]/10 text-[var(--premium-accent)] rounded-full text-sm font-medium">
                  <Tag className="w-3 h-3 mr-1" />
                  {post.tag}
                </span>
              </div>
            )}
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
              </div>
            </div>

            {post.image && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 md:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Article Content */}
          <article className="lg:col-span-3">
            <div className={`bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
              
              {/* CTA Section */}
              <div className="mt-12 p-8 bg-gradient-to-r from-[var(--premium-accent)]/10 to-[var(--golden-bronze)]/10 rounded-xl border border-[var(--premium-accent)]/20">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Ready to Start Your Barbering Journey?</h3>
                <p className="text-gray-600 mb-6">Join K&K Barber Academy and learn from industry professionals in our state-of-the-art facilities.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contacts" className="inline-flex items-center justify-center px-6 py-3 bg-[var(--premium-accent)] text-white rounded-full hover:bg-[var(--golden-bronze)] transition-all transform hover:scale-105">
                    Apply Now
                  </Link>
                  <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:border-[var(--premium-accent)] hover:text-[var(--premium-accent)] transition-colors">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className={`sticky top-32 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Related Articles</h3>
                <div className="space-y-4">
                  {otherPosts.map((relatedPost) => (
                    <Link 
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <div className="border border-gray-200 rounded-xl p-4 hover:border-[var(--premium-accent)] hover:shadow-md transition-all">
                        {relatedPost.image && (
                          <img 
                            src={relatedPost.image} 
                            alt={relatedPost.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h4 className="font-semibold text-gray-800 group-hover:text-[var(--premium-accent)] transition-colors line-clamp-2 mb-2">
                          {relatedPost.title}
                        </h4>
                        {relatedPost.tag && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {relatedPost.tag}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-[var(--premium-accent)]/10 to-[var(--golden-bronze)]/10 rounded-2xl p-6 border border-[var(--premium-accent)]/20">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Links</h3>
                <div className="space-y-3">
                  <Link href="/courses" className="block text-gray-600 hover:text-[var(--premium-accent)] transition-colors">
                    → View Courses
                  </Link>
                  <Link href="/instructors" className="block text-gray-600 hover:text-[var(--premium-accent)] transition-colors">
                    → Meet Instructors
                  </Link>
                  <Link href="/gallery" className="block text-gray-600 hover:text-[var(--premium-accent)] transition-colors">
                    → Student Gallery
                  </Link>
                  <Link href="/contacts" className="block text-gray-600 hover:text-[var(--premium-accent)] transition-colors">
                    → Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
} 