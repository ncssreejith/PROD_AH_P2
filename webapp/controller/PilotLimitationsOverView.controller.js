sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.LimitationsOverView", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {

			this.getRouter().getRoute("LimitationsOverView").attachPatternMatched(this._onObjectMatched, this);

		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		onMangeAdd: function(oEvent) {
			var oButton = oEvent.getSource();
			// create popover
			if (!this._oPopover) {
				Fragment.load({
					id: "popoverNavCon",
					name: "avmet.ah.view.ah.limitations.ManageAdd",
					controller: this
				}).then(function(oPopover) {
					this._oPopover = oPopover;
					this.getView().addDependent(this._oPopover);
					this._oPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oPopover.openBy(oButton);
			}
		},
		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		onOpenMangeLimitaionDialog: function(oEvent) {
			var that = this;

			if (!this._oAddLim) {
				this._oManageLim = sap.ui.xmlfragment(this.createId("idWorkCenterDialog"),
					"avmet.ah.fragments.ManageLimitation",
					this);
				this.getView().addDependent(this._oManageLim);
			}

			this._oManageLim.open(this);
		},

		onCloseMangeLimitaionDialog: function() {
			if (this._oManageLim) {
				this._oManageLim.close(this);
				this._oManageLim.destroy();
				delete this._oManageLim;
			}
		},
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			var oViewModel = dataUtil.createNewJsonModel(),
				oDate = new Date(),
				oGBModel = dataUtil.getDataSet("AirCraftSelectionGBModel");

			var sCAP = oEvent.getParameters().arguments.CAP;
			var sJob = oEvent.getParameters().arguments.JOB;
			var sCAPTY = oEvent.getParameters().arguments.CAPTY;

			oViewModel.setData({
				CAPID: sCAP,
				JOB: sJob,
				Date: oDate,
				CAPTY: sCAPTY,
				Time: oDate.getHours() + ":" + oDate.getMinutes(),
				flag: oEvent.getParameters().arguments.flag

			});
			this.getView().setModel(oViewModel, "ViewModel");
			//this._fnADDCapDataGet(sCAP);
			this._fnADDCapDataGet("O", sJob, sCAP);
			this._fnADDCapDataMultipleGet("E", sJob, sCAP);
			this._fnReasonforADDGet(oGBModel.airid);
			this._fnPerioOfDeferCBGet(oGBModel.airid);
			this._fnUtilizationGet(oGBModel.airid);
			this._fnCAPDataGet("O", sJob, sCAP);

		},

		_fnCAPDataGet: function(sFlag, sJobId, sCapId) {
			var that = this,

				oPrmJobDue = {};
			var oViewModel = dataUtil.createNewJsonModel();
			oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
			oPrmJobDue.error = function() {

			};

			oPrmJobDue.success = function(oData) {
				oViewModel.setData(oData.results[0]);
				oData.results[0].EXPDT = new Date(oData.results[0].EXPDT);
				oData.results[0].EXPTM = formatter.defaultTimeFormatDisplay(oData.results[0].EXPTM);
				that.getView().setModel(oViewModel, "CapExtendSet");

			}.bind(this);

			ajaxutil.fnRead("/ADDOVERVIEWSvc", oPrmJobDue);
		},

		CAPDataUpdate: function() {
			var that = this,
				oPayload,
				oModel = this.getView().getModel("ViewModel"),
				oPrmJobDue = {};
			oPayload = this.getView().getModel("CapExtendSet").getData();
			//oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
			if (oPayload.PAST_COUNT === null || oPayload.PAST_COUNT === '') {
				oPayload.PAST_COUNT = "1";
			} else {
				oPayload.PAST_COUNT = (parseInt(oPayload.PAST_COUNT) + 1).toString();
			}
			oPrmJobDue.error = function() {

			};

			oPrmJobDue.success = function(oData) {
				this._fnADDCapDataMultipleGet("E", oModel.getProperty("/JOB"), oModel.getProperty("/CAPID"));
				this.onCloseMangeLimitaionDialog();
			}.bind(this);

			ajaxutil.fnUpdate("/ADDOVERVIEWSvc", oPrmJobDue, [oPayload]);
		},

		onStartRect: function(sValue) {
			var that = this,
				sjobid = "",
				oModel, oModels,
				oPayload;
			var dDate = new Date();

			var oParameter = {};
			oModel = this.getView().getModel("ViewModel");
			oModels = this.getView().getModel("CapSet");
			oPayload = {
					"TAILID": oModels.getProperty("/TAILID"),
					"AIRID": oModels.getProperty("/AIRID"),
					"MODID": oModels.getProperty("/MODID"),
					"JOBID": oModels.getProperty("/JOBID"),
					"CAPID": oModels.getProperty("/CAPID"),
					"TASKID": oModels.getProperty("/TASKID"),
					"TDESC": oModels.getProperty("/TDESC"),
					"CAPTY": oModels.getProperty("/CAPTY"),
					"CSTAT": "S",
					"RECTUSR": "Test User",
					"RECTDTM": formatter.defaultOdataDateFormat(dDate),
					"RECTUZT": dDate.getHours() + ":" + dDate.getMinutes(),
					"FLAG": "J"
				},

				oParameter.error = function(response) {

				};

			oParameter.success = function(oData) {

			}.bind(this);

			ajaxutil.fnUpdate("/StartRectificSvc", oParameter, [oPayload]);

		},
		_fnADDCapDataGet: function(sFlag, sJobId, sCapId) {
			var that = this,
				oModel = this.getView().getModel("oViewModel"),
				oPrmJobDue = {};
			var oViewModel = dataUtil.createNewJsonModel();
			oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
			oPrmJobDue.error = function() {

			};

			oPrmJobDue.success = function(oData) {
				oViewModel.setData(oData.results[0]);
				that.getView().setModel(oViewModel, "CapSet");

			}.bind(this);

			ajaxutil.fnRead("/ADDOVERVIEWSvc", oPrmJobDue);
		},

		_fnADDCapDataMultipleGet: function(sFlag, sJobId, sCapId) {
			var that = this,
				oModel = this.getView().getModel("oViewModel"),
				oPrmJobDue = {};
			var oViewModel = dataUtil.createNewJsonModel();
			oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
			oPrmJobDue.error = function() {

			};

			oPrmJobDue.success = function(oData) {
				oViewModel.setData(oData.results);
				that.getView().setModel(oViewModel, "CapExtensionSet");

			}.bind(this);

			ajaxutil.fnRead("/ADDOVERVIEWSvc", oPrmJobDue);
		},

		_fnReasonforADDGet: function(sAirId) {
			var that = this,
				oPrmJobDue = {};
			oPrmJobDue.filter = "airid eq " + sAirId + " and ddid eq CPR_";
			oPrmJobDue.error = function() {

			};

			oPrmJobDue.success = function(oData) {
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData(oData.results);
				that.getView().setModel(oModel, "ReasonforADDModel");
			}.bind(this);

			ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
		},

		_fnPerioOfDeferCBGet: function(sAirId) {
			var that = this,
				oModel = this.getView().getModel("oViewModel"),
				oPrmJobDue = {};
			oPrmJobDue.filter = "airid eq " + sAirId + " and ddid eq 118_";
			oPrmJobDue.error = function() {

			};

			oPrmJobDue.success = function(oData) {
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData(oData.results);
				that.getView().setModel(oModel, "PerioOfDeferCBModel");
			}.bind(this);

			ajaxutil.fnRead("/MasterDDVALSvc", oPrmJobDue);
		},
		_fnUtilizationGet: function(sAirId) {
			var that = this,
				oModel = this.getView().getModel("oViewModel"),
				oPrmJobDue = {};
			oPrmJobDue.filter = "refid eq " + sAirId + " and ddid eq UTIL1_";
			oPrmJobDue.error = function() {

			};

			oPrmJobDue.success = function(oData) {
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData(oData.results);
				that.getView().setModel(oModel, "UtilizationCBModel");
			}.bind(this);

			ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
		}

	});
});