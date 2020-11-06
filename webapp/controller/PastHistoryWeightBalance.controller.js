sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"../model/formatter"
], function(BaseController, dataUtil, JSONModel, FieldValidations, ajaxutil, formatter) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.PastHistoryWeightBalance", {
		formatter: formatter,
		onInit: function() {
			this.getRouter().getRoute("PastHistoryWeightBalance").attachPatternMatched(this._handleRouteMatched, this);
		},
	
		onViewPastHistory: function(oEvent) {
			var that = this;
			var obj = oEvent.getSource().getBindingContext("WeightBalanceSet").getObject();
			var router = sap.ui.core.UIComponent.getRouterFor(that);
			router.navTo("WeightBalance",{
				isEdit : false,
				isPastHistory : true,
				WABID : obj.WABID,
				TAILID : obj.TAILID
			});
		},

		//*************************************************************************************************************
		//           2. Database/Ajax/OData Calls
		//*************************************************************************************************************


		_fnGetWeightBalSet: function(sTailId) {
			var that = this,
				oPrmWBM = {};
			oPrmWBM.filter = "tailid eq " + sTailId;
			oPrmWBM.error = function() {

			};

			oPrmWBM.success = function(oData) {
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData(oData.results);
				that.getView().setModel(oModel, "WeightBalanceSet");
			};

			ajaxutil.fnRead(this.getResourceBundle().getText("WEBALPASTRECSVC"), oPrmWBM);
		},

		// ***************************************************************************
		//   4. Private Function   
		// ***************************************************************************
		//	4.1 First level Private functions
		_handleRouteMatched: function() {
			var sTailId,
				sModId,
				sAirId;

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
			this.getView().setModel(oAppModel, "appModel");
			this._fnGetWeightBalSet(sTailId);
		}
	});
});