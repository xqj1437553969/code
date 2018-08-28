<template>
   <div class="free-container">
      <div class="free">
      	<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      		<el-form-item label="电话卡类型">
		    	<ul class="operatorlist">
		    	    <li v-for="(item,index) in operatorList" @click="changeCard(item.operatorId,index)" v-bind:class="{active:active===index}">{{item.operatorName}}卡</li>
		    	</ul>
		  	</el-form-item>
		  	<el-form-item label="姓名" prop="username">
		    	<el-input v-model="ruleForm.username" placeholder="请输入姓名"></el-input>
		  	</el-form-item>
		  	<el-form-item label="手机号" prop="phone">
		    	<el-input v-model="ruleForm.phone" placeholder="请输入国内手机号"></el-input>
		  	</el-form-item>
		  	<el-form-item label="验证码" prop="securitycode">
		    	<el-input v-model.number="ruleForm.securitycode" placeholder="请输入验证码"></el-input>
		    	<el-button type="primary" @click="getCaptcha" :disabled="btnFlag">{{title}}</el-button>
		  	</el-form-item>
		  	<el-form-item  label="所在地区" prop="region" >
				<el-cascader @change="handleChange"
					placeholder="请选择所在地区（可以搜索）"
					v-model="ruleForm.region"
					:options="options"
					change-on-select
					clearable
					filterable
				>
				</el-cascader>
		    </el-form-item>
		  	<el-form-item label="详细地址" prop="address">
    			<el-input v-model="ruleForm.address" placeholder="请输入详细地址"></el-input>
  			</el-form-item>
  			<el-form-item>
			    <el-button type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="loadingFlag" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">提交</el-button>
			    <el-button type="primary" @click="go">返回</el-button>
  			</el-form-item>
		</el-form>
		<p>每个账号每种卡只能领取一张</p>
      </div>
   </div>
</template>

<script>
import { regionData,CodeToText} from 'element-china-area-data';//省份数据
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'Free',
  data () {
  	     var checkUsername = (rule, value, callback) => {
  	     	//element-ui表单验证姓名
	        if (value === '') {
	          callback(new Error('请输入姓名'));
	        } else {
	          callback();
	        }
	      };
	      var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
	      var checkPhone = (rule, value, callback) => {
	      	//element-ui表单验证手机号
	        if (value === '') {
	          this.phoneFlag = false;
	          return callback(new Error('请输入手机号'));
	        }
	        if (!reg.test(value)) {
	        	  this.phoneFlag = false;
		          callback(new Error('手机号格式不正确'));
		    } else {
		          this.phoneFlag = true;
		          callback();
		    }
	      };
	  	 var checkSecuritycode = (rule, value, callback) => {
	  	 	//element-ui表单验证验证码
		        if (!value) {
		          return callback(new Error('请输入验证码'));
		        }
		        if (!Number.isInteger(value)) {
		            callback(new Error('请输入数字值'));
		        } else {
		            callback();
		        }
	      };
	      var checkRegion = (rule, value, callback) => {
	      	//element-ui表单验证选择地址
	        if (value =='') {
	          callback(new Error('请选择地址'));
	        } else {
	          callback();
	        }
	      };
	      var checkAddress= (rule, value, callback) => {
	      	//element-ui表单验证详细地址
	        if (value === '') {
	          callback(new Error('请输入详细地址'));
	        } else {
	          callback();
	        }
	     };
	    return {
	    	operatorId:null,//运营商Id
	    	haschoose:false,//从首页点击立即领卡按钮进入领卡页面的标识，false表示不是从首页进入的
	    	active:null,//选中电话卡增加背景色标识
	    	operatorList:null,//运营商列表
	    	options: regionData,//省份数据
	    	realregion:'',//选择的地址
	    	operatorId:null,//运营商Id
	    	btnFlag:false,//验证码按钮是否禁用，false表示不禁用
	    	title:'获取验证码',//验证码按钮文字
	    	timer:null,//验证码计时器
	    	count:60,//验证码倒计时秒数
	    	phoneFlag:false,//手机号格式是否验证通过，false表示没有验证通过
	    	loadingFlag:false,//数据提交时的loading
	    	ruleForm: {
	          username: '',//姓名
	          phone:'',//手机号
	          securitycode: '',//验证码
	          region:[],//选择的地址
	          address:''//详细地址
	        },
	        rules: {
	          username: [
	            //element-ui表单姓名验证配置
	            { validator: checkUsername, trigger: 'blur' }
	          ],
	          phone:[
	            //element-ui表单手机号验证配置
	            { validator: checkPhone, trigger: 'blur' }
	          ],
	          securitycode: [
	            //element-ui表单验证码验证配置
	            { validator: checkSecuritycode, trigger: 'blur' }
	          ],
	          region: [
	            //element-ui表单选择地址验证配置
	        	 {validator: checkRegion, trigger: 'change' }
	      	  ],
	          address: [
	            //element-ui表单详细地址验证配置
	            { validator: checkAddress, trigger: 'blur' }
	          ],
	        }
	    }
  },
   beforeMount(){
   	  this.operatorList = JSON.parse(sessionStorage.getItem("operatorList"));//获取首页存储的运营商列表
   	  if(sessionStorage.getItem("haschoose")==="true"){
   	  	 //从首页点击立即领卡按钮进入领卡页面的标识
   	  	 this.operatorId = sessionStorage.getItem("operatorId");//运营商Id
   	  	 for(var i=0;i< this.operatorList.length;i++){
   	  	 	 if(this.operatorId==this.operatorList[i].operatorId){
   	  	 	 	this.active = i;
   	  	 	 	break;
   	  	 	 }
   	  	 }
   	  }
   },
   methods: {
     	  changeCard(_operatorId,_index){
     	  	//点击选择电话卡类型
     	  	 this.active = _index;
     	  	 this.operatorId = _operatorId;
     	  },
   	      handleChange(value){
   	      	//省份选择
// 	      	 console.log(value);
   	      	 this.realregion = CodeToText[this.ruleForm.region[0]]+''+CodeToText[this.ruleForm.region[1]]+''+CodeToText[this.ruleForm.region[2]]
   	      },
	      submitForm(formName) {
	      	console.log(this.operatorId);
	      	if(!this.operatorId){
	      		return this.$message({
		          message:'请选择电话卡类型',
		          type: 'error',
		          duration:1500,
		          center:true
	        	});
	      	}
	        this.$refs[formName].validate((valid) => {
		          if (valid) {
                     this.subData();
		          } else {
		          	 console.log('error submit!!');
		             return false;
		          }
	        });
	      },
	      go(){
	        this.$router.go(-1);
	      },
	      subData(){
	      	  var agentId = sessionStorage.getItem("type");//代理商Id
	      	  if(agentId){
	      	  	 agentId = Number(agentId);
	      	  }else{
	      	  	 agentId = null;
	      	  }
	      	  var operatorId = this.operatorId;//运营商Id
	      	  var orderName = this.ruleForm.username;//用户名
	      	  var orderPhone = '86'+this.ruleForm.phone;//区号+手机号
	      	  var captcha = this.ruleForm.securitycode;//验证码
	      	  var orderAddress = this.realregion + this.ruleForm.address;//选择地址+详细地址
	      	  this.loadingFlag = true;//loading出现
	      	  var that = this;
	      	  axios({
				  method: 'post',
				  url:'../center/cardOrder',
				  data:querystring.stringify({
				  	 agentId:agentId,
				     operatorId:operatorId,
				     orderSource:1,
				     orderName:orderName,
				     orderPhone:orderPhone,
				     captcha:captcha,
				     orderAddress:orderAddress
				  })
			  })
		  	  .then(function(r) {
//		  		   console.log(r);
		  		   if(r.data.success){
		  		   	  that.$router.push({ name: 'CardSuccess'});
		  		   }else{
			  		  var message = r.data.desc;
			  		  that.loadingFlag = false;
	                  that.$message({
				          message:message,
				          type: 'error',
				          duration:1500,
				          center:true
	        		  });
		  		   }
			  })
		  	  .catch(function (error) {
		  	  	   that.loadingFlag = false;
	               that.$message({
			          message:"请求失败",
			          type: 'error',
			          duration:1500,
			          center:true
	               });
	  		  });
		  	 
  		 },
  		 getCaptcha(){
//		 	 console.log(this);
  		     this.$refs.ruleForm.validateField('phone');
  		     if(this.phoneFlag){
  		     	 var phone = '86'+this.ruleForm.phone;
  		     	 var that = this;
	  		     axios({
					  method: 'post',
					  url:'../center/captcha',
					  data:querystring.stringify({
					      phone:phone
					  })
			      })
			  	  .then(function(r){
//			  	  	   console.log(r)
			  		   if(r.data.success){
						 	 that.down();
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
				          message:"请求失败",
				          type: 'error',
				          duration:1500,
				          center:true
	                   });
		  		  });
		         
  		    }
		 
  		},
  	    down(){
  	    	var that = this;
  	    	this.timer = setInterval(function(){
//		 	 	    console.log(that);
		 	 	    that.btnFlag = true;
		 	 	    that.count--;
		 	 	    that.title = "已发送"+that.count+"s";
		  		   	if(that.count==0){
		  		   		  clearInterval(that.timer);
		  		   		  that.count = 60;
		  		   		  that.btnFlag = false;
		  		   		  that.title = "重新获取";
		  		   	}
			},1000);
  	    }
    }
}
</script>

<style scoped>
	.free-container{
	    width:100%;
	}
	.free{
		width:1190px;
		height:614px;
		margin:0 auto;
	}
	form{
		padding-top:72px;
		padding-left:327px;
		padding-right:155px;
	}
	.el-input{
		width:400px;
	}
	.el-cascader{
		width:400px;
	}
	p{
		padding-left:427px;
		font-size:14px;
	}
	.operatorlist{
		display:flex;
		flex-wrap: wrap;
	}
	.operatorlist>li{
		min-width:90px;
		margin-right:10px;
		margin-bottom:10px;
	    white-space: nowrap;
	    cursor: pointer;
	    background: #fff;
	    border: 1px solid #dcdfe6;
	    color: #606266;
	    text-align: center;
	    transition: .1s;
/*	    padding: 12px 20px;*/
	    font-size: 14px;
	    border-radius: 4px;
		line-height:40px;
		text-align:center;
		padding:0 10px;
	}
	.operatorlist>li:hover{
	    color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
	.operatorlist>li.active{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
</style>