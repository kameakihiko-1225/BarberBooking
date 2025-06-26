import "dotenv/config";
import fs from "fs";
import path from "path";
import { db } from "./db";
import { mediaFiles } from "@shared/schema";
import { getMediaList } from "./media";

const ROUTES = ["gallery","students-gallery","success-stories","instructors"] as const;

(async () => {
  console.log("Clearing media_files table…");
  await db.delete(mediaFiles); // delete all
  // Clear server/public/media folder to avoid stale files
  const pubRoot = path.resolve("server","public","media");
  if (fs.existsSync(pubRoot)) {
    fs.rmSync(pubRoot,{recursive:true,force:true});
  }
  for (const r of ROUTES) {
    console.log(`Processing ${r}…`);
    const list = await getMediaList(r);
    console.log(`${r}: ${list.length} items ready.`);
  }
  console.log("Done");
  process.exit(0);
})(); 