sap.ui.define([
	"../model/models",
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"../model/dataUtil",
	"sap/m/MessageBox",
	"sap/base/Log"
], function(models, BaseController, JSONModel, ajaxutil, formatter, dataUtil, MessageBox, Log) {
	"use strict";
	return BaseController.extend("avmet.ah.controller.RoleChangeStations", {
		formatter: formatter,
		/* ================================================================================================= */
		//Developer : Priya
		/* lifecycle methods                                           */
		/* =========================================================================================================== */
		onInit: function() {
			try {
				var oModel = new JSONModel({
					"Stations": [],
					"Adaptors": [],
					"Tanks": [],
					"ImagePath": "",
					"ArrowImagePath": "css/img/DoubleArrow2.JPG",
					"InstallImagePath": "css/img/Install.JPG",
					"TileOneHeader": "",
					"TileTwoHeader": "",
					"TileThreeHeader": "",
					"StationName": "",
					"bDropSection": true,
					"bGunSection": false,
					"bHotColdSection": false,
					"bNoDrop": false,
					"bStation5": false,
					"iMaxValueEntered": "",
					"iSLNo": "",
					"bPushTank": true,
					"bICART": false,
					"tabSelected": "Tradesman"
				});
				this.getView().setModel(oModel, "oRoleChangeModel");
				//this.setModel(models.createMainModel(), "RoleChange");
				this.getRouter().getRoute("RoleChangeStations").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		/* =========================================================================================================== */
		/* event handlers                                              */
		/* ========================================================================================================== */

		onBack: function() {
			try {
				this.onNavBack();
			} catch (e) {
				Log.error("Exception in onBack function");
				this.handleException(e);
			}
		},

		onTanksChange: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					oSelTank = oEvent.getParameter("listItem").getBindingContext("oRoleChangeModel").getObject();
				oModel.setProperty("/oSelTank", oSelTank);

				if (oSelTank.ISSER === "X") {
					this.bTankOrLauncher = "Tank";
					this._fnShowSLNo();

				} else {
					this._fnDropTank();
				}
				if (oSelTank.ICART === "X") {
					oModel.setProperty("/bICART", true);
				} else {
					oModel.setProperty("/bICART", false);
				}
			} catch (e) {
				Log.error("Exception in onTanksChange function");
				this.handleException(e);
			}
		},
		onSaveSLNo: function() {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath"),
					iSLNo = oModel.getProperty("/iSLNo");
				oModel.setProperty(sSelectedStationPath + "/SERNR", iSLNo);
				if (this.bTankOrLauncher === "Launcher") {
					this.onLauncherChange1();
				} else if (this.bTankOrLauncher === "Tank") {
					this._fnDropTank();
				}
				this.onCloseSLNo();
			} catch (e) {
				Log.error("Exception in onSaveSLNo function");
				this.handleException(e);
			}
		},

		_fnCheckStationData: function(oSelectedItem, oSelectedStation) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath");
				if (oSelectedStation.AdpId0 === oSelectedItem.ADPID) {
					oModel.setProperty(sSelectedStationPath + "/Drop0", oSelectedItem.ADPDESC);
					oModel.setProperty(sSelectedStationPath + "/AdpId0", oSelectedItem.ADPID);
					oModel.setProperty(sSelectedStationPath + "/Drop0Apd", oSelectedItem);
					oModel.setProperty("/TileZeroHeader", oModel.getProperty(sSelectedStationPath + "/Drop0"));
					if (oSelectedItem.ISSER === "X") {
						oModel.setProperty(sSelectedStationPath + "/SLNo0", oModel.getProperty("/iSLNo"));
						oModel.setProperty("/SLNo0", oModel.getProperty(sSelectedStationPath + "/SLNo0"));
					}
					return "NoCheckReq";
				} else if (oSelectedStation.AdpId1 === oSelectedItem.ADPID) {
					oModel.setProperty(sSelectedStationPath + "/Drop1", oSelectedItem.ADPDESC);
					oModel.setProperty(sSelectedStationPath + "/AdpId1", oSelectedItem.ADPID);
					oModel.setProperty(sSelectedStationPath + "/Drop1Apd", oSelectedItem);
					oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
					if (oSelectedItem.ISSER === "X") {
						oModel.setProperty(sSelectedStationPath + "/SLNo1", oModel.getProperty("/iSLNo"));
						oModel.setProperty("/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo1"));
					}
					return "NoCheckReq";
				} else if (oSelectedStation.AdpId2 === oSelectedItem.ADPID) {
					oModel.setProperty(sSelectedStationPath + "/Drop2", oSelectedItem.ADPDESC);
					oModel.setProperty(sSelectedStationPath + "/AdpId2", oSelectedItem.ADPID);
					oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oSelectedItem);
					oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
					if (oSelectedItem.ISSER === "X") {
						oModel.setProperty(sSelectedStationPath + "/SLNo2", oModel.getProperty("/iSLNo"));
						oModel.setProperty("/SLNo2", oModel.getProperty(sSelectedStationPath + "/SLNo2"));
					}
					return "NoCheckReq";
				} else {
					return "CheckReq";
				}
			} catch (e) {
				Log.error("Exception in _fnCheckStationData function");
				this.handleException(e);
			}
		},

		_fnDropTank: function() {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					aAllPylons = oModel.getProperty("/aAllPylons"),
					oSelectedStation = oModel.getProperty("/oSelectedStation"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath"),
					oSelTank = oModel.getProperty("/oSelTank");

				var sResult = this._fnCheckStationData(oSelTank, oSelectedStation);

				if (sResult === "CheckReq") {
					if (oSelTank.SUBID === "STNS_104") {
						if (oSelectedStation.Drop0 !== "") {
							var check = false;
							for (var i in aAllPylons) {
								try {
									if (aAllPylons[i].SEQID === oSelTank.SEQID) {
										oModel.setProperty(sSelectedStationPath + "/Drop2", oSelTank.ADPDESC);
										oModel.setProperty(sSelectedStationPath + "/AdpId2", oSelTank.ADPID);
										oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oSelTank);
										oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
										if (oSelTank.ISSER === "X") {
											oModel.setProperty(sSelectedStationPath + "/SLNo2", oModel.getProperty("/iSLNo"));
											oModel.setProperty("/SLNo2", oModel.getProperty(sSelectedStationPath + "/SLNo2"));
										}
										check = true;
									}
								} catch (e) {
									Log.error("Exception in _fnDropTank>'For Loop' function");
									this.handleException(e);
								}
							}
							if (!check) {
								sap.m.MessageToast.show("Adaptors doesn't match");
							}

						} else {
							sap.m.MessageToast.show("Please select pylon");
						}
					} else {
						if (oSelTank.NUM1 === "0" && oSelectedStation.Drop0 === "" && oSelectedStation.Drop1 === "") {
							oModel.setProperty(sSelectedStationPath + "/Drop0", oSelTank.ADPDESC);
							oModel.setProperty(sSelectedStationPath + "/AdpId0", oSelTank.ADPID);
							oModel.setProperty(sSelectedStationPath + "/Drop0Apd", oSelTank);
							oModel.setProperty("/TileZeroHeader", oModel.getProperty(sSelectedStationPath + "/Drop0"));
							if (oSelTank.ISSER === "X") {
								oModel.setProperty(sSelectedStationPath + "/SLNo0", oModel.getProperty("/iSLNo"));
								oModel.setProperty("/SLNo0", oModel.getProperty(sSelectedStationPath + "/SLNo0"));
							}

							oModel.setProperty(sSelectedStationPath + "/Drop1", "");
							oModel.setProperty(sSelectedStationPath + "/AdpId1", "");
							oModel.setProperty(sSelectedStationPath + "/Drop1Apd", "");
							oModel.setProperty("/TileOneHeader", "");

							oModel.setProperty(sSelectedStationPath + "/Drop2", "");
							oModel.setProperty(sSelectedStationPath + "/AdpId2", "");
							oModel.setProperty(sSelectedStationPath + "/Drop2Apd", "");
							oModel.setProperty("/TileTwoHeader", "");
						} else {
							if (oSelectedStation.Drop0 === "" && oSelectedStation.Drop1 === "") {
								sap.m.MessageToast.show("Please select pylon");
							} else if (oSelectedStation.Drop0 !== "") {
								if (oSelectedStation.Drop0Apd.POT === "P") {
									var check = false;
									for (var i in aAllPylons) {
										try {
											if (aAllPylons[i].SEQID === oSelTank.SEQID) {
												if (aAllPylons[i].NUM1 === "1") {
													oModel.setProperty(sSelectedStationPath + "/Drop0", "");
													oModel.setProperty(sSelectedStationPath + "/AdpId0", "");
													oModel.setProperty(sSelectedStationPath + "/Drop0Apd", "");
													oModel.setProperty("/TileZeroHeader", "");
													oModel.setProperty(sSelectedStationPath + "/Drop1", aAllPylons[i].ADPDESC);
													oModel.setProperty(sSelectedStationPath + "/AdpId1", aAllPylons[i].ADPID);
													oModel.setProperty(sSelectedStationPath + "/Drop1Apd", aAllPylons[i]);
													oModel.setProperty(sSelectedStationPath + "/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo0"));
													oModel.setProperty(sSelectedStationPath + "/SLNo0", "");
													oModel.setProperty("/SLNo0", oModel.getProperty(sSelectedStationPath + "/SLNo0"));
													oModel.setProperty("/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo1"));

													oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
													oModel.setProperty(sSelectedStationPath + "/Drop2", oSelTank.ADPDESC);
													oModel.setProperty(sSelectedStationPath + "/AdpId2", oSelTank.ADPID);
													oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oSelTank);
													oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
													if (oSelTank.ISSER === "X") {
														oModel.setProperty(sSelectedStationPath + "/SLNo2", oModel.getProperty("/iSLNo"));
														oModel.setProperty("/SLNo2", oModel.getProperty(sSelectedStationPath + "/SLNo2"));
													}
													check = true;
												}
											}
										} catch (e) {
											Log.error("Exception in _fnDropTank>'For Loop 2' function");
											this.handleException(e);
										}
									}
									if (!check) {
										sap.m.MessageToast.show("Adaptors doesn't match");
									}
								} else {
									sap.m.MessageToast.show("Adaptors doesn't match");
								}
							} else if (oSelectedStation.Drop1 !== "") {
								if (oSelectedStation.Drop1Apd.POT === "P") {
									var check = false;
									for (var i in aAllPylons) {
										try {
											if (aAllPylons[i].SEQID === oSelTank.SEQID) {
												if (aAllPylons[i].NUM1 === "1") {
													oModel.setProperty(sSelectedStationPath + "/Drop0", "");
													oModel.setProperty(sSelectedStationPath + "/AdpId0", "");
													oModel.setProperty(sSelectedStationPath + "/Drop0Apd", "");
													oModel.setProperty("/TileZeroHeader", "");
													oModel.setProperty(sSelectedStationPath + "/Drop1", aAllPylons[i].ADPDESC);
													oModel.setProperty(sSelectedStationPath + "/AdpId1", aAllPylons[i].ADPID);
													oModel.setProperty(sSelectedStationPath + "/Drop1Apd", aAllPylons[i]);
													oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
													oModel.setProperty(sSelectedStationPath + "/Drop2", oSelTank.ADPDESC);
													oModel.setProperty(sSelectedStationPath + "/AdpId2", oSelTank.ADPID);
													oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oSelTank);
													oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
													if (oSelTank.ISSER === "X") {
														oModel.setProperty(sSelectedStationPath + "/SLNo2", oModel.getProperty("/iSLNo"));
														oModel.setProperty("/SLNo2", oModel.getProperty(sSelectedStationPath + "/SLNo2"));
													}
													check = true;
												}
											}
										} catch (e) {
											Log.error("Exception in _fnDropTank>'For Loop3' function");
											this.handleException(e);
										}
									}
									if (!check) {
										sap.m.MessageToast.show("Adaptors doesn't match");
									}
								} else {
									sap.m.MessageToast.show("Adaptors doesn't match");
								}
							} else {
								if (oSelTank.NUM1 === "2" && oSelTank.ADPDESC !== oSelectedStation.Drop2Apd.ADPDESC) {
									sap.m.MessageToast.show("Adaptors doesn't match");
								} else if (oSelTank.NUM1 === "0" && oSelectedStation.Drop1 !== "") {
									sap.m.MessageToast.show("Adaptors doesn't match");
								}
							}
						}
					}
				}
				this.getView().byId("LisLauncher").removeSelections(true);
				this.getView().byId("LisPylon").removeSelections(true);
				this.getView().byId("LisTanks").removeSelections(true);
				oModel.setProperty("/iSLNo", "");
			} catch (e) {
				Log.error("Exception in _fnDropTank function");
				this.handleException(e);
			}
		},

		onLauncherChange: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					oSelLauncher = oEvent.getParameter("listItem").getBindingContext("oRoleChangeModel").getObject();
				oModel.setProperty("/oSelLauncher", oSelLauncher);

				if (oSelLauncher.ISSER === "X") {
					this.bTankOrLauncher = "Launcher";
					this._fnShowSLNo();
				} else {
					this.onLauncherChange1();
				}
			} catch (e) {
				Log.error("Exception in onLauncherChange function");
				this.handleException(e);
			}

		},

		onLauncherChange1: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					aAllLaunchers = oModel.getProperty("/aAllLaunchers"),
					oSelectedStation = oModel.getProperty("/oSelectedStation"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath"),
					oSelLauncher = oModel.getProperty("/oSelLauncher"), //oEvent.getParameter("listItem").getBindingContext("oRoleChangeModel").getObject(),
					aSameLaunchers = [];
				if (oSelLauncher.ISSER === "X") {
					var bInsertSlNo = true;
				} else {
					var bInsertSlNo = true;
				}
				var sResult = this._fnCheckStationData(oSelLauncher, oSelectedStation);

				if (sResult === "CheckReq") {

					for (var i in aAllLaunchers) {
						try {
							if (aAllLaunchers[i].ADPID === oSelLauncher.ADPID) {
								aSameLaunchers.push(aAllLaunchers[i]);
							}
						} catch (e) {
							Log.error("Exception in onLauncherChange1>'For Loop' function");
							this.handleException(e);
						}
					}
					if (oSelectedStation.Drop0 !== "" && oSelLauncher.NUM1 === "2") {
						if (oSelectedStation.Drop0Apd.POT === "L") {
							var check = false;
							for (var i in aAllLaunchers) {
								try {
									if (aAllLaunchers[i].SEQID === oSelLauncher.SEQID && aAllLaunchers[i].ADPDESC === oSelectedStation.Drop0Apd.ADPDESC) {
										if (aAllLaunchers[i].NUM1 === "1") {
											oModel.setProperty(sSelectedStationPath + "/Drop0", "");
											oModel.setProperty(sSelectedStationPath + "/AdpId0", "");
											oModel.setProperty(sSelectedStationPath + "/Drop0Apd", "");
											oModel.setProperty("/TileZeroHeader", "");
											oModel.setProperty(sSelectedStationPath + "/Drop1", aAllLaunchers[i].ADPDESC);
											oModel.setProperty(sSelectedStationPath + "/AdpId1", aAllLaunchers[i].ADPID);
											oModel.setProperty(sSelectedStationPath + "/Drop1Apd", aAllLaunchers[i]);
											oModel.setProperty(sSelectedStationPath + "/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo0"));
											oModel.setProperty(sSelectedStationPath + "/SLNo0", "");
											oModel.setProperty("/SLNo0", oModel.getProperty(sSelectedStationPath + "/SLNo0"));
											oModel.setProperty("/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo1"));
											oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
											oModel.setProperty(sSelectedStationPath + "/Drop2", oSelLauncher.ADPDESC);
											oModel.setProperty(sSelectedStationPath + "/AdpId2", oSelLauncher.ADPID);
											oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oSelLauncher);
											oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
											if (oSelLauncher.ISSER === "X") {
												oModel.setProperty(sSelectedStationPath + "/SLNo2", oModel.getProperty("/iSLNo"));
												oModel.setProperty("/SLNo2", oModel.getProperty(sSelectedStationPath + "/SLNo2"));
											}
											check = true;
										}
									}
								} catch (e) {
									Log.error("Exception in onLauncherChange1>'For Loop2' function");
									this.handleException(e);
								}
							}
							if (!check) {
								sap.m.MessageToast.show("Adaptors doesn't match");
							}
						} else {
							sap.m.MessageToast.show("Adaptors doesn't match");
						}
					} else if (oSelLauncher.NUM1 === "2" && oSelectedStation.Drop1 === "") {
						sap.m.MessageToast.show("Cant install");
					} else {
						var bSelLaucherChange = false;
						if (aSameLaunchers.length >= 2) {
							if (oSelectedStation.Drop0 === "" && oSelectedStation.Drop1 === "" && oSelectedStation.Drop2 === "") {
								for (var i in aSameLaunchers) {
									try {
										if (aSameLaunchers[i].APDID === oSelLauncher.APDID && aSameLaunchers[i].NUM1 === "0") {
											oSelLauncher = aSameLaunchers[i];
											bSelLaucherChange = true;
										}
									} catch (e) {
										Log.error("Exception in onLauncherChange1>'For Loop3' function");
										this.handleException(e);
									}
								}
								if (bSelLaucherChange) {
									oModel.setProperty(sSelectedStationPath + "/Drop0", oSelLauncher.ADPDESC);
									oModel.setProperty(sSelectedStationPath + "/AdpId0", oSelLauncher.ADPID);
									oModel.setProperty(sSelectedStationPath + "/Drop0Apd", oSelLauncher);
									oModel.setProperty("/TileZeroHeader", oModel.getProperty(sSelectedStationPath + "/Drop0"));
									if (oSelLauncher.ISSER === "X") {
										oModel.setProperty(sSelectedStationPath + "/SLNo0", oModel.getProperty("/iSLNo"));
										oModel.setProperty("/SLNo0", oModel.getProperty(sSelectedStationPath + "/SLNo0"));
									}

								} else {
									if (oSelLauncher.NUM1 === "0") {
										oModel.setProperty(sSelectedStationPath + "/Drop0", oSelLauncher.ADPDESC);
										oModel.setProperty(sSelectedStationPath + "/AdpId0", oSelLauncher.ADPID);
										oModel.setProperty(sSelectedStationPath + "/Drop0Apd", oSelLauncher);
										oModel.setProperty("/TileZeroHeader", oModel.getProperty(sSelectedStationPath + "/Drop0"));
										if (oSelLauncher.ISSER === "X") {
											oModel.setProperty(sSelectedStationPath + "/SLNo0", oModel.getProperty("/iSLNo"));
											oModel.setProperty("/SLNo0", oModel.getProperty(sSelectedStationPath + "/SLNo0"));
										}
									} else if (oSelLauncher.NUM1 === "1") {
										oModel.setProperty(sSelectedStationPath + "/Drop1", oSelLauncher.ADPDESC);
										oModel.setProperty(sSelectedStationPath + "/AdpId1", oSelLauncher.ADPID);
										oModel.setProperty(sSelectedStationPath + "/Drop1Apd", oSelLauncher);
										oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
										if (oSelLauncher.ISSER === "X") {
											oModel.setProperty(sSelectedStationPath + "/SLNo1", oModel.getProperty("/iSLNo"));
											oModel.setProperty("/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo1"));
										}
									}
								}
							} else if (oSelectedStation.Drop0 === "" && oSelectedStation.Drop1 !== "") {
								for (var i in aSameLaunchers) {
									try {
										if (aSameLaunchers[i].APDID === oSelLauncher.APDID && aSameLaunchers[i].NUM1 === "2") {
											oSelLauncher = aSameLaunchers[i];
										}
									} catch (e) {
										Log.error("Exception in onLauncherChange1>'For Loop4' function");
										this.handleException(e);
									}
								}
								if (oSelLauncher.ADPDESC !== oSelectedStation.Drop1Apd.ADPDESC && oSelLauncher.SEQID === oSelectedStation.Drop1Apd.SEQID) {
									oModel.setProperty(sSelectedStationPath + "/Drop2", oSelLauncher.ADPDESC);
									oModel.setProperty(sSelectedStationPath + "/AdpId2", oSelLauncher.ADPID);
									oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oSelLauncher);
									oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
									if (oSelLauncher.ISSER === "X") {
										oModel.setProperty(sSelectedStationPath + "/SLNo2", oModel.getProperty("/iSLNo"));
										oModel.setProperty("/SLNo2", oModel.getProperty(sSelectedStationPath + "/SLNo2"));
									}
								} else {
									sap.m.MessageToast.show("Adaptors doesn't match");
								}
							}
						} else {
							if (oSelLauncher.NUM1 === "0" && oSelectedStation.Drop0 === "") {
								oModel.setProperty(sSelectedStationPath + "/Drop0", oSelLauncher.ADPDESC);
								oModel.setProperty(sSelectedStationPath + "/AdpId0", oSelLauncher.ADPID);
								oModel.setProperty(sSelectedStationPath + "/Drop0Apd", oSelLauncher);
								oModel.setProperty("/TileZeroHeader", oModel.getProperty(sSelectedStationPath + "/Drop0"));
								if (oSelLauncher.ISSER === "X") {
									oModel.setProperty(sSelectedStationPath + "/SLNo0", oModel.getProperty("/iSLNo"));
									oModel.setProperty("/SLNo0", oModel.getProperty(sSelectedStationPath + "/SLNo0"));
								}

								oModel.setProperty(sSelectedStationPath + "/Drop1", "");
								oModel.setProperty(sSelectedStationPath + "/AdpId1", "");
								oModel.setProperty(sSelectedStationPath + "/Drop1Apd", "");
								oModel.setProperty("/TileOneHeader", "");

								oModel.setProperty(sSelectedStationPath + "/Drop2", "");
								oModel.setProperty(sSelectedStationPath + "/AdpId2", "");
								oModel.setProperty(sSelectedStationPath + "/Drop2Apd", "");
								oModel.setProperty("/TileTwoHeader", "");
							} else if (oSelLauncher.NUM1 === "1" && oSelectedStation.Drop1 === "") {
								if (oSelectedStation.Drop0 !== "") {
									if (oSelectedStation.Drop0Apd.SEQID === oSelLauncher.SEQID) {
										oModel.setProperty(sSelectedStationPath + "/Drop1", oSelLauncher.ADPDESC);
										oModel.setProperty(sSelectedStationPath + "/AdpId1", oSelLauncher.ADPID);
										oModel.setProperty(sSelectedStationPath + "/Drop1Apd", oSelLauncher);
										oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
										if (oSelLauncher.ISSER === "X") {
											oModel.setProperty(sSelectedStationPath + "/SLNo1", oModel.getProperty("/iSLNo"));
											oModel.setProperty("/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo1"));
										}
									} else {
										sap.m.MessageToast.show("Adaptors doesn't match");
									}
								} else {
									oModel.setProperty(sSelectedStationPath + "/Drop1", oSelLauncher.ADPDESC);
									oModel.setProperty(sSelectedStationPath + "/AdpId1", oSelLauncher.ADPID);
									oModel.setProperty(sSelectedStationPath + "/Drop1Apd", oSelLauncher);
									oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
									if (oSelLauncher.ISSER === "X") {
										oModel.setProperty(sSelectedStationPath + "/SLNo1", oModel.getProperty("/iSLNo"));
										oModel.setProperty("/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo1"));
									}
								}
							} else if (oSelLauncher.NUM1 === "2" && oSelectedStation.Drop2 === "") {
								if (oSelectedStation.Drop1 !== "") {
									if (oSelectedStation.Drop1Apd.SEQID === oSelLauncher.SEQID) {
										oModel.setProperty(sSelectedStationPath + "/Drop2", oSelLauncher.ADPDESC);
										oModel.setProperty(sSelectedStationPath + "/AdpId2", oSelLauncher.ADPID);
										oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oSelLauncher);
										oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
										if (oSelLauncher.ISSER === "X") {
											oModel.setProperty(sSelectedStationPath + "/SLNo2", oModel.getProperty("/iSLNo"));
											oModel.setProperty("/SLNo2", oModel.getProperty(sSelectedStationPath + "/SLNo2"));
										}
									} else {
										var aAllLaunchers = oModel.getProperty("/aAllLaunchers");
										var bAdpMatched = false;
										for (var i in aAllLaunchers) {
											try {
												if (aAllLaunchers[i].SEQID === oSelLauncher.SEQID && aAllLaunchers[i].ADPDESC === oSelectedStation.Drop1Apd.ADPDESC) {
													oModel.setProperty(sSelectedStationPath + "/Drop1", aAllLaunchers[i].ADPDESC);
													oModel.setProperty(sSelectedStationPath + "/AdpId1", aAllLaunchers[i].ADPID);
													oModel.setProperty(sSelectedStationPath + "/Drop1Apd", aAllLaunchers[i]);
													oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
													if (oSelLauncher.ISSER === "X") {
														if (oModel.getProperty(sSelectedStationPath + "/SLNo1") !== "") {
															oModel.setProperty(sSelectedStationPath + "/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo1"));
															oModel.setProperty("/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo1"));
														} else {
															oModel.setProperty(sSelectedStationPath + "/SLNo1", oModel.getProperty("/iSLNo"));
															oModel.setProperty("/SLNo1", oModel.getProperty(sSelectedStationPath + "/SLNo1"));
														}
													}
													bAdpMatched = true;
												}
											} catch (e) {
												Log.error("Exception in onLauncherChange1>'For Loop5' function");
												this.handleException(e);
											}
										}
										if (bAdpMatched) {
											oModel.setProperty(sSelectedStationPath + "/Drop2", oSelLauncher.ADPDESC);
											oModel.setProperty(sSelectedStationPath + "/AdpId2", oSelLauncher.ADPID);
											oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oSelLauncher);
											oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
											if (oSelLauncher.ISSER === "X") {
												oModel.setProperty(sSelectedStationPath + "/SLNo2", oModel.getProperty("/iSLNo"));
												oModel.setProperty("/SLNo2", oModel.getProperty(sSelectedStationPath + "/SLNo2"));
											}
										} else {
											sap.m.MessageToast.show("Adaptors doesn't match");
										}
									}
								} else {
									sap.m.MessageToast.show("Cant install");
								}
							} else {
								if (oSelLauncher.NUM1 === "1") {
									if (oSelectedStation.Drop0Apd !== undefined) {
										if (oSelectedStation.Drop0Apd.APDID === oSelLauncher.APDID) {
											sap.m.MessageToast.show("Cant install together");
										}
									} else {
										sap.m.MessageToast.show("Adaptors doesn't match");
									}
								} else if (oSelLauncher.NUM1 === "0") {
									if (oSelectedStation.Drop0 !== "") {
										if (oSelectedStation.Drop0.APDID === oSelLauncher.APDID) {
											if (oSelLauncher.ADPDESC !== oSelectedStation.Drop0Apd.ADPDESC) {
												sap.m.MessageToast.show("Cant install together");
											}
										} else {
											sap.m.MessageToast.show("Adaptors doesn't match");
										}
									}
								} else if (oSelLauncher.NUM1 === "2") {
									if (oSelectedStation.Drop2 !== "") {
										if (oSelectedStation.Drop2Apd.APDID === oSelLauncher.APDID) {
											if (oSelLauncher.ADPDESC !== oSelectedStation.Drop2Apd.ADPDESC) {
												sap.m.MessageToast.show("Cant install together");
											}
										} else {
											sap.m.MessageToast.show("Adaptors doesn't match");
										}
									}
								}
							}
						}
					}
				}
				this.getView().byId("LisLauncher").removeSelections(true);
				this.getView().byId("LisPylon").removeSelections(true);
				this.getView().byId("LisTanks").removeSelections(true);
				oModel.setProperty("/iSLNo", "");
			} catch (e) {
				Log.error("Exception in onLauncherChange1 function");
				this.handleException(e);
			}
		},

		onTileZeroUndo: function() {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath");
				if (oModel.getProperty(sSelectedStationPath + "/Drop0") !== "") {
					oModel.setProperty(sSelectedStationPath + "/Drop0", "");
					oModel.setProperty(sSelectedStationPath + "/AdpId0", "");
					oModel.setProperty(sSelectedStationPath + "/Drop0Apd", "");
					oModel.setProperty(sSelectedStationPath + "/SLNo0", "");
					oModel.setProperty("/TileZeroHeader", oModel.getProperty(sSelectedStationPath + "/Drop0"));
					oModel.setProperty(sSelectedStationPath + "/Drop1", "");
					oModel.setProperty(sSelectedStationPath + "/AdpId1", "");
					oModel.setProperty(sSelectedStationPath + "/Drop1Apd", "");
					oModel.setProperty(sSelectedStationPath + "/SLNo1", "");
					oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
					oModel.setProperty(sSelectedStationPath + "/Drop2", "");
					oModel.setProperty(sSelectedStationPath + "/AdpId2", "");
					oModel.setProperty(sSelectedStationPath + "/Drop2Apd", "");
					oModel.setProperty(sSelectedStationPath + "/SLNo2", "");
					oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
					oModel.setProperty(sSelectedStationPath + "/SERNR", "");
					oModel.setProperty("/SLNo0", "");
					oModel.setProperty("/SLNo1", "");
					oModel.setProperty("/SLNo2", "");
					oModel.setProperty("/bICART", false);
					this.getView().byId("LisLauncher").removeSelections(true);
					this.getView().byId("LisPylon").removeSelections(true);
					this.getView().byId("LisTanks").removeSelections(true);
				}
			} catch (e) {
				Log.error("Exception in onTileZeroUndo function");
				this.handleException(e);
			}
		},
		onTileOneUndo: function() {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath");
				if (oModel.getProperty(sSelectedStationPath + "/Drop1") !== "") {
					oModel.setProperty(sSelectedStationPath + "/Drop1", "");
					oModel.setProperty(sSelectedStationPath + "/AdpId1", "");
					oModel.setProperty(sSelectedStationPath + "/Drop1Apd", "");
					oModel.setProperty(sSelectedStationPath + "/SLNo1", "");
					oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
					oModel.setProperty(sSelectedStationPath + "/Drop2", "");
					oModel.setProperty(sSelectedStationPath + "/AdpId2", "");
					oModel.setProperty(sSelectedStationPath + "/Drop2Apd", "");
					oModel.setProperty(sSelectedStationPath + "/SLNo2", "");
					oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
					oModel.setProperty(sSelectedStationPath + "/SERNR", "");
					oModel.setProperty("/SLNo1", "");
					oModel.setProperty("/SLNo2", "");
					oModel.setProperty("/bICART", false);
					this.getView().byId("LisLauncher").removeSelections(true);
					this.getView().byId("LisPylon").removeSelections(true);
					this.getView().byId("LisTanks").removeSelections(true);
				}
			} catch (e) {
				Log.error("Exception in onTileOneUndo function");
				this.handleException(e);
			}
		},
		onTileTwoUndo: function() {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath");
				if (oModel.getProperty(sSelectedStationPath + "/Drop2") !== "") {
					oModel.setProperty(sSelectedStationPath + "/Drop2", "");
					oModel.setProperty(sSelectedStationPath + "/AdpId2", "");
					oModel.setProperty(sSelectedStationPath + "/Drop2Apd", "");
					oModel.setProperty(sSelectedStationPath + "/SLNo2", "");
					oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
					oModel.setProperty("/SLNo2", "");
					oModel.setProperty(sSelectedStationPath + "/SERNR", "");
					this.getView().byId("LisLauncher").removeSelections(true);
					this.getView().byId("LisPylon").removeSelections(true);
					this.getView().byId("LisTanks").removeSelections(true);
				}
			} catch (e) {
				Log.error("Exception in onTileTwoUndo function");
				this.handleException(e);
			}
		},

		onMaxLiveChange: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					iMaxValueEntered = oEvent.getSource().getValue(),
					sSelObjPath = oModel.getProperty("/sSelectedStationPath");
				oModel.setProperty(sSelObjPath + "/QTYADD", iMaxValueEntered);
			} catch (e) {
				Log.error("Exception in onMaxLiveChange function");
				this.handleException(e);
			}
		},

		onSelectHotCold: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sHotCold = oEvent.getSource().getText(),
					sSelObjPath = oModel.getProperty("/sSelectedStationPath");
				oModel.setProperty(sSelObjPath + "/HCFLAG", sHotCold === "Hot" ? "H" : "C");
			} catch (e) {
				Log.error("Exception in onSelectHotCold function");
				this.handleException(e);
			}
		},

		onSelectionChange: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelObjPath = oEvent.getParameter("listItem").getBindingContext("oRoleChangeModel").sPath,
					oSelObj = oEvent.getParameter("listItem").getBindingContext("oRoleChangeModel").getObject();
				oModel.setProperty("/ImagePath", oSelObj.ImgSrc);
				oModel.setProperty("/oSelectedStation", oSelObj);
				oModel.setProperty("/sSelectedStationPath", sSelObjPath);
				oModel.setProperty("/TileZeroHeader", oSelObj.Drop0);
				oModel.setProperty("/TileOneHeader", oSelObj.Drop1);
				oModel.setProperty("/TileTwoHeader", oSelObj.Drop2);
				oModel.setProperty("/SLNo0", oSelObj.SLNo0);
				oModel.setProperty("/SLNo1", oSelObj.SLNo1);
				oModel.setProperty("/SLNo2", oSelObj.SLNo2);

				oModel.setProperty("/iMaxValueEntered", oSelObj.QTYADD);
				this.getView().byId("LisLauncher").removeSelections(true);
				this.getView().byId("LisPylon").removeSelections(true);
				this.getView().byId("LisTanks").removeSelections(true);

				// if (oSelObj.Drop3 !== "") {
				// 	oModel.setProperty("/TileThreeHeader", oSelObj.Drop3);
				// }
				// if (oSelObj.Tank !== "") {
				// 	oModel.setProperty("/TileThreeHeader", oSelObj.Tank);
				// }

				oModel.setProperty("/SERNR", "");
				oModel.setProperty("/StationName", oSelObj.L_TXT);

				if (oSelObj.SUBID === "STNS_102" && oSelObj.DDID === "STNM_O") {
					oModel.setProperty("/bGunSection", true);
					oModel.setProperty("/bHotColdSection", true);
					oModel.setProperty("/bDropSection", false);
					oModel.setProperty("/bStation5", false);
					oModel.setProperty("/bNoDrop", true);
				} else if ((oSelObj.SUBID === "STNS_100" || oSelObj.SUBID === "STNS_101") && oSelObj.DDID === "STNM_O") {
					oModel.setProperty("/bGunSection", true);
					oModel.setProperty("/bHotColdSection", false);
					oModel.setProperty("/bDropSection", false);
					oModel.setProperty("/bStation5", false);
					oModel.setProperty("/bNoDrop", true);
				} else if (oSelObj.SUBID === "STNS_104") {
					oModel.setProperty("/bGunSection", false);
					oModel.setProperty("/bHotColdSection", false);
					oModel.setProperty("/bDropSection", false);
					oModel.setProperty("/bNoDrop", true);
					oModel.setProperty("/bStation5", true);
				} else {
					oModel.setProperty("/bDropSection", true);
					oModel.setProperty("/bGunSection", false);
					oModel.setProperty("/bHotColdSection", false);
					oModel.setProperty("/bNoDrop", true);
					oModel.setProperty("/bStation5", false);
				}
				oModel.refresh(true);
				if (oSelObj.DDID !== "STNM_O") {
					this._getAdaptors(oSelObj.SUBID);
				}
			} catch (e) {
				Log.error("Exception in onSelectionChange function");
				this.handleException(e);
			}
		},

		onStationSignOff: function() {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					that = this,
					aStations = oModel.getProperty("/Stations"),
					oParameter = {},
					aPayload = [];
				if (aStations.length) {
					for (var i in aStations) {
						if (aStations[i].Drop0 !== "") {
							aStations[i].Drop0Apd.SERNR = aStations[i].SLNo0;
							aPayload.push(aStations[i].Drop0Apd);
						}
						if (aStations[i].Drop1 !== "") {
							aStations[i].Drop1Apd.SERNR = aStations[i].SLNo1;
							aPayload.push(aStations[i].Drop1Apd);
						}
						if (aStations[i].Drop2 !== "") {
							aStations[i].Drop2Apd.SERNR = aStations[i].SLNo2;
							aPayload.push(aStations[i].Drop2Apd);
						}
						// if (aStations[i].Tank !== "") {
						// 	//aStations[i].Drop3Apd.NUM1 = "3";
						// 	aStations[i].TankApd.ADPID = aStations[i].TankApd.WESID; //Passing Tank ID to Adp ID
						// 	aPayload.push(aStations[i].TankApd);
						// }
						//To Post Gun, Chaff and Flare
						if (aStations[i].QTYADD !== "" || aStations[i].HCFLAG !== "") {
							aStations[i].NUM1 = "1";
							delete aStations[i].Drop1;
							delete aStations[i].Drop2;
							delete aStations[i].Drop3;
							delete aStations[i].AdpId1;
							delete aStations[i].AdpId2;
							delete aStations[i].AdpId3;
							delete aStations[i].Tank;
							delete aStations[i].TankId;
							delete aStations[i].selected;
							delete aStations[i].SLNo0;
							delete aStations[i].SLNo1;
							delete aStations[i].SLNo2;
							aPayload.push(aStations[i]);
						}
					}
				}
				if (aPayload.length) {
					for (var i in aPayload) {
						aPayload[i].AIRID = this.getAircraftId();
						aPayload[i].endda = "99991231";
						aPayload[i].begda = "20200705";
						aPayload[i].tailid = this.getTailId();
						//aPayload[i].stepid = "S_RL";
					}
				}
				oModel.setProperty("/aPayload", aPayload);
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					//this._signOffPUT();
					//that._navToDashboard();
					sap.m.MessageToast.show("Signoff Successful");
					that.getView().byId("supervisorTabId").setEnabled(true);
					oModel.setProperty("/tabSelected", "Supervisor");
					that._fnGetRoleChange();
					window.setTimeout(function() {
						that.getView().byId("supervisorTabId").focus();
					}, 100);
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/RoleChangeSvc", oParameter, aPayload, "ZRM_FS_RCT", this);
			} catch (e) {
				Log.error("Exception in onStationSignOff function");
				this.handleException(e);
			}
		},

		onSecondSignOff: function() {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					that = this,
					aStationData = oModel.getProperty("/aPayload"),
					oParameter = {},
					aPayload = [];
				for (var i in aStationData) {
					aStationData[i].tailid = this.getTailId();
					aStationData[i].STNMID = null;
				}
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					sap.m.MessageToast.show("Signoff Successful");
					that._navToDashboard();
					// that.getView().byId("supervisorTabId").setEnabled(false);
					// that.getView().byId("tradesmanTabId").setEnabled(true);
					// window.setTimeout(function() {
					// 	that.getView().byId("supervisorTabId").focus();
					// }, 100);
					oModel.setProperty("/tabSelected", "Tradesman");
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/GetRoleSvc", oParameter, aStationData, "ZRM_FS_RCS", this);
			} catch (e) {
				Log.error("Exception in onSecondSignOff function");
				this.handleException(e);
			}
		},

		onTankUndo: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath"),
					oSelectedStation = oModel.getProperty("/oSelectedStation");

				if (oModel.getProperty("bTanksExists")) {
					oModel.setProperty(sSelectedStationPath + "/Tank", "");
					oModel.setProperty(sSelectedStationPath + "/TankId", "");
					oModel.setProperty(sSelectedStationPath + "/TankApd", "");
					oModel.setProperty("/TileThreeHeader", oModel.getProperty(sSelectedStationPath + "/Tank"));
					this.getView().byId("LisTanks").removeSelections(true);
				} else {
					oModel.setProperty(sSelectedStationPath + "/Drop3", "");
					oModel.setProperty(sSelectedStationPath + "/AdpId3", "");
					oModel.setProperty(sSelectedStationPath + "/Drop3Apd", "");
					oModel.setProperty("/TileThreeHeader", oModel.getProperty(sSelectedStationPath + "/Drop3"));

					if (oModel.getProperty(sSelectedStationPath + "/Drop2") === "" && oModel.getProperty(sSelectedStationPath + "/Drop1") === "" &&
						oModel.getProperty(sSelectedStationPath + "/Drop3") === "") {
						oModel.setProperty(sSelectedStationPath + "/selected", false);
					}
				}
			} catch (e) {
				Log.error("Exception in onTankUndo function");
				this.handleException(e);
			}
		},

		onPylon1Undo: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath");
				oModel.setProperty(sSelectedStationPath + "/Drop1", "");
				oModel.setProperty(sSelectedStationPath + "/AdpId1", "");
				oModel.setProperty(sSelectedStationPath + "/Drop1Apd", "");
				oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
				this.getView().byId("LisPylon").removeSelections(true);

				if (oModel.getProperty(sSelectedStationPath + "/Drop2") === "" && oModel.getProperty(sSelectedStationPath + "/Drop1") === "") {
					oModel.setProperty(sSelectedStationPath + "/selected", false);
				}
				if (oModel.getProperty(sSelectedStationPath + "/Drop3") === "") {
					this._applyStationFilter("NoAdpId");
					this._clearTank();
				}
			} catch (e) {
				Log.error("Exception in onPylon1Undo function");
				this.handleException(e);
			}
		},

		onPylon2Undo: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath");
				oModel.setProperty(sSelectedStationPath + "/Drop2", "");
				oModel.setProperty(sSelectedStationPath + "/AdpId2", "");
				oModel.setProperty(sSelectedStationPath + "/Drop2Apd", "");
				oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
				this.getView().byId("LisPylon").removeSelections(true);

				if (oModel.getProperty(sSelectedStationPath + "/Drop2") === "" && oModel.getProperty(sSelectedStationPath + "/Drop1") === "") {
					oModel.setProperty(sSelectedStationPath + "/selected", false);
				}
				if (oModel.getProperty(sSelectedStationPath + "/Drop3") === "") {
					this._applyStationFilter("NoAdpId");
					this._clearTank();
				}
			} catch (e) {
				Log.error("Exception in onPylon2Undo function");
				this.handleException(e);
			}
		},

		_clearTank: function() {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath");
				oModel.setProperty(sSelectedStationPath + "/Tank", "");
				oModel.setProperty(sSelectedStationPath + "/TankId", "");
				oModel.setProperty(sSelectedStationPath + "/TankApd", "");
				oModel.setProperty("/TileThreeHeader", oModel.getProperty(sSelectedStationPath + "/Tank"));
				this.getView().byId("LisTanks").removeSelections(true);
			} catch (e) {
				Log.error("Exception in _clearTank function");
				this.handleException(e);
			}
		},

		onTankChange: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath"),
					oSelectedStation = oModel.getProperty("/oSelectedStation"),
					oAdaptor = oEvent.getParameter("listItem").getBindingContext("oRoleChangeModel").getObject();
				if (oModel.getProperty("/bPushTank")) {
					if (oSelectedStation.Drop1 !== "" || oSelectedStation.Drop2 !== "") {
						if (oSelectedStation.Drop1 !== "") {
							if (oSelectedStation.Drop1Apd.SEQID === oAdaptor.SEQID) {
								oModel.setProperty(sSelectedStationPath + "/Tank", oAdaptor.WESDESC);
								oModel.setProperty(sSelectedStationPath + "/TankId", oAdaptor.WESID);
								oModel.setProperty(sSelectedStationPath + "/TankApd", oAdaptor);

								oModel.setProperty(sSelectedStationPath + "/selected", true);
								oModel.setProperty("/TileThreeHeader", oModel.getProperty(sSelectedStationPath + "/Tank"));
							}
						} else if (oSelectedStation.Drop2 !== "") {
							if (oSelectedStation.Drop2Apd.SEQID === oAdaptor.SEQID) {
								oModel.setProperty(sSelectedStationPath + "/Tank", oAdaptor.WESDESC);
								oModel.setProperty(sSelectedStationPath + "/TankId", oAdaptor.WESID);
								oModel.setProperty(sSelectedStationPath + "/TankApd", oAdaptor);

								oModel.setProperty(sSelectedStationPath + "/selected", true);
								oModel.setProperty("/TileThreeHeader", oModel.getProperty(sSelectedStationPath + "/Tank"));
							}
						} else {
							sap.m.MessageToast.show("Adaptors doesn't match");
						}
					}
				} else {
					sap.m.MessageToast.show("Adaptors doesn't match");
				}
			} catch (e) {
				Log.error("Exception in onTankChange function");
				this.handleException(e);
			}
			//oEvent.getParameter("listItem").setBlocked(true);
		},

		onCloseSLNo: function() {
			try {
				this._oSlNo.close();
				this._oSlNo.destroy();
				delete this._oSlNo;
			} catch (e) {
				Log.error("Exception in onCloseSLNo function");
				this.handleException(e);
			}
		},

		_fnShowSLNo: function() {
			try {
				if (!this._oSlNo) {
					this._oSlNo = sap.ui.xmlfragment("avmet.ah.fragments.rolechange.SLNo", this);
					this.getView().addDependent(this._oSlNo);
				}
				this._oSlNo.open();
			} catch (e) {
				Log.error("Exception in _fnShowSLNo function");
				this.handleException(e);
			}
		},
		onPylonChange: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					oAdaptor = oEvent.getParameter("listItem").getBindingContext("oRoleChangeModel").getObject();
				oModel.setProperty("/oSelectedAdaptor", oAdaptor);
				this.getView().byId("LisTanks").removeSelections(true);
				if (oAdaptor.ISSER === "X") {
					this._fnShowSLNo();
				} else {
					this._fnDropAdaptor();
				}
			} catch (e) {
				Log.error("Exception in onPylonChange function");
				this.handleException(e);
			}
		},
		_fnDropAdaptor: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					sSelectedStationPath = oModel.getProperty("/sSelectedStationPath"),
					oSelectedStation = oModel.getProperty("/oSelectedStation"),
					oAdaptor = oModel.getProperty("/oSelectedAdaptor"),
					bTanksExists = oModel.getProperty("/bTanksExists");
				this.getView().byId("LisTanks").removeSelections(true);
				oModel.setProperty("/bPushTank", true);
				if (bTanksExists) {
					if (oSelectedStation.Drop1 === "" && oSelectedStation.Drop1 !== oAdaptor.ADPDESC && oSelectedStation.Drop2 !== oAdaptor.ADPDESC) {
						if (oSelectedStation.Drop2 !== "") {
							if (oSelectedStation.Drop2Apd.SEQID === oAdaptor.SEQID) {
								oModel.setProperty(sSelectedStationPath + "/Drop1", oAdaptor.ADPDESC);
								oModel.setProperty(sSelectedStationPath + "/AdpId1", oAdaptor.ADPID);
								oModel.setProperty(sSelectedStationPath + "/Drop1Apd", oAdaptor);
							} else {
								sap.m.MessageToast.show("Adaptors doesn't match");
							}
						} else {
							if (oAdaptor.ADPID === "ADP_105") {
								oModel.setProperty(sSelectedStationPath + "/Drop2", oAdaptor.ADPDESC);
								oModel.setProperty(sSelectedStationPath + "/AdpId2", oAdaptor.ADPID);
								oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oAdaptor);
							} else {
								oModel.setProperty(sSelectedStationPath + "/Drop1", oAdaptor.ADPDESC);
								oModel.setProperty(sSelectedStationPath + "/AdpId1", oAdaptor.ADPID);
								oModel.setProperty(sSelectedStationPath + "/Drop1Apd", oAdaptor);
							}
						}
					} else if (oSelectedStation.Drop2 === "" && oSelectedStation.Drop1 !== oAdaptor.ADPDESC && oSelectedStation.Drop2 !== oAdaptor.ADPDESC) {
						if (oSelectedStation.Drop1Apd.SEQID === oAdaptor.SEQID) {
							oModel.setProperty(sSelectedStationPath + "/Drop2", oAdaptor.ADPDESC);
							oModel.setProperty(sSelectedStationPath + "/AdpId2", oAdaptor.ADPID);
							oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oAdaptor);
						} else {
							sap.m.MessageToast.show("Adaptors doesn't match");
						}
					} else if (oSelectedStation.Drop1Apd !== undefined) {
						if (oSelectedStation.Drop1Apd.SEQID !== oAdaptor.SEQID) {
							sap.m.MessageToast.show("Adaptors doesn't match");
							oModel.setProperty("/bPushTank", false);
						}
					} else if (oSelectedStation.Drop2Apd !== undefined) {
						if (oSelectedStation.Drop2Apd.SEQID !== oAdaptor.SEQID) {
							sap.m.MessageToast.show("Adaptors doesn't match");
							oModel.setProperty("/bPushTank", false);
						}
					}
					oModel.setProperty(sSelectedStationPath + "/selected", true);
					oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
					oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));

					//Clearing Tanks 
					oModel.setProperty(sSelectedStationPath + "/Tank", "");
					oModel.setProperty(sSelectedStationPath + "/TankId", "");
					oModel.setProperty(sSelectedStationPath + "/TankApd", "");
					this._applyStationFilter(oAdaptor.SEQID);
				} else {
					if (oSelectedStation.Drop1 === "" && oSelectedStation.Drop1 !== oAdaptor.ADPDESC && oSelectedStation.Drop2 !== oAdaptor.ADPDESC &&
						oSelectedStation.Drop3 !== oAdaptor.ADPDESC) {
						if (oSelectedStation.Drop3 !== "") {
							if (oSelectedStation.Drop3Apd.SEQID === oAdaptor.SEQID) {
								oModel.setProperty(sSelectedStationPath + "/Drop1", oAdaptor.ADPDESC);
								oModel.setProperty(sSelectedStationPath + "/AdpId1", oAdaptor.ADPID);
								oModel.setProperty(sSelectedStationPath + "/Drop1Apd", oAdaptor);
							} else {
								sap.m.MessageToast.show("Adaptors doesn't match");
							}
						} else if (oSelectedStation.Drop2 !== "") {
							if (oSelectedStation.Drop2Apd.SEQID === oAdaptor.SEQID) {
								oModel.setProperty(sSelectedStationPath + "/Drop1", oAdaptor.ADPDESC);
								oModel.setProperty(sSelectedStationPath + "/AdpId1", oAdaptor.ADPID);
								oModel.setProperty(sSelectedStationPath + "/Drop1Apd", oAdaptor);
							} else {
								sap.m.MessageToast.show("Adaptors doesn't match");
							}
						} else {
							oModel.setProperty(sSelectedStationPath + "/Drop1", oAdaptor.ADPDESC);
							oModel.setProperty(sSelectedStationPath + "/AdpId1", oAdaptor.ADPID);
							oModel.setProperty(sSelectedStationPath + "/Drop1Apd", oAdaptor);
						}
					} else if (oSelectedStation.Drop2 === "" && oSelectedStation.Drop1 !== oAdaptor.ADPDESC && oSelectedStation.Drop2 !== oAdaptor.ADPDESC &&
						oSelectedStation.Drop3 !== oAdaptor.ADPDESC) {
						if (oSelectedStation.Drop1 !== "") {
							if (oSelectedStation.Drop1Apd.SEQID === oAdaptor.SEQID) {
								oModel.setProperty(sSelectedStationPath + "/Drop2", oAdaptor.ADPDESC);
								oModel.setProperty(sSelectedStationPath + "/AdpId2", oAdaptor.ADPID);
								oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oAdaptor);
							} else {
								sap.m.MessageToast.show("Adaptors doesn't match");
							}
						} else {
							oModel.setProperty(sSelectedStationPath + "/Drop2", oAdaptor.ADPDESC);
							oModel.setProperty(sSelectedStationPath + "/AdpId2", oAdaptor.ADPID);
							oModel.setProperty(sSelectedStationPath + "/Drop2Apd", oAdaptor);
						}
					} else if (oSelectedStation.Drop3 === "" && oSelectedStation.Drop1 !== oAdaptor.ADPDESC && oSelectedStation.Drop2 !== oAdaptor.ADPDESC &&
						oSelectedStation.Drop3 !== oAdaptor.ADPDESC) {
						if (oSelectedStation.Drop2 !== "") {
							if (oSelectedStation.Drop2Apd.SEQID === oAdaptor.SEQID) {
								oModel.setProperty(sSelectedStationPath + "/Drop3", oAdaptor.ADPDESC);
								oModel.setProperty(sSelectedStationPath + "/AdpId3", oAdaptor.ADPID);
								oModel.setProperty(sSelectedStationPath + "/Drop3Apd", oAdaptor);
							} else {
								sap.m.MessageToast.show("Adaptors doesn't match");
							}
						} else {
							oModel.setProperty(sSelectedStationPath + "/Drop3", oAdaptor.ADPDESC);
							oModel.setProperty(sSelectedStationPath + "/AdpId3", oAdaptor.ADPID);
							oModel.setProperty(sSelectedStationPath + "/Drop3Apd", oAdaptor);
						}
					}
					oModel.setProperty(sSelectedStationPath + "/selected", true);
					oModel.setProperty("/TileOneHeader", oModel.getProperty(sSelectedStationPath + "/Drop1"));
					oModel.setProperty("/TileTwoHeader", oModel.getProperty(sSelectedStationPath + "/Drop2"));
					oModel.setProperty("/TileThreeHeader", oModel.getProperty(sSelectedStationPath + "/Drop3"));
				}

				// if (TileOneHeader === "") {
				// 	oModel.setProperty("/TileOneHeader", sDesc);
				// } else if (TileTwoHeader === "") {
				// 	oModel.setProperty("/TileTwoHeader", sDesc);
				// } else if (TileThreeHeader === "") {
				// 	oModel.setProperty("/TileThreeHeader", sDesc);
				// }
				//oEvent.getParameter("listItem").setBlocked(true);
			} catch (e) {
				Log.error("Exception in _fnDropAdaptor function");
				this.handleException(e);
			}
		},

		_applyStationFilter: function(sSeqId) {
			try {
				var aFilters = [];
				var filter = new sap.ui.model.Filter("SEQID", sap.ui.model.FilterOperator.Contains, sSeqId);
				aFilters.push(filter);
				// update list binding
				var oList = this.byId("LisTanks");
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilters, "Application");
			} catch (e) {
				Log.error("Exception in _applyStationFilter function");
				this.handleException(e);
			}
		},

		_fnGetRoleChange: function() {
			try {
				var that = this,
					oRoleChange = this.getView().getModel("oRoleChangeModel"),
					oParameter = {},
					sStationId = oRoleChange.getProperty("/sStationId"),
					oSelectedStation = oRoleChange.getProperty("/oSelectedStation"),
					sSelectedStationPath = oRoleChange.getProperty("/sSelectedStationPath"),
					aAdaptors = oRoleChange.getProperty("/aAdaptors");
				oParameter.error = function() {};
				oParameter.filter = "airid eq " + this.getAircraftId() + " and tailid eq " + this.getTailId() +
					" and stnmid eq STNM_S and stnsid eq " + sStationId;
				oParameter.success = function(oData) {
					if (oData.results.length) {
						oRoleChange.setProperty("/aStationData", oData.results);
						for (var i in oData.results) {
							var iIndex = aAdaptors.map(function(img) {
								return img.ADPID + "_" + img.SEQID;
							}).indexOf(oData.results[i].ADPID + "_" + oData.results[i].SEQID);
							if (iIndex >= 0) {
								if (aAdaptors[iIndex].NUM1 === "0") {
									oRoleChange.setProperty(sSelectedStationPath + "/Drop0", aAdaptors[iIndex].ADPDESC);
									oRoleChange.setProperty(sSelectedStationPath + "/AdpId0", aAdaptors[iIndex].ADPID);
									oRoleChange.setProperty(sSelectedStationPath + "/Drop0Apd", aAdaptors[iIndex]);
									oRoleChange.setProperty(sSelectedStationPath + "/SLNo0", oData.results[i].SERNR);
									oRoleChange.setProperty("/SLNo0", oRoleChange.getProperty(sSelectedStationPath + "/SLNo0"));
									oRoleChange.setProperty("/TileZeroHeader", oRoleChange.getProperty(sSelectedStationPath + "/Drop0"));
								} else if (aAdaptors[iIndex].NUM1 === "1") {
									oRoleChange.setProperty(sSelectedStationPath + "/Drop1", aAdaptors[iIndex].ADPDESC);
									oRoleChange.setProperty(sSelectedStationPath + "/AdpId1", aAdaptors[iIndex].ADPID);
									oRoleChange.setProperty(sSelectedStationPath + "/Drop1Apd", aAdaptors[iIndex]);
									oRoleChange.setProperty(sSelectedStationPath + "/SLNo1", oData.results[i].SERNR);
									oRoleChange.setProperty("/SLNo1", oRoleChange.getProperty(sSelectedStationPath + "/SLNo1"));
									oRoleChange.setProperty("/TileOneHeader", oRoleChange.getProperty(sSelectedStationPath + "/Drop1"));
								} else if (aAdaptors[iIndex].NUM1 === "2") {
									oRoleChange.setProperty(sSelectedStationPath + "/Drop2", aAdaptors[iIndex].ADPDESC);
									oRoleChange.setProperty(sSelectedStationPath + "/AdpId2", aAdaptors[iIndex].ADPID);
									oRoleChange.setProperty(sSelectedStationPath + "/Drop2Apd", aAdaptors[iIndex]);
									oRoleChange.setProperty(sSelectedStationPath + "/SLNo2", oData.results[i].SERNR);
									oRoleChange.setProperty("/SLNo2", oRoleChange.getProperty(sSelectedStationPath + "/SLNo2"));
									oRoleChange.setProperty("/TileTwoHeader", oRoleChange.getProperty(sSelectedStationPath + "/Drop2"));
								}
								oRoleChange.refresh(true);
							}
						}
					}
					if (this.getView().byId("idIconTabBar").getSelectedKey() === "Supervisor") {
						this._fnBlockAdaptors(true);
					}

				}.bind(this);
				ajaxutil.fnRead("/GetRoleSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _fnGetRoleChange function");
				this.handleException(e);
			}
		},

		_getAdaptors: function(sStationId) {
			try {
				var that = this,
					oRoleChange = this.getView().getModel("oRoleChangeModel"),
					oParameter = {},
					aAdaptors = [],
					aTanks = [];
				oRoleChange.setProperty("/sStationId", sStationId);
				oParameter.error = function() {};
				oParameter.filter = "airid eq '" + this.getAircraftId() + "' and adpflag eq 'X' and stnsid eq '" + sStationId + "'";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						var aUniLaunchers = [],
							aUniPylons = [];
						for (var i in oData.results) {
							if (oData.results[i].POT === "P") {
								var iIndex = aUniPylons.map(function(img) {
									return img.ADPID;
								}).indexOf(oData.results[i].ADPID);
								if (iIndex === -1) {
									oData.results[i].SERNR = "";
									oData.results[i].QTYADD = "";
									oData.results[i].HCFLAG = "";
									aUniPylons.push(oData.results[i]);
								}
							}
							if (oData.results[i].POT === "L") {
								var iIndex = aUniLaunchers.map(function(img) {
									return img.ADPID;
								}).indexOf(oData.results[i].ADPID);
								if (iIndex === -1) {
									oData.results[i].SERNR = "";
									oData.results[i].QTYADD = "";
									oData.results[i].HCFLAG = "";
									aUniLaunchers.push(oData.results[i]);
								}
							}
						}
						if (aUniPylons.length) {
							oRoleChange.setProperty("/bPylonVisible", true);
						} else {
							oRoleChange.setProperty("/bPylonVisible", false);
						}
						if (aUniLaunchers.length) {
							oRoleChange.setProperty("/bLauncher", true);
						} else {
							oRoleChange.setProperty("/bLauncher", false);
						}
						oRoleChange.setProperty("/aUniPylons", aUniPylons);
						oRoleChange.setProperty("/aUniLaunchers", aUniLaunchers);

						//Code to Check Stations
						var aAllPylons = [],
							aAllLaunchers = [];
						for (var i in oData.results) {
							if (oData.results[i].POT === "T") {
								oData.results[i].SERNR = "";
								oData.results[i].QTYADD = "";
								oData.results[i].HCFLAG = "";
								aTanks.push(oData.results[i]);
							}
							if (oData.results[i].POT === "P") {
								oData.results[i].SERNR = "";
								oData.results[i].QTYADD = "";
								oData.results[i].HCFLAG = "";
								aAllPylons.push(oData.results[i]);
							}
							if (oData.results[i].POT === "L") {
								oData.results[i].SERNR = "";
								oData.results[i].QTYADD = "";
								oData.results[i].HCFLAG = "";
								aAllLaunchers.push(oData.results[i]);
							}
						}
						oRoleChange.setProperty("/Tanks", aTanks);
						if (aTanks.length) {
							oRoleChange.setProperty("/bTank", true);
						} else {
							oRoleChange.setProperty("/bTank", false);
						}
						oRoleChange.setProperty("/aAllPylons", aAllPylons);
						oRoleChange.setProperty("/aAllLaunchers", aAllLaunchers);

						oRoleChange.setProperty("/aAdaptors", oData.results);

						if (aTanks.length) {
							oRoleChange.setProperty("/bTanksExists", true);
						} else {
							oRoleChange.setProperty("/bTanksExists", false);
						}
						//that._applyStationFilter("NoAdpId");
						that._checkSelectedAdaptors();
						that._fnGetRoleChange();
					}
				}.bind(this);
				ajaxutil.fnRead("/RoleChangeSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getAdaptors function");
				this.handleException(e);
			}
		},
		onTabSelect: function() {
			try {
				if (this.getView().byId("idIconTabBar").getSelectedKey() === "Supervisor") {
					this._fnBlockAdaptors(true);
				} else {
					this._fnBlockAdaptors(false);
				}
			} catch (e) {
				Log.error("Exception in onTabSelect function");
				this.handleException(e);
			}
		},

		_fnBlockAdaptors: function(sFlag) {
			try {
				var aLaunchers = this.getView().byId("LisLauncher").getItems(),
					aPylons = this.getView().byId("LisPylon").getItems(),
					aTanks = this.getView().byId("LisTanks").getItems();
				if (aLaunchers.length) {
					for (var i in aLaunchers) {
						aLaunchers[i].setBlocked(sFlag);
					}
				}
				if (aPylons.length) {
					for (var i in aPylons) {
						aPylons[i].setBlocked(sFlag);
					}
				}
				if (aTanks.length) {
					for (var i in aTanks) {
						aTanks[i].setBlocked(sFlag);
					}
				}
			} catch (e) {
				Log.error("Exception in _fnBlockAdaptors function");
				this.handleException(e);
			}
		},

		_checkSelectedAdaptors: function() {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					oSelectedStation = oModel.getProperty("/oSelectedStation"),
					aPylonList = this.getView().byId("LisPylon").getItems();
				this.getView().byId("LisPylon").removeSelections();
				if (aPylonList.length) {
					for (var i in aPylonList) {
						var oAdp = aPylonList[i].getBindingContext("oRoleChangeModel").getObject();
						if (oAdp.ADPDESC === oSelectedStation.Drop1 || oAdp.ADPDESC === oSelectedStation.Drop2 || oAdp.ADPDESC === oSelectedStation.Drop3) {
							//aPylonList[i].setBlocked(true);
						}
					}
				}
			} catch (e) {
				Log.error("Exception in _checkSelectedAdaptors function");
				this.handleException(e);
			}
		},

		_onObjectMatched: function(oEvent) {
			try {
				var oModel = this.getView().getModel("oRoleChangeModel"),
					oData = dataUtil.getDataSet(this.getOwnerComponent().appModel),
					aStations = oData.login.rolechangedetails;
				oModel.setProperty("/bDropSection", true);
				oModel.setProperty("/bGunSection", false);
				oModel.setProperty("/bNoDrop", false);
				oModel.setProperty("/bStation5", false);

				oModel.setProperty("/SLNo0", "");
				oModel.setProperty("/SLNo1", "");
				oModel.setProperty("/SLNo2", "");
				// if (aStations === "") {
				// 	this._getStations();
				// } else {
				// 	oModel.setProperty("/Stations", aStations);
				// 	this._setFirstItemSelected();
				// }
				this._getStations();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},
		_getStations: function() {
			try {
				var that = this,
					oRoleChange = this.getView().getModel("oRoleChangeModel"),
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "airid eq " + this.getAircraftId() + " and" + " tailid eq " + this.getTailId();
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].SUBID === "STNS_100" && oData.results[i].DDID === "STNM_S") { //Station 1
								oData.results[i].ImgSrc = "css/img/Section-1.png";
							} else if (oData.results[i].SUBID === "STNS_101" && oData.results[i].DDID === "STNM_S") { //Station 2
								oData.results[i].ImgSrc = "css/img/Section-2.png";
							} else if (oData.results[i].SUBID === "STNS_102" && oData.results[i].DDID === "STNM_S") { //"Station 3
								oData.results[i].ImgSrc = "css/img/Section-3.png";
							} else if (oData.results[i].SUBID === "STNS_103" && oData.results[i].DDID === "STNM_S") { //Station 4
								oData.results[i].ImgSrc = "css/img/Section-4.png";
							} else if (oData.results[i].SUBID === "STNS_104" && oData.results[i].DDID === "STNM_S") { //Station 5
								oData.results[i].ImgSrc = "css/img/Section-5.png";
							} else if (oData.results[i].SUBID === "STNS_105" && oData.results[i].DDID === "STNM_S") { //"Station 6
								oData.results[i].ImgSrc = "css/img/Section-6.png";
							} else if (oData.results[i].SUBID === "STNS_106" && oData.results[i].DDID === "STNM_S") { //Station 7
								oData.results[i].ImgSrc = "css/img/Section-7.png";
							} else if (oData.results[i].SUBID === "STNS_107" && oData.results[i].DDID === "STNM_S") { //Station 8
								oData.results[i].ImgSrc = "css/img/Section-8.png";
							} else if (oData.results[i].SUBID === "STNS_108" && oData.results[i].DDID === "STNM_S") { //Station 9
								oData.results[i].ImgSrc = "css/img/Section-9.png";
							}
							oData.results[i].Drop0 = "";
							oData.results[i].AdpId0 = "";
							oData.results[i].Drop1 = "";
							oData.results[i].AdpId1 = "";
							oData.results[i].Drop2 = "";
							oData.results[i].AdpId2 = "";
							oData.results[i].Tank = "";
							oData.results[i].TankId = "";
							oData.results[i].SERNR = "";
							oData.results[i].QTYADD = "";
							oData.results[i].HCFLAG = "";
							oData.results[i].SLNo0 = "";
							oData.results[i].SLNo1 = "";
							oData.results[i].SLNo2 = "";
							oData.results[i].selected = false;
						}
						oRoleChange.setProperty("/Stations", oData.results);
						that._setFirstItemSelected();
					}
				}.bind(this);
				ajaxutil.fnRead("/RoleChangeSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getStations function");
				this.handleException(e);
			}
		},
		_setFirstItemSelected: function() {
			try {
				var oList = this.getView().byId("list"),
					oRoleChange = this.getView().getModel("oRoleChangeModel"),
					oSelObj = oList.getItems()[0].getBindingContext("oRoleChangeModel").getObject(),
					sSelObjPath = oList.getItems()[0].getBindingContext("oRoleChangeModel").sPath;
				oList.getItems()[0].setSelected(true);
				oRoleChange.setProperty("/StationName", oSelObj.L_TXT);
				oRoleChange.setProperty("/oSelectedStation", oSelObj);
				oRoleChange.setProperty("/sSelectedStationPath", sSelObjPath);
				this._getAdaptors(oSelObj.SUBID);
				if (oSelObj.SUBID === "STNS_102" && oSelObj.DDID === "STNM_O") {
					oRoleChange.setProperty("/bGunSection", true);
					oRoleChange.setProperty("/bDropSection", false);
					oRoleChange.setProperty("/bNoDrop", true);
				} else {
					oRoleChange.setProperty("/bDropSection", true);
					oRoleChange.setProperty("/bGunSection", false);
					oRoleChange.setProperty("/bNoDrop", true);
				}
				if (oSelObj.SUBID === "STNS_100" && oSelObj.DDID === "STNM_S") { //Station 1
					oRoleChange.setProperty("/ImagePath", "css/img/Section-1.png");
				} else if (oSelObj.SUBID === "STNS_101" && oSelObj.DDID === "STNM_S") { //Station 2
					oRoleChange.setProperty("/ImagePath", "css/img/Section-2.png");
				} else if (oSelObj.SUBID === "STNS_102" && oSelObj.DDID === "STNM_S") { //"Station 3
					oRoleChange.setProperty("/ImagePath", "css/img/Section-3.png");
				} else if (oSelObj.SUBID === "STNS_103" && oSelObj.DDID === "STNM_S") { //Station 4
					oRoleChange.setProperty("/ImagePath", "css/img/Section-4.png");
				} else if (oSelObj.SUBID === "STNS_104" && oSelObj.DDID === "STNM_S") { //Station 5
					oRoleChange.setProperty("/ImagePath", "css/img/Section-5.png");
				} else if (oSelObj.SUBID === "STNS_105" && oSelObj.DDID === "STNM_S") { //"Station 6
					oRoleChange.setProperty("/ImagePath", "css/img/Section-6.png");
				} else if (oSelObj.SUBID === "STNS_106" && oSelObj.DDID === "STNM_S") { //Station 7
					oRoleChange.setProperty("/ImagePath", "css/img/Section-7.png");
				} else if (oSelObj.SUBID === "STNS_107" && oSelObj.DDID === "STNM_S") { //Station 8
					oRoleChange.setProperty("/ImagePath", "css/img/Section-8.png");
				} else if (oSelObj.SUBID === "STNS_108" && oSelObj.DDID === "STNM_S") { //Station 9
					oRoleChange.setProperty("/ImagePath", "css/img/Section-9.png");
				}

				oRoleChange.setProperty("/TileOneHeader", oSelObj.Drop1);
				oRoleChange.setProperty("/TileTwoHeader", oSelObj.Drop2);
				if (oSelObj.Drop3 === "" && oSelObj.Tank === "") {
					oRoleChange.setProperty("/TileThreeHeader", "");
				} else if (oSelObj.Drop3 !== "") {
					oRoleChange.setProperty("/TileThreeHeader", oSelObj.Drop3);
				} else if (oSelObj.Tank !== "") {
					oRoleChange.setProperty("/TileThreeHeader", oSelObj.Tank);
				}
			} catch (e) {
				Log.error("Exception in _setFirstItemSelected function");
				this.handleException(e);
			}
		},

		/*_signOffPUT: function() {
			var that = this,
				oModel = this.getView().getModel("oRoleChangeModel"),
				oParameter = {},
				oPayloadPUT = oModel.getProperty("/aPayload");
			oParameter.error = function() {};
			oParameter.success = function(oData) {
				that._navToDashboard();
			}.bind(this);
			ajaxutil.fnUpdate("/RoleChangeSvc", oParameter, oPayloadPUT,"S_RL",this);
		},*/

		_navToDashboard: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("DashboardInitial");
			} catch (e) {
				Log.error("Exception in _navToDashboard function");
				this.handleException(e);
			}
		}
	});
});