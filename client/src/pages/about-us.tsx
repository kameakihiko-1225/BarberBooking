import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Instructors from '@/components/instructors';
import { Quote, CheckCircle } from 'lucide-react';
import { instructors } from '@/data/instructors';
import { useLanguage } from '@/contexts/LanguageContext';

const legal = {
  name: 'K&K BARBER COMPANY SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
  trading: 'K&K Barber Academy',
  krs: '0000956096',
  nip: '7011076714',
  regon: '521376762',
};

// Use current instructors from the data file
const team = instructors.map(instructor => ({
  name: instructor.name,
  role: instructor.title,
  desc: instructor.about,
  image: instructor.image
}));

export default function AboutUs() {
  const { t } = useLanguage();

  const offers = [
    { title: t('aboutus.offers.beginners.title'), text: t('aboutus.offers.beginners.text') },
    { title: t('aboutus.offers.experienced.title'), text: t('aboutus.offers.experienced.text') },
  ];

  const reasons = [
    t('aboutus.whychoose.reason1'),
    t('aboutus.whychoose.reason2'),
    t('aboutus.whychoose.reason3'),
    t('aboutus.whychoose.reason4'),
    t('aboutus.whychoose.reason5'),
  ];

  const faqs = [
    { q: t('aboutus.faq.q1'), a: t('aboutus.faq.a1') },
    { q: t('aboutus.faq.q2'), a: t('aboutus.faq.a2') },
  ];
  return (
    <main className="bg-white text-deep-black pb-20">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 mb-24 overflow-hidden bg-deep-black text-white">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{backgroundImage:"url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&h=1080')"}}/>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">{t('aboutus.hero.title')} <span className="premium-accent">{t('aboutus.hero.mastery')}</span></h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">{t('aboutus.hero.description')}</p>
        </div>
      </section>

      {/* Legal Info */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="font-serif text-3xl font-bold mb-6 text-center">{t('aboutus.legal.title')}</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid sm:grid-cols-2 gap-4">
          <div><strong>{t('aboutus.legal.name')}</strong> {legal.name}</div>
          <div><strong>{t('aboutus.legal.trading')}</strong> {legal.trading}</div>
          <div><strong>KRS:</strong> {legal.krs}</div>
          <div><strong>NIP:</strong> {legal.nip}</div>
          <div><strong>REGON:</strong> {legal.regon}</div>
        </div>
      </section>

      {/* What we offer */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <h2 className="font-serif text-3xl font-bold mb-10 text-center">{t('aboutus.offers.title')}</h2>
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
          <h2 className="font-serif text-3xl font-bold">{t('aboutus.whychoose.title')} <span className="premium-accent">K&K</span></h2>
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
        <h2 className="font-serif text-3xl font-bold mb-12 text-center">{t('aboutus.team.title')} <span className="premium-accent">{t('aboutus.team.team')}</span></h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map(member=> (
            <div key={member.name} className="text-center p-6 border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-shadow">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 bg-gray-200">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-serif text-xl font-bold mb-1">{member.name}</h3>
              <p className="premium-accent font-medium mb-2">{t(member.role)}</p>
              <p className="text-gray-600 text-sm">{t(member.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="bg-deep-black text-white py-16 px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">{t('aboutus.results.title')}</h2>
          <p className="text-xl premium-accent font-semibold mb-4">{t('aboutus.results.graduates')}</p>
          <p className="text-xl premium-accent font-semibold mb-4">{t('aboutus.results.trusted')}</p>
          <p className="text-xl premium-accent font-semibold">{t('aboutus.results.reviews')}</p>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="font-serif text-3xl font-bold mb-8 text-center">{t('aboutus.faq.title')}</h2>
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
          <a href="/contact">{t('aboutus.cta.enroll')}</a>
        </Button>
      </section>
    </main>
  );
} 