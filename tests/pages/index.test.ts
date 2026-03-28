import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import IndexPage from '../../pages/index.vue'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal(
  'onMounted',
  vi.fn((fn: () => void) => fn())
)
vi.stubGlobal('onBeforeUnmount', vi.fn())

const NuxtLinkStub = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

const LiquidGlassStub = {
  name: 'LiquidGlass',
  props: ['id', 'class'],
  template: '<div><slot /></div>',
}

const mockObserve = vi.fn()
const mockUnobserve = vi.fn()

class MockIntersectionObserver {
  observe = mockObserve
  unobserve = mockUnobserve
}

describe('pages/index.vue', () => {
  let originalGetElementById: typeof document.getElementById
  let originalQuerySelectorAll: typeof document.querySelectorAll
  let originalAddEventListener: typeof window.addEventListener
  let originalRemoveEventListener: typeof window.removeEventListener
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame
  let originalCancelAnimationFrame: typeof window.cancelAnimationFrame
  let originalSetTimeout: typeof window.setTimeout

  beforeEach(() => {
    originalGetElementById = document.getElementById.bind(document)
    originalQuerySelectorAll = document.querySelectorAll.bind(document)
    originalAddEventListener = window.addEventListener.bind(window)
    originalRemoveEventListener = window.removeEventListener.bind(window)
    originalRequestAnimationFrame = window.requestAnimationFrame
    originalCancelAnimationFrame = window.cancelAnimationFrame
    originalSetTimeout = window.setTimeout

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 1)
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('setTimeout', vi.fn())

    vi.spyOn(document, 'getElementById').mockReturnValue(null)
    vi.spyOn(document, 'querySelectorAll').mockReturnValue([] as unknown as NodeListOf<Element>)
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {})
    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {})
  })

  afterEach(() => {
    document.getElementById = originalGetElementById
    document.querySelectorAll = originalQuerySelectorAll
    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
    window.requestAnimationFrame = originalRequestAnimationFrame
    window.cancelAnimationFrame = originalCancelAnimationFrame
    window.setTimeout = originalSetTimeout
    vi.restoreAllMocks()
  })

  function mountPage() {
    return mount(IndexPage, {
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          LiquidGlass: LiquidGlassStub,
        },
      },
    })
  }

  it('renders without errors', () => {
    const wrapper = mountPage()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the main hero headline', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain("L'harmonie invisible")
  })

  it('contains a link to the product page', () => {
    const wrapper = mountPage()
    const productLinks = wrapper.findAll('a[href="/product"]')
    expect(productLinks.length).toBeGreaterThan(0)
  })

  it('displays the product price in CTA', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('89€')
  })

  it('contains a link to the documentation', () => {
    const wrapper = mountPage()
    const docLinks = wrapper.findAll('a')
    const docLink = docLinks.find((l) => l.text().includes('Documentation'))
    expect(docLink).toBeDefined()
  })

  it('displays air quality sensor reading', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('ppm')
  })

  it('displays temperature reading', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('21.5°')
  })

  it('displays humidity reading', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('45%')
  })

  it('renders the features section', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Discret')
    expect(wrapper.text()).toContain('Open Source')
    expect(wrapper.text()).toContain('Plug')
  })

  it('renders the installation steps section', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Installation simplifiée')
    expect(wrapper.text()).toContain('Déballez')
    expect(wrapper.text()).toContain('Branchez')
    expect(wrapper.text()).toContain('Respirez')
  })

  it('renders the testimonials section', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Sophie M.')
    expect(wrapper.text()).toContain('Thomas L.')
  })

  it('renders the FAQ section', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Questions fréquentes')
    expect(wrapper.text()).toContain('HomeKit')
  })

  it('renders the final CTA section', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Commander Aurora')
  })

  it('initialises IntersectionObserver on mount', () => {
    const fakeEl = document.createElement('div')
    vi.spyOn(document, 'querySelectorAll').mockReturnValue([
      fakeEl,
    ] as unknown as NodeListOf<Element>)
    mountPage()
    expect(mockObserve).toHaveBeenCalledWith(fakeEl)
  })
})
