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
						"aircap": null,
						"airid": "AIR_10",
						"begda": null,
						"capid": null,
						"credt": null,
						"credtm": null,
						"cretm": null,
						"creusr": null,
						"creuzt": null,
						"deaid": null,
						"dupli": null,
						"endda": null,
						"esref": null,
						"etrdt": null,
						"etrtm": null,
						"factby": null,
						"factdtm": null,
						"factuzt": null,
						"fchar": null,
						"fndby": null,
						"fndid": null,
						"fr_no": null,
						"frelby": null,
						"freldtm": null,
						"freluzt": null,
						"fstat": null,
						"jduid": null,
						"jduvl": null,
						"jobdesc": null,
						"jobid": null,
						"jobty": null,
						"jobty2": null,
						"jstat": null,
						"mark": null,
						"modid": "MOD_1",
						"notity": null,
						"num2": null,
						"othtrd": null,
						"partty": null,
						"photo": null,
						"prime": null,
						"rectdt": null,
						"recttm": null,
						"recttxt": null,
						"recur": null,
						"remarks": null,
						"rjobid": null,
						"schreq": null,
						"sg1dtm": null,
						"sg1usr": null,
						"sg1uzt": null,
						"sg2dtm": null,
						"sg2usr": null,
						"sg2uzt": null,
						"sorno": null,
						"srvid": "SRV_10",
						"srvtid": "1234",
						"stdtm": null,
						"strike": null,
						"stusr": null,
						"stuzt": null,
						"symbol": null,
						"tailid": "333",
						"trail": null
					};
					oArray.push(CREATEJOB);
					break;
				case "ADDLimit":
					var ADDSet = {
						"apprdtm": null,
						"apprusr": "",
						"appruzt": null,
						"begda": null,
						"capdt": null,
						"capid": "",
						"captm": null,
						"capty": "D",
						"cprid": "",
						"cstat": "",
						"defpd": "",
						"defvl": "",
						"dmdid": "",
						"endda": null,
						"expdt": null,
						"exptm": null,
						"extend": "",
						"jobid": "JOB_202006269909012",
						"ldesc": "",
						"oppr": "noKey",
						"rcapid": "",
						"rectdtm": null,
						"rectusr": "",
						"rectuzt": null,
						"remarks": "",
						"strect": "",
						"subdtm": null,
						"subusr": "",
						"subuzt": null,
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