<template>
	<!-- 标准数据选择框弹出框 -->
	<view class="panelTemplate">
		<m-back-bar>
			<block slot="barTitle">{{panelTitile}}</block>
			<block slot="barRight">
				<m-button :isFontBtn="true" 
					v-if="tabInfo.selectShowType == 3"
					key="triggerListTree"
					btnClass="mainColor"
					@elementClick="triggerListTree">
					<block slot="buttonIcon" style="display: inline-block;">
						<m-font-icon icon="iconshuliebiaojiegouqiehuan" :iconSize="40"></m-font-icon>
					</block>
				</m-button>
			</block>
		</m-back-bar>
		<view :class="[checkedList.length?'search-div-hasTip':'search-div']">
			<view class="search">
				<view class="search-content">
					<input v-model.trim="searchText" class="search-text" type="text" focus :placeholder="$i18nMsg('formTip-placeholder')" placeholder-class="placeholder" :adjust-position="false" confirm-type="search" @confirm="doSearch()" />
					<m-button :isFontBtn="true" key="searchBtn" class="search-btn"
						:btnClass="searchText ? 'mainColor':'searchColor'" 
						@elementClick="doSearch()">
						<block slot="buttonIcon" style="display: inline-block;">
							<m-font-icon icon="iconsousuo" :iconSize="32"></m-font-icon>
						</block>
					</m-button>
					<m-button :isFontBtn="true" key="searchBtn1" class="search-btn"
						v-if="treeLoad"
						@elementClick="showColumnList()">
						<block slot="buttonIcon" style="display: inline-block;">
							<m-font-icon icon="iconzhanshizhuangtai" :iconSize="40" color="#FAB71C"></m-font-icon>
						</block>
					</m-button>
				</view>
				<scroll-view v-if="checkedList.length" class="scroll-view_H search-tips" scroll-x="true" scroll-with-animation="true"
				 show-scrollbar="false">
					<view class="scroll-view-item_H" v-for="(item, index) in checkedList" :key="index" :id="`value${index}`">
						<view class="multiple-value">
							<label class="vlaue">{{item.name}}</label><label class="delete" @click="deleteChooose(item.id)">×</label>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="panel-content">
			<m-tree ref="panelTree" v-if="treeLoad && tabInfo.dataSource"
				:dataSource="tabInfo.dataSource" 
				:asyncNode="true" 
				:elementMultiRelation="tabInfo.elementMultiRelation"
				:groupDataSource="groupDataSource"
				:alreadyCheckId = "alreadyCheckId"
				:elementId="elementId"
				:showType = "showColumnType" 
				:multiple="multiple"
				:alreadyCheckedNode = "checkedList"
				@checkNode="showSearchTip"
				@unCheckNode="showSearchTip">
			</m-tree>
			<view class="panel-list" v-if="listLoad">
				<m-plain-list ref="panelList" :config="listConfig"
					:alreadyCheckId = "alreadyCheckId + ''"
					:multiple="multiple" 
					@checkNode="showSearchTip"
					@unCheckNode="showSearchTip"
					@listInfo="setListInfo"></m-plain-list>
			</view>
		</view>
		<view class="panel-bottom">
			<m-button class="btn-item" btnClass="whiteColor" :btnTilte="$i18nMsg('basic-clear')" key="clearBottomBtn" @elementClick="handleClear"></m-button>
			<m-button class="btn-item" btnClass="mainColor" :btnTilte="$i18nMsg('basic-confirm')" key="sureBottomBtn" @elementClick="handleSure"></m-button>
		</view>
		
		<m-plain-list ref="showColumn" 
			:insert="false" 
			:config="showColumnConfig" 
			:showColumns="showColumns"
			:alreadyCheckId="showColumnType"
			@onConfirm="handleShowColumn"></m-plain-list>
	</view>
</template>

<script>
	import bus from '@/static/js/bus'
	import { mapState, mapMutations } from 'vuex'
	import {treeApi, listApi} from '@/common/request/api.js'
	
	import mPlainList from '@/components/makeup/m-plainList.vue';
	import mTree from '@/components/makeup/tree/m-tree.vue';
	
	export default {
		components: {
			mTree,
			mPlainList
		},
		data() {
			return {
				tabInfo: {}, 
				multiple:false,
				showColumnConfig:{
					defaultLoad:false,
					listData:[{
						id:1,
						name:this.$i18nMsg('lang-panelTemplate-name') // 中文：名称
					},{
						id:2,
						name:this.$i18nMsg('lang-panelTemplate-name') + this.$i18nMsg('lang-panelTemplate-coding') // 中文：'名称+编码'
					},{
						id:3,
						name:this.$i18nMsg('lang-panelTemplate-coding') + this.$i18nMsg('lang-panelTemplate-name') // 中文：'编码+名称'
					},{
						id:4,
						name:this.$i18nMsg('lang-panelTemplate-coding') // '编码'
					}]
				},
				showColumnType:3,//树显示类型，默认为1-名称
				showColumns:["name"],
				searchText:"",//搜索内容
				list: [],
				listConfig:{
					defaultLoad:true,
					url:"currencyStandardSelectionBoxList",
					otherParams:{}
				},
				treeLoad:false,//是否已经加载过树
				listLoad:false,//是否已经加载过列表
				selectParent:false,
				groupDataSource:"",
				panelTitile:"",
				alreadyCheckId:"",
				checkedNodeIds:[],
				elementId:"",
				page:1,//总页数
				currentPage:1,//当前页码
				checkedList:[],
				oldCheckedList:[]//最原始选中的节点
			}
		},
		computed: {
			...mapState("common", {panelTemplateParams:'panelTemplateParams'}),//面板参数
		},
		methods: {
			showSearchTip(e){//如果有数据选择，需要显示出已经选中的数据
				console.log(e)
				const {checkList} = e
				let checkedNodes = [],
						checkedNodeIds = []
				checkList.map(item => {//变量返回的选中数据集合
					const {id,name} = item
					// const label = item[this.tabInfo.showColumn] || name
					checkedNodes.push({id,name}) //如果没有存在，就插入checkedList进行显示
					checkedNodeIds.push(id)
				})
				this.checkedList = [...checkedNodes]//记录选中的数据
				this.checkedNodeIds = checkedNodeIds//记录选中的id
			},
			deleteChooose(nodeId){
				const checkIndex = this.checkedList.findIndex(item => `${item.id}` === `${nodeId}`),
							checkedNodesIndex = this.checkedNodeIds.findIndex(item => `${item}` === `${nodeId}`)
				this.checkedList.splice(checkIndex, 1)
				this.checkedNodeIds.splice(checkedNodesIndex, 1)
				if(this.treeLoad)//如果是树
					this.$refs.panelTree.changeCheckNodes({
						checkedIds:this.checkedNodeIds,
						treeCheckNode:this.checkedList
					})
				else this.$refs.panelList.changeCheckNodes({checkedIds:this.checkedNodeIds})
			},
			handleShowColumn(e){
				this.showColumnType = e.id
			},
			showColumnList(){
				this.$refs.showColumn.show()
			},
			doSearch(){//搜索
				if(this.treeLoad){
					let params = ""
					if(this.searchText){
						params = {
							keyWords:this.searchText
						}
					}
					this.$refs.panelTree.doSearch(params)
				}else if(this.listLoad){
					this.$refs.panelList.doSearch({
						keyWords:this.searchText
					})
				}
			},
			triggerListTree(){
				//如果树和列表进行切换时取最原始的值
				this.checkedList = [...this.oldCheckedList]
				let oldnode = []
				for(let i = 0,len = this.oldCheckedList.length;i<len;i++){
					oldnode.push(this.oldCheckedList[i].id)
				}
				this.checkedNodeIds = oldnode
				if(this.treeLoad){
					this.treeLoad = false
					this.listLoad = true
				}else{
					this.treeLoad = true
					this.listLoad = false
				}
			},
			handleSure(){
				let checkNode = {}
				if(this.tabInfo.onKey) //如果有监听key，那么返回数据
					bus.$emit(this.tabInfo.onKey, {
						//如果有选中的id取checkedNodeIds，都在取alreadyCheckId
						//为了兼容弹出选中面板后直接点击确认
						id:this.checkedNodeIds.join(","),
						element:this.tabInfo.element,
					})
				uni.navigateBack()
			},
			handleClear(){
				if(this.tabInfo.onKey) bus.$emit(this.tabInfo.onKey, {id:"",element:this.tabInfo.element})
				uni.navigateBack()
			},
			setListInfo(params){
				this.page = params.page || 1
				this.currentPage = params.currentPage || 1
			},
		},
		
		onReachBottom(){// 上拉加载
			const page = this.page,
				  currentPage = this.currentPage
			if(currentPage === page) return 
			this.$refs.panelList.getListData("loadnext");
		},
		onLoad(options){
			const currentEelemntId = Number(options.elementId)//当前控件的id
			//当前控件id不存在，不进行面板布局 todo 进入报错界面
			if(!currentEelemntId) return 
			this.elementId = currentEelemntId
			
			const currentPanParams = this.panelTemplateParams[currentEelemntId] || {} //获取当前面板参数
			const {isMultiple, checkedList, onKey, mainTableName, selectShowType,
						 elementMultiRelation, element, showColumn, panelTitile,
						 checkId, globalMap} = currentPanParams
						 
			this.multiple = isMultiple//是否多选
			//已经选中的值，需要显示到顶部
			if(checkedList){
				this.oldCheckedList = [...checkedList] //多选时选中的
				this.checkedList = [...checkedList] //多选时选中的
			} 
			if(checkId){
				this.alreadyCheckId = checkId//单选是显示选中
				if(typeof checkId === "string") this.checkedNodeIds = checkId.split(",")
				else if(typeof checkId === "number") this.checkedNodeIds = [checkId]
				else this.checkedNodeIds = [...checkId]
			} 
			const tabInfo = {
				onKey,elementMultiRelation,element, showColumn,
				dataSource:mainTableName,
				selectShowType:selectShowType || 3 //选择框展示类型1=树，2=列表，3=树和列表
			}
			this.tabInfo =  tabInfo
			this.panelTitile = panelTitile || this.$i18nMsg('page-panelTitle')

			this.listConfig.baseParams = {//列表参数
				dataSource:tabInfo.dataSource,
				elementId:this.elementId,
				globalMap
			}
			
			if(tabInfo.selectShowType == 2){//选择框展示类型1=树，2=列表，3=树和列表
				this.treeLoad = false
				this.listLoad = true
			}else{
				this.treeLoad = true
				this.listLoad = false
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "@/static/scss/common/_function.scss";
	.scroll-view-item_H{
		display: inline-block;
	}
	.multiple-value{
		padding: pxToREM(5) pxToREM(17);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size:pxToREM(26);
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(250,100,0,1);
		background:rgba(255,241,231,1);
		border-radius:pxToREM(26);
		line-height:pxToREM(40);
		.vlaue{
			max-width: pxToREM(100);
			overflow: hidden;//隐藏文字
			text-overflow: ellipsis;//显示...
			white-space: nowrap; //不换行
		}
		.delete{
			padding-left: pxToREM(10);
		}
	}
</style>