<template>
   <div class="main-container">
   	    <div class="container">
   	    	<ul class="mobile-type-lists">
   	    		<li><span>电话卡</span></li>
		    	<li  v-bind:class="['type',{active:pactive===index}]" @click="changePackageList(item.operatorId,index)" v-for="(item,index) in operatorList"><span class="left">{{item.operatorName}}</span><span class="right">></span></li>
   	    	</ul>
	        <ul v-bind:class="['package-lists',{'justify':isOne}]" v-loading="loading"  element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
	            <li class="package-item" v-for="(item,index) in packageList" :style="{width:width+'%'}">
	            	<div class="package-price">{{item.packageName | pricefilter}}</div>
	            	<div class="package-desc">
	            		<p class="bold">{{item.packageName | namefilter}}</p>
	            		<p v-html="item.packageDesc"></p>
	            	</div>
	            	<el-button type="primary" @click="go">立即领卡</el-button>
	            </li>
	        </ul>
   	    </div>
   	   
   </div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'Main',
  data () {
    return {
      pactive:0,//选中电话卡类型增加背景色的标识
      isOne:false,//套餐列表中是否只有一种套餐，false表示不是
      width:15,//套餐容器宽度15%
      operatorList:null,//运营商列表
      loading:true,//套餐列表展示区域的loading
      packageList:null,//套餐列表
      type:null//代理商Id标识，从url中获取
    }
  },
  beforeMount(){
        if(this.IEVersion()!=-1){
        	alert("检测到您使用的是IE浏览器或者浏览器使用的是兼容IE模式,该网页不支持IE,建议您更换其他浏览器或者切换为极速模式");
        	window.close();
        }
        sessionStorage.removeItem("haschoose");//删除从首页点击立即领卡按钮进入领卡页面的标识
        this.type = this.getQueryString("type");
        if(this.type){
        	sessionStorage.setItem("type",this.type);
        }
        this.getData();
  },
  methods:{
  	 IEVersion(){
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) {
                    return 7;
                } else if(fIEVersion == 8) {
                    return 8;
                } else if(fIEVersion == 9) {
                    return 9;
                } else if(fIEVersion == 10) {
                    return 10;
                } else {
                    return 6;//IE版本<=7
                }   
            } else if(isEdge) {
                return 'edge';//edge
            } else if(isIE11) {
                return 11; //IE11  
            }else{
                return -1;//不是ie浏览器
            }
     },
  	 getQueryString(str) {
		var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	 },
	 getData(){
	 	  //获取运营商列表数据
	 	  var that = this;
	  	  axios({
			  method: 'post',
			  url:that.baseUrl+'/center/cardOperator',
			  data:querystring.stringify({
			  	  orderSource:1
			  })
		  })
	  	  .then(function(r) {
	  		  that.putData(r) 
		  })
	  	  .catch(function (error) {
              that.$message({
		          message:"请求失败",
		          type: 'error',
		          duration:1500,
		          center:true
	          });
		  });
	 },
	putData(r){
		    //处理运营商列表数据
	 	    this.operatorList = r.data.data.operatorList;//运营商列表
	 	    sessionStorage.setItem("operatorList",JSON.stringify(r.data.data.operatorList));//存储运营商列表数据
		    sessionStorage.setItem("operatorId", this.operatorList[0].operatorId);//存储运营商列表中第一个运营商的Id
		    this.packageList = this.operatorList[0].packageList;//默认显示运营商列表中第一个运营商的套餐列表
		    if(this.packageList.length==1){
		    	this.isOne = true;//套餐列表只有一个
		    }else{
		    	this.isOne = false;//套餐列表不是一个
		    }
		    this.width =  (1/this.packageList.length-0.05)*100;//设置每一种套餐容器的宽度
		    this.loading = false;
		    
	},
	changePackageList(_operatorId,_index){
		//点击选择电话卡类型显示不同的套餐
		this.pactive = _index;
//		console.log(_operatorId);
		for(var i=0;i<this.operatorList.length;i++){
			if(_operatorId==this.operatorList[i].operatorId){
				 this.packageList=this.operatorList[i].packageList;//套餐列表
				 if(this.packageList.length==1){
		    		this.isOne = true;//套餐列表只有一个
				 }else{
				    this.isOne = false;//套餐列表不是一个
				 }
				 this.width =  (1/this.packageList.length-0.05)*100;//设置每一个套餐容器的宽度
				 sessionStorage.setItem("operatorId", this.operatorList[i].operatorId);//存储选中的电话卡的运营商Id
				 break;
			}
		}
	},
	go(){
		sessionStorage.setItem("haschoose",true);//从首页点击立即领卡按钮进入领卡页面的标识
		this.$router.push({ name: 'Free'});//去往免费领卡页面
	}
  }
}
</script>

<style scoped>
	.main-container{
	    width:100%;
	}
	.container{
		box-sizing:border-box;
		width:1190px;
		min-height:614px;
		margin:0 auto;
		padding-top:45px;
		display:flex;
	}
	.mobile-type-lists{
		flex:1;
	}
	.mobile-type-lists>li:first-child>span{
		font-size:18px;
		font-weight:bold;
		border-bottom: 1px solid #000;
    	padding: 11px 0;
	}
	.mobile-type-lists>li{
		line-height:40px;
		padding:0 46px;
		cursor:pointer;
	}
	.mobile-type-lists>li:first-child{
		line-height:45px;
		padding:0 46px;
		margin-bottom:20px;
		cursor: default;
	}
	.type{
		display:flex;
		justify-content:space-between;
		align-items:center;
	}
	.package-lists{
		box-sizing:border-box;
		flex:5;
		display:flex;
		flex-wrap:wrap;
	    align-items:center;
	}
	.justify{
		justify-content:space-around;
	}
	.package-item{
		max-width:30%;
		min-width:15%;
		margin-bottom:45px;
		margin-right:5%;
	}
	.package-price{
		line-height:146px;
		text-align:center;
		font-size:46px;
		font-weight:600;
		color:#ca1d7b;
		border:1px solid #aaa;
	}
	
	.package-desc{
		box-sizing:border-box;
		width:100%;
		text-align:center;
		line-height:50px;
		border:1px solid #aaa;
		border-top:none;
	}
	.bold{
		font-weight:bold;
	}
	button{
		width:100%;
		margin-top:30px;
		font-size:16px;
	}
	.active{
		color:#ca1d7b;
	}
</style>