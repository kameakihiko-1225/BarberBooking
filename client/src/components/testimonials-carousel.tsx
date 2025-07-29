import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState } from "react";

interface Testimonial {
  id: number;
  quoteKey: string;
  nameKey: string;
  titleKey: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    quoteKey: 'testimonial.1.quote',
    nameKey: 'testimonial.1.name',
    titleKey: 'testimonial.1.title',
  },
  {
    id: 2,
    quoteKey: 'testimonial.2.quote',
    nameKey: 'testimonial.2.name',
    titleKey: 'testimonial.2.title',
  },
  {
    id: 3,
    quoteKey: 'testimonial.3.quote',
    nameKey: 'testimonial.3.name',
    titleKey: 'testimonial.3.title',
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get localized content from translation keys
  const fullText = t(testimonial.quoteKey);
  const name = t(testimonial.nameKey);
  const title = t(testimonial.titleKey);
  
  const shouldTruncate = fullText.length > 150;
  const displayText = shouldTruncate && !isExpanded 
    ? fullText.substring(0, 150) + "..." 
    : fullText;

  return (
    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-8 relative hover:shadow-2xl transition-all duration-700 group h-full flex flex-col justify-between">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 premium-accent text-4xl">
        <Quote className="h-6 w-6 sm:h-8 sm:w-8" />
      </div>
      <div className="flex-1">
        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4 mt-4 sm:mt-6 group-hover:translate-y-[-4px] transition-transform duration-300">
          " {displayText} "
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[var(--premium-accent)] font-medium text-xs sm:text-sm hover:underline transition-colors mb-4 text-left flex items-center justify-start w-full"
          >
            <span className="block">{isExpanded ? t('common.show.less') : t('common.show.more')}</span>
          </button>
        )}
      </div>
      <div className="pt-4 border-t border-gray-200">
        <div className="font-semibold text-deep-black">{name}</div>
        <div className="text-sm text-gray-600">{title}</div>
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
        {testimonialsData.map((testimonial) => (
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