import { useRoute } from "wouter";
import { instructors } from "@/data/instructors";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

export default function InstructorDetails() {
  const { t } = useLanguage();
  const [match, params] = useRoute<{ id: string }>("/instructor/:id");
  if (!match) return null;
  const found = instructors.find((i) => i.id === Number(params.id));

  const { data: media = [] } = useQuery<{src:string,type:string}[]>({
    queryKey: ['media','instructors'],
    queryFn: async () => {
      const res = await fetch('/api/media/instructors');
      return res.json();
    },
  });

  const images = media.filter(m=>m.type==='image').map(m=>m.src);
  const displaySrc = images[(found?.id ?? 1)-1] || found?.image || "";

  if (!found) return <div className="min-h-screen flex items-center justify-center text-white bg-deep-black">{t('instructor.not.found')}</div>;

  return (
    <section className="min-h-screen bg-deep-black text-white pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <img
            src={displaySrc}
            alt={found.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">{found.name}</h1>
          <h2 className="golden-bronze text-xl font-medium mb-6">{t(found.title)}</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">{t(found.about)}</p>
          <p className="text-gray-400 mb-8">{t(found.experience)}</p>
          <div className="flex space-x-4 mb-8">
            {found.socials.instagram && (
              <a href={found.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--premium-accent)] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.197-1.559-.748-.948-1.197-2.315-1.197-3.996 0-1.681.449-3.048 1.197-3.996.749-.948 1.9-1.559 3.197-1.559 1.297 0 2.448.611 3.197 1.559.748.948 1.197 2.315 1.197 3.996 0 1.681-.449 3.048-1.197 3.996-.749.948-1.9 1.559-3.197 1.559z"/>
                </svg>
              </a>
            )}
            {found.socials.facebook && (
              <a href={found.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--premium-accent)] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {found.socials.whatsapp && (
              <a href={found.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--premium-accent)] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
              </a>
            )}
          </div>
          <Button asChild className="bg-[var(--premium-accent)] text-black px-8 py-3 rounded-full font-medium hover:bg-[var(--premium-accent)]/80 transition-all">
            <a href="/contact">{t('instructor.contact')}</a>
          </Button>
        </div>
      </div>
    </section>
  );
} 