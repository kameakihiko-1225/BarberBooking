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

  // Media listing endpoint
  app.get("/api/media/:route", async (req, res) => {
    try {
      const route = req.params.route;
      const list = await getMediaList(route);
      res.json(list);
    } catch (err) {
      console.error("Media route error", err);
      res.status(400).json({ message: (err as Error).message });
    }
  });

  // Blog endpoints using in-memory storage
  app.get('/api/blog', async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (err) {
      console.error("Blog posts error:", err);
      res.status(500).json({ error: 'server-error' });
    }
  });

  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) return res.status(404).json({ error: 'not-found' });
      res.json(post);
    } catch (err) {
      console.error("Blog post error:", err);
      res.status(500).json({ error: 'server-error' });
    }
  });

  app.post('/api/blog', async (req, res) => {
    try {
      const { slug, title, content, image, tag } = req.body;
      if (!slug || !title || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const blogPost = await storage.createBlogPost({
        slug,
        title,
        content,
        image: image || null,
        tag: tag || null,
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
      const allPosts = Array.from((storage as any).blogPosts.values())
        .sort((a: any, b: any) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      res.json(allPosts);
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
