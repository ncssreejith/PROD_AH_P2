sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log",
	"../util/cvUtil"
], function(BaseController, dataUtil, ajaxutil, formatter, JSONModel, Log, cvUtil) {
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
	return BaseController.extend("avmet.ah.controller.ReleaseForRectification", {
		formatter: formatter,
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************		
		onInit: function() {
			try {
				this.getRouter().getRoute("ReleaseForRectification").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in ReleaseForRectification:onInit function");
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
				var oPayload = this.getModel("oRectModel").getProperty("/");
				oPayload.fair = oPayload.fair ? "Y" : "N";
				// delete oPayload.time;
				var oParameter = {};
				oParameter.activity = 4;
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
		onLiveChange: function(oEvent) {
			cvUtil.onLiveChange(oEvent, false);
		},
		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		//-------------------------------------------------------------
		//  This will load aircraft log data
		//-------------------------------------------------------------		
		fnGetRect: function() {
			try {
				var sPath = "/PilotDefectF16Svc";
				// + this.getModel("oRectModel").getProperty("/logid") + "/" + this.getTailId() + "/TABA_102";
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and SRVTID eq " + this.getModel("avmetModel").getProperty(
						"/dash/SRVTID");
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					// var currentTime = new Date();
					var oObject = oData.results.length > 0 ? oData.results : [];
					this.getModel("oRectModel").setProperty("/", oObject);
					// this.getModel("oRectModel").setProperty("/record/Date", currentTime);
					this.getModel("oRectModel").refresh(true);
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
				this.getView().setModel(new JSONModel(utilData), "oRectModel");

				// this.getModel("oRectModel").setProperty("/type", oEvent.getParameter("arguments").type);
				// this.getModel("oRectModel").setProperty("/logid", oEvent.getParameter("arguments").logid);
				// this.fnClearValueState("AddEquipRunningLog");
				this.getModel("oRectModel").refresh(true);
				this.fnGetRect();
			} catch (e) {
				Log.error("Exception in AddEquipRunningLog:_onObjectMatched function");
				this.handleException(e);
			}
		}
		

	});
});