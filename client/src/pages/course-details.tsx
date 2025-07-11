import { useEffect, useRef, useState } from 'react';
import { useRoute } from 'wouter';
import { courses } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CheckCircle, Gift, BookOpen, Users, Scissors, Trophy, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UpcomingDates } from '@/components/upcoming-dates';
import { instructors } from '@/data/instructors';
import { useLanguage } from '@/contexts/LanguageContext';

type MediaItem = { src: string; type: 'image' | 'video' };

function GalleryCard({ item, idx }: { item: MediaItem; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  // Determine varying width classes for masonry feel
  const sizeClass = idx % 3 === 0 ? 'col-span-2' : 'col-span-1';

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`snap-center ${sizeClass} h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden flex-shrink-0 reveal`}
      style={{ transitionDelay: `${idx * 60}ms` }}
    >
      {!visible && <div className="w-full h-full bg-gray-800 animate-pulse" />}
      {visible && item.type === 'image' && (
        <img
          src={item.src}
          alt="course gallery"
          className="w-full h-full object-cover"
          loading="lazy"
          onLoad={() => setReady(true)}
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.4s ease' }}
        />
      )}
      {visible && item.type === 'video' && (
        <video
          src={item.src}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setReady(true)}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.4s ease' }}
          autoPlay={visible}
        />
      )}
    </div>
  );
}

export default function CourseDetails() {
  const { t } = useLanguage();
  const [match, params] = useRoute<{ id: string }>('/course/:id');
  if (!match) return null;
  const course = courses.find((c) => c.id === Number(params.id));
  if (!course) return <div className="min-h-screen flex items-center justify-center text-white bg-deep-black">{t('course.not.found')}</div>;

  // Media queries for new gallery section
  const { data: galleryMedia = [] } = useQuery<MediaItem[]>({
    queryKey: ['media','gallery'],
    queryFn: async () => {
      const res = await fetch('/api/media/gallery');
      return res.json();
    },
  });
  const { data: studentMedia = [] } = useQuery<MediaItem[]>({
    queryKey: ['media','students-gallery'],
    queryFn: async () => {
      const res = await fetch('/api/media/students-gallery');
      return res.json();
    },
  });

  const videos = galleryMedia.filter((m): m is MediaItem => m.type==='video');
  const images = studentMedia.filter((m): m is MediaItem => m.type==='image');
  const courseGallery = [...videos.slice(0,15), ...images.slice(0,10)].sort(() => Math.random() - 0.5);

  // Scroll-reveal animation setup
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    els.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-6', 'transition', 'duration-700', 'ease-out');
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('opacity-100', 'translate-y-0');
            target.classList.remove('opacity-0', 'translate-y-6');
            obs.unobserve(target);
          }
        });
      },
      { rootMargin: '200px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Handler for horizontal scroll arrows
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 'left'|'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = window.innerWidth * 0.8;
    el.scrollBy({ left: dir==='left'?-amount:amount, behavior:'smooth' });
  };

  return (
    <main className="pt-40 md:pt-48 pb-20 bg-white text-deep-black">
      {/* Hero */}
      <section className="px-4 mb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg ring-1 ring-white/10 reveal"
          />
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2 text-deep-black reveal">{t(`course.${course.id}.title`)}</h1>
            <p className="text-xl text-gray-600 mb-4 reveal" style={{ transitionDelay: '100ms' }}>{t(`course.${course.id}.subtitle`)}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {course.benefits.map((b, idx) => (
                <span
                  key={b}
                  className="flex items-center gap-2 text-sm bg-[var(--premium-accent)]/10 text-[var(--premium-accent)] px-3 py-1 rounded-full reveal"
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  <CheckCircle className="w-3 h-3" /> {b}
                </span>
              ))}
            </div>

            <Button
              asChild
              className="btn-shimmer bg-[var(--premium-accent)] text-black px-8 py-3 rounded-full font-medium hover:bg-[var(--premium-accent)]/80 transition-all"
            >
              <a href="/contact">{t('course.enroll.today')}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Course Dates */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="font-serif text-3xl font-bold text-center mb-2">{t('course.upcoming.dates')}</h2>
            <p className="text-gray-600 text-center mb-8">{t('course.select.date')}</p>
            
            <div className="max-w-2xl mx-auto">
              <UpcomingDates 
                courseName={course.title}
                dates={course.upcomingDates}
              />
              
              <div className="mt-8 text-center">
                <Button
                  asChild
                  className="btn-shimmer bg-[var(--premium-accent)] text-black px-8 py-3 rounded-full font-medium hover:bg-[var(--premium-accent)]/80 transition-all"
                >
                  <a href="/contact">{t('course.book.now')}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold">{t('course.what.learn')}</h2>
        </div>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-2 gap-6">
          {course.skills.map((s, idx) => (
            <div
              key={s}
              className="p-6 border border-[var(--premium-accent)]/20 rounded-xl shadow-sm bg-deep-black text-white hover:shadow-lg transition-all reveal"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* Audience */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold">{t('course.audience')}</h2>
        </div>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
          {course.audience.map((aud, idx) => (
            <div
              key={aud}
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all reveal"
              style={{ transitionDelay: `${idx * 60}ms` }}
            >
              {aud}
            </div>
          ))}
        </div>
      </section>

      {/* How the course works */}
      <section className="px-4 mb-16 bg-deep-black py-14">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-white">How the Course Works</h2>
        </div>
        {(() => {
          const iconMap: Record<string, any> = {
            'book-open': BookOpen,
            'users': Users,
            'scissors': Scissors,
            'trophy': Trophy,
            'briefcase': Briefcase,
          };
          return (
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
              {course.howItWorks.map((step, idx) => {
                const IconComp = iconMap[step.icon] || BookOpen;
                return (
                  <div
                    key={step.title}
                    className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all reveal"
                    style={{ transitionDelay: `${idx * 80}ms` }}
                  >
                    <IconComp className="w-10 h-10 text-[var(--premium-accent)] mb-4" />
                    <h3 className="font-serif text-xl font-bold mb-2 text-deep-black">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

      {/* What's included */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold">What's Included</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {course.includes.map((i, idx) => (
            <div key={i} className="flex items-start gap-3 reveal" style={{ transitionDelay: `${idx * 40}ms` }}>
              <Gift className="w-4 h-4 text-[var(--premium-accent)] mt-0.5" />
              <p className="text-gray-600">{i}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="px-4 mb-16 bg-deep-black py-14">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-white">By the end you will…</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {course.outcomes.map((o, idx) => (
            <div key={o} className="flex items-start gap-3 reveal" style={{ transitionDelay: `${idx * 40}ms` }}>
              <CheckCircle className="w-4 h-4 text-[var(--premium-accent)] mt-0.5" />
              <p className="text-gray-300">{o}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Course Gallery */}
      <section className="px-4 mb-16 bg-deep-black py-14 text-white">
        <div className="max-w-4xl mx-auto text-center mb-10 reveal">
          <h2 className="font-serif text-3xl font-bold text-white">Course in Action</h2>
          <p className="text-gray-400">Swipe through moments from our hands-on training.</p>
        </div>
        <div className="relative">
          {/* arrows */}
          <button
            onClick={()=>scrollBy('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 border border-white/30 backdrop-blur rounded-full p-2 hover:bg-[var(--premium-accent)]/20 transition">
            <ChevronLeft className="w-5 h-5 text-[var(--premium-accent)]" />
          </button>
          <button
            onClick={()=>scrollBy('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 border border-white/30 backdrop-blur rounded-full p-2 hover:bg-[var(--premium-accent)]/20 transition">
            <ChevronRight className="w-5 h-5 text-[var(--premium-accent)]" />
          </button>

          <div
            ref={scrollRef}
            className="grid grid-rows-2 grid-flow-col auto-cols-[55vw] xs:auto-cols-[40vw] sm:auto-cols-[32vw] md:auto-cols-[26vw] lg:auto-cols-[22vw] gap-0 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {courseGallery.map((item, idx) => (
              <GalleryCard key={item.src + idx} item={item} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="px-4 mb-16 bg-deep-black py-14">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-white">Meet Your Instructors</h2>
        </div>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor, idx) => (
            <div
              key={instructor.id}
              className="group relative bg-deep-black border border-gray-800 rounded-2xl p-6 text-center 
                       hover:bg-[#FF6A00] transition-all duration-500 ease-in-out reveal"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              {/* Instructor Image */}
              <div className="relative mx-auto w-24 h-24 mb-4 overflow-hidden rounded-full">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              
              {/* Instructor Info */}
              <h3 className="font-serif text-xl font-bold text-white mb-2">{instructor.name}</h3>
              <p className="text-gray-400 group-hover:text-white text-sm mb-4 transition-colors duration-300">
                {instructor.title}
              </p>
              
              {/* Social Media Icons */}
              <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 
                            transform translate-y-4 group-hover:translate-y-0 
                            transition-all duration-500 ease-out">
                {instructor.socials.facebook && (
                  <a
                    href={instructor.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center 
                             hover:bg-white/20 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {instructor.socials.instagram && (
                  <a
                    href={instructor.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center 
                             hover:bg-white/20 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.197-1.559-.748-.948-1.197-2.315-1.197-3.996 0-1.681.449-3.048 1.197-3.996.749-.948 1.9-1.559 3.197-1.559 1.297 0 2.448.611 3.197 1.559.748.948 1.197 2.315 1.197 3.996 0 1.681-.449 3.048-1.197 3.996-.749.948-1.9 1.559-3.197 1.559z"/>
                    </svg>
                  </a>
                )}
                {instructor.socials.whatsapp && (
                  <a
                    href={instructor.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center 
                             hover:bg-white/20 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificate Section */}
      <section className="px-4 mb-16 bg-deep-black text-white py-14">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold mb-4">Certificate & Accreditation</h2>
          <p className="text-gray-300 mb-8">
            Receive an official diploma upon completion. Share on LinkedIn and impress future employers.
          </p>
          <img
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&h=450"
            alt="Diploma"
            className="mx-auto rounded-xl shadow-lg animate-pulse-slow"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold">Pricing & Plans</h2>
        </div>
        {(() => {
          const few = course.pricingPlans.length < 3;
          return (
            <div className={few ? 'max-w-5xl mx-auto flex flex-wrap justify-center gap-6' : 'max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6'}>
              {course.pricingPlans.map((plan, idx) => {
                const highlight = plan.plan.toLowerCase().includes('pro');
                return (
                  <div
                    key={plan.plan}
                    className={`p-6 rounded-xl flex flex-col transition-shadow reveal ${highlight ? 'ring-2 ring-[var(--premium-accent)] shadow-[0_0_20px_rgba(205,127,50,0.4)] bg-white' : 'border border-gray-200 shadow-sm bg-white'}`}
                    style={{ transitionDelay: `${idx * 80}ms` }}
                  >
                    <h3 className="font-serif text-xl font-bold mb-2">{plan.plan}</h3>
                    <p className="mb-4 text-gray-600">{plan.access}</p>
                    {plan.extras && <p className="text-sm mb-4">{plan.extras}</p>}
                    <span className="text-3xl font-bold mb-6">{plan.price}</span>
                    <Button
                      asChild
                      className="btn-shimmer mt-auto bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80"
                    >
                      <a href="/contacts">Choose Plan</a>
                    </Button>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

      {/* FAQs */}
      <section className="px-4 mb-16 bg-dark-gray py-14">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-white">FAQs</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {course.faqs.map((f, idx) => (
              <AccordionItem value={f.q} key={f.q} className="reveal" style={{ transitionDelay: `${idx * 80}ms` }}>
                <AccordionTrigger className="text-white hover:underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-gray-300">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 text-center bg-deep-black py-20">
        <h2 className="font-serif text-3xl font-bold mb-4 text-white reveal">Start Your Journey Today</h2>
        <p className="mb-6 text-gray-400 flex flex-col sm:flex-row gap-2 items-center justify-center text-sm reveal" style={{ transitionDelay: '100ms' }}>
          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[var(--premium-accent)]" /> 7-Day Money-Back Guarantee</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[var(--premium-accent)]" /> 100% On-site & Hands-On</span>
        </p>
        <Button
          asChild
          className="btn-shimmer bg-[var(--premium-accent)] text-black px-10 py-4 rounded-full font-medium hover:bg-[var(--premium-accent)]/80"
        >
          <a href="/contacts">Enroll Now</a>
        </Button>
      </section>
    </main>
  );
} 