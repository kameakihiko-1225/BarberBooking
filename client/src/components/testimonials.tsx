import { Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const testimonials = [
  {
    id: 1,
    quote: "Elite Barber Academy changed my life completely. The hands-on training and business coaching helped me open my own shop within 6 months of graduating. The instructors truly care about your success.",
    name: "Alex Johnson",
    title: "Class of 2023 • Shop Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: 2,
    quote: "The program exceeded all my expectations. Not only did I learn cutting-edge techniques, but the career placement program helped me land a position at a top-tier barbershop immediately after graduation.",
    name: "Maria Santos",
    title: "Class of 2023 • Master Barber",
    image: "https://images.unsplash.com/photo-1494790108755-2616c056ca58?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  }
];

const showcaseWorks = [
  {
    id: 1,
    title: "Student Work",
    subtitle: "Week 8 Progress",
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: 2,
    title: "Advanced Technique",
    subtitle: "Final Project",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: 3,
    title: "Beard Mastery",
    subtitle: "Specialty Course",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: 4,
    title: "Creative Styling",
    subtitle: "Master Class",
    image: "https://images.unsplash.com/photo-1542125387-c71274d94f0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  }
];

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--premium-accent)]/5 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="section-divider"></div>
        
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
            Student{" "}
            <span className="premium-accent">Success</span>{" "}
            Stories
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Hear from our graduates who've transformed their passion into profitable careers and successful businesses.
          </p>
        </div>
        
        <div className={`mb-12 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <TestimonialsCarousel />
        </div>
        
        {/* Before/After Showcase */}
        <div className="bg-deep-black rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              See the <span className="golden-bronze">Transformation</span>
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our students create amazing transformations. Here are some real before and after examples from our training sessions.
            </p>
          </div>
          
          {/* Mobile horizontal scroll, desktop grid */}
          <div className="md:hidden relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4">
              {showcaseWorks.map((work) => (
                <div key={work.id} className="flex-shrink-0 w-64 bg-white/10 rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg snap-start">
                  <img 
                    src={work.image}
                    alt={`${work.title} - ${work.subtitle}`}
                    className="w-full h-32 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-110 hover:brightness-110"
                  />
                  <div className="text-center">
                    <div className="text-sm golden-bronze font-medium">{work.title}</div>
                    <div className="text-xs text-gray-300">{work.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseWorks.map((work) => (
              <div key={work.id} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <img 
                  src={work.image}
                  alt={`${work.title} - ${work.subtitle}`}
                  className="w-full h-32 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-110 hover:brightness-110"
                />
                <div className="text-center">
                  <div className="text-sm golden-bronze font-medium">{work.title}</div>
                  <div className="text-xs text-gray-300">{work.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild className="bg-[var(--premium-accent)] text-black px-8 py-3 rounded-full font-semibold hover:bg-[var(--premium-accent)]/80 transition-colors">
              <Link href="/students-gallery">See All Student Works</Link>
            </Button>
            <Button asChild className="ml-4 bg-deep-black text-white px-8 py-3 rounded-full font-semibold hover:bg-deep-black/80 transition-colors border border-white/20">
              <Link href="/success-stories">All Success Stories</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
