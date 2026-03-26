<template>
  <div class="pt-8 max-w-2xl mx-auto animate-fade-in">
    <section v-if="step === 'cart'">
      <h2 class="text-2xl font-bold mb-8">Votre Panier</h2>

      <div v-if="cart.items.length === 0" class="text-center py-12 glass-panel rounded-2xl">
        <i class="ph ph-shopping-bag-open text-4xl text-stone-300 mb-4 block"/>
        <p class="text-stone-500 mb-4">Votre panier est vide.</p>
        <NuxtLink to="/product" class="text-stone-800 font-medium underline">
          Retourner à la boutique
        </NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="(item, index) in cart.items"
          :key="item.id"
          class="glass-panel p-4 rounded-xl flex justify-between items-center"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 bg-white/50 rounded-lg flex items-center justify-center text-stone-300"
            >
              <i class="ph ph-cube text-2xl"/>
            </div>
            <div>
              <h3 class="font-semibold text-stone-800">{{ item.name }}</h3>
              <p class="text-sm text-stone-500">Édition Blanc Polaire</p>
              <div class="flex items-center mt-2 space-x-2">
                <button
                  class="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
                  @click="cart.decreaseItem(index)"
                >
                  -
                </button>
                <span class="text-xs font-semibold w-4 text-center">{{ item.quantity }}</span>
                <button
                  class="w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 'hover:bg-stone-200': !isOutOfStock(item) }"
                  :disabled="isOutOfStock(item)"
                  @click="tryIncrease(item)"
                >
                  +
                </button>
              </div>
              <p v-if="stockFor(item.id) !== null" class="text-xs text-stone-400 mt-1">
                Stock : {{ stockFor(item.id) }}
              </p>
            </div>
          </div>

          <div class="text-right">
            <div class="font-medium">{{ (item.price * item.quantity).toFixed(2) }} €</div>
            <button
              class="text-xs text-red-400 hover:text-red-600 underline mt-1"
              @click="cart.removeItem(index)"
            >
              Supprimer
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center py-4 text-xl font-bold">
          <span>Total</span>
          <span>{{ cart.total }} €</span>
        </div>

        <button
          class="w-full py-4 rounded-xl bg-stone-800 text-white font-bold hover:bg-stone-700 shadow-lg"
          @click="step = 'delivery'"
        >
          Passer la commande
        </button>
      </div>
    </section>

    <section v-else-if="step === 'delivery'">
      <button class="text-stone-500 text-sm mb-6 flex items-center gap-1 hover:text-stone-800" @click="step = 'cart'">
        <i class="ph ph-arrow-left"/> Retour au panier
      </button>

      <h2 class="text-2xl font-bold mb-8">Mode de Livraison</h2>

      <div class="space-y-4">
        <div
          class="glass-panel p-6 rounded-xl cursor-pointer transition-all border-2 flex justify-between items-center group"
          :class="deliveryType === 'standard' ? 'border-stone-800 bg-stone-50 shadow-md' : 'border-transparent hover:bg-white/60'"
          @click="deliveryType = 'standard'"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="deliveryType === 'standard' ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-300 group-hover:border-stone-400'"
            >
              <i v-if="deliveryType === 'standard'" class="ph-bold ph-check text-xs"/>
            </div>
            <div>
              <h3 class="font-semibold text-stone-800">Livraison Standard</h3>
              <p class="text-sm text-stone-500">3-5 jours ouvrés</p>
            </div>
          </div>
          <div class="font-bold text-stone-800">Gratuit</div>
        </div>

        <div
          class="glass-panel p-6 rounded-xl cursor-pointer transition-all border-2 flex justify-between items-center group"
          :class="deliveryType === 'express' ? 'border-stone-800 bg-stone-50 shadow-md' : 'border-transparent hover:bg-white/60'"
          @click="deliveryType = 'express'"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="deliveryType === 'express' ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-300 group-hover:border-stone-400'"
            >
              <i v-if="deliveryType === 'express'" class="ph-bold ph-check text-xs"/>
            </div>
            <div>
              <h3 class="font-semibold text-stone-800">Livraison Express</h3>
              <p class="text-sm text-stone-500">24h-48h</p>
            </div>
          </div>
          <div class="font-bold text-stone-800">10,00 €</div>
        </div>
      </div>

      <button
        class="w-full py-4 rounded-xl bg-stone-800 text-white font-bold hover:bg-stone-700 shadow-lg mt-8"
        @click="step = 'checkout'"
      >
        Continuer vers l'adresse
      </button>
    </section>

    <section v-else-if="step === 'checkout'">
      <button class="text-stone-500 text-sm mb-6 flex items-center gap-1 hover:text-stone-800" @click="step = 'delivery'">
        <i class="ph ph-arrow-left"/> Retour livraison
      </button>

      <h2 class="text-2xl font-bold mb-8">Adresse</h2>

      <form class="space-y-6" @submit.prevent="proceedToPayment">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-stone-500 uppercase ml-1">Prénom</label>
            <input v-model="form.firstName" type="text" required class="glass-input" placeholder="Antoine" >
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-stone-500 uppercase ml-1">Nom</label>
            <input v-model="form.lastName" type="text" required class="glass-input" placeholder="Dupont" >
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-semibold text-stone-500 uppercase ml-1">Adresse</label>
          <input v-model="form.address" type="text" required class="glass-input" placeholder="12 rue de la Paix" >
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-stone-500 uppercase ml-1">Code Postal</label>
            <input v-model="form.zipCode" type="text" required class="glass-input" placeholder="75000" >
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-stone-500 uppercase ml-1">Ville</label>
            <input v-model="form.city" type="text" required class="glass-input" placeholder="Paris" >
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-semibold text-stone-500 uppercase ml-1">Email</label>
          <input v-model="form.email" type="email" required class="glass-input" placeholder="antoine@example.com" >
        </div>

        <button
          type="submit"
          class="w-full py-4 rounded-xl bg-stone-800 text-white font-bold hover:bg-stone-700 shadow-lg mt-8"
        >
          Continuer vers le paiement
        </button>
      </form>
    </section>

    <section v-else-if="step === 'payment'">
      <button class="text-stone-500 text-sm mb-6 flex items-center gap-1 hover:text-stone-800" @click="step = 'checkout'">
        <i class="ph ph-arrow-left"/> Retour adresse
      </button>

      <h2 class="text-2xl font-bold mb-8">Paiement Sécurisé</h2>

      <div class="glass-panel p-8 rounded-2xl space-y-6">
        <div class="flex justify-between items-center text-sm text-stone-500 pb-4 border-b border-stone-200">
          <span>Sous-total</span>
          <span class="font-medium text-stone-800">{{ cart.total }} €</span>
        </div>
        <div class="flex justify-between items-center text-sm text-stone-500 pb-4 border-b border-stone-200">
          <span>Livraison ({{ deliveryType === 'express' ? 'Express' : 'Standard' }})</span>
          <span class="font-medium text-stone-800">{{ deliveryCost }} €</span>
        </div>
        <div class="flex justify-between items-center text-lg text-stone-800 pb-4 font-bold">
          <span>Total à payer</span>
          <span>{{ finalTotal }} €</span>
        </div>

        <div id="stripe-payment-element" class="min-h-[200px]">
          <div v-if="loadingStripe" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"/>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100"
        >
          {{ errorMessage }}
        </div>

        <button
          class="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isProcessing || !stripeReady"
          @click="processPayment"
        >
          <span v-if="!isProcessing">Payer {{ finalTotal }} €</span>
          <span v-else class="flex items-center gap-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"/>
            Traitement...
          </span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements } from '@stripe/stripe-js'
import { useCartStore } from '~/stores/cart'
import type { DeliveryType, CheckoutForm, Product } from '~/shared/types/index'

const cart = useCartStore()
const router = useRouter()
const config = useRuntimeConfig()

type CheckoutStep = 'cart' | 'delivery' | 'checkout' | 'payment'

const step = ref<CheckoutStep>('cart')
const deliveryType = ref<DeliveryType>('standard')
const isProcessing = ref(false)
const loadingStripe = ref(false)
const stripeReady = ref(false)
const errorMessage = ref('')
const productsStock = ref<Product[]>([])

const form = ref<CheckoutForm>({
  firstName: '',
  lastName: '',
  address: '',
  zipCode: '',
  city: '',
  email: '',
})

let stripe: Stripe | null = null
let elements: StripeElements | null = null

const deliveryCost = computed(() => (deliveryType.value === 'express' ? 10.0 : 0))
const finalTotal = computed(() =>
  (parseFloat(cart.total) + deliveryCost.value).toFixed(2),
)

/**
 * Returns the current stock level for a given product id, or `null` if unknown.
 *
 * @param id - The product id to look up.
 */
function stockFor(id: number): number | null {
  const product = productsStock.value.find((p) => p.id === id)
  return product?.stock ?? null
}

/**
 * Returns `true` when the cart item quantity has reached the available stock limit.
 *
 * @param item - The cart line to evaluate.
 */
function isOutOfStock(item: { id: number; quantity: number }): boolean {
  const stock = stockFor(item.id)
  if (stock === null) return false
  return item.quantity >= stock
}

/**
 * Increments an item quantity if stock allows.
 *
 * @param item - The cart line to increment.
 */
function tryIncrease(item: { id: number; name: string; price: number; quantity: number }): void {
  if (!isOutOfStock(item)) {
    cart.addItem({ id: item.id, name: item.name, price: item.price })
  }
}

/**
 * Transitions to the payment step, initialises Stripe, creates the PaymentIntent,
 * and mounts the Stripe payment element into the DOM.
 */
async function proceedToPayment(): Promise<void> {
  step.value = 'payment'
  loadingStripe.value = true
  stripeReady.value = false
  errorMessage.value = ''

  try {
    stripe = await loadStripe(config.public.stripePublishableKey)

    if (!stripe) {
      throw new Error('Stripe failed to initialise')
    }

    const data = await $fetch<{ clientSecret: string; amount: number }>('/api/payments/create-intent', {
      method: 'POST',
      body: {
        items: cart.items,
        deliveryType: deliveryType.value,
      },
    })

    elements = stripe.elements({
      appearance: { theme: 'stripe', variables: { colorPrimary: '#292524' } },
      clientSecret: data.clientSecret,
    })

    const paymentEl = elements.create('payment')
    await nextTick()
    paymentEl.mount('#stripe-payment-element')
    stripeReady.value = true
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Impossible d\'initialiser le paiement.'
  } finally {
    loadingStripe.value = false
  }
}

/**
 * Confirms the Stripe payment with billing details from the address form.
 * On success, saves the order to the backend and redirects to the confirmation page.
 */
async function processPayment(): Promise<void> {
  if (!stripe || !elements) return

  isProcessing.value = true
  errorMessage.value = ''

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}/confirmation`,
      payment_method_data: {
        billing_details: {
          name: `${form.value.firstName} ${form.value.lastName}`,
          email: form.value.email,
          address: {
            line1: form.value.address,
            city: form.value.city,
            postal_code: form.value.zipCode,
            country: 'FR',
          },
        },
      },
    },
    redirect: 'if_required',
  })

  if (error) {
    errorMessage.value = error.message ?? 'Une erreur est survenue.'
    isProcessing.value = false
    return
  }

  try {
    await $fetch('/api/orders/confirm', {
      method: 'POST',
      body: {
        items: cart.items,
        total: finalTotal.value,
        deliveryType: deliveryType.value,
      },
    })
  } finally {
    cart.clear()
    if (import.meta.client) localStorage.removeItem('checkout-form')
    router.push('/confirmation')
  }
}

onMounted(async () => {
  if (import.meta.client) {
    const saved = localStorage.getItem('checkout-form')
    if (saved) {
      try {
        form.value = JSON.parse(saved) as CheckoutForm
      } catch { /* invalid JSON in localStorage — ignore */ }
    }
  }

  productsStock.value = await $fetch<Product[]>('/api/products')
})

watch(
  form,
  (val: CheckoutForm) => {
    if (import.meta.client) {
      localStorage.setItem('checkout-form', JSON.stringify(val))
    }
  },
  { deep: true },
)
</script>
