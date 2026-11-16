import React, { useState, useEffect, useCallback } from 'react';
import {
  Boxes,
  PackageCheck,
  AlertOctagon,
  CircleDollarSign,
  Search,
  RefreshCw,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productApi } from '../api/client';
import StatCard from '../components/StatCard';
import ProductTable from '../components/ProductTable';
import ProductModal from '../components/ProductModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { StatCardSkeleton, TableSkeleton } from '../components/SkeletonLoaders';

const CATEGORIES = [
  'All',
  'Royal Hampers',
  'Gourmet & Truffle',
  'Champagne & Wine',
  'Spa & Wellness',
  'Artisanal Sweets',
  'Corporate Luxe',
];

const AdminDashboard = ({ isModalOpen, setIsModalOpen }) => {
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockStatus, setStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Modal states
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [prodRes, anaRes] = await Promise.all([
        productApi.getProducts({
          search,
          category: selectedCategory,
          stockStatus,
          sortBy,
          order,
          limit: 50,
        }),
        productApi.getAnalytics(),
      ]);

      if (prodRes?.success) {
        setProducts(prodRes.products || []);
      }
      if (anaRes?.success) {
        setAnalytics(anaRes.analytics);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load inventory data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedCategory, stockStatus, sortBy, order]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle Sort Change
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('desc');
    }
  };

  // Handle Create or Update Submit
  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingProduct) {
        const res = await productApi.updateProduct(editingProduct._id, formData);
        toast.success(`Updated "${res.product?.name || 'Hamper'}" successfully!`);
      } else {
        const res = await productApi.createProduct(formData);
        toast.success(`"${res.product?.name || 'Hamper'}" added to catalogue.`);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchDashboardData(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving hamper.';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setActionLoading(true);
    try {
      await productApi.deleteProduct(deletingProduct._id);
      toast.success('Hamper removed from catalogue.');
      setDeletingProduct(null);
      fetchDashboardData(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove hamper.';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5DEC9]">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1E1916] tracking-tight">
            Store Inventory
          </h1>
          <p className="text-sm text-[#6B6259] mt-1 font-normal">
            Manage hamper stock, pricing, and catalogue availability.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-md bg-[#FCFBF8] border border-[#E5DEC9] text-[#6B6259] hover:text-[#1E1916] text-xs font-medium tracking-wide transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#9E331E]' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Stock'}</span>
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#9E331E] hover:bg-[#842917] text-[#FCFBF8] text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Hamper</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading && !analytics ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Hampers"
              value={analytics?.totalProducts || products.length}
              subtitle="Active hampers in catalogue"
              icon={Boxes}
              trend="Catalogue"
              colorScheme="terracotta"
            />
            <StatCard
              title="Total Stock Value"
              value={`₹${(analytics?.totalInventoryValue || 0).toLocaleString('en-IN')}`}
              subtitle="Current retail inventory value"
              icon={CircleDollarSign}
              trend="In Stock"
              colorScheme="olive"
            />
            <StatCard
              title="Out of Stock"
              value={analytics?.outOfStockCount || 0}
              subtitle="Awaiting restocking"
              icon={AlertOctagon}
              trend={analytics?.outOfStockCount > 0 ? 'Restock Needed' : 'All Available'}
              colorScheme="taupe"
            />
            <StatCard
              title="Average Hamper Price"
              value={`₹${Math.round(analytics?.averageProductPrice || 0).toLocaleString('en-IN')}`}
              subtitle="Average hamper price"
              icon={PackageCheck}
              trend="Catalogue Avg"
              colorScheme="neutral"
            />
          </>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-md bg-[#FCFBF8] border border-[#E5DEC9] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#6B6259] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by hamper title or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#1E1916] placeholder-[#A59D94] focus:outline-none focus:border-[#9E331E] transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#1E1916] focus:outline-none focus:border-[#9E331E] transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Collections' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="md:col-span-2">
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#1E1916] focus:outline-none focus:border-[#9E331E] transition-colors"
            >
              <option value="all">All Inventory</option>
              <option value="inStock">In Stock Only</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#1E1916] focus:outline-none focus:border-[#9E331E] transition-colors"
            >
              <option value="createdAt">Sort: Newest</option>
              <option value="price">Sort: Price</option>
              <option value="stock">Sort: Stock</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Data Table */}
      <div className="rounded-md bg-[#FCFBF8] border border-[#E5DEC9] overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E5DEC9] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1E1916]">
              All Hampers
            </h3>
            <p className="text-xs text-[#6B6259] mt-0.5">
              Showing {products.length} {products.length === 1 ? 'hamper' : 'hampers'} in catalogue
            </p>
          </div>
          <span className="text-xs font-sans text-[#6B6259] bg-[#F7F3EB] border border-[#E5DEC9] px-3 py-1 rounded-sm">
            {products.length} Items Total
          </span>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <ProductTable
            products={products}
            sortBy={sortBy}
            order={order}
            onSort={handleSort}
            onEdit={(product) => {
              setEditingProduct(product);
              setIsModalOpen(true);
            }}
            onDelete={(product) => {
              setDeletingProduct(product);
            }}
          />
        )}
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        isLoading={actionLoading}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        product={deletingProduct}
        isLoading={actionLoading}
      />

    </div>
  );
};

export default AdminDashboard;
