import { useState } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const languages = {
  pl: { name: 'PL', code: 'PL' },
  en: { name: 'EN', code: 'EN' },
  tr: { name: 'TR', code: 'TR' },
};

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[var(--premium-accent)]/20 to-transparent border border-[var(--premium-accent)]/30 backdrop-blur-sm hover:border-[var(--premium-accent)]/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_var(--premium-accent)]/30"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--premium-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 text-[var(--premium-accent)] font-bold text-sm tracking-wider">
          {languages[language].code}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-3 z-20 bg-black/90 backdrop-blur-md rounded-2xl border border-[var(--premium-accent)]/20 shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden min-w-[100px]">
            <div className="p-1">
              {Object.entries(languages).map(([code, lang]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code as Language)}
                  className={`w-full flex items-center justify-center px-4 py-3 text-center rounded-xl transition-all duration-200 ${
                    language === code 
                      ? 'bg-[var(--premium-accent)]/20 text-[var(--premium-accent)] border border-[var(--premium-accent)]/30' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold text-sm tracking-wider">{lang.code}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}