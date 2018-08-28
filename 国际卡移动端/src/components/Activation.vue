<template>
  <div class="container" v-if="showContainer">
  	  <div class="swiper-container">
			    <div class="swiper-wrapper">
			        <div class="swiper-slide" v-for="(item,index) in operatorList"><img :src="item.activateImgUrl"></div>
			    </div>
			    <div class="swiper-pagination"></div>
		  </div>
      <div class="weui-cell">{{$t("m.country")}}</div>
      <div class="weui-cell weui-cell_select white">
				<div class="weui-cell__bd">
						<select class="weui-select" @change="initCountry($event)">
							 <option :value="index" v-for="(item,index) in countryList">{{item.englishName}}</option>
						</select>
				</div>
			</div>
			<div class="weui-cell">{{$t("m.activationCode")}}</div>
			<div class="weui-cell white">
				 <div class="weui-cell__bd">
				 	 <input class="weui-input" type="text" :placeholder="$t('m.enterActCodeTip')" v-model="activateCode" @blur="checkActivationCode">
				 </div>
			</div>
			<div class="weui-cell">{{$t("m.activationDate")}}</div>
			<div class="weui-cell white">
				 <div class="weui-cell__bd">
				 	 <input class="weui-input" type="text" v-model="pickerValue" :placeholder="$t('m.enterActDateTip')" @click="openPicker" onfocus="this.blur()" readonly="readonly">
				 </div>
			</div>
			<div class="weui-cell"></div>
			<div class="weui-cell weui-cell_vcode white">
					<div class="weui-cell__bd">
						<input class="weui-input" type="text" :placeholder="$t('m.enterVerCodeTip')" v-model="captcha">
					</div>
					<div class="weui-cell__ft">
						<img class="weui-vcode-img" id="img-captcha"  :src="'../wx/imageCaptcha'" @click="updteCaptcha()">
					</div>
			</div>
			<a class="weui-btn weui-btn_primary submit" href="javascript:void(0)" @click="submit">{{$t("m.submitTip")}}</a>
			<a class="weui-btn weui-btn_primary query" href="javascript:void(0)" @click="goQuery">{{$t("m.queryTip")}}</a>
			 <mt-datetime-picker
			  	 @confirm="onconfirm"
			 	   :cancelText="$t('m.cancel')"
			 	   :confirmText="$t('m.confirm')"
				    ref="picker"
				    type="date"
				    :startDate="startDate"
				   >
  		 </mt-datetime-picker>
  </div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'activation',
  data () {
    return {
    	 showContainer:false,
    	 countryList:[],
    	 operatorList:[],
       pickerValue:'',
       mySwiper:null,
       countryId:'',
       activateCode:'',
       actCodePass:false,
       regActCode:/^[0-9a-zA-Z]{4,}$/,
       activateDatePrompt:'',
       activateDateEarliest:null,
       startDate:new Date(),
       captcha:'',
       canSub:true,
       securityToken:''
    }
  },
  beforeMount(){
  	
  },
  mounted(){
  	  weui.loading("loading");
  	  this.getCountryList();  
  },
  updated(){
  	this.swiper();
  },
  methods:{
  	  getCountryList(){
  	  	   var that = this;
		  	   axios({
							  method: 'post',
							  url:'../wx/international',
					 })
	      	 .then(function(r){
	      	  	 if(r.data.success){
//	      	  	 	   console.log(r);
//                 that.securityToken = r.data.data.securityToken;
	      	  	 	   that.countryList = r.data.data.countryList;
	      	  	 	   that.countryId = that.countryList[0].countryId;
	      	  	 	   that.operatorList = that.countryList[0].operatorList;
	      	  	 	   setTimeout(that.swiper,0);
	      	  	 	   weui.loading("loading").hide();
	    						 that.showContainer = true;
	    						 setTimeout(that.updteCaptcha,0);
 	      	  	 }
	      	 })
  	  },
  	  swiper(){
	  	  	if(this.operatorList.length!=1){
				   	     if(this.mySwiper){
							   		this.mySwiper.destroy(false);
//							   		console.log(this.mySwiper);
							   }
						 	   this.mySwiper = new Swiper('.swiper-container', {
							      pagination: {
							        el:'.swiper-pagination',
							        clickable :true
							      },
								    loop:true,
									  autoplay: {
											 delay:1000,
											 stopOnLastSlide:false,
											 disableOnInteraction:true
									  },
									  observer:true,
						        observeParents:true
								})
						 	  var that = this;
						 	  this.mySwiper.el.onclick = function(){
  								 that.mySwiper.autoplay.stop();
			   				}
		   		}else{
		   				 if(this.mySwiper){
							   	this.mySwiper.destroy(false);
//							   	console.log(this.mySwiper);
							 }
		   		}
  	  },
  	  initCountry(event){
  	  	 var index = event.target.value;
  	  	 this.countryId = this.countryList[index].countryId;
  	  	 this.operatorList = this.countryList[index].operatorList;  	  	 
  	  	 var that = this;
  	  	 this.activateCode = '';
  	  	 this.pickerValue = '';
  	  	 this.activateDateEarliest = null;
  	  	 this.captcha = '';
  	  	 this.updteCaptcha();
  	  },
  	  repeatCheck(){
  	  		if(!this.activateCode){
  	  	   	   this.pickerValue = '';
  	  	   	   this.activateDateEarliest = null;
		  	   	   weui.alert(this.$t('m.checkActCode.canNotEmpty'),{
		  	   	   	  buttons:[{
		  	   	   	  	 label:this.$t('m.ok')
		  	   	   	  }]
		  	   	   });
  	  	   	   return false;
  	  	   }else if(!this.regActCode.test(this.activateCode)){
  	  	   	   this.pickerValue = '';
  	  	   	   this.activateDateEarliest = null;
		  	   	   weui.alert(this.$t('m.checkActCode.incorrect'),{
		  	   	   	  buttons:[{
		  	   	   	  	 label:this.$t('m.ok')
		  	   	   	  }]
		  	   	   });
  	  	   	   return false;
  	  	   }else{
  	  	   	   return true;
  	  	   }
  	  },
  	  checkActivationCode(){
  	  	   if(!this.repeatCheck()){
  	  	   	   return;
  	  	   }
  	  	   var that = this;
  	  	   weui.loading("loading");
		  	   axios({
							  method: 'post',
							  url:'../wx/checkInternational',
							  data:querystring.stringify({
							  	 countryId:that.countryId,
				  	 			 activateCode:that.activateCode
//				  	 			 securityToken:that.securityToken
				  			})
					 })
	      	 .then(function(r){
	      	 	   weui.loading("loading").hide();
	      	  	 if(r.data.success){
	      	  	 	  //激活码验证成功
	      	  	 	  that.actCodePass = true;
	      	  	 	  that.find(r.data.data.operatorId);
//	      	  	 	  that.securityToken = r.data.data.securityToken;
 	      	  	 }else{
 	      	  	 	  //激活码验证失败
 	      	  	 	  that.actCodePass = false;
 	      	  	 	  that.pickerValue = '';
 	      	  	 	  that.activateDateEarliest = null;
 	      	  	 	  if(r.data.desc.indexOf('无效')!=-1){
 	      	  	 	  	 weui.alert(that.$t('m.checkActCode.desc'),{
					  	   	   	  buttons:[{
					  	   	   	  	 label:that.$t('m.ok')
					  	   	   	  }]
		  	   	   			 });
 	      	  	 	  }
 	      	  	 }
	      	 })
  	  },
  	  find(_operatorId){
  	      for(var i=0;i<this.operatorList.length;i++){
			  	  if(_operatorId==this.operatorList[i].operatorId){
			  	  	 this.activateDatePrompt = this.operatorList[i].activateDatePrompt;
			  	  	 this.activateDateEarliest = this.operatorList[i].activateDateEarliest;
			  	  	 break;
			  	  }
		  		}
  	  },
  	  onconfirm(val){
  	  	 this.pickerValue = formatDate(val);
  	  },
	    openPicker() {
	    	  if(this.activateDateEarliest==null){
				      weui.alert(this.$t('m.checkDate'),{
		  	   	   	  buttons:[{
		  	   	   	  	 label:this.$t('m.ok')
		  	   	   	  }]
		  	   	   });
  	  	   	   return;
			    }
	    	  this.startDate = new Date(getServerDate(this.activateDateEarliest));
	        this.$refs.picker.open();
	    },
	    updteCaptcha(){
  	  	 var target = document.getElementById("img-captcha");
  	  	 target.src = '../wx/imageCaptcha?'+new Date().getTime();
  	  },
  	  submit(){
  	      this.repeatCheck();
  	      if(!this.pickerValue){
	      	  weui.alert(this.$t('m.selectDate'),{
		  	   	   	  buttons:[{
		  	   	   	  	 label:this.$t('m.ok')
		  	   	   	  }]
		  	   	   });
	  	   	   return;
  	      }
  	      if(!this.captcha){
	      	   weui.alert(this.$t('m.captcha.empty'),{
		  	   	   	  buttons:[{
		  	   	   	  	 label:this.$t('m.ok')
		  	   	   	  }]
		  	   	 });
	  	   	   return;
  	      }
  	      if(this.canSub){  	      	
  	      	this.subSend();
  	      }
  	  },
  	  subSend(){
  	  	  weui.loading("loading");
  	  	  this.canSub = false;
  	  	  var that = this;
  	  	  axios({
							  method: 'post',
							  url:'../wx/saveInternational',
							  data:querystring.stringify({
							  	 countryId:that.countryId,
				  	 			 activateCode:that.activateCode,
				  	 			 activateDate:that.pickerValue,
				  	 			 captcha:that.captcha
				  			})
					 })
	      	 .then(function(r){
	      	  	 if(r.data.success){
	      	  	      that.$router.push({ name: 'Success'});
	      	  	      weui.loading("loading").hide();
 	      	  	}else{
 	      	  				weui.loading("loading").hide();
 	      	  	 	    that.captcha = '';
  	  	            that.updteCaptcha();
  	  	            that.canSub = true;
  	  	            if(r.data.code===1){
  	  	            	  weui.alert(that.$t('m.captcha.wrong'),{
						  	   	   	  buttons:[{
						  	   	   	  	 label:that.$t('m.ok')
						  	   	   	  }]
		  	   	 						});
  	  	            }
  	  	            if(r.data.code===2){
  	  	            	  weui.alert(that.$t('m.checkActCode.desc'),{
						  	   	   	  buttons:[{
						  	   	   	  	 label:that.$t('m.ok')
						  	   	   	  }]
		  	   	 						});
  	  	            }
  	  	            if(r.data.code===3){
  	  	            	  weui.alert(that.$t('m.submitted'),{
						  	   	   	  buttons:[{
						  	   	   	  	 label:that.$t('m.ok')
						  	   	   	  }]
		  	   	 						});
  	  	            }
 	      	  	 }
	      	 })
  	  },
  	  goQuery(){
  	  	 this.$router.push({ name: 'Query'});
  	  }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	 .container{
	 	 box-sizing: border-box;
	 	 font-size:.16rem;
	 	 min-height:100%;
	 	 padding-bottom:.2rem;
	 }
	 .swiper-wrapper {
	    width:100%;
	    height:45vw;
   }
	 .swiper-slide>img{
		   width:100%;
		   height:100%;
	 }
	 .weui-cell:before {
     left: 0px;
   }
	 .white{
	 	 background:#fff;
	 }
	 .weui-btn{
	 	  width:90%;
	 	  line-height:.5rem;
	 	  font-size:.16rem;
	 }
	 .submit{
	 	  margin-top:.3rem;
	 }
   .query{
   	  margin-top:.1rem;
   }
</style>
