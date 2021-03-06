<template name="mPlainList">
	<!-- 普通列表，不进行配置 -->
	<view class="mPlainList" v-show="showPicker">
		<view :class="{'listMask':!insert}" @click="maskClick" catchtouchmove="true"></view>
		<view class="show-content animated fadeIn" v-if='listData.length>0' :class="{'list-picker-view-show':!insert}">
			<view class="list-picker__hd" catchtouchmove="true" v-if="!insert">
			  <view class="list-picker__action" @click="pickerCancel">{{ $i18nMsg('basic-cancel') }}</view>
			  <view class="list-picker__action" :style="{color:themeColorCode}" @click="pickerConfirm">{{ $i18nMsg('basic-confirm') }}</view>
			</view>
			<ul class="list">
				<li class="list-item" v-for="(item,index) in listData" :id="item.id" :key="index">
					<view class="list-item-content">
						<view class="flex-item" v-for="(column,index) in showColumns"  :key="index" :class="{'main-item':index===0}">
							{{ item[column] || "" }}
						</view>
					</view>
					<view class="list-item-check checked" :style="{color:themeColorCode}" @tap.stop="listItemSelect(item.id,false,index)" v-if="alreadyCheckId_.findIndex(checkId => `${checkId}`===`${item.id}`)!==-1" >
						<m-font-icon v-if="multiple" icon="checkbox_app" :iconSize="36"></m-font-icon>
						<m-font-icon v-else icon="checkboxRadio_app" :iconSize="36"></m-font-icon>
					</view>
					<view class="list-item-check" @tap.stop="listItemSelect(item.id,true,index)" v-else >
						<m-font-icon v-if="multiple" icon="unCheckbox_app" :iconSize="36"></m-font-icon>
						<m-font-icon v-else icon="unCheckboxRadio_app" :iconSize="36"></m-font-icon>
					</view>
				</li>
			</ul>
		</view>
		<view  v-if="!isLoading && listData.length===0" class="animated nodata"
			:class="[listData.length===0 ? 'fadeIn':'fadeOut']" 
			:style="{backgroundImage:`url(${nodataImg})`}"></view>
		<m-loading v-if="isLoading" class="animated"
			:class="[isLoading ? 'fadeIn':'fadeOut']"></m-loading>
	</view>
</template>

<script>	
	import { mapState, mapMutations } from 'vuex'
	
	import {listApi} from '@/common/request/api.js'
	import nodataImg from "@/static/images/nodata.png"
	
	export default {
		name:'mPlainList',
		props: {
			config: {
				type: Object,
				default(){
					return {}
				}
			},
			insert:{//insert是否内嵌。ture-内嵌；false以底部弹出框的显示进行弹出
				type:Boolean,
				default:true
			},
			showColumns: {
				type: Array,
				default(){
					return ["keycode","name","groupname"]
				}
			},
			multiple:{
				type:Boolean,
				default:false
			},
			alreadyCheckId:[String,Number,Array]
		},
		computed: {
			...mapState(["themeColorCode"]),
		},
		data() {
			return {
				showPicker:true,//是否显示
				nodataImg:nodataImg,
				pageNum:1,
				pageSize:20,
				page:1,
				basicConfig:{
					defaultLoad:true,//是否默认加载 true默认请求数据库
					otherParams:{},//额外参数
				},
				isLoading:false,//是否正在加载
				listData:[],//列表数据
				checkedData:[],//选择的数据
				checkedIndex:[],
				alreadyCheckId_:[],//已经选中的
				searchParams:{}//搜索参数
			}
		},
		watch: {
			otherParams(){//额外参数发生改变
				this.getListData()
			},
			searchParams(){
				this.getListData()
			}
		},
		methods: {
			changeCheckNodes(param){//改变列表选中数据
				this.alreadyCheckId_ = param.checkedIds
				this.hasAlreadyCheck()
			},
			hasAlreadyCheck(){
				let alreadyCheckNode = this.listData.filter(item => {
						return this.alreadyCheckId_.findIndex( id => `${id}` === `${item.id}`) !== -1
					}) || []
				if(alreadyCheckNode.length) this.checkedData = [...alreadyCheckNode]
			},
			//搜索
			doSearch(params){this.searchParams = params},
			show(){this.showPicker = true;},//弹出列表与insert:false配合使用
			hide(){this.showPicker = false;},//隐藏列表与insert:false配合使用
			maskClick() {this.pickerCancel();},//点击蒙版与insert:false配合使用
			pickerCancel() {this.showPicker = false;},
			pickerConfirm(e) {//添加确定按钮与insert:false配合使用
				this.showPicker = false;
				//如果是多选那么返回树数组，否则返回对象
				if(this.multiple) this.$emit('onConfirm', this.checkedData);
				else this.$emit('onConfirm', this.checkedData.length?this.checkedData[0]:{});
			},
			listItemSelect(nodeID,isChecked,index){//选择或者取消节点
				const isCheckIndex = this.checkedData.findIndex(item => `${item.id}` === `${nodeID}`)
				const node = this.listData[index]
				if(!isChecked){//如果是取消选中
					if(isCheckIndex !== -1){ //checkedData中有该数据时
						if(this.multiple){//如果是多选进行删除checkedData和alreadyCheckId_中对应的值
							const checkIdIndex = this.alreadyCheckId_.findIndex(id => `${id}` === `${nodeID}`)
							this.checkedData.splice(isCheckIndex, 1) 
							this.alreadyCheckId_.splice(checkIdIndex, 1)
						}else{//如果是单选直接替换
							this.checkedData = []
							this.alreadyCheckId_ = []
						}
					}
					this.$emit("unCheckNode",{
						checkList:this.checkedData,
						node:node
					})
				}else{//如果选中
					if(isCheckIndex === -1){ //checkedData中没有该数据时
						if(this.multiple){//如果是多选进行push
							this.checkedData.push(node)
							this.alreadyCheckId_.push(nodeID)
						}else{//如果是单选直接替换
							this.checkedData = [node]
							this.alreadyCheckId_ = [nodeID]
						}
					}
					this.$emit("checkNode",{
						checkList:this.checkedData,
						node:node
					})
				}
			},
			getListData(type='load'){//获取数据
				let pageNum = this.pageNum,
					pageSize = this.pageSize
				if(type === "loadnext" && pageNum==this.page) return
				if(type === "load"){
					if(this.alreadyCheckId) {//重新获取数据时，选中的等于默认选中的
						if(typeof this.alreadyCheckId === "string") this.alreadyCheckId_ = this.alreadyCheckId.split(",")
						else if(typeof this.alreadyCheckId === "number") this.alreadyCheckId_ = [this.alreadyCheckId]
						else this.alreadyCheckId_ = [...this.alreadyCheckId]
					}
					this.pageNum = 1
					pageNum = 1
				}else if(type === "loadnext"){
					this.pageNum++
					pageNum++
				}else if(type=="reload"){
					pageNum = 1
					pageSize = this.pageNum *  _this.pageSize
				}
				
				this.isLoading = true
				const baseParams = this.basicConfig.baseParams || {}
				const pageInfo = {pageNum:pageNum,pageSize:pageSize}
				let params = {...baseParams, ...this.basicConfig.otherParams, ...pageInfo, ...this.searchParams}
				
				listApi.getListData(this, this.basicConfig.url, params)
				.then(value => {
					this.isLoading = false
					let data = value.datalist
					if(type==="load"){//第一次加载或者重新加载
						this.listData = data
						const total = value.total,
							  page = Math.ceil(total/this.pageSize)
						this.page = page
					}else if(type==="loadnext"){
						this.listData = this.listData.concat(data)
					}else if(type==="reload"){
						this.listData = value.datalist
					}
					this.hasAlreadyCheck()
					this.$emit("listInfo",{//设置page和currentPage
						page:this.page,
						currentPage:this.pageNum
					})
				})
			}
		},
		created() {
			//设置默认配置
			this.basicConfig ={...this.basicConfig, ...this.config}
			if(this.alreadyCheckId) {
				if(typeof this.alreadyCheckId === "string") this.alreadyCheckId_ = this.alreadyCheckId.split(",")
				else if(typeof this.alreadyCheckId === "number") this.alreadyCheckId_ = [this.alreadyCheckId]
				else this.alreadyCheckId_ = [...this.alreadyCheckId]
			}
			//insert是否内嵌。ture-内嵌；false以底部弹出框的显示进行弹出
			//如果弹出，默认显示不显示
			this.showPicker = this.insert
			if(this.basicConfig.defaultLoad){
				if(!this.basicConfig.url){
					uni.showToast({ title: "无url", icon: "none" })
					return 
				}
				this.getListData()
			}else{
				this.listData = this.basicConfig.listData || []
				this.hasAlreadyCheck()
			}
			
		}
	}
</script>
