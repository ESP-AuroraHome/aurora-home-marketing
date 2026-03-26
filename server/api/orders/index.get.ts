import { getDb } from '~/server/db/index'
import type { Order, OrderItem } from '~/shared/types/index'

interface OrderRow {
  id: number
  created_at: string
  total: string
  delivery_type: 'standard' | 'express'
}

interface OrderItemRow {
  id: number
  order_id: number
  product_id: number
  product_name: string
  price: number
  quantity: number
}

/**
 * GET /api/orders
 *
 * Returns all orders alongside their line items, sorted newest-first.
 *
 * @returns An array of {@link Order} objects with nested `items`.
 */
export default defineEventHandler((): Order[] => {
  const db = getDb()

  const orderRows = db
    .prepare<[], OrderRow>('SELECT id, created_at, total, delivery_type FROM orders ORDER BY id DESC')
    .all()

  const itemRows = db
    .prepare<[], OrderItemRow>(
      'SELECT id, order_id, product_id, product_name, price, quantity FROM order_items',
    )
    .all()

  return orderRows.map((row): Order => {
    const items: OrderItem[] = itemRows
      .filter((item) => item.order_id === row.id)
      .map((item): OrderItem => ({
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        productName: item.product_name,
        price: item.price,
        quantity: item.quantity,
      }))

    return {
      id: row.id,
      createdAt: row.created_at,
      total: row.total,
      deliveryType: row.delivery_type,
      items,
    }
  })
})
