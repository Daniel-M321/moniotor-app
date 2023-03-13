import {flux, fluxDuration, Point} from '@influxdata/influxdb-client'
import {analyseBasic, analyseCO} from './analyse.mjs'

async function queryTime(req_params, queryApi) {
  console.log('*** QUERY ROWS ***')

  var measurement = "null"

  if(req_params.measurement)
    measurement = req_params.measurement

  if(req_params.period && req_params.p_unit && req_params.period !== "" && req_params.p_unit !== "") {
    var period = req_params.period
    var unit = req_params.p_unit
    if(period < 1) {
      console.log("invalid period entered: defaulted to 30 days")
      period = "-30d"
    } else if(unit == "Month(s)" || unit == "Hour(s)" || unit == "Week(s)" || unit == "Day(s)") {
      period = "-"+period+unit.charAt(0).toLowerCase()
      if(unit == "Month(s)")
        period += "o"
    }
  }
  else{
    var period = "-30d"
  }

  const start = fluxDuration(period)

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
              var time = dateFormatter(new Date(x._time))
              scatterData.push({ x: x._time, y: x._value });
              lineBarData[time] = x._value
          })
          //console.log('\nCollect ROWS SUCCESS')
      })
      .catch(error => {
          console.error(error)
          console.log('\nCollect ROWS ERROR')
      })

  var analytics = ""
  if(measurement == "Temperature")
      analytics = analyseBasic(lineBarData, measurement, [10, 30], "*C") // probs better to do all analysis in above loop^, so not looping twice.
  else if(measurement == "Humidity")
      analytics = analyseBasic(lineBarData, measurement, [20, 75], "%")
  else if(measurement == "CO")
      analytics = analyseCO(lineBarData)

  return ({ scatterData, lineBarData, analytics })

}

function dateFormatter(date){
  return date.toLocaleDateString()+","+date.getHours()+":"+date.getMinutes()
}

async function writeDB(req_params, writeApi) {
  console.log('*** WRITE DB ***')

  if(!req_params.phone_number){
    return null
  }

  const point1 = new Point("Phone")
  .tag("Location", "User")
  .floatField("number", req_params.phone_number)

  writeApi.writePoint(point1)

  writeApi.close().then(() => {
    console.log('WRITE FINISHED')
  })

  return "Success"
}

export {queryTime}
