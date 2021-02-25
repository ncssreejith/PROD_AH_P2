sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, Fragment, FieldValidations, JSONModel, ajaxutil, formatter, Log, FilterOpEnum) {
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
			try {
				this.setModel(new JSONModel(), "trialModel");

				this.getRouter().getRoute("Trial_Mod").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in Trial_Mod:onInit function");
				this.handleException(e);
			}

		},
		onDeModClick: function(oEvent) {
			try {
				this.fnUpdateDeMod(oEvent);
			} catch (e) {
				Log.error("Exception in Trial_Mod:onDeModClick function");
				this.handleException(e);
			}
		},

		onRaiseTrailMod: function() {
			try {
				var oModel = this.TrialModExtension.getModel("TrailModelFarg"),
					payload = this.oObject;
				if (oModel.getProperty("/isVisDate")) {
					payload.pddval2 = formatter.defaultOdataDateFormat(oModel.getProperty("/UtilDT"));
				} else {
					payload.pddval1 = oModel.getProperty("/UtilVal");
					var iPrecision = formatter.JobDueDecimalPrecision(oModel.getProperty("/JDUID"));
					payload.pddval1 = parseFloat(payload.pddval1, [10]).toFixed(iPrecision);
				}
				payload.PAST_COUNT = parseInt(payload.PAST_COUNT, 10) + 1;

				var oParameter = {};
				oParameter.error = function(response) {};
				oParameter.success = function(oData) {
					this.onCloseTrailMod();
					this.fnLoadTrialMod();
				}.bind(this);
				oParameter.activity = 2;
				ajaxutil.fnUpdate(this.getResourceBundle().getText("TRAILMONSVC"), oParameter, [payload], "ZRM_T_MOD", this);
			} catch (e) {
				Log.error("Exception in Trial_Mod:onRaiseTrailMod function");
				this.handleException(e);
			}

		},

		onCloseTrailMod: function() {
			this.closeDialog("TrialModExtension");
		},

		onTModExtension: function(oEvent) {
			 try {
				this.TrialModExtension = this.fnLoadFragment("TrialModExtension", null, true);
				var oModel = this.getModel("trialModel"),
					oMod, oModelFrag = dataUtil.createNewJsonModel();
				this.oObject = oEvent.getSource().getBindingContext("trialModel").getObject();
				oMod = JSON.parse(JSON.stringify(this.oObject));
				if (this.oObject.JDUID === "JDU_10") {
					oModelFrag.setProperty("/isVisInput", false);
					oModelFrag.setProperty("/isVisDate", true);
					var minDate = new Date(this.oObject.pddval2);
					minDate.setDate(minDate.getDate() + 1);
					oModelFrag.setProperty("/minDate", minDate);
					try {
						oModelFrag.setProperty("/UtilDT", new Date(this.oObject.pddval2));
					} catch (e) {
						oModelFrag.setProperty("/UtilDT",  "");
					}
				} else {
					oModelFrag.setProperty("/isVisInput", true);
					oModelFrag.setProperty("/isVisDate", false);
					try {
						oModelFrag.setProperty("/minVal", parseFloat(this.oObjectJDU[this.oObject.JDUID].VALUE));
					} catch (e) {
						oModelFrag.setProperty("/minVal", 0);
					}
					try {
						oModelFrag.setProperty("/UtilVal", this.oObject.pddval1);
					} catch (e) {
						oModelFrag.setProperty("/UtilVal", 0);
					}
				}
				oModelFrag.setProperty("/ExtLbl", this.oObject.JDUIDD);
				oModelFrag.setProperty("/JDUID", this.oObject.JDUID);
				this.TrialModExtension.setModel(oModelFrag,"TrailModelFarg");
				this.TrialModExtension.open();

		 } catch (e) {
				Log.error("Exception in Trial_Mod:onTModExtension function");
			 	//this.handleException(e);
			 }
		},
		onDueSelectChange: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sKey = oSrc.getSelectedKey(),
					aKey = this.getResourceBundle("i18n").getText("jobDueKey");
				var bFlag = aKey.search(sKey) !== -1 ? true : false;
				this.getModel("trialModel").setProperty("/isVisInput", bFlag);
			} catch (e) {
				Log.error("Exception in Trial_Mod:onDueSelectChange function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		fnLoadTrialMod: function() {
			try {
				var sPath = this.getResourceBundle().getText("TRAILMONSVC"); // + this.getTailId();
				var oParameter = {};
				//	oParameter.filter = "tailid eq " + this.getTailId(); // + " and tailid eq " + this.getTailId() + " and trial eq " + "X";
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var oTrial = oData.results;
					this.getModel("trialModel").setProperty("/", oTrial);
					this.getModel("trialModel").refresh(true);
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in Trial_Mod:fnLoadTrialMod function");
				this.handleException(e);
			}
		},

		fnUpdateDeMod: function(oEvent) {
			try {
				//Rahul: 13/11/2020: 11:55AM: Sergvice name was corrected to TRAILMONSVC from ApprovalNavSvc .
				var sPath = this.getResourceBundle().getText("TRAILMONSVC"); //ApprovalNavSvc
				var oData = [];
				var oParameter = {};
				oParameter.activity = 5;
				var oItem = oEvent.getSource().getBindingContext("trialModel").getObject();

				var oPayload = {};
				oPayload = oItem;
				oPayload.jstat = "S";
				//oPayload.trail =  "";
				oData.push(oPayload);

				oParameter.error = function() {};
				oParameter.success = function(oRespond) {
					this.fnLoadTrialMod();
					// var oTrial = oRespond.results;
					// this.getModel("trialModel").setProperty("/", oTrial);
					// this.getModel("trialModel").refresh(true);
				}.bind(this);
				ajaxutil.fnUpdate(sPath, oParameter, oData, "ZRM_T_MOD", this);
			} catch (e) {
				Log.error("Exception in Trial_Mod:fnUpdateDeMod function");
				this.handleException(e);
			}
		},

		/* Function: _fnGetUtilisation
		 * Parameter:
		 * Description: This is called retreive min values for the utilisation
		 */
		// _fnGetUtilisation: function() {
		// 	try {
		// 		var oPrmJobDue = {};
		// 		//	oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + this.getAircraftId() + " and JDUID eq JDU";
		// 		oPrmJobDue.filter = "TAILID" + FilterOpEnum.EQ + this.getTailId() + FilterOpEnum.AND + "refid" + FilterOpEnum.EQ + this.getAircraftId() +
		// 			FilterOpEnum.AND + "JDUID" + FilterOpEnum.EQ + "JDU"; // phase 2 Changes
		// 		oPrmJobDue.error = function() {};

		// 		oPrmJobDue.success = function(oData) {
		// 			if (oData && oData.results.length > 0) {
		// 				this.defVal = {};
		// 				for (var i in oData.results) {
		// 					this.defVal[oData.results[i].JDUID] = oData.results[i];
		// 				}
		// 			}
		// 		}.bind(this);

		// 		ajaxutil.fnRead(this.getResourceBundle().getText("UTILISDUESVC"), oPrmJobDue); // Phase 2 changes 
		// 	} catch (e) {
		// 		Log.error("Exception in _fnGetUtilisation function");
		// 	}
		// },

		_fnGetUtilisation: function() {
			try {
				var oPrmJobDue = {};
				//	oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + this.getAircraftId() + " and JDUID eq JDU";
				oPrmJobDue.filter = "TAILID" + FilterOpEnum.EQ + this.getTailId() + FilterOpEnum.AND + "refid" + FilterOpEnum.EQ + this.getAircraftId() +
					FilterOpEnum.AND + "JDUID" + FilterOpEnum.EQ + "JDU";
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.oObjectJDU = {};
						for (var i in oData.results) {
							this.oObjectJDU[oData.results[i].JDUID] = oData.results[i];
						}
					}
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("UTILISATIONDUESVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseJob:_fnGetUtilisation function");

			}
		},

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				this.fnLoadTrialMod();
				this._fnGetUtilisation();
		
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		}
	});
});