#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface BrokenAsset {
  galleryItemId: number;
  assetId: number;
  slug: string;
  url: string;
  reason: string;
}

async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function findBrokenAssets(): Promise<BrokenAsset[]> {
  const brokenAssets: BrokenAsset[] = [];
  
  console.log('🔍 Scanning main gallery for broken assets...');
  
  // Get all main gallery items with their assets
  const galleryItems = await prisma.galleryItem.findMany({
    where: { type: 'main' },
    include: {
      assets: true
    }
  });
  
  console.log(`Found ${galleryItems.length} gallery items to check`);
  
  for (const item of galleryItems) {
    for (const asset of item.assets) {
      const filePath = path.join(process.cwd(), 'public', asset.url);
      const exists = await checkFileExists(filePath);
      
      if (!exists) {
        brokenAssets.push({
          galleryItemId: item.id,
          assetId: asset.id,
          slug: item.slug,
          url: asset.url,
          reason: 'File not found on disk'
        });
        console.log(`❌ Missing: ${asset.url} (${item.slug})`);
      }
    }
  }
  
  return brokenAssets;
}

async function cleanupBrokenAssets(brokenAssets: BrokenAsset[]): Promise<void> {
  if (brokenAssets.length === 0) {
    console.log('✅ No broken assets found!');
    return;
  }
  
  console.log(`🧹 Cleaning up ${brokenAssets.length} broken assets...`);
  
  // Group by gallery item
  const itemsToCleanup = new Set<number>();
  const assetsToDelete: number[] = [];
  
  for (const broken of brokenAssets) {
    assetsToDelete.push(broken.assetId);
    itemsToCleanup.add(broken.galleryItemId);
  }
  
  // Delete broken assets
  const deleteResult = await prisma.galleryAsset.deleteMany({
    where: {
      id: { in: assetsToDelete }
    }
  });
  
  console.log(`🗑️ Deleted ${deleteResult.count} broken assets`);
  
  // Check if any gallery items have no assets left and remove them
  const emptyItems = await prisma.galleryItem.findMany({
    where: {
      id: { in: Array.from(itemsToCleanup) },
      assets: { none: {} }
    },
    include: { _count: { select: { assets: true } } }
  });
  
  if (emptyItems.length > 0) {
    console.log(`🗑️ Found ${emptyItems.length} gallery items with no assets`);
    
    // Delete i18n entries for empty items
    await prisma.galleryI18n.deleteMany({
      where: {
        galleryItemId: { in: emptyItems.map(item => item.id) }
      }
    });
    
    // Delete empty gallery items
    const deleteItemsResult = await prisma.galleryItem.deleteMany({
      where: {
        id: { in: emptyItems.map(item => item.id) }
      }
    });
    
    console.log(`🗑️ Deleted ${deleteItemsResult.count} empty gallery items`);
  }
}

async function main() {
  try {
    console.log('🧹 Starting main gallery cleanup...');
    
    const brokenAssets = await findBrokenAssets();
    
    if (brokenAssets.length > 0) {
      console.log('\n📋 Summary of broken assets:');
      for (const broken of brokenAssets) {
        console.log(`  ${broken.slug}: ${broken.url} (${broken.reason})`);
      }
      
      await cleanupBrokenAssets(brokenAssets);
    }
    
    console.log('\n✅ Gallery cleanup completed');
    
    // Show final count
    const finalCount = await prisma.galleryItem.count({
      where: { type: 'main' }
    });
    
    console.log(`📊 Main gallery now has ${finalCount} items`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);