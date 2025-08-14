import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getCurrentLocale, 
  getCurrentPathWithoutLocale, 
  createLocalizedPath,
  updateQueryParam 
} from '@/lib/i18n-utils';

export type Locale = 'en' | 'pl' | 'uk';

export type LanguageSwitcherProps = {
  currentLocale: Locale;                  // required
  availableLocales?: Locale[];            // default: ['en','pl','uk']
  onChange: (next: Locale) => void;       // required, no full reload
  strategy?: 'path' | 'query' | 'storage';// default: 'storage'
  storageKey?: string;                    // default: 'lng'
  ariaLabel?: string;                     // default: 'Change language'
  size?: 'sm' | 'md' | 'lg';              // UI only
  className?: string;                     // passthrough
  isMobile?: boolean;                     // existing prop for backward compatibility
};

const languages = {
  pl: { name: 'PL', code: 'PL' },
  en: { name: 'EN', code: 'EN' },
  uk: { name: 'UK', code: 'UK' },
};

export default function LanguageSwitcher({
  currentLocale,
  availableLocales = ['en', 'pl', 'uk'],
  onChange,
  strategy = 'storage',
  storageKey = 'lng',
  ariaLabel = 'Change language',
  size = 'md',
  className = '',
  isMobile = false, // backward compatibility
}: LanguageSwitcherProps) {
  const { changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use prop locale or get current locale from utils
  const activeLocale = currentLocale || getCurrentLocale();

  const handleLanguageChange = (nextLocale: Locale) => {
    setIsOpen(false);

    if (strategy === 'path') {
      // Navigate to localized path (full reload)
      const currentPathWithoutLocale = getCurrentPathWithoutLocale();
      const newPath = createLocalizedPath(nextLocale, currentPathWithoutLocale);
      const newUrl = `${newPath}${window.location.search}${window.location.hash}`;
      window.location.href = newUrl;
      return;
    }

    if (strategy === 'query') {
      // Update URL query parameter without reload
      updateQueryParam('lng', nextLocale);
    }

    if (strategy === 'storage') {
      // Store in localStorage (default behavior)
      localStorage.setItem(storageKey, nextLocale);
    }

    // Wire to i18n instance (changeLanguage method)
    changeLanguage(nextLocale as any);
    
    // Call onChange callback (no reload for query/storage strategies)
    onChange(nextLocale);
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

  // Size classes for different button sizes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`group relative flex items-center justify-center ${sizeClasses[size]} rounded-lg bg-white/5 border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/60`}
      >
        <span className="relative z-10 text-white/80 hover:text-white font-medium tracking-wider transition-colors">
          {languages[activeLocale]?.code || activeLocale.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div 
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute z-50 bg-black/95 backdrop-blur-md rounded-lg border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden min-w-[80px] ${
            isMobile 
              ? 'left-1/2 -translate-x-1/2 bottom-full mb-4' // Position above button in mobile
              : 'right-0 top-full mt-2' // Position below button in desktop
          }`}
        >
          <div className="p-1">
            {availableLocales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                role="option"
                aria-selected={activeLocale === locale}
                className={`w-full flex items-center justify-center px-3 py-2 text-center rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                  activeLocale === locale 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className={`font-medium ${sizeClasses[size].includes('text-xs') ? 'text-xs' : sizeClasses[size].includes('text-base') ? 'text-base' : 'text-sm'}`}>
                  {languages[locale]?.code || locale.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}