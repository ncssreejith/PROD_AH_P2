sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"avmet/ah/util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/base/Log",
	"../util/FilterOpEnum"
], function(BaseController, dataUtil, Fragment, ajaxutil, JSONModel, formatter, Log, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.AircraftTransfer", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		/** 
		 * On init
		 */
		onInit: function() {
			try {
				var that = this;
				this.getRouter().getRoute("AircraftTransfer").attachPatternMatched(this._onObjectMatched, this);
				var oATData = {
					header: {},
					history: []
				};
				this.setModel(new JSONModel(oATData), "atModel");
			} catch (e) {
				Log.error("Exception in AircraftTransfer:onInit function");
				this.handleException(e);
			}
		},
		/** 
		 * 
		 */
		onNavBackDispatch: function() {
			try {
				this.getRouter().navTo("DashboardInitial");
			} catch (e) {
				Log.error("Exception in AircraftTransfer:onNavBackDispatch function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		// 1.on click of transfer to aircraft
		onTransferAircraft: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("DispatchAircraft", {
					tab: "0"
				});
			} catch (e) {
				Log.error("Exception in AircraftTransfer:onTransferAircraft function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		/** 
		 * 
		 * @constructor 
		 * @param oEvent
		 */
		_onObjectMatched: function(oEvent) {
			try {
				this.fnLoadCurrentDetails();
				this.fnLoadHistory();
			} catch (e) {
				Log.error("Exception in AircraftTransfer:_onObjectMatched function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 2.  Backend Calls 
		// ***************************************************************************
		/** 
		 * Load current transfer logs header
		 */
		fnLoadCurrentDetails: function() {
			try {
				var sPath = this.getResourceBundle().getText("AIRTRANSCURRSVC");
				var oParameter = {};
					oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId()+"&LFLAG" + FilterOpEnum.EQ+"T"; // Phase 2 changes
			
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					var oHeader = oData.results.length > 0 ? oData.results[0] : {};
					this.getModel("atModel").setProperty("/header", oHeader);
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in AircraftTransfer:fnLoadCurrentDetails function");
				this.handleException(e);
			}
		},
		/** 
		 * Load current transfer logs details
		 */
		fnLoadHistory: function() {
			try {
				var sPath = this.getResourceBundle().getText("AIRTRANSSVC");
				var oParameter = {};
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId(); 
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					this.getModel("atModel").setProperty("/history", oData.results);
					this.fnCheckStatus();
					this.getModel("atModel").refresh(true);
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
			} catch (e) {
				Log.error("Exception in AircraftTransfer:fnLoadHistory function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 3. Private Methods   
		// ***************************************************************************
		/** 
		 * Validate history
		 */
		fnCheckStatus: function() {
			try {
				var aHistory = this.getModel("atModel").getProperty("/history");
				var oHeader = this.getModel("atModel").getProperty("/header");
				if (oHeader.ASTID === "AST_REC") { //AST_REC
					if (aHistory.length > 0) {
						aHistory.push({
							"tranid": "ZZTRAN_DUMMY",
							"tailid": "TAIL_1001",
							"listid": null,
							"transt": "R",
							"locationid": null,
							"location": null,
							"dsqnid": null,
							"dsqntxt": null,
							"dtredemen": null,
							"distm": null,
							"disutz": null,
							"rsqnid": "Pending",
							"rsqntxt": "Pending",
							"rtredemen": "Pending",
							"rdistm": null,
							"rdiutz": null
						});
					}
				}
			} catch (e) {
				Log.error("Exception in AircraftTransfer:fnCheckStatus function");
				this.handleException(e);
			}
		}

	});
});