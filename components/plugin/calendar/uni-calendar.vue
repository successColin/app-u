<template>
	<view class="calendar-main">
		<view v-if="maskShow && !insert" :class="{ 'ani-mask-show': aniMaskShow }" class="uni-calendar__mask" />
		<view v-if="maskShow || insert" :class="{ 'ani-calendar-show': aniMaskShow, 'uni-calendar__static': insert }" class="uni-calendar__box">
			<view v-if="!insert" class="uni-calendar__nav">
				<view class="uni-calendar__nav-item" @click="close">{{ $i18nMsg('basic-cancel') }}</view>
				<view class="uni-calendar__nav-item" @click="confirm">{{ $i18nMsg('basic-confirm') }}</view>
			</view>
			<view class="uni-calendar__wrapper">
				<view class="uni-calenda__content">
					<view class="panel-header">
						<slot name="hd_leftbtns"></slot>
						<view class="panel-header-content">
							<view class="panel-header-befor" @tap="dataBefor('prev')">
								<text class="iconfont iconshushouqijiantou-copy" />
							</view>
							<view>{{ canlender.year + $i18nMsg('time-year') + canlender.month + $i18nMsg('time-month')}}</view>
							<view class="panel-header-after" @tap="dataBefor('after')">
								<text class="iconfont iconshushouqijiantou" />
							</view>
						</view>
						<slot name="hd_rightbtns"></slot>
						<!-- 是否显示周和月切换 -->
						<m-button :visiabled="isVisiabled" :isFontBtn="true" @elementClick="hangdleChangeType()">
							<block slot="buttonIcon" style="display: inline-block;">
								<m-font-icon :icon="changeTypeIcon" :iconSize="40"></m-font-icon>
							</block>
						</m-button>
					</view>
					<view v-if="isLunar" class="uni-calendar__day-detail">
						<view>{{ canlender.year + $i18nMsg('lang-year') + canlender.month + $i18nMsg('time-month') + canlender.date + $i18nMsg('time-date') + '（' + canlender.lunar.astro + ')' }}</view>
						<view>
							{{ canlender.lunar.gzYear + $i18nMsg('lang-year') + canlender.lunar.gzMonth + $i18nMsg('time-month') + canlender.lunar.gzDay + $i18nMsg('time-date') + ' (' + canlender.lunar.Animal + $i18nMsg('lang-year') +')' }}
							{{ canlender.lunar.IMonthCn + canlender.lunar.IDayCn }} {{ canlender.lunar.isTerm ? canlender.lunar.Term : '' }}
						</view>
					</view>
					<view class="calendar-header">
						<view class="item">{{ $i18nMsg('time-week-sun') }}</view> <!-- 中文：日 -->
						<view class="item">{{ $i18nMsg('time-week-mon') }}</view> <!-- 中文：一 -->
						<view class="item">{{ $i18nMsg('time-week-tue') }}</view> <!-- 中文：二 -->
						<view class="item">{{ $i18nMsg('time-week-wed') }}</view> <!-- 中文：三 -->
						<view class="item">{{ $i18nMsg('time-week-thu') }}</view> <!-- 中文：四 -->
						<view class="item">{{ $i18nMsg('time-week-fri') }}</view> <!-- 中文：五 -->
						<view class="item">{{ $i18nMsg('time-week-sat') }}</view> <!-- 中文：六 -->
					</view>
					<uni-calendar-item :calendarData="calendarData" :calendartype="calendartype" :canlender="canlender" :lunar="isLunar" @selectDays="selectDays" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CALENDAR from './calendar.js'
	import uniCalendarItem from './uni-calendar-item'
	import {homeApi} from '@/common/request/api.js'
	
	export default {
		name: 'UniCalendar',
		components: {
			uniCalendarItem,
		},
		props: {
			/**
			 * 当前日期
			 */
			date: {
				type: String,
				default: ''
			},
			/**
			 * 打点日期
			 */
			selected: {
				type: Array,
				default () {
					return []
				}
			},
			/**
			 * 是否开启阴历日期
			 */
			lunar: {
				type: Boolean,
				default: false
			},
			/**
			 * 是否禁用今天之前的日期
			 */
			disableBefore: {
				type: Boolean,
				default: false
			},
			/**
			 * 开始时间
			 */
			startDate: {
				type: String,
				default: ''
			},
			/**
			 * 结束时间
			 */
			endDate: {
				type: String,
				default: ''
			},
			/**
			 * 范围
			 */
			range: {
				type: Boolean,
				default: false
			},
			/**
			 * 插入
			 */
			insert: {
				type: Boolean,
				default: false
			},
			/**
			 * 类型
			 */
			showType: {
				type: String,
				default: "month"
			},
			/**
			 * 是否显示左右切换
			 */
			isVisiabled: {
				type: Boolean,
				default: true
			},
			otherParams:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		data() {
			/**
			 * TODO 兼容新旧编译器
			 * 新编译器（自定义组件模式）下必须使用固定数值，否则部分平台下会获取不到节点。
			 * 随机数值是在旧编译器下使用的，旧编译器模式已经不推荐使用，后续直接废掉随机数值的写法。
			 */
			return {
				changeTypeIcon:'iconqiehuanzhou',
				calendartype:this.showType,
				maskShow: false, // 显示日历
				aniMaskShow: false,
				dateShow: false, // 日期是否选择
				canlender: {
					weeks: []
				},
				multiple: 0,
				multipleDates: {
					begin: '',
					end: '',
					data: []
				},
				isLunar: false,
				calendarData:[]
			}
		},
		watch: {
			calendartype(){
				this.init()
			},
			date() {
				this.init()
			},
			selected() {
				this.init()
			},
			lunar(newVal) {
				this.isLunar = newVal
				this.init()
			},
			disableBefore() {
				this.init()
			},
			startDate() {
				this.init()
			},
			endDate() {
				this.init()
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				// 初始化日历
				this.getMonthAll(0, this.date)
			},
			getCalendarData(param){
				const canlender = this.canlender
				let fulldate = canlender.year + '-' + canlender.month + '-' + canlender.date
				let selectDate = this.$dateFormat.formatDate(fulldate, "yyyy-MM-dd hh:mm:ss")
				let basicParams = {
					dateType:1,
					selectDate:selectDate
				}
				if(this.calendartype==="day"){
					basicParams.dateType=2
				}
				basicParams = {...basicParams,...this.otherParams,...param}
				const _this = this
				homeApi.calendarGetData(this, basicParams).then((value)=>{
					_this.calendarData = value
				})
			},
			hangdleChangeType(){
				if(this.calendartype === 'month'){
					this.calendartype = 'day'
					this.changeTypeIcon = 'iconqiehuanzhou'
				}else{
					this.calendartype = 'month'
					this.changeTypeIcon = 'iconqiehuanyue'
				}
				this.$emit("changeType",this.calendartype)
			},
			open() {
				this.maskShow = true
				this.multiple = 0
				this.multipleDates.data = []
				this.multipleDates.begin = ''
				this.multipleDates.end = ''
				this.init()
				this.$nextTick(() => {
					setTimeout(() => (this.aniMaskShow = true), 30)
				})
			},
			close() {
				this.aniMaskShow = false
				this.$nextTick(() => {
					setTimeout(() => (this.maskShow = false), 300)
				})
			},
			confirm() {
				this.setEmit('confirm')
				this.close()
			},
			/**
			 * 获取当前月份全部日期
			 */
			getMonthAll(index, date, type) {
				if (date === '') {
					date = new Date()
				}
				const canlender = this.getWeek(this.getDate(date, index, this.calendartype))
				this.canlender = canlender
				if (this.insert) {
					this.setEmit('change', type)
				}
			},
			/**
			 * 设置事件
			 * @param {Object} canlender
			 */
			setEmit(name, type) {
				const canlender = this.canlender
				this.$emit(name, {
					type:type,
					range: this.range ? this.multipleDates : {},
					year: canlender.year,
					month: canlender.month,
					date: canlender.date,
					lunar: canlender.lunar,
					clockinfo: canlender.clockinfo || {},
					fulldate: canlender.year + '-' + (canlender.month > 9 ? canlender.month : `0${canlender.month}`) + '-' + (canlender.date > 9 ? canlender.date : `0${canlender.date}`)
				})
				if(type !== "selectDays"){//如果只是选择日期不用重新查找count
					this.getCalendarData()
				}
			},
			/**
			 * 今天之前是否禁用
			 * @param {Object} year 年
			 * @param {Object} month 月
			 * @param {Object} date 日
			 */
			isDisableBefore(year, month, date) {
				const nowDate = this.date || new Date()
				const time = year + '-' + month + '-' + date
				let startDate = false
				let endDate = false
				if (this.startDate) {
					startDate = this.dateCompare(this.startDate, time)
				}
				if (this.endDate) {
					endDate = this.dateCompare(this.getDate(this.endDate, 1), time)
				}

				if (this.disableBefore) {
					if (!this.startDate) {
						if (!this.endDate) {
							return !this.dateCompare(this.getDate(nowDate, 0), time)
						} else {
							return !this.dateCompare(this.getDate(nowDate, 0), time) || endDate
						}
					} else {
						return !this.dateCompare(this.getDate(nowDate, 0), time) || !startDate || endDate
					}
				} else {
					if (!this.startDate) {
						if (!this.endDate) {
							return false
						} else {
							return endDate
						}
					} else {
						return !startDate || endDate
					}
				}
			},
			/**
			 * 返回今天
			 */
			backtoday() {
				this.getMonthAll(0, this.date)
			},
			/**
			 * 切换前一月 || 后一月
			 * @param {Object} id
			 * @param {Object} types
			 */
			dataBefor(type) {
				const year = this.canlender.year + '-' + this.canlender.month + '-' + this.canlender.date
				let index = 1
				if(this.calendartype === 'day') index = 7
				if(type==='prev') index = -index
				this.getMonthAll(index, year)
			},
			/**
			 * 选择当前的日期
			 * week 当前的周
			 * index 点击的下标索引
			 * ischeck 是否选中
			 */
			selectDays(params) {
				const {
					week,
					index,
					ischeck,
					isDay
				} = params
				if (!ischeck) return
				if (isDay) return
				// 多选判断

				const canlender = this.canlender
				const month = canlender.weeks[week][index].month < 10 ? '0' + canlender.weeks[week][index].month : canlender.weeks[week][index].month
				const date = canlender.weeks[week][index].date < 10 ? '0' + canlender.weeks[week][index].date : canlender.weeks[week][index].date
				const time = canlender.weeks[week][index].year + '-' + month + '-' + date
				this.isClick = true
				// this.multiple = this.multiple === 0 ? 1 : 0;

				if (this.multiple === 0) {
					this.multipleDates.begin = time
					this.multiple = 1
				} else if (this.multiple === 1) {
					this.multiple = 2
					if (this.multipleDates.data) {
						this.multipleDates.data = []
					}
					const compare = this.dateCompare(this.multipleDates.begin, time)
					if (compare) {
						this.multipleDates.data = this.geDateAll(this.multipleDates.begin, time)
						this.multipleDates.end = time
					} else {
						this.multipleDates.data = this.geDateAll(time, this.multipleDates.begin)
						this.multipleDates.end = this.multipleDates.begin
						this.multipleDates.begin = time
					}
				} else {
					this.multiple = 0
					this.multipleDates.data = []
					this.multipleDates.begin = ''
					this.multipleDates.end = ''
				}
				this.getMonthAll(0, time, "selectDays")
			},
			// 获取日历内容
			getWeek(dateData) {
				// 判断当前是 安卓还是ios ，传入不容的日期格式
				if (typeof dateData !== 'object') {
					dateData = dateData.replace(/-/g, '/')
				}
				const selected = this.selected
				const nowDate = this.getDate(this.date || new Date())
				const {
					year,
					month,
					date,
					day,
					week
				} = this.getNewDate(dateData)
				let canlender = []
				let dates = {
					firstDay: new Date(year, month - 1, 1).getDay(),
					lastMonthDays: [], // 上个月末尾几天
					currentMonthDys: [], // 本月天数
					nextMonthDays: [], // 下个月开始几天
					endDay: new Date(year, month, 0).getDay(),
					weeks: []
				}
				let weekdays=[0,1,2,3,4,5,6];
				// 循环上个月末尾几天添加到数组
				for (let i = dates.firstDay; i > 0; i--) {
					let pevyear = year,
						pevM = month - 1
					if(month===1){
						pevM = 12
						pevyear = pevyear - 1
					}
					const beforeDate = new Date(pevyear, pevM, -i + 1).getDate()
					const date = new Date(pevyear, pevM-1, beforeDate).getDay()
					dates.lastMonthDays.push({
						year:pevyear,
						date: beforeDate,
						weekday:weekdays[date],
						month: pevM,
						disable: this.isDisableBefore(pevyear, pevM, beforeDate),
						lunar: this.getlunar(pevyear, pevM, beforeDate),
						isDay: false
					})
				}
				let clockinfo = {
					have: false
				}
				// 循环本月天数添加到数组
				for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
					let have = false
					let clockinfoTemp = {}
					// 处理打卡信息
					for (let j = 0; j < selected.length; j++) {
						const selDate = selected[j].date.split('-')

						if (Number(year) === Number(selDate[0]) && Number(month) === Number(selDate[1]) && Number(i) === Number(selDate[2])) {
							have = true
							clockinfoTemp.have = true
							clockinfoTemp.date = selected[j].date
							if (selected[j].info) {
								clockinfoTemp.info = selected[j].info
							}
							if (JSON.stringify(selected[j].data) === '{}' || selected[j].data !== undefined) {
								clockinfoTemp.data = selected[j].data
							}
							if (Number(year) === Number(selDate[0]) && Number(month) === Number(selDate[1]) && Number(date) === Number(selDate[2])) {
								clockinfo = clockinfoTemp
							}
						}
					}
					// 多选
					const {
						begin,
						end,
						data
					} = this.multipleDates
					const [bYear, bMonth, bDate] = begin.split('-')
					const [eYear, eMonth, eDate] = end.split('-')
					let checked = false
					let multipleBegin = false
					let multipleEnd = false
					data.forEach((item, index) => {
						const [mYear, mMonth, mDate] = item.split('-')
						if (year === Number(mYear) && month === Number(mMonth) && i === Number(mDate)) {
							checked = true
						}
					})
					// 开始日期
					if (year === Number(bYear) && month === Number(bMonth) && i === Number(bDate)) {
						multipleBegin = true
					}

					// 结束日期
					if (year === Number(eYear) && month === Number(eMonth) && i === Number(eDate)) {
						multipleEnd = true
					}
					
					const date = new Date(year, month-1, i).getDay()
					
					dates.currentMonthDys.push({
						checked: this.range ? checked : false,
						multipleBegin: this.range ? multipleBegin : false,
						multipleEnd: this.range ? multipleEnd : false,
						year:year,
						date: i,
						month: month,
						weekday:weekdays[date],
						have,
						clockinfo: clockinfoTemp,
						disable: this.isDisableBefore(year, month, i + ''),
						lunar: this.getlunar(year, month, i + ''),
						isDay: nowDate === year + '-' + (month < 10 ? '0' + month : month) + '-' + (i < 10 ? '0' + i : i)
					})
				}
				const surplus = 42 - (dates.lastMonthDays.length + dates.currentMonthDys.length)
				// 循环下个月开始几天 添加到数组
				for (let i = 1; i < surplus + 1; i++) {
					let nextyear = year,
						nextM = month
					if(month===12){
						nextM = 0
						nextyear = nextyear + 1
					}
					const date = new Date(nextyear, nextM, i).getDay(),
						  isDay = false
					dates.nextMonthDays.push({
						date: i,
						year:nextyear,
						weekday:weekdays[date],
						month: nextM + 1,
						disable: this.isDisableBefore(nextyear, nextM + 1, i + ''),
						lunar: this.getlunar(nextyear, nextM + 1, i + ''),
						isDay: isDay
					})
				}

				canlender = canlender.concat(dates.lastMonthDays, dates.currentMonthDys, dates.nextMonthDays)
				// 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
				let totalDay = 0
				for (let i = 0; i < canlender.length; i++) {
					if(this.calendartype=="day"){//周
						let date = canlender[i].date,
							month = canlender[i].month
							
						const w = this.getMonthWeek(canlender[i].year,canlender[i].month,date)
						if (!dates.weeks[week]) {
							dates.weeks[week] = new Array({},{},{},{},{},{},{})
						}
						if(canlender[i].year === year && w !== week) continue
						else if(canlender[i].year > year && w!==1) continue
						else if(canlender[i].year < year && week!==1) continue
						
						if(totalDay === 7) break
						totalDay++
						dates.weeks[week][canlender[i].weekday] = canlender[i]
					}else{//月
						if (i % 7 === 0) {
							dates.weeks[parseInt(i / 7)] = new Array(7)
						}
						dates.weeks[parseInt(i / 7)][i % 7] = canlender[i]
					}
					
				}
				return {
					week:week,
					weeks: dates.weeks,
					month: month,
					date: date,
					day: day,
					year: year,
					clockinfo,
					lunar: CALENDAR.solar2lunar(year, month, date),
					lastDate: dates.currentMonthDys[dates.currentMonthDys.length - 1].date
				}
			},
			/**
			 * 计算阴历日期显示
			 */
			getlunar(year, month, date) {
				return CALENDAR.solar2lunar(year, month, date).IDayCn
			},
			//判断当前日期为当月第几周
			isLeapYear(year) {
			     return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
			},
			getMonthDays(year, month) {
			     return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (this.isLeapYear(year) ? 29 : 28);
			},
			getMonthWeek(y, m, d) {
			     var now = new Date(y, m - 1, d),
			              year = now.getFullYear(),
			              month = now.getMonth(),
			              days = now.getDate();
			          //那一天是那一年中的第多少天
			          for (var i = 0; i < month; i++) {
			              days += this.getMonthDays(year, i);
			          }
			      
			          //那一年第一天是星期几
			          var yearFirstDay = new Date(year, 0, 1).getDay() || 7;
			      
			          var week = null;
			          if (yearFirstDay == 1) {
			              week = Math.ceil(days / yearFirstDay);
			          } else {
			              days -= (7 - yearFirstDay);
			              week = Math.ceil(days / 7) + 1;
			          }
			      
			         return week;
			 },
			/**
			 * 获取日期
			 * @param {Object} dateData
			 */
			getNewDate(dateData) {
				const _date = new Date(dateData),
					  year = _date.getFullYear(), 
					  month = _date.getMonth() + 1,
					  date = _date.getDate()
				let week = this.getMonthWeek(year,month,date)
				return {
					year: _date.getFullYear(), // 年
					month: _date.getMonth() + 1, // 月
					date: _date.getDate(), // 日
					day: _date.getDay(), // 天
					week:week//第几周
				}
			},
			/**
			 * 获取任意时间
			 */
			getDate(date, AddDayCount = 0, str = 'day') {
				if (typeof date !== 'object') {
					date = date.replace(/-/g, '/')
				}
				const dd = new Date(date)
				switch (str) {
					case 'day':
						dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
						break
					case 'month':
						dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
						break
					case 'year':
						dd.setFullYear(dd.getFullYear() + AddDayCount) // 获取AddDayCount天后的日期
						break
				}
				const y = dd.getFullYear()
				const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
				const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
				return y + '-' + m + '-' + d
			},
			/**
			 * 比较时间大小
			 */
			dateCompare(startDate, endDate) {
				// 计算截止时间
				startDate = new Date(startDate.replace('-', '/').replace('-', '/'))
				// 计算详细项的截止时间
				endDate = new Date(endDate.replace('-', '/').replace('-', '/'))
				if (startDate <= endDate) {
					return true
				} else {
					return false
				}
			},
			geDateAll(begin, end) {
				var arr = []
				var ab = begin.split('-')
				var ae = end.split('-')
				var db = new Date()
				db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
				var de = new Date()
				de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
				var unixDb = db.getTime() - 24 * 60 * 60 * 1000
				var unixDe = de.getTime() - 24 * 60 * 60 * 1000
				for (var k = unixDb; k <= unixDe;) {
					k = k + 24 * 60 * 60 * 1000
					arr.push(this.getDate(new Date(parseInt(k))))
				}
				return arr
			}
		}
	}
</script>

<style scoped>
	.uni-calendar__mask {
		position: fixed;
		bottom: 0;
		top: 0;
		width: 100%;
		background: rgba(0, 0, 0, .4);
		transition: all .3s;
		opacity: 0;
		z-index: 9998
	}

	.uni-calendar__mask.ani-mask-show {
		opacity: 1
	}

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		height: 100upx;
		background: #fff;
		z-index: 10000;
		font-size: 32upx
	}

	.uni-calendar__box {
		position: fixed;
		bottom: 0;
		z-index: 9999;
		width: 100%;
		box-sizing: border-box;
		transition: all .3s;
		transform: translateY(100%)
	}

	.uni-calendar__box.ani-calendar-show {
		transform: translateY(0)
	}

	.uni-calendar__box.uni-calendar__static {
		position: static;
		transform: translateY(0)
	}

	.uni-calendar__box .uni-calendar__nav {
		display: flex;
		justify-content: space-between;
		height: 100upx;
		border-bottom: 1px #f5f5f5 solid;
		background: #f5f5f5;
		padding: 0 10upx
	}

	.uni-calendar__box .uni-calendar__nav .uni-calendar__nav-item {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100upx;
		height: 100upx;
		color: #333
	}

	.uni-calendar__wrapper {
		width: 100%;
		box-sizing: border-box;
		font-size: 26rpx;
		transition: all .3s
	}
	.uni-calendar__wrapper .uni-calenda__content .uni-calendar__panel .uni-calendar__backtoday {
		position: absolute;
		right: 0;
		top: 25rpx;
		padding: 0 10rpx;
		padding-left: 20rpx;
		height: 50rpx;
		line-height: 50rpx;
		border: 1px rgba(253, 46, 50, .5) solid;
		border-right: none;
		font-size: 24rpx;
		border-top-left-radius: 50rpx;
		border-bottom-left-radius: 50rpx;
		color: rgba(253, 46, 50, .7);
		background: rgba(241, 233, 233, .4)
	}

	.uni-calendar__wrapper .uni-calenda__content .uni-calendar__day-detail {
		padding: 20upx;
		padding-left: 30upx;
		border-top: 1px #f5f5f5 solid
	}
	.uni-calendar__wrapper .uni-calenda__content .uni-calendar__body {
		display: flex;
		flex-wrap: wrap;
		font-size: 28upx
	}
</style>