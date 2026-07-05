import React from 'react';
import { useApp } from '../AppContext';
import { Sparkles, ArrowRight, Heart, Star, ShoppingBag, Palette, Gift, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from './ProductCard';

export default function HomeView() {
  const { 
    products, 
    categories, 
    setCurrentView, 
    setSelectedCategoryFilter 
  } = useApp();

  // Get best sellers (featured products)
  const bestSellers = products.filter(p => p.featured && p.available).slice(0, 4);
  // Get new arrivals (non-featured or first few products)
  const newArrivals = products.filter(p => p.available).slice(0, 4);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryFilter(categoryId);
    setCurrentView('shop');
  };

  const instagramPosts = [
    { id: 1, url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop', likes: '1.2k' },
    { id: 2, url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop', likes: '942' },
    { id: 3, url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop', likes: '2.1k' },
    { id: 4, url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=400&auto=format&fit=crop', likes: '1.5k' },
    { id: 5, url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop', likes: '831' },
    { id: 6, url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=400&auto=format&fit=crop', likes: '1.1k' }
  ];

  return (
    <div id="home-view" className="relative flex flex-col gap-24">
      
      {/* 1. HERO BANNER */}
      <section id="hero-banner" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/30 via-bg-brand to-primary/20 rounded-[40px] px-6 py-12 border border-brand-border/30">
        
        {/* Floating Decorative Elements */}
        <motion.div 
          animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-10 left-10 text-accent opacity-40 select-none hidden md:block"
        >
          🌸 <span className="text-xl">Beads</span>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 text-accent opacity-35 select-none hidden md:block"
        >
          💖 <span className="text-lg font-heading">Handmade</span>
        </motion.div>

        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-20 right-24 text-primary opacity-50 select-none"
        >
          ✨
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          
          {/* Text content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 self-center lg:self-start px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-accent border border-brand-border shadow-sm">
              <Sparkles size={12} className="fill-accent text-accent" />
              <span>Sweet & Dreamy Beaded Jewelry</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-gray-800 leading-[1.1] tracking-tight">
              Handmade Beads <br />
              <span className="text-accent relative">
                Made With Love
                <svg className="absolute left-0 right-0 -bottom-2 h-2.5 text-primary/60 fill-current" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-base text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Beautiful handcrafted bracelets, necklaces and accessories designed with pearls, crystals, and pastels to make every single outfit special.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-4">
              <button
                id="hero-shop-btn"
                onClick={() => setCurrentView('shop')}
                className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-accent hover:bg-accent/95 text-white font-heading font-semibold text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>Shop Collection</span>
              </button>
              <button
                id="hero-custom-btn"
                onClick={() => setCurrentView('custom-orders')}
                className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-white hover:bg-secondary/20 text-accent font-heading font-semibold text-base transition-all border border-brand-border/80 shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Palette size={18} />
                <span>Custom Orders</span>
              </button>
            </div>
          </div>
          
          {/* Images Stack / Collage */}
          <div className="relative w-full aspect-[4/3] flex items-center justify-center">
            {/* Primary Main Image Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-[80%] aspect-square rounded-[3rem] overflow-hidden shadow-xl border-4 border-white relative z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop"
                alt="Premium Beaded Jewelry Collage"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Secondary Image floating bottom right */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute right-0 bottom-4 w-[42%] aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white z-20 hidden sm:block"
            >
              <img
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop"
                alt="Colorful beads"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Accent image floating top left */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute left-0 top-6 w-[35%] aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white z-20 hidden sm:block"
            >
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop"
                alt="Sweet flower beads"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section id="featured-categories" className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-accent">Beautiful Assortment</span>
          <h2 className="text-3xl font-bold text-gray-800 font-heading">Shop by Category</h2>
          <p className="text-sm text-gray-500 max-w-md">
            Explore our handcrafted collections designed to suit every cute mood and aesthetic style.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group cursor-pointer rounded-[2rem] overflow-hidden border border-brand-border/40 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative mb-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center justify-between px-2">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-gray-800 group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{cat.description}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary/50 text-accent group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS */}
      <section id="best-sellers" className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-accent mb-1.5 block text-center sm:text-left">
              Highly Requested
            </span>
            <h2 className="text-3xl font-bold text-gray-800 font-heading text-center sm:text-left">
              Our Best Sellers
            </h2>
          </div>
          <button 
            id="best-sellers-all-btn"
            onClick={() => { setSelectedCategoryFilter(null); setCurrentView('shop'); }}
            className="py-2.5 px-6 rounded-full border border-brand-border text-xs font-bold text-accent hover:bg-secondary/30 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. EXQUISITE INTERMEDIATE BANNER (WELCOME PROMO) */}
      <section id="featured-collection" className="max-w-7xl mx-auto px-6 w-full">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-[#FFDCE8] to-[#FFF9FB] border border-brand-border/60 p-8 md:p-14 flex flex-col md:flex-row items-center gap-10">
          <div className="absolute -top-10 -left-10 text-6xl opacity-15 select-none text-accent">❀</div>
          <div className="absolute -bottom-10 -right-10 text-6xl opacity-15 select-none text-accent">❀</div>

          <div className="flex-1 flex flex-col gap-5 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-[10px] font-bold text-accent border border-brand-border w-max mx-auto md:mx-0">
              🎀 PREMIUM COLLECTION
            </div>
            <h3 className="font-heading text-3xl font-bold text-gray-800 leading-tight">
              Get 10% Off Your First Handmade Order!
            </h3>
            <p className="text-sm text-gray-600 max-w-md">
              We make each piece meticulously by hand in California. Use checkout coupon <strong className="text-accent underline">LILYY10</strong> to start your customized beaded collection!
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 justify-center md:justify-start">
              <span className="text-xs bg-white/80 border border-brand-border/50 text-gray-600 px-4 py-2 rounded-2xl font-mono">
                Code: <strong>LILYY10</strong>
              </span>
              <button 
                id="banner-shop-btn"
                onClick={() => setCurrentView('shop')}
                className="py-2.5 px-6 rounded-full bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs shadow-sm cursor-pointer"
              >
                Claim Coupon Now
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-[40%] aspect-square rounded-[2rem] overflow-hidden shadow-md border-4 border-white shrink-0 relative z-10">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"
              alt="Delicate cherry charm beads"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. CUSTOM ORDER CALL TO ACTION */}
      <section id="custom-orders-cta" className="max-w-7xl mx-auto px-6 w-full">
        <div className="bg-white rounded-[2.5rem] border border-brand-border/40 p-8 md:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 rounded-3xl overflow-hidden aspect-square border border-brand-border bg-bg-brand">
            <img
              src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop"
              alt="Custom beads palettes"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-5">
            <span className="text-xs uppercase tracking-widest font-bold text-accent">Customize Your Jewels</span>
            <h2 className="text-3xl font-bold text-gray-800 font-heading">
              Have a Dream Design in Mind?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We specialize in custom orders! Whether it is a matching phone strap for you and your bestie, personalized initials beaded chokers, or a specific pastel color scheme for a special occasion, our designers are ready to hand-craft it for you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-secondary text-accent">❤️</div>
                <span className="text-xs font-semibold text-gray-700">Choose Colors</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-secondary text-accent">⭐</div>
                <span className="text-xs font-semibold text-gray-700">Personalized Name Beads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-secondary text-accent">✨</div>
                <span className="text-xs font-semibold text-gray-700">Choose Charms</span>
              </div>
            </div>
            <button
              id="custom-cta-btn"
              onClick={() => setCurrentView('custom-orders')}
              className="py-3.5 px-8 rounded-full bg-accent hover:bg-accent/95 text-white font-heading font-semibold text-sm transition-all shadow-md self-start flex items-center gap-2 cursor-pointer"
            >
              <Palette size={16} />
              <span>Create Custom Request</span>
            </button>
          </div>
          
        </div>
      </section>

      {/* 6. WHY CHOOSE LILYY BEADS */}
      <section id="why-choose-us" className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center flex flex-col items-center gap-2 mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-accent">Craftsmanship Integrity</span>
          <h2 className="text-3xl font-bold text-gray-800 font-heading">Our Sweet Standards</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-3xl border border-brand-border/30 p-6 shadow-sm text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-accent text-xl">
              🌸
            </div>
            <h4 className="font-heading text-lg font-bold text-gray-800">100% Handmade</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every single bracelet and necklace is hand-strung, hand-woven and knotted individually in California.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-brand-border/30 p-6 shadow-sm text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-accent text-xl">
              ⭐
            </div>
            <h4 className="font-heading text-lg font-bold text-gray-800">Premium Materials</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              We source high-quality Japanese seed beads, glass crystals, and beautiful genuine freshwater pearls.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-brand-border/30 p-6 shadow-sm text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-accent text-xl">
              🎁
            </div>
            <h4 className="font-heading text-lg font-bold text-gray-800">Instagrammable Pack</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Each order is packed in a cute custom pink pouch with handwritten notes, jewelry care cards and free stickers.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-brand-border/30 p-6 shadow-sm text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-accent text-xl">
              ⚡
            </div>
            <h4 className="font-heading text-lg font-bold text-gray-800">Swift Delivery</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Packaged lovingly and shipped with tracking so your lovely beaded treats arrive safe and fast.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section id="customer-reviews" className="bg-secondary/10 py-16 -mx-6 px-12 rounded-[3rem] border border-brand-border/30">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center flex flex-col items-center gap-2 mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-accent">Heartwarming Feedback</span>
            <h2 className="text-3xl font-bold text-gray-800 font-heading">What Lilyy Lovers Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 border border-brand-border/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-0.5 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400" />)}
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed mb-4">
                  "Literally the cutest daisy bracelet I own! The flowers are perfectly woven, and it stretches so nicely on my wrist without pinching. Packaging came with cute pink stickers!"
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-brand-border/20">
                <span className="text-base font-semibold text-gray-800">Aria M.</span>
                <span className="text-[10px] text-gray-400">Verified Buyer</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-brand-border/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-0.5 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400" />)}
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed mb-4">
                  "Got so many compliments on my Sweetheart Pearl Choker during a weekend date! The pastel pink center heart goes with everything, and it is incredibly lightweight and elegant."
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-brand-border/20">
                <span className="text-base font-semibold text-gray-800">Chloe T.</span>
                <span className="text-[10px] text-gray-400">Verified Buyer</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-brand-border/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-0.5 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400" />)}
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed mb-4">
                  "Ordered a custom name phone strap for me and my sister. The designer emailed me color combinations within hours! Service was amazing and they look beautiful on our cases."
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-brand-border/20">
                <span className="text-base font-semibold text-gray-800">Sophie L.</span>
                <span className="text-[10px] text-gray-400">Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM GALLERY */}
      <section id="instagram-gallery" className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center flex flex-col items-center gap-2 mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-accent">@lilyybeads.handmade</span>
          <h2 className="text-3xl font-bold text-gray-800 font-heading">On The Grid</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Tag us wearing your Lilyy Beads to get featured in our grid gallery!
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <div 
              key={post.id}
              className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer border border-brand-border/30 bg-bg-brand"
            >
              <img
                src={post.url}
                alt="Instagram jewelry post"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                <span>❤️ {post.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER */}
      <section id="newsletter-subscription" className="max-w-md mx-auto px-6 w-full text-center">
        <div className="bg-white rounded-[2rem] border border-brand-border p-8 shadow-sm flex flex-col items-center gap-5 relative">
          <div className="absolute top-2 right-4 text-accent/30 text-lg animate-pulse">💖</div>
          <div className="absolute bottom-4 left-6 text-accent/30 text-lg animate-pulse">🌸</div>
          
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-accent text-xl font-bold">
            💌
          </div>
          <h3 className="font-heading text-xl font-bold text-gray-800">Join Lilyy's Club</h3>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            Subscribe to receive exclusive drops, secret discount codes, and cute design tips!
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert("Aww, welcome to the club! Check your inbox for sweet surprises 🌸");
              (e.target as HTMLFormElement).reset();
            }}
            className="w-full flex flex-col gap-2"
          >
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address..."
              className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-center text-gray-700"
            />
            <button
              id="newsletter-submit"
              type="submit"
              className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
