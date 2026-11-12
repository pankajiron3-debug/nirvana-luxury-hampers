import React from 'react';
import { Crown, LayoutDashboard, ShoppingBag, Plus, Sparkles, Database } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, onOpenCreateModal, isOnline = true }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0A0D14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('storefront')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 p-[1px] shadow-lg shadow-gold-500/20">
              <div className="w-full h-full bg-[#0E131F] rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl tracking-wider font-semibold bg-gradient-to-r from-white via-slate-100 to-gold-200 bg-clip-text text-transparent">
                  NIRVANA
                </span>
                <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 uppercase">
                  Luxe
                </span>
              </div>
              <p className="text-[11px] tracking-widest uppercase text-slate-400 font-medium">
                Luxury Curated Hampers
              </p>
            </div>
          </div>

          {/* Navigation Switcher */}
          <div className="flex items-center space-x-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'storefront'
                  ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Storefront</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          </div>

          {/* Action Area & Status */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>API Gateway: Active</span>
            </div>

            <button
              onClick={onOpenCreateModal}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-gold-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Hamper</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
