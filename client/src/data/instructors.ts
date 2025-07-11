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

const sortedKeys = Object.keys(modules).sort();
const importedImages = sortedKeys.map((k) => (modules as Record<string, string>)[k]);

// Image mapping: Files are loaded alphabetically including HEIC and PNG files
// Actual order: IMG_1946.HEIC(0), IMG_1982.HEIC(1), ali-karimov.jpg(2), apo-karimov.jpg(3), 
// bartosz-kaczorowski.jpg(4), instructor-3.png(5), richer-karimov.jpg(6), tomasz-kaczorowski.jpg(7)

// Fallback: if less images than instructors, reuse first image.
const img = (idx: number) => importedImages[idx % importedImages.length] || "";

export const instructors: Instructor[] = [
  {
    id: 1,
    name: "Richer Karimov",
    title: "senior.barber.instructor",
    about: "instructor.about.richer",
    experience: "instructor.experience.richer",
    image: img(6), // richer-karimov.jpg is at index 6
    socials: {
      instagram: "https://www.instagram.com/richiibarber?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    }
  },
  {
    id: 2,
    name: "Apo Karimov",
    title: "senior.barber.instructor",
    about: "instructor.about.apo",
    experience: "instructor.experience.apo",
    image: img(3), // apo-karimov.jpg is at index 3
    socials: {
      instagram: "https://www.instagram.com/apo_barber_1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    }
  },
  {
    id: 3,
    name: "Bartosz Kaczorowski",
    title: "senior.barber.instructor",
    about: "instructor.about.bartosz",
    experience: "instructor.experience.bartosz",
    image: img(4), // bartosz-kaczorowski.jpg is at index 4
    socials: {
      instagram: "https://www.instagram.com/b_kaczorowski_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    }
  },
  {
    id: 4,
    name: "Ali Karimov",
    title: "senior.barber.instructor",
    about: "instructor.about.ali",
    experience: "instructor.experience.ali",
    image: img(2), // ali-karimov.jpg is at index 2
    socials: {
      instagram: "https://www.instagram.com/ali.barber.pl?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    }
  },
  {
    id: 5,
    name: "Tomasz Kaczorowski",
    title: "senior.barber.instructor",
    about: "instructor.about.tomasz",
    experience: "instructor.experience.tomasz",
    image: img(7), // tomasz-kaczorowski.jpg is at index 7
    socials: {
      instagram: "https://www.instagram.com/kaczorowski.brb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    }
  }
]; 