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
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.FlyingRequirements", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("FlyingRequirements").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}

		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		_fnFlyingRequirementsMasterGet: function() {
			try {
				var that = this,
					oPrmTD = {};
				oPrmTD.filter = "TAILID eq " + that.getTailId();
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "FRAllModel");
				}.bind(this);
				ajaxutil.fnRead("/GetflyreqSvc", oPrmTD);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		onAddFlyingRequirements: function() {
			this.getRouter().navTo("CosAddFlyingRequirements", {
				"AirId": this.getAircraftId(),
				"TailId": this.getTailId(),
				"Flag": "N"
			});
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var sTail = this.getTailId();
				this._fnFlyingRequirementsMasterGet(sTail);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		}

	});
});