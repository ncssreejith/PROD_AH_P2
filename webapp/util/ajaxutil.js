sap.ui.define([
	"../util/signoffUtil",
	"sap/base/Log",
	"../model/dataUtil"
], function(signoffUtil, Log, dataUtil) {
	"use strict";
	return {
		// http://localhost:58983/AVMET/avmetDB/AircraftModelSvc
		//fnBasePath: "/DBSRV17/avmet",
		fnBasePath: "",
		fnCreate: function(sPath, oParameters, oPayLoad, oObjectId, ref) {
			try {
				if (oObjectId) {
					var srvPayload = {};
					srvPayload.sPath = sPath;
					srvPayload.oParameters = oParameters;
					srvPayload.oPayLoad = oPayLoad;
					signoffUtil.onSignOffClk(oObjectId, oParameters.activity, ref, function(srPayload, user) {
						this._fnPostData(srPayload.sPath, srPayload.oParameters, srPayload.oPayLoad, user);
					}.bind(this, srvPayload));

					return;
				}
				this._fnPostData(sPath, oParameters, oPayLoad);
			} catch (e) {
				Log.error("Exception in fnCreate function");
			}
		},

		_fnPostData: function(sPath, oParameters, oPayLoad, user) {
			try {
				var oData = {};
				oParameters = this.fnCheckForParameters(oParameters);
				if (user) {
					oData.beforeSend = this.fnEncryptDetails.bind(this, user);
				}
				oData.type = "POST";
				oData.headers = {
					"Authorization": "Basic " + "ZGJhOnNxbDEyMw=="
				};
				oData.url = this.fnBasePath + "" + sPath;
				oData.data = JSON.stringify(oPayLoad);
				oData.dataType = "json";
				oData.contentType = "application/json";
				oData.error = function(hrex) {
					if (signoffUtil) {
						signoffUtil.onSignOffError(JSON.parse(hrex.responseText).sortmessage);
					}
					oParameters.error(hrex);
				};
				oData.success = function(oData) {
					if (signoffUtil) {
						signoffUtil.closeSignOff();
					}
					oParameters.success(oData);
				};
				$.ajax(oData);
			} catch (e) {
				Log.error("Exception in _fnPostData function");
			}
		},

		fnUpdate: function(sPath, oParameters, oPayLoad, oObjectId, ref) {
			try {
				if (oObjectId) {
					var srvPayload = {};
					srvPayload.sPath = sPath;
					srvPayload.oParameters = oParameters;
					srvPayload.oPayLoad = oPayLoad;
					signoffUtil.onSignOffClk(oObjectId, oParameters.activity, ref, function(srPayload, user) {
						this.fnUpdateData(srPayload.sPath, srPayload.oParameters, srPayload.oPayLoad, user);
					}.bind(this, srvPayload));
					return;
				}
				this.fnUpdateData(sPath, oParameters, oPayLoad);
			} catch (e) {
				Log.error("Exception in fnUpdate function");
			}
		},

		fnUpdateData: function(sPath, oParameters, oPayLoad, user) {
			try {
				var oData = {};
				oParameters = this.fnCheckForParameters(oParameters);
				if (user) {
					oData.beforeSend = this.fnEncryptDetails.bind(this, user);
				}

				oData.type = "PUT";
				oData.headers = {
					"Authorization": "Basic " + "ZGJhOnNxbDEyMw=="
				};
				oData.url = this.fnBasePath + "" + sPath;
				oData.data = JSON.stringify(oPayLoad);
				oData.dataType = "json";
				oData.contentType = "application/json";
				oData.error = function(hrex) {
					if (signoffUtil) {
						signoffUtil.onSignOffError(JSON.parse(hrex.responseText).sortmessage);
					}
					oParameters.error(hrex);
				};
				oData.success = function(oData) {
					if (signoffUtil) {
						signoffUtil.closeSignOff();
					}
					oParameters.success(oData);
				};
				$.ajax(oData);
			} catch (e) {
				Log.error("Exception in fnUpdateData function");
			}
		},

		fnDelete: function(sPath, oParameters, oObjectId, ref){
			try {
				if (oObjectId) {
					var srvPayload = {};
					srvPayload.sPath = sPath;
					srvPayload.oParameters = oParameters;
					signoffUtil.onSignOffClk(oObjectId, oParameters.activity, ref, function(srPayload, user) {
						this.fnDeleteData(srPayload.sPath, srPayload.oParameters, user);
					}.bind(this, srvPayload));
					return;
				}
				this.fnDeleteData(sPath, oParameters);
			} catch (e) {
				Log.error("Exception in fnDelete function");
			}
		},

		fnDeleteData: function(sPath, oParameters,user) {
			try {
				var oData = {};
				oParameters = this.fnCheckForParameters(oParameters);
				if (user) {
					oData.beforeSend = this.fnEncryptDetails.bind(this, user);
				}
				oData.type = "DELETE";
				oData.headers = {
					"Authorization": "Basic " + "ZGJhOnNxbDEyMw=="
				};
				oData.url = this.fnBasePath + "" + sPath;
				oData.contentType = "application/json";
				oData.error = function(hrex) {
					if (signoffUtil) {
						signoffUtil.onSignOffError(JSON.parse(hrex.responseText).sortmessage);
					}
					oParameters.error(hrex);
				};
				oData.success = function(oData) {
					if (signoffUtil) {
						signoffUtil.closeSignOff();
					}
					oParameters.success(oData);
				};
				$.ajax(oData);
			} catch (e) {
				Log.error("Exception in fnDelete function");
			}
		},

		fnRead: function(sPath, oParameters) {
			try {
				oParameters = this.fnCheckForParameters(oParameters);
				$.ajax({
					type: 'GET',
					headers: {
						"Authorization": "Basic " + "ZGJhOnNxbDEyMw=="
					},
					url: this.fnBasePath + "" + sPath + "" + oParameters.queryParam,
					error: oParameters.error.bind(this),
					success: oParameters.success.bind(this)
				});
			} catch (e) {
				Log.error("Exception in fnRead function");
			}
		},

		fnCheckForParameters: function(oParameters) {
			try {
				var isQueryParam = false;
				if (!oParameters) {
					oParameters = {};
				}
				if (!oParameters.success) {
					oParameters.success = function() {};
				}
				if (!oParameters.error) {
					oParameters.error = function() {};
				}
				if (oParameters.filter) {
					isQueryParam = true;
				}
				if (oParameters.expand) {
					isQueryParam = true;
				}
				if (!oParameters.queryParam) {
					oParameters.queryParam = "";
				}

				if (isQueryParam) {
					oParameters.queryParam = "?";
					oParameters.queryParam = oParameters.queryParam + (oParameters.expand === undefined ? "" : "$expand=" + oParameters.expand);
					oParameters.queryParam = oParameters.queryParam + (oParameters.filter === undefined ? "" : "$filter=" + oParameters.filter);
				}
				return oParameters;
			} catch (e) {
				Log.error("Exception in fnCheckForParameters function");
			}
		},

		fnEncryptDetails: function(user, xhr) {
			try {
				xhr.setRequestHeader("PLANTUSER", dataUtil.getDataSet("oUserSession").PLANTUSER);
				xhr.setRequestHeader("uname", user.username);
				xhr.setRequestHeader("pin", user.password);
				xhr.setRequestHeader("objid", user.objid);
				xhr.setRequestHeader("activity", user.activity === undefined ? "99" : user.activity);
				xhr.setRequestHeader("platform", dataUtil.getDataSet("oUserSession").platform.Platform);
				xhr.setRequestHeader("sessionid", dataUtil.getDataSet("oUserSession").sessionid);
			} catch (e) {
				Log.error("Exception in fnEncryptDetails function");
			}

		},

		fnGetRoleObject: function() {
			try {
				var roleObjModel = this.getView().getModel("roleObjModel");
				if (roleObjModel.getData() !== undefined && roleObjModel.getData().length < 1) {
					var oRoleObjModel = new sap.ui.model.json.JSONModel({
						"key": "ZRM_AC_O",
						"Value": "Aircraft Overview - Update",
						"Activity": "04"
					}, {
						"key": "ZRM_TR_AC",
						"Value": "Transfer Aircraft - Dispatch and Receive",
						"Activity": "01"
					}, {
						"key": "ZRM_LIM_S",
						"Value": "Limitation - Create and Remove",
						"Activity": "01"
					}, {
						"key": "ZRM_T_MOD",
						"Value": "Trial MOD - Create",
						"Activity": "01"
					}, {
						"key": "ZRM_ADDL",
						"Value": "ADDL - Create",
						"Activity": "01"
					}, {
						"key": "ZRM_AC_U",
						"Value": "Aircraft Utilisation - Equipment Running Log - Sign off",
						"Activity": "02"
					}, {
						"key": "ZRM_FS_RP",
						"Value": "Flight Servicing - Replenishment Sign Off",
						"Activity": "04"
					}, {
						"key": "ZRM_FS_RTT",
						"Value": "Flight Servicing - Routine Task - Tradesman Sign Off",
						"Activity": "04"
					}, {
						"key": "ZRM_FS_FTT",
						"Value": "Flight Servicing - Follow Up Task - Tradesman Sign Off",
						"Activity": "04"
					}, {
						"key": "ZRM_FS_CTT",
						"Value": "Flight Servicing - Create Task - Tradesman Sign Off",
						"Activity": "04"
					}, {
						"key": "ZRM_FS_WCT",
						"Value": "Flight Servicing - Weapon Config - Tradesman Sign Off",
						"Activity": "04"
					}, {
						"key": "ZRM_COS_JB",
						"Value": "Job - Defect/Schedule/Unschedule - Create",
						"Activity": "01"
					}, {
						"key": "ZRM_COS_TK",
						"Value": "Job - Task - Create",
						"Activity": "01"
					}, {
						"key": "ZRM_COS_TP",
						"Value": "Job - Task - Apply and Edit Template",
						"Activity": "02"
					}, {
						"key": "ZRM_COS_TT",
						"Value": "Job - Task - Tradesman Closed Task",
						"Activity": "04"
					}, {
						"key": "ZRM_COS_JT",
						"Value": "Job - Tradesman Close Job",
						"Activity": "06"
					}, {
						"key": "ZRM_E_SSAM",
						"Value": "Engine - SOAP Sampling - Create (F16)",
						"Activity": "01"
					}, {
						"key": "ZRM_SCH",
						"Value": "Schedule - Create",
						"Activity": "01"
					});
					this.getView().setModel(oRoleObjModel, "roleObjModel");
				}
				return roleObjModel;
			} catch (e) {
				Log.error("Exception in fnGetRoleObject function");
			}
		},
		fnCloseSignOffDialog: function() {
			if (signoffUtil) {
				signoffUtil.closeSignOff();
			}
		}
	};
}, true); // <-- Enables accessing this module via global name "path.to.my.formatter"