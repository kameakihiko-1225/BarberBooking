import { useLanguage } from "@/contexts/LanguageContext";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = "website"
}: SEOHeadProps) {
  const { language } = useLanguage();
  
  const baseUrl = "https://kk-barberacademy.pl";
  const defaultImage = `${baseUrl}/social-image.svg`;
  
  const seoData = {
    pl: {
      defaultTitle: "K&K Barber Academy - Kurs Barberingu Warszawa | Akademia Barberingu Polska",
      defaultDescription: "Najlepsza akademia barberingu w Polsce z 2 certyfikatami jakości. Kursy barberingu Warszawa - nauka barberingu od podstaw. Profesjonalne szkolenia barberskie.",
      defaultKeywords: "kurs barberingu Warszawa, kursy barberingu Polska, akademia barberingu Polska, nauka barberingu od podstaw, szkolenie barberskie, akademia barberska, barbershop academy, kurs fryzjerski, barber warszawa, certyfikat barberski, instruktorzy fryzjerscy, szkolenia fryzjerskie"
    },
    en: {
      defaultTitle: "K&K Barber Academy - Barber School Warsaw | Barber Course Poland",
      defaultDescription: "Top barber academy in Poland with 2 quality certificates. Barber school Warsaw - professional barber training. Barber course Poland with certification.",
      defaultKeywords: "barber school Warsaw, barber course Poland, barber academy in Poland, barber training, barber academy warsaw, barbering school, barber certification, professional barber training, barbershop training, barber education, barber instructor, barber workshop"
    },
    uk: {
      defaultTitle: "K&K Barber Academy - Академія барберів Польща | Курси барберів у Польщі",
      defaultDescription: "Найкраща академія барберів у Польщі з 2 сертифікатами якості. Курси барберів у Польщі - школа барберів для українців у Польщі. Професійне навчання.",
      defaultKeywords: "академія барберів Польща, курси барберів у Польщі, школа барберів для українців у Польщі, навчання барберів, барбер академія варшава, курс барбера, школа барберів, сертифікат барбера, професійне навчання барберів, барбершоп академія, освіта барберів"
    }
  };

  const currentSEO = seoData[language as keyof typeof seoData] || seoData.pl;
  
  const finalTitle = title || currentSEO.defaultTitle;
  const finalDescription = description || currentSEO.defaultDescription;
  const finalKeywords = keywords || currentSEO.defaultKeywords;
  const finalImage = image || defaultImage;
  const finalUrl = url || baseUrl;

  return (
    <>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:url" content={finalUrl} />
    </>
  );
}