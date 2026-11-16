import React from 'react';
import { X, Star, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';

const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-md bg-[#FCFBF8] border border-[#E5DEC9] shadow-modal overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-md bg-[#FCFBF8]/90 border border-[#E5DEC9] text-[#6B6259] hover:text-[#1E1916] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Hamper Image Container */}
          <div className="relative h-72 md:h-full min-h-[340px] bg-[#F7F3EB]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-2.5 py-1 rounded-sm text-[10px] font-medium tracking-wider uppercase bg-[#FCFBF8]/95 text-[#1E1916] border border-[#E5DEC9]">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details & Purchase Section */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Rating & SKU */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-[#9E331E]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-[#1E1916]">{product.rating || '4.9'}</span>
                  <span className="text-[#6B6259]">· Handcrafted</span>
                </div>
                <span className="font-sans text-[11px] text-[#6B6259] bg-[#F7F3EB] px-2 py-0.5 rounded-sm border border-[#E5DEC9]">
                  {product.sku || 'NLH-ITEM'}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl font-bold text-[#1E1916] tracking-tight leading-snug">
                {product.name}
              </h2>

              {/* Price in INR */}
              <div className="py-3 px-4 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#6B6259] block font-medium">
                    Price
                  </span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1916]">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[11px] text-[#6B6259]">All taxes included</span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1E1916]">
                  About This Hamper
                </h4>
                <p className="text-xs text-[#6B6259] leading-relaxed">
                  {product.description || 'Artisanal gift hamper prepared with traditional care and quality provisions.'}
                </p>
              </div>

              {/* Pan-India Shipping Notice */}
              <div className="p-3 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-xs space-y-1.5">
                <div className="flex items-center space-x-2 text-[#9E331E] font-medium">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Pan-India Delivery</span>
                </div>
                <p className="text-[11px] text-[#6B6259] leading-relaxed">
                  • Complimentary delivery on orders above <strong>₹2,999</strong> (Standard <strong>₹199</strong>).
                  <br />
                  • Carefully packaged and dispatched across all Indian cities and towns.
                </p>
              </div>

              {/* Stock status */}
              <div className="flex items-center space-x-2 text-xs">
                {isOutOfStock ? (
                  <span className="text-[#9E331E] font-medium">Currently Sold Out</span>
                ) : (
                  <span className="flex items-center space-x-1.5 text-[#3D5A3C] font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>In Stock ({product.stock} hampers available)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-[#E5DEC9] flex items-center space-x-3">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                disabled={isOutOfStock}
                className={`flex-1 py-3 rounded-md font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 shadow-xs ${
                  isOutOfStock
                    ? 'bg-[#E5DEC9] text-[#6B6259] cursor-not-allowed'
                    : 'bg-[#9E331E] hover:bg-[#842917] text-[#FCFBF8] active:scale-98'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
