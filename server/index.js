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
const PORT = process.env.PORT || 3000;

// ✅ CONFIGURACIÓN CORS MEJORADA
app.use(cors({
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:5500',    // Live Server común
      'http://127.0.0.1:5500',    // Live Server alternativo
      'http://localhost:3000',    // Mismo puerto del backend
      'http://localhost:8080',    // Otro puerto común
      'http://localhost:5501',    // Otro puerto posible
      'http://127.0.0.1:3000',    // Alternativo localhost
      'http://127.0.0.1:8080',    // Otro puerto alternativo
      'http://localhost:5502',    // Más puertos posibles
      'http://127.0.0.1:5501',    // Más alternativos
      'http://localhost:5503',
      'http://127.0.0.1:5502'
    ];
    
    // Permitir requests sin origin (como Postman)
    if (!origin) {
      console.log('🌐 Request sin origin (permitido)');
      return callback(null, true);
    }
    
    // Verificar si el origin está permitido
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS permitido para: ${origin}`);
      return callback(null, true);
    } else {
      console.log(`❌ CORS bloqueado para: ${origin}`);
      console.log(`📋 Orígenes permitidos: ${allowedOrigins.join(', ')}`);
      return callback(new Error('Origen no permitido por CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// ✅ CONFIGURACIÓN DE RUTAS (CORREGIDO)
app.use('/api/restaurants', restaurantRoutes);      // ✅ CORREGIDO: prefijo específico
app.use('/api/products', productRoutes);            // ✅ CORREGIDO: prefijo específico  
app.use('/api/auth', authRoutes);                   // ✅ CORRECTO
app.use('/api/orders', orderRoutes);                // ✅ CORRECTO

// Ruta de prueba del servidor
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RapiRush Server funcionando',
    timestamp: new Date().toISOString(),
    services: {
      auth: 'active',
      database: 'connected'
    }
  });
});

// Ruta de prueba de conexión a Supabase
app.get('/api/supabase-test', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tb_usuarios')
      .select('usuario_id, email, rol, estado')
      .limit(5);

    if (error) {
      console.error('❌ Error Supabase:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }

    res.json({
      success: true,
      message: '✅ Supabase conectado correctamente',
      sample: data,
      connection: {
        url: process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_KEY
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Ruta para verificar configuración
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    config: {
      port: PORT,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5500',
      supabaseUrl: process.env.SUPABASE_URL ? '✅ Configurado' : '❌ No configurado',
      supabaseKey: process.env.SUPABASE_SERVICE_KEY ? '✅ Configurado' : '❌ No configurado',
      nodeEnv: process.env.NODE_ENV || 'development'
    }
  });
});

// Ruta para cualquier otra ruta bajo /api/ que no exista
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Ruta API no encontrada: ${req.originalUrl}`,
    availableRoutes: [
      'GET  /api/health',
      'GET  /api/supabase-test', 
      'GET  /api/config',
      'GET  /api/restaurants',
      'GET  /api/restaurants/:id',
      'GET  /api/restaurants/search',
      'GET  /api/products/restaurant/:restaurantId',
      'GET  /api/products/:id',
      'POST /api/auth/register/cliente',
      'POST /api/auth/register/restaurante',
      'POST /api/auth/register/repartidor',
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'GET  /api/auth/profile',
      'GET  /api/auth/verify',
      'GET  /api/auth/me',
      'POST /api/orders/create',
      'GET  /api/orders/my-orders'
    ]
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('💥 Error global:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.send('<h1>✅ Tu correo fue confirmado correctamente</h1><p>Ya puedes iniciar sesión en RapiRush.</p>');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor RapiRush corriendo en http://localhost:${PORT}`);
  console.log(`📊 Panel de salud: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Prueba Supabase: http://localhost:${PORT}/api/supabase-test`);
  console.log(`🔐 Rutas Auth disponibles en: http://localhost:${PORT}/api/auth`);
  console.log(`🍽️  Rutas Restaurantes: http://localhost:${PORT}/api/restaurants`);
  console.log(`📦 Rutas Productos: http://localhost:${PORT}/api/products`);
  console.log(`📋 Rutas Pedidos: http://localhost:${PORT}/api/orders`);
  console.log(`⚙️  Configuración: http://localhost:${PORT}/api/config`);
});