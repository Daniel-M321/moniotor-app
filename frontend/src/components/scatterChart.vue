<template>
    <div class="col cards">
                <div class="col dataHeader active"> <b>Scatter Graph</b></div>

                <div class="container my-5">

                    <canvas height="150" id="scatter-diagram"></canvas>

                    <hr>
                    <div class="row">
                        <small class="col today active">{{ startDate }}</small>
                        <small class="col compared text-muted disabled"> TO </small>
                        <small class="col previous">{{ endDate }}</small>
                    </div>
                </div>
            </div>
</template>

<script>
import Charts from 'chart.js/auto';

export default {
    name:'scatterChart',
    props: {
        resData: [],
        //measurement: String,
    },
    data() {
        return {
            mainChart: null,
            ctx: null,
            startDate: String,
            endDate: String,
        }
    },
    watch: {
        resData() {
            // Call a method when resData changes
            this.buildScatter()
        }
    },
    methods: {
        buildScatter() {
            try {
                const sensorData = this.resData.info

                const dataTimes = Object.keys(sensorData.lineBarData)
                this.startDate = dataTimes[0]
                const dataLength = dataTimes.length
                this.endDate = dataTimes[dataLength-1]
                console.log(sensorData.scatterData)
                
                if(this.mainChart != null) {
                    this.mainChart.destroy()
                }
                else {
                    this.ctx = document.getElementById('scatter-diagram').getContext("2d");
                    var gradientFill = this.ctx.createLinearGradient(0,0,520,520);
                    gradientFill.addColorStop(0, 'red');
                }
                this.mainChart = new Charts(this.ctx, {
                    type: 'scatter',
                    data: {
                        labels: "dataTimes",
                        datasets: [{
                            label: "Humidity",
                            data: sensorData.scatterData,
                            //borderColor: "#36495d",         //legend box colour
                            borderWidth: 1,     // legend box width
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: "Humidity %"
                                },
                            }
                        }
                    }
                });
            } catch (e) {
                console.error(e)
                console.log(e)
                this.endDate = e
            }
        }
    }
}
</script>

<style scoped>
.card{
    box-shadow: 1px 1px 5px #4489b7;
    /* border-right: 0.5px solid #a7a6a6; */
    margin: 20px;
    border-radius: 15px;
    padding: 12px;
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

.dataHeader{
    border: 1px solid #9b9b9b9f;
    border-radius: 30px;
    text-align: center;
    padding: 5px;
    background-color: #6fdfcb;
}
div { /* fixes the issue with \n & \t not working in html */
      white-space: pre-wrap;
  }
</style>