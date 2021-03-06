const state ={
	showUpload:false,
	themeColor:"red",
	themeColorCode:"rgba(198,33,39,1)",//颜色编码 
	passwordStrength:3,//密码强度
	platform:'APP',//平台
	appName:"APIoT",//平台名称
	appKeyCode:'apioteam',//appid APP-000006(207) 001029（fast）APP-000022 apioteam
	userDesigner:"",//用户设计组
	userId:"",//用户id
	userKey:"",//用户编码
	userName:"",//用户账号
	account:"",//用户账号
	username:"",//用户名称
	usertelephone:'',
	userImag:'',//用户头像
	token:"",
	static_param:"MP_CM",//MP_CM移动小程序
	bundleName:"",//boundle标题
	bundleId:null,//当前点击的boundleId
	//data
	forcedLogin:true,//是否强制登入
	hasLogin:false,//是否登入
	screenHeight:0,//手机可视高度
	isOriginHei:true, //根据弹出键盘是否隐藏
	mpvuePickerShow:false,//是否有下拉框显示
	email:"", //用户邮箱
	telephone:"", //用户手机号
	appVersion:"", //app版本号
	baseVersion:"",//当前基座版本号
	baseLatestVersion:"915000",//最新基座版本号
	currentVersion:"",//当前手机对应的版本号
	appVersionInfo:[], //app版本信息
	BusinessID:"",//主业务Id
	ParentID:"",//父组件值
	upgradeMode:1,//更新类型，1-更新包；2-安装包；3-手动下载
	appUploadUrl:{//app更新地址
		installAtionPackAgeURL:"",//手动更新地址
		androidDownloadUrl:"",//安卓安装包地址
		iosDownloadUrl:"",//ios安装包地址
		upgradeURL:""//升级包地址
	},
	formElementFocus:'',//聚焦控件的uid
	upgradeURL:"",//升级地址
	VerifyCode:0,//是否有验证码
	LoginOUTURL:0,//登出地址
	PasswrodEncrypted:0,//是否加密
	baseUrl:uni.getStorageSync('baseUrl') || '',//服务器url
	frameType:"",//框架类型
	userInfo:{},
	shareBaseUrl:"https://v9.mingcloud.top:8081",
	singleLogin:false,
	// #ifdef H5
	defaultUrl : "/eam/",//默认url 
	// #endif 
	// #ifndef H5  
	defaultUrl:"http://118.178.85.107:8081/eam/",
	// #endif 
	appLoginLogo:'',	//登录logo
	technicalSupport:'APIoT',
}

export default state