import { db } from './db';
import { mediaFiles } from '../shared/schema';
import * as fs from 'fs';
import * as path from 'path';

async function seedSuccessMedia() {
  console.log('Starting success stories media migration...');
  
  const successDir = path.join(process.cwd(), 'attached_assets', 'success');
  
  try {
    // Check if success directory exists
    if (!fs.existsSync(successDir)) {
      console.log('Success directory not found, skipping migration');
      return;
    }

    const files = fs.readdirSync(successDir);
    console.log(`Found ${files.length} files in success directory`);

    // Clear existing success-stories entries
    await db.delete(mediaFiles).where(eq(mediaFiles.route, 'success-stories'));
    console.log('Cleared existing success-stories entries');

    const mediaEntries = [];

    for (const filename of files) {
      // Skip hidden files and directories
      if (filename.startsWith('.')) continue;

      const filePath = path.join(successDir, filename);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const ext = path.extname(filename).toLowerCase();
        
        // Determine file type
        let type: 'image' | 'video' = 'image';
        if (['.mov', '.mp4', '.avi', '.webm'].includes(ext)) {
          type = 'video';
        }

        // Create media file entry
        const mediaEntry = {
          filename: filename,
          url: `/media/success/${filename}`,
          route: 'success-stories',
          type: type,
          createdAt: new Date(),
        };

        mediaEntries.push(mediaEntry);
      }
    }

    // Insert all media entries
    if (mediaEntries.length > 0) {
      await db.insert(mediaFiles).values(mediaEntries);
      console.log(`Successfully migrated ${mediaEntries.length} success story files to database`);
      
      // Log the files that were migrated
      mediaEntries.forEach(entry => {
        console.log(`  - ${entry.filename} (${entry.type})`);
      });
    } else {
      console.log('No valid media files found in success directory');
    }

  } catch (error) {
    console.error('Error migrating success media:', error);
    throw error;
  }
}

// Import the eq function
import { eq } from 'drizzle-orm';

export { seedSuccessMedia };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSuccessMedia()
    .then(() => {
      console.log('Success media migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}