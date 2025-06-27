import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const fallbackPosts = [
  {
    id: 1,
    title: 'How to Start a Career in Barbering',
    excerpt: "Thinking about becoming a barber? Here's what your first 30 days might look like...",
    tag: 'Beginner',
    image: 'https://images.unsplash.com/photo-1522337998782-027a5d00f135?auto=format&fit=crop&w=600&q=60',
    slug: 'start-barber-career',
  },
  {
    id: 2,
    title: 'Top 5 Fade Techniques for 2025',
    excerpt: 'Stay ahead of the curve with these must-know fade variations every client will ask for.',
    tag: 'Trends',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=60',
    slug: 'fade-techniques-2025',
  },
  {
    id: 3,
    title: 'Barber Toolkit: Essentials vs. Nice-to-Have',
    excerpt: "From clippers to combs, here's our definitive guide to building a pro kit without overspending.",
    tag: 'Tools',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ebb6b7?auto=format&fit=crop&w=600&q=60',
    slug: 'barber-toolkit',
  },
];

export interface BlogPostPreview {
  id:number;
  slug:string;
  title:string;
  excerpt?:string;
  image?:string;
  tag?:string;
}

export function BlogCard({ post }: { post: BlogPostPreview }) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.style.paddingTop = '1rem';
    }
  };

  return (
    <div className="snap-start w-[320px] shrink-0 bg-deep-black rounded-2xl border border-[var(--premium-accent)]/40 hover:border-[var(--premium-accent)] hover:shadow-[0_4px_20px_rgba(205,127,50,0.3)] hover:scale-105 transition-transform duration-300 relative overflow-hidden group flex flex-col">
      {post.image && (
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-40 object-cover rounded-t-2xl group-hover:brightness-90 transition-all duration-300" 
          onError={handleImageError}
        />
      )}
      <div className="p-4 text-white flex flex-col flex-grow">
        <div className="flex-grow">
          {post.tag && <span className="bg-[var(--premium-accent)] text-black text-xs px-3 py-1 rounded-full font-semibold uppercase">
            {post.tag}
          </span>}
          <h3 className="mt-3 text-lg font-serif font-bold leading-snug group-hover:text-[var(--premium-accent)] transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && <p className="text-xs text-gray-300 mt-2 line-clamp-2">{post.excerpt}</p>}
        </div>
        <div className="mt-4">
          <Link href={`/blog/${post.slug}`} className="inline-block text-[var(--premium-accent)] text-sm font-medium hover:underline">
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BlogSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: apiPosts = [] } = useQuery<BlogPostPreview[]>({
    queryKey: ['blog','preview'],
    queryFn: async ()=>{
      const res = await fetch('/api/blog');
      if(res.ok) return res.json();
      return [];
    }
  });

  // Use real blog posts from database, add excerpt generation
  const posts = apiPosts.length > 0 
    ? apiPosts.filter(p => (p as any).active !== 0).slice(0, 6).map(post => ({
        ...post,
        excerpt: post.excerpt || (post as any).content?.slice(0, 120) + '...' || ''
      }))
    : fallbackPosts;

  useEffect(()=>{containerRef.current?.scrollTo({left:0});},[]);

  const scrollBy = (dir:number)=>{
    if(containerRef.current) containerRef.current.scrollBy({left:dir*340,behavior:'smooth'});
  };

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Latest <span className="premium-accent">Insights</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Tips, trends, and resources to keep you at the cutting edge of the barbering world.
          </p>
        </div>
        <div className="relative">
          <div ref={containerRef} className="flex overflow-x-auto snap-x snap-mandatory gap-6 scroll-smooth pb-4">
            {posts.map(p=> <BlogCard key={p.slug??p.id} post={p} />)}
          </div>
          <button onClick={()=>scrollBy(-1)} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/20 backdrop-blur border border-white/40 w-10 h-10 rounded-full items-center justify-center hover:bg-[var(--premium-accent)]/20 transition-all">
            <ChevronLeft className="text-[var(--premium-accent)]" />
          </button>
          <button onClick={()=>scrollBy(1)} className="hidden md:flex absolute right-0 top-1/2 translate-y-[-50%] translate-x-1/2 bg-white/20 backdrop-blur border border-white/40 w-10 h-10 rounded-full items-center justify-center hover:bg-[var(--premium-accent)]/20 transition-all">
            <ChevronRight className="text-[var(--premium-accent)]" />
          </button>
        </div>
      </div>
    </section>
  );
} 