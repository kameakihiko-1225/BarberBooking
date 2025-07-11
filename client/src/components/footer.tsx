import { Instagram, Youtube, Music, MapPin, Phone, Mail } from "lucide-react";
import logoWhite from "@assets/K&K_Vertical_logotype_white_1750662689464.png";

export default function Footer() {
  return (
    <footer className="bg-deep-black text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img 
                src={logoWhite} 
                alt="K&K Academy Logo" 
                className="h-12 md:h-16 logo-glow hover:scale-110 hover:logo-glow-copper transition-all duration-300 hover:drop-shadow-lg"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transforming passionate individuals into skilled professional barbers through comprehensive training and mentorship.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[var(--premium-accent)] hover:text-white transition-colors hover:scale-125 duration-200">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[var(--premium-accent)] hover:text-white transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[var(--premium-accent)] hover:text-white transition-colors">
                <Music className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Programs */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Programs</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[var(--premium-accent)] transition-colors hover:scale-105 duration-200">Barber Fundamentals</a></li>
              <li><a href="#" className="hover:text-[var(--premium-accent)] transition-colors">Master Techniques</a></li>
              <li><a href="#" className="hover:text-[var(--premium-accent)] transition-colors">Business Mastery</a></li>
              <li><a href="#" className="hover:text-[var(--premium-accent)] transition-colors">Private Lessons</a></li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[var(--premium-accent)] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[var(--golden-bronze)] transition-colors">Admissions</a></li>
              <li><a href="#" className="hover:text-[var(--golden-bronze)] transition-colors">Financial Aid</a></li>
              <li><a href="#" className="hover:text-[var(--golden-bronze)] transition-colors">Student Portal</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start space-x-2">
                <MapPin className="golden-bronze h-4 w-4 mt-0.5" />
                <span className="text-sm">Aleja Wyścigowa 14A<br />02-681 Warszawa</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="golden-bronze h-4 w-4" />
                <span className="text-sm">+48 729 231 542</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="golden-bronze h-4 w-4" />
                <span className="text-sm">Biuro@kkacademy.pl</span>
              </div>
              <div className="mt-4 text-sm">
                <p className="text-gray-400">Working hours:</p>
                <p className="text-gray-300">Mon-Fri: 12 am - 9 pm</p>
                <p className="text-gray-300">Sat: 12 am – 5 pm</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 K&K Barber Academy. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-[var(--golden-bronze)] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[var(--golden-bronze)] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[var(--golden-bronze)] transition-colors">Student Handbook</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
