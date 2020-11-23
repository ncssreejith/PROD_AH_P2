sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"sap/ui/model/json/JSONModel"
], function (BaseController, dataUtil, Fragment, FieldValidations, JSONModel) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for handling Add Flying requirement.            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.MassLimitation", {
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function () {
			var oModel = new JSONModel({
				sAddReason: "noKey",
				bDateSection: false,
				bUtilisationSection: false,
				bLimitationSection: false,
				bPrdOfDefermentDesc: false,
				bDemandNo: false,
				bOtherReason: false,
				sUtilKey: "",
				bAirFrameAndTAC: false,
				bScheduleService: false,
				bPhaseService: false,
				bLimitation: false,
				bAddLimitationBtn: true
			});
			this.getView().setModel(oModel, "oViewModel");
			//this.getRouter().getRoute("TransfertoAdd").attachPatternMatched(this._onObjectMatched, this);
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		//1.on change of reason type 
		onReasonTypeChange: function (oEvent) {
			var oViewModel = this.getModel("oViewModel"),
				sSelectedKey = oEvent.getSource().getSelectedKey();
			if (sSelectedKey === "Date") {
				oViewModel.setProperty("/bDateSection", true);
				oViewModel.setProperty("/bUtilisationSection", false);
			} else if (sSelectedKey === "Utilisation") {
				oViewModel.setProperty("/bDateSection", false);
				oViewModel.setProperty("/bUtilisationSection", true);
				oViewModel.setProperty("/sUtilKey", "");
				oViewModel.setProperty("/bAirFrameAndTAC", false);
				oViewModel.setProperty("/bScheduleService", false);
				oViewModel.setProperty("/bPhaseService", false);
			} else if (sSelectedKey === "Both") {
				oViewModel.setProperty("/bDateSection", true);
				oViewModel.setProperty("/bUtilisationSection", true);
			}
			oViewModel.setProperty("/bLimitationSection", true);
			oViewModel.setProperty("/bLimitation", false);
			oViewModel.setProperty("/bAddLimitationBtn", true);
		},
		//2.on change of utilisation type
		onUilisationChange: function (oEvent) {
			var oViewModel = this.getModel("oViewModel"),
				sSelectedKey = oEvent.getSource().getSelectedKey();
			if (sSelectedKey === "Air Frame Hours" || sSelectedKey === "TAC") {
				oViewModel.setProperty("/bAirFrameAndTAC", true);
				oViewModel.setProperty("/bScheduleService", false);
				oViewModel.setProperty("/bPhaseService", false);
			} else if (sSelectedKey === "Next Scheduling Servicing") {
				oViewModel.setProperty("/bAirFrameAndTAC", false);
				oViewModel.setProperty("/bScheduleService", true);
				oViewModel.setProperty("/bPhaseService", false);
			} else if (sSelectedKey === "Next Phase Servicing") {
				oViewModel.setProperty("/bAirFrameAndTAC", false);
				oViewModel.setProperty("/bScheduleService", false);
				oViewModel.setProperty("/bPhaseService", true);
			}
		},
		//3.on click of submit button
		onPressSubmit: function () {
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				this.getRouter().navTo("Limitations");
			}
			// ***************************************************************************
			//                 4. Private Methods   
			// ***************************************************************************

	});
});