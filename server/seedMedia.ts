import "dotenv/config";
import { getMediaList } from "./media";

const routes = [
  "gallery",
  "students-gallery",
  "success-stories",
  "instructors",
] as const;

(async () => {
  for (const r of routes) {
    console.log(`Processing ${r}…`);
    const list = await getMediaList(r);
    console.log(`${r}: ${list.length} items stored.`);
  }
  process.exit(0);
})(); 