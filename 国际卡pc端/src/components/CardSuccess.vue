<template>
	<div class="success-container">
		<div class="success">
			 <p>您已经成功提交信息，卡会在3-5个工作日<br>内送到，请注意查收</p>
			 <router-link to="/information/cardrecord">个人中心</router-link>
		</div>
	</div>
</template>

<script>
export default {
  name: 'CardSuccess',
  data () {
    return {

    }
  },
  beforeMount(){
 	sessionStorage.removeItem("haschoose");//删除从首页点击立即领卡按钮进入领卡页面的标识
  }
}
</script>

<style scoped>
	.success-container{
		width:100%;
	}
	.success{
		width:1190px;
		height:614px;
		margin:0 auto;
		padding-top:160px;
		text-align:center;
	}
	p{
		line-height:32px;
		font-size:18px;
	}
	a{
		display:inline-block;
        margin-top:40px;		
		padding:8px 20px;
		text-align:center;
		color:#fff;
		font-size:16px;
		background:#ca1d7b;
		border-radius:4px;
	}
</style>