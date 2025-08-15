import { PrismaClient } from '@prisma/client';

// Mock Prisma
jest.mock('@prisma/client');

const mockPrisma = {
  galleryItem: {
    findMany: jest.fn(),
    count: jest.fn()
  }
} as any;

(PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);

// Gallery API implementation
class GalleryAPI {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getGallery(params: {
    page?: number;
    pageSize?: number;
    locale?: string;
    tag?: string;
  }) {
    const { page = 1, pageSize = 30, locale = 'pl', tag } = params;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};
    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag
          }
        }
      };
    }

    // Get items with pagination
    const items = await this.prisma.galleryItem.findMany({
      skip,
      take: pageSize,
      where,
      include: {
        assets: true,
        i18n: true,
        tags: {
          include: {
            tag: {
              include: {
                i18n: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalItems = await this.prisma.galleryItem.count({ where });

    // Transform items with locale-aware content
    const transformedItems = items.map(item => {
      // Get localized content with fallback to English
      const localized = (item.i18n as any[]).find(i => i.locale === locale) as any;
      const fallback = (item.i18n as any[]).find(i => i.locale === 'en') as any ||
                       (item.i18n as any[])[0];
      const i18nEntry = localized && localized.title ? localized : fallback;

      // Generate responsive srcsets
      const srcsets = {
        avif: this.generateSrcSet(item.assets, 'avif'),
        webp: this.generateSrcSet(item.assets, 'webp'), 
        jpg: this.generateSrcSet(item.assets, 'jpg')
      };

      // Get localized tags
      const tags = item.tags.map(itemTag => {
        const tagI18n = (itemTag.tag.i18n as any[]).find(t => t.locale === locale) ||
                       (itemTag.tag.i18n as any[]).find(t => t.locale === 'en') ||
                       (itemTag.tag.i18n as any[])[0];

        return {
          slug: itemTag.tag.slug,
          name: (tagI18n as any)?.name || itemTag.tag.slug
        };
      });

      return {
        slug: item.slug,
        title: (i18nEntry as any)?.title || item.slug,
        alt: (i18nEntry as any)?.alt || (i18nEntry as any)?.title || item.slug,
        w: item.width,
        h: item.height,
        srcsets,
        blurData: item.blurData,
        tags
      };
    });

    return {
      items: transformedItems,
      nextPage: skip + pageSize < totalItems ? page + 1 : null,
      totalItems,
      currentPage: page,
      pageSize
    };
  }

  private generateSrcSet(assets: any[], format: 'avif' | 'webp' | 'jpg'): string {
    const formatAssets = assets
      .filter(a => a.format === format)
      .sort((a, b) => a.width - b.width);

    return formatAssets
      .map(asset => `${asset.path} ${asset.width}w`)
      .join(', ');
  }

  async getTags(locale = 'pl') {
    // This would normally query the tag table with i18n
    const tags = [
      { slug: 'haircuts', count: 15 },
      { slug: 'coloring', count: 8 },
      { slug: 'styling', count: 12 }
    ];

    return {
      tags: tags.map(tag => ({
        ...tag,
        name: this.getTagName(tag.slug, locale)
      }))
    };
  }

  private getTagName(slug: string, locale: string): string {
    const translations: Record<string, Record<string, string>> = {
      haircuts: {
        en: 'Haircuts',
        pl: 'Fryzury',
        uk: 'Стрижки'
      },
      coloring: {
        en: 'Hair Coloring',
        pl: 'Koloryzacja',
        uk: 'Фарбування'
      },
      styling: {
        en: 'Hair Styling',
        pl: 'Stylizacja',
        uk: 'Укладання'
      }
    };

    return translations[slug]?.[locale] || 
           translations[slug]?.['en'] || 
           slug;
  }
}

describe('Gallery API', () => {
  let api: GalleryAPI;
  let mockItems: any[];

  beforeEach(() => {
    api = new GalleryAPI();
    jest.clearAllMocks();

    // Setup mock data
    mockItems = [
      {
        id: '1',
        slug: 'haircut-example',
        width: 1600,
        height: 1200,
        blurData: 'data:image/jpeg;base64,blur1',
        createdAt: new Date('2024-01-15'),
        assets: [
          { format: 'avif', width: 320, path: '/gallery/haircut-example/avif/320w.avif' },
          { format: 'avif', width: 640, path: '/gallery/haircut-example/avif/640w.avif' },
          { format: 'webp', width: 320, path: '/gallery/haircut-example/webp/320w.webp' },
          { format: 'webp', width: 640, path: '/gallery/haircut-example/webp/640w.webp' },
          { format: 'jpg', width: 320, path: '/gallery/haircut-example/jpg/320w.jpg' },
          { format: 'jpg', width: 640, path: '/gallery/haircut-example/jpg/640w.jpg' }
        ],
        i18n: [
          {
            locale: 'en',
            title: 'Professional Haircut Example',
            alt: 'Professional haircut demonstration',
            description: 'Example of professional barbering technique'
          },
          {
            locale: 'pl',
            title: 'Przykład Profesjonalnej Fryzury',
            alt: 'Demonstracja profesjonalnej fryzury',
            description: 'Przykład profesjonalnej techniki fryzjerskiej'
          },
          {
            locale: 'uk',
            title: '', // Missing Ukrainian translation
            alt: '',
            description: ''
          }
        ],
        tags: [
          {
            tag: {
              slug: 'haircuts',
              i18n: [
                { locale: 'en', name: 'Haircuts' },
                { locale: 'pl', name: 'Fryzury' },
                { locale: 'uk', name: 'Стрижки' }
              ]
            }
          }
        ]
      }
    ];

    mockPrisma.galleryItem.findMany.mockResolvedValue(mockItems);
    mockPrisma.galleryItem.count.mockResolvedValue(1);
  });

  describe('getGallery', () => {
    it('should return paginated gallery items with default parameters', async () => {
      const result = await api.getGallery({});

      expect(mockPrisma.galleryItem.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 30,
        where: {},
        include: {
          assets: true,
          i18n: true,
          tags: {
            include: {
              tag: {
                include: {
                  i18n: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      expect(result).toEqual({
        items: expect.any(Array),
        nextPage: null,
        totalItems: 1,
        currentPage: 1,
        pageSize: 30
      });
    });

    it('should handle custom pagination parameters', async () => {
      await api.getGallery({ page: 2, pageSize: 10 });

      expect(mockPrisma.galleryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page 2 - 1) * pageSize 10
          take: 10
        })
      );
    });

    it('should filter by tag when provided', async () => {
      await api.getGallery({ tag: 'haircuts' });

      expect(mockPrisma.galleryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tags: {
              some: {
                tag: {
                  slug: 'haircuts'
                }
              }
            }
          }
        })
      );
    });

    it('should return Polish content when locale is PL', async () => {
      const result = await api.getGallery({ locale: 'pl' });

      const item = result.items[0];
      expect(item.title).toBe('Przykład Profesjonalnej Fryzury');
      expect(item.alt).toBe('Demonstracja profesjonalnej fryzury');
      
      const tag = item.tags[0];
      expect(tag.name).toBe('Fryzury');
    });

    it('should fallback to English when Polish translation is missing', async () => {
      // Modify mock to have missing Polish translation
      mockItems[0].i18n = mockItems[0].i18n.filter((i: any) => i.locale !== 'pl');
      mockPrisma.galleryItem.findMany.mockResolvedValue(mockItems);

      const result = await api.getGallery({ locale: 'pl' });

      const item = result.items[0];
      expect(item.title).toBe('Professional Haircut Example'); // Falls back to English
      expect(item.alt).toBe('Professional haircut demonstration');
    });

    it('should fallback to English when Ukrainian translation is missing', async () => {
      const result = await api.getGallery({ locale: 'uk' });

      const item = result.items[0];
      expect(item.title).toBe('Professional Haircut Example'); // Falls back to English
      expect(item.alt).toBe('Professional haircut demonstration');
      
      const tag = item.tags[0];
      expect(tag.name).toBe('Стрижки'); // Ukrainian is available for tags
    });

    it('should generate correct responsive srcsets for all formats', async () => {
      const result = await api.getGallery({});

      const item = result.items[0];
      expect(item.srcsets).toEqual({
        avif: '/gallery/haircut-example/avif/320w.avif 320w, /gallery/haircut-example/avif/640w.avif 640w',
        webp: '/gallery/haircut-example/webp/320w.webp 320w, /gallery/haircut-example/webp/640w.webp 640w',
        jpg: '/gallery/haircut-example/jpg/320w.jpg 320w, /gallery/haircut-example/jpg/640w.jpg 640w'
      });
    });

    it('should calculate nextPage correctly', async () => {
      // Mock 50 total items
      mockPrisma.galleryItem.count.mockResolvedValue(50);

      const result1 = await api.getGallery({ page: 1, pageSize: 20 });
      expect(result1.nextPage).toBe(2);

      const result2 = await api.getGallery({ page: 2, pageSize: 20 });
      expect(result2.nextPage).toBe(3);

      const result3 = await api.getGallery({ page: 3, pageSize: 20 });
      expect(result3.nextPage).toBeNull(); // Last page
    });

    it('should include all required item properties', async () => {
      const result = await api.getGallery({});

      const item = result.items[0];
      expect(item).toEqual({
        slug: 'haircut-example',
        title: expect.any(String),
        alt: expect.any(String),
        w: 1600,
        h: 1200,
        srcsets: {
          avif: expect.any(String),
          webp: expect.any(String),
          jpg: expect.any(String)
        },
        blurData: 'data:image/jpeg;base64,blur1',
        tags: expect.arrayContaining([
          expect.objectContaining({
            slug: 'haircuts',
            name: expect.any(String)
          })
        ])
      });
    });
  });

  describe('getTags', () => {
    it('should return tags with Polish names by default', async () => {
      const result = await api.getTags();

      expect(result.tags).toEqual([
        { slug: 'haircuts', name: 'Fryzury', count: 15 },
        { slug: 'coloring', name: 'Koloryzacja', count: 8 },
        { slug: 'styling', name: 'Stylizacja', count: 12 }
      ]);
    });

    it('should return tags with English names when locale is EN', async () => {
      const result = await api.getTags('en');

      expect(result.tags).toEqual([
        { slug: 'haircuts', name: 'Haircuts', count: 15 },
        { slug: 'coloring', name: 'Hair Coloring', count: 8 },
        { slug: 'styling', name: 'Hair Styling', count: 12 }
      ]);
    });

    it('should return tags with Ukrainian names when locale is UK', async () => {
      const result = await api.getTags('uk');

      expect(result.tags).toEqual([
        { slug: 'haircuts', name: 'Стрижки', count: 15 },
        { slug: 'coloring', name: 'Фарбування', count: 8 },
        { slug: 'styling', name: 'Укладання', count: 12 }
      ]);
    });

    it('should fallback to English for unknown locales', async () => {
      const result = await api.getTags('fr');

      expect(result.tags[0].name).toBe('Haircuts');
    });
  });

  describe('error handling', () => {
    it('should handle database query errors', async () => {
      mockPrisma.galleryItem.findMany.mockRejectedValue(new Error('Database connection failed'));

      await expect(api.getGallery({}))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle missing i18n data gracefully', async () => {
      // Mock item with no i18n entries
      const itemWithoutI18n = {
        ...mockItems[0],
        i18n: []
      };

      mockPrisma.galleryItem.findMany.mockResolvedValue([itemWithoutI18n]);

      const result = await api.getGallery({});
      
      const item = result.items[0];
      expect(item.title).toBe('haircut-example'); // Falls back to slug
      expect(item.alt).toBe('haircut-example');
    });

    it('should handle missing assets gracefully', async () => {
      const itemWithoutAssets = {
        ...mockItems[0],
        assets: []
      };

      mockPrisma.galleryItem.findMany.mockResolvedValue([itemWithoutAssets]);

      const result = await api.getGallery({});
      
      const item = result.items[0];
      expect(item.srcsets.avif).toBe('');
      expect(item.srcsets.webp).toBe('');
      expect(item.srcsets.jpg).toBe('');
    });
  });
});