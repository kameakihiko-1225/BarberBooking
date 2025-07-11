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
    'hero.title': 'K&K Akademia Fryzjerska',
    'hero.subtitle': 'Rozwijaj swoje umiejętności fryzjerskie z najlepszymi instruktorami w Warszawie',
    'hero.description': 'Dołącz do naszej profesjonalnej akademii i przekształć swoją pasję w dochodową karierę. Kompleksowe szkolenia, praktyczne doświadczenie i wsparcie w karierze.',
    'hero.cta.primary': 'Zapisz się na Kurs',
    'hero.cta.secondary': 'Obejrzyj Galerię',
    'hero.stats.graduates': 'Absolwentów',
    'hero.stats.experience': 'Lat Doświadczenia',
    'hero.stats.placement': 'Zatrudnienie',
    'hero.stats.instructors': 'Mistrzów Instruktorów',

    // Features
    'features.expert.title': 'Ekspert Instruktorzy',
    'features.expert.description': 'Ucz się od najlepszych mistrzów fryzjerstwa w Warszawie',
    'features.hands.title': 'Praktyczne Szkolenie',
    'features.hands.description': 'Zdobądź prawdziwe doświadczenie z naszym praktycznym podejściem',
    'features.career.title': 'Wsparcie Kariery',
    'features.career.description': 'Pomoc w znalezieniu pracy i rozwoju kariery po ukończeniu',
    'features.modern.title': 'Nowoczesne Techniki',
    'features.modern.description': 'Najnowsze trendy i techniki w branży fryzjerskiej',

    // About Section
    'about.title': 'O Nas',
    'about.subtitle': 'Dlaczego Wybierać K&K Academy',
    'about.description': 'Z wieloletnim doświadczeniem i pasją do edukacji, jesteśmy wiodącą akademią fryzjerską w Warszawie.',

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
    'courses.duration': 'Czas trwania',
    'courses.level': 'Poziom',
    'courses.price': 'Cena',
    'courses.upcoming': 'Najbliższe terminy',
    'courses.cta.title': 'Gotowy na rozpoczęcie swojej drogi fryzjera?',
    'courses.cta.description': 'Dołącz do setek odnoszących sukcesy absolwentów, którzy przekształcili swoje życie dzięki naszym kompleksowym programom szkoleniowym.',
    'courses.cta.button': 'Dołącz do jednodniowego bezpłatnego kursu',

    // Instructors
    'instructors.title': 'Nasi Instruktorzy',
    'instructors.subtitle': 'Mistrzowie Fryzjerstwa',
    'instructors.description': 'Poznaj naszych doświadczonych instruktorów, którzy poprowadzą Cię przez całą podróż edukacyjną.',

    // Testimonials
    'testimonials.title': 'Opinie Absolwentów',
    'testimonials.subtitle': 'Historie Sukcesu',
    'testimonials.description': 'Posłuchaj od naszych absolwentów, którzy przekształcili swoje pasje w dochodowe kariery i odnoszące sukcesy firmy.',

    // Gallery
    'gallery.title': 'Nasza Galeria',
    'gallery.subtitle': 'Zobacz nasze prace',
    'gallery.description': 'Odkryj niesamowitą pracę naszych studentów i instruktorów.',

    // Contact
    'contact.title': 'Skontaktuj się z nami',
    'contact.subtitle': 'Masz pytania? Jesteśmy tutaj, aby pomóc',
    'contact.name': 'Imię i nazwisko',
    'contact.email': 'Email',
    'contact.phone': 'Telefon',
    'contact.message': 'Wiadomość',
    'contact.program': 'Wybierz program',
    'contact.submit': 'Wyślij wiadomość',
    'contact.info.title': 'Informacje kontaktowe',
    'contact.info.address': 'Adres',
    'contact.info.phone': 'Telefon',
    'contact.info.email': 'Email',
    'contact.info.hours': 'Godziny otwarcia',

    // Footer
    'footer.description': 'Profesjonalna akademia fryzjerska w Warszawie oferująca kompleksowe kursy i szkolenia.',
    'footer.quick.links': 'Szybkie linki',
    'footer.contact.info': 'Informacje kontaktowe',
    'footer.follow': 'Śledź nas',
    'footer.rights': 'Wszystkie prawa zastrzeżone.',

    // Blog
    'blog.title': 'Nasz Blog',
    'blog.subtitle': 'Najnowsze wiadomości i wskazówki',
    'blog.read.more': 'Czytaj więcej',
    'blog.view.all': 'Zobacz wszystkie posty',

    // CTA
    'cta.title': 'Rozpocznij swoją karierę już dziś',
    'cta.description': 'Dołącz do tysięcy odnoszących sukcesy absolwentów, którzy przekształcili swoją pasję w dochodową karierę.',
    'cta.button': 'Zapisz się teraz',

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
    'common.back': 'Wstecz',
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
    'hero.stats.graduates': 'Graduates',
    'hero.stats.experience': 'Years Experience',
    'hero.stats.placement': 'Job Placement',
    'hero.stats.instructors': 'Master Instructors',

    // Features
    'features.expert.title': 'Expert Instructors',
    'features.expert.description': 'Learn from the best master barbers in Warsaw',
    'features.hands.title': 'Hands-on Training',
    'features.hands.description': 'Gain real experience with our practical approach',
    'features.career.title': 'Career Support',
    'features.career.description': 'Job placement assistance and career development after graduation',
    'features.modern.title': 'Modern Techniques',
    'features.modern.description': 'Latest trends and techniques in the barbering industry',

    // About Section
    'about.title': 'About Us',
    'about.subtitle': 'Why Choose K&K Academy',
    'about.description': 'With years of experience and a passion for education, we are Warsaw\'s leading barber academy.',

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
    'courses.duration': 'Duration',
    'courses.level': 'Level',
    'courses.price': 'Price',
    'courses.upcoming': 'Upcoming Dates',
    'courses.cta.title': 'Ready to Start Your Barber Journey?',
    'courses.cta.description': 'Join hundreds of successful graduates who\'ve transformed their lives through our comprehensive training programs.',
    'courses.cta.button': 'Join One Day Free Course',

    // Instructors
    'instructors.title': 'Our Instructors',
    'instructors.subtitle': 'Master Barbers',
    'instructors.description': 'Meet our experienced instructors who will guide you through your entire educational journey.',

    // Testimonials
    'testimonials.title': 'Graduate Reviews',
    'testimonials.subtitle': 'Success Stories',
    'testimonials.description': 'Hear from our graduates who transformed their passion into profitable careers and successful businesses.',

    // Gallery
    'gallery.title': 'Our Gallery',
    'gallery.subtitle': 'See our work',
    'gallery.description': 'Discover the amazing work of our students and instructors.',

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
    'contact.info.hours': 'Opening Hours',

    // Footer
    'footer.description': 'Professional barber academy in Warsaw offering comprehensive courses and training.',
    'footer.quick.links': 'Quick Links',
    'footer.contact.info': 'Contact Information',
    'footer.follow': 'Follow Us',
    'footer.rights': 'All rights reserved.',

    // Blog
    'blog.title': 'Our Blog',
    'blog.subtitle': 'Latest news and tips',
    'blog.read.more': 'Read More',
    'blog.view.all': 'View All Posts',

    // CTA
    'cta.title': 'Start Your Career Today',
    'cta.description': 'Join thousands of successful graduates who have transformed their passion into a profitable career.',
    'cta.button': 'Enroll Now',

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
    'hero.stats.graduates': 'Mezun',
    'hero.stats.experience': 'Yıl Deneyim',
    'hero.stats.placement': 'İş Yerleştirme',
    'hero.stats.instructors': 'Usta Eğitmen',

    // Features
    'features.expert.title': 'Uzman Eğitmenler',
    'features.expert.description': 'Varşova\'nın en iyi usta berberlerinden öğrenin',
    'features.hands.title': 'Uygulamalı Eğitim',
    'features.hands.description': 'Pratik yaklaşımımızla gerçek deneyim kazanın',
    'features.career.title': 'Kariyer Desteği',
    'features.career.description': 'Mezuniyetten sonra iş bulma yardımı ve kariyer geliştirme',
    'features.modern.title': 'Modern Teknikler',
    'features.modern.description': 'Berberlik endüstrisindeki en son trendler ve teknikler',

    // About Section
    'about.title': 'Hakkımızda',
    'about.subtitle': 'Neden K&K Academy\'yi Seçmelisiniz',
    'about.description': 'Yıllarca deneyim ve eğitime olan tutkumuzla, Varşova\'nın önde gelen berber akademisiyiz.',

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
    'courses.duration': 'Süre',
    'courses.level': 'Seviye',
    'courses.price': 'Fiyat',
    'courses.upcoming': 'Yaklaşan Tarihler',
    'courses.cta.title': 'Berber Kariyerinize Bugün Başlamaya Hazır mısınız?',
    'courses.cta.description': 'Kapsamlı eğitim programlarımızla hayatlarını dönüştüren yüzlerce başarılı mezuna katılın.',
    'courses.cta.button': 'Bir Günlük Ücretsiz Kursa Katılın',

    // Instructors
    'instructors.title': 'Eğitmenlerimiz',
    'instructors.subtitle': 'Usta Berberler',
    'instructors.description': 'Tüm eğitim yolculuğunuzda size rehberlik edecek deneyimli eğitmenlerimizle tanışın.',

    // Testimonials
    'testimonials.title': 'Mezun Yorumları',
    'testimonials.subtitle': 'Başarı Hikayeleri',
    'testimonials.description': 'Tutkularını kârlı kariyerlere ve başarılı işletmelere dönüştüren mezunlarımızdan dinleyin.',

    // Gallery
    'gallery.title': 'Galerimiz',
    'gallery.subtitle': 'Çalışmalarımızı görün',
    'gallery.description': 'Öğrencilerimizin ve eğitmenlerimizin muhteşem çalışmalarını keşfedin.',

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

    // Blog
    'blog.title': 'Blogumuz',
    'blog.subtitle': 'En son haberler ve ipuçları',
    'blog.read.more': 'Devamını Oku',
    'blog.view.all': 'Tüm Gönderileri Görüntüle',

    // CTA
    'cta.title': 'Kariyerinize Bugün Başlayın',
    'cta.description': 'Tutkularını kârlı bir kariyere dönüştüren binlerce başarılı mezuna katılın.',
    'cta.button': 'Şimdi Kayıt Olun',

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