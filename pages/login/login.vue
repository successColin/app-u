<template>
	<div class="app-content">
		<!-- #ifdef APP-PLUS || MP -->
		<view class="app-statusBar" :style="{background:themeColorCode}">
			<view class="top_view" :style="{background:themeColorCode}"></view> 
		</view>  
		<!-- #endif --> 
		<div class="content login animated fadeIn" :style="{background:themeColorCode}"> 
			<view class="login-header mainColor">
				<div class="loginheader-item">
					<image class="loginLogo" mode="heightFix" :src="appLoginLogo || logo"></image>
				</div>
				<div class="loginheader-text">Hi，欢迎登录{{technicalSupport || 'APIoT'}}！</div>
				<m-font-icon class="loginGear1" icon="APP_61" :iconSize="192"></m-font-icon>
				<m-font-icon class="loginGear2" icon="APP_61" :iconSize="80"></m-font-icon>
				<span class="cover" :style="{background:themeColorCode}"></span>
			</view>
			<div class="login-content">
				<view class="login-content-title">
					<span class="mainColor" :style="{color:themeColorCode}">Log in </span> to your account
				</view>
				<view class="login-items">
					<view class="login-item">
						<m-input-lable class="m-input" :element="userElemnt" ref="username" sourceType="form"
						 :value="formData.username"
						 @changeValue = "changeValue">
							<m-font-icon :color="themeColorCode" class="label-icon" slot="labels" icon="APP_62" :iconSize="48"></m-font-icon>
						</m-input-lable>
					</view>
					<view class="login-item">
						<m-input-lable :element="passworderElemnt" sourceType="form" ref="password"
						 :value="formData.password"
						 :showPassword = "isShowPassword"
						 @changeValue = "changeValue">
							<m-font-icon slot="btns" :icon="passwordIcon" :iconSize="48" @click="showPassword"></m-font-icon>
							<m-font-icon :color="themeColorCode" class="label-icon" slot="labels" icon="APP_63" :iconSize="48"></m-font-icon>
						</m-input-lable>
					</view>
					<div class="login-item login-content-footer">
						<!-- <view class="password-forget">
							<m-button :btnTilte="$i18nMsg('user-forget')" :isFontBtn="true" :fontSize="28" @elementClick="forgetPassword"></m-button>
						</view> -->
						<view class="login-remb" :class="{remeber:remeber}">
							<m-button :isFontBtn="true" :fontSize="28" @elementClick="rememberPassword">
								<block slot="buttonIcon" style="display: inline-block;">
									<m-font-icon icon="iconjizhumimaxuanzhong" :iconSize="32"></m-font-icon>
									<p class="user-remember">{{ $i18nMsg('user-remember') }}</p>
								</block>
							</m-button>
						</view>
					</div>
				</view>
				<view class="login-btn">
					<!-- 中文：登录 -->
					<m-button ref="loginBtn" :class="formData.password && formData.username ? '' : 'lightBtn'" :disabled="disabled" :isLoading="isLoading" :btnTilte="$i18nMsg('page-signIn')" btnClass="mainColor" @elementClick="doLogin"></m-button>
				</view>
			</div>
			<view class="login-foot">
				<view>由 <span @tap="selectServer" :style="{color:themeColorCode}">{{technicalSupport || 'APIoT'}}</span> 提供技术支持</view>
			</view>
		</div> 
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import mInputLable from '../../components/element/m-inputLable1.vue'
	import {homeApi} from '@/common/request/api.js'
	
	import logo from "@/static/images/logo.png"
	import EncryptionPSW from '@/static/js/encryptionPSW.js'
	const remberUser = uni.getStorageSync('loginMsg') || {}
	export default { 
		name:"Login",
		components: {mInputLable},
		data() {
			return {
				userElemnt:{visiabled:1,labletPositon:"top",label:this.$i18nMsg('user-username'),name:"username",placeholderText:this.$i18nMsg('entry-username')},//中文："账号"
				passworderElemnt:{visiabled:1,labletPositon:"top",label:this.$i18nMsg('user-password'),name:"password","inputType":'password',placeholderText:this.$i18nMsg('entry-password')},//中文："密码"
				remeber:true,//默认记住密码
				formData:remberUser,
				PasswrodEncrypted:"0",
				disabled:true,
				isLoading:true,
				passwordIcon:'iconmimayincang',
				isShowPassword:true,
				logo:logo
			}
		},
		computed: {
			...mapState(["appLoginLogo","technicalSupport","themeColorCode"])
		},
		methods:{
			...mapMutations(["SET_LOGIN_STATE","SET_SYSPARAMER","SET_WATERMARK"]),
			...mapMutations("Inspection",["set_inspection_photoSourceType"]),
			showPassword(){//点击icon
				if( this.isShowPassword){
					this.passwordIcon = 'iconmimaxianshi'
					this.isShowPassword = false
				}else {
					this.passwordIcon = 'iconmimayincang'
					this.isShowPassword = true
				}
			},
			changeValue(param){
				console.log(param)
				this.formData[param.element.name] = param.value
			},
			//忘记密码
			forgetPassword() {
				let locale = this._i18n.locale === 'en_US' ? 'zh_CN' : 'en_US'
				uni.setStorageSync("locale",locale)
				plus.runtime.restart();  
			},
			//记住密码
			rememberPassword() {this.remeber = this.remeber ? false : true},
			selectServer(){
				uni.navigateTo({
					url:"selectServer"
				})
			},
			//登录
			doLogin () {
				this.isLoading=true
				this.disabled=true
				setTimeout(() => {
					//是否校验通过
					
					const checkRes = this.Static_GlobalFucs.checkForm({
						rule:[
							{name:"username", checkType : "notnull", checkRule:"",  label:`${this.userElemnt.label}`},//中文："用户不能为空"
							{name:"password", checkType : "notnull", checkRule:"",  label:`${this.passworderElemnt.label}`}//中文："密码不能为空"
						],
						data:this.formData
					})
					if(!checkRes.isCheck){
						this.Static_GlobalFucs.showToast({title:checkRes.errorMsg})
						this.isLoading=false
						this.disabled=false
						return 
					}
					
					//是否需要记忆密码
					if(this.remeber) uni.setStorageSync('loginMsg', this.formData)
					else uni.removeStorageSync('loginMsg')
					
					let encyData = EncryptionPSW(this.formData,this.PasswrodEncrypted)
					encyData.language=this._i18n.locale //记录语言
					homeApi.getToken(this, encyData).finally(()=>{
						this.isLoading=false
						this.disabled=false
					})
				}, 50)
			},
			getSysParamer(params){
				return homeApi.sysParamer(this, params)
			},
			saveWaterMarkConfig(params){
				this.$http.get('variable/getValue', {variableName: 'WaterMarkConfig'})
				.then(res => {
					const result = res.data.data
					this.SET_WATERMARK(result)
				})
				.catch(err => {
					console.log(JSON.stringify(err))
				});
			}
		},
		mounted() {
			let formData = uni.getStorageSync('loginMsg') || {}
			if(JSON.stringify(formData) !== "{}"){
				this.remeber = true
			}
			//登录之前获取必要的系统参数
			this.getSysParamer("PasswrodEncrypted").then( (res) => {
				this.PasswrodEncrypted = res.data //设置密码是否加密
				
				this.isLoading=false
				this.disabled=false
			})
			this.getSysParamer("useLocalPhotoGallery").then( (res) => {
				this.set_inspection_photoSourceType(res.data)//设置点巡检图片选取
			})
			this.saveWaterMarkConfig('WaterMarkConfig')
		},
		onLoad(){
			this.SET_LOGIN_STATE({})
		}
	}
</script>