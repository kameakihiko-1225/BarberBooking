import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CtaEnroll() {
  return (
    <section className="py-20 bg-[var(--premium-accent)] text-black text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Kick-start Your Barber Journey Today</h2>
        <p className="text-lg md:text-xl mb-8">Apply now and join our community of elite barbers shaping the future of style.</p>
        <Button asChild className="bg-black text-white px-10 py-4 rounded-full font-semibold hover:bg-gray-800 hover:scale-105 transition-transform">
          <Link href="/contacts">Start Your Journey</Link>
        </Button>
      </div>
    </section>
  );
} 