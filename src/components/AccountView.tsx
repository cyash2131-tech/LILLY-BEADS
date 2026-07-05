import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { StorageManager } from '../db';
import { Heart, ShoppingBag, MapPin, User, Mail, LogOut, FileText, Check, Plus, Star } from 'lucide-react';
import ProductCard from './ProductCard';
import { formatCurrency } from '../utils';

export default function AccountView() {
  const { 
    currentUser, 
    login, 
    logout, 
    userOrders, 
    wishlist, 
    products, 
    savedAddresses, 
    addSavedAddress,
    setCurrentView
  } = useApp();

  const [emailInput, setEmailInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses'>('orders');
  
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    
    await login(emailInput);
    setLoginSuccess(true);
    setEmailInput('');
    setTimeout(() => setLoginSuccess(false), 2000);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    addSavedAddress(addressInput);
    setAddressInput('');
    setAddressSuccess(true);
    setTimeout(() => setAddressSuccess(false), 2000);
  };

  // Get wishlisted products
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  // If not logged in, show Login Screen
  if (!currentUser) {
    return (
      <div id="account-login-view" className="max-w-md mx-auto px-6 mt-12">
        <div className="bg-white rounded-[2.5rem] border border-brand-border p-8 md:p-10 shadow-sm flex flex-col items-center gap-6 relative">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-accent text-2xl font-bold">
            🌸
          </div>
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-gray-800">Lilyy Lovers Club</h1>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed mt-1.5">
              Log in to save multiple addresses, track your order shipping status, and access your favorite wishlists.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Email Address</label>
              <div className="relative">
                <input
                  id="login-email-field"
                  type="email"
                  required
                  placeholder="ella@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                />
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              Log In / Register
            </button>
          </form>

          <span className="text-[9px] text-gray-400 text-center leading-relaxed px-4">
            No password required! Simply enter your email address to initiate your simulated customer account.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div id="account-dashboard-view" className="max-w-5xl mx-auto px-6 mt-6">
      
      {/* Account Overview Header */}
      <div className="bg-white rounded-3xl border border-brand-border/40 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary text-accent font-heading font-bold text-2xl flex items-center justify-center border border-brand-border shadow-inner">
            {currentUser.displayName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-gray-800">Welcome, {currentUser.displayName}!</h1>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Mail size={12} /> {currentUser.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="py-2.5 px-5 rounded-full border border-rose-300 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          <LogOut size={12} /> Logout Account
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-brand-border/30 gap-6 mb-8 text-sm font-heading font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 relative transition-colors focus:outline-none cursor-pointer ${
            activeTab === 'orders' ? 'text-accent' : 'text-gray-400 hover:text-accent'
          }`}
        >
          My Orders ({userOrders.length})
          {activeTab === 'orders' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 relative transition-colors focus:outline-none cursor-pointer ${
            activeTab === 'wishlist' ? 'text-accent' : 'text-gray-400 hover:text-accent'
          }`}
        >
          My Wishlist ({wishlistedProducts.length})
          {activeTab === 'wishlist' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 relative transition-colors focus:outline-none cursor-pointer ${
            activeTab === 'addresses' ? 'text-accent' : 'text-gray-400 hover:text-accent'
          }`}
        >
          Saved Addresses ({savedAddresses.length})
          {activeTab === 'addresses' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
          )}
        </button>
      </div>

      {/* TAB CONTENT PANEL */}
      <div>
        {activeTab === 'orders' && (
          <div id="account-tab-orders" className="flex flex-col gap-6">
            {userOrders.length > 0 ? (
              userOrders.map((ord) => (
                <div 
                  key={ord.id}
                  className="bg-white rounded-3xl border border-brand-border/40 p-6 shadow-sm flex flex-col gap-5"
                >
                  
                  {/* Order header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/20 pb-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-heading text-sm font-bold text-gray-800">Order ID: {ord.id}</span>
                      <span className="text-[10px] text-gray-400">Placed on {ord.orderDate}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-600">
                        {ord.paymentStatus}
                      </span>
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-secondary text-accent">
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex flex-col gap-3">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex gap-3 items-center justify-between text-xs">
                        <div className="flex gap-2.5 items-center">
                          <img
                            src={it.image}
                            alt={it.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover bg-bg-brand shrink-0"
                          />
                          <div>
                            <span className="font-bold text-gray-700 block line-clamp-1">{it.name}</span>
                            <span className="text-[10px] text-gray-400">Quantity: {it.quantity} x {formatCurrency(it.price)}</span>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-800">{formatCurrency(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Financial details row */}
                  <div className="flex justify-between items-baseline pt-4 border-t border-brand-border/20 text-xs text-gray-500 mt-1">
                    <span>Delivered to: <strong>{ord.shippingAddress}</strong></span>
                    <span className="font-heading text-sm font-bold text-accent shrink-0">
                      Total: {formatCurrency(ord.totalAmount)}
                    </span>
                  </div>

                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-brand-border/50 text-gray-400 text-xs flex flex-col items-center gap-3">
                <span>🎁</span>
                <p>You haven't placed any handmade jewelry orders yet.</p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="py-2 px-5 rounded-full bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs mt-2 cursor-pointer"
                >
                  Start Customizing
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div id="account-tab-wishlist">
            {wishlistedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade">
                {wishlistedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-brand-border/50 text-gray-400 text-xs flex flex-col items-center gap-3">
                <span>💖</span>
                <p>Your wishlist is looking empty. Click the heart icons on items to save them here!</p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="py-2 px-5 rounded-full bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs mt-2 cursor-pointer"
                >
                  Find Cute Beads
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div id="account-tab-addresses" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* List addresses */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <h3 className="font-heading text-base font-bold text-gray-800 mb-2">Saved Addresses</h3>
              {savedAddresses.map((addr, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-white rounded-2xl border border-brand-border/40 shadow-sm text-xs text-gray-700 flex gap-3 items-center"
                >
                  <MapPin size={16} className="text-accent shrink-0" />
                  <span className="leading-relaxed">{addr}</span>
                </div>
              ))}
            </div>

            {/* Add Address Form */}
            <div className="md:col-span-5 bg-white p-5 rounded-3xl border border-brand-border/40 shadow-sm">
              <h3 className="font-heading text-base font-bold text-gray-800 mb-4">Add New Address</h3>
              
              <form onSubmit={handleAddAddressSubmit} className="flex flex-col gap-4">
                <div>
                  <textarea
                    required
                    rows={3}
                    placeholder="123 Pastel Daisy Lane, Flower District, CA 90210"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="w-full p-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 resize-none"
                  />
                </div>
                
                {addressSuccess && (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 animate-scale">
                    <Check size={10} /> Address saved successfully!
                  </span>
                )}

                <button
                  id="add-address-submit-btn"
                  type="submit"
                  className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Address
                </button>
              </form>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
