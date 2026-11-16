import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { notFoundHandler, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

// Initialize MongoDB Connection
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check / System Status API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    system: 'Nirvana Luxury Hampers API Gateway',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🌟 NIRVANA LUXURY HAMPERS - ENTERPRISE BACKEND      `);
  console.log(`  🚀 Server Running on: http://localhost:${PORT}      `);
  console.log(`  📦 Health Check API:  http://localhost:${PORT}/api/health`);
  console.log(`  💎 Products Endpoint: http://localhost:${PORT}/api/products`);
  console.log(`======================================================\n`);
});
