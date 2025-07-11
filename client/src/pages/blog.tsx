import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { BlogCard, BlogPostPreview, getLocalizedFallbackPosts } from '@/components/blog';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BlogListPage() {
  const { t, language } = useLanguage();
  const { data: apiPosts = [] } = useQuery<BlogPostPreview[]>({
    queryKey: ['blog','list', language],
    queryFn: async ()=>{
      try{const res=await fetch(`/api/blog?language=${language}`); if(res.ok) return res.json();}catch{}
      return [];
    }
  });

  const posts = apiPosts.length? apiPosts.filter(p=>(p as any).active!==0) : getLocalizedFallbackPosts(t);

  const allCategories = ['All', ...Array.from(new Set(posts.map(p=>p.tag).filter(Boolean)))] as string[];
  const categories = allCategories.map(cat => cat === 'All' ? t('blog.filter.all') : cat);
  const [selected, setSelected] = useState('All');

  const visible = selected==='All'? posts : posts.filter(p=>p.tag===selected);

  return (
    <main className="pt-32 pb-20 bg-white text-deep-black">
      {/* Hero */}
      <section className="mb-16 text-center px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">{t('page.blog.title')} <span className="premium-accent">{t('page.blog.title.highlight')}</span></h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t('page.blog.subtitle')}</p>
      </section>

      {/* Filters */}
      <section className="sticky top-24 z-10 bg-white/90 backdrop-blur border-b border-gray-100 mb-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 py-4 justify-center">
          {allCategories.map((cat, idx)=> (
            <button key={cat} onClick={()=>setSelected(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selected===cat? 'bg-[var(--premium-accent)] text-black':'bg-gray-100 hover:bg-gray-200'}`}>
              {categories[idx]}
            </button>
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