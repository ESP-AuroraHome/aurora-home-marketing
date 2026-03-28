import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LiquidGlass from '../../components/LiquidGlass.vue'

describe('LiquidGlass', () => {
  it('renders a wrapper div', () => {
    const wrapper = mount(LiquidGlass)
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('passes through attrs to the root element', () => {
    const wrapper = mount(LiquidGlass, {
      attrs: { class: 'custom-class', id: 'glass-wrapper' },
    })
    expect(wrapper.attributes('id')).toBe('glass-wrapper')
  })

  it('renders default slot content', () => {
    const wrapper = mount(LiquidGlass, {
      slots: { default: '<span>Hello Glass</span>' },
    })
    expect(wrapper.text()).toContain('Hello Glass')
  })
})
