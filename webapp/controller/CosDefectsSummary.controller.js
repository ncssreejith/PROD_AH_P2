sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../model/formatter",
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log",
	"sap/m/MessageBox",
	"../model/FieldValidations",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, formatter, ajaxutil, JSONModel, Log, MessageBox, FieldValidations, FilterOpEnum) {
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
					RectSummaryFlag: false,
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
					FairEditBtnFlag: true,
					TableFlag: "",
					sFlag: "",
					sWcKey: "",
					sGoTo: "",
					JobStatus: false,
					etrMinDate: null,
					bSuperDiaFlag: false,
					DefectImageSrc: [],
					selectedTask: [],
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
				var oDDT1Model = dataUtil.createNewJsonModel(),
					oDDT2Model = dataUtil.createNewJsonModel();
				oDDT1Model.setData([{
					"key": "Serial No. (S/N)",
					"text": "Serial No. (S/N)"
				}, {
					"key": "Batch No.",
					"text": "Batch No."
				}]);
				this.getView().setModel(oDDT1Model, "TT1Model");

				oDDT2Model.setData([{
					"key": "Material No.",
					"text": "Material No."
				}, {
					"key": "Part No.",
					"text": "Part No."
				}]);
				this.getView().setModel(oDDT2Model, "TT2Model");
				var oFollowModelOther = dataUtil.createNewJsonModel();
				oFollowModelOther.setData([{
					"key": "TT1_14",
					"text": "Others"
				}, {
					"key": "TT1_ADD",
					"text": "Transfer to Acceptable Deferred Defects Log"
				}]);
				this.getView().setModel(oFollowModelOther, "FollowOtherModel");

				var oFollowModelOPS = dataUtil.createNewJsonModel();
				oFollowModelOPS.setData([{
					"key": "TT1_11",
					"text": "OPS Check"
				}, {
					"key": "TT1_AD",
					"text": "Transfer to Acceptable Deferred Defects Log"
				}]);
				this.getView().setModel(oFollowModelOPS, "FollowOPSModel");
				var oModelSr = dataUtil.createNewJsonModel();
				this.getView().setModel(oModelSr, "SerialNumModel");
				var oModel = dataUtil.createJsonModel("model/aircraftInfo.json");
				this.getView().setModel(oModel, "DDModel");
				this._fnGetUtilisationDefaultVal();
				this.getRouter().getRoute("CosDefectsSummary").attachPatternMatched(this._handleRouteMatched, this);
				var sAirId = that.getAircraftId();
				that._fnWorkCenterGet(sAirId);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onInit function");

			}
		},
		/* Function: onItemSelectOutstanding
		 * Parameter: oEvent
		 * Description: Function call when item is selected for outstanding task table
		 */
		onNavBackPrevious: function() {
			this.onNavBack();
		},

		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		/* Function: onRelatedJobPress
		 * Parameter:oEvent
		 * Description: Function to navigate to related job
		 */
		onRelatedJobPress: function(oEvent) {
			try {
				var oPrmJobDue = {};
				var that = this;
				var sJobId = oEvent.getSource().getText();
				oPrmJobDue.filter = "jobid" + FilterOpEnum.EQ + sJobId + "&tailid" + FilterOpEnum.EQ + this.getTailId();
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					if (oData && oData.results && oData.results.length > 0) {
						var sFlag = oData.results[0].jstat === "X" ? "N" : "Y";
						that.getRouter().navTo("CosDefectsSummary", {
							"JobId": sJobId,
							"Flag": sFlag
						});
					}
				};

				ajaxutil.fnRead(this.getResourceBundle().getText("DEFECTJOBSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobDetailsGet function");
			}

		},

		//------------------------------------------------------------------
		// Function: _fnMultiTradmanGet
		// Parameter: sTaskId
		// Description: This will get called, when to get involved trademans data.
		//Table: TUSER
		//------------------------------------------------------------------
		_fnMultiTradmanGet: function(sTaskId) {
			try {
				var that = this,
					oPrmTD = {};
				//		oPrmTD.filter = "TASKID eq " + sTaskId;
				oPrmTD.filter = "TASKID" + FilterOpEnum.EQ + sTaskId + "&tailid" + FilterOpEnum.EQ + this.getTailId();
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TUserModel");
					var aResults = oData.results;
					var sTrads = "";
					for (var i in aResults) {
						if (parseInt(i, 10) === 0) {
							sTrads = aResults[i].usrid;
						} else {
							sTrads = sTrads + ", " + aResults[i].usrid;
						}
					}
					that.getModel("TUserModel").setProperty("/sTrads", sTrads);
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("CRETUSERSVC"), oPrmTD);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnMultiTradmanGet function");

			}
		},
		/* Function: _fnJobDueGet
		 * Parameter: 
		 * Description: Function to populate job due dropdown
		 */
		_fnJobDueGet: function(sAir) {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid" + FilterOpEnum.EQ + that.getAircraftId() + "&ddid" + FilterOpEnum.EQ + "JDU";

				oPrmJobDue.error = function() {};

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
		/* Function: onRaiseScheduleConcessionPress
		 * Parameter: 
		 * Description: Function call when job's scheduled is raised
		 */
		onRaiseScheduleConcessionPress: function() {
			try {
				var that = this,
					oPayload, oModel, oJobModel,
					oPrmSchJob = {};
				try {
					oModel = this.getView().getModel("RSModel").getData();
				} catch (e) {
					oModel = "";
				}

				oJobModel = this.getView().getModel("JobModel");
				oPayload = {
					"JOBID": oJobModel.getProperty("/jobid"),
					"TAILID": that.getTailId(),
					"SCONFLAG": "E",
					"JDUID": "",
					"JDUTXT": oJobModel.getProperty("/jdutxt"),
					"JDUVL": ""
				};

				if (oModel.DueBy === "JDU_10") {
					oPayload.JDUVL = oModel.ExpDate;
					oPayload.JDUID = oModel.DueBy;
				} else {
					oPayload.JDUID = oModel.DueBy;
					oPayload.JDUVL = (oModel.UtilVal).toString();
				}

				oPrmSchJob.error = function() {};
				oPrmSchJob.success = function(oData) {
					this.getRouter().navTo("Cosjobs", {
						State: "SCH"
					});
				}.bind(this);
				oPrmSchJob.activity = 2;
				ajaxutil.fnUpdate(this.getResourceBundle().getText("RAISESCHSVC"), oPrmSchJob, [oPayload], "ZRM_COS_JB", this);
			} catch (e) {
				Log.error("Exception in onRaiseScheduleConcessionPress function");
			}
		},
		/* Function: _fnGetUtilisationSched
		 * Parameter: 
		 * Description: Function call when to get Schedule utilization default values.
		 */
		_fnGetUtilisationSched: function() {
			try {
				var that = this,
					sDate = null,
					aData = this.getModel("JobModel").getData(),
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
						var min = 0;
						/*if (this.oObject && this.oObject[aData.jduid] && this.oObject[aData.jduid].VALUE) {
							min = parseFloat(this.oObject[aData.jduid].VALUE);
						}*/
						if (aData.jduid === "JDU_10") {
							//min = new Date(aData.jduvl);
							sDate = new Date(aData.jduvl);

						} else {
							min = parseFloat(this.oObject[aData.jduid].VALUE);
						}
						var data = {
							"DueBy": aData.jduid,
							"ExpDate": sDate,
							"Util": "",
							"UtilVal": aData.jduvl,
							"ExpDateFlag": aData.jduid === 'JDU_10' ? true : false,
							"UtilValFlag": aData.jduid !== 'JDU_10' ? true : false,
							"UM": "",
							"minVal": min,
							"minDT": sDate

						};
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

		/* Function: _fnGetUtilisation
		 * Parameter:
		 * Description: function to populate utilisation drop down
		 */
		_fnGetUtilisation: function(obj) {
			try {
				var oPrmJobDue = {};
				//	oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + this.getAircraftId() + " and JDUID eq SORTI";
				oPrmJobDue.filter = "TAILID" + FilterOpEnum.EQ + this.getTailId() + FilterOpEnum.AND + "refid" + FilterOpEnum.EQ + this.getAircraftId() +
					FilterOpEnum.AND + "JDUID" + FilterOpEnum.EQ + "SORTI";
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.oObject = {};
						for (var i in oData.results) {
							this.oObject[oData.results[i].JDUID] = oData.results[i];
						}
						if (this._oEditSORT) {
							if (this.oObject && this.oObject[obj.MON_FOR] && this.oObject[obj.MON_FOR].VALUE) {
								var minVal = parseFloat(this.oObject[obj.MON_FOR].VALUE, [10]);
								this._oEditSORT.getModel("SORTSet").setProperty("/SORMinCNT", minVal);
							}
						}
					}
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("UTILISATIONDUESVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnGetUtilisation function");
			}
		},
		/* Function: _fnUtilization2Get
		 * Parameter:
		 * Description: function to populate utilisation 2 drop down
		 */
		_fnUtilization2Get: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				/*oPrmJobDue.filter = "airid eq " + this.getAircraftId() + " and ddid eq UTIL2_";*/
				//	oPrmJobDue.filter = "ddid eq UTIL2_";
				oPrmJobDue.filter = "ddid" + FilterOpEnum.EQ + "UTIL2_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "Utilization2CBModel");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDVALSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnUtilization2Get function");

			}
		},

		//------------------------------------------------------------------
		// Function: _fnMultiTradmanJobGet
		// Parameter: sJObId
		// Description: This will get called, when to get involved trademans data.
		//Table: TUSER
		//------------------------------------------------------------------
		_fnMultiTradmanJobGet: function(sJobId) {
			try {
				var that = this,
					oPrmTD = {};
				//	oPrmTD.filter = "JOBID eq " + sJobId;
				oPrmTD.filter = "JOBID" + FilterOpEnum.EQ + sJobId + "&tailid" + FilterOpEnum.EQ + this.getTailId();
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TUserJobModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("CRETUSERSVC"), oPrmTD);
			} catch (e) {
				Log.error("Exception in _fnMultiTradmanJobGet function");
			}
		},
		//------------------------------------------------------------------
		// Function: onUndoSignOff
		// Parameter: oEvent
		// Description: This will get called, when to undo signoff from supervisor information details dialog.
		//Table: TASK
		//------------------------------------------------------------------

		onUndoSignOff: function(oEvent) {
			try {
				var that = this,
					oObj, oTempObj, oErroFlag = false,
					oPrmTask = {},
					oPayload = [],
					oErrorArray = [],
					oViewModel = that.getView().getModel("LocalModel"),
					oTable = that.getView().byId("tbWcPendingSuperId");
				if (oTable.getSelectedItems().length !== 0) {
					for (var i = 0; i < oTable.getSelectedItems().length; i++) {
						oObj = oTable.getSelectedItems()[i].getBindingContext("TaskPendingModel").getObject();
						oTempObj = this._fnGetObjectTypeAndActivity(oObj.tt1id);
						/*oObj.objectid = oTempObj.obj;
						oObj.activity = oTempObj.Act;*/
						oObj.objectid = "ZRM_COS_TT";
						oObj.activity = "4";
						oObj.symbol = "0";
						oObj.tstat = "C";
						oPayload.push(oObj);
					}
					oPrmTask.filter = "";
					oPrmTask.error = function() {

					};
					oPrmTask.success = function(oData) {
						for (var j = 0; j < oData.results.length; j++) {
							if (oData.results[j].errormsg !== "" && oData.results[j].errormsg !== null) {
								oErrorArray.push({
									"taskId": oData.results[j].tdesc,
									"errormsg": oData.results[j].errormsg,
									"tType": oData.results[j].tt1id,
									"tTempId": oData.results[j].tmpid
								});
								oErroFlag = true;
							}
						}

						if (oErroFlag) {
							that.onOpenErrorDialog(oErrorArray);
							this.getView().byId("itbTaskId").setSelectedKey("SP");
						} else {
							this.getView().byId("itbTaskId").setSelectedKey("OS");
						}
						that.onPendingSupDetailsClose();
						that._fnTaskStatusGet(oViewModel.getProperty("/sJobId"));
						that._fnTasksOutStandingGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						that._fnTasksCompleteGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						that._fnTasksPendingSupGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						this.byId("pageSummaryId").scrollTo(0);
					}.bind(this);
					oPrmTask.activity = 4;
					oPrmTask.title = "Supervisor Sign Off";
					ajaxutil.fnUpdate(this.getResourceBundle().getText("TASKSVC"), oPrmTask, oPayload, "dummy", this);
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

			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetTaskDropDown
		// Parameter: 
		// Description: This will get called, when to get sub task TT2 type for dropdown from backend.
		//Table: TTYPE
		//------------------------------------------------------------------
		_fnGetTaskDropDown: function() {
			try {
				var oPrmDD = {},
					oModel,
					that = this,
					oPayload;
				//	oPrmDD.filter = "ttid eq TT2_ and airid eq " + that.getAircraftId();
				oPrmDD.filter = "ttid" + FilterOpEnum.EQ + "TT2_" + FilterOpEnum.AND + "airid" + FilterOpEnum.EQ + that.getAircraftId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					this.getView().setModel(oModel, "TaskListModel");
					this._fnGetTaskDescDropDown();
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKTYPESVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in _fnGetTaskDropDown function");
			}
		},

		//------------------------------------------------------------------
		// Function: _fnGetTaskDescDropDown
		// Parameter: 
		// Description: This will get called, when to get sub task TT3 type for dropdown from backend.
		//Table: TTYPE
		//------------------------------------------------------------------
		_fnGetTaskDescDropDown: function() {
			try {
				var oPrmDD = {},
					oModel,
					that = this,
					oPayload;
				//	oPrmDD.filter = "ttid eq TT3_ and airid eq " + that.getAircraftId();
				oPrmDD.filter = "ttid" + FilterOpEnum.EQ + "TT3_" + FilterOpEnum.AND + "airid" + FilterOpEnum.EQ + that.getAircraftId();
				oPrmDD.error = function() {};
				oPrmDD.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TaskDescModel");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKTYPESVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in _fnGetTaskDescDropDown function");
			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetTaskTT310DropDown
		// Parameter: 
		// Description: This will get called, when to get sub task TT3_10 type for dropdown from backend.
		//Table: TTYPE and TT34
		//------------------------------------------------------------------
		_fnGetTaskTT310DropDown: function() {
			try {
				var oPrmDD = {},
					oModel,
					that = this,
					oPayload;
				//	oPrmDD.filter = "ttid eq TT3_10 and tflag eq X and airid eq " + that.getAircraftId();
				oPrmDD.filter = "ttid" + FilterOpEnum.EQ + "TT3_10" + FilterOpEnum.AND + "tflag" + FilterOpEnum.EQ + "X" + FilterOpEnum.AND +
					"airid" + FilterOpEnum.EQ + that.getAircraftId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TT310Model");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKTYPESVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in _fnGetTaskTT310DropDown function");
			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetTaskTT311DropDown
		// Parameter: 
		// Description: This will get called, when to get sub task TT3_11 type for dropdown from backend.
		//Table: TTYPE and TT34
		//------------------------------------------------------------------
		_fnGetTaskTT311DropDown: function() {
			try {
				var oPrmDD = {},
					oModel,
					that = this,
					oPayload;
				oPrmDD.filter = "ttid eq TT3_11 and tflag eq X and airid eq " + that.getAircraftId();
				oPrmDD.filter = "ttid" + FilterOpEnum.EQ + "TT3_11" + FilterOpEnum.AND + "tflag" + FilterOpEnum.EQ + "X" + FilterOpEnum.AND +
					"airid" + FilterOpEnum.EQ + that.getAircraftId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TT311Model");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKTYPESVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in _fnGetTaskTT311DropDown function");
			}
		},
		//------------------------------------------------------------------
		// Function: onSignOffTask
		// Parameter: oEvent
		// Description: This will get called, when to signoff from Pending supervisor table view.
		//Table: TASK
		//------------------------------------------------------------------
		onSignOffTask: function() {
			try {
				var that = this,
					oErroFlag = false,
					oTempObj,
					oPrmTask = {},
					oObj,
					oPayload = [],
					oErrorArray = [],
					oViewModel = that.getView().getModel("LocalModel"),
					oTable = that.getView().byId("tbWcPendingSuperId");
				if (oTable.getSelectedItems().length !== 0) {
					for (var i = 0; i < oTable.getSelectedItems().length; i++) {
						oObj = oTable.getSelectedItems()[i].getBindingContext("TaskPendingModel").getObject();
						oTempObj = this._fnGetObjectTypeAndActivity(oObj.tt1id);
						oObj.tstat = "X";
						oObj.objectid = oTempObj.obj;
						oObj.activity = oTempObj.Act;
						oObj.symbol = "0";
						oPayload.push(oObj);
					}
					oPrmTask.filter = "";
					oPrmTask.error = function(oData) {};
					oPrmTask.success = function(oData) {

						for (var j = 0; j < oData.results.length; j++) {
							if (oData.results[j].errormsg !== "" && oData.results[j].errormsg !== null) {
								oErrorArray.push({
									"taskId": oData.results[j].tdesc,
									"errormsg": oData.results[j].errormsg,
									"tType": oData.results[j].tt1id,
									"tTempId": oData.results[j].tmpid
								});
								oErroFlag = true;
							}
						}

						if (oErroFlag) {
							that.onOpenErrorDialog(oErrorArray);
							this.getView().byId("itbTaskId").setSelectedKey("SP");
						} else {
							this.getView().byId("itbTaskId").setSelectedKey("CM");
						}

						that.onPendingSupDetailsClose();
						that._fnTaskStatusGet(oViewModel.getProperty("/sJobId"));
						that._fnTasksOutStandingGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						that._fnTasksCompleteGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						that._fnTasksPendingSupGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						//this.getView().byId("itbTaskId").setSelectedKey("CM");
						this.byId("pageSummaryId").scrollTo(0);
					}.bind(this);
					oPrmTask.activity = 4;
					oPrmTask.title = "Supervisor Sign Off";
					ajaxutil.fnUpdate(this.getResourceBundle().getText("TASKSVC"), oPrmTask, oPayload, "dummy", this);
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

			}
		},

		//------------------------------------------------------------------
		// Function: _fnTaskStatusGet
		// Parameter: sJobId
		// Description: This will get called, when to get Outstanding and Pending Supervisor tasks count.
		//Table: TASK
		//------------------------------------------------------------------
		_fnTaskStatusGet: function(sJobId) {
			try {
				var that = this,
					oModel = this.getView().getModel("LocalModel"),
					oPrmTaskDue = {};
				//	oPrmTaskDue.filter = "JOBID eq " + sJobId;
				oPrmTaskDue.filter = "JOBID" + FilterOpEnum.EQ + sJobId;
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
				ajaxutil.fnRead(this.getResourceBundle().getText("GETJOBTASKSTATSVC"), oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTaskStatusGet function");

			}
		},

		/* Function: getSerialNoPress
		 * Parameter:oEvent, oFlag
		 * Description: This will get called, to get Serial number for part number.
		 */
		getSerialNoPress: function(oPart) {
			try {
				var oPrmDD = {},
					oModel,
					oModelObj,
					that = this,
					oPayload;
				try {
					oModelObj = this._oSPDetails.getModel("DetailsSupEditModel").getProperty("/partno");
				} catch (e) {
					oModelObj = oPart;
				}
				//	oPrmDD.filter = "ESTAT eq R and PARTNO eq " + oModelObj + " and INSON eq " + this.getTailId();
				oPrmDD.filter = "ESTAT" + FilterOpEnum.EQ + "R" + FilterOpEnum.AND + "PARTNO" + FilterOpEnum.EQ + oModelObj + FilterOpEnum.AND +
					"INSON" + FilterOpEnum.EQ + this.getTailId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					if (oData.results.length !== 0) {
						oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						this.getView().setModel(oModel, "SerialNumModel");

					} else {
						MessageBox.error(
							"Part number is invalid.", {
								icon: sap.m.MessageBox.Icon.Error,
								title: "Error",
								styleClass: "sapUiSizeCompact"
							});
					}
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("GETSERNOSVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in getSerialNoPress function");
			}
		},
		/* Function: getSerialNoPressInstalled
		 * Parameter:oEvent, oFlag
		 * Description: function to retreive serial no for the entered partno
		 */
		getSerialNoPressInstalled: function(oEvent, oFlag) {
			try {
				var oPrmDD = {},
					oModel,
					oModelObj,
					that = this,
					oPayload;
				oModelObj = that._oMGDetails.getModel("ManageTaskModel").getProperty("/partno");
				//	oPrmDD.filter = "ESTAT eq I and PARTNO eq " + oModelObj + " and INSON eq " + this.getTailId();
				oPrmDD.filter = "ESTAT" + FilterOpEnum.EQ + "I" + FilterOpEnum.AND + "PARTNO" + FilterOpEnum.EQ + oModelObj + FilterOpEnum.AND +
					"INSON" + FilterOpEnum.EQ + this.getTailId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					if (oData.results.length !== 0) {
						oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						this.getView().setModel(oModel, "SerialNumModelInstalled");

					} else {
						MessageBox.error(
							"Part number is invalid.", {
								icon: sap.m.MessageBox.Icon.Error,
								title: "Error",
								styleClass: "sapUiSizeCompact"
							});
					}
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("GETSERNOSVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in getSerialNoPress function");
			}
		},
		/* Function: _fnGetUtilisationDefaultVal
		 * Parameter:
		 * Description: function to retreive default values for utilisation
		 */
		_fnGetUtilisationDefaultVal: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("appModel"),
					oPrmJobDue = {};
				//	oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + this.getAircraftId() + " and JDUID eq UTIL";
				oPrmJobDue.filter = "TAILID" + FilterOpEnum.EQ + this.getTailId() + FilterOpEnum.AND + "refid" + FilterOpEnum.EQ + this.getAircraftId() +
					FilterOpEnum.AND + "JDUID" + FilterOpEnum.EQ + "UTIL";
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.oObject = {};
						for (var i in oData.results) {
							this.oObject[oData.results[i].JDUID] = oData.results[i];
						}
					}
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("UTILISATIONDUESVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnGetUtilisationDefaultVal function");
			}
		},
		/* Function: _fnUtilizationGet
		 * Parameter:sAirId
		 * Description: This will get called,to get Utilization drop down data.
		 */
		_fnUtilizationGet: function(sAirId) {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid" + FilterOpEnum.EQ + that.getAircraftId() + "&ddid" + FilterOpEnum.EQ + "UTIL1_";

				oPrmJobDue.error = function() {};
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

		/* Function: _fnGetMainTaskDropDown
		 * Parameter:
		 * Description: General method: This will get called,to get Utilization drop down data.
		 */
		_fnGetMainTaskDropDown: function() {
			try {
				var oPrmDD = {},
					oModel,
					that = this,
					oPayload;
				//	oPrmDD.filter = "ttid eq TT1_ and tflag eq Y and airid eq " + that.getAircraftId();
				oPrmDD.filter = "ttid" + FilterOpEnum.EQ + "TT1_" + FilterOpEnum.AND + "tflag" + FilterOpEnum.EQ + "Y" + FilterOpEnum.AND +
					"airid" + FilterOpEnum.EQ + that.getAircraftId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TaskMainListModel");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKTYPESVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in CosCreateTask:_fnGetMainTaskDropDown function");

			}
		},
		/* Function: _fnReasonforADDGet
		 * Parameter: sAirId
		 * Description: General method: This will get called,to get Readon for ADD drop down data.
		 *Table: DDREF, DDVAL
		 */

		_fnReasonforADDGet: function(sAirId) {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid" + FilterOpEnum.EQ + that.getAircraftId() + "&ddid" + FilterOpEnum.EQ + "CPR_";
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "ReasonforADDModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnReasonforADDGet function");
			}
		},
		/* Function: _fnPerioOfDeferCBGet
		 * Parameter: sAirId
		 * Description: General method: This will get called,to get Period of Deferment drop down data.
		 * Table: DDREF, DDVAL
		 */
		_fnPerioOfDeferCBGet: function(sAirId) {
			try {
				var that = this,
					oModel,
					oModelView = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				/*oPrmJobDue.filter = "airid eq " + sAirId + " and ddid eq 118_";*/
				//	oPrmJobDue.filter = "ddid eq 118_"; //Rahul: 03/12/2020 06.11PM: Filter parameter changed
				oPrmJobDue.filter = "ddid" + FilterOpEnum.EQ + "118_";
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "PerioOfDeferCBModel");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDVALSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnPerioOfDeferCBGet function");
			}
		},
		/* Function: onSelTasksGet
		 * Parameter:
		 * Description: Private method: This will get called, to get data fro selected tasks.
		 *Table: TASK
		 */
		//Rahul: 03/12/2020 06.11PM: new parameter added oFlagEv
		onSelTasksGet: function(oFlagEv, oEvent) {
			try {
				var that = this,
					filters = [],
					oModel,
					oObj,
					sFilter, bFlag = true,
					oPrmJobDue = {};
				if (oFlagEv === "SUP") {
					oObj = oEvent.getSource().getBindingContext("TaskPendingModel").getObject();
				} else {
					oObj = oEvent.getSource().getBindingContext("TaskCompleteModel").getObject();
				}
				oEvent.getSource().setSelected(true);
				//	sFilter = "taskid eq " + oObj.taskid;
				sFilter = "taskid" + FilterOpEnum.EQ + oObj.taskid + "&tailid" + FilterOpEnum.EQ + this.getTailId();
				oPrmJobDue.filter = sFilter;
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					that.onPendingSupDetailsPress(oData.results[0], oFlagEv); //Rahul: 03/12/2020 06.11PM: New Parameter added "oFlagEv"
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETSELTASKSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnTasksGet function");
			}
		},
		/* Function: onSelTasksGetComplete
		 * Parameter:
		 * Description: Private method: This will get called, to get data fro selected tasks.
		 *Table: TASK
		 */
		onSelTasksGetComplete: function(oEvent) {
			try {
				var that = this,
					filters = [],
					oModel,
					oObj = oEvent.getSource().getSelectedContexts()[0].getObject(),
					sFilter, bFlag = true,
					oPrmJobDue = {};
				//oEvent.getSource().setSelected(true);
				//	sFilter = "taskid eq " + oObj.taskid;
				sFilter = "taskid" + FilterOpEnum.EQ + oObj.taskid + "&tailid" + FilterOpEnum.EQ + this.getTailId();
				oPrmJobDue.filter = sFilter;
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					that.onCompleteDetailsPress(oData.results[0]);
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETSELTASKSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnTasksGet function");
			}
		},

		//------------------------------------------------------------------
		// Function: _fnTaskStatusGet
		// Parameter: sJobId
		// Description: This will get called, when to get Outstanding and Pending Supervisor tasks count.
		//Table: TASK
		//------------------------------------------------------------------
		/*	_fnTailStatusGet: function(sTailId) {
				try {
					var that = this,
						oSummaryModel, oLocalModel = this.getView().getModel("LocalModel"),
						oPrmTaskDue = {};
					oPrmTaskDue.filter = "TAILID eq " + sTailId;
					oPrmTaskDue.error = function() {};
					oPrmTaskDue.success = function(oData) {
						try {
							var bTailStatus = this._fnCheckStatus(oData.results[0].ASTID);
							if (bTailStatus) {
								oSummaryModel = that.getView().getModel("SummaryModel");
								oSummaryModel.setProperty("/FAIRStatusText", 'ACTIVATED');
								oLocalModel.setProperty("/FairEditFlag", false);
							} else {
								oLocalModel.setProperty("/FairEditFlag", true);
							}
						} catch (e) {
							Log.error("Exception in oGBAppModel FAIR STATUS function");
						}
					}.bind(this);
					ajaxutil.fnRead(this.getResourceBundle().getText("GETTAILSTATUSSVC"), oPrmTaskDue);
				} catch (e) {
					Log.error("Exception in _fnTailStatusGet function");
				}
			},*/
		_fnTailStatusGet: function(sTailId) {
			try {
				var that = this,
					oSummaryModel = that.getView().getModel("SummaryModel"),
					oLocalModel = this.getView().getModel("LocalModel"),
					oJobModel = this.getView().getModel("JobModel"),
					oPrmTaskDue = {};
				//	oPrmTaskDue.filter = "TAILID eq " + sTailId;
				oPrmTaskDue.filter = "TAILID" + FilterOpEnum.EQ + sTailId;
				oPrmTaskDue.error = function() {};
				oPrmTaskDue.success = function(oData) {
					try {
						var bTailStatus = formatter.CheckTailStatus(oData.results[0].ASTID);
						if (!bTailStatus) {

							/*oSummaryModel.setProperty("/FAIRStatusText", 'ACTIVATED');
							oLocalModel.setProperty("/FairEditFlag", false);*/
							if (oJobModel.getProperty("/fstat") === 'A') {
								oLocalModel.setProperty("/FairEditFlag", false);
								oLocalModel.setProperty("/FairEditBtnFlag", true);
								oSummaryModel.setProperty("/MenuScheduleVisible", false); //Rahul: 18/11/2020: 10:24 AM : Menu item visiblity check added.
								oSummaryModel.setProperty("/FAIRStatusText", "ACTIVATED");
								oSummaryModel.setProperty("/FAIRStatus", "Error");
							} else if (oJobModel.getProperty("/fstat") === 'R' || oJobModel.getProperty("/fstat") === 'U') {
								oLocalModel.setProperty("/FairEditFlag", false);
								oLocalModel.setProperty("/FairEditBtnFlag", false);
							} else if (oJobModel.getProperty("/fstat") === 'C') {
								//oViewModel.setProperty("/FairEditFlag", false);
								oSummaryModel.setProperty("/FAIRStatus", "Error");
							} else if (oJobModel.getProperty("/fstat") === "" || oJobModel.getProperty("/fstat") === null) {
								oLocalModel.setProperty("/FairEditFlag", bTailStatus);
								oLocalModel.setProperty("/FairEditBtnFlag", false);
							}
						} else {
							oLocalModel.setProperty("/FairEditFlag", true);
						}
						oLocalModel.updateBindings(true);
						oLocalModel.refresh(true);
					} catch (e) {
						Log.error("Exception in oGBAppModel FAIR STATUS function");
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETTAILSTATUSSVC"), oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in _fnTailStatusGet function");
			}
		},
		/* Function: onEditTaskSignOff
		 * Parameter:
		 * Description: This will get called, when click of Sign Off button.
		 * on click of Sign Off button
		 *Table: TASK
		 */
		onEditTaskSignOff: function(oFlag) {
			try {
				var that = this,
					oTempObj, oFrag, oErrorArray = [],
					oModel,
					sObject,
					oViewModel = that.getView().getModel("LocalModel"),
					oPrmTask = {},
					oPayload = [];

				if (oFlag === "ED") {
					oModel = this._oSPDetails.getModel("DetailsSupEditModel");
					FieldValidations.resetErrorStates(this);
					if (FieldValidations.validateFields(this, that._oSPDetails, true)) {
						return;
					}
				} else {
					oModel = that._oSupDetails.getModel("DetailsSupModel");
				}
				oPayload = oModel.getData();
				oPayload.tstat = "X";
				if (oPayload.expdt !== null && oPayload.expdt !== "") {
					try {
						oPayload.expdt = formatter.defaultOdataDateFormat(oPayload.expdt);
					} catch (e) {
						oPayload.expdt = oPayload.expdt;
					}
				} else {
					oPayload.expdt = "";
				}

				try {
					if (oPayload.utilvl) {
						var iPrecision = formatter.JobDueDecimalPrecision(oPayload.util1);
						oPayload.utilvl = parseFloat(oPayload.utilvl, [10]).toFixed(iPrecision);
					}

				} catch (e) {
					oPayload.utilvl = oPayload.utilvl;
				}
				oTempObj = this._fnGetObjectTypeAndActivity(oPayload.tt1id);
				oPayload.objectid = oTempObj.obj;
				oPayload.activity = oTempObj.Act;
				/*oPayload.objectid = "ZRM_COS_TP";
				oPayload.activity = "2";*/
				oPayload.symbol = "0";
				oPrmTask.filter = "";
				oPrmTask.error = function() {};
				oPrmTask.success = function(oData) {

					if (oData.results[0].errormsg !== "" && oData.results[0].errormsg !== null) {
						oErrorArray.push({
							"taskId": oData.results[0].tdesc,
							"errormsg": oData.results[0].errormsg,
							"tType": oData.results[0].tt1id,
							"tTempId": oData.results[0].tmpid
						});
						that.onOpenErrorDialog(oErrorArray);
						//this.getView().byId("itbTaskId").setSelectedKey("SP");
					} else {
						this.getView().byId("itbTaskId").setSelectedKey("CM");
					}

					that._fnTaskStatusGet(oViewModel.getProperty("/sJobId"));
					this.onPendingSupEditDetailsClose();
					this.onPendingSupDetailsClose();
					that._fnTasksOutStandingGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
					that._fnTasksCompleteGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
					that._fnTasksPendingSupGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
					//this.getView().byId("itbTaskId").setSelectedKey("CM");
				}.bind(this);

				sObject = "dummy";
				oPrmTask.activity = "4";
				oPrmTask.title = "Supervisor Sign Off";
				ajaxutil.fnUpdate(this.getResourceBundle().getText("GETSELTASKSVC"), oPrmTask, [oPayload], sObject, this);
			} catch (e) {
				Log.error("Exception in onSignOff function");
			}
		},

		/*onEditTaskDetails: function(oEvent) {
			try {
				this.getView().getModel("LocalModel").setProperty("/bSuperDiaFlag", true);
				this.getView().getModel("LocalModel").refresh();
			} catch (e) {
				Log.error("Exception in onEditTaskDetails function");
			}
		},*/
		//------------------------------------------------------------------
		// Function: _fnTasksOutStandingGet
		// Parameter: sJobId, sWrctr
		// Description: This will get called, when to get Outstanding tasks for selected job from database.
		//Table: TASK
		//------------------------------------------------------------------
		_fnTasksOutStandingGet: function(sJobId, sWrctr) {
			try {
				var that = this,
					oLocalModel = this.getView().getModel("LocalModel"),
					oPrmTask = {};
				//	oPrmTask.filter = "jobid eq " + sJobId + " and TSTAT eq C and WRCTR eq " + sWrctr;
				oPrmTask.filter = "jobid" + FilterOpEnum.EQ + sJobId + FilterOpEnum.AND + "TSTAT" + FilterOpEnum.EQ + "C" + FilterOpEnum.AND +
					"WRCTR" + FilterOpEnum.EQ + sWrctr + "&tailid" + FilterOpEnum.EQ + this.getTailId();
				oPrmTask.error = function() {

				};

				oPrmTask.success = function(oData) {
					var oModel = new JSONModel({});
					oModel.setSizeLimit(1000);
					var aData = oData.results;
					for (var i in aData) {
						aData[i].timeVal = formatter.getTimeValueForDate(aData[i], "credtm", "creuzt");
						aData[i].taskTypeText = formatter.taskTemplateCheck(aData[i].RTTY);
					}
					oModel.setData(aData);
					oLocalModel.setProperty("/OutstandingCount", aData.length);
					that.getView().setModel(oModel, "TaskOutModel");
					this._fnTaskCount();
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKSVC"), oPrmTask);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTasksOutStandingGet function");

			}
		},

		//------------------------------------------------------------------
		// Function: onUpdateTaskPress
		// Parameter: oEvent
		// Description: This will get called, when to undo signoff from supervisor information details dialog.
		//Table: TASK
		//------------------------------------------------------------------
		onUpdateTaskPress: function(oEvent) {
			try {
				var that = this,
					sObject,
					oFlag = true,
					oTempSym,
					oObj, oTempObj, oErroFlag = false,
					oPrmTask = {},
					oPayload,
					oErrorArray = [],
					oViewModel = that.getView().getModel("LocalModel");

				oPayload = this._oMGDetails.getModel("ManageTaskModel").getData();

				if (oPayload.tt1id === "TT1_10" && oPayload.tt2id === "TT2_10") {
					if (oPayload.engflag !== "NA" && oPayload.engflag !== "") {
						oFlag = true;
					} else {
						MessageBox.error(
							"Please select request type 'Engine' or 'Non-Engine'", {
								icon: sap.m.MessageBox.Icon.Error,
								title: "Error",
								styleClass: "sapUiSizeCompact"
							});
						oFlag = false;
					}
				}
				if (oPayload.tt1id !== "TT1_99") {
					oPayload.ftdesc = "";
					oPayload.ENTINERR = "";
				}
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this, that._oMGDetails, true)) {
					return;
				}
				if (oFlag) {
					//oTempSym = that._fnSetSymbol(oPayload.tt1id, oPayload.symbol);
					oPayload.symbol = "0";
					if ((oPayload.cdesc !== "" && oPayload.cdesc !== null) && oPayload.tt1id !== "TT1_99") {
						oPayload.tdesc = oPayload.cdesc;
					}
					if (oPayload.isser === "Batch No.") {
						oPayload.tt2id = "TT2_15";
					}
					/*else if (oPayload.isser === "Serial No. (S/N)") {
						oPayload.tt2id = "TT2_10";
					}*/
					oTempObj = this._fnGetObjectTypeAndActivity(oPayload.tt1id);
					oPrmTask.filter = "";
					oPrmTask.error = function() {};
					oPrmTask.success = function(oData) {
						that.onMangeTaskPressClose();
						that.onAllOutStandingDetailsClose();
						for (var j = 0; j < oData.results.length; j++) {
							if (oData.results[j].errormsg !== "" && oData.results[j].errormsg !== null) {
								oErrorArray.push({
									"taskId": oData.results[j].tdesc,
									"errormsg": oData.results[j].errormsg,
									"tType": oData.results[j].tt1id,
									"tTempId": oData.results[j].tmpid
								});
								oErroFlag = true;
							}
						}
						this.getView().byId("itbTaskId").setSelectedKey("OS");
						that._fnTaskStatusGet(oViewModel.getProperty("/sJobId"));
						that._fnTasksOutStandingGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						that._fnTasksCompleteGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						that._fnTasksPendingSupGet(oViewModel.getProperty("/sJobId"), oViewModel.getProperty("/WorkCenterKey"));
						this.byId("pageSummaryId").scrollTo(0);
					}.bind(this);
					/*	sObject = oTempObj.obj;
						oPrmTask.activity = oTempObj.Act;*/
					sObject = "ZRM_COS_TT";
					oPrmTask.activity = "4";
					oPrmTask.title = "Tradesman Sign Off";
					ajaxutil.fnUpdate(this.getResourceBundle().getText("TASK1SVC"), oPrmTask, [oPayload], sObject, this);
				}
			} catch (e) {
				Log.error("Exception in onUpdateTaskPress function");
			}
		},
		//------------------------------------------------------------------
		// Function: _fnTasksPendingSupGet
		// Parameter: sJobId, sWrctr
		// Description: This will get called, when to get Pending Supervisor tasks for selected job from database.
		//Table: TASK
		//------------------------------------------------------------------
		_fnTasksPendingSupGet: function(sJobId, sWrctr) {
			try {
				var that = this,
					oLocalModel = this.getView().getModel("LocalModel"),
					oPrmTask = {};
				//	oPrmTask.filter = "jobid eq " + sJobId + " and TSTAT eq P and WRCTR eq " + sWrctr;
				oPrmTask.filter = "jobid" + FilterOpEnum.EQ + sJobId + FilterOpEnum.AND + "TSTAT" + FilterOpEnum.EQ + "P" + FilterOpEnum.AND +
					"WRCTR" + FilterOpEnum.EQ + sWrctr + "&tailid" + FilterOpEnum.EQ + this.getTailId();
				oPrmTask.error = function() {

				};

				oPrmTask.success = function(oData) {
					var oModel = new JSONModel({});
					oModel.setSizeLimit(1000);
					var aData = oData.results;
					for (var i in aData) {
						aData[i].createTimeVal = formatter.getTimeValueForDate(aData[i], "credtm", "creuzt");
						aData[i].closeTimeVal = formatter.getTimeValueForDate(aData[i], "ftcredt", "ftcretm");
						aData[i].taskTypeText = formatter.taskTemplateCheck(aData[i].RTTY);
					}
					oModel.setData(aData);
					oLocalModel.setProperty("/PendingSupCount", aData.length);
					that.getView().setModel(oModel, "TaskPendingModel");
					this._fnTaskCount();
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKSVC"), oPrmTask);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTasksPendingSupGet function");

			}
		},
		//------------------------------------------------------------------
		// Function: _fnTasksCompleteGet
		// Parameter: sJobId, sWrctr
		// Description: This will get called, when to get Completed tasks for selected job from database.
		//Table: TASK
		//------------------------------------------------------------------
		_fnTasksCompleteGet: function(sJobId, sWrctr) {
			try {
				var that = this,
					oLocalModel = this.getView().getModel("LocalModel"),
					oPrmTask = {};
				//	oPrmTask.filter = "jobid eq " + sJobId + " and TSTAT eq X and WRCTR eq " + sWrctr;
				oPrmTask.filter = "jobid" + FilterOpEnum.EQ + sJobId + FilterOpEnum.AND + "TSTAT" + FilterOpEnum.EQ + "X" + FilterOpEnum.AND +
					"WRCTR" + FilterOpEnum.EQ + sWrctr + "&tailid" + FilterOpEnum.EQ + this.getTailId();
				oPrmTask.error = function() {

				};

				oPrmTask.success = function(oData) {
					var oModel = new JSONModel({});
					oModel.setSizeLimit(1000);
					var aData = oData.results;
					for (var i in aData) {
						aData[i].createTimeVal = formatter.getTimeValueForDate(aData[i], "credtm", "creuzt");
						aData[i].closeTimeVal = formatter.getTimeValueForDate(aData[i], "ftcredt", "ftcretm");
						aData[i].taskTypeText = formatter.taskTemplateCheck(aData[i].RTTY);
					}
					oModel.setData(aData);
					oLocalModel.setProperty("/CompleteCount", aData.length);
					that.getView().setModel(oModel, "TaskCompleteModel");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKSVC"), oPrmTask);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTasksCompleteGet function");

			}
		},
		//------------------------------------------------------------------
		// Function: _fnFlyingRequirementsGet
		// Parameter: sJobId, sWrctr
		// Description: This will get called, when to get Flying Requirements records for selected job from database.
		//Table: FR
		//------------------------------------------------------------------
		_fnFlyingRequirementsGet: function(sJobId, sWrctr) {
			try {
				var that = this,
					oPrmFR = {};
				//	oPrmFR.filter = "jobid eq " + sJobId + " and WRCTR eq " + sWrctr;
				oPrmFR.filter = "jobid" + FilterOpEnum.EQ + sJobId + FilterOpEnum.AND + "WRCTR" + FilterOpEnum.EQ + sWrctr + "&tailid" +
					FilterOpEnum.EQ + this.getTailId();
				oPrmFR.error = function() {

				};

				oPrmFR.success = function(oData) {
					var oModel = new JSONModel({});
					var aData = oData.results;
					for (var i in aData) {
						aData[i].timeVal = formatter.getTimeValueForDate(aData[i], "FR_DT", "FR_TM");
					}
					oModel.setData(aData);
					that.getView().setModel(oModel, "FRModel");
					this._fnTaskCount();
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("FLYINGREQUIREMENTSVC"), oPrmFR);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnFlyingRequirementsGet function");

			}
		},
		//------------------------------------------------------------------
		// Function: onFlyingRequirementUpdate
		// Parameter: oEvent
		// Description: This will get called, when to update selected Flying Requirements record in database.
		//Table: FR
		//------------------------------------------------------------------
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
				oParameter.activity = 4;
				ajaxutil.fnUpdate(this.getResourceBundle().getText("FLYINGREQUIREMENTSVC"), oParameter, [oPayload], "dummy", this);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onFlyingRequirementUpdate function");

			}
		},
		//------------------------------------------------------------------
		// Function: onFlyingRequirementDelete
		// Parameter: oObj
		// Description: This will get called, when to delete selected Flying Requirements record in database.
		//Table: FR
		//------------------------------------------------------------------
		onFlyingRequirementDelete: function(oObj) {
			try {
				var that = this,
					oPrmFR = {},
					oModel = this.getView().getModel("LocalModel");
				var sPath = this.getResourceBundle().getText("FLYINGREQUIREMENTSVC") +
					"?JOBID" + FilterOpEnum.EQ + oObj.JOBID + "&TAILID" + FilterOpEnum.EQ + oObj.TAILID + "&FR_NO" + FilterOpEnum.EQ + oObj.FR_NO;
				oPrmFR.error = function() {};
				oPrmFR.success = function(oData) {
					var oTable = this.getView().byId("tbWcFlyingReqId");
					oTable.removeSelections(true);
					that._fnFlyingRequirementsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/WorkCenterKey"));
				}.bind(this);
				oPrmFR.activity = 4;
				ajaxutil.fnDelete(sPath, oPrmFR, "dummy", this);
			} catch (e) {
				Log.error("Exception in onFlyingRequirementDelete function");
			}
		},
		//------------------------------------------------------------------
		// Function: _fnSortieMonitoringGet
		// Parameter: sJobId, sWrctr
		// Description: This will get called, when to get Sortie monitoring records from database.
		//Table: SORT
		//------------------------------------------------------------------
		_fnSortieMonitoringGet: function(sJobId, sWrctr) {
			try {
				var that = this,
					oPrmFR = {};
				//	oPrmFR.filter = "jobid eq " + sJobId + " and WRCTR eq " + sWrctr;
				oPrmFR.filter = "jobid" + FilterOpEnum.EQ + sJobId + FilterOpEnum.AND + "WRCTR" + FilterOpEnum.EQ + sWrctr + "&tailid" +
					FilterOpEnum.EQ + this.getTailId();
				oPrmFR.error = function() {};

				oPrmFR.success = function(oData) {
					/*	if (oData && oData.results.length > 0) {*/
					var oModel = new JSONModel({});
					var aData = [];
					for (var i in oData.results) {
						aData[i] = oData.results[i];
						var temp = oData.results[i].SORCNT.split("@");
						aData[i].SORCNT = temp[0];
						aData[i].SORTEXT = temp[1];
						aData[i].timeVal = formatter.getTimeValueForDate(aData[i], "SORDT", "SORTM");
					}

					oModel.setData(aData);
					that.getView().setModel(oModel, "SRMModel");
					/*that.getModel().updateBindings(true);*/
					/*	}*/

				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("SORTIEMONSVC"), oPrmFR);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnSortieMonitoringGet function");

			}
		},
		//------------------------------------------------------------------
		// Function: onSortieMonitoringUpdate
		// Parameter: oEvent
		// Description: This will get called, when to update selected Flying Requirements record in database.
		//Table: SORT
		//------------------------------------------------------------------
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
				if (oPayload.SORCNT && oPayload.MON_FOR !== "SORTI_5") {
					var iPrec = formatter.JobDueDecimalPrecision(oPayload.MON_FOR);
					oPayload.SORCNT = parseFloat(oPayload.SORCNT, [10]).toFixed(iPrec);
				}
				oParameter.error = function(response) {};
				oParameter.success = function(oData) {
					var oTable = this.getView().byId("tbWcSortieMonId");
					oTable.removeSelections(true);
					that._fnSortieMonitoringGet(oModel.getProperty("/sJobId"), oModel.getProperty("/WorkCenterKey"));
					that.onSortieMonitoringClose();
				}.bind(this);
				oParameter.activity = 2;
				ajaxutil.fnUpdate(this.getResourceBundle().getText("SORTIEMONSVC"), oParameter, [oPayload], "dummy", this);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onSortieMonitoringUpdate function");

			}
		},
		//------------------------------------------------------------------
		// Function: onSortieMonitoringDelete
		// Parameter: oObj
		// Description: This will get called, when to delete selected Flying Requirements record from database.
		//Table: SORT
		//------------------------------------------------------------------
		onSortieMonitoringDelete: function(oObj) {
			try {
				var that = this,
					oPrmSORT = {},
					oModel = this.getView().getModel("LocalModel");
				var sPath = this.getResourceBundle().getText("SORTIEMONSVC") +
					"?JOBID" + FilterOpEnum.EQ + oObj.JOBID + "&TAILID" + FilterOpEnum.EQ + oObj.TAILID + "&SORNO" + FilterOpEnum.EQ + oObj.SORNO;
				oPrmSORT.error = function() {};
				oPrmSORT.success = function(oData) {
					var oTable = this.getView().byId("tbWcSortieMonId");
					oTable.removeSelections(true);
					that._fnSortieMonitoringGet(oModel.getProperty("/sJobId"), oModel.getProperty("/WorkCenterKey"));
				}.bind(this);
				oPrmSORT.activity = 7;
				ajaxutil.fnDelete(sPath, oPrmSORT, "dummy", this);
			} catch (e) {
				Log.error("Exception in onSortieMonitoringDelete function");
			}
		},
		//------------------------------------------------------------------
		// Function: _fnMonitoredForGet
		// Parameter: 
		// Description: This will get called, when to get Monitored for drop down records from database.
		//Table: DDREF, DDVAL
		//------------------------------------------------------------------
		_fnMonitoredForGet: function() {
			try {
				var that = this,
					oPrmFND = {};
				oPrmFND.filter = "ddid" + FilterOpEnum.EQ + "SORTI_&refid" + FilterOpEnum.EQ + that.getAircraftId();
				oPrmFND.error = function() {

				};

				oPrmFND.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "MonitoredForSet");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmFND);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnMonitoredForGet function");

			}
		},
		//------------------------------------------------------------------
		// Function: _fnOperationTypeGet
		// Parameter: 
		// Description: This will get called, when to get Operation type for drop down records from database.
		//Table: DDREF, DDVAL
		//------------------------------------------------------------------
		_fnOperationTypeGet: function() {
			try {
				var that = this,
					oPrmFND = {};
				oPrmFND.filter = "ddid" + FilterOpEnum.EQ + "TOP_&refid" + FilterOpEnum.EQ + that.getAircraftId();
				oPrmFND.error = function() {

				};

				oPrmFND.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "OperationSet");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmFND);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnOperationTypeGet function");

			}
		},
		//------------------------------------------------------------------
		// Function: _fnJobDetailsGet
		// Parameter: sJobId, sEvent, oData, that
		// Description: This will get called, when to get job records from database.
		//Table: DDREF, DDVAL
		//------------------------------------------------------------------
		_fnJobDetailsGet: function(sJobId, sEvent, oData, that) {
			try {
				var that = this,
					oViewModel = that.getView().getModel("LocalModel"),
					oSummaryModel = this.getView().getModel("SummaryModel"),
					oPrmJobDue = {};
				if (sEvent === "UpdateJob") {
					sJobId = oData.sJobId;
				}
				oPrmJobDue.filter = "jobid" + FilterOpEnum.EQ + sJobId + "&tailid" + FilterOpEnum.EQ + this.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();

					if (oData && oData.results.length !== 0) {

						that._fnCreatedWorkCenterGet(sJobId);

						if (oData.results[0].etrdt !== null || oData.results[0].etrdt !== "" || oData.results[0].etrdt !== undefined) {
							oData.results[0].etrdt = new Date(oData.results[0].etrdt);
							oData.results[0].etrtm = formatter.defaultTimeFormatDisplay(oData.results[0].etrtm);
							oViewModel.setProperty("/etrMinDate", new Date(oData.results[0].credt));
						}
						if (oData.results[0].rectdt && oData.results[0].recttm) {
							oData.results[0].rectdt = new Date(oData.results[0].rectdt);
							oData.results[0].recttm = formatter.defaultTimeFormatDisplay(oData.results[0].recttm);
							oViewModel.setProperty("/oldRectdt", oData.results[0].rectdt);
							oViewModel.setProperty("/oldRecttm", oData.results[0].recttm);
							oViewModel.setProperty("/oldRectsum", oData.results[0].recttxt);
						}
						if (oData.results[0].fstat === 'A') {
							oViewModel.setProperty("/FairEditFlag", false);
							oSummaryModel.setProperty("/FAIRStatusText", "ACTIVATED");
							oSummaryModel.setProperty("/FAIRStatus", "Error");

						} else if (oData.results[0].fstat === 'R') {
							oViewModel.setProperty("/FairEditFlag", true);
							oSummaryModel.setProperty("/FAIRStatus", "Error");
							oSummaryModel.setProperty("/FAIRStatusText", "Release for Rectifications");
							oSummaryModel.setProperty("/MenuVisible", true);
							oSummaryModel.setProperty("/MenuActivateVisible", false);
						} else if (oData.results[0].fstat === 'C') {
							//oViewModel.setProperty("/FairEditFlag", false);
							oSummaryModel.setProperty("/FAIRStatus", "Error");
						}

						if (oData.results[0].mark === '1') {
							this.getView().byId("CanvasId").setVisible(true);
							that.onSelectionDefectAreaChange(oData.results[0].deaid);
							that._fnGetMark(oData.results[0].jobid, oData.results[0].tailid, oData.results[0].deaid);
						} else {
							this.getView().byId("CanvasId").setVisible(false);
						}

						if (oData.results[0].DOCREFID) {
							this.docRefId = oData.results[0].DOCREFID;
							that._fnPhotoUploadGet(oData.results[0].DOCREFID);
						} else {
							oViewModel.setProperty("/DefectImageSrc", []);
							if (oData.results[0].mark !== '1') {
								this.getModel("PhotoModel").setProperty("/photoSet", []);
							}
						}
						if (oData.results[0].jstat === "X") {
							oViewModel.setProperty("/sFlag", "N");
							oViewModel.refresh(true);
						}

						oModel.setData(oData.results[0]);
						that.getView().setModel(oModel, "JobModel");
						this._fnEditRectButtonVisibility();
					}
					that._fnTailStatusGet(that.getTailId());
					oViewModel.refresh(true);
					oSummaryModel.refresh(true);
					that.fnLoadSrv1Dashboard();
					that._fnTaskStatusGet(sJobId);
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("DEFECTJOBSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnJobDetailsGet function");

			}
		},
		//------------------------------------------------------------------
		// Function: _fnWorkCenterGet
		// Parameter: sAirId
		// Description: This will get called, when to get workcenter database.
		//Table: DDREF, DDVAL
		//------------------------------------------------------------------
		_fnWorkCenterGet: function(sAirId) {
			try {
				var that = this,
					oPrmWorkCen = {};
				//	oPrmWorkCen.filter = "REFID eq " + sAirId;
				oPrmWorkCen.filter = "REFID" + FilterOpEnum.EQ + sAirId;
				oPrmWorkCen.error = function() {

				};

				oPrmWorkCen.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "WorkCenterSet");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("GETWORKCENTERSVC"), oPrmWorkCen);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnWorkCenterGet function");

			}
		},
		//------------------------------------------------------------------
		// Function: _fnPhotoUploadGet
		// Parameter: sDOCREFID
		// Description: This will get called, when to get uploaded images from database.
		//Table: PHOTO
		//------------------------------------------------------------------
		_fnPhotoUploadGet: function(sDOCREFID) {
			try {
				var oPrmPhoto = {},
					oAppModel = this.getView().getModel("appModel"),
					that = this,
					sDefectImageSrc = oAppModel.getProperty("/DefectImageSrc");
				oPrmPhoto.filter = "DOCREFID" + FilterOpEnum.EQ + sDOCREFID + "&TAILID" + FilterOpEnum.EQ + that.getTailId();
				oPrmPhoto.error = function() {};
				oPrmPhoto.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getView().byId("CanvasId").setVisible(true);
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
				ajaxutil.fnRead(this.getResourceBundle().getText("DEFECTPHOTOSSVC"), oPrmPhoto, sDefectImageSrc);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnPhotoUploadGet function");

			}
		},
		//------------------------------------------------------------------
		// Function: _fnPhotoUploadCreate
		// Parameter: sJobId, sTailId
		// Description: This will get called, when to upload images to database.
		//Table: PHOTO
		//------------------------------------------------------------------
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

				ajaxutil.fnCreate(this.getResourceBundle().getText("DEFECTPHOTOSSVC"), oPrmPhoto, sDefectImageSrc, "PHOTO", that);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnPhotoUploadCreate function");

			}
		},

		//------------------------------------------------------------------
		// Function: _fnUpdateJob
		// Parameter: oEvent
		// Description: This will get called, when to update Job details to database.
		//Table: JOB
		//------------------------------------------------------------------
		_fnUpdateJob: function(oFlag) {
			try {
				var that = this,
					oObject,
					oLocalModel,
					oPayload;
				var dDate = new Date();
				oLocalModel = that.getView().getModel("LocalModel");
				var oParameter = {};
				oPayload = that.getView().getModel("JobModel").getData();
				if (oPayload.etrtm === "") {
					oPayload.etrtm = "";
				}
				try {
					oPayload.etrdt = formatter.defaultOdataDateFormat(oPayload.etrdt);
				} catch (e) {
					oPayload.etrdt = oPayload.etrdt;
				}
				try {
					oPayload.cretm = formatter.defaultTimeFormatDisplay(oPayload.cretm);
				} catch (e) {
					oPayload.cretm = oPayload.cretm;
				}
				try {
					oPayload.creuzt = formatter.defaultTimeFormatDisplay(oPayload.creuzt);
				} catch (e) {
					oPayload.creuzt = oPayload.creuzt;
				}

				var bFlag = formatter.validDateTimeChecker(this, "DP1", "TP1", "errorUpdateETRPast", "errorCreateETRFuture", oPayload.credtm,
					oPayload.creuzt, false);
				if (!bFlag) {
					return;
				}
				oParameter.error = function(response) {};
				oParameter.success = function(oData) {
					that._fnJobDetailsGet(oLocalModel.getProperty("/sJobId"), oLocalModel.getProperty("/sTailId"));
				}.bind(this);
				if (oFlag === "WRC") {
					ajaxutil.fnUpdate(this.getResourceBundle().getText("DEFECTJOBSVC"), oParameter, [oPayload]); //Rahul 23.11.2020 :05:39PM: Service name changed to i18n Property
				} else {
					if (oPayload.fstat === "R") {
						oObject = "ZRM_FAIR_R";
						oParameter.activity = 4;
					} else {
						oObject = "ZRM_COS_JB";
						oParameter.activity = 2;
					}
					ajaxutil.fnUpdate(this.getResourceBundle().getText("DEFECTJOBSVC"), oParameter, [oPayload], oObject, this);
				}

			} catch (e) {
				Log.error("Exception in _fnUpdateJob function");
			}
		},
		/* Function: _fnGetDateValidation
		 * Parameter: sJobId
		 * Description: Function to retreive min allowed date/time
		 */
		_fnGetDateValidation: function(sJobId) {
			try {
				var oPrmTaskDue = {};
				//	oPrmTaskDue.filter = "TAILID eq " + this.getTailId() + " and JFLAG eq J and AFLAG eq C and jobid eq " + sJobId;
				oPrmTaskDue.filter = "TAILID" + FilterOpEnum.EQ + this.getTailId() + "&JFLAG" + FilterOpEnum.EQ + "J&AFLAG" + FilterOpEnum.EQ +
					"C&jobid" + FilterOpEnum.EQ + sJobId;
				oPrmTaskDue.error = function() {};
				oPrmTaskDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("LocalModel").setProperty("/backDt", oData.results[0].VDATE);
						this.getModel("LocalModel").setProperty("/backTm", oData.results[0].VTIME);
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("JOBSDATEVALIDSVC"), oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in _fnGetDateValidation function");
			}
		},
		/* Function: handleChange
		 * Parameter:
		 * Description: Function to validate date/time
		 */
		handleChange: function() {
			var aData = this.getModel("LocalModel").getData();
			return formatter.validDateTimeChecker(this, "DP2", "TP2", "errorCloseJobPast", "errorCloseJobFuture", aData.backDt, aData.backTm);
		},

		handleChangeRect: function(oEvent) {
			try {
				var aData = this.getModel("LocalModel").getData();
				if (oEvent) {
					this.getModel("JobModel").setProperty("/rectdt", oEvent.getSource().getDateValue());
				}
				return formatter.validDateTimeChecker(this, "DP2", "TP2", "errorCloseJobPast", "errorCloseJobFuture", aData.backDt, aData.backTm);
			} catch (e) {
				Log.error("Exception in handleChange function");
			}
		},

		/* Function: onSignOffRectify
		 * Parameter: 
		 * Description: Function when to save job after it is closed and edit again
		 */
		onSignOffRectify: function() {
			FieldValidations.resetErrorStates(this);
			if (FieldValidations.validateFields(this)) {
				return;
			}

			if (!this.handleChange()) {
				return;
			}
			var oPrmTask = {},
				sObject,
				sSignFlag,
				oPayload = this.getView().getModel("JobModel").getData(),
				oModel = this.getView().getModel("LocalModel");
			oPrmTask.filter = "";
			oPrmTask.error = function() {};
			oPrmTask.success = function(oData) {
				oModel.setProperty("/editModeRectify", false);
			}.bind(this);
			sObject = "ZRM_COS_JS";
			oPrmTask.activity = 6;
			ajaxutil.fnUpdate(this.getResourceBundle().getText("DEFECTJOBSVC"), oPrmTask, [oPayload], sObject, this);
		},

		//------------------------------------------------------------------
		// Function: _fnUpdateFAIRJob
		// Parameter: oFlag
		// Description: This will get called, when to update Job statis FAIR to database.
		//Table: JOB, TAIL
		//------------------------------------------------------------------
		_fnUpdateFAIRJob: function(oFlag, sText) {
			try {
				var that = this,
					oObjectId,
					oSummaryModel,
					sjobid = "",
					oLocalModel,
					oModel, oFlag,
					oPayload;
				var dData = formatter.defaultOdataDateFormat(new Date());
				var tTime = new Date().getHours() + ":" + new Date().getMinutes();
				oLocalModel = that.getView().getModel("LocalModel");
				oModel = this.getView().getModel("JobModel");
				oSummaryModel = this.getView().getModel("SummaryModel");
				var oParameter = {};
				oPayload = that.getView().getModel("JobModel").getData();
				if (oPayload.etrtm === "") {
					oPayload.etrtm = "";
				}
				try {
					oPayload.cretm = formatter.defaultTimeFormatDisplay(oPayload.cretm);
				} catch (e) {
					oPayload.cretm = oPayload.cretm;
				}
				try {
					oPayload.creuzt = formatter.defaultTimeFormatDisplay(oPayload.creuzt);
				} catch (e) {
					oPayload.creuzt = oPayload.creuzt;
				}

				switch (oFlag) {
					case "A":
						oPayload.fstatflag = "A";
						oPayload.factby = "";
						oPayload.factdtm = "";
						oPayload.factuzt = "";
						oPayload.FAIRNR = sText;
						break;
					case "U":
						oPayload.fstatflag = "U";
						oPayload.factby = "";
						oPayload.factdtm = dData;
						oPayload.factuzt = tTime;
						break;
					case "R":
						oPayload.fstatflag = "R";
						oPayload.factby = "";
						oPayload.factdtm = dData;
						oPayload.factuzt = tTime;
						break;
				}

				oParameter.error = function(response) {};
				oParameter.success = function(oData) {
					switch (oFlag) {
						case "A":
							oLocalModel.setProperty("/FairEditFlag", false);
							oLocalModel.setProperty("/JobStatus", false);
							oSummaryModel.setProperty("/FAIRStatusText", "ACTIVATED");
							oSummaryModel.setProperty("/FAIRStatus", "Error");
							break;
						case "U":
							oLocalModel.setProperty("/FairEditFlag", true);
							oSummaryModel.setProperty("/FAIRStatusText", "");
							oSummaryModel.setProperty("/FAIRStatus", "None");
							oSummaryModel.setProperty("/MenuVisible", true);
							oSummaryModel.setProperty("/MenuActivateVisible", false);
							break;
						case "R":
							oLocalModel.setProperty("/FairEditFlag", true);
							oSummaryModel.setProperty("/FAIRStatusText", "Release for Rectifications");
							oSummaryModel.setProperty("/FAIRStatus", "None");
							oSummaryModel.setProperty("/MenuVisible", true);
							oSummaryModel.setProperty("/MenuActivateVisible", false);
							break;
					}
					oSummaryModel.updateBindings(true);

					that._fnJobDetailsGet(oLocalModel.getProperty("/sJobId"), oLocalModel.getProperty("/sTailId"));
				}.bind(this);
				if (oFlag === "R") {
					oObjectId = "ZRM_FAIR_R";
					oParameter.activity = "4";
				} else {
					oObjectId = "ZRM_FAIR_D";
					oParameter.activity = "1";
				}

				ajaxutil.fnUpdate(this.getResourceBundle().getText("DEFECTJOBSVC"), oParameter, [oPayload], oObjectId, this);
			} catch (e) {
				Log.error("Exception in _fnUpdateFAIRJob function");
			}
		},
		//------------------------------------------------------------------
		// Function: _fnCreatedWorkCenterGet
		// Parameter: sJobId
		// Description: This will get called, when to get created workcenter for selected Job from database.
		//Table: WRCTR
		//------------------------------------------------------------------
		_fnCreatedWorkCenterGet: function(sJobId) {
			try {
				var that = this,
					oModelLocal,
					oPayload,
					oPrmWorkCenter = {};
				oModelLocal = this.getView().getModel("LocalModel");
				//	oPrmWorkCenter.filter = "jobid eq " + sJobId;
				oPrmWorkCenter.filter = "jobid" + FilterOpEnum.EQ + sJobId + "&TAILID" +
					FilterOpEnum.EQ + that.getTailId();
				oPrmWorkCenter.error = function() {};
				oPrmWorkCenter.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oData.results.push({
						jobid: sJobId,
						tailid: oModelLocal.getProperty("/sTailId"),
						wrctr: "Summary",
						isprime: "",
						wrctrtx: "Summary",
						primecount: "0",
						LASTWC: ""
					});

					if (oModelLocal.getProperty("/sFlag") === "N") {
						oData.results.push({
							jobid: sJobId,
							tailid: oModelLocal.getProperty("/sTailId"),
							wrctr: "RectSum",
							isprime: "",
							wrctrtx: "Rectification Summary",
							primecount: (oData.results.length).toString(),
							LASTWC: ""
						});
					}
					oModel.setData(oData.results);
					that.setModel(oModel, "CreatedWorkCenterModel");

				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("DEFECTWORKCENTERSVC"), oPrmWorkCenter);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnCreatedWorkCenterGet function");

			}
		},
		//------------------------------------------------------------------
		// Function: _fnDefectWorkCenterCreate
		// Parameter: sWorkCenterKey, sState
		// Description: This will get called, when to get created workcenter for selected Job from database.
		//Table: WRCTR
		//------------------------------------------------------------------
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
						"count": "",
						"PrimeCount": "",
						"LASTWC": ""
					},

					oPrmWorkCenter.error = function() {};
				oPrmWorkCenter.success = function(oData) {
					if (sState) {
						that._fnUpdateJob("WRC");
					} else {
						that._fnJobDetailsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/sTailId"));
					}
					that.onCloseAddWorkCenterDialog();
				}.bind(this);
				/*if (sState) {
					//oPrmWorkCenter.activity = 1;
					ajaxutil.fnCreate(this.getResourceBundle().getText("DEFECTWORKCENTERSVC"), oPrmWorkCenter, [oPayload]);
				} else {
					
				}*/
				//Rahul: 13/11/2020: 11:53AM: Code addedd to add Signoff dialog without authorization check.
				oPrmWorkCenter.activity = 1;
				ajaxutil.fnCreate(this.getResourceBundle().getText("DEFECTWORKCENTERSVC"), oPrmWorkCenter, [oPayload], "dummy", this);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnDefectWorkCenterCreate function");

			}
		},

		/* Function: onRectificationSelectTask
		 * Parameter: sJobId
		 * Description: This will get called, when to get work center for selected Job.
		 */
		onRectificationSelectTask: function(sJobId) {
			try {
				var that = this,
					oPrmTask = {};
				//	oPrmTask.filter = "jobid eq " + sJobId + " and recTstar eq X";
				oPrmTask.filter = "jobid" + FilterOpEnum.EQ + sJobId + FilterOpEnum.AND + "recTstar" + FilterOpEnum.EQ + "X&tailid" +
					FilterOpEnum.EQ + this.getTailId();
				oPrmTask.error = function() {};
				oPrmTask.success = function(oData) {
					this.getView().getModel("LocalModel").setProperty("/selectedTask", oData.results);
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("TASKSVC"), oPrmTask);
			} catch (e) {
				Log.error("Exception in onWorkCenterSelect function");
			}
		},
		//------------------------------------------------------------------
		// Function: _fnDefectWorkCenterDelete
		// Parameter: sWorkCenterKey
		// Description: This will get called, when to delete workcenter for selected Job from database.
		//Table: WRCTR
		//------------------------------------------------------------------
		_fnDefectWorkCenterDelete: function(sWorkCenterKey) {
			try {

				var that = this,
					bTaskFlag,
					oPrmWorkCenter = {},
					oModel = this.getView().getModel("LocalModel");

				bTaskFlag = this._fnCheckWCTaskCount(sWorkCenterKey);
				if (bTaskFlag) {
					/*oPrmWorkCenter.filter="jobid eq "+sJobId+" and taild eq "+sTailId;*/
					var sPath = this.getResourceBundle().getText("DEFECTWORKCENTERSVC") + "?JOBID" + FilterOpEnum.EQ + oModel.getProperty(
							"/sJobId") +
						"&WRCTR" + FilterOpEnum.EQ + sWorkCenterKey + "&TAILID" +
						FilterOpEnum.EQ + that.getTailId();
					oPrmWorkCenter.error = function() {};
					oPrmWorkCenter.success = function(oData) {
						oModel.setProperty("/SummaryFlag", true);
						oModel.setProperty("/WorcenterFlag", false);
						oModel.setProperty("/RectSummaryFlag", false);
						that._fnJobDetailsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/sTailId"));
						that.onCloseAddWorkCenterDialog();
					}.bind(this);
					//Rahul: 13/11/2020: 11:53AM: Code addedd to add Signoff dialog without authorization check.
					oPrmWorkCenter.activity = 7;
					ajaxutil.fnDelete(sPath, oPrmWorkCenter, "dummy", this);
				} else {
					MessageBox.error(
						"There is record created under this work center, no deletion is allowed", {
							icon: sap.m.MessageBox.Icon.Error,
							title: "Error",
							styleClass: "sapUiSizeCompact"
						});

				}
			} catch (e) {
				Log.error("Exception in _fnDefectWorkCenterDelete function");
			}
		},

		//------------------------------------------------------------------
		// Function: _fnDefectWorkCenterUpdate
		// Parameter: oEvent
		// Description: Private Method: This will get called, when to update workcenter data from backend.
		// Table: WRCTR
		//------------------------------------------------------------------
		_fnDefectWorkCenterUpdate: function(sJobId, sKey, isPrime) {
			try {
				var that = this,
					oPayload, oModel = that.getView().getModel("LocalModel"),
					oPrmWorkCenter = {};
				oPayload = {
					"jobid": sJobId,
					"tailid": that.getTailId(),
					"wrctr": sKey,
					"isprime": isPrime,
					"wrctrtx": oModel.getProperty("/WorkCenterKey"),
					"count": "",
					"PrimeCount": "",
					"LASTWC": ""
				};
				oPrmWorkCenter.error = function() {};
				oPrmWorkCenter.success = function(oData) {
					that._fnJobDetailsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/sTailId"));
					oModel.setProperty("/WorkCenterTitle", oData.results[0].wrctrtx);
					oModel.setProperty("/WorkCenterKey", oData.results[0].wrctr);
					that.onCloseAddWorkCenterDialog();
				}.bind(this);
				oPrmWorkCenter.activity = 2;
				ajaxutil.fnUpdate(this.getResourceBundle().getText("DEFECTWORKCENTERSVC"), oPrmWorkCenter, [oPayload], "ZRM_COS_JB", this);
			} catch (e) {
				Log.error("Exception in _fnDefectWorkCenterUpdate function");
			}
		},

		//------------------------------------------------------------------
		// Function: _fnGetMark
		// Parameter: sjobid, sTailId, sDeaId
		// Description: This will get called, when to get Mark data of defect area for selected Job from database.
		//Table: MARK
		//------------------------------------------------------------------
		_fnGetMark: function(sjobid, sTailId, sDeaId) {
			try {
				var oPrmMark = {},
					oModel,
					that = this,
					oPayload;
				oModel = that.getView().getModel("appModel").getData();
				//	oPrmMark.filter = "jobid eq " + sjobid;
				oPrmMark.filter = "jobid" + FilterOpEnum.EQ + sjobid + "&tailid" + FilterOpEnum.EQ + this.getTailId();

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

				ajaxutil.fnRead(this.getResourceBundle().getText("DEFECTMARKSVC"), oPrmMark, oPayload);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnGetMark function");

			}
		},

		/* Function: _fnToolCheckTaskClose
		 * Parameter: 
		 * Description: Function to check if tool task is closed or not
		 */
		_fnToolCheck: function(sJobId, oFlag) {
			try {
				var that = this,
					oJobModel = this.getView().getModel("JobModel"),
					oModel = this.getView().getModel("LocalModel"),
					oPrmTask = {};
				//		oPrmTask.filter = "JOB_ID eq " + sJobId;
				/*	oPrmTask.filter = "JOB_ID" + FilterOpEnum.EQ + sJobId;*/
				oPrmTask.filter = "JOB_ID" + FilterOpEnum.EQ + sJobId + "&TAILID" + FilterOpEnum.EQ + that.getTailId();
				oPrmTask.error = function() {};
				oPrmTask.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this._onfnToolCheckSuccess(oData.results, oFlag);
					} else {
						if (oModel.getProperty("/JobStatus")) {
							if (oJobModel.getProperty("/jobdesc") !== "" && oJobModel.getProperty("/jobdesc") !== "") {
								if (oJobModel.getProperty("/fndid") !== "" && oJobModel.getProperty("/fndid") !== "") {
									this.getRouter().navTo("CosCloseJob", {
										"JobId": sJobId,
										"Flag": oFlag
									});
								} else {
									var sTextFD = "Please add found during to close this job.";
									sap.m.MessageBox.error(sTextFD);
									return false;
								}
							} else {
								var sText1 = "Please add job description to close this job.";
								sap.m.MessageBox.error(sText1);
							}
						} else {
							var sText = "Please close all tasks of the job : " + oModel.getProperty("/sJobId");
							sap.m.MessageBox.error(sText);
						}
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("TOOLCHECKVALSVC"), oPrmTask);
			} catch (e) {
				Log.error("Exception in _fnToolCheck function");
			}
		},
		/* Function: onSuggestTechOrder
		 * Parameter: oEvent
		 * Description: Function to show suggestive search for technical order reference
		 */
		onSuggestTechOrder: function(oEvent) {
			var sText = oEvent.getSource().getValue();
			try {
				var that = this,
					oPrmJobDue = {};
				//oPrmJobDue.filter = "TAILID eq " + that.getTailId() + " and TOREF eq " + sText;
				oPrmJobDue.filter = "TAILID" + FilterOpEnum.EQ + that.getTailId() + FilterOpEnum.AND + "TOREF" + FilterOpEnum.EQ + sText;
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TechRefSugg");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETTASKREFSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCreateTask:onSuggestTechOrder function");

			}
		},

		// ***************************************************************************
		//     3.  Specific Methods  
		// ***************************************************************************

		/* Function: onItemSelectOutstanding
		 * Parameter: oEvent
		 * Description: Function call when item is selected for outstanding task table
		 */
		onItemSelectOutstanding: function(oEvent) {
			try {
				var oSrc = oEvent.getSource();
				var aSelectedItem = oEvent.getParameter("listItem");
				var aItems = oSrc.getItems();
				var obj = {};
				var tempObj = {};
				if (!oEvent.getParameter("selectAll") && oEvent.getParameter("selected")) {
					obj = aSelectedItem.getBindingContext("TaskOutModel").getObject();
					if (obj.RTTY === "M") {
						for (var i in aItems) {
							tempObj = aItems[i].getBindingContext("TaskOutModel").getObject();
							if (obj.tmpid === tempObj.tmpid) {
								oSrc.setSelectedItem(aItems[i]);
							}
						}
						sap.m.MessageBox.information("Master Task selected. For this pending sub task are auto selected");
					}
				} else if (!oEvent.getParameter("selectAll") && !oEvent.getParameter("selected")) {
					obj = aSelectedItem.getBindingContext("TaskOutModel").getObject();
					if (obj.RTTY === "S") {
						for (var key in aItems) {
							tempObj = aItems[key].getBindingContext("TaskOutModel").getObject();
							if (obj.tmpid === tempObj.tmpid && tempObj.RTTY === "M") {
								aItems[key].setProperty("selected", false);
							}
						}
						sap.m.MessageBox.information("All sub task need to be selected to select master task");
					}

				}
			} catch (e) {
				Log.error("Exception in onItemSelectOutstanding function");
			}

		},
		/* Function: onEditRectify
		 * Parameter:
		 * Description: Function to allow edit closed job within 24 hrs
		 */
		onEditRectify: function() {
			try {
				var oModel = this.getView().getModel("LocalModel");
				var bEditable = this._fnJobEditCheck();
				if (!bEditable) {
					oModel.setProperty("/isEditableRect", false);
					oModel.setProperty("/editModeRectify", false);
					sap.m.MessageBox.error("Job cannot be edit. As it already passed 24hrs");
					return;
				}
				var bFlag = oModel.getProperty("/editModeRectify");
				oModel.setProperty("/editModeRectify", !bFlag);
				if (bFlag) {
					this.getModel("JobModel").setProperty("/rectdt", oModel.getProperty("/oldRectdt"));
					this.getModel("JobModel").setProperty("/recttm", oModel.getProperty("/oldRecttm"));
					this.getModel("JobModel").setProperty("/recttxt", oModel.getProperty("/oldRectsum"));
				}
			} catch (e) {
				Log.error("Exception in onEditRectify function");
			}
		},
		//------------------------------------------------------------------
		// Function: onOpenQuickView
		// Parameter: sFlag, oEvent
		// Description: This will get called, when to open quick menu view.
		//Table: 
		//------------------------------------------------------------------
		onOpenQuickView: function(sFlag, oEvent) {
			try {
				var that = this;
				if (this._oQuickView) {
					this._oQuickView.destroy();
				}
				/*	that._oQuickView = sap.ui.xmlfragment(that.createId("ManageJob_Defect_Id"), "avmet.ah.fragments.ManageJobDefectMenu", this);*/
				that._oQuickView = sap.ui.xmlfragment("OpenViewId", "avmet.ah.fragments.ManageJobDefectMenu", this);
				that.getView().addDependent(that._oQuickView);
				var oSummaryModel = that.getView().getModel("SummaryModel"),
					oJobModel = that.getView().getModel("JobModel");
				if (sFlag === 'DF') {
					if (oSummaryModel.getProperty("/FAIRStatusText") === 'ACTIVATED') {
						oSummaryModel.setProperty("/MenuVisible", false);
						oSummaryModel.setProperty("/MenuScheduleVisible", false); //Rahul: 18/11/2020: 10:24 AM : Menu item visiblity check added.
						oSummaryModel.setProperty("/MenuActivateVisible", true);
						oSummaryModel.setProperty("/MenuWorkCenterVisible", false);
					} else {
						oSummaryModel.setProperty("/MenuVisible", true);

						if (oJobModel.getProperty("/jobty") === 'S') {
							oSummaryModel.setProperty("/MenuVisibleEdit", false);
							oSummaryModel.setProperty("/MenuScheduleVisible", true); //Rahul: 18/11/2020: 10:24 AM : Menu item visiblity check added.
						} else {
							oSummaryModel.setProperty("/MenuScheduleVisible", false); //Rahul: 18/11/2020: 10:24 AM : Menu item visiblity check added.
							oSummaryModel.setProperty("/MenuVisibleEdit", true);
						}
						/*oSummaryModel.setProperty("/MenuScheduleVisible", false);*/ //Rahul: 18/11/2020: 10:24 AM : Menu item visiblity condition commented.
						oSummaryModel.setProperty("/MenuActivateVisible", false);
						oSummaryModel.setProperty("/MenuWorkCenterVisible", false);
					}
				} else if (sFlag === 'WC') {
					/*Rahul: 18/11/2020: 10:24 AM : Conditions added for no data.*/
					if (this.getView().getModel("CreatedWorkCenterModel").getData().length > 1) {
						oSummaryModel.setProperty("/MenuVisible", false);
						oSummaryModel.setProperty("/MenuScheduleVisible", false); //Rahul: 18/11/2020: 10:24 AM : Menu item visiblity check added.
						oSummaryModel.setProperty("/MenuActivateVisible", false);
						oSummaryModel.setProperty("/MenuWorkCenterVisible", true);
					} else {
						that.onCloseDialog();
						MessageBox.information(
							"There are no workcenter present to edit.", {
								icon: sap.m.MessageBox.Icon.information,
								title: "Information",
								styleClass: "sapUiSizeCompact"
							});
					}
					/*End of the code change*/
				} else {
					oSummaryModel.setProperty("/MenuVisible", false);
					oSummaryModel.setProperty("/MenuScheduleVisible", true); //Rahul: 18/11/2020: 10:24 AM : Menu item visiblity check added.
					oSummaryModel.setProperty("/MenuActivateVisible", false);
					oSummaryModel.setProperty("/MenuWorkCenterVisible", false);
				}
				that.getView().getModel("SummaryModel").updateBindings(true);
				var eDock = sap.ui.core.Popup.Dock;
				var oButton = oEvent.getSource();
				that._oQuickView.open(that._bKeyboard, oButton, eDock.BeginTop, eDock.BeginFront, oButton);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onOpenQuickView function");

			}

		},
		//------------------------------------------------------------------
		// Function: onCloseDialog
		// Parameter: sFlag, oEvent
		// Description: This will get called, when to close quick menu view.
		//Table: 
		//------------------------------------------------------------------
		onCloseDialog: function() {
			try {
				if (this._oQuickView) {
					this._oQuickView.close(this);
					this._oQuickView.destroy();
					delete this._oQuickView;
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onCloseDialog function");

			}
		},
		/* Function: onFilterChange
		 * Parameter:
		 * Description: Function called when filter is changed
		 */
		onFilterChange: function(oEvent) {
			try {
				if (oEvent.getSource().getSelectedKey().length > 0) {
					oEvent.getSource().setValueState("None");
				}
			} catch (e) {
				Log.error("Exception in onFilterChange function");
			}
		},
		/* Function: onTypeChangePart
		 * Parameter:
		 * Description: function is called type is changed to part
		 */
		onTypeChangePart: function(oEvent) {
			try {
				var oKey = oEvent.getSource().getSelectedKey();
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/ismat", oKey);
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/partno", "");
				this._oMGDetails.getModel("ManageTaskModel").refresh();
			} catch (e) {
				Log.error("Exception in onTypeChangePart function");
			}

		},
		/* Function: onTypeChangePart
		 * Parameter:
		 * Description: function is called type is changed to part
		 */
		onTypeChangeSerial: function(oEvent) {
			try {
				var oKey = oEvent.getSource().getSelectedKey();
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/sernr", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/isser", oKey);
				this._oMGDetails.getModel("ManageTaskModel").refresh();
			} catch (e) {
				Log.error("Exception in onTypeChangeSerial function");
			}
		},
		/* Function: onSelectionTaskTypeChange
		 * Parameter:
		 * Description: function is called when task type is changed
		 */
		onSelectionTaskTypeChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey(),
					oCreateTaskModel = this._oMGDetails.getModel("ManageTaskModel");
				oCreateTaskModel.setProperty("/engflag", sSelectedKey);
				oCreateTaskModel.refresh(true);
				/*	oCreateTaskModel.setProperty("/sernr", "");
					oCreateTaskModel.setProperty("/partno", "");*/

			} catch (e) {
				Log.error("Exception in CosCreateTask:onRemoveInstallTaskChange function");

			}
		},
		/* Function: onSearchTable
		 * Parameter: oEvent, sId, oModel
		 * Description: function call to perform filters in task tables
		 */
		onSearchTable: function(oEvent, sId, oModel) {
			try {
				var sKey = this.getView().byId("cb" + sId).getSelectedKey();
				if (sKey && sKey.length > 0) {
					sKey = sKey.split("-");
					this.onSearch(oEvent, sId, oModel, sKey[0].trim(), sKey[1].trim());
				} else {
					this.getView().byId("cb" + sId).setValueState("Error");
					this.getView().byId("cb" + sId).setValueStateText("Please select column");
				}
			} catch (e) {
				Log.error("Exception in onSearchTable function");
			}

		},

		/* Function: handleChangeEtr
		 * Parameter: 
		 * Description: Function to call for ETR change
		 */
		handleChangeEtr: function(oEvent) {
			try {
				this.getView().getModel("JobModel").setProperty("/ETRFLAG", "X");
				if (oEvent) {
					this.getModel("JobModel").setProperty("/etrdt", oEvent.getSource().getDateValue());
				}
				this.getView().getModel("JobModel").refresh();
			} catch (e) {
				Log.error("Exception in handleChangeEtr function");
			}
		},
		/* Function: onNavBackDefect
		 * Parameter:
		 * Description: function is called when back button is pressed
		 */
		onNavBackDefect: function(oEvent) {
			try {
				this.getOwnerComponent().setModel(null, "jobModel");
				this.onNavBack(oEvent, 'DashboardInitial');
			} catch (e) {
				Log.error("Exception in onNavBackDefect function");
			}
		},
		/* Function: onWorkCenterEditChange
		 * Parameter: oEvent
		 * Description: function is called when edit button is clicked for work center 
		 */
		onWorkCenterEditChange: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					object = oSrc.getSelectedItem().getBindingContext("WorkCenterDialogModel").getObject();
				var bFlag = object.wrctr === this.getView().getModel("JobModel").getProperty("/prime") ? true : false;
				this.getFragmentControl("idWorkCenterDialog", "switchId").setState(bFlag);
			} catch (e) {
				Log.error("Exception in onWorkCenterEditChange function");
			}
		},
		/* Function: onEditWorkcenterSubmitPress
		 * Parameter:sValue
		 * Description: function is called when work center edited
		 */
		onEditWorkcenterSubmitPress: function(sValue) {
			try {
				var that = this;
				var sKey = this._oAddWorkCenter.getModel("WorkCenterDialogModel").getProperty("/SelectedWorkCenter");
				var dataSet = this._oAddWorkCenter.getModel("WorkCenterDialogModel").getProperty("/WorkCenterSet");
				var oModel = this.getModel("LocalModel");
				this.getView().getModel("JobModel").setProperty("/prime", sKey);
				var sState = this.getFragmentControl("idWorkCenterDialog", "switchId").getState();
				if (sState) {
					if (sValue !== "CON") {
						that.getFragmentControl("idWorkCenterDialog", "addWCId").setVisible(false);
						that.getFragmentControl("idWorkCenterDialog", "workCenterId").setText(dataSet[sKey].wrctrtx);
						that.getFragmentControl("idWorkCenterDialog", "confirmWCId").setVisible(true);

					} else {
						that.getView().getModel("JobModel").setProperty("/prime", sKey);
						this._fnUpdateJob();
						that._fnJobDetailsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/sTailId"));
						that.onCloseAddWorkCenterDialog();
					}
				} else {
					that.getView().getModel("JobModel").setProperty("/prime", "");
					this._fnUpdateJob();
					that._fnJobDetailsGet(oModel.getProperty("/sJobId"), oModel.getProperty("/sTailId"));
					that.onCloseAddWorkCenterDialog();
				}
			} catch (e) {
				Log.error("Exception in onEditWorkcenterSubmitPress function");
			}

		},
		/* Function: onSwitchWorkCenter
		 * Parameter:
		 * Description: function is called when work center is switched
		 */
		onSwitchWorkCenter: function() {
			try {
				var oModel = this.getModel("LocalModel"),
					oJobModel = this.getView().getModel("JobModel"),
					sSelectedItem,
					sPrime = "";

				var oComboBoxInstance = this.getFragmentControl("idWorkCenterDialog", "ComboWCId");
				sSelectedItem = oComboBoxInstance.getSelectedItem();
				if (oModel.getProperty("/WorkCenterKey") === oJobModel.getProperty("/prime")) {
					sPrime = "X";
				}
				this._fnDefectWorkCenterUpdate(oModel.getProperty("/sJobId"), sSelectedItem.getKey(), sPrime);
			} catch (e) {
				Log.error("Exception in onSwitchWorkCenter function");
			}
		},
		/* Function: onDeleteWorkcenterSubmitPress
		 * Parameter:
		 * Description: function call to delete work center
		 */
		onDeleteWorkcenterSubmitPress: function() {
			try {
				var sKey = this._oAddWorkCenter.getModel("WorkCenterDialogModel").getProperty("/SelectedWorkCenter");
				var bFlag = this.getFragmentControl("idWorkCenterDialog", "switchId").getState();
				if (bFlag) {
					MessageBox.error(
						"Prime workcenter can not be deleted.", {
							icon: sap.m.MessageBox.Icon.Error,
							title: "Error",
							styleClass: "sapUiSizeCompact"
						});
					return;
				} else {
					this._fnDefectWorkCenterDelete(sKey);
				}
			} catch (e) {
				Log.error("Exception in onDeleteWorkcenterSubmitPress function");
			}
		},
		/* Function: onImagePress
		 * Parameter:
		 * Description: Function to update canvas when image is selected
		 */
		onImagePress: function(oEvent) {
			try {
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
			} catch (e) {
				Log.error("Exception in onImagePress function");
			}
		},
		//------------------------------------------------------------------
		// Function: handleMenuItemPress
		// Parameter: oEvent
		// Description: This will get called, when to open Menu items from Manage Job.
		//Table: 
		//------------------------------------------------------------------
		handleMenuItemPress: function(oEvent) {
			try {

				var that = this;
				var oModel = this.getView().getModel("JobModel"),
					oLocalModel = this.getView().getModel("LocalModel");
				if (oLocalModel.getProperty("/sFlag") === "Y") {
					switch (oEvent.getParameter("item").getText()) {
						case "Edit Job":
							break;
						case "Edit Job Details":
							that.getRouter().navTo("CosCreateJob", {
								"JobId": oLocalModel.getProperty("/sJobId"),
								"RJobId": "N"
							}, true);
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
							if (oLocalModel.getProperty("/JobStatus")) {
								var oModelTemp = this.getView().getModel("JobModel");
								var oADDTransferModel = [];
								oADDTransferModel.push({
									"JobDesc": oModelTemp.getProperty("/jobdesc"),
									"JobId": oLocalModel.getProperty("/sJobId")
								});
								dataUtil.setDataSet("ADDTransferModel", oADDTransferModel);

								that.getRouter().navTo("RouteTransferToADD", {
									"JobId": oLocalModel.getProperty("/sJobId"),
									"FndBy": that.getView().getModel("JobModel").getProperty("/fndby"),
									"FndId": that.getView().getModel("JobModel").getProperty("/fndid")
								});
							} else {
								MessageBox.error(
									"There are open task's under this job,so transfer to ADD/Limitation not allowed.", {
										icon: sap.m.MessageBox.Icon.Error,
										title: "Error",
										styleClass: "sapUiSizeCompact"
									});
							}
							break;
						case "View History Log":
							break;
						case "Work Center":
							break;
						case "Add Work Center":
							that.onAddNewWorkCenter("ADD");
							break;
						case "Edit Work Center":
							that.onAddNewWorkCenter("EDIT");
							break;
						case "Delete Work Center":
							that.onAddNewWorkCenter("DELETE");
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
							}, true);
							break;
						case "Declare FAIR":
							that._fnOpenFAIRNum();
							//that._fnUpdateFAIRJob("A");
							break;
						case "Undo FAIR":
							that._fnUpdateFAIRJob("U");
							break;
						case "Release for Rectification":
							that._fnUpdateFAIRJob("R");
							var oModelData = [];
							oModelData.push({
								"PastAdd": "1",
								"PastAddDate": formatter.defaultDateFormat(new Date())
							});
							dataUtil.setDataSet("TransferJobModel", oModelData[0]);
							break;
						case "Raise Schedule Concession":
							this.onRaiseScheduleConcession();
							break;
					}
					that.getView().getModel("SummaryModel").updateBindings(true);
					oModel.updateBindings(true);
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:handleMenuItemPress function");

			}

		},

		/* Function: _fnOpenFAIRNum
		 * Parameter: 
		 * Description: Function to open fragment to update fair no
		 */
		_fnOpenFAIRNum: function() {
			try {
				if (!this._oFairNum) {
					this._oFairNum = sap.ui.xmlfragment(this.createId("idFairNum"),
						"avmet.ah.fragments.AddFAIRNum",
						this);
					this.getView().addDependent(this._oFairNum);
				}
				this._oFairNum.open(this);
			} catch (e) {
				Log.error("Exception in _fnOpenFAIRNum function");
			}

		},

		/* Function: onFairNumCancel
		 * Parameter: 
		 * Description: Function to close fragment for FAIR no
		 */
		onFairNumCancel: function() {
			try {
				if (this._oFairNum) {
					this._oFairNum.close(this);
					this._oFairNum.destroy();
					delete this._oFairNum;
				}
			} catch (e) {
				Log.error("Exception in onFairNumCancel function");
			}
		},

		/* Function: onFairNumUpdate
		 * Parameter: 
		 * Description: Function to update fair no
		 */
		onFairNumUpdate: function() {
			try {
				var oInput = this.getView().byId(sap.ui.core.Fragment.createId("idFairNum", "ipFairNumber"));
				var sText = oInput.getValue();
				if (!sText || sText.length === 0) {
					oInput.setValueState("Error");
					oInput.setValueStateText("Fill in the mandatory field");
				} else {
					oInput.setValueState("None");
					this._fnUpdateFAIRJob("A", sText);
					this.onFairNumCancel();
				}
			} catch (e) {
				Log.error("Exception in onFairNumUpdate function");
			}
		},

		/* Function: onRaiseScheduleConcession
		 * Parameter: 
		 * Description: Function call when user click raise schedule concession add in managed job
		 */
		onRaiseScheduleConcession: function() {
			try {
				if (!this._oRaiseConcession) {
					this._oRaiseConcession = sap.ui.xmlfragment(this.createId("idScheduleJobExtension"),
						"avmet.ah.fragments.ScheduleJobExtension",
						this);

					this._fnJobDueGet();
					this.getView().addDependent(this._oRaiseConcession);
				}
				this.getFragmentControl("idScheduleJobExtension", "cbJobDueId").setEditable(false);
				this.getFragmentControl("idScheduleJobExtension", "btnRaise").setVisible(true);
				this.getFragmentControl("idScheduleJobExtension", "btnEdit").setVisible(false);
				this.getFragmentControl("idScheduleJobExtension", "ipInterval").setEditable(false);
				this.getFragmentControl("idScheduleJobExtension", "dgId").setTitle("Raise Schedule Concession");
				this._fnGetUtilisationSched();
			} catch (e) {
				Log.error("Exception in onRaiseScheduleConcession function");
			}
		},
		/* Function: onCloseRaiseScheduleConcession
		 * Parameter: 
		 * Description: Function to close raise schedule concession dialog
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
		//------------------------------------------------------------------
		// Function: onAddNewWorkCenter
		// Parameter: 
		// Description: This will get called, when to open Add Workcenter fragment.
		//Table: 
		//------------------------------------------------------------------
		onAddNewWorkCenter: function(sMode) {
			try {
				var that = this,
					oLocalModel = this.getView().getModel("LocalModel");
				if (oLocalModel.getProperty("/sFlag") === "Y") {
					if (!that._oAddWorkCenter) {
						that._oAddWorkCenter = sap.ui.xmlfragment(that.createId("idWorkCenterDialog"),
							"avmet.ah.fragments.AddWorkCenterDialog",
							this);
						that.getView().addDependent(that._oAddWorkCenter);
					}
					if (!sMode) {
						sMode = "ADD";
					}
					this._fnSetWorkCenterModel(sMode);
					that._oAddWorkCenter.open(that);
				}
			} catch (e) {
				Log.error("Exception in onAddNewWorkCenter function");
			}
		},
		/* Function: _fnSetWorkCenterModel
		 * Parameter: 
		 * Description: Function to set workcenter models
		 */
		_fnSetWorkCenterModel: function(sMode) {
			try {
				var that = this;
				if (!that._oAddWorkCenter.getModel("WorkCenterDialogModel")) {
					that._oAddWorkCenter.setModel(new JSONModel({}), "WorkCenterDialogModel");
				}
				var oModel = that._oAddWorkCenter.getModel("WorkCenterDialogModel");
				if (sMode === "ADD") {
					oModel.setProperty("/WorkCenterSet", this.getView().getModel("WorkCenterSet").getData());
					oModel.setProperty("/WorkCenterTitle", this.getResourceBundle().getText(
						"tiAddWorkCenter"));
					oModel.setProperty("/WorkCenterMode", "ADD");
				} else if (sMode === "EDIT") {
					oModel.setProperty("/WorkCenterSet", this._fnGetWorkCenterModel());
					oModel.setProperty("/WorkCenterTitle", this.getResourceBundle().getText(
						"tiEditWorkCenter"));
					oModel.setProperty("/WorkCenterMode", "EDIT");
				} else if (sMode === "DELETE") {
					oModel.setProperty("/WorkCenterSet", this._fnGetWorkCenterModel());
					oModel.setProperty("/WorkCenterTitle", this.getResourceBundle().getText(
						"tiDeleteWorkCenter"));
					oModel.setProperty("/WorkCenterMode", "DELETE");
				} else if (sMode === "SWITCH") {
					oModel.setProperty("/WorkCenterSet", this._fnGetWorkCenterSwicthModel());
					oModel.setProperty("/WorkCenterTitle", this.getResourceBundle().getText(
						"tiSwitchWorkCenter"));
					oModel.setProperty("/WorkCenterMode", "SWITCH");
				}
			} catch (e) {
				Log.error("Exception in _fnSetWorkCenterModel function");
			}
		},
		/* Function: _fnGetWorkCenterModel
		 * Parameter: 
		 * Description: Function to retreive work center model
		 */
		_fnGetWorkCenterModel: function() {
			try {
				var oModel = JSON.parse(JSON.stringify(this.getModel("CreatedWorkCenterModel").getData()));
				var aSet = {};
				for (var key in oModel) {
					if (oModel[key].wrctr !== "Summary" && oModel[key].wrctr !== "RectSum") {
						aSet[oModel[key].wrctr] = oModel[key];
					}
				}
				return aSet;
			} catch (e) {
				Log.error("Exception in _fnGetWorkCenterModel function");
			}
		},
		/* Function: _fnGetWorkCenterSwicthModel
		 * Parameter: 
		 * Description: Function when work center is switched
		 */
		_fnGetWorkCenterSwicthModel: function() {
			try {
				var oLocalModel = this.getView().getModel("LocalModel");
				var oModel = JSON.parse(JSON.stringify(this.getModel("WorkCenterSet").getData()));
				var aSet = {};
				for (var key in oModel) {
					if (oModel[key].wrctr !== oLocalModel.getProperty("/WorkCenterKey")) {
						aSet[oModel[key].wrctr] = oModel[key];
					}
				}
				return aSet;
			} catch (e) {
				Log.error("Exception in _fnGetWorkCenterSwicthModel function");
			}
		},
		//------------------------------------------------------------------
		// Function: onCloseAddWorkCenterDialog
		// Parameter: 
		// Description: This will get called, when to close Add Workcenter fragment.
		//Table: 
		//------------------------------------------------------------------
		onCloseAddWorkCenterDialog: function() {
			try {
				if (this._oAddWorkCenter) {
					this._oAddWorkCenter.close(this);
					this._oAddWorkCenter.destroy();
					delete this._oAddWorkCenter;
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onCloseAddWorkCenterDialog function");

			}
		},

		/* Function: handleChangeEditTask
		 * Parameter:
		 * Description: Function call Date is changed
		 */
		handleChangeEditTask: function(oModel, oEvent) {
			var oSrc = oEvent.getSource(),
				oAppModel = this._oSPDetails.getModel(oModel);
			oSrc.setValueState("None");
			oAppModel.setProperty("/expdt", oSrc.getDateValue());
			oAppModel.refresh(true);
		},

		//------------------------------------------------------------------
		// Function: onCloseConfirmDialog
		// Parameter: 
		// Description: This will get called, when to closeconfirmation dialog after adding prime work center.
		//Table: 
		//------------------------------------------------------------------
		onCloseConfirmDialog: function() {
			try {
				var that = this;
				that.getFragmentControl("idWorkCenterDialog", "addWCId").setVisible(true);
				that.getFragmentControl("idWorkCenterDialog", "confirmWCId").setVisible(false);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onCloseConfirmDialog function");

			}
		},
		//------------------------------------------------------------------
		// Function: onEditFlyingRequirement
		// Parameter: 
		// Description: This will get called, when to Edit flying requirement dialog need to open.
		//Table: 
		//------------------------------------------------------------------
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

			}
		},

		//------------------------------------------------------------------
		// Function: onFlyingRequirementClose
		// Parameter: 
		// Description: This will get called, when to Edit flying requirement dialog need to close.
		//Table: 
		//------------------------------------------------------------------
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

			}
		},
		//------------------------------------------------------------------
		// Function: onEditSortieMonitoring
		// Parameter: 
		// Description: This will get called, when to Edit Sortie monitoring dialog need to open.
		//Table: 
		//------------------------------------------------------------------
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
					that._fnGetUtilisation(oObj);
					that._fnOperationTypeGet();
					that._oEditSORT.setModel(oModel, "SORTSet");
					that.getView().addDependent(that._oEditSORT);
					that._oEditSORT.open(that);
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onEditSortieMonitoring function");

			}
		},
		//------------------------------------------------------------------
		// Function: onSortieMonitoringClose
		// Parameter: 
		// Description: This will get called, when to Edit Sortie monitoring dialog need to close.
		//Table: 
		//------------------------------------------------------------------
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

			}
		},
		//------------------------------------------------------------------
		// Function: onAddWorkcenterSubmitPress
		// Parameter: 
		// Description: This will get called, when to Add new Workcenter dialog need to open.
		//Table: 
		//------------------------------------------------------------------
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
					}
				} else {

					oComboBoxInstance.setValueState("Error");
					oComboBoxInstance.setValueStateText("Work Center already added");
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAddWorkcenterSubmitPress function");

			}
		},
		//------------------------------------------------------------------
		// Function: onAddWorkcenterSubmitPress
		// Parameter: 
		// Description: This will get called, when to Add new Workcenter dialog need to open.
		//Table: 
		//------------------------------------------------------------------
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

			}
		},
		//------------------------------------------------------------------
		// Function: onWorkCenterChange
		// Parameter: 
		// Description: This will get called, when workcente selected in icon tab bar.
		//Table: 
		//------------------------------------------------------------------
		onWorkCenterChange: function(oEvent) {
			try {
				this.getFragmentControl("idWorkCenterDialog", "ComboWCId").setSelectedKey(oEvent.getSource().getSelectedKey());
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onWorkCenterChange function");

			}
		},
		//------------------------------------------------------------------
		// Function: onCloseAEMFDialog
		// Parameter: 
		// Description: This will get called, when close btn selected in add workcenter dialog.
		//Table: 
		//------------------------------------------------------------------
		onCloseAEMFDialog: function() {
			try {
				if (this._oWCMenuFrag) {
					this._oWCMenuFrag.close(this);
					this._oWCMenuFrag.destroy();
					delete this._oWCMenuFrag;
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onCloseAEMFDialog function");

			}
		},
		//------------------------------------------------------------------
		// Function: handlePressWorkCenterFragmentOpenMenu
		// Parameter: 
		// Description: Generic: This will get called, when open menu fragment.
		//Table: 
		//------------------------------------------------------------------
		handlePressWorkCenterFragmentOpenMenu: function(sText, oEvent) {
			try {
				var that = this,
					oStatus,
					oButton, eDock, oModel, oDialogModel;
				oModel = that.getView().getModel("LocalModel");
				if (oModel.getProperty("/sFlag") === "Y") {
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
							this.menuContext = oEvent.getSource().getBindingContext("SRMModel");
							oEvent.getSource().getParent().setSelected(true);
							oModel.setProperty("/TableFlag", sText);
							oDialogModel.setData(oModel.getData().SpareMenu);
							break;
						case "SPR":
						case "FLR":
							this.menuContext = oEvent.getSource().getBindingContext("FRModel");
							oModel.setProperty("/TableFlag", sText);
							oEvent.getSource().getParent().setSelected(true);
							oDialogModel.setData(oModel.getData().SpareMenu);
							break;

					}
					that._oWCMenuFrag.setModel(oDialogModel, "DialogModel");
					eDock = sap.ui.core.Popup.Dock;
					oButton = oEvent.getSource();
					that._oWCMenuFrag.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginFront, oButton);
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:handlePressWorkCenterFragmentOpenMenu function");

			}
		},
		//------------------------------------------------------------------
		// Function: onCloseWorkCenterMenu
		// Parameter: 
		// Description: Generic: This will get called, when close menu fragment.
		//Table: 
		//------------------------------------------------------------------
		onCloseWorkCenterMenu: function() {
			try {
				if (this._oWCMenuFrag) {
					this._oWCMenuFrag.close(this);
					this._oWCMenuFrag.destroy();
					delete this._oWCMenuFrag;
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onCloseWorkCenterMenu function");

			}
		},
		//------------------------------------------------------------------
		// Function: getWorkcenterKey
		// Parameter: 
		// Description: Generic: This will get called, when need to get selected workcenter key.
		//Table: 
		//------------------------------------------------------------------
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

			}
		},
		//------------------------------------------------------------------
		// Function: handleWorkCenterMenuItemPress
		// Parameter: 
		// Description: Generic: This will get called, when to open view menu dialog.
		//Table: 
		//------------------------------------------------------------------
		handleWorkCenterMenuItemPress: function(oEvent) {
			try {
				var that = this,
					oObj,
					sKey, oTable,
					oModel = that.getView().getModel("LocalModel"),
					oJobModel = that.getView().getModel("JobModel"),
					oSelectedItem;
				sKey = oModel.getProperty("/WorkCenterKey");
				oSelectedItem = oEvent.getParameter("item").getText();
				switch (oSelectedItem) {
					case "Set as Prime":
						oJobModel.setProperty("/prime", sKey);
						that._fnUpdateJob();
						break;
					case "Switch Work Center":
						that.onAddNewWorkCenter("SWITCH");
						break;
					case "Delete Work Center":
						if (oJobModel.getProperty("/prime") !== sKey) {
							this._fnDefectWorkCenterDelete(sKey);
						} else {
							MessageBox.error(
								"Prime workcenter can not be deleted.", {
									icon: sap.m.MessageBox.Icon.Error,
									title: "Error",
									styleClass: "sapUiSizeCompact"
								});
						}
						break;
					case "New Task":
						this.onAddCreateTask();
						break;
					case "Apply Template":
						this.getRouter().navTo("CosApplyTemplate", {
							"airid": oModel.getProperty("/sAirId"),
							"tailid": oModel.getProperty("/sTailId"),
							"jobid": oModel.getProperty("/sJobId"),
							"wc": oModel.getProperty("/WorkCenterKey"),
							"jbDate": that.getView().getModel("JobModel").getProperty("/credt"),
							"jbTime": that.getView().getModel("JobModel").getProperty("/cretm")
						});
						break;
					case "Edit":
						if (oModel.getProperty("/TableFlag") === "SMT") {
							oObj = JSON.parse(JSON.stringify(this.menuContext.getObject()));
							that.onEditSortieMonitoring(oObj);
						} else {
							oObj = JSON.parse(JSON.stringify(this.menuContext.getObject()));
							that.onEditFlyingRequirement(oObj);
						}
						break;
					case "Delete Request":
						if (oModel.getProperty("/TableFlag") === "SMT") {
							oObj = JSON.parse(JSON.stringify(this.menuContext.getObject()));
							that.onSortieMonitoringDelete(oObj);
						} else {
							oObj = JSON.parse(JSON.stringify(this.menuContext.getObject()));
							that.onFlyingRequirementDelete(oObj);
						}
						break;
				}
				oModel.updateBindings(true);
				that.onCloseWorkCenterMenu();
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:handleWorkCenterMenuItemPress function");

			}
		},
		//------------------------------------------------------------------
		// Function: onFoundDuringChange
		// Parameter: 
		// Description: Generic: This will get called, when foundduring is changed.
		//Table: 
		//------------------------------------------------------------------
		onFoundDuringChange: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sKey = oSrc.getSelectedKey(),
					oModel = this._oEditSORT.getModel("SORTSet");
				if (sKey.length > 0) {
					if (this.oObject && this.oObject[sKey] && this.oObject[sKey].VALUE) {
						var minVal = parseFloat(this.oObject[sKey].VALUE, [10]);
						var sVal = oModel.getProperty("/SORCNT") ? oModel.getProperty("/SORCNT") : 0;
						sVal = parseFloat(sVal, [10]);
						var iPrec = formatter.JobDueDecimalPrecision(sKey);
						oModel.setProperty("/SORCNT", parseFloat(minVal, [10]).toFixed(iPrec));
					} else {
						oModel.setProperty("/SORCNT", 0);
					}
				}
			} catch (e) {
				Log.error("Exception in onFoundDuringChange function");
			}
		},
		//------------------------------------------------------------------
		// Function: onSummaryIconTabBarSelect
		// Parameter: 
		// Description: Generic: This will get called, when select icon tab bar items.
		//Table: 
		//------------------------------------------------------------------
		onSummaryIconTabBarSelect: function(oEvent) {
			try {
				var that = this,
					sJobId, sWrctr, oModelLocal,
					sSelectedtxt, sSelectedKey,
					oModel;
				// Rahul: 18/11/2020: 11:03: Model initialized before to get model data.	
				oModelLocal = that.getView().getModel("JobModel");
				oModel = that.getView().getModel("LocalModel");
				// code change end
				try {
					sSelectedKey = oEvent.getParameter("selectedItem").getKey();
					sSelectedtxt = oEvent.getParameter("selectedItem").getText();
				} catch (e) {
					sSelectedKey = oEvent;
					sSelectedtxt = oModel.getProperty("/WorkCenterTitle"); // Rahul: 18/11/2020: 11:03: Code added for setting WC title
				}
				sJobId = oModel.getProperty("/sJobId");
				if (sSelectedKey === "Summary") {
					oModel.setProperty("/SummaryFlag", true);
					oModel.setProperty("/WorcenterFlag", false);
					oModel.setProperty("/RectSummaryFlag", false);
					that._fnTaskStatusGet(sJobId);
					//that.onSelectionDefectAreaChange(oModelLocal.getProperty("/deaid"));
				} else if (sSelectedKey === "RectSum") {
					oModel.setProperty("/SummaryFlag", false);
					oModel.setProperty("/WorcenterFlag", false);
					oModel.setProperty("/RectSummaryFlag", true);
					oModel.setProperty("/WorkCenterTitle", sSelectedtxt);
					oModel.setProperty("/WorkCenterKey", sSelectedKey);
				} else {
					oModel.setProperty("/SummaryFlag", false);
					oModel.setProperty("/WorcenterFlag", true);
					oModel.setProperty("/RectSummaryFlag", false);
					oModel.setProperty("/WorkCenterTitle", sSelectedtxt);
					oModel.setProperty("/WorkCenterKey", sSelectedKey);
					that._fnTasksOutStandingGet(sJobId, sSelectedKey);
					that._fnTasksPendingSupGet(sJobId, sSelectedKey);
					that._fnTasksCompleteGet(sJobId, sSelectedKey);
					that._fnFlyingRequirementsGet(sJobId, sSelectedKey);
					that._fnSortieMonitoringGet(sJobId, sSelectedKey);
					that.getView().byId("itbTaskId").setSelectedKey("OS");
					this._fnTaskCount();
				}
				this.byId("pageSummaryId").scrollTo(0);
				that._fnCreatedWorkCenterGet(sJobId);
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onSummaryIconTabBarSelect function");

			}
		},
		//------------------------------------------------------------------
		// Function: onAddFlyingRequirements
		// Parameter: 
		// Description: Navigation Method: This will get called, when click on flying requirement button.
		//Table: 
		//------------------------------------------------------------------
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

			}
		},
		//------------------------------------------------------------------
		// Function: onCloseJobPress
		// Parameter: 
		// Description: Navigation Method: This will get called, when click on Close Job button.
		//Table: 
		//------------------------------------------------------------------
		onCloseJobPress: function(oFlag) {
			try {
				var that = this,
					oModel = this.getView().getModel("LocalModel"),
					oJobModel = this.getView().getModel("JobModel");
				if (oJobModel.getProperty("/prime") !== "") {
					this._fnToolCheck(oModel.getProperty("/sJobId"), oFlag);
				} else {
					MessageBox.error(
						"Please add prime workcenter for the job to close.", {
							icon: sap.m.MessageBox.Icon.Error,
							title: "Error",
							styleClass: "sapUiSizeCompact"
						});
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onCloseJobPress function");

			}
		},
		//------------------------------------------------------------------
		// Function: onAddSortieMonitoring
		// Parameter: 
		// Description: Navigation Method: This will get called, when click on Add Sortie Monitoring button.
		//Table: 
		//------------------------------------------------------------------
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

			}
		},
		//------------------------------------------------------------------
		// Function: onAddCreateTask
		// Parameter: 
		// Description: Navigation Method: This will get called, when click on Add Create Task button.
		//Table: 
		//------------------------------------------------------------------
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
					"srvid": "NA",
					"jbDate": that.getView().getModel("JobModel").getProperty("/credt"),
					"jbTime": that.getView().getModel("JobModel").getProperty("/cretm")
				});
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onAddCreateTask function");

			}
		},
		//------------------------------------------------------------------
		// Function: onWoorkCenTblUpdateFinished
		// Parameter: 
		// Description: Generic Method: This will get called, on update finished event to update counts.
		//Table: 
		//------------------------------------------------------------------
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

			}
		},
		//------------------------------------------------------------------
		// Function: onWorkCenterSelect
		// Parameter: 
		// Description: Generic Method: This will get called, to set set selected workcenter key as selected afetr rendering or navigation.
		//Table: 
		//------------------------------------------------------------------
		onWorkCenterSelect: function(oEvent) {
			try {
				var that = this,
					oTitle = oEvent.getSource().getTitle(),
					oModelLocal = that.getView().getModel("LocalModel"), // Rahul: 18/11/2020: 11:03: Code added for get local model
					oKey = oEvent.getSource().getBindingContext("CreatedWorkCenterModel").getObject("wrctr"),
					oIconTabBar = that.getView().byId("itbDefectSummary"),
					oModel = that.getView().getModel("CreatedWorkCenterModel").getData();
				oModelLocal.setProperty("/WorkCenterTitle", oTitle); // Rahul: 18/11/2020: 11:03: Code added for setting WC title
				for (var i = 0; i < oModel.length; i++) {
					if (oModel[i].wrctrtx === oTitle) {
						oIconTabBar.setSelectedKey(oKey);
						that.onSummaryIconTabBarSelect(oKey);
					}
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onWorkCenterSelect function");

			}
		},
		//------------------------------------------------------------------
		// Function: onAllOutStandingDetailsPress
		// Parameter: 
		// Description: Generic Method: This will get called, when task from outstanding tab has been pressed to open the dialog with information.
		//Table: 
		//------------------------------------------------------------------
		onAllOutStandingDetailsPress: function(oEvent) {
			try {
				var that = this,
					oObj = oEvent.getSource().getBindingContext("TaskOutModel").getObject(),
					oModel = dataUtil.createNewJsonModel(),
					oTable = that.getView().byId("tbWcOutstandingId");
				oEvent.getSource().setSelected(true);
				oModel.setData(null);
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

			}
		},
		//------------------------------------------------------------------
		// Function: onAllOutStandingDetailsClose
		// Parameter: 
		// Description: Generic Method: This will get called, to clsoe the dialog .
		//Table: 
		//------------------------------------------------------------------
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

			}
		},

		//------------------------------------------------------------------
		// Function: onMangeTaskPress
		// Parameter: 
		// Description: Generic Method: This will get called, when task from outstanding tab has been pressed to open the dialog with information.
		//Table: 
		//------------------------------------------------------------------
		onMangeTaskPress: function(oEvent) {
			try {
				var that = this,
					oObj = this._oOSDetails.getModel("DetailsOutModel").getData(),
					oModel = dataUtil.createNewJsonModel();
				this.onAllOutStandingDetailsClose();
				//oObj.PRESERNR=oObj.sernr;
				var oMod = JSON.parse(JSON.stringify(oObj));
				oModel.setData(null);
				oModel.setData(oMod);
				if (!that._oMGDetails) {
					that._oMGDetails = sap.ui.xmlfragment("OSTId",
						"avmet.ah.view.ah.summary.subfolder.edittask.EditCreateTask",
						that);
					//that._oMGDetails.setModel(oModel, "ManageTaskModel");
					that._oMGDetails.setModel(oModel, "ManageTaskModel");
					that.getView().addDependent(that._oMGDetails);
				}
				that._oMGDetails.open(that);
			} catch (e) {
				Log.error("Exception in onMangeTaskPress function");
			}
		},
		//------------------------------------------------------------------
		// Function: onMangeTaskPressClose
		// Parameter: 
		// Description: Generic Method: This will get called, to clsoe the dialog .
		//Table: 
		//------------------------------------------------------------------
		onMangeTaskPressClose: function() {
			try {
				if (this._oMGDetails) {
					this._oMGDetails.close(this);
					this._oMGDetails.destroy();
					delete this._oMGDetails;
				}
			} catch (e) {
				Log.error("Exception in onMangeTaskPressClose function");
			}
		},

		//------------------------------------------------------------------
		// Function: handleLiveChangeFlyingRequirements
		// Parameter: 
		// Description: Generic Method: This will get called, to showing the message text and validation of maxlength.
		//Table: 
		//------------------------------------------------------------------
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

			}
		},

		//------------------------------------------------------------------
		// Function: onPendingSupDetailsPress
		// Parameter: 
		// Description: Generic Method: This will get called, when task from Pending Supervisor tab has been pressed to open the dialog with information.
		//Table: 
		//------------------------------------------------------------------
		//Rahul: 03/12/2020 06.11PM: New Parameter added "oFlagEv"
		onPendingSupDetailsPress: function(oObj, oFlagEv) {
			try {
				var that = this,
					oLimitModel = this.getView().getModel("oViewLimitModel"),
					oMod,
					oModel = dataUtil.createNewJsonModel();
				if (oObj.multi !== "" && oObj.multi !== null) {
					this._fnMultiTradmanGet(oObj.taskid);
				}
				oMod = JSON.parse(JSON.stringify(oObj));
				if (!that._oSupDetails) {
					that._oSupDetails = sap.ui.xmlfragment("OSTId",
						"avmet.ah.fragments.SupervisorTaskDetails",
						that);
					if (oMod.expdt !== null && oMod.expdt !== "") {
						oMod.expdt = new Date(oMod.expdt);
						oMod.exptm = formatter.defaultTimeFormatDisplay(oMod.exptm);
					}
					if (oMod.exptm !== null && oMod.exptm !== "") {
						oMod.exptm = formatter.defaultTimeFormatDisplay(oMod.exptm);
					}
					switch (oMod.oppr) {
						case "B":
							oLimitModel.setProperty("/bDateSection", true);
							oLimitModel.setProperty("/bUtilisationSection", true);
							break;
						case "D":
							oLimitModel.setProperty("/bDateSection", true);
							oLimitModel.setProperty("/bUtilisationSection", false);
							break;
						case "U":
							oLimitModel.setProperty("/bDateSection", false);
							oLimitModel.setProperty("/bUtilisationSection", true);
							break;
					}

					if (oMod.util1 !== null && oMod.util1 !== "" && oMod.util1 !== "UTIL1_20") {
						if (this.oObject && this.oObject[oMod.util1] && this.oObject[oMod.util1].VALUE) {
							var minVal = parseFloat(this.oObject[oMod.util1].VALUE, [10]);
							oLimitModel.setProperty("/UTILMinVL", minVal);
							var sVal = oModel.getProperty("/utilvl") ? oModel.getProperty("/utilvl") : 0;
							sVal = parseFloat(sVal, [10]);
							var iPrec = formatter.JobDueDecimalPrecision(oMod.util1);
							oModel.setProperty("/utilvl", parseFloat(minVal, [10]).toFixed(iPrec));
						}
					}
					oModel.setData(oMod);
					that._oSupDetails.setModel(oModel, "DetailsSupModel");
					that.getView().addDependent(that._oSupDetails);
				}
				that._oSupDetails.open(that);
				if (oObj.tt1id === "TT1_10" && oObj.tt2id === "TT2_10" && oObj.engflag === "EG") {
					that.getSerialNoPress(oObj.partno);
				}
				//Rahul: 03/12/2020 06.11PM: If condition added.
				if (oFlagEv === "COM") {
					sap.ui.core.Fragment.byId("OSTId", "msSupId").setVisible(false);
				}
			} catch (e) {
				Log.error("Exception in onPendingSupDetailsPress function");
			}
		},
		/* Function: onPendingSupEditDetailsPress
		 * Parameter: 
		 * Description: Function to edit task
		 */
		onPendingSupEditDetailsPress: function() {
			try {
				var that = this,
					oMod,
					oLimitModel = this.getView().getModel("oViewLimitModel"),
					oObj = this._oSupDetails.getModel("DetailsSupModel").getData(),
					oModel;
				this._oSupDetails.getModel("DetailsSupModel").getData();
				oMod = JSON.parse(JSON.stringify(oObj));
				oModel = dataUtil.createNewJsonModel();
				/*	if (oMod.multi !== null) {
						this._fnMultiTradmanGet(oMod.taskid);
					}*/
				this.onPendingSupDetailsClose();
				if (!that._oSPDetails) {
					that._oSPDetails = sap.ui.xmlfragment("OSTId",
						"avmet.ah.fragments.SupervisorEditTaskDetails",
						that);
					if (oMod.expdt !== null && oMod.expdt !== "") {
						oMod.expdt = new Date(oMod.expdt);
						oMod.exptm = formatter.defaultTimeFormatDisplay(oMod.exptm);
					}
					if (oMod.exptm !== null && oMod.exptm !== "") {
						oMod.exptm = formatter.defaultTimeFormatDisplay(oMod.exptm);
					}
					switch (oMod.oppr) {
						case "B":
							oLimitModel.setProperty("/bDateSection", true);
							oLimitModel.setProperty("/bUtilisationSection", true);
							break;
						case "D":
							oLimitModel.setProperty("/bDateSection", true);
							oLimitModel.setProperty("/bUtilisationSection", false);
							break;
						case "U":
							oLimitModel.setProperty("/bDateSection", false);
							oLimitModel.setProperty("/bUtilisationSection", true);
							break;
					}

					if (oMod.util1 !== null && oMod.util1 !== "") {
						if (this.oObject && this.oObject[oMod.util1] && this.oObject[oMod.util1].VALUE) {
							var minVal = parseFloat(this.oObject[oMod.util1].VALUE, [10]);
							oLimitModel.setProperty("/UTILMinVL", minVal);
							var sVal = oModel.getProperty("/utilvl") ? oModel.getProperty("/utilvl") : 0;
							sVal = parseFloat(sVal, [10]);
							var iPrec = formatter.JobDueDecimalPrecision(oMod.util1);
							oModel.setProperty("/utilvl", parseFloat(minVal, [10]).toFixed(iPrec));

						}

					}
					oModel.setData(oMod);
					that._oSPDetails.setModel(oModel, "DetailsSupEditModel");
					that.getView().addDependent(that._oSPDetails);
					if (oObj.tt1id === "TT1_10" && oObj.tt2id === "TT2_10" && oObj.engflag === "EG") {
						that.getSerialNoPress(oObj.partno);
					}
				}
				that._oSPDetails.open(that);
			} catch (e) {
				Log.error("Exception in onPendingSupDetailsPress function");
			}
		},
		/* Function: onReasonTypeChange
		 * Parameter: oEvent
		 * Description: This will get called,on change of reason type for ADD change.
		 */

		onReasonTypeChange: function(oEvent) {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel"),
					oModel = this._oSPDetails.getModel("DetailsSupEditModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				oModel.setProperty("/expdt", "");
				oModel.setProperty("/exptm", "");
				oModel.setProperty("/utilvl", "");
				oModel.setProperty("/util1", "");
				oViewLimitModel.setProperty("/UTILMinVL", 0);
				if (sSelectedKey === "D") {
					oModel.setProperty("/exptm", "23:59");
					oViewLimitModel.setProperty("/bDateSection", true);
					oViewLimitModel.setProperty("/bUtilisationSection", false);
					oViewLimitModel.setProperty("/sSlectedKey", sSelectedKey);
				} else if (sSelectedKey === "U") {
					oViewLimitModel.setProperty("/bDateSection", false);
					oViewLimitModel.setProperty("/bUtilisationSection", true);
					oViewLimitModel.setProperty("/sUtilKey", "");
					oViewLimitModel.setProperty("/bAirFrameAndTAC", false);
					oViewLimitModel.setProperty("/bScheduleService", false);
					oViewLimitModel.setProperty("/bPhaseService", false);
					oViewLimitModel.setProperty("/sSlectedKey", sSelectedKey);
					oModel.setProperty("/bUtilisationSection", true);
				} else if (sSelectedKey === "B") {
					oModel.setProperty("/exptm", "23:59");
					oViewLimitModel.setProperty("/bDateSection", true);
					oViewLimitModel.setProperty("/bUtilisationSection", true);
					oViewLimitModel.setProperty("/sSlectedKey", sSelectedKey);
				}
				oModel.setProperty("/oppr", sSelectedKey);
				oModel.updateBindings(true);
				oViewLimitModel.setProperty("/bLimitationSection", true);
				oViewLimitModel.setProperty("/bLimitation", false);
				oViewLimitModel.setProperty("/bAddLimitationBtn", true);
			} catch (e) {
				Log.error("Exception in onReasonTypeChange function");
			}
		},

		/* Function: onCompleteDetailsPress
		 * Parameter: 
		 * Description: Function to open dialog when task is closed
		 */
		onCompleteDetailsPress: function(oPayLoad) {
			try {
				var that = this,
					oModel;
				oModel = dataUtil.createNewJsonModel();
				if (oPayLoad.multi !== null && oPayLoad.multi !== "" && oPayLoad.multi !== "0") {
					this._fnMultiTradmanGet(oPayLoad.taskid);
				}

				if (oPayLoad.tstat === "P") {
					oPayLoad.editable = true;
				} else if (oPayLoad.tstat === "X") {
					var bFlag = this._fnCheckTime24hrs(oPayLoad);
					oPayLoad.editable = bFlag;
				}

				if (!that._oSupDetails) {
					that._oSupDetails = sap.ui.xmlfragment("OSTId",
						"avmet.ah.fragments.SupervisorTaskDetails",
						that);
					oModel.setData(oPayLoad);
					that._oSupDetails.setModel(oModel, "DetailsSupModel");
					that.getView().addDependent(that._oSupDetails);
				}
				that._oSupDetails.open(that);

				// if (!that._oComDetails) {
				// 	that._oComDetails = sap.ui.xmlfragment("OSTId",
				// 		"avmet.ah.fragments.CompletedTaskDetails",
				// 		that);
				// 	oModel.setData(oPayLoad);
				// 	that._oComDetails.setModel(oModel, "DetailsComModel");
				// 	that.getView().addDependent(that._oComDetails);
				// }
				// that._oComDetails.open(that);
			} catch (e) {
				Log.error("Exception in onCompleteDetailsPress function");
			}
		},
		/* Function: _fnCheckTime24hrs
		 * Parameter: 
		 * Description: Function to check time difference between closing date and current time 
		 * return true/ false based on difference is greate than 24 hrs or not
		 */
		_fnCheckTime24hrs: function(oPayload) {
			try {
				var oModel = oPayload;
				var maxDt = new Date(),
					creDt = new Date(oModel.SG1DTM),
					creTm = oModel.SG1UZT;

				var timeParts = creTm.split(":");
				creDt.setHours(timeParts[0]);
				creDt.setMinutes(timeParts[1]);
				creDt.setSeconds(0);

				var diff = maxDt.getTime() - creDt.getTime();
				var daysDifference = Math.floor(diff / 1000 / 60 / 60 / 24);
				if (daysDifference >= 1) {
					return false;
				} else {
					return true;
				}

			} catch (e) {
				Log.error("Exception in fnJobEditCheck function");

			}
		},

		//------------------------------------------------------------------
		// Function: onCompleteDetailsClose
		// Parameter: 
		// Description: Generic Method: This will get called, to clsoe the dialog .
		//Table: 
		//------------------------------------------------------------------
		onCompleteDetailsClose: function() {
			try {
				if (this._oComDetails) {
					var oTable = this.getView().byId("tbWcCompletedId");
					oTable.removeSelections(true);
					this._oComDetails.close(this);
					this._oComDetails.destroy();
					delete this._oComDetails;
				}
			} catch (e) {
				Log.error("Exception in onCompleteDetailsClose function");
			}
		},
		//------------------------------------------------------------------
		// Function: onPendingSupEditDetailsClose
		// Parameter: 
		// Description: Generic Method: This will get called, to clsoe the dialog .
		//Table: 
		//------------------------------------------------------------------
		onPendingSupEditDetailsClose: function() {
			try {
				if (this._oSPDetails) {
					var oTable = this.getView().byId("tbWcPendingSuperId"),
						oModel = this.getView().getModel("LocalModel");
					oModel.setProperty("/bSuperDiaFlag", false);
					oTable.removeSelections(true);
					this._oSPDetails.close(this);
					this._oSPDetails.destroy();
					delete this._oSPDetails;
				}
			} catch (e) {
				Log.error("Exception in onPendingSupEditDetailsClose function");
			}
		},

		//------------------------------------------------------------------
		// Function: onPendingSupDetailsClose
		// Parameter: 
		// Description: Generic Method: This will get called, to clsoe the dialog .
		//Table: 
		//------------------------------------------------------------------
		onPendingSupDetailsClose: function() {
			try {
				if (this._oSupDetails) {
					var oTable = this.getView().byId("tbWcPendingSuperId"),
						oModel = this.getView().getModel("LocalModel");
					oModel.setProperty("/bSuperDiaFlag", false);
					oTable.removeSelections(true);
					this._oSupDetails.close(this);
					this._oSupDetails.destroy();
					delete this._oSupDetails;
				}
			} catch (e) {
				Log.error("Exception in onPendingSupDetailsClose function");
			}
		},

		//------------------------------------------------------------------
		// Function: onTypeDescChange
		// Parameter: 
		// Description: This will get called, when type of decription selected from Create Task fragment.
		//Table: 
		//------------------------------------------------------------------
		onTypeDescChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey();
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/tt4id", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/cdesc", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/sernr", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/itemno", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/otherss", "");
				this._oMGDetails.getModel("ManageTaskModel").refresh();
				if (sSelectedKey === "TT3_10") {
					this._fnGetTaskTT310DropDown();
				} else if (sSelectedKey === "TT3_11") {
					this._fnGetTaskTT311DropDown();
				}
			} catch (e) {
				Log.error("Exception in onTypeDescChange function");
			}
		},
		/* Function: onOpenForAccessChange
		 * Parameter: 
		 * Description: Function call when access is changed
		 */
		onOpenForAccessChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey();
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/cdesc", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/sernr", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/itemno", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/otherss", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/sCompDesc", "");
				this._oMGDetails.getModel("ManageTaskModel").refresh();
			} catch (e) {
				Log.error("Exception in onOpenForAccessChange function");
			}
		},
		/* Function: onRemoveForAccessChange
		 * Parameter: 
		 * Description: Function when access is removed
		 */
		onRemoveForAccessChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey();
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/cdesc", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/sernr", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/itemno", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/otherss", "");
				this._oMGDetails.getModel("ManageTaskModel").setProperty("/sCompDesc", "");
				this._oMGDetails.getModel("ManageTaskModel").refresh();
			} catch (e) {
				Log.error("Exception in onRemoveForAccessChange function");
			}
		},
		/* Function: _fnResetTaskModelData
		 * Parameter: 
		 * Description: Function to reset model
		 */
		_fnResetTaskModelData: function() {
			var oModel = this._oMGDetails.getModel("ManageTaskModel");
			oModel.setProperty("/toref", "IETM");
			oModel.setProperty("/engflag", "NA");
			oModel.setProperty("/sernr", "");
			oModel.setProperty("/partno", "");
			oModel.setProperty("/cdesc", "");
			oModel.setProperty("/tt4id", "");
			oModel.setProperty("/tt3id", "");
			oModel.setProperty("/ismat", "");
			oModel.setProperty("/isser", "");
			oModel.setProperty("/fragid", "");
			oModel.setProperty("/ftcdesc", "");
			oModel.setProperty("/ftchkfor", "");
			oModel.setProperty("/ftcredt", "");
			oModel.setProperty("/ftcretm", "");
			oModel.setProperty("/ftdesc", "");
			oModel.setProperty("/ftfind", "");
			oModel.setProperty("/ftitemno", "");
			oModel.setProperty("/ftothers", "");
			oModel.setProperty("/ftrsltgd", "");
			oModel.setProperty("/ftsernr", "");
			oModel.setProperty("/ftt1id", "");
			oModel.setProperty("/fttoref", "");
			oModel.setProperty("/rtstat", "X");
			oModel.setProperty("/sernr", "");
			oModel.setProperty("/itemno", "");
			oModel.setProperty("/otherss", "");
			oModel.setProperty("/tdesc", "");
			oModel.setProperty("/symbol", "0");
			oModel.refresh();
			oModel.updateBindings(true);
		},
		/* Function: onRemoveInstallTaskChange
		 * Parameter: 
		 * Description: Function call when task type is selected remove/intall
		 */
		onRemoveInstallTaskChange: function(oEvent) {
			try {
				var oModel = this._oMGDetails.getModel("ManageTaskModel");
				var sSelectedKey = oEvent.getSource().getSelectedKey();
				this._fnResetTaskModelData();
				if (sSelectedKey !== "TT2_11") {
					oModel.setProperty("/ismat", "Part No.");
					oModel.setProperty("/isser", "Serial No. (S/N)");
				}
				oModel.refresh();
			} catch (e) {
				Log.error("Exception in onRemoveForAccessChange function");
			}
		},
		/* Function: onTaskTypeChange
		 * Parameter: 
		 * Description: Funtion call when task type is changed
		 */
		onTaskTypeChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey();
				var oModel = this._oMGDetails.getModel("ManageTaskModel");
				if (sSelectedKey === "TT1_99") {
					oModel.setProperty("/ENTINERR", "X");
					oModel.setProperty("/tt1id", sSelectedKey);
				} else {
					oModel.setProperty("/tt2id", "");
					this._fnResetTaskModelData();
				}
				oModel.setProperty("/tt1id", sSelectedKey);

			} catch (e) {
				Log.error("Exception in onTaskTypeChange function");
			}
		},

		//------------------------------------------------------------------
		// Function: onCloseTask
		// Parameter: 
		// Description: Navigation Method: This will get called, when click on Close Task button.
		//Table: 
		//------------------------------------------------------------------

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
						var bMasterTaskFlag = this._fnCheckMasterTask(oTable.getSelectedItems()[0]);
						if (!bMasterTaskFlag) {
							sap.m.MessageBox.error("Please close all sub task for this master task before closing");
							return;
						}
						bFlag = "N";
					} else {
						bFlag = "Y";
					}
					this.onAllOutStandingDetailsClose();
					this.onMangeTaskPressClose();
					that.getRouter().navTo("CosCloseTask", {
						"JobId": oModel.getProperty("/sJobId"),
						"TaskId": JSON.stringify(oTaskId),
						"AirId": oModel.getProperty("/sAirId"),
						"TailId": oModel.getProperty("/sTailId"),
						"WorkCenter": oModel.getProperty("/WorkCenterTitle"),
						"WorkKey": oModel.getProperty("/WorkCenterKey"),
						"MultiFLag": bFlag,
						"jbDate": that.getView().getModel("JobModel").getProperty("/credt"),
						"jbTime": that.getView().getModel("JobModel").getProperty("/cretm")
					});
				} else {
					MessageBox.error(
						"Please select task to close.", {
							icon: sap.m.MessageBox.Icon.Error,
							title: "Error",
							styleClass: "sapUiSizeCompact"
						});
				}
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onCloseTask function");

			}
		},

		//------------------------------------------------------------------
		// Function: onOpenErrorDialog
		// Parameter: 
		// Description: This will get called, when to Error dialog need to open.
		//Table: 
		//------------------------------------------------------------------
		onOpenErrorDialog: function(oErrorArray) {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel();
				if (!that._oErrorDia) {
					that._oErrorDia = sap.ui.xmlfragment(that.createId("idErroDia"),
						"avmet.ah.fragments.ErrorMessageDialog",
						this);
					oModel.setData(oErrorArray);
					that._oErrorDia.setModel(oModel, "ErroModel");
					that.getView().addDependent(that._oErrorDia);
					that._oErrorDia.open(that);
				}
			} catch (e) {
				Log.error("Exception in onEditFlyingRequirement function");
			}
		},
		//------------------------------------------------------------------
		// Function: onErrorDialogClose
		// Parameter: 
		// Description: This will get called, when to Error dialog need to close.
		//Table: 
		//------------------------------------------------------------------
		onErrorDialogClose: function() {
			try {
				if (this._oErrorDia) {
					this._oErrorDia.close(this);
					this._oErrorDia.destroy();
					delete this._oErrorDia;
				}
			} catch (e) {
				Log.error("Exception in onFlyingRequirementClose function");
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
				}, 300);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:onSelectionDefectAreaChange function");

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
				//Rahul: Code commented: 23/11/2020: 07:47PM Start
				/*	var aCord = this.getModel("PhotoModel").getProperty("/Coordinates");
					if (aCord) {
						this.drawCoordinates("", aCord);
					}*/
				//Rahul: Code commented: 23/11/2020: 07:47PM End
			} catch (e) {
				Log.error("Exception in _fnRenderImage function");
			}
		},

		/* Function: drawCoordinates
		 * Parameter: sDaid, oArray
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
				Log.error("Exception in drawCoordinates function");
			}
		},
		//------------------------------------------------------------------
		// Function: _fnTaskCount
		// Parameter: 
		// Description: This will get called, when to get tasks count.
		//Table: 
		//------------------------------------------------------------------ 
		_fnTaskCount: function() {
			try {
				var oModel = this.getView().getModel("LocalModel"),
					otbComplete = oModel.getProperty("/CompleteCount"),
					otbOutStanding = oModel.getProperty("/OutstandingCount"),
					otbPendingApprovale = oModel.getProperty("/PendingSupCount");

				oModel.setProperty("/TaskCount", otbOutStanding + otbComplete + otbPendingApprovale);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnTaskCount function");

			}
		},

		//------------------------------------------------------------------
		// Function: _fnCheckWCTaskCount
		// Parameter: sWorkCenterKey
		// Description: This will get called, when deleteing workcenter, to check active task count.
		//Table: MARK
		//------------------------------------------------------------------
		_fnCheckWCTaskCount: function(sWorkCenterKey) {
			try {
				var oWorkCenterModel = this.getView().getModel("CreatedWorkCenterModel");
				for (var i = 0; i < oWorkCenterModel.getData().length; i++) {
					if (oWorkCenterModel.getData()[i].wrctr === sWorkCenterKey) {
						if (oWorkCenterModel.getData()[i].count !== "0") {
							return false;
						} else {
							return true;
						}
					}
				}
			} catch (e) {
				Log.error("Exception in _fnGetObjectTypeAndActivity function");
			}
		},
		/* Function: _fnGetObjectTypeAndActivity
		 * Parameter: oData
		 * Description: Private Function to get activity key and object for sign off
		 */
		_fnGetObjectTypeAndActivity: function(sTaskType) {
			var oTemp;
			try {
				switch (sTaskType) {
					case "TT1_10":
					case "TT1_11":
					case "TT1_12":
					case "TT1_13":
					case "TT1_14":
					case "TT1_15":
						oTemp = {
							"obj": "ZRM_COS_TS",
							"Act": "4"
						};
						return oTemp;
					case "TT1_16":
						oTemp = {
							"obj": "ZRM_COS_IP",
							"Act": "6"
						};
						return oTemp;
					case "TT1_17":
						oTemp = {
							"obj": "ZRM_COS_QA",
							"Act": "6"
						};
						return oTemp;
					case "TT1_18":
						oTemp = {
							"obj": "ZRM_COS_IN",
							"Act": "6"
						};
						return oTemp;
					case "TT1_19":
						oTemp = {
							"obj": "ZRM_FS_SRX",
							"Act": "4"
						};
						return oTemp;
					default:
						oTemp = {
							"obj": "ZRM_COS_TS",
							"Act": "4"
						};
						return oTemp;
				}
			} catch (e) {
				Log.error("Exception in _fnGetObjectTypeAndActivity function");
			}
			/*}*/
		},
		//------------------------------------------------------------------
		// Function: _fnCheckStatus
		// Parameter: aState
		// Description: This will get called, to check Tail status.
		//Table: 
		//------------------------------------------------------------------ 
		_fnCheckStatus: function(aState) {
			try {
				if (aState !== undefined) {
					switch (aState) {
						case "AST_FFF":
						case "AST_RFF":
						case "AST_FAIR":
						case "AST_FAIR0":
						case "AST_FAIR1":
						case "AST_FAIR2":
							return true;
						default:
							return false;
					}
				} else {
					return false;
				}
			} catch (e) {
				Log.error("Exception in _fnCheckStatus function");
			}
		},

		//------------------------------------------------------------------
		// Function: _fnValidateWorkCenterRecord
		// Parameter: sSelectedKey
		// Description: This will get called, when to vialidate workcenter added is already present in list for selected job.
		//Table: 
		//------------------------------------------------------------------ 
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

			}
		},
		//------------------------------------------------------------------
		// Function: _fnResetWorkCenterPrimeStatus
		// Parameter: sText, sState
		// Description: This will get called, when to reset prime status of the workcenter.
		//Table: 
		//------------------------------------------------------------------ 
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

			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetWorkCenterPrimeStatus
		// Parameter: oText
		// Description: This will get called, when to check prime status of the workcenter.
		//Table: 
		//------------------------------------------------------------------ 
		_fnGetWorkCenterPrimeStatus: function(oText) {
			try {
				var that = this,
					oflag = false,
					oCreateJobLocalModel;
				var oCreateJobLocalModel = that.getView().getModel("CreatedWorkCenterModel").getData();
				for (var i = 0; i < oCreateJobLocalModel.length; i++) {
					if (oCreateJobLocalModel[i].wrctrtx === oText && (oCreateJobLocalModel[i].isprime !== null && oCreateJobLocalModel[i].isprime !==
							"")) {
						oflag = true;
					}
				}
				return oflag;
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_fnGetWorkCenterPrimeStatus function");

			}
		},
		//------------------------------------------------------------------
		// Function: _fnTableOutstandingFilter
		// Parameter: 
		// Description: This will get called, when items in OutStanding tasks table are binded/Updated (Update Finished).
		//Table: 
		//------------------------------------------------------------------ 
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

			}
		},
		//------------------------------------------------------------------
		// Function: _fnTableCompletedFilter
		// Parameter: 
		// Description: This will get called, when items in Completed tasks table are binded/Updated (Update Finished).
		//Table: 
		//------------------------------------------------------------------ 
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

			}
		},
		//------------------------------------------------------------------
		// Function: _fnTablePendingFilter
		// Parameter: 
		// Description: This will get called, when items in Pending suervisor tasks table are binded/Updated (Update Finished).
		//Table: 
		//------------------------------------------------------------------ 
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

			}
		},
		//------------------------------------------------------------------
		// Function: _fnApplyFilter
		// Parameter: 
		// Description: This will get called, when items in Pending suervisor tasks table are binded/Updated (Update Finished).
		//Table: 
		//------------------------------------------------------------------ 
		_fnApplyFilter: function(oFilterWC) {
			try {
				var oFilters, filterObj, oBindingFlyingReq, oBindingSortieMonitoring, oBindingDemanSpare, oBindingCompleted,
					oBindingOutstanding,
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

			}
		},
		/* Function: removeCoordinates
		 * Parameter: x, y, oCanvas
		 * Description: Function to remove coordinates from the canvas
		 */
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
		},
		/* Function: _fnCheckMasterTask
		 * Parameter: 
		 * Description: Function to check if selected task contain sub task or not
		 */
		_fnCheckMasterTask: function(oTask) {
			try {
				oTask = oTask.getBindingContext("TaskOutModel").getObject();
				if (oTask.RTTY === "M") {
					var aContext = this.getView().byId("tbWcOutstandingId").getBinding("items").getContexts();
					for (var i in aContext) {
						var obj = aContext[i].getObject();
						if (oTask.tmpid === obj.tmpid && obj.RTTY === "S") {
							return false;
						}
					}
				}
				return true;
			} catch (e) {
				Log.error("Exception in _fnCheckMasterTask function");
			}
		},

		/* Function: _InitializeLimDialogModel
		 * Parameter: 
		 * Description: Function to initialise local models
		 */
		_InitializeLimDialogModel: function() {
			try {
				var oModel = dataUtil.createNewJsonModel();
				var DatePrev = new Date();
				var aData = {
					sAddReason: "noKey",
					bDateSection: false,
					bUtilisationSection: false,
					bLimitationSection: false,
					bPrdOfDefermentDesc: false,
					bDemandNo: false,
					bOtherReason: false,
					bPeriodofDeferment: false,
					sUtilKey: "",
					bAirFrameAndTAC: false,
					bScheduleService: false,
					bPhaseService: false,
					bLimitation: false,
					bAddLimitationBtn: false,
					UTILMinVL: 0,
					sSlectedKey: "N",
					DatePrev: DatePrev,
					Date: new Date(),
					Time: new Date().getHours() + ":" + new Date().getMinutes()
				};
				oModel.setData(aData);
				if (this.getModel("oViewLimitModel")) {
					this.getModel("oViewLimitModel").setData(aData);
				} else {
					this.getView().setModel(oModel, "oViewLimitModel");
				}

			} catch (e) {
				Log.error("Exception in _InitializeLimDialogModel function");
			}
		},
		/* Function: onUilisationChange
		 * Parameter: oEvent
		 * Description: This will get called,on change of Utilization drop down for ADD change.
		 */
		onUilisationChange: function(oEvent) {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel"),
					oLocalModelModel = this.getModel("LocalModel"),
					oModel = this._oSPDetails.getModel("DetailsSupEditModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				/*oLocalModelModel.setProperty("/bSuperDiaFlag", false);*/
				oLocalModelModel.refresh();
				if (sSelectedKey === "UTIL1_10" || sSelectedKey === "UTIL1_11" || sSelectedKey === "UTIL1_12" || sSelectedKey === "UTIL1_13" ||
					sSelectedKey ===
					"UTIL1_14" || sSelectedKey === "UTIL1_15" || sSelectedKey === "UTIL1_21") {
					oViewLimitModel.setProperty("/bAirFrameAndTAC", true);
					oViewLimitModel.setProperty("/bScheduleService", false);
					oViewLimitModel.setProperty("/bPhaseService", false);
				} else if (sSelectedKey === "Next Scheduling Servicing") {
					oViewLimitModel.setProperty("/bAirFrameAndTAC", false);
					oViewLimitModel.setProperty("/bScheduleService", true);
					oViewLimitModel.setProperty("/bPhaseService", false);
				} else if (sSelectedKey === "Next Phase Servicing") {
					oViewLimitModel.setProperty("/bAirFrameAndTAC", false);
					oViewLimitModel.setProperty("/bScheduleService", false);
					oViewLimitModel.setProperty("/bPhaseService", true);
				}

				if (sSelectedKey.length > 0) {
					if (this.oObject && this.oObject[sSelectedKey] && this.oObject[sSelectedKey].VALUE) {
						var minVal = parseFloat(this.oObject[sSelectedKey].VALUE, [10]);
						oViewLimitModel.setProperty("/UTILMinVL", minVal);
						var sVal = oModel.getProperty("/utilvl") ? oModel.getProperty("/utilvl") : 0;
						sVal = parseFloat(sVal, [10]);
						var iPrec = formatter.JobDueDecimalPrecision(sSelectedKey);
						oModel.setProperty("/utilvl", parseFloat(minVal, [10]).toFixed(iPrec));

					}

				}
				oModel.setProperty("/util1", sSelectedKey);
			} catch (e) {
				Log.error("Exception in onUilisationChange function");
			}
		},
		/* Function: _onfnToolCheckSuccess
		 * Parameter: aData, oFlag
		 * Description: Function to when tool check service on success
		 */
		_onfnToolCheckSuccess: function(aData, oFlag) {
			try {
				var oJobModel = this.getView().getModel("JobModel");
				if (aData.length === 1 && aData[0].FLAG === "OKAY" || oFlag === "Y") {
					if (oJobModel.getProperty("/jobdesc") !== "" && oJobModel.getProperty("/jobdesc") !== "") {
						if (oJobModel.getProperty("/fndid") !== "" && oJobModel.getProperty("/fndid") !== "") {
							this.getRouter().navTo("CosCloseJob", {
								"JobId": aData[0].JOBID,
								"Flag": oFlag
							});
						} else {
							var sTextFD = "Please add found during to close this job.";
							sap.m.MessageBox.error(sTextFD);
							return false;
						}
					} else {
						var sTextCL = "Please add job description to close this job.";
						sap.m.MessageBox.error(sTextCL);
						return false;
					}
				} else {
					var sText = "Tools Check task not found for below Work Center(s):\n";
					for (var i in aData) {
						sText = sText.concat("\n" + aData[i].WORKCENTERDESC);
					}
					sap.m.MessageBox.error(sText);
					return false;
				}
			} catch (e) {
				Log.error("Exception in _onfnToolCheckSuccess function");
			}
		},
		/* Function: _fnEditRectButtonVisibility
		 * Parameter: 
		 * Description: Function to handle edit button on recitfy summary
		 */
		_fnEditRectButtonVisibility: function() {
			try {
				var oLocalModel = this.getView().getModel("LocalModel");
				if (oLocalModel.getProperty("/sFlag") === "Y") {
					oLocalModel.setProperty("/isEditableRect", true);
				} else if (oLocalModel.getProperty("/sFlag") === "N") {
					var bFlag = this._fnJobEditCheck();
					oLocalModel.setProperty("/isEditableRect", bFlag);
				}
			} catch (e) {
				Log.error("Exception in _fnEditRectButtonVisibility function");

			}
		},
		/* Function: _fnJobEditCheck
		 * Parameter: 
		 * Description: Function to check time difference between closing date and current time 
		 * return true/ false based on difference is greate than 24 hrs or not for job
		 */
		_fnJobEditCheck: function() {
			try {
				var oModel = this.getModel("JobModel").getData();
				var maxDt = new Date(),
					creDt = new Date(oModel.credtm),
					creTm = oModel.cretm;

				var timeParts = creTm.split(":");
				creDt.setHours(timeParts[0]);
				creDt.setMinutes(timeParts[1]);
				creDt.setSeconds(0);

				var diff = maxDt.getTime() - creDt.getTime();
				var daysDifference = Math.floor(diff / 1000 / 60 / 60 / 24);
				if (daysDifference >= 1) {
					return false;
				} else {
					return true;
				}

			} catch (e) {
				Log.error("Exception in fnJobEditCheck function");

			}
		},
		/* Function: onWarningMessagePress
		 * Parameter: 
		 * Description:Show the Es Posting Status.
		 * return true/ false based on difference is greate than 24 hrs or not for job
		 */
		onWarningMessagePress: function(oEvent) {
			var oJobModel = this.getView().getModel("JobModel");
			var sText = oJobModel.getProperty("/esstatusmsg");
			this.onWarningMessageSelect(oEvent, sText);
		},

		// ***************************************************************************
		//   4. Private Function   
		// ***************************************************************************
		/* Function: _handleRouteMatched
		 * Parameter: oEvent
		 * Description: This will called to handle route matched.
		 */
		_handleRouteMatched: function(oEvent) {
			try {

				var that = this;
				var sTailId, sJobId, sSqnId, sFlag, oSummaryModelData, sWcKey, sGoTo,
					sModId, oGBAppModel = this.getView().getModel("avmetModel"),
					sAirId, oViewModel = that.getView().getModel("LocalModel");
				var oSummaryModel = dataUtil.createNewJsonModel();
				that.getView().setModel(oSummaryModel, "SummaryModel");
				that.getView().setModel(new JSONModel({}), "PhotoModel");
				sJobId = oEvent.getParameters("").arguments.JobId;
				sFlag = oEvent.getParameters("").arguments.Flag;
				sWcKey = oEvent.getParameters("").arguments.WcKey;
				sGoTo = oEvent.getParameters("").arguments.goTo;
				sTailId = that.getTailId();
				sAirId = that.getAircraftId();
				sSqnId = that.getSqunId();
				sModId = that.getModelId();
				this._InitializeLimDialogModel();
				var oCanvas = document.getElementById("myCanvasTop");
				if (oCanvas !== null) {
					var ctx = oCanvas.getContext('2d');
					ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
				}
				oViewModel.setProperty("/sTailId", sTailId);
				oViewModel.setProperty("/bSuperDiaFlag", false);
				oViewModel.setProperty("/sAirId", sAirId);
				oViewModel.setProperty("/sSqnId", sSqnId);
				oViewModel.setProperty("/sJobId", sJobId);
				oViewModel.setProperty("/RectSummaryFlag", false);
				oViewModel.setProperty("/editModeRectify", false);
				this.getOwnerComponent().setModel(new JSONModel({
					"jobId": sJobId
				}), "jobModel");
				oViewModel.setProperty("/sFlag", sFlag);
				if (sFlag === "N") {
					this.onRectificationSelectTask(sJobId);
					this._fnMultiTradmanJobGet(sJobId);
				}
				oViewModel.setProperty("/sWcKey", sWcKey);
				oViewModel.setProperty("/sGoTo", sGoTo);
				oViewModel.setProperty("/FairEditFlag", true);
				oViewModel.setProperty("/sModId", sModId);
				if (sGoTo === "SP" || sGoTo === "OS") {
					oViewModel.setProperty("/WorkCenterKey", sWcKey);
					this.getView().byId("itbTaskId").setSelectedKey(sGoTo);
					oViewModel.setProperty("/SummaryFlag", false);
					oViewModel.setProperty("/WorcenterFlag", true);
				} else if (sGoTo === "FR" || sGoTo === "SM") {
					oViewModel.setProperty("/WorkCenterKey", sWcKey);
					oViewModel.setProperty("/SummaryFlag", false);
					oViewModel.setProperty("/WorcenterFlag", true);
					this.onAEFMMenuPress(sGoTo);
				} else {
					oViewModel.setProperty("/WorkCenterKey", "Summary");
					oViewModel.setProperty("/SummaryFlag", true);
					oViewModel.setProperty("/WorcenterFlag", false);
				}
				oViewModel.updateBindings(true);
				that._fnTasksOutStandingGet(sJobId, sWcKey);
				that._fnTasksPendingSupGet(sJobId, sWcKey);
				that._fnTasksCompleteGet(sJobId, sWcKey);
				that._fnFlyingRequirementsGet(sJobId, sWcKey);
				that._fnSortieMonitoringGet(sJobId, sWcKey);
				that._fnJobDetailsGet(sJobId, sAirId);
				that._fnPerioOfDeferCBGet(sAirId);
				this._fnReasonforADDGet(sAirId);
				this._fnUtilizationGet(sAirId);
				this._fnUtilization2Get();
				this._fnGetMainTaskDropDown();
				this._fnGetTaskDropDown();
				that._fnGetTaskTT310DropDown();
				that._fnGetTaskTT311DropDown();
				that._fnFoundDuringGet();
				this._fnGetDateValidation(sJobId);
				sap.ui.getCore().getEventBus().subscribe(
					"SubView1",
					"UpdateJob",
					this._fnJobDetailsGet,
					this
				);
			} catch (e) {
				Log.error("Exception in CosDefectsSummary:_handleRouteMatched function");

			}
		}

	});
});