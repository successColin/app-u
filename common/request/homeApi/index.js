import store from '@/store/index'
import * as Path from './interface.js'
import { templateType, elementType, static_btnColors, static_btnElementsInfo } from '@/common/constant/constant.js'
import { ELEMENT_SELECT, ELEMENT_COMBOX, ELEMENT_RADIO,ELEMENT_JUMPBUNDLE, ELEMENT_MULTIPLE } from '@/common/constant/element.js'
import {sourceInterface_getInParamByTab} from '@/common/request/commonApi/sourceInterface.js'

//控件分类
const static_downElementsCor = ["","statecolor","prioritycolor","iconname"]//下拉控件特殊功能：statecolor-状态决定颜色；prioritycolor-优先级决定颜色；iconname-类型决定状态
const static_comboBoxElements = [19]

function formatBundles(_this, list, groupStyleType){
	
	const oldbundleVersions = uni.getStorageSync("bundleVersion") || {},//从缓存中获取bundle的版本
		  oldCalendarBundle = uni.getStorageSync("calendarBundles") || {},//从缓存中获取bundle日历
		  bundles = []
	let bundleVersion = {},//bundle版本
		bundlePermissiones = {},//bundle权限
		calendarBundles = {},//日历bundle
		bundleSqlsGlobalMap = {},//从缓存中获取bundle角标
		bundleSqls = []//从缓存中获取bundle角标
	for (let i = 0,len = list.length;i<len;i++) {
		
		let bundleId = list[i].bundleId,
			bundlePermission = list[i].bundlePermission || {},//bundle权限
			bundleVersionKey = _this.userDesigner + "_" + bundleId,//版本缓存
			oldbundleVersion = oldbundleVersions[bundleVersionKey] || {}
		
		//设置bundle日历
		if(list[i].applyToCalendar===1){//是否应用于日历
			let oldC = oldCalendarBundle[bundleId] || {},
				calendarBundle = {
					id:bundleId,
					text: list[i].bundleName,
					checked:oldC.checked,
					calendarSearchColumn:list[i].applyToCalendarField
				}
			calendarBundle = {...calendarBundle}
			calendarBundles[bundleId] = calendarBundle
			_this.SET_CALENDAR_BUNDLE({
				bundle:bundleId,
				calendarBundle:calendarBundle
			})
		}
		//设置bundle角标
		if(list[i].sqlDescription==1){
			bundleSqls.push(bundleId)
			if(list[i].globalVars){
				for(let n=0;n<list[i].globalVars.length;n++){
					let globalVars = list[i].globalVars[n]
					if(!bundleSqlsGlobalMap[globalVars]){
						let value = _this.Static_GlobalFucs.Global_ParamFormat({
							key:globalVars,
						},_this)
						value = typeof value === "object" ? value : {id:value,name:value};
						let type = globalVars == '@@CurrentDate'||globalVars =='@@CurrentDateTime' ? '3':'1'
						bundleSqlsGlobalMap[globalVars] = {
							'type':type,
							'value':value.id,
						}
					}
				}
			}
		}
		//设置bundle权限
		bundlePermissiones[bundleId]= {
			canadd:bundlePermission.canadd,//新增权限
			canview:bundlePermission.canview,//查看权限
			canprint:bundlePermission.canprint,//打印权限
			canmodify:bundlePermission.canmodify,//修改权限
			candelete:bundlePermission.candelete,//删除权限
			candesign:bundlePermission.candesign,//设计权限
			canexport:bundlePermission.canexport,//导出权限
		}
		//设置bundle版本
		let newbundleVersion = list[i].bundleVersion
		if(oldbundleVersion != newbundleVersion) {
			//如果bundle的版本不一致或者是新的用户设计组都需要重新加载面板信息
			let params = {
				bundle:bundleId,
				isNew:true
			}
			_this.SET_NEW_BUNDLE(params)
		}
		bundleVersion[bundleId] = newbundleVersion
		
		let colorCode = list[i].colorCode || ''
		if(groupStyleType === 2){//风格2
			colorCode = colorCode.split(",")
			if(!list[i].colorCode) colorCode = ["#E0584D","#882D26","#FFF2F1"]
			else if(colorCode.length === 1) colorCode.push("#882D26","#FFF2F1")
			else if(colorCode.length === 2) colorCode.push("#FFF2F1")
		}else if(groupStyleType === 4){//风格4
			colorCode = colorCode.split(",")
			if(!list[i].colorCode) colorCode = ["#EB6236","#FFF2F1"]
			else if(colorCode.length === 1) colorCode.push("#FFF2F1")
		}
		bundles.push({
			"id":list[i].bundleId,
			"sno":list[i].sno,
			"colorCode":colorCode || "#F3AF7D,#E3474A",
			"iconName":list[i].bundleIconName || "knowledge_bundle",
			"bundleName":list[i].bundleName || "",
			"bundleFrameType":list[i].bundleFrameType,
			"template": templateType[list[i].bundleFrameType],
			"bundleVersion": list[i].bundleVersion,
			"isNew": oldbundleVersion !== newbundleVersion ? true:false,
			"picpath": list[i].picpath
		})
	}
	return {
		bundles:bundles,
		bundleVersion:bundleVersion,
		bundlePermissiones:bundlePermissiones,
		calendarBundles:calendarBundles,
		bundleSqls,
		bundleSqlsGlobalMap,
	}
}

let Home = {
	getSystemVersion(_this){//获取版本信息
		return _this.$http.post(Path.getSystemVersion, {basetype:2},{
			noLoading:true
		})
		.then(res => {
			const result = res.data
			return result.data
		})
		.catch(err => {
			console.error(err)
			uni.showModal({
				title:_this.$i18nMsg("basic-modalTipError"),
				content:err,
				showCancel:false,
				confirmText:_this.$i18nMsg("basic-confirm")
			})
		})
	},
	sysParamer(_this, param){//获取系统参数
		return _this.$http.get(Path.sysParamer,{
			variableName:param
		},{
			errorNoRefresh:true,//错误401时不重新启动
			noToken:true
		})
		.then(res => {
			return res.data
		})
	},
	//注册
	mPWeChatRegister(_this, params = {}){
		const baseParams = {//登录时默认参数
			tag:store.state.platform,
			appKeyCode:store.state.appKeyCode,
			static_param:store.state.static_param
		}
		params = Object.assign(baseParams,params)
		try {
			// 不修改请求头
			return _this.$http.post(Path.mPWeChatRegister, params,{
				header:{'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
				noToken:true
			})
			.then(res => {
				let result = res.data
				if(result.success) {
					const result = res.data.data
					
					const oldUserDesignerId = uni.getStorageSync("userDesignerId") || ""//用户设计组
					if(oldUserDesignerId != result.userDesignerId){
						//如果用户设计组不一样时，清空版本信息
						uni.setStorageSync("bundleVersion",{})
						uni.setStorageSync("userDesignerId",result.userDesignerId) //设置新的用户设计组
					}
					
					_this.SET_LOGIN_STATE(res.data.data)
					uni.redirectTo({
						url:'/pages/home/home'
					})
				}else{
					uni.showToast({ title: result.msg, icon: "none" });
				}
			})
			.catch(err => {
				uni.showToast({ title: err, icon: "none" });
			})
		} catch (error) {
			console.error('error:',error)
		}
	},
	// 测试微信小程序登录
	mpWXRegisterLogin(_this, params = {}) { 
		const baseParams = {//登录时默认参数
			tag:store.state.platform,
			appKeyCode:store.state.appKeyCode,
			static_param:store.state.static_param
		}
		params = Object.assign(baseParams,params)
		try {
			// 不修改请求头
			return _this.$http.post(Path.mpWXRegisterLogin, params,{
				header:{'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
				noToken:true
			})
			.then(res => {
				let result = res.data
				if(result.success) {
					const result = res.data.data
					
					const oldUserDesignerId = uni.getStorageSync("userDesignerId") || ""//用户设计组
					if(oldUserDesignerId != result.userDesignerId){
						//如果用户设计组不一样时，清空版本信息
						uni.setStorageSync("bundleVersion",{})
						uni.setStorageSync("userDesignerId",result.userDesignerId) //设置新的用户设计组
					}
					
					_this.SET_LOGIN_STATE(res.data.data)
					uni.redirectTo({
						url:'/pages/home/home'
					})
				}else{
					uni.redirectTo({
						url:'/pages/login/register'
					})
				}
			})
			.catch(err => {
				uni.showToast({ title: err, icon: "none" });
			})
		} catch (error) {
			console.error('error:',error)
		}
	},
	// 登录获取tochen
	getToken(_this, params = {}) { 
		const baseParams = {//登录时默认参数
			tag:store.state.platform,
			appKeyCode:store.state.appKeyCode
		}
		params = Object.assign(baseParams,params)
		try {
			// 不修改请求头
			return _this.$http.post(Path.login, params,{
				header:{'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
				noToken:true
			})
			.then(res => {
				res = res || {}
				let result = res.data || {}
				if(result.success) {
					const result = res.data.data
					
					const oldUserDesignerId = uni.getStorageSync("userDesignerId") || ""//用户设计组
					if(oldUserDesignerId != result.userDesignerId){
						//如果用户设计组不一样时，清空版本信息
						uni.setStorageSync("bundleVersion",{})
						uni.setStorageSync("userDesignerId",result.userDesignerId) //设置新的用户设计组
						uni.setStorageSync("language",result.currentLanguage) //当前语言
					}
					_this.SET_LOGIN_STATE(result)
					
					uni.redirectTo({
						url:'/pages/home/home'
					})
				}else{
					_this.Static_GlobalFucs.showModal(_this,{
						content:result.msg || "操作失败",
						showCancel:false,
					},"error")
				}
			})
			.catch(err => {
				uni.showToast({ title: err, icon: "none" });
			})
		} catch (error) {
			uni.showModal({
				title:_this.$i18nMsg("basic-modalTipError"),
				content:JSON.stringify(error),
				showCancel:false,
				confirmText:_this.$i18nMsg("basic-confirm")
			})
			console.error('error:',error)
		}
	},

	/**
	 * @description 获取首页配置
	 * 将figureList:轮播图、leftList:顶部左按钮、rightList:顶部右按钮、topCoreList顶部核心功能、bottomList底部功能、workSpaceList工作区功能存入homeTemplate
	 * 将bundle权限存入bundlePermissiones缓存中
	 * 将bundle版本存入bundleVersion缓存中
	 */
	getHome(_this){
		return _this.$http.post(Path.selectAppHomePageByUserId, {
			appKeyCode:store.state.appKeyCode
		})
		.then(res => {
			const result = res.data
			if(result.success){
				_this.CLEAR_STATE()//清除stotre中state
				uni.setStorageSync("bundleSqls",null)
				const workSpaceList = result.data.workSpaceList,//工作区功能
					  myWorkSpaceList = result.data.myWorkSpaceList,//我的可配置功能
					  topCoreList = [],//顶部核心功能
					  leftList = result.data.leftList,//顶部左侧按钮
					  rightList = result.data.rightList,//顶部右侧按钮
					  myselfList = result.data.myWorkSpaceList,//顶部右侧按钮
					  oldbundleVersions = uni.getStorageSync("bundleVersion") || {},//从缓存中获取bundle的版本
					  oldCalendarBundle = uni.getStorageSync("calendarBundles") || {}//从缓存中获取bundle日历
					  
				let workSpace = [], 
					myWorkSpace = [], 
					bundleVersion = {},//bundle版本
					bundlePermissiones = {},//bundle权限
					calendarBundles = {},//日历bundle
					  bundleSqlsGlobalMap = {},
					  bundleIds = []
					
				//设置顶部左侧按钮部分
				let leftBundle = formatBundles(_this, leftList)
				bundlePermissiones = {...bundlePermissiones,...leftBundle.bundlePermissiones}//bundle权限
				bundleVersion = {...bundleVersion,...leftBundle.bundleVersion}//bundle版本
				calendarBundles = {...calendarBundles,...leftBundle.calendarBundles}//日历bundle
				result.data.leftList = leftBundle.bundles,
				bundleSqlsGlobalMap = Object.assign(bundleSqlsGlobalMap,leftBundle.bundleSqlsGlobalMap)
				
				bundleIds = bundleIds.concat(leftBundle.bundleSqls)
				//设置顶部右侧按钮部分
				let rightBundle = formatBundles(_this, rightList)
				bundlePermissiones = {...bundlePermissiones,...rightBundle.bundlePermissiones}//bundle权限
				bundleVersion = {...bundleVersion,...rightBundle.bundleVersion}//bundle版本
				calendarBundles = {...calendarBundles,...rightBundle.calendarBundles}//日历bundle
				result.data.rightList = rightBundle.bundles,
				bundleSqlsGlobalMap = Object.assign(bundleSqlsGlobalMap,rightBundle.bundleSqlsGlobalMap)
				bundleIds = bundleIds.concat(rightBundle.bundleSqls)
					
				//设置顶部核心部门部分
				let topCoreBundle = formatBundles(_this, topCoreList)
				bundlePermissiones = {...bundlePermissiones,...topCoreBundle.bundlePermissiones}//bundle权限
				bundleVersion = {...bundleVersion,...topCoreBundle.bundleVersion}//bundle版本
				calendarBundles = {...calendarBundles,...topCoreBundle.calendarBundles}//日历bundle
				result.data.topCoreList = topCoreBundle.bundles,
				bundleSqlsGlobalMap = Object.assign(bundleSqlsGlobalMap,topCoreBundle.bundleSqlsGlobalMap)
				bundleIds = bundleIds.concat(topCoreBundle.bundleSqls)
				
				//设置中间工作区数据
				for (let i = 0,len = workSpaceList.length;i<len;i++) {
					const list = workSpaceList[i].list || []//bundle列表
					let bundleInfo = formatBundles(_this, list,workSpaceList[i].styleType || 1)
					
					bundlePermissiones = {...bundlePermissiones,...bundleInfo.bundlePermissiones}//bundle权限
					bundleVersion = {...bundleVersion,...bundleInfo.bundleVersion}//bundle版本
					calendarBundles = {...calendarBundles,...bundleInfo.calendarBundles}//日历bundle
					bundleSqlsGlobalMap = Object.assign(bundleSqlsGlobalMap,bundleInfo.bundleSqlsGlobalMap)
					bundleIds = bundleIds.concat(bundleInfo.bundleSqls)
					
					if(bundleInfo.bundles.length>0){
						let group = {
							styleType:workSpaceList[i].styleType || 1,//bundle分组样式
							showGroupName:workSpaceList[i].showGroupName,//是否显示分组名称
							name:workSpaceList[i].name,//分组名称
							list:bundleInfo.bundles
						}
						workSpace.push(group)
					}
				}
				//设置我的工作区数据
				for (let i = 0,len = myWorkSpaceList.length;i<len;i++) {
					const list = myWorkSpaceList[i].list || []//bundle列表
					let bundleInfo = formatBundles(_this, list)
					
					bundlePermissiones = {...bundlePermissiones,...bundleInfo.bundlePermissiones}//bundle权限
					bundleVersion = {...bundleVersion,...bundleInfo.bundleVersion}//bundle版本
					calendarBundles = {...calendarBundles,...bundleInfo.calendarBundles}//日历bundle
					bundleSqlsGlobalMap = Object.assign(bundleSqlsGlobalMap,bundleInfo.bundleSqlsGlobalMap)
					bundleIds = bundleIds.concat(bundleInfo.bundleSqls)
					
					if(bundleInfo.bundles.length>0){
						let group = {
							name:myWorkSpaceList[i].name,//分组名称
							list:bundleInfo.bundles,
							showGroupName:myWorkSpaceList[i].showGroupName
						}
						myWorkSpace.push(group)
					}
				}
				const figureList = result.data.figureList.filter(item => !!item.linkUrl) || [];
				result.data.workSpace = workSpace
				result.data.figureList = figureList
				result.data.myWorkSpace = myWorkSpace
				//获取角标
				// const bundleIds = uni.getStorageSync("bundleSqls").toString()
				bundleIds = bundleIds.toString()
				if(bundleIds){
					this.getCountBySql(_this,bundleIds,bundleSqlsGlobalMap)
				}
				//将日历bundle存入bundlePermissiones缓存种
				uni.setStorageSync("calendarBundles",calendarBundles)
				//将bundle权限存入bundlePermissiones缓存种
				uni.setStorageSync("bundlePermissiones",bundlePermissiones)
				//将页面元素存入homeTemplate缓存种
				uni.setStorageSync("homeTemplate",{
					leftList: result.data.leftList,
					rightList: result.data.rightList,
					topCoreList: result.data.topCoreList,
					workSpaceList: result.data.workSpace,
					bottomList: result.data.bottomList,
					myWorkSpace: result.data.myWorkSpace
				})
				store.commit("home/SET_HOME_TEMPLATE",result.data)
			}else{
				_this.Static_GlobalFucs.showModal(_this,{
					content:result.msg,
					showCancel:false
				})
			}
		})
		.catch(err => {
			console.log(err)
			_this.Static_GlobalFucs.showToast({title:err})
		})
	},
	
	/**
	 * @description 获取面板配置，将mainTabID:主面板id；mobileTabs:所有面板信息存入对应key为bundleId的本地缓存中
	 */
	getPage(_this, params = {}){//获取界面配置
		const baseParams = {
			userId: store.state.userId
		}
		params ={...baseParams,...params}
		return _this.$http.post(Path.currencyGetPage, params, 
			{header:{'content-type': 'application/json;charset=UTF-8'}},
		)
		.then(async res => {
			const data = res.data || {}
			if(!data.success){ 
				_this.Static_GlobalFucs.showModal(_this,{
					content:data.msg,
					showCancel:false
				})
				return 
			}
			const result = data.data,
				  mobileTabList = result.mobileTabList || [],//面板元素
				  elementMap = result.elementMap || {},//下拉框数据
				  triggerMap = result.triggerMap || {},//触发器
				  advancedQueryMap = result.advancedQueryMap || {},//过滤条件
				  filterMap = result.filterMap || {}//过滤器
				  
			let mobileTabs = {},
				mainTabID = ''//主面板id
				
			for (let i = 0,len = mobileTabList.length;i<len;i++) {
				const mobileTabDto = mobileTabList[i],
					  mobileTabDtoId = mobileTabList[i].id,//面板
					  elementList = elementMap[mobileTabDtoId]//控件
				
				let btnList = {
					topRightBtn:[],//顶部右上角按钮
					bottomBtn:[],//底部按钮
					comboBox:[],//下拉菜单
				}, newelementList = [],
				commonSelects=[],//下拉框
				cascadeSelects = [],//级联下拉框
				filterParams = {},//过滤器中是否有全局变量
				filterSQLParams = {},//过滤器中是否有SQL变量
				listIcon={},//列表图标由type类型决定
				primaryKey="",//主键
				childMobilTable = []
				
				let searchInfo = {//模糊搜索
					isSearch:false,//是否具有模糊搜索功能，界面配置了模糊搜索控件就具备模糊搜索功能
					quickQueryParams:{}//需要搜索的字段
				}
				elementList.map( (item, index, elementList) => {
					//界面元素格式转化
					const selectOption = [];
					const type = elementType[item.basetype],
						  baseType = item.basetype
					let {combinationInfoList = [], qrCode} = item
					let feild = {
						elementId:item.id,
						qrCode,//记录扫描控件对应扫描的字段，默认keycode
						elementMultiRelation:item.elementMultiRelation,//是否配置了多级实体
						label: item.displayName, 
						name: item.relationColumnName, //relationColumnName业务表；mainColumnName实体表
						type: type,
						baseType: item.basetype,
						readonly: item.readonly,//是否只读
						requisite: item.requisite,//是否必填
						visiabled: item.visiabled,//是否可见
						columnspan:item.columnSpan || 12,//8-1/3;12-1/2;24-1/1
						relationTabId:item.relationTabId,//关联弹出面板
						mainTableName:item.mainTableName,//实体表
						mainColumnName:item.mainColumnName,
						relationTableName:item.relationTableName,//业务表
						relationColumnName:item.relationColumnName,
						defaultValue:item.defaultValue,//默认值
						relationColumnType:item.relationColumnType,//业务表字段类型
						elementFormat:item.elementFormat,//时间类型：1-yyyy-MM-dd hh:mm:ss 2-yyyy-MM-dd
						canDisplayName:item.canDisplayName,//列表是否显示名称
						parameter:item.parameter,//面板控件变量
						selectShowType:item.selectShowType || 3,//选择框展示类型1=树，2=列表，3=树和列表
						valueFieldType:item.valueFieldType, //label取值
						selectListTabId:item.selectListTabId,//数据选择框弹出列表
						dataFormat: item.dataFormat,//数据格式
						placeholderText:item.placeholderText,//提示
						tooltipText:item.placeholderText,//悬浮提示
						triggerSign:item.triggerSign || 0,//区分触发器新旧逻辑
					}
					//如果是多选框控件，添加属性isMultiple为1
					if(ELEMENT_MULTIPLE.indexOf(baseType) !== -1) feild.isMultiple = true
					if(baseType===42){//是子面
						childMobilTable.push(feild)
						return
					}
					if(item.url) feild.url = item.url //图片展示的url
					if(item.relationColumnName === "id") primaryKey = item.id//是否为主键控件
					
					//是否需要跳转菜单或者面板
					if(ELEMENT_JUMPBUNDLE.indexOf(item.basetype) !== -1){
						let {
							jumpMenuList,//菜单列表
							jumpBundleId,// 跳转菜单
							jumpTabList,//面板列表
							relationTabId,//跳转面板
							passParam, //关联关系
							preconditions=''//条件
						} = item 
						jumpMenuList = jumpMenuList || [],jumpTabList = jumpTabList || []
						console.log("jumpMenuList===============================")
						if(baseType === 44){//如果是多面板按钮，默认没有菜单列表
							jumpTabList = [...jumpMenuList]
							jumpMenuList = []
						}
						//兼容单跳转的情况，如果有jumpBundleId需要添加到菜单列表中
						if(jumpBundleId) jumpMenuList.push({jumpBundleId,passParam,preconditions})
						//兼容单跳转的情况，如果有relationTabId需要添加到面板列表中
						if(relationTabId) jumpTabList.push({relationTabId,preconditions}) 
						feild.jumpMenuList = jumpMenuList//
						feild.jumpTabList = jumpTabList
					}
					//组合组件
					let elementCombinationInfoList = []
					combinationInfoList = combinationInfoList || []
					for(let i = 0,len = combinationInfoList.length;i<len;i++){
						let relationElement = elementList.find( elementParam => elementParam.id === combinationInfoList[i].relationElementId)
						elementCombinationInfoList.push({
							elementId:combinationInfoList[i].relationElementId,//控件
							colorCode:combinationInfoList[i].colorCode,//颜色
							displayName:combinationInfoList[i].displayName,
							mainColumnName:relationElement.mainColumnName
						})
					}
					feild.combinationInfoList = elementCombinationInfoList//组合组件
					
					//是否便捷搜索，0-否 1-是
					if(item.quickQuery){
						let quickQueryParam = {
							elementId:item.id,
							mainTableName:item.mainTableName,//实体表
							mainColumnName:item.mainColumnName,//实体表字段
							relationColumnName:item.relationColumnName,//业务表字段
							relationTableName:item.relationTableName//业务表
						}
						searchInfo.quickQueryParams[item.id] = quickQueryParam
					}
					
					//过滤器遍历，如果过滤器中存在全局变量的，查找数据时需要转化数据
					let filters = filterMap[item.id] || [],
						elementFilterParams = {}
					filters.map( (item, index, filters) => {
						//如果以@@开头的说明是需要转化的
						const asqlValue = item.asqlValue,
							  patt1 = /^@@/;
						if(item.asqlValueType==2 && patt1.exec(asqlValue)){//如果为变量，且以@@开头
							filterParams[asqlValue] = ""
							elementFilterParams[asqlValue] = ""
						}else if(item.asqlValueType==3){ //sql
							let sqlParams = _this.Static_GlobalFucs.getSQLParams(asqlValue)
							let oldSqlParams = filterSQLParams[feild.elementId] || []
							filterSQLParams[feild.elementId] = [...oldSqlParams, ...sqlParams]
						}
					})
					feild.elementFilterParams = elementFilterParams//当前控件中的过滤器变量
					
					let isSelect = [...ELEMENT_SELECT,...ELEMENT_RADIO].indexOf(baseType) //是否为下拉控件
					let static_btnElementsIndex = static_btnElementsInfo.findIndex( item => item.basetype == baseType)//是否为按钮控件
					let static_comboBoxElementIndex = ELEMENT_COMBOX.indexOf(baseType)//是否需要放于右侧菜单中
					if(isSelect !== -1 && item.mainTableName){//为下拉控件和单选框
						let selectParams = {
							baseType:item.baseType,
							elementId:item.id,
							dataSource:item.mainTableName,//实体表
							relationTableName:item.relationTableName,//业务表
							columnName:item.mainColumnName,//实体表字段
						}
						if(feild.elementFormat===2){//级联下拉框
							cascadeSelects.push(selectParams)
						}else{
							commonSelects.push(selectParams)
						}
						let static_downElementCor = static_downElementsCor[isSelect]
						if(static_downElementCor !== "") listIcon[static_downElementCor] = item.id
						
						newelementList.push(feild)
					}else if(static_btnElementsIndex !== -1){//为按钮控件
						let static_btnElement = static_btnElementsInfo[static_btnElementsIndex]
						feild.btnStyle = static_btnColors[static_btnElement.btnStyleType] //按钮样式
						feild.iconfont = static_btnElement.iconfont //按钮图标
						feild.executeCondition = item.executeCondition || ''
						feild.defaultConditions = item.defaultConditions
						static_btnElement.positon === 'top' ? btnList.topRightBtn.push(feild) : btnList.bottomBtn.push(feild)
					}else if(static_comboBoxElementIndex !== -1){//是否需要放于右侧菜单中
						btnList.comboBox.push(feild)
					}else if(baseType === 14 || baseType === 33 || baseType === 48){//模糊搜索框、高级筛选框、设备盘点扫描框
						const isVisiable = feild.visiabled
						if(isVisiable){
							searchInfo.isSearch = true
							switch(baseType){
								case 14: //是否显示模糊搜索
									searchInfo.isQuickQuery = true;
									break;
								case 33://是否显示高级搜索
									searchInfo.isSeniorFilter = true;
									break;
								case 48://是否显示设备盘点扫描框
									searchInfo.isDeviceScan = true;
									break;
								default:
									break;
							}
						}
					}else if(baseType === 8){//图片上传
						feild.typeId = item.typeId
						feild.stateId = item.stateId
						feild.priorityId = item.priorityId
						feild.waterMarkId = item.waterMarkId
						newelementList.push(feild)
					}else if(baseType === 37){//汇总
						feild.baseType = baseType
						feild.iconName = item.iconName
						feild.colorCode = item.colorCode
						feild.bundlePramDto = item.bundlePramDto
						feild.globalTotalVars = item.globalTotalVars
						newelementList.push(feild)
					}else if(baseType === 38 ){//图标控件
						feild.baseType = baseType
						feild.chartList = item.chartList
						newelementList.push(feild)
					}else{
						newelementList.push(feild)
					}
				})
				
				//过滤条件遍历，如果过滤条件中存在全局变量的，查找数据时需要转化数据
				let advancedQuery = advancedQueryMap[mobileTabDtoId] || [],
					queryParams = {},
					sqlQueryParams = []
				if(mobileTabDto.showType == 2){
					//如果面板展示类型为表单的，
					//默认只能配置字段为id的过滤条件
					//如果为变量，且是以@@开头的作为变量处理，否则为id的常量值
					let advanced = advancedQuery.find(item=>item.asqlColumnName=='id')
					if(advanced){
						const asqlValue = advanced.asqlValue,
							  patt1 = /^@@/;
						if(advanced.asqlValueType==2 && patt1.exec(asqlValue)){
							queryParams[asqlValue] = ""
						}else{
							queryParams[asqlValue] = ""
						}
					}
				}else{
					//asqlValueType只有类型为2（变量）才进行转化
					advancedQuery.map( (item, index, advancedQuery) => {
						//如果以@@开头的说明是需要转化的
						const asqlValue = item.asqlValue,
							  patt1 = /^@@/;
						if(item.queryType === 1 && item.asqlValueType==2 && patt1.exec(asqlValue)){
							queryParams[asqlValue] = ""
						}else if(item.queryType === 2){
							let apiSql = item.apiSql
							if(apiSql) sqlQueryParams = _this.Static_GlobalFucs.getSQLParams(apiSql)
						}
					})
				}
				
				if(mobileTabDto.mainTab === 1) mainTabID = mobileTabDto.id //mainTab：1面板设置为主页
				const {
					id:mobileTabId, name:mobileTabName, basetype:mobileTabType, showType:mobileTabShowType,
					relationTableName:mobileTabSource, relationTabId:mobileTabRelationTabId,
					relationColumn, fileRelationParam, fileRelationTableName, fileRelationColumnName, tableGroupName, dataSourceType, commonApiHeaderId,jumpUrl
				} = mobileTabDto
				
				//如果数据来源为接口，且有接口id
				let interfaceInParam = {}
				if(dataSourceType === 2 && commonApiHeaderId) {
					await sourceInterface_getInParamByTab({
						commonApiHeaderId,
						mobileTabId
					},_this).then( interfaceIn => {
						interfaceIn.map( item => {
							interfaceInParam[item.paramKey] = item.initValue
						})
					})
				}
				mobileTabs[mobileTabId] = {
					primaryKey:primaryKey,//面板主键
					jumpUrl,//外部页面地址
					dataSourceType,//面板数据来源类型 1-数据；2-接口
					commonApiHeaderId,//接口id
					interfaceInParam,//接口对应的输入参数
					mobileTabId,//面板id
					mobileTabName,//面板名称
					mobileTabType,//面板类型
					mobileTabShowType,//面板展示类型
					mobileTabSource,//数据源
					mobileTabRelationTabId,//面板关联面板
					relationColumn,// 关联主业务表字段
					fileRelationParam,//资料关联值
					fileRelationTableName,//资料关联表名
					fileRelationColumnName,//资料关联字段
					tableGroupName,//资料关联分组表名
					elements:newelementList,//页面元素
					btnList:btnList,//按钮原生
					quickQuery:searchInfo,//便捷搜索
					commonSelects:commonSelects,//下拉框
					cascadeSelects:cascadeSelects,//级联下拉框
					advancedQuery:queryParams,//过滤条件中需要转化变量key
					advancedSqlQuery:sqlQueryParams,//过滤条件中需要转化SQL中的key
					filterParams:filterParams,//过滤器中需要转化的key
					filterSQLParams:filterSQLParams,//过滤器中带有sql变量的控件
					listIcon:listIcon,//图标属性
					childMobilTable:childMobilTable,
					showType:mobileTabDto.showType,
				}
			}
			
			let bundleIdInfo = {
				mainTabID:mainTabID,
				mobileTabs:mobileTabs,
				triggerMap:triggerMap
			}
			uni.setStorageSync(params.bundleId,bundleIdInfo)
			return bundleIdInfo
		})
		.catch(err => {
			console.log(err)
		})
	},
	// 登录日历数据
	calendarGetData(_this, params = {}) { 
		try {
			// 不修改请求头
			return _this.$http.post(Path.calendarGetData, params)
			.then(res => {
				let result = res.data
				if(result.success){
					const data = result.data || []
					let calendarData = []
					data.map((item)=>{
						let dateData = item.dates
						const _date = new Date(dateData),
							  year = _date.getFullYear(), 
							  month = _date.getMonth() + 1,
							  date = _date.getDate(),
							  total = item.counts
						let param = {
							year,
							month,
							date,
							total
						}
						calendarData.push(param)
					})
					return calendarData
				}else{
					return []
				}
			})
			.catch(err => {
				uni.showToast({ title: err, icon: "none" });
			})
		} catch (error) {
			console.error('error:',error)
		}
	},
	// 获取我的页面配置
	
	getSelectInfo(_this){
		
		// _this.$http.post('pcHomePageConfig/selectInfo')
		_this.$http.post('pcHomePageConfig/selectAppline')
		.then(res => {
			const result = res.data.data;
			let enabledData = {
				enabledPersonalQualification: result.enabledAppPersonal,
				enabledSystemVersion: result.enabledAppSystemVersion,
				enabledAccountInformation: result.enabledAppAccountInfo,
				enabledAccountSecuritySettings: result.enabledAppAccount,
				enabledClearCache: result.enabledClearCache,
				enabledFeedback: result.enabledFeedback,
				enabledLanguageSwitchButton: result.enabledAppLanguage,
				enabledLogout: result.enabledLogout,
				enabledMyQRCode: result.enabledMyQRCode,
				enabledThirdPartyLinks:result.enabledAppThirdPartyLinks,
			}
			store.commit("home/SET_SELECT_INFO",enabledData)
		})
		.catch(err => {
			console.log(JSON.stringify(err))
		});
	},
	//获取角标
	getCountBySql(_this,bundleIds,bundleSqlsGlobalMap){
		_this.$http.post('currency/currencyGetCountBySql',{bundleIds: bundleIds,globalMap: bundleSqlsGlobalMap})
		.then(res => {
			const result = res.data.data;
			store.commit("home/SET_COUNT_SQL",result)
			uni.setStorageSync("bundleSqls",null)
		})
		.catch(err => {
			_this.Static_GlobalFucs.showModal(_this,{
				title:_this.$i18nMsg("basic-modalTip"),
				content:err || "操作失败",
				showCancel:false
			})
			return {success:false} 
		});
	},
}

export default Home