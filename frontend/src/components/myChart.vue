<template>
    <!-- <TimePeriod :from="startDate" :to="endDate" @period="queryPeriod"/> -->
    <div class="container">
        <div class="row">
            <div class="col cards">
                <div>What measurement would you like to query? </div>

                <select v-model="selected">
                    <option disabled value="">Please select one</option>
                    <option>Temperature</option>
                    <option>Humidity</option>
                    <option>CO</option>
                </select>
                <p>Current Query: {{ selected }} {{ period }} {{ periodUnit }} ago</p>
            </div>
            <div class="col cards">
                <div class="container">Please enter a value and unit of time for your query (Default = 30 days):
                    <div>
                        <input v-model="period" placeholder="edit me" />
                        <select v-model="periodUnit">
                            <option disabled value="">Please select one</option>
                            <option>Month(s)</option>
                            <option>Week(s)</option>
                            <option>Hour(s)</option>
                        </select>
                        <button @click="queryData"> Go!</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container my-5">
        <canvas height="100" id="myChart-diagram"></canvas>
    </div>
    <div class="container my-5">
        <div class="row">
            <small class="col today active">{{ startDate }}</small>
            <small class="col compared text-muted disabled"> TO </small>
            <small class="col previous">{{ endDate }}</small>
        </div>
    </div>
    <Analytics v-bind:info="analytics"/>
</template>

<script>
import Analytics from './Analytic.vue';
import Charts from 'chart.js/auto';
import axios from 'axios';
import 'chartjs-adapter-moment';

export default {
    name:'myChart',
    components:{
        Analytics
    },
    data() {
        return {
            myChart: null,
            sensorData: null,
            selected: "",
            ctx: null,
            analytics: String,
            startDate: String,
            endDate: String,
            period: "30",
            periodUnit: "Day(s)",
        }
    },
    async created() {
        const title = "Temperature"
        try {
            const { data } = await axios.get(process.env['VUE_APP_BACKEND_URL']+'/api', {
                        params: {
                            measurement: title,
                            period: this.period,
                            p_unit: this.periodUnit
                        }
                    })
            this.sensorData = data.info
            this.analytics = data.info.analytics

            const dataTimes = Object.keys(this.sensorData.lineBarData)
            this.startDate = dataTimes[0]
            const dataLength = dataTimes.length
            this.endDate = dataTimes[dataLength-1]

            this.ctx = document.getElementById('myChart-diagram').getContext("2d");
            var gradientFill = this.ctx.createLinearGradient(0,0,0,520);
            gradientFill.addColorStop(0, 'green');   
            //gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.myChart = new Charts(this.ctx, {
                type: 'line',
                data: {
                    labels: dataTimes,
                    datasets: [{
                        label: title,
                        data: Object.values(this.sensorData.lineBarData),
                        borderWidth: 1
                    }]
                }
            });
        
        } catch (e) {
            console.error(e)
            console.log(e)
            this.selected = e
        }
    },
    methods: {
        async queryData() {
            const title = this.selected
            try {
                const { data } = await axios.get(process.env['VUE_APP_BACKEND_URL']+'/api', {
                        params: {
                            measurement: title,
                            period: this.period,
                            p_unit: this.periodUnit
                        }
                    })
                this.sensorData = data.info
                this.analytics = data.info.analytics

                const dataTimes = Object.keys(this.sensorData.lineBarData)
                this.startDate = dataTimes[0]
                const dataLength = dataTimes.length
                this.endDate = dataTimes[dataLength-1] // todo put into method
                
                this.myChart.destroy()
                this.myChart = new Charts(this.ctx, {
                    type: 'line',
                    data: {
                        labels: dataTimes,
                        datasets: [{
                            label: title,
                            data: Object.values(this.sensorData.lineBarData),
                            borderWidth: 1
                        }]
                    }
                });
            } catch (e) {
                console.error(e)
                console.log(e)
                this.selected = e
            }
        }
    } //#a7a6a6;
};
</script>

<style scoped>
.cards{
    box-shadow: 1px 1px 5px #4489b7;
    /* border-right: 0.5px solid #a7a6a6; */
    margin: 20px;
    border-radius: 15px;
    padding: 12px;
}
.cards:nth-child(4){
    border: none; 
}
.today, .previous, .compared{
    border: 1px solid #9b9b9b9f;
    border-radius: 15px;
    text-align: center;
    padding: 5px;
}
.compared{
    border: none;
}
</style>