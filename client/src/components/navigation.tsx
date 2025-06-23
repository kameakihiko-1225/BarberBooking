import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { useEffect } from "react";

export default function Navigation() {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      <nav className="fixed top-0 w-full bg-deep-black/95 backdrop-blur-sm z-50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-white font-serif text-xl font-bold">
            Elite <span className="golden-bronze">Barber</span> Academy
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={toggleMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
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
          </div>
          
          <Button className="hidden md:block bg-[var(--golden-bronze)] text-black hover:bg-yellow-500 px-6 py-2 rounded-full font-medium">
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
          <Button className="bg-[var(--golden-bronze)] text-black px-8 py-3 rounded-full font-medium mt-8 hover:bg-yellow-500">
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
