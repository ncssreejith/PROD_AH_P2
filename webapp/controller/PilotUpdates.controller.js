sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../model/dataUtil",
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

		onAfterRendering: function(oEvent) {
			try {
				this.getView().byId("engindId").bindElement({
					path: "/engines/0",
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

		onViewAddLim: function() {
			try {
				var oModel = this.getView().getModel("oPilotUpdatesViewModel");
				this.getOwnerComponent().setModel(oModel, "oPilotUpdatesViewModel");
				this.getRouter().navTo("Limitations", true);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

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

		onEnginChange: function() {
			try {
				var sIndex = this.getModel("oPilotUpdatesViewModel").getProperty("/eng") === "engine1" ? "0" : "1";
				this.getView().byId("engindId").bindElement({
					path: "/engines/" + sIndex,
					model: "oPilotUpdatesViewModel"
				});
			} catch (e) {
				Log.error("Exception in PilotUpdate:onEnginChange function");
				this.handleException(e);
			}
		},
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
		onSignOffPress: function(oEvent) {
			this.fnCreateFlyRecords();
		},

		onRemoveDefectPress: function(oEvent) {
			try {
				var oIndex = oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getPath().split("/")[2];
				this.getModel("oPilotUpdatesViewModel").getProperty("/defects").splice(oIndex, 1);
				this.getModel("oPilotUpdatesViewModel").refresh(true);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

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
		fnCreateFlyRecords: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/flyRecord");
				if (oPayloads.length === 0) {
					return;
				}
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {
					this.onSendOthers();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/PilotAH4flySvc", oParameter, [oPayloads], "ZRM_PFR_P", this);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateFlyRecords function");
				this.handleException(e);
			}
		},
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
				ajaxutil.fnUpdate("/AlarmingSvc", oParameter, [oPayloads]);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateAlarming function");
				this.handleException(e);
			}
		},

		fnCreateTimming: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/timings");
				if (oPayloads.length === 0) {
					return;
				}
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {};
				ajaxutil.fnCreate("/AH4TimingsSvc", oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateTimming function");
				this.handleException(e);
			}
		},
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
				ajaxutil.fnCreate("/ReplshmentSvc", oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnUpdateTanks function");
				this.handleException(e);
			}
		},
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
				ajaxutil.fnUpdate("/PilotSortiF16Svc", oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateAirMon function");
				this.handleException(e);
			}
		},
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
				ajaxutil.fnUpdate("/AH4StatusSvc", oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateFlyReq function");
				this.handleException(e);
			}
		},
		fnCreateDefect: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/defects");
				if (oPayloads.length === 0) {
					return;
				}
				oPayloads.forEach(function(oItem) {
					oItem.astid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvable");
					oItem.fair = oItem.astid === 'AST_S' ? 'N' : oItem.fair;
				}.bind(this));
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {};
				ajaxutil.fnCreate("/PilotDefectF16Svc", oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateDefect function");
				this.handleException(e);
			}
		},
		fnCreateEngine: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/engines");
				if (oPayloads.length === 0) {
					return;
				}
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {};
				ajaxutil.fnCreate("/PilotAH4PowerSvc", oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateEngine function");
				this.handleException(e);
			}
		},
		fnCreateMano: function() {
			try {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/mano");
				if (oPayloads.length === 0) {
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
				ajaxutil.fnCreate("/PilotAH4ManoeuvringSvc", oParameter, [oPayloads]);
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
					this.fnReadFuleTanksFromRole();
				}

			} catch (e) {
				Log.error("Exception in PilotUpdate:_onObjectMatched function");
				this.handleException(e);
			}

		},

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
				ajaxutil.fnRead("/AlarmingSvc", oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadArming function");
				this.handleException(e);
			}
		},

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
				ajaxutil.fnRead("/MasterDDREFSvc", oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAmResults function");
				this.handleException(e);
			}
		},

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
				ajaxutil.fnRead("/MasterDDREFSvc", oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAmResults function");
				this.handleException(e);
			}
		},

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
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines", oData.results);
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines/0/chkrn", oData.results[0].chkrn === null ? "1" : oData.results[0]
						.chkrn);
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines/1/chkrn", oData.results[1].chkrn === null ? "1" : oData.results[1]
						.chkrn);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/PilotAH4PowerSvc", oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAmResults function");
				this.handleException(e);
			}
		},

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
				ajaxutil.fnRead("/MasterDDREFSvc", oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadflyResults function");
				this.handleException(e);
			}
		},

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
				ajaxutil.fnRead("/PilotSortiF16Svc", oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAirMon function");
				this.handleException(e);
			}
		},

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
				ajaxutil.fnRead("/AH4StatusSvc", oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadFlyReq function");
				this.handleException(e);
			}
		},
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
				ajaxutil.fnRead("/PilotAddLmtCtSvc", oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAddLimitCount function");
				this.handleException(e);
			}
		},

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
				ajaxutil.fnRead("/ReplRoleSvc", oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadFuleTanksFromRole function");
				this.handleException(e);
			}
		},
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
				};
				oParameter.success = function(oData) {
					var oTanks = this.getModel("oPilotUpdatesViewModel").getProperty("/fuleTanks");
					var tTotal = oTanks.concat(oData.results);
					this.getModel("oPilotUpdatesViewModel").setProperty("/fuleTanks", tTotal);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/ReplshmentSvc", oParameter);
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
		_fnMakeAllPass: function(oData, sStat) {
			oData.results.forEach(function(oItem) {
				oItem.frrid = (oItem.frrid === "" || oItem.frrid === null) ? sStat : oItem.frrid;
			});
		},
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
					"apudur": 0
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