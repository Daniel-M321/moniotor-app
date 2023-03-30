<template>
    <div class="col cards">
        <div class="col dataHeader active"> <b>Reading Averages</b></div>
        <div class="container my-5">

        <table class="table">
            <tbody>
                <tr>
                    <td>
                        <div class="mHeader">Temperature</div> 
                        <p style="text-align: center;">Average = {{ data[0][3] }} C <b>|</b>  Max = {{ data[0][1] }} C <b>|</b> Min = {{ data[0][2] }} C</p>
                    
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="mHeader">Humidity</div> 
                        <p style="text-align: center;">Average = {{ data[1][3] }} % <b>|</b> Max = {{ data[1][1] }} % <b>|</b> Min = {{ data[1][2] }} %</p>
                    
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="mHeader">CO</div> 
                        <p style="text-align: center;">Average = {{ data[2][3] }} ppm <b>|</b> Max = {{ data[2][1] }} ppm <b>|</b> Min = {{ data[2][2] }} ppm</p>
                    
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="mHeader">LPG</div> 
                        <p style="text-align: center;">Average = {{ data[3][3] }} ppm <b>|</b> Max = {{ data[3][1] }} ppm <b>|</b> Min = {{ data[3][2] }} ppm</p>
                    
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="mHeader">Smoke</div> 
                        <p style="text-align: center;">Average = {{ data[4][3] }} ppm <b>|</b> Max = {{ data[4][1] }} ppm <b>|</b> Min = {{ data[4][2] }} ppm</p>
                    
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script>
export default {
    name:'dataAverages',
    props: {
        data: [],
    }
}
</script>

<style scoped>
.card{
    box-shadow: 3px 3px 5px #2996d1;
    /* border-right: 0.5px solid #a7a6a6; */
    margin: 20px;
    border-radius: 15px;
    padding: 12px;
}
.dataHeader{
    border: 1px solid #9b9b9b9f;
    border-radius: 30px;
    text-align: center;
    padding: 5px;
    background-color: #2996d1;
    color: white;
}

.mHeader{
    text-align: center;
    padding: 4px;
    border: 1px solid #9b9b9b9f;
    background-color: #ffffff;
    font-weight: bold;
}

div { /* fixes the issue with \n & \t not working in html */
      white-space: pre-wrap;
  }
</style>