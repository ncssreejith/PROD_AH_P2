sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"sap/base/Log",
	"avmet/ah/util/cvUtil",
	"../util/ajaxutilNew",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, MessageToast, dataUtil, JSONModel, formatter, FieldValidations, ajaxutil, Log, cvUtil, ajaxutilNew,
	FilterOpEnum) {
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
					"egstt": this.formatter.oDataDateTimeFormat(paDate, "yyyy-MM-dd HH:mm"), //Rahul: 28/12/2020: Code change
					"woffw": this.formatter.oDataDateTimeFormat(paDate, "yyyy-MM-dd HH:mm"), //Rahul: 28/12/2020: Code change
					"wonw": this.formatter.oDataDateTimeFormat(currentTime, "yyyy-MM-dd HH:mm"), //Rahul: 28/12/2020: Code change
					"egspt": this.formatter.oDataDateTimeFormat(currentTime, "yyyy-MM-dd HH:mm"), //Rahul: 28/12/2020: Code change
					"pnum": this.getModel("oPilotUpdatesViewModel").getProperty("/num1"), //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					"diffwo": 0,
					"diffeg": 0
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
		onEnginChange: function() {
			try {
				var sIndex = this.getModel("oPilotUpdatesViewModel").getProperty("/eng") === "engine1" ? "0" : "1";
				var oEngine = this.getModel("oPilotUpdatesViewModel").getProperty("/engines/" + sIndex);
				this.getView().byId("engindId").bindElement({
					path: "/engines/" + sIndex,
					model: "oPilotUpdatesViewModel"
				});
				this.getView().byId("engindCldId").bindElement({
					path: "/engines/" + sIndex + "/rfc/" + oEngine.selTab,
					model: "oPilotUpdatesViewModel"
				});

			} catch (e) {
				Log.error("Exception in PilotUpdate:onEnginChange function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		onEngineReasonChange: function(oEvent) {
			try {
				var sIndex = this.getModel("oPilotUpdatesViewModel").getProperty("/eng") === "engine1" ? "0" : "1";
				var oSelPath = oEvent.getSource().getSelectedKey();
				this.getView().byId("engindCldId").bindElement({
					path: "/engines/" + sIndex + "/rfc/" + oSelPath,
					model: "oPilotUpdatesViewModel"
				});
				this.getModel("oPilotUpdatesViewModel").setProperty("/engines/" + sIndex + "/selTab", oSelPath);
				this.getModel("oPilotUpdatesViewModel").refresh();
			} catch (e) {
				Log.error("Exception in PilotUpdate:onEngineReasonChange function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		////Rahul : change on 28/12/2020 : Start
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
					maxTime = new Date(oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getProperty("egspt")); //this._fnConvertCurrentTime(oEvent.getSource().getParent().getCells()[4].getDateValue());
					sMsg = this._fnDateTimeValid(sValidTime, minTime, maxTime, sLbl);
					//currDate = oEvent.getSource().getParent().getCells()[4].getDateValue();
					break;
				case "wonw":
					minTime = new Date(oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getProperty("egstt"));
					maxTime = new Date(oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getProperty("woffw")); //this._fnConvertCurrentTime(oEvent.getSource().getParent().getCells()[4].getDateValue());
					sMsg = this._fnDateTimeValid(sValidTime, minTime, maxTime, sLbl);
					//currDate = oEvent.getSource().getParent().getCells()[4].getDateValue();
					break;
				case "woffw":
					minTime = new Date(oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getProperty("wonw"));
					maxTime = new Date(oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getProperty("egspt")); //this._fnConvertCurrentTime(oEvent.getSource().getParent().getCells()[4].getDateValue());
					sMsg = this._fnDateTimeValid(sValidTime, minTime, maxTime, sLbl);
					//currDate = oEvent.getSource().getParent().getCells()[4].getDateValue();
					break;
				case "egspt":
					minTime = new Date(oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getProperty("egstt"));
					//maxTime = new Date(oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getProperty("egspt"));
					//this._fnConvertCurrentTime(oEvent.getSource().getParent().getCells()[1].getDateValue());
					sMsg = this._fnDateTimeValid(sValidTime, minTime, maxTime, sLbl);
					//currDate = oEvent.getSource().getParent().getCells()[4].getDateValue();
					break;
			}
			if (sMsg !== "") {
				//oEvent.getSource().setValue(currDate.getHours() + ":" + currDate.getMinutes());
				sValidTime = new Date(oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getProperty(sPath));
				//oEvent.getSource().setDateValue(sValidTime);
				var oData = {
					messages: [sMsg]
				};
				this.fnShowMessage("E", oData, null, function() {

				});
			}
			var dPath = oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getPath() + "/" + sPath;
			this.getModel("oPilotUpdatesViewModel").setProperty(dPath, this.formatter.oDataDateTimeFormat(sValidTime, "yyyy-MM-dd HH:mm"));
			oEvent.getSource().setDateValue(sValidTime);
			this.getModel("oPilotUpdatesViewModel").refresh();
		},
		////Rahul : change on 28/12/2020 : End

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
				if (oItem.getBindingContext("oPilotUpdatesViewModel").getProperty("FRRID") === "FRR_F") { //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
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

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onEngineValuesChange: function(oEvent) {
			this.fnLockEngineReason(oEvent); //Teck Meng change on 04/12/2020 14:00//Teck Meng change on 07/12/2020 14:00
			this.getModel("oPilotUpdatesViewModel").refresh(); //Teck Meng change on 07/12/2020 14:00
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		fnTblInAndIndTgt: function(oEvent) {
			try {
				var oObj = oEvent.getSource().getBindingContext("oPilotUpdatesViewModel").getObject();
				oObj.tgtdiff = oObj.tgtind - oObj.tgttab;
				this.fnLockEngineReason(oEvent); //Teck Meng change on 04/12/2020 14:00
				this.getModel("oPilotUpdatesViewModel").refresh();
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnTblInAndIndTgt function");
				this.handleException(e);
			}
		},

		fnLockEngineReason: function() { //Teck Meng change on 04/12/2020 14:00 start
			var sIndex = this.getModel("oPilotUpdatesViewModel").getProperty("/eng") === "engine1" ? "0" : "1";
			var oEngine = this.getModel("oPilotUpdatesViewModel").getProperty("/engines/" + sIndex);
			var oObj = this.getModel("oPilotUpdatesViewModel").getProperty("/engines/" + sIndex + "/rfc/" + oEngine.selTab);
			this.fnCheckForStrik(oObj);
			var sChkRsn = oObj.chkrn;
			if (oEngine.Lock !== "99" && oEngine.Lock !== oEngine.selTab) {
				sChkRsn = "3"; //this.getModel("oPilotUpdatesViewModel").setProperty("/engines/" + sIndex + "/Lock", "3");
			} else {
				this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/astatid", this.fnGetAircraftStatus(oObj)); //Teck Meng change on 02/12/2020 14:00
			}
			this.getModel("oPilotUpdatesViewModel").setProperty("/engines/" + sIndex + "/Lock", sChkRsn);
			this.getModel("oPilotUpdatesViewModel").refresh();
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
		onSignOffPress: function(oEvent) {
			var sSrvid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvid"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
			// this.fnCreateEngine();
			if (sSrvid === undefined && this.cvutil.validateForm(this.getView())) { //Teck Meng change on 20/11/2020 14:00 //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				this.getModel("oPilotUpdatesViewModel").setProperty("/selTab", "FlyingRecords"); //Teck Meng change on 20/11/2020 14:00
				this.getView().byId("idIconTabBar").setSelectedKey("FlyingRecords"); //Teck Meng change on 20/11/2020 14:00
				this.getView().byId("FuelLeft").focus(true); //Teck Meng change on 20/11/2020 14:00
				sap.m.MessageToast.show("Fuel amount not valid"); //Teck Meng change on 20/11/2020 14:00
				return false; //Teck Meng change on 20/11/2020 14:00
			} //Teck Meng change on 20/11/2020 14:00
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
				var sFstat = this.getModel("oPilotUpdatesViewModel").getProperty("/flyRecord/fstat");
				if (isArmDeArmReq === "Y") {
					this.fnCreateTimming();
					// AMIT KUMAR 111220201823
					if (sFstat === "F") {
						this.fnCreateTimming();
						this.fnCreateEngine();
					}
					// AMIT KUMAR 111220201823
					this.fnCreateAlarming();
					this.fnUpdateTanks();
					return;
				}
				// AMIT KUMAR 111220201823
				if (sFstat === "F") {
					this.fnCreateTimming();
					this.fnCreateEngine();
				}
				// AMIT KUMAR 111220201823
				this.fnUpdateTanks();
				this.fnCreateAirMon();
				this.fnCreateFlyReq();
				this.fnCreateDefect();

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
					this.onNavBack(); //Changed on 23/11/2020 15:00//Teck Meng Changed on 27/11/2020 15:00
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate(this.getResourceBundle().getText("PILOTAH4FLYSVC"), oParameter, [oPayloads], "ZRM_PFR_P", this);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateFlyRecords function");
				this.handleException(e);
			}
		},

		/** 
		 * //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043 start
		 */
		fnReadFlyRecords: function() {
			try {
				var sSrvidPath = ""; //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var sSrvid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvid"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var sNum1 = this.getModel("oPilotUpdatesViewModel").getProperty("/num1"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				if (sSrvid !== " ") { //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					sSrvidPath = " and SRVID eq " + sSrvid + " and num1 eq " + sNum1; //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				} //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + sSrvidPath; //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					if (oData.results[0].fstat === "F") {
						oData.results[0].fstat = "F";
					} else {
						oData.results[0].fstat = "NF";
					}
					this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord", oData.results[0]);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("PILOTAH4FLYSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadFlyReq function");
				this.handleException(e);
			}
		}, //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043 end
		/** 
		 * //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043 start
		 */
		fnReadTimingRecords: function() {
			try {
				var sSrvidPath = ""; //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var sSrvid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvid"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var sNum1 = this.getModel("oPilotUpdatesViewModel").getProperty("/num1"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				if (sSrvid !== " ") { //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					sSrvidPath = " and SRVID eq " + sSrvid + " and pnum eq " + sNum1; //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				} //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + sSrvidPath;
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oPilotUpdatesViewModel").setProperty("/timings", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("AH4TIMINGSSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadTimingRecords function");
				this.handleException(e);
			}
		}, //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043 end
		/** 
		 * //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043 start
		 */
		fnReadManoveurRecords: function() {
			try {
				var sSrvidPath = ""; //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var sSrvid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvid"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var sNum1 = this.getModel("oPilotUpdatesViewModel").getProperty("/num1"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				if (sSrvid !== " ") { //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					sSrvidPath = " and SRVID eq " + sSrvid + " and num1 eq " + sNum1; //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				} //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + sSrvidPath;
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oPilotUpdatesViewModel").setProperty("/mano", oData.results[0]);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("PILOTAH4MANOEUVRINGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadManoveurRecords function");
				this.handleException(e);
			}
		}, //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043 end
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
				var oPayloads = [];
				this.getModel("oPilotUpdatesViewModel").getProperty("/timings").forEach(function(oItem) {
					var sPayload = JSON.parse(JSON.stringify(oItem));
					sPayload.egstt = this.formatter.oDataDateTimeFormat(oItem.egstt, "yyyy-MM-dd HH:mm");
					sPayload.woffw = this.formatter.oDataDateTimeFormat(oItem.woffw, "yyyy-MM-dd HH:mm");
					sPayload.wonw = this.formatter.oDataDateTimeFormat(oItem.wonw, "yyyy-MM-dd HH:mm");
					sPayload.egspt = this.formatter.oDataDateTimeFormat(oItem.egspt, "yyyy-MM-dd HH:mm");
					oPayloads.push(sPayload)

				}.bind(this));
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
				ajaxutilNew.fnUpdate(this.getResourceBundle().getText("PILOTSORTIF16SVC"), oParameter, oPayloads);
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
				// var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/flyReq");//Teck Meng change on 27/11/2020 13:00 AH Issue 1044,1043
				var oPayloads = JSON.parse(JSON.stringify(this.getModel("oPilotUpdatesViewModel").getProperty("/flyReq"))); //Teck Meng change on 27/11/2020 13:00 AH Issue 1044,1043
				if (oPayloads.length === 0) {
					return;
				}

				oPayloads.forEach(function(oItem) {
					delete oPayloads.num2; //Change by Teck Meng on 25/11/2020 11:30
					// 	oItem.astid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvable");//Change by Teck Meng on 25/11/2020 11:30
				}.bind(this));
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {};
				// ajaxutil.fnUpdate(this.getResourceBundle().getText("AH4STATUSSVC"), oParameter, oPayloads);//Change by Teck Meng on 25/11/2020 11:30
				ajaxutilNew.fnUpdate(this.getResourceBundle().getText("GETFLYREQSVC"), oParameter, oPayloads); //Change by Teck Meng on 25/11/2020 11:30
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
			// try {
			var sLock = "";
			var oFinalPayload = [];
			if (this.getModel("oPilotUpdatesViewModel").getProperty("/engPowerCheckRequired") === "Y") {
				var oPayloads = this.getModel("oPilotUpdatesViewModel").getProperty("/engines");
				//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
				oPayloads.forEach(function(Records) {
					sLock = Records.Lock;
					if (Records.Lock !== "99" && Records.Lock !== undefined && Records.Lock !== null) {
						Records.rfc.forEach(function(oItem) {
							var sItem = JSON.parse(JSON.stringify(oItem));
							delete sItem.increase;
							delete sItem.upperzone;
							delete sItem.lowerzone;
							sItem.pnum = this.getModel("oPilotUpdatesViewModel").getProperty("/num1"); // changed during UAT amit 10122020 1618
							if (sLock === sItem.chkrn) {
								sItem.chkrn = parseInt(sItem.chkrn) + 1;
								oFinalPayload.push(JSON.parse(JSON.stringify(sItem)));
							}
							if (sLock === "3" && (sItem.chkrn === "1" || sItem.chkrn === "2")) {
								sItem.chkrn = parseInt(sItem.chkrn) + 1;
								oFinalPayload.push(JSON.parse(JSON.stringify(sItem)));
							}
						}.bind(this));
					}
				}.bind(this));
				if (oFinalPayload.length === 0) {
					return;
				}
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {};
				ajaxutil.fnCreate(this.getResourceBundle().getText("PILOTAH4POWERSVC"), oParameter, oFinalPayload);
			}
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
					this.Engine1Chk = undefined; //Teck Meng 04/12/2020 16:50
					this.Engine2Chk = undefined; //Teck Meng 04/12/2020 16:50
					this.getModel("oPilotUpdatesViewModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
					this.getModel("oPilotUpdatesViewModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
					this.getModel("oPilotUpdatesViewModel").setProperty("/num1", oEvent.getParameter("arguments").num1); //Teck Meng 25/11/2020 16:50
					this.getModel("oPilotUpdatesViewModel").setProperty("/srvid", oEvent.getParameter("arguments").srvid); //Teck Meng 30/11/2020 16:50
					this.getModel("oPilotUpdatesViewModel").setData(this._fnCreateData());

					var sSrvtid = this.getModel("avmetModel").getProperty("/dash/astid");
					if (sSrvtid === "AST_GN") {
						this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/fstat", "NF");
						this.getModel("oPilotUpdatesViewModel").setProperty("/flyRecord/oprty", "TOP_5"); //<!--Teck Meng change on 23/11/2020 10:00 -->
						this.getModel("oPilotUpdatesViewModel").refresh();
					}
					this.getModel("oPilotUpdatesViewModel").refresh();
					this.updateModel({
						busy: true
					}, "viewModel");
					this.fnReadArming();
					this.fnReadAmResults();
					this.fnReadOpType();
					// this.fnReadflyResults();//Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					// this.fnReadAirMon();//Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					// this.fnReadFlyReq();//Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					this.fnReadEngine();
					// this.fnReadAddLimitCount();

					var sSrvid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvid"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					if (sSrvid !== undefined) { //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
						this.fnReadFlyRecords(); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
						this.fnReadTimingRecords(); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
						this.fnReadManoveurRecords(); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					} else { //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
						this.fnReadflyResults(); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
						this.fnReadAddLimitCount(); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
						this.fnReadAirMon(); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
						this.fnReadFlyReq(); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
						this.fnReadFuleTankFromRepl(); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					}
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
				oParameter.filter =
					"tailid eq " + this.getTailId() + " and srvtid eq " + this.getModel("oPilotUpdatesViewModel").getProperty("/srvtid") +
					" and pnum eq " + this.getModel("oPilotUpdatesViewModel").getProperty("/num1") + " and srvid eq " + this.getModel(
						"oPilotUpdatesViewModel").getProperty("/srvid");
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
						paDate = new Date(oArming.sgdate);
					}
					/* Rahul: 28/12/2020: Code change-Start */
					/* this.getModel("oPilotUpdatesViewModel").setProperty("/timings/0/egstt", (paDate.getHours() + ":" + paDate.getMinutes())); */
					this.getModel("oPilotUpdatesViewModel").setProperty("/timings/0/egstt", this.formatter.oDataDateTimeFormat(paDate,
						"yyyy-MM-dd HH:mm"));
					this.getModel("oPilotUpdatesViewModel").setProperty("/timings/0/woffw", this.formatter.oDataDateTimeFormat(paDate,
						"yyyy-MM-dd HH:mm"));
					/* Rahul: 28/12/2020: Code change-End */
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
				oParameter.filter = "refid" + FilterOpEnum.EQ + this.getAircraftId() + "&ddid" + FilterOpEnum.EQ + "TOP";
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oPilotUpdatesViewModel").setProperty("/toper", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oParameter);
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
				oParameter.filter = "refid" + FilterOpEnum.EQ + this.getAircraftId() + "&ddid" + FilterOpEnum.EQ + "PILOT";
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oPilotUpdatesViewModel").setProperty("/amResult", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oParameter);
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

				var sSrvidPath = ""; //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var sSrvid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvid"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				var sNum1 = this.getModel("oPilotUpdatesViewModel").getProperty("/num1"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				if (sSrvid !== undefined) { //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					sSrvidPath = " and SRVID eq " + sSrvid + " and pnum eq " + sNum1; //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				} //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043

				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + sSrvidPath; //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.updateModel({
						busy: false
					}, "viewModel");
					oData.results.forEach(function(oPower) {
						var oCopy = JSON.parse(JSON.stringify(oPower));
						oCopy.increase = false;
						oCopy.upperzone = {};
						oCopy.lowerzone = {};
						this.fnUpdateZoneValue(oCopy);
						oPower.Lock = "99";
						oPower.selTab = 0;
						oPower.rfc = [];
						switch (oPower.chkrn) {
							case "1": // 0(1)=>Hit; 1(2)=>ETF; 2(3)=Re-Est 
								oPower.rfc[0] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[0].chkrn = "0";
								oPower.rfc[1] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[1].chkrn = "1";
								oPower.rfc[2] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[2].chkrn = "2";
								oPower.selTab = "0";
								oPower.Lock = "0";
								break;
							case "2":
								oPower.rfc[0] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[0].chkrn = "0";
								oPower.rfc[1] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[1].chkrn = "1";
								oPower.rfc[2] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[2].chkrn = "2";
								oPower.selTab = "1";
								oPower.Lock = "1";
								break;
							case "3":
								oPower.rfc[0] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[0].chkrn = "0";
								oPower.rfc[1] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[1].chkrn = "1";
								oPower.rfc[2] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[2].chkrn = "2";
								oPower.selTab = "2";
								oPower.Lock = "2";
								break;
							default:
								oPower.rfc[0] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[0].chkrn = "0";
								oPower.rfc[1] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[1].chkrn = "1";
								oPower.rfc[2] = JSON.parse(JSON.stringify(oCopy));
								oPower.rfc[2].chkrn = "2";
								oPower.selTab = "0";
								oPower.Lock = "99";
						}
					}.bind(this));
					if (sSrvidPath !== "" && oData.results.length > 0) { //If edit post flight records //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
						this.getModel("oPilotUpdatesViewModel").setProperty("/engPowerCheckRequired", "Y"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					}
					this.getModel("oPilotUpdatesViewModel").setProperty("/engines", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh(true);

				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("PILOTAH4POWERSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnReadAmResults function");
				this.handleException(e);
			}
		},
		fnUpdateZoneValue: function(oPower) {
			if (oPower.xtype === "UL") {
				oPower.upperzone = {
					xtype: "UL",
					xstat: oPower.xstat,
					increase: false
				};
				oPower.lowerzone = {
					xtype: "LL",
					xstat: 0,
					increase: false
				};
			} else if (oPower.xtype === "LL") {
				oPower.lowerzone = {
					xtype: "LL",
					xstat: oPower.xstat,
					increase: false
				};
				oPower.upperzone = {
					xtype: "UL",
					xstat: 0,
					increase: false
				};
			} else {
				oPower.lowerzone = {
					xtype: "LL",
					xstat: 0,
					increase: false
				};
				oPower.upperzone = {
					xtype: "UL",
					xstat: 0,
					increase: false
				};
			}
		},

		fnCheckForStrik: function(sObj) {
			var engNo = parseInt(sObj.engno) - 1;
			var chk = sObj.chkrn;
			var sRecord = this.getModel("oPilotUpdatesViewModel").getProperty("/engines/" + engNo + "/rfc/" + chk);
			if (sRecord.chkrn !== "0") {
				sRecord.xtype = "NM";
				return;
			}
			var sEngine = this.getModel("oPilotUpdatesViewModel").getProperty("/engines/" + engNo);
			var sType = sRecord.xtype;
			var sUpper = sRecord.upperzone;
			var sLower = sRecord.lowerzone;
			var iULimit = parseInt(sRecord.ulimit) - 5;
			var iLLimit = parseInt(sRecord.llimit) + 5;
			var sTgtDiff = parseInt(sRecord.tgtdiff);
			// -19							-14
			if (sRecord.ulimit < sTgtDiff) { // out of upper limit 
				if (sUpper.increase) {
					sUpper.xstat = parseInt(sUpper.xstat) - 1;
					sUpper.increase = false;
				}
				if (sLower.increase) {
					sLower.xstat = parseInt(sLower.xstat) - 1;
					sLower.increase = false;
				}
				sType = "OU";
			}
			if (iULimit < sTgtDiff && sRecord.ulimit >= sTgtDiff) { // between upper limit and upper shadow 
				if (!sUpper.increase) {
					sUpper.xstat = parseInt(sUpper.xstat) + 1;
					sUpper.increase = true;
				}
				if (sLower.increase) {
					sLower.xstat = parseInt(sLower.xstat) - 1;
					sLower.increase = false;
				}
				sType = "UL";
			}
			if (iULimit >= sTgtDiff && sTgtDiff >= iLLimit) { // between/on upper shadow to lower shadow // happy zone 
				if (sUpper.increase) {
					sUpper.xstat = parseInt(sUpper.xstat) - 1;
					sUpper.increase = false;
				}
				if (sLower.increase) {
					sLower.xstat = parseInt(sLower.xstat) - 1;
					sLower.increase = false;
				}
				sType = "NM";
			}
			//////  -54							-49
			if (sRecord.llimit <= sTgtDiff && iLLimit > sTgtDiff) { // between lower limit and lower shadow 
				if (!sLower.increase) {
					sLower.xstat = parseInt(sLower.xstat) + 1;
					sLower.increase = true;
				}
				if (sUpper.increase) {
					sUpper.xstat = parseInt(sUpper.xstat) - 1;
					sUpper.increase = false;
				}
				sType = "LL";
			}

			if (sRecord.llimit > sTgtDiff) { // out of lower limit 
				if (sLower.increase) {
					sLower.xstat = parseInt(sLower.xstat) - 1;
					sLower.increase = false;
				}
				if (sUpper.increase) {
					sUpper.xstat = parseInt(sUpper.xstat) - 1;
					sUpper.increase = false;
				}
				sType = "OL";
			}

			if ((!sEngine.xtype || sEngine.xtype === "UL") && sType === "LL") {
				sRecord.xstat = sLower.xstat;
			} else if ((!sEngine.xtype || sEngine.xtype === "LL") && sType === "UL") {
				sRecord.xstat = sUpper.xstat;
			} else {
				sRecord.xstat = sLower.xstat + sUpper.xstat;
			}
			sRecord.xtype = sType;
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnReadflyResults: function() {
			try {
				var oParameter = {};
				oParameter.filter = "refid" + FilterOpEnum.EQ + this.getAircraftId() + "&ddid" + FilterOpEnum.EQ + "FR";
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oPilotUpdatesViewModel").setProperty("/flyResult", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oParameter);
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
				//	oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId(); // Phase 2 Changes
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this._fnMakeAllPass(oData, "PILOT_P", "SORTIE"); //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
					this.getModel("oPilotUpdatesViewModel").setProperty("/airMon", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("PILOTSORTIF16SVC"), oParameter);
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
			//	oParameter.filter = "ftype eq S and tailid eq " + this.getTailId(); //Change by Teck Meng on 25/11/2020 11:30
				oParameter.filter = "ftype" + FilterOpEnum.EQ + "S" + FilterOpEnum.AND + "tailid" + FilterOpEnum.EQ + this.getTailId();
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this._fnMakeAllPass(oData, "FRR_P", "FLY"); //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
					this.getModel("oPilotUpdatesViewModel").setProperty("/flyReq", oData.results);
					this.getModel("oPilotUpdatesViewModel").refresh();
				}.bind(this);
				// ajaxutil.fnRead(this.getResourceBundle().getText("AH4STATUSSVC"), oParameter);//Change by Teck Meng on 25/11/2020 11:30
				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETFLYREQSVC"), oParameter); //Change by Teck Meng on 25/11/2020 11:30
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
		_fnMakeAllPass: function(oData, sStat, sService) { //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
			oData.results.forEach(function(oItem) {
				if (sService === "FLY") { //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
					oItem.FRRID = (oItem.FRRID === "" || oItem.FRRID === null) ? sStat : oItem.FRRID; //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
				} else { //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
					oItem.frrid = (oItem.frrid === "" || oItem.frrid === null) ? sStat : oItem.frrid; //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
				} //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
			});
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		fnGetAircraftStatus: function(oHit) { //Teck Meng change on 02/12/2020 14:00
			var sAstId = "AST_S",
				rc = "Y";
			var isFly = this.getModel("oPilotUpdatesViewModel").getProperty("/isFlyFail");
			var isSorti = this.getModel("oPilotUpdatesViewModel").getProperty("/isSortiFail");
			var astId = this.getModel("oPilotUpdatesViewModel").getProperty("/srvable");
			var bHitDefect = false; //Teck Meng change on 02/12/2020 14:00

			if (oHit) { //Teck Meng change on 02/12/2020 14:00
				// bHitDefect = this.fnCheckHIT("1", oHit); //Teck Meng change on 02/12/2020 14:00
			} //Teck Meng change on 02/12/2020 14:00

			if (isFly || isSorti || astId === "AST_US" || bHitDefect) {
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
				oPayload.srvid = this.getModel("oPilotUpdatesViewModel").getProperty("/srvid"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				oPayload.num1 = this.getModel("oPilotUpdatesViewModel").getProperty("/num1"); //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				oPayload.selTab = "FlyingRecords";
				oPayload.paDate = currentTime;
				oPayload.currentDate = currentTime;
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
					"astatid": "AST_S", // AST_S IF SERVICEABLE AST_US IF UNSERVICEABLE ,FAIL SORTI,FAIL FLY  
					"num1": this.getModel("oPilotUpdatesViewModel").getProperty("/num1") //Teck Meng change on 25/11/2020 13:00 AH Issue 1044,1043
				};
				oPayload.timings = [{
					"srvid": null,
					"tailid": this.getTailId(),
					"num2": 1,
					"endda": null,
					"begda": null,
					/* "egstt": currentTime.getHours() + ":" + currentTime.getMinutes(),
					"woffw": currentTime.getHours() + ":" + currentTime.getMinutes(),
					"wonw": currentTime.getHours() + ":" + currentTime.getMinutes(),
					"egspt": currentTime.getHours() + ":" + currentTime.getMinutes(), */
					"egstt": this.formatter.oDataDateTimeFormat(currentTime, "yyyy-MM-dd HH:mm"), //Rahul change on 28/12/2020
					"woffw": this.formatter.oDataDateTimeFormat(currentTime, "yyyy-MM-dd HH:mm"), //Rahul change on 28/12/2020
					"wonw": this.formatter.oDataDateTimeFormat(currentTime, "yyyy-MM-dd HH:mm"), //Rahul change on 28/12/2020
					"egspt": this.formatter.oDataDateTimeFormat(currentTime, "yyyy-MM-dd HH:mm"), //Rahul change on 28/12/2020
					"pnum": oPayload.num1, //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					"diffwo": 0,
					"diffeg": 0
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
					"np": 101, //Teck Meng change on 02/12/2020 13:00 AH Issue 1044,1043
					"pnum": oPayload.num1, //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					"num": null //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
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
					"np": 101, //Teck Meng change on 02/12/2020 13:00 AH Issue 1044,1043
					"pnum": oPayload.num1, //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
					"num": null //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
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
					"fpdlen": 0,
					"NUM1": oPayload.num1 //Teck Meng change on 01/12/2020 13:00 AH Issue 1044,1043
				};
			} catch (e) {
				Log.error("Exception in PilotUpdate:_fnCreateData function");
				this.handleException(e);
			}
			return oPayload;
		}

	});
});