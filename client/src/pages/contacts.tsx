import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactsPage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({ 
        title: t('contact.form.required'), 
        description: t('contact.form.required.desc'),
        variant: 'destructive' 
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
        description: t('contact.form.thank.you.desc') 
      });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', program: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({ 
        title: t('contact.form.error'), 
        description: t('contact.form.error.desc'),
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <main className="pt-24 sm:pt-36 pb-12 sm:pb-20 bg-deep-black text-white min-h-screen">
      {/* Intro */}
      <section className="text-center mb-12 sm:mb-20 px-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          {t('contact.page.title')} <span className="premium-accent">{t('contact.page.highlight')}</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          {t('contact.page.subtitle')}
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Map & Details */}
        <div className="order-2 lg:order-1">
          <div className="rounded-2xl overflow-hidden shadow-lg mb-6 sm:mb-8">
            <iframe
              title="K&K Academy Location"
              src="https://www.google.com/maps?q=52.167610,21.012126&output=embed"
              className="w-full h-60 sm:h-72 lg:h-96 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <MapPin className="text-[var(--premium-accent)] h-6 w-6 sm:h-7 sm:w-7 mt-0.5" />
              <div>
                <div className="font-medium">Aleja Wyścigowa 14A</div>
                <div className="text-gray-300">02-681 Warszawa</div>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4">
              <Phone className="text-[var(--premium-accent)] h-6 w-6 sm:h-7 sm:w-7 mt-0.5" />
              <a href="tel:+48729231542" className="hover:text-[var(--premium-accent)] transition-colors font-medium">
                +48 729 231 542
              </a>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4">
              <Mail className="text-[var(--premium-accent)] h-6 w-6 sm:h-7 sm:w-7 mt-0.5" />
              <a href="mailto:Biuro@kkacademy.pl" className="hover:text-[var(--premium-accent)] transition-colors font-medium break-all">
                Biuro@kkacademy.pl
              </a>
            </div>
            <div className="space-y-1 sm:space-y-2 mt-4 sm:mt-6">
              <p className="font-semibold text-[var(--premium-accent)]">{t('contact.hours')}:</p>
              <p className="text-sm sm:text-base text-gray-300">{t('contact.hours.weekdays')}</p>
              <p className="text-sm sm:text-base text-gray-300">{t('contact.hours.saturday')}</p>
              <p className="text-sm sm:text-base text-gray-300">{t('contact.hours.sunday')}</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="order-1 lg:order-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl">
          <h3 className="font-serif text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[var(--premium-accent)]">
            {t('contact.form.title')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="mb-2 text-sm sm:text-base">{t('contact.form.first.name')} *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="bg-deep-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)] h-11 sm:h-12"
                  placeholder={t('contact.form.first.name')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="mb-2 text-sm sm:text-base">{t('contact.form.last.name')} *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="bg-deep-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)] h-11 sm:h-12"
                  placeholder={t('contact.form.last.name')}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 text-sm sm:text-base">{t('contact.form.email')} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-deep-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)] h-11 sm:h-12"
                placeholder={t('contact.form.email')}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2 text-sm sm:text-base">{t('contact.form.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="bg-deep-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)] h-11 sm:h-12"
                placeholder="+48 (555) 123-4567"
              />
            </div>
            <div>
              <Label className="mb-2 text-sm sm:text-base">{t('contact.form.program')}</Label>
              <Select value={formData.program} onValueChange={(val) => handleChange('program', val)}>
                <SelectTrigger className="bg-deep-black/50 border-gray-700 text-white focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)] h-11 sm:h-12">
                  <SelectValue placeholder={t('contact.form.program.placeholder')} />
                </SelectTrigger>
                <SelectContent className="bg-deep-black text-white border-gray-700">
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
              <Label htmlFor="message" className="mb-2 text-sm sm:text-base">{t('contact.form.message')}</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={4}
                className="bg-deep-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)] min-h-[100px] text-sm sm:text-base"
                placeholder={t('contact.form.message.placeholder')}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80 transition-colors h-11 sm:h-12 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
} 