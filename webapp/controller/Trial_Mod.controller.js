sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, dataUtil, Fragment, FieldValidations, JSONModel, ajaxutil, formatter, Log) {
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

		onRaiseTrailMod: function() {
			try {
				var oModel = this.getModel("trialModel"),
					payload = oModel.getProperty("/")[0];
				payload.JDUID = oModel.getProperty("/DueBy");
				if (oModel.getProperty("/DueBy") === "JDU_10") {
					payload.pddval2 = oModel.getProperty("/UtilVal");
				} else {
					payload.pddval1 = oModel.getProperty("/UtilVal");
				}

				var oParameter = {};
				oParameter.error = function(response) {};
				oParameter.success = function(oData) {
					this.onCloseTrailMod();
					this.fnLoadTrialMod();
				}.bind(this);
				oParameter.activity = 2;
				ajaxutil.fnUpdate("/TRAILMONSvc", oParameter, [payload], "ZRM_T_MOD", this);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnUpdateJob function");
				this.handleException(e);
			}

		},

		onCloseTrailMod: function() {
			this.closeDialog("TrialModExtension");
		},

		onTModExtension: function() {
			try {
				this.TrialModExtension = this.fnLoadFragment("TrialModExtension", null, true);
				var oPrmMark = {},
					oModel = this.getModel("trialModel"),
					that = this,
					oPayload;
				oModel.setProperty("/isVisInput", false);
				oPrmMark.filter = "refid eq " + this.getAircraftId() + " and ddid eq JDU";
				oPrmMark.error = function() {};
				oPrmMark.success = function(oData) {
					if (oData && oData.results.length > 0) {
						oModel.setProperty("/JobDueSet", oData.results);
						this.TrialModExtension.open();
					}
				}.bind(this);
				ajaxutil.fnRead("/MasterDDREFSvc", oPrmMark);
			} catch (e) {
				Log.error("Exception in Trial_Mod:onTModExtension function");
				this.handleException(e);
			}
		},

		onDueSelectChange: function(oEvent) {
			var oSrc = oEvent.getSource(),
				sKey = oSrc.getSelectedKey(),
				aKey = this.getResourceBundle("i18n").getText("jobDueKey");
			var bFlag = aKey.search(sKey) !== -1 ? true : false;
			this.getModel("trialModel").setProperty("/isVisInput", bFlag);
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