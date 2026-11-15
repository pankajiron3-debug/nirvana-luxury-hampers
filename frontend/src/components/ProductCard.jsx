import React from 'react';
import { ShoppingBag, Star, Sparkles, AlertCircle } from 'lucide-react';

const ProductCard = ({ product, onQuickAction, onViewDetails }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-gold-500/40 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-1">
      
      {/* Image Container */}
      <div
        className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 cursor-pointer"
        onClick={() => onViewDetails && onViewDetails(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-black/30"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-black/60 backdrop-blur-md text-gold-300 border border-gold-500/30">
            {product.category}
          </span>
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/40 backdrop-blur-md">
              Sold Out
            </span>
          ) : product.stock <= 5 ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              Only {product.stock} left
            </span>
          ) : (
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              <span>In Stock</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1 text-gold-400 text-xs mb-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold">{product.rating || '4.9'}</span>
            <span className="text-slate-500 ml-1">· Handcrafted Luxe</span>
          </div>

          <h3
            onClick={() => onViewDetails && onViewDetails(product)}
            className="font-serif text-lg font-bold text-white group-hover:text-gold-200 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {product.description || 'Artisanal luxury gift hamper prepared with rare components.'}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
              Curated Price (INR)
            </span>
            <span className="text-xl font-serif font-bold text-white">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={() => onQuickAction(product)}
            disabled={isOutOfStock}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gold-500 hover:bg-gold-400 text-slate-950 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Unavailable' : 'Select'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
