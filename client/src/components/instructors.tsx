import { Instagram, Youtube, Linkedin, Music } from "lucide-react";

const instructors = [
  {
    id: 1,
    name: "Marcus Thompson",
    title: "Head Instructor & Founder",
    experience: "20+ years of experience. Former celebrity barber with expertise in classic and modern techniques.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    socials: [
      { icon: <Instagram className="h-5 w-5" />, href: "#" },
      { icon: <Youtube className="h-5 w-5" />, href: "#" }
    ]
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "Advanced Techniques Specialist",
    experience: "15+ years of experience. Award-winning barber specializing in creative fades and modern styling techniques.",
    image: "https://images.unsplash.com/photo-1494790108755-2616c056ca58?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    socials: [
      { icon: <Instagram className="h-5 w-5" />, href: "#" },
      { icon: <Music className="h-5 w-5" />, href: "#" }
    ]
  },
  {
    id: 3,
    name: "David Rodriguez",
    title: "Business Development Coach",
    experience: "12+ years of experience. Successful shop owner and business mentor helping barbers build profitable careers.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    socials: [
      { icon: <Linkedin className="h-5 w-5" />, href: "#" },
      { icon: <Youtube className="h-5 w-5" />, href: "#" }
    ]
  }
];

export default function Instructors() {
  return (
    <section id="instructors" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
            Learn from{" "}
            <span className="golden-bronze">Master</span>{" "}
            Instructors
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Our team of expert instructors brings decades of industry experience and a passion for teaching the next generation of professional barbers.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
              <img 
                src={instructor.image}
                alt={`Master barber instructor ${instructor.name}`}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <div className="p-6 text-center">
                <h3 className="font-serif text-xl font-bold mb-2">{instructor.name}</h3>
                <p className="golden-bronze font-medium mb-3">{instructor.title}</p>
                <p className="text-gray-600 text-sm mb-4">
                  {instructor.experience}
                </p>
                
                <div className="flex justify-center space-x-4">
                  {instructor.socials.map((social, index) => (
                    <a 
                      key={index}
                      href={social.href} 
                      className="text-gray-400 hover:text-[var(--golden-bronze)] transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
