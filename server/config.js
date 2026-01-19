export const IS_DEMO = process.env.DEMO_MODE === 'true'

// 🔍 DEBUG: Agregar esto
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🔧 SERVER CONFIG DEBUG:')
console.log('DEMO_MODE env:', process.env.DEMO_MODE)
console.log('IS_DEMO resultado:', IS_DEMO)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

export const DEMO_DATA = {
  reservations: [
    { id: 1, name: "Carlos Méndez", email: "carlos@example.com", phone: "504-9999-1111", date: "2026-01-25", time: "19:00", party_size: 4, table_num: 5, created_at: "2026-01-15T10:30:00Z" },
    { id: 2, name: "Ana Rodríguez", email: "ana@example.com", phone: "504-9999-2222", date: "2026-01-26", time: "20:30", party_size: 2, table_num: 8, created_at: "2026-01-15T11:00:00Z" },
    { id: 3, name: "Luis García", email: "luis@example.com", phone: "504-9999-3333", date: "2026-01-27", time: "18:00", party_size: 6, table_num: 12, created_at: "2026-01-15T12:15:00Z" }
  ],

  menuItems: [
    { id: 1, name: "Baleada Especial", description: "Tradicional baleada con frijoles, queso y aguacate", price: 45.00, category: "appetizers", image_url: "/images/baleada.jpg", is_available: true },
    { id: 2, name: "Carne Asada", description: "Jugosa carne asada con chimol y tajadas", price: 180.00, category: "main", image_url: "/images/carne.jpg", is_available: true },
    { id: 3, name: "Sopa de Caracol", description: "Deliciosa sopa de caracol al estilo catracho", price: 150.00, category: "main", image_url: "/images/caracol.jpg", is_available: true },
    { id: 4, name: "Pollo Chuco", description: "Pollo frito estilo hondureño con tajadas", price: 120.00, category: "main", image_url: "/images/pollo.jpg", is_available: true },
    { id: 5, name: "Tres Leches", description: "Pastel tres leches casero", price: 65.00, category: "desserts", image_url: "/images/tres-leches.jpg", is_available: true },
    { id: 6, name: "Horchata", description: "Refrescante horchata de morro", price: 30.00, category: "beverages", image_url: "/images/horchata.jpg", is_available: true },
    { id: 7, name: "Limonada", description: "Refrescante limonada", price: 30.00, category: "beverages", image_url: "/images/limonada.jpg", is_available: true },
    { id: 8, name: "Rosquilla en Miel", description: "Entrada dulce", price: 85.00, category: "desserts", image_url: "/images/rosquilla-en-miel.jpg", is_available: true },
  ]
}
