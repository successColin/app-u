<template name="mLabel">
	<!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
	<view v-if="element.visiabled"
	 :class="[element.labletPositon || 'left',
	  sourceType!=='list'?'formElemets':'',
	  isFocus ? inputFocusClass: '',
	  element.readonly?'readonly':'',
	  isEllipsis?'ellipsis':'']">
		<block v-if="sourceType === 'list'">{{ element.canDisplayName ? `${element.label}:${value}`:value}}</block>
		<block v-else>
			<label class="text" :class="isLabel || element.readonly || showContent?'':'drakcolor'">
				{{ element.label }}
				<span v-if="element.requisite" class="icon iconfont iconmust-fill2 requisite"></span>
			</label>
			<view class="content">
				<input class="input" :class="{hasrelationTab:element.relationTabId}" :value="showContent" 
					:disabled="element.readonly ? true : false" 
					:placeholder="element.placeholderText"
					@input="changeLabelColor"
					@focus="inputFocus"
					@blur="inputBlur"
					@tap="clickInput"/>
			</view>
		</block>
	</view>
</template>

<script>	
import { mapState, mapMutations } from 'vuex'
	export default {
		name:"mSearchSelect",
		props:{
			element:{type:Object,default(){return {}}},
			isEllipsis:{type:Boolean,default: false},
			sourceType:{type:String,default: "list"},//来源 list forme advancedFilter
			value:{type:[Number,String]},//值
			inputFocusClass:{type:String,default: "inputFocus-red"}
		},
		data() {
			return {
				showContent: "",
				isFocus:false,
				isInit:true,
				isLabel:false
			}
		},
		watch:{
			value(newVal,oldVal){
				if(this.sourceType !== 'list'){
					this.showContent = newVal
				} 
			},
			showContent(newVal){
				if(this.sourceType !== 'list' && !this.isInit){
					this.$emit("changeValue",{
						triggerBaseType:2,
						element:this.element,
						value:this.showContent
					})
				}
				this.isInit = false 
			}
		},
		methods:{
			...mapMutations(["STATE_formElementFocus"]),
			clickInput(){
				if(this.element.relationTabId) this.$emit("showRelationTab") //关联弹出面板
			},
			inputFocus() {//设置聚焦
				this.isFocus = true
				this.STATE_formElementFocus(true)
			},
			inputBlur(e) {//失焦
				this.isInit = false
				this.$nextTick(() => {
					this.isFocus = false
					this.showContent = e.target.value
				})
			},
			changeLabelColor(event){
				this.isLabel = event.detail.value?true:false;
			},
		},
		created() {
			if(this.sourceType !== 'list') this.showContent = this.value
		}
	}
</script>
<style scoped>
	.ellipsis{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
