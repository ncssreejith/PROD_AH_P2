sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function(DateFormat) {
	"use strict";

	return {
		createInitialBlankRecord: function(oKey) {
			var oArray = [];
			switch (oKey) {
				case "CREATEJOB":
					var CREATEJOB = {
						"jobid": "",
						"tailid": "",
						"endda": "",
						"begda": "",
						"jobty": "NA",
						"jstat": "",
						"jobty2": "",
						"strike": "",
						"rjobid": "",
						"fr_no": "",
						"sorno": "",
						"num2": "",
						"capid": "",
						"jobdesc": "",
						"credt": "",
						"cretm": "",
						"creusr": "",
						"credtm": "",
						"creuzt": "",
						"photo": "",
						"deaid": "NA",
						"mark": "",
						"fndid": "",
						"prime": "",
						"symbol": "0",
						"jduid": "",
						"jduvl": "",
						"stusr": "",
						"stdtm": "",
						"stuzt": "",
						"partty": "",
						"notity": "",
						"aircap": "",
						"etrdt": "",
						"etrtm": "",
						"fstat": "",
						"factby": "",
						"factdtm": "",
						"factuzt": "",
						"frelby": "",
						"freldtm": "",
						"freluzt": "",
						"fndby": "Test User",
						"othtrd": "",
						"rectdt": "",
						"recttm": "",
						"recttxt": "",
						"recur": "",
						"dupli": "",
						"trail": "",
						"fchar": "",
						"schreq": "",
						"remarks": "",
						"ptext": "",
						"jdutxt": "",
						"modid": "",
						"airid": "",
						"DOCREFID": "",
						"airhrs": "", //26/01/2020: Added new field
						"TRAILKEY": "",
						"TRAILKVAL": "",
						"TRAILKDT": "",
						"fstatflag": "",
						"ETRFLAG": "",
						"FAIRNR": "",
						"ZINTERVAL": 0,
						"INTERVAL": 0,
						"SG1USR": "",
						"SG1DTM": "",
						"SG1UZT": "",
						"SG2USR": "",
						"SG2DTM": "",
						"SG2UZT": "",
						"SERNR": ""
					};
					oArray.push(CREATEJOB);
					break;
				case "NewTask":
					var oTask = {
						'taskid': "",
						'tailid': "",
						'ttid': "",
						'tstat': 'C',
						'rtstat': 'X',
						'jobid': "",
						'srvid1': "",
						'tmpid': "",
						'rtaskid': "",
						'fragid': "",
						'nosum': "",
						'srvid2': "",
						'wrctr': "",
						'tt1id': "",
						'tt2id': "",
						'tt3id': "",
						'tt4id': "",
						'credtm': "",
						'creuzt': "",
						'creusr': 'Test Uuser',
						'chkfor': "",
						'indarea': "",
						'tdesc': "",
						'symbol': "",
						'toref': "",
						'isser': "",
						'sernr': "",
						'ismat': "",
						'partno': "",
						'cdesc': "",
						'otherss': "",
						'itemno': "",
						'ftt1id': "",
						'ftdesc': "",
						'ftcredt': "",
						'ftcretm': "",
						'ftfind': "",
						'fttoref': "",
						'ftsernr': "",
						'ftitemno': "",
						'ftcdesc': "",
						'ftothers': "",
						'ftchkfor': "",
						'multi': "",
						'ktask': "",
						'sg1dtm': "",
						'sg1uzt': "",
						'sg1usr': "",
						'sg2dtm': "",
						'sg2uzt': "",
						'sg2usr': "",
						'capid': "",
						'ldesc': "",
						'srvtid': "",
						'stepid': "",
						'ftrsltgd': "",
						'engflag': "",
						"errormsg": "",
						"objectid": "",
						"activity": "",
						"RTTY": "",
						"ENTINERR": "",
						"RECTSTAR": "",
						"PRESERNR": ""

					};
					oArray.push(oTask);
					break;
				case "ADDLimit":
					var ADDSet = {
						"JOBID": "",
						"FNDBY": "Test User",
						"FNDURING": "",
						"CAPID": "",
						"TAILID": "",
						"CAPTY": "",
						"ENDDA": "",
						"BEGDA": "",
						"CSTAT": "",
						"TASKID": "",
						"EXTEND": "",
						"RCAPID": "",
						"LDESC": "",
						"CAPDT": "",
						"CAPTM": "23:59",
						"SUBUSR": "",
						"SUBDTM": "",
						"SUBUZT": "",
						"CPRID": "",
						"DMDID": "",
						"OPPR": "N",
						"DEFPD": "",
						"DEFVL": "",
						"EXPDT": "",
						"EXPTM": "",
						"UTIL1": "",
						"UTIL2": "",
						"UTILVL": "",
						"REMARKS": "",
						"APPRUSR": "",
						"APPRDTM": "",
						"APPRUZT": "",
						"RECTUSR": "",
						"RECTDTM": "",
						"RECTUZT": "",
						"JOBDESC": "",
						"FLAG_JT": "",
						"FLAG_ADD": "",
						"OTHER_RSN": "",
						"PAST_ADDS": "",
						"COUNT": "",
						"LOGINUSER": "",
						"PAST_COUNT": "",
						"UTILDT": ""
					};
					oArray.push(ADDSet);
					break;
				case "SCHJob":
					var SCHJobData = {
						"ESJOBID": "",
						"TAILID": "",
						"AIRID": "",
						"MODID": "",
						"JOBTY": "",
						"DUEIN": "",
						"ENGNO": "",
						"UM": "",
						"SERVDUE": "",
						"SERVDT": "",
						"JOBDESC": "",
						"CTYPE": "NA",
						"TYPE2": "NA",
						"PN": "",
						"SN": "",
						"PRIME": "",
						"WRCTR": "",
						"J_FLAG": "",
						"FLAG": "",
						"CREDT": "",
						"CRETM": "",
						"CDESC": "",
						"UMKEY": "",
						"SCONFLAG": "",
						"ZINTERVAL": 0,
						"INTERVAL": 0

					};
					oArray.push(SCHJobData);
					break;
				case "ToolTip":
					var ToolTip = [{
						"id": "JOB",
						"TTi18N": "ttJobs"
					}, {
						"id": "FR",
						"TTi18N": "ttFR"
					}, {
						"id": "SORT",
						"TTi18N": "ttSortMon"
					}, {
						"id": "RI",
						"TTi18N": "ttResImp"
					}, {
						"id": "TRM",
						"TTi18N": "ttTrialMod"
					}, {
						"id": "ITEMNO",
						"TTi18N": "ttItemNo"
					}, {
						"id": "DSCT",
						"TTi18N": "ttDescribeTask"
					}, {
						"id": "COMPDESC",
						"TTi18N": "ttCompDesc"
					}, {
						"id": "CHEKON",
						"TTi18N": "ttCheckonArea"
					}, {
						"id": "FIND",
						"TTi18N": "ttFindings"
					}, {
						"id": "RECTSUM",
						"TTi18N": "ttRectificationSummary"
					}, {
						"id": "REASONADD",
						"TTi18N": "ttReasonForAdd"
					}, {
						"id": "DMANDNO",
						"TTi18N": "ttDemandNo"
					}, {
						"id": "OTHERREASON",
						"TTi18N": "ttOtherReason"
					}, {
						"id": "PERIODOFDEFER",
						"TTi18N": "ttPeriodofDeferment"
					}, {
						"id": "LIMITATION",
						"TTi18N": "ttLimitation"
					}, {
						"id": "LIMITATIONTASK",
						"TTi18N": "ttLimitationTask"
					}, {
						"id": "TASKTYPE",
						"TTi18N": "tttaskType"
					}, {
						"id": "SERIALNO",
						"TTi18N": "ttSerialNo"
					}, {
						"id": "PARTNO",
						"TTi18N": "ttPartNo"
					}, {
						"id": "TASKDESC",
						"TTi18N": "tttaskDesc"
					}, {
						"id": "TOOLQUAN",
						"TTi18N": "tttoolquan"
					}, {
						"id": "PUBQUAN",
						"TTi18N": "ttpubquan"
					}, {
						"id": "WRKCTR",
						"TTi18N": "ttWorkCenter"
					}, {
						"id": "LOADPT",
						"TTi18N": "ttLoadingPoint"
					}, {
						"id": "SORTAM",
						"TTi18N": "ttSortMonAM"
					}];
					oArray.push(ToolTip);
					break;
			}
			return oArray;
		}
	};

});