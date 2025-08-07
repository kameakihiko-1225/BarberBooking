import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Instagram, Youtube, Music, Facebook } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    program: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: t('contact.form.required'),
        description: t('contact.form.required.desc'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      toast({
        title: t('contact.form.thank.you'),
        description: t('contact.form.thank.you.desc'),
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
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: t('contact.form.error'),
        description: t('contact.form.error.desc'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              {t('contact.title')}{" "}
              <span className="premium-accent">{t('contact.title.highlight')}</span>{" "}
              {t('contact.title.today')}
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {t('contact.subtitle')}
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--premium-accent)] rounded-full flex items-center justify-center">
                  <MapPin className="text-black h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black">{t('contact.visit.campus')}</div>
                  <div className="text-gray-600">Aleja Wyścigowa 14A<br />02-681 Warszawa</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--premium-accent)] rounded-full flex items-center justify-center">
                  <Phone className="text-black h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black">{t('contact.call.us')}</div>
                  <div className="text-gray-600">+48 729 231 542</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--premium-accent)] rounded-full flex items-center justify-center">
                  <Mail className="text-black h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black">{t('contact.email.us')}</div>
                  <div className="text-gray-600">Biuro@kkacademy.pl</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--premium-accent)] rounded-full flex items-center justify-center">
                  <Clock className="text-black h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-deep-black">{t('contact.hours')}</div>
                  <div className="text-gray-600">
                    {t('contact.hours.weekdays')}<br />
                    {t('contact.hours.saturday')}<br />
                    {t('contact.hours.sunday')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="font-serif text-2xl font-bold mb-6">{t('contact.form.title')}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.first.name')} *
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
                    {t('contact.form.last.name')} *
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
                  {t('contact.form.email')} *
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
                  {t('contact.form.phone')}
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
                <Label className="text-sm font-medium text-gray-700 mb-2">{t('contact.form.program')}</Label>
                <Select value={formData.program} onValueChange={(value) => handleInputChange('program', value)}>
                  <SelectTrigger className="focus:ring-2 focus:ring-[var(--golden-bronze)] focus:border-[var(--golden-bronze)]">
                    <SelectValue placeholder={t('contact.form.program.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free Consultation">Free Consultation</SelectItem>
                    <SelectItem value="Basic Barber Course">Basic Barber Course</SelectItem>
                    <SelectItem value="Advanced Barber Training">Advanced Barber Training</SelectItem>
                    <SelectItem value="Complete Barber Course">Complete Barber Course</SelectItem>
                    <SelectItem value="Short course">Short course</SelectItem>
                    <SelectItem value="Weekend Intensive Course">Weekend Intensive Course</SelectItem>
                    <SelectItem value="Master Barber Certification">Master Barber Certification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.message')}
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder={t('contact.form.message.placeholder')}
                  className="focus:ring-2 focus:ring-[var(--golden-bronze)] focus:border-[var(--golden-bronze)]"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full font-semibold text-lg
                           bg-gradient-to-r from-[var(--premium-accent)] via-[var(--golden-bronze)] to-[var(--premium-accent)]
                           text-black shadow-[0_0_12px_var(--golden-bronze)/60] hover:shadow-[0_0_18px_var(--golden-bronze)/80]
                           transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
