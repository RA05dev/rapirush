import { supabase } from '../config/supabaseClient.js';
import { 
  authMiddleware, 
  optionalAuth, 
  verifyRole, 
  verifyEmail,
  verifyRestaurantOwner,
  verifyRepartidor 
} from '../middleware/authMiddleware.js';

import express from 'express';
import {
  registerCliente,
  registerRestaurante,
  registerRepartidor,
  login,
  logout,
  getProfile,
  updateProfile,
  updateDisponible
} from '../controllers/authController.js';
import { adminController } from '../controllers/adminController.js';

const router = express.Router();

// ✅ RUTAS PÚBLICAS (sin autenticación)
router.post('/register/cliente', registerCliente);
router.post('/register/restaurante', registerRestaurante);
router.post('/register/repartidor', registerRepartidor);
router.post('/login', login);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servicio de autenticación funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// ✅ RUTAS PROTEGIDAS (requieren autenticación)
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/disponible', authMiddleware, updateDisponible);

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

// ✅ RUTAS DE USUARIO ACTUAL
router.get('/me', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.json({
        success: true,
        authenticated: false,
        message: 'No autenticado'
      });
    }

    const { data: usuario, error } = await supabase
      .from('tb_usuarios')
      .select('rol')
      .eq('usuario_id', req.user.id)
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo información del usuario'
      });
    }

    let userData = {
      id: req.user.id,
      usuario_id: req.user.id,
      email: req.user.email,
      rol: usuario.rol,
      email_verified: !!req.user.email_confirmed_at,
      authenticated: true
    };

    // Obtener datos específicos según el rol
    if (usuario.rol === 'cliente') {
      const { data: cliente } = await supabase
        .from('tb_clientes')
        .select('cliente_id, cliente_nombre, cliente_telefono, cliente_direccion')
        .eq('usuario_id', req.user.id)
        .single();
      userData = { ...userData, ...cliente };
    } else if (usuario.rol === 'restaurante') {
      const { data: restaurante } = await supabase
        .from('tb_restaurantes')
        .select('restaurante_id, restaurante_nombre, restaurante_telefono, restaurante_direccion')
        .eq('usuario_id', req.user.id)
        .single();
      userData = { ...userData, ...restaurante };
    } else if (usuario.rol === 'repartidor') {
      const { data: repartidor } = await supabase
        .from('tb_repartidores')
        .select('repartidor_id, repartidor_nombre, repartidor_telefono, tipo_vehiculo')
        .eq('usuario_id', req.user.id)
        .single();
      userData = { ...userData, ...repartidor };
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

router.get('/current-user', authMiddleware, async (req, res) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(req.user.id);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const { data: usuario, error: userError } = await supabase
      .from('tb_usuarios')
      .select('rol')
      .eq('usuario_id', user.id)
      .single();

    if (userError) {
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo información del usuario'
      });
    }

    let userProfile = {};
    
    if (usuario.rol === 'cliente') {
      const { data: cliente } = await supabase
        .from('tb_clientes')
        .select('*')
        .eq('usuario_id', user.id)
        .single();
      userProfile = { ...cliente };
    } else if (usuario.rol === 'restaurante') {
      const { data: restaurante } = await supabase
        .from('tb_restaurantes')
        .select('*')
        .eq('usuario_id', user.id)
        .single();
      userProfile = { ...restaurante };
    } else if (usuario.rol === 'repartidor') {
      const { data: repartidor } = await supabase
        .from('tb_repartidores')
        .select('*')
        .eq('usuario_id', user.id)
        .single();
      userProfile = { ...repartidor };
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        usuario_id: user.id,
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

// ✅ RUTAS DE VERIFICACIÓN DE EMAIL
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

// ✅ RUTAS DE ROLES ESPECÍFICOS
router.get('/client-only', authMiddleware, verifyRole('cliente'), (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta es solo para clientes',
    user: req.user
  });
});

router.get('/restaurant-only', authMiddleware, verifyRole('restaurante'), (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta es solo para restaurantes',
    user: req.user
  });
});

router.get('/delivery-only', authMiddleware, verifyRole('repartidor'), (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta es solo para repartidores',
    user: req.user
  });
});

router.get('/admin-only', authMiddleware, verifyRole('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta es solo para administradores',
    user: req.user
  });
});

router.get('/verified-only', authMiddleware, verifyEmail, (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta requiere email verificado',
    user: req.user
  });
});

// ✅ RUTAS ADMIN
router.get('/admin/pending-users', authMiddleware, verifyRole('admin'), adminController.getPendingUsers);
router.post('/admin/approve-user', authMiddleware, verifyRole('admin'), adminController.approveUser);
router.post('/admin/reject-user', authMiddleware, verifyRole('admin'), adminController.rejectUser);
router.get('/admin/stats', authMiddleware, verifyRole('admin'), adminController.getStats);

export default router;