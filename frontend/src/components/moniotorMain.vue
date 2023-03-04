<template>
    <div>
      <myHeader />
      <myChart />
    </div>
  </template>
  
  <script>
  import myHeader from "./myHeader.vue";
  import myChart from "./myChart.vue";
  
  export default {
    name: 'moniotorMain',
    components:{
      myHeader,
      myChart
    }
  }
  </script>
  
  