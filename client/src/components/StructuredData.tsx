import { useLanguage } from "@/contexts/LanguageContext";

interface StructuredDataProps {
  type?: 'course' | 'organization' | 'webpage' | 'faq';
  courseData?: any;
  faqData?: Array<{question: string, answer: string}>;
}

export default function StructuredData({ type = 'organization', courseData, faqData }: StructuredDataProps) {
  const { language } = useLanguage();

  const getStructuredData = () => {
    const baseUrl = "https://kk-barberacademy.pl";
    
    if (type === 'course' && courseData) {
      return {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": courseData.title,
        "description": courseData.description,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "K&K Barber Academy",
          "url": baseUrl
        },
        "instructor": courseData.instructors?.map((instructor: any) => ({
          "@type": "Person",
          "name": instructor.name,
          "jobTitle": instructor.title
        })),
        "courseMode": "in-person",
        "duration": courseData.duration,
        "price": courseData.price,
        "priceCurrency": "PLN",
        "location": {
          "@type": "Place",
          "name": "K&K Barber Academy",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Aleja Wyścigowa 14A",
            "addressLocality": "Warszawa",
            "postalCode": "02-681",
            "addressCountry": "PL"
          }
        },
        "offers": {
          "@type": "Offer",
          "price": courseData.price?.replace(/[^\d]/g, ''),
          "priceCurrency": "PLN",
          "availability": "https://schema.org/InStock"
        }
      };
    }

    if (type === 'faq' && faqData) {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
    }

    // Default organization schema
    return {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "K&K Barber Academy",
      "alternateName": language === 'pl' 
        ? ["Akademia Barberska K&K", "Barbershop Academy Warszawa", "Akademia Fryzjerska K&K"]
        : language === 'uk'
        ? ["Академія барберів K&K", "Барбер академія Варшава", "Школа барберів K&K"]
        : ["K&K Barbershop Academy", "Barber Academy Warsaw", "Professional Barber School"],
      "description": language === 'pl' 
        ? "Jedyna akademia barberska w Polsce z dwoma certyfikatami jakości - ISO 9001:2015-10 i SZOE. Profesjonalne szkolenia barberskie prowadzone przez wykwalifikowanych instruktorów z certyfikatem czeladniczym. Barbershop Academy Warszawa."
        : language === 'uk'
        ? "Єдина академія барберів у Польщі з двома сертифікатами якості - ISO 9001:2015-10 і SZOE. Професійне навчання барберів проводиться кваліфікованими інструкторами з сертифікатом підмайстра. Барбер академія Варшава."
        : "The only barber academy in Poland with two quality certificates - ISO 9001:2015-10 and SZOE. Professional barber training conducted by qualified instructors with apprenticeship certificates. Barbershop Academy Warsaw.",
      "url": baseUrl,
      "logo": `${baseUrl}/social-image.svg`,
      "image": `${baseUrl}/social-image.svg`,
      "telephone": "+48-729-231-542",
      "email": "Biuro@kkacademy.pl",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Aleja Wyścigowa 14A",
        "addressLocality": "Warszawa",
        "postalCode": "02-681",
        "addressCountry": "PL"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "52.2297",
        "longitude": "21.0122"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "12:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "12:00",
          "closes": "17:00"
        }
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+48-729-231-542",
        "contactType": "customer service",
        "email": "Biuro@kkacademy.pl",
        "availableLanguage": ["Polish", "English", "Ukrainian"]
      },
      "sameAs": [
        "https://www.instagram.com/kk_barberacademy"
      ],
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "Quality Management System",
          "name": "ISO 9001:2015-10"
        },
        {
          "@type": "EducationalOccupationalCredential", 
          "credentialCategory": "Educational Institution",
          "name": "SZOE Certification"
        }
      ],
      "areaServed": {
        "@type": "Country",
        "name": "Poland"
      },
      "keywords": language === 'pl' 
        ? ["kurs barberingu Warszawa", "kursy barberingu Polska", "akademia barberingu Polska", "nauka barberingu od podstaw", "szkolenie barberskie", "akademia barberska", "barbershop academy", "kurs fryzjerski", "certyfikat barberski", "barber warszawa"]
        : language === 'uk'
        ? ["академія барберів Польща", "курси барберів у Польщі", "школа барберів для українців у Польщі", "навчання барберів", "барбер академія варшава", "курс барбера", "школа барберів", "сертифікат барбера", "професійне навчання барберів"]
        : ["barber academy in Poland", "barber course Poland", "barber school Warsaw", "barber academy warsaw", "barber training", "barbering school", "barber certification", "professional barber training", "barbershop training", "barber education"]
    };
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}