sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../model/FieldValidations",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, FieldValidations, ajaxutil, formatter, Log, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.CosAddSoapSampling", {
		formatter: formatter,
		onInit: function() {
			try {
				this.getRouter().getRoute("CosAddSoapSampling").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in CosAddSoapSampling:onInit function");
				this.handleException(e);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/* =========================================================== */
		/* Event Handlers                                              */
		/* =========================================================== */

		onEngineOilRepl: function(oEvent) {
			try {
				var oSegmentedButton = this.byId('EngSOAPID'),
					oSelectedItemId, oModel;
				oSelectedItemId = oSegmentedButton.getSelectedKey();
				oModel = this.getView().getModel("ViewModel");
				switch (oSelectedItemId) {
					case "Y":
						oModel.setProperty("/SPREPLE", "X");
						this.getView().byId("HbIdPint").setVisible(true);
						break;
					case "N":
						this.getView().byId("HbIdPint").setVisible(false);
						oModel.setProperty("/SPREPLE", "");
						break;
				}
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosAddSoapSampling:onEngineOilRepl function");
				this.handleException(e);
			}
		},

		onSOAPSampling: function(oEvent) {
			try {
				var sSelectText = oEvent.getSource().getSelectedKey(),
					oModel = this.getView().getModel("ViewModel");
				oModel.setProperty("/OLREA", sSelectText);
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosAddSoapSampling:onSOAPSampling function");
				this.handleException(e);
			}
		},

		onSaveSoapSampling: function() {
			try {
				var oModel = this.getView().getModel("ViewModel").getData(),
					oPayload;
				oPayload = oModel;
				oPayload.SPDT = formatter.defaultOdataDateFormat(oPayload.SPDT);
				oPayload.BEGDA = formatter.defaultOdataDateFormat(oPayload.BEGDA);
				this._fnReasonSOAPCreate(oPayload);
			} catch (e) {
				Log.error("Exception in CosAddSoapSampling:onSaveSoapSampling function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var that = this,
					oViewModel = dataUtil.createNewJsonModel(),
					oSOAPSamplingModel = dataUtil.createNewJsonModel(),
					sEngine = oEvent.getParameters().arguments.Engine,
					sSN = oEvent.getParameters().arguments.SN,
					oDate = new Date();

				oViewModel.setData({
					"ENGID": sEngine,
					"SOAPID": "",
					"OLREA": "",
					"ENGHR": "",
					"SRVAMT": "",
					"HRSINCE": "",
					"ENDDA": "9999-12-31",
					"BEGDA": oDate,
					"SPREPLE": null, //for Yes for No ""
					"SOAP": "",
					"SPDT": oDate, //System date todays
					"SPTM": oDate.getHours() + ":" + oDate.getMinutes(),
					"TAILID": null,
					"DDDESC": "",
					"HRAT": null,
					"SSTAT": "NA",
					"SFLAG": null,
					"CREUSR": null,
					"JOBID": null,
					"JOBDESC": null,
					"JDUID": null,
					"JDUVL": null
				});

				that.getView().setModel(oViewModel, "ViewModel");
				that._fnReasonSOAPGet();
			} catch (e) {
				Log.error("Exception in CosAddSoapSampling:_onObjectMatched function");
				this.handleException(e);
			}
		},
		//Need to pass flag for filterering records for replenishment
		_fnReasonSOAPGet: function() {
			try {
				var oParameter = {};
			//	oParameter.filter = "ddid eq 125_";
				oParameter.filter = "ddid" + FilterOpEnum.EQ + "125_";
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					this.getView().setModel(oModel, "ReasonSOAPModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDVALSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in CosAddSoapSampling:_fnReasonSOAPGet function");
				this.handleException(e);
			}
		},

		_fnReasonSOAPCreate: function(oPayload) {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getRouter().navTo("CosEngine");
				}.bind(this);
				ajaxutil.fnCreate(this.getResourceBundle().getText("ENGSOAPSVC"), oParameter, [oPayload], "SOAPADD", this);
			} catch (e) {
				Log.error("Exception in CosAddSoapSampling:_fnReasonSOAPCreate function");
				this.handleException(e);
			}
		}

	});
});