// Icons are added in component layer; keep data pure to avoid JSX in .ts file.

export interface Instructor {
  id: number;
  name: string;
  title: string;
  about: string;
  experience: string;
  image: string;
  socials: { icon: JSX.Element; href: string }[];
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

export const instructors: Instructor[] = [
  {
    id: 1,
    name: "Alicja Kowalska",
    title: "Head Instructor & Founder",
    about: "Master stylist with expertise in classical and modern barbering techniques.",
    experience: "20+ years of industry experience.",
    image: img(0),
    socials: [],
  },
  {
    id: 2,
    name: "Bartosz Nowak",
    title: "Advanced Techniques Specialist",
    about: "Award-winning barber focusing on creative fades and modern styling.",
    experience: "15+ years of experience.",
    image: img(1),
    socials: [],
  },
  {
    id: 3,
    name: "Kinga Zielińska",
    title: "Business Development Coach",
    about: "Successful shop owner and mentor helping barbers build profitable careers.",
    experience: "12+ years of salon management.",
    image: img(2),
    socials: [],
  },
]; 