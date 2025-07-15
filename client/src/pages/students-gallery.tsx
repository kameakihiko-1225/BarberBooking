import { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
      className={`transition-all duration-400 ease-out ${
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
              alt="student work"
              className={`w-full h-48 sm:h-56 md:h-64 object-cover transition-all duration-300 group-hover:scale-105 ${
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
                className={`w-full h-48 sm:h-56 md:h-64 object-cover transition-all duration-300 ${
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
        <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-800 rounded-xl" />
      )}
    </div>
  );
}

export default function StudentsGalleryPage() {
  const { t } = useLanguage();
  const { data = [], isLoading } = useQuery<Media[]>({
    queryKey: ['media', 'gallery'], // Use main gallery data
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
      <main className="pt-36 pb-20 bg-deep-black text-white">
        <section className="text-center mb-20 px-4">
          <h1 className="font-serif text-5xl font-bold mb-4">{t('page.students.title')} <span className="premium-accent">{t('page.students.title.highlight')}</span></h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('page.students.explore')}</p>
        </section>
        <section className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-48 sm:h-56 md:h-64 bg-gray-800 animate-pulse rounded-xl" />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-36 pb-20 bg-deep-black text-white">
      <section className="text-center mb-20 px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">{t('page.students.title')} <span className="premium-accent">{t('page.students.title.highlight')}</span></h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          {t('page.students.explore')} - {data.length} {t('page.showcased.works')}
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {shuffledMedia.map((item, index) => (
            <OptimizedMediaCard key={`${item.src}-${index}`} item={item} index={index} />
          ))}
        </div>
      </section>

      <div className="text-center">
        <Button className="bg-[var(--premium-accent)] text-black px-10 py-4 font-semibold rounded-full hover:bg-[var(--premium-accent)]/80" asChild>
          <a href="/">{t('page.back.home')}</a>
        </Button>
        <Button className="ml-4 bg-white text-deep-black px-10 py-4 font-semibold rounded-full hover:bg-white/90 mt-4" asChild>
          <a href="/contact">{t('page.apply.now')}</a>
        </Button>
      </div>
    </main>
  );
}