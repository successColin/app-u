<template name="workbench">
	<view class="workbench"> 
		<m-back-bar backStyle="backStyleNoBack" >
			<block slot="barTitle">{{barTitle}}</block>
		</m-back-bar>
		<mni-banner :source="figureList" duration="500" interval="5000"></mni-banner>
		<view class="bundle-list" v-if="workSpaceList.length>0">
			<view class="hasMainBundle" v-if="topCoreList.length>0"></view>
			<m-group-area v-for="(group,index) in workSpaceList" 
			 :class="{'margin':(index==0 && topCoreList.length>0)}" 
			 :areaStype="2"
			 :name="group.showGroupName ? group.name : ''" 
			 :key="index">
				<view v-if="group.styleType" class="bundle-group">
					<view hover-class="none" class="bundle-item" 
						:class="[groupShowType[group.styleType]]"
						v-for="(bundle,bundleindex) in group.list" 
						:key="bundleindex"
						@click="handleNav(bundle)">
							<block v-if="group.styleType === 3 && bundle.picpath">
								<image :src="bundle.picpath" class="bundle-item-content"></image>
							</block>
							<block v-else-if="group.styleType === 2">
								<view class="bundle-item-content" :style="{backgroundColor:bundle.colorCode[2]}">
									<m-font-icon :icon="bundle.iconName" :iconSize="iconSize[group.styleType-1]" :color="bundle.colorCode[0]"></m-font-icon>
									<view class="bundle-item-name" :style="{color:bundle.colorCode[1]}">
										{{bundle.bundleName }}
										<!-- <i class="icon iconfont APP_47 iconbtn"></i> -->
									</view>
								</view>
							</block>
							<block v-else-if="group.styleType === 4">
								<view class="bundle-item-content" :style="{backgroundColor:bundle.colorCode[1]}">
									<m-font-icon :icon="bundle.iconName" :iconSize="iconSize[group.styleType-1]" :color="bundle.colorCode[0]"></m-font-icon>
									<view class="bundle-item-right">
										<view class="bundle-item-name">{{bundle.bundleName }}</view>
										<view class="bundle-item-subtext">进入操作>></view>
									</view>
								</view>
							</block>
							<block v-else>
								<m-font-icon :icon="bundle.iconName" :iconSize="iconSize[group.styleType-1]" :color="bundle.colorCode"></m-font-icon>
								<m-superscript v-if="countsql && countsql[bundle.id] && countsql[bundle.id]!= -1" :count="countsql[bundle.id]"></m-superscript>
								<!-- #ifdef APP-PLUS-->
								<i v-else-if="newBundle[bundle.id] && (!countsql || !countsql[bundle.id])" class="iconfont iconnew new"></i>
								<!-- #endif -->
								<view class="bundle-item-name">{{bundle.bundleName }}</view>
							</block>
					</view>
				</view>
			</m-group-area>
		</view>
	</view>
</template>

<script>
	import {BUNDLE_SHOW_TYPE} from '@/common/constant/bundle.js'
	import {FRAMS_TYPE} from '@/common/constant/frams.js'
	
	import mGroupArea from '@/components/element/m-groupArea.vue'
	import minBadge from '@/components/min-badge/min-badge'
	import mSuperscript from '@/components/element/m-superscript.vue'
	import mniBanner from '@/components/mniBanner/MniBanner.vue' 
	
	import { mapState, mapMutations } from 'vuex'
	export default {
		name:"workbench",
		components: {
			mGroupArea,
			minBadge,
			mSuperscript,
			mniBanner,
		},
		props:{
			barTitle:{
				type:String,
				default:'工作台'
			}
		},
		data(){
			return {
				topopacity:0,
				topshow:false,
				height:340,
				iconSize:[56,50,0,64],
				mainiconSize:86,
				groupShowType:BUNDLE_SHOW_TYPE
			}
		},
		computed: {
			...mapState(["screenHeight","themeColor"]),
			...mapState("home", {
				leftList:'leftList',
				rightList:'rightList',
				workSpaceList:'workSpaceList',
				topCoreList:'topCoreList',
				newBundle:'newBundle',
				countsql:'countsql',
				figureList:'figureList'
			}),
			height_() {
				return uni.upx2px(this.height)
			},
			themeClass_(){//与主题she检修关联
				const mainColor = ["mainColor","whiteColor"]
				return this.themeColor !=='red' ? ("mainColor-" + this.themeColor) : 'mainColor'
			}
		},
		methods: {
			...mapMutations(["SET_FRAMETYPE"]),
			handleNav(bundle){//如果没有框架信息，提示功能正在开发中
				if(!bundle.template){
					const _this = this
					_this.Static_GlobalFucs.showModal(_this,{
						title:_this.$i18nMsg("basic-inquiry"),
						content:_this.$i18nMsg("pageTip-configuration"),
						showCancel:false
					})
					return 
				}
				this.SET_FRAMETYPE(FRAMS_TYPE[bundle.bundleFrameType])
				const url=`/pages/${bundle.template}?title=${bundle.bundleName}&bundleId=${bundle.id}&mainTab=1&V=${bundle.bundleVersion}`
				uni.navigateTo({
					url:url
				})
				if(this.countsql && this.countsql[bundle.id]){
					this.countsql[bundle.id] = -1;
				}
			}
		}
	}
</script>
<style type="text/css" scoped>
	.gradient-text-one{  
		background-image:linear-gradient(180deg,rgba(243,175,125,1) 0%,rgba(227,71,74,1) 100%);
		-webkit-background-clip:text; 
		-webkit-text-fill-color:transparent; 
	}
	.haveStatusBar,.topshow-status,.hasstatus{
		height: var(--status-bar-height);
	}
	.topBtn{top: var(--status-bar-height);}
	.barmargin{margin-top:--status-bar-height}
</style>
