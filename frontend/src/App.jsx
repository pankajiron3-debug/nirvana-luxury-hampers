import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Storefront from './pages/Storefront';
import ProductModal from './components/ProductModal';
import { productApi } from './api/client';
import toast from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const handleGlobalCreate = async (formData) => {
    setModalLoading(true);
    try {
      const res = await productApi.createProduct(formData);
      toast.success(`Curated "${res.product?.name || 'Hamper'}" successfully!`);
      setIsModalOpen(false);
      // If we are currently in storefront, switch or let it reload
    } catch (err) {
      const msg = err.response?.data?.message || 'Error creating hamper.';
      toast.error(msg);
    } finally {
      setModalLoading(false);
    }
  };

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
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'dashboard' ? (
          <AdminDashboard
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <Storefront />
        )}
      </main>

      {/* Global Quick Add Modal */}
      <ProductModal
        isOpen={isModalOpen && activeTab !== 'dashboard'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGlobalCreate}
        isLoading={modalLoading}
      />

      {/* Luxury Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-serif tracking-wider text-slate-400">
            NIRVANA LUXURY HAMPERS · BESPOKE COMMERCE PLATFORM
          </p>
          <p>
            Full-Stack Internship Portfolio Project · Engineered with Node.js, Express, MongoDB Aggregations, React & Tailwind CSS
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
