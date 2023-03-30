<template>
    <div class="col cards">
        <div class="col dataHeader active"> <b>Error Log</b></div>
        <div class="container my-5">

        <table class="table">
            <tbody>
                <tr v-for="(item, index) in items" :key="index">
                    <td>{{ errors }}</td>
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
        errorsArr: [],
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
div { /* fixes the issue with \n & \t not working in html */
      white-space: pre-wrap;
  }
</style>