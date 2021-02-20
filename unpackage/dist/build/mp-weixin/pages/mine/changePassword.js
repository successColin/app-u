(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/mine/changePassword"],{1723:function(n,t,e){"use strict";var s,a=function(){var n=this,t=n.$createElement,e=(n._self._c,n.$i18nMsg("lang-change-password-apiot")),s=n.$i18nMsg("lang-change-password-serve"),a=n.$i18nMsg("lang-change-password-strength"),i=n.$i18nMsg("lang-myself-OldPassword"),o=n.$i18nMsg("lang-change-password-enter-old"),r=n.$i18nMsg("lang-myself-NewPassword"),c=n.$i18nMsg("lang-change-password-enter"),l=n.$i18nMsg("lang-myself-ConfirmNewPassword"),u=n.$i18nMsg("lang-change-password-enter-again"),g=n.$i18nMsg("lang-save");n.$mp.data=Object.assign({},{$root:{m0:e,m1:s,m2:a,m3:i,m4:o,m5:r,m6:c,m7:l,m8:u,m9:g}})},i=[];e.d(t,"b",(function(){return a})),e.d(t,"c",(function(){return i})),e.d(t,"a",(function(){return s}))},"1c72":function(n,t,e){"use strict";e.r(t);var s=e("a737"),a=e.n(s);for(var i in s)"default"!==i&&function(n){e.d(t,n,(function(){return s[n]}))}(i);t["default"]=a.a},2914:function(n,t,e){"use strict";e.r(t);var s=e("1723"),a=e("1c72");for(var i in a)"default"!==i&&function(n){e.d(t,n,(function(){return a[n]}))}(i);var o,r=e("f0c5"),c=Object(r["a"])(a["default"],s["b"],s["c"],!1,null,null,null,!1,s["a"],o);t["default"]=c.exports},"5dc8":function(n,t,e){"use strict";(function(n){e("ed61");s(e("66fd"));var t=s(e("2914"));function s(n){return n&&n.__esModule?n:{default:n}}n(t.default)}).call(this,e("543d")["createPage"])},a737:function(n,t,e){"use strict";(function(n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=e("2f62"),a=c(e("66fd")),i=c(e("b4ff")),o=c(e("a4a7")),r=c(e("8a14"));function c(n){return n&&n.__esModule?n:{default:n}}function l(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(n);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),e.push.apply(e,s)}return e}function u(n){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{};t%2?l(Object(e),!0).forEach((function(t){g(n,t,e[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):l(Object(e)).forEach((function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(e,t))}))}return n}function g(n,t,e){return t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}var d=function(){Promise.all([e.e("common/vendor"),e.e("components/plugin/uploadImgs/sunui-upimg-basic")]).then(function(){return resolve(e("9fd9"))}.bind(null,e)).catch(e.oe)},p=function(){e.e("components/element/m-inputLable").then(function(){return resolve(e("623a"))}.bind(null,e)).catch(e.oe)},h={components:{mUpload:d,mInputLable:p},data:function(){return{barTitle:this.$i18nMsg("lang-change-password-security-settings"),username:o.default.userName,userId:o.default.userId,oldPassWord:"",newPassWord:"",checkPassWord:"",iconSize:48,Strength:1,Strengthname:this.$i18nMsg("lang-change-password-low"),static_passwordIcon:["iconmimaxianshi","iconmimayincang","iconmimayincang"],inputType_:["text","password","password"],safeImage:i.default}},computed:u({},(0,s.mapState)(["passwordStrength"]),{},(0,s.mapState)("home",{bottomList:"bottomList"})),watch:{newPassWord:function(n,t){this.checkPassword(n)}},methods:{handleTopClick:function(){var t="/pages/home/home?pageType=myself";n.navigateTo({url:t})},fontIconClick:function(n){"iconmimayincang"===this.static_passwordIcon[n]?(a.default.set(this.static_passwordIcon,n,"iconmimaxianshi"),a.default.set(this.inputType_,n,"text")):"iconmimaxianshi"===this.static_passwordIcon[n]&&(a.default.set(this.static_passwordIcon,n,"iconmimayincang"),a.default.set(this.inputType_,n,"password"))},checkPassword:function(n){var t=0;/\d/.test(n)&&n.length>8&&t++,/[a-z]/.test(n)&&t++,/[A-Z]/.test(n)&&t++,/[~!@#%_*]/.test(n)&&t++,t<2?(this.Strength=1,this.Strengthname=this.$i18nMsg("lang-change-password-low")):t>3?(this.Strength=3,this.Strengthname=this.$i18nMsg("lang-change-password-high")):(this.Strength=2,this.Strengthname=this.$i18nMsg("lang-change-password-medium"))},changePassword:function(){var t=this;console.log("changePassword");var e=this;if(""==e.oldPassWord)return n.showToast({title:e.$i18nMsg("lang-change-password-old"),duration:500,icon:"none"}),!1;if(""==e.newPassWord||""==e.checkPassWord)return n.showToast({title:e.$i18nMsg("lang-change-password-new-none"),duration:500,icon:"none"}),!1;if(e.newPassWord!=e.checkPassWord)return n.showToast({title:e.$i18nMsg("lang-change-password-new"),duration:500,icon:"none"}),!1;var s={oldPassWord:this.oldPassWord,newPassWord:this.newPassWord,checkPassWord:this.checkPassWord};s=(0,r.default)(s),this.$http.post("user/updatePassWord",s).then((function(s){s.data.success&&(n.showToast({title:e.$i18nMsg("lang-myself-SuccessfulPasswordModification"),duration:1e3,icon:"none"}),e.$http.post("logout").then((function(t){var e=t.data;if(e.success){var s="/pages/login/login";n.redirectTo({url:s})}})).catch((function(n){t.Static_GlobalFucs.showToast({title:n})})))})).catch((function(n){t.Static_GlobalFucs.showToast({title:n})}))},checkfingerprint:function(){plus.fingerprint.isSupport()?plus.fingerprint.isKeyguardSecure()?plus.fingerprint.isEnrolledFingerprints()?this.fingerpring():plus.nativeUI.toast(this.$i18nMsg("lang-change-password-fingerprint-tip")):plus.nativeUI.toast(this.$i18nMsg("lang-change-password-not-fingerprint")):plus.nativeUI.toast(this.$i18nMsg("lang-change-password-device-not-fingerprint"))},fingerpring:function(){plus.fingerprint.authenticate((function(){plus.nativeUI.closeWaiting(),console.log("指纹识别成功")}),(function(n){switch(n.code){case n.AUTHENTICATE_MISMATCH:plus.nativeUI.toast(this.$i18nMsg("lang-change-password-fingerprint-reset"));break;case n.AUTHENTICATE_OVERLIMIT:plus.nativeUI.closeWaiting(),plus.nativeUI.alert(this.$i18nMsg("lang-change-password-fingerprint-reset-num"));break;default:plus.nativeUI.closeWaiting(),plus.nativeUI.alert("".concat(this.$i18nMsg("lang-change-password-fingerprint-faile"),"(").concat(n.code,"),").concat(this.$i18nMsg("lang-change-password-fingerprint-again")));break}})),"Android"==plus.os.name&&plus.nativeUI.showWaiting(this.$i18nMsg("lang-change-password-fingerprint-identify")+"...")}},mounted:function(){}};t.default=h}).call(this,e("543d")["default"])}},[["5dc8","common/runtime","common/vendor"]]]);