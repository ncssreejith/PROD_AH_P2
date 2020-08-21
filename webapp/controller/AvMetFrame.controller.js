sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"sap/ui/core/Popup",
	"avmet/ah/model/formatter",
	"avmet/ah/util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, dataUtil, Fragment, Popup, formatter, ajaxutil, JSONModel, Log) {
	"use strict";

	/* ***************************************************************************
	 *   This file is for Managing Tool page Framework               
	 *   1. Contain functions for top and side Toolbar items
	 *	Note: All Events must start with 'onXXXX' and Private functions '_XXXX'
	 *	Functions are not allowed to have more than 8 parameters and max 40 lines
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.AvMetFrame", {
		formatter: formatter,
		// ***************************************************************************
		//  1. UI Events  
		// ***************************************************************************
		onInit: function() {
			this.getRouter().getRoute("RouteHome").attachPatternMatched(this._onObjectMatched, this);
			var oData = {};
			oData.login = dataUtil.getDataSet(this.getOwnerComponent().appModel).login; // need to save in session
			oData.airSel = dataUtil.getDataSet(this.getOwnerComponent().appModel).airSel; // need to save in session
			oData.dash = {};
			oData.airutil = {};
			oData.ispopOpen = false;
			this.getView().setModel(new JSONModel(oData), "avmetModel");
			this.fnLoadInitialData();
		},
		/* Function : onSideNavButtonPress
		 *  To handle side navigation toggle
		 */
		onSideNavButtonPress: function(oEvent) {
			if (this.getModel("avmetModel").getProperty("/ispopOpen")) {
				this._oPopover.close();
				this.getModel("avmetModel").setProperty("/ispopOpen", false);
				this.getModel("avmetModel").refresh();
			}
			var that = this,
				oButton = oEvent.getSource(),
				oModel = dataUtil.createJsonModel("model/sideMenuItems.json");
			if (!this._oPopover) {
				Fragment.load({
					id: "COSManageJobs",
					name: "avmet.ah.fragments.SideMenu",
					controller: this
				}).then(function(oPopover) {
					this._oPopover = oPopover;
					this.getView().addDependent(this._oPopover);
					that._oPopover.setModel(oModel);
					this._oPopover.openBy(oButton);
				}.bind(this));
				this.getModel("avmetModel").setProperty("/ispopOpen", true);
				this.getModel("avmetModel").refresh();
			} else {
				this._oPopover.openBy(oButton);
				this.getModel("avmetModel").setProperty("/ispopOpen", false);
				this.getModel("avmetModel").refresh();
			}
		},

		onNavToProduct: function(oEvent) {
			var oCtx = oEvent.getSource().getBindingContext();
			var oNavCon = Fragment.byId("COSManageJobs", "navCon");
			var oDetailPage = Fragment.byId("COSManageJobs", "detail");
			oNavCon.to(oDetailPage);
			oDetailPage.bindElement(oCtx.getPath());
			this._oPopover.focus();
		},

		onManageJobsNavBack: function(oEvent) {
			var oNavCon = Fragment.byId("COSManageJobs", "navCon");
			oNavCon.back();
			this._oPopover.focus();
		},

		onManageListPress: function(oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("menuModel");
			if (!oBindingContext.getObject().visible) {
				return;
			}
			if (oBindingContext.getObject().child) {
				var oDetailPage = Fragment.byId("COSManageJobs", "detailPage");
				Fragment.byId("COSManageJobs", "navCon").to(oDetailPage);
				oEvent.getSource().getModel("menuModel").setProperty("/child", oBindingContext.getObject());
				// oDetailPage.bindElement(oBindingContext.getObject());
				this._oPopover.focus();
				return;
			}
			if (oBindingContext.getProperty("name") === "Settings") {
				if (this._oDialog !== undefined) {
					this._oDialog.destroyContent();
					this._oDialog.destroy();
					this._oDialog = undefined;
				}
				this._oDialog = this.createoDialog(this, "AppInfo", "ApplicationInfo");
				this._oDialog.openBy(this.getView().byId("btnSideNavToggle"));
			} else {
				this.getRouter().navTo(oBindingContext.getProperty("pattern"));
			}
		},
		// onSideNavButtonPress: function () {
		// 	var oToolPage = this.byId("tpAvmet");
		// 	oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		// },

		onAircraftInfoPress: function(oEvent) {
			try {
				var oButton = oEvent.getSource();
				// create popover
				if (!this._oAppDialogInfo) {
					Fragment.load({
						name: "avmet.ah.fragments.AircraftInfo",
						id: this.createId("AircraftInfoid"),
						controller: this
					}).then(function(pPopover) {
						this._oAppDialogInfo = pPopover;
						this.getView().addDependent(this._oAppDialogInfo);
						this._oAppDialogInfo.openBy(oButton);
					}.bind(this));
				} else {
					this._oAppDialogInfo.openBy(oButton);
				}
			} catch (e) {
				this.handleException(e);
			}

		},
		
		onAircraftTransferMenu: function(oEvent) {
			this.getRouter().navTo("AircraftTransfer");
		},
		onAircraftUnlock: function(oEvent) {
			try {
				var oDash = this.getModel("avmetModel").getProperty("/dash"); //astid
				oDash.TBTN3 = true;
				this.getModel("avmetModel").refresh();
			} catch (e) {
				this.handleException(e);
				Log.error("Exception in onAircraftInfoPress function");
			}
		},
		onFSUnlock: function(oEvent) {
			try {
				var oDash = this.getModel("avmetModel").getProperty("/dash"); //astid
				oDash.TBTN2 = true;
				this.getModel("avmetModel").refresh();
			} catch (e) {
				this.handleException(e);
				Log.error("Exception in onAircraftInfoPress function");
			}
		},

		onDetailsMenuClick: function(oEvent) {
			var sText = oEvent.getSource().getText();
			if (sText === "Aircraft Monitoring") {
				this.getRouter().navTo("SortieMonitoring");
			} else if (sText === "WDNS Coefficients Records") {
				this.getRouter().navTo("MainWDNS");
			} else if (sText === "Weight & Balance") {
				this.getRouter().navTo("WeightBalance");
			} else if (sText === "Approvals") {
				this.getRouter().navTo("Approvals");
			}
		},

		/* Function : onItemSelect
		 *  parameter : oEvent
		 *  To handle press event of items in side toolbar 
		 */
		onItemSelect: function(oEvent) {
			// var that = this;
			var sPattern = this._getRouterValue(oEvent.getParameter("item").getProperty("key"));
			// if (sPattern === "AircraftTransfer") {
			// 	this.getRouter().navTo(sPattern, {
			// 		airid: that.getAircraftId(),
			// 		tailid: that.getTailId()
			// 	});
			// 	return;
			// } 
			this.getRouter().navTo(sPattern);
		},
		_getRouterValue: function(key) {
			if (key === "coscreatejob") {
				return "CosCreateJob";
			} else if (key === "cosaddl") {
				return "RouteDefectSummaryADD";
			} else if (key === "overview") {
				return "Overview";
			} else if (key === "cosstwdns") {
				return "MainWDNS";
			} else if (key === "cosdashboard") {
				return "COSDashboard";
			} else if (key === "cosaircrafttransfer") {
				return "AircraftTransfer";
			} else if (key === "coslimitation") {
				return "Limitations";
			} else if (key === "cosengine") {
				return "Engine";
			} else if (key === "bfaircraftselection") {
				return "AircraftSelection";
			} else if (key === "bfflightservice") {
				return "DBOngFlightService";
			} else if (key === "bfdashboardinitial") {
				return "DashboardInitial";
			} else if (key === "bfdashboardpilot") {
				return "DBPilotAccept";
			} else if (key === "bfstequipment") {
				return "AircraftUtilisation";
			} else if (key === "bfstleading") {
				return "AircraftOverview";
			}
		},
		// ***************************************************************************
		//   2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		fnLoadSrv1Dashboard: function() {
			var oParameter = {};
			oParameter.filter = "tailid eq " + this.getTailId();
			oParameter.error = function() {};
			oParameter.success = function(oData) {
				this.getModel("avmetModel").setProperty("/dash", oData.results.length > 0 ? oData.results[0] : {});
				var oDash = this.getModel("avmetModel").getProperty("/dash");
				this.fnSetMenuVisible(oDash.TBTN1, this.fnFindRoleChangeStations);
				this.fnSetMenuVisible(oDash.TBTN2, this.fnFindCreateFlightService);
				this.fnSetMenuVisible(oDash.TBTN3, this.fnFindCosjobs);
				var oModel = this.getView().getModel("avmetModel");
				oModel.setProperty("/UnlockAVMET", this.fnCheckLockStatus(oDash.astid));
				oModel.setProperty("/UnlockRec", this.fnCheckRecLockStatus(oDash.astid));

				this.getModel("avmetModel").refresh();
			}.bind(this);
			ajaxutil.fnRead("/DashboardCountsSvc", oParameter);
		},
		fnCheckLockStatus: function(sStatus) {
			try {
				switch (sStatus) {
					case "AST_FFF":
					case "AST_RFF":
						return true;
					default:
						return false;
				}
			} catch (e) {
				Log.error("Exception in fnCheckLockStatus function");
			}
		},
		fnCheckRecLockStatus: function(sStatus) {
			try {
				switch (sStatus) {
					case "AST_FAIR":
					case "AST_FAIR0":
					case "AST_FAIR1":
					case "AST_FAIR2":	
						return true;
					default:
						return false;
				}
			} catch (e) {
				Log.error("Exception in fnCheckLockStatus function");
			}
		},

		// ***************************************************************************
		//   3. Specific Function 
		//      Function which should be in same stayle in all controllers
		// ***************************************************************************

		// ***************************************************************************
		//   4. Private Function   
		// ***************************************************************************
		//	4.1 First level Private functions
		_onObjectMatched: function() {
			this.fnLoadInitialData();
		},
		fnSetMenuVisible: function(oFlag, fnCallBack) {
			var aMenu = this.getModel("menuModel").getData();
			var oFound = {};
			if (oFlag === "X") {
				oFound = aMenu.find(fnCallBack);
				oFound.visible = true;
			} else {
				oFound = aMenu.find(fnCallBack);
				oFound.visible = false;
			}
		},
		fnLoadInitialData: function() {
			this.fnLoadSrv1Dashboard();
			this.fnLoadUtilization();
		},

		// fnLoadSrv1Dashboard: function() {
		// 	var oParameter = {};
		// 	oParameter.filter = "tailid eq " + this.getTailId();
		// 	oParameter.error = function() {};
		// 	oParameter.success = function(oData) {
		// 		this.getModel("avmetModel").setProperty("/dash", oData.results.length > 0 ? oData.results[0] : {});
		// 		var oDash = this.getModel("avmetModel").getProperty("/dash");
		// 		this.fnSetMenuVisible(oDash.TBTN1, this.fnFindRoleChangeStations);
		// 		this.fnSetMenuVisible(oDash.TBTN2, this.fnFindCreateFlightService);
		// 		this.fnSetMenuVisible(oDash.TBTN3, this.fnFindCosjobs);

		// 		this.getModel("avmetModel").refresh();
		// 	}.bind(this);
		// 	ajaxutil.fnRead("/DashboardCountsSvc", oParameter);
		// },
		// fnSetMenuVisible: function(oFlag, fnCallBack) {
		// 	var aMenu = this.getModel("menuModel").getData();
		// 	var oFound = {};
		// 	if (oFlag === "X") {
		// 		oFound = aMenu.find(fnCallBack);
		// 		oFound.visible = true;
		// 	} else {
		// 		oFound = aMenu.find(fnCallBack);
		// 		oFound.visible = false;
		// 	}
		// },
		fnFindRoleChangeStations: function(oMenu) {
			return oMenu.pattern === "RoleChangeStations";
		},
		fnFindCreateFlightService: function(oMenu) {
			return oMenu.pattern === "CreateFlightService";
		},
		fnFindCosjobs: function(oMenu) {
			return oMenu.pattern === "Cosjobs";
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
		}

		//	4.2 Second level Private functions
	});
});