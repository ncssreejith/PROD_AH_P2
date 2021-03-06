sap.ui.define([
		"sap/ui/core/Fragment",
		"sap/ui/model/json/JSONModel",
		"sap/base/Log"
	],
	function(Fragment, JSONModel, Log) {
		"use strict";
		return {
			// ***************************************************************************
			//                 SIGNOFF SECTION STARTS 
			//  1. Copy the file SignOffLogin.fragment.xml to Fragments
			//  2. copy these two files to css/img folder ImageBiometric.png ImageBiometricS.png
			//  3. add press event to SignOff Button eg: press="onSignOffClk('ENDORSEWEIGHTANDBALANCE',$event)"
			//      First part is the Button Identifier 
			//	3. i18n File updaton
			// ***************************************************************************

			ref: null,
			fnCallback: null,
			openDialog: function(oDialogName, sPath) {
				try {
					var oDailog = this.fnLoadFragment(oDialogName, sPath, true);
					if (oDailog) {
						oDailog.open();
					}
					return oDailog;
				} catch (e) {
					Log.error("Exception in openDialog function");
				}
			},
			closeDialog: function(oDialogName) {
				try {
					if (this[oDialogName]) {
						this[oDialogName].close();
						// this[oDialogName].destroy();
						// this[oDialogName] = undefined;
					}
					return this[oDialogName];
				} catch (e) {
					Log.error("Exception in closeDialog function");
				}
			},

			closeSignOff: function() {
				try {
					this.closeDialog("SignOffLogin");
				} catch (e) {
					Log.error("Exception in closeSignOff function");
				}
			},

			fnLoadFragment: function(oFragmentName, sPath, isDependend) {
				try {
					if (!sPath) {
						sPath = ".fragments.";
					}
					if (!this[oFragmentName]) {
						var sProjectId = this.ref.getOwnerComponent().getMetadata().getManifestEntry("sap.app").id;
						this[oFragmentName] = sap.ui.xmlfragment(this.ref.createId(oFragmentName + "Id"), sProjectId + sPath + oFragmentName, this);
						if (isDependend) {
							this.ref.getView().addDependent(this[oFragmentName]);
						}
						this[oFragmentName].setModel(new JSONModel({}), "signOffModel");
					} else {
						this.ref.getView().addDependent(this[oFragmentName]);
					}
					this[oFragmentName].getModel("signOffModel").setData(this.fnInitData());
					this._resetSignOffError();
					return this[oFragmentName];
				} catch (e) {
					Log.error("Exception in fnLoadFragment function");
				}
			},

			fnInitData: function() {
				try {
					this.fingerErrorCount = 0; //Rahul: 24/11/2020: 06:24PM: need to Initialize fingerErrorCount to 0
					return {
						"uSel": "NEW",
						"id": "",
						"pwd": "",
						"result": "",
						"biometric": "css/img/ImageBiometric.png",
						"objid": "",
						"activity": "",
						"srv": "",
						"msgStatus": "NONE",
						"msg": ""
					};
				} catch (e) {
					Log.error("Exception in fnInitData function");
				}
			},

			onSignOffError: function(sMsg) {
				try {
					var sAction = this.SignOffLogin.getModel("signOffModel").getProperty("/uSel");
					if (sAction === "PWDPRS") {
						sAction = "PWD";
					} else {
						sAction = "FGR";
					}
					 
					sMsg = JSON.parse(sMsg)[0].ErrorMsg;//lakshmi changed for phase 2 error mesg display on 08/01/2021 at 10.51am
					sMsg = sMsg.replace("RAISERROR executed: ", "");
					this.SignOffLogin.getModel("signOffModel").setProperty("/msg", sMsg);
					this.SignOffLogin.getModel("signOffModel").setProperty("/msgStatus", "ERROR");
					this.SignOffLogin.getModel("signOffModel").setProperty("/uSel", sAction);
					//Rahul: 24/11/2020 at 16.38
					if (sAction === "FGR") {
						this._fnCheckFingerprintSignOff(this);
					}
					//Rahul: 24/11/2020 at 16.38
					this.SignOffLogin.getModel("signOffModel").refresh();
					this.signOffStatus(sMsg.slice(sMsg), "ERROR");
					// this._setSignOffCustomError("ipPassword",sMsg);
					// this._setSignOffCustomError("ipUserID",sMsg);
				} catch (e) {
					Log.error("Exception in onSignOffError function");
				}
			},
			_fnCheckFingerprintSignOff: function(that) {
				//Rahul: 24/11/2020: Code commented
				/*if (this.fingerErrorCount === undefined) {
					this.fingerErrorCount = 0;
					return false;
				}*/
				this.fingerErrorCount++;
				if (this.fingerErrorCount > 2) {
					//Rahul: 24/11/2020: Code Changed: this.fingerErrorCount >= 2 to this.fingerErrorCount > 2
					this.fingerErrorCount = 0;					
					that.SignOffLogin.getModel("signOffModel").setProperty("/uSel", "PWD");
					that.SignOffLogin.getModel("signOffModel").refresh();
					that.SignOffLogin.getModel("signOffModel").setProperty("/msg","Biometric authentication failed, Sign-off with pin."); //Rahul: 26/11/2020 11:25am: Message added for dialog.
					return false;
				}
				return true;
			},
			onUserIdClk: function() {
				try {
					var myModel = this.SignOffLogin.getModel("signOffModel");
					myModel.setProperty("/uSel", "NEW");
					myModel.setProperty("/msgStatus", "NONE");
					myModel.setProperty("/msg", "");
					myModel.refresh();
				} catch (e) {
					Log.error("Exception in onUserIdClk function");
				}
			},
			onSignOffClk: function(sObjId, oParameters, currentContext, fnCallback) {
				try {
					this.fnCallback = fnCallback;
					this.ref = currentContext;
					var oDailog = this.openDialog("SignOffLogin");
					oDailog.getModel("signOffModel").setProperty("/objid", sObjId);
					oDailog.getModel("signOffModel").setProperty("/activity", oParameters.activity);
					oDailog.getModel("signOffModel").setProperty("/title", oParameters.title);
					oDailog.getModel("signOffModel").refresh();
					return oDailog;
				} catch (e) {
					Log.error("Exception in onSignOffClk function");
				}
			},
			onUserSelectNextBtnClk: function(sAction) {
				try {
					this._resetSignOffError();
					if (this._validateSignOffUserinfo()) {
						return;
					}
					var myModel = this.SignOffLogin.getModel("signOffModel");
					myModel.setProperty("/uSel", sAction);
					myModel.refresh();
				} catch (e) {
					Log.error("Exception in onUserSelectNextBtnClk function");
				}
			},
			onSubmitLoginClk: function(sAction, oEvent) {
				try {
					var myModel = null;
					// var serverInfo = this.ref.ResourceBundle.getText("serverInfo");
					if (sAction === "CNL") {
						this.closeSignOff();
						return; //Do not remove!
					}
					if (sAction === "PWDPRS") {
						if (!this._validateSignPin()) {
							// DUMMY BLOCK - To Delete
							myModel = this.SignOffLogin.getModel("signOffModel");
							myModel.setProperty("/uSel", sAction);
							this.fingerErrorCount = 0; //Rahul: 24/11/2020: 06:24PM: need to reset fingerErrorCount to 0
							myModel.refresh();
							var oData = {
								username: myModel.getData().id,
								password: myModel.getData().pwd,
								objid: myModel.getProperty("/objid"),
								bioid: "",  //Rahul: 24/11/2020: 06:24PM
								activity: myModel.getProperty("/activity")
							};
							this.fnCallback(oData);
							// this.closeDialog("SignOffLogin");
							//<<<<<-----------------------------------------------------------------------					

						}
					} else {
          //Lakshmi -25.11.2020-added for busy indicator-start
						this.handleBusyDialogOpenBio("Place finger on reader and hold.");			
						//Lakshmi -25.11.2020-added for busy indicator-end
						myModel = this.SignOffLogin.getModel("signOffModel");
						myModel.setProperty("/uSel", sAction);
						myModel.refresh();
						//Lakshmi -25.11.2020 at 16.42
						var oData = {
							username: myModel.getData().id,
							password: "",
							objid: myModel.getProperty("/objid"),
							bioid: "X",
							activity: myModel.getProperty("/activity")
						};
						//Lakshmi -25.11.2020 at 16.42
						this.fnCallback(oData);
            //Lakshmi -25.11.2020-added for busy indicator-start
						this.handleBusyDialogClose();
            //Lakshmi -25.11.2020-added for busy indicator-end
						//<<<<<-----------------------------------------------------------------------

					}
				} catch (e) {
					Log.error("Exception in onSubmitLoginClk function");
          //Lakshmi -25.11.2020-added for busy indicator-start
					this.handleBusyDialogClose();
          //Lakshmi -25.11.2020-added for busy indicator-end
				}
			},
      //Lakshmi -25.11.2020-added for busy indicator-start
			handleBusyDialogOpenBio: function() {
			if (!this._oBusyFrag) {
				this._oBusyFrag = sap.ui.xmlfragment("BusyIndiId",
					"avmet.ah.fragments.BusyIndicatorDialogBio",
					this);
				this._oBusyFrag.open();
			}
		},
		handleBusyDialogClose: function() {
			this._oBusyFrag.close(this);
			this._oBusyFrag.destroy();
			delete this._oBusyFrag;

		},
    //Lakshmi -25.11.2020-added for busy indicator-end
			//-----------------------------------------------------------------------------
			//                            Validation Sections Starts [SignOff]
			//-----------------------------------------------------------------------------
			_validateSignOffUserinfo: function() {
      //Lakshmi -25.11.2020-added for user id validation-start
				return (this.SignOffLogin.getModel("signOffModel").getProperty("/id").length < 4) ? this._setSignOffError("ipUserID") : false;
			//Lakshmi -25.11.2020-added for user id validation-end
      },
			_validateSignPin: function() {
				return (this.SignOffLogin.getModel("signOffModel").getProperty("/pwd").length < 3) ? this._setSignOffError("ipPassword") : false;
			},
			_resetSignOffError: function() {
				try {
					this.SignOffLogin.removeStyleClass("signOffError");
					this.SignOffLogin.removeStyleClass("signOffSuccess");
					this.SignOffLogin.getModel("signOffModel").setProperty("/msg", "");
					this.SignOffLogin.getModel("signOffModel").setProperty("/msgStatus", "NONE");
					this.SignOffLogin.getModel("signOffModel").refresh();
					if (!Fragment.byId(this.ref.createId("SignOffLoginId"), "ipUserID")) {
						return;
					}
					Fragment.byId(this.ref.createId("SignOffLoginId"), "ipUserID").setValueState("None");
					Fragment.byId(this.ref.createId("SignOffLoginId"), "ipPassword").setValueState("None");
				} catch (e) {
					Log.error("Exception in _resetSignOffError function");
				}
			},
			_setSignOffError: function(id) {
				try {
					var oControl = Fragment.byId(this.ref.createId("SignOffLoginId"), id);
					oControl.setValueState(sap.ui.core.ValueState.Error);
					if (oControl.getValueStateText() !== undefined && oControl.getValueStateText() !== "" && oControl.getValueStateText().length > 1) {
						oControl.setValueStateText(oControl.getValueStateText());
					}
					return true;
				} catch (e) {
					Log.error("Exception in _setSignOffError function");
				}
			},
			_setSignOffCustomError: function(id, sMsg) {
				try {
					var oControl = Fragment.byId(this.ref.createId("SignOffLoginId"), id);
					oControl.setValueState(sap.ui.core.ValueState.Error);
					if (oControl.getValueStateText() !== undefined && oControl.getValueStateText() !== "" && oControl.getValueStateText().length > 1) {
						// oControl.setValueStateText(oControl.getValueStateText());
						oControl.setValueStateText(sMsg);
					}
					return true;
				} catch (e) {
					Log.error("Exception in _setSignOffCustomError function");
				}
			},
			signOffStatus: function(sMsg, sStatus) {
					try {
						if (!sMsg) {
							return "";
						}
						if (!Fragment.byId(this.ref.createId("SignOffLoginId"), "ipUserID")) {
							return;
						}
						if (sStatus === "ERROR") {
							this.SignOffLogin.removeStyleClass("signOffError");
							this.SignOffLogin.removeStyleClass("signOffSuccess");
							this.SignOffLogin.addStyleClass("signOffError");
							Fragment.byId(this.ref.createId("SignOffLoginId"), "lblMsgId").removeStyleClass("signOffTxtError");
							Fragment.byId(this.ref.createId("SignOffLoginId"), "lblMsgId").removeStyleClass("signOffTxtSuccess");
							Fragment.byId(this.ref.createId("SignOffLoginId"), "lblMsgId").addStyleClass("signOffTxtError");

						}
						if (sStatus === "SUCCESS") {
							this.SignOffLogin.removeStyleClass("signOffError");
							this.SignOffLogin.removeStyleClass("signOffSuccess");
							this.SignOffLogin.addStyleClass("signOffSuccess");
							Fragment.byId(this.ref.createId("SignOffLoginId"), "lblMsgId").removeStyleClass("signOffTxtError");
							Fragment.byId(this.ref.createId("SignOffLoginId"), "lblMsgId").removeStyleClass("signOffTxtSuccess");
							Fragment.byId(this.ref.createId("SignOffLoginId"), "lblMsgId").addStyleClass("signOffTxtSuccess");
						}
						return sMsg;
					} catch (e) {
						Log.error("Exception in signOffStatus function");
					}
				}
				// ***************************************************************************
				//                 SIGNOFF SECTION ENDS 
				// ***************************************************************************

		};
	}, true); // <-- Enables accessing this module via global name "path.to.my.formatter"