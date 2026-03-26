import type { RunResult } from 'better-sqlite3'
import { getDb } from '~/server/db/index'
import type { ConfirmOrderBody, SuccessResponse } from '~/shared/types/index'

interface ProductRow {
  id: number
  stock: number
}

/**
 * POST /api/orders/confirm
 *
 * Persists a confirmed order to the database and decrements the stock of
 * each ordered product atomically inside a transaction.
 *
 * @throws 400 when a product is not found or stock is insufficient.
 * @returns A {@link SuccessResponse} on success.
 */
export default defineEventHandler(async (event): Promise<SuccessResponse> => {
  const body = await readBody<ConfirmOrderBody>(event)

  if (!body.items || body.items.length === 0) {
    throw createError({ statusCode: 400, message: 'Order must contain at least one item' })
  }

  const db = getDb()

  const confirm = db.transaction(() => {
    const info: RunResult = db
      .prepare('INSERT INTO orders (total, delivery_type) VALUES (?, ?)')
      .run(body.total, body.deliveryType)

    const orderId = Number(info.lastInsertRowid)

    const insertItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)',
    )
    const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?')

    for (const item of body.items) {
      const product = db
        .prepare<[number], ProductRow>('SELECT id, stock FROM products WHERE id = ?')
        .get(item.id)

      if (!product) {
        throw createError({ statusCode: 400, message: `Product ${item.id} not found` })
      }

      if (product.stock < item.quantity) {
        throw createError({ statusCode: 400, message: `Insufficient stock for product ${item.id}` })
      }

      insertItem.run(orderId, item.id, item.name, item.price, item.quantity)
      decrementStock.run(item.quantity, item.id, item.quantity)
    }
  })

  confirm()

  return { success: true, message: 'Order confirmed and stock updated' }
})
