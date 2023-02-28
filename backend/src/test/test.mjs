import {InfluxDB, flux, fluxDuration} from '@influxdata/influxdb-client'

var url = 'http://moniotor.eu-west-1.elasticbeanstalk.com:8086'
var token = 'oyX2YF9e8YdGX9HP4tGNyX_aRl4xShRX-ZbQ3heiSMnksw4jW5qRESHd_Yq0fko4GZUUkQFRBSxtVvNVPTIuPA=='
var org = 'nuig'

const queryApi = new InfluxDB({url, token}).getQueryApi(org)

async function queryTime() {
  console.log('*** QUERY ROWS ***')

  var measurement = "Temperature"
  var period = "-30d"

  const start = fluxDuration(period)

  const fluxQuery = flux`from(bucket:"sensors") 
    |> range(start: ${start}, stop: now()) 
    |> filter(fn: (r) => r._measurement == ${measurement})`
  console.log('query:', fluxQuery.toString())

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
          console.log(data)
          //console.log('\nCollect ROWS SUCCESS')
      })
      .catch(error => {
          console.error(error)
          console.log('\nCollect ROWS ERROR')
      })
}
queryTime()