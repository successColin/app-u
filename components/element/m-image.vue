<template name="mImage">
	<!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
	<view v-if="element.visiabled && showUrl.length>0">
		<swiper class="swiper">
			<swiper-item v-for="(item,index) in showUrl" :key="index">
				<image :src="item" style="width: 100%;height: 100%;"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import {fileApi} from '@/common/request/api.js'
	export default {
		name:"mImage",
		props:{
			element:{type:Object,default(){return {}}},
			relationId:{type:[Number,String],default:""}
		},
		computed: {
			...mapState(["token"]),
			showUrl() {
				return this.swiperUrl.length>0?this.swiperUrl:[`${this.element.url}`]
			}
		},
		data() {
			return{
				swiperUrl:[]
			}
		},
		methods:{
			getImage(){
				if(!this.relationId) return 
				fileApi.getRelationFile({
					relationId:this.relationId,
					relationTableName:this.element.relationTableName,
				})
				.then(pics => {
					this.swiperUrl = pics.map( function(item){return item.url} )
				})
			}
		},
		created(){
			this.getImage()
		}
	}
</script>
<style scoped>
	.swiper{
		width: 100%;
		height: 680upx;
		background: #FFFFFF;
	}
</style>
