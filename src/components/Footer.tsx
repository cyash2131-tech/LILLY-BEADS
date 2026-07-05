import { useApp } from '../AppContext';
import { 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  Sparkles, 
  Heart 
} from 'lucide-react';

export default function Footer() {
  const { setCurrentView, settings } = useApp();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-secondary/20 border-t border-brand-border/40 pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold font-heading text-accent flex items-center gap-1">
            Lilyy Beads 🌸
          </span>
          <p className="text-sm text-gray-600 leading-relaxed">
            Beautiful handcrafted bracelets, necklaces, and accessories designed to bring a touch of joy, pastel charm, and love to every single outfit.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a 
              href={settings.socialInstagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white text-accent hover:bg-accent hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a 
              href={settings.socialWhatsApp} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white text-accent hover:bg-accent hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer"
              aria-label="WhatsApp"
            >
              <Phone size={18} />
            </a>
          </div>
        </div>
        
        {/* Links Column */}
        <div>
          <h4 className="font-heading text-lg font-semibold text-gray-800 mb-4 flex items-center gap-1">
            Explore <Sparkles size={14} className="text-primary" />
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <button 
                onClick={() => setCurrentView('home')} 
                className="text-gray-600 hover:text-accent transition-colors text-left focus:outline-none cursor-pointer"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentView('shop')} 
                className="text-gray-600 hover:text-accent transition-colors text-left focus:outline-none cursor-pointer"
              >
                Shop All Beads
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentView('custom-orders')} 
                className="text-gray-600 hover:text-accent transition-colors text-left focus:outline-none cursor-pointer"
              >
                Custom Design Requests
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentView('about')} 
                className="text-gray-600 hover:text-accent transition-colors text-left focus:outline-none cursor-pointer"
              >
                Our Story & Mission
              </button>
            </li>
          </ul>
        </div>
        
        {/* Customer Care Column */}
        <div>
          <h4 className="font-heading text-lg font-semibold text-gray-800 mb-4">Customer Care</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <button 
                onClick={() => setCurrentView('contact')} 
                className="text-gray-600 hover:text-accent transition-colors text-left focus:outline-none cursor-pointer"
              >
                Contact Us
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentView('account')} 
                className="text-gray-600 hover:text-accent transition-colors text-left focus:outline-none cursor-pointer"
              >
                My Account
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentView('account')} 
                className="text-gray-600 hover:text-accent transition-colors text-left focus:outline-none cursor-pointer"
              >
                Order Tracking
              </button>
            </li>
            <li>
              <a 
                href={settings.socialWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-accent transition-colors text-left focus:outline-none cursor-pointer"
              >
                WhatsApp Chat Help
              </a>
            </li>
          </ul>
        </div>
        
        {/* Studio Info Column */}
        <div>
          <h4 className="font-heading text-lg font-semibold text-gray-800 mb-4">Our Studio</h4>
          <ul className="flex flex-col gap-3.5 text-sm text-gray-600">
            <li className="flex gap-2 items-start">
              <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
              <span>Handcrafted in Southern California, USA</span>
            </li>
            <li className="flex gap-2 items-center">
              <Phone size={16} className="text-accent shrink-0" />
              <span>{settings.whatsAppNumber}</span>
            </li>
            <li className="flex gap-2 items-center">
              <Mail size={16} className="text-accent shrink-0" />
              <span>hello@lilyybeads.com</span>
            </li>
          </ul>
        </div>
        
      </div>
      
      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-brand-border/30 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span>&copy; {currentYear} {settings.storeName}. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <span>Made with</span>
          <Heart size={12} className="text-accent fill-accent animate-pulse" />
          <span>for every beautiful soul</span>
        </div>
      </div>
    </footer>
  );
}
