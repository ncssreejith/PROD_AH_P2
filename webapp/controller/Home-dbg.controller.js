sap.ui.define([
			"./BaseController",
			"sap/ui/model/json/JSONModel",
			'sap/m/MessageToast',
			"../util/dataUtil",
			"sap/m/MessageBox",
			"sap/base/Log"
		], function(BaseController, JSONModel, MessageToast, dataUtil, MessageBox, Log) {
			"use strict";
			/* ***************************************************************************
			 *   This file is for Handling the login functions           
			 *   1. UI Events
			 *       onInit - initial model for visibility
			 *       onUserIdClk - Go back to first screen
			 *       onUserSelectNextBtnClk - Pin/Bio page
			 *       onSubmitLoginClk - Login action
			 *		 onAfterRendering - To set focus
			 *    2. Private Methods
			 *	     _fnUserBioLogin - Bio metric validation
			 *	     _fnUserPinLogin - Pin login
			 *	     _resetSignOffError - Reset field validation
			 *	     _validateSignOffUserinfo - Userid validation
			 *	     _validateSignPin - Pin validation
			 *	     _setSignOffError - Set error to fields
			 *    
			 *	 Note: 
			 *   IMPORTANT : Must give documentation for all functions
			 *************************************************************************** */
			return BaseController.extend("eslm.login.Bio-Login.controller.Home", {
				// ***************************************************************************
				//                 1. UI Events  
				// ***************************************************************************
				onInit: function() {
					try {
						var that = this;
						that.ResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
						// This will handle the visibility of the screen elements withrespect to the selection
						var device = jQuery.sap.getUriParameters().get("device");
						this.fingerErrorCount = 0; //Rahul: 26/11/2020: 11:37AM: need to Initialize fingerErrorCount to 0
						device = device !== null && device.length > 0 ? device : "default";
						var oModel = new sap.ui.model.json.JSONModel({
							"uSel": "NEW",
							"id": "",
							"pwd": "",
							"result": "",
							"biometric": "css/img/ImageBiometric.png",
							"selection": "",
							"srv": "",
							"msgStatus": "NONE",
							"msg": "",
							"device": device
						});
						that.getView().setModel(oModel, "signOffModel");
						//lakshmi-25.11.2020- added for sso login -start
						var oResponse = this.getOwnerComponent().getModel("SSOLogin"); // added for sso
						if (oResponse) {
							this._validateResult(oResponse.getData());
						}
						//lakshmi-25.11.2020- added for sso login -end
					} catch (e) {
						Log.error("Exception in onInit function");
						//lakshmi-25.11.2020- added for sso login -start
						this.handleException(e); //handled excception
						//lakshmi-25.11.2020- added for sso login -end
					}
				},
				/* 
				 * When the user CLick the User ID drop down
				 * it will change screen to change user name 
				 * and select diff login option
				 */
				onUserIdClk: function() {
					try {
						var myModel = this.getView().getModel("signOffModel");
						myModel.setProperty("/uSel", "NEW");
						myModel.setProperty("/msgStatus", "NONE");
						myModel.setProperty("/msg", "");
						myModel.refresh();
					} catch (e) {
						Log.error("Exception in onInit function");
					}
				},
				/* 
				 * After entering username, user Clicks the next button
				 * this screen will accept password/biometric
				 */
				onUserSelectNextBtnClk: function(sAction, oEvent) {
					try {
						var that = this;
						setTimeout(function() {
							that.getView().byId("ipPassword").focus();
						}, 100);
						that._resetSignOffError();
						if (that._validateSignOffUserinfo()) {
							return;
						}
						var myModel = that.getView().getModel("signOffModel");
						myModel.setProperty("/uSel", sAction);
						myModel.refresh();
					} catch (e) {
						Log.error("Exception in onInit function");
					}
				},
				/* 
				 * On Submitting User Details
				 */
				onSubmitLoginClk: function(sAction, oEvent) { // for biometric
					try {
						var that=this;
						//lakshmi-25.11.2020- added for biometric changes-start
						if(sAction!=="PWDPRS" )
						{
                        this.handleBusyDialogOpen("Place finger on reader and hold.");
						}
						setTimeout(function() {
						var action = sAction === "PWDPRS" ? that._fnUserPinLogin(that, sAction, "") : that._fnUserPinLogin(that, sAction, "Y");
					}, 100);
						
					} catch (e) {
						Log.error("Exception in onSubmitLoginClk function");
						this.handleException(e);
						//lakshmi-25.11.2020- added for biometric changes-end
					}
				},

				//To set focus for the userid input on initial load
				onAfterRendering: function() {
					var that = this;
					setTimeout(function() {
						that.getView().byId("ipUserID").focus();
					}, 100);
				},

				// ***************************************************************************
				//                 2. Private Methods   
				// ***************************************************************************
				/* 
				 *  Bio metric login
				 */
				_fnUserBioLogin: function(that, sAction) {
					try {
						// DUMMY BLOCK - Have to implement after biometric service
						var myModel = that.getView().getModel("signOffModel");
						myModel = this.getView().getModel("signOffModel");
						myModel.setProperty("/biometric", "css/img/ImageBiometricS.png");
						myModel.setProperty("/uSel", sAction);
						myModel.refresh();
						MessageToast.show("SignOff Success");
						that.onUserIdClk();
					} catch (e) {
						Log.error("Exception in onInit function");
					}
				},
				/* xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
						/* Function: _fnUserPinLogin  
				 * Parameter : that, sAction,flag
				 * Description : function call when user Login with Pin as well as for biometric
				 * Added for Biometric
				 */
				//lakshmi-25.11.2020- added for biometric changes-start
				_fnUserPinLogin: function(that, sAction, flag) {
					try {
						/* if (flag === "Y") {
							that.handleBusyDialogOpen("Place finger on reader and hold.");
						} */
						var myModel = that.getView().getModel("signOffModel");
						if (flag !== "Y" && that._validateSignPin()) {
							return;
						}
						//Rahul: 24/11/2020: 06:24PM: need to reset fingerErrorCount to 0-Start
						if (flag !== "Y") {
							this.fingerErrorCount = 0; 
						}
						//Rahul: 24/11/2020: 06:24PM: need to reset fingerErrorCount to 0- End
						that._resetSignOffError();
						var sPath = dataUtil.destination + "/ws_authenticate";
						var headers = {
							"Authorization": "Basic " + dataUtil._AESHexEncript(myModel.getProperty("/id") + ":" + myModel.getProperty("/pwd")), //Sreejith: 25/11/2020 : 11:27 AM: Changed _encriptInfo to _AESHexEncript 
							"BiometricAuth": dataUtil._AESHexEncript(flag), //Sreejith: 25/11/2020 : 11:27 AM: Changed _encriptInfo to _AESHexEncript 
							"state": "new"
						};
						var response = this.fnLogin("GET", sPath, headers);
						if (flag === "Y") {
							that.handleBusyDialogClose();
						}
						if (response) {
							if (response.type === "SUCCESS") {
								that.handleBusyDialogClose();
								that._validateResult(response);
							}
							if (response.type === "ERROR") {
								that.handleBusyDialogClose();
								//if (JSON.parse(response.xhr.responseText)[0].ErrorMsg === "Fingerprint not matched. Try again.") {//Lakshmi: 26/11/2020 : 02:27 PM: commented for all errors
									that._fnCheckFingerprintLogin(that);
								//}//Lakshmi: 26/11/2020 : 02:27 PM: commented for all errors
								//this.handleException("Biometric service is o");
							}
						}
					} catch (e) {
						Log.error("Exception in _fnUserPinLogin function");
						//this.handleException(e);
					}
				},
				_fnCheckFingerprintLogin: function(that) {
					//Rahul: 24/11/2020: Code commented
					/*if (this.fingerErrorCount === undefined) {
						this.fingerErrorCount = 0;
						return false;
					}*/
					this.fingerErrorCount++;
					if (this.fingerErrorCount > 2) {
						//Rahul: 24/11/2020: Code Changed: this.fingerErrorCount >= 2 to this.fingerErrorCount > 2
						this.fingerErrorCount = 0;						
						that.getModel("signOffModel").setProperty("/uSel", "PWD");
						that.getModel("signOffModel").refresh();
						return false;
					}
					return true;
				},
				/* //lakshmi-25.11.2020- added for biometric changes-end
				error: function(xhrx) {
					var vError = "Error";
					if (xhrx.status === 500 || xhrx.status === 401) {
						vError = xhrx.responseJSON[0].ErrorMsg;
					}
					MessageBox.error(vError);
				},
				success: that._validateResult.bind(that)
			});
		} catch (e) {
			Log.error("Exception in onInit function");
		}
	}, */
	_validateResult: function(oResponse) {
		//lakshmi-25.11.2020- added for busy indicator-start
		try {
			if (this.busyDialog) {
				this.busyDialog.close();
			}
			if(oResponse.res !== undefined){
				oResponse = oResponse.res;
				if (oResponse.length === 0) {
					MessageBox.show(this.getResourceBundle().getText("noPlatform"));
					//lakshmi-25.11.2020- added for busy indicator-end
					return null;
				}
			}
			dataUtil.setDataSet("oUserSession", {
				"sessionid": oResponse.length > 0 ? oResponse[0].SESSIONID : "",
				"username": oResponse.length > 0 ? oResponse[0].USERNAME : ""
			});
			if (oResponse.length === 1) {
				this._fnPlatformSelLogin(oResponse[0].ROLENAME);
				return null;
			}
			//lakshmi 25.11.2020-added for sso login -start
			this.getView().setModel(new JSONModel(oResponse), "loginModel");
			var sDialog = this.openDialog("Platform");
		} catch (e) {
			Log.error("Exception in _validateResult function");
			this.handleException(e);
		}
		//lakshmi 25.11.2020-added for sso login -end
	},
	fnAddPlatformToDialog: function() {
		this.getFragmentControl("PlatformId", "CBPlatformSelection").removeAllButtons();
		this.getModel("signOffModel").getProperty("/pltform").forEach(function(oItem) {
			this.getFragmentControl("PlatformId", "CBPlatformSelection").addButton(new sap.m.RadioButton({
				text: oItem.PLATFORM
			}));
		}.bind(this));
	},
	/* onPlatformSelect: function(oEvent) {
		var sKey = this.getModel("signOffModel").getProperty("/pltform/" + this.getFragmentControl("PlatformId", "CBPlatformSelection").getSelectedIndex() +
			"/ROLENAME");
		if (!sKey) {
			MessageBox.show("No Platform information");
			return null;
		}
		this.closeDialog("Platform");
		this._fnPlatformSelLogin(sKey);
	}, */
	
	/* Function: onPlatformSelect
		 * Parameter : oEvent
		 * Description : Function call to get selected platform key
		 */
		onPlatformSelect: function(oEvent) {
			try {
			var sKey = this.getFragmentControl("PlatformId", "CBPlatformSelection").getSelectedButton().getBindingContext("loginModel").getObject("ROLENAME");
			if (!sKey) {
				MessageBox.show(this.getResourceBundle().getText("noPlatform"));
				return null;
			}
			this.closeDialog("Platform");
			this._fnPlatformSelLogin(sKey);
			} catch (e) {
				Log.error("Exception in onPlatformSelect function");
				this.handleException(e);
			}
		},

	_fnPlatformSelLogin: function(sPkey) {
		try {
			$.ajax({
				type: 'GET',
				url: dataUtil.destination + "/ws_authenticate",
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
					var oUserSession = dataUtil.getDataSet("oUserSession");
					//lakshmi 25.11.2020-added for sso login -start
					dataUtil.username = oResponse.length > 0 ? oResponse[0].PLATFORM : "";
					//lakshmi 25.11.2020-added for sso login -end
					dataUtil.setDataSet("oUserSession", oUserSession);
					sap.m.URLHelper.redirect(xhr.getResponseHeader("Location"), false);
				}.bind(this)
			});
		} catch (e) {
			Log.error("Exception in onInit function");
		}
	},

	_resetSignOffError: function() {
		try {
			var signOffModel = this.getView().getModel("signOffModel");
			signOffModel.setProperty("/msg", "");
			signOffModel.setProperty("/msgStatus", "NONE");
			signOffModel.refresh();
			if (!this.getView().byId("ipUserID")) {
				return;
			}
			this.getView().byId("ipUserID").setValueState("None");
			this.getView().byId("ipPassword").setValueState("None");
		} catch (e) {
			Log.error("Exception in onInit function");
		}
	},
	_validateSignOffUserinfo: function() {
		try {
			//lakshmi 25.11.2020-added for user id validation -start
			return (this.getView().getModel("signOffModel").getProperty("/id").length < 1) ? this._setSignOffError("ipUserID") : false; // no validation for user id
			//lakshmi 25.11.2020-added for user id validation -end
		} catch (e) {
			Log.error("Exception in onInit function");
		}
	},
	_validateSignPin: function() {
		try {
			return (this.getView().getModel("signOffModel").getProperty("/pwd").length < 3) ? this._setSignOffError("ipPassword") : false;
		} catch (e) {
			Log.error("Exception in onInit function");
		}
	},
	_setSignOffError: function(id) {
		try {
			var oControl = this.getView().byId(id);
			oControl.setValueState(sap.ui.core.ValueState.Error);
			if (oControl.getValueStateText() !== undefined && oControl.getValueStateText() !== "" && oControl.getValueStateText().length > 1) {
				oControl.setValueStateText(oControl.getValueStateText());
			}
			return true;
		} catch (e) {
			Log.error("Exception in onInit function");
		}
	},
	/* Function: fnLogin
		 * Parameter : sType, sPath, oHeader
		 * Description : Common function to make ajax call
		 */
     //lakshmi-25.11.2020 - added for sso login- start
		fnLogin : function (sType, sPath, oHeader, showErrorMsg){
			var response = {},that=this; //Rahul: 26/11/2020 11:25am: add That as reference to this.
			$.ajax({
					type: sType,
					url: sPath,
					headers : oHeader,
					async: false,
					error: function(xhr) {
						showErrorMsg = showErrorMsg === false ? false: true;
						if (showErrorMsg) {
							var vError = "Error";
						if (xhr.status === 500 || xhr.status === 401) {
							vError = xhr.responseJSON[0].ErrorMsg;
						}
						//Rahul: 26/11/2020 11:25am: Message added for Error dialog.
						if(that.fingerErrorCount>1)
						{
							vError="Fingerprint not matched. Login with password.";  //Rahul: 26/11/2020 11:25am: Message added for Error dialog.
						}
						MessageBox.error(vError);
						
						}
						var obj = {"type" :"ERROR",
						"xhr" : xhr};
						response = obj;
					},
					success: function(oResponse, status, xhr) {
						var obj = { "type" :"SUCCESS",
							"res" :oResponse, 
						"status":status, 
						"xhr" : xhr};
						response =  obj;
					}
				});
			return response;
		},	
	//lakshmi 25.11.2020-added for sso login -start
	/* Function: getInitModel
	 * Parameter :
	 * Description : return default values for the model
	 */
	getInitModel: function() {
		try {
			var device = jQuery.sap.getUriParameters().get("device");
			device = device !== null && device.length > 0 ? device : "default";
			//this.fingerErrorCount = 0; //Rahul: 26/11/2020: 11:36AM: Code commented
			var data = {
				"uSel": "NEW",
				"id": "",
				"pwd": "",
				"result": "",
				"biometric": "css/img/ImageBiometric.png",
				"selection": "",
				"srv": "",
				"msgStatus": "NONE",
				"msg": "",
				"invalidCount": 0,
				"device": device
			};

			return data;
		} catch (e) {
			Log.error("Exception in getInitModel function");
			this.handleException(e);
		}
	}
	//lakshmi 25.11.2020-added for sso login -end
});
});