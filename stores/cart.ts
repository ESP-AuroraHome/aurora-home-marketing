import { defineStore } from 'pinia'
import type { CartItem } from '~/shared/types/index'

const STORAGE_KEY = 'aurora-cart'

/**
 * Global cart store powered by Pinia.
 * State is persisted to `localStorage` on every mutation (client-side only).
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    /**
     * The formatted grand total (e.g. "178.00") without any delivery surcharge.
     */
    total(state): string {
      return state.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
    },

    /**
     * The total number of units across all cart lines.
     */
    count(state): number {
      return state.items.reduce((acc, item) => acc + item.quantity, 0)
    },
  },

  actions: {
    /**
     * Loads the persisted cart from `localStorage`.
     * Must be called once on the client side (e.g. in a plugin or `onMounted`).
     */
    hydrate(): void {
      if (!import.meta.client) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        this.items = JSON.parse(raw) as CartItem[]
      } catch {
        this.items = []
      }
    },

    /**
     * Writes the current cart state to `localStorage`.
     */
    persist(): void {
      if (!import.meta.client) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    },

    /**
     * Adds one unit of a product to the cart.
     * If the product is already present, its quantity is incremented.
     *
     * @param product - Partial product data sufficient to create a cart line.
     */
    addItem(product: Pick<CartItem, 'id' | 'name' | 'price'>): void {
      const existing = this.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
      this.persist()
    },

    /**
     * Decrements the quantity of a cart line by index.
     * Removes the line entirely when the quantity reaches zero.
     *
     * @param index - Zero-based index in the `items` array.
     */
    decreaseItem(index: number): void {
      const item = this.items[index]
      if (!item) return
      if (item.quantity > 1) {
        item.quantity--
      } else {
        this.items.splice(index, 1)
      }
      this.persist()
    },

    /**
     * Removes a cart line by index regardless of its quantity.
     *
     * @param index - Zero-based index in the `items` array.
     */
    removeItem(index: number): void {
      this.items.splice(index, 1)
      this.persist()
    },

    /**
     * Empties the cart and clears the persisted state.
     */
    clear(): void {
      this.items = []
      this.persist()
    },
  },
})
