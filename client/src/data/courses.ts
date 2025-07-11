export type Course = {
  id: number;
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
    id: 0,
    title: 'One-Day Free Barbering Course',
    subtitle: 'Get a Real Taste of the Barbering World – For Free',
    description: 'Curious about becoming a barber, but not sure where to start? Our One-Day Free Course is the perfect way to experience what it\'s really like to be part of a professional barbering academy.',
    price: 'FREE',
    badge: 'Free Course',
    badgeColor: 'bg-green-500/20 text-green-600',
    duration: '4 hours',
    certification: 'Experience Certificate',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&h=400',
    buttonStyle: 'bg-green-600 text-white hover:bg-green-700',
    icon: 'gift',
    rating: 5.0,
    enrolled: '2,500+',
    benefits: [
      '4 Hours of Hands-On Experience – On Site',
      'Explore the Academy & Barbershop Atmosphere',
      'See the Quality for Yourself',
      'Ask Questions & Get Guidance'
    ],
    skills: [
      'Academy exploration',
      'Live class observation',
      'Meet expert barbers',
      'Industry Q&A session'
    ],
    curriculum: [
      { week: 'Hour 1', topic: 'Academy tour & introduction' },
      { week: 'Hour 2', topic: 'Live class observation' },
      { week: 'Hour 3', topic: 'Barbering demonstrations' },
      { week: 'Hour 4', topic: 'Q&A with instructors' },
    ],
    audience: [
      'Complete beginners',
      'Anyone interested in barbering',
      'Career explorers',
    ],
    instructors: [
      {
        name: 'K&K Academy Team',
        title: 'Professional Barbers',
        photo: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
    ],
    includes: [
      'Academy tour',
      'Live demonstrations',
      'Expert guidance',
      'No commitment required'
    ],
    outcomes: [
      'Know if barbering is right for you',
      'See how our academy works',
      'Understand our teaching style',
      'Get inspired by real professionals'
    ],
    pricingPlans: [
      { plan: 'Free Experience', access: 'Full 4-hour session', extras: 'No hidden costs', price: 'FREE' },
    ],
    faqs: [
      { q: 'Do I need any experience?', a: 'No experience required! This is perfect for complete beginners.' },
      { q: 'What should I bring?', a: 'Just yourself and your curiosity. Everything else is provided.' },
    ],
    howItWorks: [
      { title: 'Academy Tour', icon: 'home', desc: 'Explore our modern training spaces' },
      { title: 'Live Observation', icon: 'eye', desc: 'Watch real classes in action' },
      { title: 'Meet the Team', icon: 'users', desc: 'Chat with our expert instructors' },
    ],
    localName: 'Bezpłatny jednodniowy kurs',
    upcomingDates: ['każda sobota', 'every Saturday', 'her cumartesi'],
  },
  {
    id: 1,
    title: 'Beginner Barber Course – From Zero to Barber',
    subtitle: 'Start a new profession with full preparation and confidence',
    description:
      'Intensive 24-day program (Mon–Sat, 12–20) that takes absolute beginners to professional barbers through theory, mannequin practice, and daily work on live models.',
    price: '9 000 PLN',
    badge: 'Beginner',
    badgeColor: 'bg-[var(--premium-accent)]/20 text-[var(--premium-accent)]',
    duration: '24 days • 8h/day',
    certification: 'Certificate of completion',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&h=400',
    buttonStyle: 'bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80',
    icon: 'id-card',
    rating: 4.9,
    enrolled: '18,000+',
    benefits: [
      'Extensive hands-on practice on live models',
      'Individual attention for each student',
      'All professional tools on-site',
    ],
    skills: [
      'Classic & modern haircuts',
      'Clipper fading (low/mid/high)',
      'Razor work & detailing',
      'Beard shaping & care',
    ],
    curriculum: [
      { week: 'Week 1', topic: 'Tool handling & hygiene' },
      { week: 'Week 2', topic: 'Classic scissor cuts' },
      { week: 'Week 3', topic: 'Clipper work & fades' },
      { week: 'Week 4', topic: 'Beard styling & razor work' },
    ],
    audience: [
      'People with no experience',
      'Career changers',
      'Students after school',
    ],
    instructors: [
      {
        name: 'Ali Karimov',
        title: 'Master Barber – Co-Founder',
        photo: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
    ],
    includes: [
      'Professional scissors & comb gift',
      'All tools provided',
      'Certificate of completion',
    ],
    outcomes: [
      'Perform modern cuts & fades',
      'Confidently style beards',
      'Launch barber career',
    ],
    pricingPlans: [
      { plan: 'Full Payment', access: 'All modules', extras: '', price: '9 000 PLN' },
      { plan: 'Installments', access: 'All modules', extras: '2× 4 600 PLN', price: '0% interest' },
    ],
    faqs: [
      { q: 'Do I need experience?', a: 'No, this course starts from zero.' },
      { q: 'Are tools included?', a: 'Yes, everything is provided during training.' },
    ],
    howItWorks: [
      { title: 'Theory', icon: 'book-open', desc: 'Interactive lectures & demos' },
      { title: 'Practice on Mannequins', icon: 'users', desc: 'Develop muscle memory safely' },
      { title: 'Real Clients', icon: 'scissors', desc: 'Supervised cuts on live models' },
    ],
    localName: '1 oylik kurs uchun',
    upcomingDates: ['1-avgust', '1-sentabr', '1-oktabr', '1-noyabr', '1-dekabr'],
  },
  {
    id: 2,
    title: 'Advanced Course for Barbers',
    subtitle: 'Expand your skills & learn the latest techniques',
    description:
      '3-day bootcamp (Mon–Sat, 12–20) for active barbers (min 2 yrs) focusing on modern cuts, advanced fades, and premium beard work.',
    price: '3 600 PLN',
    badge: 'Advanced',
    badgeColor: 'bg-[var(--premium-accent)]/20 text-[var(--premium-accent)]',
    duration: '3 days • 8h/day',
    certification: 'Certificate of completion',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&h=400',
    buttonStyle: 'bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80',
    icon: 'trophy',
    rating: 4.9,
    enrolled: '8,500+',
    benefits: [
      'Advanced razor & fade workshops',
      'Interactive demos with industry pros',
      'Portfolio-ready final project',
    ],
    skills: [
      'Skin fades & creative designs',
      'Straight razor shaving',
      'Client retention strategies',
      'Social media promotion',
    ],
    curriculum: [
      { week: 'Week 1', topic: 'Refining Fundamentals' },
      { week: 'Week 2', topic: 'Skin Fades & Tapers' },
      { week: 'Week 3', topic: 'Razor Detailing' },
      { week: 'Week 4', topic: 'Creative Hair Designs' },
      { week: 'Week 5', topic: 'Personal Brand Project' },
    ],
    audience: [
      'Licensed barbers',
      'Experienced stylists',
      'Freelancers looking to upskill',
    ],
    instructors: [
      {
        name: 'Carlos M.',
        title: 'Award-Winning Barber',
        photo: 'https://randomuser.me/api/portraits/men/76.jpg',
      },
    ],
    includes: ['All tools provided','Gift set – scissors & comb','Certificate'],
    outcomes: ['Master modern styles','Blend flawless fades','Premium beard services'],
    pricingPlans: [
      { plan: 'Full', access: '3-day bootcamp', extras: '', price: '3 600 PLN' },
    ],
    faqs: [
      { q: 'Who can enroll?', a: 'Barbers with at least 2 years salon experience.' },
    ],
    howItWorks: [
      { title: 'Masterclasses', icon: 'trophy', desc: 'Live demos from award-winning barbers' },
      { title: 'Portfolio Project', icon: 'briefcase', desc: 'Photo shoot with models for Instagram' },
      { title: '1:1 Mentorship', icon: 'users', desc: 'Personal feedback & growth plan' },
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
    id: 3,
    title: 'Specialist Course – Trends & New Techniques',
    subtitle: 'Refresh skills & master global trends',
    description:
      '2-week programme (Mon–Sat, 12–19) for barbers/hairdressers wanting to adopt the latest global trends in cuts, fades and beard styling.',
    price: '5 500 PLN',
    badge: 'Specialist',
    badgeColor: 'bg-[var(--premium-accent)]/20 text-[var(--premium-accent)]',
    duration: '2 weeks • 7h/day',
    certification: 'Certificate of completion',
    image: 'https://images.unsplash.com/photo-1542125387-c71274d94f0a?auto=format&fit=crop&w=800&h=400',
    buttonStyle: 'bg-[var(--premium-accent)] text-black hover:bg-[var(--premium-accent)]/80',
    icon: 'briefcase',
    rating: 4.8,
    enrolled: '5,200+',
    benefits: [
      'Shop management blueprints',
      'Branding & marketing playbook',
      'Financial planning roadmap',
    ],
    skills: [
      'Client retention',
      'Budgeting & finance',
      'Local marketing',
      'Leadership & hiring',
    ],
    curriculum: [
      { week: 'Week 1', topic: 'Business Fundamentals' },
      { week: 'Week 2', topic: 'Marketing Strategies' },
      { week: 'Week 3', topic: 'Financial Planning' },
      { week: 'Week 4', topic: 'Growth Hacking' },
      { week: 'Week 5', topic: 'Capstone Business Plan' },
    ],
    audience: [
      'Entrepreneurs scaling businesses',
      'Barbershop owners',
      'Freelancers looking to upskill',
    ],
    instructors: [
      {
        name: 'Sophia L.',
        title: 'Business Strategist',
        photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
    ],
    includes: ['Tools on-site','Professional kit gift','Certificate'],
    outcomes: ['Master trending styles','Improve razor work','Attract new clients'],
    pricingPlans: [
      { plan: 'Full', access: 'All modules', extras: '', price: '5 500 PLN' },
    ],
    faqs: [
      { q: 'Is accommodation included?', a: 'No, but we can recommend nearby hotels.' },
    ],
    howItWorks: [
      { title: 'Trend Workshops', icon: 'book-open', desc: 'Weekly sessions on latest global cuts' },
      { title: 'Hands-on Labs', icon: 'scissors', desc: 'Immediate practice under supervision' },
      { title: 'Client Demos', icon: 'users', desc: 'Style real customers & receive feedback' },
    ],
    localName: '2 haftalik kurs uchun',
    upcomingDates: [
      '14-iyul', '28-iyul', '11-avgust', '25-avgust', '8-sentabr', 
      '22-sentabr', '6-oktabr', '20-oktabr', '3-noyabr', '17-noyabr', 
      '1-dekabr', '15-dekabr'
    ],
  },
]; 