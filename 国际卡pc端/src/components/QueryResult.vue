<template>
	<div v-loading.fullscreen.lock="loadingPage" element-loading-text="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
		 <div class="container" v-if="showContainer">
			<div class="box" >
				<ul>
					<li>
						<span class="left">{{$t("m.state")}}</span>
						<span class="right" v-if="record.activateStatus==='已预约'" v-text="record.activateStatus==='已预约'?$t('m.reserved'):''"></span>
						<span class="right" v-if="record.activateStatus==='激活成功'" v-text="record.activateStatus==='激活成功'?$t('m.activated'):''"></span>
						<span class="right" v-if="record.activateStatus==='已关闭'" v-text="record.activateStatus==='已关闭'?$t('m.closed'):''"></span>
						<span class="right" v-if="record.activateStatus==='激活失败'" v-text="record.activateStatus==='激活失败'?$t('m.failed'):''"></span>
					</li>
					<li>
						<span class="left">{{$t("m.country")}}</span>
						<span class="right">{{record.englishName}}</span>
					</li>
					<li>
						<span class="left">{{$t("m.activationCode")}}</span>
						<span class="right">{{record.activateCode}}</span>
					</li>
					<li>
						<span class="left">{{$t("m.activationDate")}}</span>
						<span class="right">{{record.activateDate | formattodate}}</span>
				   </li>
				</ul>
			</div>
	   </div>
	</div>
	
</template>

<script>
export default {
  name: 'activation',
  data () {
    return {
      showContainer:false,
      loadingPage:true,
      record:''
    }
  },
  beforeMount(){
     this.loadingPage = true;
     if(sessionStorage.getItem("record")===null){
     	
     }else{     	
     	this.record = JSON.parse(sessionStorage.getItem("record"));
     	this.loadingPage = false;
     	this.showContainer = true;
     }
  },
  methods:{
     
  }
}
</script>

<style scoped>
  .container{
 	    box-sizing: border-box;
		width: 580px;
		margin: 0 auto;
		padding: 250px 0;
		height: 780px;
		font-size: 14px;
  }
  .box{ 
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
  }
  ul{
  	padding:40px 50px;
  }
  ul>li{
  	display:flex;
  	justify-content:space-around;
  }
  span{
  	width:50%;
  	line-height:60px;
  }
  span.left{
  	text-align:left;
  }
  span.right{
  	text-align:right;
  }
</style>