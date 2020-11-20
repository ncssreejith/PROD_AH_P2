sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
	"sap/m/MessageBox",
	"../util/ajaxutil",
	"../util/dataUtil",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	// 'sap/ui/export/library',
	"sap/base/Log"
], function(BaseController, JSONModel, MessageToast, MessageBox, ajaxutil, dataUtil, Filter, FilterOperator, Spreadsheet, Log) {
	"use strict";
	//var EdmType = exportLibrary.EdmType;
	return BaseController.extend("avmet.ah.controller.ESOperator", {

		onInit: function() {
			this.getView().setModel(new JSONModel({}), "oGlobalModel");
			this.getRouter().getRoute("ESoperator").attachPatternMatched(this._handleRouteMatched, this); //Change by Teck Meng 20/11/2020 10:15
			// this.onclickGo(); //Change by Teck Meng 20/11/2020 10:15
			//	document.addEventListener("scroll", this._checkSeesion(), true); 
		},

		// _airModelCheck: function(sessionid) {

		// 	this.getView().setModel(oGlobalModel, "oGlobalModel");
		// 	this.getView().setModel(oInitialModel, "oInitialModel");

		// 	// Get Data
		// 	var that = this,
		// 		oParameter = {};
		// 	oParameter.error = function(error) {
		// 		MessageBox.error(error.responseText);
		// 	};

		// 	oParameter.success = function(oData) {
		// 		var lookup = {};
		// 		var result = [];

		// 		for (var item, i = 0; item = oData.results[i++];) {
		// 			var name = item.airid;

		// 			if (!(name in lookup)) {
		// 				lookup[name] = 1;
		// 				result.push(item);
		// 			}
		// 		}

		// 		oInitialModel.setProperty("/AirIDs", result);
		// 	}.bind(this);

		// 	ajaxutil.fnRead(this.getResourceBundle().getText("AIRMODELSVC"), oParameter);

		//  },

		// _login: function() {
		// 	try {

		// 		var sPass = dataUtil.username + ":" + dataUtil.pwd;
		// 		$.ajax({
		// 			type: 'GET',
		// 			url: dataUtil.destination + "/ws_authenticate",
		// 			headers: {
		// 				"Authorization": "Basic " + dataUtil._encriptInfo(sPass),
		// 				"state": "new"
		// 			},
		// 			error: function(xhrx) {
		// 				var vError = "Error";
		// 				if (xhrx.status === 500 || xhrx.status === 401) {
		// 					vError = xhrx.responseJSON[0].ErrorMsg;
		// 				}
		// 				MessageBox.error(vError);
		// 			},
		// 			success: function(oResponse, xhrx, sss) {

		// 				dataUtil.setDataSet("oUserSession", {
		// 					"sessionid": oResponse[0].SESSIONID
		// 				});

		// 				this._airModelCheck(oResponse[0].SESSIONID);
		// 			}.bind(this)
		// 		});
		// 	} catch (e) {
		// 		Log.error("Exception in onInit function");
		// 	}

		// },

		onFilterLiveChange: function(oEvent) {
			var sVal = oEvent.getParameter("newValue");
			var oTable = this.getView().byId("jobTable");
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
			filters.push(new sap.ui.model.Filter("JobTradesman", sap.ui.model.FilterOperator.Contains, sVal));
			filters.push(new sap.ui.model.Filter("JobSupervisor", sap.ui.model.FilterOperator.Contains, sVal));

			var orFilters = new sap.ui.model.Filter(filters, false);
			oTable.getBinding("rows").filter([orFilters]);
		},
		// onAirIDChange: function(oEvent) {
		// 	// Get Data
		// 	var that = this,
		// 		airID = oEvent.getParameters().selectedItem.getProperty("key"),
		// 		oParameter = {};
		// 	oParameter.error = function(error) {
		// 		MessageBox.error(error.responseText);
		// 	};
		// 	oParameter.filter = "airid eq " + this.getAircraftId();
		// 	oParameter.success = function(oData) {
		// 		oInitialModel.setProperty("/TailIDs", oData.results);
		// 	}.bind(this);

		// 	ajaxutil.fnRead(this.getResourceBundle().getText("AIRTAILSVC"), oParameter);
		// 	//oInitialModel.setProperty("/airID", airID);
		// },
		// onTailIDChange: function(oEvent) {

		// 	oInitialModel.setProperty("/tailID", oEvent.getParameters().selectedItem.getProperty("key"));

		// },

		onclickGo: function() {
			// Get Data

			// var airID = oInitialModel.getData().airID;
			// var tailID = oInitialModel.getData().tailID;
			var oGlobalModel =  this.getModel("oGlobalModel");
			var oParameter = {};
			oParameter.error = function(error) {
				MessageBox.error(error.responseText);
			};
			oParameter.filter = "AIRID eq " + this.getAircraftId() + " and TAILID eq " + this.getTailId();
			oParameter.success = function(oData) {
				if (oData && oData.results && oData.results.length > 0) {
					oGlobalModel.setProperty("/Jobs", oData.results);
				}
				this.getView().getModel("oGlobalModel").refresh(); //Change by Teck Meng 20/11/2020 10:15
				
			}.bind(this);

			ajaxutil.fnRead(this.getResourceBundle().getText("GETESOPERATORSVC"), oParameter);
		},
		onclickDownload: function() {
			var aCols, aJobs, oSettings, oSheet;
			var Jobs = [];
			aCols = this.createColumnConfig();
			//var aJobIndexes = this.getView().byId("jobTable").getSelectedIndices();
			var aJobIndexes = this.getView().byId("jobTable").getBinding().aIndices;
			aJobs = this.getView().getModel("oGlobalModel").getProperty("/Jobs");
			for (var i = 0; i < aJobIndexes.length; i++) {
				var item = aJobIndexes[i];
				Jobs.push(aJobs[item]);
			}

			if (Jobs.length === 0) {
				MessageBox.show("Please select the records you want to download.");
				return;
			}

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: Jobs
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function() {
					MessageToast.show("Spreadsheet export has finished");
				})
				.finally(oSheet.destroy);
		},

		createColumnConfig: function() {
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

		_handleRouteMatched: function() { //Change by Teck Meng 20/11/2020 10:15
			this.onclickGo(); //Change by Teck Meng 20/11/2020 10:15
			this.getView().getModel("oGlobalModel").refresh(); //Change by Teck Meng 20/11/2020 10:15
		} //Change by Teck Meng 20/11/2020 10:15

	});
});