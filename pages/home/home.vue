<template>
	<view class="home">
		<workbench v-if="pageType == 'workbench'" ref="workbench" :barTitle='barTitle'></workbench>
		<myself v-else-if="pageType == 'myself'" ref="myself" :barTitle='barTitle'></myself>
		<filelist v-else-if="pageType == 'filelist'" ref="filelist" :barTitle='barTitle'></filelist>
		<calendar v-else-if="pageType == 'calendar'" ref="calendar" :barTitle='barTitle'></calendar>
		<news v-else-if="pageType == 'news'" ref="news" :barTitle='barTitle'></news>
		<view v-else>{{ $i18nMsg("page-nodata>") }}</view><!--中文：暂无内容-->
		
		<m-tabbar v-if="bottomList.length>0" position="bottom" 
		 :barList="bottomList" 
		 @activityBar="barActivity"></m-tabbar>
		<!-- #ifdef APP-PLUS -->
		<upload v-if="isGetVersion"></upload>
		<!-- #endif -->
	</view>
</template>

<script>
	import {homeApi} from '@/common/request/api.js'
	import { mapState, mapMutations } from 'vuex'
	import news from '../basic/news.vue'
	import workbench from '@/pages/basic/workbench.vue'
	import myself from '@/pages/basic/myself.vue'
	import filelist from '@/pages/basic/fileList.vue'
	import calendar from '@/pages/basic/calendar.vue'
	import mTabbar from '../../components/bar/m-tabbar.vue'
	import {fileApi} from '@/common/request/api.js'
	// #ifdef APP-PLUS
	import upload from '@/components/upload/upload.vue'
	// #endif
	export default {
		components: {
			mTabbar,
			workbench,
			myself,
			filelist,
			calendar,
			news,
			// #ifdef APP-PLUS
			upload,
			// #endif 
		},
		data() {
			return {
				pageType: 'workbench',
				isGetVersion:false,
				barTitle:''
			}
		},
		computed: {
			...mapState(["userDesigner","appVersion","baseLatestVersion","token","appUploadUrl","upgradeMode","userId","themeColor"]),
			...mapState("home", ["bottomList"])
		},
		methods: {
			...mapMutations(["SHOW_UPLOAD","SET_APPVERSION","SET_VERSIONINFO","STATE_INIT"]),
			...mapMutations("home",["SET_NEW_BUNDLE","SET_CALENDAR_BUNDLE","CLEAR_STATE"]),
			...mapMutations("verificationRule",["CLEAR_RULESTATE"]),//清空验证规则
			...mapMutations("common",["CLEAR_PARAMETERS"]),//清空面板变量
			...mapMutations("Toast",["TOAST_REQUESTURLS","SET_TOAST_LOADING","SET_TOAST_UPLOAD"]),
			barActivity(params) {//导航点击事件
				const {activityBar={},oldActivityBar={}} = params
				
				let {bundleName:barTitle,url:pageType} = activityBar
				this.barTitle = barTitle;
				this.pageType = pageType;
			},
			//获取首页信息
			getHomeInfo(){
				homeApi.getHome(this)
				// homeApi.getCountBySql(this)
				homeApi.getSystemVersion(this).then(value => {
					const versionInfo = value.list || []
					this.isGetVersion = true
					this.SET_VERSIONINFO(versionInfo)
				})
			},
			//app升级
			appUpdater(){
				const _this = this 
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) { 
					_this.SET_APPVERSION({
						currentVersion:widgetInfo.version,//当前app版本号
						baseVersion:widgetInfo.versionCode//当前基座版本号
					})
					if(widgetInfo.version !== _this.appVersion){//pp版本号不一致
						_this.SHOW_UPLOAD(true)
					}
				})
			},
			//获取我的页面配置
			getMyselfInfo(){
				homeApi.getSelectInfo(this)
			},
			getUserInfoImage(){
				fileApi.getRelationFile({
					relationId:this.userId,
					relationTableName:'user',
					relationTypeId:1
				})
				.then(pics => {
					let image;
					if(pics && pics.length>0){
						image = pics[0].url;
					}else{
						image = defalutImage;
					}
					this.SET_USER_IMAGE(image)
				})
			},
		},
		onLoad(option) {
			this.getHomeInfo()//请求首页元素和版本
			this.CLEAR_RULESTATE()//清空state中的校验规则
			this.CLEAR_PARAMETERS()//清空面板变量
			this.TOAST_REQUESTURLS("clear")//清空loading框中的url
			this.SET_TOAST_LOADING()
			this.SET_TOAST_UPLOAD()
			this.STATE_INIT()//设置按钮栏显示
			this.getMyselfInfo()
			// #ifdef APP-PLUS
			//如果是app时监测更新，upgradeMode为3是不跳提醒
			this.appUpdater()
			//如果是app，需要检测是否第一次登录
			//如果是第一次登录，需要记录下app的设备的标识，以便于后续消息推送时可以精确推送
			// plus.push.getClientInfoAsync(function(info){
			// 	console.log('Success');
			// 	console.log(JSON.stringify(info));
			// }, function(e){
			// 	console.log('Failed');
			// 	console.log(JSON.stringify(e));
			// })
			// #endif
			
		},
		onBackPress() {  
			if(this.pageType == 'filelist'){
				let filePath = uni.getStorageSync('filePath');
				if(filePath.length>1) {  
				  let e = filePath[filePath.length-2];
				  this.$refs[this.pageType].goToStep(e,filePath.length-2);
				  return true;  
				} 
			}
			 
		},
		onPageScroll(e){ 
			if(this.pageType == 'workbench'){
				let scrollTop = (e.scrollTop/50).toFixed(1)
				if(e.scrollTop>0){
					this.$refs[this.pageType].topshow = true
				}else{
					this.$refs[this.pageType].topshow = false
				}
				if (scrollTop>1) {
					scrollTop = 1
				}else if(scrollTop<0.5 && scrollTop>0){
					scrollTop = 0.5
				}
				this.$refs[this.pageType].topopacity = scrollTop
			}
			
		}
	}
</script>

<style>
	.home{
		width: 100%;
		height: 100%;
	}
</style>
