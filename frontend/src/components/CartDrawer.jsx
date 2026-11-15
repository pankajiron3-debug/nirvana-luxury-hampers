import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Sparkles, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                Your Luxury Cart
              </h2>
              <p className="text-xs text-slate-400">
                {items.length} {items.length === 1 ? 'Hamper selected' : 'Hampers selected'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator (₹2,999 Threshold) */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-b border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs font-medium mb-1.5">
            <Truck className="w-4 h-4 text-gold-400 shrink-0" />
            {isFreeShipping ? (
              <span className="text-emerald-400">
                🎉 Congratulations! You have unlocked <strong className="text-emerald-300">FREE White-Glove Shipping</strong> across India!
              </span>
            ) : (
              <span className="text-slate-300">
                Add <strong className="text-gold-400">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong className="text-white">FREE Express Shipping</strong> (Standard ₹{STANDARD_SHIPPING_FEE})
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-amber-300 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-slate-300">
                  Your Bespoke Cart is Empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Explore our royal and gourmet collections to select artisanal handcrafted hampers.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-gold-500/20"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex space-x-3.5 group hover:border-slate-700 transition-all"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                </div>

                {/* Details & Controls */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-sm font-semibold text-white truncate group-hover:text-gold-300 transition-colors">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product._id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Remove hamper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] font-mono text-gold-400/90 uppercase tracking-wider block mt-0.5">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2 bg-slate-950 rounded-lg border border-slate-800 px-2 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(product._id, -1)}
                        className="text-slate-400 hover:text-white p-0.5"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold text-slate-100 min-w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product._id, 1)}
                        className="text-slate-400 hover:text-white p-0.5"
                        disabled={product.stock > 0 && quantity >= product.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price in INR */}
                    <div className="text-right">
                      <span className="text-sm font-serif font-bold text-white">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                      {quantity > 1 && (
                        <span className="text-[10px] text-slate-500 block">
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
          <div className="p-6 border-t border-slate-800 bg-slate-950/90 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200 font-mono font-semibold">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pan-India Luxury Shipping</span>
                <span className={isFreeShipping ? 'text-emerald-400 font-semibold' : 'text-slate-200 font-mono'}>
                  {isFreeShipping ? 'FREE' : `₹${STANDARD_SHIPPING_FEE}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Applicable Taxes</span>
                <span className="text-slate-400">Inclusive of all Indian GST</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-serif font-bold text-white uppercase tracking-wider">
                  Total (₹ INR)
                </span>
                <span className="text-xl font-serif font-bold text-gold-300">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-gold-500/20 active:scale-98 flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500/80" />
              <span>Complimentary bespoke gift packaging included</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
