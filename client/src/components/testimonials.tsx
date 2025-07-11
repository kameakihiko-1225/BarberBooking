import { Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const testimonials = [
  {
    id: 1,
    quote: "The best place in Warsaw to quickly and above all well learn a profession from scratch. I have just finished the course, the guys helped with funding for the course and found me a job immediately after finishing. I highly recommend and thank you!",
    name: "Angelika Ziółkowska",
    title: "Graduate • 5-star Google Review"
  },
  {
    id: 2,
    quote: "Despite the time that has passed since the end of the course, I decided to leave a review. I participated in the month-long 'Barber from scratch' course at K&K Academy, and I am very impressed with the level of professionalism and quality of the training. Now, 6 months after completing the course, I successfully run my own salon.",
    name: "Sharp Cut Barber",
    title: "Salon Owner • 5-star Google Review"
  },
  {
    id: 3,
    quote: "I am very happy that I had the opportunity to meet the guys and work with them. There is always a great atmosphere in the salon. I worked particularly well with the main teacher, Bartek, who is great at conveying knowledge. I highly recommend barber training from scratch.",
    name: "Mikołaj Grzejda",
    title: "Graduate • 5-star Google Review"
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
        
        {/* Gallery Navigation Buttons */}
        <div className="bg-deep-black rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button asChild className="bg-[var(--premium-accent)] text-black px-12 py-6 text-xl rounded-full font-bold hover:bg-[var(--premium-accent)]/80 transition-all transform hover:scale-105 hover:shadow-lg">
              <Link href="/students-gallery">See All Student Works</Link>
            </Button>
            <Button asChild className="bg-white text-black px-12 py-6 text-xl rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 hover:shadow-lg">
              <Link href="/success-stories">All Success Stories</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
