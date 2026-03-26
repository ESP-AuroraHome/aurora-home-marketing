import Stripe from 'stripe'
import { getDb } from '~/server/db/index'
import type { CreatePaymentIntentBody, PaymentIntentResponse } from '~/shared/types/index'

interface ProductRow {
  id: number
  name: string
  price: number
  stock: number
}

const EXPRESS_DELIVERY_SURCHARGE = 10.0

/**
 * POST /api/payments/create-intent
 *
 * Validates cart items against live stock, computes the total, and creates a
 * Stripe PaymentIntent. The client secret is returned to the browser so that
 * Stripe.js can complete the payment without the secret key ever leaving the server.
 *
 * @throws 400 when the cart is empty, a product is unknown, or stock is insufficient.
 * @throws 500 when the Stripe API call fails.
 * @returns A {@link PaymentIntentResponse} containing the `clientSecret` and `amount`.
 */
export default defineEventHandler(async (event): Promise<PaymentIntentResponse> => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey)

  const body = await readBody<CreatePaymentIntentBody>(event)

  if (!body.items || body.items.length === 0) {
    throw createError({ statusCode: 400, message: 'Cart is empty' })
  }

  const db = getDb()

  let totalAmount = 0

  for (const item of body.items) {
    const product = db
      .prepare<[number], ProductRow>('SELECT id, name, price, stock FROM products WHERE id = ?')
      .get(item.id)

    if (!product) {
      throw createError({ statusCode: 400, message: `Product ${item.id} not found` })
    }

    if (product.stock < item.quantity) {
      throw createError({
        statusCode: 400,
        message: `${product.name} has only ${product.stock} unit(s) left in stock`,
      })
    }

    totalAmount += product.price * item.quantity
  }

  if (body.deliveryType === 'express') {
    totalAmount += EXPRESS_DELIVERY_SURCHARGE
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100),
    currency: body.currency ?? 'eur',
    automatic_payment_methods: { enabled: true },
  })

  if (!intent.client_secret) {
    throw createError({ statusCode: 500, message: 'Stripe did not return a client secret' })
  }

  return {
    clientSecret: intent.client_secret,
    amount: totalAmount,
  }
})
