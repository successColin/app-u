(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/mine/versionInfo"],{"1af0":function(e,t,n){"use strict";n.r(t);var r=n("d61d"),i=n("8db8");for(var o in i)"default"!==o&&function(e){n.d(t,e,(function(){return i[e]}))}(o);n("a254");var a,s=n("f0c5"),u=Object(s["a"])(i["default"],r["b"],r["c"],!1,null,"d647b802",null,!1,r["a"],a);t["default"]=u.exports},"8db8":function(e,t,n){"use strict";n.r(t);var r=n("b7f2"),i=n.n(r);for(var o in r)"default"!==o&&function(e){n.d(t,e,(function(){return r[e]}))}(o);t["default"]=i.a},9665:function(e,t,n){},a254:function(e,t,n){"use strict";var r=n("9665"),i=n.n(r);i.a},b7f2:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n("2f62"),i=o(n("b3de"));function o(e){return e&&e.__esModule?e:{default:e}}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){u(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var c={data:function(){return{image:i.default,pageSize:10,pageNum:1,basetype:2,list:[],isopened:!1,currentVersionMemo:""}},computed:s({},(0,r.mapState)(["appVersion","currentVersion","appName","appVersionInfo","upgradeMode","appUploadUrl"]),{currenversionmemo:function(){var e="";e=this.currentVersion;var t=this.appVersionInfo.find((function(t){return t.version==e}))||{};return t.memo}}),methods:{manualUpdate:function(){3===this.upgradeMode&&this.appUploadUrl.installAtionPackAgeURL&&plus.runtime.openURL(this.appUploadUrl.installAtionPackAgeURL)},handleTopClick:function(){var t="/pages/home/home?pageType=myself";e.navigateTo({url:t})},selectPages:function(){var e=this,t={pageSize:this.pageSize,pageNum:this.pageNum,basetype:this.basetype};this.$http.post("systemVersion/selectPage",t).then((function(t){var n=t.data;console.log(t),n.success&&(e.list=n.data.list,e.checkCurrentVersion())})).catch((function(e){console.log(JSON.stringify(e))}))},toggleHistory:function(){this.isopened=!this.isopened},checkCurrentVersion:function(){for(var e=0;e<this.list.length;e++)if(this.currentVersion==this.list[e].version)return void(this.currentVersionMemo=this.list[e].memo)}},mounted:function(){this.list=[],this.selectPages()},onReachBottom:function(){this.pageNum++,this.selectPages()}};t.default=c}).call(this,n("543d")["default"])},d46e:function(e,t,n){"use strict";(function(e){n("ed61");r(n("66fd"));var t=r(n("1af0"));function r(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},d61d:function(e,t,n){"use strict";var r,i=function(){var e=this,t=e.$createElement,n=(e._self._c,e.$i18nMsg("lang-myself-VersionInformation")),r=e.$i18nMsg("lang-versioninfo-now"),i=e.$i18nMsg("lang-versioninfo-history");e.$mp.data=Object.assign({},{$root:{m0:n,m1:r,m2:i}})},o=[];n.d(t,"b",(function(){return i})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){return r}))}},[["d46e","common/runtime","common/vendor"]]]);