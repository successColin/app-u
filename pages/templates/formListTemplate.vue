<template>
	<!-- 表单子列表展示类型 -->
	<view class="formTemplate noAnimation">
		<m-back-bar>
			<block slot="barTitle">{{barTitle}}</block>
			<block slot="barRight">
				<top-btns-coms :tabInfo="tabInfo" :tabStaticParams="tabStaticParams" v-if="topbtnsShow"
					@showComBox="showComBox"> 
				</top-btns-coms> 
			</block>
		</m-back-bar>
		<dropdown-menu v-if="comBoxVisible" :tabInfo="tabInfo" :tabStaticParams="tabStaticParams" @showComBox="showComBox"></dropdown-menu>
		<!-- 进度条组件 -->
		<view class="progressTabs" v-if="!!childProgressListConfig && !!childProgressData">
			<block v-for="(item, index) in childProgressListConfig" :key="index">
			<view class="childTab" v-show="tabsChildVisiabled(item.tabInfo.refreshParams.elementId)" style="padding: 0;">
				 <progress-bar :otherParams = "item.listConfig.otherParams" :progressData="childProgressData" ></progress-bar>
			</view>
			</block>
		</view>
		
		<FormCom v-if="isShow" ref="mForm" 
		 :formConfig="formConfig" 
		 :tabInfo="tabInfo" 
		 :oldFormData="formData"
		 :tabStaticParams = "tabStaticParams"
		 @childRelod="childRelod"></FormCom> 
		<view class="childTabs" v-if="isShow">
			<block v-for="(item, index) in childListConfig" :key="index">
			<view v-if="item.tabInfo.showType != '9'"  v-show="tabsChildVisiabled(item.tabInfo.refreshParams.elementId)" class="childTab" style="padding: 0;">
				<m-tab :tabTitle="item.tabTitles" @clickTab="clickTab"></m-tab>
				<m-input-search v-if="item.quickQuery.isSearch" :mobileTabId="item.tabInfo.mobileTabId" :tabInfo="item.tabInfo"
				 :isQuickQuery="item.quickQuery.isQuickQuery" 
				 :isSeniorFilter="item.quickQuery.isSeniorFilter"  
				 :fixed="false"
				 @doSearch="handelSearch">
					 <view slot='left' class="mInputSearch-btn" style="padding-right: 0;">
						 <!-- 设备盘点扫描 -->
						 <m-button  v-if="item.quickQuery.isDeviceScan" :isFontBtn="true" key="searchScanBtn" @elementClick="deviceScan(item)">
								<block slot="buttonIcon">
									<m-normal-icon icon="APP_60" :iconSize="pxToREM(28)"></m-normal-icon>
								</block>
						 </m-button>
					 </view>
				 </m-input-search> 
				<ListCom :tabInfo="item.tabInfo" :pageSize="10"
				 :ref="item.tabInfo.refreshParams.elementId"
				 :listConfig = "item.listConfig" 
				 @clickList="clickList"></ListCom>
			</view>
			</block>
		</view>
		
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
	import {formApi, listApi} from '@/common/request/api.js'
	import {common_getDeviceCheck, common_inventoryScanInster} from '@/common/request/commonApi/commonRequest.js'
	import {ELEMENT_SCAN} from '@/common/functions/element.js'
	import {mapState,mapMutations} from 'vuex'

	import FormCom from '@/components/makeup/form/FormCom.vue'
	import ListCom from '@/components/makeup/list/ListCom.vue'
	import progressBar from '@/components/progress-bar/progressBar.vue'
	import mInputSearch from '@/components/element/m-inputSearch.vue'
	import mTab from '@/components/element/m-tab.vue'
	import dropdownMenu from "@/pageComs/dropdownMenu.vue"
	import topBtnsComs from '@/pageComs/topBtnsComs.vue'
	import bottomBtnsComs from '@/pageComs/bottomBtnsComs.vue'
	import ClassList from '@/static/js/ClassList.js'
	
	import ClassForm from '@/static/js/ClassForm.js'
	const Form = new ClassForm()
	
	let mobileTabs = "",static_btnList = {},listTem = new ClassList();
	export default {
		components: {FormCom,topBtnsComs,bottomBtnsComs,dropdownMenu,ListCom,mInputSearch, progressBar,mTab},
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
				childListConfig:[],//子列表数据
				childTabInfo:[],
				quickQuery:{},//便捷搜索
				childProgressListConfig:[],//进度条子面板数据
				childProgressData:[],//进度条数据
				tabStaticParams:{},//面板变量
			}
		},
		computed: {
			...mapState(["bundleName", "bundleId", "isOriginHei"]),
			...mapState("framsStore",["jumpInBundleParam"]),
			...mapState("common", ["templateParams","doRefreshParent","tabsElements","tabsFormDatas","tabsChilds","pageRealod"]), //面板参数
			tabsChildVisiabled(){//该子面板是否可见
				return function(elamentId){
					const currentTabsChilds = this.tabsChilds[this.tabInfo.mobileTabId] || [],
						  tabsChildsElement = currentTabsChilds.find(item => item.elementId === elamentId) || {}
					return tabsChildsElement.visiabled
				}
			}
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
				"SET_TEMPLATE_PARAMS",
				"SET_COM_TABCHILD",
				"SET_COM_PAGERELOAD"//记录从工作台点击进入后所以面板，用于判断是否需要重新加载
			]),
			...mapMutations("verificationRule",["CLEAR_RULESTATE","SET_VER_RULES"]),
			...mapMutations("Toast", ["TOAST_REQUESTURLS"]),
			...mapMutations("advanceFilter", ["SET_ADVAN_FILTERS","SET_ADV_FORMDATAS"]),
			deviceScan(list){//设备盘点扫描
				ELEMENT_SCAN({}, (option)=>{
					const code = option.scancode,
								{id:headId} = this.formConfig.otherParams
					if(code && headId){
						common_inventoryScanInster({deviceKeyCode:code,headId}, this).then( item =>{
							if(item){
								let {lineId,type} = item
								let params = {...list.tabInfo,...list.listConfig.goEventParams},
										primaryKey = params.primaryKey
								params.isMain = false
								let listItem = {}
								listItem[primaryKey] = {
									id:lineId
								}
								params.listItem = listItem
								if(type === 1) this.SET_COM_PAGERELOAD({pageUid:this.tabInfo.selfKey,type:true})////如果是新增的，需要刷新本面板；设置该面板需要重新加载
								listTem.clickListNode(this,params)
							}
						})
					}
				})
			},
			childRelod(reloadElements=[]){
				reloadElements.map( elementId => {
					const childConfig = this.childListConfig.find(item => item.tabInfo.elementId === elementId)
					//设置列表参数
					const queryParams = listTem.advancedParams(this,{
						advancedQuery:childConfig.tabInfo.advancedQuery || {},//过滤条件中需要转化的变量
						advancedSqlQuery:childConfig.tabInfo.advancedSqlQuery || [],//sql中的变量
						relationMainTab:childConfig.tabInfo.relationMainTab
					})//获取过滤条件中的变量
					const otherParams = {//列表额外参数，过滤条件中设置的参数
						globalMap:queryParams.advancedQuery,
						globalQueryMap:queryParams.advancedSqlQuery,
					}
					this.$refs[elementId][0].setOtherParam(otherParams)
					this.$refs[elementId][0].getListData("load"); 
				})
			},
			clickList(params){//点击列表
				params.isMain = false
				listTem.clickListNode(this,params)
			},
			clickTab(tabValue){//点击tab页切换
				let {elementId,param} = tabValue
				this.$refs[elementId][0].doSearch({seniorFilterMap:param}); 
			},
			handelSearch(searchParam){//处理搜索
				const elementId = searchParam.tabInfo.elementId, 
					  childConfig = this.childListConfig.find(item => item.tabInfo.elementId === elementId)
				let params = {...childConfig.quickQuery, ...searchParam}
				const quickQueryParams = listTem.handleSearchText(this,params)
				this.$refs[elementId][0].doSearch(quickQueryParams); 
			},
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
					  tabsChilds = [...mobileTabsBYRelation.childMobilTable],
					  tabElements = [...elements,...bottomBtn,...topRightBtn,...comboBox,...tabsChilds]
				formConfig.baseParams = {//列表基本参数
					currentElements:elements,
					currentBottomBtns:bottomBtn,
					currentTopRightBtns:topRightBtn,
					currentComboBoxs:comboBox,
					currentTabsChilds:tabsChilds,
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
					this.formConfig.baseParams.tabElements = [...tabParams.currentBottomBtns,...tabParams.currentTopRightBtns,...tabParams.currentComboBoxs,...tabParams.currentElements,...tabParams.currentTabsChilds]
					
					this.formData = tabParams.formData
					
					this.SET_TABS_ELEMENT({//设置面板控件
						tabId:this.tabInfo.mobileTabId,
						elements:tabParams.currentElements
					})  
					this.SET_COMMON_TABSELEMENTS({//设置面板控件
						tabId:this.tabInfo.mobileTabId,
						elements:[...tabParams.currentElements,...tabParams.currentBottomBtns,...tabParams.currentTopRightBtns,...tabParams.currentComboBoxs,...tabParams.currentTabsChilds]
					}) 
					this.SET_COM_TABCHILD({//设置子面板
						tabId:this.tabInfo.mobileTabId,
						tabsChilds:tabParams.currentTabsChilds
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
					this.handleChildData(this.tabInfo.childMobilTable)
				})
			},
			async handleChildData(childMobilTable){
				if(childMobilTable.length === 0) return
				
				const childConfigs = [],
					  mobileTabs = this.tabInfo.mobileTabs
					 
				const baseConfig = {
					templateType:"list",
					bundleId:this.tabInfo.bundleId,
					bundleName:this.tabInfo.bundleName,
					mobileTabs:mobileTabs,
					relationMainTab:this.tabInfo.mobileTabId,//子面板框架的父面板是当前面板的id
				}
				for(let i=0;i<childMobilTable.length;i++){//如果有多个列表，默认显示第一个
					const relationChildElement = childMobilTable[i],
						  relationChildTabId = relationChildElement.relationTabId
					//如果该子面板控件没有关联面板
					if(!relationChildTabId) continue
					
					//处理子面板配置
					const relationChildTabInfo = mobileTabs[relationChildTabId] || {},
						  config = {
							  elementId:relationChildElement.elementId,
							  mobileTabId:Number(relationChildTabId),
							  selfKey:this.tabInfo.selfKey,
							  refreshParams:{
							  	elementId:relationChildElement.elementId
							  },
							  advancedQuery:relationChildTabInfo.advancedQuery || {},//过滤条件中需要转化的变量
							  advancedSqlQuery:relationChildTabInfo.advancedSqlQuery || [],//sql中的变量
							  showType:relationChildTabInfo.showType,//子面板类型，9为进度条
						  }
					let childConfig = {}
					childConfig.tabInfo = {...baseConfig,...config}
					//处理列表配置
					//如果数据来源是接口
					const {dataSourceType, commonApiHeaderId, interfaceInParam} = relationChildTabInfo || {}
					if(dataSourceType === 2 && !commonApiHeaderId){//如果数据来源是接口，但没有接口id提示错误
						this.Static_GlobalFucs.showModal(this, {content:this.$i18nMsg("pageTip-noInterface")},'error')
						continue 
					}
					//设置列表参数
					let queryParamsConfig = {
						advancedQuery:relationChildTabInfo.advancedQuery || {},//过滤条件中需要转化的变量
						advancedSqlQuery:relationChildTabInfo.advancedSqlQuery || [],//sql中的变量
						relationMainTab:childConfig.tabInfo.relationMainTab
					}
					if(childConfig.tabInfo.jumpTag) queryParamsConfig.bundleParams = childConfig.tabInfo.bundleParams || {}
					const queryParams = listTem.advancedParams(this,queryParamsConfig)//获取过滤条件中的变量
					//关联面板，自动与主业务id关联
					let params = {},listConfig = {hasPager:true}
					if(relationChildTabInfo.mobileTabShowType === 4){//如果为面板展示类型
						params[relationChildTabInfo.relationColumn] = {
							static_connector: 3,
							static_type: 2,
							static_value: this.BusinessID
						}
					}
					//获取设备盘点tab信息
					if( relationChildTabInfo.mobileTabShowType === 12 && this.formConfig.otherParams.id) {//面板展示类型为设备盘点
						await common_getDeviceCheck(this.formConfig.otherParams.id, this).then( item =>{
							let {inventoryloss=0, inventorysurplus=0, inventoryed=0} = item //盘亏、盘盈、已盘
							let result = []
							result = [{
								title:`盘亏${inventoryloss}`,
								elementId:relationChildElement.elementId,
								param:{"typeid":{"static_connector":3,"static_value":149,"static_type":2}}
							},{
								title:`盘盈${inventorysurplus}`,
								elementId:relationChildElement.elementId,
								param:{"typeid":{"static_connector":3,"static_value":148,"static_type":2}}
							},{
								title:`已盘${inventoryed}`,
								elementId:relationChildElement.elementId,
								param:{"stateid":{"static_connector":3,"static_value":46,"static_type":2}}
							}]
							childConfig.tabTitles = result
							params = {...params,...result[0].param}
						})
					}
					
					listConfig.otherParams = {//列表额外参数，过滤条件中设置的参数
						globalMap:queryParams.advancedQuery,
						globalQueryMap:queryParams.advancedSqlQuery,
						mobileTabId:childConfig.tabInfo.mobileTabId,
						elementList:relationChildTabInfo.elements,
						mobileTabSource:relationChildTabInfo.mobileTabSource,
						seniorFilterMap:params
					}
					listConfig.baseParams = {//列表基本参数
						hasIcon:true,
						listIcon:relationChildTabInfo.listIcon || {},
						multiple:true,
					}
					listConfig.isCheckedParams = {//列表点击返回参数
						primaryKey:relationChildTabInfo.primaryKey
					}
					listConfig.goEventParams = {//列表点击返回参数
						primaryKey:relationChildTabInfo.primaryKey,
						mobileTabRelationTabId:relationChildTabInfo.mobileTabRelationTabId,
					}
					if(dataSourceType === 2 && commonApiHeaderId){
						listConfig.baseParams.dataSourceType = dataSourceType
						listConfig.baseParams.commonApiHeaderId = commonApiHeaderId
						listConfig.otherParams.interfaceInParam = interfaceInParam
						listConfig.url = "static_getDataByInterface" //来源与接口
					} 
					else listConfig.url = "currencyGetListData"
					
					childConfig.listConfig = listConfig //设置子面板控件的列表参数
					childConfig.quickQuery = relationChildTabInfo.quickQuery || {} //设置搜索控件参数
					
					this.SET_ADVAN_FILTERS({//设置高级筛选控件
						tabId:childConfig.tabInfo.mobileTabId,
						params:relationChildTabInfo.elements
					})
					this.SET_ADV_FORMDATAS({	//清空高级筛选条件值
						tabId:childConfig.tabInfo.mobileTabId + '_filter',
						value:{}
					})
					
					if(childConfig.tabInfo.showType == 9 && this.childProgressListConfig.length == 0){
						this.childProgressListConfig.push(childConfig)
						this.getListData(childConfig)
					}else{
						if(this.childListConfig.length == 0){
							this.childListConfig.push(childConfig)
						}
					}
				}
				
			},
			// 获取进度条数据
			getListData(item){
				const _this = this
				//如果没有默认数据，且有数据源，通过接口进行请求
				const config = item.listConfig
				if(config.url){
					const pageInfo = {pageNum:1,pageSize:9999}
					let params = {...config.otherParams, ...pageInfo}
					listApi.getListData(this, config.url, params)
					.then(value => {
						uni.stopPullDownRefresh()//停止下拉刷新
						value = value || {}
						//数据格式化
						let listData1 = value.datalist || [],
							listData = []
						listData1.map((item) => {
							let valueFormat = {}
							for(let key in item){
								valueFormat[key] = this.Static_GlobalFucs.Global_dataFormat(item[key])
							}
							listData.push(valueFormat)
						})
						this.childProgressData.push(listData)
					}).finally(value => {
					})
				}
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
				formType: currentTemParams.type || 'editBtn', //设置表单来源：addBtn-新增；editBtn-编辑
				cascadeSelects: mobileTabsBYRelation.cascadeSelects || [],
				commonSelects: mobileTabsBYRelation.commonSelects || [],
				selectsFilterParams: mobileTabsBYRelation.filterParams || {},
				mobileTabsBYRelation:mobileTabsBYRelation,
				mainDataId:currentTemParams.id,
				childMobilTable:mobileTabsBYRelation.childMobilTable //子面板控件
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
			
			//设置监听
			this.SET_COM_PAGERELOAD({pageUid:onKey,type:false})//设置路径
			bus.$on(onKey, (params) => { //reload
				_this.isShow = false
				_this.setPageInfo(mobileTabsBYRelation,tabInfo.mobileTabId, currentTemParams.id)
			})
			this.SET_FILEPARAMS({relationMainTab:this.tabInfo.mobileTabId,mainDataId:this.tabInfo.mainDataId})
		},
		onReady() {
			this.setPageInfo(this.tabInfo.mobileTabsBYRelation,this.tabInfo.mobileTabId, this.tabInfo.mainDataId)
		},
		onShow() {
			let reloadPages = this.pageRealod.pages,
					{selfKey, mobileTabsBYRelation, mobileTabId, mainDataId} = this.tabInfo
			if(reloadPages[selfKey] && reloadPages[selfKey].type){//需要重新刷新界面
				this.SET_COM_PAGERELOAD({pageUid:selfKey,type:false})
				this.isShow = false
				this.setPageInfo(mobileTabsBYRelation, mobileTabId, mainDataId)
			}
		}
	}
	const getDeviceCheck = async( businessID, _this ) => { //获取设备盘点tab信息
		
		return result
	}
</script>
<style>
	.mForm{
		margin-bottom: 6px !important;
	}
</style>