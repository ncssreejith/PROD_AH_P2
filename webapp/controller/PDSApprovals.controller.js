sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"../model/formatter"
], function(BaseController, dataUtil, Fragment, FieldValidations, ajaxutil, formatter) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.PDSApprovals", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			var that = this,
				model = dataUtil.createJsonModel("model/approvalModel.json");
			that.getView().setModel(model, "oViewModel");
			this.getRouter().getRoute("Approvals").attachPatternMatched(this._onObjectMatched, this);

		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		//1.on selection change
		onSelectionChange: function(oEvt) {
			var oData = oEvt.getSource().getSelectedContexts()[0].getObject(),
				oModel = this.getView().getModel("ViewModel");
			this.Obj = oData;
			oModel.setProperty("/flag", oData.flag);
			if (oData.flag === 'A') {
				oModel.setProperty("/text", oData.text);
				oModel.setProperty("/Capid", oData.id);
				oModel.setProperty("/description", oData.description);
				oModel.setProperty("/flag", oData.flag);
				this._fnApprovalDetailsRequestGet(oData.id);
			} else {
				this._fnWeightBalanceGet(oData.TAILID);
				oModel.setProperty("/Capid", oData.id);
			}

			oModel.updateBindings(true);
		},
		//2.on Manage request click
		onManageRequest: function(oEvent) {
			var oButton = oEvent.getSource();
			// create popover
			if (!this._oPopover) {
				Fragment.load({
					id: "popoverNavCon",
					name: "avmet.ah.view.ah.approvals.manageRequests",
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

		_fnApprovalRequestGet: function() {
			var that = this,
				oPrmAppr = {};
			oPrmAppr.error = function() {

			};

			oPrmAppr.success = function(oData) {
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData(oData.results);
				that.getView().setModel(oModel, "ApprovalListModel");
			}.bind(this);

			ajaxutil.fnRead(this.getResourceBundle().getText("APPROVALSVC"), oPrmAppr);
		},

		//on Approve Request
		onApproveRequest: function(sValue, oEvent) {
			var that = this,
				oModel = this.getView().getModel("ViewModel");

			switch (oModel.getProperty("/flag")) {
				case "W":
					this._fnUpdateWB(sValue);
					break;
				case "A":
					this._fnUpdateADD(sValue);
					break;

			}

		},

		/* Function: onUpdateJob
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */
		_fnUpdateWB: function(sValue) {
			var that = this,
				sjobid = "",oModel = this.getView().getModel("ViewModel"),
				oModel,
				oPayload;
			var dDate = new Date();
			/*	if (sValue === "R") {
					oPayload.Cstat = "R";
				} else {
					oPayload.Cstat = "A";
				}*/

			var oParameter = {};
			oPayload = {
				"jobid": null,
				"flag": "W",
				"fndby": null,
				"prime": null,
				"credt": null,
				"cretm": null,
				"CAPID": oModel.getProperty("/Capid"),
				"capdt": null,
				"captm": null,
				"cprid": null,
				"AddRsn": null,
				"subusr": "Test User1",
				"expdt": formatter.defaultOdataDateFormat(dDate),
				"exptm": new Date().getHours() + ":" + new Date().getMinutes(),
				"fndduring": null,
				"jobdesc": null,
				"Capty": null,
				"Cstat": sValue,
				"Apprusr": "Test User1",
				"Apprdtm": formatter.defaultOdataDateFormat(dDate),
				"Appruzt": new Date().getHours() + ":" + new Date().getMinutes(),
				"ldesc":null
			};

			oParameter.error = function(response) {

			};

			oParameter.success = function(oData) {
				that.onOpenDialogApp();
			}.bind(this);

			ajaxutil.fnUpdate(this.getResourceBundle().getText("APPROVALNAVSVC"), oParameter, [oPayload]);

		},

		/* Function: onUpdateJob
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */
		_fnUpdateADD: function(sValue) {
			var that = this,
				sjobid = "",
				oModel,
				oPayload;
			var dDate = new Date();

			var oParameter = {};
			oPayload = this.getView().getModel("ApprovalDetailstModel").getData();
			oPayload.Apprdtm = formatter.defaultOdataDateFormat(dDate);
			oPayload.Appruzt = new Date().getHours() + ":" + new Date().getMinutes();
			oPayload.Apprusr = "Test User";
			if (sValue === "R") {
				oPayload.Cstat = "R";
			} else {
				oPayload.Cstat = "A";
			}

			oParameter.error = function(response) {

			};

			oParameter.success = function(oData) {
				that.onOpenDialogApp();
			}.bind(this);

			ajaxutil.fnUpdate(this.getResourceBundle().getText("APPROVALNAVSVC"), oParameter, [oPayload]);

		},

		_fnApprovalDetailsRequestGet: function(sCapId) {
			var that = this,
				oPrmAppr = {};
			oPrmAppr.filter = "CAPID eq " + sCapId;
			oPrmAppr.error = function() {

			};

			oPrmAppr.success = function(oData) {
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData(oData.results[0]);
				that.getView().setModel(oModel, "ApprovalDetailstModel");
			}.bind(this);

			ajaxutil.fnRead(this.getResourceBundle().getText("APPROVALNAVSVC"), oPrmAppr);
		},

		onOpenDialogApp: function() {
			var that = this;
			if (!this._oApprove) {
				this._oApprove = sap.ui.xmlfragment(this.createId("idWorkCenterDialog"),
					"avmet.ah.fragments.ApprovalDialog",
					this);
				this.getView().addDependent(this._oApprove);
			}
			this._oApprove.open(this);
		},

		onCloseDialogAppDialog: function(sValue) {
			var that = this;
			if (this._oApprove) {
				this._oApprove.close(this);
				this._oApprove.destroy();
				delete this._oApprove;
				if (sValue === 'B') {
					that._fnApprovalRequestGet();
				}
			}
		},

		handleLinkPress: function() {
			var that = this;
			that.getRouter().navTo("Limitations");
		},
		
		handleDashBordress: function() {
			var that = this;
			that.getRouter().navTo("DashboardInitial");
		},

		_fnWeightBalanceGet: function(sTailId) {
			var that = this,
				sModel = this.getView().getModel("ViewModel"),
				oPrmWBM = {};
			oPrmWBM.filter = "tailid eq '" + that.getTailId() + "'";
			oPrmWBM.error = function() {

			};

			oPrmWBM.success = function(oData) {
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData(oData.results);
				that.getView().setModel(oModel, "WeightBalanceSet");
				for (var i = 0; i < oData.results.length; i++) {
					if (oData.results[i].Inidicator === "I") {
						sModel.setProperty("/SGUSR", oData.results[i].SGUSR);
						sModel.setProperty("/SGDTM", oData.results[i].SGDTM);
					}
				}
				that.getView().byId("MasterId").setVisible(true);
			}.bind(this);

			ajaxutil.fnRead(this.getResourceBundle().getText("WEBALMSVC"), oPrmWBM);
		},

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			this._fnApprovalRequestGet();
			var oViewModel = dataUtil.createNewJsonModel();
			oViewModel.setData({
				Capid: "",
				description: "",
				flag: "",
				text: "",
				oFlag: "",
				SGUSR: "",
				SGDTM: ""
			});

			this.getView().setModel(oViewModel, "ViewModel");
		}

	});
});