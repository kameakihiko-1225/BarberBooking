import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const languages = {
  pl: { name: 'Polski', flag: '🇵🇱' },
  en: { name: 'English', flag: '🇺🇸' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
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
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline text-sm font-medium">
          {languages[language].name}
        </span>
        <span className="text-sm">{languages[language].flag}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-20 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[140px] overflow-hidden">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code as Language)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  language === code ? 'bg-[var(--premium-accent)]/10 text-[var(--premium-accent)]' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {language === code && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-[var(--premium-accent)]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}