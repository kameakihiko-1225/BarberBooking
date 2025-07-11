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
          <h2 className="golden-bronze text-xl font-medium mb-6">{t('instructors.title')}</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">{t(`instructor.${found.id}.about`)}</p>
          <p className="text-gray-400 mb-8">{t(`instructor.${found.id}.experience`)}</p>
          <div className="flex space-x-4 mb-8">
            {found.socials.map((s, idx) => (
              <a key={idx} href={s.href} className="text-gray-400 hover:text-[var(--premium-accent)] transition-colors">
                {s.icon}
              </a>
            ))}
          </div>
          <Button asChild className="bg-[var(--premium-accent)] text-black px-8 py-3 rounded-full font-medium hover:bg-[var(--premium-accent)]/80 transition-all">
            <a href="/contact">{t('instructor.apply.now')}</a>
          </Button>
        </div>
      </div>
    </section>
  );
} 