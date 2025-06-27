import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useState, useMemo, useCallback } from 'react';
import { Link } from 'wouter';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Image, Tag, Type, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().optional(),
  tag: z.string().optional(),
  active: z.number().min(0).max(1)
});

type BlogPostForm = z.infer<typeof blogPostSchema>;

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  image: string | null;
  tag: string | null;
  active: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogAdmin() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog', 'admin'],
    queryFn: async () => {
      const res = await fetch('/api/blog-admin');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  const handleCreatePost = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleEditPost = useCallback((post: BlogPost) => {
    setEditingPost(post);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsCreating(false);
    setEditingPost(null);
  }, []);

  const createMutation = useMutation({
    mutationFn: async (data: BlogPostForm) => {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      setIsCreating(false);
      toast({ title: 'Success', description: 'Blog post created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create blog post', variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<BlogPostForm> }) => {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      setEditingPost(null);
      toast({ title: 'Success', description: 'Blog post updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update blog post', variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast({ title: 'Success', description: 'Blog post deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete blog post', variant: 'destructive' });
    }
  });

  const BlogPostForm = ({ post, onSubmit, onCancel }: {
    post?: BlogPost;
    onSubmit: (data: BlogPostForm) => void;
    onCancel: () => void;
  }) => {
    const form = useForm<BlogPostForm>({
      resolver: zodResolver(blogPostSchema),
      defaultValues: {
        title: post?.title || '',
        slug: post?.slug || '',
        content: post?.content || '',
        image: post?.image || '',
        tag: post?.tag || '',
        active: post?.active ?? 1
      }
    });

    const generateSlug = (title: string) => {
      return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const handleTitleChange = (title: string) => {
      form.setValue('title', title);
      if (!post) {
        form.setValue('slug', generateSlug(title));
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {post ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Type className="w-4 h-4 mr-2" />
                  Title
                </label>
                <input
                  {...form.register('title')}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--premium-accent)] focus:border-transparent"
                  placeholder="Enter blog post title"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Slug
                </label>
                <input
                  {...form.register('slug')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--premium-accent)] focus:border-transparent"
                  placeholder="url-friendly-slug"
                />
                {form.formState.errors.slug && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.slug.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 mr-2" />
                  Image URL
                </label>
                <input
                  {...form.register('image')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--premium-accent)] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 mr-2" />
                  Tag
                </label>
                <select
                  {...form.register('tag')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--premium-accent)] focus:border-transparent"
                >
                  <option value="">Select a tag</option>
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="TRENDS">TRENDS</option>
                  <option value="TOOLS">TOOLS</option>
                  <option value="TECHNIQUES">TECHNIQUES</option>
                  <option value="CAREER">CAREER</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Content
              </label>
              <textarea
                {...form.register('content')}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--premium-accent)] focus:border-transparent resize-y"
                placeholder="Write your blog post content here. You can use Markdown formatting:

## Headings
### Subheadings
**Bold text**
- Bullet points

Content will be automatically formatted when displayed."
              />
              {form.formState.errors.content && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.content.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...form.register('active', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--premium-accent)] focus:border-transparent"
              >
                <option value={1}>Active (Published)</option>
                <option value={0}>Inactive (Draft)</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending}
                className="inline-flex items-center px-6 py-2 bg-[var(--premium-accent)] text-white rounded-lg hover:bg-[var(--golden-bronze)] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-[var(--premium-accent)] transition-colors group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="font-serif text-xl font-bold text-gray-800">K&K Barber Academy</Link>
            <button
              onClick={handleCreatePost}
              className="inline-flex items-center px-4 py-2 bg-[var(--premium-accent)] text-white rounded-lg hover:bg-[var(--golden-bronze)] transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">Blog Administration</h1>
              <p className="text-gray-600 text-lg">Manage your blog posts - create, edit, and organize content for your visitors.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleCreatePost}
                className="inline-flex items-center px-6 py-3 bg-[var(--premium-accent)] text-white rounded-lg hover:bg-[var(--golden-bronze)] transition-colors shadow-lg font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Post
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all">
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.active === 0 && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        Draft
                      </div>
                    )}
                    {post.tag && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--premium-accent)] text-white text-xs rounded-full">
                        {post.tag}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[var(--premium-accent)] hover:text-[var(--golden-bronze)] transition-colors text-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => setEditingPost(post)}
                        className="p-2 text-gray-600 hover:text-[var(--premium-accent)] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this post?')) {
                            deleteMutation.mutate(post.id);
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20">
              <div className="mb-6">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No blog posts yet</h3>
                <p className="text-gray-600">Create your first blog post to get started.</p>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-6 py-3 bg-[var(--premium-accent)] text-white rounded-lg hover:bg-[var(--golden-bronze)] transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Modals */}
      {isCreating && (
        <BlogPostForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingPost && (
        <BlogPostForm
          post={editingPost}
          onSubmit={(data) => updateMutation.mutate({ id: editingPost.id, data })}
          onCancel={() => setEditingPost(null)}
        />
      )}
    </div>
  );
} 