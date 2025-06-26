/// <reference types="vite/client" />
import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

type GalleryItem = { src: string; type: 'image' | 'video' };

function LazyImage({ item, onLoaded }: { item: GalleryItem; onLoaded: (src: string) => void }) {
  const { src } = item;
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySrc] = useState<string>(src);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) onLoaded(src);
    }, { rootMargin: '400px' });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [displaySrc, src]);

  return (
    <div
      ref={containerRef}
      className="mb-5 break-inside-avoid transform transition duration-700 ease-out"
    >
      {!displaySrc && <div className="w-full aspect-[3/4] rounded-xl bg-gray-800 animate-pulse" />}
      {displaySrc && (
        <img
          src={displaySrc}
          alt="success"
          className="rounded-xl w-full h-auto hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onLoad={() => onLoaded(src)}
        />
      )}
    </div>
  );
}

export default function SuccessGalleryPage() {
  const { data: apiItems = [] } = useQuery<GalleryItem[]>({
    queryKey: ['media', 'success-stories'],
    queryFn: async () => {
      const res = await fetch('/api/media/success-stories');
      return res.json();
    },
  });
  const items = apiItems;
  const [loadedSet, setLoadedSet] = useState<Set<string>>(new Set());
  const handleLoaded = (src: string) => setLoadedSet((prev) => new Set(prev).add(src));

  return (
    <main className="pt-32 pb-20 bg-deep-black text-white">
      <section className="text-center mb-20 px-4 text-white">
        <h1 className="font-serif text-5xl font-bold mb-4">
          Graduate <span className="premium-accent">Success Stories</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Browse inspiring achievements and milestones reached by our alumni after completing their training.
        </p>
      </section>
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="columns-1 xs:columns-2 sm:columns-2 md:columns-3 xl:columns-4 gap-4">
          {items.map((m, idx) => (
            <div
              key={m.src}
              className={`transition duration-700 ease-out ${loadedSet.has(m.src) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              <LazyImage item={m} onLoaded={handleLoaded} />
            </div>
          ))}
        </div>
      </section>
      <div className="text-center">
        <Button className="bg-[var(--premium-accent)] text-black px-10 py-4 rounded-full font-semibold hover:bg-[var(--premium-accent)]/80" asChild>
          <a href="/">Back to Home</a>
        </Button>
        <Button asChild className="ml-4 bg-white text-deep-black px-10 py-4 rounded-full font-semibold hover:bg-white/90 mt-4">
          <a href="/contacts">Apply Now</a>
        </Button>
      </div>
    </main>
  );
} 