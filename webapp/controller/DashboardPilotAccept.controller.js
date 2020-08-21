sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
], function (BaseController, MessageToast, dataUtil, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.DashboardPilotAccept", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function () {
			var oModel = new JSONModel({});
			this.getView().setModel(oModel, "oPilotDashBoardModel");
			var oModel = new JSONModel({
				"ChangeCertificate": false,
				"ChangeWeapon": false,
				"AddFly": false
			});
			this.getView().setModel(oModel, "oPilotModel");
			this.getRouter().getRoute("DBPilotAccept").attachPatternMatched(this._onObjectMatched, this);
		},
		onPilotReviewPress: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("PilotAccept");
		},
		onPilotUpdatePress: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("PilotUpdates");
		},
		onDeclareAircraftPress: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("WeaponExpenditure");
		},

		onPilotChanges: function () {
			if (!this._oChanages) {
				this._oChanages = sap.ui.xmlfragment("avmet.ah.fragments.pilot.Changes", this);
				this.getView().addDependent(this._oChanages);
			}
			this._oChanages.open();
		},

		onCancelChanges: function () {
			this._oChanages.close();
			this._oChanages.destroy();
			delete this._oChanages;
		},

		onProceedChange: function () {
			var oModel = this.getView().getModel("oPilotModel");
			if (oModel.getProperty("/ChangeCertificate")) {
				this.getOwnerComponent().getRouter().navTo("PDSSummary");
			} else if (oModel.getProperty("/ChangeWeapon")) {
				this.getOwnerComponent().getRouter().navTo("WeaponConfig");
			} else if (oModel.getProperty("/AddFly")) {

			}
			this.onCancelChanges();
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
			if (PilotAcceptanceDetails.FlightStatus === "NF") {
				if (!this._oSignoff) {
					this._oSignoff = sap.ui.xmlfragment("avmet.ah.fragments.pilot.AircraftSignOff", this);
					this.getView().addDependent(this._oSignoff);
				}
				this._oSignoff.open();
			}
		}
	});
});