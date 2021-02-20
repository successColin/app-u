<template name="mSuperscript">
	<view class="superscript">{{count}}</view>
</template>

<script>	
	export default {
		name:"mSuperscript",
		props:{
			count:{type:[Number,String],default: 0},//值
			color:{type:String,default: "#ececec"},
		},
		methods:{
		},
	}
</script>
<style scoped>

</style>
