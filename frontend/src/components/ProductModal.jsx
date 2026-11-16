import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';

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
    if (!formData.name.trim()) errors.name = 'Hamper title is required';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-md bg-[#FCFBF8] border border-[#E5DEC9] shadow-modal overflow-hidden animate-in fade-in zoom-in-98 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5DEC9] bg-[#F7F3EB]/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-md bg-[#F7F3EB] text-[#9E331E] border border-[#E5DEC9]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E1916]">
                {initialData ? 'Edit Hamper Details' : 'Add New Hamper'}
              </h3>
              <p className="text-xs text-[#6B6259]">
                {initialData ? 'Update hamper stock, pricing, and description' : 'Enter hamper details to publish to the store inventory'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Hamper Title */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
              Hamper Title <span className="text-[#9E331E]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Royal Saffron & Dry Fruit Trunk"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-md bg-[#F7F3EB] border text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors ${
                formErrors.name ? 'border-[#9E331E]' : 'border-[#E5DEC9]'
              }`}
            />
            {formErrors.name && (
              <p className="text-[#9E331E] text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Grid: Category, Price, Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                Category <span className="text-[#9E331E]">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#1E1916] focus:outline-none focus:border-[#9E331E] transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                Price (₹ INR) <span className="text-[#9E331E]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-[#6B6259] text-xs">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="3499"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full pl-7 pr-3 py-2 rounded-md bg-[#F7F3EB] border text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors ${
                    formErrors.price ? 'border-[#9E331E]' : 'border-[#E5DEC9]'
                  }`}
                />
              </div>
              {formErrors.price && (
                <p className="text-[#9E331E] text-xs mt-1">{formErrors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
                Available Stock <span className="text-[#9E331E]">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="15"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={`w-full px-3 py-2 rounded-md bg-[#F7F3EB] border text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors ${
                  formErrors.stock ? 'border-[#9E331E]' : 'border-[#E5DEC9]'
                }`}
              />
              {formErrors.stock && (
                <p className="text-[#9E331E] text-xs mt-1">{formErrors.stock}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
              Hamper Image Link
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="flex-1 px-3.5 py-2 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors"
              />
              {formData.imageUrl && (
                <div className="w-10 h-10 rounded-sm overflow-hidden bg-[#F7F3EB] border border-[#E5DEC9] shrink-0">
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
            <p className="text-[11px] text-[#6B6259] mt-1">Direct photograph link representing the curated gift package.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#1E1916] mb-1.5">
              Hamper Description & Contents
            </label>
            <textarea
              rows="3"
              placeholder="Detail the handcrafted delicacies, confections, packaging, or festive accompaniments included..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors resize-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#E5DEC9] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-[#E5DEC9] text-[#6B6259] hover:bg-[#E5DEC9]/50 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-md bg-[#9E331E] hover:bg-[#842917] text-[#FCFBF8] font-medium text-xs uppercase tracking-wider transition-colors shadow-xs disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              <span>{initialData ? 'Save Changes' : 'Add Hamper'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProductModal;
