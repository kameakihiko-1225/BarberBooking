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
      }
    ]);

    console.log("✓ Database seeded successfully with blog posts");
  } catch (error) {
    console.error("✗ Error seeding database:", error);
  }
}

seed();