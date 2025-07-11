import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CtaEnroll() {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-[var(--premium-accent)] text-black text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">{t('cta.enroll.title')}</h2>
        <p className="text-lg md:text-xl mb-8">{t('cta.enroll.description')}</p>
        <Button asChild className="bg-black text-white px-10 py-4 rounded-full font-semibold hover:bg-gray-800 hover:scale-105 transition-transform">
          <Link href="/contact">{t('cta.enroll.button')}</Link>
        </Button>
      </div>
    </section>
  );
} 