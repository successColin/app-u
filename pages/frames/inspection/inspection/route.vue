<template>
	<view class="inspection-route">
		<m-back-bar>
			<block slot="barTitle">{{$i18nMsg("inspection-tallyRoute")}}</block>
			<block slot="barRight">
				<m-button 
					:isFontBtn="true" 
					btnClass="mainColor"
					v-if="!isSelectRoute"
					@elementClick="inspctionUpload">
					<block slot="buttonIcon" style="display: inline-block;">
						<m-font-icon icon="inspectionUpload" :iconSize="40"></m-font-icon>
					</block>
				</m-button>
				<m-button
					:isFontBtn="true" 
					btnClass="mainColor"
					v-if="isSelectRoute"
					>
					<block slot="buttonIcon" style="display: inline-block;">
						<checkbox-group @change="selectAll">
							<checkbox style="display: inline-block;" value="1" :checked="false" class="checkbox-all"/>
						</checkbox-group>
					</block>
				</m-button>
				<m-button
					:isFontBtn="true" 
					btnClass="mainColor"
					@elementClick="inspctionJumpDate">
					<block slot="buttonIcon" style="display: inline-block;">
						<m-font-icon icon="inspectionJumpDate" :iconSize="40"></m-font-icon>
					</block>
				</m-button>
			</block>
		</m-back-bar>
		<view class="route-search hasStatusTop">
			<input type="text" v-model="keywords" class="search" :placeholder="$i18nMsg('formTip-placeholder')"><!--中文:请输入关键字搜索-->
			<button class="search-btn" @click="handleSearch">
				<m-font-icon icon="iconsousuo" :iconSize="30" color="#9F9F9F"></m-font-icon>
			</button>
			<span>|</span>
			<button class="filter-btn" @click="handleFilter">
				<m-font-icon icon="iconshaixuan" :iconSize="30" color="#9F9F9F"></m-font-icon>
				<span>{{$i18nMsg('page-filter')}}</span><!--中文:筛选-->
			</button>
		</view>
		<view class="notdata" v-if="(routeData.length === 0)">
			<image src="../../../../static/images/nodata.png" class="nodata-img"></image>
			<text class="nodata-text">{{$i18nMsg('page-nodata')}}</text><!--暂无数据-->
		</view>
		<view class="inspection-route-box uni-list" v-else :class="{'hasBtn':isSelectRoute}">
			<checkbox-group @change="checkboxChange">
				<label class="uni-list-cell inspection" v-for="(item,index) in routeData" :key="index" @click="handleJumpClick(item.id, item.inspectionDoName, item)">
					<view class="inspection-date-box">
						<checkbox :value="`${item.id}/${item.maxPlanStartDate}`" :checked="item.checked" class="checkbox-style" v-if="isSelectRoute"/>
						<text class="inspection-date">{{ item.minPlanStartDate }}</text>
						<text :class="['inspection-num', { 'ongoing': item.ongoing }, { 'finish': item.finish }]">{{ item.finishMoCount }}/{{ item.moCount }}</text>
					</view>
					<text class="inspection-name">{{ item.inspectionDoName }}</text> 
				</label>
			</checkbox-group>
		</view>
		<view class="formTemplate-btns foot"  v-if="isSelectRoute">
			<m-button class="btn-item" 
			btnClass="whiteColor" 
			:btnTilte="$i18nMsg('basic-cancel')"
			@elementClick="cancelSelect"></m-button>
			<picker :disabled="pickerDisabled" @click="handleNotSelect" mode="date" :start="startDate" :end="endDate" class="btn-item" @change="confirmSelect">
				<m-button class="btn-item" style="width: 100%;"
				btnClass="mainColor" 
				:btnTilte="$i18nMsg('basic-confirm')" 
				></m-button>
			</picker>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import {homeApi} from '@/common/request/api.js'
	import inspectionApi from '@/common/request/inspectionApi/index.js'
	import mButton from '@/components/element/m-button.vue'
	import { selectInspectionDo, deleteRoute, deletePointByInspec }  from '@/static/js/DB.js'
	import ClassList from '@/static/js/ClassList.js'
	
	let mobileTabs = {}, listTem = new ClassList();
	export default {
		data() {
			return {
				keywords:'',
				isSelectRoute:false,
				routeData:[],
				selectRouteId:[],
				startDate:'',
				endDate:'',
				pickerDisabled:false,
				params:{}
			}
		},
		computed: {
			...mapState(["userDesigner","bundleId","bundleName",]),
			...mapState("home", {
				newBundle:'newBundle'
			}),
		},
		methods: {
			...mapMutations(["SET_bundle"]),
			...mapMutations("home",["SET_NEW_BUNDLE"]),
			...mapMutations("advanceFilter", ["SET_ADVAN_FILTERS"]),
			...mapMutations("FrameVariable", ["Set_Inspections"]),
			handleSearch(){
				this.getData()
			},
			handleFilter(){
				this.keywords = '';
				uni.navigateTo({
					url:'/pages/frames/inspection/inspection/routeFilter'
				})
			},
			handleNotSelect(){
				if(this.pickerDisabled) {
					uni.showModal({
						title:this.$i18nMsg("basic-modalTip"),//中文：'提示'
						content:this.$i18nMsg("inspection-selectRouteSkip"),//中文：'请选择需要跳过的巡检路线'
						confirmText: this.$i18nMsg("basic-confirm"),
						cancelText: this.$i18nMsg("basic-cancel"),
					})
				}
			},
			handleJumpClick (id, inspectionDoName, item) {
				if(this.isSelectRoute){
					this.$set(item, 'checked', !item.checked);
				}else{
					this.Set_Inspections({key:"InspectionId",value:{id:id,name:inspectionDoName}})
					let url = `/pages/frames/inspection/inspection/inspectionDevice?id=${id}&inspectionDoName=${inspectionDoName}`
					if(this.tabInfo.mobileTabId){
						let mobileTabsBYRelation = this.tabInfo.mobileTabs[this.tabInfo.mobileTabId],
							mobileTabRelationTabId = mobileTabsBYRelation.mobileTabRelationTabId;
						if(mobileTabRelationTabId) url = url + '&relationTab='+mobileTabRelationTabId
					}
					uni.navigateTo({url:url})
				}
			},
			cancelSelect(){
				this.isSelectRoute = false;
			},
			confirmSelect(event){
				const selectDate = `${event.detail.value} 00:00:00`;
				const btnArray = [this.$i18nMsg('basic-cancel'),this.$i18nMsg('basic-confirm')]
							
				plus.nativeUI.prompt('请输入点检跳过备注', (e)=> {
					const enterBtnIndex = e.index, //按下按钮的序列号
								inputValue = e.value
					if(enterBtnIndex === 1){//如果确定
						let selectRouteId = this.selectRouteId.join(',');
						inspectionApi.skipTask(this, { skipInspectionDoIds: selectRouteId, skipDate: selectDate, memo:inputValue}).then(res => {
							if(!res) return;
							if(res.success){
								this.removeInspec(selectRouteId, sucess => {
									uni.showModal({
										title:this.$i18nMsg("basic-modalTip"),//中文：'提示'
										content:res.msg,
										showCancel:false,
										confirmText: this.$i18nMsg("basic-confirm")
									})
									this.getData();
								}, err => {
									uni.showModal({
										title:this.$i18nMsg("basic-modalTip"),//中文：'提示'
										content:this.$i18nMsg("inspection-deletionFailed"),//中文：'本地数据删除失败，请重新下载',
										showCancel:false,
										confirmText: this.$i18nMsg("basic-confirm")
									})
								})
							}
							this.isSelectRoute = false;
							this.selectRouteId = []
						})
					}
				},this.$i18nMsg('basic-modalTip'),'备注:',btnArray)
			},
			removeInspec(routerId, cb, cbe){
				const deleteRoutePromise = new Promise(function (resolve, reject) {
					return deleteRoute(routerId, resolve, reject)
				})
				const deletePointByInspecPromise = new Promise(function (resolve, reject) {
					return deletePointByInspec(routerId, resolve, reject)
				})
				Promise.all([deleteRoutePromise, deletePointByInspecPromise]).then(cb).catch(cbe)
			},
			checkboxChange (e) {
				let maxDateAry = [];
				const selectRouteId = e.detail.value.map(function (item) {
					let maxDate = item.split('/')[1].replace(/-/g, '/');
					let maxDateTime = new Date(maxDate).getTime();
					maxDateAry.push(maxDateTime);
					return item.split('/')[0]
				})
				const nowMaxDateTime = maxDateAry.sort((a, b) => b -a)[0];
				const today = this.$dateFormat.formatDate(false, 'yyyy-MM-dd');
				const startDay = this.$dateFormat.formatDate(nowMaxDateTime, 'yyyy-MM-dd');
				const dateTime = today === startDay ? 0 : 86400000;
				this.startDate = this.$dateFormat.formatDate(nowMaxDateTime + dateTime, 'yyyy-MM-dd');
				if(selectRouteId.length > 0){
					this.pickerDisabled = false;
				}else{
					this.pickerDisabled = true;
				}
				this.selectRouteId = selectRouteId;
			},
			selectAll(e){
				const data = []
				if(!!e.detail.value.length){
					let maxDateAry = [];
					const selectRouteId = this.routeData.map(function (item) {
						let maxDate = item.maxPlanStartDate.replace(/-/g, '/');
						let maxDateTime = new Date(maxDate).getTime();
						maxDateAry.push(maxDateTime);
						let obj = item
						obj.checked = true
						data.push(obj)
						return item.mokey
					})
					const nowMaxDateTime = maxDateAry.sort((a, b) => b -a)[0];
					const today = this.$dateFormat.formatDate(false, 'yyyy-MM-dd');
					const startDay = this.$dateFormat.formatDate(nowMaxDateTime, 'yyyy-MM-dd');
					const dateTime = today === startDay ? 0 : 86400000;
					this.startDate = this.$dateFormat.formatDate(nowMaxDateTime + dateTime, 'yyyy-MM-dd');
					this.routeData = data
					this.selectRouteId = selectRouteId;
				}else{
					const selectRouteId = this.routeData.map(function (item) {
						let obj = item
						obj.checked = false
						data.push(obj)
						return item.mokey
					})
					this.routeData = data
					this.selectRouteId = [];
				}
				if(this.selectRouteId.length > 0){
					this.pickerDisabled = false;
				}else{
					this.pickerDisabled = true;
				}
			},
			inspctionJumpDate () {
				this.endDate = this.$dateFormat.formatDate(false, 'yyyy-MM-dd')
				this.isSelectRoute = !this.isSelectRoute;
				if(this.isSelectRoute && this.selectRouteId.length === 0){
					this.pickerDisabled = true;
				}else{
					this.pickerDisabled = false;
				}
			},
			inspctionUpload () {
				uni.navigateTo({
					url:`/pages/frames/inspection/inspection/inspectionUpload`
				})
			},
			getData(params = {}) {
				let that = this;
				if(this.keywords){
					params = { keywords:this.keywords }
				}
				selectInspectionDo(params, function(res) {
					that.routeData = res.map(function (item) {
						item.ongoing = (item.finishMoCount > 0);
						item.finish = (item.finishMoCount === item.moCount);
						item.checked = false
						return item;
					});
				})
			},
			setPageInfo(mobileTab,mainTabID){//根据relationTab取具体面板信息
				//mobileTabs-此bundle下的所有面板；relationTab关联面板；mainTab是否取主面板
				if(!mainTabID){
					// uni.showModal({
					// 	title:this.$i18nMsg("basic-inquiry"),
					// 	content:"请联系管理员配置主页",
					// 	cancelText:this.$i18nMsg("basic-cancel"),
					// 	confirmText:this.$i18nMsg("basic-confirm"),
					// })
					return 
				}
				const _this = this,
					 mobileTabsBYRelation = mobileTab[mainTabID],
					 mobileTabRelationTab = mobileTab[mobileTabsBYRelation.mobileTabRelationTabId] || {}
				
				//设置返回栏标题
				this.barTitle = mobileTabsBYRelation.mobileTabName || this.bundleName
				
				//设置列表参数
				const queryParams = listTem.advancedParams(this,{
					advancedQuery:mobileTabsBYRelation.advancedQuery || {},//过滤条件中需要转化的变量
					advancedSqlQuery:mobileTabsBYRelation.advancedSqlQuery || [],//sql中的变量
					relationMainTab:this.tabInfo.relationMainTab
				})//获取过滤条件中的变量
				const listConfig = {}
				listConfig.otherParams = {//列表额外参数，过滤条件中设置的参数
					globalMap:queryParams.advancedQuery,
					globalQueryMap:queryParams.advancedSqlQuery,
					mobileTabId:this.tabInfo.mobileTabId,
					elementList:mobileTabsBYRelation.elements,
					mobileTabSource:mobileTabsBYRelation.mobileTabSource
				}
				listConfig.baseParams = {//列表基本参数
					hasIcon:true,
					listIcon:mobileTabsBYRelation.listIcon || {},
				}
				listConfig.goEventParams = {//列表点击返回参数
					primaryKey:mobileTabsBYRelation.primaryKey,
					mobileTabRelationTabId:mobileTabsBYRelation.mobileTabRelationTabId,
				}
				listConfig.url = "currencyGetListData"
				this.listConfig = listConfig
				
				//延迟显示列表
				setTimeout(() => {
					if(mobileTabsBYRelation.mobileTabSource && mobileTabsBYRelation.elements.length>0){
						this.isShow = true
					}
				}, 100)
				//设置搜索控件参数
				this.quickQuery = mobileTabsBYRelation.quickQuery || {}
				
				this.SET_ADVAN_FILTERS({//设置高级筛选控件
					tabId:mainTabID,
					params:mobileTabsBYRelation.elements
				})
			},
		},
		onShow() {
			this.getData(this.params);
			this.params = {}
		},
		onLoad(options){
			const isNew = this.newBundle[options.bundleId],
				  bundleV = options.V || "0" //bundle的版本信息
			this.SET_NEW_BUNDLE({//加载过后设置isNew为false
				bundle:options.bundleId,
				isNew:false
			})
			
			//如果有bundleId传递过来默认显示
			this.SET_bundle({
				bundleId:options.bundleId,
				bundleName:options.title 
			})
			//判断是否有mobileTabs
			mobileTabs = uni.getStorageSync(this.bundleId) || {};
			const mobileTabId = mobileTabs.mainTabID;
			//定义面板信息
			let tabInfo = {
				_uid:this._uid,
				bundleId:this.bundleId,
				bundleName:this.bundleName,
				mobileTabId:mobileTabId,
				relationMainTab:"",
				mobileTabs:mobileTabs.mobileTabs,//所有面板
				trigger:mobileTabs.triggerMap || {}//所有触发器
			}
			this.tabInfo = tabInfo
			
			if(isNew || JSON.stringify(mobileTabs) === "{}"){//重新获取bundle
				homeApi.getPage(this,{
					bundleId: tabInfo.bundleId
				}).then(value => {
					const mainTabID = value.mainTabID
					this.tabInfo.mobileTabId = mainTabID
					this.tabInfo.mobileTabs = value.mobileTabs
					this.setPageInfo(value.mobileTabs,mainTabID)
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
			}else{
				this.setPageInfo(mobileTabs.mobileTabs,mobileTabId)
			}
		}
	}
</script>
<style>
	.hasStatusTop{
		margin-top:var(--status-bar-height);
	}
</style>
