<template>
	<div class="m-fonticon" v-if="icon" >
		<i class="icon iconfont"
			:style="{fontSize:iconSize,color:color}"
			:class="[icon, iconClass]" 
			@click="onClick()">
			<slot></slot>
		</i>
	</div>
</template>

<script>
	export default {
		props: {
			icon: String,//文本框图标
			iconSize: {//图标大小
				type:String,
				default: "1.08rem"
			},
			iconClass:String,//icon的样式
			color:String,
		},
		methods: {
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>
<style>
	.icon{
		width: 100%;
	}
</style>

