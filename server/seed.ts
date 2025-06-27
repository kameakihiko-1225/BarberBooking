import { db } from "./db";
import { blogPosts } from "@shared/schema";

async function seed() {
  try {
    // Clear existing blog posts
    await db.delete(blogPosts);

    // Insert sample blog posts
    await db.insert(blogPosts).values([
      {
        slug: "top-5-fade-techniques-2025",
        title: "Top 5 Fade Techniques for 2025",
        content: "Stay ahead of the curve with these must-know fade variations every client will ask for.\n\n## 1. The Burst Fade\nThe burst fade curves around the ear, creating a dynamic look that works with any hair length on top. Perfect for clients wanting something modern yet professional.\n\n**How to achieve it:**\n- Start with a #2 guard around the ear\n- Use the burst technique to blend outward\n- Keep the back and sides clean\n\n## 2. Drop Fade\nThis technique follows the natural curve of the head, dropping lower behind the ear for a sleek, contemporary appearance.\n\n## 3. Skin Fade\nThe ultimate in precision, taking hair down to the skin for maximum contrast. Requires steady hands and sharp blades.\n\n## 4. Mid Fade\nA versatile option that starts around the temple area, perfect for professional environments while maintaining style.\n\n## 5. Textured Fade\nCombining fading techniques with texturizing creates movement and dimension, ideal for thick or wavy hair types.\n\n**Pro Tips:**\n- Always use sharp blades for clean lines\n- Take your time with the blending\n- Practice on mannequins before trying on clients\n- Keep your guards clean and organized\n\nMaster these techniques in our advanced cutting classes at K&K Barber Academy!",
        image: "/media/gallarey/IMG_3142.jpg",
        tag: "TRENDS",
        active: 1,
      },
      {
        slug: "barber-toolkit-essentials",
        title: "Barber Toolkit: Essentials vs. Nice-to-Have",
        content: "From clippers to combs, here's our definitive guide to building a pro kit without overspending.\n\n## Essential Tools (Must-Have)\n\n### Clippers\n- **Professional-grade corded clippers**: Reliability and power are key\n- **Multiple guard sizes**: #0.5 through #8 minimum\n- **Blade oil and cleaning brush**: Maintenance is crucial\n\n### Cutting Tools\n- **6-inch barbering scissors**: For precision cutting\n- **Thinning shears**: For texturing and blending\n- **Straight razor**: For clean lines and traditional shaves\n\n### Styling Tools\n- **Wide-tooth comb**: For detangling\n- **Fine-tooth comb**: For precise parting\n- **Boar bristle brush**: For styling and finishing\n\n## Nice-to-Have Additions\n\n### Advanced Equipment\n- **Cordless detail trimmer**: For mobility and precision\n- **Hot towel warmer**: Elevates the client experience\n- **Professional cape and neck strips**: Hygiene and comfort\n\n### Styling Products\n- **Pomade selection**: Different holds and finishes\n- **Sea salt spray**: For texture\n- **Beard oils**: For facial hair care\n\n## Building Your Kit Gradually\n\nStart with essentials and add tools as your skills and clientele grow. Quality over quantity always wins - one great pair of scissors beats five mediocre ones.\n\n**Budget-Friendly Tips:**\n- Buy essential tools first, upgrade gradually\n- Invest in blade maintenance\n- Join professional groups for equipment discounts\n- Consider used equipment from reputable sources\n\nAt K&K Barber Academy, we teach you how to use every tool properly and help you understand what investments will serve your career best.",
        image: "/media/gallarey/IMG_4490.jpg",
        tag: "TOOLS",
        active: 1,
      },
      {
        slug: "client-consultation-mastery",
        title: "Client Consultation: The Art of Understanding What They Really Want",
        content: "The difference between a good cut and a great one often comes down to the consultation. Here's how to decode client requests and exceed expectations.\n\n## Reading Between the Lines\n\n### Common Client Phrases and What They Mean\n- **\"Just a trim\"**: Usually means 1-2 inches off, but always confirm\n- **\"Something professional\"**: Conservative, workplace-appropriate styling\n- **\"Make me look younger\"**: Focus on modern techniques and face-framing\n- **\"Surprise me\"**: They trust you, but still set boundaries\n\n## The Perfect Consultation Process\n\n### Step 1: Listen First\n- Let the client explain their vision completely\n- Ask about their lifestyle and maintenance preferences\n- Discuss their hair history and previous experiences\n\n### Step 2: Assess and Advise\n- **Hair type and texture**: Work with natural patterns\n- **Face shape considerations**: Enhance their best features\n- **Professional requirements**: Respect workplace guidelines\n\n### Step 3: Set Realistic Expectations\n- Show reference photos when possible\n- Explain the process and timeline\n- Discuss maintenance requirements upfront\n\n## Handling Difficult Requests\n\n### When to Say No (Professionally)\n- **Unrealistic transformations**: Explain limitations honestly\n- **Damaged hair concerns**: Prioritize hair health\n- **Maintenance mismatches**: Guide toward sustainable options\n\n### Alternative Solutions\n- Suggest gradual changes over multiple visits\n- Offer styling tips for achieving desired looks\n- Recommend hair care products for at-home results\n\n## Building Long-Term Relationships\n\n**Document preferences**: Keep notes on what works\n**Follow up**: Check satisfaction after a few days\n**Educate**: Share styling and care tips\n**Evolve together**: Suggest updates as trends change\n\nGreat consultations create loyal clients who become your best marketing. At K&K Barber Academy, we teach the communication skills that separate professionals from amateurs.",
        image: "/media/gallarey/IMG_3934.jpg",
        tag: "BUSINESS",
        active: 1,
      }
    ]);

    console.log("✓ Database seeded successfully with blog posts");
  } catch (error) {
    console.error("✗ Error seeding database:", error);
  }
}

seed();