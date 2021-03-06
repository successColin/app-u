
/**
 * @description 点检本地数据库操作方法
 * @autor yezhaojie
 * @update 2019/11/19
 * @readyDB                         创建数据库并且创建表,全部表创建成功后执行回调
 * @dropInspectionTables            删除所有表并关闭数据库,操作成功后执行回调
 * 
 * @insertIntoInspectionDo          新增巡检任务数据存储
 * @insertInspectionpointDo         新增巡检点数据存储
 * @insertFile                      新增文件数据
 * 
 * @selectInspectionDo              查询巡检路线数据
 * @selectMoList                    查询设备列表
 * @selectPointDoList               查询巡检点数据
 * @selectManhours                  查询工时
 * @selectFileList                  查询文件数据
 * @selectInspectionHistory         查询上传结果页面列表,数量相关的
 * @selectPointsByInspectionDoId    查询已操作的点数据,上传用
 * @selectPointsResults             查询已操作的点数据,查看用
 * @selectInspectionUpData          查询需要上传的路线数据
 * @selectAllFile                   查询搜索未上传文件
 * 
 * @updateSql                       通用的更新操作
 * @updateUploadstatus              批量更新上传状态通用接口
 * 
 * @deleteFile                      删除文件数据
 * @deleteRoute                     删除巡检路线
 * @deleteSkipMo              删除设备相关的点
 * @deletePointByInspec             删除路线相关的点
 */
import DB from '@/static/js/websql.js'

const createInspectionDo = function(cb, cbe) {
	let sql =
		`CREATE TABLE inspectiondo (
		  id INTEGER PRIMARY KEY AUTOINCREMENT,
		  keycode VARCHAR(50) NOT NULL,
		  name VARCHAR(50) DEFAULT NULL,
		  createdate text DEFAULT NULL,
		  createuserid int DEFAULT NULL,
		  modificationdate text DEFAULT NULL,
		  modificationuserid int DEFAULT NULL,
		  basestate int DEFAULT NULL,
		  basetype int DEFAULT NULL,
		  basepriority int DEFAULT NULL,
		  stateid int DEFAULT NULL,
		  typeid int DEFAULT NULL,
		  priorityid int DEFAULT NULL,
		  orgid int DEFAULT NULL,
		  memo VARCHAR(1000) DEFAULT NULL,
		  picpath VARCHAR(200) DEFAULT NULL,
		  barcode VARCHAR(200) DEFAULT NULL,
		  qrcode VARCHAR(200) DEFAULT NULL,
		  tombstone int DEFAULT '1',
		  extype int DEFAULT '1',
		  enabled int DEFAULT '1',
		  rootpath VARCHAR(200) DEFAULT NULL,
		  sno int DEFAULT NULL,
		  iconid int DEFAULT NULL,
		  companyid int DEFAULT NULL,
		  colorcode VARCHAR(50) DEFAULT NULL,
		  locked int DEFAULT NULL,
		  rootid int DEFAULT '0',
		  groupid int DEFAULT NULL,
		  initialdata tinyint(1) DEFAULT '0',
		  costcenterid int DEFAULT NULL,
		  insusergroupid int DEFAULT NULL,
		  inspectionplanid int DEFAULT NULL,
		  planstartdate text DEFAULT NULL,
		  planenddate text DEFAULT NULL,
		  pointordertype int DEFAULT NULL,
		  moordertype int DEFAULT NULL,
		  startdate text DEFAULT NULL,
		  enddate text DEFAULT NULL,
		  finisheduserid int DEFAULT NULL,
		  confirmuserid int DEFAULT NULL,
		  manhours decimal(12,4) DEFAULT NULL,
		  pointdocount int DEFAULT NULL,
		  operatingstatus tinyint(1) DEFAULT '0',
		  uploadstatus tinyint(1) DEFAULT '0'
	)`;

	DB.executeSql(sql, function() {
		console.log('巡检路线表创建成功');
		if (cb) cb();
	}, function(e) {
		console.log('巡检路线表创建失败');
		if (cbe) cbe(e);
	});
};

const createInspectionPointDo = function(cb, cbe) {
	let sql =
		`CREATE TABLE inspectionpointdo (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		keycode VARCHAR(50) NOT NULL,
		name VARCHAR(50) DEFAULT NULL,
		createdate text DEFAULT NULL,
		createuserid int DEFAULT NULL,
		modificationdate text DEFAULT NULL,
		modificationuserid int DEFAULT NULL,
		basestate int DEFAULT NULL,
		basetype int DEFAULT NULL,
		basepriority int DEFAULT NULL,
		stateid int DEFAULT '0',
		typeid int DEFAULT NULL,
		priorityid int DEFAULT NULL,
		orgid int DEFAULT NULL,
		orgkey VARCHAR(50) DEFAULT NULL,
		orgname VARCHAR(50) DEFAULT NULL,
		memo VARCHAR(1000) DEFAULT NULL,
		picpath VARCHAR(200) DEFAULT NULL,
		barcode VARCHAR(200) DEFAULT NULL,
		qrcode VARCHAR(200) DEFAULT NULL,
		tombstone int DEFAULT '1',
		extype int DEFAULT '1',
		enabled int DEFAULT '1',
		rootpath VARCHAR(200) DEFAULT NULL,
		sno int DEFAULT NULL,
		iconid int DEFAULT NULL,
		companyid int DEFAULT NULL,
		colorcode VARCHAR(50) DEFAULT NULL,
		locked int DEFAULT NULL,
		rootid int DEFAULT NULL,
		groupid int DEFAULT NULL,
		initialdata tinyint(1) DEFAULT '0',
		costcenterid int DEFAULT NULL,	
		inspectiondoid int NOT NULL,
		inspectionpointplanid int NOT NULL,
		moid int DEFAULT NULL,
		mokey VARCHAR(50) NOT NULL,
		moname VARCHAR(50) DEFAULT NULL,
		posid int DEFAULT NULL,
		poskey VARCHAR(50) DEFAULT NULL,
		posname VARCHAR(50) DEFAULT NULL,
		insusergroupid int DEFAULT NULL,
		checktype int(11) DEFAULT '1',
		checkuserid int(11) DEFAULT NULL,
		instrumentkey VARCHAR(50) DEFAULT NULL,
		instrumentname VARCHAR(50) DEFAULT NULL,
		executecycletype int DEFAULT NULL,
		executecyclevalue int DEFAULT NULL,
		fixedexecutecycle int DEFAULT NULL,
		jobstandard VARCHAR(1000) DEFAULT NULL,
		jobmethod VARCHAR(200) DEFAULT NULL,
		lowerlimitvalue decimal(12,4) DEFAULT NULL,
		upperlimitvalue decimal(12,4) DEFAULT NULL,
		oilqty decimal(12,4) DEFAULT NULL,
		planstartdate text DEFAULT NULL,
		planenddate text DEFAULT NULL,
		spkey VARCHAR(50) DEFAULT NULL,
		spname VARCHAR(50) DEFAULT NULL,
		spunitname VARCHAR(50) DEFAULT NULL,
		counterheaderkey VARCHAR(50) DEFAULT NULL,
		intervalcount int DEFAULT NULL,
		intervalcountnext int DEFAULT NULL,
		intervaldiscount int DEFAULT NULL,
		moorder int DEFAULT NULL,
		pointorder int DEFAULT NULL,
		rfid VARCHAR(50) DEFAULT NULL,
		operatingstatus tinyint(1) DEFAULT '0',
		uploadstatus tinyint(1) DEFAULT '0',
		description VARCHAR(1000) DEFAULT NULL,
		checkvalue decimal(12,4) DEFAULT NULL,
		checkdate text DEFAULT NULL,
		unitid int DEFAULT NULL,
		unitname VARCHAR(50) DEFAULT NULL,
		unitcode VARCHAR(50) DEFAULT NULL,
		storagelocation VARCHAR(50) DEFAULT NULL
	)`;

	DB.executeSql(sql, function() {
		console.log('巡检点表创建成功');
		if (cb) cb();
	}, function(e) {
		console.log('巡检点表创建失败');
		if (cbe) cbe(e);
	});
}

const createInspectionFiles = function(cb, cbe) {
	let sql =
		`CREATE TABLE inspectionfiles (  
		  id INTEGER PRIMARY KEY AUTOINCREMENT,  
		  inspectiondoid int DEFAULT NULL,  
		  inspectionpointdoid int DEFAULT NULL, 
		  filetype int DEFAULT NULL, 
		  filepath varchar(200) DEFAULT NULL,
		  type int DEFAULT NULL,
		  createdate text DEFAULT NULL,
		  createuserid int DEFAULT NULL,
		  modificationdate text DEFAULT NULL,
		  modificationuserid int DEFAULT NULL,
		  tombstone int DEFAULT NULL,
		  uploadstatus int default '0' 
		 );`;

	DB.executeSql(sql, function() {
		console.log('文件表创建成功');
		if (cb) cb();
	}, function(e) {
		console.log('文件表创建失败');
		if (cbe) cbe(e);
	});
}

const readyDB = function(cb, cbe) {
	DB.openDB([createInspectionDo, createInspectionPointDo, createInspectionFiles], function(res) {
		if (cb) cb(res)
	}, function(e) {
		if (cbe) cbe(e);
	});
}

// 批量插入巡检路线
const insertIntoInspectionDo = function(inspectiondoData, cb, cbe) {
	if (inspectiondoData.length === 0) return;
	let inspectiondoDataSql = '',
		inspectiondoColumnName = ['id', 'keycode', 'name', 'createdate', 'createuserid', 'modificationdate',
			'modificationuserid', 'basestate', 'basetype', 'basepriority', 'stateid', 'typeid', 'priorityid', 'orgid', 'memo',
			'picpath', 'barcode', 'qrcode', 'rootpath', 'sno', 'iconid', 'companyid',
			'colorcode', 'locked', 'rootid', 'groupid', 'initialdata', 'costcenterid', 'insusergroupid', 'inspectionplanid', 'planstartdate',
			'planenddate', 'pointordertype', 'moordertype', 'startdate', 'enddate', 'finisheduserid', 'confirmuserid'
		],
		resInspectiondoData = ['id', 'keyCode', 'name', 'createDate', 'createUserId', 'modificationDate',
			'modificationUserId', 'baseState', 'baseType', 'basePriority', 'stateId', 'typeId', 'priorityId', 'orgId', 'memo',
			'picPath', 'barCode', 'qrCode', 'rootPath', 'sno', 'iconId', 'companyId',
			'colorCode', 'locked', 'rootId', 'groupId', 'initialData', 'costCenterId', 'insUserGroupId', 'inspectionPlanId', 'planStartDate',
			'planEndDate', 'pointOrderType', 'moOrderType', 'startDate', 'endDate', 'finishedUserId', 'confirmUserId'
		];
	inspectiondoData.forEach(function(item, index) {
		let sqlStrBefore = (index === 0 ? ' select ' : ' union all select ');
		let sqlStrAfterAry = resInspectiondoData.map(function(columnItem, columnIndex) {
			return (!item[columnItem] && item[columnItem] !== 0) ? 'null' : `'${item[columnItem]}'`;
		})
		inspectiondoDataSql += (sqlStrBefore + sqlStrAfterAry.join(','));
	})
	let sql = `insert into inspectiondo(${inspectiondoColumnName.join(',')}) ${inspectiondoDataSql};`;

	DB.executeSql(sql, function() {
		if (cb) cb();
	}, function(e) {
		if (cbe) cbe(e);
	});
}

// 批量插入巡检点D
const insertInspectionpointDo = function(inspectionpointdoData, cb, cbe) {
	if (inspectionpointdoData.length === 0) return;
	let inspectionpointdoDataSql = '',
		inspectionpointdoColumnName = ['id', 'keycode', 'name', 'createdate', 'createuserid', 'modificationdate',
			'modificationuserid', 'basestate', 'basetype', 'basepriority', 'typeid', 'priorityid', 'orgid', 'orgkey', 'orgname', 'memo', 'picpath',
			'barcode', 'qrcode', 'rootpath', 'sno', 'iconid', 'companyid', 'colorcode',
			'locked', 'rootid', 'groupid', 'initialdata', 'costcenterid', 'inspectiondoid','inspectionpointplanid', 'mokey', 'moname', 'posid', 'poskey',
			'posname', 'insusergroupid', 'checktype', 'checkuserid', 'instrumentkey', 'instrumentname', 'executecycletype',
			'executecyclevalue', 'fixedexecutecycle', 'jobstandard', 'jobmethod', 'lowerlimitvalue', 'upperlimitvalue',
			'oilqty', 'planstartdate', 'planenddate', 'spkey', 'spname', 'spunitname', 'counterheaderkey', 'intervalcount',
			'intervalcountnext', 'intervaldiscount', 'moorder', 'pointorder', 'moid', 'rfid', 'unitid', 'unitname', 'unitcode', 'storagelocation'
		],
		resInspectiondoData = ['id', 'keyCode', 'name', 'createDate', 'createUserId', 'modificationDate',
			'modificationUserId', 'baseState', 'baseType', 'basePriority', 'typeId', 'priorityId', 'orgId', 'orgKey', 'orgName', 'memo', 'picPath',
			'barCode', 'qrCode', 'rootPath', 'sno', 'iconId', 'companyId', 'colorCode',
			'locked', 'rootId', 'groupId', 'initialData', 'costCenterId', 'inspectionDoId', 'inspectionPointPlanId', 'moKey', 'moName', 'posId', 'posKey',
			'posName', 'insUserGroupId', 'checkType', 'checkUserId', 'instrumentKey', 'instrumentName', 'executeCycleType',
			'executeCycleValue', 'fixedExecuteCycle', 'jobStandard', 'jobMethod', 'lowerLimitValue', 'upperLimitValue',
			'oilQty', 'planStartDate', 'planEndDate', 'spKey', 'spName', 'spUnitName', 'counterHeaderKey', 'intervalCount',
			'intervalCountNext', 'intervalDisCount', 'moOrder', 'pointOrder', 'moId', 'rfid', 'unitId', 'unitName', 'unitCode', 'storagelocation'
		];
	inspectionpointdoData.forEach(function(item, index) {
		let sqlStrBefore = (index === 0 ? ' select ' : ' union all select ');
		let sqlStrAfterAry = resInspectiondoData.map(function(columnItem, columnIndex) {
			return (!item[columnItem] && item[columnItem] !== 0) ? 'null' : `'${item[columnItem]}'`;
		})
		if(item.unitId) console.log("有测量单位=======================================")
		inspectionpointdoDataSql += (sqlStrBefore + sqlStrAfterAry.join(','));
	})
	let sql = `insert into inspectionpointdo(${inspectionpointdoColumnName.join(',')}) ${inspectionpointdoDataSql};`;

	DB.executeSql(sql, function() {
		if (cb) cb();
	}, function(e) {
		if (cbe) cbe(e);
	});
}

// 批量插入文件
const insertFile = function(insertFileData, cb, cbe) {
	if (insertFileData.length === 0) return;
	let insertFileSql = '',
		fileColumnName = ['id', 'inspectiondoid', 'inspectionpointdoid', 'filetype', 'filepath', 'type', 'createdate',
			'createuserid', 'modificationdate', 'modificationuserid', 'tombstone'
		];
	insertFileData.forEach(function(item, index) {
		let sqlStrBefore = (index === 0 ? ' select ' : ' union all select ');
		let sqlStrAfterAry = fileColumnName.map(function(columnItem, columnIndex) {
			return item[columnItem] === undefined ? 'null' : `'${item[columnItem]}'`;
		})
		insertFileSql += (sqlStrBefore + sqlStrAfterAry.join(','));
	})
	let sql = `insert into inspectionfiles(${fileColumnName.join(',')}) ${insertFileSql};`;

	DB.executeSql(sql, function() {
		if (cb) cb();
	}, function(e) {
		if (cbe) cbe(e);
	});
}

// 根据巡检点Id查询文件
const selectFileList = function(inspectionpointdoid, cb, cbe) {
	let sql =
		`SELECT * FROM
			inspectionfiles
		WHERE
			inspectionpointdoid = ${inspectionpointdoid};`;

	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}

// 根据ID删除文件
const deleteFile = function(fileid, cb, cbe) {
	let sql = `DELETE FROM inspectionfiles WHERE id = ${fileid};`;

	DB.executeSql(sql, function() {
		if (cb) cb();
	}, function(e) {
		if (cbe) cbe(e);
	});
}

//查询巡检路线任务
const selectInspectionDo = function(params = {}, cb, cbe) {
	const keywords = params.keywords ?  ` AND (inspectiondo.keycode like '%${params.keywords}%' OR inspectiondo.name like '%${params.keywords}%')` : '';
	const keycode = params.keycode ? ` AND inspectiondo.keycode = '${params.keycode}'` : '';
	const name = params.name ?  ` AND inspectiondo.name = '${params.name}'` : '';
	const startDate = params.startDate ? ` AND inspectionpointdo.planstartdate >= '${params.startDate}'` : '';
	const endDate = params.endDate ? ` AND inspectionpointdo.planstartdate <= '${params.endDate}'` : '';
	let sql =
		`SELECT inspectiondo.id,inspectiondo.keycode AS inspectionDoKeyCode, inspectiondo.name AS inspectionDoName,
			inspectiondo.createdate, COUNT(*) AS pointCount,MIN(inspectionpointdo.planstartdate) as minPlanStartDate,
			MAX(inspectionpointdo.planstartdate) as maxPlanStartDate,
			SUM(inspectionpointdo.operatingstatus) AS finishPointCount,
			(SELECT COUNT(*) 
			FROM (SELECT mokey,inspectiondoid 
					FROM inspectionpointdo 
					WHERE inspectionpointdo.uploadstatus != 1
					GROUP BY inspectiondoid,mokey
				) motable
			WHERE motable.inspectiondoid = inspectiondo.id) AS moCount,
			(SELECT COUNT(1) 
				FROM (SELECT COUNT(*) AS pointcount,SUM(operatingstatus) AS operatingcount,inspectiondoid
					FROM inspectionpointdo
					WHERE inspectionpointdo.uploadstatus != 1
					GROUP BY inspectiondoid,mokey
					HAVING pointcount = operatingcount) finishMoTable
			WHERE finishMoTable.inspectiondoid = inspectiondo.id) AS finishMoCount
		FROM
			inspectionpointdo
		LEFT JOIN inspectiondo ON inspectionpointdo.inspectiondoid = inspectiondo.id
		WHERE
			inspectionpointdo.uploadstatus != 1
		${keywords}${keycode}${name}${startDate}${endDate}
		GROUP BY
			inspectionpointdo.inspectiondoid
		ORDER BY 
			minPlanStartDate;`;
	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}

//根据路线任务id获取设备列表
const selectMoList = function(inspectionDoId, cb, cbe) {
	let sql =
		`SELECT
			inspectionpointdo.storagelocation,
			inspectionpointdo.inspectiondoid,
			inspectionpointdo.moid,
			inspectionpointdo.mokey,
			inspectionpointdo.moname,
			inspectionpointdo.posid,
			inspectionpointdo.poskey,
			inspectionpointdo.posname,
			inspectionpointdo.orgid,
			inspectionpointdo.orgkey,
			inspectionpointdo.orgname,
			inspectionpointdo.qrcode,
			count(*) AS moPointCount,
			sum(inspectionpointdo.operatingstatus) AS moOperatingCount,
			inspectionpointdo.rfid,
			inspectiondo.moordertype,
			max(inspectionpointdo.planstartdate) AS moMaxPlanStartDate
		FROM
			inspectionpointdo
			LEFT JOIN inspectiondo ON inspectionpointdo.inspectiondoid = inspectiondo.id
		WHERE
			inspectiondoid = ${inspectionDoId}
		AND inspectionpointdo.uploadstatus != 1
		GROUP BY
			inspectionpointdo.inspectiondoid,
			inspectionpointdo.mokey`;

	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}


const selectManhours = function(id, cb, cbe) {
	let sql = `select manhours from inspectiondo where id=${id}`;
	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}

//查询巡检点列表
const selectPointDoList = function(inspectionDoId, mokey, cb, cbe) {
	let sql =
		`SELECT
			inspectionpointdo.id,
			inspectionpointdo.keycode AS pointKeyCode,
			inspectionpointdo.name AS pointName,
			inspectionpointdo.inspectiondoid,
			inspectionpointdo.planstartdate,
			inspectionpointdo.checktype,
			inspectionpointdo.operatingstatus,
			inspectionpointdo.instrumentkey,
			inspectionpointdo.instrumentname,
			inspectionpointdo.upperlimitvalue,
			inspectionpointdo.lowerlimitvalue,
			inspectionpointdo.executecycletype,
			inspectionpointdo.executecyclevalue,
			inspectionpointdo.fixedexecutecycle,
			inspectionpointdo.jobstandard,
			inspectionpointdo.jobmethod,
			inspectionpointdo.oilqty,
			inspectionpointdo.pointorder,
			inspectionpointdo.typeid,
			inspectionpointdo.stateid,
			inspectionpointdo.memo,
			inspectionpointdo.description,
			inspectionpointdo.checkvalue,
			inspectionpointdo.checkdate,
			inspectionpointdo.unitid,
			inspectionpointdo.unitname,
			inspectionpointdo.unitcode
		FROM
			inspectionpointdo
		LEFT JOIN inspectiondo ON inspectiondo.id = inspectionpointdo.inspectiondoid
		WHERE
			inspectionpointdo.inspectiondoid = ${inspectionDoId}
		AND inspectionpointdo.mokey = '${mokey}'
		AND inspectionpointdo.uploadstatus != 1
		ORDER BY
			inspectionpointdo.sno IS NULL,
			inspectionpointdo.sno ASC,
			inspectionpointdo.id ASC;`;
	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
		
	}, function(e) {
		if (cbe) cbe(e);
	});
}

const updateSql = function(tableName, values, where, cb, cbe) {
	if (Object.prototype.toString.call(values) !== '[object Object]' && Object.prototype.toString.call(where) !==
		'[object Object]') return;
	const valuesAry = Object.keys(values).map(function(item) {
		return `${item}='${values[item]}'`;
	});
	const whereAry = Object.keys(where).map(function(item) {
		return `${item}='${where[item]}'`;
	});;

	const valuesSql = valuesAry.join(',');
	const whereSql = whereAry.join(' AND ');

	let sql = `UPDATE ${tableName} SET ${valuesSql} WHERE ${whereSql};`

	DB.executeSql(sql, function() {
		if (cb) cb();
	}, function(e) {
		if (cbe) cbe(e);
		uni.showModal({
			title: '提示',
			content: '数据更新失败'
		})
	});
}
// 获取路线的上传结果-- 上传用
const selectPointsByInspectionDoId = function(inspectionDoId, cb, cbe) {
	let sql =
		`select 
		   id AS inspectionPointDoId, keycode AS keyCode, name, basestate AS baseState, 
		   basetype AS baseType, basepriority AS basePriority, stateid AS stateId, 
		   typeid AS typeId, priorityid AS priorityId, orgid AS orgId, memo, description, 
		   picpath AS picPath, barcode AS barCode, qrcode AS qrCode, rootpath AS rootPath, sno, iconid AS iconId, companyid AS companyId, 
		   colorcode AS colorCode, locked, rootid AS rootId, groupid AS groupId, 
		   initialdata AS initialData, costcenterid AS costCenterId, moid AS moId, mokey AS moKey, moname AS moName, 
		   poskey AS posKey, posname AS posName, insusergroupid AS insUserGroupId, 
		   checktype AS checkType, checkuserid AS checkUserId, checkvalue AS checkValue, 
		   instrumentkey AS instrumentKey, instrumentname AS instrumentName, 
		   executecycletype AS executeCycleType, executecyclevalue AS executeCycleValue, fixedexecutecycle AS fixedExecuteCycle,
		   jobstandard AS jobStandard, jobmethod AS jobMethod, lowerlimitvalue AS lowerLimitValue, upperlimitvalue AS upperLimitValue, 
		   oilqty AS oilQty, planstartdate AS planStartDate, planenddate AS planEndDate,
		   spkey AS spKey, spname AS spName, spunitname AS spUnitName, counterheaderkey AS counterHeaderKey, 
		   intervalcount AS intervalCount, intervalcountnext AS intervalCountNext, intervaldiscount AS intervalDisCount,
		   moorder AS moOrder, pointorder AS pointOrder, checkdate AS checkDate, operatingstatus , uploadstatus,
		   inspectionpointplanid as inspectionPointPlanId, inspectiondoid as inspectionDoId
		from 
			inspectionpointdo 
		where 
			operatingstatus = 1 AND inspectionpointdo.uploadstatus = 0 and inspectiondoid = ${inspectionDoId};`;

	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}

// 获取路线的上传结果-- 查看用
const selectPointsResults = function(inspectionDoId, cb, cbe) {
	let sql =
		`select 
		   id, keycode, name AS pointName, basestate, 
		   basetype, basepriority, stateid, 
		   typeid, priorityid, orgid, memo, description, 
		   picpath, barcode, qrcode, rootpath, sno, iconid, companyid, 
		   colorcode, locked, rootid, groupid, 
		   initialdata, costcenterid, mokey, moname, 
		   poskey, posname, insusergroupid, 
		   checktype, checkuserid, checkvalue, 
		   instrumentkey, instrumentname, 
		   executecycletype, executecyclevalue, fixedexecutecycle,
		   jobstandard, jobmethod, lowerlimitvalue, upperlimitvalue, 
		   oilqty, planstartdate, planenddate,
		   spkey, spname, spunitname, counterheaderkey, 
		   intervalcount, intervalcountnext, intervaldiscount,
		   moorder, pointorder, checkdate, operatingstatus , uploadstatus, unitid, unitname, unitcode
		from 
			inspectionpointdo 
		where 
			operatingstatus = 1 AND inspectionpointdo.uploadstatus = 0 and inspectiondoid = ${inspectionDoId};`;

	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}

// 获取已修改路线
const selectInspectionHistory = function(cb, cbe) {
	let sql =
		`SELECT
	  inspectiondo.id,
	  inspectiondo.keycode AS inspectionDoKeyCode,
	  inspectiondo.NAME AS inspectionDoName,
	  inspectiondo.manhours,
	  COUNT(*) AS allCount,
	  SUM(
	   CASE
	   WHEN inspectionpointdo.stateid = 1 THEN
		1
	   ELSE
		0
	   END
	  ) AS normalCount,
	  SUM(
	   CASE
	   WHEN inspectionpointdo.stateid = 2 THEN
		1
	   ELSE
		0
	   END
	  ) AS abNormalCount,
	  (
	   SELECT
		COUNT(*)
	   FROM
		(
		 SELECT
		  mokey,
		  inspectiondoid
		 FROM
		  inspectionpointdo
		 WHERE operatingstatus = 1 AND inspectionpointdo.uploadstatus = 0
		 GROUP BY
		  inspectiondoid,
		  mokey
		) motable
	   WHERE
		motable.inspectiondoid = inspectiondo.id
	  ) AS moCount,
	  inspectiondo.createdate
	 FROM
	  inspectionpointdo
	 LEFT JOIN inspectiondo ON inspectionpointdo.inspectiondoid = inspectiondo.id
	 WHERE inspectionpointdo.operatingstatus = 1 AND inspectionpointdo.uploadstatus = 0 AND inspectiondo.manHours is not null
	 GROUP BY
  inspectionpointdo.inspectiondoid;`;

	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}

const dropInspectionTables = function(cb, cbe) {
	const dropTables = ['inspectiondo', 'inspectionpointdo', 'inspectionfiles'];
	const promiseDropTables = dropTables.map(function(tablesName, index) {
		return new Promise(function(resolve, reject) {
			DB.drop(tablesName, resolve, reject);
		})
	})

	Promise.all(promiseDropTables).then(function(result) {
		DB.closeDB(function() {
			if (cb) cb(result);
		});
	}).catch(function(error) {
		if (cbe) cbe(error);
		uni.showModal({
			title: '提示',
			content: '数据表删除失败'
		})
	})
}

// 查询需要上传的路线信息
const selectInspectionUpData= function (cb, cbe) {
 let sql = 
  `SELECT
   inspectiondo.id AS inspectionDoId,
   inspectiondo.keycode AS keyCode,
   inspectiondo.name,
   inspectiondo.basestate AS baseState,
   inspectiondo.basetype AS baseType,
   inspectiondo.basepriority AS basePriority,
   inspectiondo.stateid AS stateId,
   inspectiondo.typeid AS typeId,
   inspectiondo.priorityid AS priorityId,
   inspectiondo.orgid AS orgId,
   inspectiondo.memo,
   inspectiondo.picpath AS picPath,
   inspectiondo.barcode AS barCode,
   inspectiondo.qrcode AS qrCode,
   inspectiondo.sno,
   inspectiondo.iconid AS iconId,
   inspectiondo.companyid AS companyId,
   inspectiondo.colorcode AS colorCode,
   inspectiondo.locked,
   inspectiondo.rootid AS rootId,
   inspectiondo.groupid AS groupId,
   inspectiondo.initialdata AS initialData,
   inspectiondo.costcenterid AS costCenterId,
   inspectiondo.insusergroupid AS insUserGroupId,
   inspectiondo.inspectionplanid as inspectionPlanId,
   inspectiondo.planstartdate AS planStartDate,
   inspectiondo.planenddate AS planEndDate,
   inspectiondo.pointordertype AS pointOrderType,
   inspectiondo.moordertype AS moOrderType,
   inspectiondo.startdate AS startDate,
   inspectiondo.enddate AS endDate,
   inspectiondo.finisheduserid AS finishedUserId,
   inspectiondo.confirmuserid AS confirmUserId,
   inspectiondo.manhours AS manHours,
   inspectiondo.pointdocount AS pointDoCount
 FROM
  inspectionpointdo
 LEFT JOIN inspectiondo ON inspectionpointdo.inspectiondoid = inspectiondo.id
 WHERE inspectionpointdo.operatingstatus = 1 AND inspectionpointdo.uploadstatus = 0 AND inspectiondo.manHours is not null
 GROUP BY
  inspectionpointdo.inspectiondoid;`;
  
  DB.selectSql(sql, function(res) {
  	if (cb) cb(res);
  }, function(e) {
  	if (cbe) cbe(e);
  });
 }
 
 // 批量修改
const updateUploadstatus = function (tableName, ary, cb, cbe) {
	let idStr = ary.join(',');
	let sql = `UPDATE ${tableName} SET uploadstatus = 1 WHERE id in (${idStr});`
	
	DB.executeSql(sql, function() {
		if (cb) cb();
	}, function(e) {
		if (cbe) cbe(e);
	});
}

// 查询文件
const selectAllFile = function (cb, cbe) {
	let sql = 
	`SELECT
		id,
		inspectionpointdoid,
		filepath,
		createuserid
	FROM
		inspectionfiles
	WHERE
		uploadstatus = 0;`
	
	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}

const deleteRoute = function (routeId, cb, cbe) {
	let sql = `delete from inspectiondo where id in (${routeId});`
	
	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}

const deleteSkipMo = function(inspectionDoId, mokeys, cb, cbe) {
	let sql =
		`DELETE FROM inspectionpointdo WHERE inspectiondoid = ${inspectionDoId} AND inspectionpointdo.mokey IN (${mokeys})`;

	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}

const deletePointByInspec = function (routeId, cb, cbe) {
	let sql = `delete from inspectionpointdo where inspectiondoid in (${routeId});`
	
	DB.selectSql(sql, function(res) {
		if (cb) cb(res);
	}, function(e) {
		if (cbe) cbe(e);
	});
}

export {
	readyDB,
	insertIntoInspectionDo,
	insertInspectionpointDo,
	selectInspectionDo,
	selectMoList,
	selectPointDoList,
	selectManhours,
	dropInspectionTables,
	updateSql,
	insertFile,
	selectFileList,
	deleteFile,
	selectInspectionHistory,
	selectPointsByInspectionDoId,
	selectPointsResults,
	selectInspectionUpData,
	updateUploadstatus,
	selectAllFile,
	deleteRoute,
	deleteSkipMo,
	deletePointByInspec
}
