import { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import ProductView from './components/ProductView';
import CustomOrderView from './components/CustomOrderView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import CheckoutView from './components/CheckoutView';
import AccountView from './components/AccountView';
import AdminView from './components/AdminView';
import CartDrawer from './components/CartDrawer';
import { motion, AnimatePresence } from 'motion/react';

function BackgroundDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-45">
      {/* Soft animated slow-moving pastel gradient orbs */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-secondary/35 blur-3xl"
      />
      
      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 70, -30, 0],
          scale: [1, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[45%] right-[5%] w-96 h-96 rounded-full bg-primary/35 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, 50, 50, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[10%] left-[15%] w-80 h-80 rounded-full bg-accent/25 blur-3xl"
      />

      {/* Floating flower icons & sparkles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => {
          const size = [16, 24, 30, 20, 26][i % 5];
          const delay = i * 1.5;
          const left = [8, 25, 42, 60, 73, 85, 92, 52, 18, 88, 33, 68][i];
          const top = [15, 65, 30, 80, 22, 50, 75, 92, 45, 10, 85, 5][i];
          const duration = 14 + (i * 2);
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0.1, 0.7, 0.1],
                y: [-30, 30, -30],
                rotate: [0, 360],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
              }}
              className="text-primary/45 flex items-center justify-center pointer-events-none select-none"
            >
              {i % 3 === 0 ? (
                <span style={{ fontSize: `${size}px` }}>🌸</span>
              ) : i % 3 === 1 ? (
                <span style={{ fontSize: `${size}px` }}>✨</span>
              ) : (
                <span style={{ fontSize: `${size}px` }}>💕</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function AppContent() {
  const { currentView, setCurrentView } = useApp();
  const [cartOpen, setCartOpen] = useState(false);

  // Router dispatcher
  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product':
        return <ProductView />;
      case 'custom':
      case 'custom-orders':
        return <CustomOrderView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'checkout':
        return <CheckoutView />;
      case 'account':
        return <AccountView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-brand flex flex-col font-body text-brand-text selection:bg-accent/10 selection:text-accent">
      
      {/* Dynamic Header Banner */}
      <div className="bg-accent text-white py-1 px-4 text-center text-[10px] font-heading font-semibold tracking-wider flex items-center justify-center gap-1.5 shadow-sm">
        <span>✨ FREE SHIPPING ON ORDERS OVER $35! USE CODE: <strong>LILYY10</strong> ✨</span>
      </div>

      {/* Floating Sparkles decorative background objects (safe absolute layers) */}
      <BackgroundDecor />

      {/* Navigation */}
      <Navbar onOpenCart={() => setCartOpen(true)} />

      {/* Main Viewport Grid */}
      <main className="flex-grow z-10 relative pb-20">
        {renderActiveView()}
      </main>

      {/* Floating admin shortcut button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
          className="p-3 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-accent border border-brand-border/60 shadow-lg backdrop-blur-md transition-all cursor-pointer flex items-center gap-1"
          title="Admin Panel Shortcut"
        >
          <span className="text-xs">🛠️</span>
          <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Admin Panel</span>
        </button>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
