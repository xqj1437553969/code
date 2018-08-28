<template>
		<div class="weui-msg">
	        <div class="weui-msg__icon-area"><i class="weui-icon-success weui-icon_msg"></i></div>
	        <div class="weui-msg__text-area">
	            <p class="weui-msg__desc">The activation information has been submitted successfully</p>
	        </div>
	   </div>
</template>

<script>
export default {
  name: 'success',
  data () {
    return {
    	 cancelText:'cancel',
    	 confirmText:'confirm',
         pickerValue:''
    }
  },
  methods:{
  	  onconfirm(val){
  	  	console.log(val)
  	  },
	  openPicker() {
	    this.$refs.picker.open();
	  }
  }
}
</script>

<style scoped>
	.weui-msg {
	   padding-top:1.2rem;
	   text-align: center;
    }
</style>