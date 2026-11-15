import React from 'react';
import { Edit2, Trash2, ArrowUpDown, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  sortBy,
  order,
  onSort,
}) => {
  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="w-3.5 h-3.5" />
          Out of Stock
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertCircle className="w-3.5 h-3.5" />
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5" />
        In Stock ({stock})
      </span>
    );
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Royal Hampers':
        return 'bg-gold-500/10 text-gold-300 border-gold-500/30';
      case 'Gourmet & Truffle':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Champagne & Wine':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Spa & Wellness':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Artisanal Sweets':
        return 'bg-pink-500/10 text-pink-300 border-pink-500/30';
      default:
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
            <th className="py-4 px-6">Hamper Item</th>
            <th className="py-4 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => onSort('category')}>
              <div className="flex items-center space-x-1">
                <span>Category</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </th>
            <th className="py-4 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => onSort('price')}>
              <div className="flex items-center space-x-1">
                <span>Price (₹ INR)</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </th>
            <th className="py-4 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => onSort('stock')}>
              <div className="flex items-center space-x-1">
                <span>Inventory Status</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </th>
            <th className="py-4 px-4">Valuation</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-12 text-center text-slate-400">
                <p className="text-base font-serif text-slate-300">No luxury hampers found</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or click "Add Hamper" to add one.</p>
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const valuation = product.totalValuation !== undefined
                ? product.totalValuation
                : product.price * product.stock;

              return (
                <tr
                  key={product._id}
                  className="hover:bg-slate-900/40 transition-colors group"
                >
                  {/* Item Image + Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-100 group-hover:text-gold-300 transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {product.sku || 'NLH-ITEM'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${getCategoryBadgeClass(
                        product.category
                      )}`}
                    >
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 font-mono font-semibold text-slate-100">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </td>

                  {/* Stock Status */}
                  <td className="py-4 px-4">
                    {getStockBadge(product.stock)}
                  </td>

                  {/* Total Valuation */}
                  <td className="py-4 px-4 font-mono text-slate-300 text-xs">
                    ₹{Number(valuation).toLocaleString('en-IN')}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
                        title="Edit Hamper"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Hamper"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
