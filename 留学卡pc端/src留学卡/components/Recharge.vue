<template>
	<div class="recharge-container">
		<div class="recharge">
		     <el-form :model="ruleForm"  :inline="true" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
		      		<p class="title">请填写国外号码</p>
		      		</el-form-item label="">
		      		   <el-select v-model="value" placeholder="请选择" @change="changeAreaNum">
						    <el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
  					    </el-select>
  					</el-form-item>
				  	<el-form-item label="" prop="phone">
				    	<el-input v-model="ruleForm.phone" placeholder="请输入国外号码" @change="changePhone"></el-input>
				  	</el-form-item>
				  	<p class="title" v-if="product.show||month.show">当前套餐</p>
				  	<el-form-item  v-if="product.show||month.show" v-bind:style="{marginBottom:0}">
				        <div class="detail">{{nowPackageName | packagenamefilter}}</div>
		  			</el-form-item>
		  			<!--套餐收费模式为月份时页面显示的内容-->
		  			<p class="title"  v-if="month.show">套餐月数（1个月=30天）</p>
			  	   	<el-select v-model="month.selectvalue" :style="{width:410+'px',marginBottom:30+'px',marginRight:100+'px'}"placeholder="请选择订购月数" v-if="month.show" @change="countUSMoney(month.selectvalue)">
						    <el-option
						      v-for="(item,index) in month.priceItems"
						      :key="index"
						      :label="item.monthNo+'个月（共节省'+currencySymbol+(item.monthNo*(month.priceItems[0].price-item.price)).toFixed(1)+'）'"
						      :value="index">
						    </el-option>
		  			</el-select>
		  			<el-form-item  v-if="month.show">
			  			<p v-if="month.priceShow">总计：{{unitPrice}}=<strong>{{foreignPrice}}</strong></p>
			  			<p v-if="month.priceShow">{{foreignPrice}}=<strong>{{rmbPrice}}CNY</strong></p>
			  			<p v-if="month.priceShow">汇率：{{currencySymbol}}1.00={{exchangeRate}}CNY</p>
		  			</el-form-item>
		  			<!--套餐收费模式为月份时页面显示的内容-->
		  			
		  			<!--套餐收费模式为产品时页面显示的内容-->
		  			<p class="title" v-if="product.show">充值类型</p>
		  			<el-form-item v-bind:style="{marginBottom:0}"  v-if="product.show">
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
				  	<p class="title" v-if="product.show">选择充值金额</p>
			  	    <el-form-item  v-if="product.show">
			  			<ul class="productlist">
						    <li v-for="(item,index) in product.productItems" @click="countMoney(index,item.productPrice,item.productId)" v-bind:class="{active:product.productActive===index}">{{item.productName}}</li>
			  			</ul>
			  			<p v-if="product.priceShow">总计：{{foreignPrice}}=<strong>{{rmbPrice}}CNY</strong></p>
  					</el-form-item>
  					<!--套餐收费模式为产品时页面显示的内容-->
		  			<div>		  				
			  			<el-form-item>
						    <el-button type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="loadingFlag" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">提交</el-button>
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
	      var checkPhone = (rule, value, callback) =>{
	      	    //element-ui表单验证手机号
		        if(value === '') {
		           this.clear();//手机号为空时清除页面所有数据，并进行提示
		           return callback(new Error('请输入手机号'));
		        }
		        if(this.value=='44'){
		        	//区号为44时，验证手机号格式
		        	if(!this.reg.uk.test(value)){
			           this.clear();  //手机号格式不正确时清除页面所有数据，并进行提示
			           return callback(new Error('手机号格式不正确'));
			        }
		        	if(this.phonePass===false){
		        	   //phonePass为false表示手机已进行过验证，不需要进行重复请求验证，直接提示号码不存在
		        	   return callback(new Error('号码不存在'));
		        	}
		        	if(this.phonePass===true){
		        	 //phonePass为true表示手机已进行过验证，不需要进行重复请求验证，直接验证通过
		        	   return callback();
		        	}
		        	this.clear();//手机号格式正确时清除页面所有数据
		        	this.getProductListByPhone(callback);//手机号请求验证
		        }else if(this.value=="1"){
		        	//区号为1时，验证手机号格式
		        	if(!this.reg.us.test(value)){
			           this.clear(); //手机号格式不正确清除页面所有数据
			           return callback(new Error('手机号格式不正确'));
			        }
		        	if(this.phonePass===false){
		        	   //phonePass为false表示手机已进行过验证，不需要进行重复请求验证，直接提示号码不存在
		        	   return callback(new Error('号码不存在'));
		        	}
		        	if(this.phonePass===true){
		        	   //phonePass为true表示手机已进行过验证，不需要进行重复请求验证，直接验证通过
		        	   return callback();
		        	}
		        	this.clear();//手机号格式正确时清除页面所有数据
			        this.getProductListByPhone(callback);//手机号请求验证
		        }
		       
	      };
		  return {
		  	   reg:{
		  	   	  uk:/^0?7[0-9]{9}$/,//英国手机号正则
		  	   	  us:/^[0-9]{10}$///美国手机号正则
		  	   },
		  	   phonePass:null,//phonePass为false或true表示手机已进行过验证，不需要进行重复请求验证。为null表示需要重新进行请求验证
		  	   operatorId:null,//运营商Id
		  	   studentId:null,//用户Id
		  	   orgpackageId:null,//当前号码的默认套餐Id
		  	   currencySymbol:null,//货币符号
		  	   exchangeRate:null,//汇率
		  	   rules: {
		  	   	  //element-ui表单验证配置
			      phone:[
			        { validator: checkPhone, trigger: 'blur' }
			      ]
			   },
			   ruleForm: {
			       phone:''//手机号
			   },
			   options: [
			      //区号选择
			      {
		            value:'44',
		            label: '英国(+44)'
		         },
		         {
		            value:'1',
		            label: '美国(+1)'
		         }
			   ],
			   value:'44',//区号默认值44
			   month:{
		   	    //套餐收费模式为月份
		   	    show:false,//当前号码的套餐和订购月数列表是否显示，false表示不显示	    		
	    		selectvalue:'',//订购月数select下拉框选中的值
	    		priceItems:null,//月份价格列表
	    		priceId:null,//选中的月份对应的价格Id
	    		priceShow:false,//价格参数是否显示，false表示不显示
			   },
			   product:{
			   	 //套餐收费模式为产品
			   	 show:false,//当前号码的套餐和产品列表是否显示，false表示不显示
			   	 productItems:null,//产品列表
			   	 productActive:null,//点击产品列表增加active类名的标识（改变选中产品的背景颜色）
			   	 productId:null,//选中的产品Id
			   	 priceShow:false//价格参数是否显示，false表示不显示		   	
			   },
		       changeLimit:null,//changeLimit为true表示限制变更套餐，fasle表示不限制变更套餐
		  	   nowPackageName:"",//当前号码套餐的名称
		  	   retypedesc:[
		  	       //套餐收费模式为产品时的三种充值类型
		  	       "原套餐充值",//0
		  	       "仅充值",//1
		  	       "变更套餐充值"//2
		  	   ],
		  	   rechargeType:null,//充值类型（0表示原套餐充值，1表示仅充值，2表示变更套餐充值）
		  	   nowType:null,//当前选中的充值类型
		  	   typeActive:null,//点击选择充值类型列表增加active类名的标识（改变选中的充值类型的背景颜色）
		  	   typeShow:false,//充值类型说明文字是否显示（只有原套餐充值和仅充值才有文字说明），false表示不显示
		  	   typeTip:null,//充值类型说明文字
		  	   packageShow:false,//套餐列表是否显示，false表示不显示
		  	   packageItems:null,//套餐列表
		  	   packageDesc:"",//套餐详情
		  	   packageActive:0,//点击选择套餐列表增加active类名的标识（改变选中套餐的背景颜色），默认选中第一个
		  	   nowpackageId:null,//点击套餐列表之后选中的套餐Id
		  	   unitPrice:null,//货币符号+单价*月数
		  	   foreignPrice:null,//货币符号+总价格（外币）
		  	   rmbPrice:null,//总价格（人民币）
		       loadingFlag:false//下单提交时的loading
		   }
	},
  beforeMount(){
  	 sessionStorage.removeItem("haschoose");//删除从首页点击立即领卡按钮进入领卡页面的标识
  },
  methods:{
  	     clear(){
  	     	    this.phonePass = null;//phonePass为false或true表示手机已进行过验证，不需要进行重复请求验证。为null表示需要重新进行请求验证
      	  	    this.operatorId = null;//运营商Id
      	  	 	this.studentId = null;//用户Id
  	     	 	this.orgpackageId = null;//当前号码的默认套餐Id
                this.currencySymbol = null;//货币符号
                this.exchangeRate = null;//汇率
  	     		this.changeLimit = null;//changeLimit为true表示限制变更套餐，fasle表示不限制变更套餐
  	     		this.rechargeType = null;//充值类型（0，1，2）
     		    this.nowType = null;//当前选中的充值类型
     		    this.typeActive = null;//点击选择充值类型列表增加active类名的标识（改变选中的充值类型的背景颜色）
		  	    this.typeShow = false;//充值类型说明文字是否显示，false表示不显示
		  	    this.typeTip = null;//充值类型说明文字
		  	    this.nowPackageName = "";//当前号码套餐的名称
		  	    this.packageShow = false;//套餐列表是否显示，false表示不显示
		  	    this.packageItems = null;//套餐列表
		  	    this.packageDesc = "";//套餐详情
		  	    this.packageActive = 0;//点击选择套餐列表增加active类名的标识（改变选中套餐的背景颜色），默认选中第一个
		  	    this.nowpackageId = null;//点击套餐列表之后选中的套餐Id
		  	    this.product.show = false;//套餐收费模式为产品，当前号码的套餐和产品列表是否显示，false表示不显示
                this.product.productItems = null;//套餐收费模式为产品，产品列表
                this.product.productActive = null;//套餐收费模式为产品，点击产品列表增加active类名的标识（改变选中产品的背景颜色）
                this.product.productId = null;//套餐收费模式为产品，选中的产品Id
                this.product.priceShow = false;//套餐收费模式为产品，价格参数是否显示，false表示不显示	
                this.month.show = false;//套餐收费模式为月份，当前号码的套餐和订购月数列表是否显示，false表示不显示	
                this.month.selectvalue = '';//套餐收费模式为月份， 订购月数select下拉框选中的值
                this.month.priceItems = null;//套餐收费模式为月份，月份价格列表
                this.month.priceShow = null;//套餐收费模式为月份，价格参数是否显示，false表示不显示
                this.month.priceId = null;//套餐收费模式为月份，选中的月份对应的价格Id
                this.unitPrice = null;//货币符号+单价*月数
                this.foreignPrice = null;//货币符号+总价格（外币）
                this.rmbPrice = null;//总价格（人民币）
  	     },
  	     changeAreaNum(){
  	     	//选中的区号改变
  	     	this.phonePass = null;//将phonePass设为null，表示号码需要重新请求验证
  	     	this.$refs.ruleForm.validateField('phone');
  	     },
  	     changePhone(){
  	     	//输入的号码改变
  	     	this.phonePass = null;//将phonePass设为null，表示号码需要重新请求验证
  	     },
  	     getProductListByPhone(rcallback){
  	     	if(this.value==="44"&&this.ruleForm.phone.indexOf("0")==0){
  	     		//英国号码去0
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
	                that.phonePass = true;//phonePass为false或true表示手机已进行过验证，不需要进行重复请求验证
	                that.changeLimit = r.data.data.changeLimit;//changeLimit为true表示限制变更套餐，fasle表示不限制变更套餐
	                that.nowPackageName = r.data.data.packageName;//当前号码的套餐名称
	                that.orgpackageId = r.data.data.packageId;//当前号码的套餐Id
	                that.operatorId = r.data.data.operatorId;//运营商Id
	                that.studentId = r.data.data.studentId;//用户Id
	                that.currencySymbol = r.data.data.currencySymbol;//货币符号
	                that.exchangeRate = r.data.data.exchangeRate;//汇率
	                if(r.data.data.productList){
	                	//套餐收费模式为产品
	                	that.product.productItems = r.data.data.productList;//产品列表
	                	that.product.show = true;//当前号码的套餐和产品列表显示
	                	that.month.show = false;//月份价格列表隐藏
	                }else if(r.data.data.priceList){
	                	//套餐收费模式为月份
	                	that.month.priceItems = r.data.data.priceList;//月份价格列表
	                    that.product.show = false;//产品列表隐藏
	                	that.month.show = true;//当前号码的套餐和月份价格列表显示
	                }
	      	  	 }else{
	      	  	 	rcallback(new Error(r.data.desc));
	      	  	 	that.clear();//清除页面所有数据
	                that.phonePass = false;//phonePass为false或true表示手机已进行过验证，不需要进行重复请求验证
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
  	     countUSMoney(_index){
  	    	//套餐收费模式为月份时总价格计算
//	    	console.log(_index);
  	    	var item = this.month.priceItems[_index];
//	    	console.log(item);
  	    	this.unitPrice = this.currencySymbol+item.price+"*"+item.monthNo;
	    	this.foreignPrice = this.currencySymbol + item.price*item.monthNo;
	    	this.rmbPrice = (item.price*item.monthNo*this.exchangeRate).toFixed(2);
	    	this.month.priceShow = true;
	    	this.month.priceId = item.priceId;
  	    },
  	     countMoney(_index,_productPrice,_productId){
  	     	//套餐收费模式为产品时总价格计算
//	    	console.log(_productPrice,_productId);
  	    	this.product.productActive = _index;
  	    	this.foreignPrice = this.currencySymbol + _productPrice;
  	    	this.rmbPrice = (_productPrice*this.exchangeRate).toFixed(2);
  	    	this.product.priceShow = true;
  	    	this.product.productId = _productId;
  	    },
  	    changeType(index){
  	    	//选择充值类型（0表示原套餐充值，1表示仅充值，2表示变更套餐）
  	    	this.product.productId = null;//清除产品Id
  	    	this.product.productActive = null;//清除产品选中标识
  	    	this.product.priceShow = false;//清除价格列表显示
  	    	this.unitPrice = null;//货币符号+单价*月数
  	    	this.foreignPrice=null;//清除货币符号+总价格（外币）
		  	this.rmbPrice=null;//清除总价格（人民币）
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
				          type: 'error',
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
  	       //获取产品列表或者套餐列表
  	       if(this.nowType===rechargeType){
  	    		//重复选中充值类型
	       }else{
	            this.nowType = rechargeType;//改变当前选中充值类型的充值type
  	    		this.product.productItems = null;//清除充值产品列表
				this.packageItems = null;//清除套餐列表
				this.nowpackageId= null;//清除选中套餐的套餐Id
				this.packageDesc = "";//清除选中套餐的套餐详情
				this.packageActive= 0;//清除选中套餐背景色标识
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
			                	//充值类型为原套餐充值或仅充值
			                	 that.putProductList(r.data.data.productList);
			                	 that.typeShow = true;//充值类型说明文字显示
  	    					     that.packageShow = false;//套餐列表和详情隐藏
			                }else if(rechargeType===2){
			                	//充值类型为变更套餐
								 that.putPackageList(r.data.data.packageList);//套餐列表和产品列表展示
								 that.packageShow = true;//套餐列表和详情展示
	  	    		             that.typeShow = false;//充值类型说明文字隐藏
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
	        }
  	    },
  	    putPackageList(packageList){
  	    	//变更套餐时,套餐列表和产品列表展示
  	    	this.packageItems = packageList;
  	    	this.packageDesc = packageList[0].packageDesc;//默认选中第一个套餐的套餐详情
	      	this.nowpackageId = packageList[0].packageId;//默认选中第一个套餐的套餐Id
	      	this.putProductList(packageList[0].productList);//默认选中第一个套餐的产品列表
  	    },
  	    putProductList(productList){
  	    	//产品列表展示
  	    	this.product.productItems = productList;
  	    },
  	    changePackage(_index,_packageDesc,_packageId){
  	    	 //变更套餐时，选择套餐
	      	 if(this.packageActive==_index){
	      	 	//选择套餐时重复点击同一个套餐
	      	 	return false;
	      	 }
	      	 this.product.productId = null;//清除产品Id
  	    	 this.product.priceShow = false;//清除价格参数
  	    	 this.product.productActive = null;//清除选中产品背景色标识
	      	 this.packageActive=_index;//选中套餐背景色的识
	      	 this.packageDesc = _packageDesc;//选中套餐的套餐详情
	      	 this.nowpackageId = _packageId;//选中套餐的Id
	      	 this.putProductList(this.packageItems[_index].productList);//产品列表展示
	    },
  	    submitForm(formName){
  	    	this.$refs[formName].validate((valid) => {
		            if(valid) {
		            	if(this.product.productItems){
		            		//套餐收费模式为产品
		            	    if(this.rechargeType===null){
		            	    	//下单时没有选择充值类型
				             	return this.$message({
						          message:'请选择充值类型',
						          type: 'error',
						          duration:1500,
						          center:true
				           		});
             				}
		            	    if(this.product.productId===null){
		            	    	//下单时没有选择充值金额
				                return this.$message({
						          message:'请选择充值金额',
						          type: 'error',
						          duration:1500,
						          center:true
				           		});
			            	}
		            	    this.subOrder();  
		            	}else{
		            	    //套餐收费模式为月份
		            	    if(this.month.priceId===null){
		            	    	//下单时没有选择订购月数
				             	return this.$message({
						          message:'请选择订购月数',
						          type: 'error',
						          duration:1500,
						          center:true
				           		});
			                }
		            	    this.subOrder();
		            	}	
		          }else{
		          	 console.log('error submit!!');
		             return false;
		          }
	         });                 	
	      },
	      subOrder(){
	      		this.loadingFlag = true;
	      		if(this.product.productItems){
	      			//套餐收费模式为产品
	      			if(this.rechargeType===0||this.rechargeType===1){
	      				    //充值类型为原套餐充值或者仅充值
			      			var sendData = {
			      				 studentId:this.studentId,
							  	 phoneNo:this.value + this.ruleForm.phone,
							  	 packageId:this.orgpackageId,
							  	 rechargeType:this.rechargeType,
							  	 productId:this.product.productId,
							  	 orderSource:1
			      			}
	      		   }else{  
	      		  	        //充值类型为变更套餐
			      			var sendData = {
			      				 studentId:this.studentId,
							  	 phoneNo:this.value + this.ruleForm.phone,
							  	 packageId:this.nowpackageId,
							  	 rechargeType:this.rechargeType,
							  	 productId:this.product.productId,
							  	 orderSource:1
			      			}
	      		    }
	      		}else{
	      		   //套餐收费模式为月份
	      			var sendData = {
	      				 studentId:this.studentId,
					  	 phoneNo:this.value + this.ruleForm.phone,
					  	 packageId:this.orgpackageId,
					  	 rechargeType:0,
					  	 priceId:this.month.priceId,
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
					          type: 'error',
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