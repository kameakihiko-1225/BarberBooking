import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Instructors from '@/components/instructors';
import { Quote, CheckCircle } from 'lucide-react';

const legal = {
  name: 'K&K BARBER COMPANY SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
  trading: 'K&K Barber Academy',
  krs: '0000956096',
  nip: '7011076714',
  regon: '521376762',
};

const team = [
  { name: 'Ali Karimov', role: 'Master Barber, Co-Founder', desc: 'Senior educator and strategic lead.' },
  { name: 'Tomasz', role: 'Master Barber, Co-Founder', desc: 'Course designer and trainer.' },
  { name: 'Angelika', role: 'Barber & Operations', desc: 'Keeps the academy running smoothly.' },
  { name: 'Bartek', role: 'Master Barber, Lead Educator', desc: 'Heads advanced training & masterclasses.' },
];

const offers = [
  { title: 'For Beginners', text: 'Foundational courses to start your new career from zero.' },
  { title: 'For Experienced Barbers', text: 'Advanced modules to refine technique & elevate status.' },
];

const reasons = [
  '80% hands-on practice with real clients & manikins',
  'Small groups for personalised mentorship',
  'All tools & products provided — zero hidden costs',
  'Recognised certificates upon completion',
  'Help securing up to 100% financial support',
];

const faqs = [
  { q: "I've never held scissors before – can I do this?", a: 'Absolutely. Many students start from scratch; our foundational program is built for beginners.' },
  { q: 'Is the course expensive?', a: 'Base price is 11,000 PLN, currently discounted to 9,000 PLN. Daily workshops from 1,200 PLN.' },
];

export default function AboutUs() {
  return (
    <main className="bg-white text-deep-black pb-20">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 mb-24 overflow-hidden bg-deep-black text-white">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{backgroundImage:"url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&h=1080')"}}/>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">From Zero to <span className="premium-accent">Mastery</span></h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">We don't just teach barbering — we shape careers. Ambition meets precision inside our classrooms.</p>
        </div>
      </section>

      {/* Legal Info */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="font-serif text-3xl font-bold mb-6 text-center">Legal Information</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid sm:grid-cols-2 gap-4">
          <div><strong>Legal Name:</strong> {legal.name}</div>
          <div><strong>Trading Name:</strong> {legal.trading}</div>
          <div><strong>KRS:</strong> {legal.krs}</div>
          <div><strong>NIP:</strong> {legal.nip}</div>
          <div><strong>REGON:</strong> {legal.regon}</div>
        </div>
      </section>

      {/* What we offer */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <h2 className="font-serif text-3xl font-bold mb-10 text-center">What We Offer</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {offers.map(o=> (
            <div key={o.title} className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
              <h3 className="font-serif text-2xl font-bold mb-3 premium-accent">{o.title}</h3>
              <p className="text-gray-600">{o.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose */}
      <section className="px-4 py-16 bg-gray-50 mb-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold">Why Choose <span className="premium-accent">K&K</span></h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {reasons.map((r) => (
            <div key={r} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[var(--premium-accent)] mt-0.5" />
              <p className="text-gray-700">{r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto px-4 mb-24" id="team">
        <h2 className="font-serif text-3xl font-bold mb-12 text-center">Meet the <span className="premium-accent">Team</span></h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map(t=> (
            <div key={t.name} className="text-center p-6 border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-shadow">
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 mb-4"></div>{/* Placeholder photo */}
              <h3 className="font-serif text-xl font-bold mb-1">{t.name}</h3>
              <p className="premium-accent font-medium mb-2">{t.role}</p>
              <p className="text-gray-600 text-sm">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="bg-deep-black text-white py-16 px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">Results That Speak</h2>
          <p className="text-xl premium-accent font-semibold mb-4">100+ graduates working across Poland</p>
          <p className="text-xl premium-accent font-semibold mb-4">Trusted by professionals for continued education</p>
          <p className="text-xl premium-accent font-semibold">5-star reviews on Google & Booksy</p>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="font-serif text-3xl font-bold mb-8 text-center">FAQs</h2>
        <Accordion type="single" collapsible>
          {faqs.map(f=> (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Button asChild className="btn-shimmer bg-[var(--premium-accent)] text-black px-10 py-4 rounded-full font-semibold hover:bg-[var(--premium-accent)]/80">
          <a href="/contacts">Enroll Now</a>
        </Button>
      </section>
    </main>
  );
} 