<template>
	<div class="cardrecord" v-loading="loading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
         <div v-if="logShow" class="check-login">
		 	登录之后才可以查看领卡记录
		 	<el-button type="primary" @click="goLogin" v-bind:style="{marginLeft:'20px'}">登录</el-button>
		 </div>
		 <div v-else>		 	
	        <div v-if="recordshow" class="empty">您的领卡记录是空的！</div>
			<div class="list-wrapper" v-else>
				<ul v-for="(item,index) in records">
				   <li><span class="left">收货地址</span><span class="right">{{item.orderAddress}}</span></li>
				   <li v-if="item.courierCompany?true:false"><span class="left">快递公司</span><span class="right">{{item.courierCompany}}</span></li>
				   <li v-if="item.courierNo?true:false"><span class="left">快递单号</span><span class="right">{{item.courierNo}}</span></li>
				   <li><span class="left">订单状态</span><span class="right">{{item.orderStatus}}<el-button type="primary" v-if="item.orderStatus=='未处理'" @click="cancel(item.orderId)">取消</el-button></span></li>
				   <li><span class="left">提交时间（北京时间）</span><span class="right">{{item.createTime | formattotime}}</span></li>
				</ul>
			</div>
		 </div>
	</div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'CardRecord',
  data () {
    return {
       logShow:true,//logShow为true表示显示"登录之后才可以查看领卡记录"文字提示，为false表示显示"您的领卡记录是空的！"文字提示或者显示领卡记录
       student:null,//用户信息
       loading:false,//领卡记录展示区域的loading
       records:[],//领卡记录
       orderId:null,//订单Id
       recordshow:false//recordshow为true表示显示"您的领卡记录是空的！"文字提示，为false表示显示领卡记录
    }
  },
  beforeMount(){
  	 sessionStorage.removeItem("haschoose");//删除从首页点击立即领卡按钮进入领卡页面的标识
  	 this.student = JSON.parse(sessionStorage.getItem('student'));
	 if(this.student){
	 	//用户已登录
	 	 this.logShow=false;//页面显示"您的领卡记录是空的！"的文字提示或者显示领卡记录
	 	 this.getRecord();//获取领卡记录
	 }else{
	 	//用户未登录
	 	 this.logShow=true;//页面显示"登录之后才可以查看领卡记录"
	 }
  },
  methods:{
  	 goLogin(){
  	 	 //去往登录页面
  	 	 this.$router.push({ name: 'Login'});
  	 },
  	 getRecord(){
  	 	   this.loading = true;//领卡记录展示区域的loading显示
  	 	   var that = this;
  	       axios({
			  method: 'post',
			  url:'../center/orderRecord',
			  data:querystring.stringify({
			  	 studentId:that.student.studentId
			  })
		  })
      	  .then(function(r){
      	  	  that.loading = false;//领卡记录展示区域的loading消失
              if(r.data.success){
              	 that.records = r.data.data.record;
              	 if(that.records.length==0){
                 	that.recordshow = true;//页面显示"您的领卡记录是空的！"
                 }else{
                 	that.recordshow = false;//页面显示领卡记录
                 	that.records.reverse();//领卡记录列表翻转，最近时间的显示在最前面
                 }
              }else{
              	  that.$message({
			          message:r.data.desc,
			          type: 'error',
			          duration:1500,
			          center:true
                  });
              }
      	  })
      	  .catch(function (error) {
               that.$message({
		          message:'请求失败',
		          type: 'error',
		          duration:1500,
		          center:true
               });
  		  });	
  	 },
  	 cancel(_orderId){
  	 	//取消领卡订单弹出框
  	 	this.orderId = _orderId;
  	 	this.$confirm('确定取消订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.cancelOrder()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            duration:1500,
			center:true
          });          
        });
  	 },
  	 cancelOrder(){
  	 	//取消领卡订单
  	 	var that = this;
  	 	axios({
			  method: 'post',
			  url:'../center/cancelFreeCard',
			  data:querystring.stringify({
			  	 recordId:that.orderId
			  })
		  })
      	  .then(function(r){
              if(r.data.success){
              	 that.getRecord()
              	 that.$message({
		            type: 'success',
		            message: '取消成功!',
		            duration:1500,
			        center:true
         		 });
              }else{
              	  that.$message({
			          message:r.data.desc,
			          type: 'error',
			          duration:1500,
			          center:true
                  });
              }
      	  })
      	  .catch(function (error) {
               that.$message({
		          message:'请求失败',
		          type: 'error',
		          duration:1500,
		          center:true
               });
  		  });	
  	 }
  }
}
</script>

<style scoped>
   .cardrecord{
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
    }
    .el-button{
       margin-left:170px;	
    }
    .el-message-box{
    	padding-bottom:20px;
    }
</style>