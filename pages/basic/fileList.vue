<template name="fileList">
	<view class="listCreateTemplate fileList" :class="[themeClass_]">
			<m-back-bar backStyle="backStyleNoBack" >  <!-- 顶部返回组件，已经作为全局组件可以直接调用 class="calendar-page-header" -->
				<block slot="barTitle">{{barTitle}}</block>
				<block slot="barRight">
					<view class="header">
						<view class="list-search">
							<view class="search-wrap">
								<view class="search-view">
									<input v-model="keywords" @confirm="searchFiles()" name="keywords" type="text" confirm-type="search" class="keywords" :placeholder="$i18nMsg('formTip-placeholder')" placeholder-class="placeholderSearch" /> <!-- 中文：请输入关键字搜索 -->
								</view>
								<m-font-icon  icon="iconsousuo" :iconSize="30" class="sousuo"></m-font-icon>
							</view>
						</view>
					</view>
				</block>
			</m-back-bar>
		
		<view class="filepath" :class="[themeClass_]">
			<view class="path-wrap">
				<p v-for="(item,index) in filePath" :key="`filePath${index}`" @click="goToStep(item,index)"><m-font-icon icon="iconzhishikuweizhihuidaodiyiji" :iconSize="iconSize" v-if="index == 0"></m-font-icon>{{item.name}}<span v-if="index<filePath.length-1">></span></p>
			</view>
		</view>
		<!-- 内部文档 -->
		<scroll-view scroll-y class="list-wrap">
			<view v-for="(item,index) in fileData" @click="getFiles(item,item.id)" :key="`fileApp${index}`">
				<view class="fileItem">
					<view class="icon-box"><image src="@/static/images/imgwenjianjia.png"></image></view>
					<view class="folder">
						<p class="title">{{item.name}}</p>
						<p class="date">{{formatDate(item.createDate)}}</p>
					</view>
					<!-- <view class="fileSize">{{item.pageNum}}项</view> -->
					<view class="arrow-right"><span></span></view>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view v-for="(item,index) in getFileData" :key="`fileIconAPP${index}`">
				<view class="fileItem">
					<view class="icon-box fileicon" @click="previewFile(item.id,item.displayFileName,item.url)">
						<m-font-icon color="#4E94D9" v-if="formatIcon(item.displayFileName) =='png'"  icon="APP_40" :iconSize="64"></m-font-icon>
						<m-font-icon color="#FF8102" v-else-if="formatIcon(item.displayFileName) =='jpg' || formatIcon(item.displayFileName) =='jpeg'"  icon="APP_39" :iconSize="64"></m-font-icon>
						<m-font-icon color="#FF933D" v-else-if="formatIcon(item.displayFileName) =='doc' || formatIcon(item.displayFileName) =='docx'" icon="APP_37" :iconSize="64"></m-font-icon>
						<m-font-icon color="#47C69A" v-else-if="formatIcon(item.displayFileName) =='ppt'||formatIcon(item.displayFileName) =='pptx'" icon="APP_34" :iconSize="64"></m-font-icon>
						<m-font-icon color="#B9C1CF" v-else-if="formatIcon(item.displayFileName) =='zip'||formatIcon(item.displayFileName) =='rar'" icon="APP_36" :iconSize="64"></m-font-icon>
						<m-font-icon color="#F15643" v-else-if="formatIcon(item.displayFileName) =='pdf'"  icon="APP_35" :iconSize="64"></m-font-icon>
						<m-font-icon color="#F15643" v-else-if="formatIcon(item.displayFileName) =='txt'"  icon="APP_41" :iconSize="64"></m-font-icon>
						<m-font-icon color="#FF932F" v-else-if="formatIcon(item.displayFileName) =='mp3'"  icon="APP_42" :iconSize="64"></m-font-icon>
						<m-font-icon color="#4E7DD9" v-else-if="formatIcon(item.displayFileName) =='mp4'"  icon="APP_43" :iconSize="64"></m-font-icon>
						<m-font-icon color="#B9C1CF" v-else  icon="APP_38" :iconSize="64"></m-font-icon>
					</view>
					<view class="file" @click="previewFile(item.id,item.displayFileName,item.url)">
						<p class="title">{{item.displayFileName}}</p>
						<p class="date">{{formatDate(item.updateDate)}}
					<view class="fileSize">{{formatSize(item.fileLength)}}</view></p>
					</view>
					<view class="downloadIcon">
						<m-font-icon  icon="APP_44" :iconSize="30" class="xiazai" @click="downloadFile(item.id,item.displayFileName,item.fileLength)"></m-font-icon>
					</view>
				</view>
			</view>
			<!-- #endif -->
			
			<!-- h5版本下载 -->
			<!-- #ifdef H5 -->
			<view v-for="(item,index) in getFileData" :key="`uploadH5${index}`">
				<view class="fileItem">
					<view class="icon-box fileicon" @click="previewFile(item.id,item.displayFileName,item.url)">
						<m-font-icon color="#4E94D9" v-if="formatIcon(item.displayFileName) =='png'"  icon="APP_40" :iconSize="64"></m-font-icon>
						<m-font-icon color="#FF8102" v-else-if="formatIcon(item.displayFileName) =='jpg' || formatIcon(item.displayFileName) =='jpeg'"  icon="APP_39" :iconSize="64"></m-font-icon>
						<m-font-icon color="#FF933D" v-else-if="formatIcon(item.displayFileName) =='doc' || formatIcon(item.displayFileName) =='docx'" icon="APP_37" :iconSize="64"></m-font-icon>
						<m-font-icon color="#47C69A" v-else-if="formatIcon(item.displayFileName) =='ppt'||formatIcon(item.displayFileName) =='pptx'" icon="APP_34" :iconSize="64"></m-font-icon>
						<m-font-icon color="#B9C1CF" v-else-if="formatIcon(item.displayFileName) =='zip'||formatIcon(item.displayFileName) =='rar'" icon="APP_36" :iconSize="64"></m-font-icon>
						<m-font-icon color="#F15643" v-else-if="formatIcon(item.displayFileName) =='pdf'"  icon="APP_35" :iconSize="64"></m-font-icon>
						<m-font-icon color="#F15643" v-else-if="formatIcon(item.displayFileName) =='txt'"  icon="APP_41" :iconSize="64"></m-font-icon>
						<m-font-icon color="#FF932F" v-else-if="formatIcon(item.displayFileName) =='mp3'"  icon="APP_42" :iconSize="64"></m-font-icon>
						<m-font-icon color="#4E7DD9" v-else-if="formatIcon(item.displayFileName) =='mp4'"  icon="APP_43" :iconSize="64"></m-font-icon>
						<m-font-icon color="#B9C1CF" v-else  icon="APP_38" :iconSize="64"></m-font-icon>
					</view>
					<view class="file" @click="previewFile(item.id,item.displayFileName,item.url)" style="width: 85%;">
						<p class="title">{{item.displayFileName}}</p>
						<p class="date">{{formatDate(item.updateDate)}}
					<view class="fileSize">{{formatSize(item.fileLength)}}</view></p>
					</view>
<!-- 					<view class="downloadIcon">
						<a target="_blank" :href="downloadUrl+'file/fileDownload?id='+item.id+'&token='+token" :download="item.displayFileName">
							<m-font-icon  icon="APP_44" :iconSize="30" class="xiazai"></m-font-icon>
						</a>
					</view> -->
				</view>
			</view>
			<!-- #endif -->
			
		</scroll-view>
		<!-- <view  v-if="fileData.length === 0 && getFileData.length===0 && !isLoading && tabIndex == 1" class="nodata" 
			:style="{backgroundImage:`url(${nodataImg})`}"></view> -->
		<view class="downloadPro" v-if="isLoading">
			<view class="downloadBox">
				<p class="downname i18n"><span>{{downFileName}}</span>{{ $i18nMsg('pageTip-downloading') }}...</p><!--中文：文件下载中-->
				<view class="progress-box progressBox">
					<view class="progressState" :style="{width:percent+'%'}"></view>
				</view>
				<p class="downpro">{{percent}}%</p>
			</view>
			<button type="default" class="abort-download" @click="cancleDownload">{{ $i18nMsg('page-cancelDownload') }}</button><!-- 中文：取消下载 -->
		</view>
		<!-- 视频预览 -->
		<view v-if="isPreviewVideo" class="previewVideoBox">
			<video id="previewVideo" :src="videoUrl" controls></video>
			<m-font-icon class="closeVideo" icon="iconqingchu" :iconSize="32" @click="shopPreviewVideo"></m-font-icon>
		</view>
		<!-- 音频预览 -->
		<view v-if="isPreviewSound" class="previewSoundBox">
			<!-- <video id="previewVideo" :src="videoUrl" enable-danmu danmu-btn controls></video> -->
			<view class="soundPanel">
				<view class="currentTime">{{formatTime(currentTime,2)}}</view>
				<view class="progressBar"><view :style="{width: durationWidth}"></view></view>
				<view class="surplusTime">{{formatTime(surplusTime,1)}}</view>
			</view>
			<m-font-icon class="closeSound" icon="iconqingchu" :iconSize="32" @click="stopPreviewSound"></m-font-icon>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import mInputSearch from '@/components/element/m-inputSearch.vue'
	import nodataImg from "@/static/images/nodata.png"
	import ClassList from '@/static/js/ClassList.js'
	let listTem = new ClassList()
	export default {
		name:'fileList',
		components: {
			mInputSearch,
		},
		props:{
			barTitle:{
				type:String,
				default:'知识库'
			}
		},
		data(){
			return {
				iconSize:32,
				iconSizeFolder:66,
				iconSizeFile:74,
				id:'',
				userInfo:{
					userName:'',
					id:'12',
				},
				fileData:[],	//文件夹
				fileAllData:[],
				getFileData:[],		//文件
				cloudFileData:[],	//专家文库文件夹
				getCloudFileData:[],		//专家文库文件
				tabIndex:1,
				tabList:[{
					name:this.$i18nMsg('page-internalDocument'),value:1}, //中文：'内部文档'
					{
						name:this.$i18nMsg('page-expertLibrary'), // 中文：'专家文库'
						value:2,
						icon:'iconzhuanjiawenku',
						iconSize:24
					}
				],
				filePath:[{name:this.$i18nMsg('page-knowledge'),id:1}],// 中文：'知识库'
				tempFilePath:'',
				downFileName:'',
				downFileProsess:'',
				isLoading:false,
				percent:1,
				nodataImg:nodataImg,
				fileLength: 0,
				keywords: '',
				groupId: 1,
				downloadUrl: '',
				isPreviewVideo:'',
				isPreviewSound:'',
				innerAudioContext:'',//音频播放
				videoUrl:'',//视频播放
				currentTime:0,
				surplusTime:0,
				duration:0,
				durationWidth:'',
			};
		},
		computed:{
			...mapState(["baseUrl","defaultUrl","token","themeColor"]),
			themeClass_(){//与主题she检修关联
				const mainColor = ["mainColor","whiteColor"]
				return this.themeColor !=='red' ? ("mainColor-" + this.themeColor) : 'mainColor'
			},
		},
		methods:{ 
			changeTab(v){
				this.tabIndex = v;
			},
			searchFiles(){
				let _this = this;
				_this.$http.post('file/getFiles',{groupId: _this.groupId, name: _this.keywords})
				.then(res => {
					_this.getFileData = res.data.data.fileList || [];
					_this.fileData = res.data.data.filegroupList || [];
				})
				.catch(err => {
					console.log(JSON.stringify(err))
				});
			},
			getFiles(item,groupId,arr){
				let _this = this;
				if(groupId){
					_this.groupId = groupId;
				}else{
					_this.groupId = 1;
				}
				_this.$http.post('file/getFiles',{groupId:groupId ||1})
				.then(res => {
					_this.getFileData = res.data.data.fileList || [];
					_this.fileData = res.data.data.filegroupList || [];
					if(groupId&&!arr){
						_this.filePath.push(item);
					}else if(!arr){
						_this.filePath = [{name:this.$i18nMsg('page-knowledge'),id:1}]; // 中文：'知识库'
					}
					uni.setStorageSync('filePath', _this.filePath);
				})
				.catch(err => {
					console.log(JSON.stringify(err))
				});
			},
			goToStep(e,index){
				if(index!=undefined&&index!='undefined'){
					let arr=[];
					arr = this.filePath.slice(0,index+1);
					uni.setStorageSync('filePath', this.filePath);
					this.filePath = arr;
					if(!e || e.id == 1){ // 中文：'知识库'
						this.getFiles();
					}else{
						this.getFiles(e,e.id,arr);
					}
				}
			},
			downloadFile(id, name, fileLength) {
				let _this = this;
				var FileSystemURL = '_downloads/' + name;
				this.fileLength = fileLength;
				plus.io.resolveLocalFileSystemURL(FileSystemURL, function(entry) {
					if(entry.isFile) {
						uni.showModal({
							title: _this.$i18nMsg('basic-modalTip'), // 中文：'提示'
							content: _this.$i18nMsg('choiceTip-whetherOpen') + name + _this.$i18nMsg('page-attachmentView'),// 中文：'是否打开XX附件查看?'
							confirmText:_this.$i18nMsg('basic-confirm'),
							cancelText:_this.$i18nMsg('basic-cancel'),
							success: function (res) {
								if (res.confirm) {
									plus.runtime.openFile(FileSystemURL, {}, function(e) {
										plus.nativeUI.alert(_this.$i18nMsg('pageTip-unableOpenFile')+ "：entry" + entry.toLocalURL() + 'symurl' + FileSystemURL); //中文：无法打开此文件
									});
								}
							}
						});
					}
				}, function() {
					_this.dowload(id, name, fileLength);
				});
			},
			dowload(id, name, fileLength) {
				let _this = this;
				var options = {
					method: "GET",
					filename: "_downloads/"+name,
				};
				let baseUrl = this.baseUrl || this.defaultUrl;
				var url=baseUrl+'file/fileDownload?id='+id+'&token='+this.token;
				var dtask = plus.downloader.createDownload(url, options, function(d, status) {
					if(status != 200) { 
						_this.isLoading = false;
						return;
					}
				});
				_this.percent = 0;
				dtask.start();
				dtask.addEventListener("statechanged", function(task, status) {
					if(status === 401) {
						_this.isLoading = false;
						return 
					}else{
						_this.isLoading = true;
					}
					switch(task.state) {
						case 1:
							console.log("开始下载...");
							break;
						case 2:
							console.log("链接到服务器...");
							break;
						case 3:
							console.log('已接受到数据');
							var a = Math.floor(task.downloadedSize / fileLength / 10.24) || 0;
							_this.percent = a;
							console.log(_this.percent)
							break;
						case 4:
							console.log("下载完成！");
							console.log(JSON.stringify( task));
							_this.isLoading = false;
							uni.showModal({
								title: _this.$i18nMsg('basic-modalTip'),// 中文：'提示'
								content: _this.$i18nMsg('choiceTip-whetherOpen') + name + _this.$i18nMsg('page-attachmentView')+'?',
								confirmText:_this.$i18nMsg('basic-confirm'),
								cancelText:_this.$i18nMsg('basic-cancel'),
								success: function (res) {
									if (res.confirm) {
										plus.runtime.openFile(task.filename, {}, function(e) {
											plus.nativeUI.alert(_this.$i18nMsg('pageTip-unableOpenFile') + "：" + e.message);
										});
									}
								}
							});
							break;
					}
				}, false);
			} ,
			cancleDownload(){
				this.isLoading = false;
				plus.downloader.clear();
			},
			formatDate(value) {
				let date = new Date(value);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
			},
			formatSize(length){
				if(length>1024){
					return parseInt(length/10.24)/100 + 'M';
				}else{
					return length +'K';
				}
			},
			formatIcon(name){
				let names = name.split('.');
				name = names[names.length - 1];
				return name;
			},
			previewFile(id, name, url){
				const fileName = this.formatIcon(name);
				if(fileName == 'jpg' || fileName == 'jpeg' || fileName == 'png'){
					this.previewImage(url)
				}else if(fileName == 'mp3'){
					this.previewSound(url);
				}else if(fileName == 'mp4'){
					this.previerVideo(url);
				}else if(fileName == 'pdf'){
					this.previerPdf(id, name, url);
				}else{
					this.downloadFile(id, name, url)
				}
			},
			previewImage(url){
				uni.previewImage({
					urls: [url],
					longPressActions: {
						success: function(data) {
							
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			previewSound(url){
				if(this.innerAudioContext.src == url){
					
				}
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.src = url;
				// this.innerAudioContext.play()
				this.innerAudioContext.onPlay(() => {
					this.duration = this.innerAudioContext.duration
				});
				this.innerAudioContext.autoplay = true;
				this.isPreviewSound = true;
				// this.isPreviewSound = true;
				this.innerAudioContext.onTimeUpdate((res) => {
					this.currentTime = this.innerAudioContext.currentTime
					this.surplusTime = this.duration - this.currentTime
					this.durationWidth = parseInt(this.currentTime*10000/this.duration)/100 + '%' 
				});
			},
			stopPreviewSound(){
				this.innerAudioContext.destroy()
				this.isPreviewSound = false;
				this.durationWidth = 0;
				this.currentTime = 0;
				this.surplusTime = 0;
			},
			previerVideo(url){
				this.videoContext = uni.createVideoContext('previerVideo')
				this.isPreviewVideo = true;
				this.videoUrl = url;
			},
			shopPreviewVideo(){
				this.isPreviewVideo = false;
			},
			previerPdf(id, name, url){
				// #ifdef H5
				url = '/pages/common/preview?url='+url;
				setTimeout(()=>{
					uni.navigateTo({
						url:url
					})
				},100)
				// #endif
				// #ifdef APP-PLUS
				this.downloadFile(id, name, url)
				// #endif
			},
			formatTime(time,type){
				time = parseInt(time);
				let m = time>60?parseInt(time/60):0;
				let s = time%60>=10 ? time%60 : '0' + time%60;
				if(type == 1){
					return m + ':' + s
				}else{
					return '-' + m + ':' + s
				}
			},
		},
		mounted(){
			this.getFiles();
			this.downloadUrl = this.baseUrl || this.defaultUrl
		}
	}
</script>

<style scoped>
	.haveStatusBar,.topshow-status,.topBtn,.hasstatus{
		height: var(--status-bar-height);
	}
	.tab-box{top: var(--status-bar-height);}
	.path-wrap,.list-wrap{margin-top: var(--status-bar-height);}
</style>