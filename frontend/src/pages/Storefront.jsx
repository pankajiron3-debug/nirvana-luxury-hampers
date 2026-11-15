import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, Search, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
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
        toast.error('Could not load storefront hampers.');
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
    } else {
      toast.success(`Selected "${product.name}" (₹${Number(product.price).toLocaleString('en-IN')}) for bespoke inquiry!`, {
        icon: '💎',
        style: {
          background: '#0F172A',
          color: '#F8FAFC',
          border: '1px solid rgba(197, 160, 89, 0.3)',
        },
      });
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Luxury Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#121829] to-slate-950 border border-gold-500/20 p-8 sm:p-14 text-center shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent"></div>
        <div className="relative max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Fine Art of Gifting · Indian Luxe Edition</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Curated Expressions of Opulence & Distinction
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Discover bespoke gift collections, imported epicurean delicacies, and limited-edition celebratory trunks handcrafted for extraordinary moments across India.
          </p>

          {/* Pan-India Shipping Highlight Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 backdrop-blur-md">
            <Truck className="w-3.5 h-3.5 text-gold-400" />
            <span>Complimentary White-Glove Shipping on orders above <strong>₹2,999</strong> (Standard <strong>₹199</strong>)</span>
          </div>

          {/* Search bar inside Hero */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
            <input
              type="text"
              placeholder="Search by collection or delicacies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/60 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-gold-500/50 shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gold-500 text-slate-950 font-bold shadow-lg shadow-gold-500/20 scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Storefront Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-gold-400" />
            <h2 className="font-serif text-xl font-bold text-white">
              {selectedCategory === 'All' ? 'Complete Collection' : selectedCategory}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {products.length} {products.length === 1 ? 'Curated Gift' : 'Curated Gifts'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <StorefrontCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-slate-800/80 bg-slate-900/20">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-slate-300">No hampers match your selection</h3>
            <p className="text-xs text-slate-500 mt-1">Try another category or clear your search query.</p>
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
