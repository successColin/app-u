(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/basic/myself"],{"151a":function(e,n,t){"use strict";var a,o=function(){var e=this,n=e.$createElement,t=(e._self._c,e.$i18nMsg("lang-myself-userQualification")),a=e.$i18nMsg("lang-myself-changePassword"),o=e.$i18nMsg("lang-myself-ClearCache"),r=e.$i18nMsg("lang-myself-qrcode"),i=e.$i18nMsg("lang-myself-VersionInformation"),s=e.$i18nMsg("lang-myself-switchLanguage"),c=e.$i18nMsg("lang-myself-otherweb");e.$mp.data=Object.assign({},{$root:{m0:t,m1:a,m2:o,m3:r,m4:i,m5:s,m6:c}})},r=[];t.d(n,"b",(function(){return o})),t.d(n,"c",(function(){return r})),t.d(n,"a",(function(){return a}))},2710:function(e,n,t){},"5da4":function(e,n,t){"use strict";var a=t("2710"),o=t.n(a);o.a},ae55:function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=t("2f62");o(t("9fc3"));function o(e){return e&&e.__esModule?e:{default:e}}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){s(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}var c=function(){t.e("components/element/m-groupArea").then(function(){return resolve(t("8ffc"))}.bind(null,t)).catch(t.oe)},l={name:"myself",components:{mGroupArea:c},data:function(){return{iconSize:42,iconSize2:56,storageInfo:"",storageKeys:[],outLinkList:[]}},props:{barTitle:{type:String,default:"我的"}},computed:i({},(0,a.mapState)(["username","userId","userName","userImage","personalSignal","themeColor"]),{},(0,a.mapState)("home",["enabledData","myWorkSpace"]),{themeClass_:function(){return"red"!==this.themeColor?"mainColor-"+this.themeColor:"mainColor"}}),methods:i({},(0,a.mapMutations)(["SET_FRAMETYPE","SET_USER_IMAGE"]),{clearStorageInfo:function(){var n=this;e.showModal({title:n.$i18nMsg("lang-myself-Tips"),content:n.$i18nMsg("lang-myself-isClearCache")+n.storageInfo,confirmText:n.$i18nMsg("lang-form-modalConfirm"),cancelText:n.$i18nMsg("lang-form-modalCancel"),success:function(t){if(t.confirm){for(var a=0;a<n.storageKeys.length;a++){var o=n.storageKeys[a];"language"!=o&&"baseUrl"!=o&&"inTestServer"!=o&&"formalServer"!=o&&"outTestServer"!=o&&"otherTestServer"!=o&&e.removeStorageSync(o)}e.showToast({title:n.$i18nMsg("lang-myself-CacheClearanceSuccessful"),duration:1e3}),n.storageInfo=0}}})},loginOut:function(){var n=this;e.showModal({title:n.$i18nMsg("lang-myself-Tips"),content:n.$i18nMsg("lang-myself-isLoginOut"),confirmText:n.$i18nMsg("lang-form-modalConfirm"),cancelText:n.$i18nMsg("lang-form-modalCancel"),success:function(t){t.confirm&&(n.$http.post("logout").then((function(e){})).catch((function(e){console.log(JSON.stringify(e))})),e.reLaunch({url:"/pages/index/index"}))}})},openOutView:function(n){e.navigateTo({url:"/pages/mine/outLinkShow?url="+n})},handleNav:function(n){if(n.template){var t={1:"UBPFramework",2:"download",3:"Inspections",4:"FormFramework",5:"echartFramework"};this.SET_FRAMETYPE(t[n.bundleFrameType]);var a="/pages/".concat(n.template,"?title=").concat(n.bundleName,"&bundleId=").concat(n.id,"&mainTab=1&V=").concat(n.bundleVersion);e.navigateTo({url:a})}else{var o=this;o.Static_GlobalFucs.showModal(o,{title:o.$i18nMsg("lang-form-modalTips"),content:o.$i18nMsg("lang-configuration"),showCancel:!1})}}}),mounted:function(){console.log("mysel");var n=this;e.getStorageInfo({success:function(e){n.storageInfo=e.currentSize>1024?parseInt(10*e.currentSize/1024)/10+"MB":e.currentSize+"KB",n.storageKeys=e.keys}}),e.setNavigationBarTitle({title:n.$i18nMsg("lang-myself-me")})}};n.default=l}).call(this,t("543d")["default"])},c968:function(e,n,t){"use strict";t.r(n);var a=t("ae55"),o=t.n(a);for(var r in a)"default"!==r&&function(e){t.d(n,e,(function(){return a[e]}))}(r);n["default"]=o.a},e7de:function(e,n,t){"use strict";t.r(n);var a=t("151a"),o=t("c968");for(var r in o)"default"!==r&&function(e){t.d(n,e,(function(){return o[e]}))}(r);t("5da4");var i,s=t("f0c5"),c=Object(s["a"])(o["default"],a["b"],a["c"],!1,null,"33c5acda",null,!1,a["a"],i);n["default"]=c.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/basic/myself-create-component',
    {
        'pages/basic/myself-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("e7de"))
        })
    },
    [['pages/basic/myself-create-component']]
]);
