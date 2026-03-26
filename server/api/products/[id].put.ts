import { getDb } from '~/server/db/index'
import type { Product, UpdateStockBody } from '~/shared/types/index'

/**
 * PUT /api/products/:id
 *
 * Updates the stock level of a product by its numeric id.
 *
 * @throws 400 when the `stock` value is not a non-negative integer.
 * @throws 404 when no product with the given id exists.
 * @returns An object containing `success: true` and the updated {@link Product}.
 */
export default defineEventHandler(async (event): Promise<{ success: true; product: Product }> => {
  const rawId = getRouterParam(event, 'id')
  const id = Number(rawId)

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, message: 'Invalid product id' })
  }

  const body = await readBody<UpdateStockBody>(event)

  if (!Number.isInteger(body.stock) || body.stock < 0) {
    throw createError({ statusCode: 400, message: 'Stock must be a non-negative integer' })
  }

  const db = getDb()

  const existing = db.prepare<[number], Product>('SELECT id, name, price, stock FROM products WHERE id = ?').get(id)

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Product not found' })
  }

  db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(body.stock, id)

  const updated = db.prepare<[number], Product>('SELECT id, name, price, stock FROM products WHERE id = ?').get(id)

  if (!updated) {
    throw createError({ statusCode: 500, message: 'Failed to retrieve updated product' })
  }

  return { success: true, product: updated }
})
