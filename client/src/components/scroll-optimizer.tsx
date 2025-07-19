import { useEffect } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll';

export default function ScrollOptimizer() {
  useScrollReveal(); // Initialize scroll reveal functionality

  useEffect(() => {
    // Optimize scrolling performance
    const optimizeScroll = () => {
      // Add smooth scrolling behavior to all internal links
      const links = document.querySelectorAll('a[href^="#"], a[href^="/"]');
      
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = (e.target as HTMLAnchorElement).getAttribute('href');
          
          if (href?.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
              const offset = 96; // Account for navbar height
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - offset;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }
        });
      });

      // Optimize video elements for better scroll performance
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        video.style.willChange = 'transform';
        video.style.backfaceVisibility = 'hidden';
        video.style.perspective = '1000px';
      });

      // Add momentum scrolling to gallery containers
      const galleryContainers = document.querySelectorAll('.keen-slider, .gallery-container');
      galleryContainers.forEach(container => {
        container.classList.add('scroll-container');
      });
    };

    // Run optimization after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeScroll);
    } else {
      optimizeScroll();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', optimizeScroll);
    };
  }, []);

  return null; // This component doesn't render anything
}