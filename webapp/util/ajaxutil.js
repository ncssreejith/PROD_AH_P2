sap.ui.define([
	"../util/signoffUtil",
	"sap/base/Log",
	"../util/dataUtil"
], function(signoffUtil, Log, dataUtil) {
	"use strict";
	return {
		// http://localhost:58983/AVMET/avmetDB/AircraftModelSvc
		//fnBasePath: "/DBSRV17/avmet",
		sessionTimeOutWin : null,
		fnBasePath: dataUtil.destination+"/sap/opu/odata/sap/AVMET_SRV",
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
				
				oData.url = this.fnBasePath + "" + sPath + "" + oParameters.queryParam;
				oData.data = JSON.stringify(oPayLoad);
				oData.dataType = "json";
				oData.contentType = "application/json";
				oData.error = function(hrex) {
					this.sessionTimeOutCheck(hrex);
					if (signoffUtil) {
						signoffUtil.onSignOffError(JSON.parse(hrex.responseText).sortmessage);
					}
					oParameters.error(hrex);
				}.bind(this);
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
				
				oData.url = this.fnBasePath + "" + sPath + "" + oParameters.queryParam;
				oData.data = JSON.stringify(oPayLoad);
				oData.dataType = "json";
				oData.contentType = "application/json";
				oData.error = function(hrex) {
					this.sessionTimeOutCheck(hrex);
					if (signoffUtil) {
						signoffUtil.onSignOffError(JSON.parse(hrex.responseText).sortmessage);
					}
					oParameters.error(hrex);
				}.bind(this);
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
				
				oData.url = this.fnBasePath + "" + sPath + "" + oParameters.queryParam;
				oData.contentType = "application/json";
				oData.error = function(hrex) {
					this.sessionTimeOutCheck(hrex);
					if (signoffUtil) {
						signoffUtil.onSignOffError(JSON.parse(hrex.responseText).sortmessage);
					}
					oParameters.error(hrex);
				}.bind(this);
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
					
					url: this.fnBasePath + "" + sPath + "" + oParameters.queryParam,
					error: function(hrex){
						this.sessionTimeOutCheck(hrex);
						oParameters.error(hrex);
					}.bind(this),//oParameters.error.bind(this),
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
					oParameters.queryParam = oParameters.queryParam+"&sessionid="+dataUtil.getDataSet("oUserSession").sessionid;
				}
				if (!isQueryParam) {
					oParameters.queryParam = "?";
					oParameters.queryParam = oParameters.queryParam+"sessionid="+dataUtil.getDataSet("oUserSession").sessionid;
					
				}
				return oParameters;
			} catch (e) {
				Log.error("Exception in fnCheckForParameters function");
			}
		},

		fnEncryptDetails: function(user, xhr) {
			 try {
				
				//var signAuth = dataUtil._encriptInfo(user.username+ ":" + user.password+ ":" +user.objid+":"+(user.activity === undefined ? "99" : user.activity));
				var signAuth = dataUtil._encriptInfo(user.username+ ":" + user.password);
                xhr.setRequestHeader("signAuth",signAuth);
				xhr.setRequestHeader("objid", user.objid);
                xhr.setRequestHeader("activity", user.activity === undefined ? "99" : user.activity);
                if(dataUtil.getDataSet("oUserSession")){
					xhr.setRequestHeader("platform", dataUtil.getDataSet("oUserSession").platform.Platform);
                    xhr.setRequestHeader("sessionid", dataUtil.getDataSet("oUserSession").sessionid);
                }
            } catch (e) {
                Log.error("Exception in fnEncryptDetails function");
            }
		},
		
		sessionTimeOutCheck:function(hrex){
			if(hrex.status===403 && this.sessionTimeOutWin==null){
				this.fnOpenSessionTimeOutDialog(hrex);
			}
		},
		fnOpenSessionTimeOutDialog:function(hrex){
			  sap.m.MessageBox.error("Session timeout please login again ", {
                    actions: [sap.m.MessageBox.Action.OK],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    onClose: function(sAction) {
                        if (sAction === "OK") {
							this.sessionTimeOutWin = window.open(hrex.getResponseHeader("Location"),"_blank");
                        }
                    }.bind(this)
                });
				
		},
		fnCloseSignOffDialog: function() {
			if (signoffUtil) {
				signoffUtil.closeSignOff();
			}
		}
	};
}, true); // <-- Enables accessing this module via global name "path.to.my.formatter"