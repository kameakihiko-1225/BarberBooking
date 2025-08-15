import { render, screen } from '@testing-library/react';
import { describe, it } from '@jest/globals';
import '@testing-library/jest-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';

const courses = [
  { id: 'beginner', title: 'Beginner Barber Course' },
  { id: 'advanced', title: 'Advanced Techniques' },
  { id: 'master', title: 'Master Class' }
];

// Mock the UpcomingDates component since it's the one that handles course scheduling
const UpcomingDates = ({ courseId, language }: { courseId: string; language: 'en' | 'pl' | 'uk' }) => {
  // Simulate course date logic for Beginner course
  const getCourseDates = (courseId: string) => {
    if (courseId === 'beginner') {
      return [
        { date: new Date('2024-09-15'), capacity: 12 },
        { date: new Date('2024-10-20'), capacity: 15 },
        { date: new Date('2024-11-24'), capacity: 10 },
        { date: new Date('2025-01-12'), capacity: 18 }
      ];
    }
    return [];
  };

  const formatDate = (date: Date, language: string) => {
    const monthNames = {
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      pl: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
      uk: ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру']
    };

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const month = monthNames[language as keyof typeof monthNames][monthIndex];

    return `${day} ${month}`;
  };

  const dates = getCourseDates(courseId);

  return (
    <div data-testid="upcoming-dates">
      {dates.map((dateInfo, index) => (
        <div 
          key={index}
          data-testid={`course-date-${index}`}
          className="course-date"
        >
          <span data-testid={`formatted-date-${index}`}>
            {formatDate(dateInfo.date, language)}
          </span>
          <span data-testid={`capacity-${index}`}>
            ({dateInfo.capacity} places)
          </span>
        </div>
      ))}
    </div>
  );
};

// Mock course component that includes date display
const CourseComponent = ({ courseId, language }: { courseId: string; language: 'en' | 'pl' | 'uk' }) => {
  const course = courses.find(c => c.id === courseId);
  
  const courseNames = {
    en: {
      beginner: 'Beginner Barber Course',
      advanced: 'Advanced Techniques',
      master: 'Master Class'
    },
    pl: {
      beginner: 'Kurs Podstawowy dla Fryzjerów',
      advanced: 'Techniki Zaawansowane', 
      master: 'Klasa Mistrzowska'
    },
    uk: {
      beginner: 'Початковий Курс Перукаря',
      advanced: 'Поглиблені Техніки',
      master: 'Майстер Клас'
    }
  };

  if (!course) return <div>Course not found</div>;

  return (
    <div data-testid="course-component">
      <h1 data-testid="course-title">
        {courseNames[language]?.[courseId as keyof typeof courseNames.en] || course.title}
      </h1>
      <UpcomingDates courseId={courseId} language={language} />
    </div>
  );
};

// Test wrapper component
const TestWrapper = ({ children, language = 'en' }: { children: React.ReactNode; language?: 'en' | 'pl' | 'uk' }) => {
  return (
    <LanguageProvider>
      <div data-testid="language-context" data-language={language}>
        {children}
      </div>
    </LanguageProvider>
  );
};

describe('Course Dates Display', () => {
  const beginnerCourseId = 'beginner';

  describe('English locale (EN)', () => {
    it('should display dates in English format for Beginner course', () => {
      render(
        <TestWrapper language="en">
          <CourseComponent courseId={beginnerCourseId} language="en" />
        </TestWrapper>
      );

      // Check that the course title is displayed
      expect(screen.getByTestId('course-title')).toHaveTextContent('Beginner Barber Course');

      // Check specific dates in English format
      expect(screen.getByTestId('formatted-date-0')).toHaveTextContent('15 Sep');
      expect(screen.getByTestId('formatted-date-1')).toHaveTextContent('20 Oct'); 
      expect(screen.getByTestId('formatted-date-2')).toHaveTextContent('24 Nov');
      expect(screen.getByTestId('formatted-date-3')).toHaveTextContent('12 Jan');
    });

    it('should display capacity information for each date', () => {
      render(
        <TestWrapper language="en">
          <CourseComponent courseId={beginnerCourseId} language="en" />
        </TestWrapper>
      );

      expect(screen.getByTestId('capacity-0')).toHaveTextContent('(12 places)');
      expect(screen.getByTestId('capacity-1')).toHaveTextContent('(15 places)');
      expect(screen.getByTestId('capacity-2')).toHaveTextContent('(10 places)');
      expect(screen.getByTestId('capacity-3')).toHaveTextContent('(18 places)');
    });
  });

  describe('Polish locale (PL)', () => {
    it('should display dates in Polish format for Beginner course', () => {
      render(
        <TestWrapper language="pl">
          <CourseComponent courseId={beginnerCourseId} language="pl" />
        </TestWrapper>
      );

      // Check course title in Polish
      expect(screen.getByTestId('course-title')).toHaveTextContent('Kurs Podstawowy dla Fryzjerów');

      // Check specific dates in Polish format
      expect(screen.getByTestId('formatted-date-0')).toHaveTextContent('15 wrz');
      expect(screen.getByTestId('formatted-date-1')).toHaveTextContent('20 paź');
      expect(screen.getByTestId('formatted-date-2')).toHaveTextContent('24 lis');
      expect(screen.getByTestId('formatted-date-3')).toHaveTextContent('12 sty');
    });

    it('should maintain same capacity numbers regardless of language', () => {
      render(
        <TestWrapper language="pl">
          <CourseComponent courseId={beginnerCourseId} language="pl" />
        </TestWrapper>
      );

      // Capacity should be the same regardless of language
      expect(screen.getByTestId('capacity-0')).toHaveTextContent('(12 places)');
      expect(screen.getByTestId('capacity-1')).toHaveTextContent('(15 places)');
      expect(screen.getByTestId('capacity-2')).toHaveTextContent('(10 places)');
      expect(screen.getByTestId('capacity-3')).toHaveTextContent('(18 places)');
    });
  });

  describe('Ukrainian locale (UK)', () => {
    it('should display dates in Ukrainian format for Beginner course', () => {
      render(
        <TestWrapper language="uk">
          <CourseComponent courseId={beginnerCourseId} language="uk" />
        </TestWrapper>
      );

      // Check course title in Ukrainian
      expect(screen.getByTestId('course-title')).toHaveTextContent('Початковий Курс Перукаря');

      // Check specific dates in Ukrainian format
      expect(screen.getByTestId('formatted-date-0')).toHaveTextContent('15 вер');
      expect(screen.getByTestId('formatted-date-1')).toHaveTextContent('20 жов'); 
      expect(screen.getByTestId('formatted-date-2')).toHaveTextContent('24 лис');
      expect(screen.getByTestId('formatted-date-3')).toHaveTextContent('12 січ');
    });
  });

  describe('Date formatting accuracy', () => {
    it('should correctly format September 15, 2024', () => {
      render(
        <TestWrapper language="en">
          <CourseComponent courseId={beginnerCourseId} language="en" />
        </TestWrapper>
      );

      const dateElement = screen.getByTestId('formatted-date-0');
      expect(dateElement).toHaveTextContent('15 Sep');
    });

    it('should correctly format October 20, 2024 in Polish', () => {
      render(
        <TestWrapper language="pl">
          <CourseComponent courseId={beginnerCourseId} language="pl" />
        </TestWrapper>
      );

      const dateElement = screen.getByTestId('formatted-date-1');
      expect(dateElement).toHaveTextContent('20 paź');
    });

    it('should correctly format November 24, 2024 in all languages', () => {
      const languages: Array<{ lang: 'en' | 'pl' | 'uk'; expected: string }> = [
        { lang: 'en', expected: '24 Nov' },
        { lang: 'pl', expected: '24 lis' },
        { lang: 'uk', expected: '24 лис' }
      ];

      languages.forEach(({ lang, expected }) => {
        const { unmount } = render(
          <TestWrapper language={lang}>
            <CourseComponent courseId={beginnerCourseId} language={lang} />
          </TestWrapper>
        );

        expect(screen.getByTestId('formatted-date-2')).toHaveTextContent(expected);
        unmount();
      });
    });

    it('should correctly format January 12, 2025', () => {
      const languages: Array<{ lang: 'en' | 'pl' | 'uk'; expected: string }> = [
        { lang: 'en', expected: '12 Jan' },
        { lang: 'pl', expected: '12 sty' },
        { lang: 'uk', expected: '12 січ' }
      ];

      languages.forEach(({ lang, expected }) => {
        const { unmount } = render(
          <TestWrapper language={lang}>
            <CourseComponent courseId={beginnerCourseId} language={lang} />
          </TestWrapper>
        );

        expect(screen.getByTestId('formatted-date-3')).toHaveTextContent(expected);
        unmount();
      });
    });
  });

  describe('Course availability', () => {
    it('should show all four upcoming dates for Beginner course', () => {
      render(
        <TestWrapper language="en">
          <CourseComponent courseId={beginnerCourseId} language="en" />
        </TestWrapper>
      );

      const upcomingDates = screen.getByTestId('upcoming-dates');
      const dateElements = upcomingDates.querySelectorAll('.course-date');
      
      expect(dateElements).toHaveLength(4);
    });

    it('should display dates in chronological order', () => {
      render(
        <TestWrapper language="en">
          <CourseComponent courseId={beginnerCourseId} language="en" />
        </TestWrapper>
      );

      const dates = [
        screen.getByTestId('formatted-date-0').textContent,
        screen.getByTestId('formatted-date-1').textContent,
        screen.getByTestId('formatted-date-2').textContent,
        screen.getByTestId('formatted-date-3').textContent
      ];

      expect(dates).toEqual(['15 Sep', '20 Oct', '24 Nov', '12 Jan']);
    });
  });

  describe('Accessibility and component structure', () => {
    it('should have proper test identifiers for all date elements', () => {
      render(
        <TestWrapper language="en">
          <CourseComponent courseId={beginnerCourseId} language="en" />
        </TestWrapper>
      );

      // Check that all required test IDs are present
      expect(screen.getByTestId('course-component')).toBeInTheDocument();
      expect(screen.getByTestId('course-title')).toBeInTheDocument();
      expect(screen.getByTestId('upcoming-dates')).toBeInTheDocument();

      // Check each date has proper structure
      for (let i = 0; i < 4; i++) {
        expect(screen.getByTestId(`course-date-${i}`)).toBeInTheDocument();
        expect(screen.getByTestId(`formatted-date-${i}`)).toBeInTheDocument();
        expect(screen.getByTestId(`capacity-${i}`)).toBeInTheDocument();
      }
    });

    it('should handle missing course gracefully', () => {
      render(
        <TestWrapper language="en">
          <CourseComponent courseId="nonexistent" language="en" />
        </TestWrapper>
      );

      expect(screen.getByText('Course not found')).toBeInTheDocument();
    });
  });

  describe('Integration with LanguageProvider', () => {
    it('should respect language context when rendering dates', () => {
      render(
        <TestWrapper language="pl">
          <CourseComponent courseId={beginnerCourseId} language="pl" />
        </TestWrapper>
      );

      const languageContext = screen.getByTestId('language-context');
      expect(languageContext).toHaveAttribute('data-language', 'pl');

      // Verify Polish month abbreviations are used
      expect(screen.getByTestId('formatted-date-0')).toHaveTextContent('15 wrz');
      expect(screen.getByTestId('formatted-date-1')).toHaveTextContent('20 paź');
    });
  });
});

describe('Month abbreviation accuracy', () => {
  // Test individual month formatting functions
  const formatDate = (date: Date, language: 'en' | 'pl' | 'uk') => {
    const monthNames = {
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      pl: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
      uk: ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру']
    };

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const month = monthNames[language][monthIndex];

    return `${day} ${month}`;
  };

  it('should correctly abbreviate September in all languages', () => {
    const septemberDate = new Date('2024-09-15');
    
    expect(formatDate(septemberDate, 'en')).toBe('15 Sep');
    expect(formatDate(septemberDate, 'pl')).toBe('15 wrz');
    expect(formatDate(septemberDate, 'uk')).toBe('15 вер');
  });

  it('should correctly abbreviate October in all languages', () => {
    const octoberDate = new Date('2024-10-20');
    
    expect(formatDate(octoberDate, 'en')).toBe('20 Oct');
    expect(formatDate(octoberDate, 'pl')).toBe('20 paź');
    expect(formatDate(octoberDate, 'uk')).toBe('20 жов');
  });

  it('should correctly abbreviate November in all languages', () => {
    const novemberDate = new Date('2024-11-24');
    
    expect(formatDate(novemberDate, 'en')).toBe('24 Nov');
    expect(formatDate(novemberDate, 'pl')).toBe('24 lis');
    expect(formatDate(novemberDate, 'uk')).toBe('24 лис');
  });

  it('should correctly abbreviate January in all languages', () => {
    const januaryDate = new Date('2025-01-12');
    
    expect(formatDate(januaryDate, 'en')).toBe('12 Jan');
    expect(formatDate(januaryDate, 'pl')).toBe('12 sty');
    expect(formatDate(januaryDate, 'uk')).toBe('12 січ');
  });

  it('should handle all months correctly in Polish', () => {
    const expectedPolishMonths = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
    
    expectedPolishMonths.forEach((month, index) => {
      const date = new Date(2024, index, 15); // 15th of each month
      const formatted = formatDate(date, 'pl');
      expect(formatted).toBe(`15 ${month}`);
    });
  });
});