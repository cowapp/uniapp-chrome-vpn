<template>
	<view class="login">
		<image class="bg" src="@/static/bg.png"/>
		<back backtext=""></back>
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>
			<!-- 普通弹窗 -->
			<uni-popup ref="popup" background-color="#fff" @change="change">
				<view class="content_list">
					<scroll-view scroll-y="true" class="scroll_view_style">
						<uni-section v-for="(item, index) in servers" :title="i18n.getMessage('private_server')" type="line">
							<uni-card :title="item.name" :sub-title="item.max" :extra="i18n.getMessage('sale_tag') + item.price + i18n.getMessage('score')"
								:thumbnail="item.icon">
								<text class="uni-body">{{item.des}}</text>
								<button :disabled="item.got" type="primary" size="mini"
									@click="buyNode(item)">{{item.got ? i18n.getMessage('bounght'):i18n.getMessage('exchange')}}</button>
							</uni-card>
						</uni-section>
					</scroll-view>
				</view>
			</uni-popup> <!-- 积分弹窗 -->
			<uni-popup ref="popup_score" background-color="#fff" @change="change">
				<view class="content_list">

					<scroll-view scroll-y="true" class="scroll_view_style">
						<uni-section :title="i18n.getMessage('plans')" type="line">
							<uni-card title="VIP 30" :sub-title="i18n.getMessage('sale_desc') + '30' + i18n.getMessage('day')" :extra="'CNY' + i18n.getMessage('sale_tag') + 15 + i18n.getMessage('yuan')"
								:thumbnail="scoreIcon">
								<text class="uni-body">{{scoreDesc}}</text>
								<view class="paym">
									<button type="primary" size="mini" @click="buyScore('30')">{{buyTag}}</button>
                  <button type="primary" size="mini" @click="buyScore('30',true)">TRC20-USDT</button>
								</view>
							</uni-card>
							<uni-card title="VIP 100" :sub-title="i18n.getMessage('sale_desc') + '100' + i18n.getMessage('day')" :extra="'CNY' + i18n.getMessage('sale_tag') + 45 + i18n.getMessage('yuan')"
								:thumbnail="scoreIcon">
								<text class="uni-body">{{scoreDesc}}</text>
								<view  class="paym">
									<button type="primary" size="mini" @click="buyScore('100')">{{buyTag}}</button>
                  <button type="primary" size="mini" @click="buyScore('100',true)">TRC20-USDT</button>
								</view>
							</uni-card>
							<uni-card title="VIP 300" :sub-title="i18n.getMessage('sale_desc') + '300' + i18n.getMessage('day')" :extra="'CNY' + i18n.getMessage('sale_tag') + 115 + i18n.getMessage('yuan')"
								:thumbnail="scoreIcon">
								<text class="uni-body">{{scoreDesc}}</text>
								<view  class="paym">
									<button type="primary" size="mini" @click="buyScore('300')">{{buyTag}}</button>
                  <button type="primary" size="mini" @click="buyScore('300',true)">TRC20-USDT</button>
								</view>
							</uni-card>
						<uni-section/>	
					</scroll-view>
				</view>
			</uni-popup>
		</view>
		<!-- 主体表单 -->
		<view class="main">
			<view class="bordersd">
				<uni-section title="" :subTitle="user_info" type="line" style="margin-bottom: 3px;cursor: pointer;"
					@click="openPay('bottom')">
					<view class="box-bg" style="cursor: pointer;" @click="openPay('bottom')">
						<uni-nav-bar shadow rightIcon="right" :title="left" @clickRight="openPay('bottom')" />
					</view>
				</uni-section>
				<view  style="cursor: pointer;" @click="toggle('bottom')">
					<uni-nav-bar shadow rightIcon="right" :title="i18n.getMessage('node_market')" @clickRight="toggle('bottom')"
						@clickLeft="toggle('bottom')" @clickTitle="toggle('bottom')"/>
				</view>
				<view  style="cursor: pointer;" @click="editDomains">
					<uni-nav-bar shadow rightIcon="right" :title="i18n.getMessage('self_domains')" @clickRight="editDomains"
						@clickLeft="editDomains" @clickTitle="editDomains"/>
				</view>
				<view style="background-color: white;">
					<uni-collapse-item :title="i18n.getMessage('reward')" titleBorder="false" :thumb="scoreIcon">
						<view class="content" @click="openReward">
							<text class="text pointer" style="padding: 5px;text-decoration: underline;" @click="openReward">{{reward}}</text>
						</view>
					</uni-collapse-item>
				</view>
			</view>
		</view>
		<wButton class="wbutton" :text="i18n.getMessage('sign_out')" :rotate="isRotate" @click="exit"></wButton>
		<view class="footer">
			<navigator url="forget" open-type="navigate"> </navigator>
		</view>
	</view>
</template>

<script>
	let _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import * as comm from "@/static/request.js"
	import * as proxy from "@/static/proxy.js"
	export default {
		data() {
			return {
        i18n: chrome.i18n,
				//logo图片 base64
				logoImage: comm.logo,
				scoreIcon: 'data:image/png;base64,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',
				user_info: '会员用户', //用户/电话
        username:"",
				reward: '暂未开启', //密码
        rewardUrl: "https://yourdomai.com",
				left: '服务时长 | 0天',
				isRotate: false, //是否加载旋转
				isFocus: true, // 是否聚焦
				version: "1.0.0",
				servers: [],
        scoreDesc: chrome.i18n.getMessage("buy_tips"),
        buyTag: chrome.i18n.getMessage("buy"),
				param:{},
			};
		},
		components: {
			wInput,
			wButton,
		},
		onLoad(option) {
			this.param = option;
		},
		mounted() {
			_this = this;
			//this.isLogin();
			let token = uni.getStorageSync("token");
			if (!token) {
				uni.reLaunch({
					url: '../login/login',
				});
			} else {
				let result = getApp().resp;
				_this.reward = result.info.reward;
				_this.username = result.user.user_uid;
				if(result.info.rewardUrl) {
				  _this.rewardUrl = result.info.rewardUrl;
				}
				if(result.user.paid) {
				  _this.user_info = _this.i18n.getMessage("vip_member") + "：" + result.user.user_uid + ' | ' + _this.i18n.getMessage("score") +'：' + result.user.balance;
				  _this.left = result.info.left;
				}else {
				  _this.user_info = _this.i18n.getMessage("free_user") + "：" + result.user.user_uid;
				  _this.left = _this.i18n.getMessage("plans");
				}
				_this.servers = result.private;
			}
			setTimeout(()=>{
				if(_this.param.to === "store") {
					_this.toggle('bottom');
				}
			},500)
		},
		methods: {
			isLogin() {},
			buyScore(score,coin) {
				uni.showModal({
					title: _this.i18n.getMessage("buy") + score + _this.i18n.getMessage("plans"),
					content: _this.i18n.getMessage("buy_tips"),
					success: function(res) {
						if (res.confirm) {
							comm.sendSignReqest("/user/buy/score", comm.Post, {
								score: score,
								coin: coin,
							}, function(data) {
								if (data.code != 0) {
									uni.showModal({
										title: _this.i18n.getMessage("tips"),
										content: data.error,
										confirmText: _this.i18n.getMessage("got_it"),
										showCancel: true,
									})
								} else {
									if (data.data) {
										chrome.tabs.create({
											url: data.data
										})
									} else {
										uni.showToast({
											title: _this.i18n.getMessage("sys_busy"),
											position: 'bottom',
											icon: "none",
										})
									}
								}
							});
						}
					}
				});
			},
      openReward() {
        _this.gotoPage(_this.rewardUrl);
      },
			buyNode(item) {
				comm.sendSignReqest("/user/buy/node", comm.Post, item, function(data) {
					if (data.code != 0) {
						if (data.code == 2) {
							chrome.runtime.reload()
							return
						}
						if (data.code == 3) {
							uni.showModal({
								title: _this.i18n.getMessage("balance_not_enough"),
								content: data.error,
								success: function(res) {
									if (res.confirm) {
										if (data.data.includes("http")) {
											_this.gotoPage(data.data);
										}
									} else if (res.cancel) {
										//console.log('用户点击取消');
									}
								}
							});
							return
						}
						uni.showToast({
							title: data.error,
							position: 'bottom',
							icon: "error",
						})
					} else {
						uni.showToast({
							title: _this.i18n.getMessage("exchange_ok"),
							position: 'bottom',
							icon: "none",
						})
						chrome.runtime.sendMessage({
							type: 0,
							data: undefined
						});
						getApp().resp = undefined;
						uni.reLaunch({
							url: '../login/login'
						});
					}
				});
			},
			toggle(type) {
				this.type = type
				this.$refs.popup.open(type)
			},
			editDomains() {
				uni.navigateTo({
				    url: '../domain/domain'
				})
			},
			openPay(type) {
				this.type = type
				this.$refs.popup_score.open(type)
			},
			exit(e) {
				_this.isRotate = true;
				uni.removeStorageSync("token");
				uni.removeStorageSync("pwd");
				chrome.runtime.sendMessage({});
				getApp().resp = undefined;
				proxy.off();
				chrome.runtime.sendMessage({
					type: 0,
					data: undefined
				});
				setTimeout(function() {
					_this.isRotate = false
          chrome.runtime.reload()
				}, 1000)
			},
			gotoPage(c) {
				chrome.tabs.query({
					active: true,
					currentWindow: true
				}, function(tabs) {
					chrome.tabs.create({
						url: c,
						index: tabs[0].id
					})
				});
			},
		}
	}
</script>

<style>
	@import url("@/components/watch-login/css/icon.css");
	@import url("@/pages/login/css/main.css");

	.version {
		text-align: center;
		left: 0;
		right: 0;
		position: fixed;
		bottom: 15rpx;
		font-weight: 200;
		color: grey;
		display: inline-block;
	}
  .paym {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pointer {
    cursor: pointer;
  }

	.content_list {
		height: 760rpx;
		overflow-x: hidden;

		.scroll_view_style {
			height: 100%;
		}
	}
</style>
