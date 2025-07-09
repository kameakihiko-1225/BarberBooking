import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useKeenSlider } from "keen-slider/react";
import { instructors as instructorData } from "@/data/instructors";
import { useQuery } from "@tanstack/react-query";

function LazyImg({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="relative overflow-hidden h-64">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 hover:brightness-110"
        loading="lazy"
      />
    </div>
  );
}

export default function Instructors() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1.1, spacing: 16 },
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 2.2, spacing: 32 } },
      "(min-width: 1280px)": { slides: { perView: 3.2, spacing: 40 } },
    },
    renderMode: "performance",
  });

  const { data: media = [] } = useQuery<{src:string,type:string}[]>({
    queryKey: ['media','instructors'],
    queryFn: async () => {
      const res = await fetch('/api/media/instructors');
      return res.json();
    },
  });

  const images = media.filter((m) => m.type === 'image').map((m) => m.src);

  const instructors = instructorData.map((inst, idx) => ({...inst, image: images[idx % images.length] || inst.image}));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -20% 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="instructors" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-[var(--premium-accent)]/3 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="section-divider"></div>
        
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
            Learn from{" "}
            <span className="premium-accent">Master</span>{" "}
            Instructors
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Our team of expert instructors brings decades of industry experience and a passion for teaching the next generation of professional barbers.
          </p>
        </div>
        
        <div className="relative">
          <div ref={sliderRef} className="keen-slider pb-8">
            {instructors.map((instructor, index) => (
              <div key={instructor.id} className="keen-slider__slide">
                <Link href={`/barber/${instructor.id}`} className={`bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:border hover:border-[hsl(25,80%,60%)]/30 flex flex-col h-full active:scale-95 touch-manipulation ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`} style={{ 
                  transitionDelay: `${index * 150}ms`,
                  // Enhanced touch animations for mobile
                  touchAction: 'manipulation'
                }}>
                  <LazyImg src={instructor.image} alt={instructor.name} />
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--premium-accent)] to-[var(--golden-bronze)] opacity-0 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md text-center p-6 pt-10 translate-y-full group-hover:translate-y-0 transition-all duration-500">
                    <h3 className="font-serif text-xl font-bold mb-1 text-white">{instructor.name}</h3>
                    <p className="premium-accent font-medium mb-2">{instructor.title}</p>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {instructor.experience}
                    </p>
                    <div className="flex justify-center space-x-4">
                      {instructor.socials.map((social, index) => (
                        <a 
                          key={index}
                          href={social.href} 
                          className="text-gray-400 hover:text-[var(--premium-accent)] transition-transform duration-200 hover:scale-125"
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

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
      </div>
    </section>
  );
}
