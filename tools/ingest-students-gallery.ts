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
    const publicUrl = `/gallery-students/_processed/${filename}`;
    
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

function generateSlug(filename: string): string {
  return path.parse(filename).name.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

function generateTitle(filename: string): string {
  const name = path.parse(filename).name;
  return name.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

async function processImage(filePath: string, relativePath: string, outputDir: string) {
  const filename = path.basename(filePath);
  const slug = generateSlug(filename);
  
  console.log(`Processing students gallery: ${filename} -> ${slug}`);
  
  try {
    // Get image metadata
    const metadata = await sharp(filePath).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;
    
    // Generate blur placeholder
    const blurData = await generateBlurData(filePath);
    
    // Generate image variants
    const assets = await generateVariants(filePath, slug, outputDir);
    
    // Create or update gallery item
    const galleryItem = await prisma.galleryItem.upsert({
      where: { slug },
      update: {
        type: 'students',
        width,
        height,
        blurData,
      },
      create: {
        slug,
        type: 'students',
        width,
        height,
        blurData,
      },
    });
    
    // Clear existing assets
    await prisma.galleryAsset.deleteMany({
      where: { itemId: galleryItem.id }
    });
    
    // Create new assets
    for (const asset of assets) {
      await prisma.galleryAsset.create({
        data: {
          itemId: galleryItem.id,
          fmt: asset.fmt,
          widthPx: asset.widthPx,
          url: asset.url,
        },
      });
    }
    
    // Create or update i18n entries
    const title = generateTitle(filename);
    
    for (const locale of ['en', 'pl', 'uk']) {
      // Title
      await prisma.galleryI18n.upsert({
        where: {
          itemId_locale_field: {
            itemId: galleryItem.id,
            locale,
            field: 'title'
          }
        },
        update: { value: locale === 'en' ? title : '' },
        create: {
          itemId: galleryItem.id,
          locale,
          field: 'title',
          value: locale === 'en' ? title : ''
        }
      });
      
      // Alt text
      await prisma.galleryI18n.upsert({
        where: {
          itemId_locale_field: {
            itemId: galleryItem.id,
            locale,
            field: 'alt'
          }
        },
        update: { value: locale === 'en' ? title : '' },
        create: {
          itemId: galleryItem.id,
          locale,
          field: 'alt',
          value: locale === 'en' ? title : ''
        }
      });
    }
    
    return { success: true, slug };
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
    return { success: false, error: error.message, slug };
  }
}

async function main() {
  try {
    const galleryDir = path.resolve(__dirname, '../public/gallery-students');
    const outputDir = path.resolve(__dirname, '../public/gallery-students/_processed');
    
    console.log('📸 Starting students gallery ETL process...');
    console.log(`📁 Source: ${galleryDir}`);
    console.log(`📁 Output: ${outputDir}`);
    
    // Ensure output directory exists
    await ensureDirectory(outputDir);
    
    // Read gallery directory
    const files = await fs.readdir(galleryDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.avif'].includes(ext);
    });
    
    console.log(`🖼️ Found ${imageFiles.length} images to process`);
    
    let processed = 0;
    let errors = 0;
    
    // Process images in batches to avoid overwhelming the system
    const BATCH_SIZE = 5;
    for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
      const batch = imageFiles.slice(i, i + BATCH_SIZE);
      
      const promises = batch.map(async (file) => {
        const filePath = path.join(galleryDir, file);
        const relativePath = path.relative(galleryDir, filePath);
        return processImage(filePath, relativePath, outputDir);
      });
      
      const results = await Promise.all(promises);
      
      for (const result of results) {
        if (result.success) {
          processed++;
          console.log(`✅ ${result.slug}`);
        } else {
          errors++;
          console.log(`❌ ${result.slug}: ${result.error}`);
        }
      }
      
      // Small delay between batches
      if (i + BATCH_SIZE < imageFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`\n🎉 Students gallery ETL completed!`);
    console.log(`✅ Processed: ${processed}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total items: ${processed + errors}`);
    
  } catch (error) {
    console.error('❌ ETL process failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();