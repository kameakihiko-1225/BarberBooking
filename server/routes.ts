import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertCrmConfigSchema } from "@shared/schema";
import { crmService } from "./crmService";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { getMediaList } from "./media";
import { eq, desc } from 'drizzle-orm';
import { db } from './db';
import * as path from "path";
import { join } from "path";

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

  // SEO files
  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
  });

  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
  });

  // Social media image
  app.get('/social-image.svg', (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(process.cwd(), 'public', 'social-image.svg'));
  });
  // Contact form submission endpoint with CRM integration
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      
      // Process the form submission with CRM integration
      const result = await crmService.processFormSubmission(validatedData);
      
      let message = "Thank you for your interest! We will contact you soon.";
      
      if (result.crmResult) {
        if (result.crmResult.duplicateDetected) {
          message += " We found your previous inquiry and updated your information.";
        } else {
          message += " Your inquiry has been added to our system.";
        }
      } else if (result.error) {
        console.warn(`[CRM] Warning: ${result.error}`);
        // Still return success since local inquiry was saved
      }
      
      res.json({ 
        success: true, 
        message,
        inquiry: result.inquiry,
        crmSynced: !!result.crmResult,
        duplicateDetected: result.crmResult?.duplicateDetected || false
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

  // Serve social media image with proper headers - BLACK LOGO for search visibility
  app.get('/social-image.svg', (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.sendFile(join(process.cwd(), 'public', 'social-image.svg'));
  });

  // Serve favicon with proper headers - BLACK LOGO for browser tab visibility
  app.get('/favicon.svg', (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.sendFile(join(process.cwd(), 'public', 'favicon.svg'));
  });

  // Serve favicon.ico with proper headers
  app.get('/favicon.ico', (req, res) => {
    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.sendFile(join(process.cwd(), 'public', 'favicon.ico'));
  });

  // Serve apple-touch-icon with proper headers
  app.get('/apple-touch-icon.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.sendFile(join(process.cwd(), 'public', 'apple-touch-icon.png'));
  });

  // CRM Configuration endpoints
  app.get("/api/crm/config", async (req, res) => {
    try {
      const config = await storage.getActiveCrmConfig();
      if (!config) {
        return res.json({ 
          configured: false, 
          message: "No CRM configuration found" 
        });
      }
      
      // Don't send sensitive data to client
      const safeConfig = {
        id: config.id,
        subdomain: config.subdomain,
        isActive: config.isActive,
        hasAccessToken: !!config.accessToken,
        configured: true,
        connectedFields: {
          pipelineId: config.pipelineId,
          statusId: config.statusId,
          emailFieldId: config.emailFieldId,
          phoneFieldId: config.phoneFieldId,
          messageFieldId: config.messageFieldId
        }
      };
      
      res.json(safeConfig);
    } catch (error) {
      console.error("Get CRM config error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.post("/api/crm/config", async (req, res) => {
    try {
      const validatedData = insertCrmConfigSchema.parse(req.body);
      const config = await storage.createCrmConfig(validatedData);
      
      // Initialize the CRM service with new config
      await crmService.initialize();
      
      res.json({ 
        success: true, 
        message: "CRM configuration saved successfully",
        configId: config.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false, 
          message: "Invalid configuration data", 
          error: validationError.toString() 
        });
      } else {
        console.error("CRM config error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  app.get("/api/crm/status", async (req, res) => {
    try {
      const isAvailable = crmService.isAvailable();
      const config = await storage.getActiveCrmConfig();
      
      res.json({
        available: isAvailable,
        configured: !!config,
        initialized: isAvailable && !!config
      });
    } catch (error) {
      console.error("CRM status error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.post("/api/crm/retry/:inquiryId", async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.inquiryId);
      
      if (isNaN(inquiryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid inquiry ID"
        });
      }

      const success = await crmService.retryFailedSync(inquiryId);
      
      if (success) {
        res.json({
          success: true,
          message: "Inquiry successfully synced to CRM"
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Failed to sync inquiry to CRM"
        });
      }
    } catch (error) {
      console.error("CRM retry error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Test CRM discovery endpoint
  app.get('/api/test-crm-discovery', async (req, res) => {
    try {
      const { KommoService } = await import('./kommo');
      const kommoService = new KommoService();
      
      console.log('[Test] Testing Kommo connection...');
      const connected = await kommoService.testConnection();
      
      if (!connected) {
        return res.json({ success: false, message: 'Connection test failed' });
      }

      console.log('[Test] Running auto-discovery...');
      const initialized = await kommoService.initialize();
      
      res.json({ 
        success: true, 
        connected,
        initialized,
        message: 'CRM discovery test completed'
      });
    } catch (error) {
      console.error('[Test] CRM discovery test failed:', error);
      res.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
