import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContactsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast({ title: 'Message sent!', description: 'We will be in touch shortly.' });
      setFormData({ name: '', email: '', phone: '', program: '', message: '' });
    } catch (error) {
      toast({ 
        title: 'Error sending message', 
        description: 'Please try again later.',
        variant: 'destructive' 
      });
    }
  };

  const handleChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <main className="pt-32 pb-20 bg-deep-black text-white min-h-screen">
      {/* Intro */}
      <section className="text-center mb-20 px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">Contact <span className="premium-accent">K&K Academy</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Have questions about our programs, pricing, or enrollment? Reach out and our admissions team will gladly help.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        {/* Map & Details */}
        <div>
          <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
            <iframe
              title="K&K Academy Location"
              src="https://www.google.com/maps?q=52.167610,21.012126&output=embed"
              className="w-full h-72 sm:h-96 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="space-y-6 text-lg">
            <div className="flex items-start space-x-4">
              <MapPin className="text-[var(--premium-accent)] h-7 w-7" />
              <span>Aleja Wyścigowa 14A, 02-681 Warszawa</span>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="text-[var(--premium-accent)] h-7 w-7" />
              <a href="tel:+48729231542" className="hover:text-[var(--premium-accent)] transition-colors">+48&nbsp;729&nbsp;231&nbsp;542</a>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="text-[var(--premium-accent)] h-7 w-7" />
              <a href="mailto:Biuro@kkacademy.pl" className="hover:text-[var(--premium-accent)] transition-colors">Biuro@kkacademy.pl</a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h3 className="font-serif text-2xl font-bold mb-6 text-[var(--premium-accent)]">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="mb-2">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-deep-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)]"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-deep-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)]"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="bg-deep-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)]"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label className="mb-2">Program Interest</Label>
              <Select value={formData.program} onValueChange={(val) => handleChange('program', val)}>
                <SelectTrigger className="bg-deep-black/50 border-gray-700 text-white focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)]">
                  <SelectValue placeholder="Select a program..." />
                </SelectTrigger>
                <SelectContent className="bg-deep-black text-white border-gray-700">
                  <SelectItem value="fundamentals">Professional Barber Fundamentals</SelectItem>
                  <SelectItem value="master">Master Barber Techniques</SelectItem>
                  <SelectItem value="business">Barbershop Business Mastery</SelectItem>
                  <SelectItem value="free">Free Course</SelectItem>
                  <SelectItem value="unsure">Not sure yet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message" className="mb-2">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={4}
                className="bg-deep-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-[var(--premium-accent)] focus:ring-[var(--premium-accent)]"
                placeholder="How can we help you?"
              />
            </div>
            <Button type="submit" className="w-full bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80 transition-colors">
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
} 