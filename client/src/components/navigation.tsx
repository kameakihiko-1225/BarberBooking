import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { useEffect, useState } from "react";
import logoWhite from "@assets/K&K_Vertical_logotype_white_1750662689464.png";
import { useLocation, Link } from "wouter";
import LanguageSwitcher, { type Locale } from "@/components/language-switcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navigation() {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("courses");
  const [location] = useLocation();
  const { t, language, changeLanguage } = useLanguage();
  const isHome = location === "/";
  const isAbout = location === "/about-us";

  // Handle language change for the new switcher
  const handleLanguageChange = (nextLocale: Locale) => {
    changeLanguage(nextLocale as any);
  };

  const getInitialSection = () => {
    if (location === "/") return "courses"; // default on home
    if (location.startsWith("/about-us")) return "about";
    if (location.startsWith("/barber")) return "instructors";
    // gallery or other pages: none highlighted
    return "";
  };

  useEffect(() => {
    setActiveSection(getInitialSection());
    // Reset scroll position highlight when navigating pages
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    };

    const handleScroll = () => {
      if (!isHome) return; // only run scrollspy on home page
      setIsScrolled(window.scrollY > 50);
      // Scrollspy logic
      const sectionIds = ["about", "courses", "instructors", "blog", "contact"];
      let found = false;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 80) {
            setActiveSection(sectionIds[i]);
            found = true;
            break;
          }
        }
      }
      if (!found) setActiveSection(sectionIds[0]);
    };

    window.addEventListener('resize', handleResize);
    if (isHome) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      if (isHome) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [closeMenu]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const targetPosition = element.offsetTop - 80; // Account for navbar height
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1200; // Custom duration in ms
      let start: number | null = null;

      // Custom easing function (ease-in-out-cubic)
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animateScroll = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const progressPercentage = Math.min(progress / duration, 1);
        const easedProgress = easeInOutCubic(progressPercentage);

        window.scrollTo(0, startPosition + distance * easedProgress);

        if (progress < duration) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
      closeMenu();
    } else {
      // If the section isn't on the current page, navigate to the homepage and let the browser scroll
      window.location.href = `/#${sectionId}`;
    }
  };

  // Build nav items depending on route
  const homeSectionItems = [
    { id: "about", label: t('nav.about') },
    { id: "courses", label: t('nav.courses') },
    { id: "instructors", label: t('nav.instructors') },
    { id: "contact", label: t('nav.contact') },
  ];

  const pageItems = [
    { href: "/", label: t('nav.home') },
    { href: "/about-us", label: t('nav.about') },
    { href: "/courses", label: t('nav.courses') },
    { href: "/gallery", label: t('nav.gallery') },
    { href: "/contact", label: t('nav.contact') },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 px-4 ${isHome ? 'py-2 md:py-3' : 'py-1 md:py-2'} transition-all duration-300 ${
          isHome
            ? (isScrolled ? 'bg-deep-black backdrop-blur-sm shadow-lg' : 'bg-deep-black/80 backdrop-blur-sm')
            : 'bg-deep-black backdrop-blur-sm'
        }`}
        style={{}}
      >
        <div className="w-full px-6 lg:px-12 flex items-center relative justify-between">
          {/* Logo */}
          <div className="mx-auto md:mx-0">
            <img 
              src={logoWhite} 
              alt="K&K Academy Logo" 
              className={`${isHome ? 'h-24 md:h-28 lg:h-32' : 'h-20 md:h-24 lg:h-28'} transition-all duration-500 ease-in-out hover:scale-110 hover:drop-shadow-lg brightness-100 ${
                isHome && !isScrolled ? 'logo-glow' : ''
              }`}
            />
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/15 hover:bg-[var(--premium-accent)]/20 transition-all p-0 w-10 h-10 hover:scale-110 hover:shadow-lg ${
              'text-white'
            }`}
            onClick={toggleMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center space-x-12">
            {isHome
              ? homeSectionItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative text-lg lg:text-xl px-2 py-1 flex items-center justify-center transition-all duration-150 ease-out hover:-translate-y-0.5 hover:text-[var(--premium-accent)] hover:shadow-[0_2px_4px_var(--premium-accent)/30] font-medium ${
                      isScrolled ? 'text-white' : 'text-white'
                    }`}
                    style={{ zIndex: 1 }}
                  >
                    <span
                      className={`relative z-10 transition-all duration-300 ${
                        activeSection === item.id ? 'scale-110 font-bold text-[var(--premium-accent)] drop-shadow-lg' : 'scale-100 opacity-80'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))
              : pageItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-lg lg:text-xl px-2 py-1 flex items-center justify-center transition-all duration-150 ease-out hover:-translate-y-0.5 hover:text-[var(--premium-accent)] hover:shadow-[0_2px_4px_var(--premium-accent)/30] font-medium text-white ${
                      location === item.href ? 'font-bold text-[var(--premium-accent)]' : ''
                    }`}
                    style={{ zIndex: 1 }}
                  >
                    {item.label}
                  </Link>
                ))}
          </div>
          
          {/* Language Switcher and Enroll Button */}
          <div className="hidden md:flex items-center space-x-6 ml-auto">
            <div className="opacity-70 hover:opacity-100 transition-opacity">
              <LanguageSwitcher 
                currentLocale={language as Locale}
                onChange={handleLanguageChange}
              />
            </div>
            <Button asChild className={`px-10 py-3 h-auto leading-none rounded-full font-semibold text-lg transition-all hover:scale-110 hover:shadow-lg ${
              isHome && !isScrolled
                ? 'bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80'
                : 'bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/70'
            }`}>
              <Link href="/contact">{t('nav.enroll')}</Link>
            </Button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-50 transition-all duration-500 md:hidden ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl">
          {isHome
            ? homeSectionItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative text-white transition-all duration-150 ease-out transform hover:-translate-y-0.5 hover:text-[var(--premium-accent)] hover:shadow-[0_2px_4px_var(--premium-accent)/30] ${
                    isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 100 + 200}ms` : '0ms',
                    transitionProperty: 'color, transform, opacity',
                  }}
                >
                  <span
                    className={`relative transition-all duration-300 ${
                      activeSection === item.id ? 'text-[var(--premium-accent)] font-bold scale-110 drop-shadow-lg' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))
            : pageItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`relative text-white transition-all duration-150 ease-out transform hover:-translate-y-0.5 hover:text-[var(--premium-accent)] hover:shadow-[0_2px_4px_var(--premium-accent)/30] ${
                    isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 100 + 200}ms` : '0ms',
                    transitionProperty: 'color, transform, opacity',
                  }}
                >
                  {item.label}
                </Link>
              ))}
          
          {/* Language Switcher in Mobile Menu */}
          <div className={`mt-8 transform ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ 
            transitionDelay: isOpen ? '500ms' : '0ms',
            transitionProperty: 'transform, opacity'
          }}>
            <LanguageSwitcher 
              currentLocale={language as Locale}
              onChange={handleLanguageChange}
              isMobile={true} 
            />
          </div>

          {isHome && (
          <Button asChild className={`bg-[var(--premium-accent)] text-black px-8 py-3 rounded-full font-medium mt-6 hover:bg-[var(--premium-accent)]/80 transition-all hover:scale-105 hover:shadow-lg transform ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ 
            transitionDelay: isOpen ? '600ms' : '0ms',
            transitionProperty: 'transform, opacity, background-color, box-shadow'
          }}>
            <Link href="/contact">{t('nav.enroll')}</Link>
          </Button>) }
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-6 right-6 text-white hover:bg-white/10 transition-all hover:scale-110 hover:shadow-lg transform ${
            isOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
          }`}
          style={{ 
            transitionDelay: isOpen ? '100ms' : '0ms',
            transitionProperty: 'transform, opacity, background-color'
          }}
          onClick={closeMenu}
        >
          <X className="h-6 w-6 transition-transform duration-200 group-hover:scale-125" />
        </Button>
      </div>
    </>
  );
}