import { supabase } from '../config/supabaseClient.js';

// Agregar esta función al principio
function convertToUUID(restaurantId) {
    // Si ya es un UUID, devolverlo tal cual
    if (restaurantId.includes('-')) {
        return restaurantId;
    }
    
    // Si es numérico, convertirlo a UUID
    const idNum = parseInt(restaurantId);
    if (!isNaN(idNum)) {
        // Mapeo basado en tu función getSimpleRestaurantId
        const uuidMap = {
            1: '10000000-0000-0000-0000-000000000001',
            2: '20000000-0000-0000-0000-000000000002', 
            3: '30000000-0000-0000-0000-000000000003',
            4: '40000000-0000-0000-0000-000000000004',
            5: '50000000-0000-0000-0000-000000000005',
            6: '60000000-0000-0000-0000-000000000006',
            7: '70000000-0000-0000-0000-000000000007',
            8: '80000000-0000-0000-0000-000000000008', 
            9: '90000000-0000-0000-0000-000000000009',
            10: 'a0000000-0000-0000-0000-000000000010',
            11: 'b0000000-0000-0000-0000-000000000011',
            12: 'c0000000-0000-0000-0000-000000000012',
            13: 'd0000000-0000-0000-0000-000000000013',
            14: 'e0000000-0000-0000-0000-000000000014',
            15: 'f0000000-0000-0000-0000-000000000015'
        };
        return uuidMap[idNum] || restaurantId;
    }
    
    return restaurantId;
}

// ✅ FUNCIÓN HELPER PARA ICONOS (fuera del controller)
function getCategoryIcon(categoryName) {
    const iconMap = {
        'Pizzas': 'bi bi-pizza',
        'Bebidas': 'bi bi-cup-straw',
        'Complementos': 'bi bi-basket-fill',
        'Hamburguesas': 'bi bi-burger',
        'Rolls': 'bi bi-snow',
        'Sashimi & Niguiri': 'bi bi-tsunami',
        'Pasteles': 'bi bi-cake2',
        'Cafés': 'bi bi-cup-hot',
        'Bebidas Frías': 'bi bi-cup-straw',
        'Pollo a la Brasa': 'bi bi-fire',
        'Makis': 'bi bi-snow',
        'Temakis': 'bi bi-triangle',
        'Pastas': 'bi bi-pizza',
        'Platos Principales': 'bi bi-egg-fried',
        'Aperitivos': 'bi bi-basket',
        'Cortes': 'bi bi-basket',
        'Acompañamientos': 'bi bi-box',
        'Ensaladas': 'bi bi-leaf',
        'Wraps': 'bi bi-box',
        'Currys': 'bi bi-bowl',
        'Breads & Sides': 'bi bi-basket',
        'Donas': 'bi bi-cupcake',
        'Tacos': 'bi bi-egg',
        'Burritos': 'bi bi-basket'
    };
    
    return iconMap[categoryName] || 'bi bi-list';
}

export const productController = {

    // ✅ OBTENER PRODUCTOS POR RESTAURANTE
async getProductsByRestaurant(req, res) {
    try {
        let restaurantId = req.params.restaurantId;
        console.log(`📤 Obteniendo productos para restaurante: ${restaurantId}`);
        
        // ✅ INTENTAR PRIMERO CON ID CONVERTIDO, LUEGO CON ID TAL CUAL
        let convertedId = convertToUUID(restaurantId);
        console.log(`🔄 ID convertido: ${convertedId}`);
        
        // ✅ UNA SOLA CONSULTA CON JOIN (MUCHO MÁS RÁPIDO)
        let { data: productsWithSizes, error } = await supabase
            .from('productos')
            .select(`
                *,
                producto_sizes (size, price)
            `)
            .eq('restaurante_id', convertedId)
            .order('categoria');

        console.log(`🔍 Primera búsqueda - Error: ${!!error}, Resultados: ${productsWithSizes?.length || 0}`);

        if (error || !productsWithSizes || productsWithSizes.length === 0) {
            console.log('⚠️ No encontrados con UUID convertido, intentando con ID original...');
            
            // ✅ INTENTAR CON ID ORIGINAL (para restaurantes antiguos)
            const { data: productsWithSizesOriginal, error: errorOriginal } = await supabase
                .from('productos')
                .select(`
                    *,
                    producto_sizes (size, price)
                `)
                .eq('restaurante_id', restaurantId)
                .order('categoria');

            console.log(`🔍 Segunda búsqueda (ID original) - Error: ${!!errorOriginal}, Resultados: ${productsWithSizesOriginal?.length || 0}`);

            productsWithSizes = productsWithSizesOriginal;
            error = errorOriginal;
        }

        if (error) {
            console.error('❌ Error obteniendo productos:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener productos'
            });
        }

        console.log(`📥 Productos encontrados FINALES: ${productsWithSizes?.length || 0}`);

        if (!productsWithSizes || productsWithSizes.length === 0) {
            return res.json({
                success: true,
                data: [],
                count: 0
            });
        }

        // ✅ PROCESAR DATOS EN MEMORIA (MÁS RÁPIDO)
        const processedProducts = productsWithSizes.map(product => {
            // Convertir tamaños a objeto { size: price }
            const sizesObj = {};
            if (product.producto_sizes) {
                product.producto_sizes.forEach(size => {
                    sizesObj[size.size] = parseFloat(size.price);
                });
            }

            return {
                id: product.id,
                name: product.nombre,
                description: product.descripcion || '',
                basePrice: parseFloat(product.base_price),
                image: product.image || '',
                rating: parseFloat(product.rating) || 4.5,
                reviews: product.reviews || 0,
                category: product.categoria,
                sizes: sizesObj
            };
        });

        // ✅ DEFINIR ORDEN DE CATEGORÍAS (Productos → Complementos → Bebidas)
        const categoryOrder = [
            'Pizzas', 'Hamburguesas', 'Pollo a la Brasa', 'Pastas', 'Platos Principales',
            'Rolls', 'Sashimi & Niguiri', 'Makis', 'Temakis', 'Wraps', 'Tacos', 'Burritos',
            'Ensaladas', 'Currys', 'Pasteles', 'Donas', 'Aperitivos', 'Cortes',
            'Acompañamientos', 'Breads & Sides',
            'Complementos', 'Basket',
            'Bebidas', 'Bebidas Frías', 'Cafés'
        ];

        // Agrupar por categoría
        const categories = {};
        processedProducts.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = {
                    id: product.category.toLowerCase().replace(/\s+/g, '-'),
                    name: product.category,
                    icon: getCategoryIcon(product.category),
                    products: []
                };
            }
            categories[product.category].products.push(product);
        });

        // ✅ ORDENAR CATEGORÍAS SEGÚN EL ORDEN DEFINIDO
        const categoriesArray = Object.keys(categories)
            .sort((a, b) => {
                const indexA = categoryOrder.indexOf(a);
                const indexB = categoryOrder.indexOf(b);
                const aIndex = indexA >= 0 ? indexA : 999;
                const bIndex = indexB >= 0 ? indexB : 999;
                return aIndex - bIndex;
            })
            .map(key => categories[key]);

        res.json({
            success: true,
            data: categoriesArray,
            count: processedProducts.length
        });

    } catch (error) {
        console.error('💥 Error en controller:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
},

    // ✅ OBTENER PRODUCTO POR ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            
            const { data: product, error } = await supabase
                .from('productos')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !product) {
                return res.status(404).json({
                    success: false,
                    error: 'Producto no encontrado'
                });
            }

            // Obtener tamaños
            const { data: sizes } = await supabase
                .from('producto_sizes')
                .select('size, price')
                .eq('producto_id', id);

            const sizesObj = {};
            sizes.forEach(size => {
                sizesObj[size.size] = parseFloat(size.price);
            });

            const productWithSizes = {
                id: product.id,
                name: product.nombre,
                description: product.descripcion,
                basePrice: parseFloat(product.base_price),
                image: product.image,
                rating: parseFloat(product.rating),
                reviews: product.reviews,
                sizes: sizesObj
            };

            res.json({
                success: true,
                data: productWithSizes
            });

        } catch (error) {
            console.error('💥 Error en controller:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    },

    // ✅ CREAR NUEVO PRODUCTO (para restaurantes)
    async createProduct(req, res) {
        try {
            const restaurantId = req.user.id; // Del token JWT
            const { nombre, descripcion, categoria, base_price, image_url, sizes } = req.body;

            console.log('📝 Creando producto para restaurante:', restaurantId);

            // Validar datos
            if (!nombre || !categoria || !base_price) {
                return res.status(400).json({
                    success: false,
                    error: 'Nombre, categoría y precio son obligatorios'
                });
            }

            // 1. Crear el producto
            const { data: product, error: productError } = await supabase
                .from('productos')
                .insert([{
                    restaurante_id: restaurantId,
                    nombre: nombre,
                    descripcion: descripcion || '',
                    categoria: categoria,
                    base_price: parseFloat(base_price),
                    image: image_url || null,
                    rating: 5.0,
                    reviews: 0
                }])
                .select()
                .single();

            if (productError) {
                console.error('❌ Error creando producto:', productError);
                return res.status(400).json({
                    success: false,
                    error: 'Error al crear producto'
                });
            }

            console.log('✅ Producto creado:', product.id);

            // 2. Si hay tamaños, crearlos
            if (sizes && Array.isArray(sizes) && sizes.length > 0) {
                const sizesToInsert = sizes.map(s => ({
                    producto_id: product.id,
                    size: s.size,
                    price: parseFloat(s.price)
                }));

                const { error: sizesError } = await supabase
                    .from('producto_sizes')
                    .insert(sizesToInsert);

                if (sizesError) {
                    console.error('⚠️ Error creando tamaños:', sizesError);
                }
            }

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
    },

    // ✅ ACTUALIZAR PRODUCTO
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const updates = req.body;

            console.log(`📝 Actualizando producto ${id} por usuario ${userId}`);

            // 1. Obtener el producto
            const { data: product, error: fetchError } = await supabase
                .from('productos')
                .select('*, restaurantes(usuario_id)')
                .eq('id', id)
                .single();

            if (fetchError || !product) {
                return res.status(404).json({
                    success: false,
                    error: 'Producto no encontrado'
                });
            }

            // Verificar propiedad
            if (product.restaurantes.usuario_id !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'No autorizado para actualizar este producto'
                });
            }

            // 2. Actualizar campos permitidos
            const allowedFields = ['nombre', 'descripcion', 'categoria', 'base_price', 'image_url', 'rating', 'reviews'];
            const updateData = {};
            
            allowedFields.forEach(field => {
                if (field in updates) {
                    updateData[field] = updates[field];
                }
            });

            const { error: updateError } = await supabase
                .from('productos')
                .update(updateData)
                .eq('id', id);

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
                    id,
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
    },

    // ✅ ELIMINAR PRODUCTO
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            console.log(`🗑️ Eliminando producto ${id} por usuario ${userId}`);

            // 1. Obtener el producto
            const { data: product, error: fetchError } = await supabase
                .from('productos')
                .select('*, restaurantes(usuario_id)')
                .eq('id', id)
                .single();

            if (fetchError || !product) {
                return res.status(404).json({
                    success: false,
                    error: 'Producto no encontrado'
                });
            }

            // Verificar propiedad
            if (product.restaurantes.usuario_id !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'No autorizado para eliminar este producto'
                });
            }

            // 2. Eliminar tamaños del producto
            await supabase
                .from('producto_sizes')
                .delete()
                .eq('producto_id', id);

            // 3. Eliminar el producto
            const { error: deleteError } = await supabase
                .from('productos')
                .delete()
                .eq('id', id);

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
};
