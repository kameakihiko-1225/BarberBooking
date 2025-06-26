import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type Media = { id: number; src: string; type: "image" | "video" };

function LazyMedia({ item }: { item: Media }) {
  const [loaded, setLoaded] = useState(false);
  const src = item.src;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        entries[0].target.classList.add('opacity-100', 'translate-y-0');
        obs.disconnect();
      }
    }, { rootMargin: '400px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mb-4 break-inside-avoid group relative overflow-hidden rounded-xl transition duration-700 ease-out opacity-0 translate-y-6"
    >
      {item.type === "image" ? (
        <>
          {!loaded && <div className="w-full aspect-[4/5] bg-gray-800 animate-pulse" />}
          <img
            src={src}
            alt="gallery"
            className={`w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </>
      ) : (
        <VideoThumb src={item.src} />
      )}
    </div>
  );
}

function VideoThumb({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const handleToggle = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (playing) {
      vid.pause();
      setPlaying(false);
    } else {
      vid.play();
      vid.muted = false;
      setPlaying(true);
    }
  };

  return (
    <div className="relative cursor-pointer" onClick={handleToggle}>
      {!ready && <div className="w-full aspect-[4/5] bg-gray-800 animate-pulse" />}
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        muted
        className={`w-full h-auto object-cover transition-all duration-500 ${playing ? '' : 'blur-sm grayscale'} ${ready ? 'opacity-100' : 'opacity-0'}`}
        onLoadedData={() => setReady(true)}
      />
      {!playing && ready && (
        <Play className="absolute inset-0 m-auto h-14 w-14 text-white bg-black/50 rounded-full p-2 transition-opacity" />
      )}
    </div>
  );
}

export default function GalleryPage() {
  const { data: apiList = [] } = useQuery<Media[]>({
    queryKey: ['media','gallery'],
    queryFn: async () => {
      const res = await fetch('/api/media/gallery');
      return res.json();
    },
  });

  const mediaList = apiList.map((m, idx) => ({ ...m, id: idx }));

  return (
    <main className="pt-32 pb-20 bg-deep-black text-white">
      <section className="text-center max-w-3xl mx-auto px-4 mb-16">
        <h1 className="font-serif text-5xl font-bold mb-4">Discover Our <span className="premium-accent">Premium Styles</span></h1>
        <p className="text-gray-300">Step inside our world—A glimpse of student work, classroom moments, and barbershop artistry.</p>
      </section>
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="columns-1 xs:columns-2 sm:columns-2 md:columns-3 xl:columns-4 gap-4">
          {mediaList.map((m) => (
            <LazyMedia key={m.id} item={m} />
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