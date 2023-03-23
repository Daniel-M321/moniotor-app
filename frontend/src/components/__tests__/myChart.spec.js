import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import myChart from '@/components/myChart.vue'
import axios from 'axios'


vi.mock("axios", () => {
    return {
      default: {
        get: vi.fn(),
      },
    };
});

describe('myChart.vue Implementation Test', () => {
  let wrapper = null

  // SETUP - run before to each unit test
  beforeEach(() => {
    const responseGet = { data: // response from get request
        {
          info: {
            lineBarData: {
                "18:35": 25,
                "18:40": 26,
                "18:45": 32
            },
            analytics: "test analytics",
          }
        }
    }

    // Set the mock call to GET to return a successful GET response
    axios.get.mockResolvedValue(responseGet)

    // render the component
    wrapper = shallowMount(myChart, {
    })
  })

  // TEARDOWN - run after to each unit test
  afterEach(() => {
    axios.get.mockReset()
    wrapper.unmount()
  })

  it('initialises with correct elements', () => {
    // check that the heading text is rendered
    expect(wrapper.findAll('div').length).toEqual(8)
    // Nothing selected when initialised

    expect(axios.get).toHaveBeenCalledTimes(1)
  })

  it('Query function works as expected', async () => {
    // run queryData function
    wrapper.vm.queryData('Temperature')

    // Wait until all Promises are resolved and the DOM updates
    await flushPromises()

    expect(axios.get).toHaveBeenCalledTimes(2)
  
    // check that the prop data is stored as expected after query
    expect(wrapper.vm.startDate).toMatch('18:35')

    wrapper.vm.queryData('Temperature')
    // Wait until all Promises are resolved and the DOM updates
    await flushPromises()

    // recheck data
    expect(axios.get).toHaveBeenCalledTimes(3)
    expect(wrapper.vm.endDate).toMatch('18:45')
  })  
})