import { getDb } from '~/server/db/index'
import type { Product } from '~/shared/types/index'

/**
 * GET /api/products
 *
 * Returns the full catalogue of products ordered by id.
 *
 * @returns An array of {@link Product} objects.
 */
export default defineEventHandler((): Product[] => {
  const db = getDb()
  return db.prepare<[], Product>('SELECT id, name, price, stock FROM products ORDER BY id').all()
})
