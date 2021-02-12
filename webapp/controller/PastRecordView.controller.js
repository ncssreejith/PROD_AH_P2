sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/base/Log",
	"../util/FilterOpEnum"
], function(BaseController, dataUtil, ajaxutil, JSONModel, formatter, Log, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *   Control name: PastRecordView           
	 *   Purpose : Display Past records controller
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *		1.2 onPress
	 *		1.3 onUpdateRecord	 
	 *	 2. Backend Calls
	 *		2.1 fnLoadPastData
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.PastRecordView", {
		formatter: formatter,
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ZWDNS_F16.view.PastRecordView
		 */
		onInit: function() {
			try {
				this.getRouter().getRoute("PastRecordView").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},
		/** 
		 * On item clicked, nav to corresponding view
		 * @param oEvent
		 */
		onPress: function(oEvent) {
			try {
				var oSource = oEvent.getSource();
				var oItem = oSource.getBindingContext("oPastModel").getObject();

				var router = sap.ui.core.UIComponent.getRouterFor(this);
				switch (oItem.tabid) {
					case "TABW_115":
					case "TABW_116": //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
						router.navTo("WDNSCoefficients", {
							tabid: oItem.tabid,
							logid: oItem.logid
						});
						break;
					case "TABW_114":
						router.navTo("OFPView", {
							tabid: oItem.tabid,
							logid: oItem.logid
						});
						break;
					default:
				}
			} catch (e) {
				Log.error("Exception in onPress function");
			}
		},
		/** 
		 * on page load
		 * @constructor 
		 */
		_onObjectMatched: function() {
			try {
				var utilData = {};
				utilData.selIndex = 0;
				utilData.cnpytabId = "TABW_115";
				utilData.ctvstabId = "TABW_111";
				utilData.fcctabId = "TABW_112";
				utilData.past = [];

				this.getView().setModel(new JSONModel(utilData), "oPastModel");

				var oData = {};
				oData.past = [];
				this.fnLoadPastData();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		},
		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		/** 
		 * Load past records
		 */
		fnLoadPastData: function() {
			try {
				var oParameter = {};
				// oParameter.filter = "tailid eq " + this.getTailId() + " and refid eq " + this.getAircraftId() +
				// 	" and otype eq P";
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId() + "&refid" + FilterOpEnum.EQ + this.getAircraftId() +
					"&otype" + FilterOpEnum.EQ + "P";
				//" and tabid eq ('" + this.getModel("oPastModel").getProperty("/cnpytabId") +
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oPastModel").setProperty("/past", oData.results);
					this.getModel("oPastModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in fnLoadPastData function");
			}
		}

	});

});