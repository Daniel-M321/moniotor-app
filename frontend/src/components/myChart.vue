<template>
    <div class="container">
        <div class="row">
            <div class="col cards">
                <div>Selected: {{ selected }}</div>

                <select v-model="selected">
                <option disabled value="">Please select one</option>
                <option>Temperature</option>
                <option>Humidity</option>
                <option>CO</option>
                </select>
                <button @click="queryData">Query</button>
                <!-- <button> {{ analytics }}</button> -->
            </div>
        </div>
    </div>

    <div class="container my-5">
        <canvas height="100" id="myChart-diagram"></canvas>
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
            analytics: String,
            ctx: null,
        }
    },
    async created() {
        const title = "Temperature"
        try {
            const { data } = await axios.get('http://localhost:8080/api', {
                        params: {
                            measurement: title
                        }
                    })
            this.sensorData = data.info     //todo dates are very weird on x axis, because of type time parameter below. Also can get date to put in header to show period?
            this.analytics = data.info.analytics

            this.ctx = document.getElementById('myChart-diagram').getContext("2d");
            var gradientFill = this.ctx.createLinearGradient(0,0,0,520);
            gradientFill.addColorStop(0, 'green');   
            //gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.myChart = new Charts(this.ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(this.sensorData.lineBarData),
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
                const { data } = await axios.get('http://localhost:8080/api', {
                        params: {
                            measurement: title
                        }
                    })
                this.sensorData = data.info
                this.analytics = data.info.analytics
                
                this.myChart.destroy()
                this.myChart = new Charts(this.ctx, {
                    type: 'line',
                    data: {
                        labels: Object.keys(this.sensorData.lineBarData),
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
</style>