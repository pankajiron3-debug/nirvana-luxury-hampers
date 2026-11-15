import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, DollarSign, Package, Tag, FileText } from 'lucide-react';

const CATEGORIES = [
  'Royal Hampers',
  'Gourmet & Truffle',
  'Champagne & Wine',
  'Spa & Wellness',
  'Artisanal Sweets',
  'Corporate Luxe',
];

const ProductModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Royal Hampers',
    imageUrl: '',
    description: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price !== undefined ? initialData.price : '',
        stock: initialData.stock !== undefined ? initialData.stock : '',
        category: initialData.category || 'Royal Hampers',
        imageUrl: initialData.imageUrl || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: 'Royal Hampers',
        imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
        description: '',
      });
    }
    setFormErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Hamper name is required';
    if (formData.price === '' || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errors.price = 'Valid price is required';
    }
    if (formData.stock === '' || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      errors.stock = 'Valid stock count is required';
    }
    if (!formData.category) errors.category = 'Category is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {initialData ? 'Refine Luxury Hamper' : 'Curate New Luxury Hamper'}
              </h3>
              <p className="text-xs text-slate-400">
                {initialData ? 'Update pricing, inventory, and presentation' : 'Add an exclusive hamper to your collection catalogue'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Hamper Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Hamper Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sovereign Reserve Champagne Box"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all ${
                formErrors.name ? 'border-rose-500' : 'border-slate-800'
              }`}
            />
            {formErrors.name && (
              <p className="text-rose-400 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Grid: Category & Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Price (₹ INR) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="4999"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                    formErrors.price ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
              </div>
              {formErrors.price && (
                <p className="text-rose-400 text-xs mt-1">{formErrors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Inventory Stock <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="10"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                  formErrors.stock ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {formErrors.stock && (
                <p className="text-rose-400 text-xs mt-1">{formErrors.stock}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Curated Image URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              />
              {formData.imageUrl && (
                <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">High-resolution photographic link representing the gift package.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Artisanal Description
            </label>
            <textarea
              rows="3"
              placeholder="Outline the rare provisions, vintage bottles, packaging materials, or unboxing experience..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 resize-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800/60 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>}
              <span>{initialData ? 'Save Changes' : 'Publish Hamper'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProductModal;
