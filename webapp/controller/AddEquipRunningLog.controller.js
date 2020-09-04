sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log",
	"../util/cvUtil"
], function(BaseController, dataUtil, ajaxutil, formatter, JSONModel, Log,cvUtil) {
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
	return BaseController.extend("avmet.ah.controller.AddEquipRunningLog", {
		formatter: formatter,
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************		
		onInit: function() {
			try {
				this.getRouter().getRoute("AddEquipRunLog").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in AddEquipRunningLog:onInit function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		//  This will update Aircraft log after signoff
		//-------------------------------------------------------------
		onSignOffPress: function() {
			try {
				if (this.fnCheckValueState("AddEquipRunningLog")) {
					sap.m.MessageToast.show("Fill in all required input first");
					return;
				}
				var oPayload = this.getModel("oAircraftAddModel").getProperty("/record");
				oPayload.COL_11 = this.formatter.defaultDateTimeFormat(oPayload.Date);
				delete oPayload.time;
				var oParameter = {};
				oParameter.activity = 2;
				oParameter.error = function() {};
				oParameter.success = function() {
					this.onNavBack();
				}.bind(this);
				ajaxutil.fnCreate("/AircraftLogSvc", oParameter, [oPayload], "ZRM_AC_U", this);
			} catch (e) {
				Log.error("Exception in AddEquipRunningLog:onSignOffPress function");
				this.handleException(e);
			}
		},
		onLiveChange: function(oEvent){
			cvUtil.onLiveChange(oEvent, false);
		},
		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		//-------------------------------------------------------------
		//  This will load aircraft log data
		//-------------------------------------------------------------		
		fnLogById: function() {
			try {
				// oParameter.filter = "logid eq " + this.getModel("oAircraftAddModel").setProperty("/logid");
				var sPath = "/AircraftLogSvc/" + this.getModel("oAircraftAddModel").getProperty("/logid") + "/" + this.getTailId() + "/TABA_102";
				var oParameter = {};
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					var currentTime = new Date();
					this.getModel("oAircraftAddModel").setProperty("/record", oData.results.length > 0 ? oData.results[oData.results.length - 1] : {});
					// this.getModel("oAircraftAddModel").setProperty("/record/COL_11", currentTime);
					// this.getModel("oAircraftAddModel").setProperty("/record/time", this.formatter.defaultDateTimeFormat(currentTime, "HH:mm"));
					this.getModel("oAircraftAddModel").setProperty("/record/Date", currentTime);
					this.getModel("oAircraftAddModel").refresh(true);
					this.fnSetReason();
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in AddEquipRunningLog:fnLogById function");
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
				var utilData = {};
				utilData.type = 0;
				utilData.logid = 0;
				utilData.record = {
					Date: new Date()
				};
				utilData.today = new Date();
				utilData.today.setHours(23, 59, 59);
				this.getView().setModel(new JSONModel(utilData), "oAircraftAddModel");
				
				this.getModel("oAircraftAddModel").setProperty("/type", oEvent.getParameter("arguments").type);
				this.getModel("oAircraftAddModel").setProperty("/logid", oEvent.getParameter("arguments").logid);
				this.fnClearValueState("AddEquipRunningLog");
				this.getModel("oAircraftAddModel").refresh(true);
				this.fnLogById();
			} catch (e) {
				Log.error("Exception in AddEquipRunningLog:_onObjectMatched function");
				this.handleException(e);
			}
		},
		/** 
		 * Check for function group error state
		 * @param sFunctionGroupId
		 * @returns
		 */
		fnCheckValueState: function(sFunctionGroupId) {
			try {
			var aGroupControls = sap.ui.getCore().byFieldGroupId(sFunctionGroupId);
			var bError = false;
			aGroupControls.forEach(function(oControl) {
				if (oControl.getValueState() === "Error") {
					bError = true;
				}
			});
			return bError;
			} catch (e) {
				Log.error("Exception in fnCheckValueState function");
				this.handleException(e);
			}
		},
		/** 
		 * Clear for function group error state
		 * @param sFunctionGroupId
		 * @returns
		 */
		fnClearValueState: function(sFunctionGroupId) {
			try {
			var aGroupControls = sap.ui.getCore().byFieldGroupId(sFunctionGroupId);
			
			aGroupControls.forEach(function(oControl) {
				oControl.setValueState("None");
			});
			return;
			} catch (e) {
				Log.error("Exception in fnClearValueState function");
				this.handleException(e);
			}
		},
		/** 
		 * Update reason text
		 */
		fnSetReason: function() {
			try {
				var sReasonTxt = "";
				switch (this.getModel("oAircraftAddModel").getProperty("/type")) {
					case "0":
						sReasonTxt = this.getResourceBundle().getText("EngineChange1");
						break;
					case "1":
						sReasonTxt = this.getResourceBundle().getText("EngineChange2");
						break;
					case "2":
						sReasonTxt = this.getResourceBundle().getText("APUChange");
						break;
					case "3":
						sReasonTxt = this.getResourceBundle().getText("txtUpdateALQ144");
						break;
				}
				this.getModel("oAircraftAddModel").setProperty("/record/COL_18", sReasonTxt);
				this.getModel("oAircraftAddModel").refresh();
			} catch (e) {
				Log.error("Exception in AddEquipRunningLog:fnSetReason function");
				this.handleException(e);
			}
		}

	});
});