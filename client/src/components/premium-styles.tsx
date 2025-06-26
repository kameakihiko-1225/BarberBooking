import "keen-slider/keen-slider.min.css";
import { KeenSliderPlugin, useKeenSlider } from "keen-slider/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface StyleItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
}

const styles: StyleItem[] = [
  {
    id: 1,
    title: "Balbo",
    category: "Beard Styles",
    description:
      "Features a trimmed, floating mustache paired with a distinct, shaped beard on the chin.",
    image:
      "https://images.unsplash.com/photo-1505103898319-fb8a4b6b0d25?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 2,
    title: "Van Dyke",
    category: "Beard Styles",
    description:
      "Combines a pointed goatee and a detached mustache for a sophisticated look.",
    image:
      "https://images.unsplash.com/photo-1599566161274-3e53d9903f13?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    title: "Goatee",
    category: "Beard Styles",
    description:
      "A small, pointed beard that covers the chin but not the cheeks, often paired with a mustache.",
    image:
      "https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?auto=format&fit=crop&w=800&q=60",
  },
];

const centered: KeenSliderPlugin = (slider: any) => {
  function updateClasses() {
    slider.slides.forEach((slide: any) => {
      slide.classList.remove("active-card");
    });
    const slide = slider.slides[slider.track.details.rel];
    slide.classList.add("active-card");
  }
  slider.on("created", updateClasses);
  slider.on("animationEnded", updateClasses);
  slider.on("updated", updateClasses);
};

export default function PremiumStyles() {
  const [ref] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free-snap",
    slides: { perView: 1.2, spacing: 16, origin: "center" },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2.2, spacing: 24 } },
      "(min-width: 1024px)": { slides: { perView: 3.2, spacing: 32 } },
    },
  }, [centered]);

  return (
    <section className="py-20 bg-dark-gray text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-12">
          Discover Our <span className="premium-accent">Premium Styles</span>
        </h2>
        <div ref={ref} className="keen-slider">
          {styles.map((style) => (
            <div key={style.id} className="keen-slider__slide">
              <div className="relative rounded-2xl overflow-hidden shadow-xl transition-transform duration-500 group">
                <img
                  src={style.image}
                  alt={style.title}
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70" />
                <div className="absolute bottom-0 p-6 text-left">
                  <span className="px-3 py-1 bg-black/70 rounded-full text-xs uppercase tracking-wide inline-block mb-2">
                    {style.category}
                  </span>
                  <h3 className="text-2xl font-serif font-bold mb-2">{style.title}</h3>
                  <p className="text-sm text-gray-300 max-w-xs mb-4">
                    {style.description}
                  </p>
                  <Button className="bg-[var(--premium-accent)] text-black rounded-full px-6 py-2 text-sm font-medium hover:bg-[var(--premium-accent)]/80">
                    View Style
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 