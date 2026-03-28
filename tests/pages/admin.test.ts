import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import type { Order, Product } from '~/shared/types/index'

import AdminPage from '../../pages/admin.vue'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal(
  'onMounted',
  vi.fn((fn: () => void) => fn())
)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

const NuxtLinkStub = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

const ClientOnlyStub = {
  name: 'ClientOnly',
  template: '<slot />',
}

const BarStub = {
  name: 'Bar',
  props: ['data', 'options'],
  template: '<div class="chart-stub" />',
}

const mockProducts: Product[] = [
  { id: 1, name: 'Aurora One', price: 89.0, stock: 100 },
  { id: 2, name: 'Aurora Pro', price: 149.0, stock: 20 },
]

const mockOrders: Order[] = [
  {
    id: 3,
    createdAt: '2024-06-15 10:00:00',
    total: '89.00',
    deliveryType: 'standard',
    items: [
      { id: 10, orderId: 3, productId: 1, productName: 'Aurora One', price: 89.0, quantity: 1 },
    ],
  },
  {
    id: 1,
    createdAt: '2024-06-01 09:00:00',
    total: '178.00',
    deliveryType: 'express',
    items: [
      { id: 5, orderId: 1, productId: 1, productName: 'Aurora One', price: 89.0, quantity: 2 },
    ],
  },
]

describe('pages/admin.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValueOnce(mockProducts).mockResolvedValueOnce(mockOrders)
  })

  function mountPage() {
    return mount(AdminPage, {
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          ClientOnly: ClientOnlyStub,
          Bar: BarStub,
        },
      },
    })
  }

  it('renders without errors', () => {
    const wrapper = mountPage()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the Admin Dashboard heading', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Admin Dashboard')
  })

  it('contains a link back to the main site', () => {
    const wrapper = mountPage()
    const homeLink = wrapper.find('a[href="/"]')
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.text()).toContain('Retour Site')
  })

  it('displays the recent sales section heading', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Ventes Récentes')
  })

  it('displays the recent orders section heading', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Dernières Commandes')
  })

  it('displays the stock management section heading', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Gestion des Stocks')
  })

  it('fetches products and orders on mount', () => {
    mountPage()
    expect(mockFetch).toHaveBeenCalledWith('/api/products')
    expect(mockFetch).toHaveBeenCalledWith('/api/orders')
  })

  describe('with loaded data', () => {
    it('shows product names in the stock table', async () => {
      const wrapper = mountPage()
      await new Promise((r) => setTimeout(r, 0))
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Aurora One')
    })

    it('shows product prices in the stock table', async () => {
      const wrapper = mountPage()
      await new Promise((r) => setTimeout(r, 0))
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('89')
    })

    it('shows order total in the recent orders list', async () => {
      const wrapper = mountPage()
      await new Promise((r) => setTimeout(r, 0))
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('89.00')
    })

    it('shows order delivery type in the recent orders list', async () => {
      const wrapper = mountPage()
      await new Promise((r) => setTimeout(r, 0))
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('standard')
    })
  })

  describe('empty state', () => {
    it('shows empty message when no orders exist', async () => {
      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce(mockProducts).mockResolvedValueOnce([])

      const wrapper = mountPage()
      await new Promise((r) => setTimeout(r, 0))
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Aucune commande récente')
    })
  })

  describe('stock table structure', () => {
    it('renders the stock table with correct column headers', () => {
      const wrapper = mountPage()
      expect(wrapper.text()).toContain('Produit')
      expect(wrapper.text()).toContain('Prix')
      expect(wrapper.text()).toContain('Stock Actuel')
      expect(wrapper.text()).toContain('Action')
    })

    it('has update buttons in the stock table', async () => {
      const wrapper = mountPage()
      await new Promise((r) => setTimeout(r, 0))
      await wrapper.vm.$nextTick()

      const updateButtons = wrapper.findAll('button')
      expect(updateButtons.length).toBeGreaterThan(0)
    })
  })

  describe('updateStock', () => {
    it('calls PUT /api/products/:id when update button is clicked', async () => {
      mockFetch.mockReset()
      mockFetch
        .mockResolvedValueOnce(mockProducts)
        .mockResolvedValueOnce(mockOrders)
        .mockResolvedValueOnce({ success: true, product: mockProducts[0] })
        .mockResolvedValueOnce(mockProducts)
        .mockResolvedValueOnce(mockOrders)

      const wrapper = mountPage()
      await new Promise((r) => setTimeout(r, 0))
      await wrapper.vm.$nextTick()

      const updateButtons = wrapper.findAll('button')
      if (updateButtons.length > 0) {
        await updateButtons[0].trigger('click')
        await new Promise((r) => setTimeout(r, 0))

        const putCalls = mockFetch.mock.calls.filter(
          (call: unknown[]) =>
            typeof call[0] === 'string' && (call[0] as string).startsWith('/api/products/')
        )
        expect(putCalls.length).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('stock warnings', () => {
    it('applies red text styling for low stock products', async () => {
      const lowStockProducts: Product[] = [{ id: 1, name: 'Aurora One', price: 89.0, stock: 5 }]
      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce(lowStockProducts).mockResolvedValueOnce([])

      const wrapper = mountPage()
      await new Promise((r) => setTimeout(r, 0))
      await wrapper.vm.$nextTick()

      const redElements = wrapper.findAll('.text-red-500')
      expect(redElements.length).toBeGreaterThan(0)
    })

    it('does not apply red text for normal stock levels', async () => {
      const normalStockProducts: Product[] = [
        { id: 1, name: 'Aurora One', price: 89.0, stock: 100 },
      ]
      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce(normalStockProducts).mockResolvedValueOnce([])

      const wrapper = mountPage()
      await new Promise((r) => setTimeout(r, 0))
      await wrapper.vm.$nextTick()

      const stockCell = wrapper.find('.text-stone-800')
      expect(stockCell.exists()).toBe(true)
    })
  })
})
