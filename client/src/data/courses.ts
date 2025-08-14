export type Course = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  badge: string;
  badgeColor: string;
  duration: string;
  certification: string;
  image: string;
  buttonStyle: string;
  icon?: string;
  rating: number;
  enrolled: string;
  benefits: string[];
  skills: string[];
  curriculum: { week: string; topic: string }[];
  audience: string[];
  instructors: { name: string; title: string; photo: string }[];
  pricingPlans: { plan: string; access: string; extras: string; price: string }[];
  includes: string[];
  outcomes: string[];
  faqs: { q: string; a: string }[];
  howItWorks: { title: string; icon: string; desc: string }[];
  localName: string;
  upcomingDates: string[];
};

export const courses: Course[] = [
  {
    id: 'free',
    title: 'course.free.title',
    subtitle: 'course.free.subtitle',
    description: 'course.free.description',
    price: 'common.free',
    badge: 'course.free.badge',
    badgeColor: 'bg-[var(--premium-accent)]/20 text-[var(--premium-accent)]',
    duration: 'course.duration.4hours',
    certification: 'course.certification.experience',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&h=400',
    buttonStyle: 'bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80',
    icon: 'gift',
    rating: 5.0,
    enrolled: '2,500+',
    benefits: [
      'course.free.benefits.0',
      'course.free.benefits.1',
      'course.free.benefits.2',
      'course.free.benefits.3'
    ],
    skills: [
      'course.free.skills.0',
      'course.free.skills.1',
      'course.free.skills.2',
      'course.free.skills.3'
    ],
    curriculum: [
      { week: 'Hour 1', topic: 'Academy tour & introduction' },
      { week: 'Hour 2', topic: 'Live class observation' },
      { week: 'Hour 3', topic: 'Barbering demonstrations' },
      { week: 'Hour 4', topic: 'Q&A with instructors' },
    ],
    audience: [
      'course.free.audience.0',
      'course.free.audience.1',
      'course.free.audience.2',
    ],
    instructors: [
      {
        name: 'K&K Academy Team',
        title: 'Professional Barbers',
        photo: '/attached_assets/Ali karimov_1752038504324.jpg',
      },
    ],
    includes: [
      'course.free.includes.0',
      'course.free.includes.1',
      'course.free.includes.2',
      'course.free.includes.3'
    ],
    outcomes: [
      'course.free.outcomes.0',
      'course.free.outcomes.1',
      'course.free.outcomes.2',
      'course.free.outcomes.3'
    ],
    pricingPlans: [
      { 
        plan: 'course.free.pricing.title', 
        access: 'course.free.pricing.session', 
        extras: 'course.free.pricing.no.costs', 
        price: 'course.free.pricing.price',
        cta: 'course.free.pricing.cta'
      },
    ],
    faqs: [
      { q: 'Do I need any experience?', a: 'No experience required! This is perfect for complete beginners.' },
      { q: 'What should I bring?', a: 'Just yourself and your curiosity. Everything else is provided.' },
    ],
    howItWorks: [
      { title: 'course.free.howItWorks.0', icon: 'home', desc: 'course.free.howItWorks.0.desc' },
      { title: 'course.free.howItWorks.1', icon: 'eye', desc: 'course.free.howItWorks.1.desc' },
      { title: 'course.free.howItWorks.2', icon: 'users', desc: 'course.free.howItWorks.2.desc' },
    ],
    localName: 'Bezpłatny jednodniowy kurs',
    upcomingDates: [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela',
      'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'
    ],
  },
  {
    id: 'beginner',
    title: 'course.beginner.title',
    subtitle: 'course.beginner.subtitle',
    description: 'course.beginner.description',
    price: '9 000 PLN',
    badge: 'course.beginner.badge',
    badgeColor: 'bg-[var(--premium-accent)]/20 text-[var(--premium-accent)]',
    duration: 'course.duration.1month',
    certification: 'course.certification.professional',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&h=400',
    buttonStyle: 'bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80',
    icon: 'certificate',
    rating: 4.9,
    enrolled: '18,000+',
    benefits: [
      'course.beginner.benefits.0',
      'course.beginner.benefits.1',
      'course.beginner.benefits.2',
    ],
    skills: [
      'course.beginner.skills.0',
      'course.beginner.skills.1',
      'course.beginner.skills.2',
      'course.beginner.skills.3',
    ],
    curriculum: [
      { week: 'Week 1', topic: 'Tool handling & hygiene' },
      { week: 'Week 2', topic: 'Classic scissor cuts' },
      { week: 'Week 3', topic: 'Clipper work & fades' },
      { week: 'Week 4', topic: 'Beard styling & razor work' },
    ],
    audience: [
      'course.beginner.audience.0',
      'course.beginner.audience.1',
      'course.beginner.audience.2',
    ],
    instructors: [
      {
        name: 'Ali Karimov',
        title: 'Master Barber – Co-Founder',
        photo: '/attached_assets/Ali karimov_1752038504324.jpg',
      },
    ],
    includes: [
      'course.beginner.includes.0',
      'course.beginner.includes.1',
      'course.beginner.includes.2',
    ],
    outcomes: [
      'course.beginner.outcomes.0',
      'course.beginner.outcomes.1',
      'course.beginner.outcomes.2',
    ],
    pricingPlans: [
      { 
        plan: 'course.beginner.pricing.title', 
        access: 'course.beginner.pricing.duration', 
        extras: 'course.beginner.pricing.certification', 
        price: 'course.beginner.pricing.price',
        cta: 'course.beginner.pricing.cta'
      },
      { 
        plan: 'course.pricing.installments', 
        access: 'course.beginner.pricing.tools', 
        extras: 'course.beginner.pricing.installments', 
        price: 'course.beginner.pricing.full.price',
        cta: 'course.beginner.pricing.cta'
      },
    ],
    faqs: [
      { q: 'Do I need experience?', a: 'No, this course starts from zero.' },
      { q: 'Are tools included?', a: 'Yes, everything is provided during training.' },
    ],
    howItWorks: [
      { title: 'course.beginner.howItWorks.0', icon: 'book-open', desc: 'course.beginner.howItWorks.0.desc' },
      { title: 'course.beginner.howItWorks.1', icon: 'users', desc: 'course.beginner.howItWorks.1.desc' },
      { title: 'course.beginner.howItWorks.2', icon: 'scissors', desc: 'course.beginner.howItWorks.2.desc' },
    ],
    localName: '1 oylik kurs uchun',
    upcomingDates: ['15-Sep', '20-Oct', '24-Nov', '12-Jan'],
  },
  {
    id: 'advanced',
    title: 'course.advanced.title',
    subtitle: 'course.advanced.subtitle',
    description: 'course.advanced.description',
    price: '3 600 PLN',
    badge: 'course.advanced.badge',
    badgeColor: 'bg-[var(--premium-accent)]/20 text-[var(--premium-accent)]',
    duration: 'course.duration.3days',
    certification: 'course.certification.advanced',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&h=400',
    buttonStyle: 'bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80',
    icon: 'trophy',
    rating: 4.9,
    enrolled: '8,500+',
    benefits: [
      'course.advanced.benefits.0',
      'course.advanced.benefits.1',
      'course.advanced.benefits.2',
    ],
    skills: [
      'course.advanced.skills.0',
      'course.advanced.skills.1',
      'course.advanced.skills.2',
      'course.advanced.skills.3',
    ],
    curriculum: [
      { week: 'Week 1', topic: 'Refining Fundamentals' },
      { week: 'Week 2', topic: 'Skin Fades & Tapers' },
      { week: 'Week 3', topic: 'Razor Detailing' },
      { week: 'Week 4', topic: 'Creative Hair Designs' },
      { week: 'Week 5', topic: 'Personal Brand Project' },
    ],
    audience: [
      'course.advanced.audience.0',
      'course.advanced.audience.1',
      'course.advanced.audience.2',
    ],
    instructors: [
      {
        name: 'Tomasz Kaczorowski',
        title: 'Award-Winning Barber',
        photo: '/attached_assets/Tomasz_1752038504331.jpg',
      },
    ],
    includes: [
      'course.advanced.includes.0',
      'course.advanced.includes.1',
      'course.advanced.includes.2',
    ],
    outcomes: [
      'course.advanced.outcomes.0',
      'course.advanced.outcomes.1',
      'course.advanced.outcomes.2',
    ],
    pricingPlans: [
      { 
        plan: 'course.advanced.pricing.title', 
        access: 'course.advanced.pricing.duration', 
        extras: 'course.advanced.pricing.portfolio', 
        price: 'course.advanced.pricing.price',
        cta: 'course.advanced.pricing.cta'
      },
    ],
    faqs: [
      { q: 'Who can enroll?', a: 'Barbers with at least 2 years salon experience.' },
    ],
    howItWorks: [
      { title: 'course.advanced.howItWorks.0', icon: 'trophy', desc: 'course.advanced.howItWorks.0.desc' },
      { title: 'course.advanced.howItWorks.1', icon: 'briefcase', desc: 'course.advanced.howItWorks.1.desc' },
      { title: 'course.advanced.howItWorks.2', icon: 'users', desc: 'course.advanced.howItWorks.2.desc' },
    ],
    localName: '3 kunlik kurs uchun',
    upcomingDates: [
      '8-iyul', '15-iyul', '22-iyul', '29-iyul', '5-avgust', '12-avgust', 
      '19-avgust', '26-avgust', '2-sentabr', '9-sentabr', '16-sentabr', 
      '23-sentabr', '30-sentabr', '7-oktabr', '14-oktabr', '21-oktabr', 
      '28-oktabr', '4-noyabr', '11-noyabr', '18-noyabr', '25-noyabr', 
      '2-dekabr', '9-dekabr', '16-dekabr'
    ],
  },
  {
    id: 'specialist',
    title: 'course.specialist.title',
    subtitle: 'course.specialist.subtitle',
    description: 'course.specialist.description',
    price: '5 500 PLN',
    badge: 'course.specialist.badge',
    badgeColor: 'bg-[var(--premium-accent)]/20 text-[var(--premium-accent)]',
    duration: 'course.duration.2weeks',
    certification: 'course.certification.specialist',
    image: 'https://images.unsplash.com/photo-1542125387-c71274d94f0a?auto=format&fit=crop&w=800&h=400',
    buttonStyle: 'bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80',
    icon: 'briefcase',
    rating: 4.8,
    enrolled: '5,200+',
    benefits: [
      'course.specialist.benefits.0',
      'course.specialist.benefits.1',
      'course.specialist.benefits.2',
    ],
    skills: [
      'course.specialist.skills.0',
      'course.specialist.skills.1',
      'course.specialist.skills.2',
      'course.specialist.skills.3',
    ],
    curriculum: [
      { week: 'Week 1', topic: 'Business Fundamentals' },
      { week: 'Week 2', topic: 'Marketing Strategies' },
      { week: 'Week 3', topic: 'Financial Planning' },
      { week: 'Week 4', topic: 'Growth Hacking' },
      { week: 'Week 5', topic: 'Capstone Business Plan' },
    ],
    audience: [
      'course.specialist.audience.0',
      'course.specialist.audience.1',
      'course.specialist.audience.2',
    ],
    instructors: [
      {
        name: 'K&K Academy',
        title: 'Business Strategist',
        photo: '/attached_assets/Bartosz_1752038504320.jpg',
      },
    ],
    includes: [
      'course.specialist.includes.0',
      'course.specialist.includes.1',
      'course.specialist.includes.2',
    ],
    outcomes: [
      'course.specialist.outcomes.0',
      'course.specialist.outcomes.1',
      'course.specialist.outcomes.2',
    ],
    pricingPlans: [
      { 
        plan: 'course.specialist.pricing.title', 
        access: 'course.specialist.pricing.duration', 
        extras: 'course.specialist.pricing.trends', 
        price: 'course.specialist.pricing.price',
        cta: 'course.specialist.pricing.cta'
      },
    ],
    faqs: [
      { q: 'Is accommodation included?', a: 'No, but we can recommend nearby hotels.' },
    ],
    howItWorks: [
      { title: 'course.specialist.howItWorks.0', icon: 'book-open', desc: 'course.specialist.howItWorks.0.desc' },
      { title: 'course.specialist.howItWorks.1', icon: 'scissors', desc: 'course.specialist.howItWorks.1.desc' },
      { title: 'course.specialist.howItWorks.2', icon: 'users', desc: 'course.specialist.howItWorks.2.desc' },
    ],
    localName: '2 haftalik kurs uchun',
    upcomingDates: [
      '14-iyul', '28-iyul', '11-avgust', '25-avgust', '8-sentabr', 
      '22-sentabr', '6-oktabr', '20-oktabr', '3-noyabr', '17-noyabr', 
      '1-dekabr', '15-dekabr'
    ],
  },
]; 