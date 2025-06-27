import { users, inquiries, blogPosts, type User, type InsertUser, type Inquiry, type InsertInquiry, type BlogPost, type InsertBlogPost } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
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
      {
        id: this.currentBlogPostId++,
        slug: "start-barber-career",
        title: "How to Start a Career in Barbering",
        content: "Thinking about becoming a barber? Here's what your first 30 days might look like...\n\nThe barbering industry offers incredible opportunities for creative professionals who want to build lasting relationships with clients while mastering a timeless craft. Whether you're switching careers or just starting out, here's your complete guide to launching a successful barbering career.\n\n## Why Choose Barbering?\n\nBarbering combines artistry with entrepreneurship. As a barber, you'll:\n- Master traditional and modern cutting techniques\n- Build a loyal clientele\n- Have the flexibility to work in shops or start your own business\n- Earn competitive wages with growth potential\n\n## Getting Started: Your First Steps\n\n### 1. Research Your Local Requirements\nEvery state has different licensing requirements. Most require:\n- Completion of an approved barbering program\n- Passing written and practical exams\n- Continuing education credits\n\n### 2. Choose the Right Training Program\nLook for programs that offer:\n- Comprehensive curriculum covering cuts, shaves, and styling\n- Hands-on practice with real clients\n- Business and customer service training\n- Job placement assistance\n\n### 3. Invest in Quality Tools\nProfessional-grade tools are essential:\n- High-quality clippers and trimmers\n- Sharp scissors and razors\n- Combs, brushes, and styling products\n- Sanitation supplies\n\n## Building Your Skills\n\nSuccessful barbers never stop learning. Focus on:\n- Mastering classic cuts like fades, tapers, and beard trims\n- Staying current with trends and techniques\n- Developing your unique style\n- Building communication skills\n\n## Career Opportunities\n\nThe barbering field offers various paths:\n- Traditional barbershops\n- High-end salons\n- Mobile barbering services\n- Owning your own shop\n- Teaching at barbering schools\n\nAt K&K Barber Academy, we provide comprehensive training that prepares you for any of these career paths. Our experienced instructors and modern facilities ensure you graduate with the skills and confidence needed to succeed.\n\nReady to start your barbering journey? Contact us today to learn more about our programs!",
        image: "/media/blog/barber-career.jpg",
        tag: "BEGINNER",
        active: 1,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15")
      },
      {
        id: this.currentBlogPostId++,
        slug: "top-5-fade-techniques-2025",
        title: "Top 5 Fade Techniques for 2025",
        content: "Stay ahead of the curve with these must-know fade variations every client will ask for.\n\n## 1. The Burst Fade\nThe burst fade curves around the ear, creating a dynamic look that works with any hair length on top. Perfect for clients wanting something modern yet professional.\n\n**How to achieve it:**\n- Start with a #2 guard around the ear\n- Use the burst technique to blend outward\n- Keep the back and sides clean\n\n## 2. Drop Fade\nThis technique follows the natural curve of the head, dropping lower behind the ear for a sleek, contemporary appearance.\n\n## 3. Skin Fade\nThe ultimate in precision, taking hair down to the skin for maximum contrast. Requires steady hands and sharp blades.\n\n## 4. Mid Fade\nA versatile option that starts around the temple area, perfect for professional environments while maintaining style.\n\n## 5. Textured Fade\nCombining fading techniques with texturizing creates movement and dimension, ideal for thick or wavy hair types.\n\n**Pro Tips:**\n- Always use sharp blades for clean lines\n- Take your time with the blending\n- Practice on mannequins before trying on clients\n- Keep your guards clean and organized\n\nMaster these techniques in our advanced cutting classes at K&K Barber Academy!",
        image: "/media/blog/fade-techniques.jpg",
        tag: "TRENDS",
        active: 1,
        createdAt: new Date("2025-01-20"),
        updatedAt: new Date("2025-01-20")
      },
      {
        id: this.currentBlogPostId++,
        slug: "barber-toolkit-essentials",
        title: "Barber Toolkit: Essentials vs. Nice-to-Have",
        content: "From clippers to combs, here's our definitive guide to building a pro kit without overspending.\n\n## Essential Tools (Must-Have)\n\n### Clippers\n- **Professional-grade corded clippers**: Reliability and power are key\n- **Multiple guard sizes**: #0.5 through #8 minimum\n- **Blade oil and cleaning brush**: Maintenance is crucial\n\n### Cutting Tools\n- **6-inch barbering scissors**: For precision cutting\n- **Thinning shears**: For texturing and blending\n- **Straight razor**: For clean lines and traditional shaves\n\n### Styling Tools\n- **Wide-tooth comb**: For detangling\n- **Fine-tooth comb**: For precise parting\n- **Boar bristle brush**: For styling and finishing\n\n## Nice-to-Have Additions\n\n### Advanced Equipment\n- **Cordless detail trimmer**: For mobility and precision\n- **Hot towel warmer**: Elevates the client experience\n- **Professional cape and neck strips**: Hygiene and comfort\n\n### Styling Products\n- **Pomade selection**: Different holds and finishes\n- **Sea salt spray**: For texture\n- **Beard oils**: For facial hair care\n\n## Building Your Kit Gradually\n\nStart with essentials and add tools as your skills and clientele grow. Quality over quantity always wins - one great pair of scissors beats five mediocre ones.\n\n**Budget-Friendly Tips:**\n- Buy essential tools first, upgrade gradually\n- Invest in blade maintenance\n- Join professional groups for equipment discounts\n- Consider used equipment from reputable sources\n\nAt K&K Barber Academy, we teach you how to use every tool properly and help you understand what investments will serve your career best.",
        image: "/media/blog/barber-tools.jpg", 
        tag: "TOOLS",
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

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.active === 1)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
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
}

export const storage = new MemStorage();
