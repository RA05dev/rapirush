import { supabase } from '../config/supabaseClient.js';
import { verifyRole, verifyEmail } from '../middleware/authMiddleware.js';

import express from 'express';
import {
  registerCliente,
  registerRestaurante,
  registerRepartidor,
  login,
  logout,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ RUTAS PÚBLICAS (sin autenticación)

// Registro de Cliente (desde register.html)
router.post('/register/cliente', registerCliente);

// Registro de Restaurante (desde agregarestaurante.html)  
router.post('/register/restaurante', registerRestaurante);

// Registro de Repartidor (desde serepartidor.html)
router.post('/register/repartidor', registerRepartidor);

// Login único para todos los roles (desde login.html)
router.post('/login', login);

// Verificar salud del servicio de autenticación
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servicio de autenticación funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// ✅ RUTAS PROTEGIDAS (requieren autenticación)

// Logout (requiere estar logueado)
router.post('/logout', authMiddleware, logout);

// Obtener perfil del usuario autenticado
router.get('/profile', authMiddleware, getProfile);

// Actualizar perfil del usuario autenticado
router.put('/profile', authMiddleware, updateProfile);

// Ruta para verificar token (útil para el frontend)
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    user: {
      id: req.user.id,
      email: req.user.email,
      email_verified: !!req.user.email_confirmed_at
    }
  });
});

// ✅ RUTAS DE PRUEBA/DEVELOPMENT (opcionales)

// Ruta para obtener información del usuario actual (con optional auth)
router.get('/me', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.json({
        success: true,
        authenticated: false,
        message: 'No autenticado'
      });
    }

    // Obtener información completa del usuario
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo información del usuario'
      });
    }

    let userData = {
      id: req.user.id,
      email: req.user.email,
      rol: usuario.rol,
      email_verified: !!req.user.email_confirmed_at,
      authenticated: true
    };

    let specificId = null;

    // Obtener datos específicos según el rol
    if (usuario.rol === 'cliente') {
      const { data: cliente } = await supabase
        .from('clientes')
        .select('nombres, telefono, direccion')
        .eq('id', req.user.id)
        .single();
      userData = { ...userData, ...cliente };
    } else if (usuario.rol === 'restaurante') {
      const { data: restaurante } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('usuario_id', req.user.id)
        .single();
      userData = { ...userData, ...restaurante };
      specificId = restaurante?.id;
    } else if (usuario.rol === 'repartidor') {
      const { data: repartidor } = await supabase
        .from('repartidores')
        .select('*')
        .eq('id', req.user.id)
        .single();
      userData = { ...userData, ...repartidor };
      specificId = repartidor?.id;
    }

    // ✅ Agregar IDs específicos si aplica
    if (usuario.rol === 'restaurante' && specificId) {
      userData.restaurante_id = specificId;
    } else if (usuario.rol === 'repartidor' && specificId) {
      userData.repartidor_id = specificId;
    }

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('💥 Error en /me:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Ruta para reenviar email de verificación (protegida)
router.post('/resend-verification', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: req.user.email,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verified.html`
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Email de verificación reenviado correctamente'
    });

  } catch (error) {
    console.error('💥 Error reenviando verificación:', error);
    res.status(500).json({
      success: false,
      error: 'Error reenviando email de verificación'
    });
  }
});

// ✅ RUTAS DE EJEMPLO PARA ROLES ESPECÍFICOS (puedes agregar más)

// Solo para clientes
router.get('/client-only', authMiddleware, verifyRole('cliente'), (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta es solo para clientes',
    user: req.user
  });
});

// Solo para restaurantes
router.get('/restaurant-only', authMiddleware, verifyRole('restaurante'), (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta es solo para restaurantes',
    user: req.user
  });
});

// Solo para repartidores
router.get('/delivery-only', authMiddleware, verifyRole('repartidor'), (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta es solo para repartidores',
    user: req.user
  });
});

// Solo para administradores
router.get('/admin-only', authMiddleware, verifyRole('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta es solo para administradores',
    user: req.user
  });
});

// Ruta que requiere email verificado
router.get('/verified-only', authMiddleware, verifyEmail, (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta requiere email verificado',
    user: req.user
  });
});

// ✅ AGREGAR esta ruta específica para obtener usuario actual
router.get('/current-user', authMiddleware, async (req, res) => {
  try {
    // Obtener información del usuario desde Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(req.user.id);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Obtener rol desde la base de datos
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', user.id)
      .single();

    if (userError) {
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo información del usuario'
      });
    }

    let userProfile = {};
    
    // Obtener datos específicos según el rol
    if (usuario.rol === 'cliente') {
      const { data: cliente } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', user.id)
        .single();
      userProfile = { ...cliente };
    } else if (usuario.rol === 'restaurante') {
      const { data: restaurante } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', user.id)
        .single();
      userProfile = { ...restaurante };
    } else if (usuario.rol === 'repartidor') {
      const { data: repartidor } = await supabase
        .from('repartidores')
        .select('*')
        .eq('id', user.id)
        .single();
      userProfile = { ...repartidor };
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        rol: usuario.rol,
        ...userProfile,
        email_verified: !!user.email_confirmed_at
      }
    });

  } catch (error) {
    console.error('💥 Error en /current-user:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// ✅ RUTAS ADMIN (requieren autenticación)

// Obtener usuarios pendientes (restaurantes y repartidores)
router.get('/admin/pending-users', authMiddleware, adminController.getPendingUsers);

// Aprobar usuario (restaurante o repartidor)
router.post('/admin/approve-user', authMiddleware, adminController.approveUser);

// Rechazar usuario
router.post('/admin/reject-user', authMiddleware, adminController.rejectUser);

// Obtener estadísticas
router.get('/admin/stats', authMiddleware, adminController.getStats);

export default router;