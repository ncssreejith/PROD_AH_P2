sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, dataUtil, ajaxutil, formatter, Log) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.Cosjobs", {
		formatter: formatter,
		/* =========================================================== */
		/* Standard Methods                                            */
		/* =========================================================== */
		onInit: function() {
			try {
				this.getRouter().getRoute("Cosjobs").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		/* =========================================================== */
		/* Event Handlers                                              */
		/* =========================================================== */

		/** 
		 * Event Method, which is called when value is changed in Intended Retirement Date field in view for editable controls. 
		 * @public
		 */

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
				Log.error("Exception in xxxxx function");
			}
		},

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
				Log.error("Exception in xxxxx function");
			}
		},

		onFilterChange: function(oEvent) {
			if (oEvent.getSource().getSelectedKey().length > 0) {
				oEvent.getSource().setValueState("None");
			}
		},

		onSearchTable: function(oEvent, sId, oModel) {
			var sKey = this.getView().byId("cb" + sId).getSelectedKey();
			if (sKey && sKey.length > 0) {
				sKey = sKey.split("-");
				this.onSearch(oEvent, sId, oModel, sKey[0].trim(), sKey[1].trim());
			} else {
				this.getView().byId("cb" + sId).setValueState("Error");
				this.getView().byId("cb" + sId).setValueStateText("Please select column");
			}

		},

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
				Log.error("Exception in xxxxx function");
			}
		},

		onDefectsAllPress: function(oEvent) {
			try {
				var oJobId = oEvent.getSource().getBindingContext("JobModelAll").getObject().jobid;
				var aState = this.getModel("avmetModel").getProperty("/dash/astid");
				this.getRouter().navTo("CosDefectsSummary", {
					"JobId": oJobId,
					"Flag": "Y"
				});
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		onDefectsDetailsPress: function(oEvent) {
			try {
				var oJobId = oEvent.getSource().getBindingContext("JobModelD").getObject().jobid;
				var aState = this.getModel("avmetModel").getProperty("/dash/astid");
				this.getRouter().navTo("CosDefectsSummary", {
					"JobId": oJobId,
					"Flag": "Y"
				});
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		onScheduleDetailsPress: function(oEvent) {
			try {
				var oJobId = oEvent.getSource().getBindingContext("JobModelS").getObject().jobid;
				var aState = this.getModel("avmetModel").getProperty("/dash/astid");
				this.getRouter().navTo("CosDefectsSummary", {
					"JobId": oJobId,
					"Flag": "Y"
				});
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		onUnscheduledDetailsPress: function(oEvent) {
			try {
				var oJobId = oEvent.getSource().getBindingContext("JobModelU").getObject().jobid;
				var aState = this.getModel("avmetModel").getProperty("/dash/astid");
				this.getRouter().navTo("CosDefectsSummary", {
					"JobId": oJobId,
					"Flag": "Y"
				});
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
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
				Log.error("Exception in xxxxx function");
			}
		},

		onCreateJobPress: function() {
			try {
				this.getRouter().navTo("CosCreateJob");
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		onCreateScheduleJobPress: function() {
			try {
				this.getRouter().navTo("ESScheduleJobCreate");
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

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
				Log.error("Exception in xxxxx function");
			}
		},

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
				Log.error("Exception in xxxxx function");
			}
		},

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
				Log.error("Exception in xxxxx function");
			}
		},

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
				Log.error("Exception in xxxxx function");
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var sState = oEvent.getParameter("arguments").State;
				var oLocalJobsModel = dataUtil.createNewJsonModel();
				oLocalJobsModel.setData({
					AllTableFlag: true,
					DefectTableFlag: false,
					ScheduledTableFlag: false,
					UnscheduledTableFlag: false,
					SelectedKey: sState,
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
				this._fnJobDetailsGetAll();
				this._fnJobDetailsGetDefect();
				this._fnJobDetailsGetScheduled();
				this._fnJobDetailsGetUnScheduled();
				this._fnJobDetailsGetUnCompleted();
				this._fnJobGetScheduled();
				this._fnJobGetAircraftScheduled();
				this._fnJobGetCompScheduled();
				this._fnJobGetENGScheduled();
				this._fnJobGetMODSTIScheduled();
				this.fnLoadSrv1Dashboard();
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnJobDetailsGetAll: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "jobty eq Z and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelAll");
				}.bind(this);

				ajaxutil.fnRead("/DefectJobSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		_fnJobDetailsGetDefect: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "jobty eq D and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelD");
				}.bind(this);

				ajaxutil.fnRead("/DefectJobSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnJobDetailsGetScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "jobty eq S and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelS");
				}.bind(this);

				ajaxutil.fnRead("/DefectJobSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnJobDetailsGetUnScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "jobty eq U and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelU");
				}.bind(this);

				ajaxutil.fnRead("/DefectJobSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnJobDetailsGetUnCompleted: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "jstat eq X and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelC");
				}.bind(this);

				ajaxutil.fnRead("/DefectJobSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnJobGetScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "CTYPE eq ALL and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					for (var i in oData.results) {
						var iPrec = formatter.JobDueDecimalPrecision(oData.results[i].UMKEY);                         
						var iVal = parseFloat(oData.results[i].DUEIN).toFixed(iPrec);
						oData.results[i].DUEIN = iVal;
						iVal = parseFloat(oData.results[i].SERVDUE).toFixed(iPrec);
						oData.results[i].SERVDUE = iVal;
					}

					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "SchJobModelAll");
				}.bind(this);

				ajaxutil.fnRead("/GetSerLogSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnJobGetAircraftScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "CTYPE eq AIRCRAFT and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					for (var i in oData.results) {
						var iPrec = formatter.JobDueDecimalPrecision(oData.results[i].UMKEY);                         
						var iVal = parseFloat(oData.results[i].DUEIN).toFixed(iPrec);
						oData.results[i].DUEIN = iVal;
						iVal = parseFloat(oData.results[i].SERVDUE).toFixed(iPrec);
						oData.results[i].SERVDUE = iVal;
					}
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelAIR");
				}.bind(this);

				ajaxutil.fnRead("/GetSerLogSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnJobGetCompScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "CTYPE eq COMPONENT and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					for (var i in oData.results) {
						var iPrec = formatter.JobDueDecimalPrecision(oData.results[i].UMKEY);                         
						var iVal = parseFloat(oData.results[i].DUEIN).toFixed(iPrec);
						oData.results[i].DUEIN = iVal;
						iVal = parseFloat(oData.results[i].SERVDUE).toFixed(iPrec);
						oData.results[i].SERVDUE = iVal;
					}
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelCOM");
				}.bind(this);

				ajaxutil.fnRead("/GetSerLogSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnJobGetENGScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "CTYPE eq ENGINE and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					for (var i in oData.results) {
						var iPrec = formatter.JobDueDecimalPrecision(oData.results[i].UMKEY);                         
						var iVal = parseFloat(oData.results[i].DUEIN).toFixed(iPrec);
						oData.results[i].DUEIN = iVal;
						iVal = parseFloat(oData.results[i].SERVDUE).toFixed(iPrec);
						oData.results[i].SERVDUE = iVal;
					}
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelENG");
				}.bind(this);

				ajaxutil.fnRead("/GetSerLogSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnJobGetMODSTIScheduled: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "CTYPE eq MODSTI and tailid eq " + that.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					for (var i in oData.results) {
						var iPrec = formatter.JobDueDecimalPrecision(oData.results[i].UMKEY);                         
						var iVal = parseFloat(oData.results[i].DUEIN).toFixed(iPrec);
						oData.results[i].DUEIN = iVal;
						iVal = parseFloat(oData.results[i].SERVDUE).toFixed(iPrec);
						oData.results[i].SERVDUE = iVal;
					}
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobModelMODSTI");
				}.bind(this);

				ajaxutil.fnRead("/GetSerLogSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnCheckStatus: function(aState) {
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
		}

	});
});