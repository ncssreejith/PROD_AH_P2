sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, dataUtil, ajaxutil, JSONModel, formatter, Log) {
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
	 *		2.1 fnLoadHarmoClm
	 *		2.2 fnLoadHarmoData
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *		3.2 fnCreateRow
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.WDNSCoefficients", {
		formatter: formatter,
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************		
		/** 
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function() {
			try {
				this.getRouter().getRoute("WDNSCoefficients").attachPatternMatched(this._onObjectMatched, this);

			} catch (e) {
				Log.error("Exception in WDNSCoefficients:onInit function");
				this.handleException(e);
			}
		},
		/** 
		 * on page load
		 * @constructor 
		 */
		_onObjectMatched: function(oEvent) {
			try {
				var utilData = {};
				utilData.selIndex = 0;
				utilData.hartabId = "TABW_115";
				utilData.horm = [];
				this.getView().setModel(new JSONModel(utilData), "oWDNSModel");

				var oData = {};
				oData.horm = [];
				this.getView().setModel(new JSONModel(oData), "oWDNSDataModel");

				this.getModel("oWDNSModel").setProperty("/tabid", oEvent.getParameter("arguments").tabid);
				this.getModel("oWDNSModel").setProperty("/logid", oEvent.getParameter("arguments").logid);
				this.getModel("oWDNSModel").refresh();

				this.fnLoadHarmoClm();
				this.fnLoadHarmoData();
			} catch (e) {
				Log.error("Exception in WDNSCoefficients:_onObjectMatched function");
				this.handleException(e);
			}
		},
		/** 
		 * View past records
		 */
		onViewPastRecord: function() {
			try {
				this.getRouter().navTo("PastRecordView");
			} catch (e) {
				Log.error("Exception in WDNSCoefficients:onViewPastRecord function");
				this.handleException(e);
			}
		},
		/** 
		 * Update records
		 */
		onUpdateRecord: function() {
			try {
				this.getRouter().navTo("UpdateWDNSView");
			} catch (e) {
				Log.error("Exception in WDNSCoefficients:onUpdateRecord function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************			
		/** 
		 * Load harmonic columns
		 */
		fnLoadHarmoClm: function() {
			try {
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oWDNSModel").getProperty("/hartabId") +
					" and otype eq C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oWDNSModel").setProperty("/horm", oData.results);
					this.getModel("oWDNSModel").refresh();
					this.fnCreateRow(this.getView().byId("tblHarmonisation"), "oWDNSModel", "horm", "oWDNSDataModel");
				}.bind(this);
				ajaxutil.fnRead("/AircraftLogSvc", oParameter);
			} catch (e) {
				Log.error("Exception in WDNSCoefficients:fnLoadHarmoClm function");
				this.handleException(e);
			}
		},
		/** 
		 * Load harmonic data
		 */
		fnLoadHarmoData: function() {
			try {
				var oParameter = {};
				var sPath = "/AircraftLogSvc";
				var sLogid = this.getModel("oWDNSModel").getProperty("/logid");
				var sLogidPath = sLogid ? " and logid eq " + sLogid : "";
				if (sLogidPath) {
					sPath = sPath + "/" + sLogid + "/" + this.getTailId() + "/" + this.getModel(
						"oWDNSModel").getProperty("/hartabId");
				} else {
					oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oWDNSModel").getProperty(
						"/hartabId") + " and otype eq D";
				}
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oWDNSDataModel").setProperty("/horm", oData.results);
					this.getModel("oWDNSDataModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in WDNSCoefficients:fnLoadHarmoData function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//     2. Private Functions
		// ***************************************************************************s
		/** 
		 * Create table columns for table
		 * @param tblRef
		 * @param oModel
		 * @param sClmPath
		 * @param oDataModel
		 */
		fnCreateRow: function(tblRef, oModel, sClmPath, oDataModel) {
			try {
				var oCells = [];
				this.getModel(oModel).getProperty("/" + sClmPath).forEach(function(oItem) {
					var sText = new sap.m.Text({
						text: "{" + oDataModel + ">" + oItem.colid + "}"
					});
					oCells.push(sText);
				});
				if (oCells.length === 0) {
					tblRef.setVisible(false);
				}
				var sColum = new sap.m.ColumnListItem({
					cells: oCells
				});
				tblRef.bindAggregation("items", oDataModel + ">/" + sClmPath, sColum);
			} catch (e) {
				Log.error("Exception in WDNSCoefficients:fnCreateRow function");
				this.handleException(e);
			}
		}
	});
});