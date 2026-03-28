import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../../stores/cart'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      const next: Record<string, string> = {}
      for (const k in store) {
        if (k !== key) next[k] = store[k]
      }
      store = next
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

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('has empty initial state', () => {
    const cart = useCartStore()
    expect(cart.items).toEqual([])
    expect(cart.count).toBe(0)
    expect(cart.total).toBe('0.00')
  })

  it('addItem adds a new product', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0]).toEqual({ id: 1, name: 'Aurora One', price: 89.0, quantity: 1 })
  })

  it('addItem increments quantity when item already exists', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].quantity).toBe(2)
  })

  it('addItem can add multiple distinct products', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.addItem({ id: 2, name: 'Aurora Two', price: 149.0 })
    expect(cart.items).toHaveLength(2)
  })

  it('decreaseItem decrements quantity', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.decreaseItem(0)
    expect(cart.items[0].quantity).toBe(1)
  })

  it('decreaseItem removes item when quantity reaches 0', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.decreaseItem(0)
    expect(cart.items).toHaveLength(0)
  })

  it('decreaseItem does nothing for invalid index', () => {
    const cart = useCartStore()
    cart.decreaseItem(99)
    expect(cart.items).toHaveLength(0)
  })

  it('removeItem removes item by index', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.addItem({ id: 2, name: 'Aurora Two', price: 149.0 })
    cart.removeItem(0)
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].id).toBe(2)
  })

  it('clear empties the cart', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.addItem({ id: 2, name: 'Aurora Two', price: 149.0 })
    cart.clear()
    expect(cart.items).toHaveLength(0)
  })

  it('count getter returns correct total units', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.addItem({ id: 2, name: 'Aurora Two', price: 149.0 })
    expect(cart.count).toBe(3)
  })

  it('total getter returns formatted price string', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    expect(cart.total).toBe('178.00')
  })

  it('total getter handles mixed items', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Aurora One', price: 89.0 })
    cart.addItem({ id: 2, name: 'Aurora Two', price: 11.0 })
    expect(cart.total).toBe('100.00')
  })
})
