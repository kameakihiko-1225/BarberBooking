import { db } from "./db";
import { mediaFiles } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

async function seedMediaFiles() {
  try {
    // Clear existing media files
    await db.delete(mediaFiles);

    const attachedAssetsPath = path.join(process.cwd(), "attached_assets");
    const mediaEntries: Array<{ filename: string; route: string; type: "image" | "video"; url: string }> = [];

    // Process gallery folder
    const galleryPath = path.join(attachedAssetsPath, "gallarey");
    if (fs.existsSync(galleryPath)) {
      const galleryFiles = fs.readdirSync(galleryPath);
      galleryFiles.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const isVideo = ['.mov', '.mp4'].includes(ext);
        const isImage = ['.jpg', '.jpeg', '.png', '.heic'].includes(ext);
        
        if (isImage || isVideo) {
          mediaEntries.push({
            filename: file,
            route: "gallery",
            type: isVideo ? "video" : "image",
            url: `/media/gallarey/${file}`
          });
        }
      });
    }

    // Process student works folder
    const studentWorksPath = path.join(attachedAssetsPath, "student works");
    if (fs.existsSync(studentWorksPath)) {
      const studentFiles = fs.readdirSync(studentWorksPath);
      studentFiles.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const isVideo = ['.mov', '.mp4'].includes(ext);
        const isImage = ['.jpg', '.jpeg', '.png', '.heic'].includes(ext);
        
        if (isImage || isVideo) {
          mediaEntries.push({
            filename: file,
            route: "students-gallery",
            type: isVideo ? "video" : "image",
            url: `/media/student%20works/${encodeURIComponent(file)}`
          });
        }
      });
    }

    // Process success folder
    const successPath = path.join(attachedAssetsPath, "success");
    if (fs.existsSync(successPath)) {
      const successFiles = fs.readdirSync(successPath);
      successFiles.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const isVideo = ['.mov', '.mp4'].includes(ext);
        const isImage = ['.jpg', '.jpeg', '.png', '.heic'].includes(ext);
        
        if (isImage || isVideo) {
          mediaEntries.push({
            filename: file,
            route: "success-stories",
            type: isVideo ? "video" : "image",
            url: `/media/success/${encodeURIComponent(file)}`
          });
        }
      });
    }

    // Process instructors folder
    const instructorsPath = path.join(attachedAssetsPath, "Instructors");
    if (fs.existsSync(instructorsPath)) {
      const instructorFiles = fs.readdirSync(instructorsPath);
      instructorFiles.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const isVideo = ['.mov', '.mp4'].includes(ext);
        const isImage = ['.jpg', '.jpeg', '.png', '.heic'].includes(ext);
        
        if (isImage || isVideo) {
          mediaEntries.push({
            filename: file,
            route: "instructors",
            type: isVideo ? "video" : "image",
            url: `/media/Instructors/${encodeURIComponent(file)}`
          });
        }
      });
    }

    // Insert media entries into database
    if (mediaEntries.length > 0) {
      await db.insert(mediaFiles).values(mediaEntries);
      console.log(`✓ Seeded ${mediaEntries.length} media files to database`);
      console.log(`  - Gallery: ${mediaEntries.filter(m => m.route === "gallery").length} files`);
      console.log(`  - Student Works: ${mediaEntries.filter(m => m.route === "students-gallery").length} files`);
      console.log(`  - Success Stories: ${mediaEntries.filter(m => m.route === "success-stories").length} files`);
      console.log(`  - Instructors: ${mediaEntries.filter(m => m.route === "instructors").length} files`);
    } else {
      console.log("✓ No media files found to seed");
    }

  } catch (error) {
    console.error("✗ Error seeding media files:", error);
  }
}

seedMediaFiles();