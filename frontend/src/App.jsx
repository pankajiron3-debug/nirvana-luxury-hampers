import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Storefront from './pages/Storefront';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ProductDetailModal from './components/ProductDetailModal';
import { productApi } from './api/client';
import toast from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('storefront');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Cart & Checkout States
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);

  const handleGlobalCreate = async (formData) => {
    setModalLoading(true);
    try {
      const res = await productApi.createProduct(formData);
      toast.success(`"${res.product?.name || 'Hamper'}" added to catalogue.`);
      setIsModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error creating hamper.';
      toast.error(msg);
    } finally {
      setModalLoading(false);
    }
  };

  // Cart Operations
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product._id === product._id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevItems, { product, quantity }];
    });

    toast.success(`Added "${product.name}" to cart.`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product._id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
    toast.success('Hamper removed from cart.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EB] text-[#1E1916] font-sans selection:bg-[#9E331E]/20 selection:text-[#9E331E]">
      
      {/* Toast Notification Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#FCFBF8',
            color: '#1E1916',
            border: '1px solid #E5DEC9',
            borderRadius: '6px',
            padding: '12px 18px',
            fontSize: '13px',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            boxShadow: '0 4px 14px -2px rgba(30, 25, 22, 0.08)',
          },
          success: {
            iconTheme: {
              primary: '#3D5A3C',
              secondary: '#FCFBF8',
            },
          },
          error: {
            iconTheme: {
              primary: '#9E331E',
              secondary: '#FCFBF8',
            },
          },
        }}
      />

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsModalOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'dashboard' ? (
          <AdminDashboard
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <Storefront
            onAddToCart={handleAddToCart}
            onViewDetails={(product) => setSelectedDetailProduct(product)}
          />
        )}
      </main>

      {/* Quick Add Modal */}
      <ProductModal
        isOpen={isModalOpen && activeTab !== 'dashboard'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGlobalCreate}
        isLoading={modalLoading}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Razorpay Checkout & Shipping Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onClearCart={handleClearCart}
      />

      {/* Product Details Modal */}
      <ProductDetailModal
        isOpen={Boolean(selectedDetailProduct)}
        onClose={() => setSelectedDetailProduct(null)}
        product={selectedDetailProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-[#E5DEC9] bg-[#FCFBF8] py-10 text-center text-xs text-[#6B6259]">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-serif text-sm tracking-widest uppercase text-[#1E1916] font-semibold">
            NIRVANA LUXURY HAMPERS · HANDCRAFTED GIFTS & HAMPERS
          </p>
          <p className="max-w-xl mx-auto leading-relaxed">
            Thoughtfully curated festive hampers, artisanal delicacies, and celebratory collections dispatched across India. Complimentary delivery on orders above ₹2,999.
          </p>
          <p className="text-[11px] text-[#8E857C] pt-2 border-t border-[#E5DEC9]/60 max-w-sm mx-auto">
            © {new Date().getFullYear()} Nirvana Luxury Hampers. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
