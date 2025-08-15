import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const execAsync = promisify(exec);

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

async function generateVideoThumbnail(videoPath: string, outputPath: string): Promise<{ width: number; height: number; blurData: string }> {
  // Generate thumbnail at 1 second mark
  const thumbnailPath = outputPath.replace(path.extname(outputPath), '_thumb.jpg');
  
  try {
    await execAsync(`ffmpeg -i "${videoPath}" -ss 00:00:01 -frames:v 1 -q:v 2 -y "${thumbnailPath}"`);
    
    // Get video metadata
    const { stdout } = await execAsync(`ffprobe -v quiet -print_format json -show_streams "${videoPath}"`);
    const probe = JSON.parse(stdout);
    const videoStream = probe.streams.find((s: any) => s.codec_type === 'video');
    
    const width = videoStream?.width || 1920;
    const height = videoStream?.height || 1080;
    
    // Generate blur data from thumbnail
    const blurData = await generateBlurData(thumbnailPath);
    
    return { width, height, blurData };
  } catch (error) {
    console.error(`Error generating video thumbnail: ${error}`);
    // Fallback values
    return { 
      width: 1920, 
      height: 1080, 
      blurData: 'data:image/jpeg;base64,/9j/2wBDACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//j/2wBDASstLTw1PHZBQXb4pYyl+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/wAARCAAUAA8DASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAwACBP/EAB8QAAICAgIDAQAAAAAAAAAAAAECAAMEERIhMUFCwf/EABYBAQEBAAAAAAAAAAAAAAAAAAEAAv/EABYRAQEBAAAAAAAAAAAAAAAAAAABQf/aAAwDAQACEQMRAD8A'
    };
  }
}

function isVideoFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ['.mov', '.mp4', '.webm', '.avi'].includes(ext);
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
      if (['.jpg', '.jpeg', '.png', '.webp', '.heic', '.avif', '.mov', '.mp4', '.webm'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

async function processMedia(mediaPath: string, galleryDir: string, processedDir: string): Promise<void> {
  const relativePath = path.relative(galleryDir, mediaPath);
  const slug = slugify(relativePath);
  
  console.log(`Processing: ${relativePath} -> ${slug}`);
  
  try {
    let width: number, height: number, blurData: string, variants: any[], isVideo = false;
    
    if (isVideoFile(mediaPath)) {
      // Process video file
      isVideo = true;
      const videoData = await generateVideoThumbnail(mediaPath, mediaPath);
      width = videoData.width;
      height = videoData.height;
      blurData = videoData.blurData;
      
      // For videos, we create a single asset entry pointing to the original video
      variants = [{
        fmt: 'video',
        widthPx: width,
        url: `/gallery/${path.basename(mediaPath)}`
      }];
    } else {
      // Process image file
      const metadata = await sharp(mediaPath).metadata();
      width = metadata.width || 0;
      height = metadata.height || 0;
      
      // Generate blur placeholder
      blurData = await generateBlurData(mediaPath);
      
      // Generate variants
      variants = await generateVariants(mediaPath, slug, processedDir);
    }
    
    // Upsert GalleryItem with video indicator
    const galleryItem = await prisma.galleryItem.upsert({
      where: { slug },
      update: {
        type: 'main',
        width,
        height,
        blurData,
      },
      create: {
        slug,
        type: 'main',
        width,
        height,
        blurData,
      },
    });
    
    // Remove existing assets for this item
    await prisma.galleryAsset.deleteMany({
      where: { itemId: galleryItem.id }
    });
    
    // Create new assets in batch
    await prisma.galleryAsset.createMany({
      data: variants.map(variant => ({
        itemId: galleryItem.id,
        fmt: variant.fmt,
        widthPx: variant.widthPx,
        url: variant.url,
      }))
    });
    
    // Upsert i18n entries (create if missing) - batch process
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
          
          i18nData.push({
            itemId: galleryItem.id,
            locale,
            field,
            value,
          });
        }
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
  
  // Walk directory and find media files (images and videos)
  const mediaFiles = await walkDirectory(galleryDir);
  console.log(`📸 Found ${mediaFiles.length} media files to process`);
  
  if (mediaFiles.length === 0) {
    console.log('ℹ️  No media files found to process');
    return;
  }
  
  // Process each media file
  for (const mediaPath of mediaFiles) {
    await processMedia(mediaPath, galleryDir, processedDir);
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