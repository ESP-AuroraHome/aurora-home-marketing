import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmationPage from '../../pages/confirmation.vue'

const NuxtLinkStub = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

describe('pages/confirmation.vue', () => {
  function mountPage() {
    return mount(ConfirmationPage, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })
  }

  it('renders without errors', () => {
    const wrapper = mountPage()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the confirmation heading', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Commande Confirmée')
  })

  it('displays the thank-you message', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Merci pour votre achat')
  })

  it('informs user that a confirmation email was sent', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('confirmation a été envoyée')
  })

  it('mentions the next steps section', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Prochaines étapes')
  })

  it('mentions email recap step', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('email récapitulatif')
  })

  it('mentions shipping tracking step', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('lien de suivi')
  })

  it('contains a link back to the home page', () => {
    const wrapper = mountPage()
    const homeLink = wrapper.find('a[href="/"]')
    expect(homeLink.exists()).toBe(true)
  })

  it('the home link has appropriate text', () => {
    const wrapper = mountPage()
    const homeLink = wrapper.find('a[href="/"]')
    expect(homeLink.text()).toContain("Retour à l'accueil")
  })
})
