# Nirvana Luxury Hampers — Full-Stack Commerce & Inventory Management Suite

> **Internship Capstone Project**  
> **Role:** Solo Web & Software Developer Intern  
> **Domain:** Luxury E-Commerce, High-Performance Backend APIs, SaaS Inventory Operations

---

## 🌟 Executive Summary

**Nirvana Luxury Hampers** is an enterprise-grade full-stack platform built for luxury gifting, bespoke celebrations, and commercial inventory operations. Developed to demonstrate high-level engineering maturity, database optimization, and modern aesthetic SaaS user experience.

### Key Highlights:
1. **Database Optimization with MongoDB Aggregation Pipelines**:
   - Replaced naive query chains with an advanced single-trip `$facet` pipeline handling dynamic regex searching, multi-field filtering, dynamic sorting, and indexed pagination.
   - Built a comprehensive analytics pipeline computing **Total Inventory Valuation**, **Out of Stock counts**, and **Low Stock thresholds** at the database layer using `$group` and conditional `$cond` aggregations.
2. **Resilient Production-Grade Backend**:
   - Strict MVC architecture with dedicated controllers, routes, Mongoose models, and centralized error handling middleware.
   - Zero-crash guarantee with strict `try-catch` blocks, Mongoose CastError/ValidationError interceptors, and an automatic in-memory fallback store if MongoDB is offline during initial preview.
3. **High-End Luxury SaaS UI/UX**:
   - Dark luxury aesthetic with gilded gold accents, glassmorphic surfaces, and Playfair Display typography.
   - Animated shimmer **Skeleton Loaders** for zero layout shift during asynchronous data fetching.
   - Real-time **React Hot Toast** notifications for every state change (creation, edits, deletions, stock alerts).
   - Minimalist customer-facing **Storefront** alongside an executive **Admin Inventory Console**.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express.js (ES Modules), MongoDB, Mongoose ODM, Morgan, CORS, Dotenv |
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, Lucide React, React Hot Toast |
| **Database** | MongoDB with compound text indexes and Aggregation Pipelines |

```
nirvana-luxury-hampers/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & connection retry logic
│   ├── controllers/
│   │   └── productController.js  # Aggregation pipelines & CRUD business logic
│   ├── middlewares/
│   │   └── errorMiddleware.js    # Not-Found & Global Error Interceptor (Cast, Validation, E11000)
│   ├── models/
│   │   └── Product.js            # Product schema with pre-save SKU hook & text indexes
│   ├── routes/
│   │   └── productRoutes.js      # RESTful route definitions
│   ├── utils/
│   │   └── seeder.js             # High-end sample catalog data seeder
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Express server gateway
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Axios HTTP client
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar & global actions
│   │   │   ├── StatCard.jsx      # Top summary analytics cards
│   │   │   ├── ProductTable.jsx  # Inventory data table with badges & actions
│   │   │   ├── ProductCard.jsx   # Minimalist customer luxury storefront card
│   │   │   ├── ProductModal.jsx  # Add & Edit modal with instant validation
│   │   │   ├── DeleteConfirmModal.jsx # Deletion confirmation dialog
│   │   │   └── SkeletonLoaders.jsx    # Shimmer loaders for tables & cards
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx# Analytics and inventory control panel
│   │   │   └── Storefront.jsx    # Customer luxury storefront grid
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css             # Tailwind base & custom luxury gradients
│   ├── tailwind.config.js        # Custom luxury gold palette
│   ├── vite.config.js            # Vite build & proxy configuration
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Run Commands

### 1. Backend Setup

Open a terminal and execute:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# (Optional) Seed initial luxury hamper catalogue into MongoDB
npm run seed

# Start backend server
npm start
```
*Backend runs on: `http://localhost:5000`*

### 2. Frontend Setup

Open a second terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 💎 API Specification

### 1. `GET /api/products` (Optimized with `$facet` Pipeline)
Query Parameters:
- `search`: Searches across `name`, `sku`, and `description`.
- `category`: Filters by luxury category (e.g., `Royal Hampers`, `Gourmet & Truffle`).
- `stockStatus`: `all` | `inStock` | `outOfStock`.
- `sortBy`: `createdAt` | `price` | `stock` | `name`.
- `order`: `asc` | `desc`.
- `page`: Page index (default: `1`).
- `limit`: Number of records (default: `10`).

### 2. `GET /api/products/analytics` (Aggregation Metrics)
Returns aggregated financial and inventory metrics:
```json
{
  "success": true,
  "analytics": {
    "totalProducts": 18,
    "outOfStockCount": 2,
    "lowStockCount": 3,
    "totalInventoryValue": 48250,
    "averageProductPrice": 385.50
  }
}
```

### 3. CRUD Endpoints
- `POST /api/products`: Create a new hamper.
- `GET /api/products/:id`: Fetch single product by ID.
- `PUT /api/products/:id`: Update price, stock, description, or category.
- `DELETE /api/products/:id`: Safely remove a hamper from catalogue.
