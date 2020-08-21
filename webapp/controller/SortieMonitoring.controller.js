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
	return BaseController.extend("avmet.ah.controller.SortieMonitoring", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				// var that = this,
				// 	model = dataUtil.createJsonModel("model/aircraftTransfer.json");
				// that.getView().setModel(model, "oViewModel");
				this.getRouter().getRoute("SortieMonitoring").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in SortieMonitoring:onInit function");
				this.handleException(e);
			}

		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onClickSortieDetails: function(oEvent) {
			try {
				var oObj = oEvent.getSource().getBindingContext("SortiMaster").getObject();
				this.getRouter().navTo("SortieDetails", {
					JobId: oObj.JOBID,
					SORNO: oObj.SORNO
				});
			} catch (e) {
				Log.error("Exception in SortieMonitoring:onClickSortieDetails function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		_fnSortieMonitoringMasterGet: function() {
			try {
				var that = this,
					oPrmTD = {};
				oPrmTD.filter = "TAILID eq " + that.getTailId() + " AND FLAG EQ M";
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "SortiMaster");
					}
				}.bind(this);
				ajaxutil.fnRead("/GetSortiAISvc", oPrmTD);
			} catch (e) {
				Log.error("Exception in SortieMonitoring:_fnSortieMonitoringMasterGet function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 3. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				this._fnSortieMonitoringMasterGet();
			} catch (e) {
				Log.error("Exception in SortieMonitoring:_onObjectMatched function");
				this.handleException(e);
			}
		}

	});
});