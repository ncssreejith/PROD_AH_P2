sap.ui.define([
	"./BaseController",
	"../util/dataUtil",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, dataUtil, JSONModel,Log) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.ADDConfirmation", {

		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {},
		onBackToDashboard: function() {
			try {
				this.getRouter().navTo("COSDashboard");
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		}

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************

	});
});