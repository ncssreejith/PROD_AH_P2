sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"avmet/ah/model/models",
	"avmet/ah/util/ajaxutil",
	"avmet/ah/model/dataUtil",
	"sap/m/MessageBox"
], function(UIComponent, Device, models, ajaxutil, dataUtil, MessageBox) {
	"use strict";

	return UIComponent.extend("avmet.ah.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */

		///////////////////////////BASIC DETAILS FOR AIRCRAFT//////////////////////
		appModel: "AirCraftSelectionGBModel",
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			var oUserSession = dataUtil.getDataSet("oUserSession");
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			var oUserSession = dataUtil.getDataSet("oUserSession");
			this._fnSessionChk();
		},
		
		_fnSessionChk: function (sPkey) {
			try {
				$.ajax({
					type: 'GET',
					url: "/ws_authenticate",
					error: function (xhrx) {
						this.getRouter().initialize();
					}.bind(this),
					success:function(oResponse, status, xhr){
						if(xhr.getResponseHeader("Location").search('ah')>=0){
							this.fnLoginUser();
							return 
						}
						sap.m.URLHelper.redirect(xhr.getResponseHeader("Location"), false);
						dataUtil.setDataSet("oUserSession", null);
						dataUtil.setDataSet("AirCraftSelectionGBModel", null);
					}.bind(this)
				});
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},
		
		fnLoginUser: function() {
			var sPath = "/AuthorizationSvc";
			var oParameter = {};
			
			oParameter.error = function(xhrx) {
				MessageBox.error("Invalid login credentials", {
					title: "Login Error"
				});
			};
			oParameter.success = function(oData) {
				var sData = {};
				sData.login = {
					airid: oData.results.length > 0 ? oData.results[0].PWD : "",
					air: oData.results.length > 0 ? oData.results[0].PLANT : "",
					name: oData.results.length > 0 ? oData.results[0].BACKEND_UNAME : "",
					sqnid: oData.results.length > 0 ? oData.results[0].SQNWC : "",
					sqntx: oData.results.length > 0 ? oData.results[0].SNAME : "",
					wcid: oData.results.length > 0 ? oData.results[0].WRCTR : "",
					wctx: oData.results.length > 0 ? oData.results[0].NAME : "",
					//Priya 
					rolechangedetails: ""
				};
				try {
					if (dataUtil.getDataSet(this.appModel) === null) {
						dataUtil.setDataSet(this.appModel, sData);
					}
				} catch (e) {}
				this.getRouter().initialize();
			}.bind(this);
			ajaxutil.fnRead(sPath, oParameter);
		}

		// 		BACKEND_UNAME: "KHAN"
		// ISACTIVE: "X"
		// NAME: "AWOF"
		// PLANT: "1000"
		// PLANTUSER: "EA12345"
		// PWD: null
		// ROLE: null
		// SNAME: "805 SQN"
		// SQNWC: "SQN_805"
		// WRCTR: "WC_101"
	});
});