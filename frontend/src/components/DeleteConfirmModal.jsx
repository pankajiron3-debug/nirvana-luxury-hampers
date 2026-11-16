import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, product, isLoading }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-md bg-[#FCFBF8] border border-[#E5DEC9] shadow-modal p-6 animate-in fade-in zoom-in-98 duration-150">
        <div className="flex items-center space-x-3 text-[#9E331E] mb-4">
          <div className="p-2 rounded-md bg-[#F9EFEB] border border-[#D8988B]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1E1916]">Remove From Catalogue</h3>
        </div>

        <p className="text-xs text-[#6B6259] leading-relaxed">
          Are you sure you want to remove <strong className="text-[#1E1916]">"{product.name}"</strong>?
          This will permanently remove the hamper from the store inventory.
        </p>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md border border-[#E5DEC9] text-[#6B6259] hover:bg-[#E5DEC9]/40 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-[#9E331E] hover:bg-[#842917] text-[#FCFBF8] font-medium text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center space-x-2"
          >
            {isLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            <span>Confirm Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
