sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../util/ajaxutil",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, ajaxutil, formatter, JSONModel, Log, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *	 Developer : Teck Meng
	 *   Control name: AddEquipRunningLog           
	 *   Purpose : Add Equipment running log dialog controller
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *		1.2 onSignOffPress
	 *	 2. Backend Calls
	 *		2.1 fnLogById
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *		3.2 fnSetReason
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.AddEngCyclicLog", {
		formatter: formatter,
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************		
		onInit: function() {
			try {
				this.getRouter().getRoute("AddEngCyclicLog").attachPatternMatched(this._onObjectMatched, this);

			} catch (e) {
				Log.error("Exception in AddEngCyclicLog:onInit function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		//  This will update Aircraft log after signoff
		//-------------------------------------------------------------
		onSignOffPress: function() {
			try {
				var oPayload = this.getModel("oAddEngCycLogModel").getProperty("/");
				var sStepid = this.getModel("oViewModel").getProperty("/stepid");
				if (sStepid === "S_CL") { //Teck Meng change on 07/12/2020 13:00 AH Issue 1044,1043
					oPayload.FLAG = "D";
				}
				if (sStepid === "S_AD") {
					oPayload.FLAG = "A";
				}
				if (sStepid === "S_ED") {
					oPayload.FLAG = "E";
				}
				if (sStepid === "S_RE") {
					oPayload.FLAG = "R";
				}
				// oPayload.FLAG = this.getModel("oViewModel").getProperty("/stepid") === "S_CL" ? "D" : "X"; //Teck Meng change on 07/12/2020 13:00 AH Issue 1044,1043//Teck Meng change on 26/11/2020 13:00 AH Issue 1044,1043
				var aPayload = [oPayload];
				//If engine 2 installed
				var sEng1Id = oPayload.ENGID;
				var sEng2Id = this.getModel("oAddEng2CycLogModel").getProperty("/ENGID");
				if (sEng2Id && sEng2Id !== sEng1Id) {
					var oTemp = this.getModel("oAddEng2CycLogModel").getProperty("/");
					oTemp.FLAG = oPayload.FLAG;
					// oTemp.FLAG = this.getModel("oViewModel").getProperty("/stepid") === "S_CL" ? "D" : "X"; //Teck Meng change on 07/12/2020 13:00 AH Issue 1044,1043//Teck Meng change on 26/11/2020 13:00 AH Issue 1044,1043
					aPayload.push(oTemp);
				}
				var oParameter = {};
				oParameter.activity = 2;
				oParameter.error = function() {};
				oParameter.success = function() {
					this.onNavBack();
				}.bind(this);
				ajaxutil.fnCreate(this.getResourceBundle().getText("EHSERSVC"), oParameter, aPayload, "ZRM_E_CYCL", this);
			} catch (e) {
				Log.error("Exception in AddEngCyclicLog:onSignOffPress function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		/** 
		 * Get Engine Cyclic life data
		 * @constructor 
		 * @param sEngID
		 * @param iEngine
		 */
		_getEngCyclicLife: function(sEngID, iEngine) {
			try {
				var sLOGID = this.getModel("oViewModel").getProperty("/LOGID"); //Teck Meng change on 07/12/2020 13:00 AH Issue 1044,1043
				var sLogIdPath = "",
					sPath;
				if (sLOGID) {
					sLogIdPath = "&LOGID" + FilterOpEnum.EQ + sLOGID;
				}
				// var sFLAG = "L";
				// if (sStepid === "S_CL") {//Teck Meng change on 07/12/2020 13:00 AH Issue 1044,1043
				// 	sFLAG = "L";
				// }
				var
					oParameter = {};
				oParameter.error = function() {};
				sPath = "FLAG" + FilterOpEnum.EQ + "A&TAILID" + FilterOpEnum.EQ + this.getTailId() + "&ENGID" + FilterOpEnum.EQ +
					sEngID;
				if (sLOGID) {
					oParameter.filter = sPath + sLogIdPath; //Teck Meng change on 07/12/2020 13:00 AH Issue 1044,1043
				} else {
					oParameter.filter = sPath;
				}
				oParameter.success = function(oData) {
					if (oData && oData.results.length) {
						//sort by date
						oData.results.forEach(function(oItem) {
							oItem.ID = this.fnDateTime(oItem.CREDTM, oItem.CREUZT); //, 
						}.bind(this));
						oData.results.sort(function(a, b) {
							return new Date(b.ID).getTime() - new Date(a.ID).getTime();
						});
						var oObject = oData.results[0];
						delete oObject.ID;
						oObject.LAST = this.last;
						// if (this.last !== "X") { //Add
						// 	oObject.minINDEX1 = oObject.INDEX1 ? parseInt(JSON.parse(JSON.stringify(oObject.INDEX1))) : 0;
						// 	oObject.minLCF1 = oObject.LCF1 ? parseInt(JSON.parse(JSON.stringify(oObject.LCF1))) : 0;
						// 	oObject.minLCF2 = oObject.LCF2 ? parseInt(JSON.parse(JSON.stringify(oObject.LCF2))) : 0;
						// 	oObject.minENGHR = oObject.ENGHR ? parseInt(JSON.parse(JSON.stringify(oObject.ENGHR))) : 0;
						// } else { //Reset
						// 	oObject.minINDEX1 = 0;
						// 	oObject.minLCF1 = 0;
						// 	oObject.minLCF2 = 0;
						// 	oObject.minENGHR = 0;
						// 	oObject.INDEX1 = 0;
						// 	oObject.LCF1 = 0;
						// 	oObject.LCF2 = 0;
						// 	oObject.ENGHR = 0;
						// }
						if (iEngine === 1) {
							var oEngineModel = this.getView().getModel("oAddEngCycLogModel");
						} else {
							oEngineModel = this.getView().getModel("oAddEng2CycLogModel");
						}
						oEngineModel.setProperty("/", oObject);
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("EHSERSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in Engine:_getEngCyclicLife function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//     2. Private Functions
		// ***************************************************************************
		//-------------------------------------------------------------
		//  On page load
		//-------------------------------------------------------------		
		_onObjectMatched: function(oEvent) {
			try {
				var utilData = {
					"FLAG": "",
					"SRVID": "",
					"TAILID": "",
					"ENGNO": "",
					"ENDDA": "",
					"BEGDA": "",
					"ENGID": "",
					"CHKRN": "",
					"TEMP": "",
					"BPRESS": "",
					"TGTTAB": "",
					"TGTIND": "",
					"TGTDIFF": "",
					"XSTAT": "",
					"ULIMIT": "",
					"LLIMIT": "",
					"NG": "",
					"TQACT": "",
					"EFT": "",
					"ASPEED": "",
					"NP": "",
					"LOGID": "",
					"LAST": "",
					"LCF1": "",
					"LCF2": "",
					"INDEX1": "",
					"ENGHR": "",
					"TLCF1": "",
					"TLCF2": "",
					"TINDEX": "",
					"TENGHR": "",
					"TIMEI": "",
					"CREUSR": "",
					"CREDTM": "",
					"CREUZT": "",
					"SGUZT": "" //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
				};
				var utilData2 = {
					"FLAG": "",
					"SRVID": "",
					"TAILID": "",
					"ENGNO": "",
					"ENDDA": "",
					"BEGDA": "",
					"ENGID": "",
					"CHKRN": "",
					"TEMP": "",
					"BPRESS": "",
					"TGTTAB": "",
					"TGTIND": "",
					"TGTDIFF": "",
					"XSTAT": "",
					"ULIMIT": "",
					"LLIMIT": "",
					"NG": "",
					"TQACT": "",
					"EFT": "",
					"ASPEED": "",
					"NP": "",
					"LOGID": "",
					"LAST": "",
					"LCF1": "",
					"LCF2": "",
					"INDEX1": "",
					"ENGHR": "",
					"TLCF1": "",
					"TLCF2": "",
					"TINDEX": "",
					"TENGHR": "",
					"TIMEI": "",
					"CREUSR": "",
					"CREDTM": "",
					"CREUZT": "",
					"SGUZT": "" //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
				};
				// utilData.type = 0;
				// utilData.logid = 0;
				// utilData.record = {
				// 	Date: new Date()
				// };
				// utilData.today = new Date();
				// utilData.today.setHours(23,59,59);
				this.last = oEvent.getParameter("arguments").last;
				//Engine 1
				this.getView().setModel(new JSONModel(utilData), "oAddEngCycLogModel");
				this.getView().setModel(new JSONModel({}), "oViewModel"); //Teck Meng change on 26/11/2020 13:00 AH Issue 1044,1043
				var eng1Id = oEvent.getParameter("arguments").engid;
				this.getModel("oAddEngCycLogModel").setProperty("/ENGID", eng1Id);
				this.getModel("oAddEngCycLogModel").setProperty("/TAILID", oEvent.getParameter("arguments").tailid);
				this.getModel("oAddEngCycLogModel").setProperty("/LAST", oEvent.getParameter("arguments").last);
				this.getModel("oViewModel").setProperty("/LOGID", oEvent.getParameter("arguments").LOGID);
				this.getModel("oViewModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid); //Teck Meng change on 26/11/2020 13:00 AH Issue 1044,1043
				this.getModel("oAddEngCycLogModel").refresh(true);
				//Engine 2
				this.getView().setModel(new JSONModel(utilData2), "oAddEng2CycLogModel");
				var eng2Id = oEvent.getParameter("arguments").eng2id;
				this.getModel("oAddEng2CycLogModel").setProperty("/ENGID", eng2Id !== " " ? eng2Id : "");
				this.getModel("oAddEng2CycLogModel").setProperty("/TAILID", oEvent.getParameter("arguments").tailid);
				this.getModel("oAddEng2CycLogModel").setProperty("/LAST", oEvent.getParameter("arguments").last);
				this.getModel("oAddEng2CycLogModel").refresh(true);
				if (eng1Id) {
					this._getEngCyclicLife(eng1Id, 1);
				}
				if (eng2Id !== " ") { //Teck Meng change on 07/12/2020 13:00 AH Issue 1044,1043
					this._getEngCyclicLife(eng2Id, 2);
				}
				// this.fnLogById();
			} catch (e) {
				Log.error("Exception in AddEngCyclicLog:_onObjectMatched function");
				this.handleException(e);
			}
		},
		fnDateTime: function(sDate, sTime) {
			if (!sDate) {
				return " ";
			}
			if (!sTime) {
				return sDate;
			}
			return sDate + " " + sTime;
		}

	});
});