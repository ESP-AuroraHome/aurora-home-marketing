import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { SuccessResponse } from '~/shared/types/index'

const mockTransactionFn = vi.fn()
const mockTransaction = vi.fn((fn: () => void) => {
  mockTransactionFn.mockImplementation(fn)
  return mockTransactionFn
})

const _mockRun = vi.fn()
const _mockGet = vi.fn()
const _mockPrepare = vi.fn()
const mockGetDb = vi.fn()

vi.mock('~/server/db/index', () => ({
  getDb: mockGetDb,
}))

const mockCreateError = vi.fn((opts: { statusCode: number; message: string }) => {
  const err = new Error(opts.message) as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})

const mockReadBody = vi.fn()

vi.stubGlobal('defineEventHandler', (fn: (event: unknown) => unknown) => fn)
vi.stubGlobal('createError', mockCreateError)
vi.stubGlobal('readBody', mockReadBody)

const { default: handler } = await import('~/server/api/orders/confirm.post')

type Handler = (event: unknown) => Promise<SuccessResponse>

describe('POST /api/orders/confirm', () => {
  const mockEvent = {}

  function makeMockDb() {
    const insertOrderRun = vi.fn().mockReturnValue({ lastInsertRowid: BigInt(1) })
    const insertItemRun = vi.fn()
    const decrementStockRun = vi.fn()
    const getProduct = vi.fn()

    const prepare = vi.fn((sql: string) => {
      if (sql.includes('INSERT INTO orders')) return { run: insertOrderRun }
      if (sql.includes('INSERT INTO order_items')) return { run: insertItemRun }
      if (sql.includes('UPDATE products')) return { run: decrementStockRun }
      if (sql.includes('SELECT id, stock FROM products')) return { get: getProduct }
      return { run: vi.fn(), get: vi.fn() }
    })

    return {
      prepare,
      transaction: mockTransaction,
      insertOrderRun,
      insertItemRun,
      decrementStockRun,
      getProduct,
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success when order is confirmed with valid items', async () => {
    const db = makeMockDb()
    db.getProduct.mockReturnValue({ id: 1, stock: 100 })
    mockGetDb.mockReturnValue(db)

    mockReadBody.mockResolvedValue({
      items: [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 2 }],
      total: '178.00',
      deliveryType: 'standard',
    })

    mockTransactionFn.mockImplementation(() => {})

    const result = await (handler as Handler)(mockEvent)

    expect(result).toEqual({ success: true, message: 'Order confirmed and stock updated' })
  })

  it('throws 400 when items array is empty', async () => {
    mockReadBody.mockResolvedValue({
      items: [],
      total: '0.00',
      deliveryType: 'standard',
    })
    mockGetDb.mockReturnValue({ prepare: vi.fn(), transaction: mockTransaction })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Order must contain at least one item' })
    )
  })

  it('throws 400 when items is missing from body', async () => {
    mockReadBody.mockResolvedValue({ total: '89.00', deliveryType: 'standard' })
    mockGetDb.mockReturnValue({ prepare: vi.fn(), transaction: mockTransaction })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }))
  })

  it('calls the transaction function returned by db.transaction', async () => {
    const db = makeMockDb()
    db.getProduct.mockReturnValue({ id: 1, stock: 50 })
    mockGetDb.mockReturnValue(db)

    mockReadBody.mockResolvedValue({
      items: [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }],
      total: '89.00',
      deliveryType: 'express',
    })

    await (handler as Handler)(mockEvent)

    expect(mockTransaction).toHaveBeenCalled()
    expect(mockTransactionFn).toHaveBeenCalled()
  })

  it('handles multiple items in one order', async () => {
    const db = makeMockDb()
    db.getProduct
      .mockReturnValueOnce({ id: 1, stock: 100 })
      .mockReturnValueOnce({ id: 2, stock: 30 })
    mockGetDb.mockReturnValue(db)

    mockReadBody.mockResolvedValue({
      items: [
        { id: 1, name: 'Aurora One', price: 89.0, quantity: 1 },
        { id: 2, name: 'Aurora Pro', price: 149.0, quantity: 1 },
      ],
      total: '238.00',
      deliveryType: 'standard',
    })

    const result = await (handler as Handler)(mockEvent)

    expect(result.success).toBe(true)
  })
})
