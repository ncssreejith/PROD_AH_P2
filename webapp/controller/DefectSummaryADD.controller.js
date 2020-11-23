sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (BaseController, dataUtil, Fragment, JSONModel) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.DefectSummaryADD", {

		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function () {
			var oModel = new JSONModel({
				"JobId": "1234567"
			});
			this.getView().setModel(oModel, "oDefectSummaryModel");
			var RectificationWrkCntr = [{
				"WorkCenter": "AEMF",
				"JobId": "1234567",
				"aTasks": []
			}];

			dataUtil.setDataSet("RectificationWrkCntr", RectificationWrkCntr);
			this.getRouter().getRoute("RouteDefectSummaryADD").attachPatternMatched(this._onObjectMatched, this);
		},
		onWrkCntrSelect: function (oEvent) {
			var oModel = this.getModel("oDefectSummaryModel"),
				sWrkCenter = oEvent.getSource().getTitle();
			this.getRouter().navTo("RouteCreateTask", {
				"jobId": oModel.getProperty("/JobId"),
				"WorkCenter": sWrkCenter,
				"flag": false

			});
		},
		onAEMFSelect: function () {
			this.getOwnerComponent().getRouter().navTo("RouteCreateTask", {}, true);

		},
		onAddNewRectification: function () {
			sap.m.MessageToast.show("Hi");
		},
		onManageJobsPress: function (oEvent) {
			var that = this,
				oButton = oEvent.getSource(),
				oModel = dataUtil.createJsonModel("model/manageJobs.json");
			if (!this._oPopover) {
				Fragment.load({
					id: "COSManageJobs",
					name: "avmet.ah.fragments.ManageJobs",
					controller: this
				}).then(function (oPopover) {
					this._oPopover = oPopover;
					this.getView().addDependent(this._oPopover);
					that._oPopover.setModel(oModel);
					this._oPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oPopover.openBy(oButton);
			}
		},
		onNavToProduct: function (oEvent) {
			var oCtx = oEvent.getSource().getBindingContext();
			var oNavCon = Fragment.byId("COSManageJobs", "navCon");
			var oDetailPage = Fragment.byId("COSManageJobs", "detail");
			oNavCon.to(oDetailPage);
			oDetailPage.bindElement(oCtx.getPath());
			this._oPopover.focus();
		},

		onManageJobsNavBack: function (oEvent) {
			var oNavCon = Fragment.byId("COSManageJobs", "navCon");
			oNavCon.back();
			this._oPopover.focus();
		},

		onManageListPress: function (oEvent) {
			var sText = oEvent.getSource().getText(),
				oCtx = oEvent.getSource().getBindingContext(),
				oNavCon = Fragment.byId("COSManageJobs", "navCon"),
				oModel = this._oPopover.getModel(),
				oDetailPage = Fragment.byId("COSManageJobs", "detail");;
			if (sText === "Edit Job") {
				oModel.setProperty("/DetailsPageList", oModel.getProperty("/EditJobDetails"));
				oNavCon.to(oDetailPage);
				oDetailPage.bindElement(oCtx.getPath());
				this._oPopover.focus();
			} else if (sText === "Transfer Job to ADD/Limitation") {
				this.getOwnerComponent().getRouter().navTo("RouteTransferToADD", {}, true);
			} else if (sText === "Work Centers") {
				oModel.setProperty("/DetailsPageList", oModel.getProperty("/WorkCenterDetails"));
				oNavCon.to(oDetailPage);
				oDetailPage.bindElement(oCtx.getPath());
				this._oPopover.focus();
			}
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function () {}
	});
});