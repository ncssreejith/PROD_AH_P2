sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../util/dataUtil",
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
				this.getRouter().getRoute("WeaponExpenditure").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(new JSONModel({
					srvtid: "",
					stepid: "",
					stations: ""
				}), "oWeaponExpModel");
				this.setModel(new JSONModel({
					busy: true,
					delay: 0
				}), "viewMdodel");
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		onListSelect: function(oEvent) {
			try {
				var oSelectedKey = oEvent.getSource().getSelectedKey(),
					oScroll = this.getView().byId("scrollContainerId");
				if (oSelectedKey === "STNM_S") {
					oScroll.scrollToElement(oScroll.getContent()[0], 500);
				} else {
					oScroll.scrollToElement(oScroll.getContent()[1], 500);
				}
			} catch (e) {
				Log.error("Exception in onListSelect function");
				this.handleException(e);
			}
		},

		onQtyChange: function(oEvent) {
			try {
				this.cvutil.onLiveChange(oEvent);
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
					this.cvutil.onLiveChange(oEvent);
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
				if(this.cvutil.validateForm(this.getView())){
					return;
				}
				this.openDialog("AircraftSignOff", ".fragments.fs.weaponexpend.");
			} catch (e) {
				Log.error("Exception in onSignOffPress function");
				this.handleException(e);
			}
		},

		onACSignOffCancel: function() {
			try {
				this.closeDialog("AircraftSignOff");
			} catch (e) {
				Log.error("Exception in onACSignOffCancel function");
				this.handleException(e);
			}
		},

		onACSignOffConfirm: function() {
			try {
				this.closeDialog("AircraftSignOff");
				var oPayloads = this.getModel("oWeaponExpModel").getProperty("/stations");
				if (oPayloads.length === 0) {
					this.fnDeclaredSafeSignOff();
					return;
				}

				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {
					this.onNavBack();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate(this.getResourceBundle().getText("WEAPEXPSVC"), oParameter, oPayloads, "ZRM_PFR_WE", this);
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
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "TAILID eq " + this.getTailId() + " and srvtid eq " + this.getModel("oWeaponExpModel").getProperty("/srvtid") +
					" and stepid eq " + this.getModel("oWeaponExpModel").getProperty("/stepid");
				oParameter.success = function(oData) {
					this.getModel("oWeaponExpModel").setProperty("/stations", oData.results);
					this.getModel("oWeaponExpModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("WEAPEXPSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getWeaponExp function");
				this.handleException(e);
			}
		},
		fnDeclaredSafeSignOff: function() {
			try {
				var that = this;

				var oParameter = {},
					oPayloadWeapExp = [{
						tailid: that.getTailId(),
						refid: that.getAircraftId(),
						stepid: "S_WE",
						srvtid: this.getModel("oWeaponExpModel").getProperty("/srvtid")
					}];
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.onNavBack();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate(this.getResourceBundle().getText("DECLARESAFESVC"), oParameter, oPayloadWeapExp, "ZRM_PFR_WE", this);
			} catch (e) {
				Log.error("Exception in createEmptyPayload function");
				this.handleException(e);
			}
		}
	});

});