import 'dotenv/config'
import { IS_DEMO } from '../config.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db = null

// Solo inicializa SQLite si NO está en Demo Mode
if (!IS_DEMO) {
  const Database = (await import('better-sqlite3')).default
  const dbPath = path.join(__dirname, '..', 'restaurant.db')

  db = new Database(dbPath)

  // Enable WAL mode
  db.pragma('journal_mode = WAL')

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      party_size INTEGER NOT NULL,
      table_num INTEGER,
      special_requests TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      is_available INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `)

  console.log('✅ SQLite database initialized')
} else {
  console.log('🎭 Demo Mode - SQLite skipped')
}

export default db
