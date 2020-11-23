sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
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

		onPrint: function() {
			var html = "<html><body><div  style='width:95%;'>";
			html += "<div style='padding-left:3rem; padding-top:1rem;'> WDNS Coefficients Records - Aircraft OFP </div>";
			html = "<div style='width:95%;'>" + this.generateHtml(this, html, "tblHarmonisation") + "</div>";
			html += "</div></body></html>";
			html2pdf().from(html).set({
				margin: 0,
				filename: 'WDNS Coefficients Records - Aircraft OFP.pdf',
				html2canvas: {
					scale: 1.8
				},
				pagebreak: {
					mode: 'avoid-all'
				},
				jsPDF: {
					orientation: 'landscape',
					unit: 'in',
					/*format: 'a0',*/
					compressPDF: true
				},
				mode: {
					avoidAll: 'avoid-all'
				}
			}).save();
		},

		generateHtml: function(that, html, id) {
			try {
				html += "<div style='padding:15px; page-break-before: always;'>";
				var oTarget1 = that.getView().byId(id);
				var $domTarget1 = oTarget1.$()[0];
				if ($domTarget1 !== undefined) {
					html += $domTarget1.innerHTML;
				}
				return html;
			} catch (e) {
				return null;
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
				//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				utilData.dhtabId = "TABW_116";
				
				utilData.horm = [];
				utilData.dh = []; //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				this.getView().setModel(new JSONModel(utilData), "oWDNSModel");

				var oData = {};
				oData.horm = [];
				oData.dh = [];//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				this.getView().setModel(new JSONModel(oData), "oWDNSDataModel");

				this.getModel("oWDNSModel").setProperty("/tabid", oEvent.getParameter("arguments").tabid);
				this.getModel("oWDNSModel").setProperty("/logid", oEvent.getParameter("arguments").logid);
				// this.getModel("oWDNSModel").setProperty("/pilot", oEvent.getParameter("arguments").pilot);
				this.getModel("oWDNSModel").refresh();
				//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				var sTabid = this.getModel("oWDNSModel").getProperty("/tabid");
				switch (sTabid) {
					case "TABW_115":
						this.fnLoadHarmoClm();
						this.fnLoadHarmoData();
						break;
					case "TABW_116":
						this.fnLoadDHClm();
						this.fnLoadDHData();
						break;
					default:
						this.getModel("oWDNSModel").setProperty("/tabid", "ALL");
						this.fnLoadDHClm();
						this.fnLoadDHData();
						this.fnLoadHarmoClm();
						this.fnLoadHarmoData();
				}
				//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043

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
				// this.getRouter().navTo("UpdateWDNSView");
				this.getRouter().navTo("PilotAFEWDNS");
				
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
				ajaxutil.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
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
				var sPath = this.getResourceBundle().getText("AIRCRAFTLOGSVC");
				var sLogid = this.getModel("oWDNSModel").getProperty("/logid");
				var sLogidPath = sLogid ? " and logid eq " + sLogid : "";
				if (sLogidPath) {
					sPath = sPath + "(logid=" + sLogid + ",tailid=" + this.getTailId() + ",tabid=" + this.getModel(
						"oWDNSModel").getProperty("/hartabId") + ")";
					// sPath = sPath + "/" + sLogid + "/" + this.getTailId() + "/" + this.getModel(
					// 	"oWDNSModel").getProperty("/hartabId");
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
		/** //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * Load harmonic columns
		 */
		fnLoadDHClm: function() {
			try {
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oWDNSModel").getProperty("/dhtabId") +
					" and otype eq C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oWDNSModel").setProperty("/dh", oData.results);
					this.getModel("oWDNSModel").refresh();
					this.fnCreateRow(this.getView().byId("tblDH"), "oWDNSModel", "dh", "oWDNSDataModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in WDNSCoefficients:fnLoadDHClm function");
				this.handleException(e);
			}
		},
		/** //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * Load harmonic data
		 */
		fnLoadDHData: function() {
			try {
				var oParameter = {};
				var sPath = this.getResourceBundle().getText("AIRCRAFTLOGSVC");
				var sLogid = this.getModel("oWDNSModel").getProperty("/logid");
				var sLogidPath = sLogid ? " and logid eq " + sLogid : "";
				if (sLogidPath) {
					sPath = sPath + "(logid=" + sLogid + ",tailid=" + this.getTailId() + ",tabid=" + this.getModel(
						"oWDNSModel").getProperty("/dhtabId") + ")";
				} else {
					oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oWDNSModel").getProperty(
						"/dhtabId") + " and otype eq D";
				}
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oWDNSDataModel").setProperty("/dh", oData.results);
					this.getModel("oWDNSDataModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in WDNSCoefficients:fnLoadDHData function");
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
				var that = this;
				var oCells = [];
				this.getModel(oModel).getProperty("/" + sClmPath).forEach(function(oItem) {
					var sText;
					var sTextProp = {};
					sTextProp.path = oDataModel + ">" + oItem.colid;
					switch (oItem.colid) {
							case "COL_11":
								sTextProp.path = oDataModel + ">" + "COL_11";
								sTextProp.formatter = that.formatter.defaultDateTimeFormat;
								sText = new sap.m.Text({
									text: sTextProp
								});
								break;
					default:
								sText = new sap.m.Text({
									text: "{" + oDataModel + ">" + oItem.colid + "}"
								});
								break;
						}			
					// var sText = new sap.m.Text({
					// 	text: "{" + oDataModel + ">" + oItem.colid + "}"
					// });
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