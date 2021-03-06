/**
 * @description 列表数据请求
 * @autor shishanshan
 * @update 2019/08/12
 */
import * as Path from './interface.js'


let treeApi = {
	currencyStandardSelectionBoxTree(_this, params){//通用查询APP标准选择框数据（整颗树）
		return _this.$http.post(Path.currencyStandardSelectionBoxTree, params)
		.then(res => {
			const result = res.data
			if(result.success){
				return result.data
			}else{
				throw result
				return []
			}
		})
		.catch(err => {
			_this.Static_GlobalFucs.showModal(_this,{
				title:_this.$i18nMsg("basic-modalTipError"),
				content:err || "操作失败",
				showCancel:false
			})
			console.error(err)
		})
	},
	currencyStandardSelectionBoxSingleTree(_this, params, type){//通用查询APP标准选择框数据（单节点树）
		//type：G-group；D-detail
		return _this.$http.post(Path.currencyStandardSelectionBoxSingleTree, params)
		.then(res => {
			const result = res.data
			if(result.success){
				let groupList = (result.data && result.data.groupList) || [],
					childList = (result.data && result.data.childList) || []
				return groupList.concat(childList)
			}else{
				throw result
				return []
			}
		})
		.catch(err => {
			_this.Static_GlobalFucs.showModal(_this,{
				title:_this.$i18nMsg("basic-modalTipError"),
				content:err || "操作失败",
				showCancel:false
			})
			console.error(err)
		})
	},
	currencyGetRootNodes(_this,params){//数据选择框定位获取节点的祖先节点
		return _this.$http.post(Path.currencyGetRootNodes, params)
		.then(res => { return res.data })
		.catch(err => {
			_this.Static_GlobalFucs.showModal(_this,{
				title:_this.$i18nMsg("basic-modalTipError"),
				content:err || "操作失败",
				showCancel:false
			})
			console.log(err)
		})
	},
}

export default treeApi