import {InfluxDB, flux, fluxDuration} from '@influxdata/influxdb-client'
import {url, token, org} from '../env.mjs'

const queryApi = new InfluxDB({url, token}).getQueryApi(org)

async function queryTime() {
  console.log('*** QUERY ROWS ***')

  const start = fluxDuration('-30d')
  const measurement = 'myMeasurement'

  const fluxQuery = flux`from(bucket:"sensors") 
    |> range(start: ${start}) 
    |> filter(fn: (r) => r._measurement == ${measurement})`
  console.log('query:', fluxQuery.toString())

  try {
    for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
      const o = tableMeta.toObject(values)
      //console.log(JSON.stringify(o, null, 2))
      console.log(
        `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
      )
      return o
    }
  } catch (e) {
    console.log('\nFinished ERROR: '+e)
  }
}

export {queryTime}