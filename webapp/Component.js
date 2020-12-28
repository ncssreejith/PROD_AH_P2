sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"avmet/ah/model/models",
	"avmet/ah/util/ajaxutil",
	"avmet/ah/util/dataUtil",
	"sap/m/MessageBox",
	"sap/base/Log"
], function(UIComponent, Device, models, ajaxutil, dataUtil, MessageBox, Log) {
	"use strict";

	return UIComponent.extend("avmet.ah.Component", {
		metadata: {
			manifest: "json"
		},
		appModel: "AirCraftSelectionGBModel",
		init: function() {
			UIComponent.prototype.init.apply(this, arguments);
			this.setModel(models.createDeviceModel(), "device");
			//this._fnSessionChk(); 	//Sreejith: 30/11/2020: Code Uncommented as session logic changed by sreejith
			//this._fnUserPinLogin(); //Sreejith: 30/11/2020: Code Uncommented as not required
			this._fnWebIDE();
		},

		_fnWebIDE: function() {
			try {
				var sData = {};
				sData.login = {
						air: "AH",
					airid: "AIR_11",
					name: "AVMET",
					sqnid: "SQN_805",
					sqntx: "805_SQN",
					wcid: "WC_101",
					wctx: "AWOF"
				};
				if (dataUtil.getDataSet(this.appModel) === null) {
					dataUtil.setDataSet(this.appModel, sData);
				}
				this.getRouter().initialize();
			} catch (e) {
				Log.error("Exception in _fnWebIDE function");
			}

		},

		_fnSessionChk: function() {
			try {
				var sPath = dataUtil.destination + "/ws_authenticate";
				//Sreejith: 30/11/2020: Code commented as session logic changed by sreejith
				/*if(dataUtil.getDataSet("oUserSession")){
					sPath = sPath+"?sessionid="+dataUtil.getDataSet("oUserSession").sessionid;
				}*/
				var that = this;
				$.ajax({
					type: 'GET',
					url: sPath,
					error: function(xhrx) {
						sap.m.URLHelper.redirect(xhrx.getResponseHeader("Location"), false);
						dataUtil.setDataSet("oUserSession", null);
						dataUtil.setDataSet("AirCraftSelectionGBModel", null);
					},
					success: function(oResponse, status, xhr) {
						if (xhr.getResponseHeader("Location").search('ah') >= 0) {
							that.fnLoginUser();
							return "";
						}
						sap.m.URLHelper.redirect(xhr.getResponseHeader("Location"), false);
					}
				});
			} catch (e) {
				Log.error("Exception in onInit function");
			}

		},

		fnLoginUser: function() {
			var sPath = this.getModel("i18n").getResourceBundle().getText("AUTHORIZATIONSVC");
			var oParameter = {};
			oParameter.error = function(xhrx) {
				MessageBox.error("Invalid login credentials", {
					title: "Login Error"
				});
			};
			oParameter.success = function(oData) {
				if (oData !== undefined && oData.results !== undefined) {
					var sData = {};
					sData.login = {
						airid: oData.results.length > 0 ? oData.results[0].PWD : "",
						air: oData.results.length > 0 ? oData.results[0].PLANT : "",
						name: oData.results.length > 0 ? oData.results[0].BACKEND_UNAME : "",
						sqnid: oData.results.length > 0 ? oData.results[0].SQNWC : "",
						sqntx: oData.results.length > 0 ? oData.results[0].SNAME : "",
						wcid: oData.results.length > 0 ? oData.results[0].WRCTR : "",
						wctx: oData.results.length > 0 ? oData.results[0].NAME : ""
					};
					if (dataUtil.getDataSet(this.appModel) === null) {
						dataUtil.setDataSet(this.appModel, sData);
					}
					this.getRouter().initialize();
				} else {
					MessageBox.error("No user record!!! ", {
						title: "Data Error"
					});
				}

			}.bind(this);
			ajaxutil.fnRead(sPath, oParameter);
		},

		_fnUserPinLogin: function() {
			try {

				var sPass = dataUtil.username + ":" + dataUtil.pwd;
				$.ajax({
					type: 'GET',
					url: dataUtil.destination + "/ws_authenticate",
					headers: {
						"Authorization": "Basic " + dataUtil._AESHexEncript(sPass), //Sreejith: 25/11/2020 : 11:27 AM: Changed _encriptInfo to _AESHexEncript 
						"state": "new"
					},
					error: function(xhrx) {
						var vError = "Error";
						if (xhrx.status === 500 || xhrx.status === 401) {
							vError = xhrx.responseJSON[0].ErrorMsg;
						}
						MessageBox.error(vError);
					},
					success: function(oResponse, xhrx, sss) {
						dataUtil.setDataSet("oUserSession", {
							"sessionid": oResponse[0].SESSIONID
						});
						this._fnPlatformSelLogin(oResponse[0].ROLENAME);
					}.bind(this)
				});
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},
		_fnPlatformSelLogin: function(sPkey) {
			try {
				$.ajax({
					type: 'GET',
					url: dataUtil.destination + "/ws_authenticate?sessionid=" + dataUtil.getDataSet("oUserSession").sessionid,
					headers: {
						"state": "selPtfm",
						"ptfm": sPkey
					},
					error: function(xhrx) {
						var vError = "Error";
						if (xhrx.status === 500 || xhrx.status === 401) {
							vError = xhrx.responseJSON[0].ErrorMsg;
						}
						MessageBox.error(vError);
					},
					success: function(oResponse, status, xhr) {
						var sessionData = dataUtil.getDataSet("oUserSession");
						sessionData.PLANTUSER = oResponse.length > 0 ? oResponse[0].PLANTUSER : "";
						sessionData.PLATFORM = oResponse.length > 0 ? oResponse[0].PLATFORM : "";
						dataUtil.setDataSet("oUserSession", sessionData);
						this._fnSessionChk();
					}.bind(this)
				});
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		}
	});
});