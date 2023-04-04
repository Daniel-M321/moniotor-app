<template>
    <div class="col cards">
        <div class="col dataHeader active"> <b>Warnings Log</b></div>
        <div class="container my-5">

        <table class="table">
            <tbody>
                <tr v-for="(value, key) in text" :key="key">
                    <td> <p class="log">{{ key }}</p> {{ value }}</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script>
export default {
    name:'errorList',
    props: {
        errorsArr: {
            type: [],
            required: true
        }
    },
    data() {
        return {
            text: {},
        }
    },
    mounted() {
        this.buildLogs()
    },
    methods: {
        buildLogs() {
            try{
                for (var i = 0; i <= this.errorsArr.length-1; i++) {
                    if(!this.errorsArr[i].high && !this.errorsArr[i].low){
                        continue
                    }

                    var warning = "WARNING: "
                    if(this.errorsArr[i].fatal){
                        warning = "FATAL " + warning
                    }
                    if(this.errorsArr[i].high){
                        warning+="High values have been detected. "
                    }
                    if(this.errorsArr[i].low){
                        warning+="Low values have been detected."
                    }
                    this.text[this.errorsArr[i].measurement] = warning
                }

                const indexL = this.errorsArr.length-1
                if(Object.keys(this.errorsArr[indexL].lineBarData).length > 0){
                    this.text["Water"] = "Water has been detected at "+Object.keys(this.errorsArr[indexL].lineBarData)[0]+" in the "+this.errorsArr[indexL].analytics[0]
                }
            } catch (e) {
                console.error(e)
                console.log(e)
            }
        }
    },
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
.log{
    border: 1px solid #9b9b9b9f;
    padding: 2px;
    background-color: #d14829;
    text-align: center;
    color: white;
}
div { /* fixes the issue with \n & \t not working in html */
      white-space: pre-wrap;
  }
</style>