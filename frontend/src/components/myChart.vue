<template>
    <div class="row">
        <div class="col-md-8">
            <div class="col cards">
                <div class="col dataHeader active"> <b>Main Graph</b></div>

                <div class="container my-5">

                    <canvas height="150" id="myChart-diagram"></canvas>

                    <hr>
                    <div class="row">
                        <small class="col today active">{{ startDate }}</small>
                        <small class="col compared text-muted disabled"> TO </small>
                        <small class="col previous">{{ endDate }}</small>
                    </div>
                </div>
            </div>
            <Analytics v-bind:analyticInfo="analytics"/>
            <!-- <scatterChart v-bind:resData="myChartScatter"/> -->
        </div>
        <div class="col-md-4">
            <div class="col cards">
                <div class="col dataHeader active"> <b>Query</b></div>
                
                <div class="container my-5">
                    <table class="table">
                        <thead></thead> 
                        <tbody>
                            <tr>
                                <td style="text-align:center;">
                                    <h5>Measurement:</h5>
                                
                                    <select v-model="selected">
                                        <option disabled value="">Please select one</option>
                                        <option>Temperature</option>
                                        <option>Humidity</option>
                                        <option>CO</option>
                                        <option>LPG</option>
                                        <option>Smoke</option>
                                    </select>
                                    </td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <h5>Period:</h5>
                            <!-- <p class="text-muted">(Default = 30 days):</p> -->
                                
                                    <input v-model="period" placeholder="edit me" />
                                    <select v-model="periodUnit">
                                        <option disabled value="">Please select one</option>
                                        <option>Month(s)</option>
                                        <option>Week(s)</option>
                                        <option>Day(s)</option>
                                        <option>Hour(s)</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <p>Current Query: {{ selected }} {{ period }} {{ periodUnit }} ago</p>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <button class="button" @click="buildMainChart(selected, null)"> Search!</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <dataAverages v-bind:data="stats"/>
            <errorList v-bind:errorsArr="errors"/>
        </div>
    </div>
</template>

<script>
import Analytics from './Analytic.vue';
import dataAverages from './dataAverages.vue';
//import scatterChart from './scatterChart.vue';
import errorList from './errorList.vue';
import Charts from 'chart.js/auto';
import axios from 'axios';
import 'chartjs-adapter-moment';

export default {
    name:'myChart',
    components:{
        Analytics,
        dataAverages,
        //scatterChart,
        errorList
    },
    data() {
        return {
            mainChart: null,
            myChartScatter: [],
            sensorData: null,
            selected: "",
            ctx: null,
            analytics: String,
            startDate: String,
            endDate: String,
            period: "30",
            periodUnit: "Month(s)",
            stats: [],
            errors: [],
        }
    },
    async created() {
        var response = await this.queryRoute('Temperature')
        this.stats.push(response.info.analytics)
        this.buildMainChart('Temperature', response)
        response = await this.queryRoute('Humidity')
        this.stats.push(response.info.analytics)
        this.myChartScatter = response
        response = await this.queryRoute('CO')
        this.stats.push(response.info.analytics)
        response = await this.queryRoute('LPG')
        this.stats.push(response.info.analytics)
        response = await this.queryRoute('Smoke')
        this.stats.push(response.info.analytics)
    },
    methods: {
        async queryRoute(measurement) {
            try {
                const { data } = await axios.get('http://moniotor.eu-west-1.elasticbeanstalk.com/api', {
                        params: {
                            apiKey: "",
                            measurement: measurement,
                            period: this.period,
                            p_unit: this.periodUnit,
                        }
                    })
                return data

            } catch (e) {
                console.error(e)
                console.log(e)
            }
        },
        async buildMainChart(measurement, resData) {
            try {
                if(resData === null){
                    resData = await this.queryRoute(measurement)
                }

                this.sensorData = resData.info
                this.analytics = resData.info.analytics[0]

                const dataTimes = Object.keys(this.sensorData.lineBarData)
                this.startDate = dataTimes[0]
                const dataLength = dataTimes.length
                this.endDate = dataTimes[dataLength-1]
                
                if(this.mainChart != null) {
                    this.mainChart.destroy()
                }
                else {
                    this.ctx = document.getElementById('myChart-diagram').getContext("2d");
                    var gradientFill = this.ctx.createLinearGradient(0,0,0,520);
                    gradientFill.addColorStop(0, 'blue');
                }
                this.mainChart = new Charts(this.ctx, {
                    type: 'line',
                    data: {
                        labels: dataTimes,
                        datasets: [{
                            label: measurement,
                            data: Object.values(this.sensorData.lineBarData),
                            //borderColor: "#36495d",         //legend box colour
                            borderWidth: 1,     // legend box width
                        }]
                    },
                    options: {
                        responsive: true,
                        lineTension: 0.2,
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: measurement+this.getUnit(measurement)
                                },
                            }
                        }
                    }
                });
            } catch (e) {
                console.error(e)
                console.log(e)
                this.selected = e
            }
        },
        getUnit(measurement){
            if(measurement == "Temperature") {
                return " (*C)"
            } else if(measurement == "Humidity") {
                return " (%)"
            } else {
                return " (ppm)"
            }
        }
    } //#a7a6a6;
};
</script>

<style scoped>
.cards{
    box-shadow: 3px 3px 5px #2996d1;
    /* border-right: 0.5px solid #a7a6a6; */
    margin: 20px;
    border-radius: 15px;
    padding: 12px;
    background-color: #f8fbfd;
}
.cards:nth-child(4){
    border: none; 
}
.today, .previous, .compared{
    border: 1px solid #9b9b9b9f;
    border-radius: 15px;
    text-align: center;
    padding: 5px;
    background-color: #ffffff;
}
.compared{
    border: none;
    background-color: #f8fbfd;
}

.button {
    border-radius: 40%;
    padding: 2px 32px;
    color: black;
}
.button:hover {
    box-shadow: 2px 2px 5px #4489b7;
}
.dataHeader{
    border: 1px solid #9b9b9b9f;
    border-radius: 30px;
    text-align: center;
    padding: 5px;
    background-color: #2996d1;
    color: white;
}
</style>