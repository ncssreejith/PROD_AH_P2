sap.ui.define([
	"./BaseController",
	"sap/base/Log"
], function(BaseController, Log) {
	"use strict";
	/* ***************************************************************************
	 *	 Developer : Teck Meng
	 *   Control name: MainWDNS           
	 *   Purpose : WDNS landing page controller
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *	 2. Backend Calls
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.MainWDNS", {
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************				
		onInit: function() {
			try {
				this.getRouter().getRoute("MainWDNS").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in MainWDNS:onInit function");
				this.handleException(e);
			}
		},
		_onObjectMatched: function() {},

		/** 
		 * On user click Coefficient
		 */
		onPressWDNS: function() {
			try {
				this.getRouter().navTo("WDNSCoefficients");
			} catch (e) {
				Log.error("Exception in MainWDNS:onPressWDNS function");
				this.handleException(e);
			}
		},
		/** 
		 * On user click OFP
		 */
		onPressOFPRecords: function() {
			try {
				this.getRouter().navTo("OFPView");
			} catch (e) {
				Log.error("Exception in MainWDNS:onPressOFPRecords function");
				this.handleException(e);
			}
		}
	});
});