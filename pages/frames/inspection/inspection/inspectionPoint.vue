<template>
	<view class="inspection-point">
		<m-back-bar>
			<block slot="barTitle">{{$i18nMsg("inspection-task")}}</block>
			<block slot="barRight">
				<top-btns-coms :tabInfo="tabInfo"
					@showComBox="showComBox"> 
				</top-btns-coms>
			</block>
		</m-back-bar>
		<dropdown-menu v-if="comBoxVisible" :tabInfo="tabInfo" @showComBox="showComBox"></dropdown-menu>
		<view class="notdata" v-if="(pointList.length === 0)">
			<image src="../../../../static/images/nodata.png" class="nodata-img"></image>
			<text class="nodata-text">{{$i18nMsg('page-nodata')}}</text><!--暂无数据-->
		</view>
		<view class="inspection-point-list">
			<view class="point-item" v-for="(item, index) in pointList" :key="index">
				<view class="point-title" :class="[openPointIndex === index ? 'pointActive' : '']" @click="handleOpen(index)">
					<text :class="['num', item.stateid === 1 ? 'normal' : '', item.stateid === 2 ? 'fault' : '']">{{ index + 1 }}</text>
					<text class="point-name">{{ item.pointName }}</text>
					<m-font-icon icon="iconyuefenqiehuanhou" :iconSize="18" color="#9F9F9F" class="arrow"></m-font-icon>
				</view>
				<view class="point-detail" v-if="(openPointIndex === index ? true : false)">
					<view class="detail-form">
						<view class="basic-info">
							<view class="basic-info-item">
								<text class="label-text">{{ $i18nMsg('inspection-checkingBenchmark') }}：</text><!-- 中文：巡检基准 -->
								<text class="value-text">{{ item.jobstandard }}</text>
							</view>
							<view class="basic-info-item">
								<text class="label-text">{{ $i18nMsg('inspection-methods') }}：</text><!-- 中文：巡检方法 -->
								<text class="value-text">{{ item.jobmethod }}</text>
							</view>
							<view class="basic-info-item">
								<text class="label-text">{{ $i18nMsg('page-planStartTime') }}：</text><!-- 中文：计划开始时间 -->
								<text class="value-text">{{ item.planstartdate }}</text>
							</view>
							<view class="basic-info-item" v-if="item.checktype > 3">
								<text class="label-text">{{ $i18nMsg('inspection-instrumentMeter') }}：</text><!-- 中文：仪器仪表 -->
								<text class="value-text">{{ item.instrumentname }}</text>
							</view>
							<view class="basic-info-item" v-if="item.checktype > 3 || item.checktype == 2">
								<text class="label-text">{{ $i18nMsg('inspection-measurementLimit') }}：</text><!-- 中文：测量上限 -->
								<text class="value-text">{{ item.upperlimitvalue }}</text>
							</view>
							<view class="basic-info-item" v-if="item.checktype > 3 || item.checktype == 2">
								<text class="label-text">{{ $i18nMsg('inspection-measureLowerLimit') }}：</text><!-- 中文：测量下限 -->
								<text class="value-text">{{ item.lowerlimitvalue }}</text>
							</view>
							<view class="basic-info-item">
								<text class="label-text w-s">{{ $i18nMsg('page-note') }}：</text><!-- 中文：备 注 -->
								<text class="value-text">{{ item.memo }}</text>
							</view>
						</view>
						<view class="basic-content-info" v-if="item.checktype == 2">
							<view class="info-item">
								<text class="label-text">{{ $i18nMsg('inspection-measuredUnit') }}：</text><!-- 中文：测量单位 -->
								<text class="value-text">{{ item.unitname }}</text>
							</view>
							<view class="info-item">
								<text class="label-text">{{ $i18nMsg('inspection-measuredValue') }}：</text><!-- 中文：测量值-->
								<input class="uni-input" auto-blur=true type="text" :placeholder="$i18nMsg('inspection-enterMeasuredValue')" @input="handleInput" v-model="item.checkvalue"/><!-- 中文：请输入测量值-->
							</view>
						</view>
						<view class="basic-content-info" v-else-if="item.checktype > 3">
							<view class="info-item">
								<text class="label-text">{{ $i18nMsg('inspection-measuredUnit') }}：</text><!-- 中文：测量单位 -->
								<text class="value-text">{{ item.unitname }}</text>
							</view>
							<view class="info-item">
								<text class="label-text">{{ $i18nMsg('inspection-measuredValue') }}：</text><!-- 中文：测量值-->
								<input class="uni-input" auto-blur=true type="text" disabled="disabled" :placeholder="$i18nMsg('inspection-enterMeasuredValue')" v-model="item.checkvalue"/><!-- 中文：请输入测量值-->
								<m-font-icon :icon="ismeasure" :iconSize="60" :color="measureColor" @click="handleMeasure(item)"></m-font-icon>
							</view>
						</view>
						<view class="basic-content-info" v-else-if="item.checktype == 3">
							<view class="info-item">
								<text class="label-text">{{ $i18nMsg('inspection-lubricant') }}：</text><!-- 中文： 润滑剂-->
								<text class="value-text">{{ $i18nMsg('inspection-mechanicalLubricant') }}</text><!-- 中文： 机械润滑剂-->
							</view>
							<view class="info-item">
								<text class="label-text">{{ $i18nMsg('inspection-measuredUnit') }}：</text><!-- 中文：测量单位 -->
								<text class="value-text">{{ item.unitname }}</text>
							</view>
							<view class="info-item">
								<text class="label-text">{{ $i18nMsg("page-quantity") }}：</text><!-- 中文： 数量-->
								<input auto-blur=true class="uni-input" type="number" :placeholder="$i18nMsg('formTip-enterQuantity')" @input="saveOilqty" v-model="item.oilqty"/><!-- 中文： 请输入数量 -->
							</view>
						</view>
						<view class="info-item info-textarea">
							<text class="label-text">{{$i18nMsg('inspection-executiveDescribed')}}：</text><!--中文： 执行描述-->
							<textarea auto-blur=true class="uni-textarea"  type="number" maxlength="50" v-model="item.description" @input="saveDescription"></textarea>
							<text class="textareaLength">{{ item.description.length }}/50</text>
						</view>
						<view class="img-files">
							<view class="upload-btn img-item" @click="handleChooseImage(index)"></view>
							<view class="img-item" v-for="(imgItem, imgIndex) in item.fileList" :key="imgIndex">
								<image :src="imgItem.filepath" class="uploadImg" @click="handlePreviewImage(index,imgIndex)"></image>
								<m-font-icon icon="iconqingchu" :iconSize="30" color="#ADADAD" class="delImg" @click="handleDeleteImg(index, imgIndex)"></m-font-icon>
							</view>
						</view>
						<view class="operation" v-if="item.checktype == 1 || item.checktype == 3">
							<text :class="['btn', 'normal', item.stateid === 1 ? 'active' : '']" @click="handleChangeState(index, 1)">{{ $i18nMsg('inspection-normal') }}</text><!--中文： 正常-->
							<text :class="['btn', 'fault',item.stateid === 2 ? 'active' : '']" @click="handleChangeState(index, 2)">{{ $i18nMsg('inspection-abnormal') }}</text><!--中文: 异常-->
						</view>
						<view class="operation" v-else>
							<text :class="['btn', 'normal', item.stateid === 1 ? 'active' : '']">{{ $i18nMsg('inspection-normal') }}</text><!--中文： 正常-->
							<text :class="['btn', 'fault',item.stateid === 2 ? 'active' : '']">{{ $i18nMsg('inspection-abnormal') }}</text><!--中文: 异常-->
						</view>
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { selectPointDoList, updateSql, insertFile, selectFileList, deleteFile, selectPointsResults}  from '@/static/js/DB.js'
	import dateFormat from '@/static/js/dateFormat.js'
	import { mapState, mapMutations } from 'vuex'
	import dropdownMenu from "@/pageComs/dropdownMenu.vue"
	import topBtnsComs from '@/pageComs/topBtnsComs.vue'
	import { readMeaInit, meaTem, closeMeaTem, initMeaTem } from '@/static/js/bridge.js'
	
	export default {
		components: {topBtnsComs,dropdownMenu},
		onLoad(options) {
			this.inspectiondoid = options.inspectiondoid;
			this.mokey = options.mokey;
			this.type = options.type;
			if(this.type === 'result'){
				this.getResultData()
			}else if(this.type === 'device'){
				this.getData();
			}
			const currentTabId = options.relationTab //当前面板的id
			//当前面板id不存在，不进行面板布局 todo 进入报错界面
			if (!currentTabId) return
			const currentTemParams = this.templateParams[currentTabId] || {} //获取当前面板参数
			
			//判断是否有mobileTabs
			const bundleInfo = uni.getStorageSync(this.bundleId) || {}
			const mobileTabs = bundleInfo.mobileTabs || {},
				  mobileTabsBYRelation = mobileTabs[currentTabId] || {}
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
		onHide() {
			if(!this.measure && this.openPointIndex != -1){
				// 页面进入后台时关闭测量接口
				setTimeout(() => {
					this.measure = true;
					this.$set(this.pointList[this.openPointIndex], 'checkvalue', '');
					closeMeaTem();
				},30)
			}
		},
		onUnload(){
			if(!this.measure && this.openPointIndex != -1){
				// 页面销毁时关闭测量接口
				setTimeout(() => {
					this.measure = true;
					this.$set(this.pointList[this.openPointIndex], 'checkvalue', '');
					closeMeaTem();
				},30)
			}
		},
		data () {
			return {
				inspectiondoid:null,
				measure:true,
				measureType:null,
				openPointIndex:-1,
				lastOpenPointIndex:-1,
				type:null, // 分为结果进入的和设备页面进入的
				pointList:[],
				//面板信息
				tabInfo: {}, 
				formConfig:{},
				selectsInfo: {}, //级联下拉框
				comBoxVisible: false, //下拉菜单是否显示
			}
		},
		computed: {
			...mapState(["userId"]),
			...mapState(["bundleName", "bundleId", "isOriginHei","userDesigner", "waterMarkConfig"]),
			...mapState("home", {newBundle:'newBundle'}),
			...mapState("Inspection", ["inspectionPhotoGallery"]),
			...mapState("common", ["templateParams","doRefreshParent","tabsElements","tabsFormDatas"]), //面板参数
			...mapState("form", ["currentTopRightBtns","currentComboBoxs"]),
			ismeasure(){
				if(this.measure) return 'inspectionMeasure'
				else return 'inspectionMeasureConfirm'
			},
			measureColor(){
				if(this.measure) return '#D9D9D9'
				else return '#F7B500'
			},
			measureStrType: {
				get: function () {
					if(this.measureType == '4'){
						// 温度
						return '0b0b'
					}else if(this.measureType == '5'){
						// 振动
						return '0F11'
					}else if(this.measureType == '6'){
						// 加速度
						return '0F12'
					}else if(this.measureType == '7'){
						// 速度
						return '0F13'
					}
				}
			}
		},
		methods: {
			...mapMutations(["SET_ORIGIN", "SET_bundle"]),
			...mapMutations("form", ["SET_FILTER_SQLPARAMS","SET_ALLBTNS"]),
			...mapMutations("home",["SET_NEW_BUNDLE"]),
			...mapMutations("Toast", ["TOAST_REQUESTURLS"]),
			...mapMutations("verificationRule",["CLEAR_RULESTATE","SET_VER_RULES"]),
			...mapMutations("FrameVariable", ["Set_Inspections"]),
			showComBox() { this.comBoxVisible = !this.comBoxVisible },//显示或者隐藏下拉菜单
			handleMeasure(item){
				let that = this;
				that.measureType = item.checktype;
				if(that.measure){
					// 准备测量
					readMeaInit(function(){
						that.measure = false;
						uni.showLoading({
							title:that.$i18nMsg('inspection-readyRead')+'...' // 中文：准备读取
						})
						if(that.measureType == '4'){ // 测量温度特殊处理
							setTimeout(function(){
								initMeaTem()
							},1000)
							setTimeout(function () {
								uni.hideLoading();
								that.startMeasure(that.measureStrType, item)
							},2000)
						}else{
							uni.hideLoading();
							setTimeout(() => that.startMeasure(that.measureStrType, item), 1000)
						}
					})
				}else{
					setTimeout(function () {
						that.measure = true;
						that.confirmMeasure(item);
						that.openPointIndex = -1;
						closeMeaTem();
					},30)
				}
			},
			startMeasure(type,item){
				if(!this.measure){
					meaTem(type, args => {
						item.checkvalue = args[0].split(' ')[0];
						setTimeout(() => this.startMeasure(type, item),1000)
					})
				}
			},
			getData(){
				let that = this;
				selectPointDoList(this.inspectiondoid, this.mokey, function (res) {
					that.pointList = res.map(function (item, index) {
						if(!item.fileList) item.fileList = [];
						if(!item.description) item.description = '';
						if(item.memo === null) item.memo = that.$i18nMsg('inspection-none'); // 中文：that.$i18nMsg('inspection-none')
						if(item.instrumentname === null) item.instrumentname = that.$i18nMsg('inspection-none');
						if(item.upperlimitvalue === null) item.upperlimitvalue = that.$i18nMsg('inspection-none');
						if(item.lowerlimitvalue === null) item.lowerlimitvalue = that.$i18nMsg('inspection-none');
						if(item.checkvalue === null) item.checkvalue= '';
						return item;
					})
				})
			},
			getResultData() {
				let that = this;
				selectPointsResults(this.inspectiondoid, function (res) {
					that.pointList = res.map(function (item) {
						if(!item.fileList) item.fileList = [];
						if(!item.description) item.description = '';
						if(item.memo === null) item.memo = that.$i18nMsg('inspection-none');
						if(item.instrumentname === null) item.instrumentname = that.$i18nMsg('inspection-none');
						if(item.upperlimitvalue === null) item.upperlimitvalue = that.$i18nMsg('inspection-none');
						if(item.lowerlimitvalue === null) item.lowerlimitvalue = that.$i18nMsg('inspection-none');
						if(item.checkvalue === null) item.checkvalue= '';
						return item;
					})
				})
			},
			handleOpen (index){
				if(this.openPointIndex != -1 && this.pointList[this.openPointIndex].stateid == 2 && !!!this.pointList[this.openPointIndex].description){
					uni.showModal({
						title:this.$i18nMsg("basic-modalTip"),//中文：'提示',
						content:'异常状态下执行描述不能为空',// 中文：'请填写测量值',
						// content:this.$i18nMsg('inspection-enterMeasuredValue'),// 中文：'请填写测量值',
						showCancel:false,
						confirmText: this.$i18nMsg("basic-confirm")
					})
					return;
				}
				if(!this.measure){
					// 测量中关闭或切换点关闭测量接口
					let pointIndex = this.openPointIndex;
					setTimeout(() => {
						this.measure = true;
						this.$set(this.pointList[pointIndex], 'checkvalue', '');
						closeMeaTem();
					},30)
				}
				if(this.openPointIndex !== -1 && this.pointList[this.openPointIndex].checktype === 2 && this.pointList[this.openPointIndex].checkvalue === ''){
					uni.showModal({
						title:this.$i18nMsg("basic-modalTip"),//中文：'提示',
						content:this.$i18nMsg('inspection-enterMeasuredValue'),// 中文：'请填写测量值',
						showCancel:false,
						confirmText: this.$i18nMsg("basic-confirm")
					})
					return;
				}
				if(this.openPointIndex !== index){
					this.openPointIndex = index;
					if((this.pointList[index].checktype === 1 || this.pointList[index].checktype === 3) && !this.pointList[index].stateid){
						this.handleChangeState(this.openPointIndex, 1)
					}
					this.getFileList(index);
					this.Set_Inspections({key:"InspectionPointId",value:{id:this.pointList[index].id,name:this.pointList[index].pointName}})
				}else {
					this.openPointIndex = -1;
				}
			},
			getFileList (index) {
				const that = this;
				selectFileList(that.pointList[index].id, function (res) {
					that.pointList[index].fileList = res;
					that.nowFileList = res;
				})
			},
			handleInput (e) {
				const that = this;
				let pointData = this.pointList[this.openPointIndex];
				let checkvalue = e.detail.value;//界面展示数值
				let val = 0;// 实际存入数据库的数值
				let reg = /^((-?\d+)|(-?))((\.\d+)?|(\.)?)$/;
				if(reg.test(checkvalue) && checkvalue != ''){
					if(checkvalue == '-'){
						val = 0
					}else{
						pointData.checkvalue = parseFloat(checkvalue);
						val = parseFloat(checkvalue);
					}
				}else{
					pointData.checkvalue = 0;
					val = 0
				}
				let checkdate = dateFormat.formatDate('', 'yyyy-MM-dd hh:mm:ss');
				if(val <= pointData.upperlimitvalue && val >= pointData.lowerlimitvalue){
					this.handleChangeState(this.openPointIndex, 1)
				}else {
					this.handleChangeState(this.openPointIndex, 2)
				}
				updateSql('inspectionpointdo', { checkvalue:val, checkuserid:this.userId, checkdate:checkdate }, { id:pointData.id }, function () {
					that.$set(that.pointList, that.openPointIndex, pointData);
				})
			},
			confirmMeasure(pointData){
				let checkdate = dateFormat.formatDate('', 'yyyy-MM-dd hh:mm:ss');
				if(pointData.checkvalue <= pointData.upperlimitvalue && pointData.checkvalue >= pointData.lowerlimitvalue){
					this.handleChangeState(this.openPointIndex, 1)
				}else {
					this.handleChangeState(this.openPointIndex, 2)
				}
				updateSql('inspectionpointdo', { checkvalue:pointData.checkvalue, checkuserid:this.userId, checkdate:checkdate }, { id:pointData.id })
			},
			saveOilqty(e){
				let oilqty = e.detail.value;
				let that = this;
				let checkdate = dateFormat.formatDate('', 'yyyy-MM-dd hh:mm:ss');
				updateSql('inspectionpointdo', { oilqty:oilqty, checkuserid:this.userId, checkdate:checkdate }, { id:this.pointList[this.openPointIndex].id }, function () {
					that.pointList[that.openPointIndex].oilqty = oilqty;
				})
			},
			saveDescription(e){
				let description = e.detail.value;
				let that = this;
				let checkdate = dateFormat.formatDate('', 'yyyy-MM-dd hh:mm:ss');
				updateSql('inspectionpointdo', { description:description, checkuserid:this.userId, checkdate:checkdate }, { id:this.pointList[this.openPointIndex].id }, function () {
					that.pointList[that.openPointIndex].description = description;
				})
			},
			handleChooseImage (index) {
				let that = this;
				let imgLength = that.pointList[index].fileList.length;
				if(imgLength >= 3) {
					uni.showModal({
						title:that.$i18nMsg("basic-modalTip"),//中文：'提示',
						content:that.$i18nMsg('pageTip-noMorePictures'),// 中文：'图片不能超过3张',
						showCancel:false,
						confirmText: that.$i18nMsg("basic-confirm")
					})
					return;
				}
				uni.chooseImage({
				    count: 3 - imgLength, 
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: this.inspectionPhotoGallery, //从相册选择
				    success: function (res) {
						// let filesList = that.pointList[index].fileList.concat(res.tempFilePaths);
						// #ifdef APP-PLUS
						that.saveFile(res.tempFilePaths, index);
						// #endif
						// #ifdef H5
						that.pointList[index].fileList = filesList
						// #endif
				    }
				});
			},
			saveFile(filesList, index){
				const that = this;
				let savePromiseAry = [];
				let fileData = [];
				let num = 0
				let saveFiles = (item, imgIndex) =>{
					if(typeof item === 'object') return;
					let tempFile = escape(item)
						uni.saveFile({
						  tempFilePath: tempFile,
						  success: res => {
							  fileData.push({ 
								inspectiondoid:that.pointList[index].inspectiondoid, 
								inspectionpointdoid:that.pointList[index].id,
								filepath:res.savedFilePath,
								createdate:(new Date().getTime() / 1000),
								createuserid:that.userId,
							  })
								if(num<filesList.length - 1){
									num++;
									return saveFiles(filesList[num])
								}else{
									insertFile(fileData, function () {
										that.getFileList(index);
									})
								}
						  },
						  fail: err => {
							  // reject(err)
								if(fileData.length > 0){
									insertFile(fileData, function () {
										that.getFileList(index);
									})
								}
								uni.showModal({
									title:that.$i18nMsg("basic-modalTip"),//中文：'提示',
									content:that.$i18nMsg('formTip-reUpload'), // 中文：'图片上传失败',
									confirmText: that.$i18nMsg("basic-confirm"),
									showCancel: false,
								})
						  }
						});
				}
				saveFiles(filesList[num])
				
				
				// Promise.all(savePromiseAry).then(res => {
				// 	console.log(fileData)
				// 	insertFile(fileData, function () {
				// 		that.getFileList(index);
				// 	})
				// }).catch(err => {
				// 	console.log("chooseImage=============================2")
				// 	if(fileData.length > 0){
				// 		insertFile(fileData, function () {
				// 			that.getFileList(index);
				// 		})
				// 	}
				// 	console.log(fileData)
				// 	uni.showModal({
				// 		title:that.$i18nMsg("basic-modalTip"),//中文：'提示',
				// 		content:that.$i18nMsg('formTip-reUpload'), // 中文：'图片上传失败',
				// 		confirmText: that.$i18nMsg("basic-confirm"),
				// 		showCancel: false,
				// 	})
				// })
			},
			handleDeleteImg (index, imgIndex) {
				var that = this;
				uni.showModal({
					title:that.$i18nMsg("basic-modalTip"),//中文：'提示',
					content:that.$i18nMsg('choiceTip-isDelete'),
					confirmText: that.$i18nMsg("basic-confirm"),
					cancelText: that.$i18nMsg("basic-cancel"),
					success:function (res) {
						if (res.confirm) {
							// #ifdef APP-PLUS
							uni.removeSavedFile({
								filePath: that.pointList[index].fileList[imgIndex].filepath,
								success: (res) => {
									deleteFile(that.pointList[index].fileList[imgIndex].id, function () {
										that.pointList[index].fileList.splice(imgIndex, 1);
									})
								},
								fail: () => {
									uni.showModal({
										title:that.$i18nMsg("basic-modalTip"),//中文：'提示',
										content:that.$i18nMsg("pageTip-deleteFaile"),// 中文：'图片删除失败',
										showCancel:false,
										confirmText: that.$i18nMsg("basic-confirm")
									})
								}
							});
							// #endif
							// #ifdef H5
							that.pointList[index].fileList.splice(imgIndex, 1);
							// #endif
						}
					}
				})
			},
			handleChangeState(index, stateid) {
				const that = this;
				let checkdate = dateFormat.formatDate('', 'yyyy-MM-dd hh:mm:ss');
				updateSql('inspectionpointdo', { stateid:stateid, operatingstatus: 1, checkuserid:this.userId, checkdate:checkdate }, { id:that.pointList[index].id }, function () {
					that.pointList[index].stateid = stateid;
				})
			},
			handlePreviewImage(index,imgIndex) {
				const that = this;
				let urls = this.pointList[index].fileList.map(function (item) {
					return item.filepath
				})
				uni.previewImage({
					current:imgIndex,
					urls: urls
				});
			},
			setPageInfo(mobileTabsBYRelation, mobileTabId, formId="") { //根据relationTab取具体面板信息
				if(!mobileTabId) return
				const _this = this
				const elements = mobileTabsBYRelation.elements,
					  bottomBtn = mobileTabsBYRelation.btnList.bottomBtn,
					  topRightBtn = mobileTabsBYRelation.btnList.topRightBtn,
					  comboBox = mobileTabsBYRelation.btnList.comboBox,
					  tabElements = [...elements,...bottomBtn,...topRightBtn,...comboBox];
				this.SET_ALLBTNS({//设置按钮、下拉菜单原生数据
					tabId:_this.tabInfo.mobileTabId,
					bottomBtns:bottomBtn,
					topRightBtns:topRightBtn,
					comboBoxs:comboBox
				})
			}
		}
	}
</script>
