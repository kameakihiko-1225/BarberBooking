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

export const instructors: Instructor[] = [
  {
    id: 1,
    name: "Richer Karimov",
    title: "Master Barber & Stylist",
    about: "Expert in modern cutting techniques and classic barbering styles with years of professional experience.",
    experience: "Professional barber specializing in precision cuts and contemporary styling.",
    image: img(3), // richer-karimov.jpg is at index 3 alphabetically
    socials: {
      instagram: "https://www.instagram.com/richiibarber?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      facebook: "https://www.facebook.com/share/15mZ9ssWit/"
    }
  },
  {
    id: 2,
    name: "Apo Karimov",
    title: "Senior Barber Instructor",
    about: "Passionate educator and skilled barber dedicated to training the next generation of professionals.",
    experience: "Experienced barber and instructor with expertise in advanced cutting techniques.",
    image: img(1), // apo-karimov.jpg is at index 1 alphabetically
    socials: {
      instagram: "https://www.instagram.com/apo_barber_1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      facebook: "https://www.facebook.com/share/155ip3Nqqso/"
    }
  },
  {
    id: 3,
    name: "Bartosz Kaczorowski",
    title: "Hair Specialist",
    about: "Creative stylist with a focus on modern trends and personalized client experiences.",
    experience: "Skilled barber specializing in creative cuts and contemporary hair styling.",
    image: img(2), // bartosz-kaczorowski.jpg is at index 2 alphabetically
    socials: {
      instagram: "https://www.instagram.com/b_kaczorowski_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      facebook: "https://www.facebook.com/share/1C2myzJQ4R/"
    }
  },
  {
    id: 4,
    name: "Ali Karimov",
    title: "Professional Barber",
    about: "Dedicated professional with expertise in both traditional and modern barbering techniques.",
    experience: "Experienced barber with a passion for delivering exceptional grooming services.",
    image: img(0), // ali-karimov.jpg is at index 0 alphabetically
    socials: {
      instagram: "https://www.instagram.com/ali.barber.pl?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      facebook: "https://www.facebook.com/share/16XjuEoG1z/"
    }
  },
  {
    id: 5,
    name: "Tomasz Kaczorowski",
    title: "Barber & Educator",
    about: "Experienced professional combining hands-on barbering skills with teaching excellence.",
    experience: "Professional barber and educator committed to sharing knowledge and skills.",
    image: img(4), // tomasz-kaczorowski.jpg is at index 4 alphabetically
    socials: {
      instagram: "https://www.instagram.com/kaczorowski.brb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      facebook: "https://www.facebook.com/share/1F1QKoCWcp/"
    }
  }
]; 