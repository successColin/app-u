(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/login/selectServer"],{5497:function(e,t,r){"use strict";(function(e){r("ed61");n(r("66fd"));var t=n(r("f5e7"));function n(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,r("543d")["createPage"])},"95ea":function(e,t,r){"use strict";r.r(t);var n=r("e341"),o=r.n(n);for(var a in n)"default"!==a&&function(e){r.d(t,e,(function(){return n[e]}))}(a);t["default"]=o.a},a8fd:function(e,t,r){"use strict";var n,o=function(){var e=this,t=e.$createElement,r=(e._self._c,e.$i18nMsg("lang-selectServe-server")),n=e.$i18nMsg("lang-language"),o=e.$i18nMsg("lang-selectServe-formal-environment"),a=e.$i18nMsg("lang-selectServe-intranet-test-environment"),s=e.$i18nMsg("lang-selectServe-extranet-test-environment"),c=e.$i18nMsg("lang-selectServe-other");e.$mp.data=Object.assign({},{$root:{m0:r,m1:n,m2:o,m3:a,m4:s,m5:c}})},a=[];r.d(t,"b",(function(){return o})),r.d(t,"c",(function(){return a})),r.d(t,"a",(function(){return n}))},e341:function(e,t,r){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=c(r("66fd")),o=r("2f62"),a=c(r("e2f0")),s=r("7e37");function c(e){return e&&e.__esModule?e:{default:e}}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){u(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}n.default.use(a.default);var f={data:function(){return{barTitle:this.$i18nMsg("lang-selectServe-basic-configuration"),checkIndex:1,index:1,formalServer:"",inTestServer:"",outTestServer:"",otherTestServer:"",tab:"server",language:""}},computed:l({},(0,o.mapState)(["defaultUrl","themeColor"]),{themeClass_:function(){return"red"!==this.themeColor?"mainColor-"+this.themeColor:"mainColor"}}),methods:l({},(0,o.mapMutations)(["UPDATE_SERVERURL_STATE","UPDATE_THEME_COLOR"]),{changeServer:function(t,r){this.checkIndex=t,e.setStorageSync("baseUrlIndex",t),this.setServerUrl(r);var n=e.getStorageSync("baseUrl");this.UPDATE_SERVERURL_STATE(n),this.getThemeStyle(),e.redirectTo({url:"login"})},setServerUrl:function(t){var r=this,n="";switch("back"==t&&(1==this.checkIndex?t="formalServer":2==this.checkIndex?t="inTestServer":3==this.checkIndex?t="outTestServer":4==this.checkIndex&&(t="otherTestServer")),t){case"formalServer":e.setStorageSync(t,this.formalServer),1==this.checkIndex&&(n=this.formalServer);break;case"inTestServer":e.setStorageSync(t,this.inTestServer),2==this.checkIndex&&(n=this.inTestServer);break;case"outTestServer":e.setStorageSync(t,this.outTestServer),3==this.checkIndex&&(n=this.outTestServer);break;case"otherTestServer":e.setStorageSync(t,this.otherTestServer),4==this.checkIndex&&(n=this.otherTestServer);break;default:n=this.formalServer,e.setStorageSync(t,this.formalServer);break}e.setStorageSync("baseUrl",n||this.defaultUrl),this.$http.setConfig((function(t){return e.getStorageSync("baseUrl")&&(t.baseUrl=e.getStorageSync("baseUrl")),t.baseUrl=n||r.defaultUrl,t.header={"content-type":"application/json;charset=UTF-8","Access-Control-Allow-Origin":"*"},t}))},changeTab:function(e){this.tab=e},changeLanguage:function(t){e.setStorageSync("language",t),this.language=t,this.$i18n.locale=t,e.getStorageInfo({success:function(t){for(var r=t.keys,n=/^[0-9]+.?[0-9]*$/,o=0;o<r.length;o++)(n.test(r[o])||"bundleVersions"==r[o]||"homeTemplate"==r[o]||"bundlePermissiones"==r[o])&&e.removeStorageSync(r[o])}}),e.redirectTo({url:"login"})},getThemeStyle:function(){var e=this;this.$http.post("pcHomePageConfig/selectline").then((function(t){var r=t.data.data.appThemeColor;if(r){var n={color:s.THEME_COLOR_TYPE[r],colorCode:s.THEME_COLOR_VALUE[r]};e.UPDATE_THEME_COLOR(n)}})).catch((function(e){console.log(JSON.stringify(e))}))}}),mounted:function(){this.formalServer=e.getStorageSync("formalServer")||"",this.inTestServer=e.getStorageSync("inTestServer")||"",this.outTestServer=e.getStorageSync("outTestServer")||"",this.otherTestServer=e.getStorageSync("otherTestServer")||"",this.checkIndex=e.getStorageSync("baseUrlIndex")||1,this.language=e.getStorageSync("language")||"zh_CN",e.getStorageInfo({success:function(e){console.log(e.keys)}})}};t.default=f}).call(this,r("543d")["default"])},f5e7:function(e,t,r){"use strict";r.r(t);var n=r("a8fd"),o=r("95ea");for(var a in o)"default"!==a&&function(e){r.d(t,e,(function(){return o[e]}))}(a);var s,c=r("f0c5"),i=Object(c["a"])(o["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],s);t["default"]=i.exports}},[["5497","common/runtime","common/vendor"]]]);