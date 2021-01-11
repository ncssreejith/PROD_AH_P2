sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"../util/ajaxutil",
	"../util/dataUtil",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	"../util/ajaxutilNew",
	"avmet/ah/util/FilterOpEnum",
	"../model/formatter"
], function(BaseController, JSONModel, MessageToast, MessageBox, ajaxutil, dataUtil, Filter, FilterOperator, Spreadsheet, ajaxutilNew,
	FilterOpEnum, formatter) {
	"use strict";
	return BaseController.extend("avmet.ah.controller.ESOperator", {
		formatter: formatter,
		onInit: function() {
			var oInitialModel = new JSONModel({
				dispJob: true,
				dispRole: false,
				dispSrv: false
			});
			this.getView().setModel(oInitialModel, "oInitialModel");
			this.getView().setModel(new JSONModel({}), "oGlobalModel");
			var oSelectModel = new JSONModel("model/ESOperator.json");
			this.getView().setModel(oSelectModel, "oSelectModel");
			this.getRouter().getRoute("ESoperator").attachPatternMatched(this._handleRouteMatched, this);
		},
		onselectionChange: function(oEvent) {
			var that = this;
			var oInitialModel = that.getView().getModel("oInitialModel");
			var selectionData = oInitialModel.getData();
			var selectedKey = oEvent.getParameters().selectedItem.getProperty("key");
			selectionData.dispJob = selectionData.dispRole = selectionData.dispSrv = false;

			// Get the Selection Type - To display the relevant Table output
			if (selectedKey === "JOB") {
				oInitialModel.setProperty("/dispJob", true);
				that._getJobData();
			}

			if (selectedKey === "ROLE") {
				oInitialModel.setProperty("/dispRole", true);
				that._getRoleSrvData("ROLE");
			}

			if (selectedKey === "SERVICE") {
				oInitialModel.setProperty("/dispSrv", true);
				that._getRoleSrvData("SERVICE");
			}
		},

		// Search 
		onFilterLiveChange: function(oEvent) {
			var sVal = oEvent.getParameter("newValue");
			var selectionData = this.getView().getModel("oInitialModel").getData();
			//var filters = [];

			// Get the Selection Type - relevant Filter
			if (selectionData.dispJob === true) {
				var oTable = this.getView().byId("jobTable");
				var filters = this._jobFilterSelection(sVal);
			}

			if (selectionData.dispRole === true) {
				oTable = this.getView().byId("roleTable");
				filters = this._roleFilterSelection(sVal);
			}

			if (selectionData.dispSrv === true) {
				oTable = this.getView().byId("srvTable");
				filters = this._srvFilterSelection(sVal);
			}

			var orFilters = new sap.ui.model.Filter(filters, false);
			oTable.getBinding("rows").filter([orFilters]);
		},

		// Download
		onclickDownload: function() {
			var aCols, aTableData, oSettings, oSheet;
			var selectedRecords = [];
			var selectionData = this.getView().getModel("oInitialModel").getData();

			// Get the Selection Type and relevant Data
			if (selectionData.dispJob === true) {
				aCols = this._createColumnJob();
				var aSelectedIndexes = this.getView().byId("jobTable").getSelectedIndices(); //this.getView().byId("jobTable").getBinding().aIndices;
				aTableData = this.getView().getModel("oGlobalModel").getProperty("/Jobs");
			}

			if (selectionData.dispRole === true) {
				aCols = this._createColumnRole();
				aSelectedIndexes = this.getView().byId("roleTable").getSelectedIndices();
				aTableData = this.getView().getModel("oGlobalModel").getProperty("/Services");
			}

			if (selectionData.dispSrv === true) {
				aCols = this._createColumnServices();
				aSelectedIndexes = this.getView().byId("srvTable").getSelectedIndices();
				aTableData = this.getView().getModel("oGlobalModel").getProperty("/Services");
			}

			for (var i = 0; i < aSelectedIndexes.length; i++) {
				var item = aSelectedIndexes[i];
				selectedRecords.push(aTableData[item]);
			}

			if (selectedRecords.length === 0) {
				MessageBox.show("Please select the records you want to download.");
				return;
			}

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: selectedRecords
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function() {
					MessageToast.show("Spreadsheet export has finished");
				})
				.finally(oSheet.destroy);
		},

		// Private Methods
		// Get Job Data
		_getJobData: function() {
			var oGlobalModel = this.getModel("oGlobalModel"),
				oInitialModel = this.getModel("oInitialModel"); //Rahul: 07/12/2020: 05:43PM :New Model Initialized
			var oParameter = {};
			oParameter.error = function(error) {
				this.getView().getModel("oGlobalModel").refresh();
				MessageBox.error(error.responseText);
			};
			//	oParameter.filter = "AIRID eq " + this.getAircraftId() + " and TAILID eq " + this.getTailId();
			oParameter.filter = "AIRID" + FilterOpEnum.EQ + this.getAircraftId() + FilterOpEnum.AND + "TAILID" + FilterOpEnum.EQ + this.getTailId();
			oParameter.success = function(oData) {
				if (oData && oData.results && oData.results.length > 0) {
					oGlobalModel.setProperty("/Jobs", oData.results);
				}
				//Rahul: 07/12/2020: 05:43PM : JSON Value Updated-Start
				oInitialModel.setProperty("/dispJob", true);
				oInitialModel.setProperty("/dispRole", false);
				oInitialModel.setProperty("/dispSrv", false);
				this.getView().byId("idSelectID").setSelectedKey("JOB");
				//Rahul: 07/12/2020: 05:43PM : JSON Value Updated-End
				oInitialModel.refresh();
				this.getView().getModel("oGlobalModel").refresh();
			}.bind(this);

			ajaxutilNew.fnRead(this.getResourceBundle().getText("GETESOPERATORSVC"), oParameter);
		},

		// Get Role/Service Data
		_getRoleSrvData: function(seltype) {
			var oGlobalModel = this.getModel("oGlobalModel");
			var oParameter = {};
			oParameter.error = function(error) {
				this.getView().getModel("oGlobalModel").refresh();
				MessageBox.error(error.responseText);
			};
			//	oParameter.filter = "SELTYPE eq " + seltype + " and TAILID eq " + this.getTailId();
			oParameter.filter = "SELTYPE" + FilterOpEnum.EQ + seltype + "&TAILID" + FilterOpEnum.EQ + this.getTailId();

			oParameter.success = function(oData) {
				if (oData && oData.results && oData.results.length > 0) {
					oGlobalModel.setProperty("/Services", oData.results);
				} else {
					oGlobalModel.setProperty("/Services", []);
				}
				this.getView().getModel("oGlobalModel").refresh();
			}.bind(this);

			ajaxutilNew.fnRead(this.getResourceBundle().getText("ESOPERATORFSSVC"), oParameter);
		},

		// Job Excel Columns
		_createColumnJob: function() {
			return [{
				label: "Air ID",
				property: "AIRID",
				//type: EdmType.Number,
				width: "25"
			}, {
				label: "Tail ID",
				property: "TAILID",
				width: "25"
			}, {
				label: "Job ID",
				property: "JOBID",
				width: "25"
			}, {
				label: "Aircraft Tail",
				property: "AircraftTail",
				width: "10"
			}, {
				label: "Airframe Hours",
				property: "AirframeHours",
				width: "10"
			}, {
				label: "Defect Type",
				property: "DefectType",
				width: "10"
			}, {
				label: "Defect Description",
				property: "DefectDescription",
				width: "25"
			}, {
				label: "Defect Start Date Time",
				property: "DefectStartTimestamp",
				width: "25"
			}, {
				label: "Found By",
				property: "FoundBy",
				width: "25"
			}, {
				label: "Found During",
				property: "FoundDuring",
				width: "25"
			}, {
				label: "PrimeWork Center",
				property: "PrimeWorkCenter",
				width: "25"
			}, {
				label: "ADD Reason",
				property: "ADDReason",
				width: "25"
			}, {
				label: "Other Reason",
				property: "Other_Reason",
				width: "25"
			}, {
				label: "Period Of Deferment",
				property: "PeriodOfDeferment",
				width: "25"
			}, {
				label: "Limitation Description",
				property: "LimitationDescription",
				width: "25"
			}, {
				label: "Parameters Due",
				property: "ParametersDue",
				width: "25"
			}, {
				label: "Parameters Value",
				property: "ParameterValue",
				width: "25"
			}, {
				label: "Due Date Time",
				property: "DueDateTime",
				width: "25"
			}, {
				label: "Add Approved By",
				property: "AddApprovedBy",
				width: "25"
			}, {
				label: "SubWork Center",
				property: "SubWorkCenter",
				width: "25"
			}, {
				label: "Task ID",
				property: "TaskID",
				width: "25"
			}, {
				label: "Component Description",
				property: "ComponentDescription",
				width: "25"
			}, {
				label: "Part No Removed",
				property: "PartNoRemoved",
				width: "25"
			}, {
				label: "{i18n>SerialNoRemoved}",
				property: "SerialNoRemoved",
				width: "25"
			}, {
				label: "Part No Installed",
				property: "PartNoInstalled",
				width: "25"
			}, {
				label: "Serial No Installed",
				property: "SerialNoInstalled",
				width: "25"
			}, {
				label: "Task Tradesman",
				property: "TaskTradesman",
				width: "25"
			}, {
				label: "Task Supervisor",
				property: "TaskSupervisor",
				width: "25"
			}, {
				label: "Rectification Summary",
				property: "RectificationSummary",
				width: "25"
			}, {
				label: "Defect End Date Time",
				property: "DefectEndTimestamp",
				width: "25"
			}, {
				label: "Job Tradesman",
				property: "JobTradesman",
				width: "25"
			}, {
				label: "Job Supervisor",
				property: "JobSupervisor",
				width: "25"
			}];
		},

		// Role Excel Columns
		_createColumnRole: function() {
			return [{
				label: "Role ID",
				property: "ROLEID",
				//type: EdmType.Number,
				width: "25"
			}, {
				label: "Tail ID",
				property: "TAILID",
				width: "25"
			}, {
				label: "Station ID",
				property: "STNSID",
				width: "25"
			}, {
				label: "Item Installed",
				property: "ADAPTOR",
				width: "25"
			}, {
				label: "Serial Number",
				property: "SERNR",
				width: "25"
			}, {
				label: "Tradesman",
				property: "SGUSR",
				width: "25"
			}, {
				label: "Supervisor",
				property: "RESGUSR",
				width: "25"
			}, {
				label: "Date",
				property: "RESGDTM",
				width: "25"
			}, {
				label: "Time",
				property: "RESGUZT",
				width: "25"
			}];
		},
		//Rahul: 03/12/2020 06.11PM: Local JSON Parameter added.--Start
		// Rahul: 07/12/2020: 02:24PM Services Excel Columns Added Aircraft Monitoring Description,Aircraft Monitoring Status,Flying Requirement Description and Flying Requirement Status 
		/*//Rahul: 07/12/2020: 02:24PM "Engine Serial Number", Removed from JSON FILE*/
		_createColumnServices: function() {
			return [{
				label: "Service ID",
				property: "SRVID",
				width: "25"
			}, {
				label: "Type of Flight Servicing",
				property: "SRVT",
				width: "25"
			}, {
				label: "Aircraft Tail",
				property: "TAILID",
				width: "25"
			}, {
				label: "Replenish",
				property: "RESID",
				width: "25"
			}, {
				label: "Original Amount",
				property: "ORIGAMT",
				width: "25"
			}, {
				label: "Defuel Amount",
				property: "DEFUEL",
				width: "25"
			}, {
				label: "Service Amount",
				property: "SRVAMT",
				width: "25"
			}, {
				label: "Total Amount",
				property: "TOTAMT",
				width: "25"
			}, {
				label: "Date",
				property: "RESGDTM",
				width: "25"
			}, {
				label: "Time",
				property: "RESGUZT",
				width: "25"
			}, {
				label: "Tradesman",
				property: "RESGUSR",
				width: "25"
			}, {
				label: "Task ID",
				property: "TASKID",
				width: "25"
			}, {
				label: "Task Description",
				property: "RTASKID",
				width: "25"
			}, {
				label: "Task Status",
				property: "FTDESC",
				width: "25"
			}, {
				label: "Task Date",
				property: "RTSGDTM",
				width: "25"
			}, {
				label: "Task Time",
				property: "RTSGUZT",
				width: "25"
			}, {
				label: "Task Tradesman",
				property: "RTSGUSR",
				width: "25"
			}, {
				label: "Supervisor",
				property: "RTSG1USR",
				width: "25"
			}, {
				label: "Station",
				property: "STATION",
				width: "25"
			}, {
				label: "Item Installed",
				property: "WESID",
				width: "25"
			}, {
				label: "Serial Number",
				property: "WESNR",
				width: "25"
			}, {
				label: "Weapon Config Date",
				property: "WESGDTM",
				width: "25"
			}, {
				label: "Weapon Config Time",
				property: "WESGUZT",
				width: "25"
			}, {
				label: "Weapon Config Tradesman",
				property: "WSUSER",
				width: "25"
			}, {
				label: "Weapon Config Supervisor",
				property: "WESG1USR",
				width: "25"
			}, {
				label: "FFF Date",
				property: "FFDATE",
				width: "25"
			}, {
				label: "FFF Time",
				property: "FFTIME",
				width: "25"
			}, {
				label: "FFF",
				property: "FFUSER",
				width: "25"
			}, {
				label: "Pilot Accept Date",
				property: "PILOTDATE",
				width: "25"
			}, {
				label: "Pilot Accept Time",
				property: "PILOTTIME",
				width: "25"
			}, {
				label: "Pilot Acceptance",
				property: "PILOT",
				width: "25"
			}, {
				label: "Flight Status",
				property: "FSTAT",
				width: "25"
			}, {
				label: "TYPE OF OPERATION",
				property: "OPRTY",
				width: "25"
			}, {
				label: "Normal",
				property: "LNOR",
				width: "25"
			}, {
				label: "Running",
				property: "LRUN",
				width: "25"
			}, {
				label: "Total",
				property: "LTOT",
				width: "25"
			}, {
				label: "APU Duration",
				property: "APUDUR",
				width: "25"
			}, {
				label: "APU Start",
				property: "APUSNO",
				width: "25"
			}, {
				label: "Engine Start Time",
				property: "EGSTT",
				width: "25"
			}, {
				label: "Engine End Time",
				property: "EGSPT",
				width: "25"
			}, {
				label: "Weight Off Wheel Time",
				property: "WOFFW",
				width: "25"
			}, {
				label: "Weight on Wheel Time",
				property: "WONW",
				width: "25"
			}, {
				label: "AH-Post Flight Date",
				property: "PFDATE",
				width: "25"
			}, {
				label: "AH-Post Flight Time",
				property: "PFTIME",
				width: "25"
			}, {
				label: "Pilot Name",
				property: "PFUSER",
				width: "25"
			}, {
				label: "Aircraft Monitoring Description",
				property: "SMDESC",
				width: "25"
			}, {
				label: "Aircraft Monitoring Status",
				property: "SMSTATUS",
				width: "25"
			}, {
				label: "Flying Requirement Description",
				property: "FRDESC",
				width: "25"
			}, {
				label: "Flying Requirement Status",
				property: "FRSTATUS",
				width: "25"
			}, {
				label: "Engine Serial Number",
				property: "ESERNR",
				width: "25"
			}, {
				label: "Engine Reason for Check",
				property: "CHKRN",
				width: "25"
			}, {
				label: "AMBIENT TEMP",
				property: "TEMP",
				width: "25"
			}, {
				label: "AMBIENT BARO PRESSURE",
				property: "BPRESS",
				width: "25"
			}, {
				label: "TABLE TGT",
				property: "TGTTAB",
				width: "25"
			}, {
				label: "IND TGT",
				property: "TGTIND",
				width: "25"
			}, {
				label: "DIFF TGT",
				property: "TGTDIFF",
				width: "25"
			}, {
				label: "NG",
				property: "NG",
				width: "25"
			}, {
				label: "TQ ACT",
				property: "TQACT",
				width: "25"
			}, {
				label: "NP",
				property: "NP",
				width: "25"
			}, {
				label: "Airspeed",
				property: "ASPEED",
				width: "25"
			}, {
				label: "ETF",
				property: "ETF",
				width: "25"
			}, {
				label: "UPPER LIMIT",
				property: "ULIMIT",
				width: "25"
			}, {
				label: "WITHIN 5 UPPER LIMIT",
				property: "ULIMIT5",
				width: "25"
			}, {
				label: "LOWER LIMIT",
				property: "LLIMIT",
				width: "25"
			}, {
				label: "WITHIN 5 LOWER LIMIT",
				property: "LLIMIT5",
				width: "25"
			}, {
				label: "LOG ID",
				property: "LOGID",
				width: "25"
			}, {
				label: "LCF1",
				property: "LCF1",
				width: "25"
			}, {
				label: "LCF2",
				property: "LCF2",
				width: "25"
			}, {
				label: "INDEX1",
				property: "INDEX1",
				width: "25"
			}, {
				label: "ENGHR",
				property: "ENGHR",
				width: "25"
			}, {
				label: "Total LCF1",
				property: "TLCF1",
				width: "25"
			}, {
				label: "Total LCF2",
				property: "TLCF2",
				width: "25"
			}, {
				label: "Total INDEX",
				property: "TINDEX",
				width: "25"
			}, {
				label: "Total ENGHR",
				property: "TENGHR",
				width: "25"
			}, {
				label: "Date/Time",
				property: "UPDON",
				width: "25"
			}, {
				label: "Airframe Hrs",
				property: "AFH",
				width: "25"
			}, {
				label: "#1 Eng Hrs",
				property: "ENG1HR",
				width: "25"
			}, {
				label: "#2 Eng Hrs",
				property: "ENG2HR",
				width: "25"
			}, {
				label: "APU Hrs",
				property: "APUHR",
				width: "25"
			}, {
				label: "APU Start",
				property: "APUHR",
				width: "25"
			}, {
				label: "ALQ144",
				property: "ALQ144",
				width: "25"
			}, {
				label: "Updated By",
				property: "UPDBY",
				width: "25"
			}, {
				label: "Reason",
				property: "REASON",
				width: "25"
			}];
		},
		//Rahul: 03/12/2020 06.11PM: Local JSON Parameter added.--End
		_handleRouteMatched: function() {
			this._getJobData();
			this.getView().getModel("oGlobalModel").refresh();
		},

		_jobFilterSelection: function(sVal) {

			var filters = [];

			filters.push(new sap.ui.model.Filter("JOBID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("DefectType", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("AircraftTail", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("DefectDescription", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("DefectStartTimestamp", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("FoundBy", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("PrimeWorkCenter", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("ADDReason", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("LimitationDescription", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("AddApprovedBy", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("SubWorkCenter", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("ComponentDescription", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("PartNoRemoved", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("SerialNoRemoved", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("PartNoInstalled", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("SerialNoInstalled", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("TaskTradesman", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("TaskSupervisor", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("TaskID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("JobTradesman", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("JobSupervisor", sap.ui.model.FilterOperator.Contains, sVal));

			return filters;

		},

		_roleFilterSelection: function(sVal) {

			var filters = [];

			filters.push(new sap.ui.model.Filter("ROLEID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("TAILID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("STNSID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("SERNR", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("SGUSR", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("ADAPTOR", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("RESGUSR", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("RESGDTM", sap.ui.model.FilterOperator.Contains, sVal));

			return filters;

		},

		_srvFilterSelection: function(sVal) {

			var filters = [];

			filters.push(new sap.ui.model.Filter("SRVID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("RESID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("SRVTID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("RESGUSR", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("RESGDTM", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("RESGUZT", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("STATION", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("RTSGUSR", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("FTDESC", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("WESID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("TASKID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("RTASKID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("STATION", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("RTSG1USR", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("STNSID", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("SERNR", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("WESGDTM", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("WSUSER", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("FSTAT", sap.ui.model.FilterOperator.Contains, sVal));

			return filters;
		}

	});
});