<template>
	<view class="login" v-if="show">
		<image class="bg" src="@/static/bg.png"></image>
		<view>
			<image @click="openMenu" class="menu"
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADsQAAA7EB9YPtSQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAH2SURBVHic7dw9bhNBGMfhHyBCAULiBlBD4BDAETgBXAjxIQo4B1L4OAMFUCM4AtARhcJN4qyjJGA7zjyP9DbvWtasZrRe72j/BQAAAAAAAACcNxeO8Znt6kl1v7pZXV3mgPhnv6tv1fvqdfX5tF90pXpZ7VZ7aiPrT/W82uqErlQfz8AJqP9TH1qwCC5NNZutmkcLjrF5blU3qrfzB6buAbarT9XFJQ+K1dqt7lVf9jenJvnJgj6b7VL1eL45NdEPlj8W1uThfGPqJ+BndW35Y2ENflbX9zemrgB7qxkLa3BobqcWwI8VDIT1+D7fmFoA71YwENZjZ74xdQ9wp9nfwEXPCNhMu9Xd6uv+5tQV4HP1ahUjYqVeNDf5R9lqtpmw7keY6v/Uu+pyJ7RVPWu2obDuE1Cnqz/V046Y/ONsB99u9gTpYbPtYM8IzrZfzbaDd6o3neCyDwAAAAAAAAAAAAAAbBY5geePnEB14NUwOYFKTuDo5AQiJ3B0cgKREzg6OYGDOzS3cgLHIidwcHICByYncHByAgcuOYGDlpzAAckJBAAAAAAAAAAAAACAQcgJPH/kBKoDr4bJCVRyAkcnJxA5gaOTE4icwNHJCRzcobmVEzgWOYGDkxM4MDmBg5MTOHDJCRy05AQOSE4gAAAAAAAAAAzuLz9Frw2roRu+AAAAAElFTkSuQmCC"
				alt="个人菜单" />
		</view>
		<view>
			<image @click="refresh" class="refresh"
				src="data:image/png;base64,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"
				alt="刷新" />
		</view>
		<view class="content">
			<!-- 头部logo -->
			<view>
				<!-- 普通弹窗 -->
				<uni-popup ref="popup" background-color="#fff" @change="change">
					<view class="content_list">
						<!-- <scroll-view scroll-y="true" class="scroll_view_style">
						</scroll-view> -->
						<uni-list>
							<uni-list-item :border="false" v-for="(item, index) in itemList" :key="index"
								:title="item.name" :rightText="item.ping" :thumb="item.icon"
								@click="selectItem(item,true)" link showArrow :note="item.note">
							</uni-list-item>
						</uni-list>
					</view>
				</uni-popup>
			</view>
			<view class="header">
				<image @click="openMenu" :src="logoImage" class="yylogo"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<view class="bordersd">
					<uni-list>
						<uni-list-item :title="current" note="" showArrow :thumb="current_icon" thumb-size="base"
							:rightText="current_ping" @click="toggle('bottom')" link />
					</uni-list>
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-pd">
							<view class="uni-list-cell-db">{{domain}}</view>
							<uni-tag :text="domainDesc" :type="tagTap" customStyle="margin-right:5%" @click="toDomains" />
							<switch :checked="!addDomain" @change="onTapDomain" :disabled="!domainSwitchEnable" />
						</view>
						<view class="uni-list-cell uni-list-cell-pd">
							<view class="uni-list-cell-db">{{ i18n.getMessage('smart_mode') }}</view>
							<uni-tag :text="i18n.getMessage('self_domains')" type="success" customStyle="margin-right:5%" @click="toDomains" />
							<switch :checked="smart" @change="smartChange" />
						</view>
						<view class="uni-list-cell uni-list-cell-pd">
							<view class="uni-list-cell-db">{{ i18n.getMessage('global_mode') }}</view>
							<uni-tag :text="i18n.getMessage('all_domains')" type="warning" customStyle="margin-right:5%" />
							<switch :checked="global" @change="globalChange" />
						</view>
					</view>
				</view>
			</view>
			<view class="dl">
				<image class="down_image" :src="androidDl" alt="下载Android版本" @click="dlClient(`android`)"></image>
				<image class="down_image" :src="windowsDl" alt="下载Windows版本" @click="dlClient(`windows`)"></image>
				<image class="down_image" :src="crxDl" alt="下载ChromeCrx版本" @click="dlClient(`crx`)"></image>
			</view>
			<!-- 底部信息 -->
			<view class="version">
				<view class="footer">
					<navigator open-type="navigate" @click="service">{{ i18n.getMessage('service_email') }}</navigator>
					<text>|</text>
					<navigator open-type="navigate" @click="gotoPage('https://t.me/cow_vpn_proxy_free')">{{ i18n.getMessage('chat_group') }}
					</navigator>
					<text>|</text>
					<navigator open-type="navigate" @click="gotoPage('https://twitter.com/cowproxy1')">{{ i18n.getMessage('blog') }}</navigator>
					<text>|</text>
					<navigator open-type="navigate">v4.3</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import * as comm from "@/static/request.js"
	import * as proxy from "@/static/proxy.js"
	import {
		baseHost
	} from "@/static/encrypt.js"
	export default {
		data() {
			return {
        i18n: chrome.i18n,
				//logo图片 base64
				domain: "extensions",
				domainSwitchEnable: false,
				logoImage: comm.logo,
				androidDl: comm.androidDl,
				windowsDl: comm.windowsDl,
				crxDl: comm.crxDl,
				plusIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAalAAAGpQEXmZfdAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAADNQTFRF////M5lmRq5dRa9aRLFcQ7BbQrFcRK9cQ7BcQ7FcQ7BcQ7BcQ7BcWblvhcyWm9WpyunRZGdSdQAAAAx0Uk5TAAUWMEtqf4Cy0Ob69Vq7RgAAAIJJREFUKM91UtkCgCAIQ1PyoOP/vzYz8yi3F3VTwAHRA23YheDYaOqh1igFkVXjFy8d/PLyNsqAaMv9D5+U/EZ5+cHfedZ63Pe65VRnC3QcLZgmIzNBDPFcYHJzwVEoXMJ55iUTAQswFEwOy4Uf7CzpBB5M3LbBRGg7bhRuLR6G2fhc3ygVOS6IAXkAAAAASUVORK5CYII=",
				delIcon: "data:image/png;base64,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",
				opIcon: "",
				addDomain: true,
				tagTap: "warning",
				user_info: '会员用户', //用户/电话
				reward: '暂未开启', //密码
				left: '服务时长 | 0天',
				isRotate: false, //是否加载旋转
				isFocus: true, // 是否聚焦
				type: 'bottom',
				current: "正在获取中 ...",
				current_icon: comm.logo,
				current_ping: "999ms",
				current_item: null,
				smart: true,
				global: false,
				itemList: [],
				apiServersJson: "[]",
				tab: null,
				domainDesc: "云游扩展",
				show: true
			};
		},
		components: {
			wInput,
			wButton,
		},

		mounted() {
			_this = this;
			comm.getTabDomain().then(tab => {
				if (tab == undefined) {
					tab = {};
					tab.url = "";
					_this.addDomain = true;
					_this.domainSwitchEnable = false;
				}
				_this.tab = tab;
				let d = comm.extractRootDomain(tab.url);
				_this.domain = d;
				let selfDomains = uni.getStorageSync("_self_domains");
				if (d == "newtab" || d == "extensions") {
					_this.domainSwitchEnable = false;
				} else {
					_this.domainSwitchEnable = true;
					chrome.runtime.sendMessage({
							type: 5
						},
						function(errMap) {
							if (errMap.hasOwnProperty(_this.domain) && proxy.isInRules(selfDomains, _this
									.domain)) {
								// auto add sub error domain
								let added = 0;
								for (let sub in errMap[_this.domain]) {
									if (!selfDomains.hasOwnProperty(sub)) {
										selfDomains[sub] = 1;
										added++
									}
								}
								if (added > 0) {
									_this.saveAndReload(selfDomains);
								}
							}
						});
				}
				if (proxy.isInRules(selfDomains, _this.domain)) {
					_this.opIcon = _this.delIcon;
					_this.addDomain = false;
					_this.tagTap = "success";
					_this.domainDesc = _this.i18n.getMessage('d_proxied');
				} else {
					_this.opIcon = this.plusIcon;
					_this.tagTap = "";
					if (_this.global) {
						_this.addDomain = false;
						_this.tagTap = "success";
						_this.domainDesc = _this.i18n.getMessage('d_proxied');
					} else {
						_this.addDomain = true;
						_this.domainDesc = _this.i18n.getMessage('d_not_proxy');
					}
				}
			});
			let token = uni.getStorageSync("token");
			if (!token) {
				proxy.off();
				uni.reLaunch({
					url: '../login/login',
				});
			}
			_this.smart = uni.getStorageSync("smart");
			_this.global = uni.getStorageSync("global");
			let app = getApp();
			this.ver = app.version;
			if (app.resp) {
				this.itemList = app.resp.user.servers;
				//this.isLogin();
				let item = uni.getStorageSync("last_node");
				uni.showLoading();
				_this.makeApiHosts();
				_this.pingNode();
				uni.hideLoading();
				_this.selectItem(item);
				if (app.resp.hasOwnProperty("notice")) {
					if (app.resp.notice != "") {
						uni.showModal({
							title: _this.i18n.getMessage('notice'),
							content: app.resp.notice
						})
					}
				}
				if (app.resp.user.balance <= 3 && app.resp.user.paid === true) {
					uni.showModal({
						title: _this.i18n.getMessage('left_socre') + "：" + app.resp.user.balance,
						content: _this.i18n.getMessage('vip_over')
					})
				}
        _this.pingMain();
			} else {
				if(_options) {
					_this.show = true;
				}
				//this.isLogin();
				let token = uni.getStorageSync("token");
				if (!token) {
					uni.reLaunch({
						url: '../login/login',
					});
				} else {
					let that = this;
					comm.sendSignReqest("/user/info/v1", comm.Post, {
						"tt": token,
					}, function(data) {
						if (data.code != 0) {
							proxy.off();
							if (data.code == 2) {
								uni.reLaunch({
									url: '../login/login',
								});
								return
							}
							if (data.code == 3) {
								uni.showModal({
									title: _this.i18n.getMessage('balance_not_enough'),
									content: data.error,
									success: function(res) {
										if (res.confirm) {
											if (data.data.includes("http")) {
												that.gotoPage(data.data);
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
							uni.showLoading();
							let infodata = "";
							for (var i = 0; i < data.data.length; i++) {
								let decryptData = comm.rsa_decrypt(data.data[i]);
								infodata += decryptData;
							}
							infodata = comm.Decode64(infodata);
							let result = JSON.parse(infodata);
							getApp().resp = result;
							_this.itemList = result.user.servers;
							let node = uni.getStorageSync("last_node");
							// expired paid
							if((node.only_paid && !result.user.paid) || (!node.only_paid && result.user.paid)){
								node = undefined;
								uni.removeStorageSync("last_node");
							}
							if (!node && _this.itemList.length > 0) {
								node = _this.itemList[0]
								_this.smart = true;
								_this.global = false;
								uni.setStorageSync("last_node", node);
								uni.setStorageSync("smart", _this.smart);
								uni.setStorageSync("global", _this.global);
							}
							uni.setStorageSync("gtw", result.gtw);
							_this.makeApiHosts();
							chrome.runtime.sendMessage({
								type: 0,
								data: result
							});
							if (result.hasOwnProperty("low_version")) {
								uni.showModal({
									title: _this.i18n.getMessage('low_version'),
									content: result["low_version"]
								})
							}
							uni.hideLoading();
							_this.selectItem(node, true);
						}
					});
				}
			}
		},
		methods: {
			service() {
				uni.showModal({
					title: _this.i18n.getMessage('service_email'),
					content: "cow.gococo@gmail.com"
				})
			},
			// cooperate() {
			// 	uni.showModal({
			// 		title: "合作",
			// 		content: "有收款实力的商家可联系合作，分成比例可达30%"
			// 	})
			// },
			isLogin() {},
			refresh() {
				proxy.off();
				getApp().resp = null;
				chrome.runtime.sendMessage({
					type: 4
				});
				uni.reLaunch({
					url: '../popup/popup',
				});
			},
			dlClient(platform) {
				chrome.tabs.create({
					url: comm.getRemoteURL("/dl/client/" + platform)
				})
			},
			makeApiHosts() {
				let gtw = uni.getStorageSync("gtw");
				try {
					gtw.push(baseHost);
					let apiHosts = {};
					for (let str of gtw) {
						let host = str.split("//")[1];
						apiHosts[host] = 1;
					}
					try {
						for (let s of getApp().resp.user.servers) {
							apiHosts[s.host] = 1;
						}
					} catch (e) {}
					_this.apiServersJson = JSON.stringify(apiHosts);
					getApp().resp.apiServersJson = _this.apiServersJson;
				} catch (e) {}
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
			pingMain() {
				try {
					comm.sendSignReqest("/user/info/v1/ping", comm.Post, {}, function(data) {});
				} catch (e) {
					//TODO handle the exception
				}
			},
			pingNode() {
				for (var i = 1; i < _this.itemList.length; i++) {
					let index = i;
					let s = _this.itemList[index];
					let u = "https://";
					var begin = parseInt(new Date().getTime());
					if (s.schema != "HTTPS") {
						u = "http://"
					}

					function setPing(ii, iiBegin) {
						let end = parseInt(new Date().getTime());
						let ping = end - iiBegin;
						if (ping > 1000) {
							ping = 1000;
						}
						if (ping < 10) {
							ping = 10;
						}
						_this.itemList[ii].ping = ping / 4 + "ms";
					}
					try {
						uni.request({
							url: u + s.host + ":" + s.port,
							method: "GET",
							header: comm.getH({}),
							success: (res) => {
								setPing(index, begin);
							},
							fail: (e) => {
								setPing(index, begin);
							},
							complete: () => {
								setPing(index, begin);
							}
						})
					} catch (e) {
						//TODO handle the exception
					}
				}
				getApp().resp.user.servers = _this.itemList;
			},
			pingBk() {
				chrome.runtime.sendMessage({
					type: -1
				});
			},
			toggle(type) {
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			},
			selectItem(item, close) {
				if(close) {
					uni.showLoading();
				}
				if (item.id === "node_store") {
					uni.navigateTo({
						url: '../user/user?to=store',
					})
					return
				}
				let last = _this.current_item;
				_this.current = item.name;
				_this.current_icon = item.icon;
				_this.current_ping = item.ping;
				_this.current_item = item;
        let last_local_node = uni.getStorageSync("last_node");
				uni.setStorageSync("last_node", item);
				if (_this.smart || _this.global) {
					function setProxy() {
						proxy.on(item, _this.global, _this.apiServersJson, ()=>{
							if(close) {
								if(_options) {
									chrome.runtime.sendMessage({
										type: 2
									});
								}else {
									// tab reload
									chrome.tabs.reload(_this.tab.id);
									window.close();
								}
							}
							uni.hideLoading();
						});
					}
					if (_this.global) {
						_this.smart = false;
					}
					let s = _this.current_item;
					let u = "https://";
					var begin = parseInt(new Date().getTime());
					if (s.schema != "HTTPS" || s.vp > 0) {
						u = "http://"
					}

					function setPing() {
						let end = parseInt(new Date().getTime());
						let ping = end - begin;
						if (ping > 1000) {
							ping = 1000;
						}
						if (ping < 10) {
							ping = 10;
						}
						_this.current_ping = ping + "ms";
					}
					let exception = _this.i18n.getMessage('network_err');
					let fix = _this.i18n.getMessage('node_err');
					let tport = s.port;
					if (s.vp && s.vp > 0) {
						tport = s.vp;
					}

					function recover2last() {
						// recover
						if (last) {
							_this.current = last.name;
							_this.current_icon = last.icon;
							_this.current_ping = last.ping;
							_this.current_item = last;
						}
            uni.setStorageSync("last_node", last_local_node);
						uni.hideLoading();
					}
					if (item.host === "127.0.0.1") {
						let errCall = function() {
							recover2last();
							uni.showModal({
								title: _this.i18n.getMessage('network_err'),
								content: _this.i18n.getMessage('desk_err'),
								success: function(res) {
									if (res.cancel) {
										return
									}
								}
							});
						}
						uni.request({
							url: "http://127.0.0.1:34/local",
              timeout: 1000,
							method: "GET",
							success: (res) => {
								if (res.statusCode != 200) {
									close = false;
									errCall();
								} else {
									setProxy();
								}
								setPing();
							},
							fail: (e) => {
								errCall();
								console.log("base error:", e);
							}
						})
						_this.current_ping = "<10ms";
					} else {
						uni.request({
							url: u + s.host + ":" + tport,
							method: "GET",
              timeout: 2000,
							header: comm.getH({}),
							success: (res) => {
								if (res.statusCode != 200) {
									uni.showModal({
										title: exception,
										content: fix,
										success: function(res) {}
									});
									close = false;
									recover2last()
									setPing();
								} else {
									setPing();
									setProxy();
								}
							},
							fail: (e) => {
								uni.showModal({
									title: exception,
									content: fix,
									success: function(res) {}
								});
								close = false;
								recover2last()
								setPing();
							}
						})
					}
					if (_this.current_item) {
						_this.$refs.popup.close();
					}
				}
				
			},
			smartChange() {
				_this.smart = !_this.smart;
				uni.setStorageSync("smart", _this.smart);
				if (!_this.global && !_this.smart) {
					uni.showToast({
						title: _this.i18n.getMessage('closed_proxy'),
						icon: "none",
					})
					proxy.off();
					return
				}
				if (_this.smart) {
					_this.global = false;
					uni.setStorageSync("global", this.global);
					uni.showToast({
						title: _this.i18n.getMessage('self_proxy'),
						icon: "none",
					})
					proxy.on(_this.current_item, false, _this.apiServersJson);
					// setTimeout(function() {
					// 	chrome.runtime.sendMessage({
					// 		type: 2
					// 	});
					// 	window.close();
					// }, 1000);
				}
			},
			globalChange() {
				_this.global = !_this.global;
				if (_this.global) {
					uni.showModal({
						title: _this.i18n.getMessage('global_mode'),
						content: _this.i18n.getMessage('global_tips'),
						success: function(res) {
							if (res.confirm) {
								_this.globalChangeDone();
							} else {
								_this.global = false;
							}
						}
					});
				} else {
					_this.globalChangeDone();
				}
			},
			globalChangeDone() {
				_this.tagTap = "";
				if (_this.global) {
					_this.addDomain = false;
					_this.tagTap = "success";
					_this.domainDesc = _this.i18n.getMessage('d_proxied');
				} else {
					let selfDomains = uni.getStorageSync("_self_domains");
					if (selfDomains.hasOwnProperty(_this.domain)) {
						_this.addDomain = false;
						_this.tagTap = "success";
						_this.domainDesc = _this.i18n.getMessage('d_proxied');
					} else {
						_this.tagTap = "";
						_this.addDomain = true;
						_this.domainDesc = _this.i18n.getMessage('d_not_proxy');
					}
				}
				uni.setStorageSync("global", _this.global);
				if (_this.global) {
					if (_this.smart) {
						_this.smart = false;
						uni.setStorageSync("smart", _this.smart);
					}
					uni.showToast({
						title: _this.i18n.getMessage('global_proxy'),
						icon: "none",
					})
					proxy.on(_this.current_item, true, _this.apiServersJson);
					return
				}
				if (!_this.global && !_this.smart) {
					uni.showToast({
						title: _this.i18n.getMessage('closed_proxy'),
						icon: "none",
					})
					proxy.off();
				}
			},
			openMenu() {
				uni.navigateTo({
					url: '../user/user',
				})
			},
			saveAndReload(selfDomains) {
				uni.setStorageSync("_self_domains", selfDomains);
				if (_this.global || _this.smart) {
					proxy.on(_this.current_item, _this.global, _this.apiServersJson);
					chrome.tabs.reload(_this.tab.id);
				}
				chrome.runtime.sendMessage({
					type: 6,
					data: selfDomains
				});
			},
			onTapDomain() {
				let selfDomains = uni.getStorageSync("_self_domains");
				if (this.addDomain) {
					selfDomains[this.domain] = 1;
					this.tagTap = "success";
					this.opIcon = this.delIcon;
					_this.domainDesc = _this.i18n.getMessage('d_proxied');
					_this.addDomain = false;
					// 如果该域名下面还有其他错误域名
					chrome.runtime.sendMessage({
							type: 5
						},
						function(errMap) {
							if (errMap && errMap.hasOwnProperty(_this.domain)) {
								// auto add sub error domain
								for (let sub in errMap[_this.domain]) {
									if (!selfDomains.hasOwnProperty(sub)) {
										selfDomains[sub] = 1;
									}
								}
							}
							_this.saveAndReload(selfDomains);
						});
				} else {
					delete selfDomains[this.domain];
					this.tagTap = "";
					this.opIcon = this.plusIcon;
					if (_this.global) {
						_this.domainDesc = _this.i18n.getMessage('d_proxied');
						_this.addDomain = false;
					} else {
						_this.domainDesc = _this.i18n.getMessage('d_not_proxy');
						_this.addDomain = true;
					}
					_this.saveAndReload(selfDomains);
				}
			},
			toDomains() {
				uni.navigateTo({
					url: '../domain/domain'
				})
			}
		}
	}
</script>

<style>
	@import url("@/components/watch-login/css/icon.css");
	@import url("@/pages/login/css/main.css");

	.menu {
		position: absolute;
		height: 60rpx;
		width: 60rpx;
		top: 21px;
		left: 21px;
		transform: scale(1);
		cursor: pointer;
	}

  .yylogo {
    cursor: pointer;
  }

	.dl {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		clear: both;
		margin: 50px;
	}

	.down_image {
		height: 48px;
		width: 48px;
		cursor: pointer;
	}

	.refresh {
		position: absolute;
		height: 60rpx;
		width: 60rpx;
		top: 21px;
		right: 21px;
		transform: scale(1);
		cursor: pointer;
	}

	.version {
		text-align: center;
		left: 0;
		right: 0;
		position: fixed;
		bottom: 20rpx;
		font-weight: 200;
		color: grey;
	}

	.content_list {
		height: 450rpx;
		overflow-x: hidden;

		.scroll_view_style {
			height: 100%;
		}
	}
</style>
