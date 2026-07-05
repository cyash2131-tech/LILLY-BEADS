import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { X, ShoppingBag, Trash2, ArrowRight, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../utils';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    settings, 
    setCurrentView,
    applyCoupon,
    couponCode,
    appliedDiscount
  } = useApp();
  
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = cart.reduce((sum, item) => {
    const activePrice = item.product.salePrice !== undefined ? item.product.salePrice : item.product.price;
    return sum + (activePrice * item.quantity);
  }, 0);
  
  const discountAmount = subtotal * (appliedDiscount / 100);
  const discountedSubtotal = subtotal - discountAmount;
  
  const taxAmount = discountedSubtotal * (settings.taxPercent / 100);
  const shippingCharge = subtotal > 0 ? settings.shippingCharges : 0;
  const totalAmount = discountedSubtotal + taxAmount + shippingCharge;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponSuccess(true);
      setCouponError(false);
      setTimeout(() => setCouponSuccess(false), 3000);
    } else {
      setCouponError(true);
      setCouponSuccess(false);
      setTimeout(() => setCouponError(false), 3000);
    }
    setCouponInput('');
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    onClose();
    setCurrentView('checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black cursor-pointer"
          />

          {/* Drawer Sliding Body */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-screen max-w-md bg-bg-brand border-l border-brand-border flex flex-col shadow-2xl h-full"
            >
              
              {/* Header */}
              <div className="p-6 border-b border-brand-border flex items-center justify-between">
                <span className="font-heading text-lg font-bold text-gray-800 flex items-center gap-1.5">
                  <ShoppingBag size={18} className="text-accent" /> Your Bead Bag ({totalItems})
                </span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-secondary text-gray-500 hover:text-accent transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-5">
                {cart.length > 0 ? (
                  cart.map((item) => {
                    const activePrice = item.product.salePrice !== undefined ? item.product.salePrice : item.product.price;
                    return (
                      <div 
                        key={item.product.id}
                        className="flex gap-4 p-4 rounded-2xl bg-white border border-brand-border/30 shadow-sm"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-bg-brand shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-bold tracking-widest text-accent">{item.product.category}</span>
                            <h4 className="font-heading text-xs font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                            <span className="text-xs font-bold text-accent font-heading mt-0.5 block">
                              {formatCurrency(activePrice)}
                            </span>
                          </div>
                          
                          {/* Quantity selector / trash row */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-border/10">
                            <div className="flex items-center border border-brand-border rounded-lg h-7 bg-bg-brand">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                className="w-6 h-full flex items-center justify-center text-xs font-semibold text-gray-500 hover:bg-secondary/40 rounded-l cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-[10px] font-bold text-gray-700">{item.quantity}</span>
                              <button
                                disabled={item.quantity >= item.product.stock}
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                className="w-6 h-full flex items-center justify-center text-xs font-semibold text-gray-500 hover:bg-secondary/40 rounded-r cursor-pointer disabled:opacity-25"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-400 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 flex flex-col items-center gap-4">
                    <span className="text-4xl">🌸</span>
                    <h4 className="font-heading text-base font-bold text-gray-600">Your bag is empty</h4>
                    <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                      Handmade chokers, cute bracelets and customized straps are waiting for you in the shop!
                    </p>
                    <button
                      onClick={() => { onClose(); setCurrentView('shop'); }}
                      className="py-2 px-5 rounded-full bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs cursor-pointer"
                    >
                      Explore Shop
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Calculations */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-brand-border bg-white flex flex-col gap-4">
                  
                  {/* Coupon Form */}
                  <form onSubmit={handleCouponSubmit} className="flex gap-2">
                    <input
                      id="cart-coupon-input"
                      type="text"
                      placeholder="Coupon: LILYY10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-grow h-9 px-3 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                    />
                    <button
                      id="cart-coupon-apply"
                      type="submit"
                      className="h-9 px-4 rounded-xl bg-secondary hover:bg-accent hover:text-white text-accent font-heading font-semibold text-xs transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  
                  {/* Coupon notifications */}
                  {couponSuccess && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 animate-scale">
                      <Check size={10} /> Coupon code successfully applied!
                    </span>
                  )}
                  {couponError && (
                    <span className="text-[10px] text-rose-500 font-semibold animate-shake">
                      Invalid coupon code. Try 'LILYY10' or 'BEADLOVE20'.
                    </span>
                  )}

                  {/* Calculations breakdown */}
                  <div className="flex flex-col gap-2 border-b border-brand-border/20 pb-3 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Bag Subtotal</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-accent font-semibold">
                        <span>Coupon Discount ({appliedDiscount}%)</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Est. Shipping Charges</span>
                      <span>{formatCurrency(shippingCharge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax ({settings.taxPercent}%)</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-baseline">
                    <span className="font-heading text-base font-bold text-gray-800">Order Total</span>
                    <span className="font-heading text-xl font-black text-accent">{formatCurrency(totalAmount)}</span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    id="cart-drawer-checkout-btn"
                    onClick={handleCheckoutClick}
                    className="w-full h-12 rounded-2xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </button>

                  <span className="text-[10px] text-gray-400 text-center block mt-1">
                    🌸 Premium handcrafted jewelry. Shipped with love.
                  </span>

                </div>
              )}

            </motion.div>
          </div>
          
        </div>
      )}
    </AnimatePresence>
  );
}
