<template>
  <div id="app">
     <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import "./style/reset.css";
body{
	background:#f8f8f8;
}
#app{
  width:100%;
  height:100%;
}
.swiper-pagination-bullet-active{
	background:#409eff;
}
</style>
