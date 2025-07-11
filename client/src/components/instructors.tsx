import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useKeenSlider } from "keen-slider/react";
import { instructors as instructorData } from "@/data/instructors";
import { useLanguage } from "@/contexts/LanguageContext";

function InstructorCard({ instructor, index, isVisible }: { 
  instructor: any; 
  index: number; 
  isVisible: boolean; 
}) {
  const { t } = useLanguage();
  return (
    <Link to={`/instructor/${instructor.id}`}>
      <div className={`group relative bg-black rounded-lg overflow-hidden border-l-4 border-[#FF6A00] transition-all duration-700 hover:shadow-xl transform hover:scale-105 cursor-pointer ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`} style={{ 
        transitionDelay: `${index * 150}ms`
      }}>
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={instructor.image}
          alt={instructor.name}
          className="w-full h-full object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
          loading="lazy"
          style={{ objectPosition: 'center 20%' }}
        />
        
        {/* Social Media Icons Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20 pointer-events-none">
          <div className="flex space-x-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {instructor.socials?.instagram && (
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(instructor.socials.instagram, '_blank');
                }}
              >
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            )}
            {instructor.socials?.whatsapp && (
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(instructor.socials.whatsapp, '_blank');
                }}
              >
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Orange Background on Hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-black transition-all duration-500 group-hover:bg-[#FF6A00] p-6">
        <h3 className="text-xl font-bold text-white mb-2">{instructor.name}</h3>
        <p className="text-gray-300 group-hover:text-white transition-colors">{t(instructor.title)}</p>
      </div>
    </div>
    </Link>
  );
}

export default function Instructors() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1.1, spacing: 16 },
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 2.2, spacing: 32 } },
      "(min-width: 1280px)": { slides: { perView: 3.2, spacing: 40 } },
    },
    renderMode: "performance",
  });

  // Use the instructor data directly with their proper images
  const instructors = instructorData;

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
            {t('instructors.title')} -{" "}
            <span className="premium-accent">{t('instructors.subtitle')}</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            {t('instructors.description')}
          </p>
        </div>
        
        <div className="relative">
          <div ref={sliderRef} className="keen-slider pb-8">
            {instructors.map((instructor, index) => (
              <div key={instructor.id} className="keen-slider__slide">
                <InstructorCard 
                  instructor={instructor} 
                  index={index} 
                  isVisible={isVisible} 
                />
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