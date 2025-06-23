import { Button } from "@/components/ui/button";
import { Clock, IdCard, Trophy, Briefcase } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const courses = [
  {
    id: 1,
    title: "Professional Barber Fundamentals",
    description: "Master the essential techniques of professional barbering including classic cuts, fades, beard trimming, and client consultation skills.",
    price: "$2,500",
    badge: "Foundation Course",
    badgeColor: "bg-[var(--premium-accent)]/10 text-[var(--premium-accent)]",
    duration: "12 weeks • 480 hours",
    certification: "State certification included",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    buttonStyle: "bg-deep-black text-white hover:bg-gray-800",
    icon: <IdCard className="premium-accent mr-2 h-4 w-4" />
  },
  {
    id: 2,
    title: "Master Barber Techniques",
    description: "Advance your skills with complex fading techniques, creative styling, straight razor mastery, and business development fundamentals.",
    price: "$3,200",
    badge: "Advanced Course",
    badgeColor: "bg-[var(--premium-accent)] text-black",
    duration: "16 weeks • 640 hours",
    certification: "Master certification",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    buttonStyle: "bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80",
    icon: <Trophy className="premium-accent mr-2 h-4 w-4" />
  },
  {
    id: 3,
    title: "Barbershop Business Mastery",
    description: "Learn the business side of barbering including shop management, marketing strategies, client retention, and financial planning for success.",
    price: "$1,800",
    badge: "Business Course",
    badgeColor: "bg-green-100 text-green-800",
    duration: "8 weeks • 120 hours",
    certification: "Business certification",
    image: "https://images.unsplash.com/photo-1542125387-c71274d94f0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    buttonStyle: "bg-deep-black text-white hover:bg-gray-800",
    icon: <Briefcase className="golden-bronze mr-2 h-4 w-4" />
  }
];

export default function Courses() {
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
    <section ref={sectionRef} id="courses" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--premium-accent)]/5 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="section-divider"></div>
        
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
            Professional Training{" "}
            <span className="premium-accent">Programs</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Choose from our comprehensive range of barber training courses designed to take you from beginner to professional in record time.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={course.id} className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:border-[var(--premium-accent)]/30 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`} style={{ transitionDelay: `${index * 200}ms` }}>
              <img 
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.badgeColor}`}>
                    {course.badge}
                  </span>
                  <span className="text-2xl font-bold text-deep-black">{course.price}</span>
                </div>
                
                <h3 className="font-serif text-xl font-bold mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {course.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="golden-bronze mr-2 h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    {course.icon}
                    <span>{course.certification}</span>
                  </div>
                </div>
                
                <Button className={`w-full py-3 rounded-full font-medium transition-all ${course.buttonStyle}`}>
                  Enroll Now
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-deep-black rounded-2xl p-8 md:p-12 text-white">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your <span className="golden-bronze">Barber Journey?</span>
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of successful graduates who've transformed their lives through our comprehensive training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[var(--golden-bronze)] text-black px-8 py-3 rounded-full font-medium hover:bg-[var(--golden-bronze)]/80 transition-all">
                Schedule a Tour
              </Button>
              <Button variant="outline" className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-all">
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
