import "keen-slider/keen-slider.min.css";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import heic2any from "heic2any";

const imageModules = import.meta.glob("@assets/gallarey/*.{jpg,JPG,jpeg,JPEG,png,PNG,heic,HEIC}", { eager: true, import: "default" });
const videoModules = import.meta.glob("@assets/gallarey/*.{mov,MOV,mp4,MP4}", { eager: true, import: "default" });

type Media = { src: string; type: "image" | "video" };
const media: Media[] = [
  ...Object.values(imageModules).map((v) => ({ src: v as string, type: "image" as const })),
  ...Object.values(videoModules).map((v) => ({ src: v as string, type: "video" as const })),
].slice(0, 9); // limit for performance

function LazyMedia({ item }: { item: Media }) {
  const [resolved, setResolved] = useState<string | null>(item.type === "image" && item.src.toLowerCase().endsWith(".heic") ? null : item.src);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resolved || item.type !== "image") return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        (async () => {
          const res = await fetch(item.src);
          let blob: Blob | null = await res.blob();
          try {
            const conv = (await heic2any({ blob, toType: "image/jpeg", quality: 0.8 })) as Blob;
            blob = conv;
          } catch (e) {
            console.error("heic convert fail", e);
          }
          setResolved(URL.createObjectURL(blob));
        })();
        obs.disconnect();
      }
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [resolved, item]);

  return (
    <div ref={containerRef} className="relative overflow-hidden group rounded-2xl">
      {item.type === "image" ? (
        resolved ? (
          <img src={resolved} alt="gallery" className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-72 bg-gray-800 animate-pulse" />
        )
      ) : (
        <div className="relative">
          <video
            src={item.src}
            className="w-full h-72 object-cover grayscale group-hover:grayscale-0 transition-all"
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-0" />
          <Play className="absolute inset-0 m-auto h-14 w-14 text-white bg-black/50 rounded-full p-2 transition-opacity group-hover:opacity-0" />
        </div>
      )}
    </div>
  );
}

export default function Gallery() {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1.1, spacing: 16 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2.1, spacing: 24 } },
      "(min-width: 1024px)": { slides: { perView: 3.2, spacing: 32 } },
    },
    renderMode: "performance",
  });

  return (
    <section className="py-24 bg-deep-black text-white" id="gallery">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-12">Be an <span className="premium-accent">Icon</span></h2>

        <div className="relative mb-12">
          <div ref={sliderRef} className="keen-slider">
            {media.map((m, idx) => (
              <div key={idx} className="keen-slider__slide">
                <LazyMedia item={m} />
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

        <Button className="mt-6" asChild>
          <Link href="/gallery">View Full Gallery</Link>
        </Button>
      </div>
    </section>
  );
} 