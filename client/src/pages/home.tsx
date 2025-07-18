import Hero from "@/components/hero";
import About from "@/components/about";
import Courses from "@/components/courses";
import Instructors from "@/components/instructors";
import Testimonials from "@/components/testimonials";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Gallery from "@/components/gallery";
import CtaEnroll from "@/components/cta-enroll";
import BarberSEO from "@/components/BarberSEO";


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <BarberSEO />
      <Hero />
      <About />
      <Courses />
      <CtaEnroll />
      <Instructors />
      <Gallery />
      <Testimonials />

      <CtaEnroll />
      <Contact />
      <Footer />
    </div>
  );
}
