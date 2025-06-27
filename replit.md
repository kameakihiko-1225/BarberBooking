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