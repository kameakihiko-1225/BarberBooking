import { 
  users, inquiries, mediaFiles, crmConfigs, crmLeads,
  type User, type InsertUser, type Inquiry, type InsertInquiry, type MediaFile,
  type CrmConfig, type InsertCrmConfig, type CrmLead, type InsertCrmLead
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  getMediaFilesByRoute(route: string): Promise<MediaFile[]>;
  
  // CRM configuration methods
  getActiveCrmConfig(): Promise<CrmConfig | undefined>;
  createCrmConfig(config: InsertCrmConfig): Promise<CrmConfig>;
  updateCrmConfig(id: number, config: Partial<InsertCrmConfig>): Promise<CrmConfig>;
  
  // CRM lead tracking methods
  createCrmLead(crmLead: InsertCrmLead): Promise<CrmLead>;
  getCrmLeadByInquiryId(inquiryId: number): Promise<CrmLead | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private inquiries: Map<number, Inquiry>;
  private currentUserId: number;
  private currentInquiryId: number;

  constructor() {
    this.users = new Map();
    this.inquiries = new Map();
    this.currentUserId = 1;
    this.currentInquiryId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const [_, user] of this.users) {
      if (user.username === username) return user;
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      createdAt: new Date(),
      phone: insertInquiry.phone || null,
      program: insertInquiry.program || null,
      message: insertInquiry.message || null
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async getMediaFilesByRoute(route: string): Promise<MediaFile[]> {
    // MemStorage fallback - return empty array since media is file-based
    return [];
  }

  // CRM methods - not implemented for MemStorage
  async getActiveCrmConfig(): Promise<CrmConfig | undefined> {
    throw new Error('CRM operations not supported in MemStorage');
  }

  async createCrmConfig(config: InsertCrmConfig): Promise<CrmConfig> {
    throw new Error('CRM operations not supported in MemStorage');
  }

  async updateCrmConfig(id: number, config: Partial<InsertCrmConfig>): Promise<CrmConfig> {
    throw new Error('CRM operations not supported in MemStorage');
  }

  async createCrmLead(crmLead: InsertCrmLead): Promise<CrmLead> {
    throw new Error('CRM operations not supported in MemStorage');
  }

  async getCrmLeadByInquiryId(inquiryId: number): Promise<CrmLead | undefined> {
    throw new Error('CRM operations not supported in MemStorage');
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(insertInquiry).returning();
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries);
  }

  private mediaCache = new Map<string, { data: MediaFile[]; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getMediaFilesByRoute(route: string): Promise<MediaFile[]> {
    console.log(`[DatabaseStorage] Getting media files for route: ${route}`);
    
    try {
      const files = await db.select().from(mediaFiles)
        .where(eq(mediaFiles.route, route));
      
      console.log(`[DatabaseStorage] Found ${files.length} media files for route ${route}`);
      console.log(`[DatabaseStorage] Sample files:`, files.slice(0, 2));
      
      return files;
    } catch (error) {
      console.error(`[DatabaseStorage] Error fetching media files for route ${route}:`, error);
      return [];
    }
  }

  // CRM configuration methods
  async getActiveCrmConfig(): Promise<CrmConfig | undefined> {
    const [config] = await db
      .select()
      .from(crmConfigs)
      .where(eq(crmConfigs.isActive, 1))
      .limit(1);
    return config;
  }

  async createCrmConfig(config: InsertCrmConfig): Promise<CrmConfig> {
    // Deactivate any existing active configs
    await db
      .update(crmConfigs)
      .set({ isActive: 0 })
      .where(eq(crmConfigs.isActive, 1));

    const [newConfig] = await db
      .insert(crmConfigs)
      .values({ ...config, isActive: 1 })
      .returning();
    return newConfig;
  }

  async updateCrmConfig(id: number, config: Partial<InsertCrmConfig>): Promise<CrmConfig> {
    const [updatedConfig] = await db
      .update(crmConfigs)
      .set({ ...config, updatedAt: new Date() })
      .where(eq(crmConfigs.id, id))
      .returning();
    return updatedConfig;
  }

  // CRM lead tracking methods
  async createCrmLead(crmLead: InsertCrmLead): Promise<CrmLead> {
    const [newCrmLead] = await db
      .insert(crmLeads)
      .values(crmLead)
      .returning();
    return newCrmLead;
  }

  async getCrmLeadByInquiryId(inquiryId: number): Promise<CrmLead | undefined> {
    const [crmLead] = await db
      .select()
      .from(crmLeads)
      .where(eq(crmLeads.inquiryId, inquiryId))
      .limit(1);
    return crmLead;
  }
}

export const storage = new DatabaseStorage();