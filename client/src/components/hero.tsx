import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import logoWhite from "@assets/K&K_Vertical_logotype_white_1750662689464.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-12">
          <img 
            src={logoWhite} 
            alt="K&K Academy Logo" 
            className="h-20 md:h-28 lg:h-32 mx-auto mb-8 logo-glow animate-pulse hover:animate-none transition-all duration-700 hover:scale-110 hover:logo-glow-blue"
          />
        </div>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Master the Art of{" "}
          <span className="premium-accent">Professional</span>{" "}
          Barbering
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform your passion into a profitable career with our comprehensive barber training programs. 
          Learn from industry experts and join the next generation of elite barbers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="bg-[var(--premium-accent)] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[var(--premium-accent)]/80 transition-all transform hover:scale-105 min-w-[200px]">
            Start Your Journey
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all min-w-[200px] bg-black/50 backdrop-blur-sm shadow-xl"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Our Story
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-gray-600">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold premium-accent font-serif">500+</div>
            <div className="text-gray-300 text-sm md:text-base">Graduates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold premium-accent font-serif">15+</div>
            <div className="text-gray-300 text-sm md:text-base">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold premium-accent font-serif">95%</div>
            <div className="text-gray-300 text-sm md:text-base">Job Placement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold premium-accent font-serif">10+</div>
            <div className="text-gray-300 text-sm md:text-base">Master Instructors</div>
          </div>
        </div>
      </div>
    </section>
  );
}
