import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Search, SlidersHorizontal, ArrowUpDown, X, Heart } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ShopView() {
  const { 
    products, 
    categories, 
    selectedCategoryFilter, 
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [sortOption, setSortOption] = useState<string>('default');
  const [priceRange, setPriceRange] = useState<number>(50); // Max $50
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim() !== '') {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategoryFilter) {
      result = result.filter(p => p.category === selectedCategoryFilter);
    }

    // Price range filter
    result = result.filter(p => {
      const activePrice = p.salePrice !== undefined ? p.salePrice : p.price;
      return activePrice <= priceRange;
    });

    // Sorting
    if (sortOption === 'price-low') {
      result.sort((a, b) => {
        const pa = a.salePrice !== undefined ? a.salePrice : a.price;
        const pb = b.salePrice !== undefined ? b.salePrice : b.price;
        return pa - pb;
      });
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => {
        const pa = a.salePrice !== undefined ? a.salePrice : a.price;
        const pb = b.salePrice !== undefined ? b.salePrice : b.price;
        return pb - pa;
      });
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategoryFilter, sortOption, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="shop-view" className="max-w-7xl mx-auto px-6 mt-6">
      
      {/* Title Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-heading text-gray-800">The Bead Shop</h1>
        <p className="text-sm text-gray-500 mt-2">
          Each beaded treasure is strung individually with love and premium materials.
        </p>
      </div>

      {/* Control Bar: Search, Category Filter Pills, Sort and Price */}
      <div className="flex flex-col gap-6 bg-white rounded-3xl border border-brand-border/40 p-6 shadow-sm mb-10">
        
        {/* Search & Category Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Categories Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setSelectedCategoryFilter(null); setCurrentPage(1); }}
              className={`py-2 px-4 rounded-full text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                selectedCategoryFilter === null
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-secondary/40 text-gray-700 hover:bg-secondary/80'
              }`}
            >
              All Beads
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategoryFilter(cat.id); setCurrentPage(1); }}
                className={`py-2 px-4 rounded-full text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-secondary/40 text-gray-700 hover:bg-secondary/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <input
              id="shop-search-field"
              type="text"
              placeholder="Search specific beads..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full h-11 pl-10 pr-4 rounded-full bg-bg-brand border border-brand-border focus:outline-none focus:ring-1 focus:ring-accent text-xs text-gray-700"
            />
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={12} />
              </button>
            )}
          </div>

        </div>

        {/* Sorting & Advanced Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-brand-border/20">
          
          {/* Price Range Slider */}
          <div className="flex items-center gap-4">
            <SlidersHorizontal size={16} className="text-gray-400 shrink-0" />
            <div className="flex-grow flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-600 min-w-[50px]">Max Price:</span>
              <input
                id="shop-price-slider"
                type="range"
                min="5"
                max="50"
                step="1"
                value={priceRange}
                onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
                className="w-full accent-accent cursor-pointer"
              />
              <span className="text-xs font-bold text-accent font-heading">${priceRange}</span>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-end gap-3">
            <ArrowUpDown size={16} className="text-gray-400" />
            <span className="text-xs text-gray-600 font-semibold">Sort By:</span>
            <select
              id="shop-sort-dropdown"
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
              className="py-2 px-3.5 rounded-full bg-bg-brand border border-brand-border text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="default">Default Features</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated ⭐</option>
            </select>
          </div>

        </div>

      </div>

      {/* Product Grid */}
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-border/30 flex flex-col items-center gap-4">
          <span className="text-4xl">🌸</span>
          <h3 className="font-heading text-xl font-bold text-gray-700">No matching beads found</h3>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            Try adjusting your price range filter or typing a different keyword to explore other handmade beads.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryFilter(null);
              setPriceRange(50);
              setCurrentPage(1);
            }}
            className="py-2.5 px-6 rounded-full bg-accent hover:bg-accent/90 text-white font-heading font-semibold text-xs cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="w-10 h-10 rounded-xl border border-brand-border flex items-center justify-center text-gray-500 hover:bg-secondary/20 transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          >
            &lt;
          </button>
          
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-accent text-white shadow-sm'
                    : 'border border-brand-border text-gray-600 hover:bg-secondary/20'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-10 h-10 rounded-xl border border-brand-border flex items-center justify-center text-gray-500 hover:bg-secondary/20 transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          >
            &gt;
          </button>
        </div>
      )}

    </div>
  );
}
