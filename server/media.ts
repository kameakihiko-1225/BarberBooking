import fs from "fs";
import path from "path";
import sharp from "sharp";
import { log } from "./vite";
import { db } from "./db";
import { mediaFiles } from "@shared/schema";
import { eq } from "drizzle-orm";

export type MediaItem = {
  src: string; // web accessible path (starting with /media/...)
  type: "image" | "video";
};

const ASSETS_ROOT = path.resolve(process.cwd(), "attached_assets");
// Map API param -> folder on disk
const ROUTE_MAP: Record<string, string> = {
  gallery: "gallarey",
  "students-gallery": "student works",
  "success-stories": "success",
  "instructors": "Instructors",
};

// Cache to avoid re-scanning on every request
const mediaCache: Record<string, MediaItem[]> = {};

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function convertHeicToJpg(srcPath: string, destPath: string): Promise<boolean> {
  try {
    await sharp(srcPath).jpeg({ quality: 85 }).toFile(destPath);
    return true;
  } catch (e) {
    log(`sharp failed converting ${srcPath}: ${(e as Error).message}`, "media");
    try {
      const { default: convert } = await import("heic-convert");
      const input = fs.readFileSync(srcPath);
      const output = await (convert as any)({ buffer: input, format: "JPEG", quality: 0.8 });
      fs.writeFileSync(destPath, output);
      return true;
    } catch (e2) {
      log(`heic-convert failed converting ${srcPath}: ${(e2 as Error).message}`, "media");
      return false;
    }
  }
}

export async function getMediaList(routeParam: string): Promise<MediaItem[]> {
  if (mediaCache[routeParam]) return mediaCache[routeParam];

  const folder = ROUTE_MAP[routeParam];
  if (!folder) throw new Error("Invalid media route");

  const dirPath = path.join(ASSETS_ROOT, folder);
  if (!fs.existsSync(dirPath)) throw new Error("Media folder not found");

  const PUBLIC_ROOT = path.resolve("server", "public", "media", folder);
  ensureDir(PUBLIC_ROOT);

  const entries = fs.readdirSync(dirPath);
  const items: MediaItem[] = [];
  for (const name of entries) {
    const ext = path.extname(name).toLowerCase();
    const absPath = path.join(dirPath, name);
    const base = path.parse(name).name;

    if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      const destRel = `/media/${folder}/${name}`.replace(/ /g, '%20');
      const destAbs = path.join(PUBLIC_ROOT, name);
      if (!fs.existsSync(destAbs)) {
        fs.copyFileSync(absPath, destAbs);
      }
      items.push({ src: destRel, type: "image" });
    } else if ([".mp4", ".mov"].includes(ext)) {
      const destRel = `/media/${folder}/${name}`.replace(/ /g, '%20');
      const destAbs = path.join(PUBLIC_ROOT, name);
      if (!fs.existsSync(destAbs)) {
        fs.copyFileSync(absPath, destAbs);
      }
      items.push({ src: destRel, type: "video" });
    } else if (ext === ".heic" || ext === ".heif") {
      const newName = `${base}.jpg`;
      const destRel = `/media/${folder}/${newName}`.replace(/ /g, '%20');
      const destAbs = path.join(PUBLIC_ROOT, newName);
      let ok = true;
      if (!fs.existsSync(destAbs)) {
        ok = await convertHeicToJpg(absPath, destAbs);
      }
      if (ok) {
        items.push({ src: destRel, type: "image" });
      }
    }
  }

  // randomize for variety
  items.sort(() => Math.random() - 0.5);
  // Persist to database (best-effort)
  try {
    const existing = await db
      .select({ url: mediaFiles.url })
      .from(mediaFiles)
      .where(eq(mediaFiles.route, routeParam));
    const seen = new Set(existing.map((r) => r.url));
    const inserts = items
      .filter((i) => !seen.has(i.src))
      .map((i) => ({ route: routeParam, filename: path.basename(i.src), type: i.type, url: i.src }));
    if (inserts.length) {
      await db.insert(mediaFiles).values(inserts);
    }
  } catch (e) {
    log(`DB persist failed: ${(e as Error).message}`, "media");
  }
  mediaCache[routeParam] = items;
  return items;
} 