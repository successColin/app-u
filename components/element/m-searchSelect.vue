<template name="mSearchSelect">
	<!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
	<view class="formElemets" v-if="element.visiabled"
	 :class="[element.labletPositon || 'left',
	  element.readonly?'readonly':'']">
			<label class="text" :class="value || element.readonly?'':'drakcolor'">
				{{ element.label }}
				<span v-if="element.requisite" class="icon iconfont iconmust-fill2 requisite"></span>
			</label>
			<view class="content">
				<input class="input" :class="{hasrelationTab:element.relationTabId}" :placeholder="element.placeholderText" :value="value" disabled="true" @tap="clickInput"/>
				<!-- 扫描按钮 -->
				<!-- #ifndef H5 -->
				<m-button v-if="hasScanElements.indexOf(element.baseType)!==-1 && !element.readonly" class="button" :isFontBtn="true" btnClass="mainColor"  key="scan"
					@elementClick="handleScan">
					<block slot="buttonIcon" style="display: inline-block;">
						<m-font-icon icon="iconsaoma1" :iconSize="38"></m-font-icon>
					</block>
				</m-button>
				<!-- #endif -->
				<!-- 选择按钮 -->
				<m-button v-if="hasSelectElements.indexOf(element.baseType)!==-1 && !element.readonly" class="button select" :isFontBtn="true" btnClass="mainColor"  key="select"
					@elementClick="showPanel">
					<block slot="buttonIcon" style="display: inline-block;">
						<m-font-icon icon="searchSelect_app" :iconSize="38"></m-font-icon>
					</block>
				</m-button>
			</view>
	</view>
</template>

<script>	
	export default {
		name:"mSearchSelect",
		props:{
			element:{type:Object,default(){return {}}},
			isEllipsis:{type:Boolean,default: false},
			sourceType:{type:String,default: "list"},//来源 list forme advancedFilter
			value:{type:[Number,String]},//值
		},
		data() {
			return {
				hasScanElements: [12,25],
				hasSelectElements: [3,12]
			}
		},
		methods:{
			showPanel(){this.$emit("select")},
			handleScan() {this.$emit("selectScan")},
			clickInput(){
				if(this.element.relationTabId) this.$emit("showRelationTab") //关联弹出面板}
			}
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
