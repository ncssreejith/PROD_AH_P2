sap.ui.define([
	"avmet/ah/controller/BaseController",
	"sap/m/MessageToast",
	"avmet/ah/model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"avmet/ah/model/formatter",
	"avmet/ah/util/ajaxutil"
], function(BaseController, MessageToast, dataUtil, JSONModel, formatter, ajaxutil) {
	"use strict";
	/* ***************************************************************************
	 *   Control name:            
	 *   Purpose : 
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *	 2. Backend Calls
	 *	 3. Private calls
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.DashboardInitial", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("DashboardInitial").attachPatternMatched(this._onObjectMatched, this);
				var oDashboardData = {};
				oDashboardData.scl = {};
				oDashboardData.fl = {};
				oDashboardData.cap = {};
				oDashboardData.role = {};
				oDashboardData.editLoc = false;
				oDashboardData.location = [];
				this.getView().setModel(new JSONModel(oDashboardData), "dashboardModel");
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onInit function");
				this.handleException(e);
			}
		},
		//1. On click of Create Flight Servicing Button, navigates to that view.
		onCreateFlightService: function() {
			try {
				this.getRouter().navTo("CreateFlightService");
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onCreateFlightService function");
				this.handleException(e);
			}
		},
		//2. On Click of Create Job button.
		onPressCreateJob: function() {
			try {
				this.getRouter().navTo("CosCreateJob");
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onPressCreateJob function");
				this.handleException(e);
			}
		},
		//3.on click of pending approvals it navigates to pending approvals
		onPressApprovals: function() {
			try {
				this.getRouter().navTo("Approvals");
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onPressApprovals function");
				this.handleException(e);
			}
		},
		//4.on click of view link on aircraft capabilities it navigates to aircraft capabilities
		onAircraftView: function() {
			try {
				this.getRouter().navTo("Limitations");
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onAircraftView function");
				this.handleException(e);
			}
		},
		//5.on click of view link on schedules it navigates to schedules jobs.
		onSchedulesView: function(sState) {
			try {
				this.getRouter().navTo("Cosjobs", {
					State: sState
				});
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onSchedulesView function");
				this.handleException(e);
			}
		},

		onButtnItem1Press: function(oEvent) {
			try {
				var sSrvtId = this.getModel("avmetModel").getProperty("/dash/SRVTID");
				var aState = this.getModel("avmetModel").getProperty("/dash/astid");
				var aRenderSafePopup = this.getModel("avmetModel").getProperty("/dash/WEXPE");
				switch (aState) {
					case "AST_REC":
						this.getRouter().navTo("DispatchAircraft");
						break;
					case "AST_ARM":
					case "AST_DEA":
					case "AST_FS":
						this.getRouter().navTo("UpdateFlightServicing", {
							srvid: sSrvtId
						});
						break;
					case "AST_FFG":
					case "AST_FFC":
					case "AST_FFF":
						this.getRouter().navTo("PilotAccept", {
							srvtid: sSrvtId,
							stepid: "S_PA"
						});
						break;
					case "AST_RFF":
						this.getRouter().navTo("PilotUpdates", {
							srvtid: sSrvtId,
							stepid: "S_PF"
						});
						break;
					case "AST_US":
					case "AST_WE":
						this.getRouter().navTo("WeaponExpenditure", {
							srvtid: sSrvtId,
							stepid: "S_WE"
						});
						break;
					case "AST_S0":
						if (aRenderSafePopup === "X") {
							this.getRouter().navTo("WeaponExpenditure", {
								srvtid: sSrvtId,
								stepid: "S_WE"
							});
						} else {
							this._renderSafeNF();
						}
						break;
					case "AST_US0":
						if (aRenderSafePopup === "X") {
							this.getRouter().navTo("WeaponExpenditure", {
								srvtid: sSrvtId,
								stepid: "S_WE"
							});
						} else {
							this._renderSafeNF();
						}
						break;
					case "AST_FAIR0":
						if (aRenderSafePopup === "X") {
							this.getRouter().navTo("WeaponExpenditure", {
								srvtid: sSrvtId,
								stepid: "S_WE"
							});
						} else {
							this._renderSafeNF();
						}
						break;
					case "AST_S1":
					case "AST_US1":
					case "AST_FAIR1":
						this.getRouter().navTo("AddEngCyclicLog", {
							engid: this.getModel("avmetModel").getProperty("/Engine/ENGID"),
							tailid: this.getTailId(),
							last: " ",
							eng2id: this.getModel("avmetModel").getProperty("/Engine2/ENGID")
						}); //nav cyclic log
						break;
					case "AST_S2":
					case "AST_US2":
					case "AST_FAIR2":
						this.getRouter().navTo("AircraftUtilisation");
				}
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onButtnItem1Press function");
				this.handleException(e);
			}
		},

		onButtnItem2Press: function(oEvent) {
			try {
				var sSrvtId = this.getModel("avmetModel").getProperty("/dash/SRVTID");
				var aState = this.getModel("avmetModel").getProperty("/dash/astid");
				//var aRenderSafePopup = this.getModel("avmetModel").getProperty("/dash/WEXPE");
				switch (aState) {
					case "AST_RFF":
					case "AST_RFF0":
						this.getRouter().navTo("PilotAccept", {
							srvtid: sSrvtId,
							stepid: "S_PA"
						});
						break;
					case "AST_DEA":
						this.getRouter().navTo("WeaponExpenditure", {
							srvtid: sSrvtId,
							stepid: "S_WE"
						});
						break;
					case "AST_FFF":
					case "AST_FFF0":
						this.onPilotChanges();
						break;
				}
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onButtnItem2Press function");
				this.handleException(e);
			}
		},

		/**
		 * Schedule button click
		 * @param oEvent
		 * @returns
		 */
		onScheduleSegBtnChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey();
				var oItem = this.getModel("dashboardModel").getProperty("/scl");
				if (!oItem) {
					return;
				}
				oItem.LV_COLOR = "Good";
				switch (sSelectedKey) {
					case "Hrs":
						this._setRadialChartText("scheduleMicroChartId", (oItem.LV_THRS ? oItem.LV_THRS : 0), "", (oItem.LV_THRS ? oItem.LV_THRS : 0),
							oItem.LV_HRS);
						if (oItem.LV_HRS > 0) {
							oItem.LV_COLOR = "Critical";
						}
						// oItem.LV_COUNT = JSON.parse(JSON.stringify(oItem.LV_THRS));
						break;
					case "Days":
						this._setRadialChartText("scheduleMicroChartId", (oItem.LV_TDAY ? oItem.LV_TDAY : 0), "", (oItem.LV_TDAY ? oItem.LV_TDAY : 0),
							oItem.LV_DAY);
						if (oItem.LV_DAY > 0) {
							oItem.LV_COLOR = "Critical";
						}
						// oItem.LV_COUNT = JSON.parse(JSON.stringify(oItem.LV_TDAY));
						break;
					case "TAC":
						this._setRadialChartText("scheduleMicroChartId", (oItem.LV_TTAC ? oItem.LV_TTAC : 0, ""), (oItem.LV_TTAC ? oItem.LV_TTAC : 0),
							oItem.LV_TAC);
						if (oItem.LV_TAC > 0) {
							oItem.LV_COLOR = "Critical";
						}
						// oItem.LV_COUNT = JSON.parse(JSON.stringify(oItem.LV_TTAC));
						break;
					default:
						this._setRadialChartText("scheduleMicroChartId", oItem.LV_THRS, "", oItem.LV_THRS, oItem.LV_HRS);
						// oItem.LV_COUNT = JSON.parse(JSON.stringify(oItem.LV_THRS));
						break;
				}
				this.getModel("dashboardModel").refresh();
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onScheduleSegBtnChange function");
				this.handleException(e);
			}
		},

		/** 
		 * Air cap change
		 * @param oEvent
		 * @returns
		 */
		onAircapSegBtnChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey();
				var oItem = this.getModel("dashboardModel").getProperty("/cap");
				if (!oItem) {
					return;
				}
				switch (sSelectedKey) {
					case "ADD":
						this._setRadialChartText("capMicroChartId", oItem.LV_TADD ? oItem.LV_TADD : "", "", oItem.LV_TADD, oItem.LV_TADD);
						break;
					case "LMT":
						this._setRadialChartText("capMicroChartId", oItem.LV_TLIMI ? oItem.LV_TLIMI : "", "", oItem.LV_TLIMI, oItem.LV_TLIMI);
						break;
				}
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onAircapSegBtnChange function");
				this.handleException(e);
			}
		},

		/** 
		 * Fuel change
		 * @param oEvent
		 * @returns
		 */
		onFuelSegBtnChange: function(oEvent) {
			try {
				var that = this;
				var sSelectedKey = oEvent.getSource().getSelectedKey();
				var oItem = this.getModel("dashboardModel").getProperty("/fl");
				if (!oItem) {
					return;
				}
				oItem.list.forEach(function(oFL) {
					if (oFL.key === parseInt(sSelectedKey)) {
						that._setRadialChartTextDisplay("fuelMicroChartId", oFL.LTOTAMT, oFL.LEMAX, oFL.LTOTAMT, oFL.LEMAX);
						oItem.REDESC = JSON.parse(JSON.stringify(oFL.REDESC));
						oItem.LTOTAMT = JSON.parse(JSON.stringify(oFL.LTOTAMT));
						oItem.LEMAX = JSON.parse(JSON.stringify(oFL.LEMAX));
					}
				});
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onFuelSegBtnChange function");
				this.handleException(e);
			}
		},

		onQuickInfoLocEdit: function() {
			try {
				// this.openDialog("Location",".fragments.dashboard.");	
				this.getView().getModel("dashboardModel").setProperty("/editLoc", true);
				this.getView().getModel("dashboardModel").refresh();
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onQuickInfoLocEdit function");
				this.handleException(e);
			}
		},

		onLocationChange: function(oEvent) {
			try {
				this.fnSubmitLocationChange(oEvent.getSource().getSelectedKey());
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onLocationChange function");
				this.handleException(e);
			}
		},

		onLocationDialogBtnClk: function(oEvnet, sAction) {
			try {
				if (sAction === "OK") {
					// this.updateLocation();
				}
				this.closeDialog("Location");
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onLocationDialogBtnClk function");
				this.handleException(e);
			}
		},

		onFuelView: function() {
			try {
				var sSrvtId = this.getModel("avmetModel").getProperty("/dash/SRVID");
				this.getOwnerComponent().getRouter().navTo("Replenishment", {
					srvtid: sSrvtId ? sSrvtId : "",
					stepid: "S_RE"
				});
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onFuelView function");
				this.handleException(e);
			}
		},

		onRoleChange: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("RoleChangeStations");
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onRoleChange function");
				this.handleException(e);
			}
		},
		onRoleDisplay: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("RoleDisplayStations");
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onRoleDisplay function");
				this.handleException(e);
			}
		},

		onReceiveAircraft: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("DispatchAircraft", {
					airid: this.getAircraftId(),
					tailid: this.getTailId(),
					tab: "1"
				});
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onReceiveAircraft function");
				this.handleException(e);
			}
		},

		onPilotChanges: function() {
			try {
				if (!this._oChanges) {
					this._oChanges = sap.ui.xmlfragment("avmet.ah.fragments.pilot.Changes", this);
					this.getView().addDependent(this._oChanges);
				}
				this._oChanges.open();
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onPilotChanges function");
				this.handleException(e);
			}
		},

		onCancelChanges: function() {
			try {
				this._oChanges.close();
				this._oChanges.destroy();
				delete this._oChanges;
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onCancelChanges function");
				this.handleException(e);
			}
		},

		onProceedChange: function() {
			try {
				var oModel = this.getView().getModel("avmetModel");
				var sSrvtId = oModel.getProperty("/dash/SRVTID");
				// var aState = oModel.getProperty("/dash/astid");
				if (oModel.getProperty("/ChangeCertificate")) {
					this.getOwnerComponent().getRouter().navTo("PDSSummary", {
						srvtid: sSrvtId,
						stepid: "S_CS"
					});
				} else if (oModel.getProperty("/ChangeWeapon")) {
					this.getOwnerComponent().getRouter().navTo("WeaponConfig", {
						srvtid: sSrvtId,
						stepid: "S_CS"
					});
				} else if (oModel.getProperty("/AddFly")) {
					this.getOwnerComponent().getRouter().navTo("CosAddFlyingRequirements");
				}
				this.onCancelChanges();
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onProceedChange function");
				this.handleException(e);
			}
		},

		_renderSafeNF: function() {
			try {
				if (!this._oDeclareSafe) {
					this._oDeclareSafe = sap.ui.xmlfragment("avmet.ah.fragments.pilot.AircraftSignOff", this);
					this.getView().addDependent(this._oDeclareSafe);
				}
				this._oDeclareSafe.open();
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:_renderSafeNF function");
				this.handleException(e);
			}
		},

		onACSignOffCancel: function() {
			try {
				this._oDeclareSafe.close();
				this._oDeclareSafe.destroy();
				delete this._oDeclareSafe;
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onACSignOffCancel function");
				this.handleException(e);
			}
		},

		onACSignOffConfirm: function() {
			try {
				this._oDeclareSafe.close();
				this._oDeclareSafe.destroy();
				delete this._oDeclareSafe;
				delete this._oDeclareSafe;
				var that = this;
				var sSrvtId = this.getModel("avmetModel").getProperty("/dash/SRVTID");
				var oParameter = {},
					oPayloadWeapExp = [{
						tailid: that.getTailId(),
						refid: that.getAircraftId(),
						stepid: "S_WE",
						srvtid: sSrvtId
					}];
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					that.fnLoadSrv1Dashboard();
					sap.m.MessageToast.show("Rendered Safe");
					//this.getOwnerComponent().getRouter().navTo("DashboardInitial");
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/declareSafeSvc", oParameter, oPayloadWeapExp, "ZRM_PFR_WE", this);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onACSignOffConfirm function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		fnLoadSrv1Dashboard: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and REFID eq " + this.getAircraftId();
				// + " and REFID eq " + this.getAircraftId() ;
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results.length && oData.results.length > 0) {
						oData.results[0].txt3 = this.fnReplaceString(oData.results[0].txt3);
						oData.results[0].txt2 = this.fnReplaceString(oData.results[0].txt2);
						this.getModel("avmetModel").setProperty("/dash", oData.results.length > 0 ? oData.results[0] : {});
						var oModel = this.getView().getModel("avmetModel");
						var oDash = oModel.getProperty("/dash");
						oModel.setProperty("/UnlockAVMET", this.fnCheckLockStatus(oDash.astid));
						if(this.fnOverwriteStatus(oDash.astid)){
							oModel.setProperty("/dash/TBTN3", true);
						}
						oModel.setProperty("/UnlockRec", this.fnCheckRecLockStatus(oDash.astid));
						this.fnSetMenuVisible(oDash.TBTN1, this.fnFindRoleChangeStations);
						this.fnSetMenuVisible(oDash.TBTN2, this.fnFindCreateFlightService);
						this.fnSetMenuVisible(oDash.TBTN3, this.fnFindCosjobs);
						if (oData.results[0].WFLAG === "X") {
							oModel.setProperty("/WarningFlag", true);
							this._fnSetWarningMessage(oData.results[0]);
						} else {
							oModel.setProperty("/WarningFlag", false);
						}
						this.getModel("menuModel").refresh();
						this.getModel("avmetModel").refresh(true);
						// this.fnCreateTableFromData();
					}
				}.bind(this);
				ajaxutil.fnRead("/DashboardCountsSvc", oParameter);
			} catch (e) {
				this.Log.error("Exception in fnLoadSrv1Dashboard function");
			}
		},
		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function() {
			try {
				var oAppData = dataUtil.getDataSet(this.getOwnerComponent().appModel);
				this.getView().getModel("avmetModel").setProperty("/login", oAppData.login);
				this.getView().getModel("avmetModel").setProperty("/airSel", oAppData.airSel);
				this.getView().getModel("avmetModel").refresh();

				this.fnLoadSrv1Dashboard();
				this.fnGetEngine();
				this.fnLoadSCLDashboard();
				this.fnLoadFLDashboard();
				this.fnLoadCAPDashboard();
				this.fnLoadROLDashboard();
				this.fnLoadLocation();
				this.fnLoadUtilization();
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:_onObjectMatched function");
				this.handleException(e);
			}
		},
		/** 
		 * Load Schedule data
		 * @returns
		 */
		fnLoadSCLDashboard: function() {
			try {
				var oParameter = {};
				oParameter.filter = "CTYPE eq ALL AND tailid eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results && oData.results.length > 0) {
						var oLoad = oData.results.length > 0 ? oData.results[0] : undefined;
						this.getModel("dashboardModel").setProperty("/scl", oLoad);
						oLoad.LV_COUNT = 0;
						oLoad.LV_COLOR = "Good";
						if (oLoad.LV_HRS > 0) {
							oLoad.LV_COUNT += oLoad.LV_HRS;
							oLoad.LV_COLOR = "Critical";
							this.getModel("dashboardModel").setProperty("/scl/HrsAlert", "sap-icon://alert");
						} else {
							this.getModel("dashboardModel").setProperty("/scl/HrsAlert", "");
						}
						if (oLoad.LV_DAY > 0) {
							oLoad.LV_COUNT += oLoad.LV_DAY;
							this.getModel("dashboardModel").setProperty("/scl/DaysAlert", "sap-icon://alert");
						} else {
							this.getModel("dashboardModel").setProperty("/scl/DaysAlert", "");
						}
						if (oLoad.LV_TAC > 0) {
							oLoad.LV_COUNT += oLoad.LV_TAC;
							this.getModel("dashboardModel").setProperty("/scl/TACAlert", "sap-icon://alert");
						} else {
							this.getModel("dashboardModel").setProperty("/scl/TACAlert", "");
						}
						// this.getModel("dashboardModel").setProperty("/scl/LV_COUNT", JSON.parse(JSON.stringify(oLoad.LV_THRS)));

						this.getModel("dashboardModel").refresh();
						if (oData.results.length > 0) {
							this._setRadialChartText("scheduleMicroChartId", oData.results[0].LV_THRS, "", oData.results[0].LV_THRS, oData.results[0].LV_HRS);
							return;
						}
						this._setRadialChartText("scheduleMicroChartId", "", "", 0, 0);
					}
				}.bind(this);
				ajaxutil.fnRead("/GetSchDueSoonSvc", oParameter);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnLoadSCLDashboard function");
				this.handleException(e);
			}
		},
		/** 
		 * Get engine header data
		 * @constructor 
		 */
		fnGetEngine: function() {
			try {
				var
					oEngineModel = this.getView().getModel("avmetModel"),
					oParameter = {};

				oParameter.filter = "tailid eq '" + this.getTailId() + "'";

				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results && oData.results.length > 0) {
						oEngineModel.setProperty("/Engine", oData.results[0] ? oData.results[0] : {});
						if (oData.results.length > 1) { // Engine 2
							oEngineModel.setProperty("/Engine2", oData.results[1] ? oData.results[1] : {});
						}
					}
				}.bind(this);
				ajaxutil.fnRead("/EngineDisSvc", oParameter);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnGetEngine function");
				this.handleException(e);
			}
		},
		/** 
		 * Load fuel backend data
		 */
		fnLoadFLDashboard: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and REFID eq " + this.getAircraftId();
				// + " and modid eq " + this.getModel("avmetModel").getProperty("/airSel/modid");
				oParameter.error = function() {
					this.fnProcessFuel({
						results: []
					});
				}.bind(this);
				oParameter.success = function(oData) {
					this.fnProcessFuel(oData);
					// this.fnProcessFuel({results: []});
				}.bind(this);
				ajaxutil.fnRead("/DashboardCountsSvc", oParameter);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnLoadFLDashboard function");
				this.handleException(e);
			}
		},
		/** 
		 * Process fuel oData and update Fuel dashboard
		 * @param oData
		 * @returns
		 */
		fnProcessFuel: function(oData) {
			try {
				var oFuel = oData.results.length > 0 ? oData.results[0] : {
					// REDESC: "Center@External@",
					// LESRVAMT: "5000@6000@",
					// LETOTAMT: "7000@8000@",
					// LEUOM: "Pound@Pound@Pound@"
				};
				if (oFuel.LETOTAMT && oFuel.LEMAX) {
					var aFuel = oFuel.REDESC ? oFuel.REDESC.split("@") : [{}];
					aFuel.splice(-1, 1);
					var aFL = [];
					aFuel.forEach(function(oItem, i) {
						var oTemp = {};
						oTemp.REDESC = oItem;
						oTemp.key = i;
						oTemp.LTOTAMT = parseInt(oFuel.LETOTAMT.split("@")[i]);
						oTemp.LEMAX = parseInt(oFuel.LEMAX.split("@")[i]);
						oTemp.LEUOM = oFuel.LEUOM.split("@")[i];
						aFL.push(oTemp);
					});
					var oFL = aFL[0] ? JSON.parse(JSON.stringify(aFL[0])) : {};
					oFL.TOTAT = 0;
					oFL.list = aFL;

					oFL.list.forEach(function(oItem) {
						oFL.TOTAT += oItem.LTOTAMT;
					});
				}
				this.getModel("dashboardModel").setProperty("/fl", oFL);
				this.getModel("dashboardModel").refresh();
				if (oFL) {
					this._setRadialChartTextDisplay("fuelMicroChartId", oFL.LTOTAMT, oFL.LEMAX, oFL.LTOTAMT, oFL.LEMAX);
					return;
				}

				this._setRadialChartTextDisplay("fuelMicroChartId", "", "", 0, 0);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnProcessFuel function");
				this.handleException(e);
			}
		},

		/** 
		 * Load Aircraft capability
		 * @returns
		 */
		fnLoadCAPDashboard: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and repl_flag eq Z";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("dashboardModel").setProperty("/cap", oData.results.length > 0 ? oData.results[0] : undefined);

					if (oData && oData.results && oData.results.length && oData.results.length > 0) {
						this._setRadialChartText("capMicroChartId", oData.results[0].LV_TADD ? oData.results[0].LV_TADD : "", "", oData.results[0].LV_TADD,
							oData.results[0].LV_TADD);
						return;
					}
					this._setRadialChartText("capMicroChartId", "", "", 0, 0);
					this.getModel("dashboardModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/Dashboard1Svc", oParameter);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnLoadCAPDashboard function");
				this.handleException(e);
			}
		},
		/** 
		 * Load Aircraft role
		 */
		fnLoadROLDashboard: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var aData = oData.results.length > 0 ? oData.results[0] : {
						ADPDESC1: ""
							// ADPDESC1: "Rocket",
							// ADPDESC2: "Rocket",
							// ADPDESC3: "Rocket",
							// ADPDESC4: "Missile",
							// ADPC1: "2",
							// ADPC2: "3",
							// ADPC3: "2",
							// ADPC4: "4"
					};

					aData.ADPC1 = aData.ADPC1 ? aData.ADPC1 : 0;
					aData.ADPC2 = aData.ADPC2 ? aData.ADPC2 : 0;
					aData.ADPC3 = aData.ADPC3 ? aData.ADPC3 : 0;
					aData.ADPC4 = aData.ADPC4 ? aData.ADPC4 : 0;

					var aCount = [{
						ADPDESC: aData.ADPDESC1,
						ADPC: aData.ADPC1
					}, {
						ADPDESC: aData.ADPDESC2,
						ADPC: aData.ADPC2
					}, {
						ADPDESC: aData.ADPDESC3,
						ADPC: aData.ADPC3
					}, {
						ADPDESC: aData.ADPDESC4,
						ADPC: aData.ADPC4
					}];
					// sort by ADPDESC
					aCount.sort(function(a, b) {
						if (!a.ADPDESC || !b.ADPDESC) {
							return 0;
						}
						var nameA = a.ADPDESC.toUpperCase(); // ignore upper and lowercase
						var nameB = b.ADPDESC.toUpperCase(); // ignore upper and lowercase
						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						// names must be equal
						return 0;
					});
					var counts = {};
					aCount.forEach(function(x) {
						counts[x.ADPDESC] = (counts[x.ADPDESC] || 0) + 1;
						x.Count = counts[x.ADPDESC];
					});
					var oResult = {
						TOTAL: 4
					}; //Assume 4 for now
					aCount.forEach(function(oItem, i) {
						switch (i) {
							case 0:
								oResult.ADPDESC1 = oItem.ADPDESC;
								oResult.ADPC1 = oItem.ADPC;
								oResult.Count1 = oItem.Count;
								break;
							case 1:
								oResult.ADPDESC2 = oItem.ADPDESC;
								oResult.ADPC2 = oItem.ADPC;
								oResult.Count2 = oItem.Count;
								break;
							case 2:
								oResult.ADPDESC3 = oItem.ADPDESC;
								oResult.ADPC3 = oItem.ADPC;
								oResult.Count3 = oItem.Count;
								break;
							case 3:
								oResult.ADPDESC4 = oItem.ADPDESC;
								oResult.ADPC4 = oItem.ADPC;
								oResult.Count4 = oItem.Count;
								break;
						}
					});

					this.getModel("dashboardModel").setProperty("/role", oResult);
					this.getModel("dashboardModel").refresh();

				}.bind(this);
				ajaxutil.fnRead("/AircraftRoleSvc", oParameter);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnLoadROLDashboard function");
				this.handleException(e);
			}
		},

		fnLoadLocation: function(oItem) {
			try {
				var oParameter = {};
				oParameter.filter = "REFID eq " + this.getAircraftId() + " and LFLAG eq L";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("dashboardModel").setProperty("/location", oData.results);
					this.getModel("dashboardModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/airtranscurrsvc", oParameter);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnLoadLocation function");
				this.handleException(e);
			}
		},
		/** 
		 * Load Air utilization data
		 */
		fnLoadUtilization: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq TABA_102" + " and otype eq AU";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("avmetModel").setProperty("/airutil", oData.results.length > 0 ? oData.results[0] : {});
					this.getModel("avmetModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/AircraftLogSvc", oParameter);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnLoadUtilization function");
				this.handleException(e);
			}
		},
		fnSubmitLocationChange: function(selectedKEy) {
			try {
				var oPayload = {};
				oPayload.airid = this.getModel("avmetModel").getProperty("/airSel/airid");
				oPayload.modid = this.getModel("avmetModel").getProperty("/airSel/modid");
				oPayload.tailid = this.getModel("avmetModel").getProperty("/airSel/tailid");
				oPayload.tailno = this.getModel("avmetModel").getProperty("/airSel/tailno");
				oPayload.LOCID = selectedKEy;
				var oParameter = {};
				oParameter.activity = 2;
				oParameter.error = function() {};
				oParameter.success = function() {
					this.getView().getModel("dashboardModel").setProperty("/editLoc", false);
					this.getView().getModel("dashboardModel").refresh();
					this.fnLoadSrv1Dashboard();
				}.bind(this);
				ajaxutil.fnUpdate("/AirtailSvc", oParameter, [oPayload], "ZRM_S_LOC", this);
				//Reset data
				this.getView().getModel("dashboardModel").setProperty("/editLoc", false);
				this.getView().getModel("dashboardModel").refresh();
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnSubmitLocationChange function");
				this.handleException(e);
			}
		},

		

		/**** 27/06/2020 Priya */
		_setRadialChartText: function(sControlId, sText1, sText2, crt, ttl) {
			try {
				// this.getView().byId(sControlId).setPercentage();
				this.getView().byId(sControlId).setPercentage(parseInt(formatter.percentAge(crt, ttl), 0));
				var scheduleMicroChartId = "#" + this.getView().byId(sControlId).sId + " > div > div > div";
				// var aircraftMicroChartId = "#" + this.getView().byId("aircraftMicroChartId").sId + " > div > div > div";
				// var FueltMicroChartId = "#" + this.getView().byId("FueltMicroChartId").sId + " > div > div > div";
				window.setTimeout(function() {
					document.querySelector(scheduleMicroChartId).textContent = sText1 + "\n" + sText2;
					// document.querySelector(scheduleMicroChartId).textContent = "2 \n ADDs";
					// document.querySelector(FueltMicroChartId).textContent = "2500 \n /2500 lbs";
				}.bind(this, scheduleMicroChartId), 10);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:_setRadialChartText function");
				this.handleException(e);
			}
		},
		_setRadialChartTextDisplay: function(sControlId, sText1, sText2, crt, ttl) {
			try {
				// this.getView().byId(sControlId).setPercentage();
				this.getView().byId(sControlId).setPercentage(parseInt(formatter.percentAge(crt, ttl), 0));
				var scheduleMicroChartId = "#" + this.getView().byId(sControlId).sId + " > div > div > div";
				// var aircraftMicroChartId = "#" + this.getView().byId("aircraftMicroChartId").sId + " > div > div > div";
				// var FueltMicroChartId = "#" + this.getView().byId("FueltMicroChartId").sId + " > div > div > div";
				window.setTimeout(function() {
					var sT1 = sText1 ? sText1 : "";
					var sT2 = sText2 ? sText2 : "";
					document.querySelector(scheduleMicroChartId).textContent = sT1 + "\n/" + sT2;
					// document.querySelector(scheduleMicroChartId).textContent = "2 \n ADDs";
					// document.querySelector(FueltMicroChartId).textContent = "2500 \n /2500 lbs";
				}.bind(this, scheduleMicroChartId), 10);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:_setRadialChartTextDisplay function");
				this.handleException(e);
			}
		},

		_fnSetWarningMessage: function(aData) {
			try {
				aData = aData.WTEXT.split("@");
				this.getModel("avmetModel").setProperty("/WarningIndex", 0);
				this.getModel("avmetModel").setProperty("/WarningText", aData);
				this.getModel("avmetModel").setProperty("/WarningIndexText", aData[0]);
				this.getModel("avmetModel").setProperty("/WarningLeftBtn", false);
				var bFlag = aData.length > 1 ? true : false;
				this.getModel("avmetModel").setProperty("/WarningRightBtn", bFlag);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:_fnSetWarningMessage function");
				this.handleException(e);
			}
		},

		onRightWarnPress: function() {
			var iIndex = this.getModel("avmetModel").getProperty("/WarningIndex");
			iIndex = parseInt(iIndex, 10);
			var aData = this.getModel("avmetModel").getProperty("/WarningText");
			var newIndex = iIndex + 1;
			if (aData[newIndex]) {
				this.getModel("avmetModel").setProperty("/WarningIndex", newIndex);
				this.getModel("avmetModel").setProperty("/WarningIndexText", aData[newIndex]);
				this.getModel("avmetModel").setProperty("/WarningLeftBtn", true);
			}
			if (newIndex === aData.length - 1) {
				this.getModel("avmetModel").setProperty("/WarningRightBtn", false);
			}
		},

		onLeftWarnPress: function() {
			var iIndex = this.getModel("avmetModel").getProperty("/WarningIndex");
			iIndex = parseInt(iIndex, 10);
			var aData = this.getModel("avmetModel").getProperty("/WarningText");
			var newIndex = iIndex - 1;
			if (aData[newIndex]) {
				this.getModel("avmetModel").setProperty("/WarningIndex", newIndex);
				this.getModel("avmetModel").setProperty("/WarningIndexText", aData[newIndex]);
				this.getModel("avmetModel").setProperty("/WarningRightBtn", true);
			}
			if (newIndex === 0) {
				this.getModel("avmetModel").setProperty("/WarningLeftBtn", false);
			}
		}
	});
});