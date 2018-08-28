<template>
	<div class="business-record" v-loading="loading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
         <div v-if="logShow" class="check-login">
		 	登录之后才可以查看开通记录
		 	<el-button type="primary" @click="goLogin" v-bind:style="{marginLeft:'20px'}">登录</el-button>
		 </div>
		 <div v-else>
	        <div v-if="recordshow" class="empty">您的开通记录是空的！</div>
			<div class="list-wrapper" v-else v-loading.fullscreen.lock="continueLoading" element-loading-text="拼命加载中"
	    element-loading-spinner="el-icon-loading"
	    element-loading-background="rgba(0, 0, 0, 0.8)">
				<ul v-for="(item,index) in records">
				   <li v-if="item.phoneNo?true:false"><span class="left">国外号码</span><span class="right">{{item.phoneNo}}</span></li>
				   <li v-if="item.username?true:false"><span class="left">Giffgaff帐号</span><span class="right">{{item.username}}</span></li>
				   <li v-if="item.password?true:false"><span class="left" >Giffgaff密码</span><span class="right">{{item.password}}</span></li>
				   <li><span class="left">卡号</span><span class="right">{{item.cardNo}}</span></li>
				   <li><span class="left">国家</span><span class="right">{{item.countryName}}</span></li>
				   <li><span class="left">运营商</span><span class="right">{{item.operatorName}}</span></li>
				   <li v-if="item.activateDatePrompt?true:false"><span class="left">激活日期（{{item.activateDatePrompt}}）</span><span class="right">{{item.activateDate | formattodate}}<el-button type="primary" v-if="!item.limitUpdateDate" @click="changeDate(item.orderNo,item.activateDateEarliest,item.activateDatePrompt)">修改激活日期</el-button></span></li>
				   <li v-if="item.activateDatePrompt?false:true"><span class="left">激活日期</span><span class="right">{{item.activateDate | formattodate}}<el-button type="primary" v-if="!item.limitUpdateDate" @click="changeDate(item.orderNo,item.activateDateEarliest)">修改激活日期</el-button></span></li>
				   <li><span class="left">套餐名称</span><span class="right">{{item.packageName | packagenamefilter}}</span></li>
				   <li v-if="item.productname"><span class="left">充值金额</span><span class="right">{{item.productname}}</span></li>
				   <li v-if="item.monthNo"><span class="left">订购月数</span><span class="right">{{item.monthNo}}</span></li>
				   <li><span class="left">订单价格</span><span class="right">{{item.orderPirce}}CNY</span></li>
				   <li>
				   	    <span class="left">订单来源</span><span class="right">{{item.orderSource}}
				   	        <el-button type="primary" v-if="item.orderStatus=='未支付'" @click="continuePay(item.orderNo)">继续支付</el-button>
				   	    	<el-button type="primary" v-if="item.orderStatus=='未支付'" v-bind:style="{marginLeft:'20px'}" @click="cancel(item.orderNo)">取消订单</el-button></span>
				   </li>
				   <li><span class="left">订单状态</span><span class="right">{{item.orderStatus}}</span></li>
				   <li><span class="left">提交时间（北京时间）</span><span class="right">{{item.createTime | formattotime}}</span></li>
				</ul>
				<el-dialog
					  title="修改激活日期"
					  :visible.sync="centerDialogVisible"
					  width="400px"
					  center>
				    	<el-date-picker v-model="pickerDate"
					      type="date"
					      :placeholder="activateDatePrompt"
					      :default-value = "defaultDate"
					      format="yyyy 年 MM 月 dd 日"
					      value-format="yyyy-MM-dd"
					      :picker-options="pickerOptions"
				      	>
	    		 		</el-date-picker>
					  <span slot="footer" class="dialog-footer">
					    <el-button type="primary" @click="subDate" v-bind:style="{marginLeft:'0px',width:'353px'}" :loading="subLoading">提交</el-button>
					  </span>
				</el-dialog>
			</div>
		 </div>
	</div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring')
export default {
  name: 'BusinessRecord',
  data () {
    return {
       logShow:true,//logShow为true表示显示"登录之后才可以查看开通记录"文字提示，为false表示显示"您的开通记录是空的！"文字提示或者显示开通记录
       student:null,//用户信息
       recordshow:false,//recordshow为true表示显示"您的开通记录是空的！"文字提示，为false表示显示开通记录
       activateDatePrompt:'请选择激活日期',//修改激活日期弹出框的文字提示
       activateDateEarliest:null,//预约最早可选的日期(-1表示昨天，0表示今天，1表示明天，2表示后天)
       defaultDate:'2018-5-16',//element-ui的datepicker(日历选择器)打开时的默认日期
       pickerOptions:{
       	    //element-ui的datepicker(日历选择器)禁用设置
	      	disabledDate:(time)=>{
              return time.getTime() < new Date(this.defaultDate).getTime()-8*60*60000;
            }
	   },
       pickerDate:'',//element-ui的datepicker(日历选择器)选择的日期
       centerDialogVisible: false,//是否显示 Dialog(修改日期弹出框)
       subLoading:false,//弹出框提交按钮的loading
       continueLoading:false,//继续支付的loading
       loading:false,//开通记录展示区域的loading
       orderNo:null,//订单号
       records:[]//开通记录
    }
  },
  beforeMount(){
  	 sessionStorage.removeItem("haschoose");//删除从首页点击立即领卡按钮进入领卡页面的标识
  	 this.student = JSON.parse(sessionStorage.getItem('student'));//用户登录信息
	 if(this.student){
	 	 //用户已登录
	 	 this.logShow=false;
	 	 this.getRecord();//获取开通记录
	 }else{
	 	//用户未登录
	 	this.logShow=true;
	 }
  },
  methods:{
  	 goLogin(){
  	 	 //去登录页面
  	 	 this.$router.push({ name: 'Login'});
  	 },
  	 getRecord(){
  	 	   //获取开通记录
  	 	   this.loading = true;//开通记录展示区域的loading显示
  	 	   var that = this;
  	       axios({
			  method: 'post',
			  url:'../center/packageOrderRecord',
			  data:querystring.stringify({
			  	 studentId:that.student.studentId 
			  })
		  })
      	  .then(function(r){
      	  	  that.loading = false;//开通记录展示区域的loading消失
              if(r.data.success){
              	 that.records = r.data.data.record;
                 if(that.records.length==0){
                 	that.recordshow = true;	//开通记录为空，显示“您的开通记录是空的！”文字提示
                 }else{
                 	that.recordshow = false;//显示开通记录
                 	that.records.reverse();//开通记录列表翻转，最近时间的显示在最前面
                 
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
  	 changeDate(_orderNo,_activateDateEarliest,_activateDatePrompt){
  	 	//点击修改激活日期按钮
  	 	this.pickerDate = '';
  	 	this.orderNo = _orderNo;
  	 	this.activateDatePrompt = '请选择激活日期（'+_activateDatePrompt+'）';
  	 	this.activateDateEarliest = _activateDateEarliest;
  	 	this.defaultDate = getServerDate(this.activateDateEarliest);
  	 	this.centerDialogVisible = true;//修改激活日期弹出框出现 
  	 },
  	 subDate(){
  	 	 //提交修改激活日期信息
  	 	 if(!this.pickerDate){
  	 	 	//点击修改日期弹出框提交按钮，如果未选择激活日期则进行相应提示
  	 	 	return this.$message({
			          message:'请选择激活日期',
			          type: 'error',
			          duration:1500,
			          center:true
             });
  	 	 }
  	 	 this.subLoading = true;//修改日期弹出框提交按钮的loading出现
  	 	 var that = this;
  	     axios({
			  method: 'post',
			  url:'../center/updateActivateDate',
			  data:querystring.stringify({
			  	 orderNo:that.orderNo,
			  	 activateDate:that.pickerDate
			  })
		  })
      	  .then(function(r){
      	  	  
              if(r.data.success){
              	 //修改激活日期成功
                 that.getRecord();//重新获取开通记录
                 that.subLoading = false;//修改日期弹出框提交按钮的loading消失
                 that.centerDialogVisible = false;//弹出框消失 
              	 that.$message({
              	 	  //修改成功提示
			          message:'修改成功',
			          type: 'success',
			          duration:1500,
			          center:true
                  });
              }else{
              	  that.subLoading = false;//修改日期弹出框提交按钮的loading消失
              	  that.centerDialogVisible = false;//弹出框消失 
              	  that.$message({
              	  	  //错误提示
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
  	 continuePay(_orderNo){
  	 	  //继续支付
  	 	  this.orderNo = _orderNo;//订单号
  	 	  this.continueLoading = true;//继续支付loading显示
  	 	  var that = this;
  	 	  axios({
			  method: 'post',
			  url:'../center/continuePay',
			  data:querystring.stringify({
			  	 payType:1,
			  	 orderNo:that.orderNo
			  })
		  })
      	  .then(function(r){
              if(r.data.success){
                    const div = document.createElement('div');
			        div.innerHTML = r.data.desc;
			        document.body.appendChild(div);
			        document.getElementsByName("punchout_form")[0].submit();
			        
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
  	 cancel(_orderNo){
  	 	//取消订单弹出框
  	 	this.orderNo = _orderNo;
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
  	 	//取消订单
  	 	var that = this;
  	 	axios({
			  method: 'post',
			  url:'../center/cancelOrder',
			  data:querystring.stringify({
			  	 orderNo:that.orderNo
			  })
		  })
      	  .then(function(r){
              if(r.data.success){
              	 that.getRecord();//取消订单成功之后重新获取开通记录
              	 that.$message({
              	 	//提示取消成功
		            type: 'success',
		            message: '取消成功!',
		            duration:1500,
			        center:true
         		 });
              }else{
              	  that.$message({
              	  	 //取消失败提示
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
  .business-record{
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
    .el-button{
    	margin-left:50px;
    }
    .el-input{
    	width:350px;
    }
</style>