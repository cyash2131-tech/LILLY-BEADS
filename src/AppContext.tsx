import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Order, CustomRequest, Review, AppSettings, CartItem } from './types';
import { StorageManager } from './db';

interface AppContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  settings: AppSettings;
  orders: Order[];
  customRequests: CustomRequest[];
  currentView: string;
  selectedProductId: string | null;
  selectedCategoryFilter: string | null;
  searchQuery: string;
  currentUser: {
    uid: string;
    email: string;
    displayName?: string;
    emailVerified?: boolean;
  } | null;
  userOrders: Order[];
  savedAddresses: string[];
  couponCode: string;
  appliedDiscount: number; // Percentage
  
  // State Setters & DB Sync
  setCurrentView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedCategoryFilter: (cat: string | null) => void;
  setSearchQuery: (query: string) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setCustomRequests: React.Dispatch<React.SetStateAction<CustomRequest[]>>;
  updateSettings: (settings: AppSettings) => Promise<void>;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Order Actions
  submitOrder: (orderData: Omit<Order, 'id' | 'orderDate' | 'orderStatus' | 'paymentStatus'>) => Promise<Order>;
  submitCustomRequest: (requestData: Omit<CustomRequest, 'id' | 'createdAt' | 'status'>) => Promise<CustomRequest>;
  
  // Authentication Actions
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  addSavedAddress: (address: string) => void;
  
  // Reload triggers
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    storeName: 'Lilyy Beads',
    logo: 'Lilyy Beads 🌸',
    socialInstagram: 'https://instagram.com/lilyybeads.handmade',
    socialWhatsApp: 'https://wa.me/1234567890',
    whatsAppNumber: '+1 (234) 567-890',
    shippingCharges: 4.99,
    taxPercent: 8,
    bannerImages: []
  });
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentView, setCurrentViewState] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Mock/Simulated Login for E-commerce flow (with localStorage persistence)
  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
  
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Initialize and reload from StorageManager
  const refreshData = async () => {
    try {
      const prods = await StorageManager.getProducts();
      const cats = await StorageManager.getCategories();
      const sets = await StorageManager.getSettings();
      const ords = await StorageManager.getOrders();
      const reqs = await StorageManager.getCustomRequests();
      setProducts(prods);
      setCategories(cats);
      setSettings(sets);
      setOrders(ords);
      setCustomRequests(reqs);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    }
  };

  const updateSettings = async (newSettings: AppSettings) => {
    try {
      await StorageManager.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (err) {
      console.error("Error updating settings:", err);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Load local cart & wishlist
    const localCart = localStorage.getItem('lilyy_cart_items');
    if (localCart) {
      try { setCart(JSON.parse(localCart)); } catch {}
    }
    const localWishlist = localStorage.getItem('lilyy_wishlist_items');
    if (localWishlist) {
      try { setWishlist(JSON.parse(localWishlist)); } catch {}
    }
    
    // Load local user session
    const localUser = localStorage.getItem('lilyy_user_session');
    if (localUser) {
      try {
        const u = JSON.parse(localUser);
        setCurrentUser(u);
        loadUserOrders(u.email);
      } catch {}
    }
    
    const localAddresses = localStorage.getItem('lilyy_addresses');
    if (localAddresses) {
      try { setSavedAddresses(JSON.parse(localAddresses)); } catch {}
    } else {
      const defaultAddr = ['123 Pastel Daisy Lane, Flower District, CA 90210'];
      setSavedAddresses(defaultAddr);
      localStorage.setItem('lilyy_addresses', JSON.stringify(defaultAddr));
    }
  }, []);

  // Sync route hashes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentViewState('admin');
      } else if (hash === '#shop') {
        setCurrentViewState('shop');
      } else if (hash === '#custom-orders') {
        setCurrentViewState('custom-orders');
      } else if (hash === '#about') {
        setCurrentViewState('about');
      } else if (hash === '#contact') {
        setCurrentViewState('contact');
      } else if (hash === '#account') {
        setCurrentViewState('account');
      } else if (hash === '#home' || hash === '') {
        setCurrentViewState('home');
      }
    };
    
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const setCurrentView = (view: string) => {
    setCurrentViewState(view);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadUserOrders = async (email: string) => {
    const allOrders = await StorageManager.getOrders();
    const filtered = allOrders.filter(o => o.email.toLowerCase() === email.toLowerCase());
    setUserOrders(filtered);
  };

  // CART ACTIONS
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      localStorage.setItem('lilyy_cart_items', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter(item => item.product.id !== productId);
      localStorage.setItem('lilyy_cart_items', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('lilyy_cart_items', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('lilyy_cart_items');
    setCouponCode('');
    setAppliedDiscount(0);
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'LILYY10') {
      setCouponCode(cleanCode);
      setAppliedDiscount(10);
      return true;
    } else if (cleanCode === 'BEADLOVE20') {
      setCouponCode(cleanCode);
      setAppliedDiscount(20);
      return true;
    } else if (cleanCode === 'WELCOME15') {
      setCouponCode(cleanCode);
      setAppliedDiscount(15);
      return true;
    }
    return false;
  };

  // WISHLIST ACTIONS
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId];
      localStorage.setItem('lilyy_wishlist_items', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // ORDER SUBMISSION
  const submitOrder = async (orderData: Omit<Order, 'id' | 'orderDate' | 'orderStatus' | 'paymentStatus'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      orderDate: new Date().toISOString().split('T')[0],
      orderStatus: 'Pending',
      paymentStatus: 'Paid' // Simulated instant checkout payment
    };
    
    await StorageManager.saveOrder(newOrder);
    
    // Decrease product stock levels
    for (const item of newOrder.items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        await StorageManager.saveProduct({
          ...prod,
          stock: Math.max(0, prod.stock - item.quantity)
        });
      }
    }
    
    await refreshData();
    if (currentUser) {
      await loadUserOrders(currentUser.email);
    }
    clearCart();
    return newOrder;
  };

  // CUSTOM REQUEST SUBMISSION
  const submitCustomRequest = async (requestData: Omit<CustomRequest, 'id' | 'createdAt' | 'status'>): Promise<CustomRequest> => {
    const newRequest: CustomRequest = {
      ...requestData,
      id: 'CST-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    
    await StorageManager.saveCustomRequest(newRequest);
    return newRequest;
  };

  // AUTHENTICATION
  const login = async (email: string): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();
    const mockUser = {
      uid: 'usr-' + Math.floor(1000 + Math.random() * 9000),
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0].toUpperCase(),
      emailVerified: true
    };
    setCurrentUser(mockUser);
    localStorage.setItem('lilyy_user_session', JSON.stringify(mockUser));
    await loadUserOrders(cleanEmail);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserOrders([]);
    localStorage.removeItem('lilyy_user_session');
    setCurrentView('home');
  };

  const addSavedAddress = (address: string) => {
    setSavedAddresses(prev => {
      const updated = [...prev, address];
      localStorage.setItem('lilyy_addresses', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{
      products,
      categories,
      cart,
      wishlist,
      settings,
      orders,
      customRequests,
      currentView,
      selectedProductId,
      selectedCategoryFilter,
      searchQuery,
      currentUser,
      userOrders,
      savedAddresses,
      couponCode,
      appliedDiscount,
      
      setCurrentView,
      setSelectedProductId,
      setSelectedCategoryFilter,
      setSearchQuery,
      setProducts,
      setCategories,
      setOrders,
      setCustomRequests,
      updateSettings,
      
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      applyCoupon,
      
      toggleWishlist,
      isInWishlist,
      
      submitOrder,
      submitCustomRequest,
      
      login,
      logout,
      addSavedAddress,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
