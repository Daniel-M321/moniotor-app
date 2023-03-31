<template>
    <div class="col cards">
                <div class="col dataHeader active"> <b>Gas Values</b></div>

                <div class="container my-5">
                    <canvas height="150" id="multi-diagram"></canvas>
                </div>
            </div>
</template>

<script>
import Charts from 'chart.js/auto';

export default {
    name:'multiChart',
    props: {
        resData: {
            type: {},
            required: true
        }
    },
    data() {
        return {
            mainChart: null,
            ctx: null,
        }
    },
    mounted() {
        this.buildMulti()
    },
    methods: {
        buildMulti() {
            try {
                if(this.mainChart != null) {
                    this.mainChart.destroy()
                }
                else {
                    this.ctx = document.getElementById('multi-diagram').getContext("2d");
                    var gradientFill = this.ctx.createLinearGradient(0,0,520,520);
                    gradientFill.addColorStop(0, 'red');
                }
                this.mainChart = new Charts(this.ctx, {
                    data: {
                        labels: ["CO", "LPG", "Smoke"],
                        datasets: [{
                            type: 'bar',
                            label: "Max Gas Values",
                            data: [this.resData.CO[1], this.resData.LPG[1], this.resData.Smoke[1]],
                            borderWidth: 1,     // legend box width
                            backgroundColor: [
                                'rgba(204, 255, 204, 0.5)',
                                'rgba(153, 255, 153, 0.5)',
                                'rgba(102, 255, 102, 0.5)',
                            ],  
                        }, {
                            type: 'line',
                            label: "Average Gas Values",
                            data: [this.resData.CO[3], this.resData.LPG[3], this.resData.Smoke[3]],
                            borderWidth: 1,     // legend box width
                            borderColor: 'rgb(255, 51, 51)',
                            backgroundColor: 'rgb(255, 102, 102)'
                        }],
                    },
                    options: {
                        responsive: true,
                        lineTension: 0.2,
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: "Gas (ppm)"
                                },
                            },
                        },
                        elements: {
                            point: {
                                pointBorderWidth: 4
                            },
                            line: {
                                borderWidth: 3,
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
    background-color: #2996d1;
    color: white;
}
div { /* fixes the issue with \n & \t not working in html */
      white-space: pre-wrap;
  }
</style>