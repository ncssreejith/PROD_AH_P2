sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/formatter",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"sap/m/MessageBox",
	"sap/base/Log",
	"../model/AvMetInitialRecord"
], function(BaseController, dataUtil, Fragment, formatter, FieldValidations, ajaxutil, MessageBox, Log, AvMetInitialRecord) {
	"use strict";
	/*	 ***************************************************************************
	 *     Developer : RAHUL THORAT  
	 *   Control name: Close Job          
	 *   Purpose : Add Equipment running log dialog controller
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onSignOffPress
	 *   2. Backend Calls
	 *        2.1 onSignOff
	 *        2.2 _fnJobDetailsGet
	 *        2.3 _fnTaskStatusGet
	 *        2.4 _fnWorkCenterGet
	 *        2.5 _fnCreatedWorkCenterGet
	 *        2.6 _fnJobDueGet
	 *        2.7 ESJobCreate
	 *  3. Private calls
	 *        3.1 onWorkCenterSelect
	 *        3.2 fnSetReason
	 *        3.3 onIconSelected
	 *        3.4 onSelectTaskList
	 *        3.5 onProceed
	 *        3.6 onBack
	 *        3.7 onDueSelectChange
	 *        3.8 _onObjectMatched
	 *   Note :
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.CosCloseJob", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("CosCloseJob").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in CosCloseJob:onInit function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		//-------------------------------------------------------------
		//  This will get called, when to get work center for selected Job.
		//-------------------------------------------------------------
		onWorkCenterSelect: function(oEvent) {
			try {
				var that = this,
					oModel,
					sWrctr = oEvent.getSource().getSelectedKey(),
					sWrctrText = oEvent.getSource().getSelectedItem().getText(),
					sJobId = this.getModel("ViewModel").getProperty("/sJobId"),
					oModelView = this.getView().getModel("ViewModel"),
					oTable = that.getView().byId("tbWorkCenterCJ"),
					oPrmTask = {};
				oTable.removeSelections(true);
				oPrmTask.filter = "jobid eq " + sJobId + " and TSTAT eq ALL and WRCTR eq " + sWrctr;
				oModelView.setProperty("/WCText", sWrctrText);
				oPrmTask.error = function() {};
				oPrmTask.success = function(oData) {
					oModel = that.getView().getModel("TaskModel");
					oModel.setData(oData.results);
					oModel.updateBindings(true);
				}.bind(this);
				ajaxutil.fnRead("/TaskSvc", oPrmTask);
			} catch (e) {
				Log.error("Exception in CosCloseJob:onWorkCenterSelect function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		//  This will get called, when signing off the Job for closer.
		//-------------------------------------------------------------
		onSignOff: function() {
			try {
				var that = this,
					sObject,
					oPrmTask = {},
					oModel = this.getView().getModel("ViewModel"),
					oPayload = [],
					oSegmentedButton = this.byId('ScheReqId'),
					oSelectedItemId = oSegmentedButton.getSelectedKey();
				oPayload = that.getView().getModel("JobModel").getData();
				if (oModel.getProperty("/sFlag") === "N") {
					if (oPayload.notity !== null && oPayload.trail !== "0") {
						if (oModel.getProperty("/bFlag") === false) {
							try {
								oPayload.rectdt = formatter.defaultOdataDateFormat(oPayload.rectdt);
							} catch (e) {
								oPayload.rectdt = oPayload.rectdt;
							}
						}
						oPayload.jstat = "P";
						oPayload.trail = "X";
					} else {
						oPayload.jstat = "X";

					}
				} else {
					oPayload.jstat = "X";
				}
				oPrmTask.filter = "";
				oPrmTask.error = function() {};
				oPrmTask.success = function(oData) {
					oModel.setProperty("/signOffBtn", false);
					oModel.setProperty("/signOffBtn1", true);
					if (oModel.getProperty("/bFlag")) {
						if (oSelectedItemId === "1") {
							that.ESJobCreate();
						} else {
							this.getRouter().navTo("Cosjobs");
						}
					} else {
						MessageBox.show(
							"Tradesman Sign-off Successfully.", {
								icon: sap.m.MessageBox.Icon.Success,
								title: "Success",
								styleClass: "sapUiSizeCompact"
							});
						oModel.setProperty("/bFlag", true);
						oModel.setProperty("/selectedIcon", "SignOff");
						this.byId("pageCloseId").scrollTo(0);
					}
				}.bind(this);
				if (oModel.getProperty("/sFlag") === "Y") {
					sObject = "ZRM_COS_EO";
				} else {
					if (oModel.getProperty("/bFlag")) {
						sObject = "ZRM_COS_JT";
					} else {
						sObject = "ZRM_COS_JS";
					}
				}
				oPrmTask.activity = 6;
				ajaxutil.fnUpdate("/DefectJobSvc", oPrmTask, [oPayload], sObject, this);
			} catch (e) {
				Log.error("Exception in CosCloseJob:onSignOff function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		//  This will get called, to get Job details for selected jobs.
		//-------------------------------------------------------------
		_fnJobDetailsGet: function(sJobId) {
			try {
				var that = this,
					oViewModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "jobid eq " + sJobId;
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					if (oData.results[0] !== undefined && oData.results[0].notity !== null) {
						that._fnWorkCenterGet();
						that._fnJobDueGet(sJobId);
					}
					that._fnCreatedWorkCenterGet(sJobId);
					if (oViewModel.getProperty("/sFlag") === "Y") {
						oData.results[0].recttxt = "Entry Enter in Error. No Discrepancy Found.";
					}
					oData.results[0].rectdt = new Date();
					oData.results[0].recttm = new Date().getHours() + ":" + new Date().getMinutes();
					oData.results[0].dupli = "0";
					oData.results[0].recur = "0";
					/*	if (oData.results[0].notity !== null) {*/
					oData.results[0].trail = "0";
					oData.results[0].fchar = "0";
					oData.results[0].schreq = "0";
					/*	}*/
					oModel.setData(oData.results[0]);
					that.getView().setModel(oModel, "JobModel");
				}.bind(this);
				ajaxutil.fnRead("/DefectJobSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseJob:_fnJobDetailsGet function");
				this.handleException(e);
			}
		},
		//----------------------------------------------------------------------------
		//  This will get called, to get count of the tasks those are open under selected Job.
		//----------------------------------------------------------------------------
		_fnTaskStatusGet: function(sJobId) {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmTaskDue = {};
				oPrmTaskDue.filter = "JOBID eq " + sJobId;
				oPrmTaskDue.error = function() {};
				oPrmTaskDue.success = function(oData) {
					oModel.setProperty("/TaskStatus", oData.results[0].COUNT);
					oModel.updateBindings(true);
				}.bind(this);
				ajaxutil.fnRead("/GetJobTaskstatSvc", oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in CosCloseJob:_fnTaskStatusGet function");
				this.handleException(e);
			}
		},
		//----------------------------------------------------------------------------
		//  General Method: This will get called, to get workcenter data.
		//----------------------------------------------------------------------------
		_fnWorkCenterGet: function() {
			try {
				var that = this,
					sAirId = this.getModel("ViewModel").getProperty("/sAirId"),
					oPrmWorkCen = {};
				oPrmWorkCen.filter = "REFID eq " + sAirId;
				oPrmWorkCen.error = function() {};
				oPrmWorkCen.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.setModel(oModel, "WorkCenterSet");
				}.bind(this);
				ajaxutil.fnRead("/GetWorkCenterSvc", oPrmWorkCen);
			} catch (e) {
				Log.error("Exception in CosCloseJob:_fnWorkCenterGet function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, to get workcenter data created under selected Job.
		//------------------------------------------------------------------------------------------
		_fnCreatedWorkCenterGet: function(sJobId) {
			try {
				var that = this,
					oModel,
					oPrmWorkCenter = {};
				oPrmWorkCenter.filter = "jobid eq " + sJobId;
				oPrmWorkCenter.error = function() {};
				oPrmWorkCenter.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "CreatedWorkCenterModel");
				}.bind(this);
				ajaxutil.fnRead("/DefectWorkcenterSvc", oPrmWorkCenter);
			} catch (e) {
				Log.error("Exception in CosCloseJob:_fnCreatedWorkCenterGet function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, to get tasks data created under selected Job.
		//------------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------
		//  General Method: This will get called, to get Jobdue dropdown data.
		//------------------------------------------------------------------------------------------
		_fnJobDueGet: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + that.getAircraftId() + " and ddid eq JDU";
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobDueSet");
				}.bind(this);
				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnJobDueGet function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, to create ES logs Jobs in backedn.
		//------------------------------------------------------------------------------------------
		ESJobCreate: function() {
			try {
				var that = this,
					oPayload, oModel = this.getView().getModel("JobModel"),
					oPrmTD = {};
				oPayload = this.getView().getModel("JobCreateModel").getData();
				oPayload.CREDT = oModel.getProperty("/rectdt");
				oPayload.CRETM = oModel.getProperty("/recttm");
				oPayload.J_FLAG = "N";
				oPayload.FLAG = "ES";
				oPayload.CTYPE = "AIRCRAFT";
				oPayload.TAILID = this.getTailId();
				oPayload.AIRID = this.getAircraftId();
				oPayload.MODID = this.getModelId();
				oPayload.JOBTY = "ZP";
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					this.getRouter().navTo("Cosjobs");
				}.bind(this);
				oPrmTD.activity = 1;
				ajaxutil.fnCreate("/GetSerLogSvc", oPrmTD, [oPayload], "ZRM_COS_JB", this);
			} catch (e) {
				Log.error("Exception in CosCloseJob:ESJobCreate function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, when selection in icon tab bar change.
		//------------------------------------------------------------------------------------------
		onIconSelected: function(oEvent) {
			try {
				var oModel = this.getView().getModel("ViewModel");
				oModel.setProperty("/selectedIcon", this.selectedTab);
			} catch (e) {
				Log.error("Exception in CosCloseJob:onIconSelected function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, on selection of task from the list.
		//------------------------------------------------------------------------------------------
		onSelectTaskList: function(oEvent) {
			try {
				var oModel = this.getView().getModel("ViewModel"),
					oFlag = true,
					oObj, newArray = [];
				newArray = this.getView().getModel("ViewModel").getData().selectedTask;
				if (oEvent.getSource().getSelectedItems().length === 1) {
					var oData = oEvent.getSource().getSelectedItem();
					oObj = oData.getBindingContext("TaskModel").getObject();
					oObj.wrctr = oModel.getProperty("/WCText");
					newArray.push(oObj);
					oModel.setProperty("/selectedTask", newArray);
					oModel.updateBindings(true);
				} else {
					//newArray = [];
					if (oEvent.getSource().getSelectedItems().length >= 1) {
						var oData = oEvent.getSource().getSelectedItems();
						for (var i = 0; i < oData.length; i++) {
							oObj = oData[i].getBindingContext("TaskModel").getObject();
							for (var j = 0; j < newArray.length; j++) {
								if (newArray[j].taskid === oObj.taskid) {
									oFlag = false;
									break;
								} else {
									oFlag = true;
								}
							}
							if (oFlag) {
								newArray.push(oObj);
								oObj.wrctr = oModel.getProperty("/WCText");
							}

						}
					}
					oModel.setProperty("/selectedTask", newArray);
					oModel.updateBindings(true);
				}
			} catch (e) {
				Log.error("Exception in CosCloseJob:onSelectTaskList function");
				this.handleException(e);
			}
		},

		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, on click of proceed.
		//------------------------------------------------------------------------------------------
		onProceed: function() {
			try {
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				var oModel = this.getView().getModel("ViewModel");
				oModel.setProperty("/selectedIcon", "Confirmation");
				oModel.setProperty("/signOffBtn", true);
				oModel.setProperty("/proccedBtn", false);
				oModel.setProperty("/backBtn", true);
				this.selectedTab = "Confirmation";
				oModel.setProperty("/selectedIcon", this.selectedTab);
			} catch (e) {
				Log.error("Exception in CosCloseJob:onProceed function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, on click of onBack.
		//------------------------------------------------------------------------------------------
		//4.on click of back
		onBack: function() {
			try {
				var oModel = this.getView().getModel("ViewModel");
				this.selectedTab = "Summary";
				this.getView().getModel("TaskModel").setData(null);
				this.getView().byId("cbWorkCenterId").setSelectedKey("");
				oModel.setProperty("/selectedIcon", "Summary");
				oModel.setProperty("/signOffBtn", false);
				oModel.setProperty("/signOffBtn1", false);
				oModel.setProperty("/proccedBtn", true);
				oModel.setProperty("/backBtn", false);
			} catch (e) {
				Log.error("Exception in CosCloseJob:onBack function");
				this.handleException(e);
			}
		},

		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, to sheduled defect on change of due type.
		//------------------------------------------------------------------------------------------ 
		onDueSelectChange: function(oEvent) {
			try {
				var sDue = oEvent.getSource().getSelectedItem().getText();
				var oAppModel = this.getView().getModel("JobCreateModel");
				oAppModel.setProperty("/UM", sDue);
				oAppModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosCloseJob:onDueSelectChange function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		//-------------------------------------------------------------
		//  This will called to handle route matched.
		//-------------------------------------------------------------
		_onObjectMatched: function(oEvent) {
			try {
				var that = this,
					oJobModel, oTempData,
					oModel = this.getView().getModel("ViewModel"),
					sJobId = oEvent.getParameters("").arguments.JobId,
					sFlag = oEvent.getParameters("").arguments.Flag,
					sTailId = that.getTailId(),
					sAirId = that.getAircraftId(),
					sSqnId = that.getSqunId(),
					sModId = that.getModelId();
				var TaskModel = dataUtil.createNewJsonModel();
				that.getView().setModel(TaskModel, "TaskModel");
				var oAppModel = dataUtil.createNewJsonModel();
				oAppModel.setData({
					"sTailId": sTailId,
					"sModId": sModId,
					"sAirId": sAirId,
					"sSqnId": sSqnId,
					"sJobId": sJobId,
					"sFlag": sFlag,
					"dDate": new Date(),
					"dTime": new Date().getHours() + ":" + new Date().getMinutes(),
					"proccedBtn": true,
					"backBtn": false,
					"signOffBtn": false,
					"signOffBtn1": false,
					"WCText": "",
					"bFlag": false,
					"selectedIcon": "Summary",
					"TaskStatus": "",
					"selectedTask": []
				});
				this.getView().setModel(oAppModel, "ViewModel");
				oJobModel = dataUtil.createNewJsonModel();
				oTempData = AvMetInitialRecord.createInitialBlankRecord("SCHJob");
				oJobModel.setData(oTempData[0]);
				this.getView().setModel(oJobModel, "JobCreateModel");
				this.selectedTab = "Summary";
				that._fnJobDetailsGet(sJobId);
				that._fnTaskStatusGet(sJobId);
			} catch (e) {
				Log.error("Exception in CosCloseJob:_onObjectMatched function");
				this.handleException(e);
			}
		}

	});
});