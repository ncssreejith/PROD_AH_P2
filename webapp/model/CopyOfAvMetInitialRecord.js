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
						"aircap": "",
						"airid": "AIR_10",
						"begda": "",
						"capid": "",
						"credt": "",
						"credtm": "",
						"cretm": "",
						"creusr": "",
						"creuzt": "",
						"deaid": "",
						"dupli": "",
						"endda": "",
						"esref": "",
						"etrdt": "",
						"etrtm": "",
						"factby": "",
						"factdtm": "",
						"factuzt": "",
						"fchar": "",
						"fndby": "",
						"fndid": "",
						"fr_no": "",
						"frelby": "",
						"freldtm": "",
						"freluzt": "",
						"fstat": "",
						"jduid": "",
						"jduvl": "",
						"jobdesc": "",
						"jobid": "",
						"jobty": "",
						"jobty2": "",
						"jstat": "",
						"mark": "",
						"modid": "MOD_1",
						"notity": "",
						"num2": "",
						"othtrd": "",
						"partty": "",
						"photo": "",
						"prime": "",
						"rectdt": "",
						"recttm": "",
						"recttxt": "",
						"recur": "",
						"remarks": "",
						"rjobid": "",
						"schreq": "",
						"sg1dtm": "",
						"sg1usr": "",
						"sg1uzt": "",
						"sg2dtm": "",
						"sg2usr": "",
						"sg2uzt": "",
						"sorno": "",
						"srvid": "SRV_10",
						"srvtid": "1234",
						"stdtm": "",
						"strike": "",
						"stusr": "",
						"stuzt": "",
						"symbol": "",
						"tailid": "333",
						"trail": ""
					};
					oArray.push(CREATEJOB);
					break;
				case "ADDLimit":
					var ADDSet = {
						"apprdtm": "",
						"apprusr": "",
						"appruzt": "",
						"begda": "",
						"capdt": "",
						"capid": "",
						"captm": "",
						"capty": "D",
						"cprid": "",
						"cstat": "",
						"defpd": "",
						"defvl": "",
						"dmdid": "",
						"endda": "",
						"expdt": "",
						"exptm": "",
						"extend": "",
						"jobid": "JOB_202006269909012",
						"ldesc": "",
						"oppr": "noKey",
						"rcapid": "",
						"rectdtm": "",
						"rectusr": "",
						"rectuzt": "",
						"remarks": "",
						"strect": "",
						"subdtm": "",
						"subusr": "",
						"subuzt": "",
						"tailid": "3333",
						"taskid": "",
						"util1": "",
						"util2": "",
						"utilvl": ""
					};
					oArray.push(ADDSet);
			}
			return oArray;
		}
	};

});