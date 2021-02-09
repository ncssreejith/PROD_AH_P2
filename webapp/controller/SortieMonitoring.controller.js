sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log",
	"../util/ajaxutilNew",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil, Log, ajaxutilNew, FilterOpEnum) {
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
		//Rahul: 13/11/2020: 11:55AM: Function Description added .
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
				var oSortiDialog = this.openDialog("SortieDetailDialog", ".fragments.standalone.sortimonitoring.");
				var oObj = oEvent.getSource().getBindingContext("SortiMaster").getObject();
				var sPath = oEvent.getSource().getBindingContext("SortiMaster").getPath();
				oSortiDialog.bindElement({
					path: sPath,
					model: "SortiMaster"
				});
				this._fnSortieMonitoringDetailsGet(oObj.jobid, oObj.sorno);
			} catch (e) {
				Log.error("Exception in onClickSortieDetails function");
			}
		},
		onSortieDetailsClose: function() {
			try {
				this.closeDialog("SortieDetailDialog");
			} catch (e) {
				Log.error("Exception in onSortieDetailsClose function");
			}
		},

		_fnSortieMonitoringDetailsGet: function(sJobId, sSORNO) {
			try {
				var oPrmTD = {};
				//	oPrmTD.filter = "TAILID eq " + this.getTailId() + " AND FLAG EQ D AND JOBID EQ " + sJobId + " AND SORNO EQ " + sSORNO;
				oPrmTD.filter = "TAILID" + FilterOpEnum.EQ + this.getTailId() + "&FLAG" + FilterOpEnum.EQ + "D&JOBID" + FilterOpEnum.EQ + sJobId +
					"&SORNO" + FilterOpEnum.EQ + sSORNO;
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					this.getView().setModel(oModel, "SortiDetails");
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETSORTIAISVC"), oPrmTD);
			} catch (e) {
				Log.error("Exception in _fnSortieMonitoringDetailsGet function");
			}
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		/* Function: _fnSortieMonitoringMasterGet
		 * Parameter:
		 * Description: This is called to retreive sortie items
		 */
		//Rahul: 13/11/2020: 11:55AM: Function Description added .
		_fnSortieMonitoringMasterGet: function() {
			try {
				var that = this,
					oPrmTD = {};
				//	oPrmTD.filter = "TAILID eq " + that.getTailId() + " AND FLAG EQ M";
				oPrmTD.filter = "TAILID" + FilterOpEnum.EQ + that.getTailId() + "&SFLAG" + FilterOpEnum.EQ + "M";
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "SortiMaster");
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("PILOTSORTI"), oPrmTD);
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
		//Rahul: 13/11/2020: 11:55AM: Comment added .
		_onObjectMatched: function(oEvent) {
			try {
				this._fnSortieMonitoringMasterGet();
			} catch (e) {
				Log.error("Exception in SortieMonitoring:_onObjectMatched function");

			}
		}

	});
});