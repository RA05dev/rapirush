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
    const { nombre, telefono, direccion, tipoComida } = userData;

    console.log('📝 Registrando restaurante:', { email, nombre, tipoComida });

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: password || 'tempPassword123',
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

    // 2. Insertar en tabla 'usuarios'
    const { error: userError } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        rol: 'restaurante'
      }]);

    if (userError) {
      console.error('❌ Error insertando en usuarios:', userError);
      return res.status(400).json({ 
        success: false, 
        error: 'Error creando perfil de restaurante' 
      });
    }

    // 3. Insertar en tabla 'restaurantes'
    const { error: restError } = await supabase
      .from('restaurantes')
      .insert([{
        id: authData.user.id,
        nombre: nombre || '',
        telefono: telefono || '',
        direccion: direccion || '',
        etiquetas: tipoComida || 'Otros',
        abierto: false,
        tiempo_delivery: 30,
        descripcion: '',
        rating: 5.0,
        reviews: 0,
        delivery_cost: 0
      }]);

    if (restError) {
      console.error('❌ Error insertando en restaurantes:', restError);
      await supabase.from('usuarios').delete().eq('id', authData.user.id);
      return res.status(400).json({ 
        success: false, 
        error: 'Error completando registro del restaurante' 
      });
    }

    console.log('✅ Restaurante registrado exitosamente:', authData.user.id);

    // ✅ MODIFICACIÓN: Incluir session si está disponible
    const response = {
      success: true,
      message: 'Registro exitoso. Por favor verifica tu email.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        // ... tus datos específicos según restaurante/repartidor
        rol: 'restaurante' // o 'repartidor'
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

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: password || 'tempPassword123',
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

    // 2. Insertar en tabla 'usuarios'
    const { error: userError } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        rol: 'repartidor'
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

    // ✅ MODIFICACIÓN: Incluir session si está disponible
    // ✅ MODIFICACIÓN: Incluir session si está disponible
    const response = {
      success: true,
      message: 'Registro exitoso. Por favor verifica tu email.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        nombre: nombre || '',
        telefono: telefono || '',
        tipo_vehiculo: vehiculo || 'Bicicleta',
        rol: 'repartidor' // ← ✅ AQUÍ EL CAMBIO
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
        .eq('id', authData.user.id)
        .single();
      userProfile = { ...restaurante };
    } else if (usuario.rol === 'repartidor') {
      const { data: repartidor } = await supabase
        .from('repartidores')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      userProfile = { ...repartidor };
    }

    console.log('✅ Login exitoso:', { email, rol: usuario.rol });

    // ✅ MODIFICACIÓN: Incluir el session con tokens
    res.json({
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
    });

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