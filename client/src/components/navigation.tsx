import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { useEffect, useState } from "react";
import logoWhite from "@assets/K&K_Full_logotype_white_1750662193930.png";

export default function Navigation() {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [closeMenu]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 px-4 py-3 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
          : 'bg-deep-black/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={logoWhite} 
              alt="K&K Academy Logo" 
              className={`h-10 md:h-12 lg:h-14 transition-all duration-500 ease-in-out ${
                isScrolled ? 'brightness-0 contrast-200' : 'brightness-100 logo-glow'
              }`}
            />
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden hover:bg-white/10 transition-colors ${
              isScrolled ? 'text-black' : 'text-white'
            }`}
            onClick={toggleMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('courses')}
              className={`hover:text-[var(--golden-bronze)] transition-colors ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`hover:text-[var(--golden-bronze)] transition-colors ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('instructors')}
              className={`hover:text-[var(--golden-bronze)] transition-colors ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              Instructors
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`hover:text-[var(--golden-bronze)] transition-colors ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              Contact
            </button>
          </div>
          
          <Button className="hidden md:block bg-[var(--golden-bronze)] text-black hover:bg-[var(--golden-bronze)]/80 px-6 py-2 rounded-full font-medium transition-all">
            Enroll Now
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-deep-black/95 backdrop-blur-sm z-50 transition-transform duration-300 md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl">
          <button
            onClick={() => scrollToSection('courses')}
            className="text-white hover:text-[var(--golden-bronze)] transition-colors"
          >
            Courses
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-white hover:text-[var(--golden-bronze)] transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('instructors')}
            className="text-white hover:text-[var(--golden-bronze)] transition-colors"
          >
            Instructors
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-white hover:text-[var(--golden-bronze)] transition-colors"
          >
            Contact
          </button>
          <Button className="bg-[var(--golden-bronze)] text-black px-8 py-3 rounded-full font-medium mt-8 hover:bg-[var(--golden-bronze)]/80 transition-all">
            Enroll Now
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 right-6 text-white hover:bg-white/10"
          onClick={closeMenu}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
}
