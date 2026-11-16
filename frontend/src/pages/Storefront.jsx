import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { productApi } from '../api/client';
import ProductCard from '../components/ProductCard';
import { StorefrontCardSkeleton } from '../components/SkeletonLoaders';

const CATEGORIES = [
  'All',
  'Royal Hampers',
  'Gourmet & Truffle',
  'Champagne & Wine',
  'Spa & Wellness',
  'Artisanal Sweets',
  'Corporate Luxe',
];

const Storefront = ({ onAddToCart, onViewDetails }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProducts({
          category: selectedCategory,
          search,
          limit: 30,
        });
        if (res?.success) {
          setProducts(res.products || []);
        }
      } catch (err) {
        console.error(err);
        toast.error('Could not load hampers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCatalog, 200);
    return () => clearTimeout(debounce);
  }, [selectedCategory, search]);

  const handleSelectProduct = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden rounded-md bg-[#FCFBF8] border border-[#E5DEC9] p-8 sm:p-14 text-center">
        <div className="relative max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F7F3EB] border border-[#E5DEC9] text-[#9E331E] text-xs font-medium uppercase tracking-widest">
            <span>Handcrafted Festive & Celebratory Gifting</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1E1916] tracking-tight leading-tight">
            Curated Expressions of Warmth & Celebration
          </h1>

          <p className="text-sm sm:text-base text-[#6B6259] max-w-xl mx-auto font-normal leading-relaxed">
            Thoughtful gift collections, artisanal festive sweets, and regional epicurean treasures curated with care and dispatched across India.
          </p>

          {/* Pan-India Shipping Highlight */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#6B6259]">
            <Truck className="w-3.5 h-3.5 text-[#9E331E]" />
            <span>Complimentary delivery across India on orders above <strong>₹2,999</strong> (Standard <strong>₹199</strong>)</span>
          </div>

          {/* Search bar inside Hero */}
          <div className="pt-3 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#6B6259] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by hamper title or contents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-sm text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md text-xs tracking-wider uppercase transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#9E331E] text-[#FCFBF8] font-semibold shadow-sm'
                  : 'bg-[#FCFBF8] text-[#6B6259] hover:text-[#1E1916] border border-[#E5DEC9] hover:border-[#9E331E]/40'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Storefront Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E5DEC9]">
          <h2 className="font-serif text-2xl font-bold text-[#1E1916]">
            {selectedCategory === 'All' ? 'All Gift Hampers' : selectedCategory}
          </h2>
          <span className="text-xs font-sans text-[#6B6259]">
            {products.length} {products.length === 1 ? 'Hamper available' : 'Hampers available'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <StorefrontCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 rounded-md border border-[#E5DEC9] bg-[#FCFBF8]">
            <ShoppingBag className="w-10 h-10 text-[#6B6259] mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-lg font-serif font-bold text-[#1E1916]">No hampers found</h3>
            <p className="text-xs text-[#6B6259] mt-1">Try selecting another collection or clearing your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickAction={handleSelectProduct}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Storefront;
