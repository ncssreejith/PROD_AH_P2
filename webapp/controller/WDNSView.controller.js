sap.ui.define([
	"./BaseController",

	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, ajaxutil, JSONModel, formatter, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.WDNSView", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ZWDNS.view.WDNSView
		 */
		onInit: function() {
			try {
				this.getRouter().getRoute("WDNSView").attachPatternMatched(this._onObjectMatched, this);
				var wdnsData = {};
				wdnsData.engine = [];
				// utilData.fly = [];
				this.getView().setModel(new JSONModel(wdnsData), "oWDNSModel");
			} catch (e) {
				Log.error("Exception in WDNSView:onInit function");
				this.handleException(e);
			}
		},
		onUpdateRecords: function() {
			try {
				var that = this;
				var router = sap.ui.core.UIComponent.getRouterFor(that);
				router.navTo("UpdateWDNSView", {
					airid: that.getAircraftId(),
					tailid: that.getTailId()
				});
			} catch (e) {
				Log.error("Exception in WDNSView:onUpdateRecords function");
				this.handleException(e);
			}
		},

		onNavBack: function() {
			try {
				var that = this;
				var router = sap.ui.core.UIComponent.getRouterFor(that);
				router.navTo("MainWDNS", {
					airid: that.getAircraftId(),
					tailid: that.getTailId()
				});
			} catch (e) {
				Log.error("Exception in WDNSView:onNavBack function");
				this.handleException(e);
			}
		},
		onPastRecords: function() {
			try {
				var that = this;
				var router = sap.ui.core.UIComponent.getRouterFor(that);
				router.navTo("PastRecordView", {
					airid: that.getAircraftId(),
					tailid: that.getTailId()
				});
			} catch (e) {
				Log.error("Exception in WDNSView:onPastRecords function");
				this.handleException(e);
			}
		},

		_onObjectMatched: function(oEvent) {
			try {
				this.setBasicDetails(oEvent);
				this.fnLoadEngineLong();
			} catch (e) {
				Log.error("Exception in WDNSView:_onObjectMatched function");
				this.handleException(e);
			}
		}
		/*fnLoadEngineLong: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					this.getView().getModel("oWDNSModel").setProperty("/engine", oData.results);
					this.getView().getModel("oWDNSModel").refresh();
					// this.fnLoadTails();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("AIRCRAFTUTILIZATIONSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in WDNSView:fnLoadEngineLong function");
				this.handleException(e);
			}
		}*/

	});

});