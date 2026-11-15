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
      toast.success(`Curated "${res.product?.name || 'Hamper'}" successfully!`);
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

    toast.success(`Added "${product.name}" to luxury cart!`, {
      icon: '💎',
      style: {
        background: '#0F172A',
        color: '#F8FAFC',
        border: '1px solid rgba(197, 160, 89, 0.4)',
      },
    });
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
    <div className="min-h-screen flex flex-col bg-[#0A0D14] text-slate-100 font-sans selection:bg-gold-500/30 selection:text-gold-200">
      
      {/* Toast Notification Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0F172A',
            color: '#F8FAFC',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            padding: '12px 16px',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#C5A059',
              secondary: '#0F172A',
            },
          },
          error: {
            iconTheme: {
              primary: '#F43F5E',
              secondary: '#0F172A',
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

      {/* Global Quick Add Modal */}
      <ProductModal
        isOpen={isModalOpen && activeTab !== 'dashboard'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGlobalCreate}
        isLoading={modalLoading}
      />

      {/* Luxury Cart Drawer (₹ INR & Indian Shipping Threshold) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Indian Checkout & Shipping Modal (PIN Code, Indian Metros, UPI/NetBanking) */}
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

      {/* Luxury Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-serif tracking-wider text-slate-400">
            NIRVANA LUXURY HAMPERS · BESPOKE COMMERCE PLATFORM (₹ INR)
          </p>
          <p>
            Full-Stack Internship Portfolio Project · Indian Localization Edition · Free Delivery Above ₹2,999 · Node.js, Express, MongoDB Aggregations, React & Tailwind CSS
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
