import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Analytic from '../Analytic.vue'

describe('myHeader.vue Test', () => {
    it('renders analysis when component is created', () => {
      // render the component
      const wrapper = shallowMount(Analytic, {
        propsData: {
          info: 'Vue Project'
        }
      })
  
      // check that the analysis is rendered
      expect(wrapper.text()).toMatch('Vue Project')
    })
  })