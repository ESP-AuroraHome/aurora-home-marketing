import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'
import { useCartStore } from '../../stores/cart'

import CartPage from '../../pages/cart.vue'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('watch', watch)
vi.stubGlobal('nextTick', nextTick)

const mockPush = vi.fn()
vi.stubGlobal('useRouter', () => ({ push: mockPush }))
vi.stubGlobal('useRuntimeConfig', () => ({
  stripeSecretKey: 'sk_test_mock',
  public: { stripePublishableKey: 'pk_test_mock' },
}))

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

vi.stubGlobal(
  'onMounted',
  vi.fn((fn: () => void) => fn())
)

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      store = Object.fromEntries(Object.entries(store).filter(([k]) => k !== key))
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

vi.stubGlobal('import.meta', { client: true })

const NuxtLinkStub = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

let pinia = createPinia()

describe('pages/cart.vue', () => {
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorageMock.clear()
    vi.clearAllMocks()
    mockFetch.mockResolvedValue([{ id: 1, name: 'Aurora One', price: 89.0, stock: 100 }])
  })

  function mountPage() {
    return mount(CartPage, {
      global: {
        plugins: [pinia],
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })
  }

  describe('empty cart step', () => {
    it('renders without errors', () => {
      const wrapper = mountPage()
      expect(wrapper.exists()).toBe(true)
    })

    it('shows empty cart message when cart has no items', () => {
      const wrapper = mountPage()
      expect(wrapper.text()).toContain('Votre panier est vide')
    })

    it('shows a link back to the shop when cart is empty', () => {
      const wrapper = mountPage()
      const shopLink = wrapper.find('a[href="/product"]')
      expect(shopLink.exists()).toBe(true)
    })

    it('does not show the order button when cart is empty', () => {
      const wrapper = mountPage()
      const buttons = wrapper.findAll('button')
      const orderButton = buttons.find((b) => b.text().includes('Passer la commande'))
      expect(orderButton).toBeUndefined()
    })
  })

  describe('cart with items', () => {
    it('displays item name when cart has items', async () => {
      const cart = useCartStore()
      cart.items = [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 2 }]
      const wrapper = mountPage()
      await nextTick()

      expect(wrapper.text()).toContain('Aurora One')
    })

    it('displays item quantity', async () => {
      const cart = useCartStore()
      cart.items = [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 3 }]
      const wrapper = mountPage()
      await nextTick()

      expect(wrapper.text()).toContain('3')
    })

    it('displays the cart total', async () => {
      const cart = useCartStore()
      cart.items = [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 2 }]
      const wrapper = mountPage()
      await nextTick()

      expect(wrapper.text()).toContain('178.00')
    })

    it('shows the order button when cart has items', async () => {
      const cart = useCartStore()
      cart.items = [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }]
      const wrapper = mountPage()
      await nextTick()

      const orderButton = wrapper
        .findAll('button')
        .find((b) => b.text().includes('Passer la commande'))
      expect(orderButton).toBeDefined()
    })

    it('clicking the order button transitions to delivery step', async () => {
      const cart = useCartStore()
      cart.items = [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }]
      const wrapper = mountPage()
      await nextTick()

      const orderButton = wrapper
        .findAll('button')
        .find((b) => b.text().includes('Passer la commande'))
      await orderButton?.trigger('click')
      await nextTick()

      expect(wrapper.text()).toContain('Mode de Livraison')
    })

    it('shows a delete button per item', async () => {
      const cart = useCartStore()
      cart.items = [
        { id: 1, name: 'Aurora One', price: 89.0, quantity: 1 },
        { id: 2, name: 'Aurora Pro', price: 149.0, quantity: 1 },
      ]
      const wrapper = mountPage()
      await nextTick()

      const deleteButtons = wrapper.findAll('button').filter((b) => b.text() === 'Supprimer')
      expect(deleteButtons).toHaveLength(2)
    })

    it('clicking delete removes the item from cart', async () => {
      const cart = useCartStore()
      cart.items = [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }]
      const wrapper = mountPage()
      await nextTick()

      const deleteButton = wrapper.findAll('button').find((b) => b.text() === 'Supprimer')
      await deleteButton?.trigger('click')
      await nextTick()

      expect(cart.items).toHaveLength(0)
    })

    it('clicking the decrease button decrements quantity', async () => {
      const cart = useCartStore()
      cart.items = [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 2 }]
      const wrapper = mountPage()
      await nextTick()

      const decreaseButton = wrapper.findAll('button').find((b) => b.text() === '-')
      await decreaseButton?.trigger('click')
      await nextTick()

      expect(cart.items[0].quantity).toBe(1)
    })

    it('displays the formatted line total (price * quantity)', async () => {
      const cart = useCartStore()
      cart.items = [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 3 }]
      const wrapper = mountPage()
      await nextTick()

      expect(wrapper.text()).toContain('267.00')
    })
  })

  describe('delivery step', () => {
    async function goToDelivery() {
      const cart = useCartStore()
      cart.items = [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }]
      const wrapper = mountPage()
      await nextTick()

      const orderButton = wrapper
        .findAll('button')
        .find((b) => b.text().includes('Passer la commande'))
      await orderButton?.trigger('click')
      await nextTick()
      return wrapper
    }

    it('shows delivery mode heading', async () => {
      const wrapper = await goToDelivery()
      expect(wrapper.text()).toContain('Mode de Livraison')
    })

    it('shows standard delivery option', async () => {
      const wrapper = await goToDelivery()
      expect(wrapper.text()).toContain('Livraison Standard')
    })

    it('shows express delivery option', async () => {
      const wrapper = await goToDelivery()
      expect(wrapper.text()).toContain('Livraison Express')
    })

    it('shows express delivery cost', async () => {
      const wrapper = await goToDelivery()
      expect(wrapper.text()).toContain('10,00 €')
    })

    it('shows standard delivery as free', async () => {
      const wrapper = await goToDelivery()
      expect(wrapper.text()).toContain('Gratuit')
    })

    it('back button returns to cart step', async () => {
      const wrapper = await goToDelivery()
      const backButton = wrapper
        .findAll('button')
        .find((b) => b.text().includes('Retour au panier'))
      await backButton?.trigger('click')
      await nextTick()
      expect(wrapper.text()).toContain('Votre Panier')
    })

    it('continue button transitions to checkout step', async () => {
      const wrapper = await goToDelivery()
      const continueButton = wrapper
        .findAll('button')
        .find((b) => b.text().includes("Continuer vers l'adresse"))
      await continueButton?.trigger('click')
      await nextTick()
      expect(wrapper.text()).toContain('Adresse')
    })
  })

  describe('checkout / address step', () => {
    async function goToCheckout() {
      const cart = useCartStore()
      cart.items = [{ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 }]
      const wrapper = mountPage()
      await nextTick()

      const orderButton = wrapper
        .findAll('button')
        .find((b) => b.text().includes('Passer la commande'))
      await orderButton?.trigger('click')
      await nextTick()

      const continueButton = wrapper
        .findAll('button')
        .find((b) => b.text().includes("Continuer vers l'adresse"))
      await continueButton?.trigger('click')
      await nextTick()
      return wrapper
    }

    it('shows address heading', async () => {
      const wrapper = await goToCheckout()
      expect(wrapper.text()).toContain('Adresse')
    })

    it('shows form fields for personal info', async () => {
      const wrapper = await goToCheckout()
      expect(wrapper.find('input[placeholder="Antoine"]').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="Dupont"]').exists()).toBe(true)
    })

    it('shows form field for address', async () => {
      const wrapper = await goToCheckout()
      expect(wrapper.find('input[placeholder="12 rue de la Paix"]').exists()).toBe(true)
    })

    it('shows form field for email', async () => {
      const wrapper = await goToCheckout()
      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    })

    it('back button returns to delivery step', async () => {
      const wrapper = await goToCheckout()
      const backButton = wrapper
        .findAll('button')
        .find((b) => b.text().includes('Retour livraison'))
      await backButton?.trigger('click')
      await nextTick()
      expect(wrapper.text()).toContain('Mode de Livraison')
    })
  })

  describe('stock display', () => {
    it('fetches products on mount to check stock levels', () => {
      mountPage()
      expect(mockFetch).toHaveBeenCalledWith('/api/products')
    })
  })
})
