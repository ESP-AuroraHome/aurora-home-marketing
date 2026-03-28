import { describe, it, expect } from 'vitest'
import type {
  Product,
  CartItem,
  OrderItem,
  Order,
  DeliveryType,
  CheckoutForm,
  CreatePaymentIntentBody,
  ConfirmOrderBody,
  UpdateStockBody,
  PaymentIntentResponse,
  SuccessResponse,
} from '../types/index'

describe('shared types', () => {
  it('Product has correct shape', () => {
    const product: Product = { id: 1, name: 'Aurora One', price: 89.0, stock: 10 }
    expect(product.id).toBe(1)
    expect(product.name).toBe('Aurora One')
    expect(product.price).toBe(89.0)
    expect(product.stock).toBe(10)
  })

  it('CartItem has correct shape', () => {
    const item: CartItem = { id: 1, name: 'Aurora One', price: 89.0, quantity: 2 }
    expect(item.id).toBe(1)
    expect(item.quantity).toBe(2)
  })

  it('OrderItem has correct shape', () => {
    const orderItem: OrderItem = {
      id: 1,
      orderId: 42,
      productId: 1,
      productName: 'Aurora One',
      price: 89.0,
      quantity: 1,
    }
    expect(orderItem.orderId).toBe(42)
    expect(orderItem.productName).toBe('Aurora One')
  })

  it('Order has correct shape', () => {
    const order: Order = {
      id: 1,
      createdAt: '2024-01-01T00:00:00Z',
      total: '89.00',
      deliveryType: 'standard',
      items: [],
    }
    expect(order.deliveryType).toBe('standard')
    expect(order.items).toEqual([])
  })

  it('DeliveryType accepts standard and express', () => {
    const standard: DeliveryType = 'standard'
    const express: DeliveryType = 'express'
    expect(standard).toBe('standard')
    expect(express).toBe('express')
  })

  it('CheckoutForm has correct shape', () => {
    const form: CheckoutForm = {
      firstName: 'Jean',
      lastName: 'Dupont',
      address: '1 rue de la Paix',
      zipCode: '75001',
      city: 'Paris',
      email: 'jean@example.com',
    }
    expect(form.city).toBe('Paris')
    expect(form.email).toBe('jean@example.com')
  })

  it('CreatePaymentIntentBody has correct shape', () => {
    const body: CreatePaymentIntentBody = {
      items: [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }],
      deliveryType: 'standard',
    }
    expect(body.items).toHaveLength(1)
    expect(body.currency).toBeUndefined()
  })

  it('CreatePaymentIntentBody accepts optional currency', () => {
    const body: CreatePaymentIntentBody = {
      items: [],
      currency: 'eur',
      deliveryType: 'express',
    }
    expect(body.currency).toBe('eur')
  })

  it('ConfirmOrderBody has correct shape', () => {
    const body: ConfirmOrderBody = {
      items: [],
      total: '89.00',
      deliveryType: 'standard',
    }
    expect(body.total).toBe('89.00')
  })

  it('UpdateStockBody has correct shape', () => {
    const body: UpdateStockBody = { stock: 5 }
    expect(body.stock).toBe(5)
  })

  it('PaymentIntentResponse has correct shape', () => {
    const response: PaymentIntentResponse = { clientSecret: 'pi_test_secret', amount: 8900 }
    expect(response.clientSecret).toBe('pi_test_secret')
    expect(response.amount).toBe(8900)
  })

  it('SuccessResponse has correct shape', () => {
    const response: SuccessResponse = { success: true }
    expect(response.success).toBe(true)
    expect(response.message).toBeUndefined()
  })

  it('SuccessResponse accepts optional message', () => {
    const response: SuccessResponse = { success: true, message: 'Order confirmed' }
    expect(response.message).toBe('Order confirmed')
  })
})
