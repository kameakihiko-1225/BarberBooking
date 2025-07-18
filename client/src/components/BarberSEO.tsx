import { useLanguage } from "@/contexts/LanguageContext";

export default function BarberSEO() {
  const { language } = useLanguage();

  const barberKeywords = {
    pl: [
      "kurs barberingu Warszawa", "kursy barberingu Polska", "akademia barberingu Polska",
      "nauka barberingu od podstaw", "szkolenie barberskie", "akademia barberska",
      "barbershop academy", "kurs fryzjerski", "certyfikat barberski", "instruktorzy fryzjerscy",
      "szkolenia fryzjerskie", "barber warszawa", "barbershop warszawa", "fryzjer męski",
      "golenie brzytwą", "strzyżenie męskie", "beard trimming", "mustache grooming",
      "professional barber", "barber tools", "barber techniques", "barber skills"
    ],
    en: [
      "barber academy in Poland", "barber course Poland", "barber school Warsaw",
      "barber academy warsaw", "barber training", "barbering school", "barber certification",
      "professional barber training", "barbershop training", "barber education",
      "barber instructor", "barber workshop", "men's grooming", "beard cutting",
      "mustache styling", "straight razor shaving", "barber skills", "barber techniques",
      "barber tools", "barber apprenticeship", "barber license", "barber diploma"
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

  return (
    <div style={{ display: 'none' }}>
      {/* Hidden semantic content for SEO */}
      <h1>Kurs Barberingu Warszawa - Akademia Barberingu Polska</h1>
      <h2>Barber School Warsaw - Barber Course Poland</h2>
      <h3>Академія барберів Польща - Курси барберів у Польщі</h3>
      
      <div>
        <p>
          Kurs barberingu Warszawa w K&K Academy - najlepsze kursy barberingu w Polsce. 
          Nauka barberingu od podstaw z certyfikatem. Akademia barberingu Polska.
        </p>
        <p>
          Barber school Warsaw at K&K Academy - top barber course Poland. 
          Professional barber training with certification. Barber academy in Poland.
        </p>
        <p>
          Академія барберів Польща у K&K Academy - найкращі курси барберів у Польщі. 
          Школа барберів для українців у Польщі з сертифікацією.
        </p>
      </div>

      <ul>
        {currentKeywords.map((keyword, index) => (
          <li key={index}>{keyword}</li>
        ))}
      </ul>

      <div>
        <span>Kurs barberingu Warszawa</span>
        <span>Kursy barberingu Polska</span>
        <span>Akademia barberingu Polska</span>
        <span>Nauka barberingu od podstaw</span>
        <span>Barber school Warsaw</span>
        <span>Barber course Poland</span>
        <span>Barber academy in Poland</span>
        <span>Академія барберів Польща</span>
        <span>Курси барберів у Польщі</span>
        <span>Школа барберів для українців у Польщі</span>
      </div>
    </div>
  );
}