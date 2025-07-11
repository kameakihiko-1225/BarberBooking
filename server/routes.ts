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
      const dbMediaFiles = await storage.getMediaFilesByRoute(route);
      const mediaList = dbMediaFiles.map(file => ({
        src: `/api/media-file/${route}/${encodeURIComponent(file.filename)}`,
        type: file.type as "image" | "video"
      }));
      
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

  // Blog endpoints using in-memory storage
  app.get('/api/blog', async (req, res) => {
    try {
      const language = req.query.language as string;
      const posts = await storage.getBlogPosts(language);
      res.json(posts);
    } catch (err) {
      console.error("Blog posts error:", err);
      res.status(500).json({ error: 'server-error' });
    }
  });

  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      const language = req.query.language as string;
      const post = await storage.getBlogPostBySlug(slug, language);
      if (!post) return res.status(404).json({ error: 'not-found' });
      res.json(post);
    } catch (err) {
      console.error("Blog post error:", err);
      res.status(500).json({ error: 'server-error' });
    }
  });

  app.post('/api/blog', async (req, res) => {
    try {
      const { slug, title, content, image, tag, language, originalPostId } = req.body;
      if (!slug || !title || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const blogPost = await storage.createBlogPost({
        slug,
        title,
        content,
        image: image || null,
        tag: tag || null,
        language: language || 'pl',
        originalPostId: originalPostId || null,
        active: 1
      });
      
      res.json({ success: true, post: blogPost });
    } catch (err) {
      console.error("Create blog post error:", err);
      res.status(500).json({ error: 'server-error' });
    }
  });

  // Admin: list all posts including inactive
  app.get('/api/blog-admin', async (req, res) => {
    try {
      const allPosts = await storage.getBlogPosts(); // No language filter for admin
      // Sort by creation date, newest first
      const sortedPosts = allPosts.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      res.json(sortedPosts);
    } catch (err) {
      console.error("Blog admin error:", err);
      res.status(500).json({ error: 'server-error' });
    }
  });

  // Update post
  app.put('/api/blog/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { title, content, image, tag, active } = req.body;
      
      const updatedPost = await storage.updateBlogPost(id, {
        title,
        content,
        image,
        tag,
        active
      });
      
      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json({ success: true, post: updatedPost });
    } catch (err) {
      console.error("Update blog post error:", err);
      res.status(500).json({ error: 'server-error' });
    }
  });

  // Delete post
  app.delete('/api/blog/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json({ success: true });
    } catch (err) {
      console.error("Delete blog post error:", err);
      res.status(500).json({ error: 'server-error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
