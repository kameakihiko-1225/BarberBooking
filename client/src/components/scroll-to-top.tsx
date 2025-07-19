import React from 'react';
import { ChevronUp } from 'lucide-react';
import { useScrollPosition, useScrollToTop } from '@/hooks/use-scroll';
import { useIsMobile } from '@/hooks/use-mobile';

export default function ScrollToTop() {
  const { scrollPosition } = useScrollPosition();
  const scrollToTop = useScrollToTop();
  const isMobile = useIsMobile();
  
  const isVisible = scrollPosition > 400;

  const handleClick = () => {
    scrollToTop();
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      } ${
        isMobile ? 'w-12 h-12' : 'w-14 h-14'
      } bg-[var(--premium-accent)] hover:bg-[var(--premium-accent)]/80 text-black rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20`}
      aria-label="Scroll to top"
    >
      <ChevronUp 
        size={isMobile ? 20 : 24} 
        className="mx-auto" 
      />
    </button>
  );
}