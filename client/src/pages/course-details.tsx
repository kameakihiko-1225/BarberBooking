import { useEffect, useRef, useState } from 'react';
import { useRoute } from 'wouter';
import { courses } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CheckCircle, Gift, BookOpen, Users, Scissors, Trophy, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UpcomingDates } from '@/components/upcoming-dates';

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
  const [match, params] = useRoute<{ id: string }>('/courses/:id');
  if (!match) return null;
  const course = courses.find((c) => c.id === Number(params.id));
  if (!course) return <div className="min-h-screen flex items-center justify-center">Course not found.</div>;

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
            <h1 className="font-serif text-4xl font-bold mb-2 text-deep-black reveal">{course.title}</h1>
            <p className="text-xl text-gray-600 mb-4 reveal" style={{ transitionDelay: '100ms' }}>{course.subtitle}</p>

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
              <a href="/contacts">Enroll Now</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Course Dates */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="font-serif text-3xl font-bold text-center mb-2">Course Schedule</h2>
            <p className="text-gray-600 text-center mb-8">Select your preferred start date</p>
            
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
                  <a href="/contacts">Reserve Your Spot</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold">What You'll Learn</h2>
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
          <h2 className="font-serif text-3xl font-bold">Who This Course Is For</h2>
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
      <section className="px-4 mb-16 bg-dark-gray py-14">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-white">Meet Your Instructors</h2>
        </div>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
          {course.instructors.map((ins, idx) => (
            <div
              key={ins.name}
              className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200 reveal"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <img
                src={ins.photo}
                alt={ins.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{ins.name}</h3>
                <p className="text-sm text-gray-600">{ins.title}</p>
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