sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/model/json/JSONModel",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log",
	"avmet/ah/util/ajaxutilNew",
	"../util/FilterOpEnum"
], function(BaseController, dataUtil, JSONModel, FieldValidations, ajaxutil, formatter, Log, ajaxutilNew, FilterOpEnum) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.AuditLog", {
		formatter: formatter,

		onInit: function() {
			try {
				this.getRouter().getRoute("AuditLog").attachPatternMatched(this._handleRouteMatched, this);
				//Rahul: 1/12/2020: 10:59AM: Code Commented-Start.
				//this.getRouter().getRoute("HistoryLog").attachPatternMatched(this._handleHistoryRouteMatched, this);
				//Rahul: 1/12/2020: 10:59AM: Code Commented-End.
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},

		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************

		/* Function: onClearFilterBar
		 * Parameter: oEvt
		 * Description: function to clear filter bar selection
		 */
		onClearFilterBar: function() {
			try {
				this.getModel("auditLogModel").setProperty("/ApplicationKey", "");
				this.getModel("auditLogModel").setProperty("/ApplicationDetailKey", "");
				this.getModel("auditLogModel").setProperty("/ObjectId", "");
				this.getModel("auditLogModel").setProperty("/PeriodDate", "");
			} catch (e) {
				Log.error("Exception in onClearFilterBar function");
			}
		},

		/* Function: onRowSelection
		 * Parameter: oEvt
		 * Description: function when row is selected in table
		 */
		onRowSelection: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sTrnId = oSrc.getBindingContext("auditLogModel").getObject().APPLICATION;
				this._fnGetAuditDetail(oSrc, sTrnId);
			} catch (e) {
				Log.error("Exception in onRowSelection function");
			}

		},

		/* Function: onAuditInfoPress
		 * Parameter: oEvt
		 * Description: function to load fragment when row is selected
		 */
		onAuditInfoPress: function(oSrc, aData) {
			try {
				var oApproverModel = new JSONModel(aData);
				this.getView().setModel(oApproverModel, "quickViewModel");
				var oModel = this.getView().getModel("quickViewModel");
				if (!this._oDialog) {
					this._oDialog = this.createoDialog(this, "idAuditLog", "AuditDetailView");
				}
				this._oDialog.setModel(oModel, "AuditInfo");
				this._oDialog.open();
			} catch (e) {
				Log.error("Exception in onAuditInfoPress function");
			}
		},

		/* Function: onDialogClose
		 * Parameter: oEvt
		 * Description: function to close dialog
		 */
		onDialogClose: function(oEvent) {
			try {
				if (this._oDialog) {
					this._oDialog.close(this);
					this._oDialog.destroy();
					delete this._oDialog;
				}
			} catch (e) {
				Log.error("Exception in onDialogClose function");
			}
		},
		//Rahul: 1/12/2020: 10:59AM: New Code added-Start.
		/* Function: onSuggestObj
		 * Parameter: oEvt
		 * Description: function to show items in predictive search
		 */
		onSuggestObj: function(oEvent) {
			var sText = oEvent.getSource().getValue();
			try {
				var that = this,
					oPrmJobDue = {};

				var sApplication = this.getModel("auditLogModel").getProperty("/ApplicationKey"),
					sSubApplication = this.getModel("auditLogModel").getProperty("/ApplicationDetailKey"),
					sDateRange = this.getModel("auditLogModel").getProperty("/PeriodDate"),
					fromDate = "",
					toDate = "",
					//	filter = "PLATFORM eq " + this.getAircraftId() + " and FLAG eq J and TAILID eq " + this.getTailId() + " and KEYWORD eq " + sText;
					filter = "PLATFORM" + FilterOpEnum.EQ + this.getAircraftId() + FilterOpEnum.AND + "FLAG" + FilterOpEnum.EQ + "J" + FilterOpEnum.AND +
					"TAILID" + FilterOpEnum.EQ + this.getTailId() + FilterOpEnum.AND + "KEYWORD" + FilterOpEnum.EQ + sText;

				if (sApplication) {
					//	filter = filter.concat(" and POBJECT eq " + sApplication);
					filter = filter.concat(FilterOpEnum.AND + "POBJECT" + FilterOpEnum.EQ + sApplication);
				}

				if (sSubApplication) {
					//	filter = filter.concat(" and OBJECT eq " + sSubApplication);
					filter = filter.concat(FilterOpEnum.AND + "OBJECT" + FilterOpEnum.EQ + sSubApplication);
				}

				if (sDateRange) {
					fromDate = this.formatter.defaultOdataDateFormat(this.getView().byId("drFilter").getDateValue());
					toDate = this.formatter.defaultOdataDateFormat(this.getView().byId("drFilter").getSecondDateValue());
					//	filter = filter.concat(" and ADATE eq " + fromDate + " and TODATE eq " + toDate
					filter = filter.concat(FilterOpEnum.AND + "ADATE" + FilterOpEnum.EQ + fromDate + FilterOpEnum.AND + "TODATE" + FilterOpEnum.EQ +
						toDate
					);
				}

				oPrmJobDue.filter = filter;
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "ObjectSugg");
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETAUDITLOGSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in onSuggestObj function");
				this.handleException(e);
			}
		},

		/* Function: _fnGetUserAudLog
		 * Parameter: oEvt
		 * Description: function to fetch user drop down : not required need to be removed in code clean up
		 */
		_fnGetUserAudLog: function() {
			try {
				var that = this,
					oPrmWBM = {};
				//	oPrmWBM.filter = "FLAG eq U";
				oPrmWBM.filter = "FLAG" + FilterOpEnum.EQ + "U";
				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("auditLogModel").setProperty("/UserSet", oData.results);
					}
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETAUDITLOGSVC"), oPrmWBM);
			} catch (e) {
				Log.error("Exception in _fnGetAudLog function");
			}
		},

		/* Function: _fnGetAuditDetail
		 * Parameter: oEvt
		 * Description: function to retreive details from back end when item is selected
		 */
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
				Log.error("Exception in _fnGetAuditDetail function");
			}
		},
		//Rahul: 1/12/2020: 10:59AM: New Code added-End.

		/* Function: onObjSelect
		 * Parameter: oEvt
		 * Description: function to populate sub application when application is selected
		 */
		onObjSelect: function(oEvent) {
			try {
				var sKey = oEvent.getSource().getSelectedKey();
				var bFlag = sKey && sKey.length > 0 ? true : false;
				this.getModel("auditLogModel").setProperty("/enabledSubApp", bFlag);

				var that = this,
					oPrmWBM = {};
				//	oPrmWBM.filter = "POBJECT eq " + sKey + " and FLAG eq S and TAILID eq " + this.getTailId();
				oPrmWBM.filter = "POBJECT" + FilterOpEnum.EQ + sKey + FilterOpEnum.AND + "FLAG" + FilterOpEnum.EQ + "S" + FilterOpEnum.AND +
					"TAILID" + FilterOpEnum.EQ + this.getTailId();
				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("auditLogModel").setProperty("/ApplicationDetailSet", oData.results);
					} else {
						sap.m.MessageToast.show("No application(s) found");
					}

				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETAUDITLOGSVC"), oPrmWBM);
			} catch (e) {
				Log.error("Exception in onObjSelect function");
			}

		},

		/* Function: _fnGetApplicationAudLog
		 * Parameter: sKey, sJobId
		 * Description: function to populate application drop down
		 */
		_fnGetApplicationAudLog: function(sKey, sJobId) {
			try {
				var that = this,
					oPrmWBM = {};
				if (sKey === "H") {
					//	oPrmWBM.filter = "PLATFORM eq " + this.getAircraftId() + " and FLAG eq J and TAILID eq " + this.getTailId(); //Rahul:01/11/2020: 11:02AM New filtter added in URL
					oPrmWBM.filter = "PLATFORM" + FilterOpEnum.EQ + this.getAircraftId() + FilterOpEnum.AND + "FLAG" + FilterOpEnum.EQ + "J" +
						FilterOpEnum.AND + "TAILID" + FilterOpEnum.EQ + this.getTailId();
				} else {
					//	oPrmWBM.filter = "PLATFORM eq " + this.getAircraftId() + " and FLAG eq O and TAILID eq " + this.getTailId();
					oPrmWBM.filter = "PLATFORM" + FilterOpEnum.EQ + this.getAircraftId() + FilterOpEnum.AND + "FLAG" + FilterOpEnum.EQ + "O" +
						FilterOpEnum.AND + "TAILID" + FilterOpEnum.EQ + this.getTailId();
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

				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETAUDITLOGSVC"), oPrmWBM);
			} catch (e) {
				Log.error("Exception in _fnGetApplicationAudLog function");
			}
		},

		/* Function: onSelectionChange
		 * Parameter: oEvt
		 * Description: function when search button is clicked 
		 */
		onSearch: function() {

			var that = this,
				oPrmWBM = {},
				sObjId = this.getModel("auditLogModel").getProperty("/ObjectId"),
				sApplication = this.getModel("auditLogModel").getProperty("/ApplicationKey"),
				sSubApplication = this.getModel("auditLogModel").getProperty("/ApplicationDetailKey"),
				sDateRange = this.getModel("auditLogModel").getProperty("/PeriodDate"),
				fromDate = "",
				toDate = "",
				//	filter = "PLATFORM eq " + this.getAircraftId() + " and FLAG eq T and TAILID eq " + this.getTailId();
				filter = "PLATFORM" + FilterOpEnum.EQ + this.getAircraftId() + FilterOpEnum.AND + "FLAG" + FilterOpEnum.EQ + "T" +
				FilterOpEnum.AND + "TAILID" + FilterOpEnum.EQ + this.getTailId();
			if (sObjId) {
			//	filter = filter.concat(" and JOBID eq " + sObjId);
			filter = filter.concat(FilterOpEnum.AND + "JOBID" + FilterOpEnum.EQ + sObjId);
			}

			if (sApplication) {
			//	filter = filter.concat(" and POBJECT eq " + sApplication);
				filter = filter.concat(FilterOpEnum.AND + "POBJECT" + FilterOpEnum.EQ + sApplication);
			}

			if (sSubApplication) {
			//	filter = filter.concat(" and OBJECT eq " + sSubApplication);
			filter = filter.concat(FilterOpEnum.AND + "OBJECT" + FilterOpEnum.EQ + sSubApplication);
			}

			if (sDateRange) {
				fromDate = this.formatter.defaultOdataDateFormat(this.getView().byId("drFilter").getDateValue()); //Rahul:01/11/2020: 11:02AM New filtter added with formatter
				toDate = this.formatter.defaultOdataDateFormat(this.getView().byId("drFilter").getSecondDateValue()); //Rahul:01/11/2020: 11:02AM New filtter added with formatter
			//	filter = filter.concat(" and ADATE eq " + fromDate + " and TODATE eq " + toDate
			filter = filter.concat(FilterOpEnum.AND + "ADATE" + FilterOpEnum.EQ + fromDate + FilterOpEnum.AND + "TODATE" + FilterOpEnum.EQ +
						toDate);
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

			ajaxutilNew.fnRead(this.getResourceBundle().getText("GETAUDITLOGSVC"), oPrmWBM);

		},

		/* Function: onSelectionChange
		 * Parameter: oEvt
		 * Description: function to intialize local model when route is matched
		 */
		_handleRouteMatched: function(oEvent) {
				try {
					//this._fnGetUserAudLog(); //Rahul:01/11/2020: 11:02AM Code commented
					this._fnGetApplicationAudLog();
					this.getView().setModel(new JSONModel({}), "auditLogModel");
					this.getView().getModel("auditLogModel").setSizeLimit(10000);
					this.getModel("auditLogModel").setProperty("/Title", "Audit Log Report");
					this.getModel("auditLogModel").setProperty("/flag", null);
					this.getModel("auditLogModel").setProperty("/isActionEnabled", false);
				} catch (e) {
					Log.error("Exception in _handleRouteMatched function");
				}
			}
			//Rahul:01/11/2020: 11:02AM Code commented not needed-Start
			// _handleHistoryRouteMatched: function(oEvent) {
			// 	try {
			// 		this.getView().setModel(new JSONModel({}), "auditLogModel");
			// 		var jobId = oEvent.getParameter("arguments").JobId,
			// 			sFlag = oEvent.getParameter("arguments").Flag;
			// 		this.getModel("auditLogModel").setProperty("/Title", "History");
			// 		this.getModel("auditLogModel").setProperty("/SubTitle", "Job :" + jobId);
			// 		this.getModel("auditLogModel").setProperty("/isActionEnabled", false);
			// 		this.getModel("auditLogModel").setProperty("/flag", sFlag);
			// 		this._fnGetApplicationAudLog(sFlag, jobId);
			// 	} catch (e) {
			// 		Log.error("Exception in _handleHistoryRouteMatched function");
			// 	}
			// }
			//Rahul:01/11/2020: 11:02AM Code commented not needed-End	

	});

});