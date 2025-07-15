import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState } from "react";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Najlepsze miejsce w Warszawie, aby szybko i przede wszystkim dobrze nauczyć się zawodu od podstaw. Właśnie skończyłem kurs, chłopaki pomogli z finansowaniem dla kursu i znaleźli mi pracę zaraz po ukończeniu. Bardzo polecam i dziękuję!",
    name: "Angelika Ziółkowska",
    title: "Absolwent • 5-gwiazdkowa opinia Google",
  },
  {
    id: 2,
    quote: "Miałem przyjemność uczestniczyć w 3-dniowym szkoleniu pod opieką Tomka i Alego. Jestem zachwycony efektami szkolenia. Świetna atmosfera i wspaniali edukatorzy. Chłopaki dali nam ogromną dawkę wiedzy i wskazówek dotyczących tworzenia portfolio. Bardzo polecam!",
    name: "Agata Antoniewicz",
    title: "Absolwent • 5-gwiazdkowa opinia Google",
  },
  {
    id: 3,
    quote: "Pomimo czasu, który minął od końca kursu, postanowiłem zostawić opinię. Uczestniczyłem w miesięcznym kursie 'Barber od podstaw' w K&K Academy i jestem pod wrażeniem poziomu profesjonalizmu i jakości szkolenia. Edukatorzy Tomek, Bartek i Ali wykazali się nie tylko wiedzą teoretyczną, ale też imponującymi umiejętnościami praktycznymi. Teraz, 6 miesięcy po ukończeniu kursu, z powodzeniem prowadzę własny salon i cieszę się, że miałem okazję uczestniczyć w kursie od podstaw z chłopakami.",
    name: "Sharp Cut Barber",
    title: "Właściciel Salonu • 5-gwiazdkowa opinia Google",
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

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const fullText = testimonial.quote;
  const shouldTruncate = fullText.length > 150;
  const displayText = shouldTruncate && !isExpanded 
    ? fullText.substring(0, 150) + "..." 
    : fullText;

  return (
    <div className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-2xl transition-all duration-700 group h-full flex flex-col justify-between">
      <div className="absolute top-6 left-6 premium-accent text-4xl">
        <Quote className="h-8 w-8" />
      </div>
      <div className="flex-1">
        <p className="text-gray-700 text-lg leading-relaxed mb-4 mt-6 group-hover:translate-y-[-4px] transition-transform duration-300">
          " {displayText} "
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[var(--premium-accent)] font-medium text-sm hover:underline transition-colors mb-4"
          >
            {isExpanded ? t('common.show.less') : t('common.show.more')}
          </button>
        )}
      </div>
      <div className="pt-4 border-t border-gray-200">
        <div className="font-semibold text-deep-black">{testimonial.name}</div>
        <div className="text-sm text-gray-600">{testimonial.title}</div>
      </div>
    </div>
  );
}

export default function TestimonialsCarousel() {
  const { t } = useLanguage();
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
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="keen-slider__slide">
            <TestimonialCard testimonial={testimonial} />
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