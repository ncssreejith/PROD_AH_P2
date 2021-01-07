sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log",
	"avmet/ah/util/FilterOpEnum",
	"../util/ajaxutilNew"
], function(BaseController, dataUtil, JSONModel, formatter, ajaxutil, Log, FilterOpEnum, ajaxutilNew) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAJAT GUPTA 
	 *   Control name: AircraftOverview          
	 *   Purpose : Leading particular functionality
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
	return BaseController.extend("avmet.ah.controller.AircraftOverview", {
		formatter: formatter,

		onInit: function() {
			try {
				this.getRouter().getRoute("AircraftOverview").attachPatternMatched(this._handleRouteMatched, this);
			} catch (e) {
				Log.error("Exception in AircraftOverview:onInit function");
				this.handleException(e);
			}
		},

		onChangeTyreValue: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sContext = oSrc.getBindingContext("OverViewItemModel").getPath(),
					sObject = oSrc.getBindingContext("OverViewItemModel").getObject();
				var obj = {};
				obj.Item = sObject;
				obj.Type = "LPTYREPRES";
				this.changeArray["OverViewItemModel" + sContext] = obj;
				this.getModel("appModel").setProperty("/isCancelEnabled", false);
			} catch (e) {
				Log.error("Exception in AircraftOverview:onChangeTyreValue function");
				this.handleException(e);
			}
		},

		onChangeTankValue: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sContext = oSrc.getBindingContext("OverViewItemTankModel").getPath(),
					sObject = oSrc.getBindingContext("OverViewItemTankModel").getObject();
				var obj = {};
				obj.Item = sObject;
				obj.Type = "LPTANK";
				this.changeArray["OverViewItemTankModel" + sContext] = obj;
				this.getModel("appModel").setProperty("/isCancelEnabled", false);
			} catch (e) {
				Log.error("Exception in AircraftOverview:onChangeTankValue function");
				this.handleException(e);
			}
		},

		onChangeOilValue: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sContext = oSrc.getBindingContext("OverViewItemOILModel").getPath(),
					sObject = oSrc.getBindingContext("OverViewItemOILModel").getObject();
				var obj = {};
				obj.Item = sObject;
				obj.Type = "LPFUELOIL";
				this.changeArray["OverViewItemOILModel" + sContext] = obj;
				this.getModel("appModel").setProperty("/isCancelEnabled", false);
			} catch (e) {
				Log.error("Exception in AircraftOverview:onChangeOilValue function");
				this.handleException(e);
			}
		},

		onPressNavigateWnB: function() {
			try {
				this.getRouter().navTo("WeightBalance", {
					isEdit: false
				});
			} catch (e) {
				Log.error("Exception in AircraftOverview:onPressNavigateWnB function");
				this.handleException(e);
			}
		},

		onEditBtnPress: function() {
			try {
				var oModel = this.getModel("appModel");
				oModel.setProperty("/isSignOff", true);
				oModel.setProperty("/isCancelVis", true);
				oModel.setProperty("/isCancelEnabled", true);
				oModel.setProperty("/isEditBtnVis", false);
				this.getModel("OverViewItemTankModel").setProperty("/isTableEditable", true);
				this.getModel("OverViewItemModel").setProperty("/isTableEditable", true);
				this.getModel("OverViewItemOILModel").setProperty("/isTableEditable", true);
			} catch (e) {
				Log.error("Exception in AircraftOverview:onEditBtnPress function");
				this.handleException(e);
			}
		},

		onPresCancel: function() {
			try {
				var oModel = this.getModel("appModel");
				oModel.setProperty("/isSignOff", false);
				oModel.setProperty("/isCancelVis", false);
				oModel.setProperty("/isCancelEnabled", false);
				oModel.setProperty("/isEditBtnVis", true);
				this.getModel("OverViewItemTankModel").setProperty("/isTableEditable", false);
				this.getModel("OverViewItemModel").setProperty("/isTableEditable", false);
				this.getModel("OverViewItemOILModel").setProperty("/isTableEditable", false);
			} catch (e) {
				Log.error("Exception in AircraftOverview:onPresCancel function");
				this.handleException(e);
			}
		},

		onPresSignOff: function() {
			try {
				var headerModel = this.getModel("OverViewHeaderModel"),
					oPrmTask = {},
					that = this,
					oPayload = [];

				if (Object.keys(this.changeArray).length > 0) {
					for (var key in this.changeArray) {
						var obj = this.changeArray[key].Item;
						obj.REFID = headerModel.getProperty("/MODID");
						obj.USSERNR = headerModel.getProperty("/USSERNR");
						obj.AIRID = headerModel.getProperty("/AIRID");
						obj.TAILID = this.getTailId();
						oPayload.push(obj);
					}
				} else {
					var obj1 = this.getModel("OverViewItemTankModel").getData()[0];
					obj1.REFID = "X";
					obj1.USSERNR = headerModel.getProperty("/USSERNR");
					obj1.TAILID = this.getTailId();
					oPayload.push(obj1);
				}

				oPrmTask.filter = "";
				oPrmTask.error = function() {

				};

				oPrmTask.success = function(oData) {
					that.changeArray = {};
					that.getModel("OverViewItemTankModel").setProperty("/isTableEditable", false);
					that.getModel("OverViewItemOILModel").setProperty("/isTableEditable", false);
					that.getModel("OverViewItemModel").setProperty("/isTableEditable", false);
					that.getModel("appModel").setProperty("/isSignOff", false);
					this.getRouter().navTo("DashboardInitial");
				}.bind(this);
				oPrmTask.activity = 4; //Rahul: 25/11/2020 : 16:27 Code Added
				ajaxutilNew.fnUpdate(this.getResourceBundle().getText("LEADPARTISVC"), oPrmTask, oPayload, "ZRM_AC_O", this);
			} catch (e) {
				Log.error("Exception in AircraftOverview:onPresSignOff function");
				this.handleException(e);
			}
		},

		_fnAirOverViewItemGet: function(sAirID, sMODID, sTAILID) {
			try {
				var that = this,
					oPrmWB = {};
				//	oPrmWB.filter = "FLAG eq I and AIRID eq " + sAirID + " and MODID eq " + sMODID + " and TAILID eq " + sTAILID + " AND LPTYPE EQ LPTYREPRES";
				oPrmWB.filter = "FLAG" + FilterOpEnum.EQ + "I" + FilterOpEnum.AND + "AIRID" + FilterOpEnum.EQ + sAirID + FilterOpEnum.AND +
					"MODID" + FilterOpEnum.EQ + sMODID + FilterOpEnum.AND + "TAILID" + FilterOpEnum.EQ + sTAILID + FilterOpEnum.AND +
					"LPTYPE" + FilterOpEnum.EQ + "LPTYREPRES";
				oPrmWB.error = function() {

				};

				oPrmWB.success = function(oData) {
					if (oData !== undefined) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "OverViewItemModel");
					}

				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("LEADPARTISVC"), oPrmWB);
			} catch (e) {
				Log.error("Exception in AircraftOverview:_fnAirOverViewItemGet function");
				this.handleException(e);
			}
		},

		_fnAirOverViewItemTankGet: function(sAirID, sMODID, sTAILID) {
			try {
				var that = this,
					oPrmWB = {};
				// oPrmWB.filter = "FLAG eq I and AIRID eq " + sAirID + " and MODID eq " + sMODID + " and TAILID eq " + sTAILID +
				// 	" AND LPTYPE EQ LPTANK";

				oPrmWB.filter = "FLAG" + FilterOpEnum.EQ + "I" + FilterOpEnum.AND + "AIRID" + FilterOpEnum.EQ + sAirID + FilterOpEnum.AND +
					"MODID" + FilterOpEnum.EQ + sMODID + FilterOpEnum.AND + "TAILID" + FilterOpEnum.EQ + sTAILID + FilterOpEnum.AND +
					"LPTYPE" + FilterOpEnum.EQ + "LPTANK";
				oPrmWB.error = function() {

				};

				oPrmWB.success = function(oData) {
					if (oData !== undefined) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "OverViewItemTankModel");
						that.getView().setModel(new JSONModel({}), "OverViewItemTankModelChange");
						this.getModel("OverViewItemTankModelChange").setData(JSON.parse(JSON.stringify(oData.results)));
					}
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("LEADPARTISVC"), oPrmWB);
			} catch (e) {
				Log.error("Exception in AircraftOverview:_fnAirOverViewItemTankGet function");
				this.handleException(e);
			}
		},

		_fnAirOverViewItemOilGet: function(sAirID, sMODID, sTAILID) {
			try {
				var that = this,
					oPrmWB = {};
				// oPrmWB.filter = "FLAG eq I and AIRID eq " + sAirID + " and MODID eq " + sMODID + " and TAILID eq " + sTAILID +
				// 	" AND LPTYPE EQ LPFUELOIL";
				oPrmWB.filter = "FLAG" + FilterOpEnum.EQ + "I" + FilterOpEnum.AND + "AIRID" + FilterOpEnum.EQ + sAirID + FilterOpEnum.AND +
					"MODID" + FilterOpEnum.EQ + sMODID + FilterOpEnum.AND + "TAILID" + FilterOpEnum.EQ + sTAILID + FilterOpEnum.AND +
					"LPTYPE" + FilterOpEnum.EQ + "LPFUELOIL";
				oPrmWB.error = function() {

				};

				oPrmWB.success = function(oData) {
					if (oData !== undefined) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "OverViewItemOILModel");
					}
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("LEADPARTISVC"), oPrmWB);
			} catch (e) {
				Log.error("Exception in AircraftOverview:_fnAirOverViewItemOilGet function");
				this.handleException(e);
			}
		},

		_fnAirOverViewHeaderGet: function() {
			try {
				var that = this,
					oPrmWB = {};
				//		oPrmWB.filter = "FLAG eq H and TAILID eq " + this.getTailId() + " AND LPTYPE EQ LPHEADER";
				oPrmWB.filter = "FLAG" + FilterOpEnum.EQ + "H" + FilterOpEnum.AND + "TAILID" + FilterOpEnum.EQ + this.getTailId() + FilterOpEnum.AND +
					"LPTYPE" + FilterOpEnum.EQ + "LPHEADER";
				oPrmWB.error = function() {

				};

				oPrmWB.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results[0]);
						that.getView().setModel(oModel, "OverViewHeaderModel");
						this._fnAirOverViewItemGet(oData.results[0].AIRID, oData.results[0].MODID, oData.results[0].TAILID);
						this._fnAirOverViewItemTankGet(oData.results[0].AIRID, oData.results[0].MODID, oData.results[0].TAILID);
						this._fnAirOverViewItemOilGet(oData.results[0].AIRID, oData.results[0].MODID, oData.results[0].TAILID);
						var bFlag = oData.results[0].LPSTAT === "P" ? false : true;
						this.getModel("appModel").setProperty("/isEditBtnVis", bFlag);
						this.getModel("appModel").setProperty("/isSignOff", false);
					}
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("LEADPARTISVC"), oPrmWB);
			} catch (e) {
				Log.error("Exception in AircraftOverview:_fnAirOverViewHeaderGet function");
				this.handleException(e);
			}
		},

		_handleRouteMatched: function() {
			try {
				var that = this,
					sTailId = this.getTailId(),
					sAirId = this.getAircraftId(),
					sModId = this.getModelId();
				var oAppModel = dataUtil.createNewJsonModel();
				oAppModel.setData({
					"sTailId": sTailId,
					"sModId": sModId,
					"sAirId": sAirId,
					"sUser": "",
					"sDate": "",
					"ItemI": 1,
					"ItemO": 1,
					"SQNId": 1,
					"itbAircraftOverviewKey": "Tank"
				});
				this.getView().setModel(oAppModel, "appModel");
				this.changeArray = {};
				this._fnAirOverViewHeaderGet();
			} catch (e) {
				Log.error("Exception in AircraftOverview:_handleRouteMatched function");
				this.handleException(e);
			}

		}
	});
});