sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../util/ajaxutilNew",
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

				var oPayload = this.getModel("oRectModel").getProperty("/");
				
				this._fnEncodeFair(oPayload);
				var oParameter = {};
				oParameter.activity = 4;
				oParameter.error = function() {};
				oParameter.success = function() {
					this.onNavBack();
				}.bind(this);
				ajaxutil.fnUpdate(this.getResourceBundle().getText("PILOTDEFECTF16SVC"), oParameter, oPayload, "ZRM_AC_U", this);
				this._fnDecodeFair(oPayload);
			} catch (e) {
				Log.error("Exception in ReleaseForRectification:onSignOffPress function");
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
				var sPath = this.getResourceBundle().getText("PILOTDEFECTF16SVC");
				// + this.getModel("oRectModel").getProperty("/logid") + "/" + this.getTailId() + "/TABA_102";
				var oParameter = {};
				oParameter.filter = "tailid=" + this.getTailId() + "&SRVTID=" + this.getModel("avmetModel").getProperty("/dash/SRVTID");
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					// var currentTime = new Date();
					var oObject = oData.results.length > 0 ? oData.results : [];
					this._fnDecodeFair(oObject);
					// oObject.forEach(function(oItem) {
					// 	oItem.bFair = (oItem.fair === "Y");
					// });
					this.getModel("oRectModel").setProperty("/", oObject);
					// this.getModel("oRectModel").setProperty("/record/Date", currentTime);
					this.getModel("oRectModel").refresh(true);
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in ReleaseForRectification:fnLogById function");
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
				var utilData = [];
				// utilData.bFair

				this.getView().setModel(new JSONModel(utilData), "oRectModel");

				this.getModel("oRectModel").refresh(true);
				this.fnGetRect();
			} catch (e) {
				Log.error("Exception in ReleaseForRectification:_onObjectMatched function");
				this.handleException(e);
			}
		},
		_fnDecodeFair: function(aPayload) {
			try {
				aPayload.forEach(function(oItem) {
					oItem.bFair = (oItem.fair === "Y");
				});
			} catch (e) {
				Log.error("Exception in ReleaseForRectification:_fnDecodeFair function");
				this.handleException(e);
			}
		},
		_fnEncodeFair: function(aPayload) {
			try {
				aPayload.forEach(function(oItem) {
					oItem.fair = oItem.bFair ? "Y" : "N";
					delete oItem.bFair;
				});
			} catch (e) {
				Log.error("Exception in ReleaseForRectification:_fnDecodeFair function");
				this.handleException(e);
			}
		}

	});
});