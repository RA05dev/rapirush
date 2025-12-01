import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './src/config/supabaseClient.js';

import authRoutes from './src/routes/authRoutes.js';
import restaurantRoutes from './src/routes/restaurantRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';

dotenv.config();

const app = express();

// ✅ CONFIGURACIÓN CORS
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'http://localhost:8080'
    ];
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido por CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// ✅ RUTAS
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RapiRush Server funcionando' });
});

// ⚠️ IMPORTANTE: NO usar app.listen en Vercel
export default app;
