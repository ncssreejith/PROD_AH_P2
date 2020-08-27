sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log",
	"sap/m/MessageBox"
], function(BaseController, dataUtil, formatter, ajaxutil, JSONModel, Log, MessageBox) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAHUL THORAT  
	 *   Control name: Job Summary          
	 *   Purpose : Show job summary
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onSignOffPress
	 *     2. Backend Calls
	 *        2.1 _fnMultiTradmanGet
	 *        2.2 onUndoSignOff
	 *        2.3 onSignOffTask
	 *        2.4 _fnTaskStatusGet
	 *        2.5 _fnTasksOutStandingGet
	 *        2.6 _fnTasksPendingSupGet
	 *        2.7 _fnTasksCompleteGet
	 *        2.8 _fnFlyingRequirementsGet
	 *        2.9 onFlyingRequirementUpdate
	 *        2.10 onFlyingRequirementDelete
	 *        2.11 _fnSortieMonitoringGet
	 *        2.12 onSortieMonitoringUpdate
	 *        2.13 onSortieMonitoringDelete
	 *        2.14 _fnMonitoredForGet
	 *        2.15 _fnJobDetailsGet
	 *        2.16 _fnWorkCenterGet
	 *        2.17 _fnPhotoUploadGet
	 *        2.18 _fnPhotoUploadCreate
	 *        2.19 _fnUpdateJob
	 *        2.20 _fnUpdateFAIRJob
	 *        2.21 _fnCreatedWorkCenterGet
	 *        2.22 _fnDefectWorkCenterCreate
	 *        2.23 _fnDefectWorkCenterDelete
	 *        2.24 _fnGetMark
	 *        2.25 _fnValidateWorkCenterRecord
	 *        2.26 _fnResetWorkCenterPrimeStatus
	 *        2.27 _fnGetWorkCenterPrimeStatus
	 *        2.28 _fnTableOutstandingFilter
	 *        2.29 _fnTableCompletedFilter
	 *        2.30 _fnTablePendingFilter
	 *        2.31 _fnApplyFilter
	 *     3. Private calls
	 *        3.1 onNavBackPrevious
	 *        3.2 onOpenQuickView
	 *        3.3 onCloseDialog
	 *        3.4 handleMenuItemPress
	 *        3.5 onAddNewWorkCenter
	 *        3.6 onCloseAddWorkCenterDialog
	 *        3.7 onCloseConfirmDialog
	 *        3.8 onEditFlyingRequirement
	 *        3.9 onFlyingRequirementClose
	 *        3.10 onEditSortieMonitoring
	 *        3.11 onSortieMonitoringClose
	 *        3.12 onAddWorkcenterSubmitPress
	 *        3.13 onAEFMMenuPress
	 *        3.14 onWorkCenterChange
	 *        3.15 onCloseAEMFDialog
	 *        3.16 handlePressWorkCenterFragmentOpenMenu
	 *        3.17 onCloseWorkCenterMenu
	 *        3.18 getWorkcenterKey
	 *        3.19 handleWorkCenterMenuItemPress
	 *        3.20 onSummaryIconTabBarSelect
	 *        3.21 onAddFlyingRequirements
	 *        3.22 onCloseJobPress
	 *        3.23 onAddSortieMonitoring
	 *        3.24 onAddTMDE
	 *        3.25 onAddDemandSpares
	 *        3.26 onAddCreateTask
	 *        3.27 onWoorkCenTblUpdateFinished
	 *        3.28 onWorkCenterSelect
	 *        3.29 onAllOutStandingDetailsPress
	 *        3.30 onAllOutStandingDetailsClose
	 *        3.31 handleLiveChangeFlyingRequirements
	 *        3.32 onPendingSupDetailsPress
	 *        3.33 onPendingSupDetailsPress
	 *        3.34 onCloseTask
	 *        3.35 onAddDefectImage
	 *        3.36 onSelectionDefectAreaChange
	 *        3.37 _fnRenderImage
	 *        3.38 drawCoordinates
	 *        3.39 _fnTaskCount
	 *        3.40 _handleRouteMatched
	 *   Note *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.CosDefectsSummary", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var that = this;
				var oAppModel = dataUtil.createNewJsonModel();
				oAppModel.setData({
					"Top": [],
					"Front": [],
					"Left": [],
					"Right": [],
					"DefectImageSrc": [],
					"SelectedKey": "",
					"NatureofJobKey": "",
					"ScheduleJobDueKey": "",
					"visibleDefect": false,
					"ImageSrc": [],
					"DefectNameChar": ""
				});
				that.getView().setModel(oAppModel, "appModel");

				var oLocalModel = dataUtil.createNewJsonModel();
				oLocalModel.setData({
					sTailId: "",
					sAirId: "",
					sSqnId: "",
					sJobId: "",
					sModId: "",
					TaksFlag: true,
					SparesFlag: false,
					TMDEFlag: false,
					FlyingRequirementsFlag: false,
					SortieMonitoringFlag: false,
					SummaryFlag: true,
					WorcenterFlag: false,
					WorkCenterTitle: "Summary",
					WorkCenterKey: "Summary",
					TaskCount: 0,
					SparesCount: 0,
					TMDECount: 0,
					FlyReqCount: 0,
					SortieCount: 0,
					OutstandingCount: 0,
					PendingSupCount: 0,
					CompleteCount: 0,
					FairEditFlag: true,
					TableFlag: "",
					sFlag: "",
					JobStatus: false,
					DefectImageSrc: [],
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
					}]
				});
				that.getView().setModel(oLocalModel, "LocalModel");

				this.getRouter().getRoute("CosDefectsSummary").attachPatternMatched(this._handleRouteMatched, this);
				var sAirId = that.getAircraftId();
				that._fnWorkCenterGet(sAirId);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onInit function");
				this.handleException(e);
			}
		},

		onNavBackPrevious: function() {
			this.onNavBack();
		},

		onOpenQuickView: function(sFlag, oEvent) {
			try {
				var that = this;
				if (this._oQuickView) {
					this._oQuickView.destroy();
				}
				/*	that._oQuickView = sap.ui.xmlfragment(that.createId("ManageJob_Defect_Id"), "avmet.ah.fragments.ManageJobDefectMenu", this);*/
				that._oQuickView = sap.ui.xmlfragment("OpenViewId", "avmet.ah.fragments.ManageJobDefectMenu", this);
				that.getView().addDependent(that._oQuickView);
				var oSummaryModel = that.getView().getModel("SummaryModel");
				if (sFlag === 'DF') {
					if (oSummaryModel.getProperty("/FAIRStatusText") === 'ACTIVATED') {
						oSummaryModel.setProperty("/MenuVisible", false);
						oSummaryModel.setProperty("/MenuScheduleVisible", false);
						oSummaryModel.setProperty("/MenuActivateVisible", true);
						oSummaryModel.setProperty("/MenuWorkCenterVisible", false);
					} else {
						oSummaryModel.setProperty("/MenuVisible", true);
						oSummaryModel.setProperty("/MenuScheduleVisible", false);
						oSummaryModel.setProperty("/MenuActivateVisible", false);
						oSummaryModel.setProperty("/MenuWorkCenterVisible", false);
					}
				} else if (sFlag === 'WC') {
					oSummaryModel.setProperty("/MenuVisible", false);
					oSummaryModel.setProperty("/MenuScheduleVisible", false);
					oSummaryModel.setProperty("/MenuActivateVisible", false);
					oSummaryModel.setProperty("/MenuWorkCenterVisible", true);
				} else {
					oSummaryModel.setProperty("/MenuVisible", false);
					oSummaryModel.setProperty("/MenuScheduleVisible", true);
					oSummaryModel.setProperty("/MenuActivateVisible", false);
					oSummaryModel.setProperty("/MenuWorkCenterVisible", false);
				}
				that.getView().getModel("SummaryModel").updateBindings(true);
				var eDock = sap.ui.core.Popup.Dock;
				var oButton = oEvent.getSource();
				that._oQuickView.open(that._bKeyboard, oButton, eDock.BeginTop, eDock.BeginFront, oButton);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onOpenQuickView function");
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
				Log.error("Exception in CosDefectsSummary:onCloseDialog function");
				this.handleException(e);
			}
		},

		onImagePress: function(oEvent) {
			var that = this;
			var obj = oEvent.getSource().getBindingContext("PhotoModel").getObject();
			var aChilds = oEvent.getSource().getParent().getAggregation("items");
			for (var i in aChilds) {
				aChilds[i].removeStyleClass("photoSelection");
			}
			oEvent.getSource().addStyleClass("photoSelection");
			setTimeout(function demo() {
				that._fnRenderImage(obj.RAWBASE);
			}, 500);
			if (obj.FLAG === "POINT") {
				var aCord = that.getModel("PhotoModel").getProperty("/Coordinates");
				if (aCord) {
					that.drawCoordinates("", aCord);
				}
			} else {
				this.removeCoordinates();
			}
		},

		handleMenuItemPress: function(oEvent) {
			try {
				var that = this;
				var oSummaryModel = this.getView().getModel("SummaryModel"),
					oModel = this.getView().getModel("JobModel"),
					oLocalModel = this.getView().getModel("LocalModel");
				var dData = formatter.defaultOdataDateFormat(new Date());
				var tTime = new Date().getHours() + ":" + new Date().getMinutes();
				switch (oEvent.getParameter("item").getText()) {
					case "Edit Job":
						break;
					case "Edit Job Details":
						that.getRouter().navTo("CosCreateJob", {
							"JobId": oLocalModel.getProperty("/sJobId")
						});
						break;
					case "Job Enter in Error":
						if (oLocalModel.getProperty("/JobStatus")) {
							this.onCloseJobPress("Y");
						} else {
							MessageBox.error(
								"Please close all tasks of the job : " + oLocalModel.getProperty("/sJobId"), {
									icon: sap.m.MessageBox.Icon.Error,
									title: "Error",
									styleClass: "sapUiSizeCompact"
								});
						}
						break;
					case "Transfer Job to ADD/ Limitation":
						that.getRouter().navTo("RouteTransferToADD", {
							"JobId": oLocalModel.getProperty("/sJobId"),
							"FndBy": that.getView().getModel("JobModel").getProperty("/fndby"),
							"FndId": that.getView().getModel("JobModel").getProperty("/fndid"),
							"JobDesc": that.getView().getModel("JobModel").getProperty("/jobdesc")
						});
						break;
					case "View History Log":
						break;
					case "Work Center":
						break;
					case "Add Work Center":
						that.onAddNewWorkCenter();
						break;
					case "Manage Work Center":
						break;
					case "Add Related Job":
						var oTestModel = dataUtil.createNewJsonModel();
						oTestModel.setData({
							"Test": true
						});
						that.getOwnerComponent().setModel(oTestModel, "oTestModel");

						that.getRouter().navTo("CosCreateJob", {
							"JobId": oLocalModel.getProperty("/sJobId"),
							"RJobId": "Y"
						});
						break;
					case "Declare FAIR":
						oLocalModel.setProperty("/FairEditFlag", false);
						oLocalModel.setProperty("/JobStatus", false);
						oSummaryModel.setProperty("/FAIRStatusText", "ACTIVATED");
						oModel.setProperty("/fstat", "A");
						oModel.setProperty("/factby", null);
						oModel.setProperty("/factdtm", null);
						oModel.setProperty("/factuzt", null);
						oSummaryModel.setProperty("/FAIRStatus", "Error");
						oModel.updateBindings();
						that._fnUpdateFAIRJob();
						break;
					case "Undo FAIR":
						oLocalModel.setProperty("/FairEditFlag", true);
						oSummaryModel.setProperty("/FAIRStatusText", "");
						oModel.setProperty("/fstat", "U");
						oModel.setProperty("/factby", "Test User");
						oModel.setProperty("/factdtm", dData);
						oModel.setProperty("/factuzt", tTime);
						that._fnTaskStatusGet();
						oSummaryModel.setProperty("/FAIRStatus", "None");
						oSummaryModel.setProperty("/MenuVisible", true);
						oSummaryModel.setProperty("/MenuActivateVisible", false);
						oModel.updateBindings(true);
						that._fnUpdateFAIRJob();
						break;
					case "Release for Rectification":
						oLocalModel.setProperty("/FairEditFlag", true);
						oSummaryModel.setProperty("/FAIRStatusText", "Release for Rectifications");
						oSummaryModel.setProperty("/FAIRReleasedby", "Test User");
						oSummaryModel.setProperty("/FAIRStatus", "None");
						oSummaryModel.setProperty("/MenuVisible", true);
						oSummaryModel.setProperty("/MenuActivateVisible", false);
						oModel.setProperty("/fstat", "R");
						oModel.setProperty("/frelby", "Test User");
						oModel.setProperty("/rectdt", dData);
						oModel.setProperty("/recttm", tTime);
						oModel.updateBindings(true);
						that._fnUpdateJob(oLocalModel.getProperty("/sJobId"));
						var oModelData = [];
						oModelData.push({
							"PastAdd": "1",
							"PastAddDate": formatter.defaultDateFormat(new Date())
						});
						dataUtil.setDataSet("TransferJobModel", oModelData[0]);
						break;
					case "Raise Extension":
						break;
				}
				that.getView().getModel("SummaryModel").updateBindings(true);
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:handleMenuItemPress function");
				this.handleException(e);
			}

		},

		onAddNewWorkCenter: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("WorkCenterSet");
				if (!that._oAddWorkCenter) {
					that._oAddWorkCenter = sap.ui.xmlfragment(that.createId("idWorkCenterDialog"),
						"avmet.ah.fragments.AddWorkCenterDialog",
						this);
					that.getView().addDependent(that._oAddWorkCenter);
				}
				that._oAddWorkCenter.setModel(oModel, "WorkCenterSet");
				that._oAddWorkCenter.open(that);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAddNewWorkCenter function");
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
				Log.error("Exception in CosDefectsSummary:onCloseAddWorkCenterDialog function");
				this.handleException(e);
			}
		},
		onCloseConfirmDialog: function() {
			try {
				var that = this;
				that.getFragmentControl("idWorkCenterDialog", "addWCId").setVisible(true);
				that.getFragmentControl("idWorkCenterDialog", "confirmWCId").setVisible(false);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onCloseConfirmDialog function");
				this.handleException(e);
			}
		},

		onEditFlyingRequirement: function(oObj) {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel();
				if (!that._oEditFL) {
					that._oEditFL = sap.ui.xmlfragment(that.createId("idEditFLDialog"),
						"avmet.ah.fragments.EditFlyingRequirementDialog",
						this);
					oModel.setData(oObj);
					that._oEditFL.setModel(oModel, "FLYSet");
					that.getView().addDependent(that._oEditFL);
					that._oEditFL.open(that);
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onEditFlyingRequirement function");
				this.handleException(e);
			}
		},
		onFlyingRequirementClose: function() {
			try {
				var oTable = this.getView().byId("tbWcFlyingReqId");
				oTable.removeSelections(true);
				if (this._oEditFL) {
					this._oEditFL.close(this);
					this._oEditFL.destroy();
					delete this._oEditFL;
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onFlyingRequirementClose function");
				this.handleException(e);
			}
		},

		onEditSortieMonitoring: function(oObj) {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel();
				if (!that._oEditSORT) {
					that._oEditSORT = sap.ui.xmlfragment(that.createId("idEditFLDialog"),
						"avmet.ah.fragments.EditSortiMonitoringDialog",
						this);
					oModel.setData(oObj);
					that._fnMonitoredForGet();
					that._oEditSORT.setModel(oModel, "SORTSet");
					that.getView().addDependent(that._oEditSORT);
					that._oEditSORT.open(that);
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onEditSortieMonitoring function");
				this.handleException(e);
			}
		},
		onSortieMonitoringClose: function() {
			try {
				var oTable = this.getView().byId("tbWcSortieMonId");
				oTable.removeSelections(true);
				if (this._oEditSORT) {
					this._oEditSORT.close(this);
					this._oEditSORT.destroy();
					delete this._oEditSORT;
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onSortieMonitoringClose function");
				this.handleException(e);
			}
		},

		onAddWorkcenterSubmitPress: function(sValue) {
			try {
				var that = this,
					sSelectedKey,
					oComboBoxInstance = that.getFragmentControl("idWorkCenterDialog", "ComboWCId"),
					oValidateWC,
					sSelectedText, sSelectedItem,
					sState;
				sState = that.getFragmentControl("idWorkCenterDialog", "switchId").getState();
				sSelectedItem = oComboBoxInstance.getSelectedItem();
				sSelectedText = sSelectedItem.getText();
				sSelectedKey = sSelectedItem.getKey();
				oValidateWC = that._fnValidateWorkCenterRecord(sSelectedKey);
				if (oValidateWC) {
					if (sState) {
						if (sValue !== "CON") {
							that.getFragmentControl("idWorkCenterDialog", "addWCId").setVisible(false);
							that.getFragmentControl("idWorkCenterDialog", "workCenterId").setText(sSelectedText);
							that.getFragmentControl("idWorkCenterDialog", "confirmWCId").setVisible(true);

						} else {
							//that._fnupdateWorkCenterJson(sSelectedText, sState);
							that.getView().getModel("JobModel").setProperty("/prime", sSelectedKey);
							that._fnDefectWorkCenterCreate(sSelectedKey, sState);
							//that._fnUpdateJob();

						}
					} else {
						that._fnDefectWorkCenterCreate(sSelectedKey, sState);

						//that._fnupdateWorkCenterJson(sSelectedText, sState);
					}
				} else {

					oComboBoxInstance.setValueState("Error");
					oComboBoxInstance.setValueStateText("Work Center already added");
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAddWorkcenterSubmitPress function");
				this.handleException(e);
			}
		},

		onAEFMMenuPress: function(oValue) {

			try {
				var that = this;
				var oLocalModel = that.getView().getModel("LocalModel");
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

				that.getView().getModel("LocalModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAEFMMenuPress function");
				this.handleException(e);
			}
		},

		onWorkCenterChange: function(oEvent) {
			try {
				this.getFragmentControl("idWorkCenterDialog", "ComboWCId").setSelectedKey(oEvent.getSource().getSelectedKey());
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onWorkCenterChange function");
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
				Log.error("Exception in CosDefectsSummary:onCloseAEMFDialog function");
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
				if (!that._oWCMenuFrag) {
					that._oWCMenuFrag = sap.ui.xmlfragment("WorkMenuId",
						"avmet.ah.fragments.WorkCenterFragmentMenu",
						that);
					that.getView().addDependent(that._oWCMenuFrag);
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
						oEvent.getSource().getParent().setSelected(true);
						oModel.setProperty("/TableFlag", sText);
						oDialogModel.setData(oModel.getData().SpareMenu);
					case "SPR":
					case "FLR":
						oModel.setProperty("/TableFlag", sText);
						oEvent.getSource().getParent().setSelected(true);
						oDialogModel.setData(oModel.getData().SpareMenu);
						break;

				}
				that._oWCMenuFrag.setModel(oDialogModel, "DialogModel");
				eDock = sap.ui.core.Popup.Dock;
				oButton = oEvent.getSource();
				that._oWCMenuFrag.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginFront, oButton);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:handlePressWorkCenterFragmentOpenMenu function");
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
				Log.error("Exception in CosDefectsSummary:onCloseWorkCenterMenu function");
				this.handleException(e);
			}
		},

		getWorkcenterKey: function(sWCText) {
			try {
				var oModel = this.getView().getModel("CreatedWorkCenterModel");

				for (var i = 0; i < oModel.getData().length; i++) {
					if (oModel[i].name === sWCText) {
						return oModel[i].wrctr;
					}
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:getWorkcenterKey function");
				this.handleException(e);
			}
		},

		handleWorkCenterMenuItemPress: function(oEvent) {
			try {
				var that = this,
					oObj,
					sKey, oTable,
					oModel = that.getView().getModel("LocalModel"),
					oSelectedItem;
				oSelectedItem = oEvent.getParameter("item").getText();
				switch (oSelectedItem) {
					case "Set as Prime":
						sKey = oModel.getProperty("/WorkCenterKey");
						that.getView().getModel("JobModel").setProperty("/prime", sKey);
						that._fnUpdateJob();
						break;
					case "Switch Work Center":
						break;
					case "Delete Work Center":
						/*that._fnRemoveWorkCenter(oModel.getProperty("/WorkCenterTitle"));*/
						sKey = oModel.getProperty("/WorkCenterKey");
						this._fnDefectWorkCenterDelete(sKey);
						oModel.setProperty("/SummaryFlag", true);
						oModel.setProperty("/WorcenterFlag", false);
						break;
					case "New Task":
						this.onAddCreateTask();
						break;
					case "Apply Template":
						this.getRouter().navTo("CosApplyTemplate", {
							"airid": oModel.getProperty("/sAirId"),
							"tailid": oModel.getProperty("/sTailId"),
							"jobid": oModel.getProperty("/sJobId"),
							"wc": oModel.getProperty("/WorkCenterKey")
						});
						break;
					case "Edit":
						if (oModel.getProperty("/TableFlag") === "SMT") {
							oTable = that.getView().byId("tbWcSortieMonId").getSelectedItem();
							oObj = oTable.getBindingContext("SRMModel").getObject();
							that.onEditSortieMonitoring(oObj);
						} else {
							oTable = that.getView().byId("tbWcFlyingReqId").getSelectedItem();
							oObj = oTable.getBindingContext("FRModel").getObject();
							that.onEditFlyingRequirement(oObj);
						}
						break;
					case "Delete Request":
						if (oModel.getProperty("/TableFlag") === "SMT") {
							oTable = that.getView().byId("tbWcSortieMonId").getSelectedItem();
							oObj = oTable.getBindingContext("SRMModel").getObject();
							that.onSortieMonitoringDelete(oObj);
						} else {
							oTable = that.getView().byId("tbWcFlyingReqId").getSelectedItem();
							oObj = oTable.getBindingContext("FRModel").getObject();
							that.onFlyingRequirementDelete(oObj);
						}
						break;
				}
				oModel.updateBindings(true);
				that.onCloseWorkCenterMenu();
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:handleWorkCenterMenuItemPress function");
				this.handleException(e);
			}
		},

		onSummaryIconTabBarSelect: function(oEvent) {
			try {
				var that = this,
					sJobId, sWrctr,
					sSelectedtxt, sSelectedKey,
					oModel;
				try {
					sSelectedKey = oEvent.getParameter("selectedItem").getKey();
					sSelectedtxt = oEvent.getParameter("selectedItem").getText();
				} catch (e) {
					sSelectedKey = oEvent;
				}

				oModel = that.getView().getModel("LocalModel");
				sJobId = oModel.getProperty("/sJobId");
				if (sSelectedKey === "Summary") {
					oModel.setProperty("/SummaryFlag", true);
					oModel.setProperty("/WorcenterFlag", false);
					that._fnTaskStatusGet(sJobId);
				} else {
					oModel.setProperty("/SummaryFlag", false);
					oModel.setProperty("/WorcenterFlag", true);
					oModel.setProperty("/WorkCenterTitle", sSelectedtxt);
					oModel.setProperty("/WorkCenterKey", sSelectedKey);
					that._fnTasksOutStandingGet(sJobId, sSelectedKey);
					that._fnTasksPendingSupGet(sJobId, sSelectedKey);
					that._fnTasksCompleteGet(sJobId, sSelectedKey);
					that._fnFlyingRequirementsGet(sJobId, sSelectedKey);
					that._fnSortieMonitoringGet(sJobId, sSelectedKey);
				}
				that._fnCreatedWorkCenterGet(sJobId);
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onSummaryIconTabBarSelect function");
				this.handleException(e);
			}
		},

		onAddFlyingRequirements: function() {
			try {
				var oModel = this.getView().getModel("LocalModel");
				this.getRouter().navTo("CosAddFlyingRequirements", {
					"JobId": oModel.getProperty("/sJobId"),
					"AirId": oModel.getProperty("/sAirId"),
					"TailId": oModel.getProperty("/sTailId"),
					"WorkCenter": oModel.getProperty("/WorkCenterTitle"),
					"WorkKey": oModel.getProperty("/WorkCenterKey"),
					"Flag": "Y"
				});
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAddFlyingRequirements function");
				this.handleException(e);
			}
		},

		onCloseJobPress: function(oFlag) {
			try {
				var that = this,
					oModel = this.getView().getModel("LocalModel"),
					oJobModel = this.getView().getModel("JobModel");
				if (oJobModel.getProperty("/prime") !== "") {
					that.getRouter().navTo("CosCloseJob", {
						"JobId": oModel.getProperty("/sJobId"),
						"Flag": oFlag
					});
				} else {
					MessageBox.error(
						"Please add workcenter to close job : " + oModel.getProperty("/sJobId"), {
							icon: sap.m.MessageBox.Icon.Error,
							title: "Error",
							styleClass: "sapUiSizeCompact"
						});
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onCloseJobPress function");
				this.handleException(e);
			}
		},

		onAddSortieMonitoring: function() {
			try {
				var that = this;
				var oModel = that.getView().getModel("LocalModel");
				this.getRouter().navTo("CosAddSoritieMonitoring", {
					"JobId": oModel.getProperty("/sJobId"),
					"TailId": oModel.getProperty("/sTailId"),
					"AirId": oModel.getProperty("/sAirId"),
					"WorkCenter": oModel.getProperty("/WorkCenterTitle"),
					"WorkKey": oModel.getProperty("/WorkCenterKey")
				});
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAddSortieMonitoring function");
				this.handleException(e);
			}
		},
		onAddTMDE: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("LocalModel");
				that.getRouter().navTo("CosAddTMDE", {
					"jobId": this.getView().byId("txtJobID").getText(),
					"WorkCenter": oModel.getProperty("/WorkCenterTitle"),
					"WorkKey": oModel.getProperty("/WorkCenterKey")
				});
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAddTMDE function");
				this.handleException(e);
			}
		},

		onAddDemandSpares: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("LocalModel");
				that.getRouter().navTo("CosAddDemandSpares", {
					"jobId": this.getView().byId("txtJobID").getText(),
					"WorkCenter": oModel.getProperty("/WorkCenterTitle"),
					"WorkKey": oModel.getProperty("/WorkCenterKey")
				});
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAddDemandSpares function");
				this.handleException(e);
			}
		},

		onAddCreateTask: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("LocalModel");
				that.getRouter().navTo("RouteCreateTask", {
					"JobId": oModel.getProperty("/sJobId"),
					"AirId": oModel.getProperty("/sAirId"),
					"TailId": oModel.getProperty("/sTailId"),
					"WorkCenter": oModel.getProperty("/WorkCenterTitle"),
					"WorkKey": oModel.getProperty("/WorkCenterKey"),
					"Flag": "NA",
					"srvid": "NA"
				});
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAddCreateTask function");
				this.handleException(e);
			}
		},

		onWoorkCenTblUpdateFinished: function(sValue, oEvent) {
			try {
				var that = this,
					oLenght = oEvent.getSource().getItems().length,
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
						that._fnTableOutstandingFilter();
						oModel.setProperty("/OutstandingCount", oLenght);
						oModel.setProperty("/TaskCount", oModel.getProperty("/OutstandingCount") + oModel.getProperty("/PendingSupCount") + oModel.getProperty(
							"/CompleteCount"));
						break;
					case "TPS":
						that._fnTablePendingFilter();
						oModel.setProperty("/PendingSupCount", oLenght);
						oModel.setProperty("/TaskCount", oModel.getProperty("/OutstandingCount") + oModel.getProperty("/PendingSupCount") + oModel.getProperty(
							"/CompleteCount"));

						break;
					case "TCM":
						that._fnTableCompletedFilter();
						oModel.setProperty("/CompleteCount", oLenght);
						oModel.setProperty("/TaskCount", oModel.getProperty("/OutstandingCount") + oModel.getProperty("/PendingSupCount") + oModel.getProperty(
							"/CompleteCount"));
						break;

				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onWoorkCenTblUpdateFinished function");
				this.handleException(e);
			}
		},

		onWorkCenterSelect: function(oEvent) {
			try {
				var that = this,
					oTitle = oEvent.getSource().getTitle(),
					oKey = oEvent.getSource().getBindingContext("CreatedWorkCenterModel").getObject("wrctr"),
					oIconTabBar = that.getView().byId("itbDefectSummary"),
					oModel = that.getView().getModel("CreatedWorkCenterModel").getData();
				for (var i = 0; i < oModel.length; i++) {
					if (oModel[i].wrctrtx === oTitle) {
						oIconTabBar.setSelectedKey(oKey);
						that.onSummaryIconTabBarSelect(oKey);
					}
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onWorkCenterSelect function");
				this.handleException(e);
			}
		},

		onAllOutStandingDetailsPress: function(oEvent) {
			try {
				var that = this,
					oObj = oEvent.getSource().getBindingContext("TaskOutModel").getObject(),
					oModel = dataUtil.createNewJsonModel(),
					oTable = that.getView().byId("tbWcOutstandingId");
				oEvent.getSource().setSelected(true);
				oModel.setData(oObj);
				if (!that._oOSDetails) {
					that._oOSDetails = sap.ui.xmlfragment("OSTId",
						"avmet.ah.fragments.TaskDetails",
						that);
					that._oOSDetails.setModel(oModel, "DetailsOutModel");
					that.getView().addDependent(that._oOSDetails);
				}
				that._oOSDetails.open(that);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAllOutStandingDetailsPress function");
				this.handleException(e);
			}
		},

		onAllOutStandingDetailsClose: function() {
			try {
				if (this._oOSDetails) {
					var oTable = this.getView().byId("tbWcOutstandingId");
					oTable.removeSelections(true);
					this._oOSDetails.close(this);
					this._oOSDetails.destroy();
					delete this._oOSDetails;
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAllOutStandingDetailsClose function");
				this.handleException(e);
			}
		},
		//showing the message text and validation of maxlength
		handleLiveChangeFlyingRequirements: function(oEvent) {
			try {
				var oSource = oEvent.getSource(),
					sValue = oSource.getValue(),
					iMaxLen = oSource.getMaxLength(),
					iLen = sValue.length;
				if (iLen && iMaxLen && iLen > iMaxLen) {
					sValue = sValue.substring(0, iMaxLen);
					oSource.setValue(sValue);
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:handleLiveChangeFlyingRequirements function");
				this.handleException(e);
			}
		},

		_fnMultiTradmanGet: function(sTaskId) {
			try {
				var that = this,
					oPrmTD = {};
				oPrmTD.filter = "TASKID eq " + sTaskId;
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TUserModel");
				}.bind(this);
				ajaxutil.fnRead("/CreTuserSvc", oPrmTD);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnMultiTradmanGet function");
				this.handleException(e);
			}
		},

		onPendingSupDetailsPress: function(oEvent) {
			try {
				var that = this,
					oObj = oEvent.getSource().getBindingContext("TaskPendingModel").getObject(),
					oModel = dataUtil.createNewJsonModel(),
					oTable = that.getView().byId("tbWcPendingSuperId");
				if (oObj.multi !== null) {
					this._fnMultiTradmanGet(oObj.taskid);
				}
				oEvent.getSource().setSelected(true);
				oModel.setData(oObj);
				if (!that._oOSDetails) {
					that._oOSDetails = sap.ui.xmlfragment("OSTId",
						"avmet.ah.fragments.SupervisorTaskDetails",
						that);
					that._oOSDetails.setModel(oModel, "DetailsSupModel");
					that.getView().addDependent(that._oOSDetails);
				}
				that._oOSDetails.open(that);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onPendingSupDetailsPress function");
				this.handleException(e);
			}
		},
		onPendingSupDetailsClose: function() {
			try {
				if (this._oOSDetails) {
					var oTable = this.getView().byId("tbWcPendingSuperId");
					oTable.removeSelections(true);
					this._oOSDetails.close(this);
					this._oOSDetails.destroy();
					delete this._oOSDetails;
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onPendingSupDetailsClose function");
				this.handleException(e);
			}
		},

		onCloseTask: function() {
			try {
				var that = this,
					oModel = that.getView().getModel("LocalModel"),
					bFlag, oTable, oTaskId = [];
				oTable = that.getView().byId("tbWcOutstandingId");
				if (oTable.getSelectedItems().length !== 0) {
					for (var i = 0; i < oTable.getSelectedItems().length; i++) {
						oTaskId.push(oTable.getSelectedItems()[i].getBindingContext("TaskOutModel").getObject("taskid"));
					}
					if (oTable.getSelectedItems().length === 1) {
						bFlag = "N";
					} else {
						bFlag = "Y";
					}
					that.getRouter().navTo("CosCloseTask", {
						"JobId": oModel.getProperty("/sJobId"),
						"TaskId": JSON.stringify(oTaskId),
						"AirId": oModel.getProperty("/sAirId"),
						"TailId": oModel.getProperty("/sTailId"),
						"WorkCenter": oModel.getProperty("/WorkCenterTitle"),
						"WorkKey": oModel.getProperty("/WorkCenterKey"),
						"MultiFLag": bFlag
					});
				} else {
					MessageBox.error(
						"Please select task to close.", {
							icon: sap.m.MessageBox.Icon.Error,
							title: "Success",
							styleClass: "sapUiSizeCompact"
						});
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onCloseTask function");
				this.handleException(e);
			}
		},

		onUndoSignOff: function(oEvent) {
			try {
				var that = this,
					oPrmTask = {},
					oPayload = [],
					oViewModel = that.getView().getModel("LocalModel"),
					oTable = that.getView().byId("tbWcPendingSuperId");
				if (oTable.getSelectedItems().length !== 0) {
					for (var i = 0; i < oTable.getSelectedItems().length; i++) {
						oPayload.push(oTable.getSelectedItems()[i].getBindingContext("TaskPendingModel").getObject());
						oPayload[i].tstat = "C";

					}

					oPrmTask.filter = "";
					oPrmTask.error = function() {

					};
					oPrmTask.success = function(oData) {
						that._fnTasksCompleteGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						that._fnTasksPendingSupGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						that.onPendingSupDetailsClose();
					}.bind(this);
					oPrmTask.activity = 4;
					ajaxutil.fnUpdate("/TaskSvc", oPrmTask, oPayload, "ZRM_COS_TS", this);
				} else {
					MessageBox.error(
						"Please select task for Sign-off.", {
							icon: sap.m.MessageBox.Icon.Error,
							title: "Success",
							styleClass: "sapUiSizeCompact"
						});
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onUndoSignOff function");
				this.handleException(e);
			}
		},

		onSignOffTask: function() {
			try {
				var that = this,
					oPrmTask = {},
					oPayload = [],
					oViewModel = that.getView().getModel("LocalModel"),
					oTable = that.getView().byId("tbWcPendingSuperId");
				if (oTable.getSelectedItems().length !== 0) {
					for (var i = 0; i < oTable.getSelectedItems().length; i++) {
						oPayload.push(oTable.getSelectedItems()[i].getBindingContext("TaskPendingModel").getObject());
					}
					oPrmTask.filter = "";
					oPrmTask.error = function(oData) {};
					oPrmTask.success = function(oData) {
						that.onPendingSupDetailsClose();
						that._fnTasksCompleteGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						that._fnTasksPendingSupGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
					}.bind(this);
					oPrmTask.activity = 4;
					ajaxutil.fnUpdate("/TaskSvc", oPrmTask, oPayload, "ZRM_COS_TS", this);
				} else {
					MessageBox.error(
						"Please select task for Sign-off.", {
							icon: sap.m.MessageBox.Icon.Error,
							title: "Success",
							styleClass: "sapUiSizeCompact"
						});
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onSignOffTask function");
				this.handleException(e);
			}
		},

		/* Function: onAddDefectImage
		 * Parameter: oEvt
		 * Description: To show upoaded photo of defect on screen.
		 */

		onAddDefectImage: function(oEvt) {
			try {
				var oFiles = oEvt.getParameter("files"),
					oParameter = {},
					that = this,
					oModel = that.getView().getModel("JobModel"),
					sDefectImageSrc;
				var oAppModel = that.getView().getModel("LocalModel");
				sDefectImageSrc = oAppModel.getProperty("/DefectImageSrc");
				oModel.setProperty("/photo", 1);

				if (oFiles && oFiles[0]) {

					var reader = new FileReader();
					reader.onload = function(e) {
						that.byId("iImageTicket").setSrc(e.target.result);
						sDefectImageSrc.push({
							"jobid": "",
							"tailid": oAppModel.getProperty("/sTailId"),
							"photono": (parseInt(sDefectImageSrc.length) + 1).toString(),
							"fname": oFiles[0].name,
							"raw": e.target.result
						});
					}.bind(that);

					reader.readAsDataURL(oFiles[0]); // convert to base64 string
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAddDefectImage function");
				this.handleException(e);
			}
		},

		/* Function: onSelectionDefectAreaChange
		 * Parameter: sKey
		 * Description: To select Defected area image.
		 */
		onSelectionDefectAreaChange: function(sKey) {
			try {
				var oSegmentedButton, oSelectedItemId, that = this,
					sRootPath, sImagePath, oCanvas,

					sRootPath = jQuery.sap.getModulePath("avmet.ah");
				switch (sKey) {
					case "DEA_T":
						sImagePath = sRootPath + "/css/img/AH/AH-Top.png";
						this.getView().byId("CanvasId").setVisible(true);
						break;
					case "DEA_F":
						sImagePath = sRootPath + "/css/img/AH/AH-Front.png";
						this.getView().byId("CanvasId").setVisible(true);
						break;
					case "DEA_l":
						sImagePath = sRootPath + "/css/img/AH/AH-Left.png";
						this.getView().byId("CanvasId").setVisible(true);
						break;
					case "DEA_R":
						sImagePath = sRootPath + "/css/img/AH/AH-Right.png";
						this.getView().byId("CanvasId").setVisible(true);
						break;
				}
				var obj = {
					"RAWBASE": sImagePath,
					"FLAG": "POINT"
				};
				this.getModel("PhotoModel").setProperty("/photoSet", [obj]);
				setTimeout(function demo() {
					that._fnRenderImage(sImagePath);
				}, 500);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onSelectionDefectAreaChange function");
				this.handleException(e);
			}
		},

		/* Function: _fnRenderImage
		 * Parameter: sImagePath, sSelectedKey, oCanvas
		 * Description: To render images in to canvas on segment button selections.
		 */

		_fnRenderImage: function(sImagePath) {
			try {
				var that = this,
					oCanvas;
				oCanvas = document.getElementById("myCanvasTop");
				var ctx = oCanvas.getContext("2d");
				oCanvas.style.backgroundImage = "url('" + sImagePath + "')";
				oCanvas.style.backgroundRepeat = "no-repeat";
				oCanvas.style.backgroundSize = "100%";
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnRenderImage function");
				this.handleException(e);
			}
		},

		/* Function: drawCoordinates
		 * Parameter: x, y, oCanvas
		 * Description: To draw coordinates on canvas image.
		 */

		drawCoordinates: function(sDaid, oArray) {
			try {
				var oCanvas = document.getElementById("myCanvasTop");
				var ctx = oCanvas.getContext("2d");
				var grd = ctx.createLinearGradient(0, 0, 170, 0);
				grd.addColorStop(1, "red");
				ctx.fillStyle = "red"; // Red color
				ctx.strokeStyle = "black";
				ctx.font = "15px Arial";
				ctx.beginPath();
				ctx.arc(Number(oArray.xaxis), Number(oArray.yaxis), 10, 0, 2 * Math.PI);
				ctx.fill();
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:drawCoordinates function");
				this.handleException(e);
			}
		},

		_fnTaskCount: function() {
			try {
				var oModel = this.getView().getModel("LocalModel"),
					otbComplete = oModel.getProperty("/CompleteCount"),
					otbOutStanding = oModel.getProperty("/OutstandingCount"),
					otbPendingApprovale = oModel.getProperty("/PendingSupCount");

				oModel.setProperty("/TaskCount", otbOutStanding + otbComplete + otbPendingApprovale);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTaskCount function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//   4. Private Function   
		// ***************************************************************************
		//	4.1 First level Private functions
		_handleRouteMatched: function(oEvent) {
			try {

				var that = this;
				var sTailId, sJobId, sSqnId, sFlag, oSummaryModelData,
					sModId, oGBAppModel = this.getView().getModel("avmetModel"),
					sAirId, oViewModel = that.getView().getModel("LocalModel");
				var oSummaryModel = dataUtil.createNewJsonModel();
				that.getView().setModel(oSummaryModel, "SummaryModel");
				that.getView().setModel(new JSONModel({}), "PhotoModel");
				sJobId = oEvent.getParameters("").arguments.JobId;
				sFlag = oEvent.getParameters("").arguments.Flag;
				sTailId = that.getTailId();
				sAirId = that.getAircraftId();
				sSqnId = that.getSqunId();
				sModId = that.getModelId();
				var oCanvas = document.getElementById("myCanvasTop");
				if (oCanvas !== null) {
					var ctx = oCanvas.getContext('2d');
					ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
				}
				oViewModel.setProperty("/sTailId", sTailId);
				oViewModel.setProperty("/sAirId", sAirId);
				oViewModel.setProperty("/sSqnId", sSqnId);
				oViewModel.setProperty("/sJobId", sJobId);
				oViewModel.setProperty("/sFlag", sFlag);
				if (sFlag === "N") {
					oViewModel.setProperty("/FairEditFlag", false);
				} else {
					oViewModel.setProperty("/FairEditFlag", true);
				}
				oViewModel.setProperty("/sModId", sModId);
				oViewModel.setProperty("/WorkCenterKey", "Summary");
				oViewModel.setProperty("/SummaryFlag", true);
				oViewModel.setProperty("/WorcenterFlag", false);
				// oViewModel.setProperty("/FairEditFlag", true);
				oViewModel.updateBindings(true);
				that._fnJobDetailsGet(sJobId, sAirId);
				that._fnTaskStatusGet(sJobId);
				try {
					if (oGBAppModel.getProperty("/dash/astid") === "AST_FAIR") {
						oSummaryModelData = that.getView().getModel("SummaryModel");
						oSummaryModel.setProperty("/FAIRStatusText", 'ACTIVATED');
					}
				} catch (e) {
					Log.error("Exception in oGBAppModel FAIR STATUS function");
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_handleRouteMatched function");
				this.handleException(e);
			}
		},

		_fnTaskStatusGet: function(sJobId) {
			try {
				var that = this,
					oModel = this.getView().getModel("LocalModel"),
					oPrmTaskDue = {};
				oPrmTaskDue.filter = "JOBID eq " + sJobId;
				oPrmTaskDue.error = function() {

				};

				oPrmTaskDue.success = function(oData) {
					if (oData.results[0].COUNT !== "0") {
						oModel.setProperty("/JobStatus", false);
						oModel.updateBindings(true);
					} else {
						oModel.setProperty("/JobStatus", true);
						oModel.updateBindings(true);
					}
				}.bind(this);
				ajaxutil.fnRead("/GetJobTaskstatSvc", oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTaskStatusGet function");
				this.handleException(e);
			}
		},

		_fnTasksOutStandingGet: function(sJobId, sWrctr) {
			try {
				var that = this,
					oLocalModel = this.getView().getModel("LocalModel"),
					oPrmTask = {};
				oPrmTask.filter = "jobid eq " + sJobId + " and TSTAT eq C and WRCTR eq " + sWrctr;
				oPrmTask.error = function() {

				};

				oPrmTask.success = function(oData) {
					var oModel = new JSONModel({});
					oModel.setData(oData.results);
					oLocalModel.setProperty("/OutstandingCount", oData.results.length);
					that.getView().setModel(oModel, "TaskOutModel");
					this._fnTaskCount();
				}.bind(this);

				ajaxutil.fnRead("/TaskSvc", oPrmTask);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTasksOutStandingGet function");
				this.handleException(e);
			}
		},
		_fnTasksPendingSupGet: function(sJobId, sWrctr) {
			try {
				var that = this,
					oLocalModel = this.getView().getModel("LocalModel"),
					oPrmTask = {};
				oPrmTask.filter = "jobid eq " + sJobId + " and TSTAT eq P and WRCTR eq " + sWrctr;
				oPrmTask.error = function() {

				};

				oPrmTask.success = function(oData) {
					var oModel = new JSONModel({});
					oModel.setData(oData.results);
					oLocalModel.setProperty("/PendingSupCount", oData.results.length);
					that.getView().setModel(oModel, "TaskPendingModel");
					this._fnTaskCount();
				}.bind(this);

				ajaxutil.fnRead("/TaskSvc", oPrmTask);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTasksPendingSupGet function");
				this.handleException(e);
			}
		},
		_fnTasksCompleteGet: function(sJobId, sWrctr) {
			try {
				var that = this,
					oLocalModel = this.getView().getModel("LocalModel"),
					oPrmTask = {};
				oPrmTask.filter = "jobid eq " + sJobId + " and TSTAT eq X and WRCTR eq " + sWrctr;
				oPrmTask.error = function() {

				};

				oPrmTask.success = function(oData) {
					var oModel = new JSONModel({});
					oModel.setData(oData.results);
					oLocalModel.setProperty("/CompleteCount", oData.results.length);
					that.getView().setModel(oModel, "TaskCompleteModel");
				}.bind(this);

				ajaxutil.fnRead("/TaskSvc", oPrmTask);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTasksCompleteGet function");
				this.handleException(e);
			}
		},

		_fnFlyingRequirementsGet: function(sJobId, sWrctr) {
			try {
				var that = this,
					oPrmFR = {};
				oPrmFR.filter = "jobid eq " + sJobId + " and WRCTR eq " + sWrctr;
				oPrmFR.error = function() {

				};

				oPrmFR.success = function(oData) {
					var oModel = new JSONModel({});
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "FRModel");
					this._fnTaskCount();
				}.bind(this);

				ajaxutil.fnRead("/FlyingRequirementSvc", oPrmFR);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnFlyingRequirementsGet function");
				this.handleException(e);
			}
		},

		onFlyingRequirementUpdate: function(oEvent) {
			try {
				var that = this,
					sjobid = "",
					oModel,
					oPayload;
				var dDate = new Date();
				oModel = that.getView().getModel("LocalModel");
				var oParameter = {};
				oPayload = oEvent.getSource().getModel("FLYSet").getData();
				oParameter.error = function(response) {};
				oParameter.success = function(oData) {
					var oTable = this.getView().byId("tbWcFlyingReqId");
					oTable.removeSelections(true);
					that._fnFlyingRequirementsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/WorkCenterKey"));

					that.onFlyingRequirementClose();
				}.bind(this);
				oParameter.activity = 2;
				ajaxutil.fnUpdate("/FlyingRequirementSvc", oParameter, [oPayload], "ZRM_COS_JS", this);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onFlyingRequirementUpdate function");
				this.handleException(e);
			}
		},

		onFlyingRequirementDelete: function(oObj) {
			try {
				var that = this,
					oPrmFR = {},
					oModel = this.getView().getModel("LocalModel");
				oPrmFR.error = function() {};
				oPrmFR.success = function(oData) {
					var oTable = this.getView().byId("tbWcFlyingReqId");
					oTable.removeSelections(true);
					that._fnFlyingRequirementsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/WorkCenterKey"));
				}.bind(this);
				oPrmFR.activity = 7;
				ajaxutil.fnDelete("/FlyingRequirementSvc/" + oObj.JOBID + "/" + oObj.TAILID + "/" + oObj.FR_NO, oPrmFR, "ZRM_COS_JS", this);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onFlyingRequirementDelete function");
				this.handleException(e);
			}
		},

		_fnSortieMonitoringGet: function(sJobId, sWrctr) {
			try {
				var that = this,
					oPrmFR = {};
				oPrmFR.filter = "jobid eq " + sJobId + " and WRCTR eq " + sWrctr;
				oPrmFR.error = function() {};

				oPrmFR.success = function(oData) {
					var oModel = new JSONModel({});
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "SRMModel");
				}.bind(this);

				ajaxutil.fnRead("/SortieMonSvc", oPrmFR);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnSortieMonitoringGet function");
				this.handleException(e);
			}
		},

		onSortieMonitoringUpdate: function(oEvent) {
			try {
				var that = this,
					sjobid = "",
					oModel,
					oPayload;
				var dDate = new Date();
				oModel = that.getView().getModel("LocalModel");
				var oParameter = {};
				oPayload = oEvent.getSource().getModel("SORTSet").getData();
				oParameter.error = function(response) {};
				oParameter.success = function(oData) {
					var oTable = this.getView().byId("tbWcSortieMonId");
					oTable.removeSelections(true);
					that._fnSortieMonitoringGet(oModel.getProperty("/sJobId"), oModel.getProperty("/WorkCenterKey"));
					that.onSortieMonitoringClose();
				}.bind(this);
				oParameter.activity = 2;
				ajaxutil.fnUpdate("/SortieMonSvc", oParameter, [oPayload], "ZRM_COS_JS", this);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onSortieMonitoringUpdate function");
				this.handleException(e);
			}
		},

		onSortieMonitoringDelete: function(oObj) {
			try {
				var that = this,
					oPrmSORT = {},
					oModel = this.getView().getModel("LocalModel");
				oPrmSORT.error = function() {};
				oPrmSORT.success = function(oData) {
					var oTable = this.getView().byId("tbWcSortieMonId");
					oTable.removeSelections(true);
					that._fnSortieMonitoringGet(oModel.getProperty("/sJobId"), oModel.getProperty("/WorkCenterKey"));
				}.bind(this);
				oPrmSORT.activity = 7;
				ajaxutil.fnDelete("/SortieMonSvc/" + oObj.JOBID + "/" + oObj.TAILID + "/" + oObj.SORNO, oPrmSORT, "ZRM_COS_JS", this);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onSortieMonitoringDelete function");
				this.handleException(e);
			}
		},

		_fnMonitoredForGet: function() {
			try {
				var that = this,
					oPrmFND = {};
				oPrmFND.filter = "ddid eq SORTI_ and refid eq " + that.getAircraftId();
				oPrmFND.error = function() {

				};

				oPrmFND.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "MonitoredForSet");
				}.bind(this);

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmFND);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnMonitoredForGet function");
				this.handleException(e);
			}
		},

		_fnJobDetailsGet: function(sJobId, sAirId) {
			try {
				var that = this,
					oViewModel = that.getView().getModel("LocalModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "jobid eq " + sJobId;
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();

					if (oData.results[0].length !== 0) {

						that._fnCreatedWorkCenterGet(sJobId);

						if (oData.results[0].etrdt !== null || oData.results[0].etrdt !== undefined) {
							oData.results[0].etrdt = new Date(oData.results[0].etrdt);
							oData.results[0].etrtm = formatter.defaultTimeFormatDisplay(oData.results[0].etrtm);
						}
						if (oData.results[0].fstat === 'A') {
							oViewModel.setProperty("/FairEditFlag", false);
						}

						if (oData.results[0].mark === '1') {
							that.onSelectionDefectAreaChange(oData.results[0].deaid);
							that._fnGetMark(oData.results[0].jobid, oData.results[0].tailid, oData.results[0].deaid);
						}

						if (oData.results[0].DOCREFID) {
							this.docRefId = oData.results[0].DOCREFID;
							that._fnPhotoUploadGet(oData.results[0].DOCREFID);
						} else {
							oViewModel.setProperty("/DefectImageSrc", []);
						}

						oModel.setData(oData.results[0]);
						that.getView().setModel(oModel, "JobModel");
					}
				}.bind(this);

				ajaxutil.fnRead("/DefectJobSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnJobDetailsGet function");
				this.handleException(e);
			}
		},

		_fnWorkCenterGet: function(sAirId) {
			try {
				var that = this,
					oPrmWorkCen = {};
				oPrmWorkCen.filter = "REFID eq " + sAirId;
				oPrmWorkCen.error = function() {

				};

				oPrmWorkCen.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "WorkCenterSet");
				}.bind(this);

				ajaxutil.fnRead("/GetWorkCenterSvc", oPrmWorkCen);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnWorkCenterGet function");
				this.handleException(e);
			}
		},

		_fnPhotoUploadGet: function(sDOCREFID) {
			try {
				var oPrmPhoto = {},
					oAppModel = this.getView().getModel("appModel"),
					that = this,
					sDefectImageSrc = oAppModel.getProperty("/DefectImageSrc");
				oPrmPhoto.filter = "DOCREFID eq " + sDOCREFID;
				oPrmPhoto.error = function() {};
				oPrmPhoto.success = function(oData) {
					if (oData && oData.results.length > 0) {
						var oDataSet = this.getModel("PhotoModel").getProperty("/photoSet");
						if (!oDataSet) {
							oDataSet = [];
						}
						oDataSet = oData.results.concat(oDataSet);
						this.getModel("PhotoModel").setProperty("/photoSet", oDataSet);
						setTimeout(function demo() {
							that._fnRenderImage(oDataSet[0].RAWBASE);
						}, 500);
						if (oDataSet[0].TYPE !== "POINT") {
							this.removeCoordinates();
						}
					}

				}.bind(this);
				ajaxutil.fnRead("/DefectPhotosSvc", oPrmPhoto, sDefectImageSrc);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnPhotoUploadGet function");
				this.handleException(e);
			}
		},
		_fnPhotoUploadCreate: function(sJobId, sTailId) {
			try {
				var that = this,
					oPrmPhoto = {},
					oAppModel = that.getView().getModel("LocalModel"),
					sDefectImageSrc = oAppModel.getProperty("/DefectImageSrc");
				for (var i = 0; i < sDefectImageSrc.length; i++) {
					sDefectImageSrc[i].jobid = sJobId;
					sDefectImageSrc[i].tailid = sTailId;
				}
				oAppModel.updateBindings(true);
				oPrmPhoto.filter = "";
				oPrmPhoto.error = function() {};
				oPrmPhoto.success = function(oData) {

				}.bind(this);

				ajaxutil.fnCreate("/DefectPhotosSvc", oPrmPhoto, sDefectImageSrc, "PHOTO", that);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnPhotoUploadCreate function");
				this.handleException(e);
			}
		},

		/* Function: onUpdateJob
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */
		_fnUpdateJob: function(oEvent) {
			try {
				var that = this,
					oObject,
					sjobid = "",
					oModel, oFlag,
					oPayload;
				var dDate = new Date();
				oModel = that.getView().getModel("LocalModel");
				oFlag = oModel.setProperty("/FairEditFlag");
				var oParameter = {};

				oPayload = that.getView().getModel("JobModel").getData();
				if (oPayload.etrtm === "") {
					oPayload.etrtm = null;
				}

				oParameter.error = function(response) {

				};

				oParameter.success = function(oData) {
					that._fnJobDetailsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/sTailId"));
				}.bind(this);
				if (oPayload.fstat === "R") {
					oObject = "ZRM_FAIR_R";
					oParameter.activity = 4;
				} else {
					oObject = "ZRM_COS_JB";
					oParameter.activity = 2;
				}

				ajaxutil.fnUpdate("/DefectJobSvc", oParameter, [oPayload], oObject, this);

			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnUpdateJob function");
				this.handleException(e);
			}
		},

		/* Function: onUpdateJob
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */
		_fnUpdateFAIRJob: function(oEvent) {
			try {
				var that = this,
					sjobid = "",
					oModel, oFlag,
					oPayload;
				var dDate = new Date();
				oModel = that.getView().getModel("LocalModel");
				oFlag = oModel.setProperty("/FairEditFlag");
				var oParameter = {};

				oPayload = that.getView().getModel("JobModel").getData();
				if (oPayload.etrtm === "") {
					oPayload.etrtm = null;
				}

				oParameter.error = function(response) {

				};

				oParameter.success = function(oData) {
					that._fnJobDetailsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/sTailId"));
					that.fnLoadSrv1Dashboard();
				}.bind(this);

				oParameter.activity = 1;
				ajaxutil.fnUpdate("/DefectJobSvc", oParameter, [oPayload], "ZRM_FAIR_D", this);

			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnUpdateFAIRJob function");
				this.handleException(e);
			}
		},

		_fnCreatedWorkCenterGet: function(sJobId) {
			try {
				var that = this,
					oModel,
					oPayload,
					oPrmWorkCenter = {};
				oModel = that.getView().getModel("LocalModel");

				oPrmWorkCenter.filter = "jobid eq " + sJobId;

				oPrmWorkCenter.error = function() {};
				oPrmWorkCenter.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oData.results.push({
						jobid: sJobId,
						tailid: oModel.getProperty("/sTailId"),
						wrctr: "Summary",
						isprime: "",
						wrctrtx: "Summary"
					});
					oModel.setData(oData.results);
					that.setModel(oModel, "CreatedWorkCenterModel");

				}.bind(this);

				ajaxutil.fnRead("/DefectWorkcenterSvc", oPrmWorkCenter);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnCreatedWorkCenterGet function");
				this.handleException(e);
			}
		},

		_fnDefectWorkCenterCreate: function(sWorkCenterKey, sState) {
			try {
				var that = this,
					oPayload,
					oPrmWorkCenter = {},
					oModel = that.getView().getModel("LocalModel");

				/*oPrmWorkCenter.filter="jobid eq "+sJobId+" and taild eq "+sTailId;*/

				oPayload = {
						"jobid": oModel.getProperty("/sJobId"),
						"tailid": oModel.getProperty("/sTailId"),
						"wrctr": sWorkCenterKey,
						"isprime": "",
						"wrctrtx": "",
						"count": null,
						"PrimeCount": null
					},

					oPrmWorkCenter.error = function() {};
				oPrmWorkCenter.success = function(oData) {
					that._fnUpdateJob();
					that.onCloseAddWorkCenterDialog();
				}.bind(this);
				oPrmWorkCenter.activity = 1;
				ajaxutil.fnCreate("/DefectWorkcenterSvc", oPrmWorkCenter, [oPayload], "ZRM_COS_JB", this);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnDefectWorkCenterCreate function");
				this.handleException(e);
			}
		},

		_fnDefectWorkCenterDelete: function(sWorkCenterKey) {
			try {
				var that = this,
					oPrmWorkCenter = {},
					oModel = this.getView().getModel("LocalModel");

				/*oPrmWorkCenter.filter="jobid eq "+sJobId+" and taild eq "+sTailId;*/
				oPrmWorkCenter.error = function() {};
				oPrmWorkCenter.success = function(oData) {
					that._fnJobDetailsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/sTailId"));
				}.bind(this);
				oPrmWorkCenter.activity = 7;
				ajaxutil.fnDelete("/DefectWorkcenterSvc/" + oModel.getProperty("/sJobId") + "/" + sWorkCenterKey, oPrmWorkCenter, "ZRM_COS_JB",
					this);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnDefectWorkCenterDelete function");
				this.handleException(e);
			}
		},

		_fnGetMark: function(sjobid, sTailId, sDeaId) {
			try {
				var oPrmMark = {},
					oModel,
					that = this,
					oPayload;
				oModel = that.getView().getModel("appModel").getData();
				oPrmMark.filter = "jobid eq " + sjobid;

				oPrmMark.error = function() {

				};

				oPrmMark.success = function(oData) {
					switch (sDeaId) {
						case "DEA_T":
							oModel.Top.push(oData.results[0]);
							break;
						case "DEA_F":
							oModel.Front.push(oData.results[0]);
							break;
						case "DEA_l":
							oModel.Left.push(oData.results[0]);
							break;
						case "DEA_R":
							oModel.Right.push(oData.results[0]);
							break;
					}
					that.drawCoordinates(sDeaId, oData.results[0]);
					that.getModel("PhotoModel").setProperty("/Coordinates", oData.results[0]);

				}.bind(this);

				ajaxutil.fnRead("/DefectMarkSvc", oPrmMark, oPayload);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnGetMark function");
				this.handleException(e);
			}
		},
		_fnValidateWorkCenterRecord: function(sSelectedKey) {
			try {
				var that = this,
					oFlag = true;
				var oModel = that.getView().getModel("CreatedWorkCenterModel").getData();
				for (var i = 0; i < oModel.length; i++) {

					if (oModel[i].wrctr === sSelectedKey) {
						oFlag = false;
					}
				}
				return oFlag;
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnValidateWorkCenterRecord function");
				this.handleException(e);
			}
		},

		_fnResetWorkCenterPrimeStatus: function(sText, sState) {
			try {
				var that = this,
					oflag = true,
					oCreateJobLocalModel;
				var oCreateJobLocalModel = that.getView().getModel("CreateJobLocalModel").getData();
				for (var i = 0; i < oCreateJobLocalModel.DefectWorkCentersTiles.length; i++) {
					if (oCreateJobLocalModel.DefectWorkCentersTiles[i].WorkCenterText === sText) {

						oCreateJobLocalModel.DefectWorkCentersTiles[i].Prime = "true";
					} else {
						oCreateJobLocalModel.DefectWorkCentersTiles[i].Prime = "false";
					}
				}
				that.getView().getModel("CreateJobLocalModel").updateBindings(true);
				/*that.getModel("CreateJobLocalModel").refresh();*/
				that.getView().byId("summaryHBId").invalidate();
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnResetWorkCenterPrimeStatus function");
				this.handleException(e);
			}
		},

		_fnGetWorkCenterPrimeStatus: function(oText) {
			try {
				var that = this,
					oflag = false,
					oCreateJobLocalModel;
				var oCreateJobLocalModel = that.getView().getModel("CreatedWorkCenterModel").getData();
				for (var i = 0; i < oCreateJobLocalModel.length; i++) {
					if (oCreateJobLocalModel[i].wrctrtx === oText && oCreateJobLocalModel[i].isprime !== null) {
						oflag = true;
					}
				}
				return oflag;
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnGetWorkCenterPrimeStatus function");
				this.handleException(e);
			}
		},

		_fnTableOutstandingFilter: function() {
			try {
				var oBindingOutstanding, oFilters, filterObj, oTableOutstanding = this.getView().byId("tbWcOutstandingId");
				oBindingOutstanding = oTableOutstanding.getBinding("items");
				if (oBindingOutstanding !== undefined) {
					oBindingOutstanding.filter([]);
				}
				oFilters = [new sap.ui.model.Filter("tstat", sap.ui.model.FilterOperator.EQ, "C"),
					new sap.ui.model.Filter("tstat", sap.ui.model.FilterOperator.EQ, "S")
				];

				filterObj = new sap.ui.model.Filter(oFilters, false);

				oBindingOutstanding.filter(filterObj);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTableOutstandingFilter function");
				this.handleException(e);
			}
		},

		_fnTableCompletedFilter: function() {
			try {
				var oBindingCompleted, oFilters, filterObj, oTableCompleted = this.getView().byId("tbWcCompletedId");
				oBindingCompleted = oTableCompleted.getBinding("items");
				if (oBindingCompleted !== undefined) {
					oBindingCompleted.filter([]);
				}
				oFilters = [new sap.ui.model.Filter("tstat", sap.ui.model.FilterOperator.EQ, "X")];

				filterObj = new sap.ui.model.Filter(oFilters, false);

				oBindingCompleted.filter(filterObj);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTableCompletedFilter function");
				this.handleException(e);
			}
		},

		_fnTablePendingFilter: function() {
			try {
				var oBindingPending, oFilters, filterObj, oTablePending = this.getView().byId("tbWcPendingSuperId");
				oBindingPending = oTablePending.getBinding("items");
				if (oBindingPending !== undefined) {
					oBindingPending.filter([]);
				}
				oFilters = [new sap.ui.model.Filter("tstat", sap.ui.model.FilterOperator.EQ, "P")];

				filterObj = new sap.ui.model.Filter(oFilters, false);

				oBindingPending.filter(filterObj);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTablePendingFilter function");
				this.handleException(e);
			}
		},

		_fnApplyFilter: function(oFilterWC) {
			try {
				var oFilters, filterObj, oBindingFlyingReq, oBindingSortieMonitoring, oBindingDemanSpare, oBindingCompleted, oBindingOutstanding,
					oBindingPendingSupervisor, oBindingTDME,
					oTableFlyingReq = this.getView().byId("tbWcFlyingReqId"),
					oTableSortieMonitoring = this.getView().byId("tbWcSortieMonId"),
					oTableDemanSpare = this.getView().byId("tbWcDemandSpareId"),
					oTableCompleted = this.getView().byId("tbWcCompletedId"),
					oTableOutstanding = this.getView().byId("tbWcOutstandingId"),
					oTablePendingSupervisor = this.getView().byId("tbWcPendingSuperId"),
					oTableTDME = this.getView().byId("tbWcTDMEId");

				oBindingFlyingReq = oTableFlyingReq.getBinding("items");
				oBindingSortieMonitoring = oTableSortieMonitoring.getBinding("items");
				oBindingDemanSpare = oTableDemanSpare.getBinding("items");
				oBindingCompleted = oTableCompleted.getBinding("items");
				oBindingOutstanding = oTableOutstanding.getBinding("items");
				oBindingPendingSupervisor = oTablePendingSupervisor.getBinding("items");
				oBindingTDME = oTableTDME.getBinding("items");

				if (oBindingFlyingReq !== undefined) {
					oBindingFlyingReq.filter([]);
				}
				if (oBindingSortieMonitoring !== undefined) {
					oBindingSortieMonitoring.filter([]);
				}
				if (oBindingDemanSpare !== undefined) {
					oBindingDemanSpare.filter([]);
				}
				if (oBindingCompleted !== undefined) {
					oBindingCompleted.filter([]);
				}
				if (oBindingOutstanding !== undefined) {
					oBindingOutstanding.filter([]);
				}
				if (oBindingPendingSupervisor !== undefined) {
					oBindingPendingSupervisor.filter([]);
				}
				if (oBindingTDME !== undefined) {
					oBindingTDME.filter([]);
				}

				/*	if (oBindingSummary) {
				 */
				oFilters = [new sap.ui.model.Filter("wrctr", sap.ui.model.FilterOperator.EQ, oFilterWC),
					new sap.ui.model.Filter("WRCTR", sap.ui.model.FilterOperator.EQ, oFilterWC)
				];

				filterObj = new sap.ui.model.Filter(oFilters, false);

				if (oBindingFlyingReq !== undefined) {
					oBindingFlyingReq.filter(filterObj);
				}
				if (oBindingSortieMonitoring !== undefined) {
					oBindingSortieMonitoring.filter(filterObj);
				}
				if (oBindingDemanSpare !== undefined) {
					oBindingDemanSpare.filter(filterObj);
				}
				if (oBindingCompleted !== undefined) {
					oBindingCompleted.filter(filterObj);
				}
				if (oBindingOutstanding !== undefined) {
					oBindingOutstanding.filter(filterObj);
				}
				if (oBindingPendingSupervisor !== undefined) {
					oBindingPendingSupervisor.filter(filterObj);
				}
				if (oBindingTDME !== undefined) {
					oBindingTDME.filter(filterObj);
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnApplyFilter function");
				this.handleException(e);
			}
		},

		removeCoordinates: function() {
			try {
				var oCanvas = document.getElementById("myCanvasTop");
				if (oCanvas) {
					var ctx = oCanvas.getContext('2d');
					ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
				}
			} catch (e) {
				Log.error("Exception in removeCoordinates function");
			}
		}

	});
});