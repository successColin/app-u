<template>
	<!-- 扫一扫框架 -->
	<view class="scanFramework">
		<m-back-bar>
			<block slot="barTitle">{{bundleName}}</block>
		</m-back-bar>
		<view class="scanContent" v-if="isShow">
			<image class="scanBg" src="@/static/images/scanbg.png"></image>
			<view class="sanTip">{{$i18nMsg("page-scanFrameTip")}}</view>
			<m-button class="footerBtn" :btnTilte="$i18nMsg('basic-scan')" btnClass="mainColor"  @elementClick="goScanCode"></m-button>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import {ELEMENT_SCAN} from '@/common/functions/element.js'
	import {FRAMS_SHOWTYPE} from '@/common/constant/frams.js'
	import {homeApi} from '@/common/request/api.js'

	export default {
		data() {
			return {
				//界面信息
				bundleName: '',
				bundleId: '',
				templateType: "SCAN", //模板类型form，list,scan扫一扫
				tabInfo:{},//面板参数
				isShow:false
			}
		},
		computed: {
			...mapState("home", {newBundle:'newBundle'})
		},
		methods: { 
			...mapMutations(["SET_bundle"]),
			...mapMutations("home",["SET_NEW_BUNDLE"]),
			...mapMutations("Toast", ["TOAST_REQUESTURLS"]),
			...mapMutations("common", [
				"SET_TEMPLATE_PARAMS",
				"SET_COMMON_MAINFRAME",
				"SET_COM_PAGERELOAD"//记录从工作台点击进入后所以面板，用于判断是否需要重新加载
			]),
			...mapMutations("FrameVariable", ["Set_ScanFramework"]),
			setPageInfo() { //根据relationTab取具体面板信息
				const {mobileTabs, mobileTabId} = this.tabInfo
				if(!mobileTabId){
					uni.showModal({
						title:this.$i18nMsg("basic-inquiry"),
						content:this.$i18nMsg('pageTip-configuration'), // 中文："请联系管理员配置主页",
						cancelText:this.$i18nMsg("basic-cancel"),
						confirmText:this.$i18nMsg("basic-confirm"),
					})
					return 
				}
				
				const mobileTabsBYRelation = mobileTabs[mobileTabId] 
				let static_mobileTabShowType = FRAMS_SHOWTYPE[mobileTabsBYRelation.mobileTabShowType]
				let tabParams = {//设置下一个面板的参数
					tabId: mobileTabId,
					params: {
						relationTab: mobileTabId,
						relationMainTab: "",
						bundleId: this.bundleId
					}
				}
				this.SET_TEMPLATE_PARAMS(tabParams) //设置下一个面板的参数
				this.Static_GlobalFucs.gotoOtherRoute(tabParams,static_mobileTabShowType)//跳转其他路由
			},
			goScanCode(tabParams,static_mobileTabShowType){
				ELEMENT_SCAN({}, (option)=>{
					const result = option.scancode
					console.log("===================================="+result)
					this.Set_ScanFramework({//设置框架变量，static_scanResult-扫描结果
						key:"static_scanResult",
						value:{id:result,name:result}
					})
					this.setPageInfo()
				})
			}
		},
		onLoad(options) {
			// #ifdef H5
			uni.showModal({
				title:this.$i18nMsg("basic-inquiry"),
				content:this.$i18nMsg('lang-scan-tip'), // 中文："H5界面暂不支持扫描功能",
				cancelText:this.$i18nMsg("basic-cancel"),
				confirmText:this.$i18nMsg("basic-confirm"),
			})
			//如果是H5的话没有扫描功能
			return
			// #endif
			this.TOAST_REQUESTURLS({type:"clear"})//清空请求地址
			if(!options.bundleId) return
			this.SET_bundle({
				bundleId:options.bundleId,
				bundleName:options.title 
			})
			this.SET_COMMON_MAINFRAME({_uid:this._uid})//记录框架的唯一标识
			this.SET_COM_PAGERELOAD({pageUid:"first",type:false})//清空面板跳转路径
			
			const _t = this
			//如果有bundleId传递过来默认显示
			this.bundleId = options.bundleId
			this.bundleName = options.title || ''
			//判断是否需要重新获取界面元素
			const bundleInfo = uni.getStorageSync(this.bundleId) || {}
			const mobileTabs = bundleInfo.mobileTabs || {},
						mobileTabId = bundleInfo.mainTabID
			
			const isNew = this.newBundle[this.bundleId],//是不是为newbundle
						bundleV = options.V || "0"
			//定义面板信息
			let tabInfo = {
				_uid:this._uid,
				bundleId:this.bundleId,
				bundleName:this.bundleName,
				mobileTabId:mobileTabId,
				relationMainTab:'',
				mobileTabs:mobileTabs,
				trigger:bundleInfo.triggerMap || {},
				parentKey:"",
				isNew
			}
			this.tabInfo = tabInfo
			
			const {bundleId} = this.tabInfo
			if(isNew || JSON.stringify(mobileTabs) === "{}"){//重新获取bundle
				homeApi.getPage(this,{bundleId}).then(value => {
					const mainTabID = value.mainTabID
					if(!mainTabID) return
					this.tabInfo.mobileTabId = mainTabID
					this.tabInfo.mobileTabs = value.mobileTabs
			
					this.isShow = true
					//将bundle版本存入bundleVersion缓存种，版本号以用户设计组和bundleId作为key
					if(isNew){
						//加载过后设置isNew为false
						this.SET_NEW_BUNDLE({bundle:this.bundleId,isNew:false})
						let bundleVersions = uni.getStorageSync("bundleVersion") || {},
							key = this.userDesigner + "_" + this.bundleId
						bundleVersions[key] = bundleV
						uni.setStorageSync("bundleVersion",bundleVersions)
					}
				})
			}else {
				this.isShow = true
			}
		}
	}
</script>