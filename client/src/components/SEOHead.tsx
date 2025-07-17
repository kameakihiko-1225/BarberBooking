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
  const defaultImage = `${baseUrl}/attached_assets/K&K_Vertical_logotype_white_1750662689464.png`;
  
  const seoData = {
    pl: {
      defaultTitle: "K&K Barber Academy - Akademia Fryzjerska Warszawa | Szkolenia Barberskie",
      defaultDescription: "Jedyna akademia barberska w Polsce z 2 certyfikatami jakości. Profesjonalne szkolenia fryzjerskie w Warszawie. Wykwalifikowani instruktorzy z certyfikatem czeladniczym.",
      defaultKeywords: "szkolenie barberskie, akademia fryzjerska warszawa, kurs fryzjerski, nauka barbingu, szkoła fryzjerska, certyfikat barberski"
    },
    en: {
      defaultTitle: "K&K Barber Academy - Professional Barber Training Warsaw | Certification Courses",
      defaultDescription: "The only barber academy in Poland with 2 quality certificates. Professional barber training in Warsaw. Qualified instructors with apprenticeship certificates.",
      defaultKeywords: "barber training, barber academy warsaw, barber course, barbering school, barber certification, professional barber training"
    },
    uk: {
      defaultTitle: "K&K Barber Academy - Професійне навчання перукарів Варшава | Сертифікаційні курси",
      defaultDescription: "Єдина академія перукарів у Польщі з 2 сертифікатами якості. Професійне навчання перукарів у Варшаві. Кваліфіковані інструктори з сертифікатом підмайстра.",
      defaultKeywords: "навчання перукарів, академія перукарів варшава, курс перукаря, школа перукарів, сертифікат перукаря"
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