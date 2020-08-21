sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"sap/base/Log"
], function(BaseController, MessageToast, dataUtil, JSONModel, formatter, FieldValidations, ajaxutil, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.WeaponExpenditure", {
		formatter: formatter,
		// ***************************************************************************
		//Developer : Priya
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var oModel = new JSONModel({});
				this.getView().setModel(oModel, "oWeaponExpModel");
				this.getRouter().getRoute("WeaponExpenditure").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		onListSelect: function(oEvent) {
			try {
				var oSelectedKey = oEvent.getSource().getSelectedKey(),
					oScroll = this.getView().byId("scrollContainerId");
				if (oSelectedKey === "Non-Stations") {
					oScroll.scrollToElement(oScroll.getContent()[0], 500);
				} else {
					oScroll.scrollToElement(oScroll.getContent()[1], 500);
				}
			} catch (e) {
				Log.error("Exception in onListSelect function");
				this.handleException(e);
			}
		},

		_signOffWeapExp: function() {
			try {
				if (!this._oSignoff) {
					this._oSignoff = sap.ui.xmlfragment("avmet.ah.fragments.pilot.AircraftSignOff", this);
					this.getView().addDependent(this._oSignoff);
				}
				this._oSignoff.open();
			} catch (e) {
				Log.error("Exception in _signOffWeapExp function");
				this.handleException(e);
			}
		},

		onQtyChange: function(oEvent) {
			try {
				var oWeaponExpModel = this.getView().getModel("oWeaponExpModel"),
					iQtyRem = oEvent.getSource().getValue(),
					sPath = oEvent.getSource().getBindingContext("oWeaponExpModel").sPath,
					oObj = oEvent.getSource().getBindingContext("oWeaponExpModel").getObject();
				var iExpQty = parseInt(oObj.totqty) - iQtyRem;
				oWeaponExpModel.setProperty(sPath + "/expqty", iExpQty);
			} catch (e) {
				Log.error("Exception in onQtyChange function");
				this.handleException(e);
			}
		},

		onQtyStnChange: function(oEvent) {
			try {
				var oWeaponExpModel = this.getView().getModel("oWeaponExpModel"),
					iQtyRem = oEvent.getSource().getValue(),
					sPath = oEvent.getSource().getBindingContext("oWeaponExpModel").sPath,
					oObj = oEvent.getSource().getBindingContext("oWeaponExpModel").getObject();
				var iExpQty = parseInt(oObj.totqty) - iQtyRem;
				oWeaponExpModel.setProperty(sPath + "/expqty", iExpQty);
			} catch (e) {
				Log.error("Exception in onQtyStnChange function");
				this.handleException(e);
			}
		},

		onSignOffPress: function() {
			try {
				this._signOffWeapExp();
			} catch (e) {
				Log.error("Exception in onSignOffPress function");
				this.handleException(e);
			}
		},

		onACSignOffCancel: function() {
			try {
				this._oSignoff.close();
				this._oSignoff.destroy();
				delete this._oSignoff;
			} catch (e) {
				Log.error("Exception in onACSignOffCancel function");
				this.handleException(e);
			}
		},

		onACSignOffConfirm: function() {
			try {
				this._oSignoff.close();
				this._oSignoff.destroy();
				delete this._oSignoff;
				var oWeaponExpModel = this.getView().getModel("oWeaponExpModel"),
					srvtid = oWeaponExpModel.getProperty("/srvtid"),
					stepid = oWeaponExpModel.getProperty("/stepid"),
					aNonStations = oWeaponExpModel.getProperty("/NonStations"),
					aStations = oWeaponExpModel.getProperty("/Stations"),
					oParameter = {},
					oPayloadWeapExp = [];
				if (aNonStations.length) {
					for (var i in aNonStations) {
						oPayloadWeapExp.push(aNonStations[i]);
					}
				}
				if (aStations.length) {
					for (var j in aStations) {
						oPayloadWeapExp.push(aStations[j]);
					}
				}
				for (var i in oPayloadWeapExp) {
					oPayloadWeapExp[i].tailid = this.getTailId();
					oPayloadWeapExp[i].srvtid = srvtid;
					oPayloadWeapExp[i].stepid = stepid;
					if (oPayloadWeapExp[i].totqty === "0") {
						//oPayloadWeapExp[i].QtyRemained = 0;
						oPayloadWeapExp[i].expqty = 0;
					}
				}
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getOwnerComponent().getRouter().navTo("DashboardInitial");
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/WeapexpSvc", oParameter, oPayloadWeapExp, "ZRM_PFR_WE", this);
				/*if (!this._oSignoff) {
					this._oSignoff = sap.ui.xmlfragment("avmet.ah.fragments.pilot.AircraftSignOff", this);
					this.getView().addDependent(this._oSignoff);
				}
				this._oSignoff.open();*/
			} catch (e) {
				Log.error("Exception in onACSignOffConfirm function");
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
				this.getModel("oWeaponExpModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("oWeaponExpModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this._getWeaponExp();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},

		_getWeaponExp: function() {
			try {
				var that = this,
					oWeaponExpModel = this.getView().getModel("oWeaponExpModel"),
					aNonStations = [],
					aStations = [],
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "TAILID eq " + this.getTailId(); //"REFID eq AIR_11 and SRVID eq  and TAILID eq TAIL_1015";
				//oParameter.filter = "TAILID eq TAIL_1000 AND SRVID eq SRV_2020060703101101";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].stndt === "STNM_O") {
								aNonStations.push(oData.results[i]);
							} else if (oData.results[i].stndt === "STNM_S") {
								aStations.push(oData.results[i]);
							}
						}
						oWeaponExpModel.setProperty("/NonStations", aNonStations);
						oWeaponExpModel.setProperty("/Stations", aStations);
					}
				}.bind(this);
				ajaxutil.fnRead("/WeapexpSvc", oParameter);

			} catch (e) {
				Log.error("Exception in _getWeaponExp function");
				this.handleException(e);
			}
		}
	});

});