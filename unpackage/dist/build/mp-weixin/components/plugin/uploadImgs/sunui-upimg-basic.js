(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/plugin/uploadImgs/sunui-upimg-basic"],{5844:function(e,t,n){"use strict";var r,i=function(){var e=this,t=e.$createElement,n=(e._self._c,e.$i18nMsg("lang-upload-personal"));e.$mp.data=Object.assign({},{$root:{m0:n}})},a=[];n.d(t,"b",(function(){return i})),n.d(t,"c",(function(){return a})),n.d(t,"a",(function(){return r}))},"58f6":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=u(n("4795")),i=n("f4db"),a=(u(n("a4a7")),n("2f62"));function u(e){return e&&e.__esModule?e:{default:e}}function l(e,t,n,r,i,a,u){try{var l=e[a](u),o=l.value}catch(s){return void n(s)}l.done?t(o):Promise.resolve(o).then(r,i)}function o(e){return function(){var t=this,n=arguments;return new Promise((function(r,i){var a=e.apply(t,n);function u(e){l(a,r,i,u,o,"next",e)}function o(e){l(a,r,i,u,o,"throw",e)}u(void 0)}))}}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){p(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var d={name:"sunui-upimg",props:{upImgBasic:{type:Object,default:function(){return{}}},getPicParams:{type:Object,default:function(){return{}}},label:{type:String,default:"elementLable"},elementId:Number,mobileTabId:Number,relationId:[String,Number],relationTableName:[String,Number],stateId:[String,Number],typeId:[String,Number],priorityId:[String,Number],visiabled:{type:[Number,Boolean],default:1},requisite:{type:[Number,Boolean],default:0},disabled:{type:[Number,Boolean],default:0},uploadType:String,picpath:String},data:function(){return{elementValue:"",elementLable:this.label,upload_after_list:[],upload_picture_list:[],upload_ready_list:[],static_visiabled:this.visiabled,static_requisite:this.requisite,static_readonly:this.disabled,defaultpicpath:""}},computed:c({},(0,a.mapState)(["baseUrl","defaultUrl","token"]),{upImgConfig:function(){var e={basicConfig:{url:"https://p.dns06.net.cn/index.php?m=Api&c=index&a=upload"},tips:!0,notli:!1,count:9,sourceType:"all",sizeType:!0,upBgColor:"#fff",upIconColor:"#D9D9D9",upSvgIconName:"icon-card",upTextDesc:this.$i18nMsg("lang-upload-img"),delBtnLocation:"",isAddImage:!1,isDelIcon:!1,delIconColor:"",delIconText:"",iconReplace:""};return Object.assign(e,this.upImgBasic)}}),created:function(){var e=this.relationId;try{e=JSON.parse(e)}catch(t){}this.elementValue=e&&"object"===typeof e?e.id||"":e||"",h(this),this.picpath&&(this.defaultpicpath=this.picpath.replace(/[\r\n]/g,"")),this.setVerificationRule()},watch:{static_requisite:function(){this.setVerificationRule()},upload_picture_list:function(e,t){this.mobileTabId&&this.elementId&&this.SET_TABS_FORMDATAS({tabId:this.mobileTabId,elementId:this.elementId,params:e})}},methods:c({},(0,a.mapMutations)("verificationRule",["SET_TAB_RULE"]),{},(0,a.mapMutations)("common",["SET_TABS_FORMDATAS"]),{setVerificationRule:function(){if(this.mobileTabId&&this.elementId){var e={name:this.elementId,checkType:this.static_requisite?"imgnotnull":"",checkRule:"",errorMsg:this.elementLable+this.$i18nMsg("lang-notNull")};this.SET_TAB_RULE({tabId:this.mobileTabId,rule:e})}},initServerImage:function(e){this.upload_picture_list=e},chooseImage:function(e){f(this,parseInt(e),this.upImgConfig)},uploadimage:function(e){b(this,e)},deleteImg:function(e){y(e,this)},previewImg:function(e){I(e,this)},previewImgs:function(e){w(e,this)}})};t.default=d;var f=function(t,n,i){var a={basicConfig:{url:i.basicConfig.url},count:n,notli:i.notli,sourceType:i.sourceType,sizeType:i.sizeType,tips:i.tips||!1};e.chooseImage({count:a.notli?a.count:0==t.upload_after_list.length?a.count:a.count-t.upload_after_list.length,sizeType:""==a.sizeType||void 0==a.sizeType||1==a.sizeType?["compressed"]:["original"],sourceType:""==a.sourceType||void 0==a.sourceType?["album","camera"]:"camera"==a.sourceType?["camera"]:"album"==a.sourceType?["album"]:["album","camera"],success:function(){var e=o(r.default.mark((function e(n){var i,u;return r.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(i=0,u=n.tempFiles.length;i<u;i++)n.tempFiles[i]["upload_percent"]=0,n.tempFiles[i]["url"]="",n.tempFiles[i]["id"]="",t.upload_picture_list.length+t.upload_ready_list,t.upload_ready_list.push(n.tempFiles[i]),"touxiang"==t.uploadType&&(t.defaultpicpath=n.tempFiles[i]);return e.next=3,m(t,n,a);case 3:case"end":return e.stop()}}),e)})));function n(t){return e.apply(this,arguments)}return n}()})},m=function(e,t,n){!n.notli&&n.count==e.upload_ready_list.length&&b(e,n),n.notli&&0!==e.upload_ready_list.length&&b(e,n),e.upload_after_list=e.upload_after_list.concat(t.tempFilePaths).slice(0,n.count)},h=function(){var e=o(r.default.mark((function e(t,n){return r.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.relationTableName){e.next=3;break}return console.error("没有关联表"),e.abrupt("return");case 3:if("feedback"!=t.uploadType){e.next=5;break}return e.abrupt("return");case 5:if(!t.elementValue){e.next=8;break}return e.next=8,i.fileApi.getRelationFile({relationId:t.elementValue,relationTableName:t.relationTableName,relationpriorityId:t.priorityId,relationStateId:t.stateId,relationTypeId:t.typeId}).then((function(e){t.upload_picture_list=e,t.upload_ready_list=[],t.upload_after_list=[],"touxiang"==t.uploadType&&(e.length>0?(t.defaultpicpath=e[0].url,t.$emit("isExist",e)):t.defaultpicpath=t.picpath)}));case 8:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),b=function(){var e=o(r.default.mark((function e(t,n){return r.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,_(t,n,t.upload_ready_list);case 2:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),_=function(){var t=o(r.default.mark((function t(n,i,a,u){var l,s,c,p,d;return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return l={url:i.basicConfig.url||""},s=a.map((function(e,t){return{name:"files"+t,uri:e.path}})),c=n.baseUrl||n.defaultUrl,p=n.upload_picture_list.length,t.next=6,e.uploadFile({url:c+l.url,header:{"content-type":"multipart/form-data",token:n.token},files:s,formData:{tableName:n.relationTableName||"workorder"},success:function(t){return o(r.default.mark((function u(){var l,o;return r.default.wrap((function(r){while(1)switch(r.prev=r.next){case 0:if(200!=t.statusCode){r.next=9;break}if(l=JSON.parse(t.data),!l.success){r.next=8;break}return o=l.data,o.map((function(e,t){a[t]["url"]=e.url,a[t]["id"]=e.id,a[t]["typeId"]=n.typeId,a[t]["stateId"]=n.stateId,a[t]["priorityId"]=n.priorityId,n.upload_picture_list[p+t]=a[t],"touxiang"==n.uploadType&&(n.defaultpicpath=e.url)})),r.next=7,g(n,a,i.count);case 7:n.upload_ready_list=[];case 8:e.hideLoading();case 9:case"end":return r.stop()}}),u)})))()},fail:function(t){var i=this;return o(r.default.mark((function a(){return r.default.wrap((function(r){while(1)switch(r.prev=r.next){case 0:e.showLoading({title:i.$i18nMsg("lang-myself-PictureUploadFailed")}),n.upload_picture_list=[],n.upload_after_list=[],setTimeout((function(){e.hideLoading()}),2e3),console.warn(t,"请检查是否CORB/CORS错误!");case 5:case"end":return r.stop()}}),a)})))()}});case 6:d=t.sent,n.upload_picture_list=n.upload_picture_list.concat(a),d.onProgressUpdate(function(){var e=o(r.default.mark((function e(t){var i,u;return r.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:i=0,u=a.length;case 1:if(!(i<u)){e.next=9;break}return e.next=4,t.progress;case 4:a[i]["upload_percent"]=e.sent,n.upload_picture_list[p+i]=a[i];case 6:i++,e.next=1;break;case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 9:case"end":return t.stop()}}),t)})));return function(e,n,r,i){return t.apply(this,arguments)}}(),g=function(){var e=o(r.default.mark((function e(t,n,i){return r.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$emit("onUpImg",t.upload_ready_list);case 2:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}(),y=function(t,n){var r=t.currentTarget.dataset.index;e.showModal({title:n.$i18nMsg("lang-form-modalTips"),content:n.$i18nMsg("lang-form-modalDel"),success:function(e){e.confirm&&v(n,r)}})},v=function(){var e=o(r.default.mark((function e(t,n){var a,u;return r.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(console.log("dImageView========================"),a=t.upload_picture_list[n],console.log(JSON.stringify(a)),!a.relationId){e.next=8;break}return e.next=6,i.fileApi.filesRelationDel(a.id);case 6:e.next=14;break;case 8:if(!a.id){e.next=14;break}return u=[],u.push({id:a.id}),e.next=13,i.fileApi.fileDelete(u);case 13:t.$emit("onImgDel",a.id);case 14:t.upload_picture_list.splice(n,1),t.upload_after_list.splice(n,1),t.upload_picture_list=t.upload_picture_list;case 17:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),I=function(t,n){e.previewImage({current:n.upload_after_list[t.currentTarget.dataset.index],urls:n.upload_after_list})},w=function(){var t=o(r.default.mark((function t(n,i){var a,u,l;return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:for(a=[],u=0,l=i.upload_picture_list.length;u<l;u++)a.push(i.upload_picture_list[u].url);e.previewImage({current:n.currentTarget.dataset.src,urls:a});case 3:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()}).call(this,n("543d")["default"])},7171:function(e,t,n){"use strict";n.r(t);var r=n("58f6"),i=n.n(r);for(var a in r)"default"!==a&&function(e){n.d(t,e,(function(){return r[e]}))}(a);t["default"]=i.a},8162:function(e,t,n){"use strict";var r=n("cd78"),i=n.n(r);i.a},"9fd9":function(e,t,n){"use strict";n.r(t);var r=n("5844"),i=n("7171");for(var a in i)"default"!==a&&function(e){n.d(t,e,(function(){return i[e]}))}(a);n("8162");var u,l=n("f0c5"),o=Object(l["a"])(i["default"],r["b"],r["c"],!1,null,"8c3fb1fe",null,!1,r["a"],u);t["default"]=o.exports},cd78:function(e,t,n){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/plugin/uploadImgs/sunui-upimg-basic-create-component',
    {
        'components/plugin/uploadImgs/sunui-upimg-basic-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("9fd9"))
        })
    },
    [['components/plugin/uploadImgs/sunui-upimg-basic-create-component']]
]);
