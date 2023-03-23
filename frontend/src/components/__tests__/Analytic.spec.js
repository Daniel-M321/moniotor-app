import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Analytic from '../Analytic.vue'

describe('myHeader.vue Test', () => {   // renders analytic component, only used for one thing, so one test sufficient
    it('renders analysis when component is created', () => {
      // render the component
      const wrapper = shallowMount(Analytic, {
        propsData: {
          analyticInfo: 'Vue Project'
        }
      })
  
      // check that the analysis is rendered
      expect(wrapper.text()).toMatch('Vue Project')
    })
  })