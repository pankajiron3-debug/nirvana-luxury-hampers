import React from 'react';
import { Edit2, Trash2, ArrowUpDown, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-medium bg-[#F9EFEB] text-[#9E331E] border border-[#D8988B]">
          <XCircle className="w-3.5 h-3.5" />
          Out of Stock
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-medium bg-[#FFF8E7] text-[#8C5D00] border border-[#F0D597]">
          <AlertCircle className="w-3.5 h-3.5" />
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-medium bg-[#EBF2EB] text-[#3D5A3C] border border-[#C3D6C2]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        In Stock ({stock})
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[#E5DEC9] bg-[#F7F3EB] text-[#6B6259] uppercase text-[11px] font-medium tracking-wider">
            <th className="py-3 px-5">Hamper</th>
            <th className="py-3 px-4 cursor-pointer hover:text-[#1E1916] transition-colors" onClick={() => onSort('category')}>
              <div className="flex items-center space-x-1">
                <span>Category</span>
                <ArrowUpDown className="w-3 h-3 text-[#A59D94]" />
              </div>
            </th>
            <th className="py-3 px-4 cursor-pointer hover:text-[#1E1916] transition-colors" onClick={() => onSort('price')}>
              <div className="flex items-center space-x-1">
                <span>Price (₹ INR)</span>
                <ArrowUpDown className="w-3 h-3 text-[#A59D94]" />
              </div>
            </th>
            <th className="py-3 px-4 cursor-pointer hover:text-[#1E1916] transition-colors" onClick={() => onSort('stock')}>
              <div className="flex items-center space-x-1">
                <span>Stock Status</span>
                <ArrowUpDown className="w-3 h-3 text-[#A59D94]" />
              </div>
            </th>
            <th className="py-3 px-4">Inventory Value</th>
            <th className="py-3 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5DEC9]/80 bg-[#FCFBF8]">
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-12 text-center text-[#6B6259]">
                <p className="text-base font-serif text-[#1E1916]">No hampers found</p>
                <p className="text-xs text-[#6B6259] mt-1">Try adjusting your filters or click "New Hamper" to add one.</p>
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
                  className="hover:bg-[#F7F3EB]/50 transition-colors group"
                >
                  {/* Item Image + Name */}
                  <td className="py-3 px-5">
                    <div className="flex items-center space-x-3.5">
                      <div className="relative w-11 h-11 rounded-sm overflow-hidden bg-[#F7F3EB] border border-[#E5DEC9] shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#1E1916] group-hover:text-[#9E331E] transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="font-sans text-[10px] text-[#6B6259] bg-[#F7F3EB] px-1.5 py-0.2 rounded-sm border border-[#E5DEC9]">
                            {product.sku || 'NLH-ITEM'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 text-xs text-[#1E1916] bg-[#F7F3EB] border border-[#E5DEC9] rounded-sm">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-sans font-medium text-[#1E1916]">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </td>

                  {/* Stock Status */}
                  <td className="py-3 px-4">
                    {getStockBadge(product.stock)}
                  </td>

                  {/* Total Valuation */}
                  <td className="py-3 px-4 font-sans text-[#6B6259]">
                    ₹{Number(valuation).toLocaleString('en-IN')}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 rounded-sm text-[#6B6259] hover:text-[#1E1916] hover:bg-[#E5DEC9]/50 transition-colors"
                        title="Edit Hamper"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-1.5 rounded-sm text-[#6B6259] hover:text-[#9E331E] hover:bg-[#F9EFEB] transition-colors"
                        title="Delete Hamper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
