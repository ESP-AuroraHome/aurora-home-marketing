import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref, computed } from 'vue'
import TheHeader from '../../components/TheHeader.vue'

const mockPush = vi.fn()

vi.stubGlobal('useRouter', () => ({ push: mockPush }))
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)

const NuxtLinkStub = {
  name: 'NuxtLink',
  props: ['to', 'activeClass'],
  template: '<a :href="to"><slot /></a>',
}

const ClientOnlyStub = {
  name: 'ClientOnly',
  template: '<slot />',
}

describe('TheHeader', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the nav element', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub, ClientOnly: ClientOnlyStub },
      },
    })
    expect(wrapper.find('nav').exists()).toBe(true)
  })

  it('displays the AuroraHome brand name', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub, ClientOnly: ClientOnlyStub },
      },
    })
    expect(wrapper.text()).toContain('AuroraHome')
  })

  it('has navigation links', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub, ClientOnly: ClientOnlyStub },
      },
    })
    expect(wrapper.text()).toContain('Le Boîtier')
    expect(wrapper.text()).toContain('Documentation')
    expect(wrapper.text()).toContain('À Propos')
  })

  it('has a link to the cart', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub, ClientOnly: ClientOnlyStub },
      },
    })
    const links = wrapper.findAll('a')
    const cartLink = links.find((l) => l.attributes('href') === '/cart')
    expect(cartLink).toBeDefined()
  })

  it('does not show cart badge when cart is empty', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub, ClientOnly: ClientOnlyStub },
      },
    })
    const badge = wrapper.find('.bg-stone-800.text-white.text-\\[10px\\]')
    expect(badge.exists()).toBe(false)
  })

  it('has an Acheter button', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub, ClientOnly: ClientOnlyStub },
      },
    })
    const buttons = wrapper.findAll('button')
    const buyButton = buttons.find((b) => b.text().includes('Acheter'))
    expect(buyButton).toBeDefined()
  })

  it('clicking the desktop Acheter button adds to cart and navigates', async () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub, ClientOnly: ClientOnlyStub },
      },
    })
    const buttons = wrapper.findAll('button')
    const buyButton = buttons.find((b) => b.text() === 'Acheter')
    await buyButton?.trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/cart')
  })

  it('toggles mobile menu visibility on hamburger click', async () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub, ClientOnly: ClientOnlyStub },
      },
    })
    const buttons = wrapper.findAll('button')
    const menuButton = buttons.find((b) => !b.text().includes('Acheter'))
    expect(menuButton).toBeDefined()
    expect(wrapper.find('.flex-col.gap-1').exists()).toBe(false)
    await menuButton?.trigger('click')
    expect(wrapper.find('.flex-col.gap-1').exists()).toBe(true)
    await menuButton?.trigger('click')
    expect(wrapper.find('.flex-col.gap-1').exists()).toBe(false)
  })

  it('mobile Acheter button closes menu and navigates', async () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub, ClientOnly: ClientOnlyStub },
      },
    })
    const buttons = wrapper.findAll('button')
    const menuButton = buttons.find((b) => !b.text().includes('Acheter'))
    await menuButton?.trigger('click')
    const allButtons = wrapper.findAll('button')
    const mobileAcheter = allButtons.find((b) => b.text() === 'Acheter' && b.classes('w-full'))
    await mobileAcheter?.trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/cart')
  })
})
