sap.ui.define([
	"./BaseController",
	"../util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/base/Log",
	"../util/cvUtil",
	"../util/FilterOpEnum"
], function(BaseController, ajaxutil, JSONModel, formatter, Log, cvUtil, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *   Control name: UpdateWDNSView           
	 *   Purpose : Update WDNS controller
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *		1.2 onChange	 
	 *		1.3 onSignOffPress
	 *	 2. Backend Calls
	 *		2.1 fnLoadCanopyClm
	 *		2.2 fnLoadCTVSClm
	 *		2.3 fnLoadFCCClm
	 *		2.4 fnLoadCanopyData
	 *		2.5 fnLoadCTVSData
	 *		2.6 fnLoadfccData	 
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *		3.2 fnCreateRow
	 *		3.3 fnSubmitSignOff
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.UpdateWDNSView", {
		formatter: formatter,
		// ***************************************************************************
		//     1. UI Events  
		// ***************************************************************************
		/**		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ZWDNS.view.UpdateWDNSView
		 */
		onInit: function() {
			try {
				this.getRouter().getRoute("UpdateWDNSView").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:onInit function");
				this.handleException(e);
			}
		},

		_onObjectMatched: function(oEvent) {
			try {
				var utilData = {};
				utilData.isChange = false;
				utilData.selIndex = 0;
				utilData.harmotabId = "TABW_115";
				//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				utilData.dhtabId = "TABW_116";
				utilData.harmo = [];
				utilData.dh = []; //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				this.getView().setModel(new JSONModel(utilData), "oWDNSModel");

				var oData = {};
				oData.harmo = [];
				oData.dh = []; //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				this.getView().setModel(new JSONModel(oData), "oWDNSDataModel");

				//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				this.getModel("oWDNSModel").setProperty("/tabid", oEvent.getParameter("arguments").tabid);
				var sTabid = this.getModel("oWDNSModel").getProperty("/tabid");
				switch (sTabid) {
					case "TABW_115": //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
						this.fnLoadHarmClm();
						this.fnLoadHarmData();
						break;
					case "TABW_116": //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
						this.fnLoadDHClm();
						this.fnLoadDHData();
						break;
					default: //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
						this.getModel("oWDNSModel").setProperty("/tabid", "ALL");
						this.fnLoadDHClm();
						this.fnLoadDHData();
						this.fnLoadHarmClm();
						this.fnLoadHarmData();
				} //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
				//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:_onObjectMatched function");
				this.handleException(e);
			}
		},
		onViewPastRecord: function(oEvent) {
			try {
				this.getRouter().navTo("UpdateWDNSView");
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:onViewPastRecord function");
				this.handleException(e);
			}
		},
		onUpdateRecord: function() {
			try {
				this.getRouter().navTo("UpdateWDNSView");
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:onUpdateRecord function");
				this.handleException(e);
			}
		},
		fnLoadHarmClm: function() {
			try {
				var oParameter = {};
				// oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oWDNSModel").getProperty("/harmotabId") +
				// 	" and otype eq C";
				oParameter.filter = "refid" + FilterOpEnum.EQ + this.getAircraftId() + "&tabid" + FilterOpEnum.EQ + this.getModel("oWDNSModel").getProperty(
						"/harmotabId") +
					"&otype" + FilterOpEnum.EQ + "C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.deleteColumn(oData);
					this.getModel("oWDNSModel").setProperty("/harmo", oData.results);
					this.getModel("oWDNSModel").refresh();
					this.fnCreateRow(this.getView().byId("tblUpHarmonic"), "oWDNSModel", "harmo", "oWDNSDataModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:fnLoadHarmClm function");
				this.handleException(e);
			}
		},
		fnLoadHarmData: function() {
			try {
				// var sPilot = this.getModel("oWDNSModel").getProperty("/pilot");
				// var bPilot = (sPilot === "GUNDH");
				var oParameter = {};
				// oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oWDNSModel").getProperty(
				// 	"/harmotabId") + " and otype eq D";
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId() + "&tabid" + FilterOpEnum.EQ + this.getModel("oWDNSModel").getProperty(
						"/harmotabId") +
					"&otype" + FilterOpEnum.EQ + "D";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					// if(oData.results) {
					// 	oData.results.forEach(function(oItem){
					// 		oItem.bPilot = bPilot;
					// 	});
					// }
					this.getModel("oWDNSDataModel").setProperty("/harmo", oData.results);
					this.getModel("oWDNSDataModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:fnLoadHarmData function");
				this.handleException(e);
			}
		},
		/** //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * Load harmonic columns
		 */
		fnLoadDHClm: function() { //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
			try {
				var oParameter = {};
				// oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oWDNSModel").getProperty("/dhtabId") +
				// 	" and otype eq C";
				oParameter.filter = "refid" + FilterOpEnum.EQ + this.getAircraftId() + "&tabid" + FilterOpEnum.EQ + this.getModel("oWDNSModel").getProperty(
						"/dhtabId") +
					"&otype" + FilterOpEnum.EQ + "C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oWDNSModel").setProperty("/dh", oData.results);
					this.getModel("oWDNSModel").refresh();
					this.fnCreateRow(this.getView().byId("tblDH"), "oWDNSModel", "dh", "oWDNSDataModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) { //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
				Log.error("Exception in WDNSCoefficients:fnLoadDHClm function");
				this.handleException(e);
			}
		}, //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
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
					// oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oWDNSModel").getProperty(
					// 	"/dhtabId") + " and otype eq D";
					oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId() + "&tabid" + FilterOpEnum.EQ + this.getModel("oWDNSModel").getProperty(
							"/dhtabId") +
						"&otype" + FilterOpEnum.EQ + "D";
				}
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oWDNSDataModel").setProperty("/dh", oData.results);
					this.getModel("oWDNSDataModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
			} catch (e) { //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
				Log.error("Exception in WDNSCoefficients:fnLoadDHData function");
				this.handleException(e);
			}
		}, //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
		deleteColumn: function(oData) {
			try {
				if (!oData || !oData.results || oData.results.length < 3) {
					return "";
				}
				oData.results.splice(oData.results.length - 2, 2);
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:deleteColumn function");
				this.handleException(e);
			}
		},
		fnCreateRow: function(tblRef, oModel, sClmPath, oDataModel) {
			try {
				var oCells = [];
				var that = this;
				// var sPilot = this.getModel("oWDNSModel").getProperty("/pilot");
				// var bPilot = (sPilot === "GUNDH");

				// {parts : ['oReplModel>srvamt','oReplModel>max'], formatter : 'avmet.ah.model.formatter.FuelMCState'}" press="press"

				this.getModel(oModel).getProperty("/" + sClmPath).forEach(function(oItem) {
					// var sWDNSVisibleProp = {};
					// 	sWDNSVisibleProp.parts = [oDataModel + ">" + oItem.colid];
					// 	sWDNSVisibleProp.formatter = this.formatter.fnWDNSVisibleRow;

					// oItem.bPilot = bPilot;

					var sText = new sap.m.Text({
						text: "{" + oDataModel + ">" + oItem.colid + "}"
							// visible: sWDNSVisibleProp
					});

					if (oItem.edtb === "X") {

						var sEditProp = {};
						sEditProp.path = oDataModel + ">" + oItem.colid;
						sEditProp.formatter = this.formatter.fnEditableCol;

						var sWDNSEditProp = {};
						sWDNSEditProp.path = oDataModel + ">" + oItem.colid;
						sWDNSEditProp.formatter = this.formatter.fnWDNSEditableCol;

						sText = new sap.m.Input({
							value: "{" + oDataModel + ">" + oItem.colid + "}",
							maxLength: 20,
							fieldGroupIds: ["fgInput"],
							editable: (oItem.colid === "COL_15") ? sEditProp : sWDNSEditProp,
							// visible: sWDNSVisibleProp,
							// required: true,
							// valueState: "{= !!${" + oDataModel + ">" + oItem.colid + "} ? 'None' : 'Error' }",
							liveChange: that.onChange
								// function(oEvent) {
								// 	cvUtil.onLiveChange(oEvent, false);
								// }
						});
					}
					// if (oItem && oItem.coltxt && (oItem.coltxt === "Updated By" || oItem.coltxt === "Date")) {
					// 	return;
					// }

					oCells.push(sText);
				}.bind(this));
				if (oCells.length === 0) {
					tblRef.setVisible(false);
				}
				var sColum = new sap.m.ColumnListItem({
					cells: oCells
				});
				if (tblRef) {
					tblRef.bindAggregation("items", oDataModel + ">/" + sClmPath, sColum);
				}
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:fnCreateRow function");
				this.handleException(e);
			}
		},

		onChange: function(oEvent) {
			try {
				// var oSource = oEvent.getSource();
				// var oItem = oSource.getBindingContext("oWDNSDataModel").getObject();
				// oItem.editFlag = "X";
				this.getModel("oWDNSModel").setProperty("/isChange", true);
				cvUtil.onLiveChange(oEvent, false);
				this.getModel("oWDNSModel").refresh();
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:onChange function");
				this.handleException(e);
			}
		},
		onSignOffPress: function() {
			try {
				this.fnSubmitSignOff("oWDNSModel", "oWDNSDataModel");
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:onSignOffPress function");
				this.handleException(e);
			}
		},
		/** 
		 * Update to AircraftLogSvc
		 * @param tblRef
		 * @param oModel
		 * @param sClmPath
		 * @param oDataModel
		 */
		fnSubmitSignOff: function(oModel, oDataModel) {
			try {
				var sPath = this.getResourceBundle().getText("AIRCRAFTLOGSVC");
				var oData = [];
				var oParameter = {};
				oParameter.activity = 2;
				var sClmPath = "harmo";
				// var sPilot = this.getModel("oWDNSModel").getProperty("/pilot");
				// var bPilot = sPilot === "GUNDH";
				if (this.getView().getModel(oModel).getProperty("/isChange")) {
					//<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					if (this.getModel("oWDNSModel").getProperty("/tabid") === "TABW_115") {
						this.getModel(oDataModel).getProperty("/" + sClmPath).forEach(function(oItem) {
							var oPayload = {};
							// delete oItem.editFlag;
							oPayload = oItem;
							oData.push(oPayload);
						}); //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					} //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					sClmPath = "dh"; <!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					if (this.getModel("oWDNSModel").getProperty("/tabid") === "TABW_116") {
						this.getModel(oDataModel).getProperty("/" + sClmPath).forEach(function(oItem) {
							var oPayload = {};
							// delete oItem.editFlag;
							oPayload = oItem;
							oData.push(oPayload);

						}); //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					} //<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					//<!--//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					// this.getModel(oDataModel).getProperty("/" + sClmPath).forEach(function(oItem) {
					// 	// if ((bPilot && oItem.COL_12 === "GUN DH") || !bPilot && oItem.COL_12 !== "GUN DH") {
					// 	var oPayload = {};
					// 	oPayload = oItem;
					// 	oData.push(oPayload);
					// 	// }
					// });
					//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				}
				oParameter.error = function() {};
				oParameter.success = function(oRespond) {
					sap.m.MessageToast.show("Tables updated");
					this.onNavBack();
				}.bind(this);
				if (oData.length > 0) {
					ajaxutil.fnCreate(sPath, oParameter, oData, "ZRM_WDNS_H", this);
				} else {
					sap.m.MessageToast.show("No table are changed");
				}
			} catch (e) {
				Log.error("Exception in UpdateWDNSView:fnSubmitSignOff function");
				this.handleException(e);
			}
		}
	});

});