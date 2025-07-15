import fs from 'fs';
import path from 'path';
import { db } from '../server/db.js';
import { mediaFiles } from '../shared/schema.js';

async function syncGallery() {
  const galleryPath = path.join(process.cwd(), 'public/media/gallery');
  
  if (!fs.existsSync(galleryPath)) {
    console.log('Gallery directory not found');
    return;
  }

  const files = fs.readdirSync(galleryPath);
  const mediaItems = [];

  for (const file of files) {
    const filePath = path.join(galleryPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      const ext = path.extname(file).toLowerCase();
      let type = 'image';
      
      if (['.mov', '.mp4', '.avi', '.webm'].includes(ext)) {
        type = 'video';
      } else if (!['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        continue; // Skip non-media files
      }
      
      mediaItems.push({
        route: 'gallery',
        filename: file,
        type: type,
        url: `/public/media/gallery/${file}`
      });
    }
  }

  console.log(`Found ${mediaItems.length} media files`);
  
  // Insert all media items
  if (mediaItems.length > 0) {
    await db.insert(mediaFiles).values(mediaItems);
    console.log('Gallery sync complete');
  }
}

syncGallery().catch(console.error);