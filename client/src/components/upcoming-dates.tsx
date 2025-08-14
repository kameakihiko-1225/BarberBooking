import { Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface UpcomingDatesProps {
  courseName: string;
  dates?: string[];
}

export function UpcomingDates({ courseName, dates = [] }: UpcomingDatesProps) {
  const { t } = useLanguage();

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-[var(--premium-accent)]" />
        <h4 className="font-semibold text-deep-black">{t('course.schedule')}</h4>
      </div>
      
      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-[var(--premium-accent)]/5 to-[var(--premium-accent)]/10 
                     border border-[var(--premium-accent)]/20 rounded-xl p-6 text-center 
                     hover:shadow-lg transition-all duration-300
                     hover:bg-[var(--premium-accent)]/15 hover:border-[var(--premium-accent)]/40"
        >
          <div className="text-2xl font-bold text-deep-black mb-2">{t('course.everyday')}</div>
          <div className="text-sm text-[var(--premium-accent)] font-medium uppercase tracking-wide">
            {t('course.schedule.flexible')}
          </div>
        </div>
      </div>
    </div>
  );
}