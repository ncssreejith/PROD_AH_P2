sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log",
	"../model/formatter",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, MessageToast, dataUtil, ajaxutil, JSONModel, Log, formatter, FilterOpEnum) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.UpdateFlightServicing", {
		formatter: formatter,
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
				this.getView().setModel(oModel, "oUpdateFlightModel");
				this.getRouter().getRoute("UpdateFlightServicing").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		onCardHover: function(oEvent) {
			try {
				var oUpdateFlightModel = this.getView().getModel("oUpdateFlightModel"),
					sPath = oEvent.getSource().getBindingContext("oUpdateFlightModel").sPath,
					sSelectedObj = oEvent.getSource().getBindingContext("oUpdateFlightModel").getObject();
				//sTitle = oEvent.getSource().getTitle();
				if (sSelectedObj.subid === "S_RE") {
					oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/ReplenishBlu.JPG");
				} else if (sSelectedObj.subid === "S_RT") {
					oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/RoutineTaskBlu.JPG");
				} else if (sSelectedObj.subid === "S_FT" || sSelectedObj.subid === "S_CT") {
					oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/FollowupBlu.JPG");
				} else if (sSelectedObj.subid === "S_WC") {
					oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/ArmingBlu.JPG");
				} else if (sSelectedObj.subid === "S_CS") {
					oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArmBlu.JPG");
				}
			} catch (e) {
				Log.error("Exception in onCardHover function");
				this.handleException(e);
			}
		},

		onCardHoverOut: function(oEvent) {
			try {
				var oUpdateFlightModel = this.getView().getModel("oUpdateFlightModel"),
					//sTitle = oEvent.getSource().getTitle();
					sPath = oEvent.getSource().getBindingContext("oUpdateFlightModel").sPath,
					sSelectedObj = oEvent.getSource().getBindingContext("oUpdateFlightModel").getObject();
				if (sSelectedObj.subid === "S_RE") {
					if (oUpdateFlightModel.getProperty(sPath + "/SignOff") === "Pending") {
						oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/Replenish.jpg");
					} else if (oUpdateFlightModel.getProperty(sPath + "/SignOff") === "true") {
						oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/ReplenishGrn.JPG");
					}
				} else if (sSelectedObj.subid === "S_RT") {
					if (oUpdateFlightModel.getProperty(sPath + "/SignOff") === "Pending") {
						oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/RoutineTasks.jpg");
					} else if (oUpdateFlightModel.getProperty(sPath + "/SignOff") === "true") {
						oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/RTGrn.JPG");
					}
				} else if (sSelectedObj.subid === "S_FT" || sSelectedObj.subid === "S_CT") {
					if (oUpdateFlightModel.getProperty(sPath + "/SignOff") === "Pending") {
						oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/FollowupTask.jpg");
					} else if (oUpdateFlightModel.getProperty(sPath + "/SignOff") === "true") {
						oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/FollowupGrn.JPG");
					}
				} else if (sSelectedObj.subid === "S_WC") {
					if (oUpdateFlightModel.getProperty(sPath + "/SignOff") === "Pending") {
						oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/Arming.JPG");
					} else if (oUpdateFlightModel.getProperty(sPath + "/SignOff") === "true") {
						oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/ArmingGrn.JPG");
					}
				} else if (sSelectedObj.subid === "S_CS") {
					if (oUpdateFlightModel.getProperty(sPath + "/SignOff") === "Pending") {
						oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArm.jpg");
					} else if (oUpdateFlightModel.getProperty(sPath + "/SignOff") === "true") {
						oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/BFNoArm.jpg");
					}
				}
			} catch (e) {
				Log.error("Exception in onCardHoverOut function");
				this.handleException(e);
			}
		},

		onPressUpdateFlightSerTile: function(oEvent) {
			try {
				var oUpdateFlightModel = this.getView().getModel("oUpdateFlightModel");
				var sSubId = oEvent.getSource().getBindingContext("oUpdateFlightModel").getObject().subid;
				switch (sSubId) {
					case "S_RT":
						this.getOwnerComponent().getRouter().navTo("RoutineTasks", {
							srvtid: oUpdateFlightModel.getProperty("/srvid"),
							stepid: sSubId,
							srvid: oUpdateFlightModel.getProperty("/srv_id")
						});
						break;
					case "S_FT":
						this.getOwnerComponent().getRouter().navTo("FollowUpTasks", {
							srvtid: oUpdateFlightModel.getProperty("/srvid"),
							stepid: sSubId,
							srvid: oUpdateFlightModel.getProperty("/srv_id")
						});
						break;
					case "S_WC":
						this.getOwnerComponent().getRouter().navTo("WeaponConfig", {
							srvtid: oUpdateFlightModel.getProperty("/srvid"),
							stepid: sSubId,
							srvid: oUpdateFlightModel.getProperty("/srv_id")
						});
						break;
					case "S_RE":
						this.getOwnerComponent().getRouter().navTo("Replenishment", {
							srvtid: oUpdateFlightModel.getProperty("/srvid"),
							stepid: sSubId,
							srvid: oUpdateFlightModel.getProperty("/srv_id")
						});
						break;
					case "S_CS":
						this.getOwnerComponent().getRouter().navTo("PDSSummary", {
							srvtid: oUpdateFlightModel.getProperty("/srvid"),
							stepid: sSubId,
							srvid: oUpdateFlightModel.getProperty("/srv_id")
						});
						break;
					case "S_CT":
						// this.getOwnerComponent().getRouter().navTo("RouteCreateTask", {
						// 	"Flag": "FS",
						// 	"srvid": oUpdateFlightModel.getProperty("/srvid")
						// });
						this.getOwnerComponent().getRouter().navTo("CTCloseTask", {
							"srvtid": oUpdateFlightModel.getProperty("/srvid"),
							srvid: oUpdateFlightModel.getProperty("/srv_id")
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
				//this.setBasicDetails(oEvent);
				var oUpdateFlightModel = this.getView().getModel("oUpdateFlightModel");
				oUpdateFlightModel.setProperty("/aTasks", []);
				oUpdateFlightModel.setProperty("/srvid", oEvent.getParameter("arguments").srvid);
				var srv_id = oEvent.getParameter("arguments").srv_id;
				oUpdateFlightModel.setProperty("/srv_id", srv_id);
				oUpdateFlightModel.setProperty("/sPageTitle", oEvent.getParameter("arguments").srvid.split("_")[1]);

				var sSrvIdFilter = this.getModel("oUpdateFlightModel").getProperty("/srv_id") ?
					(" and SRVID eq " + this.getModel("oUpdateFlightModel").getProperty("/srv_id")) : "";
				var oParameter = {};
				// oParameter.filter = "refid eq " + this.getAircraftId() + " and subid eq " + oEvent.getParameter("arguments").srvid +
				// 	" and tailid eq " + this.getTailId() + sSrvIdFilter;
				oParameter.filter = "refid" + FilterOpEnum.EQ + this.getAircraftId() + FilterOpEnum.AND + "subid" + FilterOpEnum.EQ + oEvent.getParameter(
						"arguments").srvid + FilterOpEnum.AND +
					"tailid" + FilterOpEnum.EQ + this.getTailId() + sSrvIdFilter;
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oData.results.forEach(function(oItem) {
						this._getTaskServicing(oItem);
					}.bind(this));
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("MAINTASKSVC"), oParameter);
				this.fnLoadSrv1Dashboard();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},

		_getTaskServicing: function(oItem) {
			try {
				var oUpdateFlightModel = this.getView().getModel("oUpdateFlightModel"),
					aTasks = oUpdateFlightModel.getProperty("/aTasks");

				var sSrvIdFilter = this.getModel("oUpdateFlightModel").getProperty("/srv_id") ?
					(" and SRVID eq " + this.getModel("oUpdateFlightModel").getProperty("/srv_id")) : "";

				var oParameter = {};
				// oParameter.filter = "refid eq " + this.getAircraftId() + " and subid eq " + oUpdateFlightModel.getProperty("/srvid") +
				// 	" and mainid eq " + oItem.mainid + " and tailid eq " + this.getTailId() + sSrvIdFilter;
				oParameter.filter = "refid" + FilterOpEnum.EQ + this.getAircraftId() + FilterOpEnum.AND + "subid" + FilterOpEnum.EQ +
					oUpdateFlightModel.getProperty("/srvid") + FilterOpEnum.AND + "mainid" + FilterOpEnum.EQ + oItem.mainid + FilterOpEnum.AND +
					"tailid" + FilterOpEnum.EQ + this.getTailId() + sSrvIdFilter;
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
					oUpdateFlightModel.setProperty("/aTasks", aTasks);
					oUpdateFlightModel.refresh();
				}.bind(this, oItem);
				ajaxutil.fnRead(this.getResourceBundle().getText("MAINTASKSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getTaskServicing function");
				this.handleException(e);
			}
		}
	});
});