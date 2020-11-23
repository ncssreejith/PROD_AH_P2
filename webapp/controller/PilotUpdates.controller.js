sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../util/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"sap/base/Log",
	"avmet/ah/util/cvUtil"
], function(BaseController, MessageToast, dataUtil, JSONModel, formatter, FieldValidations, ajaxutil, Log, cvUtil) {
	"use strict";
	/* ***************************************************************************
	 *	 Developer : AMIT KUMAR	
	 *   Control name: PilotUpdates           
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
	return BaseController.extend("avmet.ah.controller.PilotUpdates", {
		formatter: formatter,
		cvutil: cvUtil,

		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("PilotUpdates").attachPatternMatched(this._onObjectMatched, this);
				this.getView().setModel(new JSONModel({
					busy: true,
					delay: 0
				}), "viewModel");
				this.getView().setModel(new JSONModel({}), "oPilotUpdatesViewModel");
				// this.setRef(this);
			} catch (e) {
				Log.error("Exception in PilotUpdate:onInit function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onAfterRendering: function(oEvent) {
			try {
				this.getView().byId("engindId").bindElement({
					path: "/engines/0/1",
					model: "oPilotUpdatesViewModel"
				});
			} catch (e) {
				Log.error("Exception in PilotUpdate:onAfterRendering function");
				this.handleException(e);
			}
		},
		onAddTimings: function(oEvent) {
			try {
				var paDate = this.getModel("oPilotUpdatesViewModel").getProperty("/paDate");
				var currentTime = new Date();
				var oItem = {
					"srvid": null,
					"tailid": this.getTailId(),
					"num2": 1,
					"endda": null,
					"begda": null,
					"egstt": paDate.getHours() + ":" + paDate.getMinutes(),
					"woffw": currentTime.getHours() + ":" + currentTime.getMinutes(),
					"wonw": currentTime.getHours() + ":" + currentTime.getMinutes(),
					"egspt": currentTime.getHours() + ":" + currentTime.getMinutes()

				};
				this.getModel("oPilotUpdatesViewModel").getProperty("/timings").push(oItem);
				this.getModel("oPilotUpdatesViewModel").refresh();
			} catch (e) {
				Log.error("Exception in PilotUpdate:onAddTimings function");
				this.handleException(e);
			}
		},

		onDeleteTimings: function(oEvent) {
			try {
				var oIndex = oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getPath().split("/")[2];
				this.getModel("oPilotUpdatesViewModel").getProperty("/timings").splice(oIndex, 1);
				this.getModel("oPilotUpdatesViewModel").refresh(true);
			} catch (e) {
				Log.error("Exception in PilotUpdate:onDeleteTimings function");
				this.handleException(e);
			}
		},

		onLiveChange: function() {

		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		onViewAddLim: function() {
			try {
				var oModel = this.getView().getModel("oPilotUpdatesViewModel");
				this.getOwnerComponent().setModel(oModel, "oPilotUpdatesViewModel");
				this.getRouter().navTo("Limitations", true);
			} catch (e) {
				Log.error("Exception in onViewAddLim function");
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onAddDefectPress: function(oEvent) {
			try {
				var oItems = {
					"tailid": this.getTailId(),
					"jobid": null,
					"fr_no": null,
					"sgusr": null,
					"astid": null,
					"jobty": "",
					"jstat": "",
					"symbol": "",
					"purpose": "",
					"fair": "N",
					"srvtid": this.getModel("oPilotUpdatesViewModel").getProperty("/srvtid"),
					"stepid": this.getModel("oPilotUpdatesViewModel").getProperty("/stepid"),
					"jobdesc": null,
					"fstat": null,
					"srvid": ""
				};
				this.getModel("oPilotUpdatesViewModel").getProperty("/defects").push(oItems);
				this.getModel("oPilotUpdatesViewModel").refresh();
			} catch (e) {
				Log.error("Exception in PilotUpdate:onAddDefectPress function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		onEngineHITChange: function() {
			try {
				var sIndex = this.getModel("oPilotUpdatesViewModel").getProperty("/HIT");
				if (sIndex === "1") {
					this.getModel("oPilotUpdatesViewModel").setProperty("/chkrn", "1");
					this.onEngineReasonChange();
				} else {
					this.getModel("oPilotUpdatesViewModel").setProperty("/chkrn", "3");
					this.onEngineReasonChange();
				}
			} catch (e) {
				Log.error("Exception in PilotUpdate:onEngineHITChange function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		onEnginChange: function() {
			try {
				this.onEngineReasonChange();
			} catch (e) {
				Log.error("Exception in PilotUpdate:onEnginChange function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		onEngineReasonChange: function() {
			try {
				var sIndex = this.getModel("oPilotUpdatesViewModel").getProperty("/eng") === "engine1" ? "0" : "1";
				var sChkrn = this.getModel("oPilotUpdatesViewModel").getProperty("/chkrn");
				// var sChkrn = this.getModel("oPilotUpdatesViewModel").getProperty("/engines/"+sIndex + "/chkrn");
				this.getView().byId("engindId").bindElement({
					path: "/engines/" + sIndex + "/" + sChkrn,
					model: "oPilotUpdatesViewModel"
				});
			} catch (e) {
				Log.error("Exception in PilotUpdate:onEngineReasonChange function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onTimingChange: function(oEvent) {
			var sPath = oEvent.getSource().getBindingInfo("value").parts[0].path;
			var sValidTime = oEvent.getSource().getDateValue();
			var paDate = this.getModel("oPilotUpdatesViewModel").getProperty("/paDate");
			var currDate = new Date();
			var minTime = currDate,
				maxTime = currDate;
			var sMsg = true;
			var sLbl = oEvent.getSource().getLabels()[0].getText();
			switch (sPath) {
				case "egstt":
					minTime = paDate;
					maxTime = this._fnConvertCurrentTime(oEvent.getSource().getParent().getCells()[4].getDateValue());
					sMsg = this._fnDateTimeValid(sValidTime, minTime, maxTime, sLbl);
					break;
				case "wonw":
					minTime = paDate;
					maxTime = this._fnConvertCurrentTime(oEvent.getSource().getParent().getCells()[4].getDateValue());
					sMsg = this._fnDateTimeValid(sValidTime, minTime, maxTime, sLbl);
					break;
				case "woffw":
					minTime = paDate;
					maxTime = this._fnConvertCurrentTime(oEvent.getSource().getParent().getCells()[4].getDateValue());
					sMsg = this._fnDateTimeValid(sValidTime, minTime, maxTime, sLbl);
					break;
				case "egspt":
					minTime = this._fnConvertCurrentTime(oEvent.getSource().getParent().getCells()[1].getDateValue());
					sMsg = this._fnDateTimeValid(sValidTime, minTime, maxTime, sLbl);
					break;
			}
			if (sMsg !== "") {
				oEvent.getSource().setValue(currDate.getHours() + ":" + currDate.getMinutes());
				var oData = {
					messages: [sMsg]
				};
				this.fnShowMessage("E", oData, null, function() {

				});
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onFlyingNext: function(oEvent) {
			try {
				var sSelTab = this.getModel("oPilotUpdatesViewModel").getProperty("/selTab");
				var sNextKey = "";
				switch (sSelTab) {
					case "FlyingRecords":
						sNextKey = "StatusTest";
						break;
					case "StatusTest":
						sNextKey = "EnginePowerCheck";
						this.getModel("oPilotUpdatesViewModel").setProperty("/eng", "engine1");
						this.onEnginChange();
						break;
					case "EnginePowerCheck":
						sNextKey = "Manoeuvring";
						if (this.getModel("oPilotUpdatesViewModel").getProperty("/eng") === "engine1") {
							this.getModel("oPilotUpdatesViewModel").setProperty("/eng", "engine2");
							this.onEnginChange();
							sNextKey = "EnginePowerCheck";
						}

						break;
					case "Manoeuvring":
						sNextKey = "FlyingRecords";
						break;
				}
				this.getView().byId("idIconTabBar").setSelectedKey(sNextKey);
				this.getView().byId("idIconTabBar").getItems()[0].focus();
			} catch (e) {
				Log.error("Exception in PilotUpdate:onFlyingNext function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 * @returns
		 */
		onBackPress: function(oEvent) {
			try {
				var sSelTab = this.getModel("oPilotUpdatesViewModel").getProperty("/selTab");
				var sNextKey = "";
				switch (sSelTab) {
					case "StatusTest":
						sNextKey = "FlyingRecords";
						break;
					case "EnginePowerCheck":
						sNextKey = "StatusTest";
						if (this.getModel("oPilotUpdatesViewModel").getProperty("/eng") === "engine2") {
							this.getModel("oPilotUpdatesViewModel").setProperty("/eng", "engine1");
							this.onEnginChange();
							sNextKey = "EnginePowerCheck";
						}
						break;
					case "Manoeuvring":
						sNextKey = "EnginePowerCheck";
						this.getModel("oPilotUpdatesViewModel").setProperty("/eng", "engine2");
						this.onEnginChange();
						break;
					case "FlyingRecords":
						this.onNavBackPilotUpdate();
						return;
				}
				this.getView().byId("idIconTabBar").setSelectedKey(sNextKey);
				this.getView().byId("idIconTabBar").getItems()[0].focus();
			} catch (e) {
				Log.error("Exception in PilotUpdate:onBackPress function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onFlySelChange: function(oEvent) {
			var isFlyFail = false;
			oEvent.getSource().getParent().getParent().getItems().forEach(function(oItem) {
				if (oItem.getBindingContext("oPilotUpdatesViewModel").getProperty("frrid") === "FRR_F") {
					isFlyFail = true;
				}
			});
			this.getModel("oPilotUpdatesViewModel").setProperty("/isFlyFail", isFlyFail);
			this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/astatid", this.fnGetAircraftStatus());
			this.getModel("oPilotUpdatesViewModel").refresh();
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onSortiSelChange: function(oEvent) {
			var isSortiFail = false;
			oEvent.getSource().getParent().getParent().getItems().forEach(function(oItem) {
				if (oItem.getBindingContext("oPilotUpdatesViewModel").getProperty("frrid") === "PILOT_F") {
					isSortiFail = true;
				}
			});
			this.getModel("oPilotUpdatesViewModel").setProperty("/isSortiFail", isSortiFail);
			this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/astatid", this.fnGetAircraftStatus());
			this.getModel("oPilotUpdatesViewModel").refresh();
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onFairChange: function(oEvent) {
			var isFair = false;
			oEvent.getSource().getParent().getParent().getParent().getParent().getItems().forEach(function(oItem) {
				if (oItem.getBindingContext("oPilotUpdatesViewModel").getProperty("fair") === "Y") {
					isFair = true;
				}
			});
			this.getModel("oPilotUpdatesViewModel").setProperty("/isFair", isFair);
			this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/astatid", this.fnGetAircraftStatus());
			this.getModel("oPilotUpdatesViewModel").refresh();
		},
		//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		// onAircraftStatusChange:function(oEvent){
		// var isFair = false;
		// oEvent.getSource().getParent().getParent().getParent().getParent().getItems().forEach(function(oItem){
		// 	if(oItem.getBindingContext("oPilotUpdatesViewModel").getProperty("fair")==="Y"){
		// 		isFair = true;
		// 	}	
		// });
		// this.getModel("oPilotUpdatesViewModel").setProperty("/srvable",isFair);
		// this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/astatid",this.fnGetAircraftStatus());
		// this.getModel("oPilotUpdatesViewModel").refresh();
		// 	this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/astatid",this.fnGetAircraftStatus());
		// 	this.getModel("oPilotUpdatesViewModel").refresh();
		// },

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onEngineValuesChange: function(oEvent) {
			var sChkrn = this.getModel("oPilotUpdatesViewModel").getProperty("/chkrn");
			var sEngine = this.getModel("oPilotUpdatesViewModel").getProperty("/eng");
			var sPowerCheck1 = this.getModel("oPilotUpdatesViewModel").getProperty("/PowerCheck1");
			var sPowerCheck2 = this.getModel("oPilotUpdatesViewModel").getProperty("/PowerCheck2");

			if (!sPowerCheck1 && sEngine === "engine1") {
				sPowerCheck1 = sChkrn;
			}
			if (!sPowerCheck2 && sEngine === "engine2") {
				sPowerCheck2 = sChkrn;
			}

			if (sChkrn === "1") {
				if (sEngine === "engine1") {
					this.getModel("oPilotUpdatesViewModel").setProperty("/PowerCheck1", sChkrn);
				}
				if (sEngine === "engine2") {
					this.getModel("oPilotUpdatesViewModel").setProperty("/PowerCheck1", sChkrn);
				}
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		fnTblInAndIndTgt: function(oEvent) {
			try {
				var oObj = oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getObject();
				oObj.tgtdiff = oObj.tgtind - oObj.tgttab;
				this.getModel("oPilotUpdatesViewModel").refresh();
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnTblInAndIndTgt function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onSignOffPress: function(oEvent) {
			if (this.cvutil.validateForm(this.getView())) {//Teck Meng change on 20/11/2020 14:00
				this.getModel("oPilotUpdatesViewModel").setProperty("/selTab", "FlyingRecords");//Teck Meng change on 20/11/2020 14:00
				this.getView().byId("idIconTabBar").setSelectedKey("FlyingRecords");//Teck Meng change on 20/11/2020 14:00
				this.getView().byId("FuelLeft").focus(true);//Teck Meng change on 20/11/2020 14:00
				sap.m.MessageToast.show("Fuel amount not valid");//Teck Meng change on 20/11/2020 14:00
				return false;//Teck Meng change on 20/11/2020 14:00
			}//Teck Meng change on 20/11/2020 14:00
			this.fnCreateFlyRecords();
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onRemoveDefectPress: function(oEvent) {
			try {
				var oIndex = oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getPath().split("/")[2];
				this.getModel("oPilotUpdatesViewModel").getProperty("/defects").splice(oIndex, 1);
				this.getModel("oPilotUpdatesViewModel").refresh(true);
			} catch (e) {
				Log.error("Exception in onRemoveDefectPress function");
			}
		},
		onAircraftStatusChange: function(oEvent) {
			// var isFair = false;
			// oEvent.getSource().getParent().getParent().getParent().getParent().getItems().forEach(function(oItem){
			// 	if(oItem.getBindingContext("oPilotUpdatesViewModel").getProperty("fair")==="Y"){
			// 		isFair = true;
			// 	}	
			// });
			// this.getModel("oPilotUpdatesViewModel").setProperty("/srvable",isFair);
			// this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/astatid",this.fnGetAircraftStatus());
			// this.getModel("oPilotUpdatesViewModel").refresh();
			this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/astatid", this.fnGetAircraftStatus());
			this.getModel("oPilotUpdatesViewModel").refresh();

			//Disable Running change on unservicable
			if (oEvent.getSource().getSelectedKey() === "AST_US") {
				this.getModel("oPilotUpdatesViewModel").setProperty("/runningChange", "N");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		onSendOthers: function() {
			try {
				var isArmDeArmReq = this.getModel("oPilotUpdatesViewModel").getProperty("/armingReq");
				if (isArmDeArmReq === "Y") {
					this.fnCreateTimming();
					this.fnCreateAlarming();
					this.fnUpdateTanks();
					return;
				}
				this.fnCreateTimming();
				this.fnUpdateTanks();
				this.fnCreateAirMon();
				this.fnCreateFlyReq();
				this.fnCreateDefect();
				this.fnCreateEngine();
				this.fnCreateMano();
			} catch (e) {
				Log.error("Exception in PilotUpdate:onSendOthers function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnCreateFlyRecords: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/flyRecord");
				oPayloads.astatid = this.fnGetAircraftStatus();
				oPayloads.isfair = this.getModel("oPilotUpdatesViewModel").getProperty("/isFair") ? "Y" : "N";
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {
					this.onSendOthers();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate(this.getResourceBundle().getText("PILOTAH4FLYSVC"), oParameter, [oPayloads], "ZRM_PFR_P", this);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateFlyRecords function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		fnCreateAlarming: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/arming");
				if (oPayloads.length === 0) {
					return;
				}
				// oPayloads.armde = oPayloads.armde === "" ? "A" : "D";
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {
					this.getRouter().navTo("DashboardInitial", {}, true /*no history*/ );
				}.bind(this);
				ajaxutil.fnUpdate(this.getResourceBundle().getText("ALARMINGSVC"), oParameter, [oPayloads]);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateAlarming function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		fnCreateTimming: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/timings");
				if (oPayloads.length === 0) {
					return;
				}
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {};
				ajaxutil.fnCreate(this.getResourceBundle().getText("AH4TIMINGSSVC"), oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateTimming function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		fnUpdateTanks: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/fuleTanks");
				if (oPayloads.length === 0) {
					return;
				}
				oPayloads.forEach(function(oItem) {
					oItem.srvtid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvtid");
					oItem.stepid = this.getModel("oPilotUpdatesViewModel").getProperty("/stepid");
					oItem.tailid = this.getTailId();
				}.bind(this));
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {
					if (this.getModel("oPilotUpdatesViewModel").getProperty("/armingReq") === "Y") {
						if (this.getOwnerComponent().getModel("oPilotUpdatesViewModel")) {
							this.getOwnerComponent().getModel("oPilotUpdatesViewModel").setData(null);
						}
						this.getRouter().navTo("DashboardInitial", {}, true /*no history*/ );
					}
				}.bind(this);
				ajaxutil.fnCreate(this.getResourceBundle().getText("REPLENISHMENTSVC"), oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnUpdateTanks function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		fnCreateAirMon: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/airMon");
				if (oPayloads.length === 0) {
					return;
				}
				oPayloads.forEach(function(oItem) {
					oItem.astid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvable");
				}.bind(this));
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {};
				ajaxutil.fnUpdate(this.getResourceBundle().getText("PILOTSORTIF16SVC"), oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateAirMon function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		fnCreateFlyReq: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/flyReq");
				if (oPayloads.length === 0) {
					return;
				}
				oPayloads.forEach(function(oItem) {
					oItem.astid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvable");
				}.bind(this));
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {};
				ajaxutil.fnUpdate(this.getResourceBundle().getText("AH4STATUSSVC"), oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateFlyReq function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		fnCreateDefect: function() {
			try {
				var astid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvable");
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/defects");
				if (astid === 'AST_S') {
					return;
				}
				oPayloads.forEach(function(oItem) {
					oItem.astid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvable");
					oItem.fair = oItem.astid === 'AST_S' ? 'N' : oItem.fair;
				}.bind(this));
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {};
				ajaxutil.fnCreate(this.getResourceBundle().getText("PILOTDEFECTF16SVC"), oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateDefect function");
				this.handleException(e);
			}
		},
		/** //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * Create engine entries
		 * @returns
		 */
		fnCreateEngine: function() {
			try {
				if (this.getModel("oPilotUpdatesViewModel").getProperty("/engPowerCheckRequired") === "Y") {
					var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/engines");
					var aPayloads = [];
					aPayloads.push(oPayloads[0][1]);
					aPayloads.push(oPayloads[0][2]);
					aPayloads.push(oPayloads[0][3]);
					aPayloads.push(oPayloads[1][1]);
					aPayloads.push(oPayloads[1][2]);
					aPayloads.push(oPayloads[1][3]);
					var aFinalPayload = [];
					if (aPayloads.length === 0) {
						return;
					}
					//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
					aPayloads.forEach(function(oItem) {
						if (this.fnCheckEnginePayload(oItem)) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
							//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
							if (oItem.ENGNO === "1") { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
								if (oItem.chkrn === "1" && this.fnCheckHIT("1")) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
									oItem.xstat = "X"; //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
								} //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
							} //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
							//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
							if (oItem.ENGNO === "2") { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
								if (oItem.chkrn === "1" && this.fnCheckHIT("2")) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
									oItem.xstat = "X"; //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
								} //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
							} //Teck Meng change on 19/11/2020 13:00 AH Issue 1044,1043
							//Teck Meng change on 19/11/2020 13:00 AH Issue 1044,1043
							aFinalPayload.push(JSON.parse(JSON.stringify(oItem)));
						}
					}.bind(this));

					var oParameter = {};
					oParameter.error = function() {};
					oParameter.success = function() {};
					ajaxutil.fnCreate(this.getResourceBundle().getText("PILOTAH4POWERSVC"), oParameter, aFinalPayload);
				}
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateEngine function");
				this.handleException(e);
			}
		},
		/** 
		 * Check for valid engine engine entry
		 * @param oPayload
		 * @returns
		 */
		fnCheckEnginePayload: function(oPayload) {
			switch (oPayload.chkrn) {
				case "1":
					if (!oPayload.temp && !oPayload.bpress && !oPayload.tgttab && !oPayload.tgtind && !oPayload.ng && !oPayload.np) {
						return false;
					}
					break;
				case "2":
					if (!oPayload.temp && !oPayload.bpress && !oPayload.tgtind && !oPayload.ng && !oPayload.np) {
						return false;
					}
					break;
				case "3":
					if (!oPayload.temp && !oPayload.bpress && !oPayload.tgttab && !oPayload.tgtind && !oPayload.ng && !oPayload.np) {
						return false;
					}
					break;
			}
			return true;
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		fnCreateMano: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/mano");
				if (oPayloads.length === 0) {
					if (this.getOwnerComponent().getModel("oPilotUpdatesViewModel")) {
						this.getOwnerComponent().getModel("oPilotUpdatesViewModel").setData(null);
					}
					this.getRouter().navTo("DashboardInitial", {}, true /*no history*/ );
					return;
				}
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {
					if (this.getOwnerComponent().getModel("oPilotUpdatesViewModel")) {
						this.getOwnerComponent().getModel("oPilotUpdatesViewModel").setData(null);
					}
					this.getRouter().navTo("DashboardInitial", {}, true /*no history*/ );
				}.bind(this);
				ajaxutil.fnCreate(this.getResourceBundle().getText("PILOTAH4MANOEUVRINGSVC"), oParameter, [oPayloads]);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateMano function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 * @param oEvent
		 */
		_onObjectMatched: function(oEvent) {
			try {

				// this.setRef(this);
				if (this.getOwnerComponent().getModel("oPilotUpdatesViewModel")) {
					var oModel = this.getOwnerComponent().getModel("oPilotUpdatesViewModel");
					this.getView().setModel(oModel, "oPilotUpdatesViewModel");
				} else {
					this.getModel("oPilotUpdatesViewModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
					this.getModel("oPilotUpdatesViewModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
					this.getModel("oPilotUpdatesViewModel").setData(this._fnCreateData());

					var sSrvtid = this.getModel("avmetModel").getProperty("/dash/astid");
					if (sSrvtid === "AST_GN") {
						this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/fstat", "NF");
					}
					this.getModel("oPilotUpdatesViewModel").refresh();
					this.updateModel({
						busy: true
					}, "viewModel");
					this.fnReadArming();
					this.fnReadAmResults();
					this.fnReadOpType();
					this.fnReadflyResults();
					this.fnReadAirMon();
					this.fnReadFlyReq();
					this.fnReadEngine();
					this.fnReadAddLimitCount();
					this.fnReadFuleTankFromRepl();
					// this.fnReadFuleTanksFromRole();
				}

			} catch (e) {
				Log.error("Exception in PilotUpdate:_onObjectMatched function");
				this.handleException(e);
			}

		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadArming: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and srvtid eq " + this.getModel("oPilotUpdatesViewModel").getProperty(
					"/srvtid");
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					var oArming = oData.results.length > 0 ? oData.results[0] : null;
					if (!oArming) {
						oArming = {};
						var paDate = new Date();
					} else {
						paDate = new Date(oArming.sgdate + " " + oArming.sgtime);
					}
					this.getModel("oPilotUpdatesViewModel").setProperty("/timings/0/egstt", (paDate.getHours() + ":" + paDate.getMinutes()));
					this.getModel("oPilotUpdatesViewModel").setProperty("/paDate", paDate);
					this.getModel("oPilotUpdatesViewModel").setProperty("/arming", oArming);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("ALARMINGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadArming function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadOpType: function() {
			try {
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and ddid eq TOP";
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oPilotUpdatesViewModel").setProperty("/toper", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAmResults function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadAmResults: function() {
			try {
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and ddid eq PILOT";
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oPilotUpdatesViewModel").setProperty("/amResult", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAmResults function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadEngine: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					oData.results = this.fnSortEngine(oData.results);
					this._getEngPowerCheck(oData.results[0].engid, oData.results[0].engno);
					if (oData.results.length > 1) {
						this._getEngPowerCheck(oData.results[1].engid, oData.results[1].engno);
					}
					var aEngines = JSON.parse(JSON.stringify(oData.results));
					aEngines[0] = {
						"1": JSON.parse(JSON.stringify(oData.results[0])),
						"2": JSON.parse(JSON.stringify(oData.results[0])),
						"3": JSON.parse(JSON.stringify(oData.results[0]))
					};

					aEngines[1] = {
						"1": JSON.parse(JSON.stringify(oData.results[1])),
						"2": JSON.parse(JSON.stringify(oData.results[1])),
						"3": JSON.parse(JSON.stringify(oData.results[1]))
					};

					this.getModel("oPilotUpdatesViewModel").setProperty("/engines", aEngines);
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines/0/chkrn", oData.results[0].chkrn === null ? "1" : oData.results[0]
						.chkrn);
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines/1/chkrn", oData.results[1].chkrn === null ? "1" : oData.results[1]
						.chkrn);
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines/0/1/chkrn", oData.results[0].chkrn === null ? "1" : oData.results[
							0]
						.chkrn);
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines/0/2/chkrn", oData.results[0].chkrn === null ? "2" : oData.results[
							0]
						.chkrn);
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines/0/3/chkrn", oData.results[0].chkrn === null ? "3" : oData.results[
							0]
						.chkrn);
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines/1/1/chkrn", oData.results[1].chkrn === null ? "1" : oData.results[
							1]
						.chkrn);
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines/1/2/chkrn", oData.results[1].chkrn === null ? "2" : oData.results[
							1]
						.chkrn);
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines/1/3/chkrn", oData.results[1].chkrn === null ? "3" : oData.results[
							1]
						.chkrn);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("PILOTAH4POWERSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAmResults function");
				this.handleException(e);
			}
		},
		/** 
		 * Get Power check data
		 * @constructor 
		 */
		_getEngPowerCheck: function(sEngID, iEngine) {
			try {
				var
					oEngineModel = this.getView().getModel("oPilotUpdatesViewModel"),
					oParameter = {};
				if (sEngID) {
					oParameter.filter = "ENGID eq " + sEngID + " and FLAG eq P and tailid eq " + this.getTailId();
				} else {
					oParameter.filter = "tailid eq " + this.getTailId() + " and FLAG eq P";
				}
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results && oData.results.length) {
						oData.results.sort(function(b, a) {
							return parseInt(a.SRVID.split("_")[1]) - parseInt(b.SRVID.split("_")[1]);
						});
						var bFound = false;
						oData.results.forEach(function(oItem) {
							if (!bFound && oItem.chkrn === "2") {
								oItem.Special = true;
								bFound = true;
								oItem.minValue = parseFloat(JSON.parse(JSON.stringify(
									oItem.ETF ? oItem.ETF : 0)));
							}
						});
						if (oData) {
							if (iEngine === "1") {
								oEngineModel.setProperty("/EngPowerCheck", oData.results);
								// this.fnCheckHIT(iEngine);
							} else {
								oEngineModel.setProperty("/EngPowerCheck2", oData.results);
								// this.fnCheckHIT(iEngine);
							}
						}
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("EHSERSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in Engine:_getEngPowerCheck function");
				this.handleException(e);
			}
		},
		//2.Check for defect in the HIT chart 
		fnCheckHIT: function(iEngine) {
			try {
				var oEngineModel = this.getView().getModel("oPilotUpdatesViewModel");
				var aEngPowerCheck = {};
				if (iEngine === "1") {
					aEngPowerCheck = oEngineModel.getProperty("/EngPowerCheck");
				} else {
					aEngPowerCheck = oEngineModel.getProperty("/EngPowerCheck2");
				}
				var aLowerLimit = [];
				var aUpperLimit = [];
				var aDataPoints = [];
				var aRedPoints = [];
				var aOutOfRangePoints = [];
				var aLDashPoints = [];
				var aUDashPoints = [];
				//Loop
				aEngPowerCheck.forEach(function(oItem) {
					if (oItem.chkrn === "3") { //Re-estabishment reset HIT
						aDataPoints = [];
						aRedPoints = [];
						aOutOfRangePoints = [];
						aLDashPoints = [];
						aUDashPoints = [];
						aLowerLimit = [];
						aUpperLimit = [];
						return;
					}
					if (oItem.chkrn !== "1") {
						return;
					}
					var iULimit = parseInt(oItem.ULIMIT ? oItem.ULIMIT : 0) - 5;
					var iLLimit = parseInt(oItem.LLIMIT ? oItem.LLIMIT : 0) + 5;
					var iDiff = parseInt(oItem.TGTDIFF);
					if (iDiff > iULimit) {
						oItem.ULimitFlag = true;
						if (iDiff <= (iULimit + 5)) {
							aRedPoints.push(iDiff);
						} else {
							aOutOfRangePoints.push(iDiff);
						}
					}
					if (iDiff < iLLimit) {
						oItem.LLimitFlag = true;
						if (iDiff >= (iLLimit - 5)) {
							aRedPoints.push(iDiff);
						} else {
							aOutOfRangePoints.push(iDiff);
						}
					}

					aDataPoints.push(iDiff);

					aLDashPoints.push(iLLimit);
					aUDashPoints.push(iULimit);
					aLowerLimit.push(oItem.LLIMIT);
					aUpperLimit.push(oItem.ULIMIT);
				});

				if (aRedPoints.length >= 3 || aOutOfRangePoints.length > 0) {
					return true; //Create defect
				} else {
					return false;
				}
			} catch (e) {
				Log.error("Exception in Engine:_getEngPowerCheck function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadflyResults: function() {
			try {
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and ddid eq FR";
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oPilotUpdatesViewModel").setProperty("/flyResult", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadflyResults function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadAirMon: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this._fnMakeAllPass(oData, "PILOT_P");
					this.getModel("oPilotUpdatesViewModel").setProperty("/airMon", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("PILOTSORTIF16SVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAirMon function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadFlyReq: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this._fnMakeAllPass(oData, "FRR_P");
					this.getModel("oPilotUpdatesViewModel").setProperty("/flyReq", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("AH4STATUSSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadFlyReq function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadAddLimitCount: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oPilotUpdatesViewModel").setProperty("/ADDAndLIMIT", oData.results.length > 0 ? oData.results[0] : {});
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("PILOTADDLMTCTSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAddLimitCount function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadFuleTanksFromRole: function() {
			try {
				var sSrvtid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvtid");
				var sStepid = this.getModel("oPilotUpdatesViewModel").getProperty("/stepid");
				var oParameter = {};
				oParameter.filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + sSrvtid + " and STEPID eq " + sStepid +
					" and TAILID eq " + this.getTailId();
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					var oTanks = this.getModel("oPilotUpdatesViewModel").getProperty("/fuleTanks");
					var tTotal = oTanks.concat(oData.results);
					this.getModel("oPilotUpdatesViewModel").setProperty("/fuleTanks", tTotal);
					this.getModel("oPilotUpdatesViewModel").refresh();
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("REPLROLESVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadFuleTanksFromRole function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadFuleTankFromRepl: function() {
			try {
				var sSrvtid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvtid");
				var sStepid = this.getModel("oPilotUpdatesViewModel").getProperty("/stepid");
				var oParameter = {};
				oParameter.filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + sSrvtid + " and STEPID eq " + sStepid +
					" and TAILID eq " + this.getTailId() +
					" and REMID eq REM_F";
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					var oTanks = this.getModel("oPilotUpdatesViewModel").getProperty("/fuleTanks");
					var tTotal = oTanks.concat(oData.results);
					this.getModel("oPilotUpdatesViewModel").setProperty("/fuleTanks", tTotal);
					this.getModel("oPilotUpdatesViewModel").refresh();
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("REPLENISHMENTSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadFuleTankFromRepl function");
				this.handleException(e);
			}
		},
		fnSortEngine: function(oData) {
			var sEngine = [];
			// if engine 1 is not engine 1 then only sort 
			if (oData[1].engno === "1") {
				sEngine.push(oData[1]);
				sEngine.push(oData[0]);
			} else {
				sEngine = oData;
			}
			return sEngine;
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 * @param oData
		 * @param sStat
		 */
		_fnMakeAllPass: function(oData, sStat) {
			oData.results.forEach(function(oItem) {
				oItem.frrid = (oItem.frrid === "" || oItem.frrid === null) ? sStat : oItem.frrid;
			});
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		fnGetAircraftStatus: function() {
			var sAstId = "AST_S",
				rc = "Y";
			var isFly = this.getModel("oPilotUpdatesViewModel").getProperty("/isFlyFail");
			var isSorti = this.getModel("oPilotUpdatesViewModel").getProperty("/isSortiFail");
			var astId = this.getModel("oPilotUpdatesViewModel").getProperty("/srvable");
			if (isFly || isSorti || astId === "AST_US") {
				sAstId = "AST_US";
				rc = "N";
				this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/rcreq", rc);
			}

			this.getModel("oPilotUpdatesViewModel").refresh();
			return sAstId;
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 * @returns
		 */
		_fnCreateData: function() {
			try {
				var currentTime = new Date();
				var oPayload = {};
				oPayload.srvtid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvtid");
				oPayload.stepid = this.getModel("oPilotUpdatesViewModel").getProperty("/stepid");
				oPayload.selTab = "FlyingRecords";
				oPayload.paDate = currentTime;
				oPayload.ismano = "Y";
				oPayload.armingReq = "N";
				oPayload.srvable = "AST_S";
				oPayload.arming = {};
				oPayload.ADDAndLIMIT = {};
				oPayload.amResult = [];
				oPayload.flyResult = [];
				oPayload.airMon = [];
				oPayload.flyReq = [];
				oPayload.fuleTanks = [];
				oPayload.toper = [];
				oPayload.isFlyFail = false;
				oPayload.isSortiFail = false;
				oPayload.isFair = false; //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				oPayload.runningChange = "N"; //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				oPayload.engPowerCheckRequired = "N"; //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				oPayload.chkrn = "1"; //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				oPayload.HIT = "1"; //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				oPayload.eng = "engine1"; //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				oPayload.flyRecord = {
					"srvid": null,
					"tailid": this.getTailId(),
					"endda": null,
					"begda": null,
					"airid": this.getAircraftId(),
					"modid": null,
					"fstat": "F",
					"oprty": "A",
					"lnor": 0,
					"lrun": 0,
					"ltot": 0,
					"apudur": 0,
					"stepid": oPayload.stepid,
					"srvtid": oPayload.srvtid,
					"rcreq": "N", // IF THEY RUNNING CHANGE SEL
					"isfair": "N", // IF ANY FAIR JOB DEFECT SELECT 
					"astatid": "AST_S" // AST_S IF SERVICEABLE AST_US IF UNSERVICEABLE ,FAIL SORTI,FAIL FLY  
				};
				oPayload.timings = [{
					"srvid": null,
					"tailid": this.getTailId(),
					"num2": 1,
					"endda": null,
					"begda": null,
					"egstt": currentTime.getHours() + ":" + currentTime.getMinutes(),
					"woffw": currentTime.getHours() + ":" + currentTime.getMinutes(),
					"wonw": currentTime.getHours() + ":" + currentTime.getMinutes(),
					"egspt": currentTime.getHours() + ":" + currentTime.getMinutes()
				}];
				oPayload.defects = [{
					"tailid": this.getTailId(),
					"jobid": null,
					"fr_no": null,
					"sgusr": null,
					"astid": null,
					"jobty": "",
					"jstat": "",
					"symbol": "",
					"purpose": "",
					"fair": "N",
					"srvtid": oPayload.srvtid,
					"stepid": oPayload.stepid,
					"jobdesc": null,
					"fstat": null,
					"srvid": ""
				}];
				oPayload.engines = [{
					"srvid": null,
					"tailid": this.getTailId(),
					"engno": 1,
					"endda": null,
					"begda": null,
					"engid": null,
					"chkrn": "1",
					"temp": 0,
					"bpress": 0,
					"tgttab": 0,
					"tgtind": 0,
					"tgtdiff": 0,
					"xstat": 0,
					"ulimit": 0,
					"llimit": 0,
					"ng": 0.0,
					"tqact": 0,
					"eft": 0,
					"aspeed": 0,
					"np": 0
				}, {
					"srvid": null,
					"tailid": this.getTailId(),
					"engno": 2,
					"endda": null,
					"begda": null,
					"engid": null,
					"chkrn": "1",
					"temp": 0,
					"bpress": 0,
					"tgttab": 0,
					"tgtind": 0,
					"tgtdiff": 0,
					"xstat": 0,
					"ulimit": 0,
					"llimit": 0,
					"ng": 0.0,
					"tqact": 0,
					"eft": 0,
					"aspeed": 0,
					"np": 0
				}];

				oPayload.mano = {
					"srvid": null,
					"tailid": this.getTailId(),
					"endda": null,
					"begda": null,
					"SRVTID": oPayload.srvtid,
					"STEPID": oPayload.stepid,
					"manoe": "N",
					"rolaob": 0,
					"rolmax": 0,
					"pitch_1": 0,
					"pitch_2": 0,
					"glmax": 0,
					"glmin": 0,
					"fpdauw": 0,
					"fpdlen": 0
				};
			} catch (e) {
				Log.error("Exception in PilotUpdate:_fnCreateData function");
				this.handleException(e);
			}
			return oPayload;
		}

	});
});