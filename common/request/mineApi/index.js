const homePageThirdPartyLinks = 'pcHomePageThirdPartyLinks/selectList' //获取第三方连接

export const getHomePageThirdPartyLinks = (param , _this) => {
	return _this.$http.post(homePageThirdPartyLinks, param)
	.then(res => {
		const result = res.data || {}
		return result && result.data
	})
	.catch(err => {
		uni.showModal({
			title:_this.$i18nMsg("basic-modalTipError"),
			content:result.msg,
			showCancel:false,
			confirmText:_this.$i18nMsg("basic-confirm")
		})
		return []
	})
}