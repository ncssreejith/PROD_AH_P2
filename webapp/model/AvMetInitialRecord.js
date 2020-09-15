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
						"endda": null,
						"begda": null,
						"jobty": "NA",
						"jstat": "",
						"jobty2": null,
						"strike": null,
						"rjobid": null,
						"fr_no": null,
						"sorno": null,
						"num2": null,
						"capid": null,
						"jobdesc": "",
						"credt": null,
						"cretm": null,
						"creusr": null,
						"credtm": null,
						"creuzt": null,
						"photo": "",
						"deaid": "NA",
						"mark": "",
						"fndid": "",
						"prime": "",
						"symbol": "0",
						"jduid": "",
						"jduvl": "",
						"stusr": null,
						"stdtm": null,
						"stuzt": null,
						"partty": null,
						"notity": null,
						"aircap": null,
						"etrdt": null,
						"etrtm": null,
						"fstat": null,
						"factby": null,
						"factdtm": null,
						"factuzt": null,
						"frelby": null,
						"freldtm": null,
						"freluzt": null,
						"fndby": "Test User",
						"othtrd": null,
						"rectdt": null,
						"recttm": null,
						"recttxt": null,
						"recur": "",
						"dupli": null,
						"trail": null,
						"fchar": null,
						"schreq": null,
						"remarks": null,
						"ptext": null,
						"jdutxt": null,
						"modid": null,
						"airid": null,
						"DOCREFID": null,
						"airhrs": null,
						"TRAILKEY": null,
						"TRAILKVAL": null,
						"TRAILKDT": null,
						"fstatflag": null
					};
					oArray.push(CREATEJOB);
					break;
				case "NewTask":
					var oTask = {
						'taskid': null,
						'tailid': null,
						'ttid': null,
						'tstat': 'C',
						'rtstat': 'X',
						'jobid': null,
						'srvid1': null,
						'tmpid': null,
						'rtaskid': null,
						'fragid': null,
						'nosum': null,
						'srvid2': null,
						'wrctr': null,
						'tt1id': null,
						'tt2id': null,
						'tt3id': null,
						'tt4id': null,
						'credtm': null,
						'creuzt': null,
						'creusr': 'Test Uuser',
						'chkfor': null,
						'indarea': null,
						'tdesc': null,
						'symbol': null,
						'toref': null,
						'isser': null,
						'sernr': null,
						'ismat': null,
						'partno': null,
						'cdesc': null,
						'otherss': null,
						'itemno': null,
						'ftt1id': null,
						'ftdesc': null,
						'ftcredt': null,
						'ftcretm': null,
						'ftfind': null,
						'fttoref': null,
						'ftsernr': null,
						'ftitemno': null,
						'ftcdesc': null,
						'ftothers': null,
						'ftchkfor': null,
						'multi': null,
						'ktask': null,
						'sg1dtm': null,
						'sg1uzt': null,
						'sg1usr': null,
						'sg2dtm': null,
						'sg2uzt': null,
						'sg2usr': null,
						'capid': null,
						'ldesc': null,
						'srvtid': null,
						'stepid': null,
						'ftrsltgd': null,
						'engflag': null

					};
					oArray.push(oTask);
					break;
				case "ADDLimit":
					var ADDSet = {
						"JOBID": null,
						"FNDBY": "Test User",
						"FNDURING": null,
						"CAPID": null,
						"TAILID": null,
						"CAPTY": null,
						"ENDDA": null,
						"BEGDA": null,
						"CSTAT": null,
						"TASKID": null,
						"EXTEND": null,
						"RCAPID": null,
						"LDESC": null,
						"CAPDT": null,
						"CAPTM": null,
						"SUBUSR": null,
						"SUBDTM": null,
						"SUBUZT": null,
						"CPRID": null,
						"DMDID": null,
						"OPPR": "N",
						"DEFPD": null,
						"DEFVL": null,
						"EXPDT": null,
						"EXPTM": null,
						"UTIL1": null,
						"UTIL2": null,
						"UTILVL": null,
						"REMARKS": null,
						"APPRUSR": null,
						"APPRDTM": null,
						"APPRUZT": null,
						"RECTUSR": null,
						"RECTDTM": null,
						"RECTUZT": null,
						"JOBDESC": null,
						"FLAG_JT": null,
						"FLAG_ADD": null,
						"OTHER_RSN": null,
						"PAST_ADDS": null,
						"COUNT": null,
						"LOGINUSER": null,
						"PAST_COUNT": null,
						"UTILDT": null
					};
					oArray.push(ADDSet);
					break;
				case "SCHJob":
					var SCHJobData = {
						"ESJOBID": null,
						"TAILID": null,
						"AIRID": null,
						"MODID": null,
						"JOBTY": null,
						"DUEIN": null,
						"ENGNO": null,
						"UM": null,
						"SERVDUE": null,
						"SERVDT": null,
						"JOBDESC": null,
						"CTYPE": "NA",
						"TYPE2": "NA",
						"PN": null,
						"SN": null,
						"PRIME": null,
						"WRCTR": null,
						"J_FLAG": null,
						"FLAG": null,
						"CREDT": null,
						"CRETM": null,
						"CDESC": null,
						"UMKEY": null,
						"SCONFLAG": null
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