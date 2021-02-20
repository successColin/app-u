import Vue from 'vue'
import App from './App'
import store from './store'
import VueI18n from 'vue-i18n' 
Vue.config.productionTip = false

// import animated from 'animate.css' 
// Vue.use(animated)

//全局组件
import mFontIcon from '@/components/m-icon/m-fonticon.vue'
Vue.component('mFontIcon',mFontIcon)
import mNormalIcon from '@/components/m-icon/m-normalIcon.vue'
Vue.component('mNormalIcon',mNormalIcon)
import mButton from '@/components/element/m-button.vue'
Vue.component('mButton',mButton)
import mBackBar from '@/components/bar/m-backbar.vue'
Vue.component('mBackBar',mBackBar)
import mLoading from '@/components/loading/loading.vue'
Vue.component('mLoading',mLoading)
import mLodingSvg from '@/components/loading/loadingSVG.vue'
Vue.component('mLodingSvg',mLodingSvg)
import mPop from '@/components/m-pop/mPop.vue'
Vue.component('mPop',mPop)

import graceChecker from '@/common/graceChecker/graceChecker.js'
Vue.prototype.graceChecker = graceChecker

import http from '@/common/utils/request/index.js' 
Vue.prototype.$http = http

//全局方法
import Static_GlobalFucs from '@/static/js/GlobalFunctions.js'
Vue.prototype.pxToREM = function (p){//将px转化成rem
  return (0.03*p) + 'rem';
}

Vue.prototype.Static_GlobalFucs = new Static_GlobalFucs()
// 在Vue的原型链上注册方法，控制组件
Vue.prototype.$Toast = {
	showLoading() { // 显示加载框
		store.commit("Toast/SET_TOAST_LOADING",true)
	},
	hideLoading() { // 隐藏方法
		store.commit("Toast/SET_TOAST_LOADING",false)
	}
}
//全局过滤器
import dateFormat from '@/static/js/dateFormat.js'
Vue.prototype.$dateFormat = dateFormat
Vue.filter('dateFormat', function (time) {
	if(!time) time=""
	if(typeof time === 'number'){
		if(time.length<13){
			time = time * 1000
		}
	}else{
		time = time.replace(/-/g,"/")
	}
	return time ? dateFormat.formatDate(time, "yyyy-MM-dd") : ''
})
//加密
import EncryptionPSW from '@/static/js/encryptionPSW.js'
Vue.prototype.$EncryptionPSW = EncryptionPSW

Vue.use(VueI18n)
Vue.prototype.$store = store

const lang = uni.getSystemInfoSync().language
let baseLang = 'zh_CN' //判断系统语言
if(lang==="en" || lang==="en_US"){
	baseLang = "en_US"
}else{
	baseLang = "zh_CN"
}

const i18n = new VueI18n({
    locale : uni.getStorageSync("locale") || baseLang, //语言标识
    messages: {
        'en_US' : require('common/lang/en.js') ,
        'zh_CN' : require('common/lang/zh.js') 
    }
})

Vue.prototype._i18n = i18n

Vue.prototype.$i18nMsg = function(e){//方便调用js文件而写
    if(e){
        // console.log(i18n.messages[i18n.locale].index.e); //undefined
        // //用key键值对的方式去写
        // console.log(i18n.messages[i18n.locale].index[e]);
        return i18n.messages[i18n.locale].index[e]
    }
    return ' ' //防止没有数据时，占位使用
}
App.mpType = 'app'

const app = new Vue({
	i18n,
	store,
    ...App
})
app.$mount()
