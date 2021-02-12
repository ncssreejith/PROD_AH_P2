sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, JSONModel, ajaxutil, formatter, Log, FilterOpEnum) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.Replenishment", {
		formatter: formatter,
		// ***************************************************************************
		//Developer : Priya
		//                 1. UI Events  
		// 22/07/2020 Priya 8.38 pm
		//16AugPriya 4:56pm
		//Changes Push
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("Replenishment").attachPatternMatched(this._onObjectMatched, this);
				var oModel = new JSONModel({
					fuel: [],
					oil: [],
					tire: []
				});
				this.getView().setModel(oModel, "oReplModel");
				this.getView().setModel(new JSONModel({
					busy: false,
					delay: 0
				}), "viewModel");
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		onReplBtnClk: function(oEvent) {
			try {
				if (this.getModel("oReplModel").getProperty("/SRVID")) {
					return;
				}
				var sTile = oEvent.getSource().getBindingContext("oReplModel").getObject();
				switch (sTile.remid) {
					case "REM_F":
						break;
					case "REM_T":
						break;
					case "REM_O":
						break;
				}
				// ReplenishmentDetails
				this.getRouter().navTo("ReplenishmentDetails", {
					Replenish: sTile.remid,
					srvtid: this.getModel("oReplModel").getProperty("/srvtid"),
					stepid: this.getModel("oReplModel").getProperty("/stepid")
				});
			} catch (e) {
				Log.error("Exception in onReplBtnClk function");
				this.handleException(e);
			}
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
		_onObjectMatched: function(oEvent) {
			try {
				this.updateModel({
					busy: true
				}, "viewModel");
				this.getModel("oReplModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("oReplModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this.getModel("oReplModel").setProperty("/SRVID", oEvent.getParameter("arguments").srvid);
				this.getModel("oReplModel").setProperty("/srv", []);
				this.getModel("oReplModel").refresh();
				this._getRepTiles();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},
		_getRepTiles: function() {
			try {
				var oParameter = {};
				// var sSrvIdFilter = this.getModel("oReplModel").getProperty("/SRVID") ?
				// 	(" and SRVID eq " + this.getModel("oReplModel").getProperty("/SRVID") + " and PASTFLIGHT eq Y") : "";
				var sSrvIdFilter = this.getModel("oReplModel").getProperty("/srvid") ?
					("&SRVID=" + this.getModel("oReplModel").getProperty("/srvid") + "&PASTFLIGHT=Y") : "";
				// oParameter.filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("oReplModel").getProperty("/srvtid") +
				// 	" and TAILID eq " + this.getTailId() +
				// 	" and STEPID eq " + this.getModel("oReplModel").getProperty("/stepid") + sSrvIdFilter;
				oParameter.filter = "REFID=" + this.getAircraftId() + "&SRVTID=" + this.getModel("oReplModel").getProperty("/srvtid") +
					"&TAILID=" + this.getTailId() +
					"&STEPID=" + this.getModel("oReplModel").getProperty("/stepid") + sSrvIdFilter;
				oParameter.error = function(hrex) {
					this.updateModel({
						busy: false
					}, "viewModel");
					this.fnShowMessage("E", {}, hrex, function(oEvent) {});
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oReplModel").setProperty("/srv", oData.results);
					this.getModel("oReplModel").refresh();
					this.updateModel({
						busy: false
					}, "viewModel");
					// this._getFuelExtTanks();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("REPLENISHMENTSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getRepTiles function");
				this.handleException(e);
			}
		},

		_getFuelExtTanks: function() {
			try {
				var sSrvIdFilter = this.getModel("oReplModel").getProperty("/SRVID") ?
					(" and SRVID eq " + this.getModel("oReplModel").getProperty("/SRVID") + " and PASTFLIGHT eq Y") : "";
				var oParameter = {};
				oParameter.filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("oReplModel").getProperty("/srvtid") +
					" and TAILID eq " + this.getTailId() +
					" and STEPID eq " + this.getModel("oReplModel").getProperty("/stepid") + sSrvIdFilter;
				oParameter.error = function(hrex) {
					this.updateModel({
						busy: false
					}, "viewModel");
					this.fnShowMessage("E", {}, hrex, function(oEvent) {});
				}.bind(this);
				oParameter.success = function(oData) {
					var oTotalRecord = this.getModel("oReplModel").getProperty("/srv").concat(oData.results);
					this.getModel("oReplModel").setProperty("/srv", oTotalRecord);
					this.getModel("oReplModel").refresh();
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("REPLROLESVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getFuelExtTanks function");
				this.handleException(e);
			}
		}
	});
});