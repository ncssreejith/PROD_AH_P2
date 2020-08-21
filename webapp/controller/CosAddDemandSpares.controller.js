sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
		"sap/base/Log"
], function (BaseController, dataUtil, Fragment, FieldValidations,Log) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAJAT GUPTA 
	 *   Control name: CosAddDemandSpares        
	 *   Purpose : Add Demand spares functionality
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
	return BaseController.extend("avmet.ah.controller.CosAddDemandSpares", {
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("CosAddDemandSpares").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in CosAddDemandSpares:onInit function");
				this.handleException(e);
			}

		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		//1.to add new row to table
		addNewSpares: function(oEvent) {
			try {
				var that = this,
					oModel = this.getView().getModel("NewSpareModel").getProperty("/Spare"),
					oView = that.getView();
				oModel.push({
					"JobId": oView.byId("oiSpareId").getText(),
					"WorkCenterParent": oView.byId("cbSpareId").getSelectedText(),
					"WorkCenter": this.sWorkCenter,
					"Priority": oView.byId("sbSpareId").getSelectedKey(),
					"SparePartNo": "",
					"SparePartDescrption": "",
					"SpareQty": "",
					"SLoc": oView.byId("ipSLocId").getValue(),
					"UnloadingPoint": oView.byId("ipUnloadPoId").getValue(),
					"DeleteFlag": true
				});
				this.getView().getModel("NewSpareModel").setProperty("/SpareTableModel", oModel);
				this.getView().getModel("NewSpareModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosAddDemandSpares:addNewSpares function");
				this.handleException(e);
			}
		},
		//2.to delete the row from table
		onSpareTableDelete: function(oEvent) {
			try {
				var sPath = oEvent.getSource().getBindingContext("NewSpareModel").getPath().split("/")[2];
				var oModel = this.getView().getModel("NewSpareModel").getProperty("/SpareTableModel");
				oModel.splice(sPath, 1);
				this.getView().getModel("NewSpareModel").refresh(true);
			} catch (e) {
				Log.error("Exception in CosAddDemandSpares:onSpareTableDelete function");
				this.handleException(e);
			}
		},
		//3.set storage location value based on work center
		onsubmitSpares: function(oEvent) {
			try {
				var that = this,
					oView = that.getView(),
					oCreateJob, oModel;
				oModel = this.getView().getModel("NewSpareModel").getData();
				oCreateJob = this.getModel("CreateJobLocalModel").getData();
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				for (var i = 0; i < oModel.Spare.length; i++) {
					oModel.Spare[i].JobId = oView.byId("oiSpareId").getText();
					oModel.Spare[i].WorkCenter = this.sWorkCenter;
					oModel.Spare[i].WorkCenterParent = oView.byId("cbSpareId").getSelectedText();
					oModel.Spare[i].Priority = oView.byId("sbSpareId").getSelectedKey();
					oModel.Spare[i].SLoc = oView.byId("ipSLocId").getValue();
					oModel.Spare[i].UnloadingPoint = oView.byId("ipUnloadPoId").getValue();
					oCreateJob.Spares.push(oModel.Spare[i]);
				}
				this.getView().getModel("NewSpareModel").updateBindings(true);
				this.getModel("CreateJobLocalModel").updateBindings(true);
				dataUtil.setDataSet("createJobModel", oCreateJob);
				this.getRouter().navTo("CosDefectsSummary");
			} catch (e) {
				Log.error("Exception in CosAddDemandSpares:onsubmitSpares function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var that = this,
					sWorkCenter,
					sJobId,
					oView = that.getView(),
					oNewSpareModel = dataUtil.createNewJsonModel();
				sJobId = oEvent.getParameters().arguments.jobId;
				this.sWorkCenter = oEvent.getParameters().arguments.WorkCenter;
				this.getView().byId("oiSpareId").setText(sJobId);

				oNewSpareModel.setData({
					"Spare": [{
						"JobId": sJobId,
						"WorkCenter": this.sWorkCenter,
						"WorkCenterParent": oView.byId("cbSpareId").getSelectedText(),
						"Priority": oView.byId("sbSpareId").getSelectedKey(),
						"SparePartNo": "",
						"SparePartDescrption": "",
						"SpareQty": "",
						"SLoc": oView.byId("ipSLocId").getValue(),
						"UnloadingPoint": oView.byId("ipUnloadPoId").getValue(),
						"DeleteFlag": false
					}]
				});
				that.getView().setModel(oNewSpareModel, "NewSpareModel");
			} catch (e) {
				Log.error("Exception in CosAddDemandSpares:_onObjectMatched function");
				this.handleException(e);
			}
		}
	});
});