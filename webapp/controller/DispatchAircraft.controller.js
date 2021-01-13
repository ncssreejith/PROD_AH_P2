sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/base/Log",
	"../util/ajaxutilNew",
	"../util/FilterOpEnum"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil, JSONModel, MessageBox, Log, ajaxutilNew,
	FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *	 Developer : KUMAR AMIT	
	 *   Control name: Station           
	 *   Purpose : Display of Dispatch aircraft  and fly log and mano
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *		1.2 onSignOffPress
	 *	 2. Backend Calls
	 *		2.1 fnLogById
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *		3.2 fnSetReason
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.DispatchAircraft", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("DispatchAircraft").attachPatternMatched(this._onObjectMatched, this);
				var oatchkData = {};
				oatchkData.isListChange = "";
				oatchkData.header = {};
				oatchkData.checklist = [];
				oatchkData.location = [];
				oatchkData.sqn = [];
				this.setModel(new JSONModel(), "atckModel");
				this.setModel(new JSONModel(), "oViewModel");
			} catch (e) {
				Log.error("Exception in DispatchAircraft:onInit function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		//1.on click of ico selected
		onIconTabSelection: function(oEvent) {
			try {
				var key = oEvent.getSource().getSelectedKey(),
					oModel = this.getView().getModel("oViewModel");
				if (key === "receiver") {
					oModel.setProperty("/Dispatch", false);
					oModel.setProperty("/Receive", true);
				} else {
					oModel.setProperty("/Dispatch", true);
					oModel.setProperty("/Receive", false);
				}
			} catch (e) {
				Log.error("Exception in DispatchAircraft:onIconTabSelection function");
				this.handleException(e);
			}
		},
		/*onDispatch: function (oEvent) {
			var oModel = this.getView().getModel("oViewModel");
			this.getView().byId("iconTabAC").setSelectedKey("Receiver");
			oModel.setProperty("/sDispatch", false);
			oModel.setProperty("/sReceive", true);
		},*/
		//2.on dispatch of the aircraft
		onDispatchClick: function(oEvt) {
			try {
				var DBInitialModel = {
					"StatusTitle": "Awaiting Recipient",
					"StatusButton": "Receive Aircraft",
					"StatusHeader": "This aircraft is undergoing transfer",
					"StatusSubHeader": "",
					"StatusInfo": "AH C 610 is locked"
				};
				dataUtil.setDataSet("DBInitialModel", DBInitialModel);
				this.getOwnerComponent().getRouter().navTo("DashboardInitial");
			} catch (e) {
				Log.error("Exception in DispatchAircraft:onDispatchClick function");
				this.handleException(e);
			}
		},
		//3.on click of the received aircraft
		onReceive: function(oEvent) {
			try {
				var DBInitialModel = {
					"StatusTitle": "Serviceable",
					"StatusButton": "noButton",
					"StatusHeader": "This aircraft is Serviceable",
					"StatusSubHeader": "There are no outstanding nor overdue jobs.",
					"StatusInfo": ""
				};
				dataUtil.setDataSet("DBInitialModel", DBInitialModel);
				this.getOwnerComponent().getRouter().navTo("DashboardInitial");
			} catch (e) {
				Log.error("Exception in DispatchAircraft:onReceive function");
				this.handleException(e);
			}
		},
		//4.on selection change of location combobox
		onSelectionChangeLoc: function(oEvent) {
			try {
				var key = oEvent.getSource().getSelectedKey(),
					oModel = this.getView().getModel("oViewModel");
				if (key !== "") {
					oModel.setProperty("/sReceiveTable", true);
					oEvent.getSource().setValueState("None");
					oEvent.getSource().setValueStateText("");
				} else {
					oModel.setProperty("/sReceiveTable", false);
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText("Required field");
				}
				// FieldValidations.validateFields(this);
			} catch (e) {
				Log.error("Exception in DispatchAircraft:onSelectionChangeLoc function");
				this.handleException(e);
			}
		},
		onSelectionChangesqn: function(oEvent) {
			try {
				var sText = oEvent.getSource()._getSelectedItemText(),
					oModel = this.getView().getModel("atckModel");
				oModel.setProperty("/header/RSQN", sText);
				if (sText === oModel.getProperty("/header/SQN")) {
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText("Cannot transfer platform to dispatcher or empty");
				}
			} catch (e) {
				Log.error("Exception in DispatchAircraft:onSelectionChangesqn function");
				this.handleException(e);
			}
		},
		//5.to enable dispatch based on the selection of custodian
		onSelecectionCustodian: function(oEvent) {
			try {
				this.getModel("atckModel").setProperty("/isListChange", true);
				this.getModel("atckModel").refresh();
			} catch (e) {
				Log.error("Exception in DispatchAircraft:onSelecectionCustodian function");
				this.handleException(e);
			}
		},
		onNavBackDispatch: function() {
			try {
				this.getRouter().navTo("AircraftTransfer");
			} catch (e) {
				Log.error("Exception in DispatchAircraft:onNavBackDispatch function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				this.fnLoadHeader();
				this.fnLoadCheckList();
				this.fnLoadLocation();
				this.fnLoadSqn();
				var oPage = this.getView().byId("pageDispatchId"); //Get Hold of page
				oPage.scrollTo(0, 0); //Page scroll to top
			} catch (e) {
				Log.error("Exception in DispatchAircraft:_onObjectMatched function");
				this.handleException(e);
			}
		},
		/** 
		 * Load current SQN header
		 */
		fnLoadHeader: function() {
			try {
				var sPath = this.getResourceBundle().getText("AIRTRANSCURRSVC");

				var oParameter = {};
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId()+"&LFLAG" + FilterOpEnum.EQ+"T";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var oHeader = oData.results.length > 0 ? oData.results[0] : {};
					if (oHeader.SQN) {
						oHeader.RSQN = oHeader.SQN;
					}
					this.getModel("atckModel").setProperty("/header", oHeader);
					var oModel = this.getView().getModel("oViewModel");
					if (this.getModel("atckModel").getProperty("/header/ASTID")) {
						oModel.setProperty("/Dispatch", false);
						oModel.setProperty("/Receive", true);
					} else {
						oModel.setProperty("/Dispatch", true);
						oModel.setProperty("/Receive", false);
					}
					this.getModel("atckModel").refresh(true);
				}.bind(this);
				ajaxutilNew.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in DispatchAircraft:fnLoadHeader function");
				this.handleException(e);
			}
		},

		fnLoadCheckList: function() {
			try {
				var sPath = this.getResourceBundle().getText("ATCHECKLISTSVC");
				var oParameter = {};
				//	oParameter.filter = "airid eq " + this.getAircraftId() + " and tailid eq " + this.getTailId();
				oParameter.filter = "airid" + FilterOpEnum.EQ + this.getAircraftId() + FilterOpEnum.AND + "tailid" + FilterOpEnum.EQ + this.getTailId();
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					oData.results.forEach(function(oItem) {
						oItem.answ = oItem.answ === "" ? "NA" : oItem.answ;
						oItem.answ1 = oItem.answ1 === "Y" ? true : false;
					});
					this.getModel("atckModel").setProperty("/checklist", oData.results);
					this.getModel("atckModel").refresh(true);
				}.bind(this);
				ajaxutilNew.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in DispatchAircraft:fnLoadCheckList function");
				this.handleException(e);
			}
		},
		fnLoadSquadranList: function() {
			try {
				var sPath = this.getResourceBundle().getText("AIRTRANSSVC");
				var oParameter = {};
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					this.getModel("atckModel").setProperty("/checklist", oData.results);
				}.bind(this);
				ajaxutilNew.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in DispatchAircraft:fnLoadSquadranList function");
				this.handleException(e);
			}
		},

		// 	CSQN: "140 SQN"
		// CSQNID: "SQN_140"
		// LFLAG: null
		// LOC: "Location 2"
		// LOCID: "LOC_101"
		// REFID: null
		// SQN: "140 SQN"
		// SQNID: "SQN_140"
		fnCheckResponse: function() {
			try {
				var bCheckFail = false;
				this.getModel("atckModel").getProperty("/checklist").forEach(function(oItem) {
					if (bCheckFail) {
						return;
					}
					if (oItem.answ === "Y" && !oItem.answ1) {
						MessageBox.error("Please align with current checklist.");
						bCheckFail = true;
					}
				});

				return bCheckFail;
			} catch (e) {
				Log.error("Exception in DispatchAircraft:fnCheckResponse function");
				this.handleException(e);
			}
		},

		/** 
		 * Signoff Function
		 * @returns
		 */
		fnSubmitResponse: function() {
			try {
				var oData = [];
				var oModel = this.getView().getModel("oViewModel");

				if (oModel.getProperty("/Receive") && this.fnCheckResponse()) {
					return; //Check fail
				}
				if (this.getModel("oViewModel").getProperty("/Receive") && this.fnCheckValueState("fgCmbBox")) {
					sap.m.MessageToast.show("Fill in all required input first");
					return;
				}
				// if (FieldValidations.validateFields(this)){
				// 	sap.m.MessageToast.show("Fill in all required input first");
				// 	return;
				// }
				this.getModel("atckModel").getProperty("/checklist").forEach(function(oItem) {
					var oPayload = {};
					oPayload.tranid = this.getModel("atckModel").getProperty("/isListChange") ? "X" : "";
					oPayload.chng = this.getModel("atckModel").getProperty("/isListChange") ? "X" : "";
					oPayload.tailid = this.getTailId();
					oPayload.airid = this.getAircraftId();
					oPayload.listid = oItem.listid;
					oPayload.transt = this.getModel("atckModel").getProperty("/header/ASTID") === '' ? "D" : "R";
					oPayload.csqnid = this.getModel("atckModel").getProperty("/header/CSQNID");
					oPayload.sqnid = this.getModel("atckModel").getProperty("/header/SQNID"); //oPayload.transt==='D'?this.getModel("atckModel").getProperty("/header/SQNID"):this.getModel("atckModel").getProperty("/header/CSQNID");
					oPayload.locid = this.getModel("atckModel").getProperty("/header/LOCID");
					oPayload.chkid = oItem.chkid;
					oPayload.chkdesc = oItem.chkdesc;
					oPayload.answ = oItem.answ;
					oPayload.answ1 = oItem.answ1 ? "Y" : "NA";
					oData.push(oPayload);
				}.bind(this));
				var oParameter = {};
				oParameter.activity = 1;
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					// this.getModel("atckModel").setProperty("/checklist",oData.results);
					this.onDispatchClick();
					this.getRouter().navTo("DashboardInitial");
				}.bind(this);

				if (oData) {
					ajaxutilNew.fnCreate(this.getResourceBundle().getText("ATCHECKLISTSVC"), oParameter, oData, "ZRM_TR_AC", this);
				}
			} catch (e) {
				Log.error("Exception in DispatchAircraft:fnSubmitResponse function");
				this.handleException(e);
			}
		},
		fnLoadLocation: function() {
			try {
				var oParameter = {};
				//	oParameter.filter = "REFID eq " + this.getAircraftId() + " and LFLAG eq L";
				oParameter.filter = "REFID" + FilterOpEnum.EQ + this.getAircraftId() + FilterOpEnum.AND + "LFLAG" + FilterOpEnum.EQ + "L"; // Phase 2 Changes 
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("atckModel").setProperty("/location", oData.results);
					this.getModel("atckModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("AIRTRANSCURRSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in DispatchAircraft:fnLoadLocation function");
				this.handleException(e);
			}
		},
		fnLoadSqn: function() {
			try {
				var oParameter = {};
				//	oParameter.filter = "REFID eq " + this.getAircraftId() + " and LFLAG eq S";
				oParameter.filter = "REFID" + FilterOpEnum.EQ + this.getAircraftId() + FilterOpEnum.AND + "LFLAG" + FilterOpEnum.EQ + "S"; // Phase 2 Changes 
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("atckModel").setProperty("/sqn", oData.results);
					this.getModel("atckModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("AIRTRANSCURRSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in DispatchAircraft:fnLoadSqn function");
				this.handleException(e);
			}
		},
		/** 
		 * Check for function group error state
		 * @param sFunctionGroupId
		 * @returns
		 */
		fnCheckValueState: function(sFunctionGroupId) {
			try {
				var aGroupControls = sap.ui.getCore().byFieldGroupId(sFunctionGroupId);
				var bError = false;
				aGroupControls.forEach(function(oControl) {
					if (oControl.setValueState && oControl.getValueState() === "Error") {
						bError = true;
						oControl.focus();
					}
				});
				return bError;
			} catch (e) {
				Log.error("Exception in fnCheckValueState function");
				this.handleException(e);
			}
		}

	});
});