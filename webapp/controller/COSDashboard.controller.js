sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageToast, dataUtil, JSONModel) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.COSDashboard", {
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function () {
			var oModel = new JSONModel({});
			this.getView().setModel(oModel, "oPilotDashBoardModel");
			this.getRouter().getRoute("COSDashboard").attachPatternMatched(this._onObjectMatched, this);
		},
		//1.on click of create job button app navigates to create job 
		onPressCreateJob: function () {
			this.getRouter().navTo("CosCreateJob");
		},
		//2.on click of pending approvals it navigates to pending approvals
		onPressApprovals: function () {
			this.getRouter().navTo("Approvals");
		},
		//3.on click of view link on aircraft capabilities it navigates to aircraft capabilities
		onAircraftView: function () {
			this.getRouter().navTo("Limitations");
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function () {
			var PilotAcceptanceDetails = dataUtil.getDataSet("PilotAcceptanceDetails");
			this.getModel("oPilotDashBoardModel").setData(PilotAcceptanceDetails);
		}
	});
});