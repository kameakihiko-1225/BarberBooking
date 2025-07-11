import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pl' | 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('pl'); // Default to Polish

  useEffect(() => {
    // Load language from localStorage or default to Polish
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['pl', 'en', 'tr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['pl'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation object
const translations: Record<Language, Record<string, string>> = {
  pl: {
    // Navigation
    'nav.home': 'Strona Główna',
    'nav.courses': 'Kursy',
    'nav.gallery': 'Galeria',
    'nav.instructors': 'Instruktorzy',
    'nav.students': 'Studenci',
    'nav.success': 'Sukcesy',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    'nav.enroll': 'Zapisz się',

    // Hero Section
    'hero.title': 'Akademia Fryzjerska K&K',
    'hero.subtitle': 'Rozwijaj swoje umiejętności fryzjerskie z najlepszymi instruktorami w Warszawie',
    'hero.description': 'Dołącz do naszej profesjonalnej akademii i przekształć swoją pasję w dochodową karierę. Kompleksowe szkolenia, praktyczne doświadczenie i wsparcie w karierze.',
    'hero.cta.primary': 'Zapisz się na Kurs',
    'hero.cta.secondary': 'Obejrzyj Galerię',

    // Features
    'features.expert.title': 'Ekspert Instruktorzy',
    'features.expert.description': 'Ucz się od najlepszych mistrzów fryzjerstwa w Warszawie',
    'features.hands.title': 'Praktyczne Szkolenie',
    'features.hands.description': 'Zdobądź prawdziwe doświadczenie z naszym praktycznym podejściem',
    'features.career.title': 'Wsparcie Kariery',
    'features.career.description': 'Pomoc w znalezieniu pracy i rozwoju kariery po ukończeniu',
    'features.modern.title': 'Nowoczesne Techniki',
    'features.modern.description': 'Najnowsze trendy i techniki w branży fryzjerskiej',

    // Courses
    'courses.title': 'Nasze Kursy',
    'courses.subtitle': 'Wybierz idealny kurs dla swojego poziomu i celów kariery',
    'courses.beginner': 'Kurs Podstawowy',
    'courses.advanced': 'Kurs Zaawansowany',
    'courses.master': 'Kurs Mistrzowski',
    'courses.specialty': 'Kursy Specjalistyczne',
    'courses.view.all': 'Zobacz Wszystkie Kursy',
    'courses.enroll': 'Zapisz się',
    'courses.learn.more': 'Dowiedz się więcej',

    // Testimonials
    'testimonials.title': 'Historie Sukcesu',
    'testimonials.subtitle': 'Studentów',
    'testimonials.description': 'Poznaj naszych absolwentów, którzy przekształcili swoją pasję w dochodowe kariery i udane biznesy.',

    // Contact
    'contact.title': 'Skontaktuj się z Nami',
    'contact.subtitle': 'Masz pytania? Jesteśmy tutaj, aby pomóc',
    'contact.name': 'Imię i nazwisko',
    'contact.email': 'Email',
    'contact.phone': 'Telefon',
    'contact.message': 'Wiadomość',
    'contact.program': 'Wybierz program',
    'contact.submit': 'Wyślij Wiadomość',
    'contact.info.title': 'Informacje Kontaktowe',
    'contact.info.address': 'Adres',
    'contact.info.phone': 'Telefon',
    'contact.info.email': 'Email',
    'contact.info.hours': 'Godziny otwarcia',

    // Footer
    'footer.description': 'Profesjonalna akademia fryzjerska w Warszawie oferująca kompleksowe kursy i szkolenia.',
    'footer.quick.links': 'Szybkie Linki',
    'footer.contact.info': 'Informacje Kontaktowe',
    'footer.follow': 'Śledź nas',
    'footer.rights': 'Wszystkie prawa zastrzeżone.',

    // Common
    'common.loading': 'Ładowanie...',
    'common.error': 'Wystąpił błąd',
    'common.success': 'Sukces!',
    'common.close': 'Zamknij',
    'common.save': 'Zapisz',
    'common.cancel': 'Anuluj',
    'common.edit': 'Edytuj',
    'common.delete': 'Usuń',
    'common.view': 'Zobacz',
    'common.back': 'Wróć',
    'common.next': 'Dalej',
    'common.previous': 'Poprzedni',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.gallery': 'Gallery',
    'nav.instructors': 'Instructors',
    'nav.students': 'Students',
    'nav.success': 'Success Stories',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.enroll': 'Enroll Now',

    // Hero Section
    'hero.title': 'K&K Barber Academy',
    'hero.subtitle': 'Master the Art of Barbering with Warsaw\'s Leading Instructors',
    'hero.description': 'Join our professional academy and transform your passion into a profitable career. Comprehensive training, hands-on experience, and career support.',
    'hero.cta.primary': 'Enroll in Course',
    'hero.cta.secondary': 'View Gallery',

    // Features
    'features.expert.title': 'Expert Instructors',
    'features.expert.description': 'Learn from the best master barbers in Warsaw',
    'features.hands.title': 'Hands-on Training',
    'features.hands.description': 'Gain real experience with our practical approach',
    'features.career.title': 'Career Support',
    'features.career.description': 'Job placement assistance and career development after graduation',
    'features.modern.title': 'Modern Techniques',
    'features.modern.description': 'Latest trends and techniques in the barbering industry',

    // Courses
    'courses.title': 'Our Courses',
    'courses.subtitle': 'Choose the perfect course for your skill level and career goals',
    'courses.beginner': 'Beginner Course',
    'courses.advanced': 'Advanced Course',
    'courses.master': 'Master Course',
    'courses.specialty': 'Specialty Courses',
    'courses.view.all': 'View All Courses',
    'courses.enroll': 'Enroll',
    'courses.learn.more': 'Learn More',

    // Testimonials
    'testimonials.title': 'Student Success',
    'testimonials.subtitle': 'Stories',
    'testimonials.description': 'Hear from our graduates who\'ve transformed their passion into profitable careers and successful businesses.',

    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Have questions? We\'re here to help',
    'contact.name': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.program': 'Select Program',
    'contact.submit': 'Send Message',
    'contact.info.title': 'Contact Information',
    'contact.info.address': 'Address',
    'contact.info.phone': 'Phone',
    'contact.info.email': 'Email',
    'contact.info.hours': 'Business Hours',

    // Footer
    'footer.description': 'Professional barber academy in Warsaw offering comprehensive courses and training.',
    'footer.quick.links': 'Quick Links',
    'footer.contact.info': 'Contact Information',
    'footer.follow': 'Follow Us',
    'footer.rights': 'All rights reserved.',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
  },

  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.courses': 'Kurslar',
    'nav.gallery': 'Galeri',
    'nav.instructors': 'Eğitmenler',
    'nav.students': 'Öğrenciler',
    'nav.success': 'Başarı Hikayeleri',
    'nav.blog': 'Blog',
    'nav.contact': 'İletişim',
    'nav.enroll': 'Kayıt Ol',

    // Hero Section
    'hero.title': 'K&K Berber Akademisi',
    'hero.subtitle': 'Varşova\'nın Önde Gelen Eğitmenleriyle Berberlik Sanatında Ustalaşın',
    'hero.description': 'Profesyonel akademimize katılın ve tutkunuzu kârlı bir kariyere dönüştürün. Kapsamlı eğitim, uygulamalı deneyim ve kariyer desteği.',
    'hero.cta.primary': 'Kursa Kayıt Ol',
    'hero.cta.secondary': 'Galeriyi Görüntüle',

    // Features
    'features.expert.title': 'Uzman Eğitmenler',
    'features.expert.description': 'Varşova\'nın en iyi usta berberlerinden öğrenin',
    'features.hands.title': 'Uygulamalı Eğitim',
    'features.hands.description': 'Pratik yaklaşımımızla gerçek deneyim kazanın',
    'features.career.title': 'Kariyer Desteği',
    'features.career.description': 'Mezuniyetten sonra iş bulma yardımı ve kariyer geliştirme',
    'features.modern.title': 'Modern Teknikler',
    'features.modern.description': 'Berberlik endüstrisindeki en son trendler ve teknikler',

    // Courses
    'courses.title': 'Kurslarımız',
    'courses.subtitle': 'Beceri seviyeniz ve kariyer hedefleriniz için mükemmel kursu seçin',
    'courses.beginner': 'Başlangıç Kursu',
    'courses.advanced': 'İleri Düzey Kurs',
    'courses.master': 'Usta Kursu',
    'courses.specialty': 'Özel Kurslar',
    'courses.view.all': 'Tüm Kursları Görüntüle',
    'courses.enroll': 'Kayıt Ol',
    'courses.learn.more': 'Daha Fazla Bilgi',

    // Testimonials
    'testimonials.title': 'Öğrenci Başarı',
    'testimonials.subtitle': 'Hikayeleri',
    'testimonials.description': 'Tutkularını kârlı kariyerlere ve başarılı işletmelere dönüştüren mezunlarımızdan dinleyin.',

    // Contact
    'contact.title': 'Bize Ulaşın',
    'contact.subtitle': 'Sorularınız mı var? Size yardımcı olmak için buradayız',
    'contact.name': 'Ad Soyad',
    'contact.email': 'E-posta',
    'contact.phone': 'Telefon',
    'contact.message': 'Mesaj',
    'contact.program': 'Program Seçin',
    'contact.submit': 'Mesaj Gönder',
    'contact.info.title': 'İletişim Bilgileri',
    'contact.info.address': 'Adres',
    'contact.info.phone': 'Telefon',
    'contact.info.email': 'E-posta',
    'contact.info.hours': 'Çalışma Saatleri',

    // Footer
    'footer.description': 'Varşova\'da kapsamlı kurslar ve eğitim sunan profesyonel berber akademisi.',
    'footer.quick.links': 'Hızlı Bağlantılar',
    'footer.contact.info': 'İletişim Bilgileri',
    'footer.follow': 'Bizi Takip Edin',
    'footer.rights': 'Tüm hakları saklıdır.',

    // Common
    'common.loading': 'Yükleniyor...',
    'common.error': 'Bir hata oluştu',
    'common.success': 'Başarılı!',
    'common.close': 'Kapat',
    'common.save': 'Kaydet',
    'common.cancel': 'İptal',
    'common.edit': 'Düzenle',
    'common.delete': 'Sil',
    'common.view': 'Görüntüle',
    'common.back': 'Geri',
    'common.next': 'İleri',
    'common.previous': 'Önceki',
  },
};