import { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

type Media = { src: string; type: 'image' | 'video' };

function ImageCard({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Fade-in when the card is about to enter the viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mb-4 break-inside-avoid transition duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {!loaded && <div className="w-full aspect-[3/4] bg-gray-800 animate-pulse rounded-xl" />}
      {inView && (
        <img
          src={src}
          alt="student work"
          className={`rounded-xl w-full h-auto transition-transform duration-300 hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

function VideoCard({ src }: { src: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { rootMargin: '400px' });
    if (container.current) obs.observe(container.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={container}
      className={`mb-4 break-inside-avoid relative transition duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {!ready && <div className="w-full aspect-[3/4] bg-gray-800 animate-pulse rounded-xl" />}
      {visible && (
        <video
          src={src}
          preload="metadata"
          muted
          loop
          playsInline
          onLoadedData={() => setReady(true)}
          className={`w-full h-auto object-cover rounded-xl transition-all duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
        />
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
          {data.map((m) => (
            m.type === 'image' ? <ImageCard key={m.src} src={m.src} /> : <VideoCard key={m.src} src={m.src} />
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