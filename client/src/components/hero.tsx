import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import logoWhite from "@assets/K&K_Vertical_logotype_white_1750662689464.png";
import { useEffect, useState } from "react";
import { useParallax } from "@/hooks/use-parallax";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animateNumbers, setAnimateNumbers] = useState(false);

  const headingWords = ["Master", "the", "Art", "of", "Professional", "Barbering"];

  const bgRef = useParallax(0.3);

  useEffect(() => {
    setIsLoaded(true);
    // Trigger number animation after hero content loads
    const timer = setTimeout(() => {
      setAnimateNumbers(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 md:pt-0">
      {/* Background Image */}
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`,
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className={`mb-12 transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* Removed central background logo image to clean hero */}
        </div>
        <h1 className={`font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transform transition-all duration-1000 delay-300 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {headingWords.map((word, idx) => (
            <span
              key={idx}
              className={`reveal-word ${idx === 4 ? 'premium-accent' : ''}`}
              style={{ animationDelay: `${idx * 0.1 + 0.3}s` }}
            >
              {word + (idx < headingWords.length - 1 ? ' ' : '')}
            </span>
          ))}
        </h1>
        
        <p className={`text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed transform transition-all duration-1000 delay-500 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          Transform your passion into a profitable career with our comprehensive barber training programs. 
          Learn from industry experts and join the next generation of elite barbers.
        </p>
        
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transform transition-all duration-1000 delay-700 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <Button className="btn-shimmer bg-[var(--premium-accent)] text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-[var(--premium-accent)]/80 transition-all transform hover:scale-105 hover:shadow-lg min-w-[200px]">
            Start Your Journey
          </Button>
          <Button 
            variant="outline" 
            className="btn-shimmer border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all min-w-[200px] bg-black/50 backdrop-blur-sm shadow-xl hover:scale-105 hover:shadow-lg"
          >
            <Play className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:scale-125" />
            Watch Our Story
          </Button>
        </div>
        
        {/* Stats */}
        <div className={`hero-stats grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16 pt-12 border-t-2 border-[var(--premium-accent)]/30 transform transition-all duration-1000 delay-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className={`stat-card group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
            animateNumbers ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`} style={{ transitionDelay: '100ms' }}>
            <div className="stat-card-inner h-24 flex flex-col justify-center items-center">
              <div className="text-2xl md:text-4xl font-bold premium-accent font-serif mb-1">
                500+
              </div>
              <div className="text-gray-200 text-xs md:text-sm font-medium tracking-wider text-center leading-tight">Graduates</div>
              <div className="stat-card-glow"></div>
            </div>
          </div>
          <div className={`stat-card group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
            animateNumbers ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`} style={{ transitionDelay: '200ms' }}>
            <div className="stat-card-inner h-24 flex flex-col justify-center items-center">
              <div className="text-2xl md:text-4xl font-bold premium-accent font-serif mb-1">
                15+
              </div>
              <div className="text-gray-200 text-xs md:text-sm font-medium tracking-wider text-center leading-tight">Years Experience</div>
              <div className="stat-card-glow"></div>
            </div>
          </div>
          <div className={`stat-card group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
            animateNumbers ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`} style={{ transitionDelay: '300ms' }}>
            <div className="stat-card-inner h-24 flex flex-col justify-center items-center">
              <div className="text-2xl md:text-4xl font-bold premium-accent font-serif mb-1">
                95%
              </div>
              <div className="text-gray-200 text-xs md:text-sm font-medium tracking-wider text-center leading-tight">Job Placement</div>
              <div className="stat-card-glow"></div>
            </div>
          </div>
          <div className={`stat-card group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
            animateNumbers ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`} style={{ transitionDelay: '400ms' }}>
            <div className="stat-card-inner h-24 flex flex-col justify-center items-center">
              <div className="text-2xl md:text-4xl font-bold premium-accent font-serif mb-1">
                10+
              </div>
              <div className="text-gray-200 text-xs md:text-sm font-medium tracking-wider text-center leading-tight">Master Instructors</div>
              <div className="stat-card-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
