-- ═══════════════════════════════════════════════════════════════════════════════
-- INSERTAR TAMAÑOS DE PRODUCTOS - TABLA: tb_producto_tamaños - 15 RESTAURANTES
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. LA PIZZERÍA ITALIANA
-- Pizzas: personal, mediano, familiar (1.0, 1.56, 1.96)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza Margherita' LIMIT 1), 'personal', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza Margherita' LIMIT 1), 'mediano', 1.56, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza Margherita' LIMIT 1), 'familiar', 1.96, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza Pepperoni' LIMIT 1), 'personal', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza Pepperoni' LIMIT 1), 'mediano', 1.5, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza Pepperoni' LIMIT 1), 'familiar', 1.857, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza Hawaiana' LIMIT 1), 'personal', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza Hawaiana' LIMIT 1), 'mediano', 1.519, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza Hawaiana' LIMIT 1), 'familiar', 1.889, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza 4 Quesos' LIMIT 1), 'personal', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza 4 Quesos' LIMIT 1), 'mediano', 1.467, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pizza 4 Quesos' LIMIT 1), 'familiar', 1.8, true);

-- Bebidas pizzería: 500ml, 1L, 1.5L (1.0, 1.6, 2.4)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Coca Cola' AND restaurante_id = 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1' LIMIT 1), '500ml', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Coca Cola' AND restaurante_id = 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1' LIMIT 1), '1L', 1.6, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Coca Cola' AND restaurante_id = 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1' LIMIT 1), '1.5L', 2.4, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Inca Kola' AND restaurante_id = 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1' LIMIT 1), '500ml', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Inca Kola' AND restaurante_id = 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1' LIMIT 1), '1L', 1.6, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Inca Kola' AND restaurante_id = 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1' LIMIT 1), '1.5L', 2.4, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Agua San Luis' LIMIT 1), '500ml', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Agua San Luis' LIMIT 1), '1L', 1.667, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Agua San Luis' LIMIT 1), '2.5L', 2.667, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Sprite' LIMIT 1), '500ml', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Sprite' LIMIT 1), '1L', 1.6, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Sprite' LIMIT 1), '1.5L', 2.4, true);

-- Complementos pizzería: por cantidad (1.0, 1.67, 2.33 para Pan al Ajo; 1.0, 1.8, 2.4 para Palitos; 1.0, 1.75, 2.375 para Rollos)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pan al Ajo con Queso' LIMIT 1), '4 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pan al Ajo con Queso' LIMIT 1), '8 piezas', 1.667, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pan al Ajo con Queso' LIMIT 1), '12 piezas', 2.333, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Palitos de Mozzarella' LIMIT 1), '6 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Palitos de Mozzarella' LIMIT 1), '10 piezas', 1.467, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Palitos de Mozzarella' LIMIT 1), '15 piezas', 2.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Rollos de Pepperoni' LIMIT 1), '6 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Rollos de Pepperoni' LIMIT 1), '12 piezas', 1.75, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Rollos de Pepperoni' LIMIT 1), '18 piezas', 2.375, true);

-- 2. BURGER HOUSE
-- Hamburguesas: simple/doble/triple (1.0, 1.455, 1.909 para Classic; 1.0, 1.4, 1.8 para BBQ; etc.)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Classic Burger' LIMIT 1), 'simple', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Classic Burger' LIMIT 1), 'doble', 1.455, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Classic Burger' LIMIT 1), 'triple', 1.909, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'BBQ Bacon Burger' LIMIT 1), 'simple', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'BBQ Bacon Burger' LIMIT 1), 'doble', 1.4, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'BBQ Bacon Burger' LIMIT 1), 'triple', 1.8, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Mushroom Swiss' LIMIT 1), 'simple', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Mushroom Swiss' LIMIT 1), 'doble', 1.417, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Mushroom Swiss' LIMIT 1), 'triple', 1.833, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Veggie Deluxe' LIMIT 1), 'simple', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Veggie Deluxe' LIMIT 1), 'doble', 1.5, true);

-- Complementos Burger House: regular/grande/familiar
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Papas Fritas' AND restaurante_id = 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca' LIMIT 1), 'regular', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Papas Fritas' AND restaurante_id = 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca' LIMIT 1), 'grande', 1.5, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Papas Fritas' AND restaurante_id = 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca' LIMIT 1), 'familiar', 1.875, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Aros de Cebolla' LIMIT 1), 'regular', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Aros de Cebolla' LIMIT 1), 'grande', 1.4, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Aros de Cebolla' LIMIT 1), 'familiar', 1.8, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Chicken Wings' LIMIT 1), '6 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Chicken Wings' LIMIT 1), '12 piezas', 1.867, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Chicken Wings' LIMIT 1), '18 piezas', 2.667, true);

-- Bebidas Burger House
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Coca Cola' AND restaurante_id = 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca' LIMIT 1), '500ml', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Coca Cola' AND restaurante_id = 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca' LIMIT 1), '1L', 1.6, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Coca Cola' AND restaurante_id = 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca' LIMIT 1), '1.5L', 2.4, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Milkshake' LIMIT 1), 'regular', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Milkshake' LIMIT 1), 'grande', 1.25, true);

-- 3. SUSHI MASTER
-- Rolls: 8/12/16 piezas (1.0, 1.4, 1.8 para California; 1.0, 1.4, 1.8 para Dragon; 1.0, 1.406, 1.813 para Rainbow)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'California Roll' LIMIT 1), '8 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'California Roll' LIMIT 1), '12 piezas', 1.4, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'California Roll' LIMIT 1), '16 piezas', 1.8, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Dragon Roll' LIMIT 1), '8 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Dragon Roll' LIMIT 1), '12 piezas', 1.4, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Dragon Roll' LIMIT 1), '16 piezas', 1.8, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Rainbow Roll' LIMIT 1), '8 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Rainbow Roll' LIMIT 1), '12 piezas', 1.406, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Rainbow Roll' LIMIT 1), '16 piezas', 1.8125, true);

-- Sashimi & Nigiri
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Sashimi Mixto' LIMIT 1), '9 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Sashimi Mixto' LIMIT 1), '12 piezas', 1.286, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Sashimi Mixto' LIMIT 1), '15 piezas', 1.571, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Niguiri Variado' LIMIT 1), '6 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Niguiri Variado' LIMIT 1), '9 piezas', 1.429, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Niguiri Variado' LIMIT 1), '12 piezas', 1.857, true);

-- Bebidas Sushi Master
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Sake Tradicional' LIMIT 1), '180ml', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Sake Tradicional' LIMIT 1), '360ml', 1.867, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Sake Tradicional' LIMIT 1), '720ml', 3.333, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Té Verde' LIMIT 1), 'individual', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Té Verde' LIMIT 1), 'tetera', 2.4, true);

-- 4. DULCE TENTACIÓN
-- Pasteles: porción/6/12 porciones (1.0, 5.417, 10.0 para Chocolate; 1.0, 5.357, 10.0 para Cheesecake; etc.)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Torta de Chocolate' LIMIT 1), 'porción', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Torta de Chocolate' LIMIT 1), '6 porciones', 5.417, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Torta de Chocolate' LIMIT 1), '12 porciones', 10.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Cheesecake' LIMIT 1), 'porción', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Cheesecake' LIMIT 1), '6 porciones', 5.357, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Cheesecake' LIMIT 1), '12 porciones', 10.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Tiramisú' LIMIT 1), 'porción', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Tiramisú' LIMIT 1), '6 porciones', 5.385, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Tiramisú' LIMIT 1), '12 porciones', 10.0, true);

-- Cafés: 8oz/12oz/16oz (1.0, 1.25, 1.5 para Cappuccino; 1.0, 1.286, 1.571 para Latte; 1.0, 1.222, 1.444 para Mocha)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Cappuccino' LIMIT 1), '8oz', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Cappuccino' LIMIT 1), '12oz', 1.25, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Cappuccino' LIMIT 1), '16oz', 1.5, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Latte' LIMIT 1), '8oz', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Latte' LIMIT 1), '12oz', 1.286, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Latte' LIMIT 1), '16oz', 1.571, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Mocha' LIMIT 1), '8oz', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Mocha' LIMIT 1), '12oz', 1.222, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Mocha' LIMIT 1), '16oz', 1.444, true);

-- Bebidas frías: 16oz/20oz (1.0, 1.25 para Frappé; 1.0, 1.3 para Smoothie)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Frappé' LIMIT 1), '16oz', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Frappé' LIMIT 1), '20oz', 1.25, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Smoothie' LIMIT 1), '16oz', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Smoothie' LIMIT 1), '20oz', 1.3, true);

-- 5. POLLO PERUANO
-- Pollo a la Brasa: 1/4, 1/2, 1 pollo (1.0, 1.778, 3.056 para Pollo a la Brasa; 1.0, 1.8, 2.6 para Broaster)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pollo a la Brasa' LIMIT 1), '1/4 Pollo', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pollo a la Brasa' LIMIT 1), '1/2 Pollo', 1.778, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pollo a la Brasa' LIMIT 1), '1 Pollo', 3.056, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pollo Broaster' LIMIT 1), '6 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pollo Broaster' LIMIT 1), '12 piezas', 1.8, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pollo Broaster' LIMIT 1), '18 piezas', 2.6, true);

-- Complementos Pollo Peruano
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Papas Fritas' AND restaurante_id = '0d9aefe0-1d47-44ce-8d10-9bad5722db2c' LIMIT 1), 'personal', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Papas Fritas' AND restaurante_id = '0d9aefe0-1d47-44ce-8d10-9bad5722db2c' LIMIT 1), 'mediana', 1.5, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Papas Fritas' AND restaurante_id = '0d9aefe0-1d47-44ce-8d10-9bad5722db2c' LIMIT 1), 'familiar', 2.25, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Ensalada Mixta' LIMIT 1), 'personal', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Ensalada Mixta' LIMIT 1), 'familiar', 2.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Cremas' LIMIT 1), '2oz', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Cremas' LIMIT 1), '4oz', 2.0, true);

-- Bebidas Pollo Peruano
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Inca Kola' AND restaurante_id = '0d9aefe0-1d47-44ce-8d10-9bad5722db2c' LIMIT 1), '500ml', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Inca Kola' AND restaurante_id = '0d9aefe0-1d47-44ce-8d10-9bad5722db2c' LIMIT 1), '1L', 1.6, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Inca Kola' AND restaurante_id = '0d9aefe0-1d47-44ce-8d10-9bad5722db2c' LIMIT 1), '1.5L', 2.4, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Chicha Morada' LIMIT 1), '500ml', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Chicha Morada' LIMIT 1), '1L', 1.667, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Chicha Morada' LIMIT 1), '1.5L', 2.333, true);

-- 6. SUSHI EXPRESS
-- Makis: 5/10/15 piezas (1.0, 1.778, 2.5 para Acevichado; 1.0, 1.75, 2.5 para Futo Maki)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Acevichado Roll' LIMIT 1), '5 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Acevichado Roll' LIMIT 1), '10 piezas', 1.778, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Acevichado Roll' LIMIT 1), '15 piezas', 2.5, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Futo Maki' LIMIT 1), '5 piezas', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Futo Maki' LIMIT 1), '10 piezas', 1.75, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Futo Maki' LIMIT 1), '15 piezas', 2.5, true);

-- Temakis: 1/2/3 unidades (1.0, 1.867, 2.667 para Salmón; 1.0, 1.875, 2.625 para Ebi)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Temaki Salmón' LIMIT 1), '1 unidad', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Temaki Salmón' LIMIT 1), '2 unidades', 1.867, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Temaki Salmón' LIMIT 1), '3 unidades', 2.667, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Temaki Ebi' LIMIT 1), '1 unidad', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Temaki Ebi' LIMIT 1), '2 unidades', 1.875, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Temaki Ebi' LIMIT 1), '3 unidades', 2.625, true);

-- Bebidas Sushi Express
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Ramune' LIMIT 1), '200ml', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Té Verde Helado' LIMIT 1), '500ml', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Té Verde Helado' LIMIT 1), '750ml', 1.5, true);

-- 7. BURGERLAND
-- Hamburguesas: simple/doble/triple (1.0, 1.455, 1.909 para Classic; 1.0, 1.4, similar para BBQ; 1.0, 1.5 para Veggie)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Classic Burger' AND restaurante_id = '10000000-0000-0000-0000-000000000007' LIMIT 1), 'simple', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Classic Burger' AND restaurante_id = '10000000-0000-0000-0000-000000000007' LIMIT 1), 'doble', 1.455, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Classic Burger' AND restaurante_id = '10000000-0000-0000-0000-000000000007' LIMIT 1), 'triple', 1.909, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'BBQ Bacon Burger' AND restaurante_id = '10000000-0000-0000-0000-000000000007' LIMIT 1), 'simple', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'BBQ Bacon Burger' AND restaurante_id = '10000000-0000-0000-0000-000000000007' LIMIT 1), 'doble', 1.4, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Veggie Deluxe' AND restaurante_id = '10000000-0000-0000-0000-000000000007' LIMIT 1), 'simple', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Veggie Deluxe' AND restaurante_id = '10000000-0000-0000-0000-000000000007' LIMIT 1), 'doble', 1.5, true);

-- 8. PIZZA BELLA
-- Pizzas: personal/mediano/familiar (1.0, 1.5, 1.929 para Margherita; 1.0, 1.467, 1.867 para Pepperoni)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Margherita Suprema' LIMIT 1), 'personal', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Margherita Suprema' LIMIT 1), 'mediano', 1.5, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Margherita Suprema' LIMIT 1), 'familiar', 1.929, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pepperoni Fiesta' LIMIT 1), 'personal', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pepperoni Fiesta' LIMIT 1), 'mediano', 1.467, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pepperoni Fiesta' LIMIT 1), 'familiar', 1.867, true);

-- Pastas: individual/familiar (1.0, 1.714 para Alfredo; 1.0, 1.8125 para Lasagna)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pasta Alfredo' LIMIT 1), 'individual', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Pasta Alfredo' LIMIT 1), 'familiar', 1.714, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Lasagna de Carne' LIMIT 1), 'individual', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Lasagna de Carne' LIMIT 1), 'familiar', 1.8125, true);

-- 9. CHIFA ORIENTAL
-- Platos: personal/familiar (1.0, 1.818 para Arroz Chaufa; 1.0, 1.833 para Tallarín)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Arroz Chaufa' LIMIT 1), 'personal', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Arroz Chaufa' LIMIT 1), 'familiar', 1.818, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Tallarín Saltado' LIMIT 1), 'personal', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Tallarín Saltado' LIMIT 1), 'familiar', 1.833, true);

-- Aperitivos: unidad/combo (1.0, 2.5 para Wantán)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Wantán Frito' LIMIT 1), 'unidad', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Wantán Frito' LIMIT 1), 'combo', 2.5, true);

-- 10. TACO LOCO
-- Tacos: unidad/trio (1.0, 2.667 para Taco al Pastor; 1.0, 2.571 para Taco de Carnitas)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Taco al Pastor' LIMIT 1), 'unidad', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Taco al Pastor' LIMIT 1), 'trio', 2.667, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Taco de Carnitas' LIMIT 1), 'unidad', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Taco de Carnitas' LIMIT 1), 'trio', 2.571, true);

-- Burritos: regular/grande (1.0, 1.364)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Burrito Clásico' LIMIT 1), 'regular', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Burrito Clásico' LIMIT 1), 'grande', 1.364, true);

-- 11. LA PARRILLA ARGENTINA
-- Cortes: individual (sin tamaños variables para carnes)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Bife de Chorizo' LIMIT 1), 'individual', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Entraña' LIMIT 1), 'individual', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Papas a la Provenzal' LIMIT 1), 'racion', 1.0, true);

-- 12. VEGGIE DELIGHT
-- Ensaladas & Bowls: individual (sin tamaños variables)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Ensalada César Veggie' LIMIT 1), 'individual', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Bowl Protein' LIMIT 1), 'individual', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Wrap Mediterráneo' LIMIT 1), 'regular', 1.0, true);

-- 13. CURRY PALACE
-- Currys: individual/familiar (1.0, 1.857 para Chicken Curry; 1.0 para Paneer)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Chicken Curry' LIMIT 1), 'individual', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Chicken Curry' LIMIT 1), 'familiar', 1.857, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Paneer Tikka Masala' LIMIT 1), 'individual', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Naan de Ajo' LIMIT 1), 'unidad', 1.0, true);

-- 14. PASTA FRESCA
-- Pastas: individual (sin tamaños variables)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Spaghetti Carbonara' LIMIT 1), 'individual', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Ravioli de Ricotta' LIMIT 1), 'individual', 1.0, true);

-- 15. DONUT HEAVEN
-- Donas: unidad/caja6 (1.0, 5.0 para Glaseado; 1.0, 4.8 para Chocolate Deluxe)
INSERT INTO tb_producto_tamaños (producto_id, nombre_tamaño, multiplicador_precio, es_disponible) VALUES
((SELECT producto_id FROM tb_productos WHERE nombre = 'Donut Glaseado' LIMIT 1), 'unidad', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Donut Glaseado' LIMIT 1), 'caja6', 5.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Donut Chocolate Deluxe' LIMIT 1), 'unidad', 1.0, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Donut Chocolate Deluxe' LIMIT 1), 'caja6', 4.8, true),
((SELECT producto_id FROM tb_productos WHERE nombre = 'Café Espresso' LIMIT 1), '8oz', 1.0, true);
