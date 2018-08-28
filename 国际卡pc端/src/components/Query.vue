<template>
	<div v-loading.fullscreen.lock="loadingPage" element-loading-text="The page is loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
		<div class="container" v-if="showContainer">
			<p v-text="$t('m.country')"></p>
			<el-select v-model="value" placeholder="请选择" @change="initCountry($event)">
				<el-option v-for="(item,index) in countryList" :key="item.countryId" :label="item.englishName" :value="index">
				</el-option>
			</el-select>
			<p v-text="$t('m.activationCode')"></p>
			<el-input v-model="activateCode" :placeholder="$t('m.enterActCodeTip')" @blur="checkActivationCode"></el-input>
			<div style="margin-top:40px;">
				<el-input :placeholder="$t('m.enterVerCodeTip')" v-model="captcha">
					<template slot="append"><img id="img-captcha" :src="'../wx/imageCaptcha'" @click="updteCaptcha()" style="height:30px;" /></template>
				</el-input>
			</div>
			<div style="margin-top:40px;" v-loading.fullscreen.lock="loadingSub" element-loading-text="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
				<el-button type="primary" v-text="$t('m.queryConfirm')" @click="submit"></el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	const querystring = require('querystring');
	export default {
		name: 'query',
		data() {
			return {
				showContainer: false,
				loadingPage: true,
				loadingSub: false,
				value: 0,
				countryList: [],
				countryId: '',
				operatorList: [],
				activateCode: '',
				regActCode: /^[0-9a-zA-Z]{4,}$/,
				captcha: '',
				canSub: true
			}
		},
		beforeMount(){
        },
		mounted() {
			this.getCountryList();
		},
		methods: {
			getCountryList() {
				this.loadingPage = true;
				var that = this;
				axios({
						method: 'post',
						url: '../wx/international',
					})
					.then(function(r) {
						if(r.data.success) {
							that.countryList = r.data.data.countryList;
							that.countryId = that.countryList[0].countryId;
							that.operatorList = that.countryList[0].operatorList;
							that.loadingPage = false;
							that.showContainer = true;
							setTimeout(that.updteCaptcha,0);
						}
					})
			},
			initCountry(event) {
				var index = event;
				this.countryId = this.countryList[index].countryId;
				this.operatorList = this.countryList[index].operatorList;
				this.activateCode = '';
				this.captcha = '';
				this.updteCaptcha();
			},
			repeatCheck() {
				if(!this.activateCode) {
					this.$message({
						message: this.$t('m.checkActCode.canNotEmpty'),
						type: 'error',
						duration: 1500,
						center: true
					})
					return false;
				}else if(!this.regActCode.test(this.activateCode)) {
					this.$message({
						message: this.$t('m.checkActCode.incorrect'),
						type: 'error',
						duration: 1500,
						center: true
					})
					return false;
				}else{
					return true;
				}
			},
			updteCaptcha() {
				var target = document.getElementById("img-captcha");
				target.src = '../wx/imageCaptcha?' + new Date().getTime();
			},
			submit() {
				if(!this.repeatCheck()){
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
			subSend(){
				this.loadingSub = true;
				this.canSub = false;
				var that = this;
				axios({
						method: 'post',
						url: '../wx/searchInternational',
						data: querystring.stringify({
							countryId: that.countryId,
							activateCode: that.activateCode,
							captcha: that.captcha
						})
					})
					.then(function(r) {
						if(r.data.success) {
							sessionStorage.setItem("record", JSON.stringify(r.data.data.order));
							that.loadingSub = false;
							that.$router.push({
								name: 'QueryResult'
							});
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
						}
					})
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
		padding: 250px 0;
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