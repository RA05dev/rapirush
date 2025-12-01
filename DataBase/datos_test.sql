



--TEST DE DATOS
-- ═══════════════════════════════════════════════════════════════════════════════
-- PASO 1: CREAR USUARIOS RESTAURANTES (si no existen)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO tb_usuarios (usuario_id, email, rol, estado, fecha_creacion) VALUES
('f1a0041c-8ee3-4b89-9eb7-65a964321ac1', 'pizzeria@rapirush.com', 'restaurante', 'activo', NOW()),
('ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', 'burgerhouse@rapirush.com', 'restaurante', 'activo', NOW()),
('df6f1628-7ae1-4118-bdf4-7e17c5c85eca', 'sushimaster@rapirush.com', 'restaurante', 'activo', NOW()),
('877a0c02-8368-474f-bc8a-34dbb221024a', 'dulcetentacion@rapirush.com', 'restaurante', 'activo', NOW()),
('0d9aefe0-1d47-44ce-8d10-9bad5722db2c', 'polloperuano@rapirush.com', 'restaurante', 'activo', NOW()),
('2547cde2-2185-4d49-8b73-0bd84f5b134b', 'sushiexpress@rapirush.com', 'restaurante', 'activo', NOW())

ON CONFLICT (usuario_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PASO 2: INSERTAR RESTAURANTES CON TODOS LOS DATOS COMPLETOS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO tb_restaurantes 
(restaurante_id, usuario_id, categoria_id, restaurante_nombre, restaurante_email, restaurante_telefono, restaurante_descripcion, restaurante_direccion, restaurante_url, tipo_comida, tiempo_delivery, delivery_cost, es_abierto, es_verificado, calificacion_promedio, numero_reviews, fecha_creacion) 
VALUES

-- 1. La Pizzería Italiana
('f1a0041c-8ee3-4b89-9eb7-65a964321ac1', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', 
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Italiana' LIMIT 1),
  'La Pizzería Italiana', 'pizzeria@rapirush.com', '+51 999 888 777', 
  'Las mejores pizzas artesanales con ingredientes frescos y de calidad',
  'Av. Pizza 123, Miraflores',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3',
  'Pizzería Italiana', 35, 5.00,
  true, true, 4.8, 520, NOW()),

-- 2. Burger House
('ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1),
  'Burger House', 'burgerhouse@rapirush.com', '+51 999 888 666',
  'Las mejores hamburguesas gourmet de la ciudad',
  'Av. Burger 456, San Miguel',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3',
  'Comida Rápida', 30, 4.00,
  true, true, 4.7, 480, NOW()),

-- 3. Sushi Master
('df6f1628-7ae1-4118-bdf4-7e17c5c85eca', 'df6f1628-7ae1-4118-bdf4-7e17c5c85eca',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1),
  'Sushi Master', 'sushimaster@rapirush.com', '+51 999 888 555',
  'Auténtico sushi japonés con ingredientes premium',
  'Av. Sushi 789, San Isidro',
  'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3',
  'Sushi Japonés', 45, 6.00,
  true, true, 4.8, 620, NOW()),

-- 4. Dulce Tentación
('877a0c02-8368-474f-bc8a-34dbb221024a', '877a0c02-8368-474f-bc8a-34dbb221024a',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Postres' LIMIT 1),
  'Dulce Tentación', 'dulcetentacion@rapirush.com', '+51 999 888 444',
  'Los mejores postres y café de especialidad',
  'Av. Postres 101, Barranco',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3',
  'Postres y Café', 25, 4.00,
  true, true, 4.9, 750, NOW()),

-- 5. Pollo Peruano
('0d9aefe0-1d47-44ce-8d10-9bad5722db2c', '0d9aefe0-1d47-44ce-8d10-9bad5722db2c',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1),
  'Pollo Peruano', 'polloperuano@rapirush.com', '+51 999 888 333',
  'El auténtico pollo a la brasa peruano',
  'Av. Pollo 202, Surco',
  'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3',
  'Pollo a la Brasa', 40, 5.00,
  true, true, 4.7, 820, NOW()),

-- 6. Sushi Express
('2547cde2-2185-4d49-8b73-0bd84f5b134b', '2547cde2-2185-4d49-8b73-0bd84f5b134b',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1),
  'Sushi Express', 'sushiexpress@rapirush.com', '+51 999 888 222',
  'Sushi fresco y rápido a tu puerta',
  'Av. Sushi Express 303, Jesús María',
  'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3',
  'Sushi Rápido', 32, 5.00,
  true, true, 4.6, 580, NOW());



  -- ═══════════════════════════════════════════════════════════════════════════════
-- INSERTAR PRODUCTOS - TABLA: tb_productos - 6 RESTAURANTES COMPLETOS
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. LA PIZZERÍA ITALIANA (restaurante_id: f1a0041c-8ee3-4b89-9eb7-65a964321ac1)
INSERT INTO tb_productos (producto_id, restaurante_id, categoria_id, nombre, descripcion, precio, es_disponible, imagen_url, fecha_creacion) VALUES
('10000001-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Italiana' LIMIT 1), 'Pizza Margherita', 'Salsa de tomate, mozzarella fresca, albahaca y aceite de oliva extra virgen', 25.00, true, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3', NOW()),
('10000002-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Italiana' LIMIT 1), 'Pizza Pepperoni', 'Salsa de tomate, mozzarella y abundante pepperoni premium', 28.00, true, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3', NOW()),
('10000003-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Italiana' LIMIT 1), 'Pizza Hawaiana', 'Salsa de tomate, mozzarella, jamón y piña caramelizada', 27.00, true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3', NOW()),
('10000004-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Italiana' LIMIT 1), 'Pizza 4 Quesos', 'Mozzarella, gorgonzola, parmesano y provolone', 30.00, true, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3', NOW()),
('10000005-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Coca Cola', 'Bebida gaseosa refrescante', 5.00, true, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3', NOW()),
('10000006-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Inca Kola', 'Bebida gaseosa peruana', 5.00, true, 'https://www.wanta.pe/Multimedia/productos/twitter/INCA_KOLA_SIN_AZUCAR_1_5_L_202404101741494232.PNG', NOW()),
('10000007-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Agua San Luis', 'Agua mineral sin gas', 3.00, true, 'https://kyotorolls.com/cdn/shop/products/AguaSanLuis500ml.png?v=1674193335', NOW()),
('10000008-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Sprite', 'Gaseosa sabor lima limón', 5.00, true, 'https://ams3.digitaloceanspaces.com/graffica/2022/05/Sprite-Dieline-can-reg-1024x614.jpeg', NOW()),
('10000009-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Pan al Ajo con Queso', 'Pan artesanal con mantequilla de ajo, mozzarella gratinada y hierbas italianas', 12.00, true, 'https://storage.googleapis.com/avena-recipes-v2/2019/10/1571783574005.jpeg', NOW()),
('10000010-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Palitos de Mozzarella', 'Bastones de queso mozzarella empanizados con salsa marinara', 15.00, true, 'https://lambweston.scene7.com/is/image/lambweston/30429_LW-Suprema-Mozzarella-Sticks-Parchment?$ProductImage$', NOW()),
('10000011-0000-0000-0000-000000000001', 'f1a0041c-8ee3-4b89-9eb7-65a964321ac1', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Rollos de Pepperoni', 'Rollos de masa rellenos de pepperoni y queso, con aderezo ranch', 16.00, true, 'https://www.papajohns.com.pe/media/catalog/product/s/o/sol_6639_2.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg', NOW());

-- 2. BURGER HOUSE (restaurante_id: ccf55b13-72ef-4a2b-8846-64fcbf2f87ca)
INSERT INTO tb_productos (producto_id, restaurante_id, categoria_id, nombre, descripcion, precio, es_disponible, imagen_url, fecha_creacion) VALUES
('20000001-0000-0000-0000-000000000001', 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Classic Burger', 'Carne 100% de res, queso cheddar, lechuga, tomate y salsa especial', 22.00, true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3', NOW()),
('20000002-0000-0000-0000-000000000001', 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'BBQ Bacon Burger', 'Carne de res, tocino crujiente, queso, aros de cebolla y salsa BBQ', 25.00, true, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3', NOW()),
('20000003-0000-0000-0000-000000000001', 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Mushroom Swiss', 'Carne de res, champiñones salteados, queso suizo y mayonesa de ajo', 24.00, true, 'https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-4.0.3', NOW()),
('20000004-0000-0000-0000-000000000001', 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Vegetariana' LIMIT 1), 'Veggie Deluxe', 'Hamburguesa de garbanzos y quinoa, aguacate, rúcula y alioli', 20.00, true, 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?ixlib=rb-4.0.3', NOW()),
('20000005-0000-0000-0000-000000000001', 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Papas Fritas', 'Papas crujientes con sal marina', 8.00, true, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3', NOW()),
('20000006-0000-0000-0000-000000000001', 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Aros de Cebolla', 'Aros de cebolla empanizados con salsa ranch', 10.00, true, 'https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-4.0.3', NOW()),
('20000007-0000-0000-0000-000000000001', 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Chicken Wings', 'Alitas de pollo en salsa BBQ o Buffalo', 15.00, true, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3', NOW()),
('20000008-0000-0000-0000-000000000001', 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Coca Cola', 'Bebida gaseosa refrescante', 5.00, true, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3', NOW()),
('20000009-0000-0000-0000-000000000001', 'ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Milkshake', 'Batido cremoso (Chocolate, Vainilla o Fresa)', 12.00, true, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-4.0.3', NOW());

-- 3. SUSHI MASTER (restaurante_id: df6f1628-7ae1-4118-bdf4-7e17c5c85eca)
INSERT INTO tb_productos (producto_id, restaurante_id, categoria_id, nombre, descripcion, precio, es_disponible, imagen_url, fecha_creacion) VALUES
('30000001-0000-0000-0000-000000000001', 'df6f1628-7ae1-4118-bdf4-7e17c5c85eca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1), 'California Roll', 'Kanikama, palta, pepino y sésamo', 25.00, true, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3', NOW()),
('30000002-0000-0000-0000-000000000001', 'df6f1628-7ae1-4118-bdf4-7e17c5c85eca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1), 'Dragon Roll', 'Tempura de langostino, palta por fuera y salsa de anguila', 30.00, true, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3', NOW()),
('30000003-0000-0000-0000-000000000001', 'df6f1628-7ae1-4118-bdf4-7e17c5c85eca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1), 'Rainbow Roll', 'Roll california cubierto con variedad de pescados', 32.00, true, 'https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-4.0.3', NOW()),
('30000004-0000-0000-0000-000000000001', 'df6f1628-7ae1-4118-bdf4-7e17c5c85eca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1), 'Sashimi Mixto', 'Cortes frescos de salmón, atún y pescado blanco', 35.00, true, 'https://images.unsplash.com/photo-1534482421-64566f976cfa?ixlib=rb-4.0.3', NOW()),
('30000005-0000-0000-0000-000000000001', 'df6f1628-7ae1-4118-bdf4-7e17c5c85eca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1), 'Niguiri Variado', 'Selección de niguiris con diferentes pescados', 28.00, true, 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3', NOW()),
('30000006-0000-0000-0000-000000000001', 'df6f1628-7ae1-4118-bdf4-7e17c5c85eca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Sake Tradicional', 'Vino de arroz japonés', 15.00, true, 'https://www.vintecclub.com/globalassets/hot-sake.jpg', NOW()),
('30000007-0000-0000-0000-000000000001', 'df6f1628-7ae1-4118-bdf4-7e17c5c85eca', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Té Verde', 'Té japonés caliente', 5.00, true, 'https://www.bupasalud.com/sites/default/files/styles/640_x_400/public/articulos/2024-04/fotos/beneficios-te-verde-1.jpeg?itok=nbCJBFBA', NOW());

-- 4. DULCE TENTACIÓN (restaurante_id: 877a0c02-8368-474f-bc8a-34dbb221024a)
INSERT INTO tb_productos (producto_id, restaurante_id, categoria_id, nombre, descripcion, precio, es_disponible, imagen_url, fecha_creacion) VALUES
('40000001-0000-0000-0000-000000000001', '877a0c02-8368-474f-bc8a-34dbb221024a', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Postres' LIMIT 1), 'Torta de Chocolate', 'Bizcocho de chocolate con ganache y frutos rojos', 12.00, true, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3', NOW()),
('40000002-0000-0000-0000-000000000001', '877a0c02-8368-474f-bc8a-34dbb221024a', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Postres' LIMIT 1), 'Cheesecake', 'Con base de galleta y cobertura de frutos rojos', 14.00, true, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3', NOW()),
('40000003-0000-0000-0000-000000000001', '877a0c02-8368-474f-bc8a-34dbb221024a', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Postres' LIMIT 1), 'Tiramisú', 'Postre italiano con café y mascarpone', 13.00, true, 'https://mediterraneantaste.com/wp-content/uploads/2023/11/tiramisu-4583.jpg', NOW()),
('40000004-0000-0000-0000-000000000001', '877a0c02-8368-474f-bc8a-34dbb221024a', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Cappuccino', 'Café espresso con leche cremada y cacao', 8.00, true, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3', NOW()),
('40000005-0000-0000-0000-000000000001', '877a0c02-8368-474f-bc8a-34dbb221024a', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Latte', 'Café espresso con leche vaporizada', 7.00, true, 'https://images.ctfassets.net/0e6jqcgsrcye/53teNK4AvvmFIkFLtEJSEx/4d3751dcad227c87b3cf6bda955b1649/Cafe_au_lait.jpg', NOW()),
('40000006-0000-0000-0000-000000000001', '877a0c02-8368-474f-bc8a-34dbb221024a', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Mocha', 'Café espresso con chocolate y leche', 9.00, true, 'https://ichef.bbc.co.uk/ace/standard/1600/food/recipes/the_perfect_mocha_coffee_29100_16x9.jpg.webp', NOW()),
('40000007-0000-0000-0000-000000000001', '877a0c02-8368-474f-bc8a-34dbb221024a', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Frappé', 'Bebida helada de café con crema batida', 12.00, true, 'https://images.unsplash.com/photo-1586195831800-24f14c992cea?ixlib=rb-4.0.3', NOW()),
('40000008-0000-0000-0000-000000000001', '877a0c02-8368-474f-bc8a-34dbb221024a', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Smoothie', 'Batido de frutas naturales', 10.00, true, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3', NOW());

-- 5. POLLO PERUANO (restaurante_id: 0d9aefe0-1d47-44ce-8d10-9bad5722db2c)
INSERT INTO tb_productos (producto_id, restaurante_id, categoria_id, nombre, descripcion, precio, es_disponible, imagen_url, fecha_creacion) VALUES
('50000001-0000-0000-0000-000000000001', '0d9aefe0-1d47-44ce-8d10-9bad5722db2c', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Pollo a la Brasa', 'Pollo marinado y asado a la leña con papas fritas y ensalada', 18.00, true, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3', NOW()),
('50000002-0000-0000-0000-000000000001', '0d9aefe0-1d47-44ce-8d10-9bad5722db2c', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Pollo Broaster', 'Pollo frito crujiente con papas y ensalada', 25.00, true, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3', NOW()),
('50000003-0000-0000-0000-000000000001', '0d9aefe0-1d47-44ce-8d10-9bad5722db2c', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Papas Fritas', 'Papas cortadas y fritas en el momento', 8.00, true, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3', NOW()),
('50000004-0000-0000-0000-000000000001', '0d9aefe0-1d47-44ce-8d10-9bad5722db2c', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Ensalada Mixta', 'Lechuga, tomate, pepino, zanahoria y vinagreta', 6.00, true, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3', NOW()),
('50000005-0000-0000-0000-000000000001', '0d9aefe0-1d47-44ce-8d10-9bad5722db2c', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1), 'Cremas', 'Ají especial, mayonesa, kétchup o mostaza', 1.00, true, 'https://i.dietdoctor.com/es/wp-content/uploads/2020/06/grasas-y-salsas.jpg?auto=compress%2Cformat&w=800&h=450&fit=crop', NOW()),
('50000006-0000-0000-0000-000000000001', '0d9aefe0-1d47-44ce-8d10-9bad5722db2c', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Inca Kola', 'La bebida del Perú', 5.00, true, 'https://www.wanta.pe/Multimedia/productos/twitter/INCA_KOLA_SIN_AZUCAR_1_5_L_202404101741494232.PNG', NOW()),
('50000007-0000-0000-0000-000000000001', '0d9aefe0-1d47-44ce-8d10-9bad5722db2c', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Chicha Morada', 'Bebida tradicional de maíz morado', 6.00, true, 'https://polleriaslagranja.com/wp-content/uploads/2022/10/La-Granja-Real-Food-Chicken-Jarra-de-Chicha-Morada.png', NOW());

-- 6. SUSHI EXPRESS (restaurante_id: 2547cde2-2185-4d49-8b73-0bd84f5b134b)
INSERT INTO tb_productos (producto_id, restaurante_id, categoria_id, nombre, descripcion, precio, es_disponible, imagen_url, fecha_creacion) VALUES
('60000001-0000-0000-0000-000000000001', '2547cde2-2185-4d49-8b73-0bd84f5b134b', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1), 'Acevichado Roll', 'Roll de langostino tempura, palta y salsa acevichada', 18.00, true, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3', NOW()),
('60000002-0000-0000-0000-000000000001', '2547cde2-2185-4d49-8b73-0bd84f5b134b', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1), 'Futo Maki', 'Roll grande con tamago, kanikama, pepino y aguacate', 16.00, true, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3', NOW()),
('60000003-0000-0000-0000-000000000001', '2547cde2-2185-4d49-8b73-0bd84f5b134b', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1), 'Temaki Salmón', 'Cono de alga con salmón, palta y queso', 15.00, true, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3', NOW()),
('60000004-0000-0000-0000-000000000001', '2547cde2-2185-4d49-8b73-0bd84f5b134b', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1), 'Temaki Ebi', 'Cono con langostino tempura y palta', 16.00, true, 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3', NOW()),
('60000005-0000-0000-0000-000000000001', '2547cde2-2185-4d49-8b73-0bd84f5b134b', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Ramune', 'Refresco japonés', 8.00, true, 'https://cdn.shopify.com/s/files/1/0613/0437/3481/articles/Yuzu_Ramune.jpg?v=1678194298', NOW()),
('60000006-0000-0000-0000-000000000001', '2547cde2-2185-4d49-8b73-0bd84f5b134b', (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Bebidas' LIMIT 1), 'Té Verde Helado', 'Té verde con un toque de miel', 6.00, true, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3', NOW());



-- ═══════════════════════════════════════════════════════════════════════════════
-- INSERTAR TAMAÑOS DE PRODUCTOS - TABLA: tb_producto_tamaños - 6 RESTAURANTES
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

