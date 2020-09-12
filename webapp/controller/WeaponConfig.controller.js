sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log"
], function(BaseController, MessageToast, dataUtil, JSONModel, formatter, ajaxutil, Log) {
	"use strict";
	/* ***************************************************************************
	 *	 Developer : AMIT KUMAR	
	 *   Control name: WeaponConfig           
	 *   Purpose : Add Equipment running log dialog controller
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

	return BaseController.extend("avmet.ah.controller.WeaponConfig", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("WeaponConfig").attachPatternMatched(this._onObjectMatched, this);
				var oData = {};

				oData.apprvlevl = 0;
				oData.stns = [];
				oData.srnos = [];
				oData.srvtid = "";
				oData.stepid = "";

				this.getView().setModel(new JSONModel(oData), "oWCModel");
				this.getView().setModel(new JSONModel({
					busy: false,
					delay: 0
				}), "oViewModel");
			} catch (e) {
				Log.error("Exception in WeaponConfig:onInit function");
				this.handleException(e);
			}
		},

		// CNL = Cancel , OK = SAVE , OPN = OPEN
		// fnOpenCloseConfirmationDialog($event,'OPN') 
		fnOpenCloseConfirmationDialog: function(oEvent, opType) {
			try {
				var sOpenFrag = "FOToolsCheck";
				var oDialog = null;
				var oDialogData = {
					TOTQTY: "",
					SERNR: "",
					chk1: false,
					chk2: false
				};
				var sApprCount = this.getModel("oWCModel").getProperty("/stns/0/APPRCOUNT");
				switch (sApprCount) {
					case 1:
						sOpenFrag = "AHFOToolsCheck";
						oDialogData.TOTQTY = 0; //this.getModel("oWCModel").getProperty("/stns/0/TOTQTY");
						oDialogData.SERNR = 0; //this.getModel("oWCModel").getProperty("/stns/0/QTYADD");
						break;
				}
				if (opType === "OPN") {
					oDialog = this.openDialog(sOpenFrag, ".fragments.fs.wlc.");
					oDialog.setModel(new JSONModel(oDialogData), "oDialogModel");
				}
				if (opType === "CNL") {
					oDialog = this.closeDialog(sOpenFrag, ".fragments.fs.wlc.");
				}
				if (opType === "OK") {
					oDialog = this.closeDialog(sOpenFrag, ".fragments.wlc.");
					this.getModel("oWCModel").setProperty("/stns/0/TOTQTY", oDialog.getModel("oDialogModel").getProperty("/TOTQTY"));
					this.getModel("oWCModel").setProperty("/stns/0/SERNR", oDialog.getModel("oDialogModel").getProperty("/SERNR"));
					this.getModel("oWCModel").refresh();
					this.onSignOffClk();
				}
			} catch (e) {
				Log.error("Exception in WeaponConfig:fnOpenCloseConfirmationDialog function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		onSignOffClk: function(oEvent) {
			try {
				var oStn = this.getModel("oWCModel").getProperty("/stns/0");
				var oPayloads = {
					"AIRID": null,
					"ROLEID": null,
					"SUBID": null,
					"STNMID": oStn.APPRCOUNT,
					"L_TXT": null,
					"WEMID": oStn.APPRCOUNT,
					"WESID": oStn.APPRCOUNT,
					"ADPID": oStn.APPRCOUNT,
					"ADPDESC": null,
					"WEMDESC": null,
					"WESDESC": null,
					"STNSID": oStn.APPRCOUNT,
					"CONTOR": null,
					"ISSER": null,
					"TAILID": this.getTailId(),
					"SRVID": null,
					"NUM1": null,
					"SRVTID": this.getModel("oWCModel").getProperty("/srvtid"),
					"SERNR": this.getModel("oWCModel").getProperty("/stns/0/SERNR"),
					"endda": null,
					"begda": null,
					"TOTQTY": this.getModel("oWCModel").getProperty("/stns/0/SERNR"),
					"CONECT": null,
					"HCFLAG": null,
					"STEPID": this.getModel("oWCModel").getProperty("/stepid"),
					"EXPAND": null,
					"TLSERNR": oStn.TLSERNR,
					"APPRCOUNT": oStn.APPRCOUNT
				};
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					// this.getView().byId("wizWeaponConfigId").nextStep();
					this.fnLoadStation();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/WeaponConfigSvc", oParameter, [oPayloads], "ZRM_FS_WCS", this);
			} catch (e) {
				Log.error("Exception in WeaponConfig:onSignOffClk function");
				this.handleException(e);
			}
		},
		onStationPress: function(oEvent) {
			try {
				// var oStation = oEvent.getSource().getBindingContext("oWCModel").getObject();
				// this.getOwnerComponent().getRouter().navTo("Station", {
				// 	srvtid: this.getModel("oWCModel").getProperty("/srvtid"),
				// 	stepid: this.getModel("oWCModel").getProperty("/stepid"),
				// 	stns: oStation.STNSID,
				// 	stnmid: oStation.STNMID
				// });
				var sID = oEvent.getParameter("srcControl").getId();
				if (sID.search("station") !== -1 || sID.search("others") !== -1) {
					var oStation = oEvent.getSource().getBindingContext("oWCModel").getObject();
						this.getOwnerComponent().getRouter().navTo("Station", {
							srvtid: this.getModel("oWCModel").getProperty("/srvtid"),
							stepid: this.getModel("oWCModel").getProperty("/stepid"),
							stns: oStation.STNSID,
							stnmid: oStation.STNMID
						});
				}
			} catch (e) {
				Log.error("Exception in WeaponConfig:onStationPress function");
				this.handleException(e);
			}
		},

		fnLoadStation: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and srvtid eq " + this.getModel("oWCModel").getProperty("/srvtid") +
					" and airid eq " + this.getAircraftId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					// oData.results[0].APPRCOUNT = 1;
					this.getModel("oWCModel").setProperty("/stns", oData.results);
					this.getModel("oWCModel").refresh();
					// this.updateModel({busy:false} ,"oViewModel");
				}.bind(this);
				ajaxutil.fnRead("/WeaponSvc", oParameter);
			} catch (e) {
				Log.error("Exception in WeaponConfig:fnLoadStation function");
				this.handleException(e);
			}
		},

		// fnLoadSerailNo: function(oEvent) {

		// },

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************

		_onObjectMatched: function(oEvent) {
			try {
				this.getModel("oWCModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("oWCModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this.getModel("oWCModel").refresh();
				this.fnLoadStation();
			} catch (e) {
				Log.error("Exception in WeaponConfig:_onObjectMatched function");
				this.handleException(e);
			}
		},
		_fnStepCount: function() {
			try {
				var oAppCount = this.getModel("oWCModel").getProperty("/stns/0/APPRCOUNT");
				for (var i = 1; oAppCount > i; i++) {
					this.getView().byId("wzStepId").nextStep();
				}
			} catch (e) {
				Log.error("Exception in WeaponConfig:_fnStepCount function");
				this.handleException(e);
			}
		},
		onBackPress: function(oEvent) {

		},
		onSerialNoPress: function(oEvent) {
			try {
				var oStation = oEvent.getParameter("oSource").getParent().getBindingContext("oWCModel").getObject();
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stnmid eq " + oStation.STNMID + " and stnsid eq " + oStation.STNSID;
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oWCModel").setProperty("/srnos", oData.results);
					this.getModel("oWCModel").refresh();
					this.openDialog("SerialNosDialog", ".fragments.fs.wlc.");
				}.bind(this);
				ajaxutil.fnRead("/WeaponSernrSvc", oParameter);
			} catch (e) {
				Log.error("Exception in WeaponConfig:onSerialNoPress function");
				this.handleException(e);
			}
		},
		onSerialNoOkClose: function() {
			try {
				this.closeDialog("SerialNosDialog");
			} catch (e) {
				Log.error("Exception in WeaponConfig:onSerialNoOkClose function");
				this.handleException(e);
			}
		}
	});

});