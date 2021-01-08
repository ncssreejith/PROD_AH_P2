sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log",
	"../util/ajaxutilNew",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, ajaxutil, formatter, Log, ajaxutilNew, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAHUL THORAT   
	 *   Control name: Create Task          
	 *   Purpose : Create New Task 
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onAfterRendering
	 *        1.3 onExit
	 *        1.4 destroyState
	 *   2. Backend Calls
	 *     2.1 _fnJobDetailsGetAll
	 *     2.2 _fnJobDetailsGetDefect
	 *     2.3 _fnJobDetailsGetScheduled
	 *     2.4 _fnJobDetailsGetUnScheduled
	 *     2.5 _fnJobDetailsGetUnCompleted
	 *     2.6 _fnJobGetScheduled
	 *     2.7 _fnJobGetAircraftScheduled
	 *     2.8 _fnJobGetCompScheduled
	 *     2.9 _fnJobGetENGScheduled
	 *     2.10 _fnJobGetMODSTIScheduled
	 *     2.11 _fnJobGetENGScheduled
	 *   3. Private calls
	 *     3.1 onOutstandingJobTypePress
	 *     3.2 onScheduledJobTypePress
	 *     3.3 onFilterChange
	 *     3.4 onSearchTable
	 *     3.5 onJobTabSelect
	 *     3.6 _fnJobGetScheduled
	 *     3.7 onDefectsDetailsPress
	 *     3.8 onUnscheduledDetailsPress
	 *     3.9 onDefectsCompletePress
	 *     3.10 onScheduleJobPress
	 *     3.11 onCreateJobPress
	 *     3.12 onCreateScheduleJobPress
	 *     3.13 onJobUpdateFinished
	 *     3.14 onJobUpdateFinishedDefect
	 *     3.15 onJobUpdateFinishedSche
	 *     3.16 onJobUpdateFinishedUnSche
	 *     3.17 _fnCheckStatus
	 *     3.18 fGrouper
	 *     3.19 getCount
	 *     3.20 getGroupHeader
	 *   Note :
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.Cosjobs", {
		formatter: formatter,
		/* =========================================================== */
		/* Standard Methods                                            */
		/* =========================================================== */
		//-------------------------------------------------------------
		//   Function: onInit
		//   Parameter: NA 
		//   Description: Internal method to initialize View dataUtil .
		//-------------------------------------------------------------
		onInit: function() {
			try {
				this.getRouter().getRoute("Cosjobs").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},
		//-------------------------------------------------------------
		//   Function: onAfterRendering
		//   Parameter: NA 
		//   Description: Internal method to initialize View dataUtil .
		//-------------------------------------------------------------
		onAfterRendering: function() {
			try {
				var that = this;
				// Retrieve backend posting messages of dashboard status every 30 secs.
				if (!this._LoadMessageInterval) {
					this._LoadMessageInterval = setInterval(function() {
						that._fnJobGetScheduled();
						that._fnJobDetailsGetAll();
						that.fnLoadSrv1Dashboard();
					}, 30000);
				}
			} catch (e) {
				Log.error("Exception in onAfterRendering function");
			}
		},
		/** 
		 * Exit clean up.
		 */
		onExit: function() {
			try {
				// Clear off state.
				this.destroyState();
			} catch (e) {
				Log.error("Exception in onAfterRendering function");
			}
		},
		/** 
		 * Clean up state object.
		 */
		destroyState: function() {
			try {
				// Clear load message interval.
				clearInterval(this._LoadMessageInterval);
			} catch (e) {
				Log.error("Exception in onAfterRendering function");
			}
		},

		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		/* Function: _fnJobDetailsGetAll
		 * Parameter:
		 * Description: Function to retreive job of all status types
		 */
		_fnJobDetailsGetAll: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "jobty eq Z and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					if (oData && oData.results.length > 0) {

						var aData = oData.results;
						for (var i in aData) {
							aData[i].timeVal = formatter.getTimeValueForDate(aData[i], "credtm", "creuzt");
						}

					}
					oModel.setData(aData);
					that.getView().setModel(oModel, "JobModelAll");
					that._fnJobDetailsGetDefect();
					that._fnJobDetailsGetScheduled();
					that._fnJobDetailsGetUnScheduled();
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("DEFECTJOBSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobDetailsGetAll function");
			}
		},
		/* Function: _fnJobDetailsGetAll
		 * Parameter: oValue
		 * Description: Function to retreive jobs
		 */
		_fnJobDetailsGetDefect: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "jobty eq D and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					if (oData && oData.results.length > 0) {

						var aData = oData.results;
						for (var i in aData) {
							aData[i].timeVal = formatter.getTimeValueForDate(aData[i], "credtm", "creuzt");
						}

					}
					oModel.setData(aData);
					that.getView().setModel(oModel, "JobModelD");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("DEFECTJOBSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobDetailsGetDefect function");
			}
		},
		/* Function: _fnJobDetailsGetScheduled
		 * Parameter:
		 * Description: Function to retreive scheduled jobs
		 */
		_fnJobDetailsGetScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "jobty eq S and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					if (oData && oData.results.length > 0) {

						var aData = oData.results;
						for (var i in aData) {
							aData[i].timeVal = formatter.getTimeValueForDate(aData[i], "credtm", "creuzt");
						}

					}
					oModel.setData(aData);
					that.getView().setModel(oModel, "JobModelS");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("DEFECTJOBSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobDetailsGetScheduled function");
			}
		},
		/* Function: _fnJobDetailsGetUnScheduled
		 * Parameter:
		 * Description: Function to retreive unscheduled jobs
		 */
		_fnJobDetailsGetUnScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "jobty eq U and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					if (oData && oData.results.length > 0) {

						var aData = oData.results;
						for (var i in aData) {
							aData[i].timeVal = formatter.getTimeValueForDate(aData[i], "credtm", "creuzt");
						}

					}
					oModel.setData(aData);
					that.getView().setModel(oModel, "JobModelU");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("DEFECTJOBSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobDetailsGetUnScheduled function");
			}
		},

		/* Function: _fnJobDetailsGetUnCompleted
		 * Parameter:
		 * Description: unction to retreive uncompleted jobs
		 */
		_fnJobDetailsGetUnCompleted: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "jstat eq X and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					if (oData && oData.results.length > 0) {

						var aData = oData.results;
						for (var i in aData) {
							aData[i].createTimeVal = formatter.getTimeValueForDate(aData[i], "credtm", "creuzt");
							aData[i].closeTimeVal = formatter.getTimeValueForDate(aData[i], "rectdt", "recttm");
						}

					}
					oModel.setData(aData);
					that.getView().setModel(oModel, "JobModelC");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("DEFECTJOBSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobDetailsGetUnCompleted function");
			}
		},
		/* Function: _fnJobGetScheduled
		 * Parameter:
		 * Description: Function to get scheduled jobs
		 */
		_fnJobGetScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "CTYPE" + FilterOpEnum.EQ + "ALL&tailid" + FilterOpEnum.EQ + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					for (var i in oData.results) {
						var iPrec = formatter.JobDueDecimalPrecision(oData.results[i].UMKEY);
						var iVal = parseFloat(oData.results[i].DUEIN).toFixed(iPrec);
						oData.results[i].DUEIN = parseFloat(iVal);
						if (oData.results[i].UMKEY !== "JDU_10") {
							iVal = parseFloat(oData.results[i].SERVDUE).toFixed(iPrec);
							oData.results[i].SERVDUE = iVal;
						}
					}

					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "SchJobModelAll");
					that._fnJobGetAircraftScheduled();
					that._fnJobGetCompScheduled();
					that._fnJobGetENGScheduled();
					that._fnJobGetMODSTIScheduled();
				}.bind(this);

				ajaxutilNew.fnRead(that.getResourceBundle().getText("GETSERLOGSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobGetScheduled function");
			}
		},
		/* Function: _fnJobGetAircraftScheduled
		 * Parameter:
		 * Description: Function to get scheduled jobs type aircraft
		 */
		_fnJobGetAircraftScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "CTYPE" + FilterOpEnum.EQ + "AIRCRAFT&tailid" + FilterOpEnum.EQ + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					for (var i in oData.results) {
						var iPrec = formatter.JobDueDecimalPrecision(oData.results[i].UMKEY);
						var iVal = parseFloat(oData.results[i].DUEIN).toFixed(iPrec);
						oData.results[i].DUEIN = parseFloat(iVal);
						if (oData.results[i].UMKEY !== "JDU_10") {
							iVal = parseFloat(oData.results[i].SERVDUE).toFixed(iPrec);
							oData.results[i].SERVDUE = iVal;
						}
					}
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelAIR");
				}.bind(this);

				ajaxutilNew.fnRead(that.getResourceBundle().getText("GETSERLOGSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobGetAircraftScheduled function");
			}
		},
		/* Function: _fnJobGetCompScheduled
		 * Parameter:
		 * Description: Function to get scheduled jobs type component
		 */
		_fnJobGetCompScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "CTYPE" + FilterOpEnum.EQ + "COMPONENT&tailid" + FilterOpEnum.EQ + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					for (var i in oData.results) {
						var iPrec = formatter.JobDueDecimalPrecision(oData.results[i].UMKEY);
						var iVal = parseFloat(oData.results[i].DUEIN).toFixed(iPrec);
						oData.results[i].DUEIN = parseFloat(iVal);
						if (oData.results[i].UMKEY !== "JDU_10") {
							iVal = parseFloat(oData.results[i].SERVDUE).toFixed(iPrec);
							oData.results[i].SERVDUE = iVal;
						}
					}
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelCOM");
				}.bind(this);

				ajaxutilNew.fnRead(that.getResourceBundle().getText("GETSERLOGSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobGetCompScheduled function");
			}
		},

		/* Function: _fnJobGetENGScheduled
		 * Parameter:
		 * Description: Function to get scheduled jobs type engine
		 */
		_fnJobGetENGScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "CTYPE" + FilterOpEnum.EQ + "ENGINE&tailid" + FilterOpEnum.EQ + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					for (var i in oData.results) {
						var iPrec = formatter.JobDueDecimalPrecision(oData.results[i].UMKEY);
						var iVal = parseFloat(oData.results[i].DUEIN).toFixed(iPrec);
						oData.results[i].DUEIN = parseFloat(iVal);
						if (oData.results[i].UMKEY !== "JDU_10") {
							iVal = parseFloat(oData.results[i].SERVDUE).toFixed(iPrec);
							oData.results[i].SERVDUE = iVal;
						}
					}
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelENG");
				}.bind(this);

				ajaxutilNew.fnRead(that.getResourceBundle().getText("GETSERLOGSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobGetENGScheduled function");
			}
		},
		/* Function: _fnJobGetMODSTIScheduled
		 * Parameter:
		 * Description: Function to get scheduled jobs type MOD
		 */
		_fnJobGetMODSTIScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "CTYPE" + FilterOpEnum.EQ + "MODSTI&tailid" + FilterOpEnum.EQ + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					for (var i in oData.results) {
						var iPrec = formatter.JobDueDecimalPrecision(oData.results[i].UMKEY);
						var iVal = parseFloat(oData.results[i].DUEIN).toFixed(iPrec);
						oData.results[i].DUEIN = parseFloat(iVal);
						if (oData.results[i].UMKEY !== "JDU_10") {
							iVal = parseFloat(oData.results[i].SERVDUE).toFixed(iPrec);
							oData.results[i].SERVDUE = iVal;
						}
					}
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelMODSTI");
				}.bind(this);

				ajaxutilNew.fnRead(that.getResourceBundle().getText("GETSERLOGSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnJobGetMODSTIScheduled function");
			}
		},

		// ***************************************************************************
		//     3.  Specific Methods  
		// ***************************************************************************

		//------------------------------------------------------------------
		// Function: onOutstandingJobTypePress
		// Parameter: oValue
		// Description: Event Method, which is called when value is changed in Intended Retirement Date field in view for editable controls. 
		//Table: TASK
		//------------------------------------------------------------------

		onOutstandingJobTypePress: function(oValue) {
			try {
				var oLocalJobsModel = this.getView().getModel("LocalJobsModel");
				switch (oValue) {
					case "AL":
						oLocalJobsModel.setProperty("/AllTableFlag", true);
						oLocalJobsModel.setProperty("/DefectTableFlag", false);
						oLocalJobsModel.setProperty("/ScheduledTableFlag", false);
						oLocalJobsModel.setProperty("/UnscheduledTableFlag", false);
						break;
					case "DE":
						oLocalJobsModel.setProperty("/AllTableFlag", false);
						oLocalJobsModel.setProperty("/DefectTableFlag", true);
						oLocalJobsModel.setProperty("/ScheduledTableFlag", false);
						oLocalJobsModel.setProperty("/UnscheduledTableFlag", false);
						break;
					case "SC":
						oLocalJobsModel.setProperty("/AllTableFlag", false);
						oLocalJobsModel.setProperty("/DefectTableFlag", false);
						oLocalJobsModel.setProperty("/ScheduledTableFlag", true);
						oLocalJobsModel.setProperty("/UnscheduledTableFlag", false);
						break;
					case "USC":
						oLocalJobsModel.setProperty("/AllTableFlag", false);
						oLocalJobsModel.setProperty("/DefectTableFlag", false);
						oLocalJobsModel.setProperty("/ScheduledTableFlag", false);
						oLocalJobsModel.setProperty("/UnscheduledTableFlag", true);
						break;
				}
				oLocalJobsModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in onOutstandingJobTypePress function");
			}
		},

		/* Function: onScheduledJobTypePress
		 * Parameter: oValue
		 * Description: Function when scheduled job is selected
		 */
		onScheduledJobTypePress: function(oValue) {
			try {
				var oLocalJobsModel = this.getView().getModel("LocalJobsModel");
				switch (oValue) {
					case "ALL":
						oLocalJobsModel.setProperty("/SchAllTableFlag", true);
						oLocalJobsModel.setProperty("/SchAirTableFlag", false);
						oLocalJobsModel.setProperty("/SchCompTableFlag", false);
						oLocalJobsModel.setProperty("/SchEngTableFlag", false);
						oLocalJobsModel.setProperty("/SchMODSTITableFlag", false);
						break;
					case "AIR":
						oLocalJobsModel.setProperty("/SchAllTableFlag", false);
						oLocalJobsModel.setProperty("/SchAirTableFlag", true);
						oLocalJobsModel.setProperty("/SchCompTableFlag", false);
						oLocalJobsModel.setProperty("/SchEngTableFlag", false);
						oLocalJobsModel.setProperty("/SchMODSTITableFlag", false);
						break;
					case "COM":
						oLocalJobsModel.setProperty("/SchAllTableFlag", false);
						oLocalJobsModel.setProperty("/SchAirTableFlag", false);
						oLocalJobsModel.setProperty("/SchCompTableFlag", true);
						oLocalJobsModel.setProperty("/SchEngTableFlag", false);
						oLocalJobsModel.setProperty("/SchMODSTITableFlag", false);
						break;
					case "ENG":
						oLocalJobsModel.setProperty("/SchAllTableFlag", false);
						oLocalJobsModel.setProperty("/SchAirTableFlag", false);
						oLocalJobsModel.setProperty("/SchCompTableFlag", false);
						oLocalJobsModel.setProperty("/SchEngTableFlag", true);
						oLocalJobsModel.setProperty("/SchMODSTITableFlag", false);
						break;
					case "MODSI":
						oLocalJobsModel.setProperty("/SchAllTableFlag", false);
						oLocalJobsModel.setProperty("/SchAirTableFlag", false);
						oLocalJobsModel.setProperty("/SchCompTableFlag", false);
						oLocalJobsModel.setProperty("/SchEngTableFlag", false);
						oLocalJobsModel.setProperty("/SchMODSTITableFlag", true);
						break;
				}
				oLocalJobsModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in onScheduledJobTypePress function");
			}
		},
		/* Function: onFilterChange
		 * Parameter: oEvent
		 * Description: Function when filter is changed
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
		/* Function: onSearchTable
		 * Parameter: oEvent, sId, oModel
		 * Description: function call to perform filters in job tables
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
				Log.error("Exception in onFilterChange function");
			}
		},
		/* Function: onJobTabSelect
		 * Parameter: oEvent
		 * Description: Function call when tab is selected
		 */
		onJobTabSelect: function(oEvent) {
			try {
				var that = this,
					sJobId, sWrctr,
					sSelectedtxt, sSelectedKey,
					oModel;
				sSelectedKey = oEvent.getParameter("selectedItem").getKey();
				sSelectedtxt = oEvent.getParameter("selectedItem").getText();

				oModel = that.getView().getModel("LocalJobsModel");
				oModel.setProperty("/sSelectedKey", sSelectedKey);
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in onJobTabSelect function");
			}
		},
		/* Function: onDefectsAllPress
		 * Parameter: oEvent
		 * Description: Function call when all is selected from side menu
		 */
		onDefectsAllPress: function(oEvent) {
			try {
				var oJobId = oEvent.getSource().getBindingContext("JobModelAll").getObject().jobid;
				var aState = this.getModel("avmetModel").getProperty("/dash/astid");
				this.getRouter().navTo("CosDefectsSummary", {
					"JobId": oJobId,
					"Flag": "Y"
				});
			} catch (e) {
				Log.error("Exception in onDefectsAllPress function");
			}
		},
		/* Function: onDefectsDetailsPress
		 * Parameter: oEvent 
		 * Description: Function call when outstanding job is selected
		 */
		onDefectsDetailsPress: function(oEvent) {
			try {
				var oJobId = oEvent.getSource().getBindingContext("JobModelD").getObject().jobid;
				var aState = this.getModel("avmetModel").getProperty("/dash/astid");
				this.getRouter().navTo("CosDefectsSummary", {
					"JobId": oJobId,
					"Flag": "Y"
				});
			} catch (e) {
				Log.error("Exception in onDefectsDetailsPress function");
			}
		},
		/* Function: onScheduleDetailsPress
		 * Parameter: oEvent
		 * Description: Function scheduled job press
		 */
		onScheduleDetailsPress: function(oEvent) {
			try {
				var oJobId = oEvent.getSource().getBindingContext("JobModelS").getObject().jobid;
				var aState = this.getModel("avmetModel").getProperty("/dash/astid");
				this.getRouter().navTo("CosDefectsSummary", {
					"JobId": oJobId,
					"Flag": "Y"
				});
			} catch (e) {
				Log.error("Exception in onScheduleDetailsPress function");
			}
		},
		/* Function: onUnscheduledDetailsPress
		 * Parameter: oEvent
		 * Description:  Function call when unscheduled job press
		 */
		onUnscheduledDetailsPress: function(oEvent) {
			try {
				var oJobId = oEvent.getSource().getBindingContext("JobModelU").getObject().jobid;
				var aState = this.getModel("avmetModel").getProperty("/dash/astid");
				this.getRouter().navTo("CosDefectsSummary", {
					"JobId": oJobId,
					"Flag": "Y"
				});
			} catch (e) {
				Log.error("Exception in onUnscheduledDetailsPress function");
			}
		},
		/* Function: onDefectsCompletePress
		 * Parameter: oEvent
		 * Description: Function call when completed job pressed
		 */
		onDefectsCompletePress: function(oEvent) {
			try {
				var oJobId = oEvent.getSource().getBindingContext("JobModelC").getObject().jobid;
				this.getRouter().navTo("CosDefectsSummary", {
					"JobId": oJobId,
					"Flag": "N"
				});
			} catch (e) {
				Log.error("Exception in onDefectsCompletePress function");
			}
		},
		/* Function: onScheduleJobPress
		 * Parameter: sValue, oEvent
		 * Description: Function call when side menu is selected when scheduled job tab
		 */
		onScheduleJobPress: function(sValue, oEvent) {
			try {
				var oESJobId;

				switch (sValue) {
					case "ALL":
						oESJobId = oEvent.getSource().getBindingContext("SchJobModelAll").getObject().ESJOBID;
						break;
					case "AIR":
						oESJobId = oEvent.getSource().getBindingContext("JobModelAIR").getObject().ESJOBID;
						break;
					case "COM":
						oESJobId = oEvent.getSource().getBindingContext("JobModelCOM").getObject().ESJOBID;
						break;
					case "ENG":
						oESJobId = oEvent.getSource().getBindingContext("JobModelENG").getObject().ESJOBID;
						break;
					case "MODSTI":
						oESJobId = oEvent.getSource().getBindingContext("JobModelMODSTI").getObject().ESJOBID;
						break;
				}
				this.getRouter().navTo("CosScheduleSummary", {
					"ESJOBID": oESJobId
				});
			} catch (e) {
				Log.error("Exception in onScheduleJobPress function");
			}
		},
		/* Function: onCreateJobPress
		 * Parameter:
		 * Description: Function call when defect job button is pressed
		 */
		onCreateJobPress: function() {
			try {
				this.getRouter().navTo("CosCreateJob");
			} catch (e) {
				Log.error("Exception in onCreateJobPress function");
			}
		},
		/* Function: onCreateScheduleJobPress
		 * Parameter:
		 * Description: Function call when Out of phase job button is pressed
		 */
		onCreateScheduleJobPress: function() {
			try {
				this.getRouter().navTo("ESScheduleJobCreate");
			} catch (e) {
				Log.error("Exception in onCreateScheduleJobPress function");
			}
		},
		/* Function: onJobUpdateFinished
		 * Parameter:
		 * Description: Function call when table update is finished
		 */
		onJobUpdateFinished: function() {
			try {
				var oFilters, filterObj, oListADD, oBindingADD, oViewModel;
				oListADD = this.getView().byId("AllJobId");
				oViewModel = this.getView().getModel("JobModel");
				oBindingADD = oListADD.getBinding("items");
				oBindingADD.filter([]);

				oFilters = [new sap.ui.model.Filter("jstat", sap.ui.model.FilterOperator.EQ, "C"),
					new sap.ui.model.Filter("jstat", sap.ui.model.FilterOperator.EQ, "S")
				];

				filterObj = new sap.ui.model.Filter(oFilters, false);
				oBindingADD.filter(filterObj);
				/*	oViewModel.setProperty("/sADDCount", oListADD.getItems().length);*/
			} catch (e) {
				Log.error("Exception in onJobUpdateFinished function");
			}
		},
		/* Function: onJobUpdateFinishedDefect
		 * Parameter: oValue
		 * Description:  Function call when table update is finished
		 */
		onJobUpdateFinishedDefect: function() {
			try {
				var oFilters, filterObj, oListADD, oBindingADD, oViewModel;
				oListADD = this.getView().byId("DefectID");
				oViewModel = this.getView().getModel("JobModel");
				oBindingADD = oListADD.getBinding("items");
				oBindingADD.filter([]);

				oFilters = [new sap.ui.model.Filter("jstat", sap.ui.model.FilterOperator.EQ, "C"),
					new sap.ui.model.Filter("jstat", sap.ui.model.FilterOperator.EQ, "S"),
					new sap.ui.model.Filter("jobty", sap.ui.model.FilterOperator.EQ, "D")
				];

				filterObj = new sap.ui.model.Filter(oFilters, false);
				oBindingADD.filter(filterObj);
			} catch (e) {
				Log.error("Exception in onJobUpdateFinishedDefect function");
			}
		},
		/* Function: onJobUpdateFinishedSche
		 * Parameter:
		 * Description:  Function call when table update is finished for scheduled
		 */
		onJobUpdateFinishedSche: function() {
			try {
				var oFilters, filterObj, oListADD, oBindingADD, oViewModel;
				oListADD = this.getView().byId("SchedID");
				oViewModel = this.getView().getModel("JobModel");
				oBindingADD = oListADD.getBinding("items");
				oBindingADD.filter([]);

				oFilters = [new sap.ui.model.Filter("jstat", sap.ui.model.FilterOperator.EQ, "C"),
					new sap.ui.model.Filter("jstat", sap.ui.model.FilterOperator.EQ, "S"),
					new sap.ui.model.Filter("jobty", sap.ui.model.FilterOperator.EQ, "S")
				];

				filterObj = new sap.ui.model.Filter(oFilters, false);
				oBindingADD.filter(filterObj);
			} catch (e) {
				Log.error("Exception in onJobUpdateFinishedSche function");
			}
		},
		/* Function: onJobUpdateFinishedUnSche
		 * Parameter:
		 * Description: Function call when table update is finished for unscheduled
		 */
		onJobUpdateFinishedUnSche: function() {
			try {
				var oFilters, filterObj, oListADD, oBindingADD, oViewModel;
				oListADD = this.getView().byId("UnSchId");
				oViewModel = this.getView().getModel("JobModel");
				oBindingADD = oListADD.getBinding("items");
				oBindingADD.filter([]);

				oFilters = [new sap.ui.model.Filter("jstat", sap.ui.model.FilterOperator.EQ, "C"),
					new sap.ui.model.Filter("jstat", sap.ui.model.FilterOperator.EQ, "S"),
					new sap.ui.model.Filter("jobty", sap.ui.model.FilterOperator.EQ, "U")
				];

				filterObj = new sap.ui.model.Filter(oFilters, false);
				oBindingADD.filter(filterObj);
			} catch (e) {
				Log.error("Exception in onJobUpdateFinishedUnSche function");
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
						return "N";
					default:
						return "Y";
				}
			} catch (e) {
				Log.error("Exception in _fnCheckStatus function");
			}
		},
		/* Function: fGrouper
		 * Parameter: oGroup
		 * Description: function to get group key
		 */
		fGrouper: function(oGroup) {
			try {
				var sVal = this.getCount(oGroup, oGroup.sPath);
				return {
					key: sVal
				};
			} catch (e) {
				Log.error("Exception in fGrouper function");
			}
		},
		/* Function: getCount
		 * Parameter: oGroup, sPath
		 * Description: function to get group count
		 */
		getCount: function(oGroup, sPath) {
			try {
				if (oGroup.getObject(sPath).UMKEY === "JDU_10") {
					return "group1";
				} else {
					return "group2";
				}
			} catch (e) {
				Log.error("Exception in getCount function");
			}

		},
		/* Function: getGroupHeader
		 * Parameter: oGroup
		 * Description: function to get group header
		 */
		getGroupHeader: function(oGroup) {
			try {

				return new sap.m.GroupHeaderListItem({
					title: oGroup.key,
					upperCase: false
				});
			} catch (e) {
				Log.error("Exception in getCount function");
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************\
		/* Function: _onObjectMatched
		 * Parameter: oEvent
		 * Description: This will called to handle route matched.
		 */
		_onObjectMatched: function(oEvent) {
			try {
				var sState = oEvent.getParameter("arguments").State;
				var oLocalJobsModel = dataUtil.createNewJsonModel();
				oLocalJobsModel.setData({
					AllTableFlag: true,
					DefectTableFlag: false,
					ScheduledTableFlag: false,
					UnscheduledTableFlag: false,
					SelectedKey: sState ? sState : "OST",
					SchAllTableFlag: true,
					SchAirTableFlag: false,
					SchCompTableFlag: false,
					SchEngTableFlag: false,
					SchMODSTITableFlag: false,
					sSelectedKey: ""
				});
				this.getView().setModel(oLocalJobsModel, "LocalJobsModel");
				var oModel = dataUtil.createJsonModel("model/aircraftInfo.json");
				this.getView().setModel(oModel, "DDModel");
				this._fnJobGetScheduled();
				this._fnJobDetailsGetAll();
				this._fnJobDetailsGetUnCompleted();
				this.fnLoadSrv1Dashboard();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		}

	});
});