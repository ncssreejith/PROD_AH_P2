sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/model/json/JSONModel",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log",
	"../util/ajaxutilNew",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, JSONModel, FieldValidations, ajaxutil, formatter, Log, ajaxutilNew, FilterOpEnum) {
	"use strict";

	/* ***************************************************************************
	 *     Developer : RAJAT GUPTA 
	 *   Control name: WeightBalance          
	 *   Purpose : Weight and balance functionality
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onSignOffPress
	 *     2. Backend Calls
	 *        2.1 fnLogById
	 *     3. Private calls
	 *        3.1 _onObjectMatched
	 *        3.2 fnSetReason
	 *   Note :
	 *************************************************************************** */

	return BaseController.extend("avmet.ah.controller.WeightBalance", {
		formatter: formatter,
		onInit: function() {
			try {
				this.getRouter().getRoute("WeightBalance").attachPatternMatched(this._handleRouteMatched, this);
			} catch (e) {
				Log.error("Exception in WeightBalance:onInit function");
				this.handleException(e);
			}
		},
		onUpdateRecords: function() {
			try {
				var that = this;
				var oData = this.getModel("WeightBalanceHeaderSet").getData();
				var bFlag = "A";
				for (var i in oData) {
					if (oData[i].WTIND === "W" && oData[i].FLAG === "X") {
						bFlag = "W";
					}
				}
				var router = sap.ui.core.UIComponent.getRouterFor(that);
				router.navTo("UpdateWeightBalance", {
					Type: bFlag
				});
			} catch (e) {
				Log.error("Exception in WeightBalance:onUpdateRecords function");
				this.handleException(e);
			}
		},
		onPastRecords: function() {
			try {
				var that = this;
				var router = sap.ui.core.UIComponent.getRouterFor(that);
				router.navTo("PastHistoryWeightBalance");
			} catch (e) {
				Log.error("Exception in WeightBalance:onPastRecords function");
				this.handleException(e);
			}
		},

		//*************************************************************************************************************
		//           2. Database/Ajax/OData Calls
		//*************************************************************************************************************
		_fnWeightBalanceItemGet: function(sTailId) {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel(),
					oPrmWB = {};
				oPrmWB.filter = "tailid eq '" + sTailId + "'";
				oPrmWB.error = function() {

				};

				oPrmWB.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {

						oModel.setData(oData.results);

					} else {
						oModel.setData(null);
					}
					that.getView().setModel(oModel, "WeightBalanceItemSet");

				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("WEBALSVC"), oPrmWB);
			} catch (e) {
				Log.error("Exception in WeightBalance:_fnWeightBalanceItemGet function");
				this.handleException(e);
			}
		},

		_fnGetWeightBalHeaderSet: function(sTailId) {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel(),
					oPrmWBM = {};
				if (that.getTailId()) {
					//	oPrmWBM.filter = "tailid eq " + that.getTailId() + " and MOD eq A";
					oPrmWBM.filter = "tailid" + FilterOpEnum.EQ + that.getTailId() + FilterOpEnum.AND + "MOD" + FilterOpEnum.EQ + "A"; // Phase 2 Changes
				} else {
					sap.m.MessageToast.show("Invalid parameter");
				}

				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {

						oModel.setData(oData.results);

						var oAppModel = this.getView().getModel("appModel");
						oAppModel.setProperty("/sUser", oData.results[0].SGUSR);
						oAppModel.setProperty("/sDate", oData.results[0].SGDTM);
						oAppModel.setProperty("/sTime", oData.results[0].SGUZT);
						oAppModel.setProperty("/sUser1", oData.results[0].SGUSR);
						oAppModel.setProperty("/sDate1", oData.results[0].SGDTM);
						oAppModel.setProperty("/sTime1", oData.results[0].SGUZT);
						oAppModel.setProperty("/sUser2", oData.results[0].ENUsr);
						oAppModel.setProperty("/sDate2", oData.results[0].Endtm);
						oAppModel.setProperty("/sTime2", oData.results[0].Enuzt);
						var bFlag = oData.results[0].CFLAG === "X" ? false : true;
						if (this.getModel("appModel").getProperty("/isEdit") && bFlag) {
							oAppModel.setProperty("/isVisUpdateRecords", true);
						} else {
							oAppModel.setProperty("/isVisUpdateRecords", false);
						}

						for (var i in oData.results) {
							if (oData.results[i].WTIND === "W") {
								var bFlag = oData.results[i].FLAG === "X" ? true : false;
								this.getModel("appModel").setProperty("/isWeightedVisible", bFlag);
							}
						}
						this._fnGetWeightBalanceItemSet(oData.results[0].WABID);
					} else {
						oModel.setData(null);
						/*	sap.m.MessageToast.show("No Response from server");*/
					}
					that.getView().setModel(oModel, "WeightBalanceHeaderSet");
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("WEBALHSVC"), oPrmWBM);
			} catch (e) {
				Log.error("Exception in WeightBalance:_fnGetWeightBalHeaderSet function");
				this.handleException(e);
			}
		},

		_fnGetWeightPastRecord: function(sWABID, sTAILID) {
			try {
				var that = this,
					oPrmWBM = {};
				//	oPrmWBM.filter = "tailid eq " + sTAILID + " and WABID eq " + sWABID;
				oPrmWBM.filter = "tailid" + FilterOpEnum.EQ + sTAILID + FilterOpEnum.AND + "WABID" + FilterOpEnum.EQ + sWABID; // Phase 2 Changes	
				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "WeightBalanceHeaderSet");
						var oAppModel = this.getView().getModel("appModel");
						oAppModel.setProperty("/sUser", oData.results[0].SGUSR);
						oAppModel.setProperty("/sDate", oData.results[0].SGDTM);
						oAppModel.setProperty("/sUser1", oData.results[0].SGUSR);
						oAppModel.setProperty("/sDate1", oData.results[0].SGDTM);
						oAppModel.setProperty("/sUser2", oData.results[0].ENUsr);
						oAppModel.setProperty("/sDate2", oData.results[0].Endtm);
						for (var i in oData.results) {
							if (oData.results[i].WTIND === "W") {
								var bFlag = oData.results[i].FLAG === "X" ? true : false;
								this.getModel("appModel").setProperty("/isWeightedVisible", bFlag);
							}
						}
						this._fnGetWeightBalanceItemSet(oData.results[0].WABID);
					}
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETWBHFROMIDSVC"), oPrmWBM);
			} catch (e) {
				Log.error("Exception in WeightBalance:_fnGetWeightPastRecord function");
				this.handleException(e);
			}
		},

		_fnGetWeightBalanceItemSet: function(sWABID) {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel(),
					oPrmWBM = {};
				//	oPrmWBM.filter = "WABID eq " + sWABID;
				oPrmWBM.filter = "WABID" + FilterOpEnum.EQ + sWABID; // Phase 2 Changes
				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						oModel.setData(oData.results);

					} else {
						oModel.setData(null);
					}
					that.getView().setModel(oModel, "WeightBalanceSet");
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("WEBALISVC"), oPrmWBM);
			} catch (e) {
				Log.error("Exception in WeightBalance:_fnGetWeightBalanceItemSet function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//   4. Private Function   
		// ***************************************************************************
		//	4.1 First level Private functions
		_handleRouteMatched: function(oEvent) {
			try {
				var sTailId,
					sModId,
					sAirId, oAircraftModel = this.getModel("AirCraftSelectionModel");

				sTailId = this.getTailId();
				sAirId = this.getAircraftId();
				sModId = this.getModelId();
				var oAppModel = dataUtil.createNewJsonModel();
				oAppModel.setData({
					"sTailId": sTailId,
					"sModId": sModId,
					"sAirId": sAirId,
					"sUser": "",
					"sDate": "",
					"sUser1": "",
					"sDate1": "",
					"sUser2": "",
					"sDate2": ""
				});
				var sValue = oEvent.getParameter("arguments").isEdit;
				var bFlag = sValue === "false" ? false : true;
				this.getView().setModel(oAppModel, "appModel");
				this.getModel("appModel").setProperty("/isVisPastRecords", bFlag);
				this.getModel("appModel").setProperty("/isEdit", bFlag);

				this.getModel("avmetModel").getProperty("/dash/astid");

				var bPastRec = oEvent.getParameter("arguments").isPastHistory;
				if (bPastRec) {
					var sWABID = oEvent.getParameter("arguments").WABID;
					var sTAILID = oEvent.getParameter("arguments").TAILID;
					this._fnGetWeightPastRecord(sWABID, sTAILID);
				} else {
					this._fnGetWeightBalHeaderSet(sTailId);
				}
			} catch (e) {
				Log.error("Exception in WeightBalance:_handleRouteMatched function");
				this.handleException(e);
			}

		}
	});
});