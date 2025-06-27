import { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

type Media = { src: string; type: 'image' | 'video' };

function ImageCard({ src, index }: { src: string; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (imgRef.current) {
            imgRef.current.src = src;
          }
          obs.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [src]);

  const animationDelay = Math.min(index * 50, 800); // Stagger animation, max 800ms

  return (
    <div
      ref={containerRef}
      className={`mb-4 break-inside-avoid transition-all duration-500 ease-out ${
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
            alt="student work"
            className={`rounded-xl w-full h-auto transition-all duration-300 hover:scale-105 ${
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

function VideoCard({ src, index }: { src: string; index: number }) {
  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        if (videoRef.current) {
          videoRef.current.src = src;
        }
        obs.disconnect();
      }
    }, { rootMargin: '200px', threshold: 0.1 });
    if (container.current) obs.observe(container.current);
    return () => obs.disconnect();
  }, [src]);

  const animationDelay = Math.min(index * 50, 800);

  return (
    <div
      ref={container}
      className={`mb-4 break-inside-avoid relative transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        transitionDelay: `${animationDelay}ms`,
        willChange: 'transform, opacity'
      }}
    >
      {!error ? (
        <div className="relative">
          <video
            ref={videoRef}
            preload="metadata"
            muted
            loop
            playsInline
            onLoadedData={() => setReady(true)}
            onError={() => setError(true)}
            className={`w-full h-auto object-cover rounded-xl transition-all duration-300 ${
              ready ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ contentVisibility: 'auto' }}
          />
          {!ready && visible && (
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

export default function StudentsGalleryPage() {
  const { data = [] } = useQuery<Media[]>({
    queryKey: ['media', 'students-gallery'],
    queryFn: async () => {
      const res = await fetch('/api/media/students-gallery');
      return res.json();
    },
  });

  return (
    <main className="pt-32 pb-20 bg-deep-black text-white">
      <section className="text-center mb-20 px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">Student <span className="premium-accent">Works</span></h1>
        <p className="text-gray-300 max-w-2xl mx-auto">Explore transformations crafted by our talented students.</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="columns-1 xs:columns-2 sm:columns-2 md:columns-3 xl:columns-4 gap-4">
          {data.map((m, index) => (
            m.type === 'image' ? <ImageCard key={m.src} src={m.src} index={index} /> : <VideoCard key={m.src} src={m.src} index={index} />
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