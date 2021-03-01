sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../util/ajaxutil",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log",
	"../util/cvUtil",
	"../util/FilterOpEnum"
], function(BaseController, dataUtil, ajaxutil, formatter, JSONModel, Log, cvUtil, FilterOpEnum) {
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
				oPayload.COL_11 = this.formatter.defaultDateTimeFormat(oPayload.Date,"yyyy-MM-dd HH:mm:sss");
				oPayload.COL_18 = this.getModel("oAircraftAddModel").getProperty("/type");
				oPayload.refid = this.getAircraftId();
				delete oPayload.time;
				var oParameter = {};
				oParameter.activity = 4;
				oParameter.error = function() {};
				oParameter.success = function() {
					this.onNavBack();
				}.bind(this);
				
			switch(this.mode){
				case "0":
					ajaxutil.fnCreate(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter, [oPayload], "ZRM_AC_U", this);
					break;
				case "1":
					oPayload.logid = this.getModel("oAircraftAddModel").getProperty("/logid");
					ajaxutil.fnUpdate(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter, [oPayload], "ZRM_AC_U", this);
					break;
			}

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
		fnLogById: function() {
			try {
				var sPath = this.getResourceBundle().getText("AIRCRAFTLOGSVC");

				// var sPath = "/AircraftLogSvc/" + this.getModel("oAircraftAddModel").getProperty("/logid") + "/" + this.getTailId() + "/TABA_102";
				var oParameter = {};
				oParameter.filter = "logid" + FilterOpEnum.EQ + this.getModel("oAircraftAddModel").getProperty("/logid") +
						FilterOpEnum.AND + "tailid" + FilterOpEnum.EQ + this.getTailId() + 
						FilterOpEnum.AND + "tailid" + FilterOpEnum.EQ + this.getTailId() + 
						FilterOpEnum.AND + "tabid" + FilterOpEnum.EQ +"TABA_102"+
						FilterOpEnum.AND+"OTYPE"+ FilterOpEnum.EQ +this.getModel("oAircraftAddModel").getProperty("/type");
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					var currentTime = new Date();
					var oObject = oData.results.length > 0 ? oData.results[oData.results.length - 1] : {};
					oObject.minCOL_13 = oObject.COL_13 ? +parseFloat(JSON.parse(JSON.stringify(oObject.COL_13))).toFixed(2) : 0;
					oObject.minCOL_14 = oObject.COL_14 ? +parseFloat(JSON.parse(JSON.stringify(oObject.COL_14))).toFixed(2) : 0;
					oObject.minCOL_15 = oObject.COL_15 ? +parseFloat(JSON.parse(JSON.stringify(oObject.COL_15))).toFixed(2) : 0;
					oObject.minCOL_16 = oObject.COL_16 ? +parseFloat(JSON.parse(JSON.stringify(oObject.COL_16))).toFixed(2) : 0;
					oObject.minCOL_17 = oObject.COL_17 ? +parseFloat(JSON.parse(JSON.stringify(oObject.COL_17))).toFixed(2) : 0;
					oObject.minCOL_18 = oObject.COL_18 ? +parseFloat(JSON.parse(JSON.stringify(oObject.COL_18))).toFixed(2) : 0;
					this.getModel("oAircraftAddModel").setProperty("/record", oObject);
					// this.getModel("oAircraftAddModel").setProperty("/record/COL_18", this.getModel("oAircraftAddModel").getProperty("/type"));
					this.getModel("oAircraftAddModel").setProperty("/record/Date", currentTime);
					this.getModel("oAircraftAddModel").refresh(true);
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
				
				this.mode = oEvent.getParameter("arguments").mode;
				
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
					if (oControl.setValueState && oControl.getValueState() === "Error") {
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
					if (oControl.setValueState) {
						oControl.setValueState("None");
					}
				});
				return;
			} catch (e) {
				Log.error("Exception in fnClearValueState function");
				this.handleException(e);
			}
		}
	});
});