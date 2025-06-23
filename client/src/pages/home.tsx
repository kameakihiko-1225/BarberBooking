import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import About from "@/components/about";
import Courses from "@/components/courses";
import Instructors from "@/components/instructors";
import Testimonials from "@/components/testimonials";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <About />
      <Courses />
      <Instructors />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
