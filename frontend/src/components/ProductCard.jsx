import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';

const ProductCard = ({ product, onQuickAction, onViewDetails }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col rounded-md bg-[#FCFBF8] border border-[#E5DEC9] hover:border-[#9E331E]/40 overflow-hidden transition-all duration-200 shadow-sm">
      
      {/* Image Container */}
      <div
        className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#F7F3EB] cursor-pointer"
        onClick={() => onViewDetails && onViewDetails(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-sm text-[10px] font-medium tracking-wider uppercase bg-[#FCFBF8]/95 text-[#1E1916] border border-[#E5DEC9] shadow-xs">
            {product.category}
          </span>
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-sm text-[10px] font-medium tracking-wider uppercase bg-[#F9EFEB] text-[#9E331E] border border-[#D8988B] shadow-xs">
              Sold Out
            </span>
          ) : product.stock <= 5 ? (
            <span className="px-2.5 py-1 rounded-sm text-[10px] font-medium tracking-wider uppercase bg-[#FFF8E7] text-[#8C5D00] border border-[#F0D597] shadow-xs">
              Only {product.stock} left
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-sm text-[10px] font-medium tracking-wider uppercase bg-[#EBF2EB] text-[#3D5A3C] border border-[#C3D6C2] shadow-xs">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1 text-[#9E331E] text-xs mb-1.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold text-[#1E1916]">{product.rating || '4.9'}</span>
            <span className="text-[#6B6259] ml-1">· Handcrafted</span>
          </div>

          <h3
            onClick={() => onViewDetails && onViewDetails(product)}
            className="font-serif text-xl font-bold text-[#1E1916] group-hover:text-[#9E331E] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#6B6259] mt-2 line-clamp-2 leading-relaxed">
            {product.description || 'Artisanal gift hamper prepared with traditional care and quality provisions.'}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-[#E5DEC9] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#6B6259] block">
              Price
            </span>
            <span className="text-xl font-serif font-bold text-[#1E1916]">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={() => onQuickAction(product)}
            disabled={isOutOfStock}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-medium tracking-wider uppercase transition-colors ${
              isOutOfStock
                ? 'bg-[#E5DEC9] text-[#6B6259] cursor-not-allowed'
                : 'bg-[#9E331E] hover:bg-[#842917] text-[#FCFBF8] shadow-xs active:scale-98'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
