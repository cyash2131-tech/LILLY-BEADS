import { Heart, Sparkles, Star, Users } from 'lucide-react';

export default function AboutView() {
  return (
    <div id="about-view" className="max-w-5xl mx-auto px-6 mt-6 flex flex-col gap-20">
      
      {/* Brand Intro Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-5">
          <span className="text-xs uppercase tracking-widest font-bold text-accent">Our Brand Story</span>
          <h1 className="text-4xl font-bold font-heading text-gray-800 leading-tight">
            Hand-strung with <br />
            <span className="text-accent">Pastels & Love</span>
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Lilyy Beads started in late 2024 as a simple creative outlet. Fascinated by the dainty, nostalgic vibe of 90s beaded jewelry, our founder Lily began hand-stringing daisy chain chokers and customized name bracelets on her kitchen table in Southern California. 
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            What started as gifts for friends quickly blossomed on Instagram. People fell in love with the soft, warm pastels, shimmering freshwater pearls, and the unique, customized touch of handcrafted beads. Today, Lilyy Beads is a small but passionate group of bead artisans dedicated to creating cute, premium accessories that make you smile.
          </p>
        </div>
        
        <div className="aspect-[4/3] rounded-[3rem] overflow-hidden border border-brand-border/40 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
            alt="Hand-stringing colorful beads"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Mission & Commitment */}
      <section className="bg-secondary/10 p-8 md:p-14 rounded-[3rem] border border-brand-border/30 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-2xl bg-white text-accent flex items-center justify-center text-lg mx-auto md:mx-0 shadow-sm">
            🌸
          </div>
          <h3 className="font-heading text-lg font-bold text-gray-800">Our Sweet Mission</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            To craft joyful, high-contrast, cute accessories that help people express their colorful inner child and add a charming pastel touch to daily wear.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-2xl bg-white text-accent flex items-center justify-center text-lg mx-auto md:mx-0 shadow-sm">
            💎
          </div>
          <h3 className="font-heading text-lg font-bold text-gray-800">Quality Commitment</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            We reject mass-produced plastic. We meticulously source premium Japanese Miyuki seed beads, real freshwater cultured pearls, and durable double-strength elastic cords.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-2xl bg-white text-accent flex items-center justify-center text-lg mx-auto md:mx-0 shadow-sm">
            💝
          </div>
          <h3 className="font-heading text-lg font-bold text-gray-800">100% Care & Pride</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Every bracelet and keychain is treated like a tiny piece of art. If a bracelet ever snaps under normal wear, simply ship it back and we will repair it for free!
          </p>
        </div>
      </section>

      {/* The Handcrafted Process */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 aspect-[4/3] rounded-[3rem] overflow-hidden border border-brand-border/40 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"
            alt="Beautiful pastel pearls flatlay"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="order-1 md:order-2 flex flex-col gap-5">
          <span className="text-xs uppercase tracking-widest font-bold text-accent">How It is Made</span>
          <h2 className="text-3xl font-bold text-gray-800 font-heading">The Bead-by-Bead Process</h2>
          <ul className="flex flex-col gap-4 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="font-heading font-extrabold text-accent text-lg">01.</span>
              <div>
                <strong className="text-gray-800 block mb-0.5">Custom Sourcing & Design Mapping</strong>
                We review the shapes, sizes and colors of glass, acrylic and pearl beads to ensure flawless visual harmony on the string.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-heading font-extrabold text-accent text-lg">02.</span>
              <div>
                <strong className="text-gray-800 block mb-0.5">Dual-Pass Structural Hand-Weaving</strong>
                Using highly precise bead needles, our artisans loop through seed bead structures twice to secure daisy patterns and protect structural durability.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-heading font-extrabold text-accent text-lg">03.</span>
              <div>
                <strong className="text-gray-800 block mb-0.5">Surgeon's Knotting & Glue Sealing</strong>
                We tie off structural elastic fibers with professional Surgeon's Knots, seal them with jewelry-grade adhesive, and hide the knot inside a designated metal bead cover.
              </div>
            </li>
          </ul>
        </div>
      </section>

    </div>
  );
}
