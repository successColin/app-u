<template>
	<!-- 表单展示类型 -->
	<view class="formTemplate">
		<m-back-bar>
			<block slot="barTitle">{{barTitle}}</block>
			<block slot="barRight">
				<top-btns-coms :tabInfo="tabInfo" v-if="topbtnsShow"
					@showComBox="showComBox" :tabStaticParams="tabStaticParams"> 
				</top-btns-coms>
			</block>
		</m-back-bar>
		<dropdown-menu v-if="comBoxVisible" :tabInfo="tabInfo" :tabStaticParams="tabStaticParams" @showComBox="showComBox"></dropdown-menu>
		<FormCom v-if="isShow" ref="mForm" :formConfig="formConfig" :tabInfo="tabInfo" :oldFormData="formData" :tabStaticParams="tabStaticParams"></FormCom>
		
		<view v-else class="formloading animated fadeInDown">
			<image src="../../static/images/svg/tail-spin.svg" style="width: 25px; height: 25px;" mode="aspectFill" ></image>
			{{$i18nMsg('lang-advancedFilter-loading')}}<!--中文：加载中-->
		</view>
		<view class="formTemplate-btns foot" v-show="isOriginHei" v-if="footShow">
			<bottom-btns-coms :tabInfo="tabInfo" :tabStaticParams="tabStaticParams"
			 @checkedForm = "checkedForm">
			</bottom-btns-coms> 
		</view>
	</view>
</template>

<script>
	import bus from '@/static/js/bus'
	import {formApi} from '@/common/request/api.js'
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
				footShow:false,
				topbtnsShow:false,
				//面板信息
				tabInfo: {}, 
				formConfig:{},
				selectsInfo: {}, //级联下拉框
				comBoxVisible: false, //下拉菜单是否显示
				//数据信息
				formData: {},
				tabStaticParams:{}//面板变量
			}
		},
		computed: {
			...mapState("framsStore",["jumpInBundleParam"]),
			...mapState(["bundleName", "bundleId", "isOriginHei"]),
			...mapState("common", ["templateParams","doRefreshParent","tabsElements","tabsFormDatas","pageRealod"]), //面板参数
		},
		methods: { 
			...mapMutations(["SET_ORIGIN", "SET_bundle"]),
			...mapMutations("form", ["SET_FILTER_SQLPARAMS","SET_ALLBTNS","SET_FILEPARAMS"]),
			...mapMutations("common", [
				"SET_DROPDOWNDATA", //设置下拉框数据
				"SET_FORMREFRESH_PARENT",
				"SET_TABS_ELEMENT",
				"SET_COMMON_TABSELEMENTS",
				"SET_TABS_FORMDATAS",
				"CLEAR_FORMDATAS",
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
			setPageInfo(mobileTabsBYRelation, relationTab, formId="") { //根据relationTab取具体面板信息
				const _this = this
				
				//设置返回栏标题
				this.barTitle = mobileTabsBYRelation.mobileTabName || this.bundleName
				
				//设置表单参数
				const queryParams = Form.advancedParams(this,{ 
					advancedQuery:mobileTabsBYRelation.advancedQuery || {},//过滤条件中需要转化的变量
					systemParam:{relationMainTab:this.tabInfo.relationMainTab}
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
				const baseParams = this.formConfig.baseParams,
					  _this = this
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
					rules:[],
					bundleParams:this.tabInfo.bundleParams,
					tabStaticParams:this.tabStaticParams//系统固定变量
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
					
					//延迟显示表单
					_this.isShow = true
					
					this.SET_ALLBTNS({//设置按钮、下拉菜单原生数据
						tabId:this.tabInfo.mobileTabId,
						bottomBtns:tabParams.currentBottomBtns,
						topRightBtns:tabParams.currentTopRightBtns,
						comboBoxs:tabParams.currentComboBoxs
					})
					setTimeout(() => {
						_this.topbtnsShow = true
						_this.footShow = true
					}, 50)
				})
			},
		},
		onLoad(options) {
			const currentTabId = options.relationTab //当前面板的id
			//当前面板id不存在，不进行面板布局 todo 进入报错界面
			if (!currentTabId) return
			const currentTemParams = this.templateParams[currentTabId] || {}, //获取当前面板参数
				  _this = this
			//判断是否有mobileTabs
			const bundleInfo = uni.getStorageSync(currentTemParams.bundleId) || {}
			const mobileTabs = bundleInfo.mobileTabs || {},
				  mobileTabsBYRelation = mobileTabs[currentTabId] || {}
			
			let onKey = `formReload${this._uid}`
			//定义面板信息
			let tabInfo = {
				_uid:this._uid,
				bundleId:currentTemParams.bundleId,
				bundleName:currentTemParams.bundleName,
				mobileTabId:Number(currentTabId),
				relationMainTab:currentTemParams.relationMainTab || '',
				mobileTabs:mobileTabs,
				trigger:bundleInfo.triggerMap || {},
				parentKey:currentTemParams.onkey || "",
				selfKey:onKey,
				refreshParams:currentTemParams.refreshParams || {},
				formType: currentTemParams.type || 'editBtn', //设置表单来源：addBtn-新增；editBtn-编辑；batch-多条处理
				cascadeSelects: mobileTabsBYRelation.cascadeSelects || [],
				commonSelects: mobileTabsBYRelation.commonSelects || [],
				selectsFilterParams: mobileTabsBYRelation.filterParams || {},
				mobileTabsBYRelation:mobileTabsBYRelation,
				mainDataId:currentTemParams.id
			}
			if(currentTemParams.GlobalIds){//前面一个面板是列表，那么就会将列表中选中的值传递过来
				//如果有值的话，默认在本面板上的面板固定变量也将GlobalIds加入进去
				this.tabStaticParams.GlobalIds = {...currentTemParams.GlobalIds}
			}
			//判断是否从其他菜单中跳转过来的
			if(this.jumpInBundleParam[tabInfo.bundleId]){
				const jumpInBundleParam = this.jumpInBundleParam[tabInfo.bundleId] || {}
				tabInfo.jumpTag = jumpInBundleParam.jumpTag
				tabInfo.bundleParams = jumpInBundleParam.bundleParams  //菜单参数
			} 
			this.tabInfo = tabInfo
			this.CLEAR_FORMDATAS(tabInfo.mobileTabId)//请求对应面板的需要提交的表单值
			this.CLEAR_RULESTATE(tabInfo.mobileTabId)//清空对应面板的校验规则
			this.SET_ORIGIN(true)//设置按钮栏显示
			//解决底部按钮在软键盘打开时被顶起问题
			const res = uni.getSystemInfoSync()
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
			
			this.SET_FILEPARAMS({relationMainTab:this.tabInfo.mobileTabId,mainDataId:this.tabInfo.mainDataId})
			//设置监听
			this.SET_COM_PAGERELOAD({pageUid:onKey,type:false})//设置路径
			bus.$on(onKey, (params) => { //reload
				_this.isShow = false
				_this.setPageInfo(mobileTabsBYRelation,tabInfo.mobileTabId, currentTemParams.id)
			})
		},
		onShow() {
			let reloadPages = this.pageRealod.pages,
					{selfKey, mobileTabsBYRelation, mobileTabId, mainDataId} = this.tabInfo
			if(reloadPages[selfKey] && reloadPages[selfKey].type){//需要重新刷新界面
				this.SET_COM_PAGERELOAD({pageUid:selfKey,type:false})
				this.isShow = false
				this.setPageInfo(mobileTabsBYRelation, mobileTabId, mainDataId)
			}
		},
		onReady() {
			this.setPageInfo(this.tabInfo.mobileTabsBYRelation,this.tabInfo.mobileTabId, this.tabInfo.mainDataId)
		}
	}
</script>
