sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, dataUtil, JSONModel, ajaxutil, formatter, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.Replenishment_Details", {
		formatter: formatter,

		// ***************************************************************************
		//Developer : Priya
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var that = this;
				var oModel = new JSONModel({
					"sSelectedRepl": "Fuel",
					"iFuelTotalSerAmt": 0,
					"iFuelTotalAmt": 0,
					"step": 1.1,
					"TyrePressure": [],
					"ScrollContainerHeight": "60%",
					"bTireValidation": true,
					"aSelectItems": [{
						"Key": "REM_F",
						"Text": "Fuel"
					}, {
						"Key": "REM_O",
						"Text": "Oil & Misc"
					}]
				});
				this.getView().setModel(oModel, "oRepDetailsModel");
				var oScroll = this.getView().byId("scrollContainerId");
				oScroll.attachBrowserEvent("scroll", function(oEvent) {
					that.onScroll(oEvent);
				});
				this.getRouter().getRoute("ReplenishmentDetails").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},
		onScroll: function(oEvent) {
			try {
				var oScroll = this.getView().byId("scrollContainerId"),
					oViewModel = this.getModel("oRepDetailsModel"),
					yValue = oScroll._oScroller._scrollY;
				if (yValue < 100) {
					oViewModel.setProperty("/sSelectedRepl", "REM_F");
				} else if (yValue >= 100 && yValue < 200) {
					oViewModel.setProperty("/sSelectedRepl", "REM_T");
				} else if (yValue >= 200) {
					oViewModel.setProperty("/sSelectedRepl", "REM_O");
				}
			} catch (e) {
				Log.error("Exception in onScroll function");
				this.handleException(e);
			}
		},

		onDefuelClick: function(oEvent) {
			try {
				var oViewModel = this.getModel("oRepDetailsModel"),
					bDefuel = oEvent.getSource().getSelected(),
					sPath = oEvent.getSource().getBindingContext("oRepDetailsModel").sPath;
				if (bDefuel) {
					oViewModel.setProperty(sPath + "/defuel", "X");
				} else {
					oViewModel.setProperty(sPath + "/defuel", "");
				}
			} catch (e) {
				Log.error("Exception in onDefuelClick function");
				this.handleException(e);
			}
		},

		// onTireTblValueChange: function() {
		// 	var aItems = this.getView().byId("tireFragId").getItems();
		// 	for (var i in aItems) {
		// 		if (aItems[i].getCells()[1].getValue() > aItems[i].getCells()[2].getValue()) {
		// 			aItems[i].getCells()[1].setValueState("Error");
		// 			aItems[i].getCells()[1].setTooltip("Serviced amount exceeds total amount.");
		// 			aItems[i].getCells()[1].setValueStateText("Serviced amount exceeds total amount.");
		// 		} else {
		// 			aItems[i].getCells()[1].setValueState("None");
		// 			aItems[i].getCells()[1].setTooltip("");
		// 			aItems[i].getCells()[1].setValueStateText("");
		// 		}
		// 	}
		// },
		onOilTblValueChange: function() {
			try {
				var aItems = this.getView().byId("oilFragId").getItems();
				for (var i in aItems) {
					if (aItems[i].getCells()[1].getValue() > aItems[i].getCells()[1].getValue()) {
						aItems[i].getCells()[1].setValueState("Error");
						aItems[i].getCells()[1].setTooltip("Serviced amount exceeds total amount.");
						aItems[i].getCells()[1].setValueStateText("Serviced amount exceeds total amount.");
					} else {
						aItems[i].getCells()[1].setValueState("None");
						aItems[i].getCells()[1].setTooltip("");
						aItems[i].getCells()[1].setValueStateText("");
					}
				}
			} catch (e) {
				Log.error("Exception in onOilTblValueChange function");
				this.handleException(e);
			}
		},
		onFuelTableUpdateFinish: function(oEvent) {
			try {
				var that = this;
				window.setTimeout(function() {
					var oViewModel = that.getModel("oRepDetailsModel"),
						iFuelTotalOriAmt = 0,
						iFuelTotalSerAmt = 0,
						iFuelTotalAmt = 0,
						aTblItems = that.getView().byId("tblRepFuel").getItems();
					if (aTblItems.length) {
						for (var i in aTblItems) {
							if (!isNaN(parseInt(aTblItems[i].getCells()[1].getValue()))) {
								iFuelTotalOriAmt = iFuelTotalOriAmt + parseInt(aTblItems[i].getCells()[1].getValue());
							}
							if (!isNaN(parseInt(aTblItems[i].getCells()[2].getValue()))) {
								iFuelTotalSerAmt = iFuelTotalSerAmt + parseInt(aTblItems[i].getCells()[2].getValue());
							}
							window.setTimeout(function() {
								aTblItems = that.getView().byId("tblRepFuel").getItems();
								iFuelTotalAmt = 0;
								for (var j in aTblItems) {
									if (!isNaN(parseInt(aTblItems[j].getCells()[3].getValue()))) {
										iFuelTotalAmt = iFuelTotalAmt + parseInt(aTblItems[j].getCells()[3].getValue());
									}
									oViewModel.setProperty("/iFuelTotalAmt", iFuelTotalAmt);
								}
							}, 10);
						}
					}
					/*var aItems = this.getView().byId("tblRepFuel").getItems();
					for (var i in aItems) {
						if (aItems[i].getCells()[2].getValue() > aItems[i].getCells()[3].getValue()) {
							aItems[i].getCells()[2].setValueState("Error");
							aItems[i].getCells()[2].setTooltip("Serviced amount exceeds total amount.");
							aItems[i].getCells()[2].setValueStateText("Serviced amount exceeds total amount.");
						} else {
							aItems[i].getCells()[2].setValueState("None");
							aItems[i].getCells()[2].setTooltip("");
							aItems[i].getCells()[2].setValueStateText("");
						}
					}*/
					oViewModel.setProperty("/iFuelTotalOriAmt", iFuelTotalOriAmt);
					oViewModel.setProperty("/iFuelTotalSerAmt", iFuelTotalSerAmt);

					var aItems = that.getView().byId("tblRepFuel").getItems();
					for (var i in aItems) {
						//Code to Set Total Amount
						var iOriginalAmt = aItems[i].getCells()[1].getValue(),
							iServicedAmt = aItems[i].getCells()[2].getValue(),
							iTotalAmt = iOriginalAmt + iServicedAmt,
							iMax = parseInt(aItems[i].getCells()[3].getMax());
						aItems[i].getCells()[3].setValue(iTotalAmt);
						// window.setTimeout(function() {
						aItems[i].getCells()[3].focus();
						if (iTotalAmt <= iMax) {
							aItems[i].getCells()[1].setValueState("None");
							aItems[i].getCells()[2].setValueState("None");
							aItems[i].getCells()[1].setTooltip("");
							aItems[i].getCells()[1].setValueStateText("");
							aItems[i].getCells()[2].setTooltip("");
							aItems[i].getCells()[2].setValueStateText("");
						} else {

							aItems[i].getCells()[1].setValueState("Error");
							aItems[i].getCells()[2].setValueState("Error");
							aItems[i].getCells()[1].setTooltip("Original amount + Serviced amount exceeds total amount.");
							aItems[i].getCells()[1].setValueStateText("Original amount + Serviced amount exceeds total amount.");
							aItems[i].getCells()[2].setTooltip("Original amount + Serviced amount exceeds total amount.");
							aItems[i].getCells()[2].setValueStateText("Original amount + Serviced amount exceeds total amount.");

						}

					}
				}, 10);
			} catch (e) {
				Log.error("Exception in onFuelTableUpdateFinish function");
				this.handleException(e);
			}
		},

		onListSelect: function(oEvent, sKey) {
			try {
				var sSelectedKey,
					oScroll = this.getView().byId("scrollContainerId");
				if (oEvent !== undefined) {
					sSelectedKey = oEvent.getSource().getSelectedKey();
				} else {
					sSelectedKey = sKey;
				}
				if (sSelectedKey === "REM_F") {
					oScroll.scrollToElement(oScroll.getContent()[0], 300);
				} else {
					oScroll.scrollToElement(oScroll.getContent()[1], 500);
				}
			} catch (e) {
				Log.error("Exception in onListSelect function");
				this.handleException(e);
			}
		},

		// onFuelTableUpdateFinish: function(srvType, oEvent) {
		// 	var oReplModel = this.getModel("oRepDetailsModel");
		// 	// var sBindingContext = oEvent.getSource().getBindingContext("oRepDetailsModel");
		// 	var sCount = 0;
		// 	var sPropName = "iFuelTotalAmt",
		// 		modeProp = "totamt";
		// 	if (srvType === "SRVD") {
		// 		sPropName = "iFuelTotalSerAmt";
		// 		modeProp = "srvamt";
		// 	} else if (srvType === "TTL") {
		// 		sPropName = "iFuelTotalAmt";
		// 		modeProp = "totamt";
		// 	}
		// 	if (!oEvent) {
		// 		return;
		// 	}
		// 	oEvent.getSource().getParent().getParent().getItems().forEach(function(oItem) {
		// 		var oCount = oItem.getBindingContext("oRepDetailsModel").getProperty(modeProp);
		// 		sCount = sCount + parseInt(((oCount === null || oCount === '') ? 0 : oCount), 0);
		// 	}.bind(this));

		// 	oReplModel.setProperty("/" + sPropName, sCount);
		// 	oReplModel.refresh();
		// },

		// onListSelect: function(oEvent, sKey) {
		// 	var sSelectedKey,
		// 		oScroll = this.getView().byId("scrollContainerId");
		// 	if (oEvent !== undefined) {
		// 		sSelectedKey = oEvent.getSource().getSelectedKey();
		// 	} else {
		// 		sSelectedKey = sKey;
		// 	}
		// 	if (sSelectedKey === "Fuel") {
		// 		oScroll.scrollToElement(oScroll.getContent()[0], 500);
		// 	} else if (sSelectedKey === "Tire") {
		// 		oScroll.scrollToElement(oScroll.getContent()[1], 500);
		// 	} else {
		// 		oScroll.scrollToElement(oScroll.getContent()[2], 1000);
		// 	}
		// },

		onPressSignOffConfirm: function(oEvent) {
			try {
				var that = this,
					oViewModel = this.getModel("oRepDetailsModel"),
					Fuel = oViewModel.getProperty("/Fuel"),
					OilMisc = oViewModel.getProperty("/OilMisc"),
					Tire = oViewModel.getProperty("/Tire"),
					aFuelItems = this.getView().byId("tblRepFuel").getItems(),
					// aTiretems = this.getView().byId("tireFragId").getItems(),
					aOiltems = this.getView().byId("oilFragId").getItems(),
					aPayload = [],
					bValidation = true,
					oParameter = {};
				for (var i in aFuelItems) {
					if (aFuelItems[i].getCells()[2].getValueState() === "Error") {
						bValidation = false;
					}
				}
				for (var i in aOiltems) {
					if (aOiltems[i].getCells()[1].getValueState() === "Error") {
						bValidation = false;
					}
				}
				if (bValidation) {
					if (Fuel.length) {
						for (var i in Fuel) {
							aPayload.push(Fuel[i]);
						}
					}
					if (OilMisc.length) {
						for (var j in OilMisc) {
							aPayload.push(OilMisc[j]);
						}
					}
					aPayload.forEach(function(oItem) {
						oItem.stepid = this.getModel("oRepDetailsModel").getProperty("/stepid");
						// oItem.srvid = this.getModel("oRepDetailsModel").getProperty("/srvtid");
						oItem.srvtid = this.getModel("oRepDetailsModel").getProperty("/srvtid");
						oItem.tailid = this.getTailId();
					}.bind(this));
					var oParameter = {};
					oParameter.error = function() {};
					oParameter.success = function(oData) {
						this.getRouter().navTo("Replenishment", {
							srvtid: this.getModel("oRepDetailsModel").getProperty("/srvtid"),
							stepid: this.getModel("oRepDetailsModel").getProperty("/stepid")
						});
					}.bind(this);
					oParameter.activity = 4;
					ajaxutil.fnCreate("/ReplshmentSvc", oParameter, aPayload, "ZRM_FS_RP", this);
				} else {
					sap.m.MessageToast.show("Serviced amount exceeds total amount.");
				}
			} catch (e) {
				Log.error("Exception in onPressSignOffConfirm function");
				this.handleException(e);
			}
		},

		/*onPressSignOffConfirm1: function(oEvent) {
			var oPayload = this.getModel("oRepDetailsModel").getProperty("/tSrv");
			oPayload.forEach(function(oItem) {
				oItem.stepid = this.getModel("oRepDetailsModel").getProperty("/stepid");
				oItem.srvtid = this.getModel("oRepDetailsModel").getProperty("/srvtid");
				oItem.tailid = this.getTailId();
			}.bind(this));
			var oParameter = {};
			oParameter.error = function() {};
			oParameter.success = function(oData) {
				this.getRouter().navTo("Replenishment", {
					srvtid: this.getModel("oRepDetailsModel").getProperty("/srvtid"),
					stepid: this.getModel("oRepDetailsModel").getProperty("/stepid")
				});
			}.bind(this);
			ajaxutil.fnCreate("/ReplshmentSvc", oParameter, oPayload, "S_RE", this);

			// var oUpdateFlightModel = this.getOwnerComponent().getModel("UpdateFlightModel"),
			// 	sPath = oUpdateFlightModel.getProperty("/sUpdateFlightTilePath");
			// oUpdateFlightModel.setProperty(sPath + "/SignOff", "true");
			// oUpdateFlightModel.setProperty(sPath + "/ImgSrc", "css/img/ReplenishGrn.JPG");
			// this.getOwnerComponent().getRouter().navTo("Replenishment");

		},*/

		onRepleTyrePress: function() {
			try {
				if (!this._oTyrePressure) {
					this._oTyrePressure = sap.ui.xmlfragment("avmet.ah.fragments.flc.TyrePressure", this);
					this.getView().addDependent(this._oTyrePressure);
				}
				this._oTyrePressure.open();
				this._fnAirOverViewHeaderGet();
			} catch (e) {
				Log.error("Exception in onRepleTyrePress function");
				this.handleException(e);
			}
		},

		/*_fnAirOverViewItemGet: function(sSrvId) {
			var that = this,
				oRepDetailsModel = this.getView().getModel("oRepDetailsModel"),
				oPrmWB = {};
			oPrmWB.filter = "FLAG eq I and SRVID eq " + sSrvId + " AND LPTYPE EQ TPRESURE";
			oPrmWB.error = function() {

			};
			oPrmWB.success = function(oData) {
				oRepDetailsModel.setProperty("/TyrePressure", oData.results);
			}.bind(this);

			ajaxutil.fnRead("/LeadPartiSvc", oPrmWB);
		},*/
		_fnAirOverViewHeaderGet: function() {
			try {
				var that = this,
					oRepDetailsModel = this.getView().getModel("oRepDetailsModel"),
					oPrmWB = {};
				//oPrmWB.filter = "FLAG eq H and TAILID eq " + this.getTailId() + " AND LPTYPE EQ OIL";
				oPrmWB.filter = "FLAG eq I AND LPTYPE eq LPTYREPRES and REFID eq " + this.getAircraftId();
				oPrmWB.error = function() {};
				oPrmWB.success = function(oData) {
					oRepDetailsModel.setProperty("/TyrePressure", oData.results);
					/*var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results[0]);
					that.getView().setModel(oModel, "OverViewHeaderModel");*/
					//this._fnAirOverViewItemGet(oData.results[0].SRVID);
				}.bind(this);

				ajaxutil.fnRead("/LeadPartiSvc", oPrmWB);
			} catch (e) {
				Log.error("Exception in _fnAirOverViewHeaderGet function");
				this.handleException(e);
			}
		},

		onRepleTyreClose: function(oEvent) {
			try {
				this._oTyrePressure.close();
				this._oTyrePressure.destroy();
				delete this._oTyrePressure;
			} catch (e) {
				Log.error("Exception in onRepleTyreClose function");
				this.handleException(e);
			}
		},

		onPressBack: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("Replenishment");
			} catch (e) {
				Log.error("Exception in onPressBack function");
				this.handleException(e);
			}
		},

		onReplenishDetailsBack: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("Replenishment");
			} catch (e) {
				Log.error("Exception in onReplenishDetailsBack function");
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
				var oRepDetailsModel = this.getView().getModel("oRepDetailsModel");
				oRepDetailsModel.setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				oRepDetailsModel.setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				oRepDetailsModel.setProperty("/srv", []);
				oRepDetailsModel.setProperty("/sPageTitle", oEvent.getParameter("arguments").srvtid.split("_")[1]);
				this.getModel("oRepDetailsModel").refresh();
				oRepDetailsModel.setProperty("/sSelectedRepl", oEvent.getParameters().arguments.Replenish);
				// this._showTire();
				this.onListSelect(undefined, oEvent.getParameters().arguments.Replenish);
				this._getRepTiles();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},
		// _showTire: function() {
		// 	var oRepDetailsModel = this.getView().getModel("oRepDetailsModel"),
		// 		aSelectItems = oRepDetailsModel.getProperty("/aSelectItems"),
		// 		srvtid = oRepDetailsModel.getProperty("/srvtid");
		// 	if (srvtid === "SRVT_BF" || srvtid === "SRVT_PR" || srvtid === "SRVT_WAI") {
		// 		oRepDetailsModel.setProperty("/aSelectItems", aSelectItems);
		// 		oRepDetailsModel.setProperty("/bTireValidation", true);
		// 	} else {
		// 		aSelectItems.splice(1, 1);
		// 		oRepDetailsModel.setProperty("/ScrollContainerHeight", "80%");
		// 		oRepDetailsModel.setProperty("/bTireValidation", false);
		// 		oRepDetailsModel.setProperty("/aSelectItems", aSelectItems);
		// 	}
		// },

		_getRepTiles: function() {
			try {
				var that = this,
					oRepDetailsModel = this.getView().getModel("oRepDetailsModel"),
					sSelectedRepl = oRepDetailsModel.getProperty("/sSelectedRepl"),
					srvtid = oRepDetailsModel.getProperty("/srvtid"),
					stepid = oRepDetailsModel.getProperty("/stepid"),
					Fuel = [],
					OilMisc = [],
					Tire = [],
					iTotalMaxAmt = 0,
					oParameter = {};
				var filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + srvtid + " and TAILID eq " + this.getTailId() +
					" and STEPID eq " + stepid;
				oParameter.error = function() {};
				oParameter.filter = filter; //"REFID eq AIR_10 and SRVID eq  and TAILID eq TAIL_1015";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].remid === "REM_F") {
								Fuel.push(oData.results[i]);
								iTotalMaxAmt = iTotalMaxAmt + parseInt(oData.results[i].max);
							}
							if (oData.results[i].remid === "REM_O") {
								OilMisc.push(oData.results[i]);
							}
							// if (oData.results[i].remid === "REM_T") {
							// 	Tire.push(oData.results[i]);
							// }
						}
						oRepDetailsModel.setProperty("/iTotalMaxAmt", iTotalMaxAmt);
						oRepDetailsModel.setProperty("/Fuel", Fuel);
						oRepDetailsModel.setProperty("/OilMisc", OilMisc);
						// oRepDetailsModel.setProperty("/Tire", Tire);
						this._getFuelExtTanks();
						oRepDetailsModel.refresh(true);
						that.onListSelect(undefined, sSelectedRepl);
					}
				}.bind(this);
				ajaxutil.fnRead("/ReplshmentSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getRepTiles function");
				this.handleException(e);
			}
		},

		_getFuelExtTanks: function() {
			try {
				var that = this,
					oRepDetailsModel = this.getView().getModel("oRepDetailsModel"),
					sSelectedRepl = oRepDetailsModel.getProperty("/sSelectedRepl"),
					srvtid = oRepDetailsModel.getProperty("/srvtid"),
					stepid = oRepDetailsModel.getProperty("/stepid"),
					Fuel = oRepDetailsModel.getProperty("/Fuel"),
					iTotalMaxAmt = 0,
					//OilMisc = [],
					//Tire = [],
					oParameter = {};
				var filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + srvtid + " and TAILID eq " + this.getTailId() +
					" and STEPID eq " + stepid;
				oParameter.error = function() {};
				oParameter.filter = filter; //"REFID eq AIR_10 and SRVID eq  and TAILID eq TAIL_1015";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].remid === "REM_F") {
								Fuel.push(oData.results[i]);

							}
						}
						if (Fuel.length) {
							for (var i in Fuel) {
								iTotalMaxAmt = iTotalMaxAmt + parseInt(Fuel[i].max);
							}
						}
						oRepDetailsModel.setProperty("/iTotalMaxAmt", iTotalMaxAmt);
						oRepDetailsModel.setProperty("/Fuel", Fuel);
						//oReplenishViewModel.setProperty("/OilMisc", OilMisc);
						//oReplenishViewModel.setProperty("/Tire", Tire);
						oRepDetailsModel.refresh(true);
						that.onListSelect(undefined, sSelectedRepl);
					}
				}.bind(this);
				ajaxutil.fnRead("/ReplRoleSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getFuelExtTanks function");
				this.handleException(e);
			}
		}

	});

});