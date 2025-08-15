import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function cleanupGallery() {
  const projectRoot = path.resolve(__dirname, '..');
  const processedDir = path.join(projectRoot, 'public', 'gallery', '_processed');
  
  console.log('🧹 Starting gallery cleanup...');
  
  // Get all gallery items
  const galleryItems = await prisma.galleryItem.findMany({
    include: {
      assets: true,
      i18n: true
    }
  });
  
  console.log(`📊 Found ${galleryItems.length} gallery items`);
  
  const duplicateGroups = new Map<string, typeof galleryItems>();
  
  // Group items by base name (normalize underscores and dashes)
  for (const item of galleryItems) {
    const normalizedSlug = item.slug.replace(/_/g, '-');
    if (!duplicateGroups.has(normalizedSlug)) {
      duplicateGroups.set(normalizedSlug, []);
    }
    duplicateGroups.get(normalizedSlug)!.push(item);
  }
  
  // Find groups with duplicates
  const duplicatesList = Array.from(duplicateGroups.entries())
    .filter(([_, items]) => items.length > 1);
  
  console.log(`🔍 Found ${duplicatesList.length} groups with duplicates`);
  
  for (const [normalizedSlug, duplicates] of duplicatesList) {
    console.log(`\n🔧 Processing duplicates for: ${normalizedSlug}`);
    console.log(`   Items: ${duplicates.map(d => d.slug).join(', ')}`);
    
    // Check which files actually exist
    const existingItems = [];
    
    for (const item of duplicates) {
      const sampleAsset = item.assets[0];
      if (sampleAsset) {
        const filePath = path.join(processedDir, path.basename(sampleAsset.url));
        try {
          await fs.access(filePath);
          existingItems.push(item);
          console.log(`   ✓ Files exist for: ${item.slug}`);
        } catch {
          console.log(`   ✗ Files missing for: ${item.slug}`);
        }
      }
    }
    
    if (existingItems.length === 0) {
      console.log(`   ⚠️  No files exist for any variant of ${normalizedSlug}`);
      continue;
    }
    
    // Keep the first item with existing files, remove others
    const keepItem = existingItems[0];
    const removeItems = duplicates.filter(item => item.id !== keepItem.id);
    
    console.log(`   📌 Keeping: ${keepItem.slug}`);
    
    for (const removeItem of removeItems) {
      console.log(`   🗑️  Removing: ${removeItem.slug}`);
      
      // Delete assets
      await prisma.galleryAsset.deleteMany({
        where: { itemId: removeItem.id }
      });
      
      // Delete i18n entries
      await prisma.galleryI18n.deleteMany({
        where: { itemId: removeItem.id }
      });
      
      // Delete the item
      await prisma.galleryItem.delete({
        where: { id: removeItem.id }
      });
    }
  }
  
  // Verify all remaining items have valid files
  console.log('\n🔍 Verifying remaining items...');
  const remainingItems = await prisma.galleryItem.findMany({
    include: { assets: true }
  });
  
  let brokenCount = 0;
  
  for (const item of remainingItems) {
    const sampleAsset = item.assets[0];
    if (sampleAsset) {
      const filePath = path.join(processedDir, path.basename(sampleAsset.url));
      try {
        await fs.access(filePath);
      } catch {
        console.log(`   ⚠️  Broken item found: ${item.slug} -> ${sampleAsset.url}`);
        brokenCount++;
      }
    }
  }
  
  const finalCount = await prisma.galleryItem.count();
  
  console.log(`\n✅ Cleanup completed!`);
  console.log(`   Final gallery items: ${finalCount}`);
  console.log(`   Broken items remaining: ${brokenCount}`);
  
  if (brokenCount === 0) {
    console.log('   🎉 All items have valid files!');
  }
}

cleanupGallery()
  .catch((e) => {
    console.error('❌ Cleanup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });