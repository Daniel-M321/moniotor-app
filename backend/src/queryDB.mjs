import {InfluxDB, flux, fluxDuration} from '@influxdata/influxdb-client'
import {url, token, org} from '../env.mjs'
import {analyseHumidData, analyseTempData} from './analyse.mjs'

const queryApi = new InfluxDB({url, token}).getQueryApi(org)

async function queryTime(req_params) {
  console.log('*** QUERY ROWS ***')

  const start = fluxDuration('-30d')
  var measurement = "null"

  if(req_params.measurement)
    measurement = req_params.measurement

  const fluxQuery = flux`from(bucket:"sensors") 
    |> range(start: ${start}, stop: now()) 
    |> filter(fn: (r) => r._measurement == ${measurement})`
  console.log('query:', fluxQuery.toString())

//   try {
//     for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
//       const o = tableMeta.toObject(values)
//       //console.log(JSON.stringify(o, null, 2))
//       console.log(
//         `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
//       )
//       return o
//     }
//   } catch (e) {
//     console.log('\nFinished ERROR: '+e)
//   }
// }

  const scatterData = [];
  const lineBarData = {};
  await queryApi
      .collectRows(fluxQuery /*, you can specify a row mapper as a second arg */)
      .then(data => {
          data.forEach((x) => {
              scatterData.push({ x: x._time, y: x._value });
              lineBarData[x._time] = x._value
          })
          //console.log('\nCollect ROWS SUCCESS')
      })
      .catch(error => {
          console.error(error)
          console.log('\nCollect ROWS ERROR')
      })

  const analytics = ""
  if(measurement == "Temperature")
      analytics = analyseTempData(lineBarData)
  else if(measurement == "Humidity")
      analytics = analyseHumidData(lineBarData)
  else if(measurement = "Gas")
      analytics = analyseTempData(lineBarData)

  return ({ scatterData, lineBarData, analytics })

}

export {queryTime}
