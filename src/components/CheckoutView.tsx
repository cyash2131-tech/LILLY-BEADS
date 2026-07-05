import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ShoppingBag, ArrowLeft, Check, Sparkles, CreditCard, Mail, Phone, MapPin, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../utils';

export default function CheckoutView() {
  const { 
    cart, 
    settings, 
    submitOrder, 
    currentUser, 
    savedAddresses,
    appliedDiscount,
    couponCode,
    setCurrentView
  } = useApp();

  // Shipping form state
  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(savedAddresses[0] || '');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  const subtotal = cart.reduce((sum, item) => {
    const activePrice = item.product.salePrice !== undefined ? item.product.salePrice : item.product.price;
    return sum + (activePrice * item.quantity);
  }, 0);

  const discountAmount = subtotal * (appliedDiscount / 100);
  const discountedSubtotal = subtotal - discountAmount;
  
  const taxAmount = discountedSubtotal * (settings.taxPercent / 100);
  const shippingCharge = subtotal > 0 ? settings.shippingCharges : 0;
  const totalAmount = discountedSubtotal + taxAmount + shippingCharge;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address || cart.length === 0) return;
    setSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.salePrice !== undefined ? item.product.salePrice : item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
      }));

      const newOrder = await submitOrder({
        customerName: name,
        phone,
        email,
        shippingAddress: address,
        items: orderItems,
        subtotal,
        shippingCharges: shippingCharge,
        tax: taxAmount,
        totalAmount,
        couponCode: couponCode || undefined
      });

      setSuccessOrder(newOrder);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickAddressSelect = (addr: string) => {
    setAddress(addr);
  };

  if (cart.length === 0 && !successOrder) {
    return (
      <div className="text-center py-32 flex flex-col items-center gap-4 max-w-sm mx-auto px-6">
        <span className="text-4xl">🛒</span>
        <h2 className="font-heading text-2xl font-bold text-gray-700">Checkout is empty</h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          You do not have any jewelry pieces in your bag yet. Hop on over to the shop to find your favorites!
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="py-2.5 px-6 rounded-full bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs cursor-pointer mt-2"
        >
          Explore Bead Shop
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="max-w-6xl mx-auto px-6 mt-6">
      
      {/* Back to shop */}
      {!successOrder && (
        <button
          onClick={() => setCurrentView('shop')}
          className="inline-flex items-center gap-2 py-2 px-4 rounded-full border border-brand-border/60 hover:bg-secondary/20 transition-all text-xs font-bold text-gray-600 mb-8 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Shop
        </button>
      )}

      <AnimatePresence mode="wait">
        {successOrder ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border border-brand-border p-10 text-center flex flex-col items-center gap-5 shadow-sm max-w-xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <Check size={32} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-800">Order Placed Successfully!</h2>
            <div className="flex flex-col gap-1">
              <span className="text-xs bg-accent/10 border border-brand-border/50 text-accent font-semibold px-4 py-2 rounded-2xl font-mono w-max mx-auto">
                Order ID: {successOrder.id}
              </span>
              <span className="text-[10px] text-gray-400">Please save this Order ID to track your delivery.</span>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Congratulations, <strong>{successOrder.customerName}</strong>! Your transaction was completed successfully. A handcrafted pink parcel containing your sweet beaded pieces will be prepared by our team and shipped within 1-2 business days.
            </p>
            
            <div className="w-full text-left bg-bg-brand border border-brand-border/60 p-4 rounded-2xl text-xs text-gray-600 flex flex-col gap-1">
              <span className="font-bold text-gray-800 block mb-1">Receipt Summary</span>
              <span><strong>Total Paid:</strong> {formatCurrency(successOrder.totalAmount)}</span>
              <span><strong>Shipping To:</strong> {successOrder.shippingAddress}</span>
              <span><strong>Payment Status:</strong> {successOrder.paymentStatus}</span>
            </div>

            <button
              id="checkout-success-home-btn"
              onClick={() => setCurrentView('home')}
              className="py-3 px-8 rounded-full bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs transition-all shadow-sm cursor-pointer mt-4"
            >
              Continue Shopping
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleCheckoutSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            
            {/* Left: Address and billing info */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Shipping address card */}
              <div className="bg-white rounded-3xl border border-brand-border/40 p-6 shadow-sm flex flex-col gap-4">
                <h3 className="font-heading text-base font-bold text-gray-800 flex items-center gap-1.5 pb-2.5 border-b border-brand-border/20">
                  <MapPin size={16} className="text-accent" /> Shipping Address
                </h3>

                {/* Quick saved address option */}
                {currentUser && savedAddresses.length > 0 && (
                  <div className="flex flex-col gap-1.5 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Use Saved Address</span>
                    <div className="flex gap-2 flex-wrap">
                      {savedAddresses.map((addr, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleQuickAddressSelect(addr)}
                          className={`py-1.5 px-3.5 rounded-xl border text-[10px] font-medium transition-all text-left cursor-pointer ${
                            address === addr 
                              ? 'bg-secondary/40 border-accent text-accent' 
                              : 'bg-bg-brand border-brand-border/60 text-gray-600 hover:bg-secondary/15'
                          }`}
                        >
                          Address {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer name */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Full Recipient Name</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Email Address</label>
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
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="+1 (234) 567-890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                      />
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Shipping address */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Shipping Address</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="123 Pastel Daisy Lane, District 4, CA 90210"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 resize-none"
                  />
                </div>
              </div>

              {/* Payment simulation card */}
              <div className="bg-white rounded-3xl border border-brand-border/40 p-6 shadow-sm flex flex-col gap-4">
                <h3 className="font-heading text-base font-bold text-gray-800 flex items-center gap-1.5 pb-2.5 border-b border-brand-border/20">
                  <CreditCard size={16} className="text-accent" /> Payment Method
                </h3>
                
                <p className="text-[10px] text-gray-400 leading-relaxed mb-1">
                  🔒 Payment is fully simulated and secure for testing. No real card funds are extracted.
                </p>

                {/* Cardholder name */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ella Watson"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Expiry Date</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 font-mono"
                    />
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={3}
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Cart order summary */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
              
              {/* Order Summary box */}
              <div className="bg-white rounded-3xl border border-brand-border/40 p-6 shadow-sm flex flex-col gap-4">
                <h3 className="font-heading text-base font-bold text-gray-800 flex items-center gap-1 pb-2 border-b border-brand-border/20">
                  <ShoppingBag size={16} className="text-accent" /> Order Summary
                </h3>

                {/* Items preview list */}
                <div className="flex flex-col gap-3.5 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => {
                    const activePrice = item.product.salePrice !== undefined ? item.product.salePrice : item.product.price;
                    return (
                      <div key={item.product.id} className="flex gap-3 items-center justify-between text-xs">
                        <div className="flex gap-2.5 items-center">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-lg object-cover bg-bg-brand shrink-0"
                          />
                          <div>
                            <span className="font-bold text-gray-700 line-clamp-1">{item.product.name}</span>
                            <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-800">{formatCurrency(activePrice * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Price calculations */}
                <div className="flex flex-col gap-2 pt-4 border-t border-brand-border/20 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-accent font-semibold">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span>{formatCurrency(shippingCharge)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax ({settings.taxPercent}%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm font-bold text-gray-800 border-t border-brand-border/10 pt-3 mt-1">
                    <span>Order Grand Total</span>
                    <span className="text-accent font-heading text-lg">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                {/* Complete checkout button */}
                <button
                  id="checkout-complete-submit"
                  type="submit"
                  disabled={submitting || cart.length === 0}
                  className="w-full h-12 rounded-2xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span>Completing handmade transaction...</span>
                  ) : (
                    <>
                      <Sparkles size={16} className="fill-white" />
                      <span>Complete Secure Purchase</span>
                    </>
                  )}
                </button>

                <span className="text-[9px] text-gray-400 text-center block leading-relaxed px-4">
                  By clicking above, you authorize a test simulation transaction. Packaged lovingly by Lilyy Beads.
                </span>

              </div>

            </div>

          </motion.form>
        )}
      </AnimatePresence>

    </div>
  );
}
