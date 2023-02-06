<template>
    <div>
      <Header />
      <myChart />
    </div>
  </template>
  
  <script>
  import Header from "./Header.vue";
  import myChart from "./myChart.vue";
  
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Main',
    components:{
      Header,
      myChart
    }
  }
  </script>
  
  