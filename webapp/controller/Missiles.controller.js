sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController,JSONModel) {
	"use strict";
	return BaseController.extend("avmet.ah.controller.Missiles", {

	    /* =========================================================================================================================================================== */
		/* lifecycle methods                                           */
		/* =========================================================================================================== */
		onInit: function () {
		this.getRouter().getRoute("Missiles").attachPatternMatched(this._onObjectMatched, this);
		},

	    /* =========================================================================================================== */
		/* event handlers                                              */
		/* ========================================================================================================== */
		
		
		
		
		/* =========================================================================================================================================================================================================================================================== */
		/* internal methods  Section 1 : Sub functions                 */
		/* =========================================================================================================================================================================================================== */
		// Generic methods after Init
			_onObjectMatched: function (oEvent) {
			var sPath =oEvent.getParameter("arguments").Station,
			oModelData = this.getOwnerComponent().getModel("configModel").getData().BeforeFlight[sPath],
			oViewModel = new JSONModel();
			oViewModel.setData(oModelData);
			this.getView().setModel(oViewModel,"oViewModel");
			this.getView().getModel("oViewModel").updateBindings(true);
			
			}
		
		
		
	});

});