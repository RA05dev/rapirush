-- ═══════════════════════════════════════════════════════════════════════════════
-- PASO 1: CREAR USUARIOS RESTAURANTES (si no existen)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO tb_usuarios (usuario_id, email, rol, estado, fecha_creacion) VALUES
('f1a0041c-8ee3-4b89-9eb7-65a964321ac1', 'pizzeria@rapirush.com', 'restaurante', 'activo', NOW()),
('ccf55b13-72ef-4a2b-8846-64fcbf2f87ca', 'burgerhouse@rapirush.com', 'restaurante', 'activo', NOW()),
('df6f1628-7ae1-4118-bdf4-7e17c5c85eca', 'sushimaster@rapirush.com', 'restaurante', 'activo', NOW()),
('877a0c02-8368-474f-bc8a-34dbb221024a', 'dulcetentacion@rapirush.com', 'restaurante', 'activo', NOW()),
('0d9aefe0-1d47-44ce-8d10-9bad5722db2c', 'polloperuano@rapirush.com', 'restaurante', 'activo', NOW()),
('2547cde2-2185-4d49-8b73-0bd84f5b134b', 'sushiexpress@rapirush.com', 'restaurante', 'activo', NOW()),
('10000000-0000-0000-0000-000000000007', 'burgerland@rapirush.com', 'restaurante', 'activo', NOW()),
('10000000-0000-0000-0000-000000000008', 'pizzabella@rapirush.com', 'restaurante', 'activo', NOW()),
('10000000-0000-0000-0000-000000000009', 'chifaoriental@rapirush.com', 'restaurante', 'activo', NOW()),
('10000000-0000-0000-0000-00000000000a', 'tacoloco@rapirush.com', 'restaurante', 'activo', NOW()),
('10000000-0000-0000-0000-00000000000b', 'laparrillaargentina@rapirush.com', 'restaurante', 'activo', NOW()),
('10000000-0000-0000-0000-00000000000c', 'veggiedelight@rapirush.com', 'restaurante', 'activo', NOW()),
('10000000-0000-0000-0000-00000000000d', 'currypalace@rapirush.com', 'restaurante', 'activo', NOW()),
('10000000-0000-0000-0000-00000000000e', 'pastafresca@rapirush.com', 'restaurante', 'activo', NOW()),
('10000000-0000-0000-0000-00000000000f', 'donutheaven@rapirush.com', 'restaurante', 'activo', NOW())
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
  true, true, 4.6, 580, NOW()),

-- 7. BurgerLand
('10000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1),
  'BurgerLand', 'burgerland@rapirush.com', '+51 999 888 111',
  'Hamburguesas artesanales y complementos',
  'Av. BurgerLand 404, Miraflores',
  'https://assets.tastemadecdn.net/images/e3fe44/e412b74b19801dcaf972/5e4c40.jpg',
  'Hamburguesas Artesanales', 35, 10.00,
  true, true, 4.5, 320, NOW()),

-- 8. Pizza Bella
('10000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Italiana' LIMIT 1),
  'Pizza Bella', 'pizzabella@rapirush.com', '+51 999 888 999',
  'Pizzas artesanales y pastas caseras',
  'Av. Pizza Bella 505, Surco',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3',
  'Pizzas y Pastas', 35, 10.00,
  true, true, 4.5, 760, NOW()),

-- 9. Chifa Oriental
('10000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1),
  'Chifa Oriental', 'chifaoriental@rapirush.com', '+51 999 888 888',
  'Sabores orientales con recetas tradicionales',
  'Av. Chifa 606, Jesús María',
  'https://img.freepik.com/fotos-premium/cultura-comer-comida-oriental-palillos-como-cubiertos-tradicionales_201836-8325.jpg',
  'Comida Asiática', 35, 10.00,
  true, true, 4.3, 500, NOW()),

-- 10. Taco Loco
('10000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Mexicana' LIMIT 1),
  'Taco Loco', 'tacoloco@rapirush.com', '+51 999 888 777',
  'Tacos, burritos y sabores mexicanos auténticos',
  'Av. Taco 707, San Isidro',
  'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
  'Comida Mexicana', 25, 4.00,
  true, true, 4.5, 210, NOW()),

-- 11. La Parrilla Argentina
('10000000-0000-0000-0000-00000000000b', '10000000-0000-0000-0000-00000000000b',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Comida Rápida' LIMIT 1),
  'La Parrilla Argentina', 'laparrillaargentina@rapirush.com', '+51 999 888 666',
  'Cortes argentinos a la parrilla',
  'Av. Parrilla 808, Miraflores',
  'https://images.pexels.com/photos/105827/pexels-photo-105827.jpeg',
  'Parrilla Argentina', 35, 5.00,
  true, true, 4.7, 340, NOW()),

-- 12. Veggie Delight
('10000000-0000-0000-0000-00000000000c', '10000000-0000-0000-0000-00000000000c',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Vegetariana' LIMIT 1),
  'Veggie Delight', 'veggiedelight@rapirush.com', '+51 999 888 555',
  'Opciones vegetarianas y veganas saludables',
  'Av. Veggie 909, Barranco',
  'https://tse2.mm.bing.net/th/id/OIP.IM4D82GqsgJ9Hg1cjV1WqgHaE7?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Comida Vegetariana', 20, 3.00,
  true, true, 4.4, 150, NOW()),

-- 13. Curry Palace
('10000000-0000-0000-0000-00000000000d', '10000000-0000-0000-0000-00000000000d',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Asiática' LIMIT 1),
  'Curry Palace', 'currypalace@rapirush.com', '+51 999 888 444',
  'Cocina india con currys tradicionales',
  'Av. Curry 1010, San Isidro',
  'https://tse4.mm.bing.net/th/id/OIP.dVTk-vYa2BpQDxEOYNGirAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Cocina India', 30, 4.00,
  true, true, 4.6, 430, NOW()),

-- 14. Pasta Fresca
('10000000-0000-0000-0000-00000000000e', '10000000-0000-0000-0000-00000000000e',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Italiana' LIMIT 1),
  'Pasta Fresca', 'pastafresca@rapirush.com', '+51 999 888 333',
  'Pastas hechas a mano y salsas caseras',
  'Av. Pasta 1111, Miraflores',
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
  'Pastas Italianas', 25, 4.00,
  true, true, 4.7, 290, NOW()),

-- 15. Donut Heaven
('10000000-0000-0000-0000-00000000000f', '10000000-0000-0000-0000-00000000000f',
  (SELECT categoria_id FROM tb_categorias WHERE nombre = 'Postres' LIMIT 1),
  'Donut Heaven', 'donutheaven@rapirush.com', '+51 999 888 222',
  'Donas artesanales y postres creativos',
  'Av. Donuts 1212, Barranco',
  'https://images.pexels.com/photos/31976170/pexels-photo-31976170.jpeg',
  'Donas y Postres', 15, 2.00,
  true, true, 4.8, 500, NOW());
