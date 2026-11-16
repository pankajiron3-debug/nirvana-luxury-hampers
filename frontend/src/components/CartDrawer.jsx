import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck } from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_SHIPPING_FEE = 199;

const CartDrawer = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#FCFBF8] border-l border-[#E5DEC9] shadow-modal flex flex-col h-full animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E5DEC9] flex items-center justify-between bg-[#F7F3EB]/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-md bg-[#F7F3EB] text-[#9E331E] border border-[#E5DEC9]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1E1916]">
                Shopping Cart
              </h2>
              <p className="text-xs text-[#6B6259]">
                {items.length} {items.length === 1 ? 'Hamper selected' : 'Hampers selected'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-[#6B6259] hover:text-[#1E1916] hover:bg-[#E5DEC9]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3.5 bg-[#F7F3EB] border-b border-[#E5DEC9]">
          <div className="flex items-center space-x-2 text-xs font-medium mb-1.5">
            <Truck className="w-4 h-4 text-[#9E331E] shrink-0" />
            {isFreeShipping ? (
              <span className="text-[#3D5A3C]">
                Free delivery applied across India!
              </span>
            ) : (
              <span className="text-[#6B6259]">
                Add <strong className="text-[#1E1916]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong className="text-[#1E1916]">Free Delivery</strong>
              </span>
            )}
          </div>
          <div className="w-full h-1 bg-[#E5DEC9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#9E331E] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F7F3EB] border border-[#E5DEC9] flex items-center justify-center text-[#6B6259]">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#1E1916]">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#6B6259] max-w-xs leading-relaxed">
                  Explore our handcrafted hampers and artisanal collections to add gifts to your cart.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 rounded-md bg-[#9E331E] hover:bg-[#842917] text-[#FCFBF8] font-medium text-xs tracking-wider uppercase transition-colors"
              >
                Browse Hampers
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="p-3.5 rounded-md bg-[#FCFBF8] border border-[#E5DEC9] flex space-x-3.5 group hover:border-[#9E331E]/40 transition-colors"
              >
                {/* Product Thumbnail */}
                <div className="w-18 h-18 w-20 h-20 rounded-sm overflow-hidden bg-[#F7F3EB] border border-[#E5DEC9] shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                </div>

                {/* Details & Controls */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-sm font-bold text-[#1E1916] truncate group-hover:text-[#9E331E] transition-colors">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product._id)}
                        className="text-[#6B6259] hover:text-[#9E331E] p-1 transition-colors"
                        title="Remove hamper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-[#6B6259] uppercase tracking-wider block mt-0.5">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E5DEC9]">
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2 bg-[#F7F3EB] rounded-sm border border-[#E5DEC9] px-2 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(product._id, -1)}
                        className="text-[#6B6259] hover:text-[#1E1916] p-0.5"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-sans font-medium text-[#1E1916] min-w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product._id, 1)}
                        className="text-[#6B6259] hover:text-[#1E1916] p-0.5"
                        disabled={product.stock > 0 && quantity >= product.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price in INR */}
                    <div className="text-right">
                      <span className="text-sm font-serif font-bold text-[#1E1916]">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                      {quantity > 1 && (
                        <span className="text-[10px] text-[#6B6259] block">
                          ₹{Number(product.price).toLocaleString('en-IN')} each
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary & Checkout Action */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#E5DEC9] bg-[#F7F3EB] space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#6B6259]">
                <span>Subtotal</span>
                <span className="text-[#1E1916] font-medium">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#6B6259]">
                <span>Delivery across India</span>
                <span className={isFreeShipping ? 'text-[#3D5A3C] font-semibold' : 'text-[#1E1916]'}>
                  {isFreeShipping ? 'FREE' : `₹${STANDARD_SHIPPING_FEE}`}
                </span>
              </div>
              <div className="flex justify-between text-[#6B6259]">
                <span>Taxes</span>
                <span>All GST Included</span>
              </div>
              <div className="pt-2 border-t border-[#E5DEC9] flex justify-between items-baseline">
                <span className="text-sm font-serif font-bold text-[#1E1916] uppercase tracking-wider">
                  Total
                </span>
                <span className="text-xl font-serif font-bold text-[#9E331E]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 rounded-md bg-[#9E331E] hover:bg-[#842917] text-[#FCFBF8] font-medium text-xs tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center space-x-2 active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-[11px] text-center text-[#8E857C]">
              Festive box packaging included with every order
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
