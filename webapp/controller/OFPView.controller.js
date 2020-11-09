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
	return BaseController.extend("avmet.ah.controller.OFPView", {
		formatter: formatter,
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ZWDNS_F16.view.OFPView
		 */
		onInit: function() {
			try {
				this.getRouter().getRoute("OFPView").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in OFPView:onInit function");
				this.handleException(e);
			}
		},
		/** 
		 * 
		 */
		onUpdateRecords: function() {
			try {
				var that = this;
				var router = sap.ui.core.UIComponent.getRouterFor(that);
				router.navTo("OFPUpdateView");
			} catch (e) {
				Log.error("Exception in OFPView:onUpdateRecords function");
				this.handleException(e);
			}
		},
		/** 
		 * 
		 */
		onPastRecords: function() {
			try {
				var that = this;
				var router = sap.ui.core.UIComponent.getRouterFor(that);
				router.navTo("PastRecordView");
			} catch (e) {
				Log.error("Exception in OFPView:onPastRecords function");
				this.handleException(e);
			}
		},

		onPrint: function() {
			var html = "<html><body><div  style='width:95%;'>";
			html += "<div style='padding-left:3rem; padding-top:1rem;'> Aircraft OFP </div>";
			html = "<div style='width:95%;'>" + this.generateHtml(this, html, "tblOFP") + "</div>";
			html += "</div></body></html>";
			html2pdf().from(html).set({
				margin: 0,
				filename: 'Aircraft OFP.pdf',
				html2canvas: {
					scale: 2
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
				utilData.ofptabId = "TABW_114";
				utilData.ofp = [];
				this.getView().setModel(new JSONModel(utilData), "oOFPModel");

				var oData = {};
				oData.ofp = [];
				this.getView().setModel(new JSONModel(oData), "oOFPDataModel");

				this.getModel("oOFPModel").setProperty("/tabid", oEvent.getParameter("arguments").tabid);
				this.getModel("oOFPModel").setProperty("/logid", oEvent.getParameter("arguments").logid);
				this.getModel("oOFPModel").refresh();

				var sTabid = this.getModel("oOFPModel").getProperty("/tabid");
				switch (sTabid) {
					case "TABW_114":
						this.fnLoadOFPClm();
						this.fnLoadOFPData();
						break;
					default:
						this.getModel("oOFPModel").setProperty("/tabid", "ALL");
						this.fnLoadOFPClm();
						this.fnLoadOFPData();
				}
			} catch (e) {
				Log.error("Exception in OFPView:_onObjectMatched function");
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
					// this.deleteColumn(oData);
					this.getModel("oOFPModel").setProperty("/ofp", oData.results);
					this.getModel("oOFPModel").refresh();
					this.fnCreateRow(this.getView().byId("tblOFP"), "oOFPModel", "ofp", "oOFPDataModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in OFPView:fnLoadOFPClm function");
				this.handleException(e);
			}
		},
		/** 
		 * Load OFP data
		 */
		fnLoadOFPData: function() {
			try {
				var oParameter = {};
				var sPath = this.getResourceBundle().getText("AIRCRAFTLOGSVC");
				var sLogid = this.getModel("oOFPModel").getProperty("/logid");
				// var sLogidPath = sLogid ? " and logid eq " + sLogid : "";
				if (sLogid) {
					sPath = sPath + "(logid=" + sLogid + ",tailid=" + this.getTailId() + ",tabid=" + this.getModel(
						"oOFPModel").getProperty("/tabid") + ")";
					// sPath = sPath + "/" + sLogid + "/" + this.getTailId() + "/" + this.getModel(
					// 	"oOFPModel").getProperty("/tabid");
				} else {
					oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oOFPModel").getProperty(
						"/ofptabId") + " and otype eq D";
				}
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oOFPDataModel").setProperty("/ofp", oData.results);
					this.getModel("oOFPDataModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in OFPView:fnLoadOFPData function");
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
				Log.error("Exception in OFPView:deleteColumn function");
				this.handleException(e);
			}
		},
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
				Log.error("Exception in OFPView:fnCreateRow function");
				this.handleException(e);
			}
		}
	});

});