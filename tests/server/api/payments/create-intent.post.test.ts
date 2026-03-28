import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PaymentIntentResponse } from '~/shared/types/index'

const mockPaymentIntentsCreate = vi.fn()

vi.mock('stripe', () => ({
  default: class MockStripe {
    paymentIntents = { create: mockPaymentIntentsCreate }
  },
}))

const mockGet = vi.fn()
const mockPrepare = vi.fn(() => ({ get: mockGet }))
const mockGetDb = vi.fn(() => ({ prepare: mockPrepare }))

vi.mock('~/server/db/index', () => ({
  getDb: mockGetDb,
}))

const mockCreateError = vi.fn((opts: { statusCode: number; message: string }) => {
  const err = new Error(opts.message) as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})

const mockReadBody = vi.fn()
const mockUseRuntimeConfig = vi.fn(() => ({
  stripeSecretKey: 'sk_test_mock',
  public: { stripePublishableKey: 'pk_test_mock' },
}))

vi.stubGlobal('defineEventHandler', (fn: (event: unknown) => unknown) => fn)
vi.stubGlobal('createError', mockCreateError)
vi.stubGlobal('readBody', mockReadBody)
vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)

const { default: handler } = await import('~/server/api/payments/create-intent.post')

type Handler = (event: unknown) => Promise<PaymentIntentResponse>

describe('POST /api/payments/create-intent', () => {
  const mockEvent = {}

  beforeEach(() => {
    vi.clearAllMocks()
    mockPrepare.mockReturnValue({ get: mockGet })
    mockGetDb.mockReturnValue({ prepare: mockPrepare })
    mockUseRuntimeConfig.mockReturnValue({
      stripeSecretKey: 'sk_test_mock',
      public: { stripePublishableKey: 'pk_test_mock' },
    })
  })

  it('creates a payment intent and returns clientSecret and amount', async () => {
    mockGet.mockReturnValue({ id: 1, name: 'Aurora One', price: 89.0, stock: 100 })
    mockPaymentIntentsCreate.mockResolvedValue({
      client_secret: 'pi_test_secret_123',
      amount: 8900,
    })
    mockReadBody.mockResolvedValue({
      items: [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }],
      deliveryType: 'standard',
    })

    const result = await (handler as Handler)(mockEvent)

    expect(result.clientSecret).toBe('pi_test_secret_123')
    expect(result.amount).toBe(89.0)
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith({
      amount: 8900,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    })
  })

  it('adds express delivery surcharge to the total', async () => {
    mockGet.mockReturnValue({ id: 1, name: 'Aurora One', price: 89.0, stock: 100 })
    mockPaymentIntentsCreate.mockResolvedValue({
      client_secret: 'pi_test_secret_express',
      amount: 9900,
    })
    mockReadBody.mockResolvedValue({
      items: [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }],
      deliveryType: 'express',
    })

    const result = await (handler as Handler)(mockEvent)

    expect(result.amount).toBe(99.0)
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(expect.objectContaining({ amount: 9900 }))
  })

  it('uses provided currency instead of default eur', async () => {
    mockGet.mockReturnValue({ id: 1, name: 'Aurora One', price: 89.0, stock: 100 })
    mockPaymentIntentsCreate.mockResolvedValue({
      client_secret: 'pi_test_secret_usd',
      amount: 8900,
    })
    mockReadBody.mockResolvedValue({
      items: [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }],
      deliveryType: 'standard',
      currency: 'usd',
    })

    await (handler as Handler)(mockEvent)

    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ currency: 'usd' })
    )
  })

  it('throws 400 when cart is empty', async () => {
    mockReadBody.mockResolvedValue({
      items: [],
      deliveryType: 'standard',
    })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Cart is empty' })
    )
  })

  it('throws 400 when items is missing', async () => {
    mockReadBody.mockResolvedValue({ deliveryType: 'standard' })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }))
  })

  it('throws 400 when a product is not found in the database', async () => {
    mockGet.mockReturnValue(undefined)
    mockReadBody.mockResolvedValue({
      items: [{ id: 999, name: 'Ghost', price: 89.0, quantity: 1 }],
      deliveryType: 'standard',
    })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Product 999 not found' })
    )
  })

  it('throws 400 when product stock is insufficient', async () => {
    mockGet.mockReturnValue({ id: 1, name: 'Aurora One', price: 89.0, stock: 1 })
    mockReadBody.mockResolvedValue({
      items: [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 5 }],
      deliveryType: 'standard',
    })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Aurora One has only 1 unit(s) left in stock',
      })
    )
  })

  it('throws 500 when Stripe does not return a client secret', async () => {
    mockGet.mockReturnValue({ id: 1, name: 'Aurora One', price: 89.0, stock: 100 })
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: null, amount: 8900 })
    mockReadBody.mockResolvedValue({
      items: [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }],
      deliveryType: 'standard',
    })

    await expect((handler as Handler)(mockEvent)).rejects.toThrow()
    expect(mockCreateError).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Stripe did not return a client secret',
      })
    )
  })

  it('computes correct amount for multiple items', async () => {
    mockGet
      .mockReturnValueOnce({ id: 1, name: 'Aurora One', price: 89.0, stock: 100 })
      .mockReturnValueOnce({ id: 2, name: 'Aurora Pro', price: 149.0, stock: 50 })
    mockPaymentIntentsCreate.mockResolvedValue({
      client_secret: 'pi_test_multi',
      amount: 23800,
    })
    mockReadBody.mockResolvedValue({
      items: [
        { id: 1, name: 'Aurora One', price: 89.0, quantity: 1 },
        { id: 2, name: 'Aurora Pro', price: 149.0, quantity: 1 },
      ],
      deliveryType: 'standard',
    })

    const result = await (handler as Handler)(mockEvent)

    expect(result.amount).toBe(238.0)
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 23800 })
    )
  })
})
