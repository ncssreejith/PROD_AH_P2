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

	return BaseController.extend("avmet.ah.controller.UpdateWeightBalance", {
		formatter: formatter,
		/**  Rahul
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ZWeightandBalanceV.view.UpdateView
		 */
		onInit: function() {
			this.getRouter().getRoute("UpdateWeightBalance").attachPatternMatched(this._handleRouteMatched, this);
		},
		onAddRoutineTask: function(oEvent) {
			var aItems = this.getView().getModel("WeightBalanceNewSet").getData();
			var oModel = this.getView().getModel("appModel");
			var sItem = oModel.getProperty("/ItemI");
			var sSQNId = oModel.getProperty("/SQNId");
			var oObj = {
				"IDATEM": new Date(),
				"IDESC": "",
				"WEIGHT": "",
				"ARM": "",
				"MOMENT": "",
				"vVisibleInput": "N",
				"IINDI": "I",
				"ITEM": "",
				"SGUSR": "Test User",
				"SGDTM": new Date(),
				"SGUZT": new Date().getHours() + ":" + new Date().getMinutes(),
				"SGUSR1": "Test User1",
				"SGDTM1": new Date(),
				"SGUZT1": new Date().getHours() + ":" + new Date().getMinutes(),
				"TailID": oModel.getProperty("/sTailId"),
				"WABID": "",
				"WTIND": null,
				"ENUSR": null,
				"ENDTM": null,
				"ENUZT": null,
				"STATUS": null,
				"LAST": null,
				"SEQNR": sSQNId,
				"UFLAG": null
			};
			aItems.push(oObj);
			this.getView().getModel("WeightBalanceNewSet").updateBindings(true);
			oModel.setProperty("/ItemI", sItem + 1);
			sSQNId = sSQNId + 1;
			oModel.setProperty("/SQNId", sSQNId);
			oModel.updateBindings(true);
		},

		onAddRoutineTask1: function(oEvent) {
			var aItems = this.getView().getModel("WeightBalanceNewSet").getData();
			var oModel = this.getView().getModel("appModel");
			var sItem = oModel.getProperty("/ItemO");
			var sSQNId = oModel.getProperty("/SQNId");
			var oObj = {
				"IDATEM": new Date(),
				"IDESC": "",
				"WEIGHT": "",
				"ARM": "",
				"MOMENT": "",
				"vVisibleInput": "N",
				"IINDI": "O",
				"ITEM": "",
				"SGUSR": "Test User",
				"SGDTM": new Date(),
				"SGUZT": new Date().getHours() + ":" + new Date().getMinutes(),
				"SGUSR1": "Test User1",
				"SGDTM1": new Date(),
				"SGUZT1": new Date().getHours() + ":" + new Date().getMinutes(),
				"TailID": oModel.getProperty("/sTailId"),
				"WABID": "",
				"WTIND": null,
				"ENUSR": null,
				"ENDTM": null,
				"ENUZT": null,
				"STATUS": null,
				"LAST": null,
				"SEQNR": sSQNId,
				"UFLAG": null
			};
			aItems.push(oObj);
			this.getView().getModel("WeightBalanceNewSet").updateBindings(true);
			oModel.setProperty("/ItemO", sItem + 1);
			sSQNId = sSQNId + 1;
			oModel.setProperty("/SQNId", sSQNId + 1);
			oModel.updateBindings(true);

		},
		onNavBack: function() {
			var that = this;
			var router = sap.ui.core.UIComponent.getRouterFor(that);
			router.navTo("WeightBalance");
		},

		/* Function: onSelectionNatureofJobChange
		 * Parameter: sValue
		 * Description: To select Nature of Job segments.
		 */
		onSelectionNatureofJobChange: function(sValue) {
			var oSegmentedButton = this.byId('SBWeight');

			var oFlag = oSegmentedButton.getSelectedKey() === "Y" ? true : false;
			this.getView().byId("WeManId").setVisible(oFlag);

		},

		onChangeWeightAdd: function(oEvent) {
			var oModel = this.getView().getModel("WeightBalanceNewSet").getData(),
				oTotalAdd = 0.0,
				sTotal = 0.0,
				oTotalArm,
				oTotalMinus = 0.0,
				oMainModel = this.getView().getModel("WeightBalanceHeaderSet"),
				oObject, oWeightObj, oWeightObjPath;

			if (oEvent) {
				oObject = oEvent.getSource().getParent().getParent().getBindingContext("WeightBalanceNewSet");
				oWeightObj = oObject.getObject();
				oWeightObjPath = oObject.getPath();
				oTotalArm = (oWeightObj.MOMENT / oWeightObj.WEIGHT) * 100;
				this.getModel("WeightBalanceNewSet").setProperty(oWeightObjPath + "/ARM", (parseFloat(oTotalArm)).toFixed(3));
				this.getModel("WeightBalanceNewSet").refresh();
			}

			for (var i = 0; i < oModel.length; i++) {
				var val = oModel[i].WEIGHT === "" ? 0 : oModel[i].WEIGHT;
				if (oModel[i].IINDI === "O") {
					oTotalMinus = oTotalMinus + parseFloat(parseFloat(val).toFixed(2));
				} else if (oModel[i].IINDI === "I") {
					oTotalAdd = oTotalAdd + parseFloat(parseFloat(val).toFixed(2));
				}
			}

			var sPreviousWeight = oMainModel.getProperty("/TotalWeightSet/0/WEIGHT");
			sTotal = oTotalAdd + parseFloat(parseFloat(sPreviousWeight).toFixed(2));
			sTotal = sTotal - oTotalMinus;

			oMainModel.setProperty("/AutoCal/0/WEIGHT", sTotal.toFixed(2));
			var bFlag = this.getModel("WeightBalanceHeaderSet").getProperty("/WeightedWght/0/FLAG");
			// if (bFlag) {
			// 	var sVal = oMainModel.getProperty("/WeightedWght/0/WEIGHT");
			// 	oTotalAdd = oTotalAdd + parseFloat(sVal);
			// 	sTotal = oTotalAdd - oTotalMinus;
			// 	oMainModel.setProperty("/WeightedWght/0/WEIGHT", sTotal.toString());
			// }
			oMainModel.setProperty("/WeightedWght/0/WEIGHT", sTotal.toFixed(2));

			this.getView().getModel("WeightBalanceNewSet").updateBindings(true);
			this.getView().getModel("WeightBalanceHeaderSet").updateBindings(true);
		},

		onAutoCalUpdateFinished: function() {
			try {
				var oModel = this.getView().getModel("WeightBalanceHeaderSet"),
					sWeight, sArm, sMoment, oTotal;
				sWeight = oModel.getProperty("/AutoCal/0/WEIGHT");
				sArm = oModel.getProperty("/AutoCal/0/ARM");
				sMoment = oModel.getProperty("/AutoCal/0/MOMENT");
				oTotal = (sMoment / sWeight) * 100;
				oModel.setProperty("/AutoCal/0/ARM", (parseFloat(oTotal)).toFixed(3));
				oModel.refresh();
			} catch (e) {
				Log.error("Exception in onAutoCalUpdateFinished function");
			}
		},

		onWeightWaitUpdateFinished: function() {
			try {
				var oModel = this.getView().getModel("WeightBalanceHeaderSet"),
					sWeightWW, sArmWW, sMomentWW, oTotalWW;
				sWeightWW = oModel.getProperty("/WeightedWght/0/WEIGHT");
				sArmWW = oModel.getProperty("/WeightedWght/0/ARM");
				sMomentWW = oModel.getProperty("/WeightedWght/0/MOMENT");
				oTotalWW = (sMomentWW / sWeightWW) * 100;
				oModel.setProperty("/WeightedWght/0/ARM", (parseFloat(oTotalWW)).toFixed(3));
				oModel.refresh();
			} catch (e) {
				Log.error("Exception in onWeightWaitUpdateFinished function");
			}
		},

		onChangeMomentAdd: function(oEvent) {
			var oModel = this.getView().getModel("WeightBalanceNewSet").getData(),
				oTotalAdd = 0,
				sTotal = 0,
				oTotalMinus = 0,
				oMainModel = this.getView().getModel("WeightBalanceHeaderSet"),
				oTotalArm, oObject, oWeightObj, oWeightObjPath;
			if (oEvent) {
				oObject = oEvent.getSource().getParent().getParent().getBindingContext("WeightBalanceNewSet");
				oWeightObj = oObject.getObject();
				oWeightObjPath = oObject.getPath();
				oTotalArm = (oWeightObj.MOMENT / oWeightObj.WEIGHT) * 100;
				this.getModel("WeightBalanceNewSet").setProperty(oWeightObjPath + "/ARM", (parseFloat(oTotalArm)).toFixed(3));
				this.getModel("WeightBalanceNewSet").refresh();
			}
			for (var i = 0; i < oModel.length; i++) {
				var val = oModel[i].MOMENT === undefined ? 0 : oModel[i].MOMENT;
				if (oModel[i].IINDI === "O") {
					oTotalMinus = oTotalMinus + parseFloat(parseFloat(val).toFixed(2));
				} else if (oModel[i].IINDI === "I") {
					oTotalAdd = oTotalAdd + parseFloat(parseFloat(val).toFixed(2));
				}
			}

			var sPreviousWeight = oMainModel.getProperty("/TotalWeightSet/0/MOMENT");
			sTotal = oTotalAdd + parseFloat(parseFloat(sPreviousWeight).toFixed(2));
			sTotal = sTotal - oTotalMinus;

			oMainModel.setProperty("/AutoCal/0/MOMENT", sTotal.toFixed(2));
			var bFlag = this.getModel("WeightBalanceHeaderSet").getProperty("/WeightedWght/0/FLAG");
			// if (bFlag) {
			// 	var sVal = oMainModel.getProperty("/WeightedWght/0/MOMENT");
			// 	oTotalAdd = oTotalAdd + parseFloat(sVal);
			// 	sTotal = oTotalAdd - oTotalMinus;
			// 	oMainModel.setProperty("/WeightedWght/0/MOMENT", sTotal.toString());
			// }
			oMainModel.setProperty("/WeightedWght/0/MOMENT", sTotal.toFixed(2));

			this.getView().getModel("WeightBalanceNewSet").updateBindings(true);
			this.getView().getModel("WeightBalanceHeaderSet").updateBindings(true);
		},

		onChangeArmAdd: function() {
			var oModel = this.getView().getModel("WeightBalanceNewSet").getData(),
				oTotalAdd = 0,
				sTotal = 0,
				oTotalMinus = 0,
				oMainModel = this.getView().getModel("WeightBalanceHeaderSet");
			for (var i = 0; i < oModel.length; i++) {
				var val = oModel[i].ARM === undefined ? 0 : oModel[i].ARM;
				if (oModel[i].IINDI === "O") {
					oTotalMinus = oTotalMinus + parseFloat(parseFloat(val).toFixed(2));
				} else if (oModel[i].IINDI === "I") {
					oTotalAdd = oTotalAdd + parseFloat(parseFloat(val).toFixed(2));
				}
			}

			var sPreviousWeight = oMainModel.getProperty("/TotalWeightSet/0/ARM");
			sTotal = oTotalAdd + parseFloat(parseFloat(sPreviousWeight).toFixed(2));
			sTotal = sTotal - oTotalMinus;

			oMainModel.setProperty("/AutoCal/0/ARM", sTotal.toFixed(2));
			var bFlag = this.getModel("WeightBalanceHeaderSet").getProperty("/WeightedWght/0/FLAG");
			// if (bFlag) {
			// 	var sVal = oMainModel.getProperty("/WeightedWght/0/ARM");
			// 	oTotalAdd = oTotalAdd + parseFloat(sVal);
			// 	sTotal = oTotalAdd - oTotalMinus;
			// 	oMainModel.setProperty("/WeightedWght/0/ARM", sTotal.toString());
			// }
			oMainModel.setProperty("/WeightedWght/0/ARM", sTotal.toFixed(2));

			this.getView().getModel("WeightBalanceNewSet").updateBindings(true);
			this.getView().getModel("WeightBalanceHeaderSet").updateBindings(true);
		},

		onDeleteAddedWeight: function(oEvent) {
			var oContext = oEvent.getSource().getBindingContext("WeightBalanceNewSet").getPath(),
				aItems = this.getModel("WeightBalanceNewSet").getData(),
				sIndex = oContext.split("/")[1],
				oModel = this.getView().getModel("appModel"),
				sItem = oModel.getProperty("/ItemI"),
				sSQNId = oModel.getProperty("/SQNId");

			aItems.splice(sIndex, 1);
			this.getView().getModel("WeightBalanceNewSet").updateBindings(true);
			oModel.setProperty("/ItemI", sItem + 1);
			sSQNId = sSQNId + 1;
			oModel.setProperty("/SQNId", sSQNId);
			this.onChangeWeightAdd();
			this.onChangeArmAdd();
			this.onChangeMomentAdd();
			oModel.updateBindings(true);

		},

		//*************************************************************************************************************
		//           2. Database/Ajax/OData Calls
		//*************************************************************************************************************
		_fnWeightBalanceItemGet: function(sTailId) {
			var that = this,
				oPrmWB = {};
			oPrmWB.filter = "tailid eq '" + sTailId + "'";
			oPrmWB.error = function() {

			};

			oPrmWB.success = function(oData) {
				var oModel = dataUtil.createNewJsonModel();
				for (var i = 0; i < oData.results.length; i++) {
					oData.results[i]["vVisibleInput"] = "O";
					var Temp = new Date(oData.results[i].ItemDate);
					oData.results[i].ItemDate = Temp;
				}
				oModel.setData(oData.results);
				that.getView().setModel(oModel, "WeightBalanceItemSet");
				var oAppModel = this.getView().getModel("appModel");
				oAppModel.setProperty("/sUser", oData.results[0].SGUSR);
				oAppModel.setProperty("/sDate", oData.results[0].SGDTM);

			}.bind(this);

			ajaxutil.fnRead(this.getResourceBundle().getText("WEBALSVC"), oPrmWB);
		},

		_fnWeightBalanceGet: function(sTailId, sType) {
			var that = this,
				oPrmWBM = {};
			//		oPrmWBM.filter = "tailid eq " + sTailId + " and WTIND eq " + sType + " and MOD eq A";
			oPrmWBM.filter = "tailid" + FilterOpEnum.EQ + sTailId + FilterOpEnum.AND + "WTIND" + FilterOpEnum.EQ + sType + FilterOpEnum.AND +
				"MOD" + FilterOpEnum.EQ + "A"; // Phase 2 Changes
			oPrmWBM.error = function() {

			};

			oPrmWBM.success = function(oData) {
				var oModel = dataUtil.createNewJsonModel();
				that.getView().setModel(oModel, "WeightBalanceHeaderSet");
				this.getModel("WeightBalanceHeaderSet").setProperty("/TotalWeightSet", JSON.parse(JSON.stringify(oData.results)));
				this.getModel("WeightBalanceHeaderSet").setProperty("/TotalWeightSet/0/WTIND", "T");
				this.getModel("WeightBalanceHeaderSet").setProperty("/AutoCal", JSON.parse(JSON.stringify(oData.results)));
				this.getModel("WeightBalanceHeaderSet").setProperty("/AutoCal/0/WTIND", "A");
				this.getModel("WeightBalanceHeaderSet").setProperty("/AutoCal/0/IDESC", "Total Calculated Weight");
				this.getModel("WeightBalanceHeaderSet").setProperty("/WeightedWght", JSON.parse(JSON.stringify(oData.results)));
				this.getModel("WeightBalanceHeaderSet").setProperty("/WeightedWght/0/WTIND", "W");
				this.getModel("WeightBalanceHeaderSet").setProperty("/WeightedWght/0/FLAG", "NA");
				this.getModel("WeightBalanceHeaderSet").setProperty("/WeightedWght/0/IDESC", "Total As Weighted Weight");
				this.getModel("WeightBalanceHeaderSet").setProperty("/PrevUser", oData.results[0].SGUSR);
				this.getModel("WeightBalanceHeaderSet").setProperty("/PrevDt", oData.results[0].SGDTM);
				this.getModel("WeightBalanceHeaderSet").setProperty("/PrevTm", oData.results[0].SGUZT);

			}.bind(this);

			ajaxutilNew.fnRead(this.getResourceBundle().getText("WEBALHSVC"), oPrmWBM);
		},

		onSelectionChange: function(oEvent) {
			var oKey = oEvent.getSource().getSelectedKey();
			var bFlag = oKey === "Y" ? true : false;
			this.getView().byId("WeManId").setVisible(bFlag);
			var sVal = bFlag === true ? "X" : null;
			this.getModel("WeightBalanceHeaderSet").setProperty("/WeightedWght/0/FLAG", sVal);
			this.getModel("WeightBalanceHeaderSet").setProperty("/WeightedWght/0/IDESC", "Total As Weighted Weight");
		},

		_fnCreateItemSet: function(sWabId) {
			var oPayloadTmp, oPayload = [],
				oPrmWBMCreate = {};
			oPayloadTmp = this.getView().getModel("WeightBalanceNewSet").getData();
			if (oPayloadTmp.length > 0) {
				for (var i in oPayloadTmp) {
					if (oPayloadTmp[i].vVisibleInput === 'N') {
						delete oPayloadTmp[i].vVisibleInput;
						oPayloadTmp[i].WABID = sWabId;
						oPayloadTmp[i].ItemDate = formatter.defaultOdataDateFormat(oPayloadTmp[i].ItemDate);
						oPayloadTmp[i].SGDTM = formatter.defaultOdataDateFormat(oPayloadTmp[i].SGDTM);
						oPayload.push(oPayloadTmp[i]);
					}
				}
				oPrmWBMCreate.error = function() {

				};

				oPrmWBMCreate.success = function(oData) {
					this.getRouter().navTo("DashboardInitial");

					this.getOwnerComponent().getRouter().navTo("DashboardInitial");
				}.bind(this);
				ajaxutilNew.fnCreate(this.getResourceBundle().getText("WEBALISVC"), oPrmWBMCreate, oPayload);
			} else {
				this.getRouter().navTo("DashboardInitial");
			}

		},

		onWeightBalanceHeaderCreate: function() {
			var that = this,
				oPayload = [],
				oPrmWBMUpdate = {};
			// FieldValidations.resetErrorStates(this);
			// if (FieldValidations.validateFields(this)) {
			// 	return;
			// }
			oPrmWBMUpdate.error = function() {

			};

			oPrmWBMUpdate.success = function(oData) {
				this._fnCreateItemSet(oData.results[0].WABID);
			}.bind(this);

			var oTotalModel = this.getView().getModel("WeightBalanceHeaderSet").getProperty("/TotalWeightSet");
			oTotalModel[0].MOD = "C";
			oTotalModel[0].FLAG = null;
			oPayload.push(oTotalModel[0]);
			var oWeightedModel = this.getView().getModel("WeightBalanceHeaderSet").getProperty("/WeightedWght");
			oWeightedModel[0].MOD = "C";
			oPayload.push(oWeightedModel[0]);
			var oAutoModel = this.getView().getModel("WeightBalanceHeaderSet").getProperty("/AutoCal");
			oAutoModel[0].MOD = "C";
			oPayload.push(oAutoModel[0]);
			oPrmWBMUpdate.activity = 4;
			ajaxutilNew.fnCreate(this.getResourceBundle().getText("WEBALHSVC"), oPrmWBMUpdate, oPayload, "ZRM_WNB", this);
		},

		// ***************************************************************************
		//   4. Private Function   
		// ***************************************************************************
		//	4.1 First level Private functions
		_handleRouteMatched: function(oEvent) {
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
					"ItemI": 1,
					"ItemO": 1,
					"SQNId": 1,
					"isViewEditable": true
				});
				this.getView().setModel(oAppModel, "appModel");
				var sType = oEvent.getParameter("arguments").Type;
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData([]);
				this.getView().setModel(oModel, "WeightBalanceNewSet");
				this.getView().byId("SBWeight").setSelectedKey("NA");
				this.getView().byId("WeManId").setVisible(false);
				this._fnWeightBalanceGet(sTailId, sType);
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.ZWeightandBalanceV.view.UpdateView
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.ZWeightandBalanceV.view.UpdateView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.ZWeightandBalanceV.view.UpdateView
		 */
		//	onExit: function() {
		//
		//	}

	});

});