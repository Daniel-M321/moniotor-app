import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import myChart from '@/components/myChart.vue'


describe('myChart.vue Implementation Test', () => {
  let wrapper = null

  // SETUP - run before to each unit test
  beforeEach(() => {
    // render the component
    wrapper = shallowMount(myChart, {
    })
  })

  // TEARDOWN - run after to each unit test
  afterEach(() => {
    wrapper.unmount()
  })

  it('initializes with correct elements', () => {
    // check that the heading text is rendered
    expect(wrapper.findAll('div').length).toEqual(8)
    expect(wrapper.findAll('p').at(0).text()).toMatch('Current Query:  30 Day(s) ago')
  })

//   it('processes valid props data', async () => {
//     // Update the props passed in to the WeatherResult component
//     wrapper.vm.queryData('Temperature')

//     // Wait until all Promises are resolved and the DOM updates
//     await flushPromises()
  
//     // check that the prop data is stored as expected within the component
//     expect(wrapper.vm.startTime).toMatch('')
//   })  
})