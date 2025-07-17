import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { getMediaList } from "./media";
import { blogPosts } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';
import { db } from './db';
import * as path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Security headers middleware to force HTTPS
  app.use((req, res, next) => {
    // Force HTTPS upgrade for mixed content and custom domains
    const isProduction = process.env.NODE_ENV === 'production';
    const forwardedProto = req.headers['x-forwarded-proto'];
    const host = req.headers.host;
    
    // Check if request is HTTP on production/custom domain
    if (isProduction && forwardedProto === 'http') {
      return res.redirect(301, `https://${host}${req.url}`);
    }
    
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests; default-src \'self\' https:; img-src \'self\' https: data:; script-src \'self\' https: \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' https: \'unsafe-inline\'; font-src \'self\' https:; connect-src \'self\' https:; frame-src https:; media-src \'self\' https: data:');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
  });

  // Explicit favicon route to ensure proper serving
  app.get('/favicon.ico', (req, res) => {
    res.set('Content-Type', 'image/x-icon');
    res.set('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(__dirname, '../public/favicon.ico'));
  });
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      
      res.json({ 
        success: true, 
        message: "Thank you for your interest! We will contact you soon.",
        inquiry: inquiry 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          error: validationError.toString() 
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get all inquiries (for admin purposes)
  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Get inquiries error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Media listing endpoint - optimized for sub-1s loading
  app.get("/api/media/:route", async (req, res) => {
    try {
      const route = req.params.route;
      
      // Set aggressive caching headers for faster subsequent loads
      res.set({
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5min browser, 10min CDN
        'ETag': `"${route}-${Date.now()}"`,
        'Content-Type': 'application/json'
      });
      
      // Get media files directly from database by route
      console.log(`[API] Getting media files for route: ${route}`);
      const dbMediaFiles = await storage.getMediaFilesByRoute(route);
      console.log(`[API] Retrieved ${dbMediaFiles.length} files from storage`);
      
      const mediaList = dbMediaFiles.map(file => ({
        src: file.url,
        type: file.type as "image" | "video"
      }));
      
      console.log(`[API] Returning ${mediaList.length} media items`);
      
      res.json(mediaList);
    } catch (err) {
      console.error("Media route error", err);
      res.status(400).json({ message: (err as Error).message });
    }
  });

  // Direct media file serving with optimized caching
  app.get("/api/media-file/:route/:filename", async (req, res) => {
    try {
      const { route, filename } = req.params;
      
      // Set aggressive caching for media files
      res.set({
        'Cache-Control': 'public, max-age=86400, s-maxage=604800', // 1 day browser, 1 week CDN
        'Expires': new Date(Date.now() + 86400000).toUTCString(), // 1 day
      });
      
      // Find file in database with faster lookup
      const dbMediaFiles = await storage.getMediaFilesByRoute(route);
      const mediaFile = dbMediaFiles.find(file => file.filename === filename);
      
      if (!mediaFile) {
        return res.status(404).json({ error: "Media file not found" });
      }
      
      // Redirect to static file with 302 for faster loading
      res.redirect(302, mediaFile.url);
    } catch (err) {
      console.error("Media file serve error", err);
      res.status(500).json({ error: "server-error" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
