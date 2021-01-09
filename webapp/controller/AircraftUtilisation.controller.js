sap.ui.define([
	"./BaseController",
	"../util/dataUtil",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log",
	"avmet/ah/util/ajaxutilNew",
	"../util/FilterOpEnum"
], function(BaseController, dataUtil, ajaxutil, formatter, JSONModel, Log, ajaxutilNew, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *	 Developer : KUMAR AMIT	
	 *   Control name: Station           
	 *   Purpose : Display of aircraft utilization and fly log and mano
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *		1.2 onSignOffPress
	 *	 2. Backend Calls
	 *		2.1 fnLogById
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *		3.2 fnSetReason
	 *   Note : 
	 *************************************************************************** */

	return BaseController.extend("avmet.ah.controller.AircraftUtilisation", {
		formatter: formatter,
		onInit: function() {
			try {
				this.getRouter().getRoute("AircraftUtilisation").attachPatternMatched(this._onObjectMatched, this);
				// var utilData = {};
				// utilData.selIndex = 0;
				// utilData.engine = [];
				// // utilData.fly = [];
				// this.getView().setModel(new JSONModel(utilData), "oAircraftUtilModel");
				// // this.getView().byId("landing").setHeaderSpan([3, 1]);
				var utilData = {};
				utilData.selIndex = 0;
				utilData.equiptabId = "TABA_102";
				utilData.flyingtabId = "TABA_103";
				utilData.manotabId = "TABA_104";
				utilData.equip = [];
				utilData.flying = [];
				utilData.mano = [];
				this.getView().setModel(new JSONModel(utilData), "oAircraftUtilModel");

				var oData = {};
				oData.equip = [];
				oData.flying = [];
				oData.mano = [];
				this.getView().setModel(new JSONModel(oData), "oAircraftDataUtilModel");
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:onInit function");
				this.handleException(e);
			}

		},
		onEquipRunEdit: function(oEvent) {

		},

		onCancelAddEquipCancel: function() {
			try {
				this.closeDialog("AddEquipRun");
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:onCancelAddEquipCancel function");
				this.handleException(e);
			}
		},
		onAddEquipRunLog: function() {
			try {
				this.openDialog("AddEquipRun", ".fragments.standalone.equiprunflylog.");
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:onAddEquipRunLog function");
				this.handleException(e);
			}
		},

		onProceedEquipRunLog: function(oEvent) {
			try {
				this.closeDialog("AddEquipRun");
				var oEngins = this.getModel("oAircraftDataUtilModel").getProperty("/equip");
				var sLogid = oEngins.length > 0 ? oEngins[0].logid : "";
				var oIndex = this.getModel("oAircraftUtilModel").getProperty("/selIndex");
				this.getRouter().navTo("AddEquipRunLog", {
					type: oIndex,
					logid: sLogid
				});
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:onProceedEquipRunLog function");
				this.handleException(e);
			}
		},

		_onObjectMatched: function(oEvent) {
			try {
				this.fnLoadEquipClm();
				this.fnLoadEquipData();
				this.fnLoadFlyingClm();
				this.fnLoadFlyingData();
				this.fnLoadManoClm();
				this.fnLoadManoData();
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:_onObjectMatched function");
				this.handleException(e);
			}
		},
		fnLoadEquipClm: function() {
			try {
				var oParameter = {};
				// oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
				// 		"/equiptabId") +
				// 	" and otype eq C";

				oParameter.filter = "refid" + FilterOpEnum.EQ + this.getAircraftId() + "&tabid" + FilterOpEnum.EQ + this.getModel(
						"oAircraftUtilModel").getProperty(
						"/equiptabId") +
					"&otype" + FilterOpEnum.EQ + "C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var columnList = this._addEditColumn(oData.results); // Add blank column for Edit button //Teck Meng 30/11/2020 17:30
					this.getModel("oAircraftUtilModel").setProperty("/equip", columnList); //Teck Meng 30/11/2020 17:30
					// this.getModel("oAircraftUtilModel").setProperty("/equip", oData.results); //Teck Meng 30/11/2020 17:30
					this.getModel("oAircraftUtilModel").refresh();
					this.fnCreateRow(this.getView().byId("tblEquip"), "oAircraftUtilModel", "equip", "oAircraftDataUtilModel");
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadEquipClm function");
				this.handleException(e);
			}
		},
		fnLoadEquipData: function() {
			try {

				var oParameter = {};
				// oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
				// 	"/equiptabId") + " and otype eq AU";
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId() + "&tabid" + FilterOpEnum.EQ + this.getModel(
					"oAircraftUtilModel").getProperty(
					"/equiptabId") + "&otype" + FilterOpEnum.EQ + "AU";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results) {
						oData.results.forEach(function(oItem) {
							oItem.COL_12 = parseFloat(oItem.COL_12).toFixed(1);
						});
						this.getModel("oAircraftDataUtilModel").setProperty("/equip", oData.results);
					}
					this.getModel("oAircraftDataUtilModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadEquipData function");
				this.handleException(e);
			}
		},
		fnLoadFlyingClm: function() {
			try {
				var oParameter = {};
				// oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
				// 		"/flyingtabId") +
				// 	" and otype eq C";
				oParameter.filter = "refid" + FilterOpEnum.EQ + this.getAircraftId() + "&tabid" + FilterOpEnum.EQ + this.getModel(
						"oAircraftUtilModel").getProperty(
						"/flyingtabId") +
					"&otype" + FilterOpEnum.EQ + "C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var columnList = this._addEditColumn(oData.results); // Add blank column for Edit button //Teck Meng 30/11/2020 17:30
					this.getModel("oAircraftUtilModel").setProperty("/flying", columnList); //Teck Meng 30/11/2020 17:30
					// this.getModel("oAircraftUtilModel").setProperty("/flying", oData.results); //Teck Meng 30/11/2020 17:30
					this.getModel("oAircraftUtilModel").refresh();
					this.fnCreateRow(this.getView().byId("tblFlying"), "oAircraftUtilModel", "flying", "oAircraftDataUtilModel");
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadFlyingClm function");
				this.handleException(e);
			}
		},
		fnLoadFlyingData: function() {
			try {
				var oParameter = {};
				// oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
				// 	"/flyingtabId") + " and otype eq AU";
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId() + "&tabid" + FilterOpEnum.EQ + this.getModel(
					"oAircraftUtilModel").getProperty(
					"/flyingtabId") + "&otype" + FilterOpEnum.EQ + "AU";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oAircraftDataUtilModel").setProperty("/flying", oData.results);
					this.getModel("oAircraftDataUtilModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadFlyingData function");
				this.handleException(e);
			}
		},
		fnLoadManoClm: function() {
			try {
				var oParameter = {};
				// oParameter.filter = "refid eq " + this.getAircraftId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
				// 		"/manotabId") +
				// 	" and otype eq C";
				oParameter.filter = "refid" + FilterOpEnum.EQ + this.getAircraftId() + "&tabid" + FilterOpEnum.EQ + this.getModel(
					"oAircraftUtilModel").getProperty(
					"/manotabId") + "&otype" + FilterOpEnum.EQ + "C";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var columnList = this._addEditColumn(oData.results); // Add blank column for Edit button //Teck Meng 30/11/2020 17:30
					this.getModel("oAircraftUtilModel").setProperty("/mano", columnList); //Teck Meng 30/11/2020 17:30
					// this.getModel("oAircraftUtilModel").setProperty("/mano", oData.results); //Teck Meng 30/11/2020 17:30
					this.getModel("oAircraftUtilModel").refresh();
					this.fnCreateRow(this.getView().byId("tblMano"), "oAircraftUtilModel", "mano", "oAircraftDataUtilModel");
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadManoClm function");
				this.handleException(e);
			}
		},
		fnLoadManoData: function() {
			try {
				var oParameter = {};
				// oParameter.filter = "tailid eq " + this.getTailId() + " and tabid eq " + this.getModel("oAircraftUtilModel").getProperty(
				// 	"/manotabId") + " and otype eq AU";
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId() + "&tabid" + FilterOpEnum.EQ + this.getModel(
					"oAircraftUtilModel").getProperty(
					"/manotabId") + "&otype" + FilterOpEnum.EQ + "AU";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oAircraftDataUtilModel").setProperty("/mano", oData.results);
					this.getModel("oAircraftDataUtilModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("AIRCRAFTLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadManoData function");
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
					if (sClmPath === "equip") {

						switch (oItem.colid) {
							case "COL_11":
								sTextProp.path = oDataModel + ">" + "COL_11";
								sTextProp.formatter = that.formatter.defaultDateTimeFormat;
								sText = new sap.m.Text({
									text: sTextProp
								});
								break;
							case "COL_12":
							case "COL_13":
							case "COL_14":
							case "COL_15":
								sTextProp.formatter = that.formatter.decimal1Unit;
								sText = new sap.m.Text({
									text: sTextProp
								});
								break;
								// case "COL_17":
								// 	sTextProp.formatter = that.formatter.numberUnit;
								// 	sText = new sap.m.Text({
								// 		text: sTextProp
								// 	});
								// 	break;
								// case "COL_16":
								// case "COL_17":
							case "COL_16":
								sTextProp.formatter = that.formatter.integerUnit;
								sText = new sap.m.Text({
									text: sTextProp
								});
								break;
							case "COL_EDIT":
								// sTextProp.path = oDataModel + ">" + "COL_11"; //Teck Meng 30/11/2020 17:30
								sTextProp.parts = [oDataModel + ">" + "COL_11", //Teck Meng 30/11/2020 17:30
									oDataModel + ">" + "COL_18"
								]; //Teck Meng 30/11/2020 17:30
								sTextProp.formatter = that.formatter.adtEditVisible;
								sText = new sap.m.Button({
									icon: "sap-icon://edit",
									visible: sTextProp,
									press: function(evt) {
										if (evt.getSource().getParent().getParent().getItems().length > 0) {
											that.onEditEquip(evt); //Teck Meng 30/11/2020 17:30
										}
									}
								});
								break;
							default:
								sText = new sap.m.Text({
									text: "{" + oDataModel + ">" + oItem.colid + "}"
								});
								break;
						}
					} else if (sClmPath === "flying") { //Flying Log
						if (oItem.colid === "COL_EDIT") {
							sTextProp.path = oDataModel + ">" + "COL_11";
							sTextProp.formatter = that.formatter.adtEditVisible;
							sText = new sap.m.Button({
								icon: "sap-icon://edit",
								visible: sTextProp,
								press: function(evt) {
									if (evt.getSource().getParent().getParent().getItems().length > 0) {
										that.onEditEquip(evt); //Teck Meng 30/11/2020 17:30
									}
								}
							});
						} else {
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
						}
					} else if (sClmPath === "mano") { //Manovuer Log
						if (oItem.colid === "COL_EDIT") {
							sTextProp.path = oDataModel + ">" + "COL_11";
							sTextProp.formatter = that.formatter.adtEditVisible;
							sText = new sap.m.Button({
								icon: "sap-icon://edit",
								visible: sTextProp,
								press: function(evt) {
									if (evt.getSource().getParent().getParent().getItems().length > 0) {
										that.onEditEquip(evt); //Teck Meng 30/11/2020 17:30
									}
								}
							});
						} else {
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
						}
					}

					// var sText = new sap.m.Text({
					// 	text: "{" + oDataModel + ">" + oItem.colid + "}"
					// });
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
				Log.error("Exception in AircraftUtilisation:fnCreateRow function");
				this.handleException(e);
			}
		},
		/*fnLoadEngineLong: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					this.getModel("oAircraftUtilModel").setProperty("/engine", oData.results);
					this.getModel("oAircraftUtilModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("AIRCRAFTUTILIZATIONSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in AircraftUtilisation:fnLoadEngineLong function");
				this.handleException(e);
			}
		},*/
		//Teck Meng 30/11/2020 14:00 start-------------
		onEditEquip: function(oEvent) {
			var that = this;
			var currDate = new Date();
			var rowData = oEvent.getSource().getBindingContext("oAircraftDataUtilModel").getObject();
			if (!rowData.SRVID) {
				return;
			}
			this.fnGetRunningChanges(rowData.SRVID);
		},
		/** 
		 * Get RunningChanges then open dialog
		 */
		fnGetRunningChanges: function(sSRVID) {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and REFID eq " + this.getAircraftId() + " and SRVID eq " + sSRVID;
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results && oData.results.length) {
						var aRunningChanges = oData.results.length > 0 ? oData.results : [];
						this.getModel("oAircraftDataUtilModel").setProperty("/runningChange", aRunningChanges);
						if (aRunningChanges && aRunningChanges.length && aRunningChanges.length > 0) { //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
							this.fnOpenPilotUpdate();
						} else { //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
							sap.m.MessageToast.show("No post flight records"); //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
						}

					} else { //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
						sap.m.MessageToast.show("No post flight records"); //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043
					} //Teck Meng change on 30/11/2020 13:00 AH Issue 1044,1043

				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("PILOTINVOLVEDLSVC"), oParameter);
			} catch (e) {
				this.Log.error("Exception in DashboardInitial:fnGetRunningChanges function");
				this.handleException(e);
			}
		},

		/** 
		 * On pilot running changes
		 */
		fnOpenPilotUpdate: function() {
			try {
				// create popover
				if (!this._oRunningChangeDialogInfo) {
					this._oRunningChangeDialogInfo = sap.ui.core.Fragment.load({
						name: "avmet.ah.fragments.EditRunningChange",
						id: this.createId("EditRunningChangeid"),
						controller: this
					}).then(function(pPopover) {
						this._oRunningChangeDialogInfo = pPopover;
						this.getView().addDependent(this._oRunningChangeDialogInfo);
						this._oRunningChangeDialogInfo.open();
					}.bind(this));
				} else {
					this._oRunningChangeDialogInfo.open();
				}
			} catch (e) {
				this.Log.error("Exception in fnOpenPilotUpdate function");
			}
		},
		/** 
		 * On running changes cancel
		 */
		onRunningChangeCancel: function() {
			try {
				this._oRunningChangeDialogInfo.close();
				this._oRunningChangeDialogInfo.destroy();
				delete this._oRunningChangeDialogInfo;
			} catch (e) {
				this.Log.error("Exception in onRunningChangeCancel function");
			}
		},
		/** 
		 * On running pilot change
		 */
		onRunningChangePress: function(oEvent) {
			try {
				var sNum1 = oEvent.getSource().getParent().getContent()[0].getSelectedButton().getBindingContext("oAircraftDataUtilModel").getObject()
					.num1; //Teck Meng 25/11/2020 16:50
				var sSrvtId = oEvent.getSource().getParent().getContent()[0].getSelectedButton().getBindingContext("oAircraftDataUtilModel").getObject()
					.srvtid; //Teck Meng 30/11/2020 16:50
				var sSrvid = oEvent.getSource().getParent().getContent()[0].getSelectedButton().getBindingContext("oAircraftDataUtilModel").getObject()
					.srvid; //Teck Meng 30/11/2020 16:50

				this.getRouter().navTo("PilotUpdates", {
					srvtid: sSrvtId ? sSrvtId : " ",
					stepid: "S_PF",
					num1: sNum1 ? sNum1 : " ", //Teck Meng 30/11/2020 16:50
					srvid: sSrvid ? sSrvid : " " //Teck Meng 30/11/2020 16:50
				});

			} catch (e) {
				this.Log.error("Exception in ReleaseForRectification:onRunningChangePress function");
				this.handleException(e);
			}
		}, //Teck Meng 30/11/2020 14:00 end-------------
		/** //Teck Meng 30/11/2020 17:30 start
		 * Add edit col
		 * @constructor 
		 * @param results
		 * @returns
		 */
		_addEditColumn: function(results) {
				var item = {};
				item.colid = "COL_EDIT";
				item.coltxt = "Edit";
				results.push(item);
				return results;
			} //Teck Meng 30/11/2020 17:30 end

	});
});