# K&K Barber Academy

## Overview
K&K Barber Academy is a full-stack web application for a professional barber training institution. It provides course information, instructor profiles, media galleries, and contact forms. The system emphasizes career building, professional barber techniques, and offers dual certifications (ISO 9001:2015-10 and SZOE). Its vision is to transform ambition into profession by offering practical, high-quality training.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **UI Components**: Custom components built with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system (premium accent color scheme with bronze/gold highlights)
- **Build Tool**: Vite
- **UI/UX**: Responsive design (mobile-first), smooth animations and transitions, Intersection Observer for lazy loading and scroll animations, custom scrollbar styling, masonry and grid gallery views, text truncation with expand/collapse for testimonials.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **API Design**: RESTful endpoints with JSON responses
- **Media Processing**: Sharp for image optimization (including HEIC to JPEG conversion), serves optimized media.

### Database
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM (type-safe queries)
- **Schema**: Defined in shared TypeScript files (Users, Inquiries, Media Files, Blog Posts)
- **Migrations**: Drizzle Kit

### Key Features & Technical Implementations
- **Media Management**: Automatic processing of images (including HEIC), serving optimized media, caching of media lists.
- **Form Handling**: Zod validation, contact form with program selection, toast notifications, real-time validation.
- **Multi-language Support**: Comprehensive Polish, English, and Ukrainian localization with a custom translation system. Language preference persists via localStorage.
- **SEO Optimization**: Comprehensive barber-specific SEO targeting (Polish, English, Ukrainian, and broader European/Central Asian markets), JSON-LD schema markup (EducationalOrganization, Course), XML sitemap with hreflang tags, optimized meta tags, structured data, professional social media image, Google Search Console integration.
- **Security**: Content Security Policy, HSTS, X-Content-Type-Options, X-Frame-Options, automatic HTTPS redirect, mixed content warnings resolved.
- **Deployment**: Replit configuration for Node.js 20, Vite for frontend build, esbuild for backend bundle, static asset serving.

## External Dependencies
- **Database**: PostgreSQL
- **Image Processing**: Sharp, heic-convert
- **Validation**: Zod
- **UI Components**: Radix UI
- **Development Tools**: TypeScript
- **Video Embedding**: YouTube iframe embed for video popups
- **CRM Integration**: Kommo CRM API v4 with OAuth 2.0 authentication

## Recent Major Updates (August 2025)
### Intelligent Kommo CRM Auto-Discovery Integration ✅ COMPLETED
- **Hardcoded Real Credentials**: Integrated with live K&K Barber Academy CRM (kkbarberacademycrm.kommo.com)
- **Auto-Discovery System**: Intelligent discovery of pipeline structure, statuses, and custom fields
  - Pipeline ID: 11273495 (auto-detected from 3 available)
  - Status ID: 86517759 (auto-detected from pipeline statuses)
  - Custom Fields: Email (130322), Phone (130320), Message (1350056), Course Type (1350054)
- **Complete Field Resolution**: Successfully identified correct contacts Course Type field vs leads field
  - Contacts Course Type (ID: 1350054) - text field, entity_type: "contacts" ✅
  - Leads Course Type (ID: 978324) - dropdown field, entity_type: "leads" (not usable for contacts)
- **Pattern-Based Field Mapping**: Smart detection using multilingual patterns (Polish, English, Ukrainian)
- **Real-Time CRM Sync**: Contact forms successfully create leads in live CRM (Lead ID: 12450804+ confirmed)
- **ALL Fields Working**: Email, Phone, Message, AND Course Type successfully syncing to Kommo CRM
- **Backend Services**: 
  - `KommoService` with intelligent auto-discovery methods
  - `CrmIntegrationService` for processing with graceful fallback
  - Enhanced contacts vs leads field differentiation
  - Comprehensive logging system for discovery and sync processes
- **Duplicate Detection**: Uses Kommo's complex leads endpoint for automatic contact merging
- **Error Handling**: Graceful degradation - forms work normally even when CRM is unavailable
- **Zero Configuration**: No manual field mapping required - system learns CRM structure automatically
- **Production Ready**: Successfully tested with real CRM, all contact data including course type syncing perfectly

### Prisma Gallery Management System ✅ COMPLETED (August 14, 2025)
- **Prisma ORM Integration**: Added alongside existing Drizzle setup for enhanced gallery management
- **Advanced Schema Design**: Gallery models with comprehensive multilingual support
  - GalleryItem: Core image metadata with blur placeholders
  - GalleryAsset: Multi-format variants (AVIF/WEBP/JPG) at 320/640/1024/1600px
  - GalleryI18n: Multilingual titles, alt text, descriptions (EN/PL/UK)
  - Tag & TagI18n: Categorization with localized tag names
  - Course & CourseI18n: Flexible scheduling policies with multilingual content
- **ETL Pipeline**: Automated image processing tool (`tools/ingest-gallery.ts`)
  - Processes 68+ gallery images with 12 variants each (820+ processed files)
  - Generates base64 blur placeholders for smooth loading
  - Batch database operations for optimal performance
  - Auto-generates English titles from filenames, empty PL/UK for manual entry
- **Modern Gallery API**: RESTful endpoint (`server/routes/gallery.ts`)
  - Paginated responses with locale-aware content
  - Responsive srcsets for all image formats
  - Smart fallback from requested locale to English
  - Tag filtering and metadata
  - Optimized caching headers (s-maxage=60, stale-while-revalidate=86400)
- **Database Migration**: `20250814165319_init_gallery_courses` successfully applied
- **NPM Scripts**: `etl:gallery` for automated gallery ingestion

### Comprehensive Jest Testing Infrastructure ✅ COMPLETED (August 15, 2025)
- **Testing Framework**: Jest 30.0.4 with TypeScript and ESM support
- **Test Environment**: jsdom for React component testing with @testing-library/react
- **Test Coverage Areas**: 
  - **ETL Pipeline Tests** (`tests/etl/gallery-etl.test.ts`): 
    - Image folder processing with format filtering (jpg, png, webp, heic, avif)
    - GalleryItem creation with metadata (width, height, blur placeholders)
    - GalleryAsset generation for 3 formats × 4 sizes (12 variants per image)
    - GalleryI18n entries for EN/PL/UK locales with English title generation
    - Error handling for file processing and database operations
  - **API Tests** (`tests/api/gallery-api.test.ts`):
    - Pagination with nextPage calculation and totalItems counting
    - Multilingual i18n fallback (PL → EN → first available)
    - Tag filtering and responsive srcset generation
    - Locale-aware content serving with proper fallback chains
  - **UI Component Tests** (`tests/ui/course-dates.test.tsx`):
    - Course date localization: 15 Sep/20 Oct/24 Nov/12 Jan (EN)
    - Polish month abbreviations: 15 wrz/20 paź/24 lis/12 sty (PL)  
    - Ukrainian month abbreviations: 15 вер/20 жов/24 лис/12 січ (UK)
    - Beginner course scheduling with capacity management
- **Mock Infrastructure**: Comprehensive mocking for Prisma, Sharp, filesystem operations
- **Test Configuration**: ESM-compatible Jest config with proper TypeScript integration