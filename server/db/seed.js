import db from './index.js'

// Clear existing data
db.exec(`
  DELETE FROM reservations;
  DELETE FROM menu_items;
  DELETE FROM users;
`)

// Seed menu items
const menuItems = [
  // Appetizers
  { name: 'Empanadas de Carne', description: 'Crispy pastries filled with seasoned ground beef, onions, and olives', price: 8.99, category: 'appetizers', image_url: '/images/empanadas.jpg', is_available: 1 },
  { name: 'Ceviche Clásico', description: 'Fresh fish marinated in lime juice with red onion, cilantro, and ají peppers', price: 12.99, category: 'appetizers', image_url: '/images/ceviche.jpg', is_available: 1 },
  { name: 'Guacamole Fresco', description: 'House-made guacamole with ripe avocados, tomatoes, and fresh lime', price: 9.99, category: 'appetizers', image_url: '/images/guacamole.jpg', is_available: 1 },

  // Main Courses
  { name: 'Lomo Saltado', description: 'Stir-fried beef tenderloin with tomatoes, onions, and french fries', price: 22.99, category: 'main', image_url: '/images/lomo-saltado.jpg', is_available: 1 },
  { name: 'Pollo a la Brasa', description: 'Peruvian-style rotisserie chicken marinated in special spices', price: 18.99, category: 'main', image_url: '/images/pollo-brasa.jpg', is_available: 1 },
  { name: 'Arroz con Mariscos', description: 'Seafood rice with shrimp, mussels, calamari, and fresh herbs', price: 24.99, category: 'main', image_url: '/images/arroz-mariscos.jpg', is_available: 1 },
  { name: 'Tacos al Pastor', description: 'Three corn tortillas with marinated pork, pineapple, and cilantro', price: 16.99, category: 'main', image_url: '/images/tacos-pastor.jpg', is_available: 1 },
  { name: 'Churrasco Argentino', description: 'Grilled Argentine steak with chimichurri sauce and roasted vegetables', price: 28.99, category: 'main', image_url: '/images/churrasco.jpg', is_available: 1 },

  // Desserts
  { name: 'Tres Leches', description: 'Sponge cake soaked in three kinds of milk, topped with whipped cream', price: 8.99, category: 'desserts', image_url: '/images/tres-leches.jpg', is_available: 1 },
  { name: 'Churros con Chocolate', description: 'Crispy fried dough sticks with warm chocolate dipping sauce', price: 7.99, category: 'desserts', image_url: '/images/churros.jpg', is_available: 1 },
  { name: 'Flan de Caramelo', description: 'Traditional caramel custard with a silky smooth texture', price: 6.99, category: 'desserts', image_url: '/images/flan.jpg', is_available: 1 },

  // Beverages
  { name: 'Agua Fresca', description: 'Fresh fruit water - choice of watermelon, mango, or pineapple', price: 4.99, category: 'beverages', image_url: '/images/agua-fresca.jpg', is_available: 1 },
  { name: 'Pisco Sour', description: 'Classic Peruvian cocktail with pisco, lime juice, and egg white', price: 12.99, category: 'beverages', image_url: '/images/pisco-sour.jpg', is_available: 1 },
  { name: 'Horchata', description: 'Refreshing rice-based drink with cinnamon and vanilla', price: 4.49, category: 'beverages', image_url: '/images/horchata.jpg', is_available: 1 },
]

const insertMenuItem = db.prepare(`
  INSERT INTO menu_items (name, description, price, category, image_url, is_available)
  VALUES (@name, @description, @price, @category, @image_url, @is_available)
`)

const insertManyMenuItems = db.transaction((items) => {
  for (const item of items) {
    insertMenuItem.run(item)
  }
})

insertManyMenuItems(menuItems)

// Seed sample reservations
const reservations = [
  { name: 'Maria Garcia', email: 'maria@example.com', phone: '555-0101', date: '2026-01-20', time: '19:00', party_size: 4, table_num: 5, special_requests: 'Birthday celebration - please bring cake' },
  { name: 'Carlos Rodriguez', email: 'carlos@example.com', phone: '555-0102', date: '2026-01-21', time: '20:00', party_size: 2, table_num: 3, special_requests: null },
  { name: 'Ana Martinez', email: 'ana@example.com', phone: '555-0103', date: '2026-01-22', time: '18:30', party_size: 6, table_num: 8, special_requests: 'Vegetarian options needed' },
]

const insertReservation = db.prepare(`
  INSERT INTO reservations (name, email, phone, date, time, party_size, table_num, special_requests)
  VALUES (@name, @email, @phone, @date, @time, @party_size, @table_num, @special_requests)
`)

const insertManyReservations = db.transaction((items) => {
  for (const item of items) {
    insertReservation.run(item)
  }
})

insertManyReservations(reservations)

// Seed admin user (password: admin123 - hashed with bcrypt, but we'll use a placeholder for now)
// In production, this should be properly hashed
const users = [
  { username: 'admin', password_hash: '$2b$10$placeholder_hash_for_admin123', role: 'admin' },
]

const insertUser = db.prepare(`
  INSERT INTO users (username, password_hash, role)
  VALUES (@username, @password_hash, @role)
`)

const insertManyUsers = db.transaction((items) => {
  for (const item of items) {
    insertUser.run(item)
  }
})

insertManyUsers(users)

console.log('Database seeded successfully!')
console.log(`- ${menuItems.length} menu items added`)
console.log(`- ${reservations.length} reservations added`)
console.log(`- ${users.length} users added`)
