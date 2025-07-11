import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Save, X, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  image: string | null;
  tag: string | null;
  language: string;
  originalPostId: number | null;
  active: number;
  createdAt: string;
  updatedAt: string;
}

interface NewBlogPost {
  slug: string;
  title: string;
  content: string;
  image: string;
  tag: string;
  language: string;
  originalPostId?: number | null;
}

interface LanguageGroup {
  [key: string]: BlogPost;
}

export default function BlogAdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  
  const [newPost, setNewPost] = useState<NewBlogPost>({
    slug: '',
    title: '',
    content: '',
    image: '',
    tag: '',
    language: 'pl'
  });

  const { data: allPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog-admin'],
    queryFn: async () => {
      const res = await fetch('/api/blog-admin');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (post: NewBlogPost) => {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-admin'] });
      setIsCreating(false);
      setNewPost({ slug: '', title: '', content: '', image: '', tag: '', language: 'pl' });
      toast({ title: 'Success', description: 'Blog post created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create blog post', variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-admin'] });
      toast({ title: 'Success', description: 'Blog post deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete blog post', variant: 'destructive' });
    }
  });

  // Group posts by their original post ID (for language variants)
  const groupedPosts = allPosts.reduce((acc, post) => {
    const groupKey = post.originalPostId?.toString() || post.id.toString();
    if (!acc[groupKey]) {
      acc[groupKey] = {};
    }
    acc[groupKey][post.language] = post;
    return acc;
  }, {} as Record<string, LanguageGroup>);

  const filteredGroups = selectedLanguage === 'all' 
    ? groupedPosts 
    : Object.fromEntries(
        Object.entries(groupedPosts).filter(([_, group]) => 
          Object.keys(group).includes(selectedLanguage)
        )
      );

  const handleCreatePost = () => {
    if (!newPost.slug || !newPost.title || !newPost.content) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    createMutation.mutate(newPost);
  };

  const handleCreateTranslation = (originalPost: BlogPost, targetLanguage: string) => {
    setNewPost({
      slug: `${originalPost.slug}-${targetLanguage}`,
      title: originalPost.title,
      content: originalPost.content,
      image: originalPost.image || '',
      tag: originalPost.tag || '',
      language: targetLanguage,
      originalPostId: originalPost.originalPostId || originalPost.id
    });
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blog Administration</h1>
            <p className="text-gray-600 mt-2">Manage your multi-language blog content</p>
          </div>
          <div className="flex gap-4">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="pl">Polish</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="tr">Turkish</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {newPost.originalPostId ? 'Create Translation' : 'Create New Blog Post'}
              </CardTitle>
              <CardDescription>
                {newPost.originalPostId ? 
                  `Creating ${newPost.language.toUpperCase()} translation` :
                  'Add a new blog post to your content library'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={newPost.slug}
                    onChange={(e) => setNewPost(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g., how-to-cut-hair"
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language *</Label>
                  <Select 
                    value={newPost.language} 
                    onValueChange={(value) => setNewPost(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pl">Polish</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="tr">Turkish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tag">Tag</Label>
                  <Input
                    id="tag"
                    value={newPost.tag}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tag: e.target.value }))}
                    placeholder="e.g., Tips, Techniques, Tools"
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newPost.image}
                    onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL or path"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content in Markdown..."
                  className="min-h-[300px]"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreatePost}
                  disabled={createMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {createMutation.isPending ? 'Creating...' : 'Create Post'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false);
                    setNewPost({ slug: '', title: '', content: '', image: '', tag: '', language: 'pl' });
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {Object.entries(filteredGroups).map(([groupKey, group]) => {
            const languages = Object.keys(group);
            const mainPost = group[languages[0]];
            
            return (
              <Card key={groupKey}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {mainPost.title}
                        <Badge variant={mainPost.active ? 'default' : 'secondary'}>
                          {mainPost.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Slug: {mainPost.slug} • Created: {new Date(mainPost.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(mainPost.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Language Variants */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Available Languages:</Label>
                      <div className="flex flex-wrap gap-2">
                        {languages.map(lang => (
                          <Badge key={lang} variant="outline" className="flex items-center gap-1">
                            <Languages className="w-3 h-3" />
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Missing Language Actions */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Add Translations:</Label>
                      <div className="flex gap-2">
                        {['pl', 'en', 'tr'].filter(lang => !languages.includes(lang)).map(lang => (
                          <Button
                            key={lang}
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateTranslation(mainPost, lang)}
                            className="flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add {lang.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Content Preview:</Label>
                      <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600">
                        {mainPost.content.substring(0, 200)}...
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {Object.keys(filteredGroups).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No blog posts found.</p>
            <Button onClick={() => setIsCreating(true)}>
              Create your first blog post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}