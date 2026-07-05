import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../AppContext';
import { Heart, ShoppingBag, Eye, Sparkles, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../utils';

export default function ProductCard({ product }: { product: Product; key?: string | number }) {
  const { toggleWishlist, isInWishlist, addToCart, setCurrentView, setSelectedProductId } = useApp();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [addedNotify, setAddedNotify] = useState(false);

  const wishlistActive = isInWishlist(product.id);
  const hasSale = product.salePrice !== undefined && product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;

  const handleProductClick = () => {
    setSelectedProductId(product.id);
    setCurrentView('product');
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 2000);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <>
      <motion.div 
        id={`product-card-${product.id}`}
        whileHover={{ y: -6 }}
        className="group relative bg-white rounded-3xl border border-brand-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
      >
        {/* Badges Overlay */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
          {product.featured && (
            <span className="bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-0.5">
              <Sparkles size={8} className="fill-white" /> Best Seller
            </span>
          )}
          {hasSale && (
            <span className="bg-rose-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Sale
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button Overlay */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={handleWishlistClick}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-accent shadow-sm transition-all cursor-pointer"
          aria-label="Add to wishlist"
        >
          <Heart 
            size={18} 
            className={`${wishlistActive ? 'fill-accent text-accent' : 'text-gray-400 hover:text-accent'}`} 
          />
        </button>

        {/* Image Container with Hover Zoom */}
        <div 
          onClick={handleProductClick}
          className="aspect-square w-full overflow-hidden bg-bg-brand relative cursor-pointer"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          {/* Quick Actions Hover Mask */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              id={`quick-view-btn-${product.id}`}
              onClick={(e) => { e.stopPropagation(); setQuickViewOpen(true); }}
              className="p-3 rounded-full bg-white text-gray-700 hover:bg-accent hover:text-white transition-all shadow-md transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer"
              title="Quick View"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Category */}
          <span className="text-[10px] uppercase tracking-wider font-semibold text-accent mb-1.5 block">
            {product.category}
          </span>

          {/* Name */}
          <h3 
            onClick={handleProductClick}
            className="font-heading text-base font-semibold text-gray-800 line-clamp-1 group-hover:text-accent transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4 flex-grow">
            {product.description}
          </p>

          {/* Pricing & Add Button row */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-brand-border/20">
            <div className="flex flex-col">
              {hasSale ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-accent font-heading">
                    {formatCurrency(product.salePrice!)}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-800 font-heading">
                  {formatCurrency(product.price)}
                </span>
              )}
              <span className="text-[10px] text-gray-400">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCartClick}
              disabled={isOutOfStock}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                isOutOfStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : addedNotify
                  ? 'bg-emerald-500 text-white'
                  : 'bg-secondary/60 hover:bg-accent hover:text-white text-accent shadow-sm'
              }`}
              title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
            >
              {addedNotify ? <Check size={18} /> : <ShoppingBag size={18} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickViewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-brand-border max-w-2xl w-full relative z-10 grid grid-cols-1 md:grid-cols-2"
            >
              <button
                onClick={() => setQuickViewOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-20 cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Image Column */}
              <div className="aspect-square bg-bg-brand p-4 flex items-center justify-center">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Detail Column */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-accent mb-2 block">
                    {product.category}
                  </span>
                  <h2 className="font-heading text-xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-yellow-400">★</span>
                    <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviewsCount} reviews)</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {product.description}
                  </p>
                  
                  {/* Prices */}
                  <div className="my-4">
                    {hasSale ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-accent font-heading">
                          {formatCurrency(product.salePrice!)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-extrabold text-gray-800 font-heading">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 mt-1 block">
                      {isOutOfStock ? 'Temporarily out of stock' : `${product.stock} items currently available`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setQuickViewOpen(false);
                      handleProductClick();
                    }}
                    className="flex-1 py-3 px-4 rounded-2xl border border-brand-border text-xs font-bold text-gray-700 hover:bg-secondary/20 transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      handleAddToCartClick(e);
                      setQuickViewOpen(false);
                    }}
                    disabled={isOutOfStock}
                    className="flex-1 py-3 px-4 rounded-2xl bg-accent hover:bg-accent/90 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
