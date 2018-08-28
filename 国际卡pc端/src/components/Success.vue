<template>
		<div class="weui-msg">
	        <div class="weui-msg__icon-area"><i class="el-icon-success"></i></div>
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
	.weui-msg{
		box-sizing: border-box;
		width: 580px;
		margin: 0 auto;
		padding: 100px 0;
		height: 780px;
		font-size: 14px;
	}
	 .weui-msg__icon-area{
	 	font-size:100px;
	 	color:#66b1ff;
	 }
	.weui-msg {
	   padding:250px 0;
	   text-align: center;
    }
    p{
       margin-top:50px;
    }
</style>