const axios = require("axios");


async function crea() {
    try {
        // for await (const {data} of axios.get("http://localhost:4000/queryinflux/")) {
        //     this.sensor = data;
        //     console.log(this.sensor)
        // }
        console.log("testing")
        const { data } = await axios.get('http://localhost:4000/queryinflux/')
        this.sensor = data
        console.log(this.sensor.sensor)
    } catch (e) {
        console.error(e)
    }
}
crea()