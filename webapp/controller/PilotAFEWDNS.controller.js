sap.ui.define([
	"./BaseController",
	"sap/base/Log"
], function(BaseController, Log) {
	"use strict";
	/* ***************************************************************************
	 *	 Developer : Teck Meng
	 *   Control name: PilotAFEWDNS           
	 *   Purpose : WDNS landing page controller
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *	 2. Backend Calls
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.PilotAFEWDNS", {
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************				
		onInit: function() {
			try {
				this.getRouter().getRoute("PilotAFEWDNS").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in PilotAFEWDNS:onInit function");
				this.handleException(e);
			}
		},
		_onObjectMatched: function() {},

		/** 
		 * On user click Coefficient
		 */
		onPressGUNDH: function() {
			try {
				// this.getModel("oWDNSModel").getProperty("/tabid");
				// this.getModel("oWDNSModel").getProperty("/logid");
				// var sPilot = this.getModel("oWDNSModel").getProperty("/pilot");
				this.getRouter().navTo("UpdateWDNSView",{
					tabid: "TABW_116",//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
					pilot: "GUNDH"
				});
				// this.getRouter().navTo("WDNSCoefficients",{
				// 	tabid: "",
				// 	logid: "",
				// 	pilot: "GUNDH"
				// });
			} catch (e) {
				Log.error("Exception in PilotAFEWDNS:onPressWDNS function");
				this.handleException(e);
			}
		},
		/** 
		 * On user click AFE
		 */
		onPressAFERecords: function() {
			try {
				this.getRouter().navTo("UpdateWDNSView",{
					tabid: "TABW_115",//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
					pilot: "AFE"
				});
				// this.getRouter().navTo("WDNSCoefficients",{
				// 	tabid: "",
				// 	logid: "",
				// 	pilot: "AFE"
				// });
			} catch (e) {
				Log.error("Exception in PilotAFEWDNS:onPressOFPRecords function");
				this.handleException(e);
			}
		}
	});
});