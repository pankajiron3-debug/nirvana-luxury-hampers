import React, { useState, useEffect, useCallback } from 'react';
import {
  Boxes,
  PackageCheck,
  AlertOctagon,
  CircleDollarSign,
  Search,
  Filter,
  RefreshCw,
  Plus,
  SlidersHorizontal,
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
      toast.error('Failed to sync catalogue data. Check API gateway status.');
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
        toast.success(`Curated "${res.product?.name || 'Hamper'}" successfully!`);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchDashboardData(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error processing request.';
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
      toast.success('Hamper permanently removed from catalogue.');
      setDeletingProduct(null);
      fetchDashboardData(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete hamper.';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            Inventory & Asset Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time pipeline analytics, stock levels, and luxury valuation.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold tracking-wide transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-gold-400' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Pipeline'}</span>
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-gold-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
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
              title="Total Catalog Hampers"
              value={analytics?.totalProducts || products.length}
              subtitle="Active SKUs in catalogue"
              icon={Boxes}
              trend="+12% this month"
              colorScheme="gold"
            />
            <StatCard
              title="Total Inventory Value"
              value={`$${(analytics?.totalInventoryValue || 0).toLocaleString()}`}
              subtitle="Calculated at wholesale asset value"
              icon={CircleDollarSign}
              trend="Optimized"
              colorScheme="emerald"
            />
            <StatCard
              title="Out of Stock Hampers"
              value={analytics?.outOfStockCount || 0}
              subtitle="Requires immediate procurement"
              icon={AlertOctagon}
              trend={analytics?.outOfStockCount > 0 ? 'Action Needed' : 'Good'}
              colorScheme="rose"
            />
            <StatCard
              title="Average Hamper Value"
              value={`$${(analytics?.averageProductPrice || 0).toLocaleString()}`}
              subtitle="Mean luxury customer basket"
              icon={PackageCheck}
              trend="Premium Tier"
              colorScheme="blue"
            />
          </>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Hamper Title, SKU, or Description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Luxury Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="md:col-span-2">
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
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
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            >
              <option value="createdAt">Sort: Recency</option>
              <option value="price">Sort: Price</option>
              <option value="stock">Sort: Stock</option>
              <option value="name">Sort: Title</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Data Table */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950 border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Catalogue Registry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {products.length} products optimized via MongoDB aggregation pipeline.
            </p>
          </div>
          <span className="text-xs font-mono text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3 py-1 rounded-full">
            Pipeline: $facet + $match + $sort
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
