import Product from '../models/Product.js';
import mongoose from 'mongoose';

// In-memory fallback dataset in case MongoDB is running in offline/disconnected mode
let memoryStore = [
  {
    _id: '660000000000000000000001',
    name: 'Sovereign Truffle & Reserve Box',
    sku: 'NLH-GOUR-A101',
    description: 'Imported artisanal truffles, aged balsamic reduction, and gold-leaf almond brittle in an embossed wooden case.',
    price: 6499,
    stock: 14,
    category: 'Gourmet & Truffle',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '660000000000000000000002',
    name: 'Imperial Heritage Grand Hamper',
    sku: 'NLH-ROYL-B202',
    description: 'Prestige vintage sparkling beverage, raw honeycomb, organic stoneground wafers, and hand-poured candle.',
    price: 9999,
    stock: 4,
    category: 'Royal Hampers',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '660000000000000000000003',
    name: 'Velvet Rose Spa Sanctuary',
    sku: 'NLH-WELL-C303',
    description: 'Mulberry silk eye mask, botanical bath salts, cold-pressed rosehip elixir, and organic aromatherapy mist.',
    price: 3999,
    stock: 0,
    category: 'Spa & Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '660000000000000000000004',
    name: 'Sommelier Reserve Duo Collection',
    sku: 'NLH-CHMP-D404',
    description: 'Pair of artisanal reserve vintages accompanied by smoked sea salt pecans and dark cacao medallions.',
    price: 8499,
    stock: 8,
    category: 'Champagne & Wine',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '660000000000000000000005',
    name: 'Artisan Praline Elegance Case',
    sku: 'NLH-SWET-E505',
    description: 'Twenty-four hand-painted single-origin cacao bonbons infused with Tahitian vanilla and lavender honey.',
    price: 2499,
    stock: 22,
    category: 'Artisanal Sweets',
    imageUrl: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '660000000000000000000006',
    name: 'Executive Premier Corporate Cask',
    sku: 'NLH-CORP-F606',
    description: 'Curated corporate gifting set with leather tech organizer, vacuum-insulated carafe, and single-estate roast coffee.',
    price: 5499,
    stock: 2,
    category: 'Corporate Luxe',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '660000000000000000000007',
    name: 'Golden Radiance Festive Chest',
    sku: 'NLH-ROYL-G707',
    description: 'Handcrafted gilded brass chest filled with saffron shortbread, cold-pressed macadamia butter, and rare flowering teas.',
    price: 12999,
    stock: 6,
    category: 'Royal Hampers',
    imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '660000000000000000000008',
    name: 'Royal Saffron Paneer & Kesari Trunk',
    sku: 'NLH-GOUR-H808',
    description: 'Charcoal-grilled saffron paneer tikka, velvety shahi paneer, aromatic kesari pulao, and mint chutney curated in a luxury keepsake trunk.',
    price: 14999,
    stock: 3,
    category: 'Gourmet & Truffle',
    imageUrl: '/veg-hamper.jpg',
    rating: 4.9,
    createdAt: new Date().toISOString(),
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc   Fetch all products with MongoDB Aggregation Pipeline (Optimized Search, Filter, Sort, Facet)
 * @route  GET /api/products
 * @access Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search = '',
      category = 'All',
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
      stockStatus = 'all'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;
    const sortDirection = order === 'asc' ? 1 : -1;

    if (!isDbConnected()) {
      // Memory store fallback
      let filtered = [...memoryStore];

      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.sku && p.sku.toLowerCase().includes(query))
        );
      }
      if (stockStatus === 'inStock') filtered = filtered.filter(p => p.stock > 0);
      if (stockStatus === 'outOfStock') filtered = filtered.filter(p => p.stock === 0);

      filtered.sort((a, b) => {
        if (sortBy === 'price') return (a.price - b.price) * sortDirection;
        if (sortBy === 'stock') return (a.stock - b.stock) * sortDirection;
        if (sortBy === 'name') return a.name.localeCompare(b.name) * sortDirection;
        return (new Date(b.createdAt) - new Date(a.createdAt)) * sortDirection;
      });

      const total = filtered.length;
      const paginated = filtered.slice(skip, skip + limitNum);

      return res.status(200).json({
        success: true,
        source: 'memory-fallback',
        pagination: {
          totalProducts: total,
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
        products: paginated,
      });
    }

    // High-Performance MongoDB Aggregation Pipeline
    const matchConditions = {};

    if (category && category !== 'All') {
      matchConditions.category = category;
    }

    if (search && search.trim() !== '') {
      matchConditions.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { sku: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (stockStatus === 'inStock') {
      matchConditions.stock = { $gt: 0 };
    } else if (stockStatus === 'outOfStock') {
      matchConditions.stock = { $eq: 0 };
    }

    const sortStage = {};
    if (sortBy === 'price') sortStage.price = sortDirection;
    else if (sortBy === 'stock') sortStage.stock = sortDirection;
    else if (sortBy === 'name') sortStage.name = sortDirection;
    else sortStage.createdAt = sortDirection;

    const pipeline = [
      { $match: matchConditions },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limitNum },
            {
              $project: {
                name: 1,
                sku: 1,
                price: 1,
                stock: 1,
                category: 1,
                imageUrl: 1,
                rating: 1,
                description: 1,
                createdAt: 1,
                totalValuation: { $multiply: ['$price', '$stock'] },
              },
            },
          ],
        },
      },
    ];

    const [result] = await Product.aggregate(pipeline);
    const totalCount = result?.metadata[0]?.total || 0;
    const products = result?.data || [];

    res.status(200).json({
      success: true,
      source: 'mongodb-aggregation',
      pagination: {
        totalProducts: totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
        limit: limitNum,
      },
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get High-level Analytics & Summary Metrics (Pipeline Optimization)
 * @route  GET /api/products/analytics
 * @access Public
 */
export const getAnalytics = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const total = memoryStore.length;
      const outOfStock = memoryStore.filter(p => p.stock === 0).length;
      const lowStock = memoryStore.filter(p => p.stock > 0 && p.stock <= 5).length;
      const totalValue = memoryStore.reduce((acc, p) => acc + (p.price * p.stock), 0);
      const avgPrice = total > 0 ? memoryStore.reduce((acc, p) => acc + p.price, 0) / total : 0;

      return res.status(200).json({
        success: true,
        source: 'memory-fallback',
        analytics: {
          totalProducts: total,
          outOfStockCount: outOfStock,
          lowStockCount: lowStock,
          totalInventoryValue: Math.round(totalValue),
          averageProductPrice: Math.round(avgPrice * 100) / 100,
        },
      });
    }

    const [summary] = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalInventoryValue: { $sum: { $multiply: ['$price', '$stock'] } },
          averageProductPrice: { $avg: '$price' },
          outOfStockCount: {
            $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] },
          },
          lowStockCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ['$stock', 0] },
                    { $lte: ['$stock', 5] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const analytics = summary || {
      totalProducts: 0,
      totalInventoryValue: 0,
      averageProductPrice: 0,
      outOfStockCount: 0,
      lowStockCount: 0,
    };

    res.status(200).json({
      success: true,
      source: 'mongodb-aggregation',
      analytics: {
        totalProducts: analytics.totalProducts || 0,
        outOfStockCount: analytics.outOfStockCount || 0,
        lowStockCount: analytics.lowStockCount || 0,
        totalInventoryValue: Math.round(analytics.totalInventoryValue || 0),
        averageProductPrice: Math.round((analytics.averageProductPrice || 0) * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single product by ID
 * @route  GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      const item = memoryStore.find(p => p._id.toString() === id);
      if (!item) {
        res.status(404);
        throw new Error('Product not found in catalogue.');
      }
      return res.status(200).json({ success: true, product: item });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Malformed Product ID requested.');
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found in catalogue.');
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new product in catalogue
 * @route  POST /api/products
 * @access Public/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, stock, category, imageUrl, description } = req.body;

    if (!name || name.trim() === '') {
      res.status(400);
      throw new Error('Hamper name is strictly required.');
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      res.status(400);
      throw new Error('Price must be a valid positive number.');
    }

    if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
      res.status(400);
      throw new Error('Stock must be a non-negative integer.');
    }

    if (!category) {
      res.status(400);
      throw new Error('A valid hamper category must be selected.');
    }

    const finalImageUrl = imageUrl && imageUrl.trim() !== ''
      ? imageUrl.trim()
      : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';

    if (!isDbConnected()) {
      const newProduct = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: name.trim(),
        sku: `NLH-${category.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        price: Number(price),
        stock: Number(stock),
        category: category.trim(),
        imageUrl: finalImageUrl,
        description: description || 'Curated luxury collection item for refined celebrations.',
        rating: 4.9,
        createdAt: new Date().toISOString(),
      };
      memoryStore.unshift(newProduct);

      return res.status(201).json({
        success: true,
        message: 'Luxury hamper created successfully (Active Memory Store)',
        product: newProduct,
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      category: category.trim(),
      imageUrl: finalImageUrl,
      description: description?.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Luxury hamper product created successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update product details
 * @route  PUT /api/products/:id
 * @access Public/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category, imageUrl, description } = req.body;

    if (!isDbConnected()) {
      const index = memoryStore.findIndex(p => p._id.toString() === id);
      if (index === -1) {
        res.status(404);
        throw new Error('Cannot update: Product not found.');
      }

      memoryStore[index] = {
        ...memoryStore[index],
        name: name !== undefined ? name.trim() : memoryStore[index].name,
        price: price !== undefined ? Number(price) : memoryStore[index].price,
        stock: stock !== undefined ? Number(stock) : memoryStore[index].stock,
        category: category !== undefined ? category.trim() : memoryStore[index].category,
        imageUrl: imageUrl !== undefined ? imageUrl.trim() : memoryStore[index].imageUrl,
        description: description !== undefined ? description.trim() : memoryStore[index].description,
        updatedAt: new Date().toISOString(),
      };

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully.',
        product: memoryStore[index],
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid Product ID specified.');
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error('Cannot update: Product not found.');
    }

    if (name !== undefined) product.name = name.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (category !== undefined) product.category = category.trim();
    if (imageUrl !== undefined) product.imageUrl = imageUrl.trim();
    if (description !== undefined) product.description = description.trim();

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete product from inventory
 * @route  DELETE /api/products/:id
 * @access Public/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      const initialLen = memoryStore.length;
      memoryStore = memoryStore.filter(p => p._id.toString() !== id);
      if (memoryStore.length === initialLen) {
        res.status(404);
        throw new Error('Cannot delete: Product not found.');
      }
      return res.status(200).json({
        success: true,
        message: 'Product removed from inventory successfully.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid Product ID specified.');
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error('Cannot delete: Product not found.');
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product removed from inventory successfully.',
    });
  } catch (error) {
    next(error);
  }
};
