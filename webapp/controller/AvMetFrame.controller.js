sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
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
			/*Rahul : 24/11/2020: AvMET UI Clean Up:Point(3) Application information, code Added  : Start*/
			this.getView().setModel(new JSONModel(oData), "avmetVersionModel");
			this.fnGetAppVersion();
			/*Rahul : 24/11/2020: AvMET UI Clean Up:Point(3) Application information, code Added  : End*/
			this.fnLoadInitialData();
			// Fill Profile Info
			this.getView().setModel(new JSONModel(), "oProfileModel");
			this.onProfileModelLoad();
		},
		onAfterRendering: function() {
			var that = this;
			// Retrieve backend posting messages of dashboard status every 30 secs.
			if (!this._LoadAVMETServices) {
				this._LoadAVMETServices = setInterval(function() {
					that._fnJobGetScheduled();
				}, 30000);
			}
		},
		/** 
		 * Exit clean up.
		 */
		onExit: function() {
			// Clear off state.
			this.destroyState();
		},
		/** 
		 * Clean up state object.
		 */
		destroyState: function() {
			// Clear load message interval.
			clearInterval(this._LoadAVMETServices);
		},
		/** 
		 * Trigger schs job calculation
		 * @constructor 
		 */
		_fnJobGetScheduled: function() {
			try {
				this.fnLoadSrv1Dashboard(); // Change by Teck Meng 25/11/2020 09:45 
				this.fnLoadRunningChange();
			} catch (e) {
				this.Log.error("Exception in _fnJobGetScheduled function");
			}
		},
		/* Function : onSideNavButtonPress
		 *  To handle side navigation toggle
		 */
		onSideNavButtonPress: function(oEvent) {
			if (!this.fnCheckTailAvail()) {
				return;
			}
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
				this.onManageJobsNavBack();
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
				if (oBindingContext.getProperty("pattern") === "Cosjobs") {
					this.getRouter().navTo(oBindingContext.getProperty("pattern"), {
						State: "OST"
					}, true);
				} else {
					this.getRouter().navTo(oBindingContext.getProperty("pattern"));
				}
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

		onAircraftTransferMenu: function() {
			this.getRouter().navTo("AircraftTransfer");
		},
		onAircraftUnlock: function() {
			try {
				this.fnUnlockSignOff();
			} catch (e) {
				this.handleException(e);
				Log.error("Exception in onAircraftUnlock function");
			}
		},
		onFSUnlock: function() {
			try {
				this.fnFSUnlockSignOff();
			} catch (e) {
				this.handleException(e);
				Log.error("Exception in onFSUnlock function");
			}
		},
		onReleaseForRectification: function() {
			try {
				this.getRouter().navTo("ReleaseForRectification");
			} catch (e) {
				this.handleException(e);
				Log.error("Exception in onReleaseForRectification function");
			}
		},
		//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		onVoidFSPress: function() {
			try {
				this.onNewFSSignOffConfirm("C");
			} catch (e) {
				Log.error("Exception in ReleaseForRectification:onSignOffPress function");
				this.handleException(e);
			}
		},
		//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		/** 
		 * 
		 * @param sFsstatus
		 */
		onNewFSSignOffConfirm: function(sFsstatus) {
			try {
				var oPayload = {
					tailid: this.getTailId(),
					refid: this.getAircraftId(),
					fsstatus: sFsstatus,
					srvtid: this.getModel("avmetModel").getProperty("/dash/SRVTID"),
					stepid: "S_CL"
				};

				var oParameter = {};
				oParameter.activity = 4;
				oParameter.error = function() {};
				oParameter.success = function() {
					this.fnLoadSrv1Dashboard();
					this.getModel("avmetModel").refresh();
					this.getRouter().navTo("DashboardInitial", {}, true /*no history*/ ); //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
				}.bind(this);
				//Teck Meng change on 20/11/2020 13:00 AH Issue REUAT 40. As discussed with Ninuk
				ajaxutil.fnCreate(this.getResourceBundle().getText("VOIDFLIGHTSVC"), oParameter, [oPayload], "ZRM_FS_FFF", this);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:onACSignOffConfirm function");
				this.handleException(e);
			}
		},

		//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		/** 
		 * On running pilot change
		 */
		onRunningChangePress: function() {
			try {
				var sSrvtId = this.getModel("avmetModel").getProperty("/dash/SRVTID");
				this.getRouter().navTo("PilotAccept", {
					srvtid: sSrvtId ? sSrvtId : " ",
					stepid: "S_PA"
				});
			} catch (e) {
				Log.error("Exception in ReleaseForRectification:onRunningChangePress function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 */
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
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 * @param key
		 * @returns
		 */
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

		/** //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * AVMET unlock signoff
		 */
		fnUnlockSignOff: function() {
			try {
				var oPayload = {}; //this.getModel("avmetModel").getProperty("/record");
				oPayload.TAILID = this.getTailId();
				oPayload.LFLAG = "X";
				oPayload.SRVTID = this.getModel("avmetModel").getProperty("/dash/SRVTID");
				var oParameter = {};
				oParameter.activity = 2;
				oParameter.error = function() {};
				oParameter.success = function() {
					var oDash = this.getModel("avmetModel").getProperty("/dash"); //astid
					oDash.TBTN3 = true;
					var oModel = this.getView().getModel("avmetModel");
					oModel.setProperty("/UnlockAVMET", false);
					this.fnLoadSrv1Dashboard();
					this.getModel("avmetModel").refresh();
				}.bind(this);
				var oModel = this.getView().getModel("avmetModel");
				oModel.setProperty("/UnlockAVMET", true);
				var sASTID = this.getModel("avmetModel").getProperty("/dash/astid");
				var sAuthObj = (sASTID === "AST_FFF") ? "ZRM_FFF_UL" : "ZRM_RFF_UL";
				ajaxutil.fnCreate(this.getResourceBundle().getText("TAILLOCKSVCHEL"), oParameter, [oPayload], sAuthObj, this);
			} catch (e) {
				Log.error("Exception in onSignOffPress function");
			}
		},
		/** 
		 * FAIR unlock signoff
		 */
		fnFSUnlockSignOff: function() {
			try {
				var oPayload = {}; //this.getModel("avmetModel").getProperty("/record");
				oPayload.TAILID = this.getTailId();
				oPayload.LFLAG = "X";
				oPayload.SRVTID = this.getModel("avmetModel").getProperty("/dash/SRVTID");
				var oParameter = {};
				oParameter.activity = 4;
				oParameter.error = function() {};
				oParameter.success = function() {
					var oDash = this.getModel("avmetModel").getProperty("/dash"); //astid
					oDash.TBTN2 = true;
					var oModel = this.getView().getModel("avmetModel");
					oModel.setProperty("/UnlockAVMET", false);
					if (this.getOwnerComponent().getModel("jobModel")) {
						var sJob = this.getOwnerComponent().getModel("jobModel").getProperty("/jobId");
						sap.ui.getCore().getEventBus().publish(
							"SubView1",
							"UpdateJob", {
								sJobId: sJob
							},
							this
						);
					}
					this.fnLoadSrv1Dashboard();
					this.getModel("avmetModel").refresh();
				}.bind(this);
				var oModel = this.getView().getModel("avmetModel");
				oModel.setProperty("/UnlockAVMET", true);
				var sASTID = this.getModel("avmetModel").getProperty("/dash/astid");
				var sAuthObj = (sASTID === "AST_FFF") ? "ZRM_FS_FFF" : "ZRM_FAIR_R";
				ajaxutil.fnCreate(this.getResourceBundle().getText("TAILLOCKSVC"), oParameter, [oPayload], sAuthObj, this);
			} catch (e) {
				Log.error("Exception in onSignOffPress function");
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
		/** //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * 
		 * @constructor 
		 */
		_onObjectMatched: function() {
			this.fnLoadInitialData();
			this._fnJobGetScheduled();
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		fnLoadInitialData: function() {
			this.fnLoadSrv1Dashboard();
			this.fnLoadUtilization();
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oMenu
		 * @returns
		 */
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oMenu
		 * @returns
		 */
		fnFindRoleChangeStations: function(oMenu) {
			return oMenu.pattern === "RoleChangeStations";
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oMenu
		 * @returns
		 */
		fnFindCreateFlightService: function(oMenu) {
			return oMenu.pattern === "CreateFlightService";
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oMenu
		 * @returns
		 */
		fnFindCosjobs: function(oMenu) {
			return oMenu.pattern === "Cosjobs";
		},
		/** //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
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
				ajaxutil.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnLoadUtilization function");
				this.handleException(e);
			}
		},
		/**Rahul : 24/11/2020: AvMET UI Clean Up:Point(3) Application information, code Added  : Start
		 *
		 * Load Application version data
		 */
		fnGetAppVersion: function() {
				try {
					var oParameter = {};
					oParameter.error = function() {};
					oParameter.success = function(oData) {
						if (oData && oData.results.length > 0) {
							this.getModel("avmetVersionModel").setData(oData.results[0]);
							this.getModel("avmetVersionModel").refresh();
						} else {
							this.getModel("avmetVersionModel").setData(null);
							this.getModel("avmetVersionModel").refresh();
						}
					}.bind(this);
					ajaxutil.fnRead(this.getResourceBundle().getText("GETAPPVERSIONSVC"), oParameter);
				} catch (e) {
					this.Log.error("Exception in DashboardInitial:fnGetAppVersion function");
					this.handleException(e);
				}
			}
			/*Rahul : 24/11/2020: AvMET UI Clean Up:Point(3) Application information, code Added  : End*/
			//	4.2 Second level Private functions
	});
});