import { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

type Media = { src: string; type: 'image' | 'video' };

function OptimizedMediaCard({ item, index }: { item: Media; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (mediaRef.current) {
            if (item.type === 'image') {
              (mediaRef.current as HTMLImageElement).src = item.src;
            } else {
              (mediaRef.current as HTMLVideoElement).src = item.src;
            }
          }
          obs.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [item.src, item.type]);

  const handleVideoClick = () => {
    if (item.type === 'video' && mediaRef.current) {
      const video = mediaRef.current as HTMLVideoElement;
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const animationDelay = Math.min(index * 30, 600);

  return (
    <div
      ref={containerRef}
      className={`mb-4 break-inside-avoid transition-all duration-400 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ 
        transitionDelay: `${animationDelay}ms`,
        willChange: 'transform, opacity'
      }}
    >
      {!error ? (
        <div className="relative rounded-xl overflow-hidden group">
          {item.type === 'image' ? (
            <img
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              alt="gallery"
              className={`w-full h-auto object-cover transition-all duration-300 group-hover:scale-105 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              style={{ contentVisibility: 'auto' }}
            />
          ) : (
            <div className="relative cursor-pointer" onClick={handleVideoClick}>
              <video
                ref={mediaRef as React.RefObject<HTMLVideoElement>}
                className={`w-full h-auto object-cover transition-all duration-300 ${
                  loaded ? 'opacity-100' : 'opacity-0'
                }`}
                preload="metadata"
                muted
                loop
                playsInline
                onLoadedData={() => setLoaded(true)}
                onError={() => setError(true)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                style={{ contentVisibility: 'auto' }}
              />
              {!isPlaying && (
                <Play className="absolute inset-0 m-auto h-12 w-12 text-white bg-black/50 rounded-full p-3 opacity-80 group-hover:opacity-100 transition-opacity hover:bg-black/70" />
              )}
            </div>
          )}
          {!loaded && inView && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-[4/3] bg-gray-800 rounded-xl" />
      )}
    </div>
  );
}

export default function GalleryPage() {
  const { data = [], isLoading } = useQuery<Media[]>({
    queryKey: ['media', 'gallery'],
    queryFn: async () => {
      const res = await fetch('/api/media/gallery');
      if (!res.ok) throw new Error('Failed to fetch gallery');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Shuffle media for varied display
  const shuffledMedia = [...data].sort(() => Math.random() - 0.5);

  if (isLoading) {
    return (
      <main className="pt-32 pb-20 bg-deep-black text-white">
        <section className="text-center mb-20 px-4">
          <h1 className="font-serif text-5xl font-bold mb-4">Full <span className="premium-accent">Gallery</span></h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Discover our complete collection of work</p>
        </section>
        <section className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-gray-800 animate-pulse rounded-xl" />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 bg-deep-black text-white">
      <section className="text-center mb-20 px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">Full <span className="premium-accent">Gallery</span></h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore our complete collection of {data.length} professional works and training moments
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {shuffledMedia.map((item, index) => (
            <OptimizedMediaCard key={`${item.src}-${index}`} item={item} index={index} />
          ))}
        </div>
      </section>

      <div className="text-center">
        <Button className="bg-[var(--premium-accent)] text-black px-10 py-4 font-semibold rounded-full hover:bg-[var(--premium-accent)]/80" asChild>
          <a href="/">Back to Home</a>
        </Button>
        <Button className="ml-4 bg-white text-deep-black px-10 py-4 font-semibold rounded-full hover:bg-white/90 mt-4" asChild>
          <a href="/contacts">Apply Now</a>
        </Button>
      </div>
    </main>
  );
}