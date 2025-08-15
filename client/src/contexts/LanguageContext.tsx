import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentLocale, DEFAULT_LOCALE } from '@/lib/i18n-utils';
import type { Locale } from '@/components/language-switcher';

export type Language = 'pl' | 'en' | 'uk';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  changeLanguage: (lang: Language) => void; // i18next-like API
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
  const [language, setLanguage] = useState<Language>(DEFAULT_LOCALE as Language);

  useEffect(() => {
    // Initialize language with priority order: query → path → storage → default
    const currentLocale = getCurrentLocale();
    setLanguage(currentLocale as Language);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Keep backward compatibility - still save to localStorage with old key
    localStorage.setItem('language', lang);
    // Also save with new standard key for i18n utils
    localStorage.setItem('lng', lang);
  };

  // i18next-like changeLanguage method
  const changeLanguage = (lang: Language) => {
    handleLanguageChange(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['pl'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleLanguageChange, 
      changeLanguage,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation object
const translations: Record<Language, Record<string, string>> = {
  pl: {
    // Navigation
    'nav.home': 'Strona Główna',
    'nav.about': 'O Nas',
    'nav.courses': 'Kursy',
    'nav.gallery': 'Galeria',
    'nav.instructors': 'Instruktorzy',
    'nav.students': 'Studenci',
    'nav.success': 'Sukcesy',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    'nav.enroll': 'Zapisz się',

    // Hero Section
    'hero.title': 'K&K Akademia Barberingu',
    'hero.subtitle': 'Od Zera do Mistrzostwa',
    'hero.description': 'Nie uczymy tylko fryzjerstwa — pomagamy budować prawdziwe kariery. To tu ambicja spotyka się z precyzją, a pasja zamienia się w zawód.',
    'hero.cta.primary': 'Zapisz się na Kurs',
    'hero.cta.secondary': 'Obejrzyj Galerię',
    'hero.stats.graduates': 'Absolwentów',
    'hero.stats.experience': 'Lat Doświadczenia',
    'hero.stats.placement': 'Zatrudnienie',
    'hero.stats.instructors': 'Mistrzów Instruktorów',

    // Features
    'features.expert.title': 'Ekspert Instruktorzy',
    'features.expert.description': 'Ucz się od najlepszych mistrzów barberingu w Warszawie',
    'features.hands.title': 'Praktyczne Szkolenie',
    'features.hands.description': 'Zdobądź prawdziwe doświadczenie z naszym praktycznym podejściem',
    'features.career.title': 'Wsparcie Kariery',
    'features.career.description': 'Pomoc w znalezieniu pracy i rozwoju kariery po ukończeniu',
    'features.modern.title': 'Nowoczesne Techniki',
    'features.modern.description': 'Najnowsze trendy i techniki w branży barberskiej',

    // About Section
    'about.title': 'K&K Akademia Barberingu',
    'about.subtitle': 'Dlaczego My?',
    'about.description': 'Jako jedyna akademia w Polsce możemy pochwalić się dwoma certyfikatami jakości. Nasz zespół tworzą wyłącznie wykwalifikowani edukatorzy, którzy nie tylko zdali egzaminy czeladnicze, ale również posiadają przygotowanie pedagogiczne. Stawiamy na najwyższe standardy nauczania i realne przygotowanie do pracy w zawodzie barbera.',
    'features.practical.title': '80% zajęć to praktyka — pracujesz na manekinach i z prawdziwymi klientami',
    'features.groups.title': 'Kameralne grupy — gwarantujemy indywidualne podejście i realny mentoring',
    'features.tools.title': 'Wszystkie narzędzia i produkty w cenie — bez żadnych ukrytych kosztów',
    'features.certificates.title': 'Otrzymujesz certyfikaty uznawane na rynku pracy',
    'features.funding.title': 'Pomagamy w uzyskaniu nawet 100% dofinansowania na kurs',
    


    // Courses
    'courses.title': 'Nasze Kursy',
    'courses.subtitle': 'Wybierz idealny kurs dla swojego poziomu i celów kariery',
    'courses.beginner': 'Kurs Barberski dla Początkujących – Od Zera do Barbera',
    'courses.beginner.description': 'Intensywny 24-dniowy program (pon–sob, 12:00–20:00), który przeprowadza absolutnych początkujących do profesjonalnych barberów poprzez teorię, praktykę na manekinach i codzienną pracę na żywych modelach.',
    'courses.barber.title': 'Kurs Barberski dla Początkujących – Od Zera do Barbera',
    'courses.advanced': 'Kurs Zaawansowany', 
    'courses.master': 'Kurs Mistrzowski',
    'courses.specialty': 'Kursy Specjalistyczne',
    'courses.view.all': 'Zobacz Wszystkie Kursy',
    'courses.enroll': 'Zapisz się',
    'courses.enroll.now': 'Zapisz się teraz',
    'courses.learn.more': 'Dowiedz się więcej',
    'courses.duration': 'Czas trwania',
    'courses.level': 'Poziom',
    'courses.price': 'Cena',
    'courses.upcoming': 'Najbliższe terminy',
    'courses.cta.title': 'Gotowy na rozpoczęcie swojej drogi barbera?',
    'courses.cta.description': 'Dołącz do setek odnoszących sukcesy absolwentów, którzy przekształcili swoje życie dzięki naszym kompleksowym programom szkoleniowym.',
    'courses.cta.button': 'Rozpocznij karierę barbera',

    'courses.cuts': 'Klasyczne i nowoczesne cięcia barberskie',

    // Instructors
    'instructors.title': 'Poznaj naszych',
    'instructors.title.highlight': 'Instruktorów',
    'instructors.subtitle': 'Eksperci branżowi',
    'instructors.description': 'Nasi doświadczeni barberzy to praktycy z wieloletnim doświadczeniem w najlepszych salonach w Warszawie. Uczysz się od najlepszych.',
    'instructors.role': 'Starszy Instruktor Barberski',
    'senior.barber.instructor': 'Starszy Instruktor Barberski',
    'instructors.certificate': 'Po ukończeniu kursu otrzymasz certyfikat wydany przez K&K Academy, uznaną instytucję szkoleniową dla barberów.',



    // Gallery
    'gallery.title': 'Nasza',
    'gallery.title.highlight': 'Galeria',
    'gallery.subtitle': 'Zobacz nasze prace',
    'gallery.description': 'Odkryj niesamowitą pracę naszych studentów i instruktorów.',
    'gallery.view.full': 'Zobacz pełną galerię',
    'gallery.load.all': 'Pokaż wszystkie',
    'gallery.more.works': 'więcej prac',
    'gallery.masonry': 'Siatka',
    'gallery.grid': 'Kratka',
    'gallery.grid.view': 'Widok kratki',
    'gallery.size.compact': 'Kompaktowy',
    'gallery.size.standard': 'Standardowy',
    'gallery.size.spacious': 'Przestronny',

    // Testimonials
    'testimonials.title': 'Historie Sukcesu Studentów',
    'testimonials.description': 'Posłuchaj naszych absolwentów, którzy przekształcili swoją pasję w dochodowe kariery i odnoszące sukcesy biznesy.',
    'testimonials.see.student.work': 'Zobacz wszystkie prace uczniów',
    'testimonials.see.success.stories': 'Wszystkie historie sukcesu',

    // Contact
    'contact.title': 'Skontaktuj się z',
    'contact.title.highlight': 'nami',
    'contact.title.today': 'już dziś',
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
    'contact.hours.weekdays': 'Pon-Pt: 12:00 - 21:00',
    'contact.hours.saturday': 'Sob: 12:00 - 17:00',
    'contact.hours.sunday': 'Niedz: Zamknięte',
    'contact.visit.campus': 'Odwiedź Nasz Kampus',
    'contact.call.us': 'Zadzwoń do Nas',
    'contact.email.us': 'Napisz do Nas',
    'contact.hours': 'Godziny Pracy',
    'contact.form.title': 'Uzyskaj więcej informacji',
    'contact.form.first.name': 'Imię',
    'contact.form.last.name': 'Nazwisko',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Telefon',
    'contact.form.program': 'Zainteresowanie programem',
    'contact.form.message': 'Wiadomość',
    'contact.form.submit': 'Wyślij zapytanie',
    'contact.form.required': 'Proszę wypełnić wymagane pola',
    'contact.form.required.desc': 'Imię, nazwisko i email są wymagane.',
    'contact.form.thank.you': 'Dziękujemy za zainteresowanie!',
    'contact.form.thank.you.desc': 'Skontaktujemy się z Tobą wkrótce z więcej informacjami.',
    'contact.form.program.placeholder': 'Wybierz interesujący Cię program...',
    'contact.form.message.placeholder': 'Opowiedz nam o swoich celach i oczekiwaniach...',
    'contact.page.title': 'Skontaktuj się z',
    'contact.page.highlight': 'Akademią K&K',
    'contact.page.subtitle': 'Masz pytania dotyczące naszych programów, cen lub zapisów? Skontaktuj się z nami, a nasz zespół ds. przyjęć chętnie pomoże.',
    'contact.form.error': 'Błąd wysyłania wiadomości',
    'contact.form.error.desc': 'Spróbuj ponownie później.',
    'contact.form.success': 'Wiadomość wysłana!',
    'contact.form.success.desc': 'Skontaktujemy się z Tobą wkrótce.',

    // Footer
    'footer.description': 'Profesjonalna akademia barberska w Warszawie oferująca kompleksowe kursy i szkolenia.',
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
    
    // Students Gallery Page
    'page.students.title': 'Prace',
    'page.students.title.highlight': 'Uczniów',
    'page.students.explore': 'Odkryj niesamowite prace naszych uczniów i zobacz, czego możesz się nauczyć',
    'page.showcased.works': 'prezentowanych prac',
    
    // Success Gallery Page
    'page.success.title': 'Historie',
    'page.success.title.highlight': 'Sukcesu',
    'page.success.explore': 'Zobacz prawdziwe historie sukcesu naszych absolwentów',
    
    // Navigation
    'page.back.home': 'Powrót do strony głównej',
    'page.apply.now': 'Zapisz się teraz',
    
    // CTA Enroll Section
    'cta.enroll.title': 'Gotowy na rozpoczęcie swojej drogi barbera?',
    'cta.enroll.description': 'Dołącz do setek odnoszących sukcesy absolwentów, którzy przekształcili swoje życie dzięki naszym kompleksowym programom szkoleniowym.',
    'cta.enroll.button': 'Rozpocznij karierę barbera',

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

    // Additional translations for missing components
    'our.vibe': 'Nasza Atmosfera!',

    // SEO (demonstrate i18n fallback system)
    'seo.title': 'K&K Barber Academy - Kurs Barberingu Warszawa | Akademia Barberingu Polska',
    'seo.description': 'Najlepsza akademia barberingu w Polsce z 2 certyfikatami jakości. Kursy barberingu Warszawa - nauka barberingu od podstaw.',
    'seo.keywords': 'kurs barberingu Warszawa, kursy barberingu Polska, akademia barberingu Polska, nauka barberingu od podstaw',

    // Structured Data
    'structured.data.description': 'Jedyna akademia barberska w Polsce z dwoma certyfikatami jakości - ISO 9001:2015-10 i SZOE. Profesjonalne szkolenia barberskie.',
    'structured.data.altname.1': 'Akademia Barberska K&K',
    'structured.data.altname.2': 'Barbershop Academy Warszawa',
    'programs.fundamentals': 'Podstawy Barberstwa',
    'programs.master': 'Techniki Mistrzowskie', 
    'programs.business': 'Mistrzostwo Biznesowe',
    'programs.private': 'Lekcje Prywatne',
    'quicklinks.about': 'O Nas',
    'quicklinks.admissions': 'Przyjęcia',
    'quicklinks.financial': 'Pomoc Finansowa',
    'quicklinks.portal': 'Portal Studenta',
    'copyright': '© 2024 K&K Barber Academy. Wszystkie prawa zastrzeżone.',
    'policies.privacy': 'Polityka Prywatności',
    'policies.terms': 'Warunki Świadczenia Usług',
    'policies.handbook': 'Podręcznik Studenta',
    'working.hours': 'Godziny pracy:',
    'blog.latest': 'Najnowsze Spostrzeżenia',
    'blog.tips': 'Wskazówki, trendy i zasoby, które utrzymają Cię na czubku świata barberskiego.',
    'upcoming.dates': 'Nadchodzące terminy',
    'show.all': 'Pokaż wszystkie',
    'show.less': 'Pokaż mniej',
    'dates': 'terminy',

    'free.course': 'Darmowy Kurs',
    'not.sure': 'Nie jestem pewny',
    'send.inquiry': 'Wyślij Zapytanie',
    'your.name': 'Twoje imię',
    'your.email': 'Twój email',
    'select.program': 'Wybierz program...',
    'program.interest': 'Zainteresowanie programem',
    
    // Course Translation Keys
    'course.free.title': 'Jednodniowy Darmowy Kurs Barberski',
    'course.free.subtitle': 'Poznaj prawdziwy smak świata barberstwa – za darmo',
    'course.free.description': 'Zastanawiasz się nad zostaniem barberem, ale nie wiesz od czego zacząć? Nasz jednodniowy darmowy kurs to doskonały sposób na doświadczenie tego, jak naprawdę jest być częścią profesjonalnej akademii barberskiej.',
    'course.free.badge': 'Darmowy Kurs',
    'course.beginner.title': 'Kurs Barberski dla Początkujących – Od Zera do Barbera',
    'course.beginner.subtitle': 'Zacznij nowy zawód z pełnym przygotowaniem i pewnością siebie',
    'course.beginner.description': 'Intensywny 24-dniowy program (pon-sob, 12-20), który przeprowadza absolutnych początkujących do profesjonalnych barberów poprzez teorię, praktykę na manekinach i codzienną pracę na żywych modelach.',
    'course.beginner.badge': 'Początkujący',
    'course.advanced.title': 'Kurs Zaawansowany dla Barberów',
    'course.advanced.subtitle': 'Poszerz swoje umiejętności i naucz się najnowszych technik',
    'course.advanced.description': '3-dniowy bootcamp (pon-sob, 12-20) dla aktywnych barberów (min. 2 lata) skupiający się na nowoczesnych strzyżeniach, zaawansowanych fade i premium pracy z brodą.',
    'course.advanced.badge': 'Zaawansowany',

    'course.advanced.skills.0': 'Zaawansowane techniki fade',
    'course.advanced.skills.1': 'Nowoczesne metody stylizacji',
    'course.advanced.skills.2': 'Premium usługi brodowe',
    'course.advanced.skills.3': 'Mistrzostwo konsultacji z klientem',
    'course.advanced.audience.0': 'Doświadczeni barberzy (2+ lata)',
    'course.advanced.audience.1': 'Profesjonaliści salonowi',
    'course.advanced.audience.2': 'Barberzy dążący do rozwoju',
    'course.advanced.includes.0': 'Wszystkie narzędzia zapewnione',
    'course.advanced.includes.1': 'Zestaw prezentowy – nożyczki i grzebień',
    'course.advanced.includes.2': 'Certyfikat',
    'course.advanced.outcomes.0': 'Opanuj nowoczesne style',
    'course.advanced.outcomes.1': 'Wykonuj bezproblemowe fade',
    'course.advanced.outcomes.2': 'Premium usługi brodowe',
    'course.advanced.howItWorks.0': 'Masterclassy',
    'course.advanced.howItWorks.0.desc': 'Pokazy na żywo od nagradzanych barberów',
    'course.advanced.howItWorks.1': 'Projekt portfolio',
    'course.advanced.howItWorks.1.desc': 'Sesja zdjęciowa z modelami na Instagram',
    'course.advanced.howItWorks.2': 'Mentoring 1:1',
    'course.advanced.howItWorks.2.desc': 'Osobiste informacje zwrotne i plan rozwoju',
    'course.specialist.title': 'Kurs Specjalistyczny – Trendy i Nowe Techniki',
    'course.specialist.subtitle': 'Odśwież umiejętności i opanuj globalne trendy',
    'course.specialist.description': '2-tygodniowy program (pon-sob, 12-19) dla barberów chcących przyjąć najnowsze globalne trendy w strzyżeniach, fade i stylizacji brody.',
    'course.specialist.badge': 'Specjalista',

    'course.specialist.skills.0': 'Zatrzymywanie klientów',
    'course.specialist.skills.1': 'Budżetowanie i finanse',
    'course.specialist.skills.2': 'Marketing lokalny',
    'course.specialist.skills.3': 'Przywództwo i rekrutacja',
    'course.specialist.audience.0': 'Przedsiębiorcy rozwijający firmy',
    'course.specialist.audience.1': 'Właściciele zakładów barberskich',
    'course.specialist.audience.2': 'Freelancerzy chcący podnosić kwalifikacje',
    'course.specialist.includes.0': 'Narzędzia na miejscu',
    'course.specialist.includes.1': 'Prezent profesjonalnego zestawu',
    'course.specialist.includes.2': 'Certyfikat',
    'course.specialist.outcomes.0': 'Opanuj modne style',
    'course.specialist.outcomes.1': 'Popraw pracę z brzytwą',
    'course.specialist.outcomes.2': 'Przyciągnij nowych klientów',
    'course.specialist.howItWorks.0': 'Warsztaty trendów',
    'course.specialist.howItWorks.0.desc': 'Cotygodniowe sesje o najnowszych globalnych strzyżeniach',
    'course.specialist.howItWorks.1': 'Laboratoria praktyczne',
    'course.specialist.howItWorks.1.desc': 'Natychmiastowa praktyka pod nadzorem',
    'course.specialist.howItWorks.2': 'Pokazy klientów',
    'course.specialist.howItWorks.2.desc': 'Stylizuj prawdziwych klientów i otrzymuj opinie',
    'instructor.about.richer': 'Ekspert w nowoczesnych technikach strzyżenia i klasycznych stylach barberskich z latami profesjonalnego doświadczenia.',
    'instructor.experience.richer': 'Profesjonalny barber specjalizujący się w precyzyjnych strzyżeniach i współczesnym stylizowaniu.',
    'instructor.about.apo': 'Pasjonat edukacji i wykwalifikowany barber poświęcony szkoleniu następnej generacji profesjonalistów.',
    'instructor.experience.apo': 'Doświadczony barber i instruktor z ekspertyzą w zaawansowanych technikach strzyżenia.',
    'instructor.about.bartosz': 'Kreatywny stylista skupiony na nowoczesnych trendach i spersonalizowanych doświadczeniach klientów.',
    'instructor.experience.bartosz': 'Wykwalifikowany barber specjalizujący się w kreatywnych strzyżeniach i współczesnym stylizowaniu włosów.',
    'instructor.about.ali': 'Poświęcony profesjonalista z ekspertyzą w tradycyjnych i nowoczesnych technikach barberskich.',
    'instructor.experience.ali': 'Doświadczony barber z pasją do dostarczania wyjątkowych usług pielęgnacyjnych.',
    'instructor.about.tomasz': 'Doświadczony profesjonalista łączący praktyczne umiejętności barberskie z doskonałością w nauczaniu.',
    'instructor.experience.tomasz': 'Profesjonalny barber i edukator zaangażowany w dzielenie się wiedzą i umiejętnościami.',
    'testimonial.1.quote': 'Najlepsze miejsce w Warszawie, aby szybko i przede wszystkim dobrze nauczyć się zawodu od podstaw. Właśnie skończyłem kurs, chłopaki pomogli z finansowaniem kursu i znaleźli mi pracę zaraz po ukończeniu. Bardzo polecam i dziękuję!',
    'testimonial.1.name': 'Angelika Ziółkowska',
    'testimonial.1.title': 'Absolwent • 5-gwiazdkowa opinia Google',
    'testimonial.2.quote': 'Miałem przyjemność uczestniczyć w 3-dniowym szkoleniu pod opieką Tomka i Alego. Jestem zachwycony efektami szkolenia. Świetna atmosfera i wspaniałi edukatorzy. Chłopaki dali nam ogromną dawkę wiedzy i wskazówek dotyczących tworzenia portfolio. Bardzo polecam!',
    'testimonial.2.name': 'Agata Antoniewicz',
    'testimonial.2.title': 'Absolwent • 5-gwiazdkowa opinia Google',
    'testimonial.3.quote': 'Pomimo czasu, który minął od końca kursu, postanowiłem zostawić opinię. Uczestniczyłem w miesięcznym kursie "Barber od podstaw" w K&K Academy i jestem pod wrażeniem poziomu profesjonalizmu i jakości szkolenia. Edukatorzy Tomek, Bartek i Ali wykazali się nie tylko wiedzą teoretyczną, ale też imponującymi umiejętnościami praktycznymi. Teraz, 6 miesięcy po ukończeniu kursu, z powodzeniem prowadzę własny salon i cieszę się, że miałem okazję uczestniczyć w kursie od podstaw z chłopakami.',
    'testimonial.3.name': 'Sharp Cut Barber',
    'testimonial.3.title': 'Właściciel Salonu • 5-gwiazdkowa opinia Google',
    'common.graduate': 'Absolwent',
    'common.review': 'opinia Google',
    'common.star': 'gwiazdkowa',
    'common.show.more': 'Pokaż więcej',
    'common.show.less': 'Pokaż mniej',
    'common.all': 'wszystkie',
    'common.dates': 'terminy',
    'common.upcoming': 'Nadchodzące',
    'course.schedule': 'Harmonogram',
    'course.everyday': 'Codziennie',
    'course.schedule.flexible': 'Elastyczne godziny',
    'months.january': 'Styczeń',
    'months.february': 'Luty',
    'months.march': 'Marzec',
    'months.april': 'Kwiecień',
    'months.may': 'Maj',
    'months.june': 'Czerwiec',
    'months.july': 'Lipiec',
    'months.august': 'Sierpień',
    'months.september': 'Wrzesień',
    'months.october': 'Październik',
    'months.november': 'Listopad',
    'months.december': 'Grudzień',

    // Blog Translation Keys
    'blog.loading': 'Ładowanie artykułu...',
    'blog.not.found': 'Artykuł nie znaleziony',
    'blog.not.found.description': 'Artykuł, którego szukasz, nie istnieje.',
    'blog.back.to.blog': '← Powrót do bloga',
    'blog.back.to.home': 'Powrót do strony głównej',
    'blog.min.read': 'min czytania',
    'blog.ready.to.start': 'Gotowy, żeby rozpocząć swoją przygodę z barberstwem?',
    'blog.ready.description': 'Dołącz do K&K Barber Academy i ucz się od profesjonalistów w naszych nowoczesnych ośrodkach.',
    'blog.start.journey': 'Rozpocznij swoją przygodę',
    'blog.related.articles': 'Powiązane artykuły',
    'blog.quick.links': 'Szybkie linki',
    'blog.view.courses': '→ Zobacz kursy',
    'blog.meet.instructors': '→ Poznaj instruktorów',
    'blog.student.gallery': '→ Galeria uczniów',
    'blog.contact.us': '→ Kontakt',

    // Blog Post Titles and Content (Polish)
    'blog.post.start-barber-career.title': 'Jak rozpocząć karierę w barberstwie',
    'blog.post.start-barber-career.tag': 'POCZĄTKUJĄCY',
    'blog.post.top-5-fade-techniques-2025.title': 'Top 5 technik fade na 2025 rok',
    'blog.post.top-5-fade-techniques-2025.tag': 'TRENDY',
    'blog.post.barber-toolkit-essentials.title': 'Zestaw narzędzi barbera: Niezbędne vs Miłe w posiadaniu',
    'blog.post.barber-toolkit-essentials.tag': 'NARZĘDZIA',
    

    'about.certified.excellence': 'Certyfikowana doskonałość',
    'about.state.licensed': 'Akademia licencjonowana przez państwo',
    'about.learn.more': 'Dowiedz się więcej o nas',
    'about.certificate.title': 'Oficjalny Certyfikat',
    'about.certificate.subtitle': 'Rzetelna certyfikacja systemu zarządzania jakością',
    'about.certificate.description': 'Certyfikat potwierdza spełnienie norm jakości ISO 9001:2015-10 w zakresie szkoleń specjalistycznych dla branży barberskiej.',
    'about.certificate.accredited': 'Certyfikaty',
    'about.certificate.iso.title': 'Certyfikat ISO 9001:2015-10',
    'about.certificate.iso.description': 'Oficjalna certyfikacja systemu zarządzania jakością dla profesjonalnego szkolenia barberskiego.',
    'about.certificate.szoe.title': 'Certyfikat SZOE',
    'about.certificate.szoe.description': 'Państwowa certyfikacja dla instytucji edukacyjnych w Polsce.',
    'common.free': 'BEZPŁATNE',
    

    'course.duration.4hours': 'Codziennie, 4 godziny',
    'course.duration.1month': 'Codziennie, 1 miesiąc',
    'course.duration.3days': 'Codziennie, 3 dni',
    'course.duration.2weeks': 'Codziennie, 2 tygodnie',
    'course.duration.daily': 'Codziennie',
    'course.certification.experience': 'Certyfikat doświadczenia',
    'course.certification.professional': 'Profesjonalny certyfikat',
    'course.certification.advanced': 'Zaawansowany certyfikat',
    'course.certification.specialist': 'Certyfikat specjalisty',


    'instructor.richer.karimov': 'Richer Karimov',
    'instructor.apo.karimov': 'Apo Karimov',
    'instructor.bartosz.kaczorowski': 'Bartosz Kaczorowski',
    'instructor.ali.karimov': 'Ali Karimov',
    'instructor.tomasz.kaczorowski': 'Tomasz Kaczorowski',




    'gallery.see.all.student.works': 'Zobacz wszystkie prace uczniów',
    'gallery.all.success.stories': 'Wszystkie historie sukcesu',
    'gallery.view.full': 'Zobacz pełną galerię',





    // Page Translation Keys
    'course.not.found': 'Kurs nie został znaleziony.',
    'page.gallery.title': 'Pełna',
    'page.gallery.title.highlight': 'Galeria',
    'page.gallery.loading': 'Odkryj naszą kompletną kolekcję prac',
    'page.gallery.explore': 'Sprawdź naszą kompletną kolekcję profesjonalnych prac i momentów treningowych',
    'page.students.title': 'Prace',
    'page.students.title.highlight': 'Uczniów',
    'page.students.explore': 'Zobacz niesamowite transformacje i umiejętności naszych uczniów',
    'page.success.title': 'Historie',
    'page.success.title.highlight': 'Sukcesu',
    'page.success.explore': 'Poznaj inspirujące historie naszych absolwentów',
    'page.back.home': 'Powrót do strony głównej',
    'page.apply.now': 'Aplikuj teraz',
    'page.showcased.works': 'prezentowanych prac',
    'page.blog.title': 'Akademia',
    'page.blog.title.highlight': 'Wskazówki',
    'page.blog.subtitle': 'Wiadomości, porady i trendy ze świata nowoczesnego barberingu.',

    // Gallery UI Elements
    'gallery.professional.works': 'profesjonalnych prac',
    'gallery.masonry.view': 'Widok kafelkowy',
    'gallery.flow': 'Kafelki',

    // Blog Post Translation Keys
    'blog.post.career.title': 'Jak rozpocząć karierę w barberingu',
    'blog.post.career.excerpt': 'Myślisz o zostaniu barberem? Oto jak mogą wyglądać twoje pierwsze 30 dni...',
    'blog.post.fade.title': 'Top 5 technik fade na 2025 rok',
    'blog.post.fade.excerpt': 'Wyprzedź konkurencję dzięki tym niezbędnym wariacjom fade, o które będzie pytać każdy klient.',
    'blog.post.toolkit.title': 'Zestaw barbera: Niezbędne vs. Miłe w posiadaniu',
    'blog.post.toolkit.excerpt': 'Od maszynki do grzebieni, oto nasz ostateczny przewodnik po budowaniu profesjonalnego zestawu bez przepłacania.',
    'blog.tag.beginner': 'Początkujący',
    'blog.tag.trends': 'Trendy',
    'blog.tag.tools': 'Narzędzia',
    'blog.filter.all': 'Wszystkie',



    // Course Details Translation Keys
    'course.overview': 'Przegląd kursu',
    'course.curriculum': 'Program nauczania',
    'course.instructors': 'Instruktorzy',
    'course.gallery': 'Galeria',
    'course.book.now': 'Zapisz się teraz',
    'course.duration': 'Czas trwania',
    'course.students': 'Uczniowie',
    'course.certification': 'Certyfikacja',
    'course.what.learn': 'Czego się nauczysz',
    'course.upcoming.dates': 'Nadchodzące terminy',
    'course.enroll.today': 'Zapisz się dziś',
    'course.meet.instructors': 'Poznaj instruktorów',
    'course.select.date': 'Wybierz preferowany termin rozpoczęcia',
    'course.audience': 'Dla kogo jest ten kurs',
    'course.how.works': 'Jak działa kurs',
    'course.whats.included': 'Co jest zawarte',
    'course.outcomes': 'Pod koniec będziesz w stanie…',
    'course.gallery.title': 'Kurs w akcji',
    'course.gallery.subtitle': 'Przeglądaj momenty z naszego praktycznego szkolenia.',
    'course.certificate.title': 'Certyfikat i Akredytacja',
    'course.certificate.description': 'Po ukończeniu kursu otrzymasz certyfikat wydany przez K&K Academy, uznaną instytucję szkoleniową dla barberów.',
    'course.certificate.accredited': 'Akredytowany certyfikat',
    'course.certificate.industry': 'Uznawany w branży',
    'course.certificate.portfolio': 'Portfolio prac',
    'course.pricing.title': 'Cennik i Plany',
    'course.pricing.description': 'Wybierz plan, który najlepiej odpowiada Twoim potrzebom i budżetowi.',
    'course.pricing.full.payment': 'Płatność pełna',
    'course.pricing.installments': 'Płatność ratalna',
    'course.pricing.contact': 'Skontaktuj się po szczegóły',
    'course.faq.title': 'Często zadawane pytania',
    'course.faq.experience.q': 'Czy potrzebuję wcześniejszego doświadczenia?',
    'course.faq.experience.a': 'Nie, nasze kursy dla początkujących są zaprojektowane dla osób bez wcześniejszego doświadczenia w barberstwie. Program ma 80% praktyki, wszystkie narzędzia zapewnione, a dzięki certyfikatom ISO 9001:2015 i SZOE gwarantujemy najwyższą jakość szkolenia.',
    'course.faq.tools.q': 'Czy muszę kupować własne narzędzia?',
    'course.faq.tools.a': 'Nie, wszystkie narzędzia i materiały są zapewnione podczas kursu. Otrzymasz też listę rekomendowanych narzędzi do zakupu.',
    'course.faq.job.q': 'Czy pomagacie w znalezieniu pracy?',
    'course.faq.job.a': 'Tak, oferujemy wsparcie w znalezieniu pracy i mamy partnerstwa z lokalnymi salonami barberskimi.',
    'course.cta.final.title': 'Rozpocznij swoją podróż już dziś',
    'course.cta.final.description': 'Dołącz do setek zadowolonych absolwentów, którzy zbudowali udane kariery w barberstwie.',
    'course.cta.final.button': 'Zapisz się teraz',

    // Beginner Course (ID: 1) Specific Translations
    'course.beginner.skills.0': 'Klasyczne i nowoczesne strzyżenia',
    'course.beginner.skills.1': 'Wygolenia maszynką (niskie/średnie/wysokie)',
    'course.beginner.skills.2': 'Praca brzytwą i detale',
    'course.beginner.skills.3': 'Modelowanie i pielęgnacja brody',
    
    'course.beginner.audience.0': 'Osoby bez doświadczenia',
    'course.beginner.audience.1': 'Osoby zmieniające karierę',
    'course.beginner.audience.2': 'Uczniowie po szkole',
    
    'course.beginner.howItWorks.0': 'Teoria',
    'course.beginner.howItWorks.1': 'Praktyka na manekinach',
    'course.beginner.howItWorks.2': 'Prawdziwi klienci',
    'course.beginner.howItWorks.0.desc': 'Interaktywne wykłady i demonstracje',
    'course.beginner.howItWorks.1.desc': 'Rozwijaj pamięć mięśniową bezpiecznie',
    'course.beginner.howItWorks.2.desc': 'Strzyżenia pod nadzorem na żywych modelach',
    
    'course.beginner.includes.0': 'Prezent - profesjonalne nożyczki i grzebień',
    'course.beginner.includes.1': 'Wszystkie narzędzia zapewnione',
    'course.beginner.includes.2': 'Certyfikat ukończenia',
    
    'course.beginner.outcomes.0': 'Wykonywać nowoczesne strzyżenia i wygolenia',
    'course.beginner.outcomes.1': 'Pewnie stylizować brody',
    'course.beginner.outcomes.2': 'Rozpocząć karierę barbera',

    // Course benefits specific translations (Polish)
    'course.free.benefits.0': 'Bezpłatne doświadczenie w akademii',
    'course.free.benefits.1': 'Zobacz nasze obiekty z pierwszej ręki',
    'course.free.benefits.2': 'Poznaj profesjonalnych instruktorów',
    'course.free.benefits.3': 'Zadaj pytania o programy',
    
    'course.beginner.benefits.0': 'Szeroka praktyka na żywych modelach',
    'course.beginner.benefits.1': 'Indywidualna uwaga dla każdego studenta',
    'course.beginner.benefits.2': 'Wszystkie profesjonalne narzędzia na miejscu',
    
    'course.advanced.benefits.0': 'Zaawansowane techniki strzyżenia',
    'course.advanced.benefits.1': 'Metody stylizacji premium brody',
    'course.advanced.benefits.2': 'Nowoczesne warianty wygoleń',
    
    'course.specialist.benefits.0': 'Najnowsze globalne trendy barberskie',
    'course.specialist.benefits.1': 'Rozwój profesjonalnego portfolio',
    'course.specialist.benefits.2': 'Fachowy mentoring przez cały kurs',


    'course.pricing.all.modules': 'Wszystkie moduły',
    'course.pricing.contact.details': 'Skontaktuj się po szczegóły',
    'course.pricing.interest.free': '0% odsetek',

    // Course pricing specific translations (Polish)
    'course.free.pricing.title': 'Darmowe Doświadczenie',
    'course.free.pricing.session': 'Pełna 4-godzinna sesja',
    'course.free.pricing.no.costs': 'Bez ukrytych kosztów',
    'course.free.pricing.price': 'DARMOWE',
    'course.free.pricing.cta': 'Skontaktuj się po szczegóły',
    
    'course.beginner.pricing.title': 'Kompletny Kurs dla Początkujących',
    'course.beginner.pricing.duration': '24 dni intensywnego szkolenia',
    'course.beginner.pricing.certification': 'Certyfikat ukończenia',
    'course.beginner.pricing.tools': 'Wszystkie narzędzia w cenie',
    'course.beginner.pricing.price': '9,000 PLN',
    'course.beginner.pricing.full.price': '(Cena regularna: 11,000 PLN)',
    'course.beginner.pricing.installments': 'Raty dostępne',
    'course.beginner.pricing.cta': 'Zapisz się teraz',
    
    'course.advanced.pricing.title': 'Kurs Zaawansowany',
    'course.advanced.pricing.duration': '3-dniowy intensywny bootcamp',
    'course.advanced.pricing.portfolio': 'Sesja zdjęciowa portfolio',
    'course.advanced.pricing.mentoring': 'Mentoring 1:1',
    'course.advanced.pricing.price': '1,800 PLN',
    'course.advanced.pricing.cta': 'Dołącz do kursu',
    
    'course.specialist.pricing.title': 'Kurs Specjalistyczny',
    'course.specialist.pricing.duration': '2-tygodniowy program',
    'course.specialist.pricing.trends': 'Najnowsze globalne trendy',
    'course.specialist.pricing.business': 'Materiały biznesowe',
    'course.specialist.pricing.price': '2,400 PLN',
    'course.specialist.pricing.cta': 'Rozpocznij specjalizację',

    // Instructor Details Translation Keys
    'instructor.not.found': 'Instruktor nie znaleziony',
    'instructor.apply.now': 'Aplikuj teraz',
    'instructor.experience': 'Doświadczenie',
    'instructor.specializations': 'Specjalizacje',
    'instructor.about': 'O instrukturze',
    'instructor.contact': 'Skontaktuj się',

    // About Section CTA
    'about.cta': 'Rozpocznij swoją podróż',

    // About Us Page Translations
    'aboutus.hero.title': 'Od Zera do',
    'aboutus.hero.mastery': 'Mistrzostwa',
    'aboutus.hero.description': 'Nie tylko uczymy barberingu — kształtujemy kariery. Ambicja spotyka się z precyzją w naszych salach.',
    'aboutus.legal.title': 'Informacje Prawne',
    'aboutus.legal.name': 'Nazwa Prawna:',
    'aboutus.legal.trading': 'Nazwa Handlowa:',
    'aboutus.offers.title': 'Co Oferujemy',
    'aboutus.offers.beginners.title': 'Dla Początkujących',
    'aboutus.offers.beginners.text': 'Podstawowe kursy do rozpoczęcia nowej kariery od zera.',
    'aboutus.offers.experienced.title': 'Dla Doświadczonych Barberów',
    'aboutus.offers.experienced.text': 'Zaawansowane moduły do doskonalenia techniki i podnoszenia statusu.',
    'aboutus.whychoose.title': 'Dlaczego Wybierz',
    'aboutus.whychoose.reason1': '80% zajęć to praktyka — pracujesz na manekinach i z prawdziwymi klientami',
    'aboutus.whychoose.reason2': 'Kameralne grupy — gwarantujemy indywidualne podejście i realny mentoring',
    'aboutus.whychoose.reason3': 'Wszystkie narzędzia i produkty w cenie — bez żadnych ukrytych kosztów',
    'aboutus.whychoose.reason4': 'Otrzymujesz certyfikaty uznawane na rynku pracy',
    'aboutus.whychoose.reason5': 'Pomagamy w uzyskaniu nawet 100% dofinansowania na kurs',
    'aboutus.team.title': 'Poznaj',
    'aboutus.team.team': 'Zespół',
    'aboutus.results.title': 'Wyniki, które Mówią Same za Siebie',
    'aboutus.results.graduates': '100+ absolwentów pracujących w całej Polsce',
    'aboutus.results.trusted': 'Zaufany przez profesjonalistów w zakresie kształcenia ustawicznego',
    'aboutus.results.reviews': '5-gwiazdkowe recenzje na Google i Booksy',
    'aboutus.faq.title': 'Często Zadawane Pytania',
    'aboutus.faq.q1': 'Nigdy wcześniej nie trzymałem nożyczek — czy dam radę?',
    'aboutus.faq.a1': 'Absolutnie. Wielu uczniów zaczyna od zera; nasz program podstawowy jest stworzony dla początkujących.',
    'aboutus.faq.q2': 'Czy kurs jest drogi?',
    'aboutus.faq.a2': 'Cena podstawowa to 11 000 PLN, obecnie z rabatem do 9 000 PLN. Warsztaty dzienne od 1 200 PLN.',
    'aboutus.cta.enroll': 'Zapisz się teraz',

    // Individual Instructor Details
    'instructor.1.about': 'Ekspert w klasycznych technikach barberskich z ponad 10-letnim doświadczeniem. Specjalizuje się w precyzyjnych strzyżeniach i stylizacji brody.',
    'instructor.1.experience': 'Doświadczenie: 12+ lat',
    'instructor.2.about': 'Mistrz nowoczesnych trendów i kreatywnych stylizacji. Prowadzi warsztaty dla zaawansowanych uczniów.',
    'instructor.2.experience': 'Doświadczenie: 8+ lat',
    'instructor.3.about': 'Specjalista od tradycyjnych technik i precyzyjnego golenia. Mentor dla nowych instruktorów.',
    'instructor.3.experience': 'Doświadczenie: 15+ lat',
    'instructor.4.about': 'Ekspert w nowoczesnych technikach strzyżenia i koloryzacji. Certyfikowany instruktor międzynarodowy.',
    'instructor.4.experience': 'Doświadczenie: 10+ lat',
    'instructor.5.about': 'Mistrz klasycznego barberingu i stylizacji. Prowadzi kursy dla zaawansowanych.',
    'instructor.5.experience': 'Doświadczenie: 14+ lat',

    // Course types for contact forms
    'course.type.complete': 'Kompletny kurs barbera',
    'course.type.advanced': 'Zaawansowane szkolenie barberskie',
    'course.type.weekend': 'Intensywny kurs weekendowy',
    'course.type.master': 'Certyfikat Mistrza Barbera',
    'course.type.short': 'Krótki kurs',

    // Course.free detailed content translations (Polish)
    'course.free.skills.0': 'Eksploracja akademii',
    'course.free.skills.1': 'Obserwacja zajęć na żywo',
    'course.free.skills.2': 'Spotkanie z ekspertami barberami',
    'course.free.skills.3': 'Sesja pytań i odpowiedzi branżowych',
    
    'course.free.audience.0': 'Kompletni początkujący',
    'course.free.audience.1': 'Wszyscy zainteresowani barberingiem',
    'course.free.audience.2': 'Badacze kariery',
    
    'course.free.includes.0': 'Wycieczka po akademii',
    'course.free.includes.1': 'Demonstracje na żywo',
    'course.free.includes.2': 'Porady ekspertów',
    'course.free.includes.3': 'Bez żadnych zobowiązań',
    
    'course.free.outcomes.0': 'Zobacz, czy barbering Ci odpowiada',
    'course.free.outcomes.1': 'Zobacz, jak działa nasza akademia',
    'course.free.outcomes.2': 'Zrozum nasz styl nauczania',
    'course.free.outcomes.3': 'Zainspiruj się prawdziwymi profesjonalistami',

    'course.free.howItWorks.0': 'Wycieczka po akademii',
    'course.free.howItWorks.1': 'Obserwacja na żywo',
    'course.free.howItWorks.2': 'Poznaj zespół',
    'course.free.howItWorks.0.desc': 'Odkryj nasze nowoczesne obiekty szkoleniowe',
    'course.free.howItWorks.1.desc': 'Obserwuj prawdziwe zajęcia w akcji',
    'course.free.howItWorks.2.desc': 'Porozmawiaj z naszymi ekspertami instruktorami',

    // Course.beginner benefits specific translations (Polish)

  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
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
    'hero.description': 'We don\'t just teach hairdressing — we help build real careers. This is where ambition meets precision, and passion transforms into profession.',
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
    'about.subtitle': 'Why Us?',
    'about.description': 'As the only academy in Poland, we can boast two quality certificates. Our team consists exclusively of qualified educators who not only passed apprenticeship exams, but also have pedagogical preparation. We focus on the highest teaching standards and real preparation for work in the barber profession.',
    
    // Why Choose K&K Features
    'features.practical.title': '80% of classes are practical — you work with mannequins and real clients',
    'features.groups.title': 'Intimate groups — we guarantee individual approach and real mentoring',
    'features.tools.title': 'All tools and products included in price — without any hidden costs',
    'features.certificates.title': 'You receive certificates recognized in the job market',
    'features.funding.title': 'We help obtain up to 100% course funding',

    // Courses
    'courses.title': 'Our Courses',
    'courses.subtitle': 'Choose the perfect course for your skill level and career goals',
    'courses.beginner': 'Beginner Course',
    'courses.advanced': 'Advanced Course',
    'courses.master': 'Master Course',
    'courses.specialty': 'Specialty Courses',
    'courses.view.all': 'View All Courses',
    'courses.enroll': 'Enroll',
    'courses.enroll.now': 'Enroll Now',
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
    'senior.barber.instructor': 'Senior Barber Instructor',

    // Testimonials
    'testimonials.title': 'Student Success Stories',
    'testimonials.subtitle': 'Success Stories',
    'testimonials.description': 'Hear from our graduates who\'ve transformed their passion into profitable careers and successful businesses.',

    // Gallery
    'gallery.title': 'Our',
    'gallery.title.highlight': 'Gallery',
    'gallery.subtitle': 'See our work',
    'gallery.description': 'Discover the amazing work of our students and instructors.',

    // Testimonials
    'testimonials.see.student.work': 'See All Student Works',
    'testimonials.see.success.stories': 'All Success Stories',

    // Contact
    'contact.title': 'Contact',
    'contact.title.highlight': 'Us',
    'contact.title.today': 'Today',
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
    'contact.hours.weekdays': 'Mon-Fri: 12:00 - 21:00',
    'contact.hours.saturday': 'Sat: 12:00 - 17:00',
    'contact.hours.sunday': 'Sun: Closed',
    'contact.form.title': 'Get More Information',
    'contact.form.first.name': 'First Name',
    'contact.form.last.name': 'Last Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.program': 'Program Interest',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Inquiry',
    'contact.form.required': 'Please fill in required fields',
    'contact.form.required.desc': 'First Name, Last Name, and Email are required.',
    'contact.form.thank.you': 'Thank you for your interest!',
    'contact.form.thank.you.desc': 'We will contact you soon with more information.',
    'contact.form.program.placeholder': 'Choose the program that interests you...',
    'contact.form.message.placeholder': 'Tell us about your goals and expectations...',

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
    
    // CTA Enroll Section
    'cta.enroll.title': 'Ready to Start Your Barber Journey?',
    'cta.enroll.description': 'Join hundreds of successful graduates who have transformed their lives through our comprehensive training programs.',
    'cta.enroll.button': 'Start Your Barber Career',

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

    // Additional translations for missing components
    'our.vibe': 'Our Vibe!',
    'programs.fundamentals': 'Barber Fundamentals',
    'programs.master': 'Master Techniques',
    'programs.business': 'Business Mastery',
    'programs.private': 'Private Lessons',
    'quicklinks.about': 'About Us',
    'quicklinks.admissions': 'Admissions',
    'quicklinks.financial': 'Financial Aid',
    'quicklinks.portal': 'Student Portal',
    'copyright': '© 2024 K&K Barber Academy. All rights reserved.',
    'policies.privacy': 'Privacy Policy',
    'policies.terms': 'Terms of Service',
    'policies.handbook': 'Student Handbook',
    'working.hours': 'Working hours:',
    'blog.latest': 'Latest Insights',
    'blog.tips': 'Tips, trends, and resources to keep you at the cutting edge of the barbering world.',
    'upcoming.dates': 'Upcoming Dates',
    'show.all': 'Show all',
    'show.less': 'Show less',
    'dates': 'dates',
    'free.course': 'Free Course',
    'not.sure': 'Not sure yet',
    'send.inquiry': 'Send Inquiry',
    'your.name': 'Your name',
    'your.email': 'Your email',
    'select.program': 'Select program...',
    'program.interest': 'Program Interest',
    
    // About Section Translation Keys  
    'about.features.certified': 'State-certified programs with industry recognition',
    'about.features.handson': 'Hands-on training with professional-grade equipment',
    'about.features.placement': 'Career placement assistance and ongoing support',
    'about.learn.more': 'Learn More About Us',
    'about.certified.excellence': 'Certified Excellence',
    'about.state.licensed': 'State Licensed Academy',
    'about.certificate.title': 'Official Certificate',
    'about.certificate.subtitle': 'Reliable quality management system certification',
    'about.certificate.description': 'Certificate confirms compliance with ISO 9001:2015-10 quality standards for specialized training in the barbering industry.',
    'common.free': 'FREE',
    

    'course.duration.4hours': 'Daily, 4 hours',
    'course.duration.1month': 'Daily, 1 month',
    'course.duration.3days': 'Daily, 3 days',
    'course.duration.2weeks': 'Daily, 2 weeks',
    'course.duration.daily': 'Daily',
    'course.certification.experience': 'Experience Certificate',
    'course.certification.professional': 'Professional Certificate',
    'course.certification.advanced': 'Advanced Certificate',
    'course.certification.specialist': 'Specialist Certificate',


    'instructor.richer.karimov': 'Richer Karimov',
    'instructor.apo.karimov': 'Apo Karimov',
    'instructor.bartosz.kaczorowski': 'Bartosz Kaczorowski',
    'instructor.ali.karimov': 'Ali Karimov',
    'instructor.tomasz.kaczorowski': 'Tomasz Kaczorowski',


    'contact.visit.campus': 'Visit Our Campus',
    'contact.call.us': 'Call Us',
    'contact.email.us': 'Email Us',
    'contact.hours': 'Hours',
    'contact.hours.schedule': 'Mon-Fri: 12:00 - 21:00, Sat: 12:00 - 17:00',

    // Gallery Translation Keys  
    'gallery.view.full': 'View Full Gallery',





    // Page Translation Keys
    'course.not.found': 'Course not found.',
    'page.gallery.title': 'Full',
    'page.gallery.title.highlight': 'Gallery',
    'page.gallery.loading': 'Discover our complete collection of work',
    'page.gallery.explore': 'Explore our complete collection of professional works and training moments',
    'page.students.title': 'Student',
    'page.students.title.highlight': 'Works',
    'page.students.explore': 'See the amazing transformations and skills from our students',
    'page.success.title': 'Success',
    'page.success.title.highlight': 'Stories',
    'page.success.explore': 'Discover inspiring stories from our graduates',
    'page.back.home': 'Back to Home',
    'page.apply.now': 'Apply Now',
    'page.showcased.works': 'showcased works',
    'page.blog.title': 'Academy',
    'page.blog.title.highlight': 'Insights',
    'page.blog.subtitle': 'News, tips and trends from the world of modern barbering.',

    // Gallery UI Elements
    'gallery.professional.works': 'professional works',
    'gallery.masonry.view': 'Masonry View',
    'gallery.grid.view': 'Grid View',
    'gallery.flow': 'Flow',
    'gallery.grid': 'Grid',
    'gallery.load.all': 'Load All',
    'gallery.more.works': 'more works',
    'gallery.size.compact': 'Compact',
    'gallery.size.standard': 'Standard',
    'gallery.size.spacious': 'Spacious',

    // Blog Post Translation Keys
    'blog.post.career.title': 'How to Start a Career in Barbering',
    'blog.post.career.excerpt': "Thinking about becoming a barber? Here's what your first 30 days might look like...",
    'blog.post.fade.title': 'Top 5 Fade Techniques for 2025',
    'blog.post.fade.excerpt': 'Stay ahead of the curve with these must-know fade variations every client will ask for.',
    'blog.post.toolkit.title': 'Barber Toolkit: Essentials vs. Nice-to-Have',
    'blog.post.toolkit.excerpt': "From clippers to combs, here's our definitive guide to building a pro kit without overspending.",
    'blog.tag.beginner': 'Beginner',
    'blog.tag.trends': 'Trends',
    'blog.tag.tools': 'Tools',
    'blog.filter.all': 'All',



    'contact.page.title': 'Contact',
    'contact.page.highlight': 'K&K Academy',
    'contact.page.subtitle': 'Have questions about our programs, pricing, or enrollment? Reach out and our admissions team will gladly help.',
    'contact.form.error': 'Error sending message',
    'contact.form.error.desc': 'Please try again later.',
    'contact.form.success': 'Message sent!',
    'contact.form.success.desc': 'We will be in touch shortly.',

    // Course Details Translation Keys
    'course.overview': 'Course Overview',
    'course.curriculum': 'Curriculum',
    'course.instructors': 'Instructors',
    'course.gallery': 'Gallery',
    'course.book.now': 'Book Now',
    'course.duration': 'Duration',
    'course.students': 'Students',
    'course.certification': 'Certification',
    'course.what.learn': 'What you will learn',
    'course.upcoming.dates': 'Upcoming Dates',
    'course.enroll.today': 'Enroll Today',
    'course.meet.instructors': 'Meet Your Instructors',
    'course.select.date': 'Select your preferred start date',
    'course.audience': 'Who This Course Is For',
    'course.how.works': 'How the Course Works',
    'course.whats.included': 'What\'s Included',
    'course.outcomes': 'By the end you will…',
    'course.gallery.title': 'Course in Action',
    'course.gallery.subtitle': 'Swipe through moments from our hands-on training.',
    'course.certificate.title': 'Certificate & Accreditation',
    'course.certificate.description': 'Upon completion, you will receive a certificate issued by K&K Academy, a recognized training institution for barbers.',
    'course.certificate.accredited': 'Accredited Certificate',
    'course.certificate.industry': 'Industry Recognized',
    'course.certificate.portfolio': 'Work Portfolio',
    'about.certificate.accredited': 'Certificates',
    'about.certificate.iso.title': 'ISO 9001:2015-10 Certificate',
    'about.certificate.iso.description': 'Official quality management system certification for professional barber training.',
    'about.certificate.szoe.title': 'SZOE Certificate',
    'about.certificate.szoe.description': 'State certification for educational institutions in Poland.',
    'course.pricing.title': 'Pricing & Plans',
    'course.pricing.description': 'Choose the plan that best fits your needs and budget.',
    'course.pricing.full.payment': 'Full Payment',
    'course.pricing.installments': 'Installment Plan',
    'course.pricing.contact': 'Contact for Details',

    // Course pricing specific translations (English)
    'course.free.pricing.title': 'Free Experience',
    'course.free.pricing.session': 'Full 4-hour session',
    'course.free.pricing.no.costs': 'No hidden costs',
    'course.free.pricing.price': 'FREE',
    'course.free.pricing.cta': 'Contact for details',
    
    'course.beginner.pricing.title': 'Complete Beginner Course',
    'course.beginner.pricing.duration': '24 days intensive training',
    'course.beginner.pricing.certification': 'Completion certificate',
    'course.beginner.pricing.tools': 'All tools included',
    'course.beginner.pricing.price': '9,000 PLN',
    'course.beginner.pricing.full.price': '(Regular price: 11,000 PLN)',
    'course.beginner.pricing.installments': 'Installments available',
    'course.beginner.pricing.cta': 'Enroll now',
    
    'course.advanced.pricing.title': 'Advanced Course',
    'course.advanced.pricing.duration': '3-day intensive bootcamp',
    'course.advanced.pricing.portfolio': 'Portfolio photo session',
    'course.advanced.pricing.mentoring': '1:1 mentoring',
    'course.advanced.pricing.price': '1,800 PLN',
    'course.advanced.pricing.cta': 'Join course',
    
    'course.specialist.pricing.title': 'Specialist Course',
    'course.specialist.pricing.duration': '2-week programme',
    'course.specialist.pricing.trends': 'Latest global trends',
    'course.specialist.pricing.business': 'Business materials',
    'course.specialist.pricing.price': '2,400 PLN',
    'course.specialist.pricing.cta': 'Start specialization',
    'course.faq.title': 'Frequently Asked Questions',
    'course.faq.experience.q': 'Do I need previous experience?',
    'course.faq.experience.a': 'No, our beginner courses are designed for people with no previous barbering experience.',
    'course.faq.tools.q': 'Do I need to buy my own tools?',
    'course.faq.tools.a': 'No, all tools and materials are provided during the course. You will also receive a list of recommended tools to purchase.',
    'course.faq.job.q': 'Do you help with job placement?',
    'course.faq.job.a': 'Yes, we offer job placement support and have partnerships with local barbershops.',
    'course.cta.final.title': 'Start Your Journey Today',
    'course.cta.final.description': 'Join hundreds of satisfied graduates who have built successful careers in barbering.',
    'course.cta.final.button': 'Enroll Now',

    // Beginner Course (ID: 1) Specific Translations
    'course.beginner.skills.0': 'Classic & modern haircuts',
    'course.beginner.skills.1': 'Clipper fading (low/mid/high)',
    'course.beginner.skills.2': 'Razor work & detailing',
    'course.beginner.skills.3': 'Beard shaping & care',
    
    'course.beginner.audience.0': 'People with no experience',
    'course.beginner.audience.1': 'Career changers',
    'course.beginner.audience.2': 'Students after school',
    
    'course.beginner.howItWorks.0': 'Theory',
    'course.beginner.howItWorks.1': 'Practice on Mannequins',
    'course.beginner.howItWorks.2': 'Real Clients',
    'course.beginner.howItWorks.0.desc': 'Interactive lectures & demos',
    'course.beginner.howItWorks.1.desc': 'Develop muscle memory safely',
    'course.beginner.howItWorks.2.desc': 'Supervised cuts on live models',
    
    'course.beginner.includes.0': 'Professional scissors & comb gift',
    'course.beginner.includes.1': 'All tools provided',
    'course.beginner.includes.2': 'Certificate of completion',
    
    'course.beginner.outcomes.0': 'Perform modern cuts & fades',
    'course.beginner.outcomes.1': 'Confidently style beards',
    'course.beginner.outcomes.2': 'Launch barber career',

    // Course benefits specific translations (English)
    'course.free.benefits.0': 'No cost for this experience session',
    'course.free.benefits.1': 'See our academy facilities firsthand',
    'course.free.benefits.2': 'Meet professional instructors',
    'course.free.benefits.3': 'Ask questions about programs',
    
    'course.beginner.benefits.0': 'Extensive practice with live models',
    'course.beginner.benefits.1': 'Individual attention for each student',
    'course.beginner.benefits.2': 'All professional tools on-site',
    
    'course.advanced.benefits.0': 'Advanced cutting techniques',
    'course.advanced.benefits.1': 'Premium beard styling methods',
    'course.advanced.benefits.2': 'Modern fade variations',
    
    'course.specialist.benefits.0': 'Latest global barbering trends',
    'course.specialist.benefits.1': 'Professional portfolio development',
    'course.specialist.benefits.2': 'Expert mentorship throughout',

    'course.pricing.all.modules': 'All modules',
    'course.pricing.contact.details': 'Contact for details',
    'course.pricing.interest.free': '0% interest',

    // Instructor Details Translation Keys
    'instructor.not.found': 'Instructor not found',
    'instructor.apply.now': 'Apply Now',
    'instructor.experience': 'Experience',
    'instructor.specializations': 'Specializations',
    'instructor.about': 'About Instructor',
    'instructor.contact': 'Contact',

    // About Section CTA
    'about.cta': 'Start Your Journey',

    // About Us Page Translations
    'aboutus.hero.title': 'From Zero to',
    'aboutus.hero.mastery': 'Mastery',
    'aboutus.hero.description': 'We don\'t just teach barbering — we shape careers. Ambition meets precision inside our classrooms.',
    'aboutus.legal.title': 'Legal Information',
    'aboutus.legal.name': 'Legal Name:',
    'aboutus.legal.trading': 'Trading Name:',
    'aboutus.offers.title': 'What We Offer',
    'aboutus.offers.beginners.title': 'For Beginners',
    'aboutus.offers.beginners.text': 'Foundational courses to start your new career from zero.',
    'aboutus.offers.experienced.title': 'For Experienced Barbers',
    'aboutus.offers.experienced.text': 'Advanced modules to refine technique & elevate status.',
    'aboutus.whychoose.title': 'Why Choose',
    'aboutus.whychoose.reason1': '80% of classes are practical — you work with mannequins and real clients',
    'aboutus.whychoose.reason2': 'Intimate groups — we guarantee individual approach and real mentoring',
    'aboutus.whychoose.reason3': 'All tools and products included in price — without any hidden costs',
    'aboutus.whychoose.reason4': 'You receive certificates recognized in the job market',
    'aboutus.whychoose.reason5': 'We help obtain up to 100% course funding',
    'aboutus.team.title': 'Meet the',
    'aboutus.team.team': 'Team',
    'aboutus.results.title': 'Results That Speak',
    'aboutus.results.graduates': '100+ graduates working across Poland',
    'aboutus.results.trusted': 'Trusted by professionals for continued education',
    'aboutus.results.reviews': '5-star reviews on Google & Booksy',
    'aboutus.faq.title': 'FAQs',
    'aboutus.faq.q1': 'I\'ve never held scissors before – can I do this?',
    'aboutus.faq.a1': 'Absolutely. Many students start from scratch; our foundational program is built for beginners.',
    'aboutus.faq.q2': 'Is the course expensive?',
    'aboutus.faq.a2': 'Base price is 11,000 PLN, currently discounted to 9,000 PLN. Daily workshops from 1,200 PLN.',
    'aboutus.cta.enroll': 'Enroll Now',

    // Individual Instructor Details
    'instructor.1.about': 'Expert in classical barbering techniques with over 10 years of experience. Specializes in precision cuts and beard styling.',
    'instructor.1.experience': 'Experience: 12+ years',
    'instructor.2.about': 'Master of modern trends and creative styling. Leads workshops for advanced students.',
    'instructor.2.experience': 'Experience: 8+ years',
    'instructor.3.about': 'Specialist in traditional techniques and precision shaving. Mentor to new instructors.',
    'instructor.3.experience': 'Experience: 15+ years',
    'instructor.4.about': 'Expert in modern cutting techniques and coloring. Certified international instructor.',
    'instructor.4.experience': 'Experience: 10+ years',
    'instructor.5.about': 'Master of classical barbering and styling. Leads advanced courses.',
    'instructor.5.experience': 'Experience: 14+ years',

    // Course types for contact forms
    'course.type.complete': 'Complete Barber Course',
    'course.type.advanced': 'Advanced Barber Training',
    'course.type.weekend': 'Weekend Intensive Course',
    'course.type.master': 'Master Barber Certification',
    'course.type.short': 'Short course',

    'course.free.title': 'One-Day Free Barbering Course',
    'course.free.subtitle': 'Get a Real Taste of the Barbering World – For Free',
    'course.free.description': 'Curious about becoming a barber, but not sure where to start? Our One-Day Free Course is the perfect way to experience what it\'s really like to be part of a professional barbering academy.',
    'course.free.badge': 'Free Course',
    'course.beginner.title': 'Beginner Barber Course – From Zero to Barber',
    'course.beginner.subtitle': 'Start a new profession with full preparation and confidence',
    'course.beginner.description': 'Intensive 24-day program (Mon–Sat, 12–20) that takes absolute beginners to professional barbers through theory, mannequin practice, and daily work on live models.',
    'course.beginner.badge': 'Beginner',
    'course.advanced.title': 'Advanced Course for Barbers',
    'course.advanced.subtitle': 'Expand your skills & learn the latest techniques',
    'course.advanced.description': '3-day bootcamp (Mon–Sat, 12–20) for active barbers (min 2 yrs) focusing on modern cuts, advanced fades, and premium beard work.',
    'course.advanced.badge': 'Advanced',

    'course.advanced.skills.0': 'Advanced fade techniques',
    'course.advanced.skills.1': 'Modern styling methods',
    'course.advanced.skills.2': 'Premium beard services',
    'course.advanced.skills.3': 'Client consultation mastery',
    'course.advanced.audience.0': 'Experienced barbers (2+ years)',
    'course.advanced.audience.1': 'Salon professionals',
    'course.advanced.audience.2': 'Barbers seeking advancement',
    'course.advanced.includes.0': 'All tools provided',
    'course.advanced.includes.1': 'Gift set – scissors & comb',
    'course.advanced.includes.2': 'Certificate',
    'course.advanced.outcomes.0': 'Master modern styles',
    'course.advanced.outcomes.1': 'Blend flawless fades',
    'course.advanced.outcomes.2': 'Premium beard services',
    'course.advanced.howItWorks.0': 'Masterclasses',
    'course.advanced.howItWorks.0.desc': 'Live demos from award-winning barbers',
    'course.advanced.howItWorks.1': 'Portfolio Project',
    'course.advanced.howItWorks.1.desc': 'Photo shoot with models for Instagram',
    'course.advanced.howItWorks.2': '1:1 Mentorship',
    'course.advanced.howItWorks.2.desc': 'Personal feedback & growth plan',
    'course.specialist.title': 'Specialist Course – Trends & New Techniques',
    'course.specialist.subtitle': 'Refresh skills & master global trends',
    'course.specialist.description': '2-week programme (Mon–Sat, 12–19) for barbers/hairdressers wanting to adopt the latest global trends in cuts, fades and beard styling.',
    'course.specialist.badge': 'Specialist',

    'course.specialist.skills.0': 'Client retention',
    'course.specialist.skills.1': 'Budgeting & finance',
    'course.specialist.skills.2': 'Local marketing',
    'course.specialist.skills.3': 'Leadership & hiring',
    'course.specialist.audience.0': 'Entrepreneurs scaling businesses',
    'course.specialist.audience.1': 'Barbershop owners',
    'course.specialist.audience.2': 'Freelancers looking to upskill',
    'course.specialist.includes.0': 'Tools on-site',
    'course.specialist.includes.1': 'Professional kit gift',
    'course.specialist.includes.2': 'Certificate',
    'course.specialist.outcomes.0': 'Master trending styles',
    'course.specialist.outcomes.1': 'Improve razor work',
    'course.specialist.outcomes.2': 'Attract new clients',
    'course.specialist.howItWorks.0': 'Trend Workshops',
    'course.specialist.howItWorks.0.desc': 'Weekly sessions on latest global cuts',
    'course.specialist.howItWorks.1': 'Hands-on Labs',
    'course.specialist.howItWorks.1.desc': 'Immediate practice under supervision',
    'course.specialist.howItWorks.2': 'Client Demos',
    'course.specialist.howItWorks.2.desc': 'Style real customers & receive feedback',
    'instructor.about.richer': 'Expert in modern cutting techniques and classic barbering styles with years of professional experience.',
    'instructor.experience.richer': 'Professional barber specializing in precision cuts and contemporary styling.',
    'instructor.about.apo': 'Passionate educator and skilled barber dedicated to training the next generation of professionals.',
    'instructor.experience.apo': 'Experienced barber and instructor with expertise in advanced cutting techniques.',
    'instructor.about.bartosz': 'Creative stylist with a focus on modern trends and personalized client experiences.',
    'instructor.experience.bartosz': 'Skilled barber specializing in creative cuts and contemporary hair styling.',
    'instructor.about.ali': 'Dedicated professional with expertise in both traditional and modern barbering techniques.',
    'instructor.experience.ali': 'Experienced barber with a passion for delivering exceptional grooming services.',
    'instructor.about.tomasz': 'Experienced professional combining hands-on barbering skills with teaching excellence.',
    'instructor.experience.tomasz': 'Professional barber and educator committed to sharing knowledge and skills.',
    'testimonial.1.quote': 'The best place in Warsaw to quickly and above all well learn a profession from scratch. I have just finished the course, the guys helped with funding for the course and found me a job immediately after finishing. I highly recommend and thank you!',
    'testimonial.1.name': 'Angelika Ziółkowska',
    'testimonial.1.title': 'Graduate • 5-star Google Review',
    'testimonial.2.quote': 'I had the pleasure of taking part in a 3-day training course under the supervision of Tomek and Ali. I am delighted with the effects of the training. Great atmosphere and great educators. The boys gave us a huge dose of knowledge and tips on creating a portfolio. I highly recommend it!',
    'testimonial.2.name': 'Agata Antoniewicz',
    'testimonial.2.title': 'Graduate • 5-star Google Review',
    'testimonial.3.quote': 'Despite the time that has passed since the end of the course, I decided to leave a review. I participated in the month-long \'Barber from scratch\' course at K&K Academy, and I am very impressed with the level of professionalism and quality of the training. Educators Tomek, Bartek and Ali demonstrated not only theoretical knowledge, but also impressive practical skills. Now, 6 months after completing the course, I successfully run my own salon and I am glad that I had the opportunity to participate in the course from scratch with the guys.',
    'testimonial.3.name': 'Sharp Cut Barber',
    'testimonial.3.title': 'Salon Owner • 5-star Google Review',
    'common.graduate': 'Graduate',
    'common.review': 'Google Review',
    'common.star': 'star',
    'common.show.more': 'Show more',
    'common.show.less': 'Show less',
    'common.all': 'all',
    'common.dates': 'dates',
    'common.upcoming': 'Upcoming',
    'course.schedule': 'Schedule',
    'course.everyday': 'Every Day',
    'course.schedule.flexible': 'Flexible Hours',
    'months.january': 'January',
    'months.february': 'February',
    'months.march': 'March',
    'months.april': 'April',
    'months.may': 'May',
    'months.june': 'June',
    'months.july': 'July',
    'months.august': 'August',
    'months.september': 'September',
    'months.october': 'October',
    'months.november': 'November',
    'months.december': 'December',

    // Blog Translation Keys
    'blog.loading': 'Loading article...',
    'blog.not.found': 'Article Not Found',
    'blog.not.found.description': 'The article you\'re looking for doesn\'t exist.',
    'blog.back.to.blog': '← Back to Blog',
    'blog.back.to.home': 'Back to Home',
    'blog.min.read': 'min read',
    'blog.ready.to.start': 'Ready to Start Your Barbering Journey?',
    'blog.ready.description': 'Join K&K Barber Academy and learn from industry professionals in our state-of-the-art facilities.',
    'blog.start.journey': 'Start Your Journey',
    'blog.related.articles': 'Related Articles',
    'blog.quick.links': 'Quick Links',
    'blog.view.courses': '→ View Courses',
    'blog.meet.instructors': '→ Meet Instructors',
    'blog.student.gallery': '→ Student Gallery',
    'blog.contact.us': '→ Contact Us',

    // Blog Post Titles and Content (English)
    'blog.post.start-barber-career.title': 'How to Start a Career in Barbering',
    'blog.post.start-barber-career.tag': 'BEGINNER',
    'blog.post.top-5-fade-techniques-2025.title': 'Top 5 Fade Techniques for 2025',
    'blog.post.top-5-fade-techniques-2025.tag': 'TRENDS',
    'blog.post.barber-toolkit-essentials.title': 'Barber Toolkit: Essentials vs. Nice-to-Have',
    'blog.post.barber-toolkit-essentials.tag': 'TOOLS',

    // Course.free detailed content translations
    'course.free.skills.0': 'Academy exploration',
    'course.free.skills.1': 'Live class observation',
    'course.free.skills.2': 'Meet expert barbers',
    'course.free.skills.3': 'Industry Q&A session',
    
    'course.free.audience.0': 'Complete beginners',
    'course.free.audience.1': 'Anyone interested in barbering',
    'course.free.audience.2': 'Career explorers',
    
    'course.free.includes.0': 'Academy tour',
    'course.free.includes.1': 'Live demonstrations',
    'course.free.includes.2': 'Expert advice',
    'course.free.includes.3': 'No commitment required',
    
    'course.free.outcomes.0': 'See if barbering suits you',
    'course.free.outcomes.1': 'See how our academy works',
    'course.free.outcomes.2': 'Understand our teaching style',
    'course.free.outcomes.3': 'Get inspired by real professionals',

    'course.free.howItWorks.0': 'Academy tour',
    'course.free.howItWorks.1': 'Live observation',
    'course.free.howItWorks.2': 'Meet the team',
    'course.free.howItWorks.0.desc': 'Explore our modern training facilities',
    'course.free.howItWorks.1.desc': 'Watch real classes in action',
    'course.free.howItWorks.2.desc': 'Chat with our expert instructors',


  },

  uk: {
    // Navigation
    'nav.home': 'Головна',
    'nav.about': 'Про нас',
    'nav.courses': 'Курси',
    'nav.gallery': 'Галерея',
    'nav.instructors': 'Інструктори',
    'nav.students': 'Студенти',
    'nav.success': 'Історії успіху',
    'nav.blog': 'Блог',
    'nav.contact': 'Контакти',
    'nav.enroll': 'Записатися',

    // Hero Section
    'hero.title': 'Академія барберів K&K',
    'hero.subtitle': 'Опануйте мистецтво барберінгу з провідними інструкторами Варшави',
    'hero.description': 'Ми не просто навчаємо перукарську справу — ми допомагаємо будувати справжні кар\'єри. Тут амбіції зустрічаються з точністю, а пристрасть перетворюється на професію.',
    'hero.cta.primary': 'Записатися на курс',
    'hero.cta.secondary': 'Переглянути галерею',
    'hero.stats.graduates': 'Випускників',
    'hero.stats.experience': 'Років досвіду',
    'hero.stats.placement': 'Працевлаштування',
    'hero.stats.instructors': 'Майстер-інструкторів',

    // Features
    'features.expert.title': 'Експерт-інструктори',
    'features.expert.description': 'Навчайтесь у найкращих майстрів-барберів Варшави',
    'features.hands.title': 'Практичне навчання',
    'features.hands.description': 'Отримайте реальний досвід завдяки нашому практичному підходу',
    'features.career.title': 'Підтримка кар\'єри',
    'features.career.description': 'Допомога у працевлаштуванні та розвитку кар\'єри після випуску',
    'features.modern.title': 'Сучасні техніки',
    'features.modern.description': 'Найновіші тренди та техніки в індустрії барберінгу',

    // About Section
    'about.title': 'Про нас',
    'about.subtitle': 'Чому ми?',
    'about.description': 'Як єдина академія в Польщі, ми можемо пишатися двома сертифікатами якості. Нашу команду складають виключно кваліфіковані викладачі, які не лише склали підмайстерські іспити, але й мають педагогічну підготовку. Ми орієнтуємося на найвищі стандарти навчання та реальну підготовку до роботи в професії барбера.',
    'features.practical.title': '80% занять — це практика — ви працюєте з манекенами та справжніми клієнтами',
    'features.groups.title': 'Камерні групи — гарантуємо індивідуальний підхід та реальне наставництво',
    'features.tools.title': 'Всі інструменти та продукти в ціні — без жодних прихованих витрат',
    'features.certificates.title': 'Отримуєте сертифікати, визнані на ринку праці',
    'features.funding.title': 'Допомагаємо отримати навіть 100% фінансування курсу',

    // Courses
    'courses.title': 'Наші курси',
    'courses.subtitle': 'Оберіть ідеальний курс для вашого рівня навичок та кар\'єрних цілей',
    'courses.beginner': 'Курс для початківців',
    'courses.advanced': 'Курс підвищеної складності',
    'courses.master': 'Майстер-курс',
    'courses.specialty': 'Спеціальні курси',
    'courses.view.all': 'Переглянути всі курси',
    'courses.enroll': 'Записатися',
    'courses.enroll.now': 'Записатися зараз',
    'courses.learn.more': 'Дізнатися більше',
    'courses.duration': 'Тривалість',
    'courses.level': 'Рівень',
    'courses.price': 'Ціна',
    'courses.upcoming': 'Найближчі дати',
    'courses.cta.title': 'Готові розпочати свою кар\'єру барбера сьогодні?',
    'courses.cta.description': 'Приєднуйтесь до сотень успішних випускників, які змінили своє життя завдяки нашим комплексним навчальним програмам.',
    'courses.cta.button': 'Приєднатися до безкоштовного денного курсу',

    // Instructors
    'instructors.title': 'Наші інструктори',
    'instructors.subtitle': 'Майстри-барбери',
    'instructors.description': 'Познайомтесь з нашими досвідченими інструкторами, які будуть супроводжувати вас протягом всієї навчальної подорожі.',
    'senior.barber.instructor': 'Старший інструктор барбера',

    // Testimonials
    'testimonials.title': 'Історії успіху студентів',
    'testimonials.subtitle': 'Історії успіху',
    'testimonials.description': 'Послухайте наших випускників, які перетворили свою пристрасть на прибуткову кар\'єру та успішний бізнес.',

    // Gallery
    'gallery.title': 'Наша',
    'gallery.title.highlight': 'Галерея',
    'gallery.subtitle': 'Подивіться на наші роботи',
    'gallery.description': 'Ознайомтесь з чудовими роботами наших студентів та інструкторів.',
    'testimonials.see.student.work': 'Переглянути всі роботи студентів',
    'testimonials.see.success.stories': 'Всі історії успіху',

    // Contact
    'contact.title': 'Зв\'яжіться з',
    'contact.title.highlight': 'нами',
    'contact.title.today': 'сьогодні',
    'contact.subtitle': 'Є питання? Ми тут, щоб допомогти',
    'contact.name': 'Повне ім\'я',
    'contact.email': 'Електронна пошта',
    'contact.phone': 'Телефон',
    'contact.message': 'Повідомлення',
    'contact.program': 'Оберіть програму',
    'contact.submit': 'Надіслати повідомлення',
    'contact.info.title': 'Контактна інформація',
    'contact.info.address': 'Адреса',
    'contact.info.phone': 'Телефон',
    'contact.info.email': 'Електронна пошта',
    'contact.info.hours': 'Години роботи',
    'contact.hours.weekdays': 'Пн-Пт: 12:00 - 21:00',
    'contact.hours.saturday': 'Сб: 12:00 - 17:00',
    'contact.hours.sunday': 'Нд: Зачинено',
    'contact.visit.campus': 'Відвідайте Наш Кампус',
    'contact.call.us': 'Телефонуйте Нам',
    'contact.email.us': 'Напишіть Нам',
    'contact.hours': 'Години Роботи',
    'contact.form.title': 'Отримати більше інформації',
    'contact.form.first.name': 'Ім\'я',
    'contact.form.last.name': 'Прізвище',
    'contact.form.email': 'Електронна пошта',
    'contact.form.phone': 'Телефон',
    'contact.form.program': 'Зацікавленість програмою',
    'contact.form.message': 'Повідомлення',
    'contact.form.submit': 'Надіслати запит',
    'contact.form.required': 'Будь ласка, заповніть обов\'язкові поля',
    'contact.form.required.desc': 'Ім\'я, прізвище та електронна пошта є обов\'язковими.',
    'contact.form.thank.you': 'Дякуємо за зацікавленість!',
    'contact.form.thank.you.desc': 'Ми зв\'яжемося з вами найближчим часом з додатковою інформацією.',
    'contact.form.program.placeholder': 'Оберіть програму, яка вас цікавить...',
    'contact.form.message.placeholder': 'Розкажіть нам про свої цілі та очікування...',
    'contact.page.title': 'Зв\'яжіться з',
    'contact.page.highlight': 'Академією K&K',
    'contact.page.subtitle': 'Маєте питання щодо наших програм, цін або вступу? Зв\'яжіться з нами, і наша команда з прийому з радістю допоможе.',
    'contact.form.error': 'Помилка відправки повідомлення',
    'contact.form.error.desc': 'Будь ласка, спробуйте пізніше.',
    'contact.form.success': 'Повідомлення надіслано!',
    'contact.form.success.desc': 'Ми зв\'яжемося з вами найближчим часом.',

    // Footer
    'footer.description': 'Професійна академія барберів у Варшаві, що пропонує комплексні курси та навчання.',
    'footer.quick.links': 'Швидкі посилання',
    'footer.contact.info': 'Контактна інформація',
    'footer.follow': 'Слідкуйте за нами',
    'footer.rights': 'Всі права захищені.',



    // Blog
    'blog.title': 'Наш блог',
    'blog.subtitle': 'Останні новини та поради',
    'blog.read.more': 'Читати далі',
    'blog.view.all': 'Переглянути всі пости',

    // CTA
    'cta.title': 'Розпочніть свою кар\'єру сьогодні',
    'cta.description': 'Приєднуйтесь до тисяч успішних випускників, які перетворили свою пристрасть на прибуткову кар\'єру.',
    'cta.button': 'Записатися зараз',
    
    // CTA Enroll Section
    'cta.enroll.title': 'Готові розпочати свій шлях барбера?',
    'cta.enroll.description': 'Приєднуйтесь до сотень успішних випускників, які змінили своє життя завдяки нашим комплексним навчальним програмам.',
    'cta.enroll.button': 'Розпочати кар\'єру барбера',

    // Common
    'common.loading': 'Завантаження...',
    'common.error': 'Сталася помилка',
    'common.success': 'Успішно!',
    'common.close': 'Закрити',
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.edit': 'Редагувати',
    'common.delete': 'Видалити',
    'common.view': 'Переглянути',
    'common.back': 'Назад',
    'common.next': 'Далі',
    'common.previous': 'Попередній',

    // Additional translations for missing components
    'our.vibe': 'Наша атмосфера!',
    'programs.fundamentals': 'Основи барберства',
    'programs.master': 'Майстерські техніки',
    'programs.business': 'Бізнес-майстерність',
    'programs.private': 'Приватні уроки',
    'quicklinks.about': 'Про нас',
    'quicklinks.admissions': 'Вступ',
    'quicklinks.financial': 'Фінансова допомога',
    'quicklinks.portal': 'Портал студента',
    'copyright': '© 2024 K&K Академія Барберів. Усі права захищені.',
    'policies.privacy': 'Політика конфіденційності',
    'policies.terms': 'Умови надання послуг',
    'policies.handbook': 'Довідник студента',
    'working.hours': 'Робочі години:',
    'blog.latest': 'Останні новини',
    'blog.tips': 'Поради, тенденції та ресурси, які допоможуть вам залишатися на передовій у світі барберства.',
    'upcoming.dates': 'Найближчі дати',
    'show.all': 'Показати всі',
    'show.less': 'Показати менше',
    'dates': 'дати',
    'free.course': 'Безкоштовний курс',
    'not.sure': 'Ще не впевнений',
    'send.inquiry': 'Надіслати запит',
    'your.name': 'Ваше ім\'я',
    'your.email': 'Ваш email',
    'select.program': 'Оберіть програму...',
    'program.interest': 'Програма, що цікавить',
    
    // About Section Translation Keys  
    'about.features.certified': 'Державні сертифіковані програми з визнанням індустрії',
    'about.features.handson': 'Практичне навчання з професійним обладнанням',
    'about.features.placement': 'Допомога у працевлаштуванні та постійна підтримка',
    'about.learn.more': 'Дізнатися більше про нас',
    'about.certified.excellence': 'Сертифікована досконалість',
    'about.state.licensed': 'Державна ліцензована академія',
    'about.certificate.title': 'Офіційний сертифікат',
    'about.certificate.subtitle': 'Надійна сертифікація системи управління якістю',
    'about.certificate.description': 'Сертифікат підтверджує відповідність стандартам якості ISO 9001:2015-10 для спеціалізованого навчання в індустрії барберінгу.',
    'common.free': 'БЕЗКОШТОВНО',
    

    'course.duration.4hours': 'Щодня, 4 години',
    'course.duration.1month': 'Щодня, 1 місяць',
    'course.duration.3days': 'Щодня, 3 дні',
    'course.duration.2weeks': 'Щодня, 2 тижні',
    'course.duration.daily': 'Щодня',
    'course.certification.experience': 'Сертифікат досвіду',
    'course.certification.professional': 'Професійний сертифікат',
    'course.certification.advanced': 'Сертифікат підвищеної складності',
    'course.certification.specialist': 'Сертифікат спеціаліста',





    // Gallery Translation Keys
    'gallery.view.full': 'Переглянути повну галерею',





    // Page Translation Keys
    'course.not.found': 'Курс не знайдено.',
    'page.gallery.title': 'Повна',
    'page.gallery.title.highlight': 'Галерея',
    'page.gallery.loading': 'Досліджуйте нашу повну колекцію робіт',
    'page.gallery.explore': 'Досліджуйте нашу повну колекцію професійних робіт та навчальних матеріалів',
    'page.students.title': 'Роботи',
    'page.students.title.highlight': 'Студентів',
    'page.students.explore': 'Подивіться на чудові перетворення та навички наших студентів',
    'page.success.title': 'Історії',
    'page.success.title.highlight': 'Успіху',
    'page.success.explore': 'Дізнайтеся про надихаючі історії наших випускників',
    'page.back.home': 'Повернутися на головну',
    'page.apply.now': 'Подати заявку зараз',
    'page.showcased.works': 'представлених робіт',
    'page.blog.title': 'Думки',
    'page.blog.title.highlight': 'Академії',
    'page.blog.subtitle': 'Новини, поради та тренди зі світу сучасного барберінгу.',

    // Gallery UI Elements
    'gallery.professional.works': 'професійних робіт',
    'gallery.masonry.view': 'Плиткове відображення',
    'gallery.grid.view': 'Відображення сітки',
    'gallery.flow': 'Плитки',
    'gallery.grid': 'Сітка',
    'gallery.load.all': 'Завантажити все',
    'gallery.more.works': 'більше робіт',
    'gallery.size.compact': 'Компактний',
    'gallery.size.standard': 'Стандартний',
    'gallery.size.spacious': 'Просторий',

    // Blog Post Translation Keys
    'blog.post.career.title': 'Як розпочати кар\'єру в барберінгу',
    'blog.post.career.excerpt': 'Думаєте стати барбером? Ось як можуть виглядати ваші перші 30 днів...',
    'blog.post.fade.title': 'Топ 5 технік fade на 2025 рік',
    'blog.post.fade.excerpt': 'Залишайтесь попереду з цими обов\'язковими варіаціями fade, про які запитає кожен клієнт.',
    'blog.post.toolkit.title': 'Набір барбера: Необхідне проти Бажаного',
    'blog.post.toolkit.excerpt': 'Наш посібник зі створення професійного набору від машинок до гребінців без переплати.',
    'blog.tag.beginner': 'Початківець',
    'blog.tag.trends': 'Тренди',
    'blog.tag.tools': 'Інструменти',
    'blog.filter.all': 'Всі',

    // Course types for contact forms
    'course.type.complete': 'Повний курс барбера',
    'course.type.advanced': 'Просунуте навчання барбера',
    'course.type.weekend': 'Інтенсивний вихідний курс',
    'course.type.master': 'Сертифікація майстра барбера',
    'course.type.short': 'Короткий курс',

    // Contact Page Translation Keys (these are duplicates, removing to prevent conflicts)


    // Course Details Translation Keys
    // 'course.not.found': 'Курс не знайдено', (already defined above)
    'course.overview': 'Огляд курсу',
    'course.curriculum': 'Навчальна програма',
    'course.instructors': 'Інструктори',
    'course.gallery': 'Галерея',
    'course.book.now': 'Забронювати зараз',
    'course.duration': 'Тривалість',
    'course.students': 'Студенти',
    'course.certification': 'Сертифікація',
    'course.what.learn': 'Що ви вивчите',
    'course.upcoming.dates': 'Найближчі дати',
    'course.enroll.today': 'Записатися сьогодні',
    'course.meet.instructors': 'Познайомтесь з вашими інструкторами',
    'course.select.date': 'Оберіть бажану дату початку',
    'course.audience': 'Для кого цей курс',
    'course.how.works': 'Як працює курс',
    'course.whats.included': 'Що включено',
    'course.outcomes': 'Наприкінці ви зможете...',
    'course.gallery.title': 'Що відбувається на курсі',
    'course.gallery.subtitle': 'Погляньте на моменти з нашого практичного навчання.',
    'course.certificate.title': 'Сертифікат та акредитація',
    'course.certificate.description': 'Після завершення ви отримаєте сертифікат, виданий K&K Academy, визнаною навчальною установою з барберінгу.',
    'course.certificate.accredited': 'Акредитований сертифікат',
    'course.certificate.industry': 'Визнаний в індустрії',
    'course.certificate.portfolio': 'Портфоліо робіт',
    'about.certificate.accredited': 'Сертифікати',
    'about.certificate.iso.title': 'Сертифікат ISO 9001:2015-10',
    'about.certificate.iso.description': 'Офіційна сертифікація системи управління якістю для професійного навчання барберінгу.',
    'about.certificate.szoe.title': 'Сертифікат SZOE',
    'about.certificate.szoe.description': 'Державна сертифікація для освітніх установ Польщі.',
    'course.pricing.title': 'Ціни та плани',
    'course.pricing.description': 'Оберіть план, який найкраще відповідає вашим потребам та бюджету.',
    'course.pricing.full.payment': 'Повна оплата',
    'course.pricing.installments': 'Розстрочка платежу',
    'course.pricing.contact': 'Зверніться за деталями',
    'course.faq.title': 'Часті запитання',
    'course.faq.experience.q': 'Чи потрібен мені попередній досвід?',
    'course.faq.experience.a': 'Ні, наші курси для початківців розроблені для людей без досвіду в барберінгу.',
    'course.faq.tools.q': 'Чи потрібно купувати власні інструменти?',
    'course.faq.tools.a': 'Ні, всі інструменти та матеріали надаються протягом курсу. Ви також отримаєте список рекомендованих інструментів для придбання.',
    'course.faq.job.q': 'Чи допомагаєте ви із працевлаштуванням?',
    'course.faq.job.a': 'Так, ми надаємо підтримку у працевлаштуванні та маємо партнерські відносини з місцевими барбершопами.',
    'course.cta.final.title': 'Розпочніть свою подорож сьогодні',
    'course.cta.final.description': 'Приєднуйтесь до сотень задоволених випускників, які побудували успішну кар\'єру в барберінгу.',
    'course.cta.final.button': 'Записатися зараз',

    // Beginner Course (ID: 1) Specific Translations
    'course.beginner.skills.0': 'Класичні та сучасні стрижки',
    'course.beginner.skills.1': 'Машинні фейди (низькі/середні/високі)',
    'course.beginner.skills.2': 'Робота з бритвою та деталізація',
    'course.beginner.skills.3': 'Формування та догляд за бородою',
    
    'course.beginner.audience.0': 'Люди без досвіду',
    'course.beginner.audience.1': 'Ті, хто змінює кар\'єру',
    'course.beginner.audience.2': 'Випускники школи',
    
    'course.beginner.howItWorks.0': 'Теорія',
    'course.beginner.howItWorks.1': 'Практика на манекенах',
    'course.beginner.howItWorks.2': 'Справжні клієнти',
    'course.beginner.howItWorks.0.desc': 'Інтерактивні уроки та демонстрації',
    'course.beginner.howItWorks.1.desc': 'Впевнено розвивайте м\'язову пам\'ять',
    'course.beginner.howItWorks.2.desc': 'Контрольовані стрижки на живих моделях',
    
    'course.beginner.includes.0': 'Подарунок професійних ножиць та гребінця',
    'course.beginner.includes.1': 'Всі інструменти надаються',
    'course.beginner.includes.2': 'Сертифікат про завершення',
    
    'course.beginner.outcomes.0': 'Виконувати сучасні стрижки та фейди',
    'course.beginner.outcomes.1': 'Впевнено стилізувати бороду',
    'course.beginner.outcomes.2': 'Розпочати кар\'єру барбера',

    // Advanced Course Ukrainian translations
    'course.advanced.title': 'Просунутий курс для барберів',
    'course.advanced.subtitle': 'Розширте свої навички та вивчіть найновіші техніки',
    'course.advanced.description': '3-денний буткемп (пн-сб, 12-20) для активних барберів (мін. 2 роки) з фокусом на сучасні стрижки, просунуті фейди та преміум роботу з бородою.',
    'course.advanced.badge': 'Просунутий',

    'course.advanced.skills.0': 'Просунуті техніки фейду',
    'course.advanced.skills.1': 'Сучасні методи стилізації',
    'course.advanced.skills.2': 'Преміум послуги з бороди',
    'course.advanced.skills.3': 'Майстерність консультацій з клієнтами',
    'course.advanced.audience.0': 'Досвідчені барбери (2+ роки)',
    'course.advanced.audience.1': 'Професіонали салонів',
    'course.advanced.audience.2': 'Барбери, що прагнуть розвитку',
    'course.advanced.includes.0': 'Всі інструменти надаються',
    'course.advanced.includes.1': 'Подарунковий набір – ножиці та гребінець',
    'course.advanced.includes.2': 'Сертифікат',
    'course.advanced.outcomes.0': 'Опануйте сучасні стилі',
    'course.advanced.outcomes.1': 'Виконуйте бездоганні фейди',
    'course.advanced.outcomes.2': 'Преміум послуги з бороди',
    'course.advanced.howItWorks.0': 'Майстер-класи',
    'course.advanced.howItWorks.0.desc': 'Живі демонстрації від нагороджених барберів',
    'course.advanced.howItWorks.1': 'Проект портфоліо',
    'course.advanced.howItWorks.1.desc': 'Фотосесія з моделями для Instagram',
    'course.advanced.howItWorks.2': 'Наставництво 1:1',
    'course.advanced.howItWorks.2.desc': 'Особистий зворотний зв\'язок та план розвитку',

    // Specialist Course Ukrainian translations
    'course.specialist.title': 'Спеціалістський курс – Тренди та нові техніки',
    'course.specialist.subtitle': 'Оновіть навички та опануйте глобальні тренди',
    'course.specialist.description': '2-тижнева програма (пн-сб, 12-19) для барберів/перукарів, які хочуть прийняти найновіші глобальні тренди в стрижках, фейдах та стилізації бороди.',
    'course.specialist.badge': 'Спеціаліст',

    'course.specialist.skills.0': 'Утримання клієнтів',
    'course.specialist.skills.1': 'Бюджетування та фінанси',
    'course.specialist.skills.2': 'Локальний маркетинг',
    'course.specialist.skills.3': 'Лідерство та найм',
    'course.specialist.audience.0': 'Підприємці, що розширюють бізнес',
    'course.specialist.audience.1': 'Власники барбершопів',
    'course.specialist.audience.2': 'Фрілансери, що хочуть підвищити кваліфікацію',
    'course.specialist.includes.0': 'Інструменти на місці',
    'course.specialist.includes.1': 'Подарунок професійного набору',
    'course.specialist.includes.2': 'Сертифікат',
    'course.specialist.outcomes.0': 'Опануйте трендові стилі',
    'course.specialist.outcomes.1': 'Покращте роботу з бритвою',
    'course.specialist.outcomes.2': 'Приверніть нових клієнтів',
    'course.specialist.howItWorks.0': 'Воркшопи трендів',
    'course.specialist.howItWorks.0.desc': 'Щотижневі сесії про найновіші глобальні стрижки',
    'course.specialist.howItWorks.1': 'Практичні лабораторії',
    'course.specialist.howItWorks.1.desc': 'Негайна практика під наглядом',
    'course.specialist.howItWorks.2': 'Демонстрації клієнтів',
    'course.specialist.howItWorks.2.desc': 'Стилізуйте справжніх клієнтів та отримуйте відгуки',

    // Course.free specific translations

    
    'course.free.skills.0': 'Дослідження академії',
    'course.free.skills.1': 'Спостереження за живими заняттями',
    'course.free.skills.2': 'Знайомство з експертними барберами',
    'course.free.skills.3': 'Сесія запитань та відповідей індустрії',
    
    'course.free.audience.0': 'Повні початківці',
    'course.free.audience.1': 'Всі, хто цікавиться барберінгом',
    'course.free.audience.2': 'Дослідники кар\'єри',
    
    'course.free.includes.0': 'Екскурсія академією',
    'course.free.includes.1': 'Живі демонстрації',
    'course.free.includes.2': 'Експертні поради',
    'course.free.includes.3': 'Жодних зобов\'язань не потрібно',
    
    'course.free.outcomes.0': 'Дізнайтеся, чи підходить вам барберінг',
    'course.free.outcomes.1': 'Подивіться, як працює наша академія',
    'course.free.outcomes.2': 'Зрозумійте наш стиль викладання',
    'course.free.outcomes.3': 'Надихніться справжніми професіоналами',

    // Course.free howItWorks translations
    'course.free.howItWorks.0': 'Екскурсія академією',
    'course.free.howItWorks.1': 'Живе спостереження',
    'course.free.howItWorks.2': 'Знайомство з командою',
    'course.free.howItWorks.0.desc': 'Досліджуйте наші сучасні навчальні простори',
    'course.free.howItWorks.1.desc': 'Дивіться справжні заняття в дії',
    'course.free.howItWorks.2.desc': 'Спілкуйтеся з нашими експертними інструкторами',

    // Course pricing specific translations (Ukrainian)
    'course.free.pricing.title': 'Безкоштовний досвід',
    'course.free.pricing.session': 'Повна 4-годинна сесія',
    'course.free.pricing.no.costs': 'Без прихованих витрат',
    'course.free.pricing.price': 'БЕЗКОШТОВНО',
    'course.free.pricing.cta': 'Звертайтесь за деталями',
    
    'course.beginner.pricing.title': 'Повний курс для початківців',
    'course.beginner.pricing.duration': '24 дні інтенсивного навчання',
    'course.beginner.pricing.certification': 'Сертифікат завершення',
    'course.beginner.pricing.tools': 'Всі інструменти включені',
    'course.beginner.pricing.price': '9,000 PLN',
    'course.beginner.pricing.full.price': '(Звичайна ціна: 11,000 PLN)',
    'course.beginner.pricing.installments': 'Розстрочка доступна',
    'course.beginner.pricing.cta': 'Записатися зараз',
    
    'course.advanced.pricing.title': 'Просунутий курс',
    'course.advanced.pricing.duration': '3-денний інтенсивний буткемп',
    'course.advanced.pricing.portfolio': 'Фотосесія портфоліо',
    'course.advanced.pricing.mentoring': 'Менторинг 1:1',
    'course.advanced.pricing.price': '1,800 PLN',
    'course.advanced.pricing.cta': 'Приєднатися до курсу',
    
    'course.specialist.pricing.title': 'Спеціалістський курс',
    'course.specialist.pricing.duration': '2-тижнева програма',
    'course.specialist.pricing.trends': 'Найновіші глобальні тренди',
    'course.specialist.pricing.business': 'Бізнес-матеріали',
    'course.specialist.pricing.price': '2,400 PLN',
    'course.specialist.pricing.cta': 'Розпочати спеціалізацію',

    // Course benefits specific translations (Ukrainian)
    'course.free.benefits.0': 'Безкоштовний сеанс ознайомлення з академією',
    'course.free.benefits.1': 'Побачте наші об\'єкти з перших рук',
    'course.free.benefits.2': 'Зустрічайтесь з професійними інструкторами',
    'course.free.benefits.3': 'Поставте питання про програми',
    
    'course.beginner.benefits.0': 'Широка практика на живих моделях',
    'course.beginner.benefits.1': 'Індивідуальна увага до кожного студента',
    'course.beginner.benefits.2': 'Всі професійні інструменти на місці',
    
    'course.advanced.benefits.0': 'Передові техніки стрижки',
    'course.advanced.benefits.1': 'Преміум методи стилізації бороди',
    'course.advanced.benefits.2': 'Сучасні варіанти фейдів',
    
    'course.specialist.benefits.0': 'Найновіші глобальні тренди барберінгу',
    'course.specialist.benefits.1': 'Розвиток професійного портфоліо',
    'course.specialist.benefits.2': 'Експертний менторинг протягом курсу',

    // Instructor Details Translation Keys
    'instructor.not.found': 'Інструктора не знайдено',
    'instructor.apply.now': 'Подати заявку зараз',
    'instructor.experience': 'Досвід',
    'instructor.specializations': 'Спеціалізації',
    'instructor.about': 'Про інструктора',
    'instructor.contact': 'Контакти',


    // About Section CTA
    'about.cta': 'Розпочати подорож',

    // About Us Page Translations
    'aboutus.hero.title': 'З нуля',
    'aboutus.hero.mastery': 'до майстерності',
    'aboutus.hero.description': 'Ми не просто навчаємо барберінгу — ми формуємо кар\'єри. Амбіції поєднуються з точністю в наших класах.',
    'aboutus.legal.title': 'Юридична інформація',
    'aboutus.legal.name': 'Юридична назва:',
    'aboutus.legal.trading': 'Торгова назва:',
    'aboutus.offers.title': 'Що ми пропонуємо',
    'aboutus.offers.beginners.title': 'Для початківців',
    'aboutus.offers.beginners.text': 'Базові курси для початку вашої нової кар\'єри з нуля.',
    'aboutus.offers.experienced.title': 'Для досвідчених барберів',
    'aboutus.offers.experienced.text': 'Просунуті модулі для вдосконалення техніки та підвищення статусу.',
    'aboutus.whychoose.title': 'Чому обрати нас',
    'aboutus.whychoose.reason1': '80% занять — це практика — ви працюєте з манекенами та справжніми клієнтами',
    'aboutus.whychoose.reason2': 'Камерні групи — гарантуємо індивідуальний підхід та реальне наставництво',
    'aboutus.whychoose.reason3': 'Всі інструменти та продукти в ціні — без жодних прихованих витрат',
    'aboutus.whychoose.reason4': 'Отримуєте сертифікати, визнані на ринку праці',
    'aboutus.whychoose.reason5': 'Допомагаємо отримати навіть 100% фінансування курсу',
    'aboutus.team.title': 'Познайомтесь',
    'aboutus.team.team': 'з командою',
    'aboutus.results.title': 'Результати говорять самі за себе',
    'aboutus.results.graduates': '100+ випускників працюють по всій Польщі',
    'aboutus.results.trusted': 'Довіра професіоналів для безперервного навчання',
    'aboutus.results.reviews': '5-зіркові оцінки в Google та Booksy',
    'aboutus.faq.title': 'Часті запитання',
    'aboutus.faq.q1': 'Я ніколи не тримав ножиці в руках — чи зможу я?',
    'aboutus.faq.a1': 'Звичайно. Багато студентів починають з нуля; наша базова програма розроблена для новачків.',
    'aboutus.faq.q2': 'Чи дорогий курс?',
    'aboutus.faq.a2': 'Базова ціна 11 000 злотих, зараз зі знижкою 9 000 злотих. Денні семінари починаються від 1 200 злотих.',
    'aboutus.cta.enroll': 'Записатися зараз',

    // Individual Instructor Details
    'instructor.1.about': 'Експерт з класичних технік барберінгу, 10+ років досвіду. Спеціалізується на точних стрижках та формуванні бороди.',
    'instructor.1.experience': 'Досвід: 12+ років',
    'instructor.2.about': 'Майстер сучасних трендів та креативних стилів. Проводить семінари для студентів просунутого рівня.',
    'instructor.2.experience': 'Досвід: 8+ років',
    'instructor.3.about': 'Експерт з традиційних технік та точного гоління. Наставник для нових інструкторів.',
    'instructor.3.experience': 'Досвід: 15+ років',
    'instructor.4.about': 'Експерт з сучасних технік стрижки та фарбування. Сертифікований міжнародний інструктор.',
    'instructor.4.experience': 'Досвід: 10+ років',
    'instructor.5.about': 'Майстер класичного барберінгу та стилізації. Проводить курси просунутого рівня.',
    'instructor.5.experience': 'Досвід: 14+ років',

    'course.free.title': 'Одноденний безкоштовний курс барберінгу',
    'course.free.subtitle': 'Відчуйте справжній смак світу барберінгу – безкоштовно',
    'course.free.description': 'Цікавитесь барберінгом, але не знаєте, з чого почати? Наш одноденний безкоштовний курс – це ідеальний спосіб відчути, що насправді означає бути частиною професійної академії барберінгу.',
    'course.free.badge': 'Безкоштовний курс',
    'course.beginner.title': 'Курс для початківців – З нуля до барбера',
    'course.beginner.subtitle': 'Розпочніть нову професію з повною підготовкою та впевненістю',
    'course.beginner.description': 'Інтенсивна 24-денна програма, що перетворює людей з нульовим досвідом на професійних барберів через теорію, практику на манекенах та щоденну роботу з живими моделями (Пн-П\'ят, 12-20).',
    'course.beginner.badge': 'Початківець',

    'instructor.about.richer': 'Експерт з сучасних технік стрижки та класичних стилів перукарства з багаторічним професійним досвідом.',
    'instructor.experience.richer': 'Професійний перукар, що спеціалізується на точних стрижках та сучасному стилінгу.',
    'instructor.about.apo': 'Пристрасний викладач та талановитий перукар, присвячений вихованню нового покоління професіоналів.',
    'instructor.experience.apo': 'Досвідчений перукар та інструктор з експертизою в продвинутих техніках стрижки.',
    'instructor.about.bartosz': 'Креативний стиліст, зосереджений на сучасних трендах та персоналізованому досвіді клієнтів.',
    'instructor.experience.bartosz': 'Талановитий перукар, що спеціалізується на креативних стрижках та сучасному стилінгу волосся.',
    'instructor.about.ali': 'Відданий професіонал з експертизою як в традиційних, так і в сучасних техніках перукарства.',
    'instructor.experience.ali': 'Досвідчений перукар з пристрастю до надання виняткових послуг догляду.',
    'instructor.about.tomasz': 'Досвідчений професіонал, що поєднує практичні навички перукарства з досконалістю викладання.',
    'instructor.experience.tomasz': 'Професійний перукар та викладач, рішуче налаштований ділитися знаннями та навичками.',
    'testimonial.1.quote': 'Найкраще місце у Варшаві для швидкого та якісного вивчення професії з нуля. Щойно закінчив курс, хлопці допомогли з фінансуванням курсу і одразу після закінчення знайшли мені роботу. Дуже рекомендую і дякую!',
    'testimonial.1.name': 'Angelika Ziółkowska',
    'testimonial.1.title': 'Випускник • 5-зіркова оцінка Google',
    'testimonial.2.quote': 'Мав задоволення брати участь у 3-денному навчальному курсі під керівництвом Томека та Алі. Дуже задоволений ефектами навчання. Чудова атмосфера та чудові викладачі. Хлопці дали нам величезну дозу знань та поради щодо створення портфоліо. Дуже рекомендую!',
    'testimonial.2.name': 'Agata Antoniewicz',
    'testimonial.2.title': 'Випускник • 5-зіркова оцінка Google',
    'testimonial.3.quote': 'Попри час, що минув з моменту закінчення курсу, вирішив написати відгук. Проходив місячний курс "Перукар з нуля" в K&K Academy і був дуже вражений рівнем професіоналізму та якістю навчання. Викладачі Томек, Бартек та Алі демонстрували не лише теоретичні знання, але й вражаючі практичні навички. Зараз, через 6 місяців після закінчення курсу, успішно керую власним салоном і радий, що мав можливість пройти курс з нуля з хлопцями.',
    'testimonial.3.name': 'Sharp Cut Barber',
    'testimonial.3.title': 'Власник салону • 5-зіркова оцінка Google',
    'common.graduate': 'Випускник',
    'common.review': 'Оцінка Google',
    'common.star': 'зіркова',
    'common.show.more': 'Показати більше',
    'common.show.less': 'Показати менше',
    'common.all': 'всі',
    'common.dates': 'дати',
    'common.upcoming': 'Найближчі',
    'course.schedule': 'Розклад',
    'course.everyday': 'Щодня',
    'course.schedule.flexible': 'Гнучкі години',
    'months.january': 'Січень',
    'months.february': 'Лютий',
    'months.march': 'Березень',
    'months.april': 'Квітень',
    'months.may': 'Травень',
    'months.june': 'Червень',
    'months.july': 'Липень',
    'months.august': 'Серпень',
    'months.september': 'Вересень',
    'months.october': 'Жовтень',
    'months.november': 'Листопад',
    'months.december': 'Грудень',

    // Blog Translation Keys
    'blog.loading': 'Завантаження статті...',
    'blog.not.found': 'Статтю не знайдено',
    'blog.not.found.description': 'Стаття, яку ви шукаєте, не існує.',
    'blog.back.to.blog': '← Повернутися до блогу',
    'blog.back.to.home': 'Повернутися на головну',
    'blog.min.read': 'хв читання',
    'blog.ready.to.start': 'Готові розпочати свою перукарську подорож?',
    'blog.ready.description': 'Приєднуйтесь до академії перукарів K&K та навчайтесь у професіоналів індустрії в наших сучасних приміщеннях.',
    'blog.start.journey': 'Розпочати подорож',
    'blog.related.articles': 'Схожі статті',
    'blog.quick.links': 'Швидкі посилання',
    'blog.view.courses': '→ Переглянути курси',
    'blog.meet.instructors': '→ Познайомитися з інструкторами',
    'blog.student.gallery': '→ Галерея студентів',
    'blog.contact.us': '→ Контакти',

    // Blog Post Titles and Content (Ukrainian translations)
    'blog.post.start-barber-career.title': 'Як розпочати кар\'єру в перукарстві',
    'blog.post.start-barber-career.tag': 'ПОЧАТКІВЕЦЬ',
    'blog.post.top-5-fade-techniques-2025.title': 'Топ 5 технік fade на 2025 рік',
    'blog.post.top-5-fade-techniques-2025.tag': 'ТРЕНДИ',
    'blog.post.barber-toolkit-essentials.title': 'Набір перукаря: Необхідне vs Бажане',
    'blog.post.barber-toolkit-essentials.tag': 'ІНСТРУМЕНТИ',
  },
};