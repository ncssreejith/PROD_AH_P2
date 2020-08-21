sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil, JSONModel, MessageBox) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.DispatchAircraft", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			this.getRouter().getRoute("DispatchAircraft").attachPatternMatched(this._onObjectMatched, this);
			var oatchkData = {};
			oatchkData.isListChange = "";
			oatchkData.header = {};
			oatchkData.checklist = [];
			oatchkData.location = [];
			oatchkData.sqn = [];
			this.setModel(new JSONModel(), "atckModel");
			this.setModel(new JSONModel(), "oViewModel");
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		//1.on click of ico selected
		onIconTabSelection: function(oEvent) {
			var key = oEvent.getSource().getSelectedKey(),
				oModel = this.getView().getModel("oViewModel");
			if (key === "receiver") {
				oModel.setProperty("/Dispatch", false);
				oModel.setProperty("/Receive", true);
			} else {
				oModel.setProperty("/Dispatch", true);
				oModel.setProperty("/Receive", false);
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
			var DBInitialModel = {
				"StatusTitle": "Awaiting Recipient",
				"StatusButton": "Receive Aircraft",
				"StatusHeader": "This aircraft is undergoing transfer",
				"StatusSubHeader": "",
				"StatusInfo": "AH C 610 is locked"
			};
			dataUtil.setDataSet("DBInitialModel", DBInitialModel);
			this.getOwnerComponent().getRouter().navTo("DashboardInitial");
		},
		//3.on click of the received aircraft
		onReceive: function(oEvent) {
			var DBInitialModel = {
				"StatusTitle": "Serviceable",
				"StatusButton": "noButton",
				"StatusHeader": "This aircraft is Serviceable",
				"StatusSubHeader": "There are no outstanding nor overdue jobs.",
				"StatusInfo": ""
			};
			dataUtil.setDataSet("DBInitialModel", DBInitialModel);
			this.getOwnerComponent().getRouter().navTo("DashboardInitial");
		},
		//4.on selection change of location combobox
		onSelectionChangeLoc: function(oEvent) {
			var key = oEvent.getSource().getSelectedKey(),
				oModel = this.getView().getModel("oViewModel");
			if (key !== "") {
				oModel.setProperty("/sReceiveTable", true);
			} else {
				oModel.setProperty("/sReceiveTable", false);
			}
		},
		onSelectionChangesqn: function(oEvent) {
			var sText = oEvent.getSource()._getSelectedItemText(),
				oModel = this.getView().getModel("atckModel");
				oModel.setProperty("/header/RSQN", sText);
		},
		//5.to enable dispatch based on the selection of custodian
		onSelecectionCustodian: function(oEvent) {
			this.getModel("atckModel").setProperty("/isListChange", true);
			this.getModel("atckModel").refresh();

		},
		onNavBackDispatch: function() {
			this.getRouter().navTo("AircraftTransfer");
		},

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			this.fnLoadHeader();
			this.fnLoadCheckList();
			this.fnLoadLocation();
			this.fnLoadSqn();
		},
		fnLoadHeader: function() {
			var sPath = "/airtranscurrsvc/" + this.getTailId();
			var oParameter = {};
			oParameter.error = function() {};
			oParameter.success = function(oData) {
				var oHeader = oData.results.length > 0 ? oData.results[0] : {};
				if(oHeader.SQN){
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
			ajaxutil.fnRead(sPath, oParameter);
		},

		fnLoadCheckList: function() {
			var sPath = "/ATCheckListSvc";
			var oParameter = {};
			oParameter.filter = "airid eq " + this.getAircraftId() + " and tailid eq " + this.getTailId();
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
			ajaxutil.fnRead(sPath, oParameter);
		},
		fnLoadSquadranList: function() {
			var sPath = "/airtranssvc";
			var oParameter = {};
			oParameter.error = function() {

			};
			oParameter.success = function(oData) {
				this.getModel("atckModel").setProperty("/checklist", oData.results);
			}.bind(this);
			ajaxutil.fnRead(sPath, oParameter);
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
		},

		fnSubmitResponse: function() {
			var oData = [];
			var oModel = this.getView().getModel("oViewModel");

			if (oModel.getProperty("/Receive") && this.fnCheckResponse()) {
				return; //Check fail
			}
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
				ajaxutil.fnCreate("/ATCheckListSvc", oParameter, oData, "ZRM_TR_AC", this);
			}
		},
		fnLoadLocation: function() {
			var oParameter = {};
			oParameter.filter = "REFID eq " + this.getAircraftId() + " and LFLAG eq L";
			oParameter.error = function() {};
			oParameter.success = function(oData) {
				this.getModel("atckModel").setProperty("/location", oData.results);
				this.getModel("atckModel").refresh();
			}.bind(this);
			ajaxutil.fnRead("/airtranscurrsvc", oParameter);
		},
		fnLoadSqn: function() {
			var oParameter = {};
			oParameter.filter = "REFID eq " + this.getAircraftId() + " and LFLAG eq S";
			oParameter.error = function() {};
			oParameter.success = function(oData) {
				this.getModel("atckModel").setProperty("/sqn", oData.results);
				this.getModel("atckModel").refresh();
			}.bind(this);
			ajaxutil.fnRead("/airtranscurrsvc", oParameter);
		}

	});
});