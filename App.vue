<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		methods: {
			...mapMutations([
				"SET_SCREEN_HEIGHT"
			]),
		},
		onLaunch: function() {
			// #ifdef APP-PLUS
				plus.screen.lockOrientation('portrait-primary')//锁定竖屏正方向
			// #endif  
			const res = uni.getSystemInfoSync()
			this.SET_SCREEN_HEIGHT(res.screenHeight)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* @import "colorui/main.css"; */
	@import url("static/iconfont/iconfont.css");
	@import url("static/css/animate.min.css");
	@import url("static/css/style.css");
	@import url("components/feng-parse/parse.css");
		/*每个页面公共css */
		
	/* ==================
	        初始化
	 ==================== */
	html{font-size:20px;}
	html,body,input,button {
		padding: 0;
		margin: 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	html,body,uni-page-body{
		width: 100%;
		min-height: 100%;
		font-family: PingFangSC-Regular,PingFang SC;
	}
	body,page{
		background-color: #FAFAFA;
		min-height: 100%;
		display: flex;
		font-family: PingFangSC-Regular,PingFang SC;
	}	
	view,
	scroll-view,
	swiper,
	button,
	input,
	textarea,
	label,
	navigator,
	image {
		box-sizing: border-box;
		font-weight: 400;
	}
	input,textarea{
		user-select: text !!important;
	}
	input [disabled],
	textarea [disabled] {  
	  opacity: 1;  
	  -webkit-text-fill-color: currentcolor;  
	}
	ul,li{padding: 0;margin: 0;}
	li {list-style-type:none;}
	.round {
		border-radius: 5000upx;
	}
	
	.radius {
		border-radius: 6upx;
	}
	
	/* ==================
	          图片
	 ==================== */
	
	image {
		max-width: 100%;
		display: inline-block;
		position: relative;
		z-index: 0;
	}
	
	image.loading::before {
		content: "";
		background-color: #f5f5f5;
		display: block;
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -2;
	}
	
	image.loading::after {
		content: "\e7f1";
		font-family: "cuIcon";
		position: absolute;
		top: 0;
		left: 0;
		width: 32upx;
		height: 32upx;
		line-height: 32upx;
		right: 0;
		bottom: 0;
		z-index: -1;
		font-size: 32upx;
		margin: auto;
		color: #ccc;
		-webkit-animation: cuIcon-spin 2s infinite linear;
		animation: cuIcon-spin 2s infinite linear;
		display: block;
	}
	/*每个页面公共css */
	.app-content {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.content{flex: 1}
	.app-statusBar {  
		height: var(--status-bar-height);  
		width: 100%; 
		 /* #ifndef MP */
		background-color: #fff;
		/* #endif */
		/* #ifdef MP */
		background-color: $main-color;
		/* #endif */
		flex-shrink: 0;
	}  
	.app-statusBar .top_view {  
		height: var(--status-bar-height);  
		width: 100%;  
		position: fixed;  
		/* #ifndef MP */
		background-color: #fff;
		/* #endif */
		/* #ifdef MP */
		background-color: $main-color;
		/* #endif */
		top: 0;  
		z-index: 999;  
	}  
</style>
