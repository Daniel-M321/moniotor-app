/** InfluxDB v2 URL */
const url = process.env['INFLUX_URL'] || 'http://moniotor-influxdb-1:8086'
/** InfluxDB authorization token */
const token = process.env['DOCKER_INFLUXDB_INIT_ADMIN_TOKEN']
/** Organization within InfluxDB  */
const org = process.env['DOCKER_INFLUXDB_INIT_ORG'] || 'nuig'
/**InfluxDB bucket used in examples  */
const bucket = process.env['DOCKER_INFLUXDB_INIT_BUCKET'] || 'sensors'
// ONLY onboarding example
/**InfluxDB user  */
const username = process.env['DOCKER_INFLUXDB_INIT_USERNAME'] || 'admin'
/**InfluxDB password  */
const password = process.env['DOCKER_INFLUXDB_INIT_PASSWORD']

export {url, token, org, bucket, username, password}