import { Button } from "@/components/ui/button";
import { Check, Award } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-20 bg-gray-50 transition-all duration-1000"
    >
      <div className="max-w-6xl mx-auto px-4">

        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
          }`}>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Elevate Your Skills at the{" "}
              <span className="premium-accent">Premier</span>{" "}
              Barber Academy
            </h2>
            
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              For over 15 years, K&K Barber Academy has been the gold standard in professional barber education. 
              Our comprehensive programs combine traditional techniques with modern innovations, ensuring our graduates 
              are ready to excel in today's competitive market.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[var(--golden-bronze)] rounded-full flex items-center justify-center">
                  <Check className="text-black text-sm h-4 w-4" />
                </div>
                <span className="text-gray-700">State-certified programs with industry recognition</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[var(--golden-bronze)] rounded-full flex items-center justify-center">
                  <Check className="text-black text-sm h-4 w-4" />
                </div>
                <span className="text-gray-700">Hands-on training with professional-grade equipment</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[var(--golden-bronze)] rounded-full flex items-center justify-center">
                  <Check className="text-black text-sm h-4 w-4" />
                </div>
                <span className="text-gray-700">Career placement assistance and ongoing support</span>
              </div>
            </div>
            
            <Button className="bg-deep-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800">
              Learn More About Us
            </Button>
          </div>
          
          <div className={`relative transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
          }`}>
            <img 
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Barber academy classroom with students learning" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            
            {/* Floating Achievement Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--premium-accent)] rounded-full flex items-center justify-center">
                  <Award className="text-black h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black">Certified Excellence</div>
                  <div className="text-sm text-gray-600">State Licensed Academy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
