<template>
	<view class="inspection-device">
		<m-back-bar>
			<block slot="barTitle">{{$i18nMsg("inspection-device")}}</block>
			<block slot="barRight">
				<m-button 
					:isFontBtn="true" 
					btnClass="mainColor"
					v-if="!isSelectDevie"
					@elementClick="handleFinish">
					<block slot="buttonIcon" style="display: inline-block;">
						<m-font-icon icon="inspectionConfirm" :iconSize="40"></m-font-icon>
					</block>
				</m-button>
				<m-button
					:isFontBtn="true" 
					btnClass="mainColor"
					v-if="isSelectDevie"
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
		<view class="notdata" v-if="(deviceData.length === 0)">
			<image src="../../../../static/images/nodata.png" class="nodata-img"></image>
			<text class="nodata-text">{{$i18nMsg('page-nodata')}}</text><!--暂无数据-->
		</view>
		<view class="inspection-device-box">
			<view class="inspection-top-route hasStatusTop">
				<view class="route-detail">
					<m-font-icon icon="inspectionRoute" :iconSize="80" color="#FAB71C" class="inspection-route-icon"></m-font-icon>
					<text class="inspection-name">{{ inspectionDoName }}</text>
					<text class="inspection-num">{{ finishMoCount }}/{{ moCount }}</text>
				</view>
			</view>
			<view class="uni-list">
				<checkbox-group @change="checkboxChange">
					<label class="device-info uni-list-cell" v-for="(item,index) in deviceData" :key="index" @click="handleJumpClick(item)">
						<view class="device-info-box">
							<checkbox :value="`${item.mokey}/${item.moMaxPlanStartDate}`" :checked="item.checked" class="checkbox-style" v-if="isSelectDevie"/>
							<view class="m-info">
								<text class="moname">{{ item.moname }}</text>
							</view>
							<text :class="['inspection-num', { 'ongoing': item.ongoing }, { 'finish': item.finish }]">{{ item.moOperatingCount }}/{{ item.moPointCount }}</text>
						</view>
						<text class="mokey">{{ item.mokey }}</text>
						<view class="position-name-box">
							<m-font-icon icon="iconweizhi" :iconSize="20" color="#D9D9D9"></m-font-icon>
							<text class="position-name">{{ item.posname }}</text>
							<text class="position-storagelocation">{{ item.storagelocation || '' }}</text>
						</view>
					</label>
				</checkbox-group>
			</view>
			
		</view>
		<view class="formTemplate-btns foot"  v-if="isSelectDevie">
			<m-button class="btn-item" 
			btnClass="whiteColor" 
			:btnTilte="$i18nMsg('basic-cancel')" 
			@elementClick="cancelSelect"></m-button>
			<picker :disabled="pickerDisabled" @click="handleNotSelect" mode="date" :start="startDate" :end="endDate" class="btn-item" @change="confirmSelect">
				<m-button 
				btnClass="redColor" 
				:btnTilte="$i18nMsg('basic-confirm')" 
				></m-button>
			</picker>
		</view>
		<view class="inspection-operation" v-else>
			<view class="item rfid" v-if="isShowRfid" @click="handleRfid">
				<m-font-icon class="item-icon" icon="inspectionRfid" :iconSize="34" color="#444444"></m-font-icon>
				<text class="item-text">RFID</text>
			</view>
			<view class="item rfid" v-if="isShowRfidHR" @click="handleRfidHR">
				<m-font-icon class="item-icon" icon="inspectionRfid" :iconSize="34" color="#444444"></m-font-icon>
				<text class="item-text">RFID</text>
			</view>
			<view class="item scan" v-if="isShowScan" @click="handleScan">
				<m-font-icon class="item-icon" icon="iconsaoma1" :iconSize="34" color="#444444"></m-font-icon>
				<text class="item-text">{{$i18nMsg('basic-scanCode')}}</text><!--扫码-->
			</view>
			<view class="item unlock" v-if="isShowLock" @click="handleUnlock">
				<m-font-icon class="item-icon" icon="inspectionUnlock" :iconSize="34" color="#444444"></m-font-icon>
				<text class="item-text">{{$i18nMsg('inspection-unlock')}}</text><!--解锁-->
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import { selectMoList, updateSql, selectManhours, deleteSkipMo }  from '@/static/js/DB.js'
	import inspectionApi from '@/common/request/inspectionApi/index.js'
	import Static_NFC from '@/static/js/NFC.js'
	import { readCardInit, readCard, closeReadCard } from '@/static/js/bridge.js'
	import ClassList from '@/static/js/ClassList.js'
	
	let listTem = new ClassList(), mobileTabs = {};
	export default {
		onLoad(options) {
			this.id = options.id;
			this.inspectionDoName = options.inspectionDoName;
			const currentTabId = options.relationTab //当前面板的id
			console.log(this.bundleId);
			//当前面板id不存在，不进行面板布局 todo 进入报错界面
			if (!currentTabId) return
			const currentTemParams = this.templateParams[currentTabId] || {} //获取当前面板参数
			
			//判断是否有mobileTabs
			const bundleInfo = uni.getStorageSync(this.bundleId) || {}
			mobileTabs = bundleInfo.mobileTabs || {};
			const mobileTabsBYRelation = mobileTabs[currentTabId] || {}
			//定义面板信息
			let tabInfo = {
				_uid:this._uid,
				bundleId:this.bundleId,
				bundleName:this.bundleName,
				mobileTabId:Number(currentTabId),
				relationMainTab:currentTemParams.relationMainTab || '',
				mobileTabs:mobileTabs,
				trigger:bundleInfo.triggerMap || {},
				parentKey:currentTemParams.onkey || "",
				refreshParams:currentTemParams.refreshParams || {},
				formType: currentTemParams.type || 'editBtn', //设置表单来源：addBtn-新增；editBtn-编辑
				cascadeSelects: mobileTabsBYRelation.cascadeSelects || [],
				commonSelects: mobileTabsBYRelation.commonSelects || [],
				selectsFilterParams: mobileTabsBYRelation.filterParams || {},
			}
			this.tabInfo = tabInfo
			this.setPageInfo(mobileTabsBYRelation,tabInfo.mobileTabId, currentTemParams.id)
		},
		onShow() {
			this.getData();
		},
		onHide() {
			// 页面进入后台时，如果没关闭NFC时关闭
			if(this.isShowRfidHR && this.readCardStatus) {
				clearTimeout(this.timer);
				this.readCardStatus = false;
				closeReadCard();
			}
		},
		onUnload(){
			// 页面关闭时，如果没关闭NFC时关闭
			if(this.isShowRfidHR && this.readCardStatus) {
				clearTimeout(this.timer);
				this.readCardStatus = false;
				closeReadCard();
			}
		},
		data() {
			return {
				isShowRfidHR:false,
				readCardStatus:false,
				timer:null,
				isShowRfid:true,
				isShowScan:true,
				isShowLock:true,
				id:null,
				inspectionDoName:0,
				finishMoCount:0,
				moCount:null,
				nowRfid:'',
				deviceData:[],
				isSelectDevie:false,
				selectMokey:[],
				pickerDisabled:false,
				startDate:'',
				endDate:''
			}
		},
		computed: {
			...mapState(["bundleName", "bundleId", "isOriginHei","themeColor"]),
			...mapState("common", ["templateParams","doRefreshParent","tabsElements","tabsFormDatas"]), //面板参数
		},
		watch:{
			nowRfid(newValue){
				if(!newValue) return;
				if(this.isShowRfidHR) {
					clearTimeout(this.timer);
					this.readCardStatus = false;
					closeReadCard();
				}
				for(let i=0,len=this.deviceData.length; i<len; i++){
					if(newValue === this.deviceData[i].rfid) {
						this.Set_Inspections({key:"InspectionDevice",value:{id:this.deviceData[i].moid,name:this.deviceData[i].moname}})
						this.Set_Inspections({key:"InspectionPosition",value:{id:this.deviceData[i].posid,name:this.deviceData[i].posname}})
						this.Set_Inspections({key:"InspectionOrganization",value:{id:this.deviceData[i].orgid,name:this.deviceData[i].orgname}})
						if(this.tabInfo){
							let mobileTabsBYRelation = this.tabInfo.mobileTabs[this.tabInfo.mobileTabId],
								mobileTabRelationTabId = mobileTabsBYRelation.mobileTabRelationTabId;
							uni.navigateTo({
								url:`/pages/frames/inspection/inspection/inspectionPoint?inspectiondoid=${this.deviceData[i].inspectiondoid}&mokey=${this.deviceData[i].mokey}&type=device&relationTab=${mobileTabRelationTabId}`
							})
						}else{
							uni.navigateTo({
								url:`/pages/frames/inspection/inspection/inspectionPoint?inspectiondoid=${this.deviceData[i].inspectiondoid}&mokey=${this.deviceData[i].mokey}&type=device`
							})
						}
						this.nowRfid = '';
						break;
					}else if(len - 1 === i){
						this.nowRfid = '';
						uni.showModal({
							title:this.$i18nMsg('basic-modalTip'),
 							content:this.$i18nMsg("inspection-notFindDevice"),// 中文：'未找到该设备'
							confirmText: this.$i18nMsg("basic-confirm"),
							showCancel:false
						})
					}
				}
			}
		},
		methods: {
			...mapMutations("FrameVariable", ["Set_Inspections"]),
			inspctionJumpDate(){
				this.endDate = this.$dateFormat.formatDate(false, 'yyyy-MM-dd')
				this.isSelectDevie = !this.isSelectDevie;
				if(this.isSelectDevie && this.selectMokey.length === 0){
					this.pickerDisabled = true;
				}
			},
			handleJumpClick(item){
				if(this.isSelectDevie){
					this.$set(item, 'checked', !item.checked);
				}
			},
			checkboxChange(e){
				let maxDateAry = [];
				const selectMokey = e.detail.value.map(function (item) {
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
				this.selectMokey = selectMokey;
				if(this.selectMokey.length > 0){
					this.pickerDisabled = false;
				}else{
					this.pickerDisabled = true;
				}
			},
			selectAll(e){
				const data = []
				if(!!e.detail.value.length){
					const selectMokey = this.deviceData.map(function (item) {
						let obj = item
						obj.checked = true
						data.push(obj)
						return item.mokey
					})
					this.deviceData = data
					this.selectMokey = selectMokey;
				}else{
					const selectMokey = this.deviceData.map(function (item) {
						let obj = item
						obj.checked = false
						data.push(obj)
						return item.mokey
					})
					this.deviceData = data
					this.selectMokey = [];
				}
				if(this.selectMokey.length > 0){
					this.pickerDisabled = false;
				}else{
					this.pickerDisabled = true;
				}
			},
			cancelSelect(){
				this.isSelectDevie = false;
			},
			handleNotSelect(){
				if(this.pickerDisabled) {
					uni.showModal({
						title:this.$i18nMsg('basic-modalTip'),//中文：'提示',
						content:this.$i18nMsg('inspection-skip'),// 中文：'请选择需要跳过的巡检设备'
						confirmText: this.$i18nMsg("basic-confirm"),
						cancelText: this.$i18nMsg("basic-cancel"),
					})
				}
			},
			confirmSelect(event){
				const selectDate = `${event.detail.value} 00:00:00`;
				const btnArray = [this.$i18nMsg('basic-cancel'),this.$i18nMsg('basic-confirm')]
							
				plus.nativeUI.prompt('请输入点检跳过备注', (e)=> {
					const enterBtnIndex = e.index, //按下按钮的序列号
								inputValue = e.value
					if(enterBtnIndex === 1){//如果确定
						let selectMokey = this.selectMokey.join(',');
						inspectionApi.skipTask(this, { skipInspectionDoIds: this.id, skipMoKeys:selectMokey, skipDate: selectDate, memo:inputValue }).then(result => {
							if(!result) return;
							if(result.success){
								const mokeyAry = this.selectMokey.map(function (item) {
									return `"${item}"`
								})
								const sMokey = mokeyAry.join(',')
								deleteSkipMo(this.id, sMokey, sucess => {
									uni.showModal({
										title:this.$i18nMsg('basic-modalTip'),//中文：'提示',
										content:result.msg,
										showCancel:false,
										confirmText: this.$i18nMsg("basic-confirm")
									})
									this.getData();
								}, err => {
									uni.showModal({
										title:this.$i18nMsg('basic-modalTip'),//中文：'提示',
										content:this.$i18nMsg('inspection-deletionFailed'), // 中文：'本地数据删除失败，请重新下载',
										showCancel:false,
										confirmText: this.$i18nMsg("basic-confirm")
									})
								})
							}
							this.isSelectDevie = false;
						})
					}
				},this.$i18nMsg('basic-modalTip'),'备注:',btnArray)
			},
			
			handleRfid(){
				const _this = this
				new Static_NFC({
					readNFC:true,
					$i18nMsg:_this.$i18nMsg,
					callback(res){
						_this.nowRfid = res.value;
					}
				})
			},
			handleRfidHR(){
				if(this.readCardStatus) return;
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					// 读取超时关闭
					this.readCardStatus = false;
					closeReadCard();
					uni.showModal({
						title:this.$i18nMsg('basic-modalTip'),//中文：'提示',
						content:this.$i18nMsg('basic-timeout'),// 中文：'读取超时，请重新读取',
						showCancel:false,
						confirmText: this.$i18nMsg("basic-confirm")
					})
				}, 8000);
				readCardInit(() => {
					this.readCardStatus = true;
					uni.showLoading({ title: this.$i18nMsg('inspection-readNFC')}); // 中文：'准备读取NFC'
					setTimeout(() => {
						uni.hideLoading();
						uni.showToast({
							title: this.$i18nMsg('inspection-NFCLabel'),// 中文：'请将NFC标签靠近！'
							icon: 'none'
						})
						this.readCardInfo();
					}, 1000)
				})
			},
			readCardInfo(){
				if(this.readCardStatus){
					readCard(arg => {
						this.nowRfid = arg[0];
					}, () => {
						// 未读取到数据继续读取
						setTimeout(() => this.readCardInfo(), 1000);
					})
				}
			},
			handleScan(){
				const that = this;
				uni.scanCode({
					onlyFromCamera: true,
					success: function (res) {
						const code = `${res.result}`
						let scanDeviceIndex = that.deviceData.findIndex(item => code === `${item.qrcode}`) //扫描默认与inspectionpointdo中的qrcode进行对比
						if(scanDeviceIndex===-1) scanDeviceIndex = that.deviceData.findIndex(item => code === `${item.mokey}`)
						// qrcode对应设备表中那个字段可以通过全局配置中心进行配置
						if(scanDeviceIndex === -1){//如果没有找到设备
							uni.showModal({
								title:that.$i18nMsg('basic-modalTip'),
								content:that.$i18nMsg("inspection-notFindDevice"),// 中文：'未找到该设备'
								showCancel:false,
								confirmText: that.$i18nMsg("basic-confirm")
							})
						}else{
							let scanDevice = that.deviceData[scanDeviceIndex]
							const {moid,mokey,moname,posid,posname,orgid,orgname,inspectiondoid} = scanDevice
							that.Set_Inspections({key:"InspectionDevice",value:{id:moid,name:moname}})
							that.Set_Inspections({key:"InspectionPosition",value:{id:posid,name:posname}})
							that.Set_Inspections({key:"InspectionOrganization",value:{id:orgid,name:orgname}})
							
							if(that.tabInfo){
								let mobileTabsBYRelation = that.tabInfo.mobileTabs[that.tabInfo.mobileTabId],
									mobileTabRelationTabId = mobileTabsBYRelation.mobileTabRelationTabId;
								uni.navigateTo({
									url:`/pages/frames/inspection/inspection/inspectionPoint?inspectiondoid=${inspectiondoid}&mokey=${mokey}&type=device&relationTab=${mobileTabRelationTabId}`
								})
							}else{
								uni.navigateTo({
									url:`/pages/frames/inspection/inspection/inspectionPoint?inspectiondoid=${inspectiondoid}&mokey=${mokey}&type=device`
								})
							}
						}
					}
				});
			},
			handleUnlock(){
				const that = this;
				plus.nativeUI.prompt(that.$i18nMsg('inspection-unlockDevice'), function(e){
					if(e.index==1){
						for(let i=0,len=that.deviceData.length; i<len; i++){
							if(e.value.toLocaleLowerCase() === that.deviceData[i].mokey.toLocaleLowerCase()) {
								that.Set_Inspections({key:"InspectionDevice",value:{id:that.deviceData[i].moid,name:that.deviceData[i].moname}})
								that.Set_Inspections({key:"InspectionPosition",value:{id:that.deviceData[i].posid,name:that.deviceData[i].posname}})
								that.Set_Inspections({key:"InspectionOrganization",value:{id:that.deviceData[i].orgid,name:that.deviceData[i].orgname}})
								if(that.tabInfo){
									let mobileTabsBYRelation = that.tabInfo.mobileTabs[that.tabInfo.mobileTabId],
										mobileTabRelationTabId = mobileTabsBYRelation.mobileTabRelationTabId;
									uni.navigateTo({
										url:`/pages/frames/inspection/inspection/inspectionPoint?inspectiondoid=${that.deviceData[i].inspectiondoid}&mokey=${that.deviceData[i].mokey}&type=device&relationTab=${mobileTabRelationTabId}`
									})
								}else{
									uni.navigateTo({
										url:`/pages/frames/inspection/inspection/inspectionPoint?inspectiondoid=${that.deviceData[i].inspectiondoid}&mokey=${that.deviceData[i].mokey}&type=device`
									})
								}
								
								break;
							}else if(len - 1 === i){
								uni.showModal({
									title:that.$i18nMsg('basic-modalTip'),
									content:that.$i18nMsg("inspection-notFindDevice"),// 中文：'未找到该设备'
									showCancel:false,
									confirmText: that.$i18nMsg("basic-confirm")
								})
							}
						}
					}
				}, that.$i18nMsg('basic-modalTip'), that.$i18nMsg('inspection-enterCode'), [that.$i18nMsg('basic-cancel'),that.$i18nMsg('basic-confirm')]); // 中文："请输入设备编码"
			},
			handleFinish(){
				const that = this;
				plus.nativeUI.prompt(that.$i18nMsg('inspection-enterTime'), function(e){ // 中文："请输入完成工时（分）"
					if(e.index==1){
						if(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(e.value)){
							updateSql('inspectiondo', { manhours: parseFloat(e.value)}, {id:that.id}, function(){
								uni.navigateBack()
							})
						}else{
							uni.showModal({
								title:that.$i18nMsg('basic-modalTip'),
								content:that.$i18nMsg('check-nan'),// 中文：'请输入有效数字',
								showCancel:false,
								confirmText: that.$i18nMsg("basic-confirm")
							})
						}
					}
				}, that.$i18nMsg('basic-modalTip'), that.$i18nMsg('inspection-significantNumber'), [that.$i18nMsg('basic-cancel'),that.$i18nMsg('basic-confirm')]); // 中文："请输入消耗分钟"
			},
			getData() {
				let that = this;
				that.finishMoCount = 0;
				that.moCount = 0;
				selectMoList(that.id, function (res) {
					that.deviceData = res.map(function (item, index) {
						that.finishMoCount += item.moOperatingCount;
						that.moCount += item.moPointCount;
						item.ongoing = (item.moOperatingCount > 0);
						item.finish = (item.moOperatingCount === item.moPointCount);
						return item;
					});
					if(that.finishMoCount === that.moCount && that.finishMoCount != 0){
						selectManhours(that.id, function (res) {
							if(!res[0].manhours) {
								that.handleFinish();
							}
						})
					}
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
				this.SET_TABS_ELEMENT({//设置面板控件
					tabId:_this.mobileTabId,
					elements:mobileTabsBYRelation.elements
				})
			},
		}
	}
</script>

<style>
	.hasStatusTop{
		margin-top:var(--status-bar-height);
	}
</style>
