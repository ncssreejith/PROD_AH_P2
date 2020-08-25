sap.ui.define([
	"./BaseController",
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, ajaxutil, JSONModel, formatter, Log) {
	"use strict";
	/* ***************************************************************************
	 *   Control name: WDNSCoefficients           
	 *   Purpose : Display WDNS controller
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *		1.2 onViewPastRecord
	 *		1.3 onUpdateRecord	 
	 *	 2. Backend Calls
	 *		2.1 fnLoadOFPClm
	 *		2.2 fnLoadOFPData
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *		3.2 fnCreateRow
	 *		3.3 fnSubmitSignOff
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.OFPUpdateView", {
		formatter: formatter,
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************			
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ZWDNS.view.OFPUpdateView
		 */
		onInit: function() {
			try {
				this.getRouter().getRoute("OFPUpdateView").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in OFPUpdateView:onInit function");
				this.handleException(e);
			}
		},
		/** 
		 * on page load
		 * @constructor 
		 */
		_onObjectMatched: function() {
			try {
				var utilData = {};
				utilData.selIndex = 0;
				utilData.isChange = false;
				utilData.ofptabId = "TABW_114";
				utilData.ofp = [];
				this.getView().setModel(new JSONModel(utilData), "oOFPModel");

				var oData = {};
				oData.ofp = [];
				this.getView().setModel(new JSONModel(oData), "oOFPDataModel");
				this.fnLoadOFPClm();
				this.fnLoadOFPData();
			} catch (e) {
				Log.error("Exception in OFPUpdateView:_onObjectMatched function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		/** 
		 * Load OFP column
		 */
		fnLoadOFPClm: function() {
			try {
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oOFPModel").getProperty("/ofptabId") +
					" and otype eq C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.deleteColumn(oData);
					this.getModel("oOFPModel").setProperty("/ofp", oData.results);
					this.getModel("oOFPModel").refresh();
					this.fnCreateRow(this.getView().byId("tblUpOFP"), "oOFPModel", "ofp", "oOFPDataModel");
				}.bind(this);
				ajaxutil.fnRead("/AircraftLogSvc", oParameter);
			} catch (e) {
				Log.error("Exception in OFPUpdateView:fnLoadOFPClm function");
				this.handleException(e);
			}
		},

		fnLoadOFPData: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oOFPModel").getProperty(
					"/ofptabId") + " and otype eq D";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oOFPDataModel").setProperty("/ofp", oData.results);
					this.getModel("oOFPDataModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/AircraftLogSvc", oParameter);
			} catch (e) {
				Log.error("Exception in OFPUpdateView:fnLoadOFPData function");
				this.handleException(e);
			}
		},
		deleteColumn: function(oData) {
			try {
				if (!oData || !oData.results || oData.results.length < 3) {
					return "";
				}
				oData.results.splice(oData.results.length - 2, 2);
			} catch (e) {
				Log.error("Exception in OFPUpdateView:deleteColumn function");
				this.handleException(e);
			}
		},
		fnCreateRow: function(tblRef, oModel, sClmPath, oDataModel) {
			try {
				var oCells = [];
				var that = this;
				this.getModel(oModel).getProperty("/" + sClmPath).forEach(function(oItem) {
					var sText = new sap.m.Text({
						text: "{" + oDataModel + ">" + oItem.colid + "}"
					});
					if (oItem.edtb === "X") {
						sText = new sap.m.Input({
							value: "{" + oDataModel + ">" + oItem.colid + "}",
							valueState: "{= !!${" + oDataModel + ">" + oItem.colid + "} ? 'None' : 'Error' }",
							liveChange: that.onChange
						});
					}
					oCells.push(sText);
				});
				if (oCells.length === 0) {
					tblRef.setVisible(false);
				}
				var sColum = new sap.m.ColumnListItem({
					cells: oCells
				});
				if (tblRef) {
					tblRef.bindAggregation("items", oDataModel + ">/" + sClmPath, sColum);
				}
			} catch (e) {
				Log.error("Exception in OFPUpdateView:fnCreateRow function");
				this.handleException(e);
			}
		},
		onChange: function(oEvent) {
			try {
				var oSource = oEvent.getSource();
				this.getModel("oOFPModel").setProperty("/isChange",true);
				this.getModel("oOFPModel").refresh();
			} catch (e) {
				Log.error("Exception in OFPUpdateView:onChange function");
				this.handleException(e);
			}
		},
		onSignOffPress: function() {
			try {
				this.fnSubmitSignOff(this.getView().byId("tblUpOFP"), "oOFPModel", "ofp", "oOFPDataModel");
			} catch (e) {
				Log.error("Exception in OFPUpdateView:onSignOffPress function");
				this.handleException(e);
			}
		},
		/** 
		 * Update to AircraftLogSvc
		 * @param tblRef
		 * @param oModel
		 * @param sClmPath
		 * @param oDataModel
		 */
		fnSubmitSignOff: function(tblRef, oModel, sClmPath, oDataModel) {
			try {
				var sPath = "/AircraftLogSvc";
				var oData = [];
				var oParameter = {};
				oParameter.activity = 2;
				// this.getModel(oDataModel).getProperty("/"+sClmPath).forEach(function(oItem) {
				// 	var oPayload = {};
				// 	oPayload = oItem;
				// 	oData.push(oPayload);
				// });

				oData = this.getModel(oDataModel).getProperty("/" + sClmPath);
				oParameter.error = function() {};
				oParameter.success = function(oRespond) {
					this.onNavBack();
					sap.m.MessageToast.show("Tables updated");
				}.bind(this);
				ajaxutil.fnCreate(sPath, oParameter, oData, "ZRM_WDNS_O", this);
			} catch (e) {
				Log.error("Exception in OFPUpdateView:fnSubmitSignOff function");
				this.handleException(e);
			}
		}
	});

});