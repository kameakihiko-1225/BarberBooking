// Icons are added in component layer; keep data pure to avoid JSX in .ts file.

export interface Instructor {
  id: number;
  name: string;
  title: string;
  about: string;
  experience: string;
  image: string;
  socials: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

// Dynamically import instructor photos from the assets folder. Supports HEIC/PNG/JPG.
// We keep them in a deterministic order by sorting the keys.
const modules = import.meta.glob('@assets/Instructors/*.{jpg,JPG,jpeg,JPEG,png,PNG,heic,HEIC}', {
  eager: true,
  import: 'default',
});

const importedImages = Object.keys(modules)
  .sort()
  .map((k) => (modules as Record<string, string>)[k]);

// Fallback: if less images than instructors, reuse first image.
const img = (idx: number) => importedImages[idx % importedImages.length] || "";

// Placeholder instructors - will be replaced with new instructor data
export const instructors: Instructor[] = []; 