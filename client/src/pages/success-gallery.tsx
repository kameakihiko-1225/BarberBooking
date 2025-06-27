/// <reference types="vite/client" />
import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

type GalleryItem = { src: string; type: 'image' | 'video' };

function LazyImage({ item, index }: { item: GalleryItem; index: number }) {
  const { src } = item;
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (imgRef.current) {
            imgRef.current.src = src;
          }
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [src]);

  const animationDelay = Math.min(index * 50, 800);

  return (
    <div
      ref={containerRef}
      className={`mb-5 break-inside-avoid transition-all duration-500 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        transitionDelay: `${animationDelay}ms`,
        willChange: 'transform, opacity'
      }}
    >
      {!error ? (
        <div className="relative">
          <img
            ref={imgRef}
            alt="success"
            className={`rounded-xl w-full h-auto hover:scale-105 transition-all duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={{ contentVisibility: 'auto' }}
          />
          {!loaded && inView && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-[3/4] bg-gray-800 rounded-xl" />
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
          {apiItems.map((item, index) => (
            <LazyImage key={item.src} item={item} index={index} />
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