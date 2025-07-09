import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useKeenSlider } from "keen-slider/react";
import { instructors as instructorData } from "@/data/instructors";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

function InstructorCard({ instructor, index, isVisible }: { 
  instructor: any; 
  index: number; 
  isVisible: boolean; 
}) {
  return (
    <div className={`group relative bg-black rounded-lg overflow-hidden border-l-4 border-[#FF6A00] transition-all duration-700 hover:shadow-xl transform hover:scale-105 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
    }`} style={{ 
      transitionDelay: `${index * 150}ms`
    }}>
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={instructor.image}
          alt={instructor.name}
          className="w-full h-full object-cover transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Social Media Icons Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20">
          <div className="flex space-x-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {instructor.socials?.facebook && (
              <a
                href={instructor.socials.facebook}
                className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-6 h-6 text-blue-600" />
              </a>
            )}
            {instructor.socials?.instagram && (
              <a
                href={instructor.socials.instagram}
                className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-6 h-6 text-pink-600" />
              </a>
            )}
            {instructor.socials?.whatsapp && (
              <a
                href={instructor.socials.whatsapp}
                className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-6 h-6 text-green-600" />
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Orange Background on Hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-black transition-all duration-500 group-hover:bg-[#FF6A00] p-6">
        <h3 className="text-xl font-bold text-white mb-2">{instructor.name}</h3>
        <p className="text-gray-300 group-hover:text-white transition-colors">{instructor.title}</p>
      </div>
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
