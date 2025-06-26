import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { BlogCard, BlogPostPreview, fallbackPosts } from '@/components/blog';

export default function BlogListPage() {
  const { data: apiPosts = [] } = useQuery<BlogPostPreview[]>({
    queryKey: ['blog','list'],
    queryFn: async ()=>{
      try{const res=await fetch('/api/blog'); if(res.ok) return res.json();}catch{}
      return [];
    }
  });

  const posts = apiPosts.length? apiPosts.filter(p=>(p as any).active!==0) : fallbackPosts;

  const categories = ['All', ...Array.from(new Set(posts.map(p=>p.tag).filter(Boolean)))] as string[];
  const [selected, setSelected] = useState('All');

  const visible = selected==='All'? posts : posts.filter(p=>p.tag===selected);

  return (
    <main className="pt-32 pb-20 bg-white text-deep-black">
      {/* Hero */}
      <section className="mb-16 text-center px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">Academy <span className="premium-accent">Insights</span></h1>
        <p className="text-gray-600 max-w-2xl mx-auto">News, tips and trends from the world of modern barbering.</p>
      </section>

      {/* Filters */}
      <section className="sticky top-24 z-10 bg-white/90 backdrop-blur border-b border-gray-100 mb-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 py-4 justify-center">
          {categories.map(cat=> (
            <button key={cat} onClick={()=>setSelected(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selected===cat? 'bg-[var(--premium-accent)] text-black':'bg-gray-100 hover:bg-gray-200'}`}>{cat}</button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(p=> <BlogCard key={p.slug??p.id} post={p} />)}
        </div>
      </section>
    </main>
  );
} 