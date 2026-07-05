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
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-[15%] left-[5%] w-10 h-10 rounded-full bg-secondary/30 blur-2xl animate-pulse" />
        <div className="absolute top-[40%] right-[8%] w-16 h-16 rounded-full bg-secondary/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] left-[12%] w-24 h-24 rounded-full bg-secondary/20 blur-3xl" />
      </div>

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
