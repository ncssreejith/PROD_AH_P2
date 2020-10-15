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
			//this._fnSessionChk();
			this._fnUserPinLogin();
		},

		_fnSessionChk: function() {
			try {
				var that = this;
				$.ajax({
					type: 'GET',
					url: dataUtil.destination+"/ws_authenticate?sessionid="+dataUtil.getDataSet("oUserSession").sessionid,
					error: function(xhrx) {
						that.getRouter().initialize();
					},
					success: function(oResponse, status, xhr) {
						if (xhr.getResponseHeader("Location").search('ah') >= 0) {
							that.fnLoginUser();
							return "";
						}
					    sap.m.URLHelper.redirect(xhr.getResponseHeader("Location"), false);
						dataUtil.setDataSet("oUserSession", null);
						dataUtil.setDataSet("AirCraftSelectionGBModel", null);
					}
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
				
				var sPass = dataUtil.username+":"+dataUtil.pwd;
				$.ajax({
					type: 'GET',
					url: dataUtil.destination+"/ws_authenticate",
					headers: {
						"Authorization": "Basic " + dataUtil._encriptInfo(sPass),
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
					url: dataUtil.destination+"/ws_authenticate?sessionid="+dataUtil.getDataSet("oUserSession").sessionid,
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