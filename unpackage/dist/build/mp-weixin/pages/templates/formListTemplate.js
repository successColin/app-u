(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/templates/formListTemplate"],{"3d4f":function(e,t,a){},"409e":function(e,t,a){"use strict";(function(e){a("ed61");n(a("66fd"));var t=n(a("ef65"));function n(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,a("543d")["createPage"])},"63a4":function(e,t,a){"use strict";var n,o=function(){var e=this,t=e.$createElement,a=(e._self._c,e.__map(e.childProgressListConfig,(function(t,a){var n=e.tabsChildVisiabled(t.tabInfo.refreshParams.elementId);return{$orig:e.__get_orig(t),m0:n}}))),n=e.__map(e.childListConfig,(function(t,a){var n=e.tabsChildVisiabled(t.tabInfo.refreshParams.elementId);return{$orig:e.__get_orig(t),m1:n}})),o=e.$i18nMsg("lang-advancedFilter-loading");e.$mp.data=Object.assign({},{$root:{l0:a,l1:n,m2:o}})},r=[];a.d(t,"b",(function(){return o})),a.d(t,"c",(function(){return r})),a.d(t,"a",(function(){return n}))},"9b71":function(e,t,a){"use strict";var n=a("3d4f"),o=a.n(n);o.a},d56d:function(e,t,a){"use strict";a.r(t);var n=a("fb3a"),o=a.n(n);for(var r in n)"default"!==r&&function(e){a.d(t,e,(function(){return n[e]}))}(r);t["default"]=o.a},ef65:function(e,t,a){"use strict";a.r(t);var n=a("63a4"),o=a("d56d");for(var r in o)"default"!==r&&function(e){a.d(t,e,(function(){return o[e]}))}(r);a("9b71");var i,s=a("f0c5"),l=Object(s["a"])(o["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],i);t["default"]=l.exports},fb3a:function(e,t,a){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=l(a("a6f1")),o=a("f4db"),r=a("2f62"),i=l(a("9206")),s=l(a("6ab9"));function l(e){return e&&e.__esModule?e:{default:e}}function c(e){return b(e)||d(e)||u(e)||m()}function m(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function u(e,t){if(e){if("string"===typeof e)return f(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(a):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?f(e,t):void 0}}function d(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function b(e){if(Array.isArray(e))return f(e)}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}function h(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function T(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?h(Object(a),!0).forEach((function(t){g(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):h(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function g(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var I=function(){Promise.all([a.e("common/vendor"),a.e("components/makeup/form/FormCom")]).then(function(){return resolve(a("1498"))}.bind(null,a)).catch(a.oe)},p=function(){Promise.all([a.e("common/vendor"),a.e("components/makeup/list/ListCom")]).then(function(){return resolve(a("a8b2"))}.bind(null,a)).catch(a.oe)},S=function(){a.e("components/progress-bar/progressBar").then(function(){return resolve(a("ee14"))}.bind(null,a)).catch(a.oe)},v=function(){Promise.all([a.e("common/vendor"),a.e("components/element/m-inputSearch")]).then(function(){return resolve(a("4d16"))}.bind(null,a)).catch(a.oe)},y=function(){Promise.all([a.e("common/vendor"),a.e("pageComs/dropdownMenu")]).then(function(){return resolve(a("62c5"))}.bind(null,a)).catch(a.oe)},E=function(){Promise.all([a.e("common/vendor"),a.e("pageComs/topBtnsComs")]).then(function(){return resolve(a("6ef0"))}.bind(null,a)).catch(a.oe)},_=function(){Promise.all([a.e("common/vendor"),a.e("pageComs/bottomBtnsComs")]).then(function(){return resolve(a("dd31"))}.bind(null,a)).catch(a.oe)},P=new s.default,C=new i.default,L={components:{FormCom:I,topBtnsComs:E,bottomBtnsComs:_,dropdownMenu:y,ListCom:p,mInputSearch:v,progressBar:S},data:function(){return{onkey:"",barTitle:"",formType:"editBtn",templateType:"form",isDoRefreshParent:!1,originHeight:0,isShow:!1,footShow:!1,topbtnsShow:!1,tabInfo:{},formConfig:{},selectsInfo:{},comBoxVisible:!1,formData:{},childListConfig:[],childTabInfo:[],quickQuery:{},childProgressListConfig:[],childProgressData:[]}},computed:T({},(0,r.mapState)(["bundleName","bundleId","isOriginHei"]),{},(0,r.mapState)("common",["templateParams","doRefreshParent","tabsElements","tabsFormDatas","tabsChilds"]),{tabsChildVisiabled:function(){return function(e){var t=this.tabsChilds[this.tabInfo.mobileTabId]||[],a=t.find((function(t){return t.elementId===e}))||{};return a.visiabled}}}),methods:T({},(0,r.mapMutations)(["SET_ORIGIN","SET_bundle","SET_GlobalIds"]),{},(0,r.mapMutations)("form",["SET_FILTER_SQLPARAMS","SET_ALLBTNS"]),{},(0,r.mapMutations)("common",["SET_DROPDOWNDATA","SET_FORMREFRESH_PARENT","SET_TABS_ELEMENT","SET_COMMON_TABSELEMENTS","SET_TABS_FORMDATAS","CLEAR_FORMDATAS","SET_TEMPLATE_PARAMS","SET_COM_TABCHILD"]),{},(0,r.mapMutations)("verificationRule",["CLEAR_RULESTATE","SET_VER_RULES"]),{},(0,r.mapMutations)("Toast",["TOAST_REQUESTURLS"]),{},(0,r.mapMutations)("advanceFilter",["SET_ADVAN_FILTERS"]),{childRelod:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];t.map((function(t){var a=e.childListConfig.find((function(e){return e.tabInfo.elementId===t})),n=C.advancedParams(e,{advancedQuery:a.tabInfo.advancedQuery||{},advancedSqlQuery:a.tabInfo.advancedSqlQuery||[],relationMainTab:a.tabInfo.relationMainTab}),o={globalMap:n.advancedQuery,globalQueryMap:n.advancedSqlQuery};e.$refs[t][0].setOtherParam(o),e.$refs[t][0].getListData("load")}))},clickList:function(e){e.isMain=!1,C.clickListNode(this,e);var t=this;n.default.$on(e.selfKey,(function(a){t.$refs[a.elementId][0].getListData("pager"),n.default.$off(e.selfKey)}))},handelSearch:function(e){var t=e.tabInfo.elementId,a=this.childListConfig.find((function(e){return e.tabInfo.elementId===t})),n=T({},a.quickQuery,{},e),o=C.handleSearchText(this,n);this.$refs[t][0].doSearch(o)},checkedForm:function(e){1===e.static_checkedForm?this.$refs.mForm.verificationRule():this.$refs.mForm.submitFormData()},finishLoading:function(){var e=this;setTimeout((function(){e.isLoading=!1}),100)},showComBox:function(){this.comBoxVisible=!this.comBoxVisible},setPageInfo:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";this.barTitle=e.mobileTabName||this.bundleName;var n=P.advancedParams(this,{advancedQuery:e.advancedQuery||{},systemParam:{relationMainTab:this.tabInfo.relationMainTab}}),o={};o.otherParams={id:n||a,mobileTabId:this.tabInfo.mobileTabId,elementList:e.elements,mobileTabSource:e.mobileTabSource};var r=c(e.elements),i=c(e.btnList.bottomBtn),s=c(e.btnList.topRightBtn),l=c(e.btnList.comboBox),m=c(e.childMobilTable),u=[].concat(c(r),c(i),c(s),c(l),c(m));o.baseParams={currentElements:r,currentBottomBtns:i,currentTopRightBtns:s,currentComboBoxs:l,currentTabsChilds:m,tabElements:u},this.formConfig=o,this.SET_FILTER_SQLPARAMS({tabId:e.mobileTabId,params:e.filterSQLParams}),this.getDate()},getDate:function(){var e=this;if(this.formConfig.otherParams.id&&this.formConfig.otherParams.mobileTabSource){o.formApi.getDate(this,this.formConfig.otherParams).then((function(t){e.formDataFormat(t)}))}else this.formDataFormat()},formDataFormat:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=this.formConfig.baseParams,n=this,o={eventType:4,triggerList:this.tabInfo.trigger,relationMainTab:this.tabInfo.relationMainTab,mobileTabId:this.tabInfo.mobileTabId,formData:t,oldFormData:t,triggerElements:a.tabElements,oldElements:a.tabElements,searchSelectInfo:{},loadsearchSelects:[],rules:[]};this.SET_TABS_ELEMENT({tabId:this.tabInfo.mobileTabId,elements:a.tabElements}),this.Static_GlobalFucs.formElementsTrigger(T({},a,{},o),this).then((function(t){e.formConfig.baseParams.currentElements=t.currentElements,e.formConfig.loadsearchSelects=t.loadsearchSelects,e.formConfig.baseParams.tabElements=[].concat(c(t.currentBottomBtns),c(t.currentTopRightBtns),c(t.currentComboBoxs),c(t.currentElements),c(t.currentTabsChilds)),e.formData=t.formData,e.SET_TABS_ELEMENT({tabId:e.tabInfo.mobileTabId,elements:t.currentElements}),e.SET_COMMON_TABSELEMENTS({tabId:e.tabInfo.mobileTabId,elements:[].concat(c(t.currentElements),c(t.currentBottomBtns),c(t.currentTopRightBtns),c(t.currentComboBoxs),c(t.currentTabsChilds))}),e.SET_COM_TABCHILD({tabId:e.tabInfo.mobileTabId,tabsChilds:t.currentTabsChilds}),e.SET_TABS_FORMDATAS({tabId:e.tabInfo.mobileTabId,formData:t.formData}),e.SET_VER_RULES({tabId:e.tabInfo.mobileTabId,rules:t.rules}),n.isShow=!0,e.SET_ALLBTNS({tabId:e.tabInfo.mobileTabId,bottomBtns:t.currentBottomBtns,topRightBtns:t.currentTopRightBtns,comboBoxs:t.currentComboBoxs}),setTimeout((function(){n.topbtnsShow=!0,n.footShow=!0}),50),e.handleChildData(e.tabInfo.childMobilTable)}))},handleChildData:function(e){if(0!==e.length)for(var t=this.tabInfo.mobileTabs,a={templateType:"list",bundleId:this.tabInfo.bundleId,bundleName:this.tabInfo.bundleName,mobileTabs:t,relationMainTab:this.tabInfo.mobileTabId},n=0;n<e.length;n++){var o=e[n],r=o.relationTabId;if(r){var i=t[r]||{},s={elementId:o.elementId,mobileTabId:Number(r),selfKey:"listReloadChild".concat(o.elementId),refreshParams:{elementId:o.elementId},advancedQuery:i.advancedQuery||{},advancedSqlQuery:i.advancedSqlQuery||[],showType:i.showType},l={};l.tabInfo=T({},a,{},s);var c=i||{},m=c.dataSourceType,u=c.commonApiHeaderId,d=c.interfaceInParam;if(2!==m||u){var b={advancedQuery:i.advancedQuery||{},advancedSqlQuery:i.advancedSqlQuery||[],relationMainTab:l.tabInfo.relationMainTab};l.tabInfo.jumpTag&&(b.bundleParams=l.tabInfo.bundleParams||{});var f=C.advancedParams(this,b),h={},g={hasPager:!0};4===i.mobileTabShowType&&(h[i.relationColumn]={static_connector:3,static_type:2,static_value:this.BusinessID}),g.otherParams={globalMap:f.advancedQuery,globalQueryMap:f.advancedSqlQuery,mobileTabId:l.tabInfo.mobileTabId,elementList:i.elements,mobileTabSource:i.mobileTabSource,seniorFilterMap:h},g.baseParams={hasIcon:!0,listIcon:i.listIcon||{},multiple:!0},g.isCheckedParams={primaryKey:i.primaryKey},g.goEventParams={primaryKey:i.primaryKey,mobileTabRelationTabId:i.mobileTabRelationTabId},2===m&&u?(g.baseParams.dataSourceType=m,g.baseParams.commonApiHeaderId=u,g.otherParams.interfaceInParam=d,g.url="static_getDataByInterface"):g.url="currencyGetListData",l.listConfig=g,l.quickQuery=i.quickQuery||{},9==l.tabInfo.showType&&0==this.childProgressListConfig.length?(this.childProgressListConfig.push(l),this.getListData(l)):0==this.childListConfig.length&&this.childListConfig.push(l)}else this.Static_GlobalFucs.showModal(this,{content:this.$i18nMsg("lang-configuration-noInterface")},"error")}}},getListData:function(t){var a=this,n=t.listConfig;if(n.url){var r={pageNum:1,pageSize:9999},i=T({},n.otherParams,{},r);o.listApi.getListData(this,n.url,i).then((function(t){e.stopPullDownRefresh(),t=t||{};var n=t.datalist||[],o=[];n.map((function(e){var t={};for(var n in e)t[n]=a.Static_GlobalFucs.Global_dataFormat(e[n]);o.push(t)})),a.childProgressData.push(o)})).finally((function(e){}))}}}),onLoad:function(t){var a=t.relationTab;if(a){var o=this.templateParams[a]||{},r=this,i=e.getStorageSync(o.bundleId)||{},s=i.mobileTabs||{},l=s[a]||{},c="formReload".concat(this._uid),m={_uid:this._uid,bundleId:o.bundleId,bundleName:o.bundleName,mobileTabId:Number(a),relationMainTab:o.relationMainTab||"",mobileTabs:s,trigger:i.triggerMap||{},parentKey:o.onkey||"",selfKey:c,refreshParams:o.refreshParams||{},formType:o.type||"editBtn",cascadeSelects:l.cascadeSelects||[],commonSelects:l.commonSelects||[],selectsFilterParams:l.filterParams||{},mobileTabsBYRelation:l,mainDataId:o.id,childMobilTable:l.childMobilTable};"multiple"!==m.formType&&this.SET_GlobalIds([]),this.tabInfo=m,this.CLEAR_FORMDATAS(m.mobileTabId),this.CLEAR_RULESTATE(m.mobileTabId),this.SET_ORIGIN(!0);var u=e.getSystemInfoSync();this.originHeight=u.windowHeight,e.onWindowResize((function(e){var t=!0;t=!(e.size.windowHeight<r.originHeight),r.SET_ORIGIN(t)})),n.default.$on(c,(function(e){r.isShow=!1,r.setPageInfo(l,m.mobileTabId,o.id)}))}},onReady:function(){this.setPageInfo(this.tabInfo.mobileTabsBYRelation,this.tabInfo.mobileTabId,this.tabInfo.mainDataId)}};t.default=L}).call(this,a("543d")["default"])}},[["409e","common/runtime","common/vendor"]]]);