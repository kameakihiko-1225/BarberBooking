import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { UpcomingDates } from './upcoming-dates';
import { LanguageProvider } from '../contexts/LanguageContext';

// Mock data for beginner course dates
const beginnerDates = ['15-Sep', '20-Oct', '24-Nov', '12-Jan'];

// Test component wrapper with language context
const renderWithLanguage = (component: React.ReactElement, language: string) => {
  return render(
    <LanguageProvider initialLanguage={language}>
      {component}
    </LanguageProvider>
  );
};

describe('UpcomingDates Internationalization', () => {
  describe('Beginner Course Date Display', () => {
    it('displays English month abbreviations correctly', () => {
      renderWithLanguage(
        <UpcomingDates 
          courseName="Beginner Course"
          dates={beginnerDates}
          courseId="beginner"
        />,
        'en'
      );

      // Check for English month abbreviations
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('Sep')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Oct')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
      expect(screen.getByText('Nov')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('Jan')).toBeInTheDocument();
    });

    it('displays Polish month abbreviations correctly', () => {
      renderWithLanguage(
        <UpcomingDates 
          courseName="Beginner Course"
          dates={beginnerDates}
          courseId="beginner"
        />,
        'pl'
      );

      // Check for Polish month abbreviations
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('wrz')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('paź')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
      expect(screen.getByText('lis')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('sty')).toBeInTheDocument();
    });

    it('displays Ukrainian month abbreviations correctly', () => {
      renderWithLanguage(
        <UpcomingDates 
          courseName="Beginner Course"
          dates={beginnerDates}
          courseId="beginner"
        />,
        'uk'
      );

      // Check for Ukrainian month abbreviations
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('вер')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('жов')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
      expect(screen.getByText('лис')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('січ')).toBeInTheDocument();
    });
  });

  describe('Free Course "Every Day" Display', () => {
    it('displays "every day" for free course in English', () => {
      renderWithLanguage(
        <UpcomingDates 
          courseName="Free Course"
          dates={[]}
          courseId="free"
        />,
        'en'
      );

      // Should show "every day" instead of specific dates
      expect(screen.getByText(/every day/i)).toBeInTheDocument();
      expect(screen.getByText(/flexible/i)).toBeInTheDocument();
    });

    it('displays "every day" for free course in Polish', () => {
      renderWithLanguage(
        <UpcomingDates 
          courseName="Free Course"
          dates={[]}
          courseId="free"
        />,
        'pl'
      );

      // Should show Polish translation of "every day"
      const everydayText = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'div' && 
               content.includes('codziennie') || content.includes('każdy dzień');
      });
      expect(everydayText).toBeInTheDocument();
    });

    it('displays "every day" for free course in Ukrainian', () => {
      renderWithLanguage(
        <UpcomingDates 
          courseName="Free Course"
          dates={[]}
          courseId="free"
        />,
        'uk'
      );

      // Should show Ukrainian translation of "every day"
      const everydayText = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'div' && 
               content.includes('щодня') || content.includes('кожен день');
      });
      expect(everydayText).toBeInTheDocument();
    });
  });

  describe('Date Formatting Edge Cases', () => {
    it('handles dates without month abbreviations', () => {
      const dailyDates = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
      
      renderWithLanguage(
        <UpcomingDates 
          courseName="Advanced Course"
          dates={dailyDates}
          courseId="advanced"
        />,
        'en'
      );

      // Should display the day abbreviations as-is
      expect(screen.getByText('MON')).toBeInTheDocument();
      expect(screen.getByText('TUE')).toBeInTheDocument();
      expect(screen.getByText('WED')).toBeInTheDocument();
    });

    it('renders nothing when no dates are provided for non-free courses', () => {
      const { container } = renderWithLanguage(
        <UpcomingDates 
          courseName="Advanced Course"
          dates={[]}
          courseId="advanced"
        />,
        'en'
      );

      // Should not render the component at all
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Language Switching', () => {
    it('updates month abbreviations when language changes', () => {
      const { rerender } = renderWithLanguage(
        <UpcomingDates 
          courseName="Beginner Course"
          dates={beginnerDates}
          courseId="beginner"
        />,
        'en'
      );

      // Initially English
      expect(screen.getByText('Sep')).toBeInTheDocument();

      // Switch to Polish
      rerender(
        <LanguageProvider initialLanguage="pl">
          <UpcomingDates 
            courseName="Beginner Course"
            dates={beginnerDates}
            courseId="beginner"
          />
        </LanguageProvider>
      );

      // Now Polish
      expect(screen.getByText('wrz')).toBeInTheDocument();
      expect(screen.queryByText('Sep')).not.toBeInTheDocument();
    });
  });

  describe('Tooltip Hover Content', () => {
    it('displays full date information in tooltips for English', () => {
      renderWithLanguage(
        <UpcomingDates 
          courseName="Beginner Course"
          dates={beginnerDates}
          courseId="beginner"
        />,
        'en'
      );

      // Tooltip should contain full month names
      const tooltips = screen.getAllByText(/15 Sep|20 Oct|24 Nov|12 Jan/);
      expect(tooltips.length).toBeGreaterThan(0);
    });

    it('displays full date information in tooltips for Polish', () => {
      renderWithLanguage(
        <UpcomingDates 
          courseName="Beginner Course"
          dates={beginnerDates}
          courseId="beginner"
        />,
        'pl'
      );

      // Tooltip should contain Polish month abbreviations
      const tooltips = screen.getAllByText(/15 wrz|20 paź|24 lis|12 sty/);
      expect(tooltips.length).toBeGreaterThan(0);
    });
  });
});