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
		//-------------------------------------------------------------
		//   Function: onInit
		//   Parameter: NA 
		//   Description: Internal method to initialize View dataUtil .
		//-------------------------------------------------------------
		onInit: function() {
			try {
				// var that = this,
				// 	model = dataUtil.createJsonModel("model/aircraftTransfer.json");
				// that.getView().setModel(model, "oViewModel");
				this.getRouter().getRoute("SortieMonitoring").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in SortieMonitoring:onInit function");

			}

		},
		/* Function: onClickSortieDetails
		 * Parameter:
		 * Description: This is called to navigate sortie detail screen
		 */
		onClickSortieDetails: function(oEvent) {
			try {
				var oObj = oEvent.getSource().getBindingContext("SortiMaster").getObject();
				this.getRouter().navTo("SortieDetails", {
					JobId: oObj.JOBID,
					SORNO: oObj.SORNO
				});
			} catch (e) {
				Log.error("Exception in SortieMonitoring:onClickSortieDetails function");

			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		/* Function: _fnSortieMonitoringMasterGet
		 * Parameter:
		 * Description: This is called to retreive sortie items
		 */
		_fnSortieMonitoringMasterGet: function() {
			try {
				var that = this,
					oPrmTD = {};
				oPrmTD.filter = "TAILID eq " + that.getTailId() + " AND FLAG EQ M";
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						var aData = [];
						for (var i in oData.results) {
							aData[i] = oData.results[i];
							var temp = oData.results[i].SCRCNT.split("@");
							aData[i].SCRCNT = temp[0];
							aData[i].SCRTEXT = temp[1];
						}
						oModel.setData(aData);
						that.getView().setModel(oModel, "SortiMaster");
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETSORTIAISVC"), oPrmTD);
			} catch (e) {
				Log.error("Exception in SortieMonitoring:_fnSortieMonitoringMasterGet function");

			}
		},
		// ***************************************************************************
		//                 3. Private Methods   
		// ***************************************************************************\
		/* Function: _onObjectMatched
		 * Parameter:
		 * Description: This will called to handle route matched.
		 */
		_onObjectMatched: function(oEvent) {
			try {
				this._fnSortieMonitoringMasterGet();
			} catch (e) {
				Log.error("Exception in SortieMonitoring:_onObjectMatched function");

			}
		}

	});
});