import "keen-slider/keen-slider.min.css";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import LazyMedia from "./LazyMedia";
import MediaModal from "./MediaModal";

type Media = { src: string; type: "image" | "video"; alt?: string };

export default function Gallery() {
  const { t } = useLanguage();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: galleryMedia = [], isLoading, error } = useQuery<Media[]>({
    queryKey: ['media', 'gallery'],
    queryFn: async () => {
      const res = await fetch('/api/media/gallery');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    select: (data) => data.map(item => ({
      ...item,
      alt: item.src.split('/').pop()?.replace(/[-_]/g, ' ').replace(/\..+$/, '') || 'Gallery item'
    })),
  });

  // Remove forced refetch for better performance

  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    slides: {
      perView: "auto",
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 640px)": {
        slides: { perView: 1.2, spacing: 8 },
      },
      "(max-width: 1024px)": {
        slides: { perView: 2.5, spacing: 12 },
      },
    },
    initial: 0,
    created() {
      setLoaded(true);
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        instanceRef.current?.prev();
      } else if (e.key === 'ArrowRight') {
        instanceRef.current?.next();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [instanceRef]);

  if (isLoading) {
    return (
      <section className="py-24 bg-deep-black text-white" id="gallery">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-12">{t('gallery.title')} <span className="premium-accent">{t('gallery.title.highlight')}</span></h2>
          <div className="w-full h-72 bg-gray-800 rounded-2xl flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-deep-black text-white" id="gallery">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-12">{t('gallery.title')} <span className="premium-accent">{t('gallery.title.highlight')}</span></h2>
          <div className="w-full h-72 bg-gray-800 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 mb-4">Error loading gallery: {error.message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[var(--premium-accent)] text-black rounded hover:bg-[var(--premium-accent)]/80 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (galleryMedia.length === 0) {
    return (
      <section className="py-24 bg-deep-black text-white" id="gallery">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-12">{t('gallery.title')} <span className="premium-accent">{t('gallery.title.highlight')}</span></h2>
          <div className="w-full h-72 bg-gray-800 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <p className="text-white mb-4">No gallery items available</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[var(--premium-accent)] text-black rounded hover:bg-[var(--premium-accent)]/80 transition-colors"
              >
                Refresh Gallery
              </button>
            </div>
          </div>
          <Button className="mt-6 block mx-auto" asChild>
            <Link href="/gallery">{t('gallery.view.full')}</Link>
          </Button>
        </div>
      </section>
    );
  }

  // Limit items for carousel performance - optimize for mobile loading
  const limit = isMobile ? 6 : 12;
  const shuffledMedia = [...galleryMedia].sort(() => Math.random() - 0.5).slice(0, limit);

  const handleMediaClick = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  return (
    <section className="py-24 bg-deep-black text-white" id="gallery">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            {t('gallery.title')} <span className="premium-accent">{t('gallery.title.highlight')}</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            {t('gallery.description')}
          </p>
        </div>

        <div className="relative">
          <div ref={sliderRef} className="keen-slider mb-8">
            {shuffledMedia.map((item, index) => (
              <div key={`${item.src}-${index}`} className="keen-slider__slide !min-w-[280px] !max-w-[300px]">
                <LazyMedia 
                  item={item} 
                  heightClass={isMobile ? "h-48" : "h-72"}
                  onClick={() => handleMediaClick(index)}
                />
              </div>
            ))}
          </div>

          {shuffledMedia.length > 1 && (
            <>
              <button
                onClick={() => {
                  instanceRef.current?.prev();
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft size={isMobile ? 20 : 24} />
              </button>
              <button
                onClick={() => {
                  instanceRef.current?.next();
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight size={isMobile ? 20 : 24} />
              </button>
            </>
          )}
        </div>

        <div className="text-center">
          <Button className="mt-6 sm:mt-8 bg-[var(--premium-accent)] hover:bg-[var(--premium-accent)]/80 text-black font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base flex items-center justify-center" asChild>
            <Link href="/gallery" className="flex items-center justify-center">
              <span className="block text-center">{t('gallery.view.full')}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Media Modal */}
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        media={shuffledMedia}
        initialIndex={selectedIndex}
      />
    </section>
  );
}