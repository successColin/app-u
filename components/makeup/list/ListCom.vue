<template name="mList">
	<view class="mList">
		<ul class="list">
			<li class="list-item animated fadeIn" v-for="(item,listindex) in listData" 
			 :key="listindex" @click="handleClick(item)">
				<view class="list-item-icon" v-if="listConfig.baseParams.hasIcon && listConfig.baseParams.listIcon.iconname">
					<m-font-icon :iconSize="80" 
					 :icon='item | listIcon(listConfig.baseParams.listIcon,"name")'
					 :color='item | listIcon(listConfig.baseParams.listIcon,"color")'></m-font-icon>
				</view>
				<view class="list-item-content">
					<block v-for="(element,index) in listConfig.otherParams.elementList" 
					 :key="index">
						<block v-if="element.visiabled && element.baseType !==8">
							<m-rate class="flex-item" v-if="element.baseType === 36" sourceType="list"
							 :element = "element" 
							 :size="pxToREM(36)"
							 :value="item | listValue(element)"
							 :isEllipsis = "element.columnspan !== 24"
							 :class="{'flex-item-full':element.columnspan === 24,
							 'flex-item-half':element.columnspan === 12,
							 'flex-item-lof3':element.columnspan === 8,
							 'flex-item-lof4':element.columnspan === 6}">
							</m-rate>
							<m-composite class="flex-item flex-item-full" v-else-if="element.baseType === 47"
							 :element = "element"
							 :elementValue="item">
							</m-composite>
							<m-label v-else sourceType="list" class="flex-item"
							 :style="{color:elementColor.indexOf(element.baseType)!==-1 ? fontColor(item, element) : ''}"
							 :element = "element"
							 :value="item | listValue(element)"
							 :isEllipsis = "element.columnspan !== 24"
							 :class="{'flex-item-full':element.columnspan === 24,
							 'flex-item-half':element.columnspan === 12,
							 'flex-item-lof3':element.columnspan === 8,
							 'flex-item-lof4':element.columnspan === 6}">
							</m-label>
						</block> 
					</block>
				</view>
				<block v-for="(element,index) in showPicsElement" :key="index">
					<image v-if="isHasPic(item,element)" :src="item | listImage(element)" style="width:200upx;height: 100upx;"  mode="aspectFit"></image>
				</block>
				<block v-if="listConfig.baseParams.hasCheck">
					<view class="list-item-check checked" :style="{color:themeColorCode}" @tap.stop="handleUnChecked(item)" v-if="getCheck(item)" >
						<m-normal-icon v-if="listConfig.baseParams.multiple" icon="checkbox_app" :iconSize="pxToREM(36)"></m-normal-icon>
						<m-normal-icon v-else icon="checkboxRadio_app" :iconSize="pxToREM(36)"></m-normal-icon>
					</view>
					<view class="list-item-check" @tap.stop="handleChecked(item)" v-else >
						<m-normal-icon v-if="listConfig.baseParams.multiple" icon="unCheckbox_app" :iconSize="pxToREM(36)"></m-normal-icon>
						<m-normal-icon v-else icon="unCheckboxRadio_app" :iconSize="pxToREM(36)"></m-normal-icon>
					</view>
				</block>
			</li>
		</ul>
		<mni-pager v-if="listConfig.hasPager" ref="listPager" :total="page"
		 @prev="pagerClick" @next="pagerClick"></mni-pager>
		<view v-if="showNoData && !listConfig.hasPager" :class='[hasData ? "mList-bottom" : "noData"]'>
			<block v-if="page===currentPage && hasData">~End~</block>
			<mLodingSvg v-else-if="isLoading" ></mLodingSvg>
			<block v-else-if="!hasData">
				<image src="@/static/images/nodata.png" class="nodata" mode="widthFix" ></image>
			</block>
		</view>
	</view>
</template>

<script>
import { static_basicDatas } from '@/common/constant/constant.js'
import { ELEMENT_COLOR_SELECT } from '@/common/constant/element.js'
import { COMMON_FORMAT_DECIMAL } from '@/common/common.js'
import { mapState, mapMutations } from 'vuex'
import {listApi} from '@/common/request/api.js'
import mLabel from '@/components/element/m-label.vue'
import mRate from '@/components/element/m-rate.vue'
import mniPager from './mni-pager.vue'
import mComposite from '@/components/element/m-composite.vue'
export default {
	components: {mLabel,mRate,mniPager,mComposite},
	props:{
		pageSize:{
			type:Number,
			default: 15
		},
		tabInfo:{
			type:Object,
			required: true
		},
		showNoData:{
			type:Boolean,
			default: true
		},
		listConfig:{
			type:Object,
			default(){
				return {
					baseParams:{//基本参数
						mobileTabSource: '',//面板数据源
						elementList:[],//界面元素
						listIcon:{},//列表图标控件
					},
					otherParams:{},
					hasPager:false,//是否有分页器
				}
			}
		}
		
	},
	data(){
		return {
			pageNum:1,
			page:1,
			currentPage:0,
			listData:[],
			checkIds:[],
			checkDatas:[],
			otherParams:{},
			searchParams:{},
			hasData:true,//是否有数据
			showPicsElement:[],
			elementColor:ELEMENT_COLOR_SELECT,
			isLoading:false
		} 
	},
	computed: {
		...mapState(["themeColorCode"]),
		...mapState("common", ["tabsFormDatas","tabsElements"]),
		isCheckedParams(){
			return this.listConfig.isCheckedParams || {}
		},
		getCheck(){//判断是否选中
			return function(item) {
				let nodeId = item[this.isCheckedParams.primaryKey] || ""
				try{nodeId = JSON.parse(nodeId)}catch(e){}
				nodeId = typeof nodeId !== "object" ? nodeId : nodeId.id
				return this.checkIds.indexOf(nodeId)!==-1
			}
		},
		isHasPic(){
			return function(data,element) {
				let value = data[element.elementId] || {}
				return value.id ? true : false
			}
		},
		fontColor(){//获取字体颜色
			return function(node, element){
				let value = node[element.elementId] || {}
				return value.color || ""
			}
		}
	},
	filters: {
		listIcon(item, listIconConfig, type) {
			//图标的样式由类型决定，样式分别由状态、优先级决定。默认取状态的颜色
			let iconnameElement = listIconConfig.iconname,
				prioritycolorElement = listIconConfig.prioritycolor,
				statecolorElement = listIconConfig.statecolor
			
			let iconnamedata = item[iconnameElement] || {},
				prioritycolordata = item[prioritycolorElement] || {},
				statecolordata = item[statecolorElement] || {}
			let iconname = iconnamedata.iconname || "",
				prioritycolor = prioritycolordata.color || "#FAB71C",
				color = statecolordata.color || ""
			if(!color) color = prioritycolor
			return type === "name" ? iconname : color
		},
		listImage(listData,element){//列表显示图片
			let url = listData[element.elementId] || ""
			try{url = JSON.parse(url)}catch(e){}
			url = url.id
			let urlAry = url.split("_") //保存到表的url前面默认会加上图片id，便于后续删除
			let id = -1
			if(urlAry.length>1){
				id = urlAry[0]
				url = urlAry[1]
			}else url = urlAry[0]
			return url
		},
		listValue(listData,element){
			const elementId = element.elementId,
				  baseType = element.baseType
			let static_basicData = static_basicDatas.find( basicData => basicData.elmentType.indexOf(baseType) !== -1) || {basicData:""}
			let value = listData[elementId] || ""
			try{value = JSON.parse(value)}catch(e){}
			if(baseType === 9 || baseType === 31)
				if(static_basicData.basicData.search(value.id) != -1) value = {id:"",name:""}
			else {
				if(value.id === static_basicData.basicData) value = {id:"",name:""}
			}
			value = typeof value !== "object" ? value : (value.name || "")
			//如果字段类型为4：decimal去除后面无用的点
			if(element.relationColumnType === 4 && value) value = COMMON_FORMAT_DECIMAL(value)
			return value
		}
	},
	methods:{
		...mapMutations("common",["SET_TABS_FORMDATAS"]),
		pagerClick(config={}){//向前
			this.pageNum = config.page
			this.getListData("pager")
		},
		handleChecked(item){//选中
			let nodeId = item[this.isCheckedParams.primaryKey]
			try{nodeId = JSON.parse(nodeId)}catch(e){}
			nodeId = typeof nodeId !== "object" ? nodeId : nodeId.id
			if(this.listConfig.baseParams.multiple) {
				this.checkDatas.push(item)
				this.checkIds.push(nodeId)
			} else {
				this.checkDatas = [item]
				this.checkIds = [nodeId]
			} 
			const {mobileTabId} = this.tabInfo
			this.SET_TABS_FORMDATAS({//设置表单数据
				tabId:mobileTabId,
				formData:this.checkDatas[0]
			})
			this.$emit("checkNode",{
				currennode : item,
				checkDatas : this.checkDatas,
				checkIds : this.checkIds
			})
		},
		handleUnChecked(item){//取消选中
			let nodeId = item[this.isCheckedParams.primaryKey]
			try{nodeId = JSON.parse(nodeId)}catch(e){}
			nodeId = typeof nodeId !== "object" ? nodeId : nodeId.id
			const index = this.checkIds.indexOf(nodeId)
			if(index !== -1){
				this.checkIds.splice(index,1)
				this.checkDatas.splice(index,1)
			} 
			const checkIndex = this.checkDatas.length, {mobileTabId} = this.tabInfo
			if(checkIndex>0) 
				this.SET_TABS_FORMDATAS({//设置表单数据
					tabId:mobileTabId,
					formData:this.checkDatas[0]
				})
			this.$emit("unCheckNode",{
				currennode : item,
				checkDatas : this.checkDatas,
				checkIds : this.checkIds
			})
		},
		handleClick(listItem) {//点击列表
			const _this = this
			let params = {listItem:listItem}
			
			this.SET_TABS_FORMDATAS({//设置表单数据
				tabId:this.tabInfo.mobileTabId,
				formData:listItem
			})
			this.$emit("clickList",{...this.tabInfo,...this.listConfig.goEventParams, ...params})
		},
		setOtherParam(param){//改变默认传参
			this.otherParams = param
		},
		doSearch(param){//搜索
			this.searchParams = param
			this.getListData()
		},
		getListData(type="load"){
			const _this = this
			let pageNum = this.pageNum,
				pageSize = this.pageSize
			if(type === "loadnext" && pageNum === this.page) return
			if(type === "load"){
				if(this.listConfig.hasPager && this.$refs.listPager && this.$refs.listPager.setCurrent) this.$refs.listPager.setCurrent(1)
				//如果列表查询加载过，选中的数据需要清空
				this.checkDatas = [] 
				this.checkIds = []
				this.pageNum = 1;pageNum = 1
			}else if(type === "loadnext"){
				this.pageNum++
				pageNum++
			}else if(type=="reload"){
				//如果列表查询加载过，选中的数据需要清空
				this.checkDatas = [] 
				this.checkIds = []
				pageNum = 1
				pageSize = this.pageNum *  this.pageSize
			}
			//如果没有默认数据，且有数据源，通过接口进行请求
			if(this.listConfig.url){
				
				const pageInfo = {pageNum:pageNum,pageSize:pageSize}
				let params = {}
				//如果是通过接口获取数据
				const {dataSourceType} = this.listConfig.baseParams
				if(dataSourceType === 2){
					const {commonApiHeaderId} = this.listConfig.baseParams,
						    {mobileTabId, interfaceInParam, elementList} = this.listConfig.otherParams,
								{relationMainTab, bundleParams} = this.tabInfo
								
					let interfaceInParamValue = {}//接口参数
					//列表有面板固定变量GlobalIds
					const tabStaticParams = {id:this.checkIds.join(","),name:this.checkIds.join(","),relationColumnType:1} 
					const config = {otherTabId:relationMainTab,bundleParams,tabStaticParams}
					for(let key in interfaceInParam){//如果有接口参数，需要进行变量的转化
						let value = interfaceInParam[key]
						if(value === '@@PageSize' ){
							value = pageSize
						}else if(value === '@@PageIndex'){
							value = pageNum
						}else{
							value = this.Static_GlobalFucs.Global_ParamFormat({...config,...{key:value}},this)
							if(value && typeof value === "object") value = value.id
						}
						interfaceInParamValue[key] = value
					}
					params = {mobileTabId,commonApiHeaderId,paramMap:interfaceInParamValue,elementList}
				}else{
					params = {...this.listConfig.otherParams, ...this.otherParams, ...this.searchParams, ...pageInfo}
				}
				//如果是从其他面板中条过来的
				if(this.tabInfo.jumpTag){
					params.jumpTag = this.tabInfo.jumpTag
					for(let key in this.tabInfo.bundleParams){
						let info = this.tabInfo.bundleParams[key]
						params.globalQueryMap[key] = {
							value:info.id,
							type:info.relationColumnType
						}
					}
				}
				
				this.isLoading = true
				listApi.getListData(this, this.listConfig.url, params)
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
					if(type==="load"){//第一次加载或者重新加载
						const total = value.total || 1,
							  page = Math.ceil(total/_this.pageSize)
						this.listData = listData
						this.page = page
					}else if(type==="loadnext"){
						this.listData = this.listData.concat(listData)
					}else if(type==="reload"){
						this.listData = listData
					}else if(type=="pager"){//分页器
						this.listData = listData
					}
					if(this.listData.length>0) this.hasData = true
					else this.hasData = false
					this.$Toast.hideLoading()
					this.currentPage = this.pageNum
				}).finally(value => {
					this.isLoading = false
				})
			}
		}
	},
	mounted() {
		if(this.isCheckedParams.checkIds && this.isCheckedParams.checkIds.length>0)
			this.checkIds = this.isCheckedParams.checkIds
	},
	created() {
		//查找base64位图片
		this.showPicsElement = this.listConfig.otherParams.elementList.filter(item => item.baseType === 8 && item.elementFormat === 2)
		this.getListData()
	}
}
</script>

<style>
</style>
