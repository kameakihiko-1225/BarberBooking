import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  program: text("program"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  route: text("route").notNull(), // e.g. gallery, students-gallery, success-stories
  filename: text("filename").notNull(),
  type: text("type").notNull(), // image | video
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = typeof mediaFiles.$inferInsert;
