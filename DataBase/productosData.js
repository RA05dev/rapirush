// assets/js/restaurantData.js
const restaurantData = [
  // 1 LA PIZZERÍA ITALIANA
  {
    id: 1,
    name: "La Pizzería Italiana",
    description: "Las mejores pizzas artesanales con ingredientes frescos y de calidad",
    rating: 4.8,
    reviews: 520,
    deliveryTime: "30-45 min",
    deliveryCost: 5,
    categories: [
      {
        id: "pizzas",
        name: "Pizzas",
        icon: "bi bi-pizza",
        products: [
          {
            name: "Pizza Margherita",
            description: "Salsa de tomate, mozzarella fresca, albahaca y aceite de oliva extra virgen",
            basePrice: 25,
            sizes: {
              personal: 25.00,
              mediano: 39.00,
              familiar: 49.00
            },
            rating: 4.9,
            reviews: 320,
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3"
          },
          {
            name: "Pizza Pepperoni",
            description: "Salsa de tomate, mozzarella y abundante pepperoni premium",
            basePrice: 28,
            sizes: {
              personal: 28.00,
              mediano: 42.00,
              familiar: 52.00
            },
            rating: 4.8,
            reviews: 280,
            image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3"
          },
          {
            name: "Pizza Hawaiana",
            description: "Salsa de tomate, mozzarella, jamón y piña caramelizada",
            basePrice: 27,
            sizes: {
              personal: 27.00,
              mediano: 41.00,
              familiar: 51.00
            },
            rating: 4.7,
            reviews: 240,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3"
          },
          {
            name: "Pizza 4 Quesos",
            description: "Mozzarella, gorgonzola, parmesano y provolone",
            basePrice: 30,
            sizes: {
              personal: 30.00,
              mediano: 44.00,
              familiar: 54.00
            },
            rating: 4.8,
            reviews: 260,
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3"
          }
        ]
      },
      { 
        id: "bebidas", 
        name: "Bebidas", 
        icon: "bi bi-cup-straw", 
        products: [
          {
            name: "Coca Cola",
            description: "Bebida gaseosa refrescante",
            sizes: {
              "500ml": 5.00,
              "1L": 8.00,
              "1.5L": 12.00
            },
            basePrice: 5,
            rating: 4.9,
            reviews: 180,
            image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3"
          },
          {
            name: "Inca Kola",
            description: "Bebida gaseosa peruana",
            sizes: {
              "500ml": 5.00,
              "1L": 8.00,
              "1.5L": 12.00
            },
            basePrice: 5,
            rating: 4.9,
            reviews: 160,
            image: "https://www.wanta.pe/Multimedia/productos/twitter/INCA_KOLA_SIN_AZUCAR_1_5_L_202404101741494232.PNG"
          },
          {
            name: "Agua San Luis",
            description: "Agua mineral sin gas",
            sizes: {
              "500ml": 3.00,
              "1L": 5.00,
              "2.5L": 8.00
            },
            basePrice: 3,
            rating: 4.8,
            reviews: 120,
            image: "https://kyotorolls.com/cdn/shop/products/AguaSanLuis500ml.png?v=1674193335"
          },
          {
            name: "Sprite",
            description: "Gaseosa sabor lima limón",
            sizes: {
              "500ml": 5.00,
              "1L": 8.00,
              "1.5L": 12.00
            },
            basePrice: 5,
            rating: 4.7,
            reviews: 150,
            image: "https://ams3.digitaloceanspaces.com/graffica/2022/05/Sprite-Dieline-can-reg-1024x614.jpeg"
          }
        ] 
      },
      {
        id: "complementos",
        name: "Complementos",
        icon: "bi bi-basket-fill",
        products: [
          {
            name: "Pan al Ajo con Queso",
            description: "Pan artesanal con mantequilla de ajo, mozzarella gratinada y hierbas italianas",
            sizes: {
              "4 piezas": 12.00,
              "8 piezas": 20.00,
              "12 piezas": 28.00
            },
            basePrice: 12,
            rating: 4.8,
            reviews: 150,
            image: "https://storage.googleapis.com/avena-recipes-v2/2019/10/1571783574005.jpeg"
          },
          {
            name: "Palitos de Mozzarella",
            description: "Bastones de queso mozzarella empanizados con salsa marinara",
            sizes: {
              "6 piezas": 15.00,
              "10 piezas": 22.00,
              "15 piezas": 30.00
            },
            basePrice: 15,
            rating: 4.9,
            reviews: 180,
            image: "https://lambweston.scene7.com/is/image/lambweston/30429_LW-Suprema-Mozzarella-Sticks-Parchment?$ProductImage$"
          },
          {
            name: "Rollos de Pepperoni",
            description: "Rollos de masa rellenos de pepperoni y queso, con aderezo ranch",
            sizes: {
              "6 piezas": 16.00,
              "12 piezas": 28.00,
              "18 piezas": 38.00
            },
            basePrice: 16,
            rating: 4.7,
            reviews: 160,
            image: "https://www.papajohns.com.pe/media/catalog/product/s/o/sol_6639_2.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg"
          },         
        ]
      }
    ]
  },
  // 2 BURGER HOUSE
  {
    id: 2,
    name: "Burger House",
    description: "Las mejores hamburguesas gourmet de la ciudad",
    rating: 4.7,
    reviews: 480,
    deliveryTime: "25-40 min",
    deliveryCost: 4,
    categories: [
      {
        id: "hamburguesas",
        name: "Hamburguesas",
        icon: "bi bi-burger",
        products: [
          {
            name: "Classic Burger",
            description: "Carne 100% de res, queso cheddar, lechuga, tomate y salsa especial",
            basePrice: 22,
            sizes: {
              "simple": 22.00,
              "doble": 32.00,
              "triple": 42.00
            },
            rating: 4.8,
            reviews: 280,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3"
          },
          {
            name: "BBQ Bacon Burger",
            description: "Carne de res, tocino crujiente, queso, aros de cebolla y salsa BBQ",
            basePrice: 25,
            sizes: {
              "simple": 25.00,
              "doble": 35.00,
              "triple": 45.00
            },
            rating: 4.9,
            reviews: 320,
            image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3"
          },
          {
            name: "Mushroom Swiss",
            description: "Carne de res, champiñones salteados, queso suizo y mayonesa de ajo",
            basePrice: 24,
            sizes: {
              "simple": 24.00,
              "doble": 34.00,
              "triple": 44.00
            },
            rating: 4.7,
            reviews: 250,
            image: "https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-4.0.3"
          },
          {
            name: "Veggie Deluxe",
            description: "Hamburguesa de garbanzos y quinoa, aguacate, rúcula y alioli",
            basePrice: 20,
            sizes: {
              "simple": 20.00,
              "doble": 30.00
            },
            rating: 4.6,
            reviews: 180,
            image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?ixlib=rb-4.0.3"
          }
        ]
      },
      {
        id: "complementos",
        name: "Complementos",
        icon: "bi bi-box",
        products: [
          {
            name: "Papas Fritas",
            description: "Papas crujientes con sal marina",
            sizes: {
              "regular": 8.00,
              "grande": 12.00,
              "familiar": 15.00
            },
            basePrice: 8,
            rating: 4.8,
            reviews: 220,
            image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3"
          },
          {
            name: "Aros de Cebolla",
            description: "Aros de cebolla empanizados con salsa ranch",
            sizes: {
              "regular": 10.00,
              "grande": 14.00,
              "familiar": 18.00
            },
            basePrice: 10,
            rating: 4.7,
            reviews: 180,
            image: "https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-4.0.3"
          },
          {
            name: "Chicken Wings",
            description: "Alitas de pollo en salsa BBQ o Buffalo",
            sizes: {
              "6 piezas": 15.00,
              "12 piezas": 28.00,
              "18 piezas": 40.00
            },
            basePrice: 15,
            rating: 4.9,
            reviews: 240,
            image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3"
          }
        ]
      },
      {
        id: "bebidas",
        name: "Bebidas",
        icon: "bi bi-cup-straw",
        products: [
          {
            name: "Coca Cola",
            description: "Bebida gaseosa refrescante",
            sizes: {
              "500ml": 5.00,
              "1L": 8.00,
              "1.5L": 12.00
            },
            basePrice: 5,
            rating: 4.8,
            reviews: 150,
            image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3"
          },
          {
            name: "Milkshake",
            description: "Batido cremoso (Chocolate, Vainilla o Fresa)",
            sizes: {
              "regular": 12.00,
              "grande": 15.00
            },
            basePrice: 12,
            rating: 4.9,
            reviews: 180,
            image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-4.0.3"
          }
        ]
      }
    ]
  },
  // 3 SUSHI MASTER
  {
    id: 3,
    name: "Sushi Master",
    description: "Auténtico sushi japonés con ingredientes premium",
    rating: 4.8,
    reviews: 620,
    deliveryTime: "35-50 min",
    deliveryCost: 6,
    categories: [
      {
        id: "rolls",
        name: "Rolls",
        icon: "bi bi-snow",
        products: [
          {
            name: "California Roll",
            description: "Kanikama, palta, pepino y sésamo",
            sizes: {
              "8 piezas": 25.00,
              "12 piezas": 35.00,
              "16 piezas": 45.00
            },
            basePrice: 25,
            rating: 4.8,
            reviews: 280,
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3"
          },
          {
            name: "Dragon Roll",
            description: "Tempura de langostino, palta por fuera y salsa de anguila",
            sizes: {
              "8 piezas": 30.00,
              "12 piezas": 42.00,
              "16 piezas": 54.00
            },
            basePrice: 30,
            rating: 4.9,
            reviews: 320,
            image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3"
          },
          {
            name: "Rainbow Roll",
            description: "Roll california cubierto con variedad de pescados",
            sizes: {
              "8 piezas": 32.00,
              "12 piezas": 45.00,
              "16 piezas": 58.00
            },
            basePrice: 32,
            rating: 4.7,
            reviews: 260,
            image: "https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-4.0.3"
          }
        ]
      },
      {
        id: "sashimi",
        name: "Sashimi & Niguiri",
        icon: "bi bi-tsunami",
        products: [
          {
            name: "Sashimi Mixto",
            description: "Cortes frescos de salmón, atún y pescado blanco",
            sizes: {
              "9 piezas": 35.00,
              "12 piezas": 45.00,
              "15 piezas": 55.00
            },
            basePrice: 35,
            rating: 4.9,
            reviews: 220,
            image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?ixlib=rb-4.0.3"
          },
          {
            name: "Niguiri Variado",
            description: "Selección de niguiris con diferentes pescados",
            sizes: {
              "6 piezas": 28.00,
              "9 piezas": 40.00,
              "12 piezas": 52.00
            },
            basePrice: 28,
            rating: 4.8,
            reviews: 180,
            image: "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3"
          }
        ]
      },
      {
        id: "bebidas",
        name: "Bebidas",
        icon: "bi bi-cup-straw",
        products: [
          {
            name: "Sake Tradicional",
            description: "Vino de arroz japonés",
            sizes: {
              "180ml": 15.00,
              "360ml": 28.00,
              "720ml": 50.00
            },
            basePrice: 15,
            rating: 4.7,
            reviews: 150,
            image: "https://www.vintecclub.com/globalassets/hot-sake.jpg"
          },
          {
            name: "Té Verde",
            description: "Té japonés caliente",
            sizes: {
              "individual": 5.00,
              "tetera": 12.00
            },
            basePrice: 5,
            rating: 4.6,
            reviews: 120,
            image: "https://www.bupasalud.com/sites/default/files/styles/640_x_400/public/articulos/2024-04/fotos/beneficios-te-verde-1.jpeg?itok=nbCJBFBA"
          }
        ]
      }
    ]
  },
  // 4 DULCE TENTACION
  {
    id: 4,
    name: "Dulce Tentación",
    description: "Los mejores postres y café de especialidad",
    rating: 4.9,
    reviews: 750,
    deliveryTime: "20-35 min",
    deliveryCost: 4,
    categories: [
      {
        id: "pasteles",
        name: "Pasteles",
        icon: "bi bi-cake2",
        products: [
          {
            name: "Torta de Chocolate",
            description: "Bizcocho de chocolate con ganache y frutos rojos",
            sizes: {
              "porción": 12.00,
              "6 porciones": 65.00,
              "12 porciones": 120.00
            },
            basePrice: 12,
            rating: 4.9,
            reviews: 320,
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3"
          },
          {
            name: "Cheesecake",
            description: "Con base de galleta y cobertura de frutos rojos",
            sizes: {
              "porción": 14.00,
              "6 porciones": 75.00,
              "12 porciones": 140.00
            },
            basePrice: 14,
            rating: 4.8,
            reviews: 280,
            image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3"
          },
          {
            name: "Tiramisú",
            description: "Postre italiano con café y mascarpone",
            sizes: {
              "porción": 13.00,
              "6 porciones": 70.00,
              "12 porciones": 130.00
            },
            basePrice: 13,
            rating: 4.9,
            reviews: 260,
            image: "https://mediterraneantaste.com/wp-content/uploads/2023/11/tiramisu-4583.jpg"
          }
        ]
      },
      {
        id: "cafes",
        name: "Cafés",
        icon: "bi bi-cup-hot",
        products: [
          {
            name: "Cappuccino",
            description: "Café espresso con leche cremada y cacao",
            sizes: {
              "8oz": 8.00,
              "12oz": 10.00,
              "16oz": 12.00
            },
            basePrice: 8,
            rating: 4.8,
            reviews: 220,
            image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3"
          },
          {
            name: "Latte",
            description: "Café espresso con leche vaporizada",
            sizes: {
              "8oz": 7.00,
              "12oz": 9.00,
              "16oz": 11.00
            },
            basePrice: 7,
            rating: 4.7,
            reviews: 180,
            image: "https://images.ctfassets.net/0e6jqcgsrcye/53teNK4AvvmFIkFLtEJSEx/4d3751dcad227c87b3cf6bda955b1649/Cafe_au_lait.jpg"
          },
          {
            name: "Mocha",
            description: "Café espresso con chocolate y leche",
            sizes: {
              "8oz": 9.00,
              "12oz": 11.00,
              "16oz": 13.00
            },
            basePrice: 9,
            rating: 4.9,
            reviews: 200,
            image: "https://ichef.bbc.co.uk/ace/standard/1600/food/recipes/the_perfect_mocha_coffee_29100_16x9.jpg.webp"
          }
        ]
      },
      {
        id: "bebidas",
        name: "Bebidas Frías",
        icon: "bi bi-cup-straw",
        products: [
          {
            name: "Frappé",
            description: "Bebida helada de café con crema batida",
            sizes: {
              "16oz": 12.00,
              "20oz": 15.00
            },
            basePrice: 12,
            rating: 4.8,
            reviews: 160,
            image: "https://images.unsplash.com/photo-1586195831800-24f14c992cea?ixlib=rb-4.0.3"
          },
          {
            name: "Smoothie",
            description: "Batido de frutas naturales",
            sizes: {
              "16oz": 10.00,
              "20oz": 13.00
            },
            basePrice: 10,
            rating: 4.7,
            reviews: 140,
            image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3"
          }
        ]
      }
    ]
  },
  // 5 POLLO PERUANO
  {
    id: 5,
    name: "Pollo Peruano",
    description: "El auténtico pollo a la brasa peruano",
    rating: 4.7,
    reviews: 820,
    deliveryTime: "30-45 min",
    deliveryCost: 5,
    categories: [
      {
        id: "pollos",
        name: "Pollo a la Brasa",
        icon: "bi bi-fire",
        products: [
          {
            name: "Pollo a la Brasa",
            description: "Pollo marinado y asado a la leña con papas fritas y ensalada",
            sizes: {
              "1/4 Pollo": 18.00,
              "1/2 Pollo": 32.00,
              "1 Pollo": 55.00
            },
            basePrice: 18,
            rating: 4.9,
            reviews: 420,
            image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3"
          },
          {
            name: "Pollo Broaster",
            description: "Pollo frito crujiente con papas y ensalada",
            sizes: {
              "6 piezas": 25.00,
              "12 piezas": 45.00,
              "18 piezas": 65.00
            },
            basePrice: 25,
            rating: 4.8,
            reviews: 280,
            image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3"
          }
        ]
      },
      {
        id: "complementos",
        name: "Complementos",
        icon: "bi bi-basket",
        products: [
          {
            name: "Papas Fritas",
            description: "Papas cortadas y fritas en el momento",
            sizes: {
              "personal": 8.00,
              "mediana": 12.00,
              "familiar": 18.00
            },
            basePrice: 8,
            rating: 4.7,
            reviews: 180,
            image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3"
          },
          {
            name: "Ensalada Mixta",
            description: "Lechuga, tomate, pepino, zanahoria y vinagreta",
            sizes: {
              "personal": 6.00,
              "familiar": 12.00
            },
            basePrice: 6,
            rating: 4.6,
            reviews: 150,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3"
          },
          {
            name: "Cremas",
            description: "Ají especial, mayonesa, kétchup o mostaza",
            sizes: {
              "2oz": 1.00,
              "4oz": 2.00
            },
            basePrice: 1,
            rating: 4.8,
            reviews: 220,
            image: "https://i.dietdoctor.com/es/wp-content/uploads/2020/06/grasas-y-salsas.jpg?auto=compress%2Cformat&w=800&h=450&fit=crop"
          }
        ]
      },
      {
        id: "bebidas",
        name: "Bebidas",
        icon: "bi bi-cup-straw",
        products: [
          {
            name: "Inca Kola",
            description: "La bebida del Perú",
            sizes: {
              "500ml": 5.00,
              "1L": 8.00,
              "1.5L": 12.00
            },
            basePrice: 5,
            rating: 4.8,
            reviews: 160,
            image: "https://www.wanta.pe/Multimedia/productos/twitter/INCA_KOLA_SIN_AZUCAR_1_5_L_202404101741494232.PNG"
          },
          {
            name: "Chicha Morada",
            description: "Bebida tradicional de maíz morado",
            sizes: {
              "500ml": 6.00,
              "1L": 10.00,
              "1.5L": 14.00
            },
            basePrice: 6,
            rating: 4.9,
            reviews: 190,
            image: "https://polleriaslagranja.com/wp-content/uploads/2022/10/La-Granja-Real-Food-Chicken-Jarra-de-Chicha-Morada.png"
          }
        ]
      }
    ]
  },
  // 6 SUSHI EXPRESS
  {
    id: 6,
    name: "Sushi Express",
    description: "Sushi fresco y rápido a tu puerta",
    rating: 4.6,
    reviews: 580,
    deliveryTime: "25-40 min",
    deliveryCost: 5,
    categories: [
      {
        id: "makis",
        name: "Makis",
        icon: "bi bi-snow",
        products: [
          {
            name: "Acevichado Roll",
            description: "Roll de langostino tempura, palta y salsa acevichada",
            sizes: {
              "5 piezas": 18.00,
              "10 piezas": 32.00,
              "15 piezas": 45.00
            },
            basePrice: 18,
            rating: 4.8,
            reviews: 280,
            image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3"
          },
          {
            name: "Futo Maki",
            description: "Roll grande con tamago, kanikama, pepino y aguacate",
            sizes: {
              "5 piezas": 16.00,
              "10 piezas": 28.00,
              "15 piezas": 40.00
            },
            basePrice: 16,
            rating: 4.7,
            reviews: 220,
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3"
          }
        ]
      },
      {
        id: "temakis",
        name: "Temakis",
        icon: "bi bi-triangle",
        products: [
          {
            name: "Temaki Salmón",
            description: "Cono de alga con salmón, palta y queso",
            sizes: {
              "1 unidad": 15.00,
              "2 unidades": 28.00,
              "3 unidades": 40.00
            },
            basePrice: 15,
            rating: 4.6,
            reviews: 180,
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3"
          },
          {
            name: "Temaki Ebi",
            description: "Cono con langostino tempura y palta",
            sizes: {
              "1 unidad": 16.00,
              "2 unidades": 30.00,
              "3 unidades": 42.00
            },
            basePrice: 16,
            rating: 4.7,
            reviews: 160,
            image: "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3"
          }
        ]
      },
      {
        id: "bebidas",
        name: "Bebidas",
        icon: "bi bi-cup-straw",
        products: [
          {
            name: "Ramune",
            description: "Refresco japonés",
            sizes: {
              "200ml": 8.00
            },
            basePrice: 8,
            rating: 4.5,
            reviews: 120,
            image: "https://cdn.shopify.com/s/files/1/0613/0437/3481/articles/Yuzu_Ramune.jpg?v=1678194298"
          },
          {
            name: "Té Verde Helado",
            description: "Té verde con un toque de miel",
            sizes: {
              "500ml": 6.00,
              "750ml": 9.00
            },
            basePrice: 6,
            rating: 4.6,
            reviews: 140,
            image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3"
          }
        ]
      }
    ]
  },
  // 7 BURGER LAND
  {
    id: 7,
    name: "BurgerLand",
    description: "Hamburguesas artesanales y complementos",
    rating: 4.5,
    reviews: 320,
    deliveryTime: "30-40 min",
    deliveryCost: 10,
    categories: [
      {
        id: "hamburguesas",
        name: "Hamburguesas artesanales",
        icon: "bi bi-burger",
        products: [
          {
            name: "Classic Burger",
            description: "Carne premium, queso, lechuga y tomate",
            basePrice: 22,
            sizes: { simple: 22.00, doble: 32.00, triple: 42.00 },
            rating: 4.8,
            reviews: 280,
            image: "https://assets.tastemadecdn.net/images/e3fe44/e412b74b19801dcaf972/5e4c40.jpg"
          },
          {
            name: "BBQ Bacon Burger",
            description: "Hamburguesa con tocino crujiente, cebolla caramelizada y salsa BBQ",
            basePrice: 25,
            sizes: { simple: 25.00, doble: 35.00 },
            rating: 4.7,
            reviews: 210,
            image: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg"
          },
          {
            name: "Veggie Deluxe",
            description: "Hamburguesa vegetariana de garbanzos y quinoa, con aguacate y rúcula",
            basePrice: 20,
            sizes: { simple: 20.00, doble: 30.00 },
            rating: 4.6,
            reviews: 150,
            image: "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg"
          }
        ]
      }
    ]
  },
  // 8 PIZZA BELLA
  {
    id: 8,
    name: "Pizza Bella",
    description: "Pizzas artesanales y pastas caseras",
    rating: 4.5,
    reviews: 760,
    deliveryTime: "30-40 min",
    deliveryCost: 10,
    categories: [
      {
        id: "pizzas",
        name: "Pizzas",
        icon: "bi bi-pizza",
        products: [
          { name: "Margherita Suprema", description: "Mozzarella fresca, tomate cherry y albahaca", basePrice: 28, sizes: { personal: 28.00, mediano: 42.00, familiar: 54.00 }, rating: 4.8, reviews: 320, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" },
          { name: "Pepperoni Fiesta", description: "Extra pepperoni premium y doble queso", basePrice: 30, sizes: { personal: 30.00, mediano: 44.00, familiar: 56.00 }, rating: 4.7, reviews: 280, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e" }
        ]
      },
      {
        id: "pastas",
        name: "Pastas",
        icon: "bi bi-basket",
        products: [
          { name: "Pasta Alfredo", description: "Pasta con salsa cremosa y queso parmesano", basePrice: 28, sizes: { individual: 28.00, familiar: 48.00 }, rating: 4.6, reviews: 140, image: "https://www.lacocinadelila.com/wp-content/uploads/2022/09/pasta-alfredo-600x450.jpg?v=1664123760" },
          { name: "Lasagna de Carne", description: "Capas de pasta, carne y salsa bechamel", basePrice: 32, sizes: { individual: 32.00, familiar: 58.00 }, rating: 4.8, reviews: 200, image: "https://th.bing.com/th/id/R.44c78be1a4bc8fb1fe18afe821f33f32?rik=Xz929WCue%2fFxdA&pid=ImgRaw&r=0" }
        ]
      }
    ]
  },
  // 9 CHIFA ORIENTAL
  {
    id: 9,
    name: "Chifa Oriental",
    description: "Sabores orientales con recetas tradicionales",
    rating: 4.3,
    reviews: 500,
    deliveryTime: "30-40 min",
    deliveryCost: 10,
    categories: [
      {
        id: "comida",
        name: "Platos Principales",
        icon: "bi bi-egg-fried",
        products: [
          { name: "Arroz Chaufa", description: "Arroz frito estilo chifa con pollo y verduras", basePrice: 22, sizes: { personal: 22.00, familiar: 40.00 }, rating: 4.5, reviews: 180, image: "https://img.freepik.com/fotos-premium/cultura-comer-comida-oriental-palillos-como-cubiertos-tradicionales_201836-8325.jpg" },
          { name: "Tallarín Saltado", description: "Tallarines salteados con carne y salsa especial", basePrice: 24, sizes: { personal: 24.00, familiar: 44.00 }, rating: 4.4, reviews: 160, image: "https://tse4.mm.bing.net/th/id/OIP.kjANnWfaicZ1PZ4erupVygHaFK?rs=1&pid=ImgDetMain&o=7&rm=3" }
        ]
      },
      {
        id: "aperitivos",
        name: "Aperitivos",
        icon: "bi bi-basket",
        products: [
          { name: "Wantán Frito", description: "Crocantes wantanes rellenos", basePrice: 12, sizes: { unidad: 12.00, combo: 30.00 }, rating: 4.6, reviews: 120, image: "https://images.unsplash.com/photo-1553621042-f6e147245754" }
        ]
      }
    ]
  },
  // 10 TACO LOCO
  {
    id: 10,
    name: "Taco Loco",
    description: "Tacos, burritos y sabores mexicanos auténticos",
    rating: 4.5,
    reviews: 210,
    deliveryTime: "20-30 min",
    deliveryCost: 4,
    categories: [
      {
        id: "tacos",
        name: "Tacos",
        icon: "bi bi-egg",
        products: [
          { name: "Taco al Pastor", description: "Cerdo adobado con piña y salsa", basePrice: 12, sizes: { unidad: 12.00, trio: 32.00 }, rating: 4.6, reviews: 120, image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg" },
          { name: "Taco de Carnitas", description: "Cerdo confitado con cebolla y cilantro", basePrice: 14, sizes: { unidad: 14.00, trio: 36.00 }, rating: 4.7, reviews: 140, image: "https://www.gastrolabweb.com/u/fotografias/m/2021/2/10/f1280x720-8401_140076_5050.jpg" }
        ]
      },
      {
        id: "burritos",
        name: "Burritos",
        icon: "bi bi-basket",
        products: [
          { name: "Burrito Clásico", description: "Carne, arroz, frijoles, salsa y queso", basePrice: 22, sizes: { regular: 22.00, grande: 30.00 }, rating: 4.5, reviews: 90, image: "https://tse3.mm.bing.net/th/id/OIP.FoQlAQhQ5VELm4ZzMwul8QHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3" }
        ]
      }
    ]
  },
  // 11 LA PARRILLA ARGENTINA
  {
    id: 11,
    name: "La Parrilla Argentina",
    description: "Cortes argentinos a la parrilla",
    rating: 4.7,
    reviews: 340,
    deliveryTime: "30-40 min",
    deliveryCost: 5,
    categories: [
      {
        id: "carnes",
        name: "Cortes",
        icon: "bi bi-basket",
        products: [
          { name: "Bife de Chorizo", description: "Corte jugoso a la parrilla", basePrice: 50, sizes: { individual: 50.00 }, rating: 4.8, reviews: 200, image: "https://images.pexels.com/photos/105827/pexels-photo-105827.jpeg" },
          { name: "Entraña", description: "Corte tierno y sabroso", basePrice: 45, sizes: { individual: 45.00 }, rating: 4.7, reviews: 160, image: "https://carnesargentinas.es/wp-content/uploads/2020/04/entra%C3%B1a-2048x1353.jpg" }
        ]
      },
      {
        id: "acompanamientos",
        name: "Acompañamientos",
        icon: "bi bi-box",
        products: [
          { name: "Papas a la Provenzal", description: "Papas al horno con ajo y perejil", basePrice: 12, sizes: { racion: 12.00 }, rating: 4.6, reviews: 90, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" }
        ]
      }
    ]
  },
  // 12VEGGIE DELIGHT
  {
    id: 12,
    name: "Veggie Delight",
    description: "Opciones vegetarianas y veganas saludables",
    rating: 4.4,
    reviews: 150,
    deliveryTime: "15-25 min",
    deliveryCost: 3,
    categories: [
      {
        id: "ensaladas",
        name: "Ensaladas",
        icon: "bi bi-leaf",
        products: [
          { name: "Ensalada César Veggie", description: "Lechuga, croutons y aderezo vegano", basePrice: 14, sizes: { individual: 14.00 }, rating: 4.5, reviews: 80, image: "https://tse2.mm.bing.net/th/id/OIP.IM4D82GqsgJ9Hg1cjV1WqgHaE7?rs=1&pid=ImgDetMain&o=7&rm=3" },
          { name: "Bowl Protein", description: "Quinoa, garbanzos, verduras asadas y hummus", basePrice: 18, sizes: { individual: 18.00 }, rating: 4.6, reviews: 100, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" }
        ]
      },
      {
        id: "wraps",
        name: "Wraps",
        icon: "bi bi-box",
        products: [
          { name: "Wrap Mediterráneo", description: "Hummus, vegetales y queso feta (opcional)", basePrice: 16, sizes: { regular: 16.00 }, rating: 4.4, reviews: 60, image: "https://images.unsplash.com/photo-1546069901-eacef0df6022" }
        ]
      }
    ]
  },
  // 13 CURRY PALACE
  {
    id: 13,
    name: "Curry Palace",
    description: "Cocina india con currys tradicionales",
    rating: 4.6,
    reviews: 430,
    deliveryTime: "25-35 min",
    deliveryCost: 4,
    categories: [
      {
        id: "currys",
        name: "Currys",
        icon: "bi bi-bowl",
        products: [
          { name: "Chicken Curry", description: "Pollo en salsa especiada y aromática", basePrice: 35, sizes: { individual: 35.00, familiar: 65.00 }, rating: 4.7, reviews: 200, image: "https://tse4.mm.bing.net/th/id/OIP.dVTk-vYa2BpQDxEOYNGirAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
          { name: "Paneer Tikka Masala", description: "Queso paneer en salsa cremosa", basePrice: 32, sizes: { individual: 32.00 }, rating: 4.6, reviews: 150, image: "https://tse1.mm.bing.net/th/id/OIP.YMUBgbQa3yM-XWiBe7fYtQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" }
        ]
      },
      {
        id: "breads",
        name: "Breads & Sides",
        icon: "bi bi-basket",
        products: [
          { name: "Naan de Ajo", description: "Pan naan fresco con ajo y mantequilla", basePrice: 6, sizes: { unidad: 6.00 }, rating: 4.8, reviews: 110, image: "https://t4.ftcdn.net/jpg/06/09/58/09/360_F_609580941_U8W4KuzYJ9w70Fxg9ZByT5F3Q9AIVmBq.jpg" }
        ]
      }
    ]
  },
  // 14 PATAFRESCA
  {
    id: 14,
    name: "Pasta Fresca",
    description: "Pastas hechas a mano y salsas caseras",
    rating: 4.7,
    reviews: 290,
    deliveryTime: "20-30 min",
    deliveryCost: 4,
    categories: [
      {
        id: "pastas",
        name: "Pastas",
        icon: "bi bi-pizza",
        products: [
          { name: "Spaghetti Carbonara", description: "Pasta con panceta, huevo y queso", basePrice: 25, sizes: { individual: 25.00 }, rating: 4.7, reviews: 140, image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg" },
          { name: "Ravioli de Ricotta", description: "Raviolis rellenos con salsa de tomate", basePrice: 27, sizes: { individual: 27.00 }, rating: 4.6, reviews: 120, image: "https://tse3.mm.bing.net/th/id/OIP.twHM2OQCqGn2yruXDsgYowHaE8?rs=1&pid=ImgDetMain&o=7&rm=3" }
        ]
      }
    ]
  },
  // 15 DONUT HEAVEN
  {
    id: 15,
    name: "Donut Heaven",
    description: "Donas artesanales y postres creativos",
    rating: 4.8,
    reviews: 500,
    deliveryTime: "10-20 min",
    deliveryCost: 2,
    categories: [
      {
        id: "donas",
        name: "Donas",
        icon: "bi bi-cupcake",
        products: [
          { name: "Donut Glaseado", description: "Donut clásico con glaseado", basePrice: 8, sizes: { unidad: 8.00, caja6: 40.00 }, rating: 4.8, reviews: 240, image: "https://images.pexels.com/photos/31976170/pexels-photo-31976170.jpeg" },
          { name: "Donut Chocolate Deluxe", description: "Con cobertura de chocolate y toppings", basePrice: 10, sizes: { unidad: 10.00, caja6: 48.00 }, rating: 4.9, reviews: 180, image: "https://tse1.mm.bing.net/th/id/OIP.hD8Us6td_zjx4qixKY1JnQHaFP?rs=1&pid=ImgDetMain&o=7&rm=3" }
        ]
      },
      {
        id: "bebidas",
        name: "Bebidas",
        icon: "bi bi-cup-straw",
        products: [
          { name: "Café Espresso", description: "Café intenso para acompañar tus donas", basePrice: 6, sizes: { "8oz": 6.00 }, rating: 4.7, reviews: 90, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d" }
        ]
      }
    ]
  }
];
