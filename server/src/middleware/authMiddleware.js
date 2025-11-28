import { supabase } from '../config/supabaseClient.js';

// ✅ MIDDLEWARE PARA VALIDAR JWT DE SUPABASE
// ✅ MIDDLEWARE PARA VALIDAR JWT DE SUPABASE - CON DEBUG
export const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    console.log('🔐 Auth Middleware - Header recibido:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No hay token en el header');
      return res.status(401).json({
        success: false,
        error: 'Token de autorización requerido'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // ✅ DEBUG CRÍTICO: Verificar el token recibido
    console.log('🔐 Token recibido en servidor:', {
      length: token?.length,
      startsWith: token?.substring(0, 20) + '...',
      endsWith: '...' + token?.substring(token.length - 20)
    });
    
    if (!token) {
      console.log('❌ Token vacío después de split');
      return res.status(401).json({
        success: false,
        error: 'Token no válido'
      });
    }

    // ✅ VERIFICAR FORMATO DEL TOKEN JWT (debe tener 3 partes)
    const tokenParts = token.split('.');
    console.log('🔐 Partes del token:', tokenParts.length);
    
    if (tokenParts.length !== 3) {
      console.log('❌ Token JWT malformado - debe tener 3 partes');
      return res.status(401).json({
        success: false,
        error: 'Token JWT malformado'
      });
    }

    console.log('🔐 Verificando token con Supabase...');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('❌ Error verificando token con Supabase:', error);
      return res.status(401).json({
        success: false,
        error: 'Token inválido o expirado: ' + (error?.message || 'Usuario no encontrado')
      });
    }

    // ✅ Token válido
    req.user = {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at
    };

    console.log('✅ Usuario autenticado:', user.email);
    next();

  } catch (error) {
    console.error('💥 Error en authMiddleware:', error);
    return res.status(500).json({
      success: false,
      error: 'Error de autenticación'
    });
  }
};

// ✅ MIDDLEWARE PARA VERIFICAR ROLES
export const verifyRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      // Obtener rol del usuario desde la base de datos
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', req.user.id)
        .single();

      if (error || !usuario) {
        return res.status(403).json({
          success: false,
          error: 'No se pudo verificar el rol del usuario'
        });
      }

      // Convertir allowedRoles a array si es string único
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Verificar si el rol del usuario está permitido
      if (!rolesArray.includes(usuario.rol)) {
        return res.status(403).json({
          success: false,
          error: `Acceso denegado. Rol requerido: ${rolesArray.join(', ')}`
        });
      }

      // Agregar rol al objeto user del request
      req.user.rol = usuario.rol;
      
      console.log('✅ Rol verificado:', { usuario: req.user.email, rol: usuario.rol });
      next();

    } catch (error) {
      console.error('💥 Error en verifyRole:', error);
      return res.status(500).json({
        success: false,
        error: 'Error verificando rol'
      });
    }
  };
};

// ✅ MIDDLEWARE OPCIONAL: VERIFICAR EMAIL CONFIRMADO
export const verifyEmail = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    // Obtener usuario actualizado de Supabase
    const { data: { user }, error } = await supabase.auth.getUser(req.user.id);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Error obteniendo información del usuario'
      });
    }

    // Verificar si el email está confirmado
    if (!user.email_confirmed_at) {
      return res.status(403).json({
        success: false,
        error: 'Debes verificar tu email para acceder a esta función',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Actualizar datos del usuario en el request
    req.user.email_confirmed_at = user.email_confirmed_at;
    
    console.log('✅ Email verificado:', user.email);
    next();

  } catch (error) {
    console.error('💥 Error en verifyEmail:', error);
    return res.status(500).json({
      success: false,
      error: 'Error verificando email'
    });
  }
};

// ✅ MIDDLEWARE PARA RUTAS PÚBLICAS (solo verifica token si existe)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (!error && user) {
          req.user = {
            id: user.id,
            email: user.email,
            email_confirmed_at: user.email_confirmed_at
          };
          
          // Obtener rol si el usuario está autenticado
          const { data: usuario } = await supabase
            .from('usuarios')
            .select('rol')
            .eq('id', user.id)
            .single();
            
          if (usuario) {
            req.user.rol = usuario.rol;
          }
        }
      }
    }
    
    next();
  } catch (error) {
    // En middleware opcional, continuamos incluso con errores
    console.warn('⚠️ Error en optionalAuth (continuando):', error);
    next();
  }
};