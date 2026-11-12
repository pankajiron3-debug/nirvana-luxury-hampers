import express from 'express';
import {
  getProducts,
  getAnalytics,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Optimized Aggregation Pipeline Routes
router.route('/').get(getProducts).post(createProduct);
router.route('/analytics').get(getAnalytics);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;
