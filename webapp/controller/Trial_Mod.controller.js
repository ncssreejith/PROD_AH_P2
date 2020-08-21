sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter"
], function(BaseController, dataUtil, Fragment, FieldValidations, JSONModel, ajaxutil, formatter) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.Trial_Mod", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			// var model = this.setModel(new JSONModel(), "oViewModel");
			// this.getView().setModel(model, "oViewModel");
			this.setModel(new JSONModel(), "trialModel");

			this.getRouter().getRoute("Trial_Mod").attachPatternMatched(this._onObjectMatched, this);

		},
		onDeModClick: function() {
			this.fnUpdateDeMod();
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		fnLoadTrialMod: function() {
			var sPath = "/TRAILMONSvc/"; // + this.getTailId();
			var oParameter = {};
			oParameter.filter = "tailid eq " + this.getTailId(); // + " and tailid eq " + this.getTailId() + " and trial eq " + "X";
			oParameter.error = function() {};
			oParameter.success = function(oData) {
				var oTrial = oData.results;
				this.getModel("trialModel").setProperty("/", oTrial);
				this.getModel("trialModel").refresh(true);
			}.bind(this);
			ajaxutil.fnRead(sPath, oParameter);
		},
		fnUpdateDeMod: function() {
			var sPath = "/TRAILMONSvc";
			var oData = [];
			var oParameter = {};
			oParameter.activity = 5;
			this.getModel("trialModel").getProperty("/").forEach(function(oItem) {
				var oPayload = {};
				oPayload = oItem;
				oPayload.jstat = "S";
				oData.push(oPayload);
			});
			oParameter.error = function() {};
			oParameter.success = function(oRespond) {
				this.onNavBack();
				// var oTrial = oRespond.results;
				// this.getModel("trialModel").setProperty("/", oTrial);
				// this.getModel("trialModel").refresh(true);
			}.bind(this);
			ajaxutil.fnUpdate(sPath, oParameter, oData, "ZRM_T_MOD", this);
		},
		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			this.fnLoadTrialMod();
		}
	});
});