import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Instagram, Youtube, Music, Facebook } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    program: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Please fill in required fields",
        description: "First Name, Last Name, and Email are required.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you for your interest!",
      description: "We will contact you soon with more information.",
    });

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      program: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--premium-accent)]/5 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="section-divider"></div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Information */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
          }`}>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Start Your{" "}
              <span className="premium-accent">Journey</span>{" "}
              Today
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Ready to transform your passion into a professional career? Get in touch with our admissions team to learn more about our programs and schedule a campus tour.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--premium-accent)] rounded-full flex items-center justify-center">
                  <MapPin className="text-black h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black">Visit Our Campus</div>
                  <div className="text-gray-600">123 Barber Academy Drive, Professional District</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--premium-accent)] rounded-full flex items-center justify-center">
                  <Phone className="text-black h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black">Call Us</div>
                  <div className="text-gray-600">(555) 123-BARBER</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--premium-accent)] rounded-full flex items-center justify-center">
                  <Mail className="text-black h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black">Email Us</div>
                  <div className="text-gray-600">admissions@elitebarber.academy</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--premium-accent)] rounded-full flex items-center justify-center">
                  <Clock className="text-black h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black">Hours</div>
                  <div className="text-gray-600">Mon-Fri: 8AM-6PM, Sat: 9AM-4PM</div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <div className="font-semibold text-deep-black mb-4">Follow Our Journey</div>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-deep-black rounded-full flex items-center justify-center text-white hover:bg-[var(--golden-bronze)] hover:text-black transition-colors hover:scale-110 duration-200">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-deep-black rounded-full flex items-center justify-center text-white hover:bg-[var(--golden-bronze)] hover:text-black transition-colors hover:scale-110 duration-200">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-deep-black rounded-full flex items-center justify-center text-white hover:bg-[var(--golden-bronze)] hover:text-black transition-colors hover:scale-110 duration-200">
                  <Music className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-deep-black rounded-full flex items-center justify-center text-white hover:bg-[var(--golden-bronze)] hover:text-black transition-colors hover:scale-110 duration-200">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="font-serif text-2xl font-bold mb-6">Get More Information</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    className="focus:ring-2 focus:ring-[var(--golden-bronze)] focus:border-[var(--golden-bronze)]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    className="focus:ring-2 focus:ring-[var(--golden-bronze)] focus:border-[var(--golden-bronze)]"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john.doe@email.com"
                  className="focus:ring-2 focus:ring-[var(--golden-bronze)] focus:border-[var(--golden-bronze)]"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="focus:ring-2 focus:ring-[var(--golden-bronze)] focus:border-[var(--golden-bronze)]"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Program Interest</Label>
                <Select value={formData.program} onValueChange={(value) => handleInputChange('program', value)}>
                  <SelectTrigger className="focus:ring-2 focus:ring-[var(--golden-bronze)] focus:border-[var(--golden-bronze)]">
                    <SelectValue placeholder="Select a program..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fundamentals">Professional Barber Fundamentals</SelectItem>
                    <SelectItem value="master">Master Barber Techniques</SelectItem>
                    <SelectItem value="business">Barbershop Business Mastery</SelectItem>
                    <SelectItem value="unsure">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your goals and any questions you have..."
                  className="focus:ring-2 focus:ring-[var(--golden-bronze)] focus:border-[var(--golden-bronze)]"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full py-4 rounded-full font-semibold text-lg
                           bg-gradient-to-r from-[var(--premium-accent)] via-[var(--golden-bronze)] to-[var(--premium-accent)]
                           text-black shadow-[0_0_12px_var(--golden-bronze)/60] hover:shadow-[0_0_18px_var(--golden-bronze)/80]
                           transition-all hover:scale-105"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
