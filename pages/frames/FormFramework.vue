<template>
	<!-- 表单展示类型 -->
	<view class="formTemplate">
		<m-back-bar>
			<block slot="barTitle">{{barTitle}}</block>
			<block slot="barRight">
				<top-btns-coms :tabInfo="tabInfo"
					@showComBox="showComBox"> 
				</top-btns-coms> 
			</block>
		</m-back-bar>
		<dropdown-menu v-if="comBoxVisible" :tabInfo="tabInfo" @showComBox="showComBox"></dropdown-menu>
		<FormCom v-if="isShow" ref="mForm" :formConfig="formConfig" :tabInfo="tabInfo" :oldFormData="formData"></FormCom>
		<mLodingSvg v-if="configLoading" loadingTitle="界面配置缓存中,请稍后"></mLodingSvg>
		<view class="formTemplate-btns foot" v-show="isOriginHei">
			<bottom-btns-coms :tabInfo="tabInfo"
			 @checkedForm = "checkedForm">
			</bottom-btns-coms> 
		</view>
	</view>
</template>

<script>
	import bus from '@/static/js/bus'
	import {formApi,homeApi} from '@/common/request/api.js'
	import {mapState,mapMutations} from 'vuex'

	import FormCom from '@/components/makeup/form/FormCom.vue'
	import dropdownMenu from "@/pageComs/dropdownMenu.vue"
	import topBtnsComs from '@/pageComs/topBtnsComs.vue'
	import bottomBtnsComs from '@/pageComs/bottomBtnsComs.vue'
	
	import ClassForm from '@/static/js/ClassForm.js'
	const Form = new ClassForm()
	
	let mobileTabs = "",static_btnList = {}
	export default {
		components: {FormCom,topBtnsComs,bottomBtnsComs,dropdownMenu},
		data() {
			return {
				//界面信息
				onkey: "",
				barTitle: '',
				formType: "editBtn", //表单来源：addBtn-新增；editBtn-编辑
				templateType: "form", //模板类型form，list
				isDoRefreshParent: false, //是否需要刷新父页面刷新
				originHeight: 0,
				isShow:false,
				//面板信息
				tabInfo: {}, 
				formConfig:{},
				selectsInfo: {}, //级联下拉框
				comBoxVisible: false, //下拉菜单是否显示
				//数据信息
				formData: {},
				configLoading:false,//界面配置加载中
				bundleName:'',
				bundleId:'',
			}
		},
		computed: {
			...mapState(["isOriginHei","userDesigner"]),
			...mapState("home", {newBundle:'newBundle'}),
			...mapState("common", ["doRefreshParent","tabsElements","tabsFormDatas","pageRealod"]), //面板参数
		},
		methods: { 
			...mapMutations(["SET_ORIGIN", "SET_bundle","SET_ORIGIN"]),
			...mapMutations("form", ["SET_FILTER_SQLPARAMS","SET_ALLBTNS","SET_FILEPARAMS"]),
			...mapMutations("home",["SET_NEW_BUNDLE"]),
			...mapMutations("Toast", ["TOAST_REQUESTURLS"]),
			...mapMutations("common", [
				"SET_DROPDOWNDATA", //设置下拉框数据
				"SET_FORMREFRESH_PARENT",
				"SET_TABS_ELEMENT",
				"SET_COMMON_TABSELEMENTS",
				"SET_TABS_FORMDATAS",
				"CLEAR_FORMDATAS",
				"SET_COMMON_MAINFRAME",
				"SET_COM_PAGERELOAD"//记录从工作台点击进入后所以面板，用于判断是否需要重新加载
			]),
			...mapMutations("verificationRule",["CLEAR_RULESTATE","SET_VER_RULES"]),
			checkedForm(params){
				let form = {}
				if(params.static_checkedForm === 1) form = this.$refs.mForm.verificationRule() //需要校验
				else form = this.$refs.mForm.submitFormData()
			},
			finishLoading() { //完成加载
				let _this = this
				setTimeout(() => { _this.isLoading = false }, 100)
			},
			showComBox() { this.comBoxVisible = !this.comBoxVisible },//显示或者隐藏下拉菜单
			setPageInfo(mobileTabsBYRelation, mainTabID, formId="") { //根据relationTab取具体面板信息
				if(!mainTabID){
					this.Static_GlobalFucs.showModal(this, {content:this.$i18nMsg("pageTip-configuration")},'error')
					return 
				}
				this.CLEAR_FORMDATAS(this.tabInfo.mobileTabId)//请求对应面板的需要提交的表单值
				this.CLEAR_RULESTATE(this.tabInfo.mobileTabId)//清空对应面板的校验规则
				
				const _this = this
				
				//设置返回栏标题
				this.barTitle = mobileTabsBYRelation.mobileTabName || this.bundleName
				
				//设置表单参数
				const queryParams = Form.advancedParams(this,{ 
					advancedQuery:mobileTabsBYRelation.advancedQuery || {},//过滤条件中需要转化的变量
					systemParam:{mobileTabId:this.tabInfo.mobileTabId}
				})//获取过滤条件中的变量
				const formConfig = {}
				formConfig.otherParams = {//列表额外参数，过滤条件中设置的参数
					id:queryParams || formId,
					mobileTabId:this.tabInfo.mobileTabId,
					elementList:mobileTabsBYRelation.elements,
					mobileTabSource:mobileTabsBYRelation.mobileTabSource,
				}
				const elements = [...mobileTabsBYRelation.elements],
					  bottomBtn = [...mobileTabsBYRelation.btnList.bottomBtn],
					  topRightBtn = [...mobileTabsBYRelation.btnList.topRightBtn],
					  comboBox = [...mobileTabsBYRelation.btnList.comboBox],
					  tabElements = [...elements,...bottomBtn,...topRightBtn,...comboBox]
				formConfig.baseParams = {//列表基本参数
					currentElements:elements,
					currentBottomBtns:bottomBtn,
					currentTopRightBtns:topRightBtn,
					currentComboBoxs:comboBox,
					tabElements:tabElements,
				}
				this.formConfig = formConfig
				
				this.SET_FILTER_SQLPARAMS({
					tabId:mobileTabsBYRelation.mobileTabId,
					params:mobileTabsBYRelation.filterSQLParams
				})
				//请求表单数据
				this.getDate()
			},
			getDate(){//获取表单
				if(!this.formConfig.otherParams.id || !this.formConfig.otherParams.mobileTabSource){this.formDataFormat();return} 
				const _this = this
				//如果是编辑需要获取
				formApi.getDate(this, this.formConfig.otherParams).then(value => {
					this.formDataFormat(value)
				})
			},
			formDataFormat(formData = {}){//表单数据转化
				const baseParams = this.formConfig.baseParams
				const dataBasic = {
					eventType:4,
					triggerList:this.tabInfo.trigger,
					relationMainTab:this.tabInfo.relationMainTab,
					mobileTabId:this.tabInfo.mobileTabId,
					formData:formData,
					oldFormData:formData,
					triggerElements:baseParams.tabElements,
					oldElements:baseParams.tabElements,
					searchSelectInfo:{},
					loadsearchSelects:[],
					rules:[]
				}
				this.SET_TABS_ELEMENT({//设置面板控件
					tabId:this.tabInfo.mobileTabId,
					elements:baseParams.tabElements
				}) 
				this.Static_GlobalFucs.formElementsTrigger({...baseParams,...dataBasic},this).then(tabParams => {
					this.formConfig.baseParams.currentElements = tabParams.currentElements
					this.formConfig.loadsearchSelects = tabParams.loadsearchSelects
					this.formConfig.baseParams.tabElements = [...tabParams.currentBottomBtns,...tabParams.currentTopRightBtns,...tabParams.currentComboBoxs,...tabParams.currentElements]
					
					this.formData = tabParams.formData
					//延迟显示表单
					setTimeout(() => {
						this.isShow = true
					}, 100)
					
					this.SET_ALLBTNS({//设置按钮、下拉菜单原生数据
						tabId:this.tabInfo.mobileTabId,
						bottomBtns:tabParams.currentBottomBtns,
						topRightBtns:tabParams.currentTopRightBtns,
						comboBoxs:tabParams.currentComboBoxs
					})
					this.SET_TABS_ELEMENT({//设置面板控件
						tabId:this.tabInfo.mobileTabId,
						elements:tabParams.currentElements
					})  
					this.SET_COMMON_TABSELEMENTS({//设置面板控件
						tabId:this.tabInfo.mobileTabId,
						elements:[...tabParams.currentElements,...tabParams.currentBottomBtns,...tabParams.currentTopRightBtns,...tabParams.currentComboBoxs]
					}) 
					this.SET_TABS_FORMDATAS({//设置面板数据
						tabId:this.tabInfo.mobileTabId,
						formData:tabParams.formData
					})
					this.SET_VER_RULES({//设置校验规则
						tabId:this.tabInfo.mobileTabId,
						rules:tabParams.rules
					})
				})
			},
		},
		onLoad(options) {
			this.TOAST_REQUESTURLS({type:"clear"})//清空请求地址
			this.SET_ORIGIN(true)
			if(!options.bundleId) return
			
			const _t = this
			//如果有bundleId传递过来默认显示
			this.bundleId = options.bundleId
			this.bundleName = options.title || ''
			if(!options.jumpTag){//如果不是通过菜单跳转过来的
				this.SET_bundle({
					bundleId:options.bundleId,
					bundleName:options.title 
				})
				this.SET_COMMON_MAINFRAME({_uid:this._uid})//记录框架的唯一标识
			}
			
			//判断是否需要重新获取界面元素
			const bundleInfo = uni.getStorageSync(this.bundleId) || {}
			const mobileTabs = bundleInfo.mobileTabs || {},
				  mobileTabId = bundleInfo.mainTabID
			let mobileTabsBYRelation = {}
			if(mobileTabId) mobileTabsBYRelation = mobileTabs[mobileTabId] || {}
			
			const isNew = this.newBundle[this.bundleId],//是不是为newbundle
				  bundleV = options.V || "0"
			//定义面板信息
			let onKey = `formReload${this._uid}`
			let tabInfo = {
				_uid:this._uid,
				bundleId:this.bundleId,
				bundleName:this.bundleName,
				mobileTabId:mobileTabId,
				relationMainTab:'',
				mobileTabs:mobileTabs,
				trigger:bundleInfo.triggerMap || {},
				parentKey:"",
				selfKey:onKey,
				refreshParams:{},
				formType:'editBtn', //设置表单来源：addBtn-新增；editBtn-编辑
				mobileTabsBYRelation:mobileTabsBYRelation,
				cascadeSelects: mobileTabsBYRelation.cascadeSelects || [],
				commonSelects: mobileTabsBYRelation.commonSelects || [],
				selectsFilterParams: mobileTabsBYRelation.filterParams || {},
				isJumpTag:options.jumpTag ? true : false,
				isFrames:true//是不是初始界面，如果是初始界面，新增按钮需要去除全局变量BusinessID
			}
			this.tabInfo = tabInfo
			if(isNew || JSON.stringify(mobileTabs) === "{}"){//重新获取bundle
				this.configLoading = true
				homeApi.getPage(this,{
					bundleId: tabInfo.bundleId
				})
				.then(value => {
					const mainTabID = value.mainTabID
					if(!mainTabID) return
					this.tabInfo.mobileTabId = mainTabID
					this.tabInfo.mobileTabs = value.mobileTabs
					this.tabInfo.trigger = value.triggerMap
					
					mobileTabsBYRelation = value.mobileTabs[mainTabID]
					this.tabInfo.cascadeSelects = mobileTabsBYRelation.cascadeSelects
					this.tabInfo.commonSelects = mobileTabsBYRelation.commonSelects
					this.tabInfo.selectsFilterParams = mobileTabsBYRelation.filterParams
					this.configLoading = false
					this.setPageInfo(mobileTabsBYRelation,mainTabID)
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
				this.setPageInfo(mobileTabsBYRelation,mobileTabId)
			}
			
			//解决底部按钮在软键盘打开时被顶起问题
			const res = uni.getSystemInfoSync(),
				  _this = this
			this.originHeight = res.windowHeight
			uni.onWindowResize((res) => {
				let isOriginHei = true
				if (res.size.windowHeight < _this.originHeight) {
					isOriginHei = false
				} else {
					isOriginHei = true
				}
				_this.SET_ORIGIN(isOriginHei)
			})
			this.SET_FILEPARAMS({relationMainTab:this.tabInfo.mobileTabId})
			
			//设置监听
			this.SET_COM_PAGERELOAD({pageUid:onKey,type:false})//设置路径
			bus.$on(onKey, (params) => { //reload
				this.isShow = false
				this.setPageInfo(mobileTabsBYRelation,tabInfo.mobileTabId)
			})
		},
		onShow() {
			let reloadPages = this.pageRealod.pages,
					{selfKey, mobileTabsBYRelation, mobileTabId, isJumpTag} = this.tabInfo
			if(reloadPages[selfKey] && reloadPages[selfKey].type){//需要重新刷新界面
				this.isShow = false
				this.setPageInfo(mobileTabsBYRelation,mobileTabId)
			}
			if(!isJumpTag){//如果不是从其他面板跳过来的
				this.SET_COM_PAGERELOAD({pageUid:"first",type:false})//清空面板跳转路径
				this.SET_COM_PAGERELOAD({pageUid:selfKey,type:false})//设置路径
			}
		}
	}
</script>
