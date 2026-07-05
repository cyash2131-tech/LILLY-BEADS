import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../AppContext';
import { StorageManager } from '../db';
import { Product, Review } from '../types';
import { Heart, ShoppingBag, Share2, Star, Check, ArrowLeft, RefreshCw } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductView() {
  const { 
    selectedProductId, 
    setCurrentView, 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Custom Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  const [addedNotify, setAddedNotify] = useState(false);
  const [copiedNotify, setCopiedNotify] = useState(false);

  // Fetch product & reviews details
  useEffect(() => {
    if (selectedProductId) {
      const fetchDetails = async () => {
        const prod = await StorageManager.getProductById(selectedProductId);
        if (prod) {
          setProduct(prod);
          setActiveImage(prod.images[0] || '');
          setQuantity(1);
          setReviewSubmitted(false);
          
          const revs = await StorageManager.getReviews(selectedProductId);
          setReviews(revs);
        }
      };
      fetchDetails();
    }
  }, [selectedProductId]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id && p.available)
      .slice(0, 4);
  }, [product, products]);

  if (!product) {
    return (
      <div className="text-center py-32 flex flex-col items-center gap-4">
        <RefreshCw size={32} className="animate-spin text-accent" />
        <p className="text-sm text-gray-500 font-heading">Loading lovely jewelry details...</p>
      </div>
    );
  }

  const wishlistActive = isInWishlist(product.id);
  const hasSale = product.salePrice !== undefined && product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotify(true);
    setTimeout(() => setCopiedNotify(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      productId: product.id,
      customerName: reviewerName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    };

    await StorageManager.addReview(newReview);
    setReviews(prev => [newReview, ...prev]);
    
    // Update product ratings dynamically in storage
    const updatedReviewsCount = reviews.length + 1;
    const updatedRating = parseFloat(((reviews.reduce((sum, r) => sum + r.rating, 0) + reviewRating) / updatedReviewsCount).toFixed(1));
    
    await StorageManager.saveProduct({
      ...product,
      rating: updatedRating,
      reviewsCount: updatedReviewsCount
    });

    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSubmitted(true);
  };

  return (
    <div id="product-detail-view" className="max-w-7xl mx-auto px-6 mt-4">
      
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-2 py-2 px-4 rounded-full border border-brand-border/60 hover:bg-secondary/20 transition-all text-xs font-bold text-gray-600 mb-8 cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to Shop
      </button>

      {/* Main product columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Images Grid / Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square rounded-[2.5rem] bg-white border border-brand-border/40 overflow-hidden relative shadow-sm">
            <img
              src={activeImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Gallery Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                    activeImage === img ? 'border-accent shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Info Column */}
        <div className="flex flex-col gap-6">
          
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-accent mb-2 block">
              {product.category}
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-gray-800 leading-tight">
              {product.name}
            </h1>
            
            {/* Reviews Stars */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={15} 
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400' : ''} 
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
              <span className="text-xs text-gray-400">({reviews.length} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-3xl bg-secondary/15 border border-brand-border/30 flex items-center justify-between">
            <div>
              {hasSale ? (
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold text-accent font-heading">
                    ${product.salePrice}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.price}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-extrabold text-gray-800 font-heading">
                  ${product.price}
                </span>
              )}
              <span className="text-xs text-gray-500 mt-1 block">
                {isOutOfStock ? 'Sold out completely' : `${product.stock} pieces in stock and ready to ship`}
              </span>
            </div>
            
            {/* Wishlist toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-3.5 rounded-full bg-white hover:bg-secondary/40 text-gray-500 hover:text-accent shadow-sm transition-all cursor-pointer"
              title="Add to Wishlist"
            >
              <Heart size={18} className={wishlistActive ? 'fill-accent text-accent' : 'text-gray-400'} />
            </button>
          </div>

          {/* Description text */}
          <div className="text-sm text-gray-600 leading-relaxed">
            <h3 className="font-heading text-lg font-bold text-gray-800 mb-2">Beaded Artistry</h3>
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector & Add To Cart Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            
            {/* Quantity */}
            <div className="flex items-center border border-brand-border rounded-2xl h-12 bg-white overflow-hidden p-1 shrink-0 w-full sm:w-auto">
              <button
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => setQuantity(q => q - 1)}
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-secondary/30 transition-all rounded-xl font-heading font-semibold cursor-pointer disabled:opacity-20"
              >
                -
              </button>
              <span className="w-10 text-center text-xs font-semibold text-gray-700">
                {quantity}
              </span>
              <button
                disabled={quantity >= product.stock || isOutOfStock}
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-secondary/30 transition-all rounded-xl font-heading font-semibold cursor-pointer disabled:opacity-20"
              >
                +
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-grow h-12 rounded-2xl font-heading font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : addedNotify
                  ? 'bg-emerald-500 text-white'
                  : 'bg-accent hover:bg-accent/90 text-white'
              }`}
            >
              {addedNotify ? (
                <>
                  <Check size={16} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> Add to Cart
                </>
              )}
            </button>

            {/* Share link button */}
            <button
              onClick={handleShare}
              className="p-3.5 h-12 rounded-2xl border border-brand-border bg-white text-gray-500 hover:bg-secondary/20 transition-all cursor-pointer relative"
              title="Share Jewelry Link"
            >
              {copiedNotify ? <Check size={16} className="text-emerald-500 animate-scale" /> : <Share2 size={16} />}
              {copiedNotify && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>

          </div>

          {/* Quick packaging details card */}
          <div className="p-4 rounded-2xl border border-dashed border-brand-border/60 text-xs text-gray-500 leading-relaxed flex flex-col gap-1">
            <span>🎁 <strong>Loving packaging:</strong> Soft pink muslin drawstring pouch with custom stickers.</span>
            <span>✨ <strong>High Quality:</strong> Made with premium double-wrapped high-tensile elastic.</span>
          </div>

        </div>

      </div>

      {/* REVIEWS SECTION */}
      <section id="reviews-section" className="mt-20 border-t border-brand-border/30 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Reviews Left Column: Lists */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h2 className="font-heading text-2xl font-bold text-gray-800 mb-2">
            Reviews ({reviews.length})
          </h2>
          
          {reviews.length > 0 ? (
            <div className="flex flex-col gap-6">
              {reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-white p-5 rounded-2xl border border-brand-border/30 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-accent font-bold text-xs">
                        {rev.customerName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-gray-800">{rev.customerName}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{rev.date}</span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < rev.rating ? 'fill-yellow-400' : ''} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-brand-border/50 text-gray-400 text-xs">
              Be the first to leave a review for these beautiful beads! 🌸
            </div>
          )}
        </div>

        {/* Reviews Right Column: Create Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-brand-border/40 shadow-sm h-max">
          <h3 className="font-heading text-lg font-bold text-gray-800 mb-4">Share Your Love</h3>
          
          {reviewSubmitted ? (
            <div className="text-center py-8 flex flex-col items-center gap-3">
              <span className="text-4xl">💖</span>
              <h4 className="font-heading text-base font-semibold text-emerald-600">Aww, thank you!</h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                Your review has been saved and shared with other bead lovers! We appreciate your support.
              </p>
              <button
                onClick={() => setReviewSubmitted(false)}
                className="mt-2 text-xs font-bold text-accent underline hover:text-accent/80"
              >
                Submit another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              
              {/* Star selection */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-yellow-400 hover:scale-115 transition-transform focus:outline-none cursor-pointer"
                    >
                      <Star 
                        size={20} 
                        className={star <= reviewRating ? 'fill-yellow-400' : 'text-gray-300'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Name</label>
                <input
                  id="review-name-input"
                  type="text"
                  required
                  placeholder="e.g. Ella Watson"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full h-11 px-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Feedback</label>
                <textarea
                  id="review-comment-input"
                  required
                  rows={4}
                  placeholder="What did you love about this beaded piece? Fits nicely? Beautiful colors?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-4 text-xs rounded-xl bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 resize-none"
                />
              </div>

              <button
                id="review-submit-btn"
                type="submit"
                className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs transition-all shadow-sm cursor-pointer"
              >
                Submit Review
              </button>

            </form>
          )}
        </div>

      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section id="related-products-section" className="mt-24 border-t border-brand-border/30 pt-16">
          <div className="text-center sm:text-left mb-10">
            <span className="text-xs uppercase tracking-widest font-bold text-accent">Selected for you</span>
            <h2 className="text-2xl font-bold text-gray-800 font-heading">Complete the Look</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
