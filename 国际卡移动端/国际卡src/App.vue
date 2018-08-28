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
body{
	font-size:.16rem;
}
#app{
  width:100%;
  height:100%;
}
.swiper-pagination-bullet-active{
	background:#1aad19;
}
</style>
