import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const BATCH_SIZE = 5; // Process 5 images at a time to avoid timeouts

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
      url: publicUrl,
    });
  }
  
  return variants;
}

async function processImage(imagePath: string, outputDir: string): Promise<void> {
  const filename = path.basename(imagePath);
  const relativePath = path.relative(path.join(__dirname, '..', 'public', 'gallery'), imagePath);
  const slug = filename.replace(/\.[^/.]+$/, '').toLowerCase();
  
  try {
    // Check if already processed
    const existing = await prisma.galleryItem.findUnique({
      where: { slug }
    });
    
    if (existing) {
      console.log(`⏩ Skipped ${slug} (already exists)`);
      return;
    }
    
    console.log(`Processing: ${filename} -> ${slug}`);
    
    // Get image metadata
    const metadata = await sharp(imagePath).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;
    
    // Generate blur placeholder
    const blurDataUrl = await generateBlurData(imagePath);
    
    // Generate variants
    const variants = await generateVariants(imagePath, slug, outputDir);
    
    // Create gallery item
    const galleryItem = await prisma.galleryItem.create({
      data: {
        slug,
        width,
        height,
        blurData: blurDataUrl,
      },
    });
    
    // Create assets in batch
    await prisma.galleryAsset.createMany({
      data: variants.map(variant => ({
        itemId: galleryItem.id,
        fmt: variant.fmt,
        widthPx: variant.widthPx,
        url: variant.url,
      }))
    });
    
    // Create i18n entries
    const locales = ['en', 'pl', 'uk'];
    const fields = ['title', 'alt', 'description'];
    const i18nData: Array<{
      itemId: string;
      locale: string;
      field: string;
      value: string;
    }> = [];
    
    for (const locale of locales) {
      for (const field of fields) {
        let value = '';
        if (locale === 'en') {
          if (field === 'title' || field === 'alt') {
            value = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          }
        }
        
        i18nData.push({
          itemId: galleryItem.id,
          locale,
          field,
          value,
        });
      }
    }
    
    if (i18nData.length > 0) {
      await prisma.galleryI18n.createMany({
        data: i18nData
      });
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
  
  console.log('🚀 Continuing gallery ingestion...');
  console.log(`Gallery directory: ${galleryDir}`);
  console.log(`Processed directory: ${processedDir}`);
  
  await ensureDirectory(processedDir);
  
  try {
    await fs.access(galleryDir);
  } catch {
    console.error(`❌ Gallery directory not found: ${galleryDir}`);
    process.exit(1);
  }

  const files = await fs.readdir(galleryDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.avif'].includes(ext);
  });

  console.log(`📸 Found ${imageFiles.length} images to process`);
  
  // Get already processed items
  const processed = await prisma.galleryItem.findMany({ select: { slug: true } });
  const processedSlugs = new Set(processed.map(p => p.slug));
  
  const unprocessed = imageFiles.filter(file => {
    const slug = path.basename(file).replace(/\.[^/.]+$/, '').toLowerCase();
    return !processedSlugs.has(slug);
  });
  
  console.log(`📸 Need to process ${unprocessed.length} remaining images`);
  
  // Process in batches
  for (let i = 0; i < unprocessed.length; i += BATCH_SIZE) {
    const batch = unprocessed.slice(i, i + BATCH_SIZE);
    console.log(`\n🔄 Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(unprocessed.length/BATCH_SIZE)}`);
    
    for (const file of batch) {
      const imagePath = path.join(galleryDir, file);
      await processImage(imagePath, processedDir);
    }
  }
  
  const finalCount = await prisma.galleryItem.count();
  console.log(`\n🎉 Gallery ingestion complete! Total items: ${finalCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Gallery ingestion failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });