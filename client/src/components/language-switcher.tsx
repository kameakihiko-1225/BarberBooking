import { useState, useEffect, useRef } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const languages = {
  pl: { name: 'PL', code: 'PL' },
  en: { name: 'EN', code: 'EN' },
  uk: { name: 'UK', code: 'UK' },
};

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

export default function LanguageSwitcher({ isMobile = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/10"
      >
        <span className="relative z-10 text-white/80 hover:text-white font-medium text-sm tracking-wider transition-colors">
          {languages[language].code}
        </span>
      </button>

      {isOpen && (
        <div className={`absolute z-50 bg-black/95 backdrop-blur-md rounded-lg border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden min-w-[80px] ${
          isMobile 
            ? 'left-1/2 -translate-x-1/2 bottom-full mb-4' // Position above button in mobile
            : 'right-0 top-full mt-2' // Position below button in desktop
        }`}>
          <div className="p-1">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code as Language)}
                className={`w-full flex items-center justify-center px-3 py-2 text-center rounded transition-all duration-200 ${
                  language === code 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="font-medium text-sm">{lang.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}