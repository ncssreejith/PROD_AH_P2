sap.ui.define([
	"./BaseController",
	"../util/dataUtil"
], function (BaseController,dataUtil) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.Overview", {

	// ***************************************************************************
    //                 1. UI Events  
    // ***************************************************************************
		onInit: function () {
			var odevStatusModel = dataUtil.createJsonModel("model/devStatus.json");
			this.getView().setModel(odevStatusModel, "devStatusModel");
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

	});

});