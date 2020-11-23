sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageToast, dataUtil, JSONModel) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.DBOngFlightService", {
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function () {

		},
		onUpdateFlightServicetPress: function () {
			this.getOwnerComponent().getRouter().navTo("UpdateFlightServicing");
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

		}
	});
});