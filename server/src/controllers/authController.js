import { supabase } from '../config/supabaseClient.js';

// ✅ MAPEO AUTOMÁTICO: tipo_comida → categoria_id
const CATEGORY_MAPPING = {
  'Pollos': 'Comida Rápida',
  'Pizzas': 'Italiana',
  'Sushi': 'Asiática',
  'Hamburguesas': 'Comida Rápida',
  'Chifa': 'Asiática',
  'Postres': 'Postres',
  'Mexicana': 'Mexicana',
  'Italiana': 'Italiana',
  'Vegetariana': 'Vegetariana',
  'Otros': 'Comida Rápida'
};

async function mapTipoComidaToCategory(tipoComida) {
  if (!tipoComida) return null;
  
  const categoryName = CATEGORY_MAPPING[tipoComida] || 'Comida Rápida';
  
  try {
    const { data: category, error } = await supabase
      .from('tb_categorias')
      .select('categoria_id')
      .eq('nombre', categoryName)
      .single();
    
    if (error || !category) {
      console.warn(`⚠️ Categoría no encontrada: ${categoryName}, usando default`);
      const { data: defaultCat } = await supabase
        .from('tb_categorias')
        .select('categoria_id')
        .eq('nombre', 'Comida Rápida')
        .single();
      return defaultCat?.categoria_id || null;
    }
    
    return category.categoria_id;
  } catch (err) {
    console.error('❌ Error en mapTipoComidaToCategory:', err);
    return null;
  }
}

// ✅ REGISTRO CLIENTE
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
    await new Promise(resolve => setTimeout(resolve, 200));

    // 2. Insertar en tb_usuarios
    const { error: userError } = await supabase
      .from('tb_usuarios')
      .insert([{
        usuario_id: authData.user.id,
        email: email,
        rol: 'cliente',
        estado: 'activo'
      }]);

    if (userError) {
      console.error('❌ Error insertando en tb_usuarios:', userError);
      return res.status(400).json({ 
        success: false, 
        error: 'Error creando perfil de usuario' 
      });
    }

    // 3. Insertar en tb_clientes
    const nombresArray = (nombres || '').split(' ');
    const cliente_nombre = nombresArray[0] || '';
    const cliente_apellido = nombresArray.slice(1).join(' ') || '';

    const { error: clientError } = await supabase
      .from('tb_clientes')
      .insert([{
        usuario_id: authData.user.id,
        cliente_nombre: cliente_nombre,
        cliente_apellido: cliente_apellido,
        cliente_email: email,
        cliente_telefono: telefono || '',
        cliente_direccion: direccion || ''
      }]);

    if (clientError) {
      console.error('❌ Error insertando en tb_clientes:', clientError);
      await supabase.from('tb_usuarios').delete().eq('usuario_id', authData.user.id);
      return res.status(400).json({ 
        success: false, 
        error: 'Error completando registro' 
      });
    }

    console.log('✅ Cliente registrado exitosamente');

    const response = {
      success: true,
      message: 'Cliente registrado exitosamente. Por favor verifica tu email.',
      user: {
        usuario_id: authData.user.id,
        email: authData.user.email,
        cliente_nombre: cliente_nombre,
        cliente_apellido: cliente_apellido,
        cliente_telefono: telefono || '',
        cliente_direccion: direccion || '',
        rol: 'cliente'
      }
    };

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

// ✅ REGISTRO RESTAURANTE
export const registerRestaurante = async (req, res) => {
  try {
    const { email, password, userData } = req.body;
    const { 
      nombre, 
      telefono, 
      direccion, 
      categoria_id, 
      descripcion,
      restaurante_url,
      tipo_comida,
      tiempo_delivery,
      delivery_cost
    } = userData;

    console.log('🏪 Registrando restaurante:', { email, nombre, tipo_comida });

    if (!password || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    let finalCategoriaId = categoria_id;
    if (!finalCategoriaId && tipo_comida) {
      finalCategoriaId = await mapTipoComidaToCategory(tipo_comida);
      console.log(`✅ Categoría mapeada automáticamente: ${tipo_comida} → ${finalCategoriaId}`);
    }

    if (!finalCategoriaId) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere categoría o tipo de comida válido'
      });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          rol: 'restaurante'
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

    await new Promise(resolve => setTimeout(resolve, 200));

    const { error: userError } = await supabase
      .from('tb_usuarios')
      .insert([{
        usuario_id: authData.user.id,
        email: email,
        rol: 'restaurante',
        estado: 'activo'
      }]);

    if (userError) {
      console.error('❌ Error insertando en tb_usuarios:', userError);
      return res.status(400).json({ 
        success: false, 
        error: 'Error creando perfil de restaurante' 
      });
    }

    const { error: restError } = await supabase
      .from('tb_restaurantes')
      .insert([{
        usuario_id: authData.user.id,
        categoria_id: finalCategoriaId,
        restaurante_nombre: nombre,
        restaurante_email: email,
        restaurante_telefono: telefono || '',
        restaurante_descripcion: descripcion || '',
        restaurante_direccion: direccion,
        restaurante_url: restaurante_url || null,
        tipo_comida: tipo_comida || null,
        tiempo_delivery: tiempo_delivery || 30,
        delivery_cost: delivery_cost || 0,
        numero_reviews: 0,
        es_abierto: false,
        es_verificado: false,
        calificacion_promedio: 0
      }]);

    if (restError) {
      console.error('❌ Error insertando en tb_restaurantes:', restError);
      await supabase.from('tb_usuarios').delete().eq('usuario_id', authData.user.id);
      return res.status(400).json({ 
        success: false, 
        error: 'Error completando registro del restaurante' 
      });
    }

    console.log('✅ Restaurante registrado exitosamente');

    const response = {
      success: true,
      message: 'Restaurante registrado correctamente. Por favor revisa tu email para confirmar tu cuenta.',
      user: {
        usuario_id: authData.user.id,
        email: authData.user.email,
        restaurante_nombre: nombre,
        restaurante_telefono: telefono || '',
        restaurante_direccion: direccion,
        tipo_comida: tipo_comida,
        estado: 'activo',
        rol: 'restaurante'
      }
    };

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

// ✅ REGISTRO REPARTIDOR
export const registerRepartidor = async (req, res) => {
  try {
    const { email, password, userData } = req.body;
    const { nombres, telefono, tipo_vehiculo, placa } = userData;

    console.log('🏍️ Registrando repartidor:', { email, nombres, tipo_vehiculo });

    if (!password || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombres,
          rol: 'repartidor'
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

    await new Promise(resolve => setTimeout(resolve, 200));

    const { error: userError } = await supabase
      .from('tb_usuarios')
      .insert([{
        usuario_id: authData.user.id,
        email: email,
        rol: 'repartidor',
        estado: 'activo'
      }]);

    if (userError) {
      console.error('❌ Error insertando en tb_usuarios:', userError);
      return res.status(400).json({ 
        success: false, 
        error: 'Error creando perfil de repartidor' 
      });
    }

    const nombresArray = (nombres || '').split(' ');
    const repartidor_nombre = nombresArray[0] || '';
    const repartidor_apellido = nombresArray.slice(1).join(' ') || '';

    const { error: repError } = await supabase
      .from('tb_repartidores')
      .insert([{
        usuario_id: authData.user.id,
        repartidor_nombre: repartidor_nombre,
        repartidor_apellido: repartidor_apellido,
        repartidor_email: email,
        repartidor_telefono: telefono || '',
        tipo_vehiculo: tipo_vehiculo || 'Bicicleta',
        placa: placa || '',
        es_disponible: false,
        es_verificado: false,
        calificacion_promedio: 0
      }]);

    if (repError) {
      console.error('❌ Error insertando en tb_repartidores:', repError);
      await supabase.from('tb_usuarios').delete().eq('usuario_id', authData.user.id);
      return res.status(400).json({ 
        success: false, 
        error: 'Error completando registro del repartidor' 
      });
    }

    console.log('✅ Repartidor registrado exitosamente');

    const response = {
      success: true,
      message: 'Repartidor registrado correctamente. Por favor revisa tu email para confirmar tu cuenta.',
      user: {
        usuario_id: authData.user.id,
        email: authData.user.email,
        repartidor_nombre: repartidor_nombre,
        repartidor_apellido: repartidor_apellido,
        repartidor_telefono: telefono || '',
        tipo_vehiculo: tipo_vehiculo || 'Bicicleta',
        estado: 'activo',
        rol: 'repartidor'
      }
    };

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

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('❌ Error de autenticación:', authError);
      
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

    const { data: usuario, error: userError } = await supabase
      .from('tb_usuarios')
      .select('rol, estado')
      .eq('usuario_id', authData.user.id)
      .single();

    if (userError) {
      console.error('❌ Error obteniendo rol:', userError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo información del usuario' 
      });
    }

    // ✅ PERMITIR LOGIN PARA TODOS LOS USUARIOS ACTIVOS (sin restricción de pendiente_aprobacion)
    let userProfile = {};
    let specificId = null;

    if (usuario.rol === 'cliente') {
      const { data: cliente } = await supabase
        .from('tb_clientes')
        .select('cliente_id, cliente_nombre, cliente_apellido, cliente_email, cliente_telefono, cliente_direccion')
        .eq('usuario_id', authData.user.id)
        .single();
      if (cliente) {
        userProfile = { ...cliente };
        specificId = cliente.cliente_id;
      }
    } else if (usuario.rol === 'restaurante') {
      const { data: restaurante } = await supabase
        .from('tb_restaurantes')
        .select('restaurante_id, restaurante_nombre, restaurante_email, restaurante_telefono, restaurante_direccion')
        .eq('usuario_id', authData.user.id)
        .single();
      if (restaurante) {
        userProfile = { ...restaurante };
        specificId = restaurante.restaurante_id;
      }
    } else if (usuario.rol === 'repartidor') {
      const { data: repartidor } = await supabase
        .from('tb_repartidores')
        .select('repartidor_id, repartidor_nombre, repartidor_apellido, repartidor_email, repartidor_telefono, tipo_vehiculo')
        .eq('usuario_id', authData.user.id)
        .single();
      if (repartidor) {
        userProfile = { ...repartidor };
        specificId = repartidor.repartidor_id;
      }
    }

    console.log('✅ Login exitoso:', { email, rol: usuario.rol });

    const response = {
      success: true,
      message: 'Login exitoso',
      user: {
        usuario_id: authData.user.id,
        email: authData.user.email,
        rol: usuario.rol,
        estado: usuario.estado,
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

    if (usuario.rol === 'cliente' && specificId) {
      response.user.cliente_id = specificId;
    } else if (usuario.rol === 'restaurante' && specificId) {
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

// ✅ OBTENER PERFIL DE USUARIO - CORREGIDO
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.usuario_id;

    const { data: usuario, error: userError } = await supabase
      .from('tb_usuarios')
      .select('rol')
      .eq('usuario_id', userId)
      .single();

    if (userError) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    let userProfile = {};
    let specificId = null;

    if (usuario.rol === 'cliente') {
      const { data: cliente } = await supabase
        .from('tb_clientes')
        .select('*')
        .eq('usuario_id', userId)
        .single();
      userProfile = { ...cliente };
      specificId = cliente?.cliente_id;
    } else if (usuario.rol === 'restaurante') {
      const { data: restaurante } = await supabase
        .from('tb_restaurantes')
        .select('*')
        .eq('usuario_id', userId)
        .single();
      userProfile = { ...restaurante };
      specificId = restaurante?.restaurante_id;
    } else if (usuario.rol === 'repartidor') {
      const { data: repartidor } = await supabase
        .from('tb_repartidores')
        .select('*')
        .eq('usuario_id', userId)
        .single();
      userProfile = { ...repartidor };
      specificId = repartidor?.repartidor_id;
    }

    const responseData = {
      usuario_id: userId,
      rol: usuario.rol,
      ...userProfile
    };

    if (specificId) {
      if (usuario.rol === 'cliente') {
        responseData.cliente_id = specificId;
      } else if (usuario.rol === 'restaurante') {
        responseData.restaurante_id = specificId;
      } else if (usuario.rol === 'repartidor') {
        responseData.repartidor_id = specificId;
      }
    }

    res.json({
      success: true,
      user: responseData
    });

  } catch (error) {
    console.error('💥 Error obteniendo perfil:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// ✅ ACTUALIZAR PERFIL DEL USUARIO - COMPLETAMENTE CORREGIDO
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.usuario_id;
    const updates = req.body;

    console.log(`📝 Actualizando perfil de usuario ${userId}`);
    console.log('📦 Datos a actualizar:', updates);

    const { data: usuario, error: userError } = await supabase
      .from('tb_usuarios')
      .select('rol')
      .eq('usuario_id', userId)
      .single();

    if (userError || !usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    let table, updateData = {};
    
    if (usuario.rol === 'cliente') {
      table = 'tb_clientes';
      const allowedFields = ['cliente_nombre', 'cliente_apellido', 'cliente_telefono', 'cliente_direccion'];
      allowedFields.forEach(field => {
        if (field in updates) {
          updateData[field] = updates[field];
        }
      });
    } else if (usuario.rol === 'restaurante') {
      table = 'tb_restaurantes';
      const allowedFields = ['restaurante_nombre', 'restaurante_descripcion', 'restaurante_telefono', 'restaurante_direccion', 'restaurante_url', 'tipo_comida', 'tiempo_delivery', 'delivery_cost'];
      allowedFields.forEach(field => {
        if (field in updates) {
          updateData[field] = updates[field];
        }
      });
    } else if (usuario.rol === 'repartidor') {
      table = 'tb_repartidores';
      const allowedFields = ['repartidor_nombre', 'repartidor_apellido', 'repartidor_telefono', 'tipo_vehiculo', 'placa', 'es_disponible'];
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

    const { error: updateError } = await supabase
      .from(table)
      .update(updateData)
      .eq('usuario_id', userId);

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
        usuario_id: userId,
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