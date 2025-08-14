import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

interface ImageVariant {
  width: number;
  format: 'avif' | 'webp' | 'jpg';
}

const VARIANTS: ImageVariant[] = [
  { width: 320, format: 'avif' },
  { width: 320, format: 'webp' },
  { width: 320, format: 'jpg' },
  { width: 640, format: 'avif' },
  { width: 640, format: 'webp' },
  { width: 640, format: 'jpg' },
  { width: 1024, format: 'avif' },
  { width: 1024, format: 'webp' },
  { width: 1024, format: 'jpg' },
  { width: 1600, format: 'avif' },
  { width: 1600, format: 'webp' },
  { width: 1600, format: 'jpg' },
];

async function generateBlurData(imagePath: string): Promise<string> {
  const buffer = await sharp(imagePath)
    .resize(20, 20, { fit: 'inside' })
    .jpeg({ quality: 20 })
    .toBuffer();
  
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function generateVariants(
  inputPath: string, 
  slug: string, 
  outputDir: string
): Promise<{ fmt: string; widthPx: number; url: string }[]> {
  const variants: { fmt: string; widthPx: number; url: string }[] = [];
  
  for (const variant of VARIANTS) {
    const filename = `${slug}-${variant.width}.${variant.format}`;
    const outputPath = path.join(outputDir, filename);
    const publicUrl = `/gallery/_processed/${filename}`;
    
    let sharpInstance = sharp(inputPath).resize(variant.width, null, {
      withoutEnlargement: true,
      fit: 'inside'
    });
    
    switch (variant.format) {
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality: 80 });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: 85 });
        break;
      case 'jpg':
        sharpInstance = sharpInstance.jpeg({ quality: 90, progressive: true });
        break;
    }
    
    await sharpInstance.toFile(outputPath);
    
    variants.push({
      fmt: variant.format,
      widthPx: variant.width,
      url: publicUrl
    });
  }
  
  return variants;
}

function slugify(filename: string): string {
  return path.parse(filename).name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function walkDirectory(dir: string): Promise<string[]> {
  const files: string[] = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory() && item.name !== '_processed') {
      const subFiles = await walkDirectory(fullPath);
      files.push(...subFiles);
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

async function processImage(imagePath: string, galleryDir: string, processedDir: string): Promise<void> {
  const relativePath = path.relative(galleryDir, imagePath);
  const slug = slugify(relativePath);
  
  console.log(`Processing: ${relativePath} -> ${slug}`);
  
  try {
    // Get image metadata
    const metadata = await sharp(imagePath).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;
    
    // Generate blur placeholder
    const blurData = await generateBlurData(imagePath);
    
    // Generate variants
    const variants = await generateVariants(imagePath, slug, processedDir);
    
    // Upsert GalleryItem
    const galleryItem = await prisma.galleryItem.upsert({
      where: { slug },
      update: {
        width,
        height,
        blurData,
      },
      create: {
        slug,
        width,
        height,
        blurData,
      },
    });
    
    // Remove existing assets for this item
    await prisma.galleryAsset.deleteMany({
      where: { itemId: galleryItem.id }
    });
    
    // Create new assets
    for (const variant of variants) {
      await prisma.galleryAsset.create({
        data: {
          itemId: galleryItem.id,
          fmt: variant.fmt,
          widthPx: variant.widthPx,
          url: variant.url,
        },
      });
    }
    
    // Upsert i18n entries (create if missing)
    const locales = ['en', 'pl', 'uk'];
    const fields = ['title', 'alt', 'description'];
    
    for (const locale of locales) {
      for (const field of fields) {
        const existing = await prisma.galleryI18n.findUnique({
          where: {
            itemId_locale_field: {
              itemId: galleryItem.id,
              locale,
              field,
            },
          },
        });
        
        if (!existing) {
          let value = '';
          if (locale === 'en') {
            // Use slug as default English value
            if (field === 'title' || field === 'alt') {
              value = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
          }
          // PL/UK remain empty as specified
          
          await prisma.galleryI18n.create({
            data: {
              itemId: galleryItem.id,
              locale,
              field,
              value,
            },
          });
        }
      }
    }
    
    console.log(`✓ Processed ${slug} (${variants.length} variants)`);
    
  } catch (error) {
    console.error(`✗ Failed to process ${relativePath}:`, error);
  }
}

async function main(): Promise<void> {
  const projectRoot = path.resolve(__dirname, '..');
  const galleryDir = path.join(projectRoot, 'public', 'gallery');
  const processedDir = path.join(galleryDir, '_processed');
  
  console.log('🚀 Starting gallery ingestion...');
  console.log(`Gallery directory: ${galleryDir}`);
  console.log(`Processed directory: ${processedDir}`);
  
  // Ensure processed directory exists
  await ensureDirectory(processedDir);
  
  try {
    // Check if gallery directory exists
    await fs.access(galleryDir);
  } catch {
    console.error(`❌ Gallery directory not found: ${galleryDir}`);
    process.exit(1);
  }
  
  // Walk directory and find images
  const imageFiles = await walkDirectory(galleryDir);
  console.log(`📸 Found ${imageFiles.length} images to process`);
  
  if (imageFiles.length === 0) {
    console.log('ℹ️  No images found to process');
    return;
  }
  
  // Process each image
  for (const imagePath of imageFiles) {
    await processImage(imagePath, galleryDir, processedDir);
  }
  
  console.log('✅ Gallery ingestion completed!');
  
  // Log summary
  const totalItems = await prisma.galleryItem.count();
  const totalAssets = await prisma.galleryAsset.count();
  const totalI18n = await prisma.galleryI18n.count();
  
  console.log(`📊 Summary:`);
  console.log(`   - Gallery Items: ${totalItems}`);
  console.log(`   - Assets: ${totalAssets}`);
  console.log(`   - I18n Entries: ${totalI18n}`);
}

// Run the script
main()
  .catch((error) => {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });