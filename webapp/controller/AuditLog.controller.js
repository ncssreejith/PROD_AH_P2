sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, dataUtil, JSONModel, FieldValidations, ajaxutil, formatter, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.AuditLog", {
		formatter: formatter,

		onInit: function() {
			try {
				this.getRouter().getRoute("AuditLog").attachPatternMatched(this._handleRouteMatched, this);
				this.getRouter().getRoute("HistoryLog").attachPatternMatched(this._handleHistoryRouteMatched, this);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		onClearFilterBar: function() {
			this.getModel("auditLogModel").setProperty("/ApplicationKey", "");
			this.getModel("auditLogModel").setProperty("/ObjectId", "");
			this.getModel("auditLogModel").setProperty("/PeriodDate", "");
		},

		onRowSelection: function(oEvent) {
			var oSrc = oEvent.getSource(),
				sTrnId = oSrc.getBindingContext("auditLogModel").getObject().APPLICATION;
			this._fnGetAuditDetail(oSrc, sTrnId);

		},

		onAuditInfoPress: function(oSrc, aData) {
			var oApproverModel = new JSONModel(aData);
			this.getView().setModel(oApproverModel, "quickViewModel");
			var oModel = this.getView().getModel("quickViewModel");
			if (!this._oDialog) {
				this._oDialog = this.createoDialog(this, "idAuditLog", "AuditDetailView");
			}
			this._oDialog.setModel(oModel, "AuditInfo");
			this._oDialog.open();
		},

		onDialogClose: function(oEvent) {
			if (this._oDialog) {
				this._oDialog.close(this);
				this._oDialog.destroy();
				delete this._oDialog;
			}
		},
		
		onObjSelect: function(oEvent) {
			try {
				var sKey = oEvent.getSource().getSelectedKey();
				var bFlag = sKey && sKey.length > 0 ? true : false;
				this.getModel("auditLogModel").setProperty("/enabledSubApp", bFlag);

				var that = this,
					oPrmWBM = {};
				oPrmWBM.filter = "POBJECT eq " + sKey + " and FLAG eq S and TAILID eq " + this.getTailId();
				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("auditLogModel").setProperty("/ApplicationDetailSet", oData.results);
					} else {
						sap.m.MessageToast.show("No application(s) found");
					}

				}.bind(this);

				ajaxutil.fnRead("/GetAuditLogSvc", oPrmWBM);
			} catch (e) {
				Log.error("Exception in _fnGetAudLog function");
			}

		},

		_fnGetUserAudLog: function() {
			try {
				var that = this,
					oPrmWBM = {};
				oPrmWBM.filter = "FLAG eq U";
				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("auditLogModel").setProperty("/UserSet", oData.results);
					}
				}.bind(this);

				ajaxutil.fnRead("/GetAuditLogSvc", oPrmWBM);
			} catch (e) {
				Log.error("Exception in _fnGetAudLog function");
			}
		},

		_fnGetAuditDetail: function(oSrc, sTrnId) {
			try {
				var that = this,
					oPrmWBM = {};
				oPrmWBM.filter = "TRANSACTION_ID eq " + sTrnId;
				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.onAuditInfoPress(oSrc, oData.results);
					}
				}.bind(this);

				ajaxutil.fnRead("/GetLatestsvc", oPrmWBM);
			} catch (e) {
				Log.error("Exception in _fnGetAudLog function");
			}
		},

		_fnGetApplicationAudLog: function(sKey, sJobId) {
			try {
				var that = this,
					oPrmWBM = {};
					if (sKey === "H") {
						oPrmWBM.filter = "PLATFORM eq " + this.getAircraftId() + " and FLAG eq J and JOBID eq " + sJobId;
					} else {
						oPrmWBM.filter = "PLATFORM eq " + this.getAircraftId() + " and FLAG eq O and TAILID eq " + this.getTailId();
					}
				
				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("auditLogModel").setProperty("/ApplicationSet", oData.results);
					} else {
						sap.m.MessageToast.show("No application(s) found");
					}

				}.bind(this);

				ajaxutil.fnRead("/GetAuditLogSvc", oPrmWBM);
			} catch (e) {
				Log.error("Exception in _fnGetAudLog function");
			}
		},
		
		onSuggestObj : function (oEvent){
			var sText = oEvent.getSource().getValue();
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "PLATFORM eq " + this.getAircraftId() + " and FLAG eq J and KEYWORD eq " + sText + " and TAILID eq " + this.getTailId();
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "ObjectSugg");
				}.bind(this);
				ajaxutil.fnRead("/GetAuditLogSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCreateTask:onSuggestTechOrder function");
				this.handleException(e);
			}
		},

		onSearch: function() {
			try {
				var that = this,
					oPrmWBM = {},
					sObjId = this.getModel("auditLogModel").getProperty("/ObjectId"),
					sApplication = this.getModel("auditLogModel").getProperty("/ApplicationKey"),
					sDateRange = this.getModel("auditLogModel").getProperty("/PeriodDate"),
					fromDate = "",
					toDate = "",
					filter = "PLATFORM eq " + this.getAircraftId() + " and FLAG eq T and TAILID eq " + this.getTailId();
				sApplication = sApplication ? sApplication : null;
				if (sObjId) {
					filter = filter.concat(" and JOBID eq " + sObjId);
				}

				if (sApplication) {
					filter = filter.concat(" and OBJECT eq " + sApplication);
				}

				if (sDateRange) {
					fromDate = sDateRange.split("-")[0].trim();
					toDate = sDateRange.split("-")[1].trim();
					filter = filter.concat(" and ADATE eq " + fromDate + " and TODATE eq " + toDate);
				}

				oPrmWBM.filter = filter;

				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("auditLogModel").setProperty("/TableDataSet", oData.results);
					} else {
						sap.m.MessageToast.show("No record(s) found");
						this.getModel("auditLogModel").setProperty("/TableDataSet", []);
					}

				}.bind(this);

				ajaxutil.fnRead("/GetAuditLogSvc", oPrmWBM);

			} catch (e) {
				Log.error("Exception in _fnGetAudLog function");
			}
		},

		_handleRouteMatched: function(oEvent) {
			try {
				this._fnGetUserAudLog();
				this._fnGetApplicationAudLog();
				this.getView().setModel(new JSONModel({}), "auditLogModel");
				this.getView().getModel("auditLogModel").setSizeLimit(10000);
				this.getModel("auditLogModel").setProperty("/Title","Audit Log Report");
				this.getModel("auditLogModel").setProperty("/flag", null) ;
				this.getModel("auditLogModel").setProperty("/isActionEnabled", false);
			} catch (e) {
				Log.error("Exception in _handleRouteMatched function");
			}
		},
		
		_handleHistoryRouteMatched : function (oEvent){
			try {
				this.getView().setModel(new JSONModel({}), "auditLogModel");
				var jobId = oEvent.getParameter("arguments").JobId,
				sFlag =  oEvent.getParameter("arguments").Flag;
				this.getModel("auditLogModel").setProperty("/Title","History");
				this.getModel("auditLogModel").setProperty("/SubTitle","Job :" + jobId);
				this.getModel("auditLogModel").setProperty("/isActionEnabled", false);
				this.getModel("auditLogModel").setProperty("/flag", sFlag);
					this._fnGetApplicationAudLog(sFlag, jobId);
			} catch (e) {
				Log.error("Exception in _handleHistoryRouteMatched function");
			}
		}

	});

});