<template>
    <div class="col cards">
        <div class="col dataHeader active"> <b>Reading Averages</b></div>

        <table class="table">
            <tbody>
                <tr>
                    <td>
                        <p>Temp: {{ data[0] }} C</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Humidity: {{ data[1] }} % </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>CO: {{data[2]}} ppm</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>LPG: {{data[3]}} ppm</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Smoke: {{data[4]}} ppm</p>
                    </td>
                </tr>
            </tbody>
        </table>
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
    box-shadow: 1px 1px 5px #4489b7;
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
}
div { /* fixes the issue with \n & \t not working in html */
      white-space: pre-wrap;
  }
</style>