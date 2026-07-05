import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Palette, Sparkles, Phone, Mail, User, Info, DollarSign, Calendar, Upload, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRESET_COLORS = [
  { name: 'Marshmallow Pink', hex: '#FFDCE8' },
  { name: 'Lavender Blush', hex: '#E1BEE7' },
  { name: 'Mint Green', hex: '#C8E6C9' },
  { name: 'Peach Cream', hex: '#FFE0B2' },
  { name: 'Sky Pastel Blue', hex: '#B3E5FC' },
  { name: 'Lemon Custard', hex: '#FFF9C4' },
  { name: 'Pure Pearl White', hex: '#FAFAFA' },
  { name: 'Lilac Dusk', hex: '#D1C4E9' },
];

const BEAD_TYPES = [
  'Japanese Miyuki Seed Beads 🌸',
  'Cultured Freshwater Pearls 🦪',
  'Clay Teddy Bears & Clouds 🧸',
  'Shiny Glass Crystals ✨',
  'Glowing Smiley Face Beads ☺',
  'Customized Lettering / Name Beads 🔠',
  'Heart & Star Acrylic Charms 💖',
];

export default function CustomOrderView() {
  const { submitCustomRequest } = useApp();
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBeads, setSelectedBeads] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(25);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reqId, setReqId] = useState('');

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev => 
      prev.includes(colorName) 
        ? prev.filter(c => c !== colorName) 
        : [...prev, colorName]
    );
  };

  const toggleBeadType = (type: string) => {
    setSelectedBeads(prev => 
      prev.includes(type) 
        ? prev.filter(b => b !== type) 
        : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !description) return;
    setSubmitting(true);

    try {
      const savedReq = await submitCustomRequest({
        name,
        phone,
        email,
        description,
        preferredColors: selectedColors,
        preferredBeads: selectedBeads,
        budget,
        deliveryDate,
        referenceImage: imageUrl || 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=400&auto=format&fit=crop'
      });
      setReqId(savedReq.id);
      setSubmitted(true);
      
      // Reset
      setName('');
      setPhone('');
      setEmail('');
      setDescription('');
      setSelectedColors([]);
      setSelectedBeads([]);
      setBudget(25);
      setDeliveryDate('');
      setImageUrl('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="custom-order-view" className="max-w-4xl mx-auto px-6 mt-6">
      
      {/* Page Header */}
      <div className="text-center mb-12 flex flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-widest font-bold text-accent">Co-Design Workbench</span>
        <h1 className="text-4xl font-bold font-heading text-gray-800">Custom Jewelry Requests</h1>
        <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
          Unleash your creativity! Describe your dream bracelet, choker, phone strap, or keychain. We hand-weave and customize each request to perfection.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border border-brand-border p-10 text-center flex flex-col items-center gap-5 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-accent text-3xl animate-bounce">
              🌸
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-800">Custom Request Received!</h2>
            <p className="text-xs bg-accent/10 border border-brand-border/50 text-accent font-semibold px-4 py-2 rounded-2xl font-mono">
              Request ID: {reqId}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              Aww, thank you for co-designing with Lilyy Beads! We have saved your custom specifications. Our designer will review your choices and email you within 24 hours with budget options and custom layout illustrations.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="py-3 px-8 rounded-full bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs transition-all shadow-sm cursor-pointer mt-2"
            >
              Submit Another Design
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="custom-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            
            {/* Left Column: Interactive Bead Workbench Configurator */}
            <div className="md:col-span-7 flex flex-col gap-6 bg-white rounded-3xl border border-brand-border/40 p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-brand-border/20">
                <Palette size={18} className="text-accent" /> Design Your Beads
              </h3>

              {/* 1. Color Palette Selection */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2.5 block flex items-center justify-between">
                  <span>Preferred Colors (Select multiple)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Step 1 of 3</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_COLORS.map((col) => {
                    const active = selectedColors.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => toggleColor(col.name)}
                        className={`p-2.5 rounded-2xl flex items-center gap-2 transition-all border text-left cursor-pointer focus:outline-none ${
                          active 
                            ? 'bg-secondary/40 border-accent shadow-sm' 
                            : 'bg-bg-brand border-brand-border hover:bg-secondary/20'
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full shadow-inner shrink-0 border border-brand-border/50" 
                          style={{ backgroundColor: col.hex }} 
                        />
                        <span className="text-[10px] font-semibold text-gray-700 leading-tight">
                          {col.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Bead Material Selection */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2.5 block flex items-center justify-between">
                  <span>Preferred Beads & Accents</span>
                  <span className="text-[10px] text-gray-400 font-normal">Step 2 of 3</span>
                </label>
                <div className="flex flex-col gap-2">
                  {BEAD_TYPES.map((type) => {
                    const active = selectedBeads.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleBeadType(type)}
                        className={`w-full py-3 px-4 rounded-xl flex items-center justify-between transition-all border text-left cursor-pointer focus:outline-none text-xs font-semibold text-gray-700 ${
                          active 
                            ? 'bg-secondary/40 border-accent' 
                            : 'bg-bg-brand border-brand-border/60 hover:bg-secondary/15'
                        }`}
                      >
                        <span>{type}</span>
                        {active && (
                          <span className="text-accent text-[10px] bg-white border border-brand-border px-2 py-0.5 rounded-full">
                            ✓ Selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Budget Estimator Slider */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2.5 block flex items-center justify-between">
                  <span>Your Budget Preference</span>
                  <span className="text-[10px] text-gray-400 font-normal">Step 3 of 3</span>
                </label>
                <div className="p-4 rounded-2xl bg-bg-brand border border-brand-border/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Estimator</span>
                    <span className="font-heading font-extrabold text-accent text-lg">${budget}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                    <span>Simple Bracelet ($10)</span>
                    <span>Deluxe Necklace Set ($100)</span>
                  </div>
                </div>
              </div>

              {/* 4. Description */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                  Describe Your Vision <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. 'A beaded phone strap with pastel lavender and white hearts, incorporating my name 'EMILY' in round black letters, with a cute clay teddy bear dangling at the end. Total length about 8 inches.'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 resize-none"
                />
              </div>

            </div>

            {/* Right Column: Contact info & Uploads */}
            <div className="md:col-span-5 flex flex-col gap-6">
              
              {/* Contact Information card */}
              <div className="bg-white rounded-3xl border border-brand-border/40 p-6 shadow-sm flex flex-col gap-4">
                <h3 className="font-heading text-base font-bold text-gray-800 flex items-center gap-1.5 pb-2.5 border-b border-brand-border/20">
                  <User size={16} className="text-accent" /> Contact Details
                </h3>

                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Full Name <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ella Watson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                    />
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Email <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="ella@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                    />
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">WhatsApp / Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+1 (234) 567-890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                    />
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Target Delivery Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-500"
                    />
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Reference Image card */}
              <div className="bg-white rounded-3xl border border-brand-border/40 p-6 shadow-sm flex flex-col gap-4">
                <h3 className="font-heading text-base font-bold text-gray-800 flex items-center gap-1.5 pb-2.5 border-b border-brand-border/20">
                  <Upload size={16} className="text-accent" /> Reference Image
                </h3>
                
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Have a screenshot of a design you saw on Instagram or Pinterest? Add its URL here to help our designer visualize.
                </p>

                <input
                  type="url"
                  placeholder="Paste Unsplash, Pinterest, or image link..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                />
                
                {imageUrl && (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-brand-border/60 bg-bg-brand mt-1">
                    <img
                      src={imageUrl}
                      alt="Reference preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=400&auto=format&fit=crop';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <button
                id="submit-custom-request-btn"
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-2xl bg-accent hover:bg-accent/95 text-white font-heading font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span>Saving dream design...</span>
                ) : (
                  <>
                    <Sparkles size={16} className="fill-white" />
                    <span>Submit Custom Request</span>
                  </>
                )}
              </button>

              <div className="flex gap-2 items-center justify-center text-[10px] text-gray-400 mt-1">
                <Info size={12} className="text-accent" />
                <span>Zero pre-payment required to submit requests!</span>
              </div>

            </div>

          </motion.form>
        )}
      </AnimatePresence>

    </div>
  );
}
