sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"sap/m/MessageBox",
	"sap/base/Log"
], function(BaseController, dataUtil, Fragment, FieldValidations, MessageBox, Log) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.CosAddTMDE", {
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("CosAddTMDE").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		//1.to add new row to table
		addNewTMDE: function(oEvent) {
			try {
				var that = this,
					oView = that.getView(),
					oModel = this.getView().getModel("ViewModel"),
					oTMDEModel = this.getView().getModel("TMDEModel").getData();
				oTMDEModel.TMDE.push({
					JobId: oModel.getProperty("/JobId"),
					WorkCenter: oModel.getProperty("/WorkCenter"),
					PartNo: oView.byId("ipPartNo").getValue(),
					SerialNo: oView.byId("ipSerialNo").getValue(),
					Type: oView.byId("ipType").getValue(),
					UnitofMeasure: oView.byId("slUoM").getValue(),
					TorqueSet: "",
					TorqueRangeMin: "",
					TorqueRangeMax: "",
					Location: "",
					Delete: true
				});
				this.getView().getModel("TMDEModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in addNewTMDE function");
			}
		},
		//2.to delete the row from table
		onTMDEDelete: function(oEvent) {
			try {
				var sPath = oEvent.getSource().getBindingContext("TMDEModel").getPath().split("/")[2];
				var oModel = this.getView().getModel("TMDEModel").getProperty("/TMDE");
				oModel.splice(sPath, 1);
				this.getView().getModel("TMDEModel").refresh(true);
			} catch (e) {
				Log.error("Exception in onTMDEDelete function");
			}
		},
		onUoMSelect: function(oEvent) {
			try {
				var oValue = oEvent.getSource().getSelectedKey(),
					oModel = this.getView().getModel("ViewModel");

				if (oValue !== "") {
					oModel.setProperty("/TMDETableFlag", true);
				} else {
					oModel.setProperty("/TMDETableFlag", false);
				}
				FieldValidations.resetErrorStates(this);
			} catch (e) {
				Log.error("Exception in onUoMSelect function");
			}
		},

		onTorqueSetChange: function(oEvent) {
			try {
				var oObject = oEvent.getSource().getBindingContext("TMDEModel").getObject(),
					oView = this.getView(),
					oModel = this.getView().getModel("ViewModel");
				if (oObject.PartNo === "") {
					oObject.PartNo = oModel.getProperty("/PartNo");
					oObject.SerialNo = oModel.getProperty("/SerialNo");
					oObject.Type = oModel.getProperty("/Type");
					oObject.UnitofMeasure = oView.byId("slUoM").getValue();
				}
				if (oEvent.getParameter("value") !== 0) {
					FieldValidations.resetErrorStates(this);
				}
			} catch (e) {
				Log.error("Exception in onTorqueSetChange function");
			}
		},

		onSubmitTMDE: function(oEvent) {
			try {
				var that = this,
					oFlag = true,
					oCreateJob, oModel;
				oModel = this.getView().getModel("TMDEModel").getData();
				oCreateJob = this.getModel("CreateJobLocalModel").getData();
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				for (var i = 0; i < oModel.TMDE.length; i++) {
					oCreateJob.TMDE.push(oModel.TMDE[i]);
				}
				this.getModel("CreateJobLocalModel").updateBindings(true);
				dataUtil.setDataSet("createJobModel", oCreateJob);
				this.getRouter().navTo("CosDefectsSummary");
			} catch (e) {
				Log.error("Exception in onSubmitTMDE function");
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var that = this,
					sJobId, sWorkCenter,
					oViewModel = dataUtil.createNewJsonModel(),
					oTMDEModel = dataUtil.createNewJsonModel();
				sJobId = oEvent.getParameters().arguments.jobId;
				sWorkCenter = oEvent.getParameters().arguments.WorkCenter;
				oTMDEModel.setData({
					"TMDE": [{
						JobId: sJobId,
						WorkCenter: sWorkCenter,
						PartNo: "",
						SerialNo: "",
						Type: "",
						TorqueSet: "",
						TorqueRangeMin: "",
						TorqueRangeMax: "",
						UnitofMeasure: "",
						Location: "",
						Delete: false

					}]
				});
				that.getView().setModel(oTMDEModel, "TMDEModel");

				oViewModel.setData({
					JobId: sJobId,
					WorkCenter: sWorkCenter,
					TMDETableFlag: false,
					PartNo: "",
					SerialNo: "",
					Type: ""

				});

				that.getView().setModel(oViewModel, "ViewModel");
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		}
	});
});