sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
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

		//-------------------------------------------------------------
		//   Function: onInit
		//   Parameter: NA 
		//   Description: Internal method to initialize View dataUtil .
		//-------------------------------------------------------------
		//Rahul: 13/11/2020: 11:55AM: Function Description added .
		onInit: function() {
			try {
				this.getRouter().getRoute("SortieDetails").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in SortieDetails:onInit function");

			}

		},

		//-------------------------------------------------------------
		//   Function: onNavBackSortie
		//   Parameter: NA 
		//   Description: This is called to navigate to show details of selected sortie .
		//-------------------------------------------------------------
		//Rahul: 13/11/2020: 11:55AM: Function Description added .
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

		//-------------------------------------------------------------
		//   Function: _fnSortieMonitoringHeaderGet
		//   Parameter: sJobId, sSORNO 
		//   Description: This is called to get sortie Header data.
		//-------------------------------------------------------------
		//Rahul: 13/11/2020: 11:55AM: Function Description added .
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
				ajaxutil.fnRead(this.getResourceBundle().getText("GETSORTIAISVC"), oPrmTD);
			} catch (e) {
				Log.error("Exception in SortieDetails:_fnSortieMonitoringHeaderGet function");

			}
		},

		//-------------------------------------------------------------
		//   Function: _fnSortieMonitoringDetailsGet
		//   Parameter: sJobId, sSORNO 
		//   Description: This is called to get sortie details Item data.
		//-------------------------------------------------------------
		//Rahul: 13/11/2020: 11:55AM: Function Description added .
		_fnSortieMonitoringDetailsGet: function(sJobId, sSORNO) {
			try {
				var that = this,
					oPrmTD = {};
						var oModel = dataUtil.createNewJsonModel(); //Rahul: 08/12/2020:04:51Pm Model declaration moved to Start
				oPrmTD.filter = "TAILID eq " + that.getTailId() + " AND FLAG EQ D AND JOBID EQ " + sJobId + " AND SORNO EQ " + sSORNO;
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					//Rahul: 08/12/2020:04:51Pm =Model Data assignment changed---Start
					if (oData !== undefined && oData.results.length > 0) {
					  oModel.setData(oData.results);
					}else{
						oModel.setData(null);
					}
					//Rahul: 08/12/2020: 04:51Pm =Model Data assignment changed---End
					that.getView().setModel(oModel, "SortiDetails");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETSORTIAISVC"), oPrmTD);
			} catch (e) {
				Log.error("Exception in SortieDetails:_fnSortieMonitoringDetailsGet function");

			}
		},
		//Rahul: 13/11/2020: 11:55AM: Function Description added .
		/* Function: _onObjectMatched
		 * Parameter:
		 * Description: This will called to handle route matched.
		 */
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