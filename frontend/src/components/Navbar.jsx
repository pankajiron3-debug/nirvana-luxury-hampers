import React from 'react';
import { LayoutDashboard, ShoppingBag, Plus, Truck } from 'lucide-react';

const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  cartCount = 0,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5DEC9] bg-[#FCFBF8]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('storefront')}
          >
            <div className="w-10 h-10 rounded-md bg-[#9E331E] text-[#FCFBF8] flex items-center justify-center font-serif text-xl font-bold tracking-wider shadow-sm">
              N
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif text-2xl tracking-widest font-semibold text-[#1E1916]">
                  NIRVANA
                </span>
                <span className="text-[10px] font-sans font-semibold tracking-widest px-2 py-0.5 rounded-sm bg-[#F7F3EB] text-[#6B6259] border border-[#E5DEC9] uppercase">
                  Hampers
                </span>
              </div>
              <p className="text-[11px] font-sans tracking-wider uppercase text-[#6B6259] font-medium">
                Handcrafted Festive & Luxury Gifting
              </p>
            </div>
          </div>

          {/* Navigation Switcher */}
          <div className="flex items-center space-x-1 p-1 bg-[#F7F3EB] border border-[#E5DEC9] rounded-md">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-sm text-xs font-medium tracking-wide transition-all duration-150 ${
                activeTab === 'storefront'
                  ? 'bg-[#FCFBF8] text-[#1E1916] shadow-sm font-semibold border border-[#E5DEC9]'
                  : 'text-[#6B6259] hover:text-[#1E1916]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-sm text-xs font-medium tracking-wide transition-all duration-150 ${
                activeTab === 'dashboard'
                  ? 'bg-[#FCFBF8] text-[#1E1916] shadow-sm font-semibold border border-[#E5DEC9]'
                  : 'text-[#6B6259] hover:text-[#1E1916]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Store Inventory</span>
            </button>
          </div>

          {/* Action Area & Status */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Pan-India Delivery (Replaces API Gateway) */}
            <div className="hidden lg:flex items-center space-x-2 text-xs font-sans px-3 py-1.5 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-[#6B6259]">
              <Truck className="w-3.5 h-3.5 text-[#9E331E]" />
              <span className="font-medium text-[#1E1916]">Pan-India Delivery</span>
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-md bg-[#FCFBF8] border border-[#E5DEC9] text-[#1E1916] hover:border-[#9E331E] transition-colors shadow-sm group"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#1E1916] group-hover:text-[#9E331E] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#9E331E] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Add Hamper Button */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-md bg-[#9E331E] hover:bg-[#842917] text-[#FCFBF8] font-medium text-xs tracking-wider uppercase transition-colors shadow-sm active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Hamper</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
