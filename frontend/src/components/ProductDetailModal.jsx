import React from 'react';
import { X, Star, Sparkles, ShoppingBag, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock === 0;
  const isVeg = product.name?.toLowerCase().includes('paneer') || product.sku?.includes('H808');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/60 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-black/80 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Hamper Image Container */}
          <div className="relative h-72 md:h-full min-h-[320px] bg-slate-900">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden"></div>

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-black/70 backdrop-blur-md text-gold-300 border border-gold-500/30">
                {product.category}
              </span>
              {isVeg && (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>100% Pure Vegetarian</span>
                </span>
              )}
            </div>
          </div>

          {/* Details & Purchase Section */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Rating & SKU */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-gold-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{product.rating || '4.9'}</span>
                  <span className="text-slate-500">· Curated Luxury</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {product.sku || 'NLH-ITEM'}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl font-bold text-white tracking-tight leading-snug">
                {product.name}
              </h2>

              {/* Price in INR */}
              <div className="py-3 px-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Curated Price (₹ INR)
                  </span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-gold-300">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Inclusive of all Indian taxes</span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Artisanal Curation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {product.description || 'Artisanal luxury gift hamper prepared with rare components.'}
                </p>
              </div>

              {/* Pan-India Shipping Notice */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center space-x-2 text-gold-400 font-semibold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Pan-India Luxury White-Glove Dispatch</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  • Complimentary shipping on orders above <strong>₹2,999</strong> (Standard shipping <strong>₹199</strong>).
                  <br />
                  • Express temperature-controlled courier delivery across all Indian cities and metros.
                </p>
              </div>

              {/* Stock status */}
              <div className="flex items-center space-x-2 text-xs">
                {isOutOfStock ? (
                  <span className="text-rose-400 font-medium">Currently Sold Out</span>
                ) : (
                  <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>In Stock & Ready for Dispatch ({product.stock} units available)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl ${
                  isOutOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gold-500 hover:bg-gold-400 text-slate-950 shadow-gold-500/20 active:scale-95'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Currently Unavailable' : 'Add to Bespoke Cart'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
