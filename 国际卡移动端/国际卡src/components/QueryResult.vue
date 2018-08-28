<template>
	<div class="container" v-if="showContainer">
		<div class="weui-form-preview">
            <div class="weui-form-preview__hd">
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">{{$t("m.state")}}</label>
                    <em class="weui-form-preview__value" v-if="record.activateStatus==='已预约'" v-text="record.activateStatus==='已预约'?$t('m.reserved'):''"></em>
                    <em class="weui-form-preview__value" v-if="record.activateStatus==='激活成功'" v-text="record.activateStatus==='激活成功'?$t('m.activated'):''"></em>
                    <em class="weui-form-preview__value" v-if="record.activateStatus==='已关闭'" v-text="record.activateStatus==='已关闭'?$t('m.closed'):''"></em>
                    <em class="weui-form-preview__value" v-if="record.activateStatus==='激活失败'" v-text="record.activateStatus==='激活失败'?$t('m.failed'):''"></em>
                </div>
            </div>
            <div class="weui-form-preview__bd">
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">{{$t("m.country")}}</label>
                    <span class="weui-form-preview__value">{{record.englishName}}</span>
                </div>
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">{{$t("m.activationCode")}}</label>
                    <span class="weui-form-preview__value">{{record.activateCode}}</span>
                </div>
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">{{$t("m.activationDate")}}</label>
                    <span class="weui-form-preview__value">{{record.activateDate | formattodate}}</span>
                </div>
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
      record:'',
      activateStatus:''
    }
  },
  beforeMount(){
  	 weui.loading("loading");
  	 this.record = JSON.parse(sessionStorage.getItem("record"));
  	  weui.loading("loading").hide();
  	 this.showContainer = true;
  },
  methods:{
     
  }
}
</script>

<style scoped>
  .container{
 	 box-sizing: border-box;
 	 font-size:.17rem;
 	 min-height:100%;
 	 padding-top:.2rem;
	}
</style>