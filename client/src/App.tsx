import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import InstructorDetails from "@/pages/instructor-details";
import AboutUs from "@/pages/about-us";
import GalleryPage from "@/pages/gallery";
import StudentsGalleryPage from "@/pages/students-gallery";
import SuccessGalleryPage from "@/pages/success-gallery";
import ContactsPage from "@/pages/contacts";
import Navigation from "@/components/navigation";
import CourseDetails from "@/pages/course-details";
import CoursesPage from "@/pages/courses";
import BlogListPage from '@/pages/blog';
import BlogPostPage from '@/pages/blog-post';
import BlogAdmin from '@/pages/blog-admin';
import PhoneWidget from "@/components/phone-widget";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/barber/:id" component={InstructorDetails} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/students-gallery" component={StudentsGalleryPage} />
      <Route path="/success-stories" component={SuccessGalleryPage} />
      <Route path="/course/:id" component={CourseDetails} />
      <Route path="/contacts" component={ContactsPage} />
      <Route path="/blog" component={BlogListPage} />
      <Route path="/blog/admin/post" component={BlogAdmin} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Navigation />
          <Router />
          <PhoneWidget />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
