import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Product } from '~/shared/types/index'

const mockRun = vi.fn()
const mockGet = vi.fn()
const mockPrepare = vi.fn()
const mockGetDb = vi.fn()

vi.mock('~/server/db/index', () => ({
  getDb: mockGetDb,
}))

const mockCreateError = vi.fn((opts: { statusCode: number; message: string }) => {
  const err = new Error(opts.message) as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})

const mockGetRouterParam = vi.fn()
const mockReadBody = vi.fn()

vi.stubGlobal('defineEventHandler', (fn: (event: unknown) => unknown) => fn)
vi.stubGlobal('createError', mockCreateError)
vi.stubGlobal('getRouterParam', mockGetRouterParam)
vi.stubGlobal('readBody', mockReadBody)

const { default: handler } = await import('~/server/api/products/[id].put')

type Handler = (event: unknown) => Promise<{ success: true; product: Product }>

describe('PUT /api/products/:id', () => {
  const mockEvent = {}

  beforeEach(() => {
    vi.clearAllMocks()
    mockPrepare.mockReturnValue({ get: mockGet, run: mockRun })
    mockGetDb.mockReturnValue({ prepare: mockPrepare })
  })

  it('updates stock and returns the updated product', async () => {
    const existingProduct: Product = { id: 1, name: 'Aurora One', price: 89.0, stock: 100 }
    const updatedProduct: Product = { id: 1, name: 'Aurora One', price: 89.0, stock: 50 }

    mockGetRouterParam.mockReturnValue('1')
    mockReadBody.mockResolvedValue({ stock: 50 })
    mockGet.mockReturnValueOnce(existingProduct).mockReturnValueOnce(updatedProduct)

    const result = await (handler as Handler)(mockEvent)

    expect(result).toEqual({ success: true, product: updatedProduct })
    expect(mockRun).toHaveBeenCalledWith(50, 1)
  })

  it('throws 400 when id is not a positive integer', async () => {
    mockGetRouterParam.mockReturnValue('abc')
    mockReadBody.mockResolvedValue({ stock: 10 })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Invalid product id' })
    )
  })

  it('throws 400 when id is zero', async () => {
    mockGetRouterParam.mockReturnValue('0')
    mockReadBody.mockResolvedValue({ stock: 10 })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }))
  })

  it('throws 400 when id is negative', async () => {
    mockGetRouterParam.mockReturnValue('-5')
    mockReadBody.mockResolvedValue({ stock: 10 })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }))
  })

  it('throws 400 when stock is negative', async () => {
    mockGetRouterParam.mockReturnValue('1')
    mockReadBody.mockResolvedValue({ stock: -1 })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Stock must be a non-negative integer' })
    )
  })

  it('throws 400 when stock is a float', async () => {
    mockGetRouterParam.mockReturnValue('1')
    mockReadBody.mockResolvedValue({ stock: 1.5 })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }))
  })

  it('throws 404 when product does not exist', async () => {
    mockGetRouterParam.mockReturnValue('999')
    mockReadBody.mockResolvedValue({ stock: 10 })
    mockGet.mockReturnValue(undefined)

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'Product not found' })
    )
  })

  it('allows setting stock to zero', async () => {
    const existingProduct: Product = { id: 1, name: 'Aurora One', price: 89.0, stock: 100 }
    const updatedProduct: Product = { id: 1, name: 'Aurora One', price: 89.0, stock: 0 }

    mockGetRouterParam.mockReturnValue('1')
    mockReadBody.mockResolvedValue({ stock: 0 })
    mockGet.mockReturnValueOnce(existingProduct).mockReturnValueOnce(updatedProduct)

    const result = await (handler as Handler)(mockEvent)

    expect(result).toEqual({ success: true, product: updatedProduct })
    expect(mockRun).toHaveBeenCalledWith(0, 1)
  })

  it('throws 500 when updated product cannot be retrieved', async () => {
    const existingProduct: Product = { id: 1, name: 'Aurora One', price: 89.0, stock: 100 }

    mockGetRouterParam.mockReturnValue('1')
    mockReadBody.mockResolvedValue({ stock: 50 })
    mockGet.mockReturnValueOnce(existingProduct).mockReturnValueOnce(undefined)

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }))
  })
})
