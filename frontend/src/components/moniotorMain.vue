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
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'moniotorMain',
    components:{
      myHeader,
      myChart
    }
  }
  </script>
  
  