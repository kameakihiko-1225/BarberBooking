import { useLanguage } from "@/contexts/LanguageContext";

export default function BarberSEO() {
  const { language } = useLanguage();

  const barberKeywords = {
    pl: [
      "kurs barberingu Warszawa", "kursy barberingu Polska", "akademia barberingu Polska",
      "nauka barberingu od podstaw", "szkolenie barberskie", "akademia barberska",
      "barbershop academy", "kurs barberski", "certyfikat barberski", "instruktorzy barberscy",
      "szkolenia barberskie", "barber warszawa", "barbershop warszawa", "barber męski",
      "golenie brzytwą", "strzyżenie męskie", "beard trimming", "mustache grooming",
      "professional barber", "barber tools", "barber techniques", "barber skills"
    ],
    en: [
      "barber academy in Poland", "barber course Poland", "barber school Warsaw Europe",
      "international barber course", "barber academy Europe", "European barber training",
      "barber certification Europe", "professional barber training", "barbershop academy Europe",
      "barber education Warsaw", "barber instructor Europe", "barber workshop international",
      "men's grooming Europe", "beard cutting course", "mustache styling", "straight razor shaving",
      "barber skills training", "barber techniques Europe", "barber tools course", "barber apprenticeship Europe",
      "barber license Poland", "barber diploma Europe", "barbering school Warsaw", "barber career Europe"
    ],
    uk: [
      "академія барберів Польща", "курси барберів у Польщі", "школа барберів для українців у Польщі",
      "навчання барберів", "барбер академія варшава", "курс барбера", "школа барберів",
      "сертифікат барбера", "професійне навчання барберів", "барбершоп академія",
      "освіта барберів", "інструктор барберів", "майстер-клас барберів", "чоловіча стрижка",
      "догляд за бородою", "гоління бриствою", "стайлінг вусів", "навички барбера",
      "техніки барбера", "інструменти барбера", "учнівство барбера", "ліцензія барбера"
    ]
  };

  const currentKeywords = barberKeywords[language as keyof typeof barberKeywords] || barberKeywords.pl;

  const seoTitles = {
    pl: "Kurs Barberingu Warszawa - Akademia Barberingu Polska",
    en: "Barber School Warsaw Europe - International Barber Course", 
    uk: "Академія барберів Польща - Курси барберів у Польщі"
  };

  const seoDescriptions = {
    pl: "Kurs barberingu Warszawa w K&K Academy - najlepsze kursy barberingu w Polsce. Nauka barberingu od podstaw z certyfikatem. Akademia barberingu Polska.",
    en: "Barber school Warsaw Europe at K&K Academy - leading international barber course. Professional barber training with certification. European barber academy in Poland.",
    uk: "Академія барберів Польща у K&K Academy - найкращі курси барберів у Польщі. Школа барберів для українців у Польщі з сертифікацією."
  };

  const currentTitle = seoTitles[language as keyof typeof seoTitles] || seoTitles.pl;
  const currentDescription = seoDescriptions[language as keyof typeof seoDescriptions] || seoDescriptions.pl;

  return (
    <div style={{ display: 'none' }}>
      {/* Hidden semantic content for SEO */}
      <h1>{currentTitle}</h1>
      
      <div>
        <p>{currentDescription}</p>
      </div>

      <ul>
        {currentKeywords.map((keyword, index) => (
          <li key={index}>{keyword}</li>
        ))}
      </ul>

      <div>
        {currentKeywords.slice(0, 9).map((keyword, index) => (
          <span key={index}>{keyword}</span>
        ))}
      </div>
    </div>
  );
}