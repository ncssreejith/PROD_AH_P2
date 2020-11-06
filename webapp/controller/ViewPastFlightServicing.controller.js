sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil, Log) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAJAT GUPTA 
	 *   Control name: ViewPastFlightServicing          
	 *   Purpose : Sortie monitoring functionality
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onSignOffPress
	 *     2. Backend Calls
	 *        2.1 fnLogById
	 *     3. Private calls
	 *        3.1 _onObjectMatched
	 *        3.2 fnSetReason
	 *   Note :
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.ViewPastFlightServicing", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("ViewPastFlightServicing").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in ViewPastFlightServicing:onInit function");
				this.handleException(e);
			}

		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onClickFlightServicingDetails: function(oEvent) {
			try {
				var oObj = oEvent.getSource().getBindingContext("ViewPastFlightServicingModel").getObject();
				this.getRouter().navTo("UpdateFlightServicing", {
					srvid: oObj.SRVTID,
					srv_id: oObj.SRVID
				});
			} catch (e) {
				Log.error("Exception in ViewPastFlightServicing:onClickFlightServicingDetails function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		_fnGetViewPastFlightServicing: function() {
			try {
				var that = this,
					oPrmTD = {};
				oPrmTD.filter = "TAIL_ID eq " + that.getTailId();
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						// var aData = [];
						// for (var i in oData.results) {
						// 	aData[i] = oData.results[i];
						// 	var temp = oData.results[i].SCRCNT.split("@");
						// 	aData[i].SCRCNT = temp[0];
						// 	aData[i].SCRTEXT = temp[1];
						// }
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "ViewPastFlightServicingModel");
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETSERVICEDTLSVC"), oPrmTD);
			} catch (e) {
				Log.error("Exception in ViewPastFlightServicing:_fnGetViewPastFlightServicing function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 3. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				this._fnGetViewPastFlightServicing();
			} catch (e) {
				Log.error("Exception in ViewPastFlightServicing:_onObjectMatched function");
				this.handleException(e);
			}
		}

	});
});