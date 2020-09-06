sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, dataUtil, JSONModel, ajaxutil, formatter, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.ReplenishmentDetails", {
		formatter: formatter,

		// ***************************************************************************
		//Developer : Priya
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("ReplenishmentDetails").attachPatternMatched(this._onObjectMatched, this);
				var oModel = new JSONModel({
					"ScrollContainerHeight": "65%",
					"aSelectItems": [{
						"Key": "REM_F",
						"Text": "Fuel"
					}, {
						"Key": "REM_O",
						"Text": "Oil & Misc"
					}],
					"srvtid": "",
					"stepid": "",
					"total": "0",
					"ttlamt": "0",
					"srvamt": "0",
					"orgamt": "0",
					"isValid": true,
					"selTab": "REM_F",
					"fuel": [],
					"tire": [],
					"oil": [],
					"srv": []
				});
				this.getView().setModel(oModel, "oRepDetailsModel");
				this.getView().setModel(new JSONModel({
					busy: false,
					delay: 0
				}), "viewModel");
				var oScroll = this.getView().byId("scrollContainerId");
				oScroll.attachBrowserEvent("scroll", function(oEvent) {
					this.onScroll(oEvent);
				}.bind(this));
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},
		onScroll: function(oEvent) {
			try {
				var oScroll = this.getView().byId("scrollContainerId"),
					oViewModel = this.getModel("oRepDetailsModel"),
					yValue = oScroll._oScroller._scrollY;
				if (yValue < 100) {
					oViewModel.setProperty("/selTab", "REM_F");
				} else if (yValue >= 100 && yValue < 200) {
					oViewModel.setProperty("/selTab", "REM_T");
				} else if (yValue >= 200) {
					oViewModel.setProperty("/selTab", "REM_O");
				}
			} catch (e) {
				Log.error("Exception in onScroll function");
				this.handleException(e);
			}
		},

		onOilChange: function(oEvent) {
			var sChange = "X";
			var sPath = oEvent.getSource().getBindingContext("oRepDetailsModel").getPath();
			var sOldValue = this.getModel("oRepDetailsModel").getProperty(sPath + "/sgusr");
			var sValue = oEvent.getSource().getValue();
			if (sValue === parseInt(sOldValue)) {
				sChange = "";
				this.getModel("oRepDetailsModel").setProperty(sPath + "/sgusr", sValue);
			}
			this.getModel("oRepDetailsModel").setProperty(sPath + "/updflg", sChange);
			this.getModel("oRepDetailsModel").refresh();

		},

		onFuleChange: function(oEvent) {
			try {
				// this._fnValidateFuel(oEvent.getSource().getParent());
				this._fnUpdateTotlaAmount(oEvent.getSource().getParent().getParent());
			} catch (e) {
				Log.error("Exception in onFuleChange function");
				this.handleException(e);
			}
		},
		onLiveChange: function(oEvent) {
			this.cvutil.onLiveChange(oEvent);
		},
		onFuelTableUpdateFinish: function(oEvent) {
			try {
				this._fnUpdateTotlaAmount(oEvent.getSource());
			} catch (e) {
				Log.error("Exception in onFuelTableUpdateFinish function");
				this.handleException(e);
			}
		},

		_fnValidateFuel: function(oItems) {
			var oContext = oItems.getBindingContext("oRepDetailsModel");
			var sTtlAmt = this.formatter.integerUnit(oContext.getObject().orgamt) + this.formatter.integerUnit(oContext.getObject().srvamt);
			this.getModel("oRepDetailsModel").setProperty(oContext.getPath() + "/totamt", sTtlAmt);
			this.getModel("oRepDetailsModel").refresh();

			var sMsg1 = "";
			if (sTtlAmt > this.formatter.integerUnit(oContext.getObject().max)) {
				sMsg1 = "Orignal amount + Serviced amount can not exceed total amount";
			}
			oItems.getCells()[1].setValueState(sMsg1 === "" ? "None" : "Error");
			oItems.getCells()[2].setValueState(sMsg1 === "" ? "None" : "Error");
			oItems.getCells()[1].setValueStateText(sMsg1);
			oItems.getCells()[2].setValueStateText(sMsg1);
			oItems.getCells()[2].setTooltip(sMsg1);
			oItems.getCells()[2].setTooltip(sMsg1);
			this.getModel("oRepDetailsModel").refresh();

		},
		_fnUpdateTotlaAmount: function(oTable) {
			var total = 0,
				ttlamt = 0,
				srvamt = 0,
				orgamt = 0;
			oTable.getItems().forEach(function(sItems) {
				var sorgMnt = this.formatter.integerUnit(sItems.getBindingContext("oRepDetailsModel").getProperty("orgamt"));
				var ssrvamt = this.formatter.integerUnit(sItems.getBindingContext("oRepDetailsModel").getProperty("srvamt"));
				this.getModel("oRepDetailsModel").setProperty(sItems.getBindingContextPath() + "/totamt", (sorgMnt + ssrvamt));
				this.getModel("oRepDetailsModel").refresh();
				orgamt = orgamt + sorgMnt;
				srvamt = srvamt + ssrvamt;
				ttlamt = ttlamt + this.formatter.integerUnit(sItems.getBindingContext("oRepDetailsModel").getProperty("totamt"));
				total = total + this.formatter.integerUnit(sItems.getBindingContext("oRepDetailsModel").getProperty("max"));
				this._fnValidateFuel(sItems);
			}.bind(this));
			this.getModel("oRepDetailsModel").setProperty("/total", total);
			this.getModel("oRepDetailsModel").setProperty("/ttlamt", ttlamt);
			this.getModel("oRepDetailsModel").setProperty("/srvamt", srvamt);
			this.getModel("oRepDetailsModel").setProperty("/orgamt", orgamt);
			this.getModel("oRepDetailsModel").refresh();
		},

		onListSelect: function(oEvent, sKey) {
			try {
				var sSelectedKey,
					oScroll = this.getView().byId("scrollContainerId");
				if (oEvent !== undefined) {
					sSelectedKey = oEvent.getSource().getSelectedKey();
				} else {
					sSelectedKey = sKey;
				}
				if (sSelectedKey === "REM_F") {
					oScroll.scrollToElement(oScroll.getContent()[0], 300);
				} else {
					oScroll.scrollToElement(oScroll.getContent()[1], 500);
				}
			} catch (e) {
				Log.error("Exception in onListSelect function");
				this.handleException(e);
			}
		},

		onPressSignOffConfirm: function(oEvent) {
			try {
				// this.cvutil.validateForm(this.getView());
				if (!this.getModel("oRepDetailsModel").getProperty("/isValid")) {
					sap.m.MessageToast.show("Serviced amount exceeds total amount.");
				}
				var aPayloads = this.getModel("oRepDetailsModel").getProperty("/srv");
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.onNavBack();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/ReplshmentSvc", oParameter, aPayloads, "ZRM_FS_RP", this);

			} catch (e) {
				Log.error("Exception in onPressSignOffConfirm function");
				this.handleException(e);
			}
		},

		onRepleTyrePress: function() {
			try {
				this.openDialog("TyrePressure", ".fragments.flc.");
				this._fnAirOverViewHeaderGet();
			} catch (e) {
				Log.error("Exception in onRepleTyrePress function");
				this.handleException(e);
			}
		},

		onRepleTyreClose: function(oEvent) {
			try {
				this.closeDialog("TyrePressure");
			} catch (e) {
				Log.error("Exception in onRepleTyreClose function");
				this.handleException(e);
			}
		},

		_fnAirOverViewHeaderGet: function() {
			try {
				var oPrmWB = {};
				oPrmWB.filter = "FLAG eq I AND LPTYPE eq LPTYREPRES and REFID eq " + this.getAircraftId();
				oPrmWB.error = function() {};
				oPrmWB.success = function(oData) {
					this.getModel("oRepDetailsModel").setProperty("/TyrePressure", oData.results);
					this.getModel("oRepDetailsModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/LeadPartiSvc", oPrmWB);
			} catch (e) {
				Log.error("Exception in _fnAirOverViewHeaderGet function");
				this.handleException(e);
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
		_onObjectMatched: function(oEvent) {
			try {
				this.updateModel({
					busy: true
				}, "viewModel");
				this.getModel("oRepDetailsModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("oRepDetailsModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this.getModel("oRepDetailsModel").setProperty("/selTab", oEvent.getParameter("arguments").Replenish);
				this.getModel("oRepDetailsModel").setProperty("/srv", []);
				// this.getModel("oRepDetailsModel").setProperty("/fuel", []);
				// this.getModel("oRepDetailsModel").setProperty("/tire", []);
				// this.getModel("oRepDetailsModel").setProperty("/oil", []);
				this.getModel("oRepDetailsModel").refresh();
				this.onListSelect(undefined, this.getModel("oRepDetailsModel").getProperty("/selTab"));
				this._getRepTiles();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},

		_getRepTiles: function() {
			try {
				var oParameter = {};
				oParameter.filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("oRepDetailsModel").getProperty(
						"/srvtid") + " and TAILID eq " + this.getTailId() +
					" and STEPID eq " + this.getModel("oRepDetailsModel").getProperty("/stepid");
				oParameter.error = function(hrex) {
					this.updateModel({
						busy: false
					}, "viewModel");
					this.fnShowMessage("E", {}, hrex, function(oEvent) {});
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("oRepDetailsModel").setProperty("/srv", oData.results);
					this.getModel("oRepDetailsModel").refresh();
					this._getFuelExtTanks();
				}.bind(this);
				ajaxutil.fnRead("/ReplshmentSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getRepTiles function");
				this.handleException(e);
			}
		},
		_getFuelExtTanks: function() {
			try {
				var oParameter = {};
				oParameter.filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("oRepDetailsModel").getProperty(
						"/srvtid") + " and TAILID eq " + this.getTailId() +
					" and STEPID eq " + this.getModel("oRepDetailsModel").getProperty("/stepid");
				oParameter.error = function(hrex) {
					this.updateModel({
						busy: false
					}, "viewModel");
					this.fnShowMessage("E", {}, hrex, function(oEvent) {});
				}.bind(this);
				oParameter.success = function(oData) {
					var oTotalRecord = this.getModel("oRepDetailsModel").getProperty("/srv").concat(oData.results);
					this.getModel("oRepDetailsModel").setProperty("/srv", oTotalRecord);
					this.getModel("oRepDetailsModel").refresh();
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				ajaxutil.fnRead("/ReplRoleSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getFuelExtTanks function");
				this.handleException(e);
			}
		}

	});

});