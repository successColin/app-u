<template name="calendar">
	<view class="calendar-page" :class="[themeClass_]">
		<m-back-bar backStyle="backStyleNoBack" >  <!-- 顶部返回组件，已经作为全局组件可以直接调用 class="calendar-page-header" -->
			<block slot="barTitle">{{barTitle}}</block>
			<block slot="barRight">
				<m-button :isFontBtn="true" @elementClick="showConditionList()" style="display: inline-block; margin-right: 15px; color: white;">
					<block slot="buttonIcon">
						<m-font-icon icon="iconyewushaixuan2" :iconSize="40"></m-font-icon>
					</block>
				</m-button>
				<m-button :isFontBtn="true" @elementClick="hangdleChangeType()" style="display: inline-block; margin-right: 10px; color: white;">
					<block slot="buttonIcon">
						<m-font-icon icon="iconzhouyueqiehuan" :iconSize="40" style="backgroun: white;"></m-font-icon>
					</block>
				</m-button>
			</block>
		</m-back-bar>
		<!-- 插入模式 -->
		<view class="calendar-page-content">
			<uni-calendar ref="calendar" :insert="true" showType="day" class="uniCalendar"
				:otherParams="calendarOtherParams"
				:isVisiabled="false"
				@changeType="changeCalendarType"
				@change="handleClickDate">
			</uni-calendar>
			<view  class="calendar-page-data">
				<scroll-view scroll-y class="calendar-page-data-scroll">
					<block v-for="(item, index) in calendarContent" :key='index'>
						<view class="calendar-page-group"  v-if="isShows[item.mobileTabId] && calendarBundle[item.bundleId].checked">
							<view class="title">{{ calendarBundle[item.bundleId].text }}</view>
							<view class="list-data">
								<ListCom :tabInfo="item.tabInfo" 
								 :ref="item.bundleId"
								 :listConfig = "listConfig(item.listConfig)" 
								 :showNoData="false"
								 @clickList="clickList">
								</ListCom>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
		<m-plain-list ref="conditionList" 
			:insert="false" 
			:multiple="true" 
			:config="conditionConfig" 
			:showColumns="listShowColumns"
			:alreadyCheckId="checkConditionData.join(',')"
			@onConfirm="handleCondition"></m-plain-list>
	</view>
</template>

<script>
	import bus from '@/static/js/bus'
	import uniCalendar from '@/components/plugin/calendar/uni-calendar.vue'
	import ListCom from '@/components/makeup/list/ListCom.vue'
	import mPlainList from '@/components/makeup/m-plainList.vue'
	
	import {homeApi} from '@/common/request/api.js'
	import { mapState, mapMutations } from 'vuex'
	import { mobileTabShowType } from '@/common/constant/constant.js'
	import ClassList from '@/static/js/ClassList.js'
	let listTem = new ClassList()
	export default {
		components: {uniCalendar,ListCom,mPlainList},
		props:{
			barTitle:{
				type:String,
				default:'日历'
			}
		},
		data() {
			return {
				listShowColumns:["text"],
				conditionData:[],
				checkConditionData:[],
				calendarContent:[],
				bundleIds:[],
				date:"",
				fulldate:"",
				showType:"day",
				isShows:{}
			}
		},
		computed: {
			...mapState("home", {
				newBundle:'newBundle',
				calendarBundle:'calendarBundle'
			}),
			...mapState("common", ["templateParams","tabsElements","tabsFormDatas"]), //面板参数
			calendarOtherParams(){
				return {ids:this.checkConditionData.join(",")}
			},
			conditionConfig(){
				return {defaultLoad:false,listData:this.conditionData}
			},
			listConfig(){
				return function(baseConfig){
					if(this.fulldate) {
						baseConfig.otherParams.calendarList[0].value = this.fulldate
					}  
					return baseConfig
				}
			},
			...mapState(["themeColor"]),
			themeClass_(){//与主题she检修关联
				const mainColor = ["mainColor","whiteColor"]
				return this.themeColor !=='red' ? ("mainColor-" + this.themeColor) : 'mainColor'
			}
		},
		methods: {
			...mapMutations(["SET_BusinessID","SET_bundle"]),
			...mapMutations("home",["SET_CALENDAR_BUNDLE"]),
			...mapMutations("form", ["SET_ALLBTNS"]),
			...mapMutations("common",["SET_TEMPLATE_PARAMS","SET_TABS_ELEMENT"]),//设置面板变量
			clickList(params){
				const _this = this
				if(!params.mobileTabRelationTabShowType) return 
				//设置主业务id
				const node = params.listItem || {},
					  primaryKey = params.primaryKey
				let businessID = node[primaryKey] || ""
				try{
					businessID = JSON.parse(businessID)
				}catch(e){}
				if(businessID && typeof businessID === "object"){
					businessID = businessID.id
				}
				this.SET_BusinessID(businessID)
				//如果有bundleId传递过来默认显示
				this.SET_bundle({bundleId:params.bundleId})
				
				let static_mobileTabShowType = mobileTabShowType[params.mobileTabRelationTabShowType]
				this.SET_TEMPLATE_PARAMS({//设置下一个面板的参数
					tabId:params.mobileTabRelationTabId,
					params:{
						relationTab:params.mobileTabRelationTabId,
						bundleId:params.bundleId,
						id:businessID,
						onkey:`listReload${this._uid}`,
						refreshParams:{key:params.bundleId}
					}
				})
				let url = `/pages/${static_mobileTabShowType}?relationTab=${params.mobileTabRelationTabId}`
				uni.navigateTo({
					url:url 
				})
			},
			getCalendarData(){
				if(this.checkConditionData.length===0) return 
				let selectDate = this.$dateFormat.formatDate(this.fulldate, "yyyy-MM-dd hh:mm:ss")
				let params = {
					dateType:1,
					ids:this.checkConditionData.join(","),
					selectDate:selectDate
				}
				
				if(this.showType==="day"){
					params.dateType=2
				}
				homeApi.calendarGetData(this, params)
			},
			changeCalendarType(type){//改变日历显示周期，1周；1月
				this.showType = type
			},
			handleCondition(e){//选择显示bundle
				let checkNodes = e,
					checkConditionData = [],
					calendarBundles = uni.getStorageSync("calendarBundles") || {}
				
				for(let i = 0,len=checkNodes.length;i<len;i++){
					const bundleId = checkNodes[i].id
					checkConditionData.push(bundleId)
				}
				this.checkConditionData = checkConditionData
				
				for(let i = 0,len=this.conditionData.length;i<len;i++){
					const bundleId = this.conditionData[i].id
					let checked = false
					if(checkConditionData.indexOf(bundleId) !==-1){
						checked = true
					}
					
					const check = {
						checked:checked
					}
					let calendarBundle = {...this.conditionData[i],...check}
					calendarBundles[bundleId] = calendarBundle
					this.SET_CALENDAR_BUNDLE({
						bundle:bundleId,
						calendarBundle:calendarBundle
					})
				}
				//将日历bundle存入bundlePermissiones缓存种
				uni.setStorageSync("calendarBundles",calendarBundles)
				this.$refs.calendar.getCalendarData({
					ids:this.checkConditionData.join(",")
				})
			},
			showConditionList(){
				this.$refs.conditionList.show()
			},
			handleClickDate(e){//时间改变
				if(e.type==="selectDays"){//如果选择了日期重新获取数据
					let time = e.fulldate
					this.fulldate = e.fulldate
					this.date = time
				}
				for(let key in this.calendarBundle){
					const calendarSearchColumn = this.calendarBundle[key].calendarSearchColumn
					const value = this.calendarBundle[key]
					const query = {
						value:e.fulldate,
						tableName:'',
						elementId:'',
						field:calendarSearchColumn
					}
					if(value.checked) this.$refs[key] && this.$refs[key][0].doSearch && this.$refs[key][0].doSearch({calendarList:[query]})
				}
			},
			setPageInfo(mobileTabs,bundleId){//根据relationTab取具体面板信息
				const relationTab = mobileTabs.mainTabID
				if(!relationTab) return
				
				const _this = this
				const mobileTab = mobileTabs.mobileTabs
				let  mobileTabsBYRelation = mobileTab[relationTab],
					 mobileTabRelationTab = mobileTab[mobileTabsBYRelation.mobileTabRelationTabId] || {}
				
				//设置列表参数
				const queryParams = listTem.advancedParams(this,{
					advancedQuery:mobileTabsBYRelation.advancedQuery || {},//过滤条件中需要转化的变量
					advancedSqlQuery:mobileTabsBYRelation.advancedSqlQuery || [],//sql中的变量
					relationMainTab:""
				})//获取过滤条件中的变量
				const listConfig = {},
					  calendarSearchColumn = this.calendarBundle[bundleId].calendarSearchColumn
				listConfig.otherParams = {//列表额外参数，过滤条件中设置的参数
					globalMap:queryParams.advancedQuery,
					globalQueryMap:queryParams.advancedSqlQuery,
					mobileTabId:relationTab,
					elementList:mobileTabsBYRelation.elements,
					mobileTabSource:mobileTabsBYRelation.mobileTabSource,
					calendarList:[{
						field:calendarSearchColumn,
						value:this.$dateFormat.formatDate('', "yyyy-MM-dd"),
						tableName:'',
						elementId:''
					}]
				}
				listConfig.baseParams = {//列表基本参数
					hasIcon:true,
					listIcon:mobileTabsBYRelation.listIcon || {},
				}
				listConfig.goEventParams = {//列表点击返回参数
					primaryKey:mobileTabsBYRelation.primaryKey,
					mobileTabRelationTabId:mobileTabsBYRelation.mobileTabRelationTabId,
					mobileTabRelationTabShowType:mobileTabRelationTab.mobileTabShowType,
					bundleId:bundleId
				}
				listConfig.url = "currencyGetListData"
				
				//定义面板信息
				let tabInfo = {
					_uid:this._uid,
					bundleId:bundleId,
					mobileTabId:relationTab,
					relationMainTab:"",
					mobileTabs:mobileTabs.mobileTabs,
					trigger:mobileTabs.triggerMap || {}
				}
				
				this.calendarContent.push({
					bundleId:bundleId,
					mobileTabId:relationTab,
					listConfig:listConfig,
					tabInfo:tabInfo
				})
				
				//延迟显示列表
				this.isShows[relationTab] = true
				
				this.SET_ALLBTNS({//设置按钮
					tabId:relationTab,
					bottomBtns:mobileTabsBYRelation.btnList.bottomBtn,
					topRightBtns:mobileTabsBYRelation.btnList.topRightBtn
				})
				this.SET_TABS_ELEMENT({//设置面板控件
					tabId:relationTab,
					elements:mobileTabsBYRelation.elements
				})
			},
			getMobileTabs(){
				const bundleIds = this.bundleIds,
					  _this = this
				for(let i = 0,len=bundleIds.length;i<len;i++){
					const bundleId = bundleIds[i]
					let  mobileTabs = uni.getStorageSync(bundleId),
						 isNew = _this.newBundle[bundleId]
					if(!mobileTabs || JSON.stringify(mobileTabs) === "{}" || isNew) {
						//如果对应的bundle没有面板信息重新通过接口进行获取
						homeApi.getPage(_this,{
							bundleId:bundleId
						})
						.then(value => {
							_this.setPageInfo(value,bundleId)
						})
					}else{
						_this.setPageInfo(mobileTabs,bundleId)
					}
				}
			},
			hangdleChangeType(){
				this.$refs.calendar.hangdleChangeType();
			},
		},
		created() {
			//设置时间
			let time = this.$dateFormat.formatDate('', "yyyy-MM-dd")
			time = time.replace(/-/g,"/")
			// this.fulldate = time
			this.date = new Date(time).getTime()
			
			this.bundleIds = Object.keys(this.calendarBundle)
			this.getMobileTabs()
			//设置已经选中的点
			let checks = []
			this.conditionData = []
			for(let key in this.calendarBundle ){
				this.conditionData.push(this.calendarBundle[key])
				if(this.calendarBundle[key].checked){
					checks.push(this.calendarBundle[key].id)
				}
			}
			this.checkConditionData = checks
			
			//设置监听
			let onKey = `listReload${this._uid}`
			const _this = this
			bus.$on(onKey, (params) => { //reload
				_this.$refs[params.key][0].getListData("reload")
			})
		},
		beforeDestroy () {
			//注销前先解绑监听
			let onKey = `listReload${this._uid}`
			bus.$off(onKey);
		}
	}
</script>
<style>
	.uniCalendar{
		width: 100%;
		background: #fff;
		box-shadow:0px 0px 10px 0px rgba(0,0,0,0.1);
		border-radius:4px;
	}
</style>