sap.ui.define([
	"./BaseController",
	"../util/dataUtil",
	"../util/ajaxutil",
	"../model/formatter",
	"../model/FieldValidations",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, dataUtil, ajaxutil, formatter, FieldValidations, JSONModel, Log) {
	"use strict";
	/* ***************************************************************************
	 *	 Developer : Teck Meng
	 *   Control name: AddEquipRunningLog           
	 *   Purpose : Add Equipment running log dialog controller
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *		1.2 onSignOffPress
	 *	 2. Backend Calls
	 *		2.1 fnLogById
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *		3.2 fnSetReason
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.AddEngOilLog", {
		formatter: formatter,
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************		
		onInit: function() {
			try {
				this.getRouter().getRoute("AddEngOilLog").attachPatternMatched(this._onObjectMatched, this);

			} catch (e) {
				Log.error("Exception in AddEngOilLog:onInit function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// Engine Oil Replenishment flag selection
		//-------------------------------------------------------------
		onSOAPSampling: function(oEvent) {
			try {
				// var sSelectText = oEvent.getSource().getSelectedKey(),
				// 	oModel = this.getView().getModel("oAddEngCycLogModel");
				// oModel.setProperty("/OLREA", sSelectText);
				// oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in onSOAPSampling function");
			}
		},
		//-------------------------------------------------------------
		//  This will update Aircraft log after signoff
		//-------------------------------------------------------------
		onSignOffPress: function() {
			try {
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				// if (!this.handleChange()) {
				// 	return;
				// }
				var oPayload = JSON.parse(JSON.stringify(this.getModel("oAddEngCycLogModel").getProperty("/")));
				if (oPayload.OLREA === "125_F") {
					oPayload.SFLAG = " ";
				}
				delete oPayload.ReasonCodes;
				oPayload.SPDT = formatter.defaultOdataDateFormat(new Date());
				oPayload.SPTM = formatter.fnTimeFormat(new Date());
				oPayload.BEGDA = formatter.defaultOdataDateFormat(new Date());
				var oParameter = {};
				oParameter.activity = 1;
				oParameter.error = function() {};
				oParameter.success = function() {
					this.onNavBack();
				}.bind(this);
				ajaxutil.fnCreate(this.getResourceBundle().getText("ENGSOAPSVC"), oParameter, [oPayload], "ZRM_E_REPL", this);
			} catch (e) {
				Log.error("Exception in AddEngOilLog:onSignOffPress function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		_fnReasonSOAPGet: function() {
			try {
				var oParameter = {};
				oParameter.filter = "ddid eq 125_ and REFID eq " + this.getAircraftId();
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					if (oData && oData.results.length && oData.results.length > 0) {
						var oModel = this.getView().getModel("oAddEngCycLogModel");
						oModel.setProperty("/ReasonCodes", oData.results);
						oModel.refresh();
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _fnReasonSOAPGet function");
			}
		},
		//-------------------------------------------------------------
		//  This will load aircraft log data
		//-------------------------------------------------------------		
		// ***************************************************************************
		//     2. Private Functions
		// ***************************************************************************
		//-------------------------------------------------------------
		//  On page load
		//-------------------------------------------------------------		
		_onObjectMatched: function(oEvent) {
			try {

				var utilData = {
					BEGDA: null,
					CREUSR: null,
					DDDESC: null,
					ENDDA: null,
					ENGHR: null,
					ENGID: "ENG_10017",
					HRAT: "40.00",
					HRSINCE: null,
					JDUID: null,
					JDUVL: null,
					JOBID: null,
					OLREA: "125_R",
					SFLAG: null,
					SOAP: "",
					SOAPID: null,
					SPDT: null,
					SPREPLE: "X",
					SPTM: "16:00:00.000",
					SRVAMT: 1,
					SRVTID: null,
					SSTAT: null,
					STEPID: null,
					TAILID: this.getTailId()

					// "SOAPID": null,
					// "OLREA": "125_R", //"SOAP_4",
					// "ENGHR": null,
					// "HRSINCE": null,
					// "ENDDA": null,
					// "BEGDA": null,
					// "SPREPLE": "X",
					// "SOAP": "",
					// "SPDT": null,
					// "SPTM": null,
					// "DDDESC": null,
					// "HRAT": null,
					// "SSTAT": null,
					// "SFLAG": null,
					// "CREUSR": null,
					// "JOBID": null,
					// "JOBDESC": null,
					// "JDUID": null,
					// "JDUVL": null,
					// SRVAMT: 1
				};

				this.getView().setModel(new JSONModel(utilData), "oAddEngCycLogModel");
				this.getModel("oAddEngCycLogModel").setProperty("/ENGID", oEvent.getParameter("arguments").engid);
				this.getModel("oAddEngCycLogModel").setProperty("/TAILID", oEvent.getParameter("arguments").tailid); //SFLAG
				this.getModel("oAddEngCycLogModel").setProperty("/SFLAG", oEvent.getParameter("arguments").SFLAG); //SFLAG
				FieldValidations.resetErrorStates(this);
				this.getModel("oAddEngCycLogModel").refresh(true);
				this._fnReasonSOAPGet();
				// this.fnLogById();
			} catch (e) {
				Log.error("Exception in AddEngOilLog:_onObjectMatched function");
				this.handleException(e);
			}
		},
		/** 
		 * Validate changes
		 * @returns
		 */
		handleChange: function() {
			var dCopyMinDate = this.getView().getModel("ViewModel").getProperty("/minDate");
			var dMinDate = new Date((dCopyMinDate.getTime() + 60000));
			var sFormat;
			var fnDateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "HH:mm"
			});
			return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorMinMessage", "errorMaxMessage",
				formatter.defaultOdataDateFormat(dMinDate), fnDateFormatter.format(dMinDate));
		}

	});
});