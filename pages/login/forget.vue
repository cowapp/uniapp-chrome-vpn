<template>
	<view class="forget">
		<image class="bg" src="@/static/bg.png"></image>
		<back backtext=""></back>
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>
			<!-- 主体 -->
			<view class="main">
				<view class="tips">{{ i18n.getMessage('fogort_desc') }}</view>
				<wInput
					v-model="phoneData"
					type="text"
					maxlength="32"
					:placeholder="i18n.getMessage('email')"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					maxlength="32"
					:placeholder="i18n.getMessage('passwd')"
					isShowPass
				></wInput>
				
				<wInput
					v-model="verCode"
					type="number"
					maxlength="6"
					:placeholder="i18n.getMessage('verify_code')"
					
					isShowCode
					:codeText="i18n.getMessage('get_code')"
					setTime="30"
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
			</view>
			
			<wButton 
				class="wbutton"
				:text="i18n.getMessage('rest_passwd')"
				:rotate="isRotate" 
				@click.native="startRePass()"
			></wButton>

		</view>
	</view>
</template>

<script>
	let _this;
	import {hex_md5} from "@/static/encrypt.js"
	import * as comm from "@/static/request.js"
	import back from '../../components/back/back.vue'
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	export default {
		data() {
			return {
        i18n: chrome.i18n,
				logoImage: comm.logo,
				phoneData: "", //电话
				passData: "", //密码
				verCode:"", //验证码
				isRotate: false, //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton
		},
		mounted() {
			_this= this;
		},
		methods: {
			getVerCode(){
				//获取验证码
				if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/gi.test(this.phoneData)) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: _this.i18n.getMessage('err_email')
					});
					return false;
				}
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
				uni.showLoading({
					title: _this.i18n.getMessage('code_sending')
				});
				comm.sendSignReqest("/user/captcha/send", comm.Post, {
					"email": this.phoneData
				}, function(data) {
					if (data.code != 0) {
						uni.showToast({
							title: data.error,
							position: 'bottom',
							icon: "error",
						})
					} else {
						uni.showToast({
							title: _this.i18n.getMessage('code_sent'),
							position: 'bottom',
						})
						uni.hideLoading();
					}
				});
			},
			startRePass() {
				//重置密码
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/gi.test(this.phoneData)) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: _this.i18n.getMessage('err_email')
					});
					return false;
				}
				if (this.verCode.length != 5) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: _this.i18n.getMessage('err_code')
					});
					return false;
				}
				if (this.passData.length < 6) {
					uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: _this.i18n.getMessage('err_passwd')
						});
						return false;
				}
				_this.isRotate=true
				setTimeout(function(){
					_this.isRotate=false
				},3000)
				comm.sendSignReqest("/user/reset/pwd", comm.Post, {
					"email": this.phoneData,
					"passwd": hex_md5(this.passData),
					"captcha": this.verCode,
				}, function(data) {
					if (data.code != 0) {
						uni.showToast({
							title: data.error,
							position: 'bottom',
							icon: "error",
						})
					} else {
						uni.showToast({
							title: _this.i18n.getMessage('rest_passwd_ok'),
							position: 'bottom',
						})
						
						setTimeout(function(){
							uni.navigateBack();
						},1000)
					}
				});
			}
		}
	}
</script>

<style>
	@import url("@/components/watch-login/css/icon.css");
	@import url("@/pages/login/css/main.css");
</style>

