sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../util/ajaxutil",
	"../model/FieldValidations",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, dataUtil, ajaxutil, FieldValidations, formatter, JSONModel, Log) {
	"use strict";
/* ***************************************************************************
	 *     Developer : RAJAT GUPTA 
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
				this.handleException(e);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/* =========================================================== */
		/* Event Handlers                                              */
		/* =========================================================== */

		//showing the message text and validation of maxlength
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
				this.handleException(e);
			}
		},

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
				this.handleException(e);
			}
		},

		onDeletePress: function(oEvent) {
			try {
				var that = this;
				var sPath = oEvent.getParameter("listItem").getBindingContext("SortieMonitoringModel").getPath().split("/")[2];
				var oModel = that.getView().getModel("SortieMonitoringModel").getProperty("/SortieMonitoring");
				oModel.splice(sPath, 1);
				that.getView().getModel("SortieMonitoringModel").refresh(true);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:onDeletePress function");
				this.handleException(e);
			}
		},

		onSorteiMonitoringChange: function(oEvent) {
			// var that = this;
			// var oObject = oEvent.getSource().getBindingContext("SortieMonitoringModel").getObject();
			// oObject.Text = oEvent.getParameter("value");
			// that.getView().getModel("SortieMonitoringModel").updateBindings(true);
		},

		onSortiesNoChange: function(oEvent) {
			try {
				var that = this;
				var oObject = oEvent.getSource().getBindingContext("SortieMonitoringModel").getObject();
				oObject.SortiesNo = oEvent.getParameter("value");
				that.getView().getModel("SortieMonitoringModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:onSortiesNoChange function");
				this.handleException(e);
			}
		},

		handleChange: function(oEvent) {
			try {
				FieldValidations.resetErrorStates(this);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:handleChange function");
				this.handleException(e);
			}
		},

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
				this.handleException(e);
			}
		},

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

				ajaxutil.fnRead("/SortieMonSvc", oPrmFR);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:_fnSortieMonitoringGet function");
				this.handleException(e);
			}
		},

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

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmFND);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:_fnMonitoredForGet function");
				this.handleException(e);
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
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:_onObjectMatched function");
				this.handleException(e);
			}
		},

		fnCreateSorti: function() {
			try {
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
					oPayload.SORCNT = oItem.SortiesNo;
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
						"Flag": "Y"
					});
				}.bind(this);
				oParameter.activity=1;
				ajaxutil.fnCreate("/SortieMonSvc", oParameter, oPayloads, "ZRM_COS_JS", this);
			} catch (e) {
				Log.error("Exception in CosAddSoritieMonitoring:fnCreateSorti function");
				this.handleException(e);
			}
		}
	});
});