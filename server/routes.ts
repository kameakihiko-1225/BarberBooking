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

  app.get('/api/blog', async (req,res)=>{
    try {
      const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
      res.json(posts);
    } catch(err){res.status(500).json({error:'db'});} 
  });

  app.get('/api/blog/:slug', async (req,res)=>{
    try{
      const slug = req.params.slug;
      const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      if(post.length===0) return res.status(404).json({error:'not-found'});
      res.json(post[0]);
    }catch(err){res.status(500).json({error:'db'});} 
  });

  app.post('/api/blog', async (req,res)=>{
    const {slug,title,content,image} = req.body;
    if(!slug||!title||!content) return res.status(400).json({error:'fields'});
    try{
      await db.insert(blogPosts).values({slug,title,content});
      res.json({ok:true});
    }catch(err){res.status(500).json({error:'db'});} 
  });

  // Admin: list all including inactive
  app.get('/api/blog-admin', async (req,res)=>{
    try{const posts=await db.select().from(blogPosts);res.json(posts);}catch(err){res.status(500).json({error:'db'});}
  });

  // Update post
  app.put('/api/blog/:id', async (req,res)=>{
    const id = Number(req.params.id);
    const {title,content,image,active} = req.body;
    try{
      await db.update(blogPosts).set({title,content,image,active,updatedAt:new Date()}).where(eq(blogPosts.id,id));
      res.json({ok:true});
    }catch(err){res.status(500).json({error:'db'});} 
  });

  // Delete post
  app.delete('/api/blog/:id', async (req,res)=>{
    const id = Number(req.params.id);
    try{await db.delete(blogPosts).where(eq(blogPosts.id,id));res.json({ok:true});}
    catch(err){res.status(500).json({error:'db'});} 
  });

  const httpServer = createServer(app);
  return httpServer;
}
