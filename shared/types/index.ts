export interface Product {
  id: number
  name: string
  price: number
  stock: number
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  price: number
  quantity: number
}

export interface Order {
  id: number
  createdAt: string
  total: string
  deliveryType: DeliveryType
  items: OrderItem[]
}

export type DeliveryType = 'standard' | 'express'

export interface CheckoutForm {
  firstName: string
  lastName: string
  address: string
  zipCode: string
  city: string
  email: string
}

export interface CreatePaymentIntentBody {
  items: CartItem[]
  currency?: string
  deliveryType: DeliveryType
}

export interface ConfirmOrderBody {
  items: CartItem[]
  total: string
  deliveryType: DeliveryType
}

export interface UpdateStockBody {
  stock: number
}

export interface PaymentIntentResponse {
  clientSecret: string
  amount: number
}

export interface SuccessResponse {
  success: true
  message?: string
}
