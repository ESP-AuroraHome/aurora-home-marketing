import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Product } from '~/shared/types/index'

const mockAll = vi.fn()
const mockPrepare = vi.fn(() => ({ all: mockAll }))
const mockGetDb = vi.fn(() => ({ prepare: mockPrepare }))

vi.mock('~/server/db/index', () => ({
  getDb: mockGetDb,
}))

vi.stubGlobal('defineEventHandler', (fn: () => unknown) => fn)

const { default: handler } = await import('~/server/api/products/index.get')

describe('GET /api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrepare.mockReturnValue({ all: mockAll })
    mockGetDb.mockReturnValue({ prepare: mockPrepare })
  })

  it('returns an array of products ordered by id', () => {
    const products: Product[] = [
      { id: 1, name: 'Aurora One', price: 89.0, stock: 100 },
      { id: 2, name: 'Aurora Pro', price: 149.0, stock: 50 },
    ]
    mockAll.mockReturnValue(products)

    const result = (handler as () => Product[])()

    expect(result).toEqual(products)
    expect(mockPrepare).toHaveBeenCalledWith(
      'SELECT id, name, price, stock FROM products ORDER BY id'
    )
    expect(mockAll).toHaveBeenCalled()
  })

  it('returns an empty array when no products exist', () => {
    mockAll.mockReturnValue([])

    const result = (handler as () => Product[])()

    expect(result).toEqual([])
  })

  it('returns a single product when only one exists', () => {
    const products: Product[] = [{ id: 1, name: 'Aurora One', price: 89.0, stock: 5 }]
    mockAll.mockReturnValue(products)

    const result = (handler as () => Product[])()

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Aurora One')
  })

  it('calls getDb exactly once per invocation', () => {
    mockAll.mockReturnValue([])
    ;(handler as () => Product[])()

    expect(mockGetDb).toHaveBeenCalledTimes(1)
  })

  it('returns products with all required fields', () => {
    const products: Product[] = [{ id: 42, name: 'Test', price: 9.99, stock: 0 }]
    mockAll.mockReturnValue(products)

    const result = (handler as () => Product[])()

    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('name')
    expect(result[0]).toHaveProperty('price')
    expect(result[0]).toHaveProperty('stock')
  })
})
