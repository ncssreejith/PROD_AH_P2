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
		onDeModClick: function(oEvent) {
			try {
				this.fnUpdateDeMod(oEvent);
			} catch (e) {
				Log.error("Exception in onDeModClick function");
			}
		},

		onRaiseTrailMod: function() {
			try {
				var oModel = this.getModel("trialModel"),
					payload = this.oObject;
				if (oModel.getProperty("/isVisDate")) {
					payload.pddval2 = formatter.defaultOdataDateFormat(oModel.getProperty("/UtilVal"));
				} else {
					payload.pddval1 = oModel.getProperty("/UtilVal");
				}
				payload.PAST_COUNT = parseInt(payload.PAST_COUNT, 10) + 1;

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

		onTModExtension: function(oEvent) {
			try {
				this.TrialModExtension = this.fnLoadFragment("TrialModExtension", null, true);
				var oModel = this.getModel("trialModel");
				this.oObject = oEvent.getSource().getBindingContext("trialModel").getObject();
				if (this.oObject.JDUID === "JDU_11") {
					oModel.setProperty("/isVisAirFrame", true);
					oModel.setProperty("/isVisInput", false);
					oModel.setProperty("/isVisDate", false);
				} else if (this.oObject.JDUID === "JDU_10") {
					oModel.setProperty("/isVisAirFrame", false);
					oModel.setProperty("/isVisInput", false);
					oModel.setProperty("/isVisDate", true);
					var minDate = new Date(this.oObject.pddval2);
					minDate.setDate(minDate.getDate() + 1);
					oModel.setProperty("/minDate", minDate);
				} else {
					oModel.setProperty("/isVisAirFrame", false);
					oModel.setProperty("/isVisInput", true);
					oModel.setProperty("/isVisDate", false);
				}
				oModel.setProperty("/ExtLbl", this.oObject.JDUIDD);
				this.TrialModExtension.open();
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

		fnUpdateDeMod: function(oEvent) {
			var sPath = "/TRAILMONSvc"; //ApprovalNavSvc
			var oData = [];
			var oParameter = {};
			oParameter.activity = 5;
			var oItem = oEvent.getSource().getBindingContext("trialModel").getObject();

			var oPayload = {};
			oPayload = oItem;
			oPayload.jstat = "S";
			oData.push(oPayload);

			oParameter.error = function() {};
			oParameter.success = function(oRespond) {
				this.fnLoadTrialMod();
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