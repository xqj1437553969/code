<template>
   <div class="business-container">
      <div class="business">
      	<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      		<p class="title">资料填写</p>
      		<!--<el-form-item label="资料填写"></el-form-item>-->
		  	<el-form-item label="激活码" prop="activatecode">
		    	<el-input v-model="ruleForm.activatecode" placeholder="请输入卡片上的激活码"  @change="changeActCode"></el-input>
		  	</el-form-item>
		  	<el-form-item label="手机号" prop="phone">
		    	<el-input v-model="ruleForm.phone" placeholder="请输入国内手机号" @change="changePhone"></el-input>
		  	</el-form-item>
		  	<el-form-item label="验证码" prop="securitycode" v-if="captcha.show">
		    	<el-input v-model.number="ruleForm.securitycode" placeholder="请输入验证码"></el-input>
		    	<el-button type="primary" @click="getCaptcha" :disabled="captcha.btnFlag">{{captcha.title}}</el-button>
		  	</el-form-item>
		  	<el-form-item label="激活日期" prop="pickerDate">
			    	 <el-date-picker v-model="ruleForm.pickerDate"
				      type="date"
				      :disabled="dateTrue"
				      :placeholder="activateDatePrompt"
				      :default-value = "defaultDate"
				      format="yyyy 年 MM 月 dd 日"
				      value-format="yyyy-MM-dd"
				      :picker-options="pickerOptions"
			      	>
    		 		</el-date-picker>
		  	</el-form-item>
		  	<p class="title" v-if="product.show||month.show">选择套餐</p>
		  	<el-form-item  v-if="product.show||month.show">
		        <ul class="packagelist">
				    <li v-for="(item,index) in packageList" @click="changePackage(index,item.packageDesc,item.packageId)" v-bind:class="{active:pactive===index}">{{item.packageName | packagenamefilter}}</li>
	  			</ul>
  			 </el-form-item>
  			 <p class="title" v-if="product.show||month.show">套餐详情</p>
  			 <el-form-item  v-if="product.show">
	  			<div class="ukdetail">{{packageDesc | descfilter}}</div>
	  	    </el-form-item>
	  	    <el-form-item  v-if="month.show">
	  			<div class="usdetail" v-html="packageDesc"></div>
	  	    </el-form-item>
	  	    <p class="title"  v-if="month.show">套餐月数（1个月=30天）</p>
	  	   	<el-select v-model="month.selectvalue" placeholder="请选择订购月数" v-if="month.show" @change="countUSMoney(month.selectvalue)">
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
	  	    <p class="title tit"  v-if="product.show">选择充值金额</p>
	  	    <el-form-item  v-if="product.show">
	  			<ul class="rechargelist">
				    <li v-for="(item,index) in product.productItems" @click="countUKMoney(index,item.productPrice,item.productId)" v-bind:class="{active:product.tactive===index}">{{item.productName}}</li>
	  			</ul>
	  			<p v-if="product.priceShow">总计：{{foreignPrice}}=<strong>{{rmbPrice}}CNY</strong></p>
  			</el-form-item>
  			<el-form-item>
			    <el-button type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="loadingFlag" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">提交</el-button>
			    <el-button type="primary" @click="go">返回</el-button>
  			</el-form-item>
		</el-form>
      </div>
   </div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'Business',
  data () {
  	     var checkActivatecode = (rule, value, callback) => {
  	     	//element-ui表单验证激活码
	        if (value === '') {
	        	this.clear();//未输入激活码时，进行提示并清除页面所有数据
                return callback(new Error('请输入激活码'));
	        }
	        if(!this.reg.actCodeReg.test(value.trim())){
	        	this.clear();//激活码格式不正确时，进行提示并清除页面所有数据
	        	callback(new Error('激活码格式不正确'));
	        }else{
                if(this.actCodePass===true){
                	//actCodePass为true或false表示激活码已进行过验证，就不再进行重复验证，除非当输入的激活码发生变化时再重新进行验证	
                	return callback();
                }
                if(this.actCodePass===false){
                	//actCodePass为true或false表示激活码已进行过验证，就不再进行重复验证，除非当输入的激活码发生变化时再重新进行验证	
                	return callback(new Error('无效的卡号'));
                }
                this.clear();//激活码格式正确并且没有进行过验证，清除页面所有数据
	        	this.checkCardNo(callback);//激活码请求验证
	        }  	
	      };
	      var checkPhone = (rule, value, callback) =>{
	      	//element-ui表单验证手机号
	        if (value === '') {
	            return callback(new Error('请输入手机号'));
	        }
	        if (!this.reg.phoneReg.test(value)) {  
		        callback(new Error('手机号格式不正确'));
		    }else{
		          if(this.phonePass){//phonePass为true表示手机号已进行过请求验证，就不再进行重复验证，除非当输入的手机号发生变化时再重新进行验证		          	
		          	 return callback();
		          }
		          this.checkPhone();
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
	      var checkDvalue = (rule, value, callback) => {
	      	//element-ui表单验证激活日期
	        if (!value) {
	          callback(new Error('请选择激活日期'));
	        } else {
	          callback();
	        }
	      };
	      return {
	    	reg:{
	    		actCodeReg:/^[0-9A-Z]{6,}$/,//激活码格式正则
	    		phoneReg:/^[1][3,4,5,7,8,9][0-9]{9}$///国内手机号正则
	    	},
	    	actCodePass:null,//actCodePass为true或false表示激活码已进行过验证，就不再进行请求重复验证，除非当输入的激活码发生变化时再重新进行验证
	    	phonePass:false,//phonePass为true表示手机号已验证通，就不再进行请求重复验证，除非当输入的手机号发生变化时再重新进行验证
	    	operatorList:null,//运营商列表
	    	cardId:null,//电话卡Id
	    	operatorId:null,//运营商Id
	    	currencySymbol:null,//货币符号
	        exchangeRate:null,//汇率
	        packageList:null,//套餐列表
	        packageDesc:null,//套餐详情
	        activateDateEarliest:null,////预约最早可选的日期（-1表示昨天，0表示今天，1表示明天，2表示后天）
	        activateDatePrompt:'请选择激活日期',//选择开卡日期时的时间提示文字
	    	dateTrue:true,//日历选择是否禁用，true表示禁用
	        pactive:0,//点击套餐列表时增加active类名（改变选中套餐的背景颜色），默认选中第一个套餐
	    	packageId:null,//选中的套餐Id
	    	product:{
	    		//套餐收费模式为产品
	    		tactive:null,//点击产品列表增加active类名（改变选中产品的背景颜色）
	    		show:false,//套餐列表和产品列表是否显示，false表示不显示
	    		productItems:null,//产品列表
	    		priceShow:false,//价格参数是否显示，false表示不显示
	    		productId:null,//选中的产品Id
	    	},
	    	month:{
	    		//套餐收费模式为月份
	    		show:false,//套餐列表和订购月数列表是否显示，false表示不显示	    		
	    		selectvalue:'',//select下拉框选中的值
	    		priceItems:null,//月份价格列表
	    		priceShow:false,//价格参数是否显示，false表示不显示
	    		priceId:null,//选中的月份对应的价格Id
	    	},
	    	defaultDate:'2017-8-15',//element-ui的datepicker(日历选择器)打开时的默认日期
	    	pickerOptions:{
	    		//element-ui的datepicker(日历选择器)禁用设置
		      	disabledDate:(time)=>{
	              return time.getTime() < new Date(this.defaultDate).getTime()-8*60*60000;
	            }
	        },
	        captcha:{
	        	//验证码相关数据
	        	btnFlag:false,//验证码按钮是否禁用，false表示不禁用
	    	    show:false,//验证码一栏是否显示，false表示不显示
	        	title:'获取验证码',//验证码按钮文字
	            timer:null,//验证码计时器
	        	count:60//验证码计时时间
	        },
	    	loadingFlag:false,
	    	ruleForm: {
	          activatecode:'',//激活码
	          phone:'',//手机号
	          securitycode:'',//验证码
	          pickerDate:''//激活日期
	        },
	        rules: {
	          activatecode: [
	            //激活码校验配置
	            { validator: checkActivatecode, trigger: 'blur' }
	          ],
	          phone:[
	            //手机号校验配置
	            { validator: checkPhone, trigger: 'blur' }
	          ],
	          securitycode: [
	            //验证码校验配置
	            { validator: checkSecuritycode, trigger: 'blur' }
	          ],
	          pickerDate: [
	            //激活日期校验配置
	            { validator: checkDvalue, trigger:['blur','change'] }
	          ]
	        },
	        unitPrice:null,//货币符号+单价*月数
	        foreignPrice:null,//货币符号+总价格（外币）
	        rmbPrice:null,//总价格（人民币）
	        submsg:null,//提交订单时发送的数据
	    }
  },
  beforeMount:function(){
  	sessionStorage.removeItem("haschoose");//删除从首页点击立即领卡按钮进入领卡页面的标识
  	this.getPackage();//获取运营商列表数据
  },
   methods: {
   	  	 clear(){
   	  	 	//清除页面数据
   	  	 	this.actCodePass = null;//actCodePass为true或false表示激活码已进行过验证，就不再进行请求重复验证，除非当输入的激活码发生变化时再重新进行验证
   	  	 	this.phonePass = false;//phonePass为true表示手机号已验证通，就不再进行请求重复验证，除非当输入的手机号发生变化时再重新进行验证
  	    	this.cardId = null;//电话卡Id
  	    	this.operatorId = null;//运营商Id
  	    	this.packageList = null;//套餐列表
    		this.packageDesc = null;//套餐详情
      	  	this.packageId = null;//套餐Id
      	  	this.activateDatePrompt = '请选择激活日期';//激活日期文字提示
      	  	this.activateDateEarliest = null;//预约最早可选的日期（-1表示昨天，0表示今天，1表示明天，2表示后天）
      	  	this.ruleForm.pickerDate ='';//激活日期
      	  	this.$refs.ruleForm.validateField('pickerDate');//校验激活日期
      	  	this.dateTrue = true;//日期
      	  	this.pactive = 0;//点击套餐列表时增加active类名（改变选中套餐的背景颜色），默认选中第一个套餐
      	  	this.product.tactive = null;//套餐收费模式为产品时点击产品列表增加active类名（改变选中产品的背景颜色）
      	  	this.product.show = false;//套餐列表和产品列表是否显示，false表示不显示
      	  	this.product.productItems = null;//产品列表
      	  	this.product.productId = null;//产品Id
      	  	this.product.priceShow = false;//套餐收费模式为产品时，价格参数是否显示，false表示不显示
      	  	this.month.show = false;//套餐列表和订购月数列表是否显示，false表示不显示
      	  	this.month.selectvalue = '';//select下拉框选中的值
      	  	this.month.priceItems = null;//月份价格列表
      	  	this.month.priceId = null;//月份价格Id
      	  	this.month.priceShow = false;//套餐收费模式为产品时，价格参数是否显示，false表示不显示
      	  	this.unitPrice = null;//货币符号+单价*月数
      	  	this.foreignPrice = null;//货币符号+总价格（外币）
            this.rmbPrice = null;//总价格（人民币）
  	      },
   	      getPackage(){
   	      	 //获取运营商列表数据
	      	 var that = this;
	      	 axios({
				  method: 'post',
				  url:'../center/buyPackage',
				  data:querystring.stringify({
				  	orderSource:1
				  })
			  })
	      	  .then(function(r){
//	      	  	 console.log(r);
	      	  	 if(r.data.success){
	      	        that.operatorList = r.data.data.operatorList; 
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
	      changeActCode(){
	      	 //输入的激活码变化时，将actCodePass设为null，表示激活码需要重新请求验证
	      	 this.actCodePass = null;
	      },
	      checkCardNo(rcallback){
	      	  //激活码请求验证
	      	  var scallback = rcallback;
	      	  var cardNo = this.ruleForm.activatecode.trim();//激活码去除空格
	      	  var that = this;
	      	  axios({
				  method: 'post',
				  url:'../center/checkCardNo',
				  data:querystring.stringify({
				  	 cardNo:cardNo
				  })
			  })
	      	  .then(function(r){
//	      	  	 console.log(r);
	      	  	 if(r.data.success){
	      	  	 	scallback();//验证成功，激活码输入框边框变绿色且标记为对勾
	      	        that.actCodePass = true;//激活码已进行过验证并且验证成功
	      	  	 	that.cardId = r.data.data.cardId;//电话卡Id
	      	  	 	that.operatorId = r.data.data.operatorId;//运营商Id
	      	  	 	that.currencySymbol = r.data.data.currencySymbol;//货币符号
	      	  	 	that.exchangeRate = r.data.data.exchangeRate;//汇率
	      	  	 	that.packageList = r.data.data.packageList;//套餐列表
	      	  	 	that.pactive = 0;//点击套餐列表时增加active类名（改变选中套餐的背景颜色）的标识，默认选中第一个套餐
	      	  	 	that.packageDesc = that.packageList[0].packageDesc;//默认选中第一个套餐
	      	  	 	that.packageId = that.packageList[0].packageId;//默认选中的第一个套餐的Id
	      	  	 	if(that.packageList[0].chargeType===0){
	      	  	 		//套餐付费模式为产品
	      	  	 		that.getProductList(that.packageList[0].productList);//获取产品列表
	      	  	 		that.product.show = true;//套餐列表、套餐详情、产品显示
	      	  	 		that.month.show = false;//月份隐藏
	      	  	 	}else if(that.packageList[0].chargeType===1){
	      	  	 		//套餐付费模式为月份
	      	  	 		that.getPriceList(that.packageList[0].priceList);//获取月份价格列表
	      	  	 		that.product.show = false;//产品隐藏
	      	  	 		that.month.show = true;//套餐列表、套餐详情、月份显示
	      	  	 	}
	      	  	 	that.findOperatorId();//从运营商列表中查找与输入卡号得到的operatorId一致的运营商，并设置预约最早可选时间和激活日期文字提示
	      	  	 	that.defaultDate = getServerDate(that.activateDateEarliest);//根据预约最早可选时间限制日历选择
	      	  	 	that.dateTrue = false;//开启日历选择
	      	  	 }else{
	      	  	    scallback(new Error(r.data.desc));//验证失败提示
	      	  	    that.clear();//清除页面所有数据
	      	  	    that.actCodePass = false;//激活码已进行过验证并且验证失败
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
	      findOperatorId(){
	      	 //从运营商列表中查找与输入卡号得到的operatorId一致的运营商
	      	 for(var i=0;i<this.operatorList.length;i++){
		    	if(this.operatorId==this.operatorList[i].operatorId){
		    		this.activateDateEarliest = this.operatorList[i].activateDateEarliest;//预约最早可选时间 
		    		this.activateDatePrompt ='请选择激活日期（'+this.operatorList[i].activateDatePrompt+'）';//激活日期提示
		    		break;
		    	}
		    }  
	      },
	      getProductList(productItems){
	      	   //获取产品列表
  	    	   this.product.productItems = productItems;
  	      },
	      getPriceList(priceItems){
	      	   //获取月份价格列表
	      	   this.month.priceItems = priceItems;
	      },
	      changePackage(_index,_packageDesc,_packageId){
	      	 //点击不同套餐,改变页面显示内容
	      	 if(this.pactive==_index){
	      	 	//套餐列表如果点击的是同一个，则打断代码执行
	      	 	return false;
	      	 }
	      	 this.product.productId = null;
  	    	 this.product.priceShow = false;
  	    	 this.product.tactive = null;
	      	 this.pactive=_index;
	      	 this.packageDesc = _packageDesc;
	      	 this.packageId = _packageId;
	      	 this.month.priceId = null;
	      	 this.month.selectvalue = '';
	      	 this.month.priceShow = false;
	      	 if(this.packageList[0].chargeType===0){
	      	 	//如果套餐列表中的chargeType为0，表示套餐收费模式为产品，则需要获取产品列表
	      	 	this.getProductList(this.packageList[_index].productList);
	      	 }else if(this.packageList[0].chargeType===1){
	      	 	//如果套餐列表中的chargeType为1，表示套餐收费模式为月份，则需要获取月份价格列表
	      	    this.getPriceList(this.packageList[_index].priceList);
	      	 }
	      },
	      changePhone(){
	      	  this.phonePass = false;//输入的手机号变化时，将phonePass设置为false，表示手机号需要重新验证
	      },
	      checkPhone(){
	      	  //校验手机号是否在数据库里
	      	  var that = this;
	      	  axios({
				  method: 'post',
				  url:'../center/checkPhone',
				  data:querystring.stringify({
				  	 phone:'86'+ that.ruleForm.phone
				  })
			  })
	      	  .then(function(r){
	      	  	 if(r.data.success){
	      	  	 	//手机号在库里，不需要发送验证码
	      	  	    that.phonePass = true;
	      	  	 	that.captcha.show = false;//验证码一栏不显示
	      	  	 }else{
	      	  	 	//手机号不在库里，需要发送验证码
	      	  	 	that.phonePass = true;
	      	  	    that.captcha.show = true;//验证码一栏显示
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
	    countUKMoney(_index,_productPrice,_productId){
	    	//套餐收费模式为产品时总价格计算
//	    	console.log(_productPrice,_productId);
  	    	this.product.tactive = _index;
  	    	this.foreignPrice = this.currencySymbol + _productPrice;
  	    	this.rmbPrice = (_productPrice*this.exchangeRate).toFixed(2);
  	    	this.product.priceShow = true;
  	    	this.product.productId = _productId;
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
  		 getCaptcha(){
  		 	//验证码获取
//		 	 console.log(this);
  		     this.$refs.ruleForm.validateField('phone');
  		     if(this.phonePass){
  		     	 var that = this;
	  		     axios({
					  method: 'post',
					  url:'../center/captcha',
					  data:querystring.stringify({
					      phone:'86'+that.ruleForm.phone
					  })
			      })
			  	  .then(function(r){
//			  	  	   console.log(r)
			  		   if(r.data.success){
//						 	 console.log(that);
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
				          message:'请求失败',
				          type: 'error',
				          duration:1500,
				          center:true
	                   });
		  		  });
		         
  		    }
		 
  		},
  	    down(){
  	    	//验证码倒计时
  	    	var that = this;
  	    	this.captcha.timer = setInterval(function(){
//		 	 	    console.log(that);
		 	 	    that.captcha.btnFlag = true;
		 	 	    that.captcha.count--;
		 	 	    that.captcha.title = '已发送'+that.captcha.count+'s';
		  		   	if(that.captcha.count==0){
		  		   		  clearInterval(that.captcha.timer);
		  		   		  that.captcha.count = 60;
		  		   		  that.captcha.btnFlag = false;
		  		   		  that.captcha.title = '重新获取';
		  		   	}
			},1000);
  	    },
  	    submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	 //表单校验通过
                     if(this.packageList[0].chargeType===0&&(!this.product.productId)){
                     	//套餐收费模式为产品并且未选择充值产品
                     	this.$message({
				          message:'请选择充值金额',
				          type: 'error',
				          duration:1500,
				          center:true
	               		});
                     }else if(this.packageList[0].chargeType===1&&(!this.month.priceId)){
                     	//套餐收费模式为月份并且未选择订购月数
                        this.$message({
				          message:'请选择订购月数',
				          type: 'error',
				          duration:1500,
				          center:true
	               		});              	
                     }else{
                     	 //所有数据验证通过可以下单了
                     	 this.subOrder();  
                     }
		          } else {
		          	 //表单验证没有通过
		          	 console.log('error submit!!');
		             return false;
		          }
	        });
	    },
	    go(){
	         this.$router.go(-1);
	    },
  	    subOrder(){
  	    	 this.loadingFlag = true;//加载loading出现
  	    	 if(this.captcha.show){
  	    	 	//需要发送验证码的情况
  	    	 	if(this.packageList[0].chargeType===0){
  	    	 		  //套餐收费模式为产品的情况
		    	 	  this.submsg = {
		    	 		  packageId:this.packageId,
					      productId:this.product.productId,
					      cardId:this.cardId,
					      activateDate:this.ruleForm.pickerDate,
					      phone:'86'+this.ruleForm.phone,
					      captcha:this.ruleForm.securitycode,
					      orderSource:1
		    	 	  }
  	    	 	}else if(this.packageList[0].chargeType===1){
  	    	 		 //套餐收费模式为月份的情况
  	    	 		  this.submsg = {
		    	 		  packageId:this.packageId,
					      priceId:this.month.priceId,
					      cardId:this.cardId,
					      activateDate:this.ruleForm.pickerDate,
					      phone:'86'+this.ruleForm.phone,
					      captcha:this.ruleForm.securitycode,
					      orderSource:1
		    	 	  }
  	    	 	}
  	    
  	    	 }else{
  	    	 	//不需要发送验证码的情况
  	    	 	if(this.packageList[0].chargeType===0){
  	    	 		this.submsg = {
  	    	 		  //套餐收费模式为产品的情况
  	    	 		  packageId:this.packageId,
				      productId:this.product.productId,
				      cardId:this.cardId,
				      activateDate:this.ruleForm.pickerDate,
				      phone:'86'+this.ruleForm.phone,
				      orderSource:1
  	    	 		}
  	    	 	}else if(this.packageList[0].chargeType===1){
  	    	 		//套餐收费模式为月份的情况
  	    	 		this.submsg = {
		    	 		  packageId:this.packageId,
					      priceId:this.month.priceId,
					      cardId:this.cardId,
					      activateDate:this.ruleForm.pickerDate,
					      phone:'86'+this.ruleForm.phone,
					      captcha:this.ruleForm.securitycode,
					      orderSource:1
		    	 	}
  	    	 	}
  	    	 	
  	    	 }
  	    	 var that = this;
    	     axios({
				  method: 'post',
				  url:'../center/placeOrder',
				  data:querystring.stringify(that.submsg)
		      })
		  	  .then(function(r){
//		  	  	   console.log(r)
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
  	    }
    }
}
</script>

<style scoped>
	.business-container{
	    width:100%;
	}
	.business{
		width:1190px;
		min-height:614px;
		margin:0 auto;
	}
	form{
		padding-top:150px;
		padding-left:346px;
		padding-right:155px;
		padding-bottom:150px;
	}
	.el-input{
		width:400px;
	}
	.title{
		padding-left:32px;
		margin-bottom:20px;
		font-size:14px;
		color:#000;
		font-weight:bold;
	}
	.tit{
		padding-left:9px;
	}
	.packagelist,.rechargelist{
		width:460px;
	}
	.packagelist>li,.rechargelist>li,.ukdetail,.usdetail{
		margin-right:10px;
		margin-bottom:20px;
		display: inline-block;
	    line-height: 1;
	    white-space: nowrap;
	    cursor: pointer;
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
	.rechargelist>li{
		width:129px;
	}
	.packagelist>li:hover,.rechargelist>li:hover{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
	.ukdetail{
		width:340px;
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
	.usdetail{
		width:340px;
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	    text-align: left;
    	line-height: 27px;
    	padding-left: 81px;
	}
	.packagelist>li.active,.rechargelist>li.active{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
	.el-select{
		width:400px;
		margin-left:100px;
		margin-bottom:30px;
	}
</style>