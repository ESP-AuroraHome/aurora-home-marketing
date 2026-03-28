import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Order } from '~/shared/types/index'

const mockAll = vi.fn()
const mockPrepare = vi.fn(() => ({ all: mockAll }))
const mockGetDb = vi.fn(() => ({ prepare: mockPrepare }))

vi.mock('~/server/db/index', () => ({
  getDb: mockGetDb,
}))

vi.stubGlobal('defineEventHandler', (fn: () => unknown) => fn)

const { default: handler } = await import('~/server/api/orders/index.get')

type Handler = () => Order[]

describe('GET /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrepare.mockReturnValue({ all: mockAll })
    mockGetDb.mockReturnValue({ prepare: mockPrepare })
  })

  it('returns an empty array when there are no orders', () => {
    mockAll.mockReturnValueOnce([]).mockReturnValueOnce([])

    const result = (handler as Handler)()

    expect(result).toEqual([])
  })

  it('returns orders with nested items mapped from db rows', () => {
    const orderRows = [
      { id: 1, created_at: '2024-01-01 10:00:00', total: '89.00', delivery_type: 'standard' },
    ]
    const itemRows = [
      {
        id: 10,
        order_id: 1,
        product_id: 1,
        product_name: 'Aurora One',
        price: 89.0,
        quantity: 1,
      },
    ]

    mockAll.mockReturnValueOnce(orderRows).mockReturnValueOnce(itemRows)

    const result = (handler as Handler)()

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual<Order>({
      id: 1,
      createdAt: '2024-01-01 10:00:00',
      total: '89.00',
      deliveryType: 'standard',
      items: [
        {
          id: 10,
          orderId: 1,
          productId: 1,
          productName: 'Aurora One',
          price: 89.0,
          quantity: 1,
        },
      ],
    })
  })

  it('maps snake_case db columns to camelCase order fields', () => {
    const orderRows = [
      { id: 2, created_at: '2024-06-15 09:00:00', total: '99.00', delivery_type: 'express' },
    ]
    mockAll.mockReturnValueOnce(orderRows).mockReturnValueOnce([])

    const result = (handler as Handler)()

    expect(result[0].createdAt).toBe('2024-06-15 09:00:00')
    expect(result[0].deliveryType).toBe('express')
  })

  it('returns multiple orders with their respective items', () => {
    const orderRows = [
      { id: 2, created_at: '2024-02-01 12:00:00', total: '178.00', delivery_type: 'standard' },
      { id: 1, created_at: '2024-01-01 10:00:00', total: '89.00', delivery_type: 'express' },
    ]
    const itemRows = [
      { id: 20, order_id: 2, product_id: 1, product_name: 'Aurora One', price: 89.0, quantity: 2 },
      { id: 10, order_id: 1, product_id: 1, product_name: 'Aurora One', price: 89.0, quantity: 1 },
    ]

    mockAll.mockReturnValueOnce(orderRows).mockReturnValueOnce(itemRows)

    const result = (handler as Handler)()

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe(2)
    expect(result[0].items).toHaveLength(1)
    expect(result[0].items[0].quantity).toBe(2)
    expect(result[1].id).toBe(1)
    expect(result[1].items).toHaveLength(1)
  })

  it('returns orders with empty items when no matching order_items exist', () => {
    const orderRows = [
      { id: 5, created_at: '2024-03-01 08:00:00', total: '89.00', delivery_type: 'standard' },
    ]
    mockAll.mockReturnValueOnce(orderRows).mockReturnValueOnce([])

    const result = (handler as Handler)()

    expect(result[0].items).toEqual([])
  })

  it('calls prepare twice — once for orders and once for order_items', () => {
    mockAll.mockReturnValue([])
    ;(handler as Handler)()

    expect(mockPrepare).toHaveBeenCalledTimes(2)
  })
})
