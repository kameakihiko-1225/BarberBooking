import { users, inquiries, blogPosts, mediaFiles, type User, type InsertUser, type Inquiry, type InsertInquiry, type BlogPost, type InsertBlogPost, type MediaFile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  getBlogPosts(language?: string): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string, language?: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  getMediaFilesByRoute(route: string): Promise<MediaFile[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private inquiries: Map<number, Inquiry>;
  private blogPosts: Map<number, BlogPost>;
  private currentUserId: number;
  private currentInquiryId: number;
  private currentBlogPostId: number;

  constructor() {
    this.users = new Map();
    this.inquiries = new Map();
    this.blogPosts = new Map();
    this.currentUserId = 1;
    this.currentInquiryId = 1;
    this.currentBlogPostId = 1;
    
    // Initialize with sample blog posts
    this.initializeBlogPosts();
  }

  private initializeBlogPosts() {
    const samplePosts: BlogPost[] = [
      // Polish posts
      {
        id: this.currentBlogPostId++,
        slug: "start-barber-career",
        title: "Jak rozpocząć karierę w barberstwie",
        content: "Myślisz o zostaniu fryzjerem? Oto jak może wyglądać pierwszych 30 dni...\n\nPrzemysł fryzjerski oferuje niesamowite możliwości dla kreatywnych profesjonalistów, którzy chcą budować trwałe relacje z klientami, jednocześnie opanowując ponadczasowe rzemiosło. Niezależnie od tego, czy zmieniasz karierę, czy dopiero zaczynasz, oto kompletny przewodnik po rozpoczęciu udanej kariery fryzjerskiej.\n\n## Dlaczego wybrać fryzjerstwo?\n\nFryzjerstwo łączy artyzm z przedsiębiorczością. Jako fryzjer będziesz:\n- Opanowywać tradycyjne i nowoczesne techniki strzyżenia\n- Budować lojalną klientelę\n- Mieć elastyczność pracy w salonach lub założenia własnego biznesu\n- Zarabiać konkurencyjne wynagrodzenia z potencjałem wzrostu\n\n## Pierwsze kroki\n\n### 1. Zbadaj lokalne wymagania\nKażdy region ma różne wymagania licencyjne. Większość wymaga:\n- Ukończenia zatwierdzonego programu fryzjerskiego\n- Zdania egzaminów pisemnych i praktycznych\n- Punktów za kształcenie ustawiczne\n\n### 2. Wybierz odpowiedni program szkoleniowy\nSzukaj programów oferujących:\n- Kompleksowy program obejmujący strzyżenie, golenie i stylizację\n- Praktykę na rzeczywistych klientach\n- Szkolenie biznesowe i obsługi klienta\n- Pomoc w znalezieniu pracy\n\n### 3. Zainwestuj w wysokiej jakości narzędzia\nProfesjonalne narzędzia są niezbędne:\n- Wysokiej jakości maszynki i trymery\n- Ostre nożyczki i brzytwy\n- Grzebienie, szczotki i produkty do stylizacji\n- Materiały do dezynfekcji\n\n## Budowanie umiejętności\n\nUdani fryzjerzy nigdy nie przestają się uczyć. Skup się na:\n- Opanowaniu klasycznych strzyżeń jak fade, taper i przycinanie brody\n- Śledzeniu najnowszych trendów i technik\n- Rozwijaniu własnego stylu\n- Budowaniu umiejętności komunikacyjnych\n\n## Możliwości kariery\n\nBranża fryzjerska oferuje różne ścieżki:\n- Tradycyjne zakłady fryzjerskie\n- Ekskluzywne salony\n- Mobilne usługi fryzjerskie\n- Własny salon\n- Nauczanie w szkołach fryzjerskich\n\nW K&K Barber Academy zapewniamy kompleksowe szkolenie, które przygotowuje Cię do każdej z tych ścieżek kariery. Nasi doświadczeni instruktorzy i nowoczesne zaplecze zapewniają, że ukończysz kurs z umiejętnościami i pewnością siebie potrzebnymi do sukcesu.\n\nGotowy na rozpoczęcie swojej przygody z fryzjerstwem? Skontaktuj się z nami już dziś, aby dowiedzieć się więcej o naszych programach!",
        image: "/media/blog/barber-career.jpg",
        tag: "POCZĄTKUJĄCY",
        language: "pl",
        originalPostId: null,
        active: 1,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15")
      },
      {
        id: this.currentBlogPostId++,
        slug: "top-5-fade-techniques-2025",
        title: "Top 5 technik fade na 2025 rok",
        content: "Bądź na bieżąco z tymi niezbędnymi wariacjami fade, o które będzie prosić każdy klient.\n\n## 1. Burst Fade\nBurst fade zakrzywia się wokół ucha, tworząc dynamiczny wygląd, który pasuje do każdej długości włosów na górze. Idealny dla klientów chcących czegoś nowoczesnego, ale profesjonalnego.\n\n**Jak to osiągnąć:**\n- Zacznij od nasadki #2 wokół ucha\n- Użyj techniki burst do roztarcia na zewnątrz\n- Utrzymuj tył i boki czyste\n\n## 2. Drop Fade\nTa technika podąża za naturalną krzywizną głowy, opadając niżej za uchem dla eleganckiego, współczesnego wyglądu.\n\n## 3. Skin Fade\nSzczyt precyzji, ścinanie włosów do skóry dla maksymalnego kontrastu. Wymaga pewnych rąk i ostrych ostrzy.\n\n## 4. Mid Fade\nWszechstronna opcja zaczynająca się wokół okolicy skroni, idealna dla środowisk zawodowych przy zachowaniu stylu.\n\n## 5. Textured Fade\nŁączenie technik fade z teksturyzacją tworzy ruch i wymiar, idealne dla grubych lub falowanych typów włosów.\n\n**Porady profesjonalistów:**\n- Zawsze używaj ostrych ostrzy dla czystych linii\n- Nie spiesz się z roztarciem\n- Ćwicz na manekinach przed próbami na klientach\n- Utrzymuj nasadki czyste i zorganizowane\n\nOpanuj te techniki w naszych zaawansowanych klasach strzyżenia w K&K Barber Academy!",
        image: "/media/gallarey/IMG_3142.jpg",
        tag: "TRENDY",
        language: "pl",
        originalPostId: null,
        active: 1,
        createdAt: new Date("2025-01-20"),
        updatedAt: new Date("2025-01-20")
      },
      {
        id: this.currentBlogPostId++,
        slug: "barber-toolkit-essentials",
        title: "Zestaw narzędzi fryzjera: Niezbędne vs Miłe w posiadaniu",
        content: "Od maszynki po grzebienie, oto nasz definitywny przewodnik po budowaniu profesjonalnego zestawu bez przepłacania.\n\n## Niezbędne narzędzia (Obowiązkowe)\n\n### Maszynki\n- **Profesjonalne maszynki przewodowe**: Niezawodność i moc to klucz\n- **Wiele rozmiarów nasadek**: minimum od #0.5 do #8\n- **Olej do ostrzy i szczotka do czyszczenia**: Konserwacja jest kluczowa\n\n### Narzędzia do strzyżenia\n- **6-calowe nożyczki fryzjerskie**: Do precyzyjnego strzyżenia\n- **Nożyczki do przerzedzania**: Do teksturyzacji i roztarcia\n- **Brzytwa prosta**: Do czystych linii i tradycyjnego golenia\n\n### Narzędzia do stylizacji\n- **Grzebień o szerokich zębach**: Do rozplątywania\n- **Grzebień o drobnych zębach**: Do precyzyjnego przedziałkowania\n- **Szczotka z naturalnego włosia**: Do stylizacji i wykończenia\n\n## Miłe dodatki\n\n### Zaawansowany sprzęt\n- **Bezprzewodowy trymer szczegółowy**: Do mobilności i precyzji\n- **Podgrzewacz ręczników**: Podnosi doświadczenie klienta\n- **Profesjonalna peleryna i paski na szyję**: Higiena i komfort\n\n### Produkty do stylizacji\n- **Wybór pomad**: Różne utrwalenia i wykończenia\n- **Spray z solą morską**: Do tekstury\n- **Olejki do brody**: Do pielęgnacji zarostu\n\n## Stopniowe budowanie zestawu\n\nZacznij od podstaw i dodawaj narzędzia w miarę rozwoju umiejętności i klienteli. Jakość zawsze wygrywa z ilością - jedna świetna para nożyczek jest lepsza niż pięć przeciętnych.\n\n**Porady oszczędnościowe:**\n- Kup najpierw niezbędne narzędzia, ulepszaj stopniowo\n- Inwestuj w konserwację ostrzy\n- Dołącz do grup zawodowych po zniżki na sprzęt\n- Rozważ używany sprzęt od renomowanych źródeł\n\nW K&K Barber Academy uczymy Cię, jak właściwie używać każdego narzędzia i pomagamy zrozumieć, które inwestycje najlepiej posłużą Twojej karierze.",
        image: "/media/gallarey/IMG_4490.jpg", 
        tag: "NARZĘDZIA",
        language: "pl",
        originalPostId: null,
        active: 1,
        createdAt: new Date("2025-01-25"),
        updatedAt: new Date("2025-01-25")
      },

      // English versions
      {
        id: this.currentBlogPostId++,
        slug: "start-barber-career-en",
        title: "How to Start a Career in Barbering",
        content: "Thinking about becoming a barber? Here's what your first 30 days might look like...\n\nThe barbering industry offers incredible opportunities for creative professionals who want to build lasting relationships with clients while mastering a timeless craft. Whether you're switching careers or just starting out, here's your complete guide to launching a successful barbering career.\n\n## Why Choose Barbering?\n\nBarbering combines artistry with entrepreneurship. As a barber, you'll:\n- Master traditional and modern cutting techniques\n- Build a loyal clientele\n- Have the flexibility to work in shops or start your own business\n- Earn competitive wages with growth potential\n\n## Getting Started: Your First Steps\n\n### 1. Research Your Local Requirements\nEvery state has different licensing requirements. Most require:\n- Completion of an approved barbering program\n- Passing written and practical exams\n- Continuing education credits\n\n### 2. Choose the Right Training Program\nLook for programs that offer:\n- Comprehensive curriculum covering cuts, shaves, and styling\n- Hands-on practice with real clients\n- Business and customer service training\n- Job placement assistance\n\n### 3. Invest in Quality Tools\nProfessional-grade tools are essential:\n- High-quality clippers and trimmers\n- Sharp scissors and razors\n- Combs, brushes, and styling products\n- Sanitation supplies\n\n## Building Your Skills\n\nSuccessful barbers never stop learning. Focus on:\n- Mastering classic cuts like fades, tapers, and beard trims\n- Staying current with trends and techniques\n- Developing your unique style\n- Building communication skills\n\n## Career Opportunities\n\nThe barbering field offers various paths:\n- Traditional barbershops\n- High-end salons\n- Mobile barbering services\n- Owning your own shop\n- Teaching at barbering schools\n\nAt K&K Barber Academy, we provide comprehensive training that prepares you for any of these career paths. Our experienced instructors and modern facilities ensure you graduate with the skills and confidence needed to succeed.\n\nReady to start your barbering journey? Contact us today to learn more about our programs!",
        image: "/media/blog/barber-career.jpg",
        tag: "BEGINNER",
        language: "en",
        originalPostId: 1,
        active: 1,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15")
      },
      {
        id: this.currentBlogPostId++,
        slug: "top-5-fade-techniques-2025-en",
        title: "Top 5 Fade Techniques for 2025",
        content: "Stay ahead of the curve with these must-know fade variations every client will ask for.\n\n## 1. The Burst Fade\nThe burst fade curves around the ear, creating a dynamic look that works with any hair length on top. Perfect for clients wanting something modern yet professional.\n\n**How to achieve it:**\n- Start with a #2 guard around the ear\n- Use the burst technique to blend outward\n- Keep the back and sides clean\n\n## 2. Drop Fade\nThis technique follows the natural curve of the head, dropping lower behind the ear for a sleek, contemporary appearance.\n\n## 3. Skin Fade\nThe ultimate in precision, taking hair down to the skin for maximum contrast. Requires steady hands and sharp blades.\n\n## 4. Mid Fade\nA versatile option that starts around the temple area, perfect for professional environments while maintaining style.\n\n## 5. Textured Fade\nCombining fading techniques with texturizing creates movement and dimension, ideal for thick or wavy hair types.\n\n**Pro Tips:**\n- Always use sharp blades for clean lines\n- Take your time with the blending\n- Practice on mannequins before trying on clients\n- Keep your guards clean and organized\n\nMaster these techniques in our advanced cutting classes at K&K Barber Academy!",
        image: "/media/gallarey/IMG_3142.jpg",
        tag: "TRENDS",
        language: "en",
        originalPostId: 2,
        active: 1,
        createdAt: new Date("2025-01-20"),
        updatedAt: new Date("2025-01-20")
      },
      {
        id: this.currentBlogPostId++,
        slug: "barber-toolkit-essentials-en",
        title: "Barber Toolkit: Essentials vs. Nice-to-Have",
        content: "From clippers to combs, here's our definitive guide to building a pro kit without overspending.\n\n## Essential Tools (Must-Have)\n\n### Clippers\n- **Professional-grade corded clippers**: Reliability and power are key\n- **Multiple guard sizes**: #0.5 through #8 minimum\n- **Blade oil and cleaning brush**: Maintenance is crucial\n\n### Cutting Tools\n- **6-inch barbering scissors**: For precision cutting\n- **Thinning shears**: For texturing and blending\n- **Straight razor**: For clean lines and traditional shaves\n\n### Styling Tools\n- **Wide-tooth comb**: For detangling\n- **Fine-tooth comb**: For precise parting\n- **Boar bristle brush**: For styling and finishing\n\n## Nice-to-Have Additions\n\n### Advanced Equipment\n- **Cordless detail trimmer**: For mobility and precision\n- **Hot towel warmer**: Elevates the client experience\n- **Professional cape and neck strips**: Hygiene and comfort\n\n### Styling Products\n- **Pomade selection**: Different holds and finishes\n- **Sea salt spray**: For texture\n- **Beard oils**: For facial hair care\n\n## Building Your Kit Gradually\n\nStart with essentials and add tools as your skills and clientele grow. Quality over quantity always wins - one great pair of scissors beats five mediocre ones.\n\n**Budget-Friendly Tips:**\n- Buy essential tools first, upgrade gradually\n- Invest in blade maintenance\n- Join professional groups for equipment discounts\n- Consider used equipment from reputable sources\n\nAt K&K Barber Academy, we teach you how to use every tool properly and help you understand what investments will serve your career best.",
        image: "/media/gallarey/IMG_4490.jpg", 
        tag: "TOOLS",
        language: "en",
        originalPostId: 3,
        active: 1,
        createdAt: new Date("2025-01-25"),
        updatedAt: new Date("2025-01-25")
      },

      // Turkish versions
      {
        id: this.currentBlogPostId++,
        slug: "start-barber-career-tr",
        title: "Berberlik Kariyerine Nasıl Başlanır",
        content: "Berber olmayı düşünüyor musunuz? İlk 30 günün nasıl geçeceğini anlatalım...\n\nBerberlik endüstrisi, müşterilerle kalıcı ilişkiler kurmak isteyen ve zamansız bir zanaat ustası olmak isteyen yaratıcı profesyoneller için inanılmaz fırsatlar sunuyor. Kariyer değiştiriyor olun ya da yeni başlıyor olun, başarılı bir berberlik kariyeri başlatmak için eksiksiz rehberiniz burada.\n\n## Neden Berberliği Seçmeli?\n\nBerberlik sanatçılığı girişimcilikle birleştirir. Bir berber olarak:\n- Geleneksel ve modern kesim tekniklerinde ustalaşacaksınız\n- Sadık bir müşteri portföyü oluşturacaksınız\n- Dükkanlar da çalışma ya da kendi işinizi kurma esnekliğine sahip olacaksınız\n- Büyüme potansiyeli olan rekabetçi ücretler kazanacaksınız\n\n## Başlarken: İlk Adımlar\n\n### 1. Yerel Gereksinimleri Araştırın\nHer bölgenin farklı lisans gereksinimleri vardır. Çoğu şunları gerektirir:\n- Onaylanmış bir berberlik programını tamamlama\n- Yazılı ve pratik sınavları geçme\n- Sürekli eğitim kredileri\n\n### 2. Doğru Eğitim Programını Seçin\nŞunları sunan programlar arayın:\n- Kesim, tıraş ve şekillendirmeyi kapsayan kapsamlı müfredat\n- Gerçek müşterilerle uygulamalı pratik\n- İş ve müşteri hizmetleri eğitimi\n- İş yerleştirme yardımı\n\n### 3. Kaliteli Aletlere Yatırım Yapın\nProfesyonel kalite aletler şarttır:\n- Yüksek kaliteli makineler ve kesiciler\n- Keskin makas ve jiletler\n- Taraklar, fırçalar ve şekillendirme ürünleri\n- Hijyen malzemeleri\n\n## Becerilerinizi Geliştirme\n\nBaşarılı berberler hiç öğrenmeyi bırakmazlar. Şunlara odaklanın:\n- Fade, taper ve sakal kesimi gibi klasik kesimlerde ustalaşma\n- Güncel trendler ve tekniklerle haberdar olma\n- Benzersiz tarzınızı geliştirme\n- İletişim becerilerini oluşturma\n\n## Kariyer Fırsatları\n\nBerberlik alanı çeşitli yollar sunar:\n- Geleneksel berberhane\n- Lüks salonlar\n- Mobil berberlik hizmetleri\n- Kendi dükkanınızı açmak\n- Berberlik okullarında öğretmenlik\n\nK&K Barber Academy'de, bu kariyer yollarının herhangi birine hazırlayan kapsamlı eğitim sağlıyoruz. Deneyimli eğitmenlerimiz ve modern tesislerimiz, başarılı olmak için gereken beceri ve güvenle mezun olmanızı sağlar.\n\nBerberlik yolculuğunuza başlamaya hazır mısınız? Programlarımız hakkında daha fazla bilgi almak için bugün bizimle iletişime geçin!",
        image: "/media/blog/barber-career.jpg",
        tag: "BAŞLANGIÇ",
        language: "tr",
        originalPostId: 1,
        active: 1,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15")
      },
      {
        id: this.currentBlogPostId++,
        slug: "top-5-fade-techniques-2025-tr",
        title: "2025 için En İyi 5 Fade Tekniği",
        content: "Her müşterinin soracağı bu bilmesi gereken fade varyasyonlarıyla çağın önünde olun.\n\n## 1. Burst Fade\nBurst fade kulak etrafında kıvrılır, üstteki herhangi bir saç uzunluğuyla çalışan dinamik bir görünüm yaratır. Modern ama profesyonel bir şey isteyen müşteriler için mükemmel.\n\n**Nasıl elde edilir:**\n- Kulak etrafında #2 koruyucuyla başlayın\n- Dışa karışım için burst tekniğini kullanın\n- Arka ve yanları temiz tutun\n\n## 2. Drop Fade\nBu teknik kafanın doğal eğrisini takip eder, kulak arkasında daha düşük düşerek şık, çağdaş bir görünüm sağlar.\n\n## 3. Skin Fade\nPrecizliğin zirvesi, maksimum kontrast için saçı deriyle aynı seviyeye getirmek. Sabit eller ve keskin bıçaklar gerektirir.\n\n## 4. Mid Fade\nŞakak bölgesi civarında başlayan çok yönlü bir seçenek, stil korurken profesyonel ortamlar için mükemmel.\n\n## 5. Textured Fade\nSolma tekniklerini dokusallıkla birleştirmek hareket ve boyut yaratır, kalın veya dalgalı saç tipleri için ideal.\n\n**Profesyonel İpuçları:**\n- Temiz çizgiler için her zaman keskin bıçaklar kullanın\n- Karışımla aceleniz olmasın\n- Müşterilerde denemeden önce mankenlerde pratik yapın\n- Koruyucularınızı temiz ve düzenli tutun\n\nK&K Barber Academy'deki gelişmiş kesim derslerimizde bu teknikleri öğrenin!",
        image: "/media/gallarey/IMG_3142.jpg",
        tag: "TRENDLER",
        language: "tr",
        originalPostId: 2,
        active: 1,
        createdAt: new Date("2025-01-20"),
        updatedAt: new Date("2025-01-20")
      },
      {
        id: this.currentBlogPostId++,
        slug: "barber-toolkit-essentials-tr",
        title: "Berber Araç Kiti: Temel vs Güzel Olacaklar",
        content: "Makinelerden taraklara kadar, fazla harcama yapmadan profesyonel kit oluşturma rehberimiz.\n\n## Temel Araçlar (Olmazsa Olmaz)\n\n### Makineler\n- **Profesyonel kalite kablolu makineler**: Güvenilirlik ve güç anahtardır\n- **Çoklu koruyucu boyutları**: minimum #0.5'ten #8'e kadar\n- **Bıçak yağı ve temizlik fırçası**: Bakım kritiktir\n\n### Kesim Araçları\n- **6 inç berberlik makası**: Hassas kesim için\n- **İnceltme makası**: Dokulandırma ve karıştırma için\n- **Düz jilet**: Temiz çizgiler ve geleneksel tıraş için\n\n### Şekillendirme Araçları\n- **Geniş dişli tarak**: Karmaşıklıkları çözmek için\n- **İnce dişli tarak**: Hassas ayrım için\n- **Domuzkuşu kılı fırça**: Şekillendirme ve bitirme için\n\n## Güzel Eklemeler\n\n### Gelişmiş Ekipman\n- **Kablosuz detay makası**: Hareketlilik ve hassaslık için\n- **Sıcak havlu ısıtıcısı**: Müşteri deneyimini yükseltir\n- **Profesyonel pelerin ve boyun şeritleri**: Hijyen ve konfor\n\n### Şekillendirme Ürünleri\n- **Pomada seçimi**: Farklı tutma ve bitirme\n- **Deniz tuzu spreyi**: Doku için\n- **Sakal yağları**: Yüz kılı bakımı için\n\n## Kitinizi Yavaş Yavaş Oluşturmak\n\nTemellerle başlayın ve becerileriniz ve müşteri kitleniz büyüdükçe araçlar ekleyin. Kalite her zaman miktarı yener - bir harika makas beş vasat olandan iyidir.\n\n**Bütçe Dostu İpuçları:**\n- Önce temel araçları satın alın, yavaş yavaş yükseltin\n- Bıçak bakımına yatırım yapın\n- Ekipman indirimleri için profesyonel gruplara katılın\n- Saygın kaynaklardan ikinci el ekipman düşünün\n\nK&K Barber Academy'de her aracı nasıl düzgün kullanacağınızı öğretiyoruz ve hangi yatırımların kariyerinize en iyi hizmet edeceğini anlamanıza yardımcı oluyoruz.",
        image: "/media/gallarey/IMG_4490.jpg", 
        tag: "ARAÇLAR",
        language: "tr",
        originalPostId: 3,
        active: 1,
        createdAt: new Date("2025-01-25"),
        updatedAt: new Date("2025-01-25")
      }
    ];

    samplePosts.forEach(post => {
      this.blogPosts.set(post.id, post);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { 
      ...insertInquiry,
      phone: insertInquiry.phone || null,
      program: insertInquiry.program || null,
      message: insertInquiry.message || null,
      id, 
      createdAt: new Date()
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getBlogPosts(language?: string): Promise<BlogPost[]> {
    const allPosts = Array.from(this.blogPosts.values()).filter(post => post.active === 1);
    
    if (language) {
      return allPosts.filter(post => post.language === language).sort((a, b) => 
        (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
      );
    }
    
    return allPosts.sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getBlogPostBySlug(slug: string, language?: string): Promise<BlogPost | undefined> {
    const allPosts = Array.from(this.blogPosts.values()).filter(post => post.active === 1);
    
    if (language) {
      // First try to find exact match in the specified language
      const exactMatch = allPosts.find(post => post.slug === slug && post.language === language);
      if (exactMatch) return exactMatch;
      
      // Fallback: try to find the slug without language suffix
      const baseSlug = slug.replace(/-en$|-tr$/, '');
      return allPosts.find(post => 
        (post.slug === baseSlug || post.slug === `${baseSlug}-${language}`) && post.language === language
      );
    }
    
    return allPosts.find(post => post.slug === slug);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const now = new Date();
    const blogPost: BlogPost = {
      id,
      slug: insertBlogPost.slug,
      title: insertBlogPost.title,
      content: insertBlogPost.content,
      image: insertBlogPost.image || null,
      tag: insertBlogPost.tag || null,
      language: insertBlogPost.language || 'pl',
      originalPostId: insertBlogPost.originalPostId || null,
      active: insertBlogPost.active ?? 1,
      createdAt: now,
      updatedAt: now
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return undefined;

    const updatedPost: BlogPost = {
      ...existingPost,
      ...updates,
      id,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async getMediaFilesByRoute(route: string): Promise<MediaFile[]> {
    // MemStorage fallback - return empty array since media is file-based
    return [];
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(insertInquiry).returning();
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries);
  }

  async getBlogPosts(language?: string): Promise<BlogPost[]> {
    if (language) {
      return await db.select().from(blogPosts)
        .where(eq(blogPosts.language, language))
        .orderBy(blogPosts.createdAt);
    }
    return await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
  }

  async getBlogPostBySlug(slug: string, language?: string): Promise<BlogPost | undefined> {
    if (language) {
      // First try exact match in the specified language
      const [exactMatch] = await db.select().from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .where(eq(blogPosts.language, language));
      
      if (exactMatch) return exactMatch;
      
      // Fallback: try to find the slug without language suffix
      const baseSlug = slug.replace(/-en$|-tr$/, '');
      const [fallback] = await db.select().from(blogPosts)
        .where(eq(blogPosts.slug, baseSlug))
        .where(eq(blogPosts.language, language));
      
      return fallback || undefined;
    }
    
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertBlogPost).returning();
    return post;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db.update(blogPosts).set(updates).where(eq(blogPosts.id, id)).returning();
    return post || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Cache for media files to avoid repeated DB queries
  private mediaCache = new Map<string, { data: MediaFile[]; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getMediaFilesByRoute(route: string): Promise<MediaFile[]> {
    // Check cache first for sub-second responses
    const cached = this.mediaCache.get(route);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // Query database with optimized select
    const result = await db.select().from(mediaFiles).where(eq(mediaFiles.route, route));
    
    // Cache the result
    this.mediaCache.set(route, { data: result, timestamp: Date.now() });
    
    return result;
  }
}

export const storage = new DatabaseStorage();
