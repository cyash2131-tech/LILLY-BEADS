import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { MessageSquare, Instagram, Mail, MapPin, Send, Check } from 'lucide-react';

export default function ContactView() {
  const { settings } = useApp();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent("Hi Lilyy! 🌸 I am visiting your lovely website and would love to ask about your handmade beads.");
    const number = settings.whatsAppNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <div id="contact-view" className="max-w-5xl mx-auto px-6 mt-6">
      
      {/* Title */}
      <div className="text-center mb-12 flex flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-widest font-bold text-accent">Say Hello 🌸</span>
        <h1 className="text-4xl font-bold font-heading text-gray-800">We Would Love To Chat</h1>
        <p className="text-sm text-gray-500 max-w-sm">
          Have questions about sizing, care, bulk custom orders, or delivery? Reach out to us anytime!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Info Column */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* Quick Chat card */}
          <div className="bg-secondary/15 rounded-3xl border border-brand-border/40 p-6 flex flex-col gap-5">
            <h3 className="font-heading text-lg font-bold text-gray-800">Instant Chat</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Want the fastest response? Tap our WhatsApp line to text with our design lead directly. We love discussing custom palettes and sizes!
            </p>
            <button
              onClick={handleWhatsAppChat}
              className="py-3 px-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageSquare size={16} /> Chat on WhatsApp
            </button>
          </div>

          {/* Quick Info contacts */}
          <div className="bg-white rounded-3xl border border-brand-border/40 p-6 flex flex-col gap-4 shadow-sm text-xs text-gray-600">
            <h3 className="font-heading text-base font-bold text-gray-800 mb-2 pb-2 border-b border-brand-border/20">Studio Channels</h3>
            
            <div className="flex gap-3 items-center">
              <Instagram size={16} className="text-accent shrink-0" />
              <div>
                <span className="font-semibold block text-gray-800">Instagram</span>
                <a 
                  href={settings.socialInstagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  @lilyybeads.handmade
                </a>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <Mail size={16} className="text-accent shrink-0" />
              <div>
                <span className="font-semibold block text-gray-800">Email Address</span>
                <span className="text-gray-600">hello@lilyybeads.com</span>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <MapPin size={16} className="text-accent shrink-0" />
              <div>
                <span className="font-semibold block text-gray-800">Location Studio</span>
                <span className="text-gray-600">Hand-stringing in Sunny Southern California, USA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Inquiry Form Column */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-brand-border/40 p-6 shadow-sm">
          <h3 className="font-heading text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-brand-border/20">Send a Message</h3>
          
          {submitted ? (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check size={24} />
              </div>
              <h4 className="font-heading text-lg font-bold text-gray-800">Inquiry Submitted!</h4>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                Thank you for reaching out! We have successfully received your inquiry. We will email you back within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder=" Ella Watson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="ella@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Inquiry Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sizing questions / Bulk order discounts"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what you would like to ask..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send size={14} /> Send Inquiry
              </button>

            </form>
          )}
        </div>

      </div>

    </div>
  );
}
