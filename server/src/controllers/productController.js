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
        
        // ✅ CONVERTIR ID NUMÉRICO A UUID
        restaurantId = convertToUUID(restaurantId);
        console.log(`🔄 ID convertido: ${restaurantId}`);
        
        // ✅ UNA SOLA CONSULTA CON JOIN (MUCHO MÁS RÁPIDO)
        const { data: productsWithSizes, error } = await supabase
            .from('productos')
            .select(`
                *,
                producto_sizes (size, price)
            `)
            .eq('restaurante_id', restaurantId)
            .order('categoria');

        if (error) {
            console.error('❌ Error obteniendo productos:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener productos'
            });
        }

        console.log(`📥 Productos encontrados: ${productsWithSizes?.length || 0}`);

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

        const categoriesArray = Object.values(categories);

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
    }
};