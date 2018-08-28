<template>
	<div class="problem-container">
		<div class="problem">
			<h3 class="tit">常见问题</h3>
			<ul>
				<li @click="changeCardType(0)" v-bind:class="{active:active===0}">Giffgaff卡</li>
				<li @click="changeCardType(1)" v-bind:class="{active:active===1}">T-Mobile卡</li>
			</ul>
		    <el-collapse v-if="show" v-model="activeName" accordion v-bind:style="{marginRight:'50px'}">
				  <el-collapse-item name="1">
					  	<template slot="title">
					       <h3>手机卡能打电话却不能上网？</h3>
					    </template>
					    <div>按照以下方式进行手机设置：</div>
					    <div>苹果手机：①【设置】→【蜂窝移动网络】 →【开启4G/LTE】→【打开数据漫游】 ；②点开【蜂窝移动数据网络】一栏，APN：giffgaff.com；用户名：giffgaff；
	③如果还不能上网，请还原网络设置：【设置】→【通用】→【还原】→【还原网络设置】，重启手机即可。</div>
	                    <div>安卓手机：【设置】→【无线和网络】→【移动网络设置】 →【开启数据漫游】→【接入点名称】→按手机上方或下方的“菜单”键→【新建APN】→【名称：giffgaff】→【APN：giffgaff.com】→按手机“菜单”键保存接入点，并选择该接入点。</div>
				  </el-collapse-item>
				  <el-collapse-item  name="2">
					  	<template slot="title">
					       <h3>到达英国后，无法拨打中国长途？</h3>
					    </template>
					    <div>套餐里的通话为英国通话，不包含国际通话。如果拨打套餐外的中国通话，按0.02镑/分钟计费，所以卡内要先预留一定的话费。</div>
				  </el-collapse-item>
				  <el-collapse-item name="3">
					  	<template slot="title">
					       <h3>国际长途的资费怎么算？</h3>
					    </template>
					    <div>国际通话不包含在套餐内，需通过余额扣费。如：卡内余额15磅，开通10磅套餐，剩余5磅可拨打中国（0.02磅/分钟）通话250分钟。</div>
				  </el-collapse-item>
				  <el-collapse-item name="4">
					  	<template slot="title">
					       <h3>国际漫游如何收费？</h3>
					    </template>
					    <div>去欧洲及某些特定国家旅游，giffgaff可在37个国家免漫游费。 直接像在英国一样正常使用giffgaff套餐，不用再买其他套餐。只要用量没超套餐定量，就不会额外收钱。（tips：使用前请打开手机里的漫游设置 ）</div>
				  </el-collapse-item>
				   <el-collapse-item name="5">
					  	<template slot="title">
					       <h3>在英国如何拨打电话？</h3>
					    </template>
					    <div>拨打英国当地手机：直接拨出即可；英国拨打中国手机：0086+手机号码；英国拨打中国座机：0086+区号（去首位0）+座机号码；中国拨打英国手机：0044+手机号码（去首位0）。</div>
				  </el-collapse-item>
				  <el-collapse-item name="6">
					  	<template slot="title">
					       <h3>如何查询剩余流量、话费余额及套餐使用情况？</h3>
					    </template>
					    <div>下载APP“my giffgaff”，可查询卡内余额、套餐使用情况；也可进行充值续费，更改套餐，操作方便直观。也可在Fuwii弗威公众号中进行话费充值。</div>
				  </el-collapse-item>
			</el-collapse>
			
			 <el-collapse v-else v-model="activeName2" accordion v-bind:style="{marginRight:'50px'}">
				  <el-collapse-item name="11">
					  	<template slot="title">
					       <h3>如果暂停使用，号码可以保留多久？</h3>
					    </template>
					    <div>可以停机保号3个月，每个月收取$15费用，联系客服进行操作。一年最多可保号三个月。超过90天，号码自动作废。如需继续使用该SIM卡，请联系客服，申请新号码。</div>
				  </el-collapse-item>
				  <el-collapse-item  name="12">
					  	<template slot="title">
					       <h3>在国内能否使用此卡开通国际漫游？</h3>
					    </template>
					    <div>此卡在国内无法使用。</div>
				  </el-collapse-item>
				  <el-collapse-item name="13">
					  	<template slot="title">
					       <h3>手机卡能打电话却不能上网？</h3>
					    </template>
					    <div>请检查手机支持频段，若手机支持，再按照以下方式进行设置。</div>
					    <div>苹果手机：①设置>通用>如果有描述文档，请删除。②设置>蜂窝移动网络>打开蜂窝移动数据>启用4G（3G）>打开数据漫游。③如果仍不能上网，请还原网络设置，操作：通用>设置>还原>还原网络设置。</div>
					    <div>安卓手机：①启用数据网络以及数据漫游。②设置>移动网络>接入点名称（APN）>新建APN>名称：T-MOBILE。③添加APN地址（2选1）：epc.tmobile.com（需支持联通3G上网）fast.t-mobile.com（需支持联通4G上网）。</div>
					    <div>注意：①双卡机请设置美国卡为数据主卡。②若手机频段不支持，请更换手机再试。</div>
				  </el-collapse-item>
				  <el-collapse-item name="14">
					  	<template slot="title">
					       <h3>手机不能打电话和上网？</h3>
					    </template>
					    <div>①所拔打的号码和拨打方式是否正确。②如果号码和拨打方式都正确还不能拔打，请在公众号【联系我们】→【售后客服】中联系我们解决。</div>
				  </el-collapse-item>
			</el-collapse>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Problem',
  data () {
    return {
    	active:0,
    	show:true,
        activeName: '',
        activeName2:''
    }
  },
  beforeMount(){
  	 sessionStorage.removeItem("haschoose");//删除从首页点击立即领卡按钮进入领卡页面的标识
  },
  methods:{
  	changeCardType(index){
  		this.active = index;
  		if(index===0){
  			this.show = true;
  		}else if(index===1){
  			this.show = false;
  		}
  	},
  	go(){
  		this.$router.push({ name: 'BusinessRecord'});
  	}
  }
}
</script>

<style scoped>
	.problem-container{
		width:100%;
	}
	.problem{
		width:1190px;
		height:553px;
		margin:0 auto;
		padding-top:60px;
		padding-left:110px;
	}
	.tit{
		color:#cd3785;
		margin-bottom:33px;
	}
	ul{
	   display:flex;
	   flex-wrap: wrap;
	}
	ul>li{
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
	ul>li:hover{
	    color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
	ul>li.active{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
</style>