sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../util/ajaxutil",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, dataUtil, ajaxutil, formatter, JSONModel, Log) {
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
				var aPayload = [oPayload];
				//If engine 2 installed
				var sEng1Id = oPayload.ENGID;
				var sEng2Id = this.getModel("oAddEng2CycLogModel").getProperty("/ENGID");
				if (sEng2Id && sEng2Id !== sEng1Id) {
					var oTemp = this.getModel("oAddEng2CycLogModel").getProperty("/");
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
				var
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "FLAG eq L and TAILID eq " + this.getTailId() + " and ENGID eq " + sEngID;
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
						if (this.last !== "X") { //Add
							oObject.minINDEX1 = oObject.INDEX1 ? parseInt(JSON.parse(JSON.stringify(oObject.INDEX1))) : 0;
							oObject.minLCF1 = oObject.LCF1 ? parseInt(JSON.parse(JSON.stringify(oObject.LCF1))) : 0;
							oObject.minLCF2 = oObject.LCF2 ? parseInt(JSON.parse(JSON.stringify(oObject.LCF2))) : 0;
							oObject.minENGHR = oObject.ENGHR ? parseInt(JSON.parse(JSON.stringify(oObject.ENGHR))) : 0;
						} else { //Reset
							oObject.minINDEX1 = 0;
							oObject.minLCF1 = 0;
							oObject.minLCF2 = 0;
							oObject.minENGHR = 0;
							oObject.INDEX1 = 0;
							oObject.LCF1 = 0;
							oObject.LCF2 = 0;
							oObject.ENGHR = 0;
						}
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
					"FLAG": null,
					"SRVID": null,
					"TAILID": null,
					"ENGNO": null,
					"ENDDA": null,
					"BEGDA": null,
					"ENGID": null,
					"CHKRN": null,
					"TEMP": null,
					"BPRESS": null,
					"TGTTAB": null,
					"TGTIND": null,
					"TGTDIFF": null,
					"XSTAT": null,
					"ULIMIT": null,
					"LLIMIT": null,
					"NG": null,
					"TQACT": null,
					"EFT": null,
					"ASPEED": null,
					"NP": null,
					"LOGID": null,
					"LAST": null,
					"LCF1": null,
					"LCF2": null,
					"INDEX1": null,
					"ENGHR": null,
					"TLCF1": null,
					"TLCF2": null,
					"TINDEX": null,
					"TENGHR": null,
					"TIMEI": null,
					"CREUSR": null,
					"CREDTM": null,
					"CREUZT": null
				};
				var utilData2 = {
					"FLAG": null,
					"SRVID": null,
					"TAILID": null,
					"ENGNO": null,
					"ENDDA": null,
					"BEGDA": null,
					"ENGID": null,
					"CHKRN": null,
					"TEMP": null,
					"BPRESS": null,
					"TGTTAB": null,
					"TGTIND": null,
					"TGTDIFF": null,
					"XSTAT": null,
					"ULIMIT": null,
					"LLIMIT": null,
					"NG": null,
					"TQACT": null,
					"EFT": null,
					"ASPEED": null,
					"NP": null,
					"LOGID": null,
					"LAST": null,
					"LCF1": null,
					"LCF2": null,
					"INDEX1": null,
					"ENGHR": null,
					"TLCF1": null,
					"TLCF2": null,
					"TINDEX": null,
					"TENGHR": null,
					"TIMEI": null,
					"CREUSR": null,
					"CREDTM": null,
					"CREUZT": null
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
				var eng1Id = oEvent.getParameter("arguments").engid;
				this.getModel("oAddEngCycLogModel").setProperty("/ENGID", eng1Id);
				this.getModel("oAddEngCycLogModel").setProperty("/TAILID", oEvent.getParameter("arguments").tailid);
				this.getModel("oAddEngCycLogModel").setProperty("/LAST", oEvent.getParameter("arguments").last);
				this.getModel("oAddEngCycLogModel").refresh(true);
				//Engine 2
				this.getView().setModel(new JSONModel(utilData2), "oAddEng2CycLogModel");
				var eng2Id = oEvent.getParameter("arguments").eng2id;
				this.getModel("oAddEng2CycLogModel").setProperty("/ENGID", eng2Id);
				this.getModel("oAddEng2CycLogModel").setProperty("/TAILID", oEvent.getParameter("arguments").tailid);
				this.getModel("oAddEng2CycLogModel").setProperty("/LAST", oEvent.getParameter("arguments").last);
				this.getModel("oAddEng2CycLogModel").refresh(true);
				if (eng1Id) {
					this._getEngCyclicLife(eng1Id, 1);
				}
				if (eng2Id) {
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