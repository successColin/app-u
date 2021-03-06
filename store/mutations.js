import vue from 'vue'

const mutations = {
	STATE_formElementFocus(state,uid){
		state.formElementFocus = uid
	},
	STATE_INIT(state){
		state.mpvuePickerShow = false
		state.formElementFocus = false
		state.isOriginHei = true
	},
	SHOW_UPLOAD(state, show){//是否显示更新框
		state.showUpload = show
	},
	SET_FRAMETYPE(state, frameType){//设置框架类型
		state.frameType = frameType
	},
	SET_VERSIONINFO(state, verisioninfo){//设置版本信息
		state.appVersionInfo = verisioninfo
	},
	SET_SCREEN_HEIGHT(state, screenHeight) {//设置screenHeight
		state.screenHeight = screenHeight
	},
	SET_SYSPARAMER(state, param){//设置全局变量
		state[param.key] = param.value 
	},
	SET_WATERMARK(state, param){//设置水印全局变量
		state.waterMarkConfig = param
	},
	SET_APPVERSION(state, appversions){
		state.currentVersion = appversions.currentVersion || ""//app版本号
		state.baseVersion = appversions.baseVersion || ""//基座版本号
	},
	SET_LOGIN_STATE(state, params) {//设置登录信息
		state.userInfo = params
		state.userDesigner = params.userDesignerId || "" //用户设计组
		state.userId = params.id || "" //用户id
		state.userKey = params.keycode || "" //用户编码
		state.userName = params.account || "" //用户账号
		state.account = params.account || "" //用户账号
		state.username = params.username || "" //用户名称
		state.usertelephone = params.telephone || "" //电话
		state.token = params.token || ""
		state.appVersion = params.appVersion || ""
		state.email = params.email || ""
		state.telephone = params.telephone || ""
		state.personalSignal = params.personalSignal || ""
		state.userImgPath = ''
		state.upgradeURL = params.upgradeURL || ""
		state.userImag = params.picpath || ""
		state.baseLatestVersion = params.pedestalNum || "915000",//最新基座版本号
		
		//
		state.formElementFocus = ''
		
		//更新包地址
		state.upgradeMode = params.upgradeMode || 1,//更新类型
		state.appUploadUrl = {//app更新地址
			installAtionPackAgeURL: params.installAtionPackAgeURL || "",//手动更新地址
			androidDownloadUrl: params.androidDownloadUrl || "",//安卓安装包地址
			iosDownloadUrl: params.iosDownloadUrl || "",//ios安装包地址
			upgradeURL: params.upgradeURL || ""//升级包地址
		}
	},
	SET_FORM_PickerShow(state,flag){//是否有下拉框张开
		state.mpvuePickerShow = flag
	},
	SET_ORIGIN(state, params) {
		if(state.mpvuePickerShow) params = false //如果有下拉框张开底部按钮不显示
		state.isOriginHei = params
	},
	SET_bundle(state, bundle) {//设置当前bundle
		state.bundleId = bundle.bundleId
		state.bundleName = bundle.bundleName || ''
	},
	SET_BusinessID(state, BusinessID) {//设置主业务Id
		state.BusinessID = BusinessID
	},
	UPDATE_USER_STATE(state, params) {//更新个人信息
		state.userImag = params.picpath
		state.email = params.email
		state.telephone = params.telephone
		state.personalSignal = params.personalSignal
	},
	UPDATE_SERVERURL_STATE(state, params) {//更新服务器url
		state.baseUrl = params
	},
	UPDATE_THEME_COLOR(state, params) {//更新服务器url
		state.themeColor = params.color
		state.themeColorCode = params.colorCode
	},
	SET_LOGIN_CONFIG(state, params){//设置版本信息
		state.appLoginLogo = params.appLoginLogo
		state.technicalSupport = params.technicalSupport
	},
}

export default mutations