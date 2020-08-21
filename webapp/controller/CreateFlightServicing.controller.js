sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../model/dataUtil",
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, MessageToast, dataUtil, ajaxutil, JSONModel, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.CreateFlightServicing", {
		// ***************************************************************************
		//*	 Developer : Priya
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var oModel = new JSONModel({
					"ServiceName": [],
					"FlightServicing": [],
					"AdhocServicing": [],
					"DBResult": [],
					"aCreateFlgSrv": []
				});
				this.getView().setModel(oModel, "oCreatFlightSerModel");
				//this.getView().setModel(oModel, "oPilotDashBoardModel");
				this.getRouter().getRoute("CreateFlightService").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		//1. To navigate to next screen (Update Flight Servicing) on click of Before Flight Tile.
		onFlightServiceTilePress: function(oEvent) {
			try {
				var sSubId = oEvent.getSource().getBindingContext("oCreatFlightSerModel").getObject().subid;
				this.getRouter().navTo("UpdateFlightServicing", {
					srvid: sSubId
				});
			} catch (e) {
				Log.error("Exception in onFlightServiceTilePress function");
				this.handleException(e);
			}
		},

		onNavBack: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("DashboardInitial");
			} catch (e) {
				Log.error("Exception in onNavBack function");
				this.handleException(e);
			}
		},

		onCardHover: function(oEvent) {
			try {
				var oCreatFlightSerModel = this.getView().getModel("oCreatFlightSerModel"),
					sPath = oEvent.getSource().getBindingContext("oCreatFlightSerModel").sPath,
					oSelectedObj = oEvent.getSource().getBindingContext("oCreatFlightSerModel").getObject(),
					sTitle = oEvent.getSource().getTitle();
				//var oPilotDashBoardModel = this.getView().getModel("oPilotDashBoardModel"),
				//sTitle = oEvent.getSource().getTitle();
				if (oSelectedObj.subid === "SRVT_BF") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArmBlu.JPG");
				} else if (oSelectedObj.subid === "SRVT_AF") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArmBlu.JPG");
				} else if (oSelectedObj.subid === "SRVT_PO") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArmBlu.JPG");
				} else if (oSelectedObj.subid === "SRVT_RE") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/RefuelBlu.JPG");
				} else if (oSelectedObj.subid === "SRVT_DE") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/DefuelBlu.JPG");
				} else if (oSelectedObj.subid === "SRVT_AR") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/ArmingBlu.JPG");
				} else if (oSelectedObj.subid === "SRVT_ARM") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/ArmingBlu.JPG");
				} else if (oSelectedObj.subid === "SRVT_DARM") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/ArmingBlu.JPG");
				} else {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArmBlu.JPG");
				}
			} catch (e) {
				Log.error("Exception in onCardHover function");
				this.handleException(e);
			}
		},

		onCardHoverOut: function(oEvent) {
			try {
				var oCreatFlightSerModel = this.getView().getModel("oCreatFlightSerModel"),
					sPath = oEvent.getSource().getBindingContext("oCreatFlightSerModel").sPath,
					oSelectedObj = oEvent.getSource().getBindingContext("oCreatFlightSerModel").getObject();
				//sTitle = oEvent.getSource().getTitle();
				//var oPilotDashBoardModel = this.getView().getModel("oPilotDashBoardModel"),
				//sTitle = oEvent.getSource().getTitle();
				if (oSelectedObj.subid === "SRVT_BF") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArm.jpg");
				} else if (oSelectedObj.subid === "SRVT_AF") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArm.jpg");
				} else if (oSelectedObj.subid === "SRVT_PO") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArm.jpg");
				} else if (oSelectedObj.subid === "SRVT_RE") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/Refuel.jpg");
				} else if (oSelectedObj.subid === "SRVT_DE") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/Defuel.jpg");
				} else if (oSelectedObj.subid === "SRVT_AR") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/Arming.JPG");
				} else if (oSelectedObj.subid === "SRVT_ARM") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/Arming.JPG");
				} else if (oSelectedObj.subid === "SRVT_DARM") {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/Arming.JPG");
				} else {
					oCreatFlightSerModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArm.jpg");
				}
			} catch (e) {
				Log.error("Exception in onCardHoverOut function");
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
				//this.setBasicDetails(oEvent);
				//Get Data - Flight Servicing Type
				//var oCreatFlightSerModel = this.getView().getModel("oCreatFlightSerModel");
				//this.getModel("srvModel").setProperty("/srv", []);
				//this.getModel("srvModel").refresh();
				this.getView().getModel("oCreatFlightSerModel").setProperty("/aCreateFlgSrv", []);
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and mainid eq SRVM and dflag eq 1 and tailid eq " + this.getTailId(); //To pass '%' in the Url, decoded to '%25' in the filter
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					// this.fnCreateServiceSequnce(oData);
					oData.results.forEach(function(oItem) {
						this._getFlightServicing(oItem);
					}.bind(this));
				}.bind(this);
				ajaxutil.fnRead("/MainSrvSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},

		_getFlightServicing: function(oItem) {
			try {
				var oCreatFlightSerModel = this.getView().getModel("oCreatFlightSerModel"),
					aCreateFlgSrv = oCreatFlightSerModel.getProperty("/aCreateFlgSrv"),
					oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and mainid eq " + oItem.mainid + " and dflag eq 0 and tailid eq " +
					this
					.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oItem, oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].subid === "SRVT_BF") {
								oData.results[i].ImgSrc = "css/img/BFNoArm.jpg";
							} else if (oData.results[i].subid === "SRVT_PO") {
								oData.results[i].ImgSrc = "css/img/BFNoArm.jpg";
							} else if (oData.results[i].subid === "SRVT_PF") {
								oData.results[i].ImgSrc = "css/img/BFNoArm.jpg";
							} else if (oData.results[i].subid === "SRVT_RE") {
								oData.results[i].ImgSrc = "css/img/Refuel.jpg";
							} else if (oData.results[i].subid === "SRVT_DE") {
								oData.results[i].ImgSrc = "css/img/Defuel.jpg";
							} else if (oData.results[i].subid === "SRVT_AR") {
								oData.results[i].ImgSrc = "css/img/Arming.JPG";
							} else if (oData.results[i].subid === "SRVT_ARM") {
								oData.results[i].ImgSrc = "css/img/Arming.JPG";
							} else if (oData.results[i].subid === "SRVT_DARM") {
								oData.results[i].ImgSrc = "css/img/Arming.JPG";
							} else if (oData.results[i].subid === "SRVT_PMSN") {
								oData.results[i].ImgSrc = "css/img/BFNoArm.jpg";
							} else {
								oData.results[i].ImgSrc = "css/img/BFNoArm.jpg";
							}
						}
					}
					oItem.subsrv = oData.results;
					aCreateFlgSrv.push(oItem);
					oCreatFlightSerModel.setProperty("/aCreateFlgSrv", aCreateFlgSrv);
					//this.getModel("srvModel").getProperty("/srv").push(oItem);
					this.getModel("oCreatFlightSerModel").refresh();
				}.bind(this, oItem);
				ajaxutil.fnRead("/MainSrvSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getFlightServicing function");
				this.handleException(e);
			}
		}

		/*_onObjectMatched1: function(oEvent) {
			this.setBasicDetails(oEvent);
			//Get Data - Flight Servicing Type
			var that = this;
			var oCreatFlightSerModel = this.getView().getModel("oCreatFlightSerModel");
			var that = this;
			var oParameter = {};
			oParameter.error = function() {

			};
			oParameter.filter = "refid eq " + this.getAircraftId() + " and mainid eq SRVM_%25 and dflag eq 1"; //To pass '%' in the Url, decoded to '%25' in the filter
			oParameter.success = function(oData) {
				that._getFlightServicing();
				that._getAdhocServicing();
			}.bind(this);
			ajaxutil.fnRead("/MainSrvSvc", oParameter);
		},

		_getFlightServicing1: function() {
			var oCreatFlightSerModel = this.getView().getModel("oCreatFlightSerModel");
			var oParameter = {};
			oParameter.error = function() {};
			oParameter.filter = "refid eq " + this.getAircraftId() + " and mainid eq SRVM_FS and dflag eq 0 and tailid eq " + this.getTailId();
			oParameter.success = function(oData) {
				if (oData.results.length) {
					for (var i in oData.results) {
						if (oData.results[i].subid === "SRVT_BF") {
							oData.results[i].ImgSrc = "css/img/BFFlight.JPG";
						} else if (oData.results[i].subid === "SRVT_PO") {
							oData.results[i].ImgSrc = "css/img/BFFlight.JPG";
						} else if (oData.results[i].subid === "SRVT_PF") {
							oData.results[i].ImgSrc = "css/img/BFFlight.JPG";
						} else {
							oData.results[i].ImgSrc = "css/img/BFFlight.JPG";
						}
					}
					oCreatFlightSerModel.setProperty("/FlightServicing", oData.results);
				}
			}.bind(this);
			ajaxutil.fnRead("/MainSrvSvc", oParameter);
		},*/

		/*_getAdhocServicing: function(oItem) {
			var oCreatFlightSerModel = this.getView().getModel("oCreatFlightSerModel");
			var oParameter = {};
			oParameter.error = function() {};
			oParameter.filter = "refid eq " + this.getAircraftId() + " and mainid eq " + oItem.mainid + " and dflag eq 0 and tailid eq " +
				this.getTailId();
			oParameter.success = function(oItem, oData) {
				if (oItem.results.length) {
					for (var i in oItem.results) {
						if (oItem.results[i].subid === "SRVT_RE") {
							oItem.results[i].ImgSrc = "css/img/Refuel.jpg";
						} else if (oItem.results[i].subid === "SRVT_DE") {
							oItem.results[i].ImgSrc = "css/img/Defuel.jpg";
						}
					}
					oCreatFlightSerModel.setProperty("/AdhocServicing", oItem.results);
				}
			}.bind(this);
			ajaxutil.fnRead("/MainSrvSvc", oParameter);
		}*/

	});
});