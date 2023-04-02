import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import myHeader from '../myHeader.vue'


describe('myHeader.vue Test', () => {
  it('renders message when component is created', () => {
    // render the component
    const wrapper = shallowMount(myHeader, {})

    // check that the message is rendered
    expect(wrapper.findAll('a').at(0).text()).toMatch('Please enter a type and period for your data in the query box')  })
})