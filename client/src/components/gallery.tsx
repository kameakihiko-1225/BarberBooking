import "keen-slider/keen-slider.min.css";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type Media = { src: string; type: "image" | "video" };

function LazyMedia({ item, isMobile = false }: { item: Media; isMobile?: boolean }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (item.type === "image" && imgRef.current) {
            imgRef.current.src = item.src;
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [item.src, item.type]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  const heightClass = isMobile ? "h-24 xs:h-28 sm:h-32" : "h-72";

  return (
    <div ref={containerRef} className="relative overflow-hidden group rounded-2xl">
      {item.type === "image" ? (
        !imageError ? (
          <div className={`relative w-full ${heightClass} bg-gray-800`}>
            <img 
              ref={imgRef}
              alt="gallery" 
              className={`w-full ${heightClass} object-cover transition-all duration-1000 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!imageLoaded && (
              <div className={`absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center`}>
                <div className="w-6 h-6 border-2 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        ) : (
          <div className={`w-full ${heightClass} bg-gray-800`} />
        )
      ) : (
        <div className="relative cursor-pointer" onClick={handleVideoClick}>
          <video
            ref={videoRef}
            src={item.src}
            className={`w-full ${heightClass} object-cover grayscale group-hover:grayscale-0 transition-all`}
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
          {!isPlaying && (
            <Play className={`absolute inset-0 m-auto ${isMobile ? 'h-8 w-8' : 'h-14 w-14'} text-white bg-black/50 rounded-full p-2 transition-opacity hover:bg-black/70`} />
          )}
        </div>
      )}
    </div>
  );
}

export default function Gallery() {
  const [isMobile, setIsMobile] = useState(false);
  const { data: galleryMedia = [] } = useQuery<Media[]>({
    queryKey: ['media', 'gallery'],
    queryFn: async () => {
      const res = await fetch('/api/media/gallery');
      return res.json();
    },
  });

  // Shuffle and limit media for performance
  const shuffledMedia = [...galleryMedia]
    .sort(() => Math.random() - 0.5)
    .slice(0, 12);

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1.1, spacing: 16 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2.1, spacing: 24 } },
      "(min-width: 1024px)": { slides: { perView: 3.2, spacing: 32 } },
    },
    renderMode: "performance",
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (galleryMedia.length === 0) {
    return (
      <section className="py-24 bg-deep-black text-white" id="gallery">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-12">Be an <span className="premium-accent">Icon</span></h2>
          <div className="w-full h-72 bg-gray-800 animate-pulse rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-deep-black text-white" id="gallery">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-12">Our <span className="premium-accent">Gallery</span></h2>

        {/* Mobile Grid Layout - 3+ columns for iPhone SE */}
        {isMobile ? (
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-2 gap-1 xs:gap-2 sm:gap-4 mb-12">
            {shuffledMedia.slice(0, 12).map((item, idx) => (
              <div key={`${item.src}-${idx}`} className="w-full">
                <LazyMedia item={item} isMobile={true} />
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Slider Layout */
          <div className="relative mb-12">
            <div ref={sliderRef} className="keen-slider">
              {shuffledMedia.map((item, idx) => (
                <div key={`${item.src}-${idx}`} className="keen-slider__slide">
                  <LazyMedia item={item} />
                </div>
              ))}
            </div>

            {/* Arrows */}
            <button
              className="absolute -left-6 top-1/2 -translate-y-1/2 md:-left-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center group hover:bg-[var(--premium-accent)]/15 hover:border-[var(--premium-accent)]/50 transition-all shadow-lg hover:shadow-[0_0_12px_var(--premium-accent)]"
              onClick={() => slider.current?.prev()}
            >
              <ChevronLeft className="h-5 w-5 text-[var(--premium-accent)] transition-colors" />
            </button>
            <button
              className="absolute -right-6 top-1/2 -translate-y-1/2 md:-right-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center group hover:bg-[var(--premium-accent)]/15 hover:border-[var(--premium-accent)]/50 transition-all shadow-lg hover:shadow-[0_0_12px_var(--premium-accent)]"
              onClick={() => slider.current?.next()}
            >
              <ChevronRight className="h-5 w-5 text-[var(--premium-accent)] transition-colors" />
            </button>
          </div>
        )}

        <Button className="mt-6" asChild>
          <Link href="/gallery">View Full Gallery</Link>
        </Button>
      </div>
    </section>
  );
} 