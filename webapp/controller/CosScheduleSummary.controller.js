sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"../model/FieldValidations",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, formatter, ajaxutil, Log, MessageBox, JSONModel, FieldValidations, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	/* ***************************************************************************
	 *     Developer : RAHUL THORAT   
	 *   Control name: Schedule Summary         
	 *   Purpose : Schedule job smmary 
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onAfterRendering
	 *        1.3 onExit
	 *        1.4 destroyState
	 *   2. Backend Calls
	 *        2.1 _fnWorkCenterGet
	 *        2.2 _fnJobDueGet
	 *        2.3 onStartJobPress
	 *        2.4 onUpdateWorkCenterPress
	 *        2.5 onRaiseScheduleConcessionPress	
	 *        2.6 _fnSumamryDetailsGet
	 *        2.7 _fnUtilizationGet
	 *        2.8 _fnGetUtilisation
	 *        2.9 _fnDeleteScheduleJob
	 *   3. Private calls
	 *        3.1 _fnCheckStatus	
	 *        3.2 onIntervalChange
	 *        3.3 onStepChangeSchedule
	 *        3.4 onDueSelectChange
	 *        3.5 onWorkCenterSelect
	 *        3.6 onWoorkCenTblUpdateFinished
	 *        3.7 onSummaryIconTabBarSelect
	 *        3.8 handleWorkCenterMenuItemPress
	 *        3.9 handlePressWorkCenterFragmentOpenMenu
	 *        3.10 onCloseAEMFDialog
	 *        3.11 onAEFMMenuPress
	 *        3.12 onAddWorkcenterSubmitPress
	 *        3.13 onCloseConfirmDialog
	 *        3.14 onCloseRaiseScheduleConcession
	 *        3.15 onUilisationChange
	 *        3.16 _fnOpenScheduleConcessionDialog
	 *        3.17 onRaiseScheduleConcession
	 *        3.18 onCloseAddWorkCenterDialog
	 *        3.19 onAddNewWorkCenter
	 *        3.20 handleMenuItemPress
	 *        3.21 onCloseDialog
	 *        3.22 onOpenQuickView
	 *        3.23 onOpprChange
	 *        3.24 onNavBackPrevious
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.CosScheduleSummary", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var that = this;
				this.getRouter().getRoute("CosScheduleSummary").attachPatternMatched(this._handleRouteMatched, this);
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
					SelectedOPPR: "",
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
				Log.error("Exception in onInit function");
			}
		},

		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		/* Function: _fnDeleteScheduleJob
		 * Parameter:
		 * Description: Function to delete job
		 */
		_fnDeleteScheduleJob: function() {
			try {
				var that = this;
				var sPath = that.getResourceBundle().getText("GETSERLOGSVC") +
					"?ESJOBID" + FilterOpEnum.EQ + this.getModel("LocalModel").getProperty("/ESJobId") + "&tailid" + FilterOpEnum.EQ + that.getTailId();

				var oParameter = {};
				oParameter.error = function(hrex) {}.bind(this);
				oParameter.success = function(oData) {
					this.getRouter().navTo("Cosjobs", {
						State: "SCH"
					});
				}.bind(this);
				oParameter.activity = 7;
				ajaxutil.fnDelete(sPath, oParameter, "ZRM_COS_OP", this);
			} catch (e) {
				Log.error("Exception in _fnDeleteScheduleJob function");

			}
		},
		/* Function: _fnGetUtilisation
		 * Parameter:sAir
		 * Description: Function to hold min value for utilisation
		 */
		_fnGetUtilisation: function(sAir) {
			try {
				var that = this,
					aData = this.getModel("SummaryModel").getData(),
					oPrmJobDue = {};
				//	oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + that.getAircraftId() + " and JDUID eq JDU";
				oPrmJobDue.filter = "TAILID" + FilterOpEnum.EQ + this.getTailId() + FilterOpEnum.AND + "refid" + FilterOpEnum.EQ + that.getAircraftId() +
					FilterOpEnum.AND + "JDUID" + FilterOpEnum.EQ + "JDU";
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.oObject = {};
						for (var i in oData.results) {
							this.oObject[oData.results[i].JDUID] = oData.results[i];
						}
						var data = {
							"DueBy": aData.UMKEY,
							"ExpDate": new Date(aData.SERVDT),
							"Util": "",
							"UtilVal": aData.SERVDUE,
							"ExpDateFlag": aData.UMKEY === 'JDU_10' ? true : false,
							"UtilValFlag": aData.UMKEY !== 'JDU_10' ? true : false,
							"UM": "",
							"minVal": this.oObject[aData.UMKEY] ? parseFloat(this.oObject[aData.UMKEY].VALUE) : 0,
							"minDT": new Date(aData.SERVDT),
							"ZINTERVAL": aData.ZINTERVAL

						};
						if (aData.ZINTERVAL === 0) {
							this.getFragmentControl("idScheduleJobExtension", "vbInterval").setVisible(false);
						}
						if (this.getView().getModel("RSModel")) {
							this.getModel("RSModel").setData(data);
						} else {
							this.getView().setModel(new JSONModel(data), "RSModel");
						}

						this._oRaiseConcession.open(this);
					}
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("UTILISATIONDUESVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnGetUtilisation function");
			}
		},
		/* Function: _fnUtilizationGet
		 * Parameter:
		 * Description: This is called to populate utilisation drop down
		 */
		_fnUtilizationGet: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					sAirId = this.getAircraftId(),
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid" + FilterOpEnum.EQ + sAirId + "&ddid" + FilterOpEnum.EQ + "UTIL1_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "UtilizationCBModel");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnUtilizationGet function");
			}
		},
		/* Function: _fnSumamryDetailsGet
		 * Parameter: sESJobId
		 * Description: This is called when job is selected
		 */
		_fnSumamryDetailsGet: function(sESJobId) {
			try {
				var that = this,
					oModel, oModelLocal,
					oPrmSummary = {};
				oModelLocal = that.getView().getModel("LocalModel").getData();

				oPrmSummary.filter = "ESJOBID" + FilterOpEnum.EQ + sESJobId + "&tailid" + FilterOpEnum.EQ + that.getTailId() + "&FLAG" +
					FilterOpEnum.EQ + "ES";

				oPrmSummary.error = function() {};
				oPrmSummary.success = function(oData) {
					if (oData.results.length !== 0) {
						oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results[0]);
						if (oData.results[0].PRIME !== null && oData.results[0].PRIME !== "") {
							if (oModelLocal.WorkCenter.length <= 1) {
								oModelLocal.WorkCenter.push({
									jobid: "",
									tailid: "",
									wrctr: oData.results[0].PRIME,
									isprime: "true",
									wrctrtx: oData.results[0].WRCTR
								});
							}
						}
						that.getView().getModel("LocalModel").updateBindings(true);
						that._fnWorkCenterGet();
						that.setModel(oModel, "SummaryModel");
					}

				}.bind(this);

				ajaxutil.fnRead(that.getResourceBundle().getText("GETSERLOGSVC"), oPrmSummary);
			} catch (e) {
				Log.error("Exception in _fnSumamryDetailsGet function");
			}
		},

		/* Function: onRaiseScheduleConcessionPress
		 * Parameter: oFlag
		 * Description: Function call when job's scheduled is raised
		 */

		onRaiseScheduleConcessionPress: function(oFlag) {
			try {
				var that = this,
					oPayload, oModel,
					oPrmSchJob = {};
				var okeyText = this.getFragmentControl("idScheduleJobExtension", "cbJobDueId").getSelectedItem().getText();
				try {
					oModel = this.getView().getModel("RSModel").getData();
				} catch (e) {
					oModel = "";
				}
				oPayload = this.getView().getModel("SummaryModel").getData();

				//oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
				if (oFlag === "E") {

					if (oModel.UM === "") {
						oModel.UM = okeyText;
					}
					if (oModel.DueBy === "JDU_10") {
						if ((oModel.ExpDate === null && oModel.ExpDate === "") && parseFloat(oModel.ZINTERVAL) === 0) {
							this.getFragmentControl("idScheduleJobExtension", "dpScheId").setValueState("Error");
							this.getFragmentControl("idScheduleJobExtension", "dpScheId").setValueStateText("Please fill required field");
							return;
						}
						oPayload.SERVDT = oModel.ExpDate;
						oPayload.UM = oModel.UM;
						oPayload.UMKEY = oModel.DueBy;
						oPayload.SERVDUE = "";
						oPayload.ZINTERVAL = oModel.ZINTERVAL;
					} else {
						if ((oModel.ExpDate === null && oModel.ExpDate === "") && parseFloat(oModel.ZINTERVAL) === 0) {
							this.getFragmentControl("idScheduleJobExtension", "siSchedId").setValueState("Error");
							this.getFragmentControl("idScheduleJobExtension", "siSchedId").setValueStateText("Please fill required field");
							return;
						}
						oPayload.SERVDT = "";
						oPayload.UM = oModel.UM;
						oPayload.SERVDUE = (oModel.UtilVal).toString();
						oPayload.UMKEY = oModel.DueBy;
						oPayload.ZINTERVAL = oModel.ZINTERVAL;
					}
					oPayload.SCONFLAG = "";
				} else {
					oPayload.SCONFLAG = "E";
					if (oModel.DueBy === "JDU_10") {
						oPayload.SERVDT = oModel.ExpDate;
						oPayload.UMKEY = oModel.DueBy;
						oPayload.SERVDUE = "";
					} else {
						oPayload.SERVDT = "";
						oPayload.SERVDUE = (oModel.UtilVal).toString();
						oPayload.UMKEY = oModel.DueBy;
					}
				}
				oPrmSchJob.error = function() {};
				oPrmSchJob.success = function(oData) {
					var oModel1 = dataUtil.createNewJsonModel();
					oModel1.setData({
						"DueBy": "",
						"ExpDate": "",
						"Util": "",
						"UtilVal": "",
						"ExpDateFlag": false,
						"UtilValFlag": false,
						"UM": "",
						"ZINTERVAL": 0

					});
					this.getView().setModel(oModel1, "RSModel");
					if (oFlag === "Y" || oFlag === "E") {
						this.getRouter().navTo("Cosjobs", {
							State: "SCH"
						}, true);
					} else {
						that.onCloseAddWorkCenterDialog("N");
						this._fnSumamryDetailsGet(that.getView().getModel("LocalModel").getProperty("/ESJobId"));
					}
				}.bind(this);
				oPrmSchJob.activity = 2;
				ajaxutil.fnUpdate(that.getResourceBundle().getText("GETSERLOGSVC"), oPrmSchJob, [oPayload], "ZRM_COS_JB", this);
			} catch (e) {
				Log.error("Exception in onRaiseScheduleConcessionPress function");
			}
		},
		/* Function: onUpdateWorkCenterPress
		 * Parameter:
		 * Description: This is called to save the updated work center
		 */
		onUpdateWorkCenterPress: function() {
			try {
				var that = this,
					oPayload, oModel,
					oPrmSchJob = {};

				try {
					oModel = this.getView().getModel("RSModel").getData();
				} catch (e) {
					oModel = "";
				}
				oPayload = this.getView().getModel("SummaryModel").getData();
				oPayload.SCONFLAG = "E";
				//oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;

				oPrmSchJob.error = function() {};
				oPrmSchJob.success = function(oData) {
					var oModel1 = dataUtil.createNewJsonModel();
					oModel1.setData({
						"DueBy": "",
						"ExpDate": "",
						"Util": "",
						"UtilVal": "",
						"ExpDateFlag": false,
						"UtilValFlag": false,
						"UM": "",
						"ZINTERVAL": 0

					});
					this.getView().setModel(oModel1, "RSModel");
					that.onCloseAddWorkCenterDialog("N");
					this._fnSumamryDetailsGet(that.getView().getModel("LocalModel").getProperty("/ESJobId"));

				}.bind(this);
				oPrmSchJob.activity = 2;
				ajaxutil.fnUpdate(that.getResourceBundle().getText("GETSERLOGSVC"), oPrmSchJob, [oPayload], "ZRM_COS_JB", this);
			} catch (e) {
				Log.error("Exception in onUpdateWorkCenterPress function");
			}
		},
		/* Function: onStartJobPress
		 * Parameter:
		 * Description: this is called to start the job
		 */
		onStartJobPress: function() {
			try {
				var that = this,
					oPayload,
					oPrmSchJob = {};
				oPayload = this.getView().getModel("SummaryModel").getData();
				if (oPayload.PRIME !== null && oPayload.PRIME !== "") {
					oPayload.FLAG = "";
					oPrmSchJob.error = function() {};
					oPrmSchJob.success = function(oData) {
						this.getRouter().navTo("Cosjobs", true);
					}.bind(this);
					oPrmSchJob.activity = 1;
					ajaxutil.fnCreate(that.getResourceBundle().getText("GETSERLOGSVC"), oPrmSchJob, [oPayload], "ZRM_SCH_SJ", this);
				} else {
					MessageBox.error(
						"Please add workcenter to start schedule job.", {
							icon: sap.m.MessageBox.Icon.Error,
							title: "Error",
							styleClass: "sapUiSizeCompact"
						});
				}
			} catch (e) {
				Log.error("Exception in onStartJobPress function");
			}
		},
		//------------------------------------------------------------------
		// Function: _fnJobDueGet
		// Parameter: sAir
		// Description: General Method: This will get called, when to get Job due data from backend.
		// Table: DDREF, DDVAL
		//------------------------------------------------------------------
		_fnJobDueGet: function(sAir) {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid" + FilterOpEnum.EQ + that.getAircraftId() + "&ddid" + FilterOpEnum.EQ + "JDU";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobDueSet");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobDueGet function");
			}
		},

		//------------------------------------------------------------------
		// Function: _fnWorkCenterGet
		// Parameter: sAirId
		// Description: This will get called, when to get workcenter database.
		//Table: DDREF, DDVAL
		//------------------------------------------------------------------
		_fnWorkCenterGet: function() {
			try {
				var that = this,
					oPrmWorkCen = {};
				//	oPrmWorkCen.filter = "REFID eq " + that.getAircraftId();
				oPrmWorkCen.filter = "REFID" + FilterOpEnum.EQ + that.getAircraftId();
				oPrmWorkCen.error = function() {

				};

				oPrmWorkCen.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "WorkCenterSet");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("GETWORKCENTERSVC"), oPrmWorkCen);
			} catch (e) {
				Log.error("Exception in _fnWorkCenterGet function");
			}
		},
		// ***************************************************************************
		//     3.  Specific Methods  
		// ***************************************************************************
		/* Function: onNavBackPrevious
		 * Parameter:
		 * Description: Function when back button is pressed
		 */
		onNavBackPrevious: function() {
			try {
				this.onNavBack();
			} catch (e) {
				Log.error("Exception in onNavBackPrevious function");
			}
		},
		/* Function: onOpprChange
		 * Parameter:
		 * Description: Function when oppr is changed
		 */
		onOpprChange: function(oEvent) {
			try {
				var oModel = this.getView().getModel("LocalModel");
				oModel.setProperty("/SelectedOPPR", oEvent.getSource().getSelectedKey());
			} catch (e) {
				Log.error("Exception in onOpprChange function");
			}

		},
		/* Function: onOpenQuickView
		 * Parameter:
		 * Description: Function call when manage job button is pressed
		 */
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
				Log.error("Exception in onOpenQuickView function");
			}
		},
		/* Function: onCloseDialog
		 * Parameter:
		 * Description: Function to close menu button dialog.
		 */
		onCloseDialog: function() {
			try {
				if (this._oQuickView) {
					this._oQuickView.close(this);
					this._oQuickView.destroy();
					delete this._oQuickView;
				}
			} catch (e) {
				Log.error("Exception in onCloseDialog function");
			}
		},
		/* Function: handleMenuItemPress
		 * Parameter:
		 * Description: Function call item in menu is pressed
		 */
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
				Log.error("Exception in handleMenuItemPress function");
			}
		},

		/* Function: onWarningMessagePress
		 * Parameter: 
		 * Description:Show the Es Posting Status.
		 * return true/ false based on difference is greate than 24 hrs or not for job
		 */
		onWarningMessagePress: function(oEvent) {
			var oJobModel = this.getView().getModel("JobModel");
			var sText = oJobModel.getProperty("/esstatusMsg");
			this.onWarningMessageSelect(oEvent, sText);
		},
		/* Function: onAddNewWorkCenter
		 * Parameter:
		 * Description: Function call open dialog to add work center
		 */
		onAddNewWorkCenter: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("WorkCenterSet");
				if (!that._oAddWorkCenter) {
					that._oAddWorkCenter = sap.ui.xmlfragment(that.createId("idWorkCenterDialog"),
						"avmet.ah.fragments.AddSchWorkCenterDialog",
						this);
					that.getView().addDependent(that._oAddWorkCenter);
				}
				that._oAddWorkCenter.setModel(oModel, "WorkCenterSet");
				that._oAddWorkCenter.open(that);
			} catch (e) {
				Log.error("Exception in onAddNewWorkCenter function");
			}
		},
		/* Function: onCloseAddWorkCenterDialog
		 * Parameter: oFLag
		 * Description:  Function call close dialog for work center
		 */
		onCloseAddWorkCenterDialog: function(oFLag) {
			try {
				if (oFLag === "Y") {
					var oModel = this.getView().getModel("SummaryModel");
					oModel.setProperty("/PRIME", "");
				}
				if (this._oAddWorkCenter) {
					this._oAddWorkCenter.close(this);
					this._oAddWorkCenter.destroy();
					delete this._oAddWorkCenter;
				}
			} catch (e) {
				Log.error("Exception in onCloseAddWorkCenterDialog function");
			}
		},
		/* Function: onRaiseScheduleConcession
		 * Parameter: oEvent
		 * Description: Function call to open dialog to edit/ raise schedule for the job
		 */
		onRaiseScheduleConcession: function(oEvent) {
			try {
				var sText = oEvent.getParameter("item").getText();
				if (sText.search("Raise Schedule Concession") !== -1) {
					this._fnOpenScheduleConcessionDialog("NE");
				} else if (sText.search("Delete") !== -1) {
					this._fnDeleteScheduleJob();
				} else if (sText.search("Edit Schedule Details") !== -1) {
					this._fnOpenScheduleConcessionDialog("ED");
				}

			} catch (e) {
				Log.error("Exception in onRaiseScheduleConcession function");
			}
		},

		/* Function: _fnOpenScheduleConcessionDialog
		 * Parameter: oFlag
		 * Description: Function to open edit Schedule Concession fragment
		 */
		_fnOpenScheduleConcessionDialog: function(oFlag) {
			try {
				if (!this._oRaiseConcession) {
					this._oRaiseConcession = sap.ui.xmlfragment(this.createId("idScheduleJobExtension"),
						"avmet.ah.fragments.ScheduleJobExtension",
						this);
					this._fnJobDueGet();
					this.getView().addDependent(this._oRaiseConcession);
				}
				if (oFlag === "ED") {
					this.getFragmentControl("idScheduleJobExtension", "cbJobDueId").setEditable(true);
					this.getFragmentControl("idScheduleJobExtension", "btnRaise").setVisible(false);
					this.getFragmentControl("idScheduleJobExtension", "btnEdit").setVisible(true);
					this.getFragmentControl("idScheduleJobExtension", "ipInterval").setEditable(true);
					this.getFragmentControl("idScheduleJobExtension", "dgId").setTitle("Edit Schedule Concession");
				} else {
					this.getFragmentControl("idScheduleJobExtension", "cbJobDueId").setEditable(false);
					this.getFragmentControl("idScheduleJobExtension", "ipInterval").setEditable(false);
					this.getFragmentControl("idScheduleJobExtension", "btnRaise").setVisible(true);
					this.getFragmentControl("idScheduleJobExtension", "btnEdit").setVisible(false);
					this.getFragmentControl("idScheduleJobExtension", "dgId").setTitle("Raise Schedule Concession");
				}
				this._fnGetUtilisation();
			} catch (e) {
				Log.error("Exception in _fnOpenScheduleConcessionDialog function");
			}
		},

		/* Function: _fnGetUtilisation
		 * Parameter:
		 * Description: Function call when utilisation drop down is changed
		 */
		onUilisationChange: function(oEvent) {
			try {
				var oTemp = oEvent.getSource().getSelectedItem().getText(),
					oModel = this.getView().getModel("SummaryModel");
				oModel.setProperty("/UM", oTemp);
			} catch (e) {
				Log.error("Exception in onUilisationChange function");
			}
		},
		/* Function: onCloseRaiseScheduleConcession
		 * Parameter:
		 * Description: Function to close raise concession dialog
		 */
		onCloseRaiseScheduleConcession: function() {
			try {
				if (this._oRaiseConcession) {
					this._oRaiseConcession.close(this);
					this._oRaiseConcession.destroy();
					delete this._oRaiseConcession;
				}
			} catch (e) {
				Log.error("Exception in onCloseRaiseScheduleConcession function");
			}
		},

		/* Function: onCloseConfirmDialog
		 * Parameter:
		 * Description: Function to close confirm dialog
		 */
		onCloseConfirmDialog: function() {
			try {
				var that = this;
				that.getFragmentControl("idWorkCenterDialog", "addWCId").setVisible(true);
				that.getFragmentControl("idWorkCenterDialog", "confirmWCId").setVisible(false);
			} catch (e) {
				Log.error("Exception in onCloseConfirmDialog function");
			}
		},
		/* Function: onAddWorkcenterSubmitPress
		 * Parameter:
		 * Description: Function to save work center
		 */
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
				//oValidateWC = that._fnValidateWorkCenterRecord(sSelectedText);

			} catch (e) {
				Log.error("Exception in onAddWorkcenterSubmitPress function");
			}
		},
		/* Function: onAEFMMenuPress
		 * Parameter:
		 * Description: Function call when AEF menu button is pressed
		 */
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
				Log.error("Exception in onAEFMMenuPress function");
			}
		},
		/* Function: onCloseAEMFDialog
		 * Parameter:
		 * Description: Function to close AEMF dialog
		 */
		onCloseAEMFDialog: function() {
			try {
				if (this._oWCMenuFrag) {
					this._oWCMenuFrag.close(this);
					this._oWCMenuFrag.destroy();
					delete this._oWCMenuFrag;
				}
			} catch (e) {
				Log.error("Exception in onCloseAEMFDialog function");
			}
		},
		/* Function: handlePressWorkCenterFragmentOpenMenu
		 * Parameter:
		 * Description: Function to open work center dialog
		 */
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
				Log.error("Exception in handlePressWorkCenterFragmentOpenMenu function");
			}
		},
		/* Function: onCloseWorkCenterMenu
		 * Parameter:
		 * Description: Function to close work center dialog
		 */
		onCloseWorkCenterMenu: function() {
			try {
				if (this._oWCMenuFrag) {
					this._oWCMenuFrag.close(this);
					this._oWCMenuFrag.destroy();
					delete this._oWCMenuFrag;
				}
			} catch (e) {
				Log.error("Exception in onCloseWorkCenterMenu function");
			}
		},
		/* Function: handleWorkCenterMenuItemPress
		 * Parameter:
		 * Description: Function call when item is pressed in work center
		 */
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
				Log.error("Exception in handleWorkCenterMenuItemPress function");
			}
		},
		/* Function: onSummaryIconTabBarSelect
		 * Parameter:
		 * Description: Function call when tab selected
		 */
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
				Log.error("Exception in onSummaryIconTabBarSelect function");
			}
		},

		/* Function: onWoorkCenTblUpdateFinished
		 * Parameter: sValue, oEvent
		 * Description: Function call when work center table update finished
		 */
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
				Log.error("Exception in onWoorkCenTblUpdateFinished function");
			}
		},
		/* Function: onWorkCenterSelect
		 * Parameter: oEvent
		 * Description: Function to when work center button is pressed
		 */
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
				Log.error("Exception in onWorkCenterSelect function");
			}
		},
		/* Function: onDueSelectChange
		 * Parameter:oEvent
		 * Description: Function call when due select is changed
		 */
		onDueSelectChange: function(oEvent) {
			try {
				var sDue = oEvent.getSource().getSelectedKey();
				var oModel = this.getView().getModel("RSModel");
				var okeyText = this.getFragmentControl("idScheduleJobExtension", "cbJobDueId").getSelectedItem().getText();
				//this.getView().byId("SchJobDueId").setVisible(true);
				if (sDue.length > 0) {
					if (this.oObject && this.oObject[sDue] && this.oObject[sDue].VALUE) {
						var minVal = parseFloat(this.oObject[sDue].VALUE, [10]);
						oModel.setProperty("/minValue", minVal);
						if (sDue === "JDU_11") {
							okeyText = "AFH";
						}
						oModel.setProperty("/UM", okeyText);
						var sVal = oModel.getProperty("/UtilVal") ? oModel.getProperty("/UtilVal") : 0;
						sVal = parseFloat(sVal, [10]);
						var iPrec = formatter.JobDueDecimalPrecision(sDue);
						oModel.setProperty("/UtilVal", parseFloat(minVal, [10]).toFixed(iPrec));
						oModel.setProperty("/ZINTERVAL", parseFloat(0, [10]).toFixed(iPrec));
					} else {
						var temp = new Date();
						oModel.setProperty("/minDT", temp);
						oModel.setProperty("/ExpDate", temp);
						oModel.setProperty("/UM", okeyText);
						oModel.setProperty("/ZINTERVAL", parseFloat(0, [10]).toFixed(0));
					}

				}
				oModel.setProperty("/jduid", sDue);
				oModel.setProperty("/DueBy", sDue);
				oModel.refresh(true);
			} catch (e) {
				Log.error("Exception in onDueSelectChange function");
			}
		},
		/* Function: handleChangeSche
		 * Parameter:
		 * Description: Function call Date is changed
		 */
		handleChangeSche: function(oEvent) {
			var oSrc = oEvent.getSource(),
				oAppModel = this.getView().getModel("RSModel");
			oSrc.setValueState("None");
			oAppModel.setProperty("/ExpDate", oSrc.getDateValue());
		},
		/* Function: onStepChangeSchedule
		 * Parameter:
		 * Description: Function call step control is changed
		 */
		onStepChangeSchedule: function(oEvent) {
			try {
				this.onStepChange(oEvent);
				var oSrc = oEvent.getSource(),
					oAppModel = this.getView().getModel("RSModel"),
					sKey = oAppModel.getProperty("/DueBy"),
					sInt = oAppModel.getProperty("/ZINTERVAL");
				oSrc.setValueState("None");
			} catch (e) {
				Log.error("Exception in onDueSelectChange function");
			}
		},
		/* Function: onIntervalChange
		 * Parameter:
		 * Description: Function call interval is changed
		 */
		onIntervalChange: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					oAppModel = this.getView().getModel("RSModel"),
					sVal = oSrc.getValue(),
					sKey = oAppModel.getProperty("/DueBy"),
					sDue = oAppModel.getProperty("/UtilVal"),
					bFlag = false;
				oSrc.setValueState("None");
				this.getFragmentControl("idScheduleJobExtension", "dpScheId").setValueState("None");
				this.getFragmentControl("idScheduleJobExtension", "siSchedId").setValueState("None");
				var iPrec = formatter.JobDueDecimalPrecision(sKey);
				if (!sVal || sVal === "") {
					sVal = 0;
				}
				oAppModel.setProperty("/ZINTERVAL", parseFloat(sVal, [10]).toFixed(iPrec));
			} catch (e) {
				Log.error("Exception in onIntervalChange function");
			}
		},
		/* Function: _fnCheckStatus
		 * Parameter: aState
		 * Description: function to check status
		 */
		_fnCheckStatus: function(aState) {
			try {
				switch (aState) {
					case "AST_FFF":
					case "AST_RFF":
					case "AST_FAIR":
					case "AST_FAIR0":
					case "AST_FAIR1":
					case "AST_FAIR2":
						return false;
					default:
						return true;
				}
			} catch (e) {
				Log.error("Exception in _fnCheckStatus function");
			}
		},
		// ***************************************************************************
		//   4. Private Function   
		// ***************************************************************************
		/* Function: _handleRouteMatched
		 * Parameter:
		 * Description: This will called to handle route matched.
		 */
		_handleRouteMatched: function(oEvent) {
			try {
				/*var oSummaryData = dataUtil.getDataSet("CreateJob");
				oSummaryData.DefectData.Date = new Date(oSummaryData.DefectData.Date);
				var oSummaryModel = dataUtil.createNewJsonModel(oSummaryData);
				oSummaryModel.setData(oSummaryData);
				this.getView().setModel(oSummaryModel, "SummaryModel");*/
				var that = this,
					sTailId, sESJobId, sSqnId,
					sModId,
					sAirId, oViewModel = that.getView().getModel("LocalModel");

				sESJobId = oEvent.getParameters("").arguments.ESJOBID;
				sTailId = that.getTailId();
				sAirId = that.getAircraftId();
				sSqnId = that.getSqunId();
				sModId = that.getModelId();
				var sState = this._fnCheckStatus(this.getModel("avmetModel").getProperty("/dash/astid"));
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
					FairEditFlag: sState,
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
				Log.error("Exception in _handleRouteMatched function");
			}
		}

	});
});