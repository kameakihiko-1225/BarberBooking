import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';

export default function BlogPostPage() {
  const [match, params] = useRoute<{ slug: string }>('/blog/:slug');
  if (!match) return null;

  const { data } = useQuery<any>({
    queryKey: ['blog','post',params.slug],
    queryFn: async ()=>{
      try{const res = await fetch(`/api/blog/${params.slug}`); if(res.ok) return res.json();}catch{}
      return null;
    }
  });

  if(!data) return <div className="min-h-screen flex items-center justify-center">Post not found.</div>;

  return (
    <main className="pt-32 pb-20 bg-white text-deep-black">
      <article className="max-w-3xl mx-auto px-4">
        <h1 className="font-serif text-4xl font-bold mb-4">{data.title}</h1>
        <img src={data.image} alt={data.title} className="w-full h-64 object-cover rounded-xl mb-8" />
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{__html: data.content}} />
      </article>
    </main>
  );
} 