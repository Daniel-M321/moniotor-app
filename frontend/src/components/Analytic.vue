<template>
    <div class="col col-md-center">
        <div class="col card">
            <div class="col col-sm-center">
                <div class="col dataHeader active"> <b>Analysis</b></div>
            </div>
            <div class="container my-5">
                <p> {{ analyticInfo }} </p>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name:'Analytics',
    props: {
        analyticInfo: String,
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