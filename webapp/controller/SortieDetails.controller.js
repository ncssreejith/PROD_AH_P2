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
	 *   Control name: SortieMonitoring          
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
	return BaseController.extend("avmet.ah.controller.SortieDetails", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("SortieDetails").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in SortieDetails:onInit function");
				
			}

		},
		onNavBackSortie: function() {
			try {
				this.getRouter().navTo("SortieMonitoring");
			} catch (e) {
				Log.error("Exception in SortieDetails:onNavBackSortie function");
				
			}
		},
		// ***************************************************************************
		//                 2.  Private Methods  
		// ***************************************************************************
		_fnSortieMonitoringHeaderGet: function(sJobId, sSORNO) {
			try {
				var that = this,
					oPrmTD = {};
				oPrmTD.filter = "TAILID eq " + that.getTailId() + " AND FLAG EQ H AND JOBID EQ " + sJobId + " AND SORNO EQ " + sSORNO;
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results[0]);
						that.getView().setModel(oModel, "SortiHeader");
					}
				}.bind(this);
				ajaxutil.fnRead("/GetSortiAISvc", oPrmTD);
			} catch (e) {
				Log.error("Exception in SortieDetails:_fnSortieMonitoringHeaderGet function");
				
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_fnSortieMonitoringDetailsGet: function(sJobId, sSORNO) {
			try {
				var that = this,
					oPrmTD = {};
				oPrmTD.filter = "TAILID eq " + that.getTailId() + " AND FLAG EQ D AND JOBID EQ " + sJobId + " AND SORNO EQ " + sSORNO;
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "SortiDetails");
					}
				}.bind(this);
				ajaxutil.fnRead("/GetSortiAISvc", oPrmTD);
			} catch (e) {
				Log.error("Exception in SortieDetails:_fnSortieMonitoringDetailsGet function");
				
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_onObjectMatched: function(oEvent) {
			try {
				var sJobId = oEvent.getParameters("").arguments.JobId;
				var sSORNO = oEvent.getParameters("").arguments.SORNO;
				this._fnSortieMonitoringHeaderGet(sJobId, sSORNO);
				this._fnSortieMonitoringDetailsGet(sJobId, sSORNO);
			} catch (e) {
				Log.error("Exception in SortieDetails:_onObjectMatched function");
				
			}
		}

	});
});