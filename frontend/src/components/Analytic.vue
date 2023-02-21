<template>
    <div class="container my-5">
        <div class="col col-md-center">
            <div class="col card">
                <div class="col col-sm-center">
                    <div class="col dataHeader active"> <b>Analytical Data:</b></div>
                </div>
                <p> {{ info }} </p>

                <!-- <button> {{ sensorData }}</button> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name:'Analytics',
    props: {
        info: String,
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