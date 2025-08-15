import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Query validation schema
const galleryQuerySchema = z.object({
  page: z.string().optional().default('1').transform(val => Math.max(1, parseInt(val, 10) || 1)),
  pageSize: z.string().optional().default('30').transform(val => Math.min(100, Math.max(1, parseInt(val, 10) || 30))),
  locale: z.string().optional().default('en').refine(val => ['en', 'pl', 'uk'].includes(val)),
  tag: z.string().optional(),
  type: z.string().optional().default('main').refine(val => ['main', 'students', 'success'].includes(val))
});

interface GalleryAsset {
  fmt: string;
  widthPx: number;
  url: string;
}

interface GalleryItem {
  slug: string;
  width: number;
  height: number;
  blurData: string | null;
  assets: GalleryAsset[];
  i18n: Array<{ field: string; value: string; locale: string }>;
}

function buildSrcsets(assets: GalleryAsset[]): { avif: string; webp: string; jpg: string } {
  const formats = ['avif', 'webp', 'jpg'] as const;
  const srcsets: Record<string, string> = {};
  
  for (const format of formats) {
    const formatAssets = assets
      .filter(asset => asset.fmt === format)
      .sort((a, b) => a.widthPx - b.widthPx);
    
    srcsets[format] = formatAssets
      .map(asset => `${asset.url} ${asset.widthPx}w`)
      .join(', ');
  }
  
  return srcsets as { avif: string; webp: string; jpg: string };
}

function getLocalizedValue(i18n: Array<{ field: string; value: string; locale: string }>, field: string, locale: string, fallbackLocale = 'en'): string {
  // Try requested locale first
  const localized = i18n.find(item => item.field === field && item.locale === locale);
  if (localized && localized.value.trim()) {
    return localized.value;
  }
  
  // Fallback to English if available
  const fallback = i18n.find(item => item.field === field && item.locale === fallbackLocale);
  if (fallback && fallback.value.trim()) {
    return fallback.value;
  }
  
  // Return empty string if nothing found
  return '';
}

router.get('/api/gallery', async (req, res) => {
  try {
    // Set caching headers
    res.set({
      'Cache-Control': 's-maxage=60, stale-while-revalidate=86400',
      'Content-Type': 'application/json'
    });

    // Validate query parameters
    const query = galleryQuerySchema.parse(req.query);
    const { page, pageSize, locale, tag, type } = query;
    
    const skip = (page - 1) * pageSize;
    
    // Build where clause for tag and type filtering
    const whereClause: any = {
      type: type
    };
    
    if (tag) {
      whereClause.tags = {
        some: {
          tag: {
            slug: tag
          }
        }
      };
    }

    // Query gallery items with relationships
    const items = await prisma.galleryItem.findMany({
      where: whereClause,
      include: {
        assets: {
          orderBy: { widthPx: 'asc' }
        },
        i18n: {
          where: {
            OR: [
              { locale },
              { locale: 'en' } // Always include English as fallback
            ]
          }
        },
        tags: {
          include: {
            tag: {
              include: {
                i18n: {
                  where: {
                    OR: [
                      { locale },
                      { locale: 'en' }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize
    });

    // Check if there are more items for pagination
    const totalItems = await prisma.galleryItem.count({ where: whereClause });
    const hasNextPage = skip + pageSize < totalItems;
    const nextPage = hasNextPage ? page + 1 : null;

    // Transform data for response
    const transformedItems = items.map((item: any) => {
      const title = getLocalizedValue(item.i18n, 'title', locale) || 
                   item.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      const alt = getLocalizedValue(item.i18n, 'alt', locale) || title;
      
      return {
        slug: item.slug,
        title,
        alt,
        w: item.width,
        h: item.height,
        srcsets: buildSrcsets(item.assets),
        blurData: item.blurData,
        tags: item.tags.map((tagRelation: any) => ({
          slug: tagRelation.tag.slug,
          name: getLocalizedValue(tagRelation.tag.i18n, 'name', locale) || tagRelation.tag.slug
        }))
      };
    });

    const response = {
      items: transformedItems,
      nextPage,
      totalItems,
      currentPage: page,
      pageSize
    };

    res.json(response);
    
  } catch (error) {
    console.error('[Gallery API] Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: error.errors
      });
    }
    
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Additional endpoint for getting available tags
router.get('/api/gallery/tags', async (req, res) => {
  try {
    res.set({
      'Cache-Control': 's-maxage=300, stale-while-revalidate=86400',
      'Content-Type': 'application/json'
    });

    const locale = req.query.locale as string || 'en';
    
    const tags = await prisma.tag.findMany({
      include: {
        i18n: {
          where: {
            OR: [
              { locale },
              { locale: 'en' }
            ]
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: {
        items: {
          _count: 'desc'
        }
      }
    });

    const transformedTags = tags
      .filter(tag => tag._count.items > 0) // Only return tags with items
      .map(tag => ({
        slug: tag.slug,
        name: getLocalizedValue(tag.i18n, 'name', locale) || tag.slug,
        count: tag._count.items
      }));

    res.json({ tags: transformedTags });
    
  } catch (error) {
    console.error('[Gallery Tags API] Error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;