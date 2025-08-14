import { PrismaClient } from '@prisma/client';
import type { IStorage } from './storage';

const prisma = new PrismaClient();

export class PrismaStorage implements IStorage {
  // User operations (inherited from IStorage)
  async getUser(id: string): Promise<any> {
    // Since we don't have User model in new Prisma schema, return undefined
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any> {
    // Since we don't have User model in new Prisma schema, return undefined  
    return undefined;
  }

  async createUser(insertUser: any): Promise<any> {
    // Since we don't have User model in new Prisma schema, throw error
    throw new Error('User operations not supported in Prisma storage');
  }

  async createInquiry(insertInquiry: any): Promise<any> {
    // Since we don't have Inquiry model in new Prisma schema, throw error
    throw new Error('Inquiry operations not supported in Prisma storage');
  }

  async getInquiries(): Promise<any[]> {
    // Since we don't have Inquiry model in new Prisma schema, return empty array
    return [];
  }

  // Gallery operations using new Prisma models
  async getGalleryItems(locale: string = 'en'): Promise<any[]> {
    const items = await prisma.galleryItem.findMany({
      include: {
        assets: true,
        i18n: {
          where: { locale }
        },
        tags: {
          include: {
            tag: {
              include: {
                i18n: {
                  where: { locale }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return items.map(item => ({
      id: item.id,
      slug: item.slug,
      width: item.width,
      height: item.height,
      blurData: item.blurData,
      createdAt: item.createdAt,
      title: item.i18n.find(i => i.field === 'title')?.value || item.slug,
      alt: item.i18n.find(i => i.field === 'alt')?.value || item.slug,
      description: item.i18n.find(i => i.field === 'description')?.value || '',
      assets: item.assets.map(asset => ({
        id: asset.id,
        fmt: asset.fmt,
        widthPx: asset.widthPx,
        url: asset.url
      })),
      tags: item.tags.map(t => ({
        id: t.tag.id,
        slug: t.tag.slug,
        name: t.tag.i18n.find(i => i.field === 'name')?.value || t.tag.slug
      }))
    }));
  }

  async getMediaFilesByRoute(route: string): Promise<any[]> {
    // Map route to gallery data if it's a gallery route
    if (route === 'gallery' || route === 'students-gallery') {
      const galleryItems = await this.getGalleryItems();
      
      // Convert gallery items to MediaFile format for compatibility
      return galleryItems.map(item => ({
        id: parseInt(item.id.slice(-8), 16), // Convert part of cuid to number for compatibility
        route,
        filename: `${item.slug}.jpg`,
        type: 'image',
        url: item.assets.find(a => a.fmt === 'jpg' && a.widthPx === 640)?.url || 
             item.assets[0]?.url || '/placeholder.jpg',
        createdAt: item.createdAt
      }));
    }
    
    return [];
  }

  // CRM operations (placeholder implementations)
  async getActiveCrmConfig(): Promise<any> {
    return undefined;
  }

  async createCrmConfig(config: any): Promise<any> {
    throw new Error('CRM operations not supported in Prisma storage');
  }

  async updateCrmConfig(id: number, config: any): Promise<any> {
    throw new Error('CRM operations not supported in Prisma storage');
  }

  async createCrmLead(lead: any): Promise<any> {
    throw new Error('CRM operations not supported in Prisma storage');
  }

  async getCrmLeads(): Promise<any[]> {
    return [];
  }

  async updateCrmLead(id: number, lead: any): Promise<any> {
    throw new Error('CRM operations not supported in Prisma storage');
  }
}

export const prismaStorage = new PrismaStorage();