import { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Heart, 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const { 
    currentView, 
    setCurrentView, 
    cart, 
    wishlist, 
    currentUser,
    searchQuery,
    setSearchQuery
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop', view: 'shop' },
    { label: 'Custom Orders', view: 'custom-orders' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleLinkClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header id="app-header" className="sticky top-0 z-40 w-full transition-all duration-300">
        <div className="glass mx-auto my-3 h-16 max-w-7xl rounded-full px-6 flex items-center justify-between shadow-sm border-brand-border">
          
          {/* Logo */}
          <button 
            id="nav-logo"
            onClick={() => handleLinkClick('home')} 
            className="flex items-center gap-1.5 group cursor-pointer focus:outline-none"
          >
            <span className="text-xl md:text-2xl font-bold font-heading tracking-tight text-accent flex items-center gap-1">
              Lilyy Beads
              <motion.span 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                🌸
              </motion.span>
            </span>
          </button>
          
          {/* Desktop Nav Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  className={`relative font-heading text-base font-medium tracking-wide transition-colors cursor-pointer focus:outline-none ${
                    isActive ? 'text-accent' : 'text-gray-600 hover:text-accent'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
          
          {/* Icons Bar */}
          <div id="nav-actions" className="flex items-center gap-3">
            
            {/* Search Bar Toggle */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search beads..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (currentView !== 'shop') setCurrentView('shop');
                      }}
                      className="w-full h-8 px-3 rounded-full text-xs bg-secondary/40 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent border border-primary/20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)} 
                className="p-2 rounded-full hover:bg-secondary/40 text-gray-600 hover:text-accent transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
            
            {/* Wishlist */}
            <button 
              id="wishlist-btn"
              onClick={() => handleLinkClick('account')} 
              className="p-2 rounded-full hover:bg-secondary/40 text-gray-600 hover:text-accent transition-colors relative cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-ping" />
              )}
            </button>
            
            {/* Cart Icon with badge */}
            <button 
              id="cart-drawer-btn"
              onClick={onOpenCart} 
              className="p-2 rounded-full hover:bg-secondary/40 text-gray-600 hover:text-accent transition-colors relative cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalCartItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </button>
            
            {/* User Profile */}
            <button 
              id="user-account-btn"
              onClick={() => handleLinkClick('account')} 
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                currentView === 'account' ? 'bg-secondary/60 text-accent' : 'hover:bg-secondary/40 text-gray-600 hover:text-accent'
              }`}
              aria-label="User Account"
            >
              <User size={20} />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 rounded-full hover:bg-secondary/40 text-gray-600 hover:text-accent transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
          </div>
        </div>
      </header>
      
      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-30 mx-4 glass rounded-3xl p-6 shadow-lg border-brand-border md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  className={`w-full py-2.5 px-4 text-left font-heading font-semibold text-lg rounded-2xl transition-colors cursor-pointer ${
                    currentView === link.view 
                      ? 'bg-secondary text-accent' 
                      : 'text-gray-700 hover:bg-secondary/30 hover:text-accent'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              
              <div className="border-t border-brand-border/40 my-2 pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-gray-500 px-2">
                  <span>Handmade with love 🌸</span>
                  <span>Lilyy Beads</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
