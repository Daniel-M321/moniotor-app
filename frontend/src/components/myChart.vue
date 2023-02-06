<template>
    <div class="container">
        <div class="row">
            <div class="col cards">
                <div>Selected: {{ selected }}</div>

                <select v-model="selected">
                <option disabled value="">Please select one</option>
                <option>Temperature</option>
                <option>Humidity</option>
                <option>Gas</option>
                </select>
                <button @click="queryData">Query</button>
                <button> {{ sensor }}</button>
            </div>
        </div>
    </div>

    <div class="container my-5">
        <canvas height="100" id="myChart-diagram"></canvas>
    </div>
</template>

<script>
import Charts from 'chart.js/auto';
//import theChart from '../myChart-data.js';
import axios from 'axios';

export default {
    name:'myChart',
    data() {
        return {
            //theChart: theChart,
            loaded: false,
            sensor: null,
            selected: ""
        }
    },
    async mounted() {
        this.loaded = false
    },
    methods: {
        async queryData() {
            try {
                const { data } = await axios.get('http://localhost:8080/api')
                this.sensor = data

                const ctx = document.getElementById('myChart-diagram').getContext("2d");
                var gradientFill = ctx.createLinearGradient(0,0,0,520);
                gradientFill.addColorStop(0, 'yellow');   
                gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');
                new Charts(ctx, {
                type: 'line',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                    label: "this.sensor.sensor",
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                    y: {
                        beginAtZero: true
                    }
                    }
                }
                });
        
            } catch (e) {
                console.error(e)
                console.log(e)
                this.selected = e
            }
        }
    }
};
</script>

<style scoped>
.cards{
    box-shadow: 1px 1px 5px #a7a6a6;
    /* border-right: 0.5px solid #a7a6a6; */
    margin: 20px;
    border-radius: 15px;
    padding: 12px;
}
.cards:nth-child(4){
    border: none; 
}
</style>