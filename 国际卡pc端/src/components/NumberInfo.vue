<template>
	<div class="recharge-record" v-loading="loading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
        <div v-if="logShow" class="check-login">
		 	登录之后才可以查看号码信息
		 	<el-button type="primary" @click="goLogin" v-bind:style="{marginLeft:'20px'}">登录</el-button>
		 </div>
		 <div v-else>		 	
		 	<div v-if="recordshow" class="empty">您的号码信息是空的！</div>
		 	<div class="list-wrapper" v-else>
		 		<ul v-for="(item,index) in records">
		 		   <li><span class="left">国家</span><span class="right">美国</span></li>
		 		   <li><span class="left">运营商</span><span class="right">T-Mobile</span></li>
		 		   <li><span class="left">姓名</span><span class="right">XXX</span></li>
		 		   <li><span class="left">卡号</span><span class="right">8901260873750678639F</span></li>
		 		   <li><span class="left">国外电话号码</span><span class="right">3236848182</span></li>
		 		   <li><span class="left">套餐名称</span><span class="right">流量套餐$50/月</span></li>
		 		   <li><span class="left">套餐开始日期(芝加哥时间)</span><span class="right">2018-07-05</span></li>
		 		   <li><span class="left">套餐结束日期(芝加哥时间)</span><span class="right">2018-10-02</span></li>
		 		</ul>
		 	</div>
		 </div>
	</div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring')
export default {
  name: 'NumberInfo',
  data () {
    return {
       logShow:true,
       student:null,
       loading:false,
       recordshow:false,
       records:[1,2,3,4]
    }
  },
  beforeMount(){
  	 sessionStorage.removeItem("haschoose");//删除从首页点击立即领卡按钮进入领卡页面的标识
  	 this.student = JSON.parse(sessionStorage.getItem('student'));
	 if(this.student){
	 	 this.logShow = false;
	 	 this.getRecord();
	 }else{
	 	 this.logShow = true;
//	     this.$router.push({ name: 'Login'});
	 }
  },
  methods:{
  	 goLogin(){
  	 	this.$router.push({ name: 'Login'});
  	 },
  	 getRecord(){
//	 	   this.loading = true;
//	 	   var that = this;
//	       axios({
//			  method: 'post',
//			  url:that.baseUrl+'/center/rechargeRecord',
//			  data:querystring.stringify({
//			  	 type:0,
//			  	 studentId:that.student.studentId 
//			  })
//		  })
//    	  .then(function(r){
//    	  	  that.loading = false;
//            if(r.data.success){
//            	 that.records = r.data.data.record;
//               if(that.records.length==0){
//               	that.recordshow = true;
//               }else{
//               	that.recordshow = false;
//               	that.records.reverse();
//               }
//            }else{
//            	  that.$message({
//			          message:r.data.desc,
//			          type: 'error',
//			          duration:1500,
//			          center:true
//                });
//            }
//    	  })
//    	  .catch(function (error) {
//             that.$message({
//		          message:'请求失败',
//		          type: 'error',
//		          duration:1500,
//		          center:true
//             });
//		  });	
  	 }
  }
}
</script>

<style scoped>
  .recharge-record{
  	 box-sizing:border-box;
   	 height:614px;
   	 padding-top:20px;
   	 padding-left:88px;
   	 padding-right:88px;
   	 overflow-y:auto;
  }
  .check-login{
   	    text-align:center;
  	    line-height:520px;
   }
  .empty{
  	text-align:center;
  	line-height:560px;
  }
   ul{
   	 border:1px solid #333;
   	 border-bottom:none;
   	 margin-bottom:20px;
   }
   ul>li{
   	line-height:56px;
   	display:flex;
   	border-bottom:1px solid #333;
   }
   .left{
   	 display:block;
   	 width:210px;
   	 padding-left:70px;
   }
    .right{
       flex:1;
       padding-left:80px;
    }
</style>