sap.ui.define([ 
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, dataUtil, JSONModel, ajaxutil, formatter, Log) {
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
				// var oDataRep = {};
				// oDataRep.srv = [];
				// this.getView().setModel(new JSONModel(oDataRep), "oReplenishViewModel");

				var oModel = new JSONModel({
					Fuel: [],
					OilMisc: [],
					Tire: []
				});
				this.getView().setModel(oModel, "oReplenishViewModel");
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		onReplenishmentBack: function() {
			this.getOwnerComponent().getRouter().navTo("UpdateFlightServicing");
		},

		onPressBack: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("UpdateFlightServicing");
			} catch (e) {
				Log.error("Exception in onPressBack function");
				this.handleException(e);
			}
		},
		onNavBack: function() {
			try {
				var oReplenishViewModel = this.getView().getModel("oReplenishViewModel");
				this.getOwnerComponent().getRouter().navTo("UpdateFlightServicing", {
					srvid: oReplenishViewModel.getProperty("/srvtid")
				});
			} catch (e) {
				Log.error("Exception in onNavBack function");
				this.handleException(e);
			}
		},

		onReplBtnClk: function(oEvent) {
			try {
				var sTile = oEvent.getSource().getBindingContext("oReplenishViewModel").getObject();
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
					srvtid: this.getModel("oReplenishViewModel").getProperty("/srvtid"),
					stepid: this.getModel("oReplenishViewModel").getProperty("/stepid")
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
				this.getModel("oReplenishViewModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("oReplenishViewModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this.getModel("oReplenishViewModel").setProperty("/srv", []);
				var oReplenishViewModel = this.getView().getModel("oReplenishViewModel");
				oReplenishViewModel.setProperty("/sPageTitle", oEvent.getParameter("arguments").srvtid.split("_")[1]);
				this.getModel("oReplenishViewModel").refresh();
				this._getRepTiles();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},
		_getRepTiles: function() {
			try {
				var that = this,
					oReplenishViewModel = this.getView().getModel("oReplenishViewModel"),
					srvtid = oReplenishViewModel.getProperty("/srvtid"),
					stepid = oReplenishViewModel.getProperty("/stepid"),
					Fuel = [],
					OilMisc = [],
					Tire = [],
					oParameter = {};
				var filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + srvtid + " and TAILID eq " + this.getTailId() +
					" and STEPID eq " + stepid;
				oParameter.error = function() {};
				oParameter.filter = filter; //"REFID eq AIR_10 and SRVID eq  and TAILID eq TAIL_1015";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].remid === "REM_F") {
								if (oData.results[i].srvamt !== null) {
									oData.results[i].srvamt = parseInt(oData.results[i].srvamt);
								}
								if (oData.results[i].totamt !== null) {
									oData.results[i].totamt = parseInt(oData.results[i].totamt);
								}
								Fuel.push(oData.results[i]);
							}
							if (oData.results[i].remid === "REM_O") {
								if (oData.results[i].srvamt !== null && oData.results[i].resdescription !== "LOX") {
									oData.results[i].srvamt = parseInt(oData.results[i].srvamt);
								}
								if (oData.results[i].totamt !== null && oData.results[i].resdescription !== "LOX") {
									oData.results[i].totamt = parseInt(oData.results[i].totamt);
								}
								OilMisc.push(oData.results[i]);
							}
							if (oData.results[i].remid === "REM_T") {
								if (oData.results[i].srvamt !== null) {
									oData.results[i].srvamt = parseInt(oData.results[i].srvamt);
								}
								if (oData.results[i].totamt !== null) {
									oData.results[i].totamt = parseInt(oData.results[i].totamt);
								}
								Tire.push(oData.results[i]);
							}
						}
						oReplenishViewModel.setProperty("/Fuel", Fuel);
						oReplenishViewModel.setProperty("/OilMisc", OilMisc);
						oReplenishViewModel.setProperty("/Tire", Tire);
						this._getFuelExtTanks();
						oReplenishViewModel.refresh(true);
						setTimeout(function() {
							that._setRadialChartText();
						}, 100);
					}
				}.bind(this);
				ajaxutil.fnRead("/ReplshmentSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getRepTiles function");
				this.handleException(e);
			}
		},

		_getFuelExtTanks: function() {
			try {
				var that = this,
					oReplenishViewModel = this.getView().getModel("oReplenishViewModel"),
					srvtid = oReplenishViewModel.getProperty("/srvtid"),
					stepid = oReplenishViewModel.getProperty("/stepid"),
					Fuel = oReplenishViewModel.getProperty("/Fuel"),
					//OilMisc = [],
					//Tire = [],
					oParameter = {};
				var filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + srvtid + " and TAILID eq " + this.getTailId() +
					" and STEPID eq " + stepid;
				oParameter.error = function() {};
				oParameter.filter = filter; //"REFID eq AIR_10 and SRVID eq  and TAILID eq TAIL_1015";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].remid === "REM_F") {
								if (oData.results[i].srvamt !== null) {
									oData.results[i].srvamt = parseInt(oData.results[i].srvamt);
								}
								if (oData.results[i].totamt !== null) {
									oData.results[i].totamt = parseInt(oData.results[i].totamt);
								}
								Fuel.push(oData.results[i]);
							}
						}
						oReplenishViewModel.setProperty("/Fuel", Fuel);
						//oReplenishViewModel.setProperty("/OilMisc", OilMisc);
						//oReplenishViewModel.setProperty("/Tire", Tire);
						oReplenishViewModel.refresh(true);
						setTimeout(function() {
							that._setRadialChartText();
						}, 100);
					}
				}.bind(this);
				ajaxutil.fnRead("/ReplRoleSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getFuelExtTanks function");
				this.handleException(e);
			}
		},

		_setRadialChartText: function() {
			try {
				var aItems = this.getView().byId("FuleTilesHBoxId").getItems();
				var aOilItems = this.getView().byId("OilTilesHBoxId").getItems();
				for (var i in aOilItems) {
					aItems.push(aOilItems[i]);
				}
				if (aItems.length) {
					for (var i in aItems) {
						var sSId = "#" + aItems[i].getContent()[0].sId + " > div > div > div";
						if (document.querySelector(sSId) !== null) {
							document.querySelector(sSId).textContent = "";
						}
					}
				}
			} catch (e) {
				Log.error("Exception in _setRadialChartText function");
				this.handleException(e);
			}
		}
	});
});