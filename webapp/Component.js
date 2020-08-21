sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"avmet/ah/model/models",
	"avmet/ah/util/ajaxutil",
	"avmet/ah/model/dataUtil",
	"sap/m/MessageBox"
], function (UIComponent, Device, models,ajaxutil,dataUtil,MessageBox) {
	"use strict";

	return UIComponent.extend("avmet.ah.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		 
		 	///////////////////////////BASIC DETAILS FOR AIRCRAFT//////////////////////
		airid: "AIR_11",
		username:"EA12345",
		password:"12345",
		pin:"12345",
		appModel:"AirCraftSelectionGBModel",
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

		

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.fnLoginUser();
		},
		fnLoginUser:function(){
			var sPath = "/AuthorizationSvc";
			var oParameter = {};
			//oParameter.filter = "PLANTUSER eq " + this.username + " and PWD eq "+this.password;
			oParameter.error = function(xhrx) {
				MessageBox.error("Invalid login credentials",{title: "Login Error"});
			};
			oParameter.success = function(oData) {
				var sData = {};
				sData.login	={
					airid:"AIR_11",
					air: "AH", 
					name:oData.results.length>0 ? oData.results[0].BACKEND_UNAME : "",
					sqnid: oData.results.length>0 ? oData.results[0].SQNWC : "",
					sqntx: oData.results.length>0 ? oData.results[0].SNAME : "", 
					wcid: oData.results.length>0 ? oData.results[0].WRCTR : "",
					wctx: oData.results.length>0 ? oData.results[0].NAME : "",
                    //Priya 
					rolechangedetails: ""
				};
				try{
				if(dataUtil.getDataSet(this.appModel) === null){
					dataUtil.setDataSet(this.appModel,sData);	
				}
				}catch(e){}
				this.getRouter().initialize();
			}.bind(this);
			ajaxutil.fnRead(sPath, oParameter);
		}
		
// 		BACKEND_UNAME: "KHAN"
// ISACTIVE: "X"
// NAME: "AWOF"
// PLANT: "1000"
// PLANTUSER: "EA12345"
// PWD: null
// ROLE: null
// SNAME: "805 SQN"
// SQNWC: "SQN_805"
// WRCTR: "WC_101"
	});
});