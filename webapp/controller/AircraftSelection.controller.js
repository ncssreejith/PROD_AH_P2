sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"../model/formatter",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, dataUtil, Fragment, formatter, FieldValidations, ajaxutil, JSONModel, Log) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.AircraftSelection", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			var that = this;
			this.getView().setModel(new JSONModel({}), "oViewModel");
			this.getRouter().getRoute("AircraftSelection").attachPatternMatched(this._onObjectMatched, this);
			var oModel = new JSONModel({
				models: [],
				tails: [],
				engine: [],
				sqn: [],
				wc: [],
				modelsDis: [],
				srcBy: "type",
				selInput: "",
				selTab: "AIR",
				sel: {
					airid: dataUtil.getDataSet(this.getOwnerComponent().appModel).login.airid,
					modid: "",
					modidtx: "",
					tailid: "",
					tailno: "",
					sqnid: dataUtil.getDataSet(this.getOwnerComponent().appModel).login.sqnid,
					sqntx: dataUtil.getDataSet(this.getOwnerComponent().appModel).login.sqntx,
					wcid: dataUtil.getDataSet(this.getOwnerComponent().appModel).login.wcid,
					wctx: dataUtil.getDataSet(this.getOwnerComponent().appModel).login.wctx,
					engid: "",
					modiddis: ""
				}
			});
			this.getView().setModel(oModel, "oAirSelectViewModel");
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		//1.on select of aircfart model 
		onAircraftModelSelect: function(oEvent) {
			var oObject = oEvent.getParameter("item").getBindingContext("oAirSelectViewModel").getObject();
			this.getModel("oAirSelectViewModel").setProperty("/sel/modidtx", oObject.mod);
			this.getModel("oAirSelectViewModel").refresh();
			this.fnLoadTails();
		},
		onAircraftTailSelect: function(oEvent) {
			var oObject = oEvent.getParameter("item").getBindingContext("oAirSelectViewModel").getObject();
			this.getModel("oAirSelectViewModel").setProperty("/sel/tailno", oObject.tailno);
			this.getModel("oAirSelectViewModel").refresh();
			this.onPressAircraftSelect();
		},

		onAircraftSqnSelect: function(oEvent) {
			var oObject = oEvent.getParameter("item").getBindingContext("oAirSelectViewModel").getObject();
			this.getModel("oAirSelectViewModel").setProperty("/sel/sqntx", oObject.description1);
			this.getModel("oAirSelectViewModel").refresh();
			this.fnLoadWorkCenter();
		},
		onAircraftWCSelect: function(oEvent) {
			var oObject = oEvent.getParameter("item").getBindingContext("oAirSelectViewModel").getObject();
			this.getModel("oAirSelectViewModel").setProperty("/sel/wctx", oObject.name);
			this.getModel("oAirSelectViewModel").refresh();
			this.fnLoadEngin();
			this.fnLoadEnginDistinct();
		},

		onEngineSearch: function(oEvent) {
			var oSelType = this.getModel("oAirSelectViewModel").getProperty("/srcBy");
			var sInput = this.getModel("oAirSelectViewModel").getProperty("/selInput");
			if (oSelType === "serial") {
				this.fnLoadEnginBySernr(sInput);
				return;
			}
			// if (oSelType === "serial") {
			// 	this.getRouter().navTo("CosEngine", {
			// 		engtype: sInput,
			// 		selFlag: (oSelType === "serial") ? "1" : "0"
			// 	});
			// 	return;
			// }
			this.fnLoadEngin(sInput);
		},

		onEnginePress: function(oEvent) {
			this.getModel("oAirSelectViewModel").setProperty("/sel/engid", oEvent.getSource().getBindingContext("oAirSelectViewModel").getObject(
				"ENGID"));
			/*	var oSelType = this.getModel("oAirSelectViewModel").getProperty("/srcBy");
				var sInput = this.getModel("oAirSelectViewModel").getProperty("/selInput");
				var sSelTab = this.getModel("oAirSelectViewModel").getProperty("/selTab");*/
			this.getModel("oAirSelectViewModel").setProperty("/sel/tailid", "NA");
			this.getModel("oAirSelectViewModel").setProperty("/sel/tailno", "NA");
			// this.getModel("avmetModel").setProperty("/dash/tailid", "NA");
			var oData = this.getModel("oAirSelectViewModel").getProperty("/sel");
			var sData = dataUtil.getDataSet(this.getOwnerComponent().appModel);
			sData.airSel = oData;
			dataUtil.setDataSet(this.getOwnerComponent().appModel, sData);
			this.getRouter().navTo("Engine", {
				ENGID: sData.airSel.engid
			});
		},

		//2.on press of set mass limitaions
		onSetMassLimitation: function() {
			this.getRouter().navTo("MassLimitation");
		},
		onPressAircraftSelect: function() {
			var oSelType = this.getModel("oAirSelectViewModel").getProperty("/srcBy");
			var sInput = this.getModel("oAirSelectViewModel").getProperty("/selInput");
			var sSelTab = this.getModel("oAirSelectViewModel").getProperty("/selTab");
			var oData = this.getModel("oAirSelectViewModel").getProperty("/sel");
			var sData = dataUtil.getDataSet(this.getOwnerComponent().appModel);
			sData.airSel = oData;
			dataUtil.setDataSet(this.getOwnerComponent().appModel, sData);

			if (sSelTab === "EG") {
				this.getRouter().navTo("CosEngine", {
					engtype: sInput,
					selFlag: (oSelType === "type") ? "1" : "0"
				});
				return;
			}
			this.getRouter().navTo("DashboardInitial");
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			this.fnLoadModels();
			this.fnLoadSquadran();

		},

		fnLoadTails: function() {
			var selAirId = this.getModel("oAirSelectViewModel").getProperty("/sel/airid");
			var selModId = this.getModel("oAirSelectViewModel").getProperty("/sel/modid");
			var oParameter = {};
			oParameter.filter = "airid eq " + selAirId + " and modid eq " + selModId;
			oParameter.error = function() {

			};
			oParameter.success = function(oData) {
				var emptyVal = {
					LOCID: null,
					airid: "NA",
					modid: "NA",
					tailid: "NA",
					tailno: "NA"
				};
				var aResult = [];
				aResult.push(emptyVal);
				aResult = aResult.concat(oData.results);
				this.getModel("oAirSelectViewModel").setProperty("/tails", aResult);
				this.getModel("oAirSelectViewModel").setProperty("/sel/tailid", "NA");
				this.getModel("oAirSelectViewModel").setProperty("/sel/tailno", "NA");
				//this.getModel("oAirSelectViewModel").setProperty("/sel/tailno", oData.results.length > 0 ? oData.results[0].tailno : "");
				this.getModel("oAirSelectViewModel").refresh();
				this.fnLoadEnginDistinct();
			}.bind(this);
			ajaxutil.fnRead(this.getResourceBundle().getText("AIRTAILSVC"), oParameter);
		},

		fnLoadModels: function() {
			var selAirId = this.getModel("oAirSelectViewModel").getProperty("/sel/airid");
			var oParameter = {};
			oParameter.filter = "airid eq " + selAirId;
			oParameter.error = function() {

			};
			oParameter.success = function(oData) {
				this.getModel("oAirSelectViewModel").setProperty("/models", oData.results);
				this.getModel("oAirSelectViewModel").setProperty("/sel/modid", oData.results.length > 0 ? oData.results[0].modid : "");
				this.getModel("oAirSelectViewModel").setProperty("/sel/modidtx", oData.results.length > 0 ? oData.results[0].mod : "");
				this.getModel("oAirSelectViewModel").refresh();
				this.fnLoadTails();
			}.bind(this);
			ajaxutil.fnRead(this.getResourceBundle().getText("AIRMODELSVC"), oParameter);
		},

		fnLoadSquadran: function() {
			var selAirId = this.getModel("oAirSelectViewModel").getProperty("/sel/airid");
			var oParameter = {};
			oParameter.filter = "refid eq " + selAirId + " and ddid eq SQN";
			oParameter.error = function() {

			};
			oParameter.success = function(oData) {
				this.getModel("oAirSelectViewModel").setProperty("/sqn", oData.results);
				this.getModel("oAirSelectViewModel").refresh();
				// this.getModel("oAirSelectViewModel").setProperty("/sel/sqnid", oData.results.length > 0 ? oData.results[0].ddid : "");
				this.fnLoadWorkCenter();
			}.bind(this);
			ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oParameter);
		},
		fnLoadWorkCenter: function() {
			var sqnId = this.getModel("oAirSelectViewModel").getProperty("/sel/sqnid");
			var oParameter = {};
			oParameter.filter = "SQNWC eq " + sqnId;
			oParameter.error = function() {

			};
			oParameter.success = function(oData) {
				this.getModel("oAirSelectViewModel").setProperty("/wc", oData.results);
				this.getModel("oAirSelectViewModel").refresh();
				// this.getModel("oAirSelectViewModel").setProperty("/sel/wcid", oData.results.length > 0 ? oData.results[0].wrctr : "");
				// this.fnLoadTails();
			}.bind(this);
			ajaxutil.fnRead(this.getResourceBundle().getText("GETWORKCENTERSVC"), oParameter);
		},
		fnLoadEngin: function(sEngType) {
			var selTailid = 
			// this.getModel("oAirSelectViewModel").getProperty("/sel/tailid")
			// + " and 
			"ENGTY eq " + sEngType;
			var oParameter = {};
			oParameter.filter = 
			// "tailid eq '" + 
			selTailid;
			oParameter.error = function() {

			};
			oParameter.success = function(oData) {
				this.getModel("oAirSelectViewModel").setProperty("/engine", oData.results);
				this.getModel("oAirSelectViewModel").setProperty("/sel/engid", oData.results.length > 0 ? oData.results[0].ENGID : "");
				this.getModel("oAirSelectViewModel").refresh();
				// this.fnLoadTails();
			}.bind(this);
			ajaxutil.fnRead(this.getResourceBundle().getText("ENGINESVC"), oParameter);
		},
		/** 
		 * Search by sernr
		 */
		fnLoadEnginBySernr: function(sSernr) {
			try {
				// var selTailid = this.getModel("oAirSelectViewModel").getProperty("/sel/tailid");
				var oParameter = {};
				oParameter.filter = "SERIAL eq " + sSernr;
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					this.getModel("oAirSelectViewModel").setProperty("/engine", oData.results);
					this.getModel("oAirSelectViewModel").setProperty("/sel/engid", oData.results.length > 0 ? oData.results[0].ENGID : "");
					this.getModel("oAirSelectViewModel").refresh();
					// this.fnLoadTails();
				}.bind(this);
				this.getModel("oAirSelectViewModel").setProperty("/engine", []);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETRSERNOSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in fnLoadEnginBySernr function");
			}
		},
		fnLoadEnginDistinct: function() {
			var selTailid = this.getModel("oAirSelectViewModel").getProperty("/sel/tailid");
			
			var oParameter = {};
			oParameter.filter = "tailid eq '" + selTailid + "'";
			oParameter.error = function() {

			};
			oParameter.success = function(oData) {
				this.getModel("oAirSelectViewModel").setProperty("/modelsDis", oData.results);
				this.getModel("oAirSelectViewModel").setProperty("/sel/modiddis", oData.results.length > 0 ? oData.results[0].modid : "");
				this.getModel("oAirSelectViewModel").refresh();
				// this.fnLoadTails();
			}.bind(this);
			ajaxutil.fnRead(this.getResourceBundle().getText("ENGINEDISSVC"), oParameter);
		}
	});
});