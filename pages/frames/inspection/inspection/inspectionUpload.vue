<template>
	<view class="inspection-upload">
		<m-back-bar>
			<block slot="barTitle">{{$i18nMsg("inspection-upload")}}</block>
		</m-back-bar>
		<view class="notdata" v-if="(resultsData.length === 0)">
			<image src="../../../../static/images/nodata.png" class="nodata-img"></image>
			<text class="nodata-text">{{$i18nMsg('page-nodata')}}</text><!--暂无数据-->
		</view>
		<view class="inspection-results">
			<view class="inspection-results-item" v-for="(item,index) in resultsData" :key='index'>
				<view class="title-box">
					<text class="title">{{ item.inspectionDoName }}</text>
					<m-font-icon icon="inspectionHours" :iconSize="38" color="#F7B500" class="updateHours" @click="handleUpdateHours(item)"></m-font-icon>
				</view>
				<view class="result-detail">
					<view class="result-detail-item">
						<text class="result-label">{{$i18nMsg('inspection-totalDevice')}}：</text><!--中文:总设备数-->
						<text>{{ item.moCount }}</text>
					</view>
					<view class="result-detail-item">
						<text class="result-label">{{$i18nMsg('inspection-totalPoints')}}：</text><!--中文：总点数-->
						<text>{{ item.allCount }}</text>
					</view>
					<view class="result-detail-item">
						<text class="result-label">{{$i18nMsg('inspection-totalNormal')}}：</text><!--中文：正常数-->
						<text>{{ item.normalCount }}</text>
					</view>
					<view class="result-detail-item">
						<text class="result-label">{{$i18nMsg('inspection-totalAbnormal')}}：</text><!--中文：异常数-->
						<text>{{ item.abNormalCount }}</text>
					</view>
					<view class="result-detail-item">
						<text class="result-label">{{$i18nMsg('inspection-consumptionTime')}}：</text><!--中文消耗工时-->
						<text>{{ item.manhours + $i18nMsg('time-minutes')}}</text><!--中文：分-->
					</view>
				</view>
				<view class="bottom-box">
					<text class="createdate">{{ item.createdate }}</text>
					<text class="more" @click="handleClickShowMore(item.id)">{{$i18nMsg('page-particulars')}} ></text><!--中文：详情-->
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="formTemplate-btns foot" v-if="(resultsData.length !== 0)">
			<m-button class="btn-item" 
			btnClass="mainColor" 
			:btnTilte="$i18nMsg('inspection-upload')"
			:disabled="disabled"
			@elementClick="handleBttomBtnClick()"></m-button>
		</view>
	</view>
</template>

<script>
	import { selectInspectionHistory, updateSql, selectPointsByInspectionDoId, selectInspectionUpData, updateUploadstatus, selectAllFile }  from '@/static/js/DB.js'
	import dateFormat from '@/static/js/dateFormat.js'
	import inspectionApi from '@/common/request/inspectionApi/index.js'
	import { mapState, mapMutations } from 'vuex'
	
	export default {
		onShow() {
			this.getData();
		},
		computed: {
			...mapState(["baseUrl","defaultUrl","token","waterMarkConfig"]),
		},
		data() {
			return {
				disabled:false,
				resultsData:[],
				upInspData:[],
				upFileData:[],
				pointId:[],
				inspectionId:[],
				isUploading: false
			}
		},
		methods: {
			getData(){
				const that = this;
				selectInspectionHistory(function (res) {
					that.resultsData = res.map(function (item) {
						if(!item.manhours) item.manhours = '';
						return item;
					});
				})
			},
			selectInspectionData (cb) {
				const that = this;
				that.pointId = [];
				selectInspectionUpData(function (res) {
					that.upInspData = res;
					that.upInspData.forEach(function (item, index) {
						that.inspectionId.push(item.inspectionDoId);
						selectPointsByInspectionDoId(item.inspectionDoId, function (pointRes) {
							let pointIdData = pointRes.map(function (item) {
								return item.inspectionPointDoId
							})
							that.pointId = that.pointId.concat(pointIdData);
							that.upInspData[index].pointHistoryJsonStr = JSON.stringify(pointRes);
							if(that.upInspData.length - 1 === index) cb();
						})
					});
				})
			},
			selectFiles(cb){
				const that = this;
				that.upFileData = [];
				selectAllFile(function (res) {
					let num = Math.ceil(res.length / 10);
					for (let i = 0; i < num; i++) {
						that.upFileData.push(res.splice(0, 10));
					}
					if(cb) cb()
				})
			},
			upInspectionData(num, cb){
				const that = this;
				inspectionApi.updataInspection(that, that.upInspData[num]).then(function (res) {
					if(!res.success){
						uni.hideLoading();
						that.isUploading = false;
						return;
					}
					if(that.upInspData.length - 1 !== num) {
						that.upInspectionData(++num, cb);
					}else if(that.upInspData.length - 1 === num){
						updateUploadstatus('inspectiondo', that.inspectionId, function () {
							updateUploadstatus('inspectionpointdo', that.pointId, function () {
								if(cb) cb();
							})
						})
					}
				}).catch(function (err) {
					uni.hideLoading();
					that.isUploading = false;
				})
			},
			uploadFile (num, cb) {
				const that = this;
				let filesId = [];
				that.upFileData[num] = that.upFileData[num].map(function (item, index) {
					filesId.push(item.id);
					return {
						uri:item.filepath,
						name:`${item.inspectionpointdoid}_${item.createuserid}_${index}`
					}
				})
				inspectionApi.upInspectionFile(that, that.upFileData[num], function () {
					updateUploadstatus('inspectionfiles', filesId, function (res) {
						if(that.upFileData.length - 1 === num) {
							if(cb) cb();
						}else {
							that.uploadFile(++num, cb)
						}
					})
				},function (res) {
					uni.hideLoading();
					that.isUploading = false;
					updateUploadstatus('inspectionfiles', filesId)
					if (res) {
						let msg = res.msg || ''
						uni.showModal({
							title:that.$i18nMsg("basic-modalTipError"),
							content:`图片上传失败${msg}`,
							showCancel:false,
							confirmText:that.$i18nMsg("basic-confirm")
						})
					}
				},that.waterMarkConfig)
			},
			handleBttomBtnClick () {
				const that = this;
				if(this.isUploading) return;
				that.isUploading = true;
				this.selectInspectionData(function () {
					if(that.upInspData.length > 0){
						uni.showLoading({ title:that.$i18nMsg('inspection-upPoint')+ '...', mask:true })
						that.upInspectionData(0, function () {
							that.selectFiles(function () {
								that.isUploading = false;
								if(that.upFileData.length === 0){
									uni.hideLoading();
									that.getData();
									uni.showToast({ title:that.$i18nMsg('pageTip-uloadedSuccessfully') });//中文：'上传成功'
								}else{
									that.uploadFile(0, function () {
										uni.hideLoading();
										that.getData();
										uni.showToast({ title:that.$i18nMsg('pageTip-uloadedSuccessfully') });//中文：'上传成功'
									})
								}
							});
						});
					}
				})
			},
			handleClickShowMore (inspectionId) {
				uni.navigateTo({
					url:`/pages/frames/inspection/inspection/inspectionPoint?inspectiondoid=${inspectionId}&type=result`
				})
			},
			handleUpdateHours (inspectionData) {
				const that = this;
				plus.nativeUI.prompt(that.$i18nMsg('inspection-enterTime'), function(e){// 中文："请输入完成工时（分）"
					if(e.index==1){
						if(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(e.value)){
							updateSql('inspectiondo', { manhours: parseFloat(e.value)}, {id:inspectionData.id}, function(){
								inspectionData.manhours = e.value;
								uni.showToast({ title:that.$i18nMsg('pageTip-modifiedSuccess') })//中文:'修改成功'
							})
						}else{
							uni.showModal({
								title:that.$i18nMsg('basic-modalTip'),// 中文：'提示',
								content:that.$i18nMsg('check-nan'),// 中文：'请输入有效数字',
								showCancel:false,
								confirmText: that.$i18nMsg("basic-confirm")
							})
						}
					}
				}, that.$i18nMsg('basic-modalTip'), that.$i18nMsg("inspection-significantNumber"), [that.$i18nMsg('basic-cancel'),that.$i18nMsg('basic-confirm')]);//中文:"请输入消耗分钟"
			}
		}
	}
</script>

<style>

</style>
