# K&K Barber Academy - System Architecture

## Overview

K&K Barber Academy is a full-stack web application for a professional barber training institution. The system provides course information, instructor profiles, media galleries, contact forms, and a blog platform. Built with modern web technologies, it features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database with Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Custom components built with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Media Processing**: Sharp for image optimization, HEIC conversion support
- **File Serving**: Static file serving for processed media

### Database Architecture
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with type-safe queries
- **Schema**: Defined in shared TypeScript files for type consistency
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Media Management System
The application includes a sophisticated media management system that:
- Automatically processes images from the `attached_assets` directory
- Converts HEIC files to JPEG format for web compatibility
- Serves optimized media through Express static middleware
- Caches media lists for performance
- Supports both images and videos with lazy loading

### Database Schema
Core entities include:
- **Users**: Authentication and user management
- **Inquiries**: Contact form submissions with full contact details
- **Media Files**: Organized by route (gallery, students-gallery, success-stories, instructors)
- **Blog Posts**: Content management with slug-based routing and active status

### UI Design System
- Custom CSS variables for consistent theming
- Premium accent color scheme with bronze/gold highlights
- Responsive design with mobile-first approach
- Smooth animations and transitions
- Intersection Observer for lazy loading and scroll animations

### Form Handling
- Zod validation for type-safe form processing
- Contact form with program selection and inquiry management
- Toast notifications for user feedback
- Real-time form validation with proper error handling

## Data Flow

1. **Client Requests**: React components use TanStack Query for server state management
2. **API Layer**: Express.js routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM provides type-safe database interactions
4. **Media Processing**: Images are processed on-demand and cached for performance
5. **Response Handling**: JSON responses with proper error handling and validation

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with connection pooling
- **Image Processing**: Sharp for optimization, heic-convert for HEIC support
- **Validation**: Zod for runtime type checking
- **UI Components**: Extensive Radix UI component library
- **Development**: Comprehensive TypeScript tooling

### Asset Management
- Dynamic import of media files using Vite's glob imports
- Support for multiple image formats (JPG, PNG, HEIC)
- Video file handling for gallery content
- Deterministic asset loading with fallback handling

## Deployment Strategy

### Replit Configuration
- **Runtime**: Node.js 20 with web module support
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: Vite builds frontend, esbuild bundles backend
- **Port Configuration**: Frontend on 5000, API on 3001
- **Autoscale Deployment**: Configured for automatic scaling

### Build Process
1. Frontend builds to `dist/public` using Vite
2. Backend bundles to `dist/index.js` using esbuild
3. Static assets served from build directory
4. Environment variables loaded from `.env` file

### Database Setup
- Database schema managed through Drizzle migrations
- Seeding scripts for media file initialization
- Connection string configured via environment variables

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**July 11, 2025 - Blog System Complete Removal**
- Completely removed all blog functionality from the website per user request
- Deleted all blog components, pages, and routes
- Removed blog navigation menu item from navbar
- Dropped blog_posts database table and cleaned up schema
- Removed all blog-related API endpoints and storage methods
- Fixed hero component statistics text styling issue
- Website now focuses solely on courses, instructors, gallery, and contact functionality

**July 11, 2025 - UI/UX Improvements and Footer Enhancement**
- Fixed instructor card images to show full faces with proper object positioning
- Modified testimonials component by removing showcase section and transformation content
- Added large navigation buttons for "See All Student Works" and "All Success Stories"
- Enhanced footer with quick inquiry form including "Free Course" option
- Updated footer contact information throughout:
  - Address: Aleja Wyścigowa 14A, 02-681 Warszawa
  - Phone: +48 729 231 542
  - Email: Biuro@kkacademy.pl
  - Working hours: Mon-Fri: 12 am - 9 pm, Sat: 12 am – 5 pm
- Removed "follow our journey" section from footer
- Streamlined testimonials layout with focus on action buttons
- Improved instructor image display with better face visibility and spacing

**July 11, 2025 - Comprehensive CTA and Content Updates**
- Standardized all instructor titles to "Senior Barber Instructor" across website
- Updated all CTA buttons to route directly to contact page for enrollment
- Added "Free Course" option to contact form dropdown for program selection
- Implemented video popup functionality for hero "Our Vibe!" button
- Created VideoPopup component with full-screen video player and controls
- Updated hero section button text from "View Gallery" to "Our Vibe!"
- Removed all Facebook links from instructor social media (Instagram only)
- All course enrollment buttons now redirect to contact page instead of course details
- Video asset properly configured for popup display functionality

**July 12, 2025 - Turkish to Ukrainian Language Conversion & Final UI Enhancements**
- Completely converted Turkish language support to Ukrainian throughout the entire website
- Updated language type from 'tr' to 'uk' in LanguageContext and all related components
- Replaced all Turkish translations with comprehensive Ukrainian translations including:
  - Navigation menus and interface elements
  - Course descriptions and educational content
  - Contact forms and information
  - Instructor profiles and testimonials
  - Blog content and common UI elements
  - Months, dates, and time-related translations
- Fixed final Turkish remnants including "Galerimiz" → "Наша Галерея" in gallery section
- Updated language switcher to display 'UK' instead of 'TR'
- Website now supports Polish, English, and Ukrainian languages with full localization
- Fixed final Turkish remnant "Atmosferimiz" → "Наша атмосфера!" (Our atmosphere!) in Ukrainian translation
- Updated about section description across all three languages to emphasize academy's unique qualifications:
  - Polish: Focus on being the only academy with two quality certificates and qualified educators
  - English: Highlights unique status with quality certificates and educator qualifications  
  - Ukrainian: Emphasizes exclusive positioning with quality certifications and teacher credentials
- Fixed critical navbar overlap issue by implementing consistent top padding across all pages:
  - Hero section: pt-36 to pt-40 for proper clearance with large navbar logo
  - All gallery, contact, about, and detail pages: pt-36 minimum spacing
  - Course details: pt-40 to pt-44 for extra clearance
  - Ensures navbar never overlaps content on any screen size or page

**Final Course and UI Improvements - July 12, 2025**
- Changed all course timing to include "Daily" prefix across all three languages:
  - Polish: "Codziennie" (e.g., "Codziennie, 1 miesiąc")
  - English: "Daily" (e.g., "Daily, 1 month")
  - Ukrainian: "Щодня" (e.g., "Щодня, 1 місяць")
- Added certificate icon support to course components using Award icon from Lucide React
- Fixed Free course card display issues by updating icon mapping with Gift icon
- Enhanced iconMap to include certificate, gift, and Award icons for better visual representation
- Updated course data to use certificate icon for professional certification display
- Added comprehensive certificate section to about-us page with:
  - ISO 9001:2015-10 Quality Management System certification display
  - SZOE Polish educational institution certification display
  - Professional certificate card design with Award icons and gradient backgrounds
  - Full multi-language support for certificate descriptions and titles
  - Responsive layout that works across all device sizes

**July 11, 2025 - Complete Multi-Language Implementation with Full Page Support**
- Implemented comprehensive multi-language support system (Polish, English, Ukrainian)
- Created LanguageContext with translation system supporting all three languages
- Polish set as default language with complete translations for all content
- Redesigned language switcher with futuristic, minimalistic design featuring:
  - Circular badge design with gradient accents and glow effects
  - Language codes (PL/EN/UK) instead of flags for clean aesthetic
  - Smooth hover animations and backdrop blur effects
  - Integrated into both desktop and mobile navigation
- Translated entire website content including:
  - Navigation menus and buttons
  - Hero section (title, description, call-to-action buttons)
  - About section (title, subtitle, description)
  - Courses section (title, subtitle, all course details)
  - Instructors section (title, subtitle, description)
  - Contact forms and information
  - Footer content and links
  - Blog section and common UI elements
  - Gallery components with "View Full Gallery" button
  - CTA-Enroll section with proper routing to contact page
  - All page components (Gallery, Students Gallery, Blog pages)
  - Course details pages with translation support
  - Blog posts with titles, excerpts, tags, and category filters
  - Complete blog translation system with localized fallback posts
- All translations are comprehensive and culturally appropriate for each market
- Language preference persists across browser sessions via localStorage
- Responsive design maintains functionality across all device sizes
- Fixed all routing to use /contact instead of /contacts for consistency
- Blog cards dynamically display translated content based on selected language
- Contact page forms fully translated with localized labels, placeholders, and validation messages
- Contact information and operating hours display in appropriate language format

**July 09, 2025 - Comprehensive Authentic Testimonials Integration**
- Added 12 real 5-star Google reviews from actual K&K Academy graduates
- Extracted testimonials from uploaded review screenshots including:
  - Angelika Ziółkowska: Job placement success after course completion
  - Sharp Cut Barber: Now runs own salon 6 months after graduation
  - Agata Antoniewicz: 3-day training with Tomek and Ali
  - Martyna Wódarczyk: Barbering and beard cutting course graduate
  - Mikołaj Grzejda: Praise for instructor Bartek's teaching methods
  - Aleksandra Springer: 3-day intensive training satisfaction
  - Multiple other authentic graduates praising professionalism and training quality
- Integrated all testimonials into carousel with proper attribution as "Graduate • 5-star Google Review"
- Maintained existing visual styling and responsive design
- Replaced placeholder testimonials with 100% authentic customer feedback

**July 09, 2025 - Course Calendar Integration & Instructor Section Redesign**
- Implemented upcoming course dates calendar view for all courses
- Added UpcomingDates component with elegant badge-style date layout
- Integrated Uzbek local course names with English titles (1 oylik kurs uchun, etc.)
- Created responsive grid calendar with hover effects and tooltips
- Added show more/less functionality for courses with many dates
- Enhanced course cards with calendar section between details and enroll button
- Updated course data structure to include localName and upcomingDates fields

**July 09, 2025 - Instructor Section Redesign & Image Mapping Fixes**
- Completely redesigned instructor cards to match provided design specifications
- Implemented black and white images with grayscale filter that transitions to color on hover
- Added orange (#FF6A00) background transition on hover/focus states
- Integrated social media icons (Facebook, Instagram, WhatsApp) with slide-in animations
- Updated instructor data structure to support new social media format
- Created dark background cards with thin left border lines matching design requirements
- Added 5 real instructors: Richer Karimov, Apo Karimov, Bartosz Kaczorowski, Ali Karimov, Tomasz Kaczorowski
- Fixed instructor image mapping issues by correctly indexing alphabetically sorted asset files
- Enhanced mobile touch interactions with proper hover states for desktop
- Integrated real instructor database into course detail pages replacing placeholder data

**June 27, 2025 - Parallel Gallery Layout Implementation**
- Converted student stories and success stories to parallel, non-proportional gallery view
- Replaced aspect-ratio responsive grid with fixed-height uniform display (h-48/h-56/h-64)
- All images now display in consistent rectangular frames with object-cover cropping
- Implemented 2-5 column responsive grid layout with enhanced spacing
- Fixed success stories media file serving by copying files to static directory

**June 27, 2025 - Gallery System Enhancement & Video Functionality**
- Fixed video play button functionality across all gallery pages with working click handlers
- Implemented 3+ column responsive grid layout for iPhone SE resolution (grid-cols-3 xs:grid-cols-4)
- Added proper video controls with play/pause state management and visual feedback
- Enhanced video display with grayscale-to-color hover effects and smooth transitions
- Applied consistent media card component across gallery, students-gallery, and success-stories pages
- Migrated 14 success story files from /attached_assets/success to media_files database table
- Optimized media API with server-side caching (5min browser, 10min CDN) for sub-1s loading
- Added database query caching with 5-minute TTL for instant responses
- Enhanced lazy loading with staggered fade-in animations and intersection observer performance

## Changelog

- June 27, 2025. Initial setup and comprehensive blog system implementation