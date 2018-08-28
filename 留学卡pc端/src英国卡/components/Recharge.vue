<template>
	<div class="recharge-container">
		<div class="recharge">
		     <el-form :model="ruleForm"  :inline="true" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
		      		<p class="title">请填写国外号码</p>
		      		</el-form-item label="">
		      		   <el-select v-model="value" placeholder="请选择" disabled>
						    <el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
  					    </el-select>
  					</el-form-item>
				  	<el-form-item label="" prop="phone">
				    	<el-input v-model="ruleForm.phone" placeholder="请输入国外号码"></el-input>
				  	</el-form-item>
				  	<p class="title" v-if="productShow">当前套餐</p>
				  	<el-form-item  v-if="productShow" v-bind:style="{marginBottom:0}">
				        <div class="detail">{{nowPackageName | packagenamefilter}}</div>
		  			</el-form-item>
		  			<p class="title" v-if="productShow">充值类型</p>
		  			<el-form-item v-bind:style="{marginBottom:0}"  v-if="productShow">
				        <ul class="recharge-type-list">
						    <li v-for="(item,index) in retypedesc" @click="changeType(index)" v-bind:class="{active:typeActive===index}">{{item}}</li>
			  			</ul>
		  			</el-form-item>
		  			<p class="title" v-if="typeShow">类型说明</p>
		  			<el-form-item  v-if="typeShow" v-bind:style="{marginBottom:0}">
			  			<div class="detail" v-text="typeTip"></div>
			  	    </el-form-item>
				  	<p class="title" v-if="packageShow">请确认套餐</p>
				  	<el-form-item  v-if="packageShow" v-bind:style="{marginBottom:0}">
				        <ul class="packagelist">
						    <li v-for="(item,index) in packageItems" @click="changePackage(index,item.packageDesc,item.packageId)" v-bind:class="{active:packageActive===index}">{{item.packageName | packagenamefilter}}</li>
			  			</ul>
		  			</el-form-item>
		  			<p class="title" v-if="packageShow">套餐详情</p>
		  			<el-form-item  v-if="packageShow" v-bind:style="{marginBottom:0}">
			  			<div class="detail">{{packageDesc | descfilter}}</div>
			  	    </el-form-item>
				  	<p class="title" v-if="productShow">选择充值金额</p>
			  	    <el-form-item  v-if="productShow">
			  			<ul class="productlist">
						    <li v-for="(item,index) in productItems" @click="countMoney(index,item.productPrice,item.productId)" v-bind:class="{active:productActive===index}">{{item.productName}}</li>
			  			</ul>
			  			<p v-if="priceShow">总计：{{foreignPrice}}=<strong>{{rmbPrice}}CNY</strong></p>
  					</el-form-item>
		  			<div>		  				
			  			<el-form-item v-bind:style="{marginTop:top+'px'}">
						    <el-button type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="loadingFlag" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">{{subTitle}}</el-button>
						    <el-button type="primary" @click="go">返回</el-button>
			  			</el-form-item>
		  			</div>
			</el-form>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'Pay',
  data () {
  	      var reg = /^0?7[0-9]{9}$/
	      var checkPhone = (rule, value, callback) =>{
		        if(value === '') {
		        	this.nowType = null;
		        	this.rechargeType = null;
		        	this.changeLimit = null;
		            this.nowPackageName = null;
	      	  	    this.orgpackageId = null;
	      	  	    this.operatorId = null;
	      	  	 	this.studentId = null;
	                this.currencySymbol = null;
	                this.exchangeRate = null;
	                this.productItems = null;
	                this.productShow = false;
	                this.top = 0;
	                this.productActive = null;
	                this.productId = null;
	                this.priceShow = false;
		          return callback(new Error('请输入手机号'));
		        }
		        if(!reg.test(value)){
		        	callback(new Error('手机号格式不正确'));
		        	this.nowType = null;
		        	this.rechargeType = null;
		        	this.changeLimit = null;
		        	this.nowPackageName = null;
	      	  	    this.orgpackageId = null;
	      	  	    this.operatorId = null;
	      	  	 	this.studentId = null;
	                this.currencySymbol = null;
	                this.exchangeRate = null;
	                this.productItems = null;
	                this.productShow = false;
	                this.top = 0;
	                this.productActive = null;
	                this.productId = null;
	                this.priceShow = false;
		        }else{
		        	this.getProductListByPhone(callback)
		        }
	      };
		  return {
		  	   operatorId:null,
		  	   studentId:null,
		  	   orgpackageId:null,
		  	   currencySymbol:null,
		  	   exchangeRate:null,
		  	   rules: {
			      phone:[
			        { validator: checkPhone, trigger: 'blur' }
			      ]
			   },
			   ruleForm: {
			       phone:''
			   },
			   options: [{
		          value:'44',
		          label: '英国(+44)'
		       }],
		       value:'44',
		       changeLimit:null,
		       productShow:false,
		  	   nowPackageName:"",
		  	   retypedesc:[
		  	       "原套餐充值",
		  	       "仅充值",
		  	       "变更套餐充值"
		  	   ],
		  	   rechargeType:null,
		  	   nowType:null,
		  	   typeActive:null,
		  	   typeShow:false,
		  	   typeTip:null,
		  	   packageShow:false,
		  	   packageItems:null,
		  	   packageDesc:"",
		  	   packageActive:0,
		  	   nowpackageId:null,
		  	   priceShow:false,
		  	   productItems:null,
		  	   productId:null,
		  	   productActive:null,
		  	   foreignPrice:null,
		  	   rmbPrice:null,
		  	   top:0,
		  	   canpay:true,
		       subTitle:'提交',
		       loadingFlag:false
		   }
	},
  methods:{
  	     getProductListByPhone(rcallback){
  	     	if(this.ruleForm.phone.indexOf("0")==0){
  	     		this.ruleForm.phone = this.ruleForm.phone.replace("0","");
  	     	}
  	     	var that = this;
  	     	axios({
				  method: 'post',
				  url:'../center/getPackageByPhone',
				  data:querystring.stringify({
				  	phoneNo:that.value + that.ruleForm.phone
				  })
			  })
	      	  .then(function(r){
	      	  	 if(r.data.success){
	                rcallback();
	                that.changeLimit = r.data.data.changeLimit;
	                that.nowPackageName = r.data.data.packageName;
	                that.orgpackageId = r.data.data.packageId;
	                that.operatorId = r.data.data.operatorId;
	                that.studentId = r.data.data.studentId;
	                that.currencySymbol = r.data.data.currencySymbol;
	                that.exchangeRate = r.data.data.exchangeRate;
	                that.productItems = r.data.data.productList;
	                that.productShow = true;
	                that.top = 0;
	      	  	 }else{
	      	  	 	rcallback(new Error(r.data.desc));
	      	  	 	that.changeLimit = null;
	      	  	 	that.nowPackageName = null;
	      	  	    that.orgpackageId = null;
	      	  	    that.operatorId = null;
	      	  	 	that.studentId = null;
	                that.currencySymbol = null;
	                that.exchangeRate = null;
	                that.productItems = null;
	                that.productShow = false;
	                that.top = 0;
	                that.typeShow = false;
	                that.productActive = null;
	                that.productId = null;
	                that.priceShow = false;
	                that.rechargeType = null;
	                that.nowType = null;
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
  	     countMoney(_index,_productPrice,_productId){
//	    	console.log(_productPrice,_productId);
  	    	this.productActive = _index;
  	    	this.foreignPrice = this.currencySymbol + _productPrice;
  	    	this.rmbPrice = (_productPrice*this.exchangeRate).toFixed(2);
  	    	this.priceShow = true;
  	    	this.productId = _productId;
  	    },
  	    changeType(index){
  	    	this.productId = null;
  	    	this.productActive = null;
  	    	this.priceShow = false;
  	    	this.foreignPrice=null;
		  	this.rmbPrice=null;
  	    	if(index===0){
  	    		this.typeActive = index;
  	    		this.rechargeType = 0;
  	    		this.typeTip = "充值后用于继续购买当前套餐";
  	    		this.getList(this.rechargeType);
  	    	}else if(index===1){
  	    		this.typeActive = index;
  	    		this.rechargeType = 1;
  	    		this.typeTip = "仅话费充值，不购买套餐";
  	    		this.getList(this.rechargeType);
  	    	}else{
  	    		this.rechargeType = 2;
  	    		if(this.changeLimit){
  	    		   this.$message({
				          message:"您有订单处理中，请勿重复操作",
				          type: 'warning',
				          duration:1500,
				          center:true
		            });
  	    		}else{
  	    			this.typeActive = index;
  	    			this.getList(this.rechargeType);
  	    		}
  	    	}
	  	  
  	    },
  	    getList(rechargeType){
  	       if(this.nowType===rechargeType){
  	    		
	       }else{
	            this.nowType = rechargeType;
  	    		this.productItems = null;
				this.packageItems = null;
				this.nowpackageId= null;
				this.packageDesc = "";
				this.packageActive= 0;
	  	    	var that = this;
	  	     	axios({
					  method: 'post',
					  url:'../center/packageInfo',
					  data:querystring.stringify({
					  	  operatorId:that.operatorId,
				  		  packageId:that.orgpackageId,
				          rechargeType:rechargeType
					  })
				  })
		      	  .then(function(r){
		      	  	 if(r.data.success){
			                if(rechargeType===0||rechargeType===1){
			                	 that.putProductList(r.data.data.productList);
			                	 that.typeShow = true;
  	    					     that.packageShow = false;
			                }else if(rechargeType===2){
								 that.putPackageList(r.data.data.packageList)
								 that.packageShow = true;
	  	    		             that.typeShow = false;
							}
		      	  	 }else{
		      	  	    that.$message({
				          message:r.data.desc,
				          type: 'warning',
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
  	    },
  	    putPackageList(packageList){
  	    	this.packageItems = packageList;
  	    	this.packageDesc = packageList[0].packageDesc;
	      	this.nowpackageId = packageList[0].packageId;
	      	this.putProductList(packageList[0].productList);
  	    },
  	    putProductList(productList){
  	    	this.productItems = productList;
  	    },
  	    changePackage(_index,_packageDesc,_packageId){
	      	 if(this.packageActive==_index){
	      	 	return false;
	      	 }
	      	 this.productId = null;
  	    	 this.priceShow = false;
  	    	 this.productActive = null;
	      	 this.packageActive=_index;
	      	 this.packageDesc = _packageDesc;
	      	 this.nowpackageId = _packageId;
	      	 this.putProductList(this.packageItems[_index].productList);
	    },
  	    submitForm(formName) {
  	    	 if(this.ruleForm.phone===""){
             	return this.$message({
		          message:'请填写手机号',
		          type: 'warning',
		          duration:1500,
		          center:true
           		});
             }
          	 if(this.rechargeType===null){
             	return this.$message({
		          message:'请选择充值类型',
		          type: 'warning',
		          duration:1500,
		          center:true
           		});
             }
             if(this.productId===null){
             	return this.$message({
		          message:'请选择充值金额',
		          type: 'warning',
		          duration:1500,
		          center:true
           		});
             }
             this.subOrder();                     	
	      },
	      subOrder(){
	      		this.loadingFlag = true;
	      		if(this.rechargeType===0||this.rechargeType===1){
	      			var sendData = {
	      				 studentId:this.studentId,
					  	 phoneNo:this.value + this.ruleForm.phone,
					  	 packageId:this.orgpackageId,
					  	 rechargeType:this.rechargeType,
					  	 productId:this.productId,
					  	 orderSource:1
	      			}
	      		}else{
	      			var sendData = {
	      				 studentId:this.studentId,
					  	 phoneNo:this.value + this.ruleForm.phone,
					  	 packageId:this.nowpackageId,
					  	 rechargeType:this.rechargeType,
					  	 productId:this.productId,
					  	 orderSource:1
	      			}
	      		}
	      		var that = this;
	  	     	axios({
					  method: 'post',
					  url:'../center/rechargeOrder',
					  data:querystring.stringify(sendData)
				  })
		      	  .then(function(r){
//		      	  	 console.log(r);
		      	  	 if(r.data.success){
	                        const div = document.createElement('div');
					        div.innerHTML = r.data.desc;
					        document.body.insertBefore(div,document.body.children[0]);				        		        	
					        document.forms[0].submit();
		      	  	 }else{
		      	  	 	  that.$message({
					          message:r.data.desc,
					          type: 'warning',
					          duration:1500,
					          center:true
	                   	   });
	                   	   that.loadingFlag = false;
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
	      go(){
	         this.$router.go(-1);
	      }
  }
}
</script>

<style scoped>
	.recharge-container{
		width:100%;
	}
	img{
		display:block;
		width:100%;
	}
	.recharge{
		width:1190px;
		min-height:614px;
		margin:0 auto;
	}
	form{
		padding-top:210px;
		padding-left:370px;
		padding-right:155px;
		padding-bottom:210px;
	}
	.el-select{
		width:120px;
	}
	.el-input{
		width:283px;
		margin-right:200px;
	}
	.change-package{
		width:407px;
		display:flex;
		justify-content:space-between;
	}
	.current-title,#current-package{
		font-size:14px;
		color:#000;
		font-weight:bold;
	}
	#current-package{
		padding-right:202px;
	}
	.title{
		margin-bottom:20px;
		font-size:14px;
		color:#000;
		font-weight:bold;
	}
	.recharge-type-list,.packagelist,.productlist{
		width:460px;
	}
	.recharge-type-list>li,.packagelist>li,.productlist>li,.detail{
		margin-right:10px;
		margin-bottom:20px;
		display: inline-block;
	    line-height: 1;
	    white-space: nowrap;
	    background: #fff;
	    border: 1px solid #dcdfe6;
	    color: #606266;
	    -webkit-appearance: none;
	    text-align: center;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	    outline: 0;
	    -webkit-transition: .1s;
	    transition: .1s;
	    padding: 12px 20px;
	    font-size: 14px;
	    border-radius: 4px;
	}
	.recharge-type-list>li,.packagelist>li,.productlist>li{
		 cursor: pointer;
	}
	.recharge-type-list>li,.packagelist>li,.productlist>li{
		width:129px;
	}
	.recharge-type-list>li:hover,.packagelist>li:hover,.productlist>li:hover{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
	.recharge-type-list>li.active,.packagelist>li.active,.productlist>li.active{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
	.detail{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
</style>