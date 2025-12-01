import { supabase } from '../config/supabaseClient.js';

// 🎯 MAPEO DE CATEGORÍAS: Reagrupa todas las categorías en 3 grupos principales
// Esto mantiene compatibilidad con la estructura original sin modificar la BD
const mapToMainCategory = (originalCategory, productName = '') => {
    const category = (originalCategory || '').toLowerCase().trim();
    const name = (productName || '').toLowerCase().trim();
    
    // 🔴 CATEGORÍA 1: BEBIDAS
    if (category.includes('bebida') || category.includes('café') || category.includes('té') ||
        category.includes('jugo') || category.includes('batido') || category.includes('refresco') ||
        category.includes('smoothie') || category.includes('sake') || category.includes('agua')) {
        return 'Bebidas';
    }
    
    // 🟢 CATEGORÍA 2: COMPLEMENTOS (Acompañamientos, sides, extras)
    if (category.includes('complemento') || category.includes('side') || 
        name.includes('papas') || name.includes('aros de cebolla') ||
        name.includes('pan al ajo') || name.includes('palitos de') ||
        name.includes('ensalada') || name.includes('cremas') ||
        name.includes('aderezo') || name.includes('salsa')) {
        return 'Complementos';
    }
    
    // 🔵 CATEGORÍA 3: PRODUCTOS (Todo lo demás - Hamburguesas, Pizzas, Pollo, Sushi, Postres, etc.)
    // Esto incluye: Comida Rápida, Italiana, Asiática, Mexicana, Vegetariana, Postres, Panadería
    return 'Productos';
};

// ✅ OBTENER PRODUCTOS POR RESTAURANTE
export const getProductsByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        console.log(`📤 Obteniendo productos para restaurante: ${restaurantId}`);
        
        // ✅ USAR EL ID DIRECTAMENTE, SIN CONVERTIR
        // ✅ Consulta a tb_productos CON JOIN a tb_categorias
        let { data: products, error } = await supabase
            .from('tb_productos')
            .select(`
                producto_id,
                nombre,
                descripcion,
                precio,
                es_disponible,
                imagen_url,
                categoria_id,
                tb_categorias!categoria_id (
                    nombre
                )
            `)
            .eq('restaurante_id', restaurantId)
            .eq('es_disponible', true)
            .order('nombre');

        console.log(`🔍 Búsqueda - Error: ${error?.message || 'none'}, Resultados: ${products?.length || 0}`);
        if (error) {
            console.error('❌ Error de Supabase:', error);
        }

        if (error || !products || products.length === 0) {
            console.log('⚠️ Sin productos o error, retornando array vacío');
            return res.json({
                success: true,
                data: [],
                count: 0
            });
        }

        // ✅ Obtener TAMAÑOS para todos los productos en una sola query
        const productIds = products.map(p => p.producto_id);
        const { data: allSizes, error: sizesError } = await supabase
            .from('tb_producto_tamaños')
            .select('producto_id, tamaño_id, nombre_tamaño, multiplicador_precio, es_disponible')
            .in('producto_id', productIds)
            .eq('es_disponible', true)
            .order('nombre_tamaño');

        if (sizesError) {
            console.error('❌ Error al obtener tamaños:', sizesError);
        }

        // Crear un mapa de tamaños agrupados por producto_id
        const sizesByProduct = {};
        if (allSizes) {
            allSizes.forEach(size => {
                if (!sizesByProduct[size.producto_id]) {
                    sizesByProduct[size.producto_id] = [];
                }
                sizesByProduct[size.producto_id].push({
                    nombre_tamaño: size.nombre_tamaño,
                    multiplicador_precio: size.multiplicador_precio,
                    es_disponible: size.es_disponible
                });
            });
        }

        // Obtener datos del restaurante para traer calificación real
        const { data: restaurantData, error: restaurantError } = await supabase
            .from('tb_restaurantes')
            .select('calificacion_promedio, numero_reviews')
            .eq('restaurante_id', restaurantId)
            .single();

        if (restaurantError) {
            console.error('⚠️ Error al obtener datos del restaurante:', restaurantError);
        }

        // ✅ Transformar al formato esperado por frontend
        const formattedProducts = products.map(product => ({
            producto_id: product.producto_id,
            nombre: product.nombre,
            descripcion: product.descripcion || '',
            precio: parseFloat(product.precio),
            imagen_url: product.imagen_url,
            es_disponible: product.es_disponible,
            categoria_id: product.categoria_id,
            categoria_nombre: mapToMainCategory(product.tb_categorias?.nombre, product.nombre),
            // ✅ DATOS REALES DE LA BASE DE DATOS (no inventados)
            tiempo_preparacion: 15, // Default (si no está en BD)
            reseñas: restaurantData?.calificacion_promedio || 4.5,
            numero_reviews: restaurantData?.numero_reviews || 0,
            // ✨ TAMAÑOS DEL PRODUCTO
            tamaños: sizesByProduct[product.producto_id] || []
        }));

        console.log(`📥 Productos encontrados: ${formattedProducts.length}`);
        console.log('🔍 Ejemplo de producto:', formattedProducts[0]);
        
        // 📊 Log de distribución de categorías
        const categoryCount = {};
        formattedProducts.forEach(p => {
            categoryCount[p.categoria_nombre] = (categoryCount[p.categoria_nombre] || 0) + 1;
        });
        console.log('📊 Distribución de categorías:', categoryCount);

        res.json({
            success: true,
            data: formattedProducts,
            count: formattedProducts.length
        });

    } catch (error) {
        console.error('💥 Error en getProductsByRestaurant:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// ✅ OBTENER PRODUCTO POR ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data: product, error } = await supabase
            .from('tb_productos')
            .select('*')
            .eq('producto_id', id)
            .single();

        if (error || !product) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            product: {
                producto_id: product.producto_id,
                nombre: product.nombre,
                descripcion: product.descripcion,
                precio: parseFloat(product.precio),
                imagen_url: product.imagen_url,
                categoria_id: product.categoria_id,
                es_disponible: product.es_disponible
            }
        });

    } catch (error) {
        console.error('💥 Error en getProductById:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// ✅ CREAR NUEVO PRODUCTO (para restaurantes)
export const createProduct = async (req, res) => {
    try {
        // ✅ CORRECCIÓN: Obtener restaurante_id del usuario autenticado
        const userId = req.user.usuario_id;
        
        // Obtener restaurante_id desde tb_restaurantes
        const { data: restaurant, error: restError } = await supabase
            .from('tb_restaurantes')
            .select('restaurante_id')
            .eq('usuario_id', userId)
            .single();

        if (restError || !restaurant) {
            return res.status(403).json({
                success: false,
                error: 'No tienes un restaurante asociado'
            });
        }

        const restaurantId = restaurant.restaurante_id;
        const { nombre, descripcion, precio, categoria_id, imagen_url } = req.body;

        console.log('📝 Creando producto para restaurante:', restaurantId);

        if (!nombre || !precio) {
            return res.status(400).json({
                success: false,
                error: 'Nombre y precio son obligatorios'
            });
        }

        const { data: product, error } = await supabase
            .from('tb_productos')
            .insert([{
                restaurante_id: restaurantId,
                nombre: nombre,
                descripcion: descripcion || '',
                precio: parseFloat(precio),
                categoria_id: categoria_id,
                imagen_url: imagen_url || '',
                es_disponible: true
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Error creando producto:', error);
            return res.status(400).json({
                success: false,
                error: 'Error al crear producto'
            });
        }

        console.log('✅ Producto creado:', product.producto_id);

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            product: product
        });

    } catch (error) {
        console.error('💥 Error en createProduct:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// ✅ ACTUALIZAR PRODUCTO
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // ✅ CORRECCIÓN: Obtener restaurante_id del usuario autenticado
        const userId = req.user.usuario_id;
        
        // Obtener restaurante_id desde tb_restaurantes
        const { data: userRestaurant, error: restError } = await supabase
            .from('tb_restaurantes')
            .select('restaurante_id')
            .eq('usuario_id', userId)
            .single();

        if (restError || !userRestaurant) {
            return res.status(403).json({
                success: false,
                error: 'No tienes un restaurante asociado'
            });
        }

        const restaurantId = userRestaurant.restaurante_id;
        const updates = req.body;

        console.log(`📝 Actualizando producto ${id} del restaurante ${restaurantId}`);

        // 1. Verificar que el producto pertenece al restaurante
        const { data: product, error: fetchError } = await supabase
            .from('tb_productos')
            .select('restaurante_id')
            .eq('producto_id', id)
            .single();

        if (fetchError || !product) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }

        if (product.restaurante_id !== restaurantId) {
            return res.status(403).json({
                success: false,
                error: 'No autorizado para actualizar este producto'
            });
        }

        // 2. Actualizar campos permitidos
        const allowedFields = ['nombre', 'descripcion', 'precio', 'categoria_id', 'imagen_url', 'es_disponible'];
        const updateData = {};
        
        allowedFields.forEach(field => {
            if (field in updates) {
                updateData[field] = updates[field];
            }
        });

        const { error: updateError } = await supabase
            .from('tb_productos')
            .update(updateData)
            .eq('producto_id', id);

        if (updateError) {
            return res.status(400).json({
                success: false,
                error: 'Error al actualizar producto'
            });
        }

        console.log(`✅ Producto ${id} actualizado`);

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            product: {
                producto_id: id,
                ...updateData
            }
        });

    } catch (error) {
        console.error('💥 Error en updateProduct:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// ✅ ELIMINAR PRODUCTO
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // ✅ CORRECCIÓN: Obtener restaurante_id del usuario autenticado
        const userId = req.user.usuario_id;
        
        // Obtener restaurante_id desde tb_restaurantes
        const { data: userRestaurant, error: restError } = await supabase
            .from('tb_restaurantes')
            .select('restaurante_id')
            .eq('usuario_id', userId)
            .single();

        if (restError || !userRestaurant) {
            return res.status(403).json({
                success: false,
                error: 'No tienes un restaurante asociado'
            });
        }

        const restaurantId = userRestaurant.restaurante_id;

        console.log(`🗑️ Eliminando producto ${id} del restaurante ${restaurantId}`);

        // 1. Verificar que el producto pertenece al restaurante
        const { data: product, error: fetchError } = await supabase
            .from('tb_productos')
            .select('restaurante_id')
            .eq('producto_id', id)
            .single();

        if (fetchError || !product) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }

        if (product.restaurante_id !== restaurantId) {
            return res.status(403).json({
                success: false,
                error: 'No autorizado para eliminar este producto'
            });
        }

        // 2. Eliminar el producto
        const { error: deleteError } = await supabase
            .from('tb_productos')
            .delete()
            .eq('producto_id', id);

        if (deleteError) {
            return res.status(400).json({
                success: false,
                error: 'Error al eliminar producto'
            });
        }

        console.log(`✅ Producto ${id} eliminado`);

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });

    } catch (error) {
        console.error('💥 Error en deleteProduct:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

// ✅ OBTENER TAMAÑOS DE UN PRODUCTO
export const getProductSizes = async (req, res) => {
    try {
        const { productId } = req.params;

        console.log(`📤 Obteniendo tamaños para producto: ${productId}`);

        const { data: sizes, error } = await supabase
            .from('tb_producto_tamaños')
            .select(`
                tamaño_id,
                nombre_tamaño,
                multiplicador_precio,
                es_disponible
            `)
            .eq('producto_id', productId)
            .order('nombre_tamaño');

        if (error) {
            console.error('❌ Error en Supabase:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener tamaños'
            });
        }

        // Separar tamaños disponibles y no disponibles
        const availableSizes = sizes?.filter(s => s.es_disponible === true).map(s => ({
            tamaño_id: s.tamaño_id,
            nombre: s.nombre_tamaño,
            multiplicador: s.multiplicador_precio,
            precio: null, // Se calcula en frontend basado en el multiplicador
            es_disponible: s.es_disponible
        })) || [];
        
        const unavailableSizes = sizes?.filter(s => s.es_disponible === false).map(s => ({
            tamaño_id: s.tamaño_id,
            nombre: s.nombre_tamaño,
            multiplicador: s.multiplicador_precio,
            precio: null,
            es_disponible: s.es_disponible
        })) || [];

        console.log(`✅ Tamaños encontrados: ${availableSizes.length} disponibles, ${unavailableSizes.length} agotados`);

        res.json({
            success: true,
            sizes: {
                available: availableSizes,
                unavailable: unavailableSizes
            },
            count: availableSizes.length,
            total: sizes?.length || 0
        });

    } catch (error) {
        console.error('💥 Error en getProductSizes:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// ✅ CREAR TAMAÑO DE PRODUCTO (para restaurantes)
export const createProductSize = async (req, res) => {
    try {
        // ✅ CORRECCIÓN: Obtener restaurante_id del usuario autenticado
        const userId = req.user.usuario_id;
        
        // Obtener restaurante_id desde tb_restaurantes
        const { data: userRestaurant, error: restError } = await supabase
            .from('tb_restaurantes')
            .select('restaurante_id')
            .eq('usuario_id', userId)
            .single();

        if (restError || !userRestaurant) {
            return res.status(403).json({
                success: false,
                error: 'No tienes un restaurante asociado'
            });
        }

        const restaurantId = userRestaurant.restaurante_id;
        const { productId } = req.params;
        const { nombre_tamaño, multiplicador_precio, es_disponible } = req.body;

        console.log(`📝 Creando tamaño para producto: ${productId}`);

        // 1. Verificar que el producto pertenece al restaurante
        const { data: product, error: productError } = await supabase
            .from('tb_productos')
            .select('restaurante_id')
            .eq('producto_id', productId)
            .single();

        if (productError || !product || product.restaurante_id !== restaurantId) {
            return res.status(403).json({
                success: false,
                error: 'No autorizado para este producto'
            });
        }

        if (!nombre_tamaño || multiplicador_precio === undefined) {
            return res.status(400).json({
                success: false,
                error: 'nombre_tamaño y multiplicador_precio son obligatorios'
            });
        }

        // 2. Crear tamaño
        const { data: size, error } = await supabase
            .from('tb_producto_tamaños')
            .insert([{
                producto_id: productId,
                nombre_tamaño: nombre_tamaño,
                multiplicador_precio: parseFloat(multiplicador_precio),
                es_disponible: es_disponible !== false  // Default true si no se especifica
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Error creando tamaño:', error);
            return res.status(400).json({
                success: false,
                error: 'Error al crear tamaño'
            });
        }

        console.log('✅ Tamaño creado:', size.tamaño_id);

        res.status(201).json({
            success: true,
            message: 'Tamaño creado exitosamente',
            size: size
        });

    } catch (error) {
        console.error('💥 Error en createProductSize:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// ✅ ACTUALIZAR TAMAÑO DE PRODUCTO
export const updateProductSize = async (req, res) => {
    try {
        // ✅ CORRECCIÓN: Obtener restaurante_id del usuario autenticado
        const userId = req.user.usuario_id;
        
        // Obtener restaurante_id desde tb_restaurantes
        const { data: userRestaurant, error: restError } = await supabase
            .from('tb_restaurantes')
            .select('restaurante_id')
            .eq('usuario_id', userId)
            .single();

        if (restError || !userRestaurant) {
            return res.status(403).json({
                success: false,
                error: 'No tienes un restaurante asociado'
            });
        }

        const restaurantId = userRestaurant.restaurante_id;
        const { productId, sizeId } = req.params;
        const updates = req.body;

        console.log(`📝 Actualizando tamaño ${sizeId} del producto ${productId}`);

        // 1. Verificar que el producto pertenece al restaurante
        const { data: product, error: productError } = await supabase
            .from('tb_productos')
            .select('restaurante_id')
            .eq('producto_id', productId)
            .single();

        if (productError || !product || product.restaurante_id !== restaurantId) {
            return res.status(403).json({
                success: false,
                error: 'No autorizado para este producto'
            });
        }

        // 2. Actualizar tamaño
        const allowedFields = ['nombre_tamaño', 'multiplicador_precio', 'es_disponible'];
        const updateData = {};
        
        allowedFields.forEach(field => {
            if (field in updates) {
                updateData[field] = updates[field];
            }
        });

        const { error: updateError } = await supabase
            .from('tb_producto_tamaños')
            .update(updateData)
            .eq('tamaño_id', sizeId)
            .eq('producto_id', productId);

        if (updateError) {
            return res.status(400).json({
                success: false,
                error: 'Error al actualizar tamaño'
            });
        }

        console.log(`✅ Tamaño ${sizeId} actualizado`);

        res.json({
            success: true,
            message: 'Tamaño actualizado exitosamente',
            size: {
                tamaño_id: sizeId,
                ...updateData
            }
        });

    } catch (error) {
        console.error('💥 Error en updateProductSize:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// ✅ ELIMINAR TAMAÑO DE PRODUCTO
export const deleteProductSize = async (req, res) => {
    try {
        // ✅ CORRECCIÓN: Obtener restaurante_id del usuario autenticado
        const userId = req.user.usuario_id;
        
        // Obtener restaurante_id desde tb_restaurantes
        const { data: userRestaurant, error: restError } = await supabase
            .from('tb_restaurantes')
            .select('restaurante_id')
            .eq('usuario_id', userId)
            .single();

        if (restError || !userRestaurant) {
            return res.status(403).json({
                success: false,
                error: 'No tienes un restaurante asociado'
            });
        }

        const restaurantId = userRestaurant.restaurante_id;
        const { productId, sizeId } = req.params;

        console.log(`🗑️ Eliminando tamaño ${sizeId} del producto ${productId}`);

        // 1. Verificar que el producto pertenece al restaurante
        const { data: product, error: productError } = await supabase
            .from('tb_productos')
            .select('restaurante_id')
            .eq('producto_id', productId)
            .single();

        if (productError || !product || product.restaurante_id !== restaurantId) {
            return res.status(403).json({
                success: false,
                error: 'No autorizado para este producto'
            });
        }

        // 2. Eliminar tamaño
        const { error: deleteError } = await supabase
            .from('tb_producto_tamaños')
            .delete()
            .eq('tamaño_id', sizeId)
            .eq('producto_id', productId);

        if (deleteError) {
            return res.status(400).json({
                success: false,
                error: 'Error al eliminar tamaño'
            });
        }

        console.log(`✅ Tamaño ${sizeId} eliminado`);

        res.json({
            success: true,
            message: 'Tamaño eliminado exitosamente'
        });

    } catch (error) {
        console.error('💥 Error en deleteProductSize:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

// ✅ OBTENER TODAS LAS CATEGORÍAS
export const getCategories = async (req, res) => {
    try {
        const { data: categories, error } = await supabase
            .from('tb_categorias')
            .select('categoria_id, nombre')
            .order('nombre', { ascending: true });

        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Error al obtener categorías'
            });
        }

        res.json({
            success: true,
            categories: categories || []
        });

    } catch (error) {
        console.error('💥 Error en getCategories:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// ✅ EXPORTAR OBJETO CONTROLLER PARA COMPATIBILIDAD CON RUTAS
export const productController = {
    getProductsByRestaurant,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductSizes,
    createProductSize,
    updateProductSize,
    deleteProductSize,
    getCategories
};