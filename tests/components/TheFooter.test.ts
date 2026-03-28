import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TheFooter from '../../components/TheFooter.vue'

vi.mock('#app', () => ({}), { virtual: true })

const NuxtLinkStub = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

describe('TheFooter', () => {
  it('renders the footer element', () => {
    const wrapper = mount(TheFooter, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('displays copyright text', () => {
    const wrapper = mount(TheFooter, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })
    expect(wrapper.text()).toContain('AuroraHome')
  })

  it('has a link to the about page', () => {
    const wrapper = mount(TheFooter, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })
    const links = wrapper.findAll('a')
    const aboutLink = links.find((l) => l.text().includes('Mentions'))
    expect(aboutLink).toBeDefined()
  })

  it('has a Support external link', () => {
    const wrapper = mount(TheFooter, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })
    const links = wrapper.findAll('a')
    const supportLink = links.find((l) => l.text().includes('Support'))
    expect(supportLink).toBeDefined()
  })

  it('has a GitHub external link', () => {
    const wrapper = mount(TheFooter, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })
    const links = wrapper.findAll('a')
    const githubLink = links.find((l) => l.text().includes('GitHub'))
    expect(githubLink).toBeDefined()
    expect(githubLink?.attributes('href')).toContain('github.com')
  })
})
