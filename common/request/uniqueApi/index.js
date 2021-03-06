import {base64Encode} from '@/static/js/base64encode.js'

const singleLogin = 'sso/auth' //单点登录
const getLoginKey = 'ssoCommon/getLoginKey' //获取令牌
const getUserInfoByAccount = 'sso/ssoByAccount' //根据账号获取用户信息
const getToken = 'ssoCommon/ssoAuth' //获取uid
const getUserInfoByToken = 'ssoCommon/getUserInfoByToken' //获取用户信息
const getITUserInfoByToken = 'itSso/getAccount' //通过上海电气接口获取用户信息

/**
 * 阿斯利康单点登录
 * 地址中，阿斯利康会注入用户信息code:用户账号，根据code获取系统用户信息
 */
export const APP_singleLogin = (param , _this) => {//阿斯利康单点登录
	const reg = new RegExp("(^|&)code=([^&]*)(&|$)", "i");//从地址中获取用户信息
	const r = window.location.search.substr(1).match(reg);
	if ( !r ){
		return new Promise((resolve, reject) => {/* executor函数 */
		    reject("请重新登录");
		})
	}else{
		param.type = 1
		param.threesidetoken = r[2]
		return _this.$http.post(singleLogin, param)//通过获取到的code获取本系统的用户信息
		.then(res => {
			const result = res.data || {}
			if(result.success){
				return result && result.data
			}else{
				reject({
					type:'noTurnUp',
					msg:result.msg || '操作错误'
				})
			}
		})
	}
}

/**
 * 上海电气IT资产单点登录
 * 在域中上海电气会注入cookie，从cookie中可以获取上海电气的token，更具token从上海电气提供的接口中获取用户code
 * 更具获取回来的code，获本系统的用信息
 */
export const APP_StandardSingleLoginIT = async(param , _this) => {//上海电气IT资产单点登录
	const domainCookie = document.cookie || '',//获取cookie中的值
				LtpatokenKey = "LtpaToken="//cookie中会存在Ltpatoken，可以通过该值从上海电气中获取用户code
	let queryParamObj = {},
			offset = domainCookie.indexOf (LtpatokenKey),
			Ltpatoken = ''
	if (domainCookie.length > 0 && offset!==-1) {//获取Ltpatoken的值
		offset += LtpatokenKey.length
		let end = domainCookie.indexOf (";", offset)
		if (end === -1) end = domainCookie.length
		Ltpatoken = domainCookie.substring (offset, end)
	}
	if(!Ltpatoken){//如果没有Ltpatoken，前台提示错误
		return new Promise((resolve, reject) => {/* executor函数 */
		  reject(`没有有效cookie,请重新登录.cookie:${domainCookie};Ltpatoken:${Ltpatoken}`);
		})
	}else{
		// const submitUrl = "http://webqas02.shanghai-electric.com/" // 测试环境
		// const submitUrl = "http://secinterface02.shanghai-electric.com/" //正式环境
		let getUserCodeParam = {
			"itToken": Ltpatoken,
			"hasCompanyInfo": true, // 是否需要包含组织结构信息
			"hasAuthInfo": true, // 是否需要包含权限数据
		}
		let userCode = '',
				errMsg = ''
		// 通过Ltpatoken从上海电气方获取用户的code
		await _this.$http.post(getITUserInfoByToken,getUserCodeParam, {//测试：2edBec7d 正式：Gt54rfvb
			errorNoRefresh:true,noToken:true,iSNonstandard:true
		}).then(res => {
			let result = res.data || {}
			console.log(JSON.stringify(result))
			console.log(JSON.stringify(res))
			if(!result.isError){//如果成功
				let uesrInfo = result.account
				userCode = uesrInfo.code
			}else{
				errMsg =`上海电气接口提示:${result.message || ''},cookie:${domainCookie};Ltpatoken:${Ltpatoken}`
			}
		}).catch(err => {
			errMsg =`上海电气接口错误:${err},cookie:${domainCookie};Ltpatoken:${Ltpatoken}`
		});
		//通过用户code从ams中获取用户信息
		let userMsg = ''
		if(userCode){
			let userCodeMD5 = _this.$EncryptionPSW({userCode}, 1) // MD5加密
			param.account = userCodeMD5.userCode
			await _this.$http.post(getUserInfoByAccount, param,{
				errorNoRefresh:true,noToken:true
			}).then(res => {
				const result = res.data || {}
				userMsg = result.data
			}).catch(err => {
				errMsg = err || `ams接口错误,用户:${userCode};`
			});
		}
		
		if(!userMsg){
			return new Promise((resolve, reject) => {/* executor函数 */
			  return reject(`${errMsg}`);
			})
		}else {
			return userMsg
		}
	}
}

/**
 * 标准单点登录
 * 其他系统进入本系统是通过getLoginKey、getToken最终获取到本系统的token，并将token注入到地址uid=$token
 * 进入本系统后，获取地址中的uid
 * 更具uid获取本系统用户信息
 */
export const APP_StandardSingleLogin = (param , _this) => {//标准单点登录
	const url = window.location.href;//获取地址中参数
	let queryParamObj = {}
	if (url.indexOf("?") != -1) {
		const queryParamStr = url.split("?")[1];
		const queryParam = queryParamStr.split("&");
		for (let i = 0,len = queryParam.length; i < len; i++) {
			queryParamObj[queryParam[i].split("=")[0]] = queryParam[i].split("=")[1]
		}
	}
	if ( !queryParamObj.uid ){//从参数中获取uid，uid对应本系统的token
		return new Promise((resolve, reject) => {
		  reject("没有uid,请重新登录");
		})
	}else{//根据获取到的uid，通过后端接口根据uid获取用户信息
		param.accessToken = queryParamObj.uid
		return _this.$http.post(getUserInfoByToken, param)
		.then(res => {
			const result = res.data || {}
			if(result.success){
				return result && result.data
			}else{
				reject({
					msg: `uid:${queryParamObj.uid}，${result.msg || '登录失败,请查询'}`
				})
			}
		}).catch(err => {
			uni.showModal({
				title:_this.$i18nMsg("basic-modalTipError"),
				content:`uid:${queryParamObj.uid}，${err || '登录失败,请查询'}`,
				showCancel:false,
				confirmText:_this.$i18nMsg("basic-confirm")
			})
		});
	}
}
export const APP_GetStandardUid = async(account, submitUrl , _this) => {//获取uid
	let timeStamp = new Date().getTime() // 时间搓
	let timeStampPSW = _this.$EncryptionPSW({timeStamp}, 1, "MD5") // MD5加密
	const timeStampMD5 = timeStampPSW.timeStamp,
				loginKeyParam = {timeStamp, checkSum: timeStampMD5 } //获取令牌时的参数
	
	let loginKey = ''
	await _this.$http.post(getLoginKey,loginKeyParam, {
		errorNoRefresh:true,noToken:true,submitUrl
	}).then(res => {
		const result = res.data || {}
		if(result.success) loginKey = result.data
	}).catch(err => {
		uni.showModal({
			title:_this.$i18nMsg("basic-modalTipError"),
			content:err,
			showCancel:false,
			confirmText:_this.$i18nMsg("basic-confirm")
		})
	});
	
	let uid = "",
			tokenPSW = _this.$EncryptionPSW({"value":`${timeStamp}${loginKey}${account}`}, 1, "MD5"),
			tokenParam = {loginKey,account,timeStamp,"checkSum": tokenPSW.value}
	await _this.$http.post(getToken,tokenParam, {
		errorNoRefresh:true,noToken:true,submitUrl
	}).then(res => {
		const result = res.data || {}
		if(result.success) uid = result.data
	}).catch(err => {
		uni.showModal({
			title:_this.$i18nMsg("basic-modalTipError"),
			content:err,
			showCancel:false,
			confirmText:_this.$i18nMsg("basic-confirm")
		})
	});
	return uid
}