import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "The best place in Warsaw to quickly and above all well learn a profession from scratch. I have just finished the course, the guys helped with funding for the course and found me a job immediately after finishing. I highly recommend and thank you!",
    name: "Angelika Ziółkowska",
    title: "Graduate • 5-star Google Review",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616c056ca58?auto=format&fit=crop&w=100&h=100",
  },
  {
    id: 2,
    quote:
      "Elite Barber Academy changed my life completely. The hands-on training and business coaching helped me open my own shop within 6 months of graduating.",
    name: "Alex Johnson",
    title: "Class of 2023 • Shop Owner",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
  },
  {
    id: 3,
    quote:
      "The program exceeded all my expectations. I landed a position at a top-tier barbershop immediately after graduation.",
    name: "Maria Santos",
    title: "Class of 2023 • Master Barber",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616c056ca58?auto=format&fit=crop&w=100&h=100",
  },
  {
    id: 4,
    quote:
      "From day one the instructors felt like mentors. Their support continues well past graduation!",
    name: "Daniel Green",
    title: "Class of 2022 • Freelance Barber",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=100&h=100",
  },
  {
    id: 5,
    quote:
      "State-of-the-art facilities and real-world business lessons—you won't find better training.",
    name: "Emily Clarke",
    title: "Class of 2021 • Barbershop Owner",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100",
  },
];

export default function TestimonialsCarousel() {
  const [ref, slider] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: { perView: 1.1, spacing: 24 },
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 2.2, spacing: 32 } },
      "(min-width: 1280px)": { slides: { perView: 3.2, spacing: 40 } },
    },
    renderMode: "performance",
  });

  return (
    <div className="relative">
      <div ref={ref} className="keen-slider pb-8">
        {testimonials.map((t) => (
          <div key={t.id} className="keen-slider__slide">
            <div className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-2xl transition-all duration-700 group h-full flex flex-col justify-between">
              <div className="absolute top-6 left-6 premium-accent text-4xl">
                <Quote className="h-8 w-8" />
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 mt-6 group-hover:translate-y-[-4px] transition-transform duration-300">
                " {t.quote} "
              </p>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <img
                  src={t.image}
                  className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300 ring-2 ring-[var(--premium-accent)]"
                  alt={t.name}
                />
                <div>
                  <div className="font-semibold text-deep-black">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.title}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        className="absolute -left-6 top-1/2 -translate-y-1/2 md:-left-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center group hover:bg-[var(--premium-accent)]/15 hover:border-[var(--premium-accent)]/50 transition-all shadow-lg hover:shadow-[0_0_12px_var(--premium-accent)]"
        onClick={() => slider.current?.prev()}
      >
        <ChevronLeft className="h-5 w-5 text-[var(--premium-accent)]" />
      </button>
      <button
        className="absolute -right-6 top-1/2 -translate-y-1/2 md:-right-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center group hover:bg-[var(--premium-accent)]/15 hover:border-[var(--premium-accent)]/50 transition-all shadow-lg hover:shadow-[0_0_12px_var(--premium-accent)]"
        onClick={() => slider.current?.next()}
      >
        <ChevronRight className="h-5 w-5 text-[var(--premium-accent)]" />
      </button>
    </div>
  );
} 