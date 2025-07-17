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
      "alternateName": "Akademia Fryzjerska K&K",
      "description": language === 'pl' 
        ? "Jedyna akademia barberska w Polsce z dwoma certyfikatami jakości - ISO 9001:2015-10 i SZOE. Profesjonalne szkolenia fryzjerskie prowadzone przez wykwalifikowanych instruktorów z certyfikatem czeladniczym."
        : "The only barber academy in Poland with two quality certificates - ISO 9001:2015-10 and SZOE. Professional barber training conducted by qualified instructors with apprenticeship certificates.",
      "url": baseUrl,
      "logo": `${baseUrl}/attached_assets/K&K_Vertical_logotype_white_1750662689464.png`,
      "image": `${baseUrl}/attached_assets/K&K_Vertical_logotype_white_1750662689464.png`,
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
      }
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