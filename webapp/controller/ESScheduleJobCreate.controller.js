sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log",
	"../model/AvMetInitialRecord"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil, Log, AvMetInitialRecord) {
	"use strict";
	/* ***************************************************************************
	 *   Control name:            
	 *   Purpose : 
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.ESScheduleJobCreate", {
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var that = this,
					oDDT2Model,
					oDDT1Model;
				oDDT1Model = dataUtil.createNewJsonModel();
				oDDT1Model.setData([{
					"key": "1",
					"text": "Serial No. (S/N)"
				}, {
					"key": "2",
					"text": "Batch No."
				}]);
				this.getView().setModel(oDDT1Model, "TT1Model");
				oDDT2Model = dataUtil.createNewJsonModel();
				oDDT2Model.setData([{
					"key": "1",
					"text": "Material No."
				}, {
					"key": "2",
					"text": "Part No."
				}]);
				that.getView().setModel(oDDT2Model, "TT2Model");
				this.getRouter().getRoute("ESScheduleJobCreate").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}

		},
		onNavBackSortie: function() {
			try {
				this.getRouter().navTo("SortieMonitoring");
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		
		onSelectionNatureofJobChange : function (oEvent){
			this.getModel("JobCreateModel").setProperty("/MODTYPE",0);
		},
		// ***************************************************************************
		//                 2.  Private Methods  
		// ***************************************************************************
		_fnJobDueGet: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + that.getAircraftId() + " and ddid eq JDU";
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobDueSet");
				}.bind(this);
				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnJobDueGet function");
				this.handleException(e);
			}
		},
		_fnWorkCenterGet: function(sAir) {
			try {
				var that = this,
					oPrmWorkCen = {};
				oPrmWorkCen.filter = "REFID eq " + sAir;
				oPrmWorkCen.error = function() {

				};

				oPrmWorkCen.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.setModel(oModel, "WorkCenterSet");
				}.bind(this);

				ajaxutil.fnRead("/GetWorkCenterSvc", oPrmWorkCen);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		/* Function: onDueSelectChange
		 * Parameter: oEvent
		 * Description: To  sheduled defect on change of due type.
		 */
		onDueSelectChange: function(oEvent) {
			try {
				var sDue = oEvent.getSource().getSelectedItem().getText();
				var oAppModel = this.getView().getModel("JobCreateModel");
				oAppModel.setProperty("/UM", sDue);
				oAppModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		ESJobCreate: function() {
			try {
				var that = this,
					oPayload,
					oPrmTD = {};
				oPayload = this.getView().getModel("JobCreateModel").getData();
               try{
				oPayload.CREDT = formatter.defaultOdataDateFormat(oPayload.CREDT);
               }catch(e){
               	oPayload.CREDT = oPayload.CREDT;
               }
				oPayload.J_FLAG = "N";
				oPayload.FLAG = "ES";
				oPayload.TAILID = this.getTailId();
				oPayload.AIRID = this.getAircraftId();
				oPayload.MODID = this.getModelId();

				switch (oPayload.CTYPE) {
					case "AIRCRAFT":
						oPayload.JOBTY = "ZP";
						break;
					case "ENGINE":
						oPayload.JOBTY = "ZQ";
						break;
					case "COMPONENT":
						oPayload.JOBTY = "ZM";
						break;
					case "MODSTI":
						if (oPayload.MODTYPE === 3) {
							oPayload.JOBTY = "ZD";
						} else {
							oPayload.JOBTY = "ZT";
						}
						break;
				}

				/*	switch (oPayload.TYPE2) {
						case "LTO":
							oPayload.JOBTY = "ZP";
							break;
						case "SI":
							oPayload.JOBTY = "ZQ";
							break;
						case "STI":
							oPayload.JOBTY = "ZQ";
							break;
						case "MOD":
							oPayload.JOBTY = "ZE";
							break;
						case "TRIAL MOD":
							oPayload.JOBTY = "ZD";
							break;
					}*/
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					this.getRouter().navTo("Cosjobs");
				}.bind(this);
				oPrmTD.activity = 1;
				ajaxutil.fnCreate("/GetSerLogSvc", oPrmTD, [oPayload], "ZRM_COS_JB", this);
			} catch (e) {
				Log.error("Exception in ESJobCreate function");
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_onObjectMatched: function(oEvent) {
			try {
				var that = this,
					oAppModel, oJobModel, oTempData,
					sAir = this.getAircraftId();

				oAppModel = dataUtil.createNewJsonModel();
				oAppModel.setData({
					sSelectedKey: "NA"

				});
				this.getView().setModel(oAppModel, "appModel");
				oJobModel = dataUtil.createNewJsonModel();
				oTempData = AvMetInitialRecord.createInitialBlankRecord("SCHJob");
				oTempData[0].CREDT = new Date();
				oTempData[0].CRETM = new Date().getHours() + ":" + new Date().getMinutes();
				oTempData[0].ENGNO = "1";
				oJobModel.setData(oTempData[0]);
				
				this.getView().setModel(oJobModel, "JobCreateModel");
				this._fnJobDueGet(sAir);
				this._fnWorkCenterGet(sAir);

			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		}

	});
});