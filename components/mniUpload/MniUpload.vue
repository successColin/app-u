<template>
	<!-- 头像上传 -->
	<view v-if="uploadType == 'touxiang'" class="userinfo-upload" @click='chooseImags'>
		<view class="sunsin_picture_item">
			<image :src="newUserImgPath || userImgPath" class="sunsin_width"  mode="aspectFill" ref="uImage" ></image>
		</view>
	</view>
	<!-- 通用上传 -->
	<view class="formElemets form-upimg" v-else-if="!uploadType && element.visiabled" :class="[element.readonly?'readonly':'']">
		<label class="text">
			{{ element.label }}
			<span v-if="element.requisite" class="icon iconfont iconmust-fill2 requisite"></span>
		</label>
		<view class="content">
			<block v-if="showType==='files'">
				<view class="file" v-for="(item, index) in picsArray" :key="index">
					<m-normal-icon class="file-icon" 
					 :icon="item.displayFileName | fileIconAndColor('icon')" 
					 :color="item.displayFileName | fileIconAndColor('color')" 
					 :iconSize="pxToREM(64)"></m-normal-icon>
					<view class="file-content">
						<view class="fileC" @click="previewFiles(item)">
							<view class="filename">{{item.displayFileName}}</view>
							<view class="filesize">{{item.fileLength | formatSize}}</view>
						</view>
						<!-- #ifdef APP-PLUS -->
						<m-button :isFontBtn="true" style="height: 100%;" @elementClick="appdownload(item)">
							<block slot="buttonIcon" style="display: inline-block;">
								<m-font-icon class="file-download" icon="APP_44" :iconSize="40"></m-font-icon>
							</block>
						</m-button>
						<!-- #endif -->
					</view>
				</view>
			</block>
			<scroll-view scroll-x v-else>
				<view class="sunsin_picture_list">
					<view class='sunsin_picture_item sunsin_width' v-if="!(picNum!==-1 && picsArray.length>=picNum) && !element.readonly">
						<view class="sunsin_add_image sunsin_width" @click='chooseImags'></view>
					</view>
					<view class="sunsin_picture_item"  v-for="(item,index) in picsArray" :key="index">
						<image :src="item.base64 || item.url" class="sunsin_width"  mode="aspectFill"
						 :data-src="item.url"
						 @click="previewImgs"></image>
						<view class="del-image" v-if="!element.readonly" @click="delImg(index)">×</view>
					</view>
					<view class="sunsin_picture_item"  v-for="nouploadIndex in noUploadNumber" :key="'noimage-'+nouploadIndex">
						<image src="../../static/images/svg/tail-spin.svg" style="width: 25px; height: 25px;" mode="aspectFill" ></image>
					</view>
				</view>
			</scroll-view>
		</view>
		<view v-if="videoPreviewUrl" class="previewVideo" @click="cancelVideo">
			<video :src="videoPreviewUrl" autoplay="true" controls object-fit="contain"></video>
		</view>
	</view>
</template>

<script>
	import {fileApi} from '@/common/request/api.js'
	import {ELEMENT_FileType} from '@/common/constant/element.js'
	import {PREVIEW_FILE, PREVIEW_DOWNLOAD_FILE} from '@/static/js/preview.js'
	import {UPLOAD_URLTOBASE64, dataURLToFile} from './upload.js'
	import { mapState, mapMutations } from 'vuex'
	import tailSpin from "@/static/images/svg/tail-spin.svg"
	export default {
		name:"MniUpload",
		props:{
			element:{
				type:Object,
				defalut(){
					return {}
				}
			},
			showType:{type:String,defalut:'pics'},//实现类型：pics：图片上传控件，文件上传控件
			base64Url:{type:String,defalut:''},
			relationName:{type:String,defalut:''},//关联名称
			uploadNum:{type:Number,defalut:-1},//可选择的图片
			imageConfig:{//图片参数
				type:Object,
				defalut(){
					return {
						allImgsParam:{},
						element:{}
					}
				}
			},
			requestConfig:{//图片接口参数
				type:Object,
				defalut(){
					return {
						submitUrl:'file/uploadFiles',
						submitParam:{},
						getPicParam:{}
					}
				}
			},
			uploadType:{type:String,defalut:''},	//是否上传头像
			userImgPath:{type:String,defalut:''},	//当前头像
			newUserImgPath:{type:String,defalut:''},		//上传之后预览的头像
			relationMainTab:{type:Number,defalut:''}
		},
		data() {
			return {
				tailSpin:tailSpin,
				picsArray: [],
				realArray:{},
				chooseNumber:0,//选择的图片
				uploadumber:0,//已经上传的图片
				newUpload:[],//上传成功的图片
				videoPreviewUrl:""//文件预览路径
			}
		},
		computed: {
			...mapState(["baseUrl","defaultUrl","token"]),
			...mapState("form", ["filePassList"]),
			...mapState("common",["previewFilePaths"]),
			picNum(){
				return this.element.elementFormat !== 2 ? this.uploadNum : 1
			},
			noUploadNumber(){
				return this.chooseNumber - this.uploadumber
			}
		},
		watch:{
			base64Url(old,newvalue){
				if(this.element.elementFormat === 2){
					let urlAry = this.base64Url.split("_") //保存到表的url前面默认会加上图片id，便于后续删除
					let id = -1, url = ""
					if(urlAry.length>1){
						id = urlAry[0]
						url = urlAry[1]
					}else url = urlAry[0]
					if(this.picsArray.findIndex( item => `${item.id}` === `${id}`) === -1 && url) this.picsArray = [{id:id, url:url}]
				}
			}
		},
		filters: {
			fileIconAndColor(displayFileName = '',type){
				displayFileName = displayFileName.toLowerCase()
				let names = displayFileName.split('.'),
						name = names[names.length - 1]
				let flieType = ELEMENT_FileType.find(item => item.type.indexOf(name) !== -1) || {color:'#F15643',icon:'APP_41'}
				return flieType[type] || ''
			},
			formatSize(fileSize = 0){
				if(fileSize>1024){
					return parseInt(fileSize/10.24)/100 + 'M';
				}else{
					return fileSize +'K';
				}
			}
		},
		methods: {
			...mapMutations("common",["SET_COM_PREVIEWFILEPATHS"]),
			delImg(picIndex){//删除
				const _this = this
				uni.showModal({
					title:_this.$i18nMsg("basic-inquiry"),
					content:_this.$i18nMsg("choiceTip-isDelete"),
					success: function (res) {
						if (res.confirm) {
							const pic = _this.picsArray[picIndex]
							dImageView(_this, {
								image:pic,
								picIndex:picIndex
							})
						}
					}
				})
			},
			cancelVideo(){
				this.videoPreviewUrl = ""
			},
			previewFiles(file) {//预览
				let {id,displayFileName:name,fileLength,url} = file
				let video = PREVIEW_FILE({
					id,name,fileLength,url,
					apiUrl:`${this.baseUrl || this.defaultUrl}file/fileDownload`,
					token:this.token
				},this)
				if(video.type === 'video') this.videoPreviewUrl = video.url
			},
			appdownload(file){//app文件下载
				uni.showModal({
					title:_this.$i18nMsg("basic-inquiry"),
					content:_this.$i18nMsg("whetherToDownload"),
					success:  (res) => {
						if (res.confirm) {
							let {id,displayFileName:name,fileLength,url} = file
							PREVIEW_DOWNLOAD_FILE({id,name,fileLength,url},this)
						}
					}
				})
			},
			previewImgs(e) {//预览
				let prevImgArr = [];
				for (let i = 0, len = this.picsArray.length; i < len; i++) {
					const url = this.picsArray[i].url
					prevImgArr.push(url);
				}
				console.log(e.currentTarget.dataset.src)
				uni.previewImage({
					current: e.currentTarget.dataset.src,
					urls: prevImgArr
				});
			},
			chooseImags() {//选择图片
				if(this.picNum !== -1 && this.picsArray.length>=this.picNum) {
					this.Static_GlobalFucs.showToast({
						title:`图片最多可以选择${this.picNum}`
					})
					return
				}
				let residuePics = this.picNum - this.picsArray.length
				if(this.picNum === -1) residuePics = 9
				let choosePics = residuePics > 9 ? 9 : residuePics,
					  _this = this
				if(this.uploadType == "touxiang"){		//头像上传图片数量默认为1
					choosePics = 1;
				}
				uni.chooseImage({
					count:choosePics,
					sizeType:["compressed"],
					sourceType: ['album', 'camera'], 
					success: (res) => {
						_this.chooseNumber += res.tempFilePaths.length
						UPLOAD_URLTOBASE64(res.tempFilePaths).then( (value) => {
							const base64Array = value.base64Array,
								  orientationArray = value.orientationArray
							const picsBase64 = [],
								  filePath = []
							for(let i = 0;i<base64Array.length;i++){
								// _this.picsArray.push("firstCanvas0")
								const orientation = orientationArray[i]
								let basr64 =base64Array[i]
								if([2,3,4,5,6,7,8].indexOf(orientation) !== -1){
									// #ifdef H5
									resetOrientation(basr64,orientation,function(newbase){
										_this.showAndUploadPic(newbase,[],1)
									})
									// #endif
								}else{
									picsBase64.push(basr64)
									filePath.push(res.tempFiles[i])
								}
							}
							_this.showAndUploadPic(picsBase64,filePath)
						})
					}
				})	
			},
			showAndUploadPic(showBase64,uploadpics,type=0){//type是否有处理过旋转
				if(type){//旋转过的图片上传
					let authType = 1
					if(this.element.elementFormat === 2) authType = 2 //2-不需要返回token
					uploadPiOrientationc({
						showBase64:showBase64,
						otherParam:this.requestConfig.submitParam,
						authType:authType
					},this)
				}else{//未旋转过的图片
					let submitUrl = this.baseUrl || this.defaultUrl;
					if(process.env.NODE_ENV === 'development'){ //在开发情况下
						// #ifdef H5  
						submitUrl = "/eam/"
						// #endif 
					}
					
					uploadPic({
						submitUrl:submitUrl + this.requestConfig.submitUrl,
						images:uploadpics,
						showBase64:showBase64,
						token:this.token,
						otherParam:this.requestConfig.submitParam
					},this)
					
				}
			}, 
			getImages(){//获取图片
				//如果关联id为空不请求数据
				if(!this.requestConfig.getPicParam.relationId){
					const defaultValue = this.requestConfig.getPicParam.element.defaultValue
					if(this.filePassList && this.filePassList[this.relationMainTab] && this.filePassList[this.relationMainTab][defaultValue]){
						this.picsArray = this.filePassList[this.relationMainTab][defaultValue] || []
						this.$emit('allImgs', {...this.imageConfig.allImgsParam,...{value:this.picsArray}});
					}
					return
				}
				fileApi.getRelationFile(this.requestConfig.getPicParam)
				.then(pics => {
					this.picsArray = pics || []
					const defaultValue = this.requestConfig.getPicParam.defaultValue
					if(this.filePassList && this.filePassList[this.relationMainTab] && this.filePassList[this.relationMainTab][defaultValue]){
						this.picsArray = [
							...this.picsArray,
							...this.filePassList[this.relationMainTab][defaultValue],
						]
					}
					this.$emit('allImgs', {...this.imageConfig.allImgsParam,...{value:pics}});
				})
			}
		},
		created() {
			if(this.uploadType === 'touxiang') return //如果是上传头像默认不调任何参数
			if(this.element.elementFormat !== 2){
				this.getImages()
			}else if(this.base64Url){
				let urlAry = this.base64Url.split("_") //保存到表的url前面默认会加上图片id，便于后续删除
				let id = -1, url = ""
				if(urlAry.length>1){
					id = urlAry[0]
					url = urlAry[1]
				}else url = urlAry[0]
				this.picsArray = [{id:id, url:url}]
			}
		}
	}
	//删除文件
	const dImageView = async (_this, param) =>{//删除节点
		// if(_this.element.elementFormat === 2){//如果为base64
		// 	_this.picsArray = []
		// 	_this.$emit('allImgs', {..._this.imageConfig.allImgsParam,...{value:[]}});
		// 	return 
		// }
		
		const imag = param.image//图片信息
		if(imag.relationId) {//如果存在业务id需要删除业务关系
			await fileApi.filesRelationDel(imag.id).then(value => {
				uni.showToast({
					icon:'none',
					title:'操作成功'
				})
			})
		}else{
			//没有业务关系时分图片是否已经上传至文件服务器
			if(imag.id !== -1){
				let params = []
				params.push({id:imag.id})
				await fileApi.fileDelete(params).then(value => {
					uni.showToast({
						icon:'none',
						title:'操作成功'
					})
				})
				_this.$emit('onImgDel', imag.id)
			}
			let value = ''
			if(_this.element.elementFormat !== 2) value = _this.picsArray
			_this.$emit('allImgs', {..._this.imageConfig.allImgsParam,...{value:value}});
		}
		_this.picsArray.splice(param.picIndex, 1);
	}
	//保存图片
	const uploadImage = (res,showBase64,index,_this) => {//上传成功
		let showPics = []
		if(res.success){//上传成功
			let uploadPics = res.data || []
			_this.uploadumber += uploadPics.length
			if(index === -1){
				for(let i = 0;i<uploadPics.length;i++){
					showPics.push({
						id:uploadPics[i].id,
						base64:showBase64[i],
						url:uploadPics[i].url
					})
				}
			}else{
				showPics.push({
					id:uploadPics[0].id,
					base64:showBase64,
					url:uploadPics[0].url
				})
			}
			if(_this.element.elementFormat === 2){//base64
				_this.$emit('allImgs', {..._this.imageConfig.allImgsParam,...{value:`${uploadPics[0].id}_${uploadPics[0].url}`}});
			}else{
				_this.$emit('onUpImg', {
					uploadPics:uploadPics,
					getPicParam:_this.requestConfig.getPicParam
				});
			}
		}else {
			_this.$emit('onUpImgError', res.data);
		}
		
		return showPics
	}
	async function uploadPiOrientationc(param,_this){
		let showBase64 = param.showBase64
		let submitParam = {
			displayFileName:new Date().getTime() + '.jpg',
			imgByte:showBase64,
			authType:param.authType || 1
		}
		await fileApi.fileUploadBase64({...submitParam, ...param.otherParam}).then( value => {
			let showPic = uploadImage(value,showBase64,0,_this)
			_this.picsArray = _this.picsArray.concat(showPic)
			if(_this.element.elementFormat !== 2){
				_this.$emit('allImgs', {..._this.imageConfig.allImgsParam,...{value:_this.picsArray}});
			}
		})
	}
	
	async function uploadOneByOne(param , _this) {//一张一张上传
		let otherParam = {...param.otherParam}
		otherParam.token = param.token
		// #ifndef H5
		let pics = param.images
		for(let k = 0,len = pics.length; k < len; k++ ){
			let file = pics[k]
			await uni.uploadFile({//开始上传
				url: param.submitUrl,
				header: {
					'token':param.token
				},
				filePath:file.path,
				name:'file',
				formData: otherParam,
				success(res) {
					if (res.statusCode == 200) {
						let result = JSON.parse(res.data);
						let showPic = param.showBase64[k]
						showPic = uploadImage(result,showPic,k,_this)
						_this.picsArray = _this.picsArray.concat(showPic)
						if(_this.element.elementFormat !== 2){
							_this.$emit('allImgs', {..._this.imageConfig.allImgsParam,...{value:_this.picsArray}});
						}
					}
				},
				fail(err) {
					console.warn(err, '请检查是否CORB/CORS错误!')
				}
			})
		}
		// #endif
		// #ifdef H5
		//H5环境下先转base64再上传
		let pics = param.showBase64
		for(let k = 0,len = pics.length; k < len; k++ ){
			let file = pics[k]
			await uni.uploadFile({//开始上传
				url: param.submitUrl,
				header: {
					'token':param.token
				},
				filePath:file,
				name:'file',
				formData: otherParam,
				success(res) {
					if (res.statusCode == 200) {
						let result = JSON.parse(res.data);
						let showPic = param.showBase64[k]
						showPic = uploadImage(result,showPic,k,_this)
						_this.picsArray = _this.picsArray.concat(showPic)
						if(_this.element.elementFormat !== 2){
							_this.$emit('allImgs', {..._this.imageConfig.allImgsParam,...{value:_this.picsArray}});
						}
					}
				},
				fail(err) {
					console.warn(err, '请检查是否CORB/CORS错误!')
				}
			})
		}
		// #endif
	}
	async function uploadPic(param,_this){
		// #ifdef APP-PLUS
		//app批量上传
		if(_this.element.elementFormat === 2 || _this.uploadType === 'touxiang'){//如果为base64或者为头像的时候
			uploadOneByOne(param, _this)
			return 
		}
		let imgs = param.images.map((value, index) => {//转化可上传数据
		    return {
		        name: "files"+index, 
		        uri: value.path
		    }
		})
		let otherParam = {...param.otherParam}
		otherParam.token = param.token
		await uni.uploadFile({//开始上传
			url: param.submitUrl,
			header: {
				'content-type': 'multipart/form-data',
				'token':param.token
			},
			files:imgs,
			formData: otherParam,
			async success(res) {
				if (res.statusCode == 200) {
					let result = JSON.parse(res.data);
					const showPics = uploadImage(result,param.showBase64,-1,_this)
					_this.picsArray = _this.picsArray.concat(showPics)
					_this.$emit('allImgs', {..._this.imageConfig.allImgsParam,...{value:_this.picsArray}});
				}
			},
			async fail(err) {
				uni.showLoading({
					title: `上传失败!`
				});
				console.warn(err, '请检查是否CORB/CORS错误!')
			}
		})
		// #endif
		
		// #ifndef APP-PLUS
		//h5一张一张上传
		uploadOneByOne(param, _this)
		// #endif
	}
	// 将图片旋转到正确的角度
	function resetOrientation(srcBase64, srcOrientation, callback) {
	    var img = new Image();
		const arr = srcBase64.split(',')
		const mime = arr[0].match(/:(.*?);/)[1] 
	    img.onload = function() {
	        var width = img.width,
	            height = img.height,
	            canvas = document.createElement('canvas'),
	            ctx = canvas.getContext("2d");
	        // set proper canvas dimensions before transform & export
	        if ([5,6,7,8].indexOf(srcOrientation) > -1) {
	            canvas.width = height;
	            canvas.height = width;
	        } else {
	            canvas.width = width;
	            canvas.height = height;
	        }
	        // transform context before drawing image
	        // -2: not jpeg
	        // -1: not defined
	        switch (srcOrientation) {
	            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
	            case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
	            case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
	            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
	            case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
	            case 7: ctx.transform(0, -1, -1, 0, height , width); break;
	            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
	            default: ctx.transform(1, 0, 0, 1, 0, 0);
	        }
	        // draw image
	        ctx.drawImage(img, 0, 0);
	        // export base64，然后用画布旋转正确后再生成正确的base64
	        callback(canvas.toDataURL('image/jpeg'));
	    };
	    img.src = srcBase64;
	}
</script>

<style lang="scss" scoped>
	@function pxToREM($p:1,$base:0.03){
	    @return 0.03*$p + rem; 
	}
	.previewVideo{
		width:100%;
		height: 100%;
		background: rgba(0,0,0,.5);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		video{
			width: 100%;
		}
	}
	.content{
		flex-direction: column;
	}
	.file{
		width: 100%;
		display: flex;
		align-items: center;
	}
	.file-content{
		flex: 1;
		display: flex;
		padding: pxToREM(35) pxToREM(25) pxToREM(30)  pxToREM(10);
		align-items: center;
		font-family: PingFangSC-Regular, PingFang SC;
		border-bottom: solid 1px #E0E0E0;
		.fileC{flex: 1;}
		.filename{ 
			word-break:break-all;
			margin-bottom: pxToREM(10);
			font-size: pxToREM(30);
			color: #111111;
		}
		.filesize{
			font-size: pxToREM(27);
			color: #808080;
		}
	}
	.file-icon,.file-download{
		flex-shrink: 0;
		color: #D9D9D9;
	}
	.del-image{
		position: absolute;
		top: 0;
		right: 0;
		width:40upx;
		height:40upx;
		line-height:40upx;
		border-radius: 50%;
		color: #fff;
		background:rgba(0,0,0,0.6);
	}
	/* 宽度 */
	.sunsin_width {
		width: 150upx !important;
		height: 150upx !important;
	}

	/* 循环列表样式 */
	.sunsin_picture_list {
		width: 96%;
		padding: 2% 0;
		display: flex;
		/* flex-wrap: wrap; */
		text-align: center;
	}
	.sunsin_picture_list image {
		width: 40upx;
		height: 40upx;
		margin: 0 4%;
	}
	.sunsin_picture_list image.icon_replace {
		width: 150upx;
		height: 150upx;
	}

	/* 添加图片样式 */
	.sunsin_add_image {
		color: #ddd;
		font-size:24upx;
		text-align: center;
		line-height: 0 !important;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		border:1px dashed rgba(217,217,217,1);
		background-repeat: no-repeat;
		background-position: center;
		background-size: 60%;
		background-image: url(../../static/images/upload.png);
	}

	/* 预览图片 */
	.sunsin_picture_item {
		position: relative;
		margin-right: 30upx;
	}

	/* 删除按钮样式 */
	.sunsin_picture_item .del {
		position: absolute;
		color: #fff;
		border-radius: -4upx;
		border-top-right-radius: 6upx;
		width: 40upx;
		height: 40upx;
		line-height: 40upx;
		z-index: 2;
		text-align: center;
		background-color: #808080;
		border-radius: 50%;
	}

	/* 删除图标位置(上左) */
	.sunsin_picture_item .del.left {
		top: 0;
		left: 0;
		margin-left: 4%;
		border-top-right-radius: 0;
		border-top-left-radius: 6upx;
	}

	/* 删除图标位置(上右) */
	.sunsin_picture_item .del.right {
		top: 0;
		right: -4.2%;
	}

	/* 删除图标位置(下左) */
	.sunsin_picture_item .del.bleft {
		bottom: 0;
		left: 4%;
		border-top-left-radius: 0;
		border-bottom-left-radius: 6upx;
	}

	/* 删除图标位置(下右) */
	.sunsin_picture_item .del.bright {
		right: -4.2%;
		bottom: 0;
		border-top-right-radius: 0;
	}

	/* 进度遮罩层样式 */
	.sunsin_upload_progress {
		position: absolute;
		top: 0;
		left: 0;
		color: #fff;
		font-size: 24upx;
		text-align: center;
		line-height: 160upx;
		margin-left: 4%;
		border-radius: 8upx;
		background-color: rgba(0, 0, 0, .7);
	}

	/* 自定义添加图片样式 */
	.sunsin_picture_item image {
		box-shadow: 6upx 6upx 12upx rgba(112, 128, 144, 0.7);
		border-radius: 15upx;
	}
</style>
