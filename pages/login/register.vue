<template>
	<view class="register">
		<image class="bg" src="@/static/bg.png"></image>
		<back backtext=""></back>
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput v-model="phoneData" type="text" maxlength="32" :placeholder="i18n.getMessage('email')"></wInput>
				<wInput v-model="passData" type="password" maxlength="32" :placeholder="i18n.getMessage('passwd')" isShowPass></wInput>
				<wInput v-model="inviter" type="text" maxlength="32" :placeholder="i18n.getMessage('inviter')"></wInput>
				<wInput v-model="verCode" type="number" maxlength="6" :placeholder="i18n.getMessage('verify_code')" isShowCode ref="runCode"
					@setCode="getVerCode()"></wInput>

			</view>

			<wButton class="wbutton" :text="i18n.getMessage('register')" :rotate="isRotate" @click.native="startReg()"></wButton>

			<!-- 底部信息 -->
			<view class="footer">
				<text @tap="isShowAgree" class="cuIcon" :class="showAgree?'cuIcon-radiobox':'cuIcon-round'"> {{ i18n.getMessage('agree') }}</text>
				<!-- 协议地址 -->
				<navigator url="{{agreements}}" open-type="navigate">{{ i18n.getMessage('agreement') }}</navigator>
			</view>
		</view>
	</view>
</template>

<script>
  let _this;
  import {agreementUrl} from "../../static/request";
	import {hex_md5} from "@/static/encrypt.js"
	import * as comm from "@/static/request.js"
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button

	export default {
		data() {
			return {
        i18n: chrome.i18n,
				//logo图片 base64
				logoImage: comm.logo,
				phoneData: '', // 用户/电话
				passData: '', //密码
				inviter: '', // 邀请人
				verCode: "", //验证码
				showAgree: true, //协议是否选择
				isRotate: false, //是否加载旋转
        agreements: agreementUrl,
			}
		},
		components: {
			wInput,
			wButton,
		},
		mounted() {
			_this = this;
		},
		methods: {
			isShowAgree() {
				//是否选择协议
				_this.showAgree = !_this.showAgree;
			},
			getVerCode() {
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
			startReg() {
				//注册
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.showAgree == false) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: _this.i18n.getMessage('regist_before') + _this.i18n.getMessage('agreement')
					});
					return false;
				}
				if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/gi.test(this.phoneData)) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: _this.i18n.getMessage('err_email'),
					});
					return false;
				}
				if (this.inviter !== '' && (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/gi.test(this.inviter))) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: _this.i18n.getMessage('err_email')
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
				if (this.verCode.length != 5) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: _this.i18n.getMessage('err_code')
					});
					return false;
				}
				_this.isRotate = true
				setTimeout(function() {
					_this.isRotate = false
				}, 3000)
				comm.sendSignReqest("/user/login/email", comm.Post, {
					"email": this.phoneData,
					"passwd": hex_md5(this.passData),
					"register": true,
					"inviter": this.inviter,
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
							title: _this.i18n.getMessage('register_ok'),
							position: 'bottom',
						})
						console.log("get token:", data.data);
						comm.setToken(data.data);
						uni.setStorageSync("token", data.data);
						// 		uni.reLaunch({
						// 			url: '../../../pages/index',
						// 		});
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
