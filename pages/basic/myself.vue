<template name="myself">
	<view class="myself" :class="[themeClass_]">
		<view class="myself-header">
			<m-back-bar backStyle="backStyleNoBack" >
				<block slot="barTitle">{{barTitle}}</block>
			</m-back-bar>
			<navigator hover-class="none" :url="enabledData.enabledAccountInformation == 1? '/pages/mine/userInfo':''" class="user-info">
				<view>
					<!-- #ifdef MP -->
					<open-data class="user-img" type="userAvatarUrl"></open-data>
					<!-- #endif --> 
					<!-- #ifndef MP -->
					<image class="user-img" :src="headImage"></image>
					<!-- #endif --> 
					<view class="user-name-text">
						<view class="user-name">{{username}}</view>
						<view class="user-wish">{{personalSignal || ""}}</view>
					</view>
					<!-- <view class="arrow-right"><span></span></view> -->
				</view>
			</navigator>
		</view>
		<!-- 我的可配置区域 -->
		<view>
			<view class="bundle-list" v-if="myWorkSpace.length>0">
				<m-group-area v-for="(group,index) in myWorkSpace" :name="group.showGroupName == 1 ? group.name : ''" :key="index">
					<view class="bundle-group">
						<view hover-class="none" class="bundle-item" 
							v-for="(bundle,bundleindex) in group.list" 
							:key="bundleindex"
							@click="handleNav(bundle)">
							<m-font-icon :icon="bundle.iconName" :iconSize="iconSize2" :color="bundle.colorCode"></m-font-icon>
							<view class="bundle-item-name">{{bundle.bundleName}}</view>
						</view>
					</view>
				</m-group-area>
			</view>
		</view>
		
		<view class="myself-content">
			<view class="user-bundle-list">
				<navigator v-if="enabledData.enabledPersonalQualification == 1" class="user-bundle" open-type="navigate" url="/pages/mine/userQualification">
					<view class="font-icon">
						<m-font-icon icon="APP_48" color="#0AB050" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('page-userQualification') }}</view>
					<view class="arrow-right"><span></span></view>
				</navigator>
				<navigator v-if="enabledData.enabledAccountSecuritySettings == 1" class="user-bundle" open-type="navigate" url="/pages/mine/changePassword">
					<view class="font-icon">
						<m-font-icon icon="APP_49" color="#FF5B34" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('page-changePassword') }}</view>
					<view class="arrow-right"><span></span></view>
				</navigator>
				<!-- #ifndef MP -->
				<!-- <navigator class="user-bundle" v-if="enabledData.enabledFeedback == 1" open-type="navigate" url="/pages/mine/feedback">
					<view class="font-icon">
						<m-font-icon icon="APP_50" color="#0388FB" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('page-feedback') }}</view>
					<view class="arrow-right"><span></span></view>
				</navigator> -->
				<view class="user-bundle" v-if="enabledData.enabledFeedback == 1" v-on:click="openFeedBack()" >
					<view class="font-icon">
						<m-font-icon icon="APP_51" color="#0388FB" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('page-feedback') }}</view>
					<view class="arrow-right"><span></span></view>
				</view>
				<!-- #endif --> 
				<view class="user-bundle" v-if="enabledData.enabledClearCache == 1" v-on:click="clearStorageInfo()" >
					<view class="font-icon">
						<m-font-icon icon="APP_51" color="#F79C1B" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('page-ClearCache') }}</view>
					<view class="arrow-right"><span></span></view>
					<view class="storageInfo" v-show="storageInfo">{{storageInfo}}</view>
				</view>
				<navigator class="user-bundle" v-if="enabledData.enabledMyQRCode == 1" open-type="navigate" url="/pages/mine/qrcode">
					<view class="font-icon">
						<m-font-icon icon="APP_52" color="#0AB050" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('page-qrcode') }}</view>
					<view class="arrow-right"><span></span></view>
				</navigator>
				<!-- #ifndef MP --> 
				<view class="user-bundle" v-if="enabledData.enabledLogout == 1" v-on:click="loginOut()" >
					<view class="font-icon">
						<m-font-icon icon="APP_53" color="#FF5B34" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('page-LogoutLogin') }}</view>
					<view class="arrow-right"><span></span></view>
				</view>
				<!-- #endif --> 
				<navigator v-if="enabledData.enabledSystemVersion == 1" class="user-bundle" open-type="navigate" url="/pages/mine/versionInfo">
					<view class="font-icon">
						<m-font-icon icon="APP_54" color="#0388FB" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('page-versionInformation') }}</view>
					<view class="arrow-right"><span></span></view>
				</navigator>
				<navigator class="user-bundle" v-if="enabledData.enabledLanguageSwitchButton == 1" open-type="navigate" url="/pages/mine/language">
					<view class="font-icon">
						<m-font-icon icon="APP_55" color="#F79C1B" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('page-switchLanguage') }}</view>
					<view class="arrow-right"><span></span></view>
				</navigator>
				<navigator class="user-bundle" v-if="enabledData.enabledThirdPartyLinks == 1" open-type="navigate" url="/pages/mine/thirdPartyLinks">
					<view class="font-icon">
						<m-font-icon icon="APP_56" color="#FF5B34" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('page-otherweb') }}</view>
					<view class="arrow-right"><span></span></view>
				</navigator>
				<!-- <view  class="user-bundle" >
					<view class="font-icon">
						<m-font-icon icon="iconyijianfankui" color="#EB6035" :iconSize="iconSize"></m-font-icon>
					</view>
					<view class="bundle-name">{{ $i18nMsg('lang-myself-outLink') }}</view>
					<view class="arrow-right"><span></span></view>
				</view> -->
				<!-- <view class="user-bundle" v-for="item in outLinkList" :key="item.id" @click="openOutView(item.url)">
						<view class="font-icon">
							<m-font-icon icon="iconyijianfankui" color="#6C82C5" :iconSize="iconSize"></m-font-icon>
						</view>
				        <view class="bundle-name">{{item.name}}</view>
				        <view class="arrow-right"><span></span></view>
				</view> -->
			</view>
		</view>
		<m-pop ref="pop"></m-pop>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import mGroupArea from '@/components/element/m-groupArea.vue'
	import $http from '@/common/utils/request/index.js'
	import defaultImage from '@/static/images/default_image.png'
	export default {
		name:'myself',
		components: {
			mGroupArea,
		},
		data(){
			return {
				iconSize:42,
				iconSize2:56,
				storageInfo:'',
				storageKeys:[],
				outLinkList:[]
			};
		},
		props:{
			barTitle:{
				type:String,
				default:'我的'
			}
		},
		computed:{
			...mapState(["username","userId","userName","userImag","personalSignal","themeColor","userInfo"]),
			...mapState("home", ["enabledData","myWorkSpace"]),
			themeClass_(){//与主题she检修关联
				const mainColor = ["mainColor","whiteColor"]
				return this.themeColor !=='red' ? ("mainColor-" + this.themeColor) : 'mainColor'
			},
			headImage(){
				return this.userImag || defaultImage
			}
		},
		methods:{
			...mapMutations(["SET_FRAMETYPE"]),
			openFeedBack(){//打开反馈中心地址
				const {companyKey,account} = this.userInfo
				console.log( this.$EncryptionPSW({userInfo:JSON.stringify({companyKey,account})}) )
				let url = `http://121.196.97.165/feedbackCenter/#/?userInfo=${ this.$EncryptionPSW({userInfo:JSON.stringify({companyKey,account})}).userInfo }`
				// #ifdef H5
				window.open(url)
				// #endif
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
			},
			clearStorageInfo(){
				let _this = this;
				uni.showModal({
					title: _this.$i18nMsg('basic-modalTip'),
					content: _this.$i18nMsg('choiceTip-isClearCache')+_this.storageInfo,
					confirmText:_this.$i18nMsg('basic-confirm'),
					cancelText:_this.$i18nMsg('basic-cancel'),
					success: function (res) {
						if (res.confirm) {
							for(let i=0;i<_this.storageKeys.length;i++){
								let key = _this.storageKeys[i]
								if(key!='language' && key!='baseUrl' && key!='inTestServer' && key!='formalServer' && key!='outTestServer' && key!='otherTestServer'){
									uni.removeStorageSync(key);
								}
							}
							uni.showToast({
								title: _this.$i18nMsg('pageTip-cacheClearanceSuccessful'),
								duration: 1000
							});
							_this.storageInfo = 0;
						}
					}
				});
			},
			loginOut(){
				let _this = this;
				uni.showModal({
					title: _this.$i18nMsg('basic-modalTip'),
					content: _this.$i18nMsg('choiceTip-isLoginOut'),
					confirmText:_this.$i18nMsg('basic-confirm'),
					cancelText:_this.$i18nMsg('basic-cancel'),
					success: function (res) {
						if (res.confirm) {
							uni.reLaunch({
								url:'/pages/index/index'
							})
						}
					}
				});
			},
			openOutView(url){
				uni.navigateTo({
					 url: '/pages/mine/outLinkShow?url='+url
				 })
			},
			handleNav(bundle){//如果没有框架信息，提示功能正在开发中
				if(!bundle.template){
					const _this = this
					_this.Static_GlobalFucs.showModal(_this,{
						title:_this.$i18nMsg("basic-inquiry"),
						content:_this.$i18nMsg("pageTip-configuration"),
						showCancel:false
					})
					return 
				}
				const frameType = {
					1:'UBPFramework',//1-通用业务处理框架对应主页为列表
					2:'download',//2-数据下载框架 点巡检下载
					3:'Inspections',// 3-离线点巡检框架
					4:'FormFramework',//4-表单框架//5-统计框架TODO
					6:'systemFramework',//6-系统
					7:'echartFramework',//7-首页报表框架
					8:'ListFramework'//8-全列表控件
				}
				this.SET_FRAMETYPE(frameType[bundle.bundleFrameType])
				const url=`/pages/${bundle.template}?title=${bundle.bundleName}&bundleId=${bundle.id}&mainTab=1&V=${bundle.bundleVersion}`
				uni.navigateTo({
					url:url
				})
			},
		},
		mounted(){
			console.log("mysel")
			var _this = this; 
			uni.getStorageInfo({
				success: function (res) {
					_this.storageInfo = res.currentSize > 1024 ? parseInt(res.currentSize * 10 / 1024) / 10 + 'MB' : res.currentSize + 'KB';
					_this.storageKeys = res.keys;
				}
			});
			uni.setNavigationBarTitle({
				title: _this.$i18nMsg('page-mine') // 中文：我的
			});
		},
	}
</script>
<style scoped>
	.haveStatusBar{
		height: var(--status-bar-height);
	}
</style>
