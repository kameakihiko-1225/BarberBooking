import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "The best place in Warsaw to quickly and above all well learn a profession from scratch. I have just finished the course, the guys helped with funding for the course and found me a job immediately after finishing. I highly recommend and thank you!",
    name: "Angelika Ziółkowska",
    title: "Graduate • 5-star Google Review",
  },
  {
    id: 2,
    quote:
      "I had the pleasure of taking part in a 3-day training course under the supervision of Tomek and Ali. I am delighted with the effects of the training. Great atmosphere and great educators. The boys gave us a huge dose of knowledge and tips on creating a portfolio. I highly recommend it!",
    name: "Agata Antoniewicz",
    title: "Graduate • 5-star Google Review",
  },
  {
    id: 3,
    quote:
      "Despite the time that has passed since the end of the course, I decided to leave a review. I participated in the month-long 'Barber from scratch' course at K&K Academy, and I am very impressed with the level of professionalism and quality of the training. Educators Tomek, Bartek and Ali demonstrated not only theoretical knowledge, but also impressive practical skills. Now, 6 months after completing the course, I successfully run my own salon and I am glad that I had the opportunity to participate in the course from scratch with the guys.",
    name: "Sharp Cut Barber",
    title: "Salon Owner • 5-star Google Review",
  },
  {
    id: 4,
    quote:
      "Today I would like to share my opinion about the barbering and beard cutting course that I recently completed. I must say that it was an amazing adventure full of new skills and knowledge. The course provided me with a solid foundation in beard cutting, styling and care of beard and hair. Throughout the course, the instructors were extremely professional and passionate in passing on their knowledge. I am now confident that I will be able to offer my clients the best quality of service when it comes to haircuts.",
    name: "Martyna Wódarczyk",
    title: "Graduate • 5-star Google Review",
  },
  {
    id: 5,
    quote:
      "I am very happy that I had the opportunity to meet the guys and work with them, both during the course and every day at work. There is always a great atmosphere in the salon, which is due to the energy emanating from the entire team. I worked particularly well with the main teacher, Bartek, who is great at conveying knowledge. I highly recommend barber training from scratch and further training.",
    name: "Mikołaj Grzejda",
    title: "Graduate • 5-star Google Review",
  },
  {
    id: 6,
    quote:
      "I am very satisfied with the training at K&K Academy, 3 days full of knowledge. Tomek and Ali put their whole hearts into giving us as much knowledge as possible, in addition, a great atmosphere, thank you very much again.",
    name: "Aleksandra Springer",
    title: "Graduate • 5-star Google Review",
  },
  {
    id: 7,
    quote:
      "I recommend it, it's a great place, I've completed the course with the guys and I'm very satisfied. They taught me everything from scratch and made sure I left with as much knowledge as possible! I recommend it to everyone!",
    name: "Miłosz Rybakiewicz",
    title: "Graduate • 5-star Google Review",
  },
  {
    id: 8,
    quote:
      "Perfect training. Great professionalism.",
    name: "Marcin Budzyński",
    title: "Graduate • 5-star Google Review",
  },
  {
    id: 9,
    quote:
      "Very interesting and professional training. You can see that the presenters love what they do.",
    name: "Justyna Bielska",
    title: "Graduate • 5-star Google Review",
  },
  {
    id: 10,
    quote:
      "Great course and nice professional teachers.",
    name: "Jakub Kacperski",
    title: "Graduate • 5-star Google Review",
  },
  {
    id: 11,
    quote:
      "Great course, as always you leave satisfied. I recommend!",
    name: "Bartosz Olechnowicz",
    title: "Graduate • 5-star Google Review",
  },
  {
    id: 12,
    quote:
      "Today I was a model at a barbering training and I honestly really liked it. The hairstyle was perfect, the beard was nicely trimmed. Nice atmosphere, I recommend it and I will definitely come back.",
    name: "Adrian Mikołajczyk",
    title: "Training Model • 5-star Google Review",
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
              <div className="pt-4 border-t border-gray-200">
                <div className="font-semibold text-deep-black">{t.name}</div>
                <div className="text-sm text-gray-600">{t.title}</div>
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