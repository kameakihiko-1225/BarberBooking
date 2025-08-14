import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  includehreflang?: boolean;
}

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  includehreflang = true
}: SEOHeadProps) {
  const { language, t } = useLanguage();
  
  const baseUrl = "https://kk-barberacademy.pl";
  const defaultImage = `${baseUrl}/social-image.svg`;

  // Get i18n translations with fallback to hardcoded values
  const getTranslationOrFallback = (key: string, fallback: string) => {
    const translation = t(key);
    return translation !== key ? translation : fallback;
  };
  
  const seoData = {
    pl: {
      defaultTitle: "K&K Barber Academy - Kurs Barberingu Warszawa | Akademia Barberingu Polska",
      defaultDescription: "Najlepsza akademia barberingu w Polsce z 2 certyfikatami jakości. Kursy barberingu Warszawa - nauka barberingu od podstaw. Profesjonalne szkolenia barberskie.",
      defaultKeywords: "kurs barberingu Warszawa, kursy barberingu Polska, akademia barberingu Polska, nauka barberingu od podstaw, szkolenie barberskie, akademia barberska, barbershop academy, kurs barberski, barber warszawa, certyfikat barberski, instruktorzy barberscy, szkolenia barberskie"
    },
    en: {
      defaultTitle: "K&K Barber Academy - Barber School Warsaw Europe | International Barber Course",
      defaultDescription: "Leading barber academy in Europe with 2 quality certificates. International barber school Warsaw - professional barber training for Europeans. Barber course Poland with certification.",
      defaultKeywords: "barber school Warsaw Europe, international barber course, barber academy Europe, European barber training, barber school Poland, barber certification Europe, professional barber training, barbershop academy Europe, barber education Warsaw, barber instructor Europe, barber workshop international"
    },
    uk: {
      defaultTitle: "K&K Barber Academy - Академія барберів Польща | Курси барберів у Польщі",
      defaultDescription: "Найкраща академія барберів у Польщі з 2 сертифікатами якості. Курси барберів у Польщі - школа барберів для українців у Польщі. Професійне навчання.",
      defaultKeywords: "академія барберів Польща, курси барберів у Польщі, школа барберів для українців у Польщі, навчання барберів, барбер академія варшава, курс барбера, школа барберів, сертифікат барбера, професійне навчання барберів, барбершоп академія, освіта барберів"
    }
  };

  const currentSEO = seoData[language as keyof typeof seoData] || seoData.pl;
  
  // Use i18n translations with fallback to hardcoded values
  const finalTitle = title || 
    getTranslationOrFallback('seo.title', currentSEO.defaultTitle);
  const finalDescription = description || 
    getTranslationOrFallback('seo.description', currentSEO.defaultDescription);
  const finalKeywords = keywords || 
    getTranslationOrFallback('seo.keywords', currentSEO.defaultKeywords);
  const finalImage = image || defaultImage;
  const finalUrl = url || baseUrl;

  // Set document language attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalUrl} />
      
      {/* Hreflang tags for multilingual SEO */}
      {includehreflang && (
        <>
          <link rel="alternate" hrefLang="pl" href={`${baseUrl}/`} />
          <link rel="alternate" hrefLang="en" href={`${baseUrl}/?lng=en`} />
          <link rel="alternate" hrefLang="uk" href={`${baseUrl}/?lng=uk`} />
          <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />
        </>
      )}
      
      {/* Open Graph with locale */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={
        language === 'pl' ? 'pl_PL' : 
        language === 'en' ? 'en_US' : 
        language === 'uk' ? 'uk_UA' : 'pl_PL'
      } />
      {language !== 'pl' && <meta property="og:locale:alternate" content="pl_PL" />}
      {language !== 'en' && <meta property="og:locale:alternate" content="en_US" />}
      {language !== 'uk' && <meta property="og:locale:alternate" content="uk_UA" />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:url" content={finalUrl} />
    </>
  );
}