sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log"
], function(BaseController, dataUtil, formatter, ajaxutil, Log) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAHUL THORAT 
	 *   Control name: PilotUpdates          
	 *   Purpose : Add Equipment running log dialog controller
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onSignOffPress
	 *   2. Backend Calls
	 *        2.1 _fnUtilizationGet
	 *        2.2 _fnSumamryDetailsGet
	 *        2.3 onRaiseScheduleConcessionPress
	 *        2.4 onStartJobPress
	 *   3. Private calls
	 *        3.1 onOpenQuickView
	 *        3.2 onCloseDialog
	 *        3.3 handleMenuItemPress
	 *        3.4 onRaiseExtension
	 *        3.5 onCloseAddWorkCenterDialog
	 *        3.6 onRaiseScheduleConcession
	 *        3.7 onUilisationChange
	 *        3.8 onCloseRaiseScheduleConcession
	 *        3.9 onCloseConfirmDialog
	 *        3.10 onAddWorkcenterSubmitPress
	 *        3.11 onAEFMMenuPress
	 *        3.12 onCloseAEMFDialog
	 *        3.13 handlePressWorkCenterFragmentOpenMenu
	 *        3.14 onCloseWorkCenterMenu
	 *        3.15 handleWorkCenterMenuItemPress
	 *        3.16 onSummaryIconTabBarSelect
	 *        3.17 onAddFlyingRequirements
	 *        3.18 onAddSortieMonitoring
	 *        3.19 _handleRouteMatched
	 **   Note :
	 *************************************************************************** */

	return BaseController.extend("avmet.ah.controller.CosScheduleSummary", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var that = this;
				that._oRouter = sap.ui.core.UIComponent.getRouterFor(that);
				that._oRouter.attachRoutePatternMatched(that._handleRouteMatched, that);
				var oLocalModel = dataUtil.createNewJsonModel();
				oLocalModel.setData({
					TaksFlag: true,
					SparesFlag: false,
					TMDEFlag: false,
					FlyingRequirementsFlag: false,
					SortieMonitoringFlag: false,
					SummaryFlag: true,
					WorcenterFlag: false,
					WorkCenterTitle: "",
					TaskCount: 0,
					SparesCount: 0,
					TMDECount: 0,
					FlyReqCount: 0,
					SortieCount: 0,
					OutstandingCount: 0,
					PendingSupCount: 0,
					CompleteCount: 0,
					WorkCenterKey: "Summary",
					ESJobId: "",
					CreateTaskMenu: [{
						"Text": "New Task",
						"Visible": true
					}, {
						"Text": "Apply Template",
						"Visible": true
					}],
					SpareMenu: [{
						"Text": "Edit",
						"Visible": true
					}, {
						"Text": "Delete Request",
						"Visible": true
					}],
					WorkCenterActionMenu: [{
						"Text": "Set as Prime",
						"Visible": true
					}, {
						"Text": "Switch Work Center",
						"Visible": true
					}, {
						"Text": "Delete Work Center",
						"Visible": true
					}],
					WorkCenter: [{
						jobid: "",
						tailid: "",
						wrctr: "ZSummary",
						isprime: "",
						wrctrtx: "Summary"
					}]
				});
				this.getView().setModel(oLocalModel, "LocalModel");
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onInit function");
				this.handleException(e);
			}
		},
		onOpenQuickView: function(sFlag, oEvent) {
			try {
				if (this._oQuickView) {
					this._oQuickView.destroy();
				}
				this._oQuickView = sap.ui.xmlfragment(this.createId("ManageJob_Defect_Id"), "avmet.ah.fragments.ManageJobSummaryMenu", this);
				this.getView().addDependent(this._oQuickView);
				var oSummaryModel = this.getView().getModel("SummaryModel");
				if (sFlag === 'DF') {
					if (oSummaryModel.getProperty("/FAIRStatusText") === 'ACTIVATED') {
						oSummaryModel.setProperty("/MenuVisible", false);
						oSummaryModel.setProperty("/MenuScheduleVisible", false);
						oSummaryModel.setProperty("/MenuScheduleVisible", false);
						oSummaryModel.setProperty("/MenuWorkCenterVisible", false);
					} else {
						oSummaryModel.setProperty("/MenuVisible", true);
						oSummaryModel.setProperty("/MenuScheduleVisible", false);
						oSummaryModel.setProperty("/MenuActivateVisible", false);
						oSummaryModel.setProperty("/MenuWorkCenterVisible", false);
					}
				} else {
					oSummaryModel.setProperty("/MenuVisible", false);
					oSummaryModel.setProperty("/MenuScheduleVisible", true);
					oSummaryModel.setProperty("/MenuActivateVisible", false);
					oSummaryModel.setProperty("/MenuWorkCenterVisible", false);
				}
				this.getView().getModel("SummaryModel").updateBindings(true);
				var eDock = sap.ui.core.Popup.Dock;
				var oButton = oEvent.getSource();
				this._oQuickView.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onOpenQuickView function");
				this.handleException(e);
			}
		},

		onCloseDialog: function() {
			try {
				if (this._oQuickView) {
					this._oQuickView.close(this);
					this._oQuickView.destroy();
					delete this._oQuickView;
				}
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onCloseDialog function");
				this.handleException(e);
			}
		},

		handleMenuItemPress: function(oEvent) {
			try {
				var that = this;
				var oSummaryModel = this.getView().getModel("SummaryModel");
				switch (oEvent.getParameter("item").getText()) {
					case "Raise Extension":
						break;
				}
				this.getView().getModel("SummaryModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:handleMenuItemPress function");
				this.handleException(e);
			}
		},

		onRaiseExtension: function() {
			try {
				var that = this;
				if (!this._oAddWorkCenter) {
					this._oAddWorkCenter = sap.ui.xmlfragment(this.createId("idWorkCenterDialog"),
						"avmet.ah.fragments.AddWorkCenterDialog",
						this);
					this.getView().addDependent(this._oAddWorkCenter);
				}
				this._oAddWorkCenter.open(this);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onRaiseExtension function");
				this.handleException(e);
			}
		},

		onCloseAddWorkCenterDialog: function() {
			try {
				if (this._oAddWorkCenter) {
					this._oAddWorkCenter.close(this);
					this._oAddWorkCenter.destroy();
					delete this._oAddWorkCenter;
				}
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onCloseAddWorkCenterDialog function");
				this.handleException(e);
			}
		},
		onRaiseScheduleConcession: function() {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel();

				if (!this._oRaiseConcession) {
					this._oRaiseConcession = sap.ui.xmlfragment(this.createId("idScheduleJobExtension"),
						"avmet.ah.fragments.ScheduleJobExtension",
						this);
					oModel.setData({
						"DueBy": "N",
						"ExpDate": "",
						"Util": "",
						"UtilVal": ""
					});
					this._fnUtilizationGet();
					this.getView().setModel(oModel, "RSModel");
					this.getView().addDependent(this._oRaiseConcession);
				}
				this._oRaiseConcession.open(this);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onRaiseScheduleConcession function");
				this.handleException(e);
			}
		},

		onUilisationChange: function(oEvent) {
			try {
				var oTemp = oEvent.getSource().getSelectedItem().getText(),
					oModel = this.getView().getModel("SummaryModel");
				oModel.setProperty("/UM", oTemp);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onUilisationChange function");
				this.handleException(e);
			}
		},

		onCloseRaiseScheduleConcession: function() {
			try {
				if (this._oRaiseConcession) {
					this._oRaiseConcession.close(this);
					this._oRaiseConcession.destroy();
					delete this._oRaiseConcession;
				}
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onCloseRaiseScheduleConcession function");
				this.handleException(e);
			}
		},
		onCloseConfirmDialog: function() {
			try {
				var that = this;
				that.getFragmentControl("idWorkCenterDialog", "addWCId").setVisible(true);
				that.getFragmentControl("idWorkCenterDialog", "confirmWCId").setVisible(false);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onCloseConfirmDialog function");
				this.handleException(e);
			}
		},

		onAddWorkcenterSubmitPress: function(sValue) {
			try {
				var that = this,
					oComboBoxInstance = that.getFragmentControl("idWorkCenterDialog", "ComboWCId"),
					oValidateWC,
					sSelectedText, sSelectedItem,
					sState;
				sState = that.getFragmentControl("idWorkCenterDialog", "switchId").getState();
				sSelectedItem = oComboBoxInstance.getSelectedItem();
				sSelectedText = sSelectedItem.getText();
				oValidateWC = that._fnValidateWorkCenterRecord(sSelectedText);
				if (oValidateWC) {
					if (sState) {
						if (sValue !== "CON") {
							that.getFragmentControl("idWorkCenterDialog", "addWCId").setVisible(false);
							that.getFragmentControl("idWorkCenterDialog", "workCenterId").setText(sSelectedText);
							that.getFragmentControl("idWorkCenterDialog", "confirmWCId").setVisible(true);

						} else {
							that._fnupdateWorkCenterJson(sSelectedText, sState);
						}
					} else {
						that._fnupdateWorkCenterJson(sSelectedText, sState);
					}
				} else {

					oComboBoxInstance.setValueState("Error");
					oComboBoxInstance.setValueStateText("Work Center already added");
				}
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onAddWorkcenterSubmitPress function");
				this.handleException(e);
			}
		},

		onAEFMMenuPress: function(oValue) {
			try {
				var oLocalModel = this.getView().getModel("LocalModel");
				switch (oValue) {
					case "TS":
						oLocalModel.setProperty("/TaksFlag", true);
						oLocalModel.setProperty("/SparesFlag", false);
						oLocalModel.setProperty("/TMDEFlag", false);
						oLocalModel.setProperty("/FlyingRequirementsFlag", false);
						oLocalModel.setProperty("/SortieMonitoringFlag", false);
						break;
					case "SP":
						oLocalModel.setProperty("/TaksFlag", false);
						oLocalModel.setProperty("/SparesFlag", true);
						oLocalModel.setProperty("/TMDEFlag", false);
						oLocalModel.setProperty("/FlyingRequirementsFlag", false);
						oLocalModel.setProperty("/SortieMonitoringFlag", false);
						break;
					case "TM":
						oLocalModel.setProperty("/TaksFlag", false);
						oLocalModel.setProperty("/SparesFlag", false);
						oLocalModel.setProperty("/TMDEFlag", true);
						oLocalModel.setProperty("/FlyingRequirementsFlag", false);
						oLocalModel.setProperty("/SortieMonitoringFlag", false);
						break;
					case "FR":
						oLocalModel.setProperty("/TaksFlag", false);
						oLocalModel.setProperty("/SparesFlag", false);
						oLocalModel.setProperty("/TMDEFlag", false);
						oLocalModel.setProperty("/FlyingRequirementsFlag", true);
						oLocalModel.setProperty("/SortieMonitoringFlag", false);
						break;
					case "SM":
						oLocalModel.setProperty("/TaksFlag", false);
						oLocalModel.setProperty("/SparesFlag", false);
						oLocalModel.setProperty("/TMDEFlag", false);
						oLocalModel.setProperty("/FlyingRequirementsFlag", false);
						oLocalModel.setProperty("/SortieMonitoringFlag", true);
						break;
				}

				this.getView().getModel("LocalModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onAEFMMenuPress function");
				this.handleException(e);
			}
		},

		onCloseAEMFDialog: function() {
			try {
				if (this._oWCMenuFrag) {
					this._oWCMenuFrag.close(this);
					this._oWCMenuFrag.destroy();
					delete this._oWCMenuFrag;
				}
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onCloseAEMFDialog function");
				this.handleException(e);
			}
		},

		handlePressWorkCenterFragmentOpenMenu: function(sText, oEvent) {
			try {
				var that = this,
					oStatus,
					oButton, eDock, oModel, oDialogModel;
				oModel = that.getView().getModel("LocalModel");
				oDialogModel = dataUtil.createNewJsonModel();
				if (!this._oWCMenuFrag) {
					this._oWCMenuFrag = sap.ui.xmlfragment(this.createId("WCMenuFragId"),
						"avmet.ah.fragments.WorkCenterFragmentMenu",
						this);
					this.getView().addDependent(this._oWCMenuFrag);
				}
				switch (sText) {
					case "WCT":
						oDialogModel.setData(oModel.getData().CreateTaskMenu);
						break;
					case "WCA":
						oStatus = that._fnGetWorkCenterPrimeStatus(oModel.getProperty("/WorkCenterTitle"));
						if (oStatus) {
							oModel.getData().WorkCenterActionMenu[0].Visible = false;
						} else {
							oModel.getData().WorkCenterActionMenu[0].Visible = true;
						}
						oModel.updateBindings(true);
						oDialogModel.setData(oModel.getData().WorkCenterActionMenu);
						break;
					case "TDM":
					case "SMT":
					case "SPR":
					case "FLR":
						oDialogModel.setData(oModel.getData().SpareMenu);
						break;

				}
				this._oWCMenuFrag.setModel(oDialogModel, "DialogModel");
				eDock = sap.ui.core.Popup.Dock;
				oButton = oEvent.getSource();
				this._oWCMenuFrag.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:handlePressWorkCenterFragmentOpenMenu function");
				this.handleException(e);
			}
		},
		onCloseWorkCenterMenu: function() {
			try {
				if (this._oWCMenuFrag) {
					this._oWCMenuFrag.close(this);
					this._oWCMenuFrag.destroy();
					delete this._oWCMenuFrag;
				}
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onCloseWorkCenterMenu function");
				this.handleException(e);
			}
		},
		handleWorkCenterMenuItemPress: function(oEvent) {
			try {
				var that = this,
					oModel = that.getView().getModel("LocalModel"),
					oSelectedItem;
				oSelectedItem = oEvent.getParameter("item").getText();
				switch (oSelectedItem) {
					case "Set as Prime":
						that._fnResetWorkCenterPrimeStatus(oModel.getProperty("/WorkCenterTitle"));
						break;
					case "Switch Work Center":
						break;
					case "Delete Work Center":
						that._fnRemoveWorkCenter(oModel.getProperty("/WorkCenterTitle"));
						oModel.setProperty("/SummaryFlag", true);
						oModel.setProperty("/WorcenterFlag", false);
						break;
					case "New Task":
						this.onAddCreateTask();
						break;
					case "Apply Template":
						this.getRouter().navTo("CosApplyTemplate");
						break;
					case "Edit":
						break;
					case "Delete Request":
						break;
				}
				oModel.updateBindings(true);
				this.onCloseWorkCenterMenu();
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:handleWorkCenterMenuItemPress function");
				this.handleException(e);
			}
		},

		onSummaryIconTabBarSelect: function(oEvent) {
			try {
				var that = this,
					sSelectedtxt,
					oModel;
				try {
					sSelectedtxt = oEvent.getParameter("selectedItem").getText();
				} catch (e) {
					sSelectedtxt = oEvent;
				}
				oModel = that.getView().getModel("LocalModel");
				if (sSelectedtxt === "Summary") {
					oModel.setProperty("/SummaryFlag", true);
					oModel.setProperty("/WorcenterFlag", false);
				} else {
					oModel.setProperty("/SummaryFlag", false);
					oModel.setProperty("/WorcenterFlag", true);
					oModel.setProperty("/WorkCenterTitle", sSelectedtxt);
					that._fnApplyFilter(sSelectedtxt);

				}
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onSummaryIconTabBarSelect function");
				this.handleException(e);
			}
		},

		onWoorkCenTblUpdateFinished: function(sValue, oEvent) {
			try {
				var oLenght = oEvent.getSource().getItems().length,
					oModel = this.getView().getModel("LocalModel");
				switch (sValue) {
					case "FR":
						oModel.setProperty("/FlyReqCount", oLenght);
						break;
					case "SM":
						oModel.setProperty("/SortieCount", oLenght);
						break;
					case "DS":
						oModel.setProperty("/SparesCount", oLenght);
						break;
					case "TM":
						oModel.setProperty("/TMDECount", oLenght);
						break;
					case "TOU":
						oModel.setProperty("/OutstandingCount", oLenght);
						oModel.setProperty("/TaskCount", oModel.getProperty("/OutstandingCount") + oModel.getProperty("/PendingSupCount") + oModel.getProperty(
							"/CompleteCount"));
						break;
					case "TPS":
						oModel.setProperty("/PendingSupCount", oLenght);
						oModel.setProperty("/TaskCount", oModel.getProperty("/OutstandingCount") + oModel.getProperty("/PendingSupCount") + oModel.getProperty(
							"/CompleteCount"));
						break;
					case "TCM":
						oModel.setProperty("/CompleteCount", oLenght);
						oModel.setProperty("/TaskCount", oModel.getProperty("/OutstandingCount") + oModel.getProperty("/PendingSupCount") + oModel.getProperty(
							"/CompleteCount"));
						break;

				}
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onWoorkCenTblUpdateFinished function");
				this.handleException(e);
			}
		},

		onWorkCenterSelect: function(oEvent) {
			try {
				var oTitle = oEvent.getSource().getTitle(),
					oIconTabBar = this.getView().byId("itbDefectSummary"),
					oModel = this.getModel("CreateJobLocalModel").getData();
				for (var i = 0; i < oModel.DefectWorkCentersTiles.length; i++) {
					if (oModel.DefectWorkCentersTiles[i].WorkCenterText === oTitle) {
						oIconTabBar.setSelectedKey(oModel.DefectWorkCentersTiles[i].Key);
						this.onSummaryIconTabBarSelect(oTitle);
					}
				}
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onWorkCenterSelect function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//   4. Private Function   
		// ***************************************************************************
		//	4.1 First level Private functions
		_handleRouteMatched: function(oEvent) {
			try {
				var that = this,
					sTailId, sESJobId, sSqnId,
					sModId,
					sAirId, oViewModel = that.getView().getModel("LocalModel");

				sESJobId = oEvent.getParameters("").arguments.ESJOBID;
				sTailId = that.getTailId();
				sAirId = that.getAircraftId();
				sSqnId = that.getSqunId();
				sModId = that.getModelId();
				var oSummaryModel = dataUtil.createNewJsonModel();
				that.getView().setModel(oSummaryModel, "SummaryModel");
				var oLocalModel = dataUtil.createNewJsonModel();
				oLocalModel.setData({
					TaksFlag: true,
					SparesFlag: false,
					TMDEFlag: false,
					FlyingRequirementsFlag: false,
					SortieMonitoringFlag: false,
					SummaryFlag: true,
					WorcenterFlag: false,
					WorkCenterTitle: "",
					TaskCount: 0,
					SparesCount: 0,
					TMDECount: 0,
					FlyReqCount: 0,
					SortieCount: 0,
					OutstandingCount: 0,
					PendingSupCount: 0,
					CompleteCount: 0,
					WorkCenterKey: "Summary",
					ESJobId: sESJobId,
					CreateTaskMenu: [{
						"Text": "New Task",
						"Visible": true
					}, {
						"Text": "Apply Template",
						"Visible": true
					}],
					SpareMenu: [{
						"Text": "Edit",
						"Visible": true
					}, {
						"Text": "Delete Request",
						"Visible": true
					}],
					WorkCenterActionMenu: [{
						"Text": "Set as Prime",
						"Visible": true
					}, {
						"Text": "Switch Work Center",
						"Visible": true
					}, {
						"Text": "Delete Work Center",
						"Visible": true
					}],
					WorkCenter: [{
						jobid: "",
						tailid: "",
						wrctr: "ZSummary",
						isprime: "",
						wrctrtx: "Summary"
					}]
				});
				this.getView().setModel(oLocalModel, "LocalModel");
				that._fnSumamryDetailsGet(sESJobId);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:_handleRouteMatched function");
				this.handleException(e);
			}
		},

		_fnUtilizationGet: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					sAirId = this.getAircraftId(),
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + sAirId + " and ddid eq UTIL1_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "UtilizationCBModel");
				}.bind(this);

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:_fnUtilizationGet function");
				this.handleException(e);
			}
		},

		_fnSumamryDetailsGet: function(sESJobId) {
			try {
				var that = this,
					oModel, oModelLocal,
					oPrmSummary = {};
				oModelLocal = that.getView().getModel("LocalModel").getData();

				oPrmSummary.filter = "ESJOBID eq " + sESJobId + " and tailid eq " + that.getTailId() + " and FLAG eq ES";

				oPrmSummary.error = function() {};
				oPrmSummary.success = function(oData) {
					if (oData.results.length !== 0) {
						oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results[0]);

						oModelLocal.WorkCenter.push({
							jobid: "",
							tailid: "",
							wrctr: oData.results[0].PRIME,
							isprime: "true",
							wrctrtx: oData.results[0].WRCTR
						});
						that.getView().getModel("LocalModel").updateBindings(true);

						that.setModel(oModel, "SummaryModel");
					}

				}.bind(this);

				ajaxutil.fnRead("/GetSerLogSvc", oPrmSummary);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:_fnSumamryDetailsGet function");
				this.handleException(e);
			}
		},

		onRaiseScheduleConcessionPress: function() {
			try {
				var that = this,
					oPayload, oModel = this.getView().getModel("RSModel").getData(),
					oPrmSchJob = {};
				oPayload = this.getView().getModel("SummaryModel").getData();
				//oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
				if (oModel.ExpDate !== "") {
					oPayload.SERVDT = oModel.ExpDate;
					oPayload.UM = "Date";
					oPayload.UMKEY = "JDU_10";
					oPayload.SERVDUE = null;
				} else {
					oPayload.SERVDT = null;
					oPayload.SERVDUE = (oModel.UtilVal).toString();
					oPayload.UMKEY = oModel.Util;
				}
				oPrmSchJob.error = function() {};
				oPrmSchJob.success = function(oData) {
					this.getRouter().navTo("F16Cosjobs");
				}.bind(this);
				oPrmSchJob.activity = 2;
				ajaxutil.fnUpdate("/GetSerLogSvc", oPrmSchJob, [oPayload], "ZRM_SCH_SJ", this);
			} catch (e) {
				Log.error("Exception in onRaiseScheduleConcessionPress function");
			}
		},

		onStartJobPress: function() {
			try {
				var that = this,
					oPayload,
					oPrmSchJob = {};
				oPayload = this.getView().getModel("SummaryModel").getData();
				oPayload.FLAG = "";
				oPrmSchJob.error = function() {};
				oPrmSchJob.success = function(oData) {
					this.getRouter().navTo("Cosjobs");
				}.bind(this);
				oPrmSchJob.activity = 1;
				ajaxutil.fnCreate("/GetSerLogSvc", oPrmSchJob, [oPayload], "ZRM_SCH_SJ", this);
			} catch (e) {
				Log.error("Exception in CosScheduleSummary:onStartJobPress function");
				this.handleException(e);
			}
		}

	});
});