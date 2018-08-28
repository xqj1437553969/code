<template>
  <div class="container" v-if="showContainer">
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
				 	 <input class="weui-input" type="text" :placeholder="$t('m.enterActCodeTip')" v-model="activateCode">
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
			<a class="weui-btn weui-btn_primary submit" href="javascript:void(0)" @click="submit">{{$t("m.queryConfirm")}}</a>
  </div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'query',
  data () {
    return {
    	showContainer:false,
      countryList:[],
      countryId:'',
      operatorList:[],
      activateCode:'',
      regActCode:/^[0-9a-zA-Z]{4,}$/,
      captcha:'',
      canSub:true
    }
  },
  beforeMount(){
  },
  mounted(){
  	  this.getCountryList();
  },
  methods:{
  	  getCountryList(){
  	  	   weui.loading("loading");
  	  	   var that = this;
		  	   axios({
							  method: 'post',
							  url:'../wx/international',
					 })
	      	 .then(function(r){
	      	  	 if(r.data.success){
	      	  	 	   that.countryList = r.data.data.countryList;
	      	  	 	   that.countryId = that.countryList[0].countryId;
	      	  	 	   that.operatorList = that.countryList[0].operatorList;
	      	  	 	   weui.loading("loading").hide();
	    						 that.showContainer = true;
	    						 setTimeout(that.updteCaptcha,0);
 	      	  	 }
	      	 })
  	  },
      initCountry(event){
  	  	 var index = event.target.value;
  	  	 this.countryId = this.countryList[index].countryId;
  	  	 this.operatorList = this.countryList[index].operatorList;  	  	 
  	  	 this.activateCode = '';
  	  	 this.captcha = '';
  	  	 this.updteCaptcha();
  	  },
  	  repeatCheck(){
  	  		 if(!this.activateCode){
		  	   	   weui.alert(this.$t('m.checkActCode.canNotEmpty'),{
		  	   	   	  buttons:[{
		  	   	   	  	 label:this.$t('m.ok')
		  	   	   	  }]
		  	   	   });
  	  	   	   return false;
  	  	   }else if(!this.regActCode.test(this.activateCode)){
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
  	  updteCaptcha(){
  	  	 var target = document.getElementById("img-captcha");
  	  	 target.src = '../wx/imageCaptcha?'+new Date().getTime();
  	  },
  	  submit(){
  	  	  if(!this.repeatCheck()){
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
							  url:'../wx/searchInternational',
							  data:querystring.stringify({
							  	 countryId:that.countryId,
				  	 			 activateCode:that.activateCode,
				  	 			 captcha:that.captcha
				  			})
					 })
	      	 .then(function(r){
	      	  	 if(r.data.success){
	      	  	      sessionStorage.setItem("record",JSON.stringify(r.data.data.order));
	      	  	      weui.loading("loading").hide();
	      	  	      that.$router.push({ name: 'QueryResult'});
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
 	      	  	 }
	      	 })
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
</style>
