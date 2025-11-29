import { supabase } from '../config/supabaseClient.js';

// ✅ REGISTRO CLIENTE - VERSIÓN RÁPIDA
export const registerCliente = async (req, res) => {
  try {
    const { email, password, userData } = req.body;
    const { nombres, telefono, direccion } = userData;

    console.log('📝 Registrando cliente:', { email, nombres, telefono });

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombres,
          telefono,
          direccion: direccion || ''
        }
      }
    });

    if (authError) {
      console.error('❌ Error Supabase Auth:', authError);
      return res.status(400).json({ 
        success: false, 
        error: authError.message 
      });
    }

    console.log('✅ Usuario Auth creado:', authData.user.id);

    // ✅ AGREGAR PEQUEÑO DELAY (solo 200ms) para Supabase
    await new Promise(resolve => setTimeout(resolve, 200));

    // 2. Insertar en tabla 'usuarios' con rol 'cliente'
    // NOTA: Clientes NO necesitan estado 'pendiente', usan email validation de Supabase Auth
    const { error: userError } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        rol: 'cliente'
      }]);

    if (userError) {
      console.error('❌ Error insertando en usuarios:', userError);
      return res.status(400).json({ 
        success: false, 
        error: 'Error creando perfil de usuario. Por favor intenta registrarte con otro email.' 
      });
    }

    // 3. Insertar en tabla 'clientes'
    const { error: clientError } = await supabase
      .from('clientes')
      .insert([{
        id: authData.user.id,
        nombres: nombres || '',
        telefono: telefono || '',
        direccion: direccion || ''
      }]);

    if (clientError) {
      console.error('❌ Error insertando en clientes:', clientError);
      // Solo eliminar de nuestra tabla usuarios, no de auth
      await supabase.from('usuarios').delete().eq('id', authData.user.id);
      return res.status(400).json({ 
        success: false, 
        error: 'Error completando registro. Por favor intenta nuevamente.' 
      });
    }

    console.log('✅ Cliente registrado exitosamente:', authData.user.id);

    // ✅ MODIFICACIÓN: Incluir session si está disponible (auto-login después de registro)
    const response = {
      success: true,
      message: 'Cliente registrado exitosamente. Por favor verifica tu email.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        nombres: nombres || '',
        telefono: telefono || '',
        direccion: direccion || '',
        rol: 'cliente'
      }
    };

    // Si Supabase devuelve session (auto-login), incluirla
    if (authData.session) {
      response.session = {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_in: authData.session.expires_in,
        token_type: authData.session.token_type
      };
    }

    res.status(201).json(response);

  } catch (error) {
    console.error('💥 Error inesperado en registerCliente:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// ✅ REGISTRO RESTAURANTE - VERSIÓN RÁPIDA
export const registerRestaurante = async (req, res) => {
  try {
    const { email, password, userData } = req.body;
    const { nombre, telefono, direccion, tipoComida, image_url } = userData;

    console.log('📝 Registrando restaurante:', { email, nombre, tipoComida, image_url });

    // ✅ VALIDAR que se proporcionó contraseña
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: password, // ← Usar contraseña del usuario
      options: {
        data: {
          nombre,
          telefono,
          direccion,
          tipoComida
        }
      }
    });

    if (authError) {
      console.error('❌ Error Supabase Auth:', authError);
      return res.status(400).json({ 
        success: false, 
        error: authError.message 
      });
    }

    // ✅ DELAY MINIMO
    await new Promise(resolve => setTimeout(resolve, 200));

    // 2. Insertar en tabla 'usuarios' con estado 'activo' (sin esperar admin)
    const { error: userError } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        rol: 'restaurante',
        estado: 'activo'  // ← Directo a activo, sin esperar admin
      }]);

    if (userError) {
      console.error('❌ Error insertando en usuarios:', userError);
      return res.status(400).json({ 
        success: false, 
        error: 'Error creando perfil de restaurante' 
      });
    }

    // 3. Insertar en tabla 'restaurantes'
    const { data: restauranteData, error: restError } = await supabase
      .from('restaurantes')
      .insert([{
        usuario_id: authData.user.id,
        nombre: nombre || '',
        telefono: telefono || '',
        direccion: direccion || '',
        etiquetas: tipoComida || 'Otros',
        image_url: image_url || '',
        abierto: false,
        tiempo_delivery: 30,
        descripcion: '',
        rating: 5.0,
        reviews: 0,
        delivery_cost: 0
      }])
      .select();

    if (restError) {
      console.error('❌ Error insertando en restaurantes:', restError);
      await supabase.from('usuarios').delete().eq('id', authData.user.id);
      return res.status(400).json({ 
        success: false, 
        error: 'Error completando registro del restaurante' 
      });
    }

    console.log('✅ Restaurante registrado exitosamente:', authData.user.id);

    const response = {
      success: true,
      message: 'Restaurante registrado exitosamente. Por favor confirma tu email para iniciar sesión.',
      user: {
        id: authData.user.id,
        restaurante_id: restauranteData?.[0]?.id,
        email: authData.user.email,
        nombre: nombre || '',
        telefono: telefono || '',
        direccion: direccion || '',
        tipoComida: tipoComida || 'Otros',
        rol: 'restaurante'
      }
    };

    // Si Supabase devuelve session (auto-login), incluirla
    if (authData.session) {
      response.session = {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_in: authData.session.expires_in,
        token_type: authData.session.token_type
      };
    }

    res.status(201).json(response);

  } catch (error) {
    console.error('💥 Error inesperado en registerRestaurante:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// ✅ REGISTRO REPARTIDOR - VERSIÓN RÁPIDA
export const registerRepartidor = async (req, res) => {
  try {
    const { email, password, userData } = req.body;
    const { nombre, telefono, vehiculo } = userData;

    console.log('📝 Registrando repartidor:', { email, nombre, vehiculo });

    // ✅ VALIDAR que se proporcionó contraseña
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: password, // ← Usar la contraseña del usuario
      options: {
        data: {
          nombre,
          telefono,
          vehiculo
        }
      }
    });

    if (authError) {
      console.error('❌ Error Supabase Auth:', authError);
      return res.status(400).json({ 
        success: false, 
        error: authError.message 
      });
    }

    // ✅ DELAY MINIMO
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 2. Insertar en tabla 'usuarios' con estado 'activo' (sin esperar admin)
    const { error: userError } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        rol: 'repartidor',
        estado: 'activo'  // ← Directo a activo, sin esperar admin
      }]);

    if (userError) {
      console.error('❌ Error insertando en usuarios:', userError);
      return res.status(400).json({ 
        success: false, 
        error: 'Error creando perfil de repartidor' 
      });
    }

    // 3. Insertar en tabla 'repartidores'
    const { error: repError } = await supabase
      .from('repartidores')
      .insert([{
        id: authData.user.id,
        nombre: nombre || '',
        telefono: telefono || '',
        tipo_vehiculo: vehiculo || 'Bicicleta'
      }]);

    if (repError) {
      console.error('❌ Error insertando en repartidores:', repError);
      await supabase.from('usuarios').delete().eq('id', authData.user.id);
      return res.status(400).json({ 
        success: false, 
        error: 'Error completando registro del repartidor' 
      });
    }

    console.log('✅ Repartidor registrado exitosamente:', authData.user.id);

    const response = {
      success: true,
      message: 'Repartidor registrado exitosamente. Tu cuenta será activada automáticamente en 3 minutos.',
      user: {
        id: authData.user.id,
        repartidor_id: authData.user.id,
        email: authData.user.email,
        nombre: nombre || '',
        telefono: telefono || '',
        tipo_vehiculo: vehiculo || 'Bicicleta',
        rol: 'repartidor'
      }
    };

    // Si Supabase devuelve session (auto-login), incluirla
    if (authData.session) {
      response.session = {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_in: authData.session.expires_in,
        token_type: authData.session.token_type
      };
    }

    res.status(201).json(response);

  } catch (error) {
    console.error('💥 Error inesperado en registerRepartidor:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};


// ✅ LOGIN ÚNICO PARA TODOS LOS ROLES
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Intentando login:', email);

    // 1. Autenticar con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('❌ Error de autenticación:', authError);
      
      // Detectar si el error es por email no confirmado
      if (authError.code === 'email_not_confirmed') {
        return res.status(401).json({ 
          success: false, 
          error: 'Aún no confirmas el correo. Revisa tu bandeja de entrada.',
          code: 'email_not_confirmed'
        });
      }
      
      return res.status(401).json({ 
        success: false, 
        error: 'Credenciales incorrectas' 
      });
    }

    // 2. Obtener rol desde tabla 'usuarios'
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('❌ Error obteniendo rol:', userError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo información del usuario' 
      });
    }

    // 3. Obtener datos específicos según el rol
    let userProfile = {};
    let specificId = null;

    if (usuario.rol === 'cliente') {
      const { data: cliente } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      userProfile = { ...cliente };
    } else if (usuario.rol === 'restaurante') {
      const { data: restaurante } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('usuario_id', authData.user.id)
        .single();
      userProfile = { ...restaurante };
      specificId = restaurante?.id;
    } else if (usuario.rol === 'repartidor') {
      const { data: repartidor } = await supabase
        .from('repartidores')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      userProfile = { ...repartidor };
      specificId = repartidor?.id;
    }

    console.log('✅ Login exitoso:', { email, rol: usuario.rol });

    // ✅ MODIFICACIÓN: Incluir el session con tokens
    const response = {
      success: true,
      message: 'Login exitoso',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        rol: usuario.rol,
        ...userProfile,
        email_verified: !!authData.user.email_confirmed_at
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_in: authData.session.expires_in,
        token_type: authData.session.token_type
      }
    };

    // ✅ Agregar IDs específicos si aplica
    if (usuario.rol === 'restaurante' && specificId) {
      response.user.restaurante_id = specificId;
    } else if (usuario.rol === 'repartidor' && specificId) {
      response.user.repartidor_id = specificId;
    }

    res.json(response);

  } catch (error) {
    console.error('💥 Error inesperado en login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// ✅ LOGOUT
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Error en logout:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error cerrando sesión' 
      });
    }

    console.log('✅ Logout exitoso');
    res.json({ 
      success: true, 
      message: 'Sesión cerrada correctamente' 
    });

  } catch (error) {
    console.error('💥 Error inesperado en logout:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// ✅ OBTENER PERFIL DE USUARIO
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', userId)
      .single();

    if (userError) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    let userProfile = {};

    if (usuario.rol === 'cliente') {
      const { data: cliente } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', userId)
        .single();
      userProfile = { ...cliente };
    } else if (usuario.rol === 'restaurante') {
      const { data: restaurante } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', userId)
        .single();
      userProfile = { ...restaurante };
    } else if (usuario.rol === 'repartidor') {
      const { data: repartidor } = await supabase
        .from('repartidores')
        .select('*')
        .eq('id', userId)
        .single();
      userProfile = { ...repartidor };
    }

    // ✅ MODIFICACIÓN: Incluir información básica del usuario
    res.json({
      success: true,
      user: {
        id: userId,
        rol: usuario.rol,
        ...userProfile
      }
    });

  } catch (error) {
    console.error('💥 Error obteniendo perfil:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// ✅ ACTUALIZAR PERFIL DEL USUARIO
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    console.log(`📝 Actualizando perfil de usuario ${userId}`);
    console.log('📦 Datos a actualizar:', updates);

    // 1. Obtener usuario actual
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', userId)
      .single();

    if (userError || !usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // 2. Actualizar según el rol
    let table, updateData = {};
    
    if (usuario.rol === 'cliente') {
      table = 'clientes';
      const allowedFields = ['nombre', 'email', 'telefono', 'direccion'];
      allowedFields.forEach(field => {
        if (field in updates) {
          updateData[field] = updates[field];
        }
      });
    } else if (usuario.rol === 'restaurante') {
      table = 'restaurantes';
      const allowedFields = ['nombre', 'descripcion', 'image_url', 'direccion', 'telefono'];
      allowedFields.forEach(field => {
        if (field in updates) {
          // Mapear campo 'imagen' a 'image_url' si es necesario
          const mappedField = field === 'imagen' ? 'image_url' : field;
          updateData[mappedField] = updates[field];
        }
      });
    } else if (usuario.rol === 'repartidor') {
      table = 'repartidores';
      const allowedFields = ['nombre', 'email', 'telefono', 'vehiculo', 'placa', 'disponible'];
      allowedFields.forEach(field => {
        if (field in updates) {
          updateData[field] = updates[field];
        }
      });
    }

    if (!table) {
      return res.status(400).json({
        success: false,
        error: 'Rol no válido'
      });
    }

    // 3. Actualizar en Supabase
    const { error: updateError } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Error actualizando:', updateError);
      return res.status(400).json({
        success: false,
        error: 'Error al actualizar perfil: ' + updateError.message
      });
    }

    console.log(`✅ Perfil de ${usuario.rol} ${userId} actualizado`);

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: {
        id: userId,
        rol: usuario.rol,
        ...updateData
      }
    });

  } catch (error) {
    console.error('💥 Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
