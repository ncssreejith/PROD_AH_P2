sap.ui.define([
	"./BaseController",
	"../util/dataUtil",
	"../util/ajaxutil",
	"../model/FieldValidations",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, dataUtil, ajaxutil, FieldValidations, formatter, JSONModel, Log) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : Rahul Thorat
	 *   Control name: CosAddSortieMonitoring        
	 *   Purpose : Add sortie monitoring functionality
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onSignOffPress
	 *     2. Backend Calls
	 *        2.1 fnLogById
	 *     3. Private calls
	 *        3.1 _onObjectMatched
	 *        3.2 fnSetReason
	 *   Note :
	 *************************************************************************** */
	return BaseController.extend("avmet.ah..controller.CosAddSoritieMonitoring", {
		formatter: formatter,
		onInit: function() {
			try {
				var that = this;
				that.getRouter().getRoute("CosAddSoritieMonitoring").attachPatternMatched(that._onObjectMatched, this);
				var oDate = new Date();
				var oSortiData = {};
				oSortiData.header = {
					jobid: "",
					wc: "",
					sTailId: "",
					sAirId: "",
					ddt: oDate,
					tme: oDate.getHours() + ":" + oDate.getMinutes()
				};
				oSortiData.SortieMonitoring = [{
					SN: "",
					Text: "",
					SortiesNo: "",
					RestrictionText: "",
					MonFor: ""
				}];
				that.getView().setModel(new JSONModel(oSortiData), "SortieMonitoringModel");
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:onInit function");
				
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/* =========================================================== */
		/* Event Handlers                                              */
		/* =========================================================== */
		//------------------------------------------------------------------
		// Function: handleLiveChangeSorteiMonitoring
		// Parameter: oEvent
		// Description: This will get called, to handle showing the message text and validation of maxlength.
		//------------------------------------------------------------------

		handleLiveChangeSorteiMonitoring: function(oEvent) {
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
				Log.error("Exception in CosAddSoritieMonitoring:handleLiveChangeSorteiMonitoring function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onAddSorteiMonitoring
		// Parameter: oEvent
		// Description: This will get called, to handle to add new entry for sortie monitoring.
		//------------------------------------------------------------------
		onAddSorteiMonitoring: function(oEvent) {
			try {
				var that = this,
					oSorti = {
						SN: "1",
						Text: "",
						SortiesNo: "",
						RestrictionText: "",
						MonFor: ""
					};
				that.getModel("SortieMonitoringModel").getProperty("/SortieMonitoring").push(oSorti);
				that.getModel("SortieMonitoringModel").refresh();
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:onAddSorteiMonitoring function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onDeletePress
		// Parameter: oEvent
		// Description: This will get called, to handle to delete new entry for sortie monitoring.
		//------------------------------------------------------------------
		onDeletePress: function(oEvent) {
			try {
				var that = this;
				var sPath = oEvent.getSource().getBindingContext("SortieMonitoringModel").getPath().split("/")[2];
				var oModel = that.getView().getModel("SortieMonitoringModel").getProperty("/SortieMonitoring");
				oModel.splice(sPath, 1);
				that.getView().getModel("SortieMonitoringModel").refresh(true);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:onDeletePress function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: onFoundDuringChange
		// Parameter: oEvent
		// Description: This will get called, to handle found during change.
		//------------------------------------------------------------------

		onFoundDuringChange: function(oEvent) {
			var oModel = this.getView().getModel("SortieMonitoringModel");
			var sPath = oEvent.getSource().getBindingContext("SortieMonitoringModel").getPath();
			var sKey = oEvent.getSource().getSelectedKey();
			if (sKey.length > 0) {
				if (this.oObject && this.oObject[sKey] && this.oObject[sKey].VALUE) {
					var minVal = parseFloat(this.oObject[sKey].VALUE, [10]);
					oModel.setProperty(sPath + "/MinVal", minVal);
					var sVal = oModel.getProperty(sPath + "/SortiesNo") ? oModel.getProperty(sPath + "/SortiesNo") : 0;
					sVal = parseFloat(sVal, [10]);
					var iPrec = formatter.JobDueDecimalPrecision(sKey);
					oModel.setProperty(sPath + "/SortiesNo", parseFloat(minVal, [10]).toFixed(iPrec));
				} else {
					oModel.setProperty(sPath + "/MinVal", 0);
					oModel.setProperty(sPath + "/SortiesNo", 0);
				}
			}
		},
		//------------------------------------------------------------------
		// Function: onSortiesNoChange
		// Parameter: oEvent
		// Description: This will get called, to handle sortie no change.
		//------------------------------------------------------------------
		onSortiesNoChange: function(oEvent) {
			try {
				var that = this;
				var oObject = oEvent.getSource().getBindingContext("SortieMonitoringModel").getObject();
				oObject.SortiesNo = oEvent.getParameter("value");
				var oModel = that.getView().getModel("SortieMonitoringModel");
				oModel.updateBindings(true);

			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:onSortiesNoChange function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: handleChange
		// Parameter: oEvent
		// Description: This will get called, to handle date change in view.
		//------------------------------------------------------------------
		handleChange: function(oEvent) {
			try {
				var prevDt = this.getModel("ViewModel").getProperty("/backDt");
				var prevTime = this.getModel("ViewModel").getProperty("/backTm");
				return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorCreateFlyReqPast", "errorCreateFlyReqFuture", prevDt, prevTime);

			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:handleChange function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onSubmitSortieMonitoring
		// Parameter: oEvent
		// Description: This will get called, to handle submit request for creation of new Sortie monitoring.
		//------------------------------------------------------------------
		onSubmitSortieMonitoring: function(oEvent) {
			try {
				var that = this;
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				that.fnCreateSorti();
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:onSubmitSortieMonitoring function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnSortieMonitoringGet
		// Parameter: sJobId
		// Description: This will get called, to handle to get selected Sortie monitoring serial no data.
		//------------------------------------------------------------------
		_fnSortieMonitoringGet: function(sJobId) {
			try {
				var that = this,
					oPrmFR = {};
				oPrmFR.filter = "jobid eq " + sJobId;
				oPrmFR.error = function() {

				};

				oPrmFR.success = function(oData) {
					that.getModel("SortieMonitoringModel").setProperty("/SortieMonitoring/SN", oData.results.length + 1);
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("SORTIEMONSVC"), oPrmFR);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:_fnSortieMonitoringGet function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnMonitoredForGet
		// Parameter: sAirId
		// Description: This will get called, to handle to get Monitored for dropdown data.
		//------------------------------------------------------------------
		_fnMonitoredForGet: function(sAirId) {
			try {
				var that = this,
					oPrmFND = {};
				oPrmFND.filter = "ddid eq SORTI_ and refid eq " + sAirId;
				oPrmFND.error = function() {

				};

				oPrmFND.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "MonitoredForSet");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmFND);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:_fnMonitoredForGet function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetUtilisation
		// Parameter: sAirId
		// Description: This will get called, to handle to get Uitlization dropdown data.
		//------------------------------------------------------------------
		_fnGetUtilisation: function(sAir) {
			try {
				var oPrmJobDue = {};
				oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + sAir + " and JDUID eq SORTI";
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
				Log.error("Exception in _fnGetUtilisation function");
			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetOperationType
		// Parameter: sAirId
		// Description: This will get called, to handle to get Operation type dropdown data.
		//------------------------------------------------------------------
		_fnGetOperationType: function(sAirId) {
			try {
				var that = this,
					oPrmFND = {};
				oPrmFND.filter = "ddid eq TOP_ and refid eq " + sAirId;
				oPrmFND.error = function() {

				};

				oPrmFND.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "OperationSet");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmFND);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:_fnGetOperationType function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetDateValidation
		// Parameter: sJobId
		// Description: This will get called, to handle to date on screen.
		//------------------------------------------------------------------
		_fnGetDateValidation: function(sJobId) {
			try {
				var oPrmTaskDue = {};
				if (sJobId) {
					oPrmTaskDue.filter = "TAILID eq " + this.getTailId() + " and JFLAG eq T and AFLAG eq I and jobid eq " + sJobId;
				} else {
					oPrmTaskDue.filter = "TAILID eq " + this.getTailId() + " and JFLAG eq J and AFLAG eq I";
				}

				oPrmTaskDue.error = function() {};
				oPrmTaskDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("ViewModel").setProperty("/backDt", oData.results[0].VDATE);
						this.getModel("ViewModel").setProperty("/backTm", oData.results[0].VTIME);
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("JOBSDATEVALIDSVC"), oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in _fnGetDateValidation function");
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var that = this,
					sJobId = oEvent.getParameters().arguments.JobId,
					sWrkCenter = oEvent.getParameters().arguments.WorkCenter,
					sAirId = oEvent.getParameters().arguments.AirId,
					sTailId = oEvent.getParameters().arguments.TailId,
					sWorkKey = oEvent.getParameters().arguments.WorkKey;
				that.getModel("SortieMonitoringModel").setProperty("/header/jobid", sJobId);
				that.getModel("SortieMonitoringModel").setProperty("/header/wc", sWorkKey);
				that.getModel("SortieMonitoringModel").setProperty("/header/sAirId", sAirId);
				that.getModel("SortieMonitoringModel").setProperty("/header/sTailId", sTailId);
				that.getModel("SortieMonitoringModel").refresh();
				var oViewModel = dataUtil.createNewJsonModel();
				oViewModel.setData({
					"JobId": sJobId,
					"sAirId": sAirId,
					"sTailId": sTailId,
					"sWorkKey": sWorkKey,
					"WorkCenter": sWrkCenter,
					"SN": ""

				});
				that.getView().setModel(oViewModel, "ViewModel");
				that._fnSortieMonitoringGet(sJobId);
				that._fnMonitoredForGet(sAirId);
				that._fnGetUtilisation(sAirId);
				that._fnGetOperationType(sAirId);
				this._fnGetDateValidation(sJobId);
				FieldValidations.resetErrorStates(this);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:_onObjectMatched function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: fnCreateSorti
		// Parameter: sJobId
		// Description: This will get called, to handle creation of the new sortimonitoring entries data.
		//------------------------------------------------------------------
		fnCreateSorti: function() {
			try {
				if (!this.handleChange()) {
					return;
				}
				var that = this,
					oPayloads = [],
					oModel = that.getModel("SortieMonitoringModel");
				that.getModel("SortieMonitoringModel").getProperty("/SortieMonitoring").forEach(function(oItem, sIndex) {
					var oPayload = {};
					oPayload.JOBID = oModel.getProperty("/header/jobid");
					oPayload.SORNO = (parseInt(oModel.getProperty("/SortieMonitoring/SN")) + 1).toString();
					oPayload.ENDDA = "9999-12-31";
					oPayload.BEGDA = that.formatter.defaultOdataDateFormat(new Date(), "yyyyMMdd");
					oPayload.WRCTR = oModel.getProperty("/header/wc");
					oPayload.SSTAT1 = null;
					oPayload.SORDT = that.formatter.defaultOdataDateFormat(oModel.getProperty("/header/ddt"), "yyyyMMdd");
					oPayload.SORTM = oModel.getProperty("/header/tme");
					oPayload.TAILID = oModel.getProperty("/header/sTailId");
					oPayload.SRVID = null;
					oPayload.NUM1 = null;
					if (oItem.MonFor !== "SORTI_5") {
						var iPrec = formatter.JobDueDecimalPrecision(oItem.MonFor);
						oPayload.SORCNT = parseFloat(oItem.SortiesNo, [10]).toFixed(iPrec);
					} else {
						oPayload.SORCNT = oItem.SortiesNo;
					}

					oPayload.SORDESC = oItem.Text;
					oPayload.SG1USR = "Test User";
					oPayload.SG1DTM = that.formatter.defaultOdataDateFormat(new Date(), "yyyyMMdd");
					oPayload.SG1UZT = null;
					oPayload.SG2USR = null;
					oPayload.SG2DTM = null;
					oPayload.SG2UZT = null;
					oPayload.REST_IMPOSE = oItem.RestrictionText;
					oPayload.MON_FOR = oItem.MonFor;
					oPayload.MON_FORTXT = null;
					oPayload.FLAG = null;
					oModel.setProperty("/SortieMonitoring/SN", oPayload.SORNO);
					oPayloads.push(oPayload);
				}.bind(this));

				var oParameter = {};
				oParameter.error = function() {}.bind(this);
				oParameter.success = function(oData) {
					var oModelSM = that.getModel("SortieMonitoringModel").getData();
					var oDate = new Date();
					oModelSM.header = {
						jobid: "",
						wc: "",
						sTailId: "",
						sAirId: "",
						ddt: oDate,
						tme: oDate.getHours() + ":" + oDate.getMinutes()
					};
					oModelSM.SortieMonitoring = [{
						SN: "",
						Text: "",
						SortiesNo: "",
						RestrictionText: "",
						MonFor: ""
					}];

					var oModelSMJ = that.getModel("ViewModel");
					that.getRouter().navTo("CosDefectsSummary", {
						"JobId": oModelSMJ.getProperty("/JobId"),
						"Flag": "Y",
						"WcKey": oModelSMJ.getProperty("/sWorkKey"),
						"goTo": "SM"
					}, true);
				}.bind(this);
				oParameter.activity = 1;
				ajaxutil.fnCreate(this.getResourceBundle().getText("SORTIEMONSVC"), oParameter, oPayloads, "dummy", this);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:fnCreateSorti function");
				
			}
		}
	});
});