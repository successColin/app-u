<template>
	<!-- 表单展示类型 -->
	<view class="formTemplate">
		<m-back-bar>
			<block slot="barTitle">{{$i18nMsg("lang-advancedFilter-filter")}}</block><!-- 中文：高级筛选 -->
			<block slot="barRight"><m-font-icon @click="showSelectList()" icon="APP_58" :iconSize="32" color="#C62127" style="width: 2.64rem;text-align: center;"></m-font-icon></block>
		</m-back-bar>
		<FormCom v-if="isShow" ref="mForm" 
		 :formConfig="formConfig" 
		 :tabInfo="tabInfo" 
		 :oldFormData="formData"
		 :advancedFilterConditions = "advancedFilterConditions"
		 :showElementType = "[1,2,3,9,12,20,21,22,25,31]">
		</FormCom>
		<view v-else class="formloading animated fadeInDown">
			<image src="../../static/images/svg/tail-spin.svg" style="width: 25px; height: 25px;" mode="aspectFill" ></image>{{$i18nMsg('lang-advancedFilter-loading')}}<!--中文：加载中-->
		</view>
		<!-- 底部按钮 -->
		<view class="formTemplate-btns foot" v-show="isOriginHei">
			<view class="bottomBtnsComs">
				<m-button class="btn-item" btnClass="whiteColor" 
				 :btnTilte="$i18nMsg('basic-clear')"
				 key="clearBottomBtn" 
				 @elementClick="handleClear"></m-button>
				<m-button class="btn-item" btnClass="mainColor" 
				 :btnTilte="$i18nMsg('page-filter')"
				 key="advancedFilterBtn" 
				 @elementClick="advancedFilter"></m-button>
			</view> 
		</view>
		<!--  -->
		<view class="firstMenuPop" v-if="selectListShow">
			<view class="title-bar">
				<view class="barTitle">{{$i18nMsg('lang-select-list')}}</view><!--选择菜单-->
				<view class="barRight" @click="hideSelectList()">
					<view class="buttonIcon" style="display: inline-block;">
						<m-font-icon icon="iconfanhui" color="#333333" :iconSize="40"></m-font-icon>
					</view>
				</view>
			</view>
			<view class="select-container">
				<view class="select-wrap" v-for="(item,index) in selectListData" @click="openSecondMenu(index)" :key="index">
					<view class="select-name">{{'记录'+(index+1)}} <span class="checkSelect" @click="checkSelect(item)">填入</span></view>
					<view class="selectItems" v-for="(data,index2) in item.formDataShow" :key="'item'+index2">
						<!-- <input v-if="data.start || data.end || data.name" disabled="disabled" readonly="readonly" type="text" class="selectItem"  :value="data.relationColumnType == 3 ? data.start:data.name" /> -->
						<!-- <input v-if="data.name" disabled="disabled" readonly="readonly" type="text" class="selectItem"  :value="data.name" /> -->
						<span class="label">{{data.label}}:</span> 
						<span class="name">{{data.name}}</span>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import bus from '@/static/js/bus'
	import {advanceFilterApi} from '@/common/request/api.js'
	import {mapState,mapMutations} from 'vuex'

	import FormCom from '@/components/makeup/form/FormCom.vue'
	
	import ClassForm from '@/static/js/ClassForm.js'
	const Form = new ClassForm()
	
	let mobileTabs = "",static_btnList = {}
	export default {
		components: {FormCom},
		data() {
			return {
				//界面信息
				onKey: "",
				originHeight: 0,
				isShow:false,
				//面板信息
				tabInfo: {}, 
				formConfig:{},
				selectsInfo: {}, //级联下拉框
				//数据信息
				formData: {},
				advancedFilterConditions:{},
				selectListShow: false,
				selectListData: []
			}
		},
		computed: {
			...mapState(["bundleName", "bundleId", "isOriginHei"]),
			...mapState("advanceFilter",["advancedFilterFormDatas"]),
			...mapState("common", ["templateParams","doRefreshParent","tabsElements","tabsFormDatas"]), //面板参数
		},
		methods: { 
			...mapMutations(["SET_ORIGIN", "SET_bundle"]),
			...mapMutations("common", [
				"SET_DROPDOWNDATA", //设置下拉框数据
				"SET_FORMREFRESH_PARENT",
				"SET_TABS_ELEMENT",
				"SET_COMMON_TABSELEMENTS",
				"SET_COMMON_TABSOLDDATAS",
				"CLEAR_FORMDATAS",
				"SET_TABS_FORMDATAS",
			]),
			...mapMutations("advanceFilter",["SET_ADV_FORMDATAS"]),
			handleClear(){//清空
				this.formData = {}
				this.advancedFilterConditions = {}
				this.SET_ADV_FORMDATAS({
					tabId:this.tabInfo.mobileTabId,
					value:{}
				})
				bus.$emit(this.onKey, {})
				uni.navigateBack()
			},
			advancedFilter(){//点击筛选
				const formData = this.$refs.mForm.currentFormData|| {},
					  connector = this.$refs.mForm.currentConditions || {}
				let advancedFilterParasms = {},
					storeAdvancedFilterParasms = {},
					advancedFilterConditions = {},
					advancedFilterFormData = {}
				const elements = this.tabInfo.elements || []
				elements.map(item => {
					const name = item.name,
						  baseType = item.baseType,
						  elementId = item.elementId,
						  value = formData[elementId] || {}
					
					let static_connector = connector[elementId],
						static_value = "",
						dataFormat = item.dataFormat
					if(baseType === 31) dataFormat = 1 //为区间
					if(dataFormat === 1 && JSON.stringify(value)!=="{}") {//区间
						static_connector = static_connector || 7
						if(value.start|| value.end ) {
							const start = value.start || "",
								  end = value.end || ""
							static_value = start + "," + end
							advancedFilterFormData[elementId+'_start'] = {id:start,name:start}
							advancedFilterFormData[elementId+'_end'] = {id:end,name:end}
						}
					}else{
						static_value = value.id || ""
						static_connector = static_connector || 3
						advancedFilterFormData[elementId] = {id:value.id || "",name:value.name || ""}
					} 
					if(static_value){
						advancedFilterParasms[name] = {
							static_connector: static_connector,
							static_value: static_value,
							static_type: item.relationColumnType
						}
						storeAdvancedFilterParasms[elementId] = {
							value:value,
							connector:static_connector
						}
					}
					advancedFilterConditions['cond_'+elementId] = connector[elementId]
					if(baseType == 9 && dataFormat) advancedFilterConditions['cond_'+elementId] = 7
					if(baseType == 45) advancedFilterConditions['cond_'+elementId] = 8
				})
				this.SET_ADV_FORMDATAS({//设置高级筛选数据
					tabId:this.tabInfo.mobileTabId,
					values:storeAdvancedFilterParasms
				})
				this.insertSearchRecord(advancedFilterFormData,advancedFilterConditions)
				bus.$emit(this.onKey, advancedFilterParasms)
				uni.navigateBack()
			},
			getFormData(params){ this.$refs.mForm.submitFormData()},
			setPageInfo(mobileTabsBYRelation, relationTab, formData={}) { //根据relationTab取具体面板信息
				const _this = this
				
				const formConfig = {}
				formConfig.otherParams = {//列表额外参数，过滤条件中设置的参数
					mobileTabId:this.tabInfo.mobileTabId,
					elementList:mobileTabsBYRelation.elements,
					mobileTabSource:mobileTabsBYRelation.mobileTabSource,
				}
				const elements = mobileTabsBYRelation.elements,
					  tabElements = [...elements]
				formConfig.baseParams = {//列表基本参数
					currentElements:elements,
					currentBottomBtns:[],
					currentTopRightBtns:[],
					currentComboBoxs:[],
					tabElements:tabElements,
				}
				this.formConfig = formConfig
				
				//请求表单数据
				this.formDataFormat(formData)
			},
			getElement(relationTab,mobileTabsBYRelation){
				if(!relationTab) return
				const _this = this
				advanceFilterApi.seniorFilterRelationGet(this, {
					mobileTabId: relationTab
				}).then( value => {
					if(value.success) {
						const advElements = value.data || [],
							  advancedFilterFormData = _this.advancedFilterFormDatas[_this.tabInfo.mobileTabId] || {}
						const listCommonSelects = _this.tabInfo.commonSelects || [],
							  baseConfig = {
								  visiabled : 1,
								  requisite : 0,
								  readonly: 0,
								  defaultValue: "",
								  parameter: ""
							  }
						
						const listElements = mobileTabsBYRelation.elements
						let elements = [],
							commonSelects = [],
							formData = {},
							advancedFilterConditions = {}
						advElements.map(item => {
							const elementId = item.elementId,
								  oldElementValue = advancedFilterFormData[elementId] || {}
							let listElement = listElements.find( item => item.elementId === elementId),
								listCommonSelect = listCommonSelects.find( item => item.elementId === elementId)
							if(!listElement) return
							if(listCommonSelect) commonSelects.push(listCommonSelect)
							elements.push({...listElement, ...baseConfig})
							let baseConnector = 3
							if(listElement.baseType === 31 || listElement.dataFormat === 1) baseConnector = 7
							advancedFilterConditions[elementId] = oldElementValue.connector || baseConnector
							formData[elementId] = oldElementValue.value || {}
						})
						_this.tabInfo.commonSelects = commonSelects
						_this.tabInfo.elements = elements
						_this.advancedFilterConditions = advancedFilterConditions
						mobileTabsBYRelation.elements = elements
						_this.setPageInfo(mobileTabsBYRelation,relationTab,formData)
						// _this.getSelectLastOne(relationTab,advElements)
					}
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
				this.Static_GlobalFucs.formElementsTrigger({...baseParams,...dataBasic},this).then(tabParams => {
				
					this.formConfig.baseParams.currentElements = tabParams.currentElements
					this.formConfig.loadsearchSelects = tabParams.loadsearchSelects
					this.formData = tabParams.formData
					//延迟显示表单
					setTimeout(() => {
						this.isShow = true
					}, 100)
					
					this.SET_TABS_ELEMENT({//设置面板控件
						tabId:this.tabInfo.mobileTabId,
						elements:tabParams.currentElements
					})  
					this.SET_COMMON_TABSELEMENTS({//设置面板控件
						tabId:this.tabInfo.mobileTabId,
						elements:[...tabParams.currentElements,...tabParams.currentBottomBtns,...tabParams.currentTopRightBtns,...tabParams.currentComboBoxs]
					}) 
					this.SET_COMMON_TABSOLDDATAS({//设置原始数据
						tabId:this.tabInfo.mobileTabId,
						value:tabParams.formData
					})
				})
			},
			getSelectLastOne (currentTabId,advElements){
				this.$http.post('searchRecords/selectLastOne', {searchMobileTab:currentTabId})
				.then(res => {
					const result = JSON.parse(res.data.data.searchContent)
					let formData = {}, connector= {}
					const elements = this.tabInfo.elements || []
					if(result){
						elements.map(item=>{
							connector[item.elementId] = result['cond_'+item.elementId]
							if(item.relationColumnType == 3){
								formData[item.elementId] = {
									id: '',
									parameter:"",
									relationColumnType: item.relationColumnType,
									end: result[item.elementId+'_end'].id,
									start: result[item.elementId+'_start'].id,
								}
							}else{
								formData[item.elementId] = {
									id: result[item.elementId].id,
									name: result[item.elementId].name,
									parameter:"",
									relationColumnType: item.relationColumnType
								}
							}
						})
						this.advancedFilterConditions = connector
						this.formData = formData
						setTimeout(() => {
							this.isShow = true
						}, 100)
						this.SET_COMMON_TABSOLDDATAS({//设置原始数据
							tabId:this.tabInfo.mobileTabId,
							value:formData
						})
					}else{
						setTimeout(() => {
							this.isShow = true
						}, 100)
					}
				})
				.catch(err => {
					setTimeout(() => {
						this.isShow = true
					}, 100)
				})
			},
			insertSearchRecord(obj1,obj2){
				let params = Object.assign(obj1,obj2)
				this.$http.post('searchRecords/relationInsert', {searchMobileTab:this.tabInfo.currentTabId,searchContent:JSON.stringify(params)})
				.then(res => {
					const result = res.data
				})
				.catch(err => {
					console.error(err)
				})
			},
			showSelectList(){
				this.$http.post('searchRecords/selectList', {searchMobileTab:this.tabInfo.currentTabId})
				.then(res => {
					const result = res.data.data
					const elements = this.tabInfo.elements || []
					this.selectListData = []
					result.map(item=>{
						const data = JSON.parse(item.searchContent)
						let formData = {}, connector= {}, formDataShow = {}
						elements.map(item=>{
							console.log(item)
							connector[item.elementId] = data['cond_'+item.elementId]
							if(item.baseType == 9 && item.dataFormat){
								if(data[item.elementId+'_end'].id || data[item.elementId+'_start'].id){
									formData[item.elementId] = {
										id: '',
										parameter:"",
										relationColumnType: item.relationColumnType,
										end: data[item.elementId+'_end'].id,
										start: data[item.elementId+'_start'].id,
									}
									formDataShow[item.elementId] = {
										id: '',
										parameter:"",
										relationColumnType: -99,
										name: data[item.elementId+'_start'].id + '~' + data[item.elementId+'_end'].id,
										label: item.label
									}
									// formDataShow[item.elementId+'_end'] = {
									// 	id: '',
									// 	parameter:"",
									// 	relationColumnType: -99,
									// 	name: data[item.elementId+'_end'].id,
									// }
								}
							}else{
								if(data[item.elementId].id || data[item.elementId].name){
									formData[item.elementId] = {
										id: data[item.elementId].id,
										name: data[item.elementId].name,
										parameter:"",
										relationColumnType: item.relationColumnType
									}
									formDataShow[item.elementId] = {
										id: data[item.elementId].id,
										name: data[item.elementId].name,
										parameter:"",
										relationColumnType: item.relationColumnType,
										label: item.label
									}
								}
							}
						})
						this.selectListData.push({advancedFilterConditions:connector,formData:formData,formDataShow:formDataShow})
					})
				})
				.catch(err => {
					console.error(err)
				})
				this.selectListShow = true
				this.isShow = false
			},
			hideSelectList(){
				this.selectListShow = false
				this.isShow = true
			},
			checkSelect(item){
				this.advancedFilterConditions = item.advancedFilterConditions
				this.formData = item.formData
				setTimeout(() => {
					this.isShow = true
					this.selectListShow = false
				}, 100)
				this.SET_COMMON_TABSOLDDATAS({//设置原始数据
					tabId:this.tabInfo.mobileTabId,
					value:formData
				})
			}
		},
		onLoad(options) {
			const currentTabId = options.relationTab //当前面板的id
			//当前面板id不存在，不进行面板布局 todo 进入报错界面
			if (!currentTabId) return
			const paramKey = `advancedFilter_${currentTabId}`
			const currentTemParams = this.templateParams[paramKey] || {} //获取当前面板参数
			
			//判断是否有mobileTabs
			const bundleInfo = uni.getStorageSync(currentTemParams.bundleId) || {}
			const mobileTabs = bundleInfo.mobileTabs || {},
				  mobileTabsBYRelation = mobileTabs[currentTabId] || {}
			//定义面板信息
			this.onKey = currentTemParams.onkey //筛选按钮
			let tabInfo = {
				_uid:this._uid,
				bundleId:currentTemParams.bundleId,
				bundleName:currentTemParams.bundleName,
				mobileTabId:Number(currentTabId) + '_filter',
				relationMainTab:currentTemParams.relationMainTab || '',
				mobileTabs:mobileTabs,
				trigger:bundleInfo.triggerMap || {},
				parentKey:currentTemParams.onkey || "",
				formType: currentTemParams.type || 'advancedFilter', //设置表单来源：addBtn-新增；editBtn-编辑
				templateType: "advancedFilter",
				cascadeSelects: mobileTabsBYRelation.cascadeSelects || [],
				commonSelects: mobileTabsBYRelation.commonSelects || [],
				selectsFilterParams: mobileTabsBYRelation.filterParams || {},
				currentTabId: currentTabId
			}
			this.tabInfo = tabInfo
			this.getElement(currentTabId,mobileTabsBYRelation)
			
			//解决底部按钮在软键盘打开时被顶起问题
			const res = uni.getSystemInfoSync(),
				  _this = this
			this.originHeight = res.windowHeight
			this.SET_ORIGIN(true)//设置按钮栏显示
			uni.onWindowResize((res) => {
				let isOriginHei = true
				if (res.size.windowHeight < _this.originHeight) {
					isOriginHei = false
				} else {
					isOriginHei = true
				}
				_this.SET_ORIGIN(isOriginHei)
			})
		}
	}
</script>