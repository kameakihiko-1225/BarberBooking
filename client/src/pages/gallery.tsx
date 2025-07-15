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
  const { t } = useLanguage();
  const { data = [], isLoading } = useQuery<Media[]>({
    queryKey: ['media', 'gallery'],
    queryFn: async () => {
      const res = await fetch('/api/media/gallery');
      if (!res.ok) throw new Error('Failed to fetch gallery');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Optimize for mobile performance - limit initial load and randomize
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const limit = isMobile ? 20 : data.length;
  const shuffledMedia = [...data].sort(() => Math.random() - 0.5).slice(0, limit);

  if (isLoading) {
    return (
      <main className="pt-36 pb-20 bg-deep-black text-white">
        <section className="text-center mb-20 px-4">
          <h1 className="font-serif text-5xl font-bold mb-4">{t('page.gallery.title')} <span className="premium-accent">{t('page.gallery.title.highlight')}</span></h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('page.gallery.loading')}</p>
        </section>
        <section className="max-w-6xl mx-auto px-4">
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="aspect-[4/3] bg-gray-800 animate-pulse rounded-xl" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-36 pb-20 bg-deep-black text-white">
      <section className="text-center mb-20 px-4">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t('page.gallery.title')} <span className="premium-accent">{t('page.gallery.title.highlight')}</span></h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
          {t('page.gallery.explore')}
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-2 sm:px-4 mb-16">
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
          {shuffledMedia.map((item, index) => (
            <div key={`${item.src}-${index}`} className="break-inside-avoid mb-2 sm:mb-4">
              <OptimizedMediaCard item={item} index={index} />
            </div>
          ))}
        </div>
      </section>

      <div className="text-center px-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-center items-center">
          <Button className="bg-[var(--premium-accent)] text-black px-6 sm:px-10 py-3 sm:py-4 font-semibold rounded-full hover:bg-[var(--premium-accent)]/80 w-full sm:w-auto flex items-center justify-center" asChild>
            <a href="/" className="flex items-center justify-center w-full">
              <span className="block text-center">{t('page.back.home')}</span>
            </a>
          </Button>
          <Button className="sm:ml-4 bg-white text-deep-black px-6 sm:px-10 py-3 sm:py-4 font-semibold rounded-full hover:bg-white/90 w-full sm:w-auto flex items-center justify-center" asChild>
            <a href="/contact" className="flex items-center justify-center w-full">
              <span className="block text-center">{t('page.apply.now')}</span>
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}