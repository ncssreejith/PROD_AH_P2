sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, dataUtil, ajaxutil, formatter, JSONModel, Log) {
	"use strict";
	/* ***************************************************************************
	 *	 Developer : KUMAR AMIT	
	 *   Control name: Station           
	 *   Purpose : Display of aircraft utilization and fly log and mano
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

	return BaseController.extend("avmet.ah.controller.AircraftUtilisation", {
		formatter: formatter,
		onInit: function() {
			try {
				this.getRouter().getRoute("AircraftUtilisation").attachPatternMatched(this._onObjectMatched, this);
				// var utilData = {};
				// utilData.selIndex = 0;
				// utilData.engine = [];
				// // utilData.fly = [];
				// this.getView().setModel(new JSONModel(utilData), "oAircraftUtilModel");
				// // this.getView().byId("landing").setHeaderSpan([3, 1]);
				var utilData = {};
				utilData.selIndex = 0;
				utilData.equiptabId = "TABA_102";
				utilData.flyingtabId = "TABA_103";
				utilData.manotabId = "TABA_104";
				utilData.equip = [];
				utilData.flying = [];
				utilData.mano = [];
				this.getView().setModel(new JSONModel(utilData), "oAircraftUtilModel");

				var oData = {};
				oData.equip = [];
				oData.flying = [];
				oData.mano = [];
				this.getView().setModel(new JSONModel(oData), "oAircraftDataUtilModel");
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:onInit function");
				this.handleException(e);
			}

		},
		onEquipRunEdit: function(oEvent) {

		},

		onCancelAddEquipCancel: function() {
			try {
				this.closeDialog("AddEquipRun");
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:onCancelAddEquipCancel function");
				this.handleException(e);
			}
		},
		onAddEquipRunLog: function() {
			try {
				this.openDialog("AddEquipRun", ".fragments.standalone.equiprunflylog.");
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:onAddEquipRunLog function");
				this.handleException(e);
			}
		},

		onProceedEquipRunLog: function(oEvent) {
			try {
				this.closeDialog("AddEquipRun");
				var oEngins = this.getModel("oAircraftDataUtilModel").getProperty("/equip");
				var sLogid = oEngins.length > 0 ? oEngins[0].logid : "";
				var oIndex = this.getModel("oAircraftUtilModel").getProperty("/selIndex");
				this.getRouter().navTo("AddEquipRunLog", {
					type: oIndex,
					logid: sLogid
				});
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:onProceedEquipRunLog function");
				this.handleException(e);
			}
		},

		_onObjectMatched: function(oEvent) {
			try {
				this.fnLoadEquipClm();
				this.fnLoadEquipData();
				this.fnLoadFlyingClm();
				this.fnLoadFlyingData();
				this.fnLoadManoClm();
				this.fnLoadManoData();
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:_onObjectMatched function");
				this.handleException(e);
			}
		},
		fnLoadEquipClm: function() {
			try {
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
						"/equiptabId") +
					" and otype eq C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oAircraftUtilModel").setProperty("/equip", oData.results);
					this.getModel("oAircraftUtilModel").refresh();
					this.fnCreateRow(this.getView().byId("tblEquip"), "oAircraftUtilModel", "equip", "oAircraftDataUtilModel");
				}.bind(this);
				ajaxutil.fnRead("/AircraftLogSvc", oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadEquipClm function");
				this.handleException(e);
			}
		},
		fnLoadEquipData: function() {
			try {

				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
					"/equiptabId") + " and otype eq AU";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results) {
						oData.results.forEach(function(oItem) {
							oItem.COL_12 = parseFloat(oItem.COL_12).toFixed(1);
						});
						this.getModel("oAircraftDataUtilModel").setProperty("/equip", oData.results);
					}
					this.getModel("oAircraftDataUtilModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/AircraftLogSvc", oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadEquipData function");
				this.handleException(e);
			}
		},
		fnLoadFlyingClm: function() {
			try {
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
						"/flyingtabId") +
					" and otype eq C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oAircraftUtilModel").setProperty("/flying", oData.results);
					this.getModel("oAircraftUtilModel").refresh();
					this.fnCreateRow(this.getView().byId("tblFlying"), "oAircraftUtilModel", "flying", "oAircraftDataUtilModel");
				}.bind(this);
				ajaxutil.fnRead("/AircraftLogSvc", oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadFlyingClm function");
				this.handleException(e);
			}
		},
		fnLoadFlyingData: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
					"/flyingtabId") + " and otype eq AU";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oAircraftDataUtilModel").setProperty("/flying", oData.results);
					this.getModel("oAircraftDataUtilModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/AircraftLogSvc", oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadFlyingData function");
				this.handleException(e);
			}
		},
		fnLoadManoClm: function() {
			try {
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
						"/manotabId") +
					" and otype eq C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oAircraftUtilModel").setProperty("/mano", oData.results);
					this.getModel("oAircraftUtilModel").refresh();
					this.fnCreateRow(this.getView().byId("tblMano"), "oAircraftUtilModel", "mano", "oAircraftDataUtilModel");
				}.bind(this);
				ajaxutil.fnRead("/AircraftLogSvc", oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadManoClm function");
				this.handleException(e);
			}
		},
		fnLoadManoData: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
					"/manotabId") + " and otype eq AU";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oAircraftDataUtilModel").setProperty("/mano", oData.results);
					this.getModel("oAircraftDataUtilModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/AircraftLogSvc", oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadManoData function");
				this.handleException(e);
			}
		},
		fnCreateRow: function(tblRef, oModel, sClmPath, oDataModel) {
			try {
				var oCells = [];
				this.getModel(oModel).getProperty("/" + sClmPath).forEach(function(oItem) {
					var sText = new sap.m.Text({
						text: "{" + oDataModel + ">" + oItem.colid + "}"
					});
					oCells.push(sText);
				});
				if (oCells.length === 0) {
					tblRef.setVisible(false);
				}
				var sColum = new sap.m.ColumnListItem({
					cells: oCells
				});
				tblRef.bindAggregation("items", oDataModel + ">/" + sClmPath, sColum);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnCreateRow function");
				this.handleException(e);
			}
		},
		fnLoadEngineLong: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					this.getModel("oAircraftUtilModel").setProperty("/engine", oData.results);
					this.getModel("oAircraftUtilModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/AircraftUtilizationSvc", oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadEngineLong function");
				this.handleException(e);
			}
		}

	});
});