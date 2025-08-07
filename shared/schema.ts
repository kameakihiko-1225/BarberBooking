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

// CRM integration tables
export const crmConfigs = pgTable("crm_configs", {
  id: serial("id").primaryKey(),
  subdomain: text("subdomain").notNull(),
  clientId: text("client_id").notNull(),
  clientSecret: text("client_secret").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  pipelineId: integer("pipeline_id"),
  statusId: integer("status_id"),
  emailFieldId: integer("email_field_id"),
  phoneFieldId: integer("phone_field_id"),
  messageFieldId: integer("message_field_id"),
  isActive: integer("is_active").default(1), // 1 = active, 0 = inactive
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmLeads = pgTable("crm_leads", {
  id: serial("id").primaryKey(),
  inquiryId: integer("inquiry_id").references(() => inquiries.id),
  kommoLeadId: integer("kommo_lead_id").notNull(),
  kommoContactId: integer("kommo_contact_id"),
  status: text("status").notNull(), // created, updated, merged, error
  duplicateDetected: integer("duplicate_detected").default(0),
  errorMessage: text("error_message"),
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

export const insertCrmConfigSchema = createInsertSchema(crmConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCrmLeadSchema = createInsertSchema(crmLeads).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = typeof mediaFiles.$inferInsert;
export type CrmConfig = typeof crmConfigs.$inferSelect;
export type InsertCrmConfig = z.infer<typeof insertCrmConfigSchema>;
export type CrmLead = typeof crmLeads.$inferSelect;
export type InsertCrmLead = z.infer<typeof insertCrmLeadSchema>;
