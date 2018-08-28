<template>
	<div v-loading.fullscreen.lock="loadingPage" element-loading-text="The page is loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
		<div class="container" v-if="showContainer">
			<div class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide" v-for="(item,index) in operatorList"><img :src="item.activateImgUrl"></div>
				</div>
				<div class="swiper-pagination"></div>
			</div>
			<p v-text="$t('m.country')"></p>
			<el-select v-model="value" placeholder="请选择" @change="initCountry($event)">
				<el-option v-for="(item,index) in countryList" :key="item.countryId" :label="item.englishName" :value="index">
				</el-option>
			</el-select>
			<p v-text="$t('m.activationCode')" v-loading.fullscreen.lock="loadingFlag" element-loading-text="The activation code is being validated" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"></p>
			<el-input v-model="activateCode" :placeholder="$t('m.enterActCodeTip')" @blur="checkActivationCode"></el-input>
			<p v-text="$t('m.activationDate')"></p>
			<div class="block">
				<el-date-picker :disabled="dateCanClick" v-model="pickerValue" type="date" value-format="yyyy-MM-dd" :default-value="startDate" :picker-options="pickerOptions" :placeholder="$t('m.enterActDateTip')">
				</el-date-picker>
			</div>
			<div style="margin-top:40px;">
				<el-input :placeholder="$t('m.enterVerCodeTip')" v-model="captcha">
					<template slot="append"><img id="img-captcha" :src="'../wx/imageCaptcha'" @click="updteCaptcha()" style="height:30px;" /></template>
				</el-input>
			</div>
			<div style="margin-top:40px;" v-loading.fullscreen.lock="loadingSub" element-loading-text="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
				<el-button type="primary" v-text="$t('m.submitTip')" @click="submit"></el-button>
			</div>
			<div style="margin-top:40px;">
				<el-button type="primary" v-text="$t('m.queryTip')" @click="goQuery"></el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	const querystring = require('querystring');
	export default {
		name: 'activation',
		data() {
			return {
				securityToken:'',
				loadingPage: true,//页面加载loading
				loadingFlag: false,//激活码检测请求loading
				loadingSub: false,//激活信息提交loading
				value: 0,//select下拉框默认选中
				showContainer: false,//页面container是否显示
				countryList: [],//国家列表，用于select数据循环
				operatorList: [],//运营商列表，用于图片轮播
				pickerValue: '',//选择的激活日期
				mySwiper: null,//轮播图
				countryId: '',//国家Id
				activateCode: '',//激活码
				actCodePass: false,//激活码检测是否通过
				regActCode: /^[0-9a-zA-Z]{4,}$/,//激活码格式校验
				activateDatePrompt: '',//激活日期文字提示，国际卡暂时没有用到
				activateDateEarliest: null,//预约最早可选时间的标志
				startDate: new Date(),//日期选择的初始时间
				captcha: '',//验证码
				canSub: true,//激活信息是否可以提交，防止重复提交问题
				dateCanClick: true,//激活日期是否可以选择
				pickerOptions: {//限制预约激活最早可选的时间之前的日期不可选中
					disabledDate: (time) => {
						return time.getTime() < new Date(this.startDate).getTime() - 8 * 60 * 60000;
					}
				}
			}
		},
		beforeMount(){
			if(this.IEVersion()!=-1){
				//检测到用户使用IE浏览器打开页面，弹出提示并关闭页面
        	    alert("It is detected that you are using the IE browser or the browser is using the IE compatible mode. This page does not support IE, so it is recommended that you change other browsers or switch to the extreme mode");
        		window.close();
           }           	
           
		},
		mounted() {
			this.loadingPage = true;//页面加载loading出现
			this.getCountryList();//获取国家列表
		},
		updated(){
			this.swiper();
		},
		methods: {
			IEVersion(){
				//检测用户是否使用的是IE浏览器或者浏览器内核是否是IE
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
			getCountryList() {
				//获取国家列表
				var that = this;
				axios({
						method: 'post',
						url: '../wx/international',
					})
					.then(function(r) {
						if(r.data.success) {
//							that.securityToken = r.data.data.securityToken;
							that.countryList = r.data.data.countryList;//国家列表
							that.countryId = that.countryList[0].countryId;//国家列表中第一个国家的Id
							that.operatorList = that.countryList[0].operatorList;//国家列表中第一个国家下面的运营商列表
							setTimeout(that.swiper,0);//解决swiper轮播图滑不动的问题
							that.loadingPage = false;//页面加载loading消失
							that.showContainer = true;//页面container元素显示
							setTimeout(that.updteCaptcha,0);
						}
					})
			},
			swiper() {
				if(this.operatorList.length!=1){
					//如果运营商列表的长度不等于1，则初始化swiper
					if(this.mySwiper) {
						//如果swiper存在，则销毁
						this.mySwiper.destroy(false);
					}					
					this.mySwiper = new Swiper('.swiper-container', {
						pagination: {
							el: '.swiper-pagination',
							clickable: true
						},
						loop: true,
						autoplay: {
							delay: 1000,
							stopOnLastSlide: false,
							disableOnInteraction: true
						},
						observer: true,
						observeParents: true
					})
					var that = this;
				    this.mySwiper.el.onclick = function(){
  					    that.mySwiper.autoplay.stop();
			   		}
				}else{
					if(this.mySwiper) {
						this.mySwiper.destroy(false);
					}	
				}
			},
			initCountry(event) {
				var index = event;
				var that = this;
				this.countryId = this.countryList[index].countryId;
				this.operatorList = this.countryList[index].operatorList;
				this.activateCode = '';
				this.pickerValue = '';
				this.activateDateEarliest = null;
				this.dateCanClick = true;
				this.captcha = '';
				this.updteCaptcha();
			},
			repeatCheck() {
				if(!this.activateCode) {
					this.pickerValue = '';
					this.activateDateEarliest = null;
					this.$message({
						message: this.$t('m.checkActCode.canNotEmpty'),
						type: 'error',
						duration: 1500,
						center: true
					});
					return false;
				}else if(!this.regActCode.test(this.activateCode)) {
					this.pickerValue = '';
					this.activateDateEarliest = null;
					this.$message({
						message: this.$t('m.checkActCode.incorrect'),
						type: 'error',
						duration: 1500,
						center: true
					});
					return false;
				} else {
					return true;
				}
			},
			checkActivationCode() {
				if(!this.repeatCheck()) {
					return;
				}
				this.pickerValue = '';
				this.activateDateEarliest = null;
				this.dateCanClick = true;
				this.loadingFlag = true;
				var that = this;
				axios({
						method: 'post',
						url: '../wx/checkInternational',
						data: querystring.stringify({
							countryId: that.countryId,
							activateCode: that.activateCode
//							securityToken:that.securityToken
						})
					})
					.then(function(r) {
						that.loadingFlag = false;
						if(r.data.success) {
							//激活码验证成功
//						    that.securityToken = r.data.data.securityToken;
							that.actCodePass = true;
							that.find(r.data.data.operatorId);
							that.startDate = getServerDate(that.activateDateEarliest);
							that.dateCanClick = false;
						} else {
							//激活码验证失败
							that.actCodePass = false;
							that.pickerValue = '';
							that.activateDateEarliest = null;
							that.dateCanClick = true;
							if(r.data.desc.indexOf('无效') != -1) {
								that.$message({
									message: that.$t('m.checkActCode.desc'),
									type: 'error',
									duration: 1500,
									center: true
								});
							}
						}
					})
			},
			find(_operatorId) {
				for(var i = 0; i < this.operatorList.length; i++) {
					if(_operatorId == this.operatorList[i].operatorId) {
						this.activateDatePrompt = this.operatorList[i].activateDatePrompt;
						this.activateDateEarliest = this.operatorList[i].activateDateEarliest;
						break;
					}
				}
			},
			updteCaptcha() {
				var target = document.getElementById("img-captcha");
				target.src = '../wx/imageCaptcha?' + new Date().getTime();
			},
			focus() {
                this.pickerValue = '';
				this.activateDateEarliest = null;
				this.dateCanClick = true;
			},
			submit() {
				if(!this.repeatCheck()) {
					return;
				}
				if(!this.pickerValue) {
					this.$message({
						message: this.$t('m.selectDate'),
						type: 'error',
						duration: 1500,
						center: true
					});
					return;
				}
				if(!this.captcha) {
					this.$message({
						message: this.$t('m.captcha.empty'),
						type: 'error',
						duration: 1500,
						center: true
					});
					return;
				}
				if(this.canSub) {
					this.subSend();
				}
			},
			subSend() {
				this.loadingSub = true;
				this.canSub = false;
				var that = this;
				axios({
						method: 'post',
						url: '../wx/saveInternational',
						data: querystring.stringify({
							countryId: that.countryId,
							activateCode: that.activateCode,
							activateDate: that.pickerValue,
							captcha: that.captcha
						})
					})
					.then(function(r) {
						if(r.data.success) {
							that.$router.push({
								name: 'Success'
							});
							that.loadingSub = false;
						} else {
							that.loadingSub = false;
							that.captcha = '';
							that.updteCaptcha();
							that.canSub = true;
							if(r.data.code === 1) {
								that.$message({
									message: that.$t('m.captcha.wrong'),
									type: 'error',
									duration: 1500,
									center: true
								});
							}
							if(r.data.code === 2) {
								that.$message({
									message: that.$t('m.checkActCode.desc'),
									type: 'error',
									duration: 1500,
									center: true
								});
							}
							if(r.data.code === 3) {
								that.$message({
									message: that.$t('m.submitted'),
									type: 'error',
									duration: 1500,
									center: true
								});
							}
						}
					})
			},
			goQuery() {
				this.$router.push({
					name: 'Query'
				});
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.container {
		box-sizing: border-box;
		width: 580px;
		margin: 0 auto;
		padding: 100px 0;
		height: 780px;
		font-size: 14px;
	}
	
	.swiper-slide>img {
		width: 100%;
		height: 220px;
	}
	
	p {
		padding: 15px 0;
	}
	
	.el-select {
		width: 100%;
	}
	
	.el-date-editor {
		width: 100%;
	}
	
	.el-button {
		width: 100%;
	}
	
	#img-captcha {
		display: block;
		height: 38px!important;
	}
</style>