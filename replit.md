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
### Complete Kommo CRM Integration
- **Automatic Lead Management**: Contact form submissions sync to Kommo CRM with duplicate detection
- **Database Schema**: Added `crm_configs` and `crm_leads` tables for configuration and tracking
- **Backend Services**: 
  - `KommoService` class for API communication with rate limiting and error handling
  - `CrmIntegrationService` for processing form submissions with graceful fallback
- **Admin Interface**: Full configuration panel at `/admin` for CRM setup and inquiry management
- **Duplicate Detection**: Uses Kommo's complex leads endpoint for automatic contact merging
- **Field Mapping**: Configurable mapping of form fields to Kommo custom fields
- **Error Handling**: Graceful degradation - forms work normally even when CRM is unavailable
- **Security**: Sensitive credentials stored securely, not exposed in frontend
- **Status Tracking**: Real-time CRM connection status and sync monitoring