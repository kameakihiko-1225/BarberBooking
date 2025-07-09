import { Calendar, Clock } from "lucide-react";
import { useState } from "react";

interface UpcomingDatesProps {
  courseName: string;
  localName: string;
  dates: string[];
}

export function UpcomingDates({ courseName, localName, dates }: UpcomingDatesProps) {
  const [showAll, setShowAll] = useState(false);
  const displayDates = showAll ? dates : dates.slice(0, 6);

  // Convert Uzbek month names to English for proper date parsing
  const monthMap: Record<string, string> = {
    'iyul': 'July',
    'avgust': 'August', 
    'sentabr': 'September',
    'oktabr': 'October',
    'noyabr': 'November',
    'dekabr': 'December'
  };

  const formatDate = (dateStr: string) => {
    const [day, month] = dateStr.split('-');
    const englishMonth = monthMap[month] || month;
    return {
      day: day,
      month: englishMonth,
      monthShort: englishMonth.slice(0, 3),
      original: dateStr
    };
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-[var(--premium-accent)]" />
        <h4 className="font-semibold text-deep-black">Upcoming Dates</h4>
        <span className="text-sm text-gray-500 font-medium">({localName})</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {displayDates.map((date, index) => {
          const formattedDate = formatDate(date);
          return (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-[var(--premium-accent)]/5 to-[var(--premium-accent)]/10 
                       border border-[var(--premium-accent)]/20 rounded-lg p-3 text-center 
                       hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer
                       hover:bg-[var(--premium-accent)]/10"
            >
              <div className="text-xl font-bold text-deep-black">{formattedDate.day}</div>
              <div className="text-xs text-[var(--premium-accent)] font-medium uppercase tracking-wide">
                {formattedDate.monthShort}
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                            bg-deep-black text-white px-2 py-1 rounded text-xs 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            pointer-events-none whitespace-nowrap z-10">
                {formattedDate.day} {formattedDate.month}
              </div>
            </div>
          );
        })}
      </div>

      {dates.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-[var(--premium-accent)] hover:text-[var(--premium-accent)]/80 
                   font-medium transition-colors flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          {showAll ? `Show less` : `Show all ${dates.length} dates`}
        </button>
      )}
    </div>
  );
}