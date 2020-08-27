sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
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
				if(this.getModel("oAddEng2CycLogModel").getProperty("/ENGID")){
					var oTemp = this.getModel("oAddEng2CycLogModel").getProperty("/");
					aPayload.push(oTemp);
				}
				var oParameter = {};
				oParameter.activity = 2;
				oParameter.error = function() {};
				oParameter.success = function() {
					this.onNavBack();
				}.bind(this);
				ajaxutil.fnCreate("/EHSERSvc", oParameter, aPayload, "ZRM_E_CYCL", this);
			} catch (e) {
				Log.error("Exception in AddEngCyclicLog:onSignOffPress function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		//-------------------------------------------------------------
		//  This will load aircraft log data
		//-------------------------------------------------------------		
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
				//Engine 1
				this.getView().setModel(new JSONModel(utilData), "oAddEngCycLogModel");
				this.getModel("oAddEngCycLogModel").setProperty("/ENGID", oEvent.getParameter("arguments").engid);
				this.getModel("oAddEngCycLogModel").setProperty("/TAILID", oEvent.getParameter("arguments").tailid);
				this.getModel("oAddEngCycLogModel").setProperty("/LAST", oEvent.getParameter("arguments").last);
				this.getModel("oAddEngCycLogModel").refresh(true);
				//Engine 2
				this.getView().setModel(new JSONModel(utilData2), "oAddEng2CycLogModel");
				this.getModel("oAddEng2CycLogModel").setProperty("/ENGID", oEvent.getParameter("arguments").eng2id);
				this.getModel("oAddEng2CycLogModel").setProperty("/TAILID", oEvent.getParameter("arguments").tailid);
				this.getModel("oAddEng2CycLogModel").setProperty("/LAST", oEvent.getParameter("arguments").last);
				this.getModel("oAddEng2CycLogModel").refresh(true);
				// this.fnLogById();
			} catch (e) {
				Log.error("Exception in AddEngCyclicLog:_onObjectMatched function");
				this.handleException(e);
			}
		}

	});
});