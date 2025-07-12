import { Button } from "@/components/ui/button";
import { Check, Award } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

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
      className={`py-20 bg-gray-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className={`section-divider transform transition-all duration-1000 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}></div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
          }`}>
            <h2 className={`font-serif text-3xl md:text-5xl font-bold mb-6 transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {t('about.title')} -{" "}
              <span className="premium-accent">{t('about.subtitle')}</span>
            </h2>
            
            <p className={`text-gray-600 text-lg mb-6 leading-relaxed transform transition-all duration-1000 delay-400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {t('about.description')}
            </p>
            
            <div className={`space-y-4 mb-8 transform transition-all duration-1000 delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {[
                t('about.features.certified'),
                t('about.features.handson'),
                t('about.features.placement')
              ].map((text, index) => (
                <div key={index} className={`flex items-center space-x-3 transform transition-all duration-700 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`} style={{ transitionDelay: `${600 + index * 100}ms` }}>
                  <div className="w-6 h-6 bg-[var(--golden-bronze)] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                    <Check className="text-black text-sm h-4 w-4" />
                  </div>
                  <span className="text-gray-700 hover:text-gray-900 transition-colors duration-200">{text}</span>
                </div>
              ))}
            </div>
            
            <Link href="/about-us" className={`inline-block transform transition-all duration-1000 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Button className="bg-deep-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 hover:scale-105 hover:shadow-lg">
                {t('about.learn.more')}
              </Button>
            </Link>
          </div>
          
          <div className={`relative transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
          }`}>
            {/* Certificate Section */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-500">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-deep-black mb-2">{t('about.certificate.title')}</h3>
                <p className="text-gray-600 text-sm">{t('about.certificate.subtitle')}</p>
              </div>
              
              <img 
                src="/attached_assets/Cert_243_2025_KKBarber_page-0001_1752305443741.jpg" 
                alt="K&K Barber Academy Quality Management System Certificate ISO 9001:2015-10" 
                className="rounded-xl shadow-lg w-full h-auto hover:scale-105 transition-all duration-500"
              />
              
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Award className="text-[var(--premium-accent)] h-5 w-5" />
                  <span className="font-semibold text-deep-black">ISO 9001:2015-10</span>
                </div>
                <p className="text-sm text-gray-600 text-center">{t('about.certificate.description')}</p>
              </div>
            </div>
            
            {/* Floating Achievement Card */}
            <div className={`absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 transform transition-all duration-1000 delay-800 hover:scale-105 hover:shadow-2xl ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--premium-accent)] rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                  <Award className="text-black h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black hover:text-[var(--premium-accent)] transition-colors duration-200">{t('about.certified.excellence')}</div>

                  <div className="text-sm text-gray-600">{t('about.state.licensed')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}