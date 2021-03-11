sap.ui.define([
	"../util/signoffUtil",
	"sap/base/Log",
	"../util/dataUtil"
], function(signoffUtil, Log, dataUtil) {
	"use strict";
	return {
		// http://localhost:58983/AVMET/avmetDB/AircraftModelSvc
		//fnBasePath: "/DBSRV17/avmet",
		sessionTimeOutWin: null,
		swnDialog: null,
		fnBasePath: dataUtil.destination + "/ws_eslm_restful_data_controller",
		fnCreate: function(sPath, oParameters, oPayLoad, oObjectId, ref) {
			try {
				if (oObjectId) {
					var srvPayload = {};
					srvPayload.sPath = sPath;
					srvPayload.oParameters = oParameters;
					srvPayload.oPayLoad = oPayLoad;
					signoffUtil.onSignOffClk(oObjectId, oParameters, ref, function(srPayload, user) {
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
				//	oData.data = JSON.stringify(oPayLoad);
				oData.data = JSON.stringify({
					"results": oPayLoad
				});

				oData.dataType = "json";
				oData.contentType = "application/json";
				oData.error = function(hrex) {
					this.sessionTimeOutCheck(hrex);
					if (signoffUtil) {
						signoffUtil.onSignOffError(hrex.responseText); //lakshmi changed for phase 2 error mesg display on 08/01/2021 at 10.51am
						//signoffUtil.onSignOffError(JSON.parse(hrex.responseText).sortmessage);
					}
					oParameters.error(hrex);
				}.bind(this);
				oData.success = function(oData) {
					if (signoffUtil) {
						signoffUtil.closeSignOff();
					}
					oParameters.success(oData[0]);
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
					signoffUtil.onSignOffClk(oObjectId, oParameters, ref, function(srPayload, user) {
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
				/*oData.data = JSON.stringify(oPayLoad);*/
				oData.data = JSON.stringify({
					"results": oPayLoad
				});

				oData.dataType = "json";
				oData.contentType = "application/json";
				oData.error = function(hrex) {
					this.sessionTimeOutCheck(hrex);
					if (signoffUtil) {
					signoffUtil.onSignOffError(hrex.responseText); //lakshmi changed for phase 2 error mesg display on 08/01/2021 at 10.51am
						//signoffUtil.onSignOffError(JSON.parse(hrex.responseText).sortmessage);
					}
					oParameters.error(hrex);
				}.bind(this);
				oData.success = function(oData) {
					if (signoffUtil) {
						signoffUtil.closeSignOff();
					}
					oParameters.success(oData[0]);
				};
				$.ajax(oData);
			} catch (e) {
				Log.error("Exception in fnUpdateData function");
			}
		},

		fnDelete: function(sPath, oParameters, oObjectId, ref) {
			try {
				if (oObjectId) {
					var srvPayload = {};
					srvPayload.sPath = sPath;
					srvPayload.oParameters = oParameters;
					signoffUtil.onSignOffClk(oObjectId, oParameters, ref, function(srPayload, user) {
						this.fnDeleteData(srPayload.sPath, srPayload.oParameters, user);
					}.bind(this, srvPayload));
					return;
				}
				this.fnDeleteData(sPath, oParameters);
			} catch (e) {
				Log.error("Exception in fnDelete function");
			}
		},

		fnDeleteData: function(sPath, oParameters, user) {
			try {
				var oData = {};
				oParameters = this.fnCheckForParameters(oParameters);
				if (user) {
					oData.beforeSend = this.fnEncryptDetails.bind(this, user);
				}
				oData.type = "DELETE";

				oData.url = this.fnBasePath + "" + sPath;
				oData.contentType = "application/json";
				oData.error = function(hrex) {
					this.sessionTimeOutCheck(hrex);
					if (signoffUtil) {
							signoffUtil.onSignOffError(hrex.responseText); //lakshmi changed for phase 2 error mesg display on 08/01/2021 at 10.51am
						//signoffUtil.onSignOffError(JSON.parse(hrex.responseText).sortmessage);
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
					error: function(hrex) {
						this.sessionTimeOutCheck(hrex);
						oParameters.error(hrex);
					}.bind(this), //oParameters.error.bind(this),
					success: function(oData) {
						this.fnCloseChildWindow();
						oParameters.success(oData);
					}.bind(this)
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
					oParameters.queryParam = oParameters.queryParam + (oParameters.filter === undefined ? "" : "" + oParameters.filter);
					//oParameters.queryParam = oParameters.queryParam + "&sessionid=" + dataUtil.getDataSet("oUserSession").sessionid; Sreejith: Code commented 25/11/2020: for Session cookie
				}
				if (!isQueryParam) {
					oParameters.queryParam = "?";
					//oParameters.queryParam = oParameters.queryParam + "sessionid=" + dataUtil.getDataSet("oUserSession").sessionid; Sreejith: Code commented 25/11/2020: for Session cookie

				}
				return oParameters;
			} catch (e) {
				Log.error("Exception in fnCheckForParameters function");
			}
		},

		/*	fnEncryptDetails: function(user, xhr) {
			 try {
        		var act = user.activity === undefined ? "99" : user.activity;
                var signAuth = dataUtil._AESHexEncript(user.username+ ":" + user.password+":"+user.objid+":"+act);  //Sreejith: 25/11/2020 : 11:27 AM: Changed _encriptInfo to _AESHexEncript 
                 xhr.setRequestHeader("signAuth","Basic "+signAuth);
            } catch (e) {
                Log.error("Exception in fnEncryptDetails function");
            }
		},*/

		//Rahul: 08/11/2020: Laksmi asked push changes added bioid
		fnEncryptDetails: function(user, xhr) {
			try {
				var act = user.activity === undefined ? "99" : user.activity;
				var bioid = user.bioid === undefined ? "" : user.bioid;
				var signAuth = dataUtil._AESHexEncript(user.username + ":" + user.password + ":" + user.objid + ":" + bioid + ":" + act); //Sreejith: 25/11/2020 : 11:27 AM: Changed _encriptInfo to _AESHexEncript 
				xhr.setRequestHeader("signAuth", signAuth);
				xhr.setRequestHeader("airid", 'AIR_11'); //Amit: 02/03/2021 : 11:27 AM: Changes 
			} catch (e) {
				Log.error("Exception in fnEncryptDetails function");
			}
		},

		fnCloseChildWindow: function() {
			if (this.sessionTimeOutWin !== null) {
				this.sessionTimeOutWin.close();
				this.sessionTimeOutWin = null;
				this.swnDialog.close();
				this.swnDialog = null;
			}
		},
		sessionTimeOutCheck: function(hrex) {
			if (hrex.status === 403 && this.swnDialog === null) {
				this.fnOpenSessionTimeOutDialog(hrex);
			}
		},
		fnOpenSessionTimeOutDialog: function(hrex) {
			var sMin = "5";//sessionTimeOutCheck();
			var sLabel = new sap.m.Label({
				wrapping: true,
				text: "Your session is about to expire within "+sMin+" min,Do you want to continue ?",
				width: "100%",
				design: "Bold",
				textAlign: "Center"
			});
			var sButton = new sap.m.Button({
				type: "Emphasized",
				text: "Yes",
				design: "Bold",
				press: function(oEvent) {
					this._fnSessionChk();
				}.bind(this)
			});
			var eButton = new sap.m.Button({
				type: "Default",
				text: "No",
				design: "Bold",
				press: function(oEvent) {
					this._fnLogOff();
				}.bind(this)
			});
			this.swnDialog = new sap.m.Dialog({
				type: "Message",
				title: "Session timeout",
				draggable: true,
				content: [sLabel],
				beginButton:sButton,
				endButton: eButton
			});
			this.swnDialog.open();

		},
		
		_fnLogOff: function() {

			try {
			
				$.ajax({
					type: 'GET',
					url: "/ws_eslm_authenticate",
					headers: {
						"state": "delete"
					},
					error: function(xhrx) {
						dataUtil.setDataSet("oUserSession", null);
						dataUtil.setDataSet("AirCraftSelectionGBModel", null);
						sap.m.URLHelper.redirect(xhrx.getResponseHeader("Location"), false);
					},
					success: function(oData, status, xhrx) {
						dataUtil.setDataSet("oUserSession", null);
						dataUtil.setDataSet("AirCraftSelectionGBModel", null);
						sap.m.URLHelper.redirect(xhrx.getResponseHeader("Location"), false);
					}
				});
			} catch (e) {
				Log.error("Exception in _fnAirOverViewItemGet function");
			}
		},
		
		_fnSessionChk: function() {
			try {
				var sPath = dataUtil.destination + "/ws_eslm_authenticate";
				$.ajax({
					type: "GET",
					url: sPath,
					error: function(xhrx) {
						sap.m.URLHelper.redirect(xhrx.getResponseHeader("Location"), false);
						dataUtil.setDataSet("oUserSession", null);
						dataUtil.setDataSet("AirCraftSelectionGBModel", null);
					},
					success: function(oResponse, status, xhr) {
						if (xhr.getResponseHeader("Location").search('ah') >= 0) {
							return "";
						}
						sap.m.URLHelper.redirect(xhr.getResponseHeader("Location"), false);
					}
				});
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},

		fnCloseSignOffDialog: function() {
			if (signoffUtil) {
				signoffUtil.closeSignOff();
			}
		}
	};
}, true); // <-- Enables accessing this module via global name "path.to.my.formatter"