sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../util/dataUtil",
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, MessageToast, dataUtil, ajaxutil, JSONModel, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.PastFlightServicing", {
		// ***************************************************************************
		//Developer : Priya
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var oModel = new JSONModel({
					"FLC": [],
					"WLC": [],
					"PDSIC": [],
					"aTasks": []
				});
				this.getView().setModel(oModel, "oPastFlightModel");
				this.getRouter().getRoute("PastFlightServicing").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		onCardHover: function(oEvent) {
			try {
				var oPastFlightModel = this.getView().getModel("oPastFlightModel"),
					sPath = oEvent.getSource().getBindingContext("oPastFlightModel").sPath,
					sSelectedObj = oEvent.getSource().getBindingContext("oPastFlightModel").getObject();
				//sTitle = oEvent.getSource().getTitle();
				if (sSelectedObj.subid === "S_RE") {
					oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/ReplenishBlu.JPG");
				} else if (sSelectedObj.subid === "S_RT") {
					oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/RoutineTaskBlu.JPG");
				} else if (sSelectedObj.subid === "S_FT" || sSelectedObj.subid === "S_CT") {
					oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/FollowupBlu.JPG");
				} else if (sSelectedObj.subid === "S_WC") {
					oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/ArmingBlu.JPG");
				} else if (sSelectedObj.subid === "S_CS") {
					oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArmBlu.JPG");
				}
			} catch (e) {
				Log.error("Exception in onCardHover function");
				this.handleException(e);
			}
		},

		onCardHoverOut: function(oEvent) {
			try {
				var oPastFlightModel = this.getView().getModel("oPastFlightModel"),
					//sTitle = oEvent.getSource().getTitle();
					sPath = oEvent.getSource().getBindingContext("oPastFlightModel").sPath,
					sSelectedObj = oEvent.getSource().getBindingContext("oPastFlightModel").getObject();
				if (sSelectedObj.subid === "S_RE") {
					if (oPastFlightModel.getProperty(sPath + "/SignOff") === "Pending") {
						oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/Replenish.jpg");
					} else if (oPastFlightModel.getProperty(sPath + "/SignOff") === "true") {
						oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/ReplenishGrn.JPG");
					}
				} else if (sSelectedObj.subid === "S_RT") {
					if (oPastFlightModel.getProperty(sPath + "/SignOff") === "Pending") {
						oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/RoutineTasks.jpg");
					} else if (oPastFlightModel.getProperty(sPath + "/SignOff") === "true") {
						oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/RTGrn.JPG");
					}
				} else if (sSelectedObj.subid === "S_FT" || sSelectedObj.subid === "S_CT") {
					if (oPastFlightModel.getProperty(sPath + "/SignOff") === "Pending") {
						oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/FollowupTask.jpg");
					} else if (oPastFlightModel.getProperty(sPath + "/SignOff") === "true") {
						oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/FollowupGrn.JPG");
					}
				} else if (sSelectedObj.subid === "S_WC") {
					if (oPastFlightModel.getProperty(sPath + "/SignOff") === "Pending") {
						oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/Arming.JPG");
					} else if (oPastFlightModel.getProperty(sPath + "/SignOff") === "true") {
						oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/ArmingGrn.JPG");
					}
				} else if (sSelectedObj.subid === "S_CS") {
					if (oPastFlightModel.getProperty(sPath + "/SignOff") === "Pending") {
						oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArm.jpg");
					} else if (oPastFlightModel.getProperty(sPath + "/SignOff") === "true") {
						oPastFlightModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArm.jpg");
					}
				}
			} catch (e) {
				Log.error("Exception in onCardHoverOut function");
				this.handleException(e);
			}
		},

		onPressUpdateFlightSerTile: function(oEvent) {
			try {
				var oPastFlightModel = this.getView().getModel("oPastFlightModel");
				var sSubId = oEvent.getSource().getBindingContext("oPastFlightModel").getObject().subid;
				switch (sSubId) {
					case "S_RT":
						this.getOwnerComponent().getRouter().navTo("RoutineTasks", {
							srvtid: oPastFlightModel.getProperty("/srvid"),
							stepid: sSubId
						});
						break;
					case "S_FT":
						this.getOwnerComponent().getRouter().navTo("FollowUpTasks", {
							srvtid: oPastFlightModel.getProperty("/srvid"),
							stepid: sSubId
						});
						break;
					case "S_WC":
						this.getOwnerComponent().getRouter().navTo("WeaponConfig", {
							srvtid: oPastFlightModel.getProperty("/srvid"),
							stepid: sSubId
						});
						break;
					case "S_RE":
						this.getOwnerComponent().getRouter().navTo("Replenishment", {
							srvtid: oPastFlightModel.getProperty("/srvid"),
							stepid: sSubId
						});
						break;
					case "S_CS":
						this.getOwnerComponent().getRouter().navTo("PDSSummary", {
							srvtid: oPastFlightModel.getProperty("/srvid"),
							stepid: sSubId
						});
						break;
					case "S_CT":
						// this.getOwnerComponent().getRouter().navTo("RouteCreateTask", {
						// 	"Flag": "FS",
						// 	"srvid": oPastFlightModel.getProperty("/srvid")
						// });
						this.getOwnerComponent().getRouter().navTo("CTCloseTask", {
							"srvtid": oPastFlightModel.getProperty("/srvid")
						});
						break;
				}
			} catch (e) {
				Log.error("Exception in onPressUpdateFlightSerTile function");
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
				var oUpdateFlightModel = this.getView().getModel("oUpdateFlightModel");
				oUpdateFlightModel.setProperty("/aTasks", []);
				oUpdateFlightModel.setProperty("/srvid", oEvent.getParameter("arguments").srvid);
				oUpdateFlightModel.setProperty("/sPageTitle", oEvent.getParameter("arguments").srvid.split("_")[1]);
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and subid eq " + oEvent.getParameter("arguments").srvid +
					" and tailid eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oData.results.forEach(function(oItem) {
						this._getTaskServicing(oItem);
					}.bind(this));
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("MAINTASKSVC"), oParameter);
				// this.fnLoadSrv1Dashboard();
				// //this.setBasicDetails(oEvent);
				// var oPastFlightModel = this.getView().getModel("oPastFlightModel");
				// oPastFlightModel.setProperty("/aTasks", []);
				// oPastFlightModel.setProperty("/srvid", oEvent.getParameter("arguments").srvid);
				// oPastFlightModel.setProperty("/sPageTitle", oEvent.getParameter("arguments").srvid.split("_")[1]);
				// var oParameter = {};
				// oParameter.filter = "TAIL_ID eq " + this.getTailId() + " and SRV_ID eq " + oEvent.getParameter("arguments").srvid;
				// oParameter.error = function() {};
				// oParameter.success = function(oData) {
				// 	oData.results.forEach(function(oItem) {
				// 		this._getTaskServicing(oItem);
				// 	}.bind(this));
				// }.bind(this);
				// ajaxutil.fnRead(this.getResourceBundle().getText("GETSERVICEDTLSVC"), oParameter);
				// // this.fnLoadSrv1Dashboard();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},

		_getTaskServicing: function(oItem) {
			try {
				var oPastFlightModel = this.getView().getModel("oPastFlightModel"),
					aTasks = oPastFlightModel.getProperty("/aTasks");
				var oParameter = {};
				// oPastFlightModel.getProperty("/srvid")
				oParameter.filter = "refid eq " + this.getAircraftId() + " and subid eq " + oItem.SRVTID +
					" and mainid eq " + oItem.SRVTID + " and tailid eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oItem, oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].subid === "S_RE" && oData.results[i].status !== "X") {
								oData.results[i].ImgSrc = "css/img/Replenish.jpg";
								oData.results[i].SignOff = "Pending";
							} else if (oData.results[i].subid === "S_RE" && oData.results[i].status === "X") {
								oData.results[i].ImgSrc = "css/img/ReplenishGrn.JPG";
								oData.results[i].SignOff = "true";
							} else if (oData.results[i].subid === "S_RT" && oData.results[i].status !== "X") {
								oData.results[i].ImgSrc = "css/img/RoutineTasks.jpg";
								oData.results[i].SignOff = "Pending";
							} else if (oData.results[i].subid === "S_RT" && oData.results[i].status === "X") {
								oData.results[i].ImgSrc = "css/img/RTGrn.JPG";
								oData.results[i].SignOff = "true";
							} else if (oData.results[i].subid === "S_FT" && oData.results[i].status !== "X") {
								oData.results[i].ImgSrc = "css/img/FollowupTask.jpg";
								oData.results[i].SignOff = "Pending";
							} else if (oData.results[i].subid === "S_FT" && oData.results[i].status === "X") {
								oData.results[i].ImgSrc = "css/img/FollowupGrn.JPG";
								oData.results[i].SignOff = "true";
							} else if (oData.results[i].subid === "S_WC" && oData.results[i].status !== "X") {
								oData.results[i].ImgSrc = "css/img/Arming.jpg";
								oData.results[i].SignOff = "Pending";
							} else if (oData.results[i].subid === "S_WC" && oData.results[i].status === "X") {
								oData.results[i].ImgSrc = "css/img/ArmingGrn.JPG";
								oData.results[i].SignOff = "true";
							} else if (oData.results[i].subid === "S_CS" && oData.results[i].status !== "X") {
								oData.results[i].ImgSrc = "css/img/BFNoArm.jpg";
								oData.results[i].SignOff = "Pending";
							} else if (oData.results[i].subid === "S_CS" && oData.results[i].status === "X") {
								oData.results[i].ImgSrc = "css/img/BFNoArm.jpg";
								oData.results[i].SignOff = "true";
							} else if (oData.results[i].subid === "S_CT" && oData.results[i].status !== "X") {
								oData.results[i].ImgSrc = "css/img/FollowupTask.jpg";
								oData.results[i].SignOff = "Pending";
							} else if (oData.results[i].subid === "S_CT" && oData.results[i].status === "X") {
								oData.results[i].ImgSrc = "css/img/FollowupGrn.JPG";
								oData.results[i].SignOff = "true";
							}
						}
					}
					//Temporary Code - Backend needs to add sequence number
					if (oItem.mainid === "MS_FLC") {
						oItem.sequence = 1;
					} else if (oItem.mainid === "MS_WLC") {
						oItem.sequence = 2;
					} else if (oItem.mainid === "MS_PDSIC") {
						oItem.sequence = 3;
					}
					oItem.subtask = oData.results;
					aTasks.push(oItem);
					oPastFlightModel.setProperty("/aTasks", aTasks);
					oPastFlightModel.refresh();
				}.bind(this, oItem);
				ajaxutil.fnRead(this.getResourceBundle().getText("MAINTASKSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getTaskServicing function");
				this.handleException(e);
			}
		}
	});
});