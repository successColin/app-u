import {listApi, commonApi} from '@/common/request/api.js'

import {TRIGGRT_BaseValue, TRIGGRT_GetRule} from '@/common/functions/trigger.js';
import {ELEMENT_SCAN} from '@/common/functions/element.js'
import {NO_SUBMIT_ELEMENT_TYPE,NO_CHECK_ELEMENT_TYPE, ELEMENT_SEARCHDATA} from '@/common/constant/element.js';
import {FRAMS_SHOWTYPE} from '@/common/constant/frams.js';
class FormCom {
	/**控件弹出面板
	 * @param {Object} element 控件属性
	 * @param {Object} params 
	 *  {Number} mobileTabId 面板id
	 *  {Number} bundleId 菜单id
	 *  {Number} mobileTabShowType 面板展示类型
	 * @param {Object} _this
	 */
	elementRelationTab(element,params,_this){
		const { mobileTabShowType, mobileTabId, bundleId, mobileTabsBYRelation } = params
		//如果没有面板展示类型不进行跳转
		if(!mobileTabShowType) return
		
		const {relationTabId} = element
		let tabParams = {//设置下一个面板的参数
			tabId:relationTabId,
			params:{
				relationTab:relationTabId,
				relationMainTab:mobileTabId,
				onkey:"",
				bundleId,
			}
		}
		_this.SET_TEMPLATE_PARAMS(tabParams) //设置下一个面板的参数

		let static_mobileTabShowType = FRAMS_SHOWTYPE[mobileTabShowType],
				childMobilTable = mobileTabsBYRelation.childMobilTable||[]
		if(mobileTabShowType===2 && childMobilTable.length>0) static_mobileTabShowType = 'templates/formListTemplate'
		_this.Static_GlobalFucs.gotoOtherRoute(tabParams,static_mobileTabShowType)

	}
	checkedDateRange(param,_this){//验证时间区间
		const jsFunctionList = param.jsFunctionList || [],
			  start = jsFunctionList.find( item => item.param === "startTime") || {},
			  end = jsFunctionList.find( item => item.param === "endTime") || {}
		
		let startTime = {},endTime = {}
		const basicConfig = {
			mobileTabId:param.mobileTabId,
			tabsElements:_this.tabsElements,
			tabsFormDatas:_this.tabsFormDatas,
		}
		if(start.valueType === 2) {
			let startConfig = basicConfig
			startConfig.key = start.paramValue
			startTime = _this.Static_GlobalFucs.Global_ParamFormat(startConfig,_this) 
		}else {
			startTime.id = start.paramValue
			startTime.lable = start.paramValue
		}
			
		if(end.valueType === 2){
			let endConfig = basicConfig
			endConfig.key = end.paramValue
			endTime = _this.Static_GlobalFucs.Global_ParamFormat(endConfig,_this) 
		}else{
			endTime.id = end.paramValue
			endTime.lable = end.paramValue 
		}
		
		let rangeParam = {},errorMsg=""
		rangeParam[param.element.elementId] = param.value
		const checkRes = _this.Static_GlobalFucs.checkForm({
			rule:[{
				name:param.element.elementId, 
				checkType : "dateRange", 
				checkRule:`${startTime.id || ''},${endTime.id || ''}`,  
				errorMsg:`${param.element.label || ''},${startTime.element ? startTime.element.label : startTime.id},${endTime.element ? endTime.element.label : endTime.id}`,
			}],
			data:rangeParam
		})
		
		if(!checkRes.isCheck) {
			_this.Static_GlobalFucs.showToast({title:checkRes.errorMsg})
			_this.elementValue = startTime.id || endTime.id
			_this.showContent = startTime.id || endTime.id
		}
		return checkRes.isCheck
	}
	checkedNumberRange(param,_this){//验证数字区间
		const jsFunctionList = param.jsFunctionList || [],
			  start = jsFunctionList.find( item => item.param === "min") || {},
			  end = jsFunctionList.find( item => item.param === "max") || {}
		
		let minNumber = {},maxNumber = {}
		const basicConfig = {
			mobileTabId:param.mobileTabId,
			tabsElements:_this.tabsElements,
			tabsFormDatas:_this.tabsFormDatas,
		}
		if(start.valueType === 2) {
			let startConfig = basicConfig
			startConfig.key = start.paramValue
			minNumber = _this.Static_GlobalFucs.Global_ParamFormat(startConfig,_this) 
		}else {
			minNumber.id = start.paramValue
			minNumber.lable = start.paramValue
		}
			
		if(end.valueType === 2){
			let endConfig = basicConfig
			endConfig.key = end.paramValue
			maxNumber = _this.Static_GlobalFucs.Global_ParamFormat(endConfig,_this) 
		}else{
			maxNumber.id = end.paramValue
			maxNumber.lable = end.paramValue 
		}
		
		let rangeParam = {},errorMsg=""
		rangeParam[param.element.elementId] = param.value
		const checkRes = _this.Static_GlobalFucs.checkForm({
			rule:[{
				name:param.element.elementId, 
				checkType : "numberRange", 
				checkRule:`${minNumber.id || ''},${maxNumber.id || ''}`,  
				errorMsg:`${param.element.label || ''},${minNumber.element ? minNumber.element.label : minNumber.id},${maxNumber.element ? maxNumber.element.label : maxNumber.id}`,
			}],
			data:rangeParam
		})
		
		if(!checkRes.isCheck) {
			_this.Static_GlobalFucs.showToast({title:checkRes.errorMsg})
			_this.elementValue = minNumber.id || maxNumber.id
			_this.showContent = minNumber.id || maxNumber.id
		}
		return checkRes.isCheck
	}
	//获取过滤条件中的值
	getFilterParam(params, _this){
		let filterSQL = {}
		const basicConfig = {
			otherTabId:params.relationMainTab,
			mobileTabId:params.mobileTabId,
			tabsElements:_this.tabsElements,
			tabsFormDatas:_this.tabsFormDatas,
		}
		for(let i = 0, len = params.filterSQLParams.length;i<len;i++){
			let key = params.filterSQLParams[i]
			let paramConfig = basicConfig
			paramConfig.key = key
			let value =  _this.Static_GlobalFucs.Global_ParamFormat(paramConfig,_this)
			if(value && typeof value === "object"){
				value = value.id
			}
			filterSQL[key] = value || ''
		}
		for(let key in params.elementFilterParams){
			let paramConfig = basicConfig
			paramConfig.key = key
			let value =  _this.Static_GlobalFucs.Global_ParamFormat(paramConfig,_this)
			if(value && typeof value === "object"){
				value = value.id
			}
			filterSQL[key] = value || ''
		}
		
		return filterSQL
	}
	/**数据框选择数据
	 * @param {Object} element 数据框属性
	 * @param {Object} _this
	 */
	selectSearchData(element,params,_this){
		let url = `/pages/common/panelTemplate?elementId=${element.elementId}`
		const {filterSQLParams, elementFilterParams, relationMainTab, mobileTabId, selectListTabId} = params,
					{elementId,label,mainTableName,selectShowType,elementMultiRelation, isMultiple} = element
		if(selectListTabId){//如果有弹出列表默认走弹出列表逻辑；isMultiple-是否多选
			url = `/pages/common/panelConfigTemplate?relationTab=${selectListTabId}`
			params.relationMainTab = mobileTabId
			params.mobileTabId = selectListTabId
			params.isMultiple = isMultiple
			_this.SET_TEMPLATE_PARAMS({//设备面板初始参数;
				tabId:selectListTabId,
				params
			})
		}else{
			params.panelTitile = label,params.mainTableName = mainTableName,params.selectShowType = selectShowType,
			params.elementMultiRelation = elementMultiRelation,
			//过滤实体过滤器中的变量
			params.globalMap = this.getFilterParam({filterSQLParams,elementFilterParams,relationMainTab,mobileTabId}, _this)
			params.isMultiple = isMultiple
			_this.SET_PANEL_PARAMS({elementId,params})
		}
		uni.navigateTo({
			url:url
		})
	}
	
	/**扫描
	 * @param {Object} element
	 * @param {Object} _this
	 */
	scanSearchData(element, params, _this){
		ELEMENT_SCAN({}, (option)=>{
			const result = option.scancode
			if(result){
				const {isMultiple, elementId, mainTableName, qrCode} = element
				let param = {
					dataSource:mainTableName,
					keycode:result,
					elementId:elementId,
					columnName:qrCode || 'keycode'
				}
				//过滤实体过滤器中的变量
				const {filterSQLParams, elementFilterParams, relationMainTab, mobileTabId,
					     elementValue:oldElementValue} = params
				param.globalMap = this.getFilterParam({
					filterSQLParams,//SQL变量
					elementFilterParams,//变量
					relationMainTab,
					mobileTabId
				}, _this)
				listApi.getScanDate(_this,param).then(value => {
					if(!value.id) {
						let content = `${element.label}扫描结果:${param.columnName}:${result}不存在或没有权限！`
						uni.showModal({
							title:_this.$i18nMsg("basic-inquiry"),
							content:content,
							cancelText:_this.$i18nMsg("basic-cancel"),
							confirmText:_this.$i18nMsg("basic-confirm"),
						})
						return 
					}
					let scanValue = value.id
					if(isMultiple){//如果是多选框
						let multipleValueArry = oldElementValue.split(",")
						if(multipleValueArry.indexOf(scanValue) === -1) multipleValueArry.push(scanValue)
						scanValue = multipleValueArry.join(",")
					}
					let changeParam = {element:element,value:scanValue,triggerBaseType:3}
					_this.elementValueChang(changeParam)
				})
			}
		})
	}
	//获取计算属性规则
	getRule(config={},rule,_this){
		//有计算属性的设置校验方法
		const elementId = config.elementId,
			  mobileTabId = config.mobileTabId,
			  triggers = config.triggers[elementId] || [],
			  jsFncList = triggers.filter( item => item.basetype === 5 && item.triggerType===4) || [],
			  jsFunctionList = jsFncList.length > 0 ? jsFncList[0].jsFunctionList : []
		
		if(jsFunctionList.length>0){
			const jsFunctionListType = jsFunctionList[0].functionType
			let start = '',//最小值
				end = ''//最大值
			const basicConfig = {
				mobileTabId:mobileTabId,
				tabsElements:_this.tabsElements,
				tabsFormDatas:_this.tabsFormDatas,
			}
			
			let minValue = {},maxValue = {},type=""
			if(jsFunctionListType === 1){//时间区间
				type = 'dateRange'
				start = jsFunctionList.find( item => item.param === "startTime") || {},
				end = jsFunctionList.find( item => item.param === "endTime") || {}
			}else if(jsFunctionListType === 2){//数字区间
				type = 'numberRange'
				start = jsFunctionList.find( item => item.param === "min") || {},
				end = jsFunctionList.find( item => item.param === "max") || {}
			}
			
			if(start.valueType === 2) {
				let startConfig = basicConfig
				startConfig.key = start.paramValue
				minValue = _this.Static_GlobalFucs.Global_ParamFormat(startConfig,_this) 
			}else {
				minValue.id = start.paramValue
				minValue.lable = start.paramValue
			}
				
			if(end.valueType === 2){
				let endConfig = basicConfig
				endConfig.key = end.paramValue
				maxValue = _this.Static_GlobalFucs.Global_ParamFormat(endConfig,_this) 
			}else{
				maxValue.id = end.paramValue
				maxValue.lable = end.paramValue 
			}
			if(rule && rule.checkType) type = rule.checkType + ',' +type
			let jsFRules = {
				name:elementId,
				label:config.label || '',
				checkType : type, 
				checkRule:`${minValue.id || ''},${maxValue.id || ''}`,  
				errorMsg:`${config.label || ''},${minValue.element ? minValue.element.label : minValue.id},${maxValue.element ? maxValue.element.label : maxValue.id}`,
			}
			if(rule) rule = {...rule,...jsFRules}
			else rule = jsFRules
			
		}
		return rule
	}
	/**表单数据转化
	 * @param {Aarry} elements 表单控件
	 * @param {Object} formData //表单数据
	 */
	getFormData(elements, formData, config = {}, _this){
		let formDatas = {},
			submitData = {},
			rules = [],
			mobileTabId = config.mobileTabId
		elements.map(item => {
			const {baseType, elementFormat, elementId} = item
			//设置验证规则，可见且不是区间
			if(NO_CHECK_ELEMENT_TYPE.indexOf(baseType) === -1 && item.visiabled && item.dataFormat !== 1){
				let rule = TRIGGRT_GetRule(item,_this.$i18nMsg)
				config.elementId = elementId
				config.label = item.label
				rule = this.getRule(config,rule,_this) //获取计算属性校验规则todo
				if(rule) rules.push(rule)
			}
			
			if(NO_SUBMIT_ELEMENT_TYPE.indexOf(baseType) !== -1) return false //不提交的控件不不处理
			const value = formData[elementId]
			let param = null,
				name = item.name
			if(baseType === 8){
				param = value || []
				if(elementFormat === 2){//如果上传的是base64
					if(value && typeof value === "object" ) submitData[name] = value.id || ''
					else submitData[name] = value || ""
				}else{
					submitData["static_fileIds"] = formData.static_fileIds
				}
			}else if(value){
				param = value.id
				//是否多行插入，如果存在多选插入（baseType：[3,12,25,45] elementFormat=1）
				if(ELEMENT_SEARCHDATA.indexOf(baseType) !== -1 && elementFormat === 1){
					submitData.static_elementId = elementId //多选插入控件id
					submitData.static_ids = value.id
				}else{
					submitData[name] = value.id
				}
				
			} 
			if(name==='orgid' && !submitData[name]) submitData[name] = -1 //如果是orgid为0或者空默认为-1
			formDatas[elementId] = {
				baseType,
				value:param || "",
				name: name
			}
			
		})
		_this.SET_TABS_SUBFORMDATAS({
			tabId:mobileTabId,
			submitDatas:submitData
		})
		return {rules,formDatas}
	}
	/**表单校验
	 * @param {Aarry} rules 校验规则
	 * @param {Object} formData 校验数据，取值getFormData
	 * @param {Number} mobileTabId 面板id  
	 */
	verificationForm(rules=[], formData={}, mobileTabId, _this){
		if(!mobileTabId) return false
		let checkRes = {isCheck:true},
		    checkDatas = {}
		for (let key in formData) {
			checkDatas[key] = formData[key].value
		}
		checkRes = _this.Static_GlobalFucs.checkForm({
			rule:rules || [],
			data:checkDatas
		})
		_this.CHECKED_FLAG({//设置表单验证是否通过
			tabId:mobileTabId,
			flag:checkRes.isCheck
		})
		if(!checkRes.isCheck){
			_this.Static_GlobalFucs.showToast({title:checkRes.errorMsg})
			return false
		}else{
			return formData
		}
	}
	/**
	 * @param {Object} param
	 *  {Array} dropDownList 下拉框控件
	 *  {Number} relationMainTab 上个面板id
	 *  {Number} mobileTabId 面板id
	 *  {Object} filterParams 实体过滤器中的变量
	 */
	getSelectValues(param,_this){
		let params = {
			dropDownList:param.dropDownList,
			globalMap:{}
		}
		const basicConfig = {
			otherTabId:param.relationMainTab,
			mobileTabId:param.mobileTabId,
			tabsElements:_this.tabsElements,
			tabsFormDatas:_this.tabsFormDatas,
		}
		//实体过滤器中的变量
		for (let key in param.filterParams) {
			let paramConfig = basicConfig
			paramConfig.key = key
			let value =  _this.Static_GlobalFucs.Global_ParamFormat(paramConfig,_this)
			value = _this.Static_GlobalFucs.dataFormat(value)
			params.globalMap[key] = value.id || ""
		}
		return commonApi.currencyGetDropDown(_this, params)
	}
}

export default new FormCom()