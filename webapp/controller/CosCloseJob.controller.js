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
					oTempFlag = true,
					sWrctr, sWrctrText, oModel,
					sJobId = this.getModel("ViewModel").getProperty("/sJobId"),
					oModelView = this.getView().getModel("ViewModel"),
					oTable = that.getView().byId("tbWorkCenterCJ"),
					oPrmTask = {};

				try {
					sWrctr = oEvent.getSource().getSelectedKey();
				} catch (e) {
					sWrctr = oEvent;
				}
				oTable.removeSelections(true);
				oPrmTask.filter = "jobid eq " + sJobId + " and TSTAT eq ALL and WRCTR eq " + sWrctr;

				oPrmTask.error = function() {};
				oPrmTask.success = function(oData) {
					oModel = that.getView().getModel("TaskModel");
					oModel.setData(oData.results);
					oModel.updateBindings(true);
				}.bind(this);
				ajaxutil.fnRead("/TaskSvc", oPrmTask);
			} catch (e) {
				Log.error("Exception in onWorkCenterSelect function");
			}
		},

		//-------------------------------------------------------------
		//  This will get called, when to get work center for selected Job.
		//-------------------------------------------------------------
		onRectificationSelectTask: function(oEvent) {
			try {
				var that = this,
					oTempFlag = true,
					sWrctr, sWrctrText, oTemp = [],
					oModel,
					sJobId = this.getModel("ViewModel").getProperty("/sJobId"),
					oModelView = this.getView().getModel("ViewModel"),
					oSelectedTask,
					oPrmTask = {};
				oSelectedTask = oModelView.getProperty("/selectedTask");

				oPrmTask.filter = "jobid eq " + sJobId + " and recTstar eq X";

				oPrmTask.error = function() {};
				oPrmTask.success = function(oData) {
					this.getView().getModel("ViewModel").setProperty("/selectedTask", oData.results);
					this.getView().getModel("ViewModel").setProperty("/oldSelectedTask", oData.results);
				}.bind(this);
				ajaxutil.fnRead("/TaskSvc", oPrmTask);
			} catch (e) {
				Log.error("Exception in onWorkCenterSelect function");
			}
		},

		//-------------------------------------------------------------
		//  This will get called, when signing off the Job for closer.
		//-------------------------------------------------------------

		onUpdateTask: function(oEvent) {
			try {
				var oModel = this.getView().getModel("ViewModel"),
					oFLag = "0",
					oTaskFlag = true,
					sObject, oOldSelTask = [],
					oTempTask = [],
					oPrmTask = {},
					that = this,
					oPayload = [];
				oPayload = oModel.getProperty("/selectedTask");
				oOldSelTask = oModel.getProperty("/oldSelectedTask");
				if (oPayload.length !== 0) {
					for (var i = 0; i < oPayload.length; i++) {
						oPayload[i].RECTSTAR = "X";
					}
					for (var j = 0; j < oOldSelTask.length; j++) {
						for (var k = 0; k < oPayload.length; k++) {
							if (oOldSelTask[j].taskid === oPayload[k].taskid) {
								oTaskFlag = false;
								break;
							} else {
								oTaskFlag = true;
							}
						}
						if (oTaskFlag) {
							oOldSelTask[j].RECTSTAR = null;
							oTempTask.push(oOldSelTask[j]);
						}
					}
					oPayload = oPayload.concat(oTempTask);
					oPrmTask.filter = "";
					oPrmTask.error = function() {};
					oPrmTask.success = function(oData) {

					}.bind(this);
					ajaxutil.fnUpdate("/TaskSvc", oPrmTask, oPayload);
				}
			} catch (e) {
				Log.error("Exception in onSignOff function");
			}
		},

		//-------------------------------------------------------------
		//  This will get called, when signing off the Job for closer.
		//-------------------------------------------------------------
		onSignOff: function(sSignFlag) {
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
						if (sSignFlag === "TR") {
							try {
								oPayload.rectdt = formatter.defaultOdataDateFormat(oPayload.rectdt);
							} catch (e) {
								oPayload.rectdt = oPayload.rectdt;
							}
							try {
								oPayload.credt = formatter.defaultOdataDateFormat(oPayload.credt);
							} catch (e) {
								oPayload.credt = oPayload.credt;
							}
							try {
								if (oPayload.TRAILKDT) {
									oPayload.TRAILKDT = formatter.defaultOdataDateFormat(oPayload.TRAILKDT);
								}
							} catch (e) {
								oPayload.TRAILKDT = oPayload.TRAILKDT;
							}
							try {
								if (oPayload.TRAILKVAL) {
									var prec = formatter.JobDueDecimalPrecision(oPayload.TRAILKEY);
									oPayload.TRAILKVAL = parseFloat(oPayload.TRAILKVAL, [10]).toFixed(prec);
								}
							} catch (e) {
								oPayload.TRAILKVAL = oPayload.TRAILKVAL;
							}
						}
						oPayload.jstat = "P";
						oPayload.trail = "X";
					} else {
						if (sSignFlag === "TR") {
							oPayload.jstat = "P";
						} else {
							oPayload.jstat = "X";
						}

					}
				} else {
					if (sSignFlag === "TR") {
						oPayload.jstat = "P";
					} else {
						oPayload.jstat = "X";
					}
				}
				oPrmTask.filter = "";
				oPrmTask.error = function() {};
				oPrmTask.success = function(oData) {
					oModel.setProperty("/signOffBtn", false);
					oModel.setProperty("/signOffBtn1", true);
					if (sSignFlag === "SP") {
						if (oSelectedItemId === "1") {
							that.ESJobCreate();
						} else {
							that.getRouter().navTo("Cosjobs", {
								State: "COM"
							});
						}
					} else {
						MessageBox.show(
							"Tradesman Sign-off Successfully.", {
								icon: sap.m.MessageBox.Icon.Success,
								title: "Success",
								styleClass: "sapUiSizeCompact"
							});
						this.onUpdateTask();
						oModel.setProperty("/bFlag", true);
						oModel.setProperty("/selectedIcon", "SignOff");
						this.byId("pageCloseId").scrollTo(0);
					}
				}.bind(this);
				if (oModel.getProperty("/sFlag") === "Y") {
					sObject = "ZRM_COS_EO";
				} else {
					if (sSignFlag === "TR") {
						if (oPayload.fstat === "A" || oPayload.fstat === "R") {
							sObject = "ZRM_S_FAIR";
						} else {
							sObject = "ZRM_COS_JT";
						}
					} else {
						if (oPayload.fstat === "A" || oPayload.fstat === "R") {
							sObject = "ZRM_S_FAIR";
						} else {
							sObject = "ZRM_COS_JS";
						}
					}
				}
				oPrmTask.activity = 6;
				ajaxutil.fnUpdate("/DefectJobSvc", oPrmTask, [oPayload], sObject, this);
			} catch (e) {
				Log.error("Exception in onSignOff function");
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
						that._fnGetUtilisation();
					}
					that._fnCreatedWorkCenterGet(sJobId);
					if (oViewModel.getProperty("/sFlag") === "Y") {
						oData.results[0].recttxt = "Entry Enter in Error. No Discrepancy Found.";
					}
					oData.results[0].rectdt = new Date();
					oData.results[0].recttm = new Date().getHours() + ":" + new Date().getMinutes();
					oData.results[0].dupli = "0";
					oData.results[0].recur = "0";
					oViewModel.setProperty("/PrimeWC", oData.results[0].prime);
					oData.results[0].credt = new Date(oData.results[0].credt);
					/*	if (oData.results[0].notity !== null) {*/
					oData.results[0].trail = "0";
					oData.results[0].fchar = "0";
					oData.results[0].schreq = "0";
					if (oData.results[0].jstat === "P") {
						that.onRectificationSelectTask();
						oViewModel.setProperty("/signOffBtn", false);
						oViewModel.setProperty("/signOffBtn1", true);
						oViewModel.setProperty("/proccedBtn", false);
						oViewModel.setProperty("/backBtn", true);
						oViewModel.setProperty("/bFlag", true);
						oViewModel.setProperty("/selectedIcon", "SignOff");

					}
					oViewModel.refresh(true);
					/*	}*/
					that.onWorkCenterSelect(oData.results[0].prime);
					oModel.setData(oData.results[0]);
					that.getView().setModel(oModel, "JobModel");

				}.bind(this);
				ajaxutil.fnRead("/DefectJobSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobDetailsGet function");
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

		_fnGetUtilisation: function() {
			try {
				var oPrmJobDue = {};
				oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + this.getAircraftId() + " and JDUID eq JDU";
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.oObject = {};
						for (var i in oData.results) {
							this.oObject[oData.results[i].JDUID] = oData.results[i];
						}
					}
				}.bind(this);

				ajaxutil.fnRead("/UtilisationDueSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnGetUtilisationDefaultValue function");
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
					oJobModel = this.getView().getModel("JobModel"),
					oFlag = true,
					sWorkCenterText = this.getView().byId("cbWorkCenterId").getSelectedItem().getText(),
					oObj,
					newArray = JSON.parse(JSON.stringify(this.getView().getModel("ViewModel").getData().selectedTask));
				/*if (oJobModel.getProperty("/jstat") === "P") {
					oJobModel.setProperty("/jstat", "");
					oModel.getProperty("/bFlag", false);
					oModel.refresh(true);
				}*/
				if (oEvent.getSource().getSelectedItems().length === 1) {
					if (oEvent.getSource().getSelectedItem().getProperty("selected")) {
						var oData = oEvent.getSource().getSelectedItem();
						oObj = oData.getBindingContext("TaskModel").getObject();
						newArray.push(oObj);
						oModel.setProperty("/selectedTask", newArray);
						oModel.updateBindings(true);
					} else {
						var oUnSelectedTaskId = oEvent.getSource().getSelectedItem().getBindingContext("TaskModel").getObject().taskid;
						for (var i in newArray) {
							if (newArray[i].taskid === oUnSelectedTaskId) {
								newArray = newArray.splice(i, 1);
							}
						}
						oModel.setProperty("/selectedTask", newArray);
						oModel.refresh(true);

					}
				} else {
					if (oEvent.getParameter("/") || oEvent.getParameter("selected")) {
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
								}

							}
						}
						oModel.setProperty("/selectedTask", newArray);
						oModel.updateBindings(true);
					} else {
						var oUnSelectedTask = oEvent.getSource().getItems();
						for (var j = 0; j < oUnSelectedTask.length; j++) {
							for (var i = 0; i < newArray.length; i++) {
								if (!oUnSelectedTask[j].getSelected()) {
									if (newArray[i].taskid === oUnSelectedTask[j].getBindingContext("TaskModel").getObject().taskid) {
										newArray.splice(i, 1);
									}
								}
							}
						}
						oModel.setProperty("/selectedTask", newArray);
						oModel.refresh(true);
					}
				}
			} catch (e) {
				Log.error("Exception in CosCloseJob:onSelectTaskList function");
				this.handleException(e);
			}
		},

		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, to validate job closer time with respective current date.
		//------------------------------------------------------------------------------------------
		_fnValidateTime: function() {
			try {
				var oJobModel = this.getView().getModel("JobModel"),
					oRectDate, oJobCredt,
					sFlag;

				//Create date object and set the time to that
				var startTimeObject = new Date();
				var oRectdt = oJobModel.getProperty("/rectdt");
				oRectDate = new Date(oRectdt.getFullYear(), oRectdt.getMonth(), oRectdt.getDate());
				oJobCredt = new Date(startTimeObject.getFullYear(), startTimeObject.getMonth(), startTimeObject.getDate());
				if (+oJobCredt === +oRectDate) {
					startTimeObject.setHours(startTimeObject.getHours(), startTimeObject.getMinutes(), "00");
					//Create date object and set the time to that
					var endTimeObject = new Date(startTimeObject);
					var TempTime = oJobModel.getProperty("/recttm").split(":");
					endTimeObject.setHours(TempTime[0], TempTime[1], "00");
					if (startTimeObject.toLocaleString('en-GB', {
							hour12: false
						}) >= endTimeObject.toLocaleString('en-GB', {
							hour12: false
						})) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			} catch (e) {
				Log.error("Exception in CosCloseJob:_fnValidateTime function");
				this.handleException(e);
			}

		},
		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, to validate job closer time with respective Job Creation date.
		//------------------------------------------------------------------------------------------
		_fnValidateCreationDateTime: function() {
			try {
				var oJobModel = this.getView().getModel("JobModel"),
					TempTime, endTimeObject, oRectDate, oJobCredt,
					oRectdt = oJobModel.getProperty("/rectdt"),
					oCredt = oJobModel.getProperty("/credt");
				oRectDate = new Date(oRectdt.getFullYear(), oRectdt.getMonth(), oRectdt.getDate());
				oJobCredt = new Date(oCredt.getFullYear(), oCredt.getMonth(), oCredt.getDate());
				if (+oJobCredt === +oRectDate) {
					var TempCreTime = oJobModel.getProperty("/cretm").split(":");
					oJobCredt.setHours(TempCreTime[0], TempCreTime[1], "00");
					endTimeObject = new Date(oJobCredt);
					TempTime = oJobModel.getProperty("/recttm").split(":");
					endTimeObject.setHours(TempTime[0], TempTime[1], "00");
					if (oJobCredt.toLocaleString('en-GB', {
							hour12: false
						}) <= endTimeObject.toLocaleString('en-GB', {
							hour12: false
						})) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			} catch (e) {
				Log.error("Exception in CosCloseJob:_fnValidateTime function");
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

				var oModel = this.getView().getModel("ViewModel"),
					oJobModel = this.getView().getModel("JobModel"),
					oTemp, bFlag, bFlagCurrentTime, oResource = this.getView().getModel("i18n").getResourceBundle();
				bFlag = this._fnValidateTime();
				bFlagCurrentTime = this._fnValidateCreationDateTime();
				if (bFlag && bFlagCurrentTime) {
					if (oJobModel.getProperty("/jstat") === "P") {
						oModel.setProperty("/selectedIcon", "SignOff");
						oModel.setProperty("/signOffBtn", false);
						oModel.setProperty("/signOffBtn1", true);
						oModel.setProperty("/proccedBtn", false);
						oModel.setProperty("/backBtn", true);
						this.selectedTab = "SignOff";
						oModel.setProperty("/selectedIcon", this.selectedTab);
						oModel.refresh(true);
						this.byId("pageCloseId").scrollTo(0);
					} else {
						oModel.setProperty("/selectedIcon", "Confirmation");
						oModel.setProperty("/signOffBtn", true);
						oModel.setProperty("/proccedBtn", false);
						oModel.setProperty("/backBtn", true);
						this.selectedTab = "Confirmation";
						oModel.setProperty("/selectedIcon", this.selectedTab);
						oModel.refresh(true);
						this.byId("pageCloseId").scrollTo(0);
					}
				} else {
					if (!bFlag) {
						oTemp = oResource.getText("errorCloserMessageCurrent");
					}
					if (!bFlagCurrentTime) {
						oTemp = oResource.getText("errorCloserMessage") + " " + formatter.defaultTimeFormatDisplay(oJobModel.getProperty("/cretm"));
					}
					MessageBox.error(
						oTemp, {
							icon: sap.m.MessageBox.Icon.Error,
							title: "Error",
							styleClass: "sapUiSizeCompact"
						});
				}
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
				var oModel = this.getView().getModel("ViewModel"),
					oJobModel;
				this.selectedTab = "Summary";
				oJobModel = this.getView().getModel("JobModel");
				this.onWorkCenterSelect(oJobModel.getProperty("/prime"));
				//this.getView().getModel("TaskModel").setData(null);
				//this.getView().getModel("ViewModel").setProperty("/selectedTask", []);
				this.getView().byId("cbWorkCenterId").setSelectedKey(oJobModel.getProperty("/prime"));
				oModel.setProperty("/PrimeWC", oJobModel.getProperty("/prime"));
				oModel.setProperty("/selectedIcon", "Summary");
				oModel.setProperty("/signOffBtn", false);
				oModel.setProperty("/signOffBtn1", false);
				oModel.setProperty("/proccedBtn", true);
				oModel.setProperty("/backBtn", false);
			} catch (e) {
				Log.error("Exception in onBack function");
			}
		},

		//------------------------------------------------------------------------------------------
		//  Private Method: This will get called, to sheduled defect on change of due type.
		//------------------------------------------------------------------------------------------ 
		onDueSelectChange: function(oEvent) {
			try {
				var sDue = oEvent.getSource().getSelectedItem().getText();
				var sKey = oEvent.getSource().getSelectedKey();
				var oAppModel = this.getView().getModel("JobModel");
				oAppModel.setProperty("/UM", sDue);
				oAppModel.setProperty("/UMKEY", sKey);
				if (sKey.length > 0) {
					if (this.oObject && this.oObject[sKey] && this.oObject[sKey].VALUE) {
						var minVal = parseFloat(this.oObject[sKey].VALUE, [10]);
						oAppModel.setProperty("/TRAILKMinVAL", minVal);
						var sVal = oAppModel.getProperty("/TRAILKVAL") ? oAppModel.getProperty("/TRAILKVAL") : 0;
						sVal = parseFloat(sVal, [10]);
						var iPrec = formatter.JobDueDecimalPrecision(sKey);
						oAppModel.setProperty("/TRAILKVAL", parseFloat(minVal, [10]).toFixed(iPrec));

					}
				}
			} catch (e) {
				Log.error("Exception in CosCloseJob:onDueSelectChange function");
				this.handleException(e);
			}
		},

		onUpdateFinishedTB: function() {
			try {
				var oTable = this.getView().byId("tbWorkCenterCJ"),
					oSelecteItem,
					oTempItems = this.getView().getModel("ViewModel").getProperty("/selectedTask");
				oSelecteItem = oTable.getItems();
				for (var i = 0; i < oTable.getItems().length; i++) {
					for (var j = 0; j < oTempItems.length; j++) {
						if (oTable.getItems()[i].getBindingContext("TaskModel").getObject().taskid === oTempItems[j].taskid) {
							oTable.getItems()[i].setSelected(true);
						}
					}
				}

			} catch (e) {
				Log.error("Exception in onBack function");
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
				oPrmTD.filter = "JOBID eq " + sJobId;
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TUserJobModel");
				}.bind(this);
				ajaxutil.fnRead("/CreTuserSvc", oPrmTD);
			} catch (e) {
				Log.error("Exception in _fnMultiTradmanJobGet function");
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
					"selectedTask": [],
					"oldSelectedTask": [],
					"PrimeWC": ""
				});
				this.getView().setModel(oAppModel, "ViewModel");
				oJobModel = dataUtil.createNewJsonModel();
				oTempData = AvMetInitialRecord.createInitialBlankRecord("SCHJob");
				oJobModel.setData(oTempData[0]);
				this.getView().setModel(oJobModel, "JobCreateModel");
				this.getView().byId("cbWorkCenterId").setSelectedKey("");
				this.selectedTab = "Summary";
				that._fnJobDetailsGet(sJobId);
				that._fnTaskStatusGet(sJobId);
				that._fnMultiTradmanJobGet(sJobId);
			} catch (e) {
				Log.error("Exception in CosCloseJob:_onObjectMatched function");
				this.handleException(e);
			}
		}

	});
});