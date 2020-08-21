sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations"
], function (BaseController, dataUtil, Fragment, FieldValidations) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.Approval_Details", {
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("Approvals").attachPatternMatched(this._onObjectMatched, this);
		},

		onSelectionChange: function (oEvt) {
			var sId = oEvt.getSource().getSelectedContexts()[0].getObject().WorkflowId;
			this.getOwnerComponent().getRouter().navTo("Secondpage",{
				WorkflowId : sId
			});
		},
		
		_onObjectMatched: function (oEvent) {
			var that = this,
				model = dataUtil.createJsonModel("model/localJobFunctionData.json");
			that.getView().setModel(model, "oViewModel");
			this.oModel.attachEventOnce("requestCompleted", function (oEvt) {
				that._fnRequestCompleted(oEvt);
			});
		},
		
		_fnRequestCompleted : function (){
			this.getView().getModel("masterModel").setProperty("/Items",this.oModel.getData().approvals);
		}

	});
});