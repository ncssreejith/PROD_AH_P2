sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil, Log) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.FlyingRequirements", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("FlyingRequirements").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}

		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		_fnFlyingRequirementsMasterGet: function() {
			try {
				var that = this,
					oPrmTD = {};
				oPrmTD.filter = "TAILID eq " + that.getTailId();
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "FRAllModel");
				}.bind(this);
				ajaxutil.fnRead("/GetflyreqSvc", oPrmTD);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		onAddFlyingRequirements: function() {
			this.getRouter().navTo("CosAddFlyingRequirements", {
				"AirId": this.getAircraftId(),
				"TailId": this.getTailId(),
				"Flag": "N"
			});
		},
		
		handlePressWorkCenterFragmentOpenMenu: function(oEvent) {
			try {
				var that = this,
					oButton, eDock, oModel, oDialogModel;
				oModel = that.getView().getModel("LocalModel");

				oDialogModel = dataUtil.createNewJsonModel();
				if (!that._oWCMenuFrag) {
					that._oWCMenuFrag = sap.ui.xmlfragment("WorkMenuId",
						"avmet.ah.fragments.WorkCenterFragmentMenu",
						that);
					that.getView().addDependent(that._oWCMenuFrag);
				}

				this.menuContext = oEvent.getSource().getBindingContext("FRAllModel");
				oEvent.getSource().getParent().setSelected(true);
				oDialogModel.setData([{
					"Text": "Edit",
					"Visible": true
				}, {
					"Text": "Delete Request",
					"Visible": true
				}]);

				that._oWCMenuFrag.setModel(oDialogModel, "DialogModel");
				eDock = sap.ui.core.Popup.Dock;
				oButton = oEvent.getSource();
				that._oWCMenuFrag.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);

			} catch (e) {
				Log.error("Exception in handlePressWorkCenterFragmentOpenMenu function");
			}
		},

		handleWorkCenterMenuItemPress: function(oEvent) {
			try {
				var that = this,
					oObj, oModel = that.getView().getModel("LocalModel"),
					oSelectedItem;
				oSelectedItem = oEvent.getParameter("item").getText();
				switch (oSelectedItem) {
					case "Edit":
						oObj = JSON.parse(JSON.stringify(this.menuContext.getObject()));
						that.onEditFlyingRequirement(oObj);
						break;
					case "Delete Request":
						oObj = JSON.parse(JSON.stringify(this.menuContext.getObject()));
						that.onFlyingRequirementDelete(oObj);

						break;
				}
				oModel.updateBindings(true);
				that.onCloseWorkCenterMenu();
			} catch (e) {
				Log.error("Exception in handleWorkCenterMenuItemPress function");
			}
		},
		
		
		/*onFlyingRequirementDelete: function(oObj) {
			try {
				var that = this,
					oPrmFR = {},
					oModel = this.getView().getModel("LocalModel");
				oPrmFR.error = function() {};
				oPrmFR.success = function(oData) {
					that._fnFlyingRequirementsMasterGet();
				}.bind(this);
				oPrmFR.activity = 4;
				ajaxutil.fnDelete("/FlyingRequirementSvc/" + oObj.JOBID + "/" + oObj.TAILID + "/" + oObj.FR_NO, oPrmFR, "dummy", this);
			} catch (e) {
				Log.error("Exception in onFlyingRequirementDelete function");
			}
		},*/
		onFlyingRequirementDelete: function(oObj) {
			try {
				var that = this,
					oPrmFR = {},
					oModel = this.getView().getModel("LocalModel");
				var sPath = "/FlyingRequirementSvc(" +
					"JOBID=" + oObj.JOBID + ",TAILID=" + oObj.TAILID + ",FR_NO=" + oObj.FR_NO + ")";
				oPrmFR.error = function() {};
				oPrmFR.success = function(oData) {
					that._fnFlyingRequirementsMasterGet();
				}.bind(this);
				oPrmFR.activity = 4;
				ajaxutil.fnDelete(sPath, oPrmFR, "dummy", this);
			} catch (e) {
				Log.error("Exception in onFlyingRequirementDelete function");
			}
		},
		
		onFlyingRequirementUpdate: function(oEvent) {
			try {
				var that = this,
					oModel,
					oPayload;
				oModel = that.getView().getModel("LocalModel");
				var oParameter = {};
				oPayload = oEvent.getSource().getModel("FLYSet").getData();
				oParameter.error = function(response) {};
				oParameter.success = function(oData) {
					that._fnFlyingRequirementsMasterGet();

					that.onFlyingRequirementClose();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnUpdate("/FlyingRequirementSvc", oParameter, [oPayload], "dummy", this);
			} catch (e) {
				Log.error("Exception in onFlyingRequirementUpdate function");
			}
		},
		
		onEditFlyingRequirement: function(oObj) {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel();
				if (!that._oEditFL) {
					that._oEditFL = sap.ui.xmlfragment(that.createId("idEditFLDialog"),
						"avmet.ah.fragments.EditFlyingRequirementDialog",
						this);
					oModel.setData(oObj);
					that._oEditFL.setModel(oModel, "FLYSet");
					that.getView().addDependent(that._oEditFL);
					that._oEditFL.open(that);
				}
			} catch (e) {
				Log.error("Exception in onEditFlyingRequirement function");
			}
		},
		
		onFlyingRequirementClose: function() {
			try {
				if (this._oEditFL) {
					this._oEditFL.close(this);
					this._oEditFL.destroy();
					delete this._oEditFL;
				}
			} catch (e) {
				Log.error("Exception in onFlyingRequirementClose function");
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var sTail = this.getTailId();
				this._fnFlyingRequirementsMasterGet(sTail);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		}

	});
});