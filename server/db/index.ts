import Database from 'better-sqlite3'
import { resolve } from 'path'

let _db: Database.Database | null = null

/**
 * Creates and returns the SQLite database instance (singleton).
 * On first call, it initialises the schema and seeds the products table.
 *
 * @returns The shared SQLite database connection.
 */
export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(resolve(process.cwd(), 'aurora.db'))
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    initSchema(_db)
    seedProducts(_db)
  }
  return _db
}

/**
 * Runs the DDL statements that create the tables when they do not exist yet.
 *
 * @param db - The SQLite database connection.
 */
function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      price       REAL    NOT NULL,
      stock       INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS orders (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      total         TEXT    NOT NULL,
      delivery_type TEXT    NOT NULL CHECK(delivery_type IN ('standard', 'express'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id      INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id    INTEGER NOT NULL,
      product_name  TEXT    NOT NULL,
      price         REAL    NOT NULL,
      quantity      INTEGER NOT NULL
    );
  `)
}

/**
 * Inserts the initial Aurora One product if the products table is empty.
 *
 * @param db - The SQLite database connection.
 */
function seedProducts(db: Database.Database): void {
  const row = db.prepare<[], { count: number }>('SELECT COUNT(*) AS count FROM products').get()
  if (row && row.count === 0) {
    db.prepare('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)').run('Aurora One', 89.0, 100)
  }
}
