import { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Play, Grid3X3, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

type Media = { src: string; type: 'image' | 'video' };

function OptimizedMediaCard({ item, index }: { item: Media; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isMobile = useIsMobile();

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
                <Play className={`absolute inset-0 m-auto text-white bg-black/50 rounded-full p-3 opacity-80 group-hover:opacity-100 transition-opacity hover:bg-black/70 ${
                  isMobile ? 'h-8 w-8' : 'h-12 w-12'
                }`} />
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

export default function StudentsGalleryPage() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [gridSize, setGridSize] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [showAll, setShowAll] = useState(false);
  
  const { data = [], isLoading } = useQuery<Media[]>({
    queryKey: ['media', 'gallery'], // Use main gallery data
    queryFn: async () => {
      const res = await fetch('/api/media/gallery');
      if (!res.ok) throw new Error('Failed to fetch gallery');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Progressive loading based on device capabilities
  const getInitialLimit = () => {
    if (typeof window === 'undefined') return 15;
    
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const connectionSpeed = (navigator as any).connection?.effectiveType;
    
    if (isMobile) {
      if (deviceMemory <= 2 || connectionSpeed === '2g') return 10;
      if (deviceMemory <= 4 || connectionSpeed === '3g') return 15;
      return 20;
    }
    return 24;
  };

  const initialLimit = getInitialLimit();
  const displayLimit = showAll ? data.length : initialLimit;
  const shuffledMedia = [...data].sort(() => Math.random() - 0.5).slice(0, displayLimit);

  const getGridClasses = () => {
    const base = isMobile ? 'grid-cols-2' : 'grid-cols-3 lg:grid-cols-4';
    
    switch (gridSize) {
      case 'compact':
        return `${base} xl:grid-cols-6 2xl:grid-cols-7 gap-1 sm:gap-2`;
      case 'comfortable':
        return `${base} xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4`;
      case 'spacious':
        return `${base} xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6`;
      default:
        return `${base} xl:grid-cols-5 gap-3 md:gap-4`;
    }
  };

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
    <main className="pt-36 pb-20 bg-deep-black text-white scroll-container">
      <section className="text-center mb-12 px-4 scroll-fade-in">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{t('page.students.title')} <span className="premium-accent">{t('page.students.title.highlight')}</span></h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base mb-6">
          {t('page.students.explore')} - {data.length} {t('page.showcased.works')}
        </p>
        
        {/* Grid Size Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setGridSize('compact')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                gridSize === 'compact' 
                  ? 'bg-[var(--premium-accent)] text-black' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Grid3X3 size={14} />
              {!isMobile && 'Compact'}
            </button>
            <button
              onClick={() => setGridSize('comfortable')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                gridSize === 'comfortable' 
                  ? 'bg-[var(--premium-accent)] text-black' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <LayoutGrid size={14} />
              {!isMobile && 'Standard'}
            </button>
            <button
              onClick={() => setGridSize('spacious')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                gridSize === 'spacious' 
                  ? 'bg-[var(--premium-accent)] text-black' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Grid3X3 size={14} />
              {!isMobile && 'Spacious'}
            </button>
          </div>
          
          {!showAll && data.length > initialLimit && (
            <button
              onClick={() => setShowAll(true)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xs sm:text-sm font-medium transition-colors"
            >
              Show All ({data.length - initialLimit} more)
            </button>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-2 sm:px-4 mb-16 scroll-scale">
        <div className={`grid gallery-container ${getGridClasses()}`}>
          {shuffledMedia.map((item, index) => (
            <OptimizedMediaCard key={`${item.src}-${index}`} item={item} index={index} />
          ))}
        </div>
      </section>

      <div className="text-center px-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-center items-center">
          <Button className="bg-[var(--premium-accent)] text-black px-6 sm:px-10 py-3 sm:py-4 font-semibold rounded-full hover:bg-[var(--premium-accent)]/80 w-full sm:w-auto" asChild>
            <a href="/" className="flex items-center justify-center">
              <span className="block text-center">{t('page.back.home')}</span>
            </a>
          </Button>
          <Button className="sm:ml-4 bg-white text-deep-black px-6 sm:px-10 py-3 sm:py-4 font-semibold rounded-full hover:bg-white/90 w-full sm:w-auto" asChild>
            <a href="/contact" className="flex items-center justify-center">
              <span className="block text-center">{t('page.apply.now')}</span>
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}