sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log"
], function(BaseController, MessageToast, dataUtil, JSONModel, formatter, ajaxutil, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.PilotAccept", {
		formatter: formatter,
		// ***************************************************************************
		//Developer : Priya
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var oModel = new JSONModel({
					PilotAcceptToReview: [],
					PilotAcceptOthers: [],
					Sortie: [],
					"bFLCTask": false,
					"bWeaponConfig": false,
					"bFlyReq": false,
					"bADD": false,
					"bLimitations": false,
					"bSortie": true,
					"bOutJobs": false,
					"bPendingApprovals": false,
					"bDefects": false,
					"bJobsDueSoon": false,
					"bTrailMod": false,
					"bReplenishmentReviewed": false,
					"bWeaponConfigReviewed": false,
					"bFlyReqReviewed": false,
					"bADDReviewed": false,
					"bLimitationReviewed": false,
					"bTrailModReviewed": false,
					"bAirMonitorCardReviewed": false,
					"bJobsDueSoonReviewed": false,
					"bPastMonthReviewed": true,
					"PDSSelected": "T1_MCARD"
				});
				this.getView().setModel(oModel, "oPilotAccpModel");
				var oMarkModel = dataUtil.createNewJsonModel();
				oMarkModel.setData({
					"Top": [],
					"Bottom": [],
					"Left": [],
					"Right": [],
					"Rear": []
				});
				this.getView().setModel(oMarkModel, "MarkModel");
				this.getRouter().getRoute("PilotAccept").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},
		onAfterRendering: function() {
			this.onSelectionDefectAreaChange("DEA_T");
		},
		onListItemPress: function(oEvent) {
			try {
				var that = this,
					oSelectedbj = oEvent.getSource().getSelectedItem().getBindingContext("oPilotAccpModel").getObject(),
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					sDDID = oSelectedbj.ddid;
				oPilotAccpModel.setProperty("/PDSSelected", sDDID);
				var oList = this.getView().byId("lstMasterApprovals"),
					iIndex = oList.getSelectedItem().getBindingContext("oPilotAccpModel").sPath.split("/")[2];
				this.i = parseInt(iIndex) + 1;
				if (sDDID === "T6_FLC") {
					setTimeout(function() {
						that._setRadialChartText();
						that.getView().byId("flcReviewBtnId").focus(true);
					}, 100);
				} else if (sDDID === "T4_ADD") {
					setTimeout(function() {
						that.onSelectionDefectAreaChange("DEA_T");
					}, 100);
				} else if (sDDID === "T7_WCONF") {
					setTimeout(function() {
						that.getView().byId("weaponConfigReviewBtnId").focus(true);
					}, 10);
				}
			} catch (e) {
				Log.error("Exception in onListItemPress function");
				this.handleException(e);
			}
		},

		onListItemPress1: function(oEvent) {
			try {
				var that = this,
					oSelectedbj = oEvent.getSource().getSelectedItem().getBindingContext("oPilotAccpModel").getObject(),
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					sDDID = oSelectedbj.ddid;
				this._fnSetFragmentsVisibleFalse();
				if (sDDID === "T6_FLC") {
					oPilotAccpModel.setProperty("/bFLCTask", true);
					setTimeout(function() {
						that._setRadialChartText();
					}, 100);
				} else if (sDDID === "T7_WCONF") {
					oPilotAccpModel.setProperty("/bWeaponConfig", true);
				} else if (sDDID === "T5_FREQ") {
					oPilotAccpModel.setProperty("/bFlyReq", true);
				} else if (sDDID === "T4_ADD") {
					oPilotAccpModel.setProperty("/bADD", true);
					setTimeout(function() {
						that.onSelectionDefectAreaChange("DEA_T");
					}, 100);
				} else if (sDDID === "T3_LIMIT") {
					oPilotAccpModel.setProperty("/bLimitations", true);
				} else if (sDDID === "T1_MCARD") {
					oPilotAccpModel.setProperty("/bSortie", true);
				} else if (sDDID === "T8_OJOBS") {
					oPilotAccpModel.setProperty("/bOutJobs", true);
				} else if (sDDID === "T10_PASTD") {
					oPilotAccpModel.setProperty("/bDefects", true);
				} else if (sDDID === "T9_JDUE") {
					oPilotAccpModel.setProperty("/bJobsDueSoon", true);
				} else if (sDDID === "T11_TMOD") {
					oPilotAccpModel.setProperty("/bTrailMod", true);
				} else if (sDDID === "T2_PAPPR") {
					oPilotAccpModel.setProperty("/bPendingApprovals", true);
				}
				oPilotAccpModel.setProperty("/oSelObj", oSelectedbj);
			} catch (e) {
				Log.error("Exception in onListItemPress1 function");
				this.handleException(e);
			}
		},

		onApprovalDetails: function(oEvent) {
			try {
				var oViewModel = this.getView().getModel("oPilotAccpModel"),
					oData = oEvent.getSource().getSelectedContexts()[0].getObject();
				if (!this._oApprovalsDetails) {
					this._oApprovalsDetails = sap.ui.xmlfragment("avmet.ah.view.ah.pdsic.PDSApprovals", this);
					this.getView().addDependent(this._oApprovalsDetails);
				}
				oViewModel.setProperty("/text", oData.text);
				oViewModel.setProperty("/Capid", oData.id);
				oViewModel.setProperty("/description", oData.description);
				oViewModel.setProperty("/flag", oData.flag);
				this._fnApprovalDetailsRequestGet(oData.id);
				this._fnWeightBalanceGet();
				this._fnAirOverViewHeaderGet();
				this._fnTrialModGet(oData.JOBID);
				this.getView().byId("lstPendApprovals").removeSelections(true);
				this._oApprovalsDetails.open();
			} catch (e) {
				Log.error("Exception in onApprovalDetails function");
				this.handleException(e);
			}
		},
		_fnApprovalDetailsRequestGet: function(sCapId) {
			try {
				var that = this,
					oPrmAppr = {};
				oPrmAppr.filter = "CAPID eq " + sCapId;
				oPrmAppr.error = function() {};
				oPrmAppr.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results[0]);
					that.getView().setModel(oModel, "ApprovalDetailstModel");
				}.bind(this);
				ajaxutil.fnRead("/ApprovalNavSvc", oPrmAppr);
			} catch (e) {
				Log.error("Exception in _fnApprovalDetailsRequestGet function");
				this.handleException(e);
			}
		},

		_fnWeightBalanceGet: function() {
			try {
				var that = this,
					oPrmWBM = {};
				oPrmWBM.filter = "tailid eq " + that.getTailId() + " and MOD eq P";
				oPrmWBM.error = function() {};
				oPrmWBM.success = function(oData) {
					that.getView().byId("MasterId").setVisible(true);
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "WeightBalanceHeaderSet");
					var oAppModel = this.getView().getModel("ViewModel");
					oAppModel.setProperty("/sUser", oData.results[0].SGUSR);
					oAppModel.setProperty("/sDate", oData.results[0].SGDTM);
					oAppModel.setProperty("/sUser1", oData.results[0].SGUSR);
					oAppModel.setProperty("/sDate1", oData.results[0].SGDTM);
					// oAppModel.setProperty("/sUser2", oData.results[0].ENUsr);
					// oAppModel.setProperty("/sDate2", oData.results[0].Endtm);
					for (var i in oData.results) {
						if (oData.results[i].WTIND === "W") {
							var bFlag = oData.results[i].FLAG === "X" ? true : false;
							this.getModel("ViewModel").setProperty("/isWeightedVisible", bFlag);
						}
					}
					this._fnGetWeightBalanceItemSet(oData.results[0].WABID);
				}.bind(this);
				ajaxutil.fnRead("/WeBalHSvc", oPrmWBM);
			} catch (e) {
				Log.error("Exception in _fnWeightBalanceGet function");
				this.handleException(e);
			}
		},

		_fnGetWeightBalanceItemSet: function(sWABID) {
			try {
				var that = this,
					oPrmWBM = {};
				oPrmWBM.filter = "WABID eq " + sWABID;
				oPrmWBM.error = function() {

				};

				oPrmWBM.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "WeightBalanceSet");
				}.bind(this);

				ajaxutil.fnRead("/WeBalISvc", oPrmWBM);
			} catch (e) {
				Log.error("Exception in _fnGetWeightBalanceItemSet function");
				this.handleException(e);
			}
		},

		_fnAirOverViewHeaderGet: function() {
			try {
				var that = this,
					oPrmWB = {};
				oPrmWB.filter = "FLAG eq H and TAILID eq " + that.getTailId() + " AND LPTYPE EQ LPHEADER";
				oPrmWB.error = function() {

				};

				oPrmWB.success = function(oData) {
					this.getView().byId("MasterId").setVisible(true);
					if (oData.results[0] !== undefined) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results[0]);
						that.getView().setModel(oModel, "OverViewHeaderModel");
						this._fnAirOverViewItemGet(oData.results[0].AIRID, oData.results[0].MODID);
						this._fnAirOverViewItemTankGet(oData.results[0].AIRID, oData.results[0].MODID);
						this._fnAirOverViewItemOilGet(oData.results[0].AIRID, oData.results[0].MODID);
					}
				}.bind(this);

				ajaxutil.fnRead("/LeadPartiSvc", oPrmWB);
			} catch (e) {
				Log.error("Exception in _fnAirOverViewHeaderGet function");
				this.handleException(e);
			}
		},

		_fnTrialModGet: function(sJOBID) {
			try {
				var that = this,
					oPrmWB = {};
				oPrmWB.filter = "FLAG eq TM and JOBID eq " + sJOBID;
				oPrmWB.error = function() {};
				oPrmWB.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results[0]);
					that.getView().setModel(oModel, "trialModel");
					this.getView().byId("MasterId").setVisible(true);
				}.bind(this);
				ajaxutil.fnRead("/ApprovalNavSvc", oPrmWB);
			} catch (e) {
				Log.error("Exception in _fnTrialModGet function");
			}
		},

		onApprovalsDetailsClose: function() {
			try {
				this._oApprovalsDetails.close();
				this._oApprovalsDetails.destroy();
				delete this._oApprovalsDetails;
			} catch (e) {
				Log.error("Exception in onApprovalsDetailsClose function");
				this.handleException(e);
			}
		},

		onClickSortieDetails: function(oEvent) {
			try {
				var oViewModel = this.getView().getModel("oPilotAccpModel"),
					oObj = oEvent.getSource().getBindingContext("oPilotAccpModel").getObject();
				if (!this._oSortieDetails) {
					this._oSortieDetails = sap.ui.xmlfragment("avmet.ah.view.ah.pilot.SortieDetails", this);
					this.getView().addDependent(this._oSortieDetails);
				}
				var sJobId = oObj.JOBID;
				var sSORNO = oObj.SORNO;
				//oViewModel.setProperty("/SORNO", oObj.SORNO);
				this._fnSortieMonitoringHeaderGet(sJobId, sSORNO);
				this._fnSortieMonitoringDetailsGet(sJobId, sSORNO);
				this._oSortieDetails.open();
			} catch (e) {
				Log.error("Exception in onClickSortieDetails function");
			}
		},

		_fnSortieMonitoringHeaderGet: function(sJobId, sSORNO) {
			try {
				var that = this,
					oPrmTD = {};
				oPrmTD.filter = "TAILID eq " + that.getTailId() + " AND FLAG EQ H AND JOBID EQ " + sJobId + " AND SORNO EQ " + sSORNO;
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results[0]);
					that.getView().setModel(oModel, "SortiHeader");
				}.bind(this);
				ajaxutil.fnRead("/GetSortiAISvc", oPrmTD);
			} catch (e) {
				Log.error("Exception in _fnSortieMonitoringHeaderGet function");
			}
		},

		_fnSortieMonitoringDetailsGet: function(sJobId, sSORNO) {
			try {
				var that = this,
					oPrmTD = {};
				oPrmTD.filter = "TAILID eq " + that.getTailId() + " AND FLAG EQ D AND JOBID EQ " + sJobId + " AND SORNO EQ " + sSORNO;
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "SortiDetails");
				}.bind(this);
				ajaxutil.fnRead("/GetSortiAISvc", oPrmTD);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		onSortieDetailsClose: function() {
			try {
				this._oSortieDetails.close();
				this._oSortieDetails.destroy();
				delete this._oSortieDetails;
			} catch (e) {
				Log.error("Exception in onSortieDetailsClose function");
			}
		},

		onPressAcceptTiles: function(oEvt) {
			try {
				var oModel = this.getModel("oPilotAccpModel"),
					oSelObj = oEvt.getSource().getBindingContext("oPilotAccpModel").getObject(),
					sPath = oEvt.getSource().getBindingContext("oPilotAccpModel").sPath;
				oModel.setProperty("/oSelObj", oSelObj);
				oModel.setProperty("/sTilePath", sPath);
				if (oSelObj.ddid === "T5_FREQ") {
					this.onPressFlyReq();
				} else if (oSelObj.ddid === "T4_ADD") {
					this.onPressADD();
				} else if (oSelObj.ddid === "T6_FLC") {
					this.onPressFLCTasks();
				} else if (oSelObj.ddid === "T3_LIMIT") {
					this.onPressLimitation();
				} else if (oSelObj.ddid === "T9_JDUE") {
					this.onPressDueSoon();
				} else if (oSelObj.ddid === "T1_MCARD") {
					this.onPressSortie();
				} else if (oSelObj.ddid === "T10_PASTD") {
					this.onDefects();
				} else if (oSelObj.ddid === "T1_SORTIE") {
					this.onPressSortie();
				} else if (oSelObj.ddid === "T11_TMOD") {
					this.onPressTrailMod();
				} else if (oSelObj.ddid === "T7_WCONF") {
					this.onPressWeaponConfig();
				}
			} catch (e) {
				Log.error("Exception in onPressAcceptTiles function");
				this.handleException(e);
			}
		},

		//call this function based on the DDID
		onPressOutStand: function(oEvent) {
			try {
				if (!this._oOutStand) {
					this._oOutStand = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.OutstandingJobs", this);
					this.getView().addDependent(this._oOutStand);
				}
				this._oOutStand.open();
			} catch (e) {
				Log.error("Exception in onPressOutStand function");
				this.handleException(e);
			}
		},
		onPressOutStandClose: function(oEvent) {
			try {
				this._oOutStand.close();
				this._oOutStand.destroy();
				delete this._oOutStand;
			} catch (e) {
				Log.error("Exception in onPressOutStandClose function");
				this.handleException(e);
			}
		},

		onPressTrailMod: function(oEvent) {
			try {
				if (!this._oTrailMod) {
					this._oTrailMod = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.TrailMod", this);
					this.getView().addDependent(this._oTrailMod);
				}
				this._oTrailMod.open();
			} catch (e) {
				Log.error("Exception in onPressTrailMod function");
				this.handleException(e);
			}
		},
		onPressTrailModClose: function(oEvent) {
			try {
				this._oTrailMod.close();
				this._oTrailMod.destroy();
				delete this._oTrailMod;
			} catch (e) {
				Log.error("Exception in onPressTrailModClose function");
				this.handleException(e);
			}
		},

		onDefects: function(oEvent) {
			try {
				if (!this._oDefects) {
					this._oDefects = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.Defects", this);
					this.getView().addDependent(this._oDefects);
				}
				this._oDefects.open();
			} catch (e) {
				Log.error("Exception in onDefects function");
				this.handleException(e);
			}
		},
		onPressDefectsClose: function(oEvent) {
			try {
				this._oDefects.close();
				this._oDefects.destroy();
				delete this._oDefects;
			} catch (e) {
				Log.error("Exception in onPressDefectsClose function");
				this.handleException(e);
			}
		},

		onPressDueSoon: function(oEvent) {
			try {
				if (!this._oJobDueSoon) {
					this._oJobDueSoon = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.JobDueSoon", this);
					this.getView().addDependent(this._oJobDueSoon);
				}
				this._oJobDueSoon.open();
			} catch (e) {
				Log.error("Exception in onPressDueSoon function");
				this.handleException(e);
			}
		},
		_fnSetFirstItem: function() {
			try {
				var that = this,
					oViewModel = this.getView().getModel("oPilotAccpModel"),
					aItems = this.getView().byId("lstMasterApprovals").getItems(),
					iTotalItems = aItems.length;
				if (this.i === undefined) {
					var i = 1;
				} else {
					var i = this.i;
				}
				for (i; i < aItems.length - 1; i++) {
					var ii = parseInt(i) + 1;
					if (ii <= iTotalItems) {
						this.i = ii;
						var oNextObj = aItems[ii].getBindingContext("oPilotAccpModel").getObject();

					}
					if (oNextObj.value !== 0) {
						oViewModel.setProperty("/PDSSelected", oNextObj.ddid);
						aItems[ii].setSelected(true);
						if (oNextObj !== undefined) {
							if (oNextObj.ddid === "T6_FLC") {
								setTimeout(function() {
									that._setRadialChartText();
								}, 100);
							} else if (oNextObj.ddid === "T4_ADD") {
								setTimeout(function() {
									that.onSelectionDefectAreaChange("DEA_T");
								}, 100);
							}
						}
						return;
					} else {
						oNextObj = undefined;
					}
				}
			} catch (e) {
				Log.error("Exception in _fnSetFirstItem function");
				this.handleException(e);
			}
		},
		onPressDueSoonClose: function(oEvent) {
			try {
				this._oJobDueSoon.close();
				this._oJobDueSoon.destroy();
				delete this._oJobDueSoon;
			} catch (e) {
				Log.error("Exception in onPressDueSoonClose function");
				this.handleException(e);
			}
		},
		onReviewedPress: function(oEvent) {
			try {
				oEvent.getSource().setEnabled(false);
				var that = this,
					oViewModel = this.getView().getModel("oPilotAccpModel"),
					aItems = this.getView().byId("lstMasterApprovals").getItems(),
					iTotalItems = aItems.length;
				if (this.i === undefined) {
					var i = 1;
				} else {
					var i = this.i;
				}
				this.iSignOffCount = this.iSignOffCount + 1;
				if (this.iSignOffCount === this.iReviwedCount) {
					this.getView().byId("signOffBtnId").setEnabled(true);
				} else {
					this.getView().byId("signOffBtnId").setEnabled(false);
				}
				for (i; i < aItems.length - 1; i++) {
					var ii = parseInt(i) + 1;
					if (ii <= iTotalItems) {
						this.i = ii;
						if (aItems[ii].getBindingContext("oPilotAccpModel") !== undefined) {
							var oNextObj = aItems[ii].getBindingContext("oPilotAccpModel").getObject();
						} else {
							oNextObj = undefined;
							return;
						}
					}
					if (oNextObj !== undefined) {
						if (oNextObj.ddid === "T6_FLC") {
							setTimeout(function() {
								that._setRadialChartText();
								that.getView().byId("flcReviewBtnId").focus(true);
							}, 100);
						} else if (oNextObj.ddid === "T4_ADD") {
							setTimeout(function() {
								that.onSelectionDefectAreaChange("DEA_T");
							}, 100);
						} else if (oNextObj.ddid === "T7_WCONF") {
							setTimeout(function() {
								that.getView().byId("weaponConfigReviewBtnId").focus(true);
							}, 10);
						}
						if (oNextObj.value !== 0) {
							oViewModel.setProperty("/PDSSelected", oNextObj.ddid);
							aItems[ii].setSelected(true);
							if (this.iSignOffCount === this.iReviwedCount) {
								this.getView().byId("signOffBtnId").setEnabled(true);
							} else {
								this.getView().byId("signOffBtnId").setEnabled(false);
							}
							return;
						} else {
							oNextObj = undefined;
						}
					}
				}
			} catch (e) {
				Log.error("Exception in onReviewedPress function");
				this.handleException(e);
			}
		},

		onReviewedPress1: function(oEvent) {
			try {
				oEvent.getSource().setEnabled(false);
				var oModel = this.getModel("oPilotAccpModel"),
					oSelObj = oModel.getProperty("/oSelObj"),
					oParameter = {};

				var oList = this.getView().byId("lstMasterApprovals"),
					PilotAcceptList = oModel.getProperty("/PilotAcceptList"),
					sPath = oList.getSelectedItem().getBindingContext("oPilotAccpModel").sPath;
				oModel.setProperty(sPath + "/Reviewed", true);

				if (PilotAcceptList.length) {
					var MasterPDSLen = PilotAcceptList.length,
						iSignOffCount = 0;
					for (var i in PilotAcceptList) {
						if (PilotAcceptList[i].Reviewed && PilotAcceptList[i].reftyp === "To be Reviewed") {
							iSignOffCount = iSignOffCount + 1;
						}
					}
					if (iSignOffCount === 6) {
						this.getView().byId("signOffBtnId").setEnabled(true);
					} else {
						this.getView().byId("signOffBtnId").setEnabled(false);
					}
				}
				if (oSelObj === undefined) {
					var aMasterItems = this.getView().byId("lstMasterApprovals").getItems();
					oSelObj = aMasterItems[1].getBindingContext("oPilotAccpModel").getObject();
				}

				oModel.refresh(true);
				oSelObj.sign = "X";
				oSelObj.srvid = "";
				oSelObj.srvtid = oModel.getProperty("/srvtid");
				oSelObj.stepid = oModel.getProperty("/stepid");
				oSelObj.refid = this.getAircraftId();
				oSelObj.tailid = this.getTailId();
				//delete oSelObj.reviewFlag;
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this._fnNavigateTile();
				}.bind(this);
				ajaxutil.fnCreate("/PilotAcceptanceSvc", oParameter, [oSelObj]);
			} catch (e) {
				Log.error("Exception in onReviewedPress1 function");
				this.handleException(e);
			}
		},

		_fnNavigateTile: function(oData) {
			try {
				var that = this,
					oModel = this.getModel("oPilotAccpModel"),
					oSelObj = oModel.getProperty("/oSelObj"),
					bFlag = false;

				if (oSelObj === undefined) {
					var aMasterItems = this.getView().byId("lstMasterApprovals").getItems();
					oSelObj = aMasterItems[1].getBindingContext("oPilotAccpModel").getObject();
				}

				if (oSelObj.ddid === "T6_FLC") {

					setTimeout(function() {
						that._setRadialChartText();
					}, 100);
				}

				this._fnSetFragmentsVisibleFalse();
				this._fnSetNextTile();
				// if (oSelObj.ddid === "T5_FREQ") {
				// 	this.onPressFlyReqClose();
				// } else if (oSelObj.ddid === "T4_ADD") {
				// 	this.onPressADDClose();
				// } else if (oSelObj.ddid === "T3_LIMIT") {
				// 	bFlag = this.getModel("oPilotAccpModel").getProperty("/ADDReviewBtn");

				// } else if (oSelObj.ddid === "T7_WCONF") {
				// 	this.onPressWeaponConfigClose();
				// } else if (oSelObj.ddid === "T6_FLC") {
				// 	this.onPressFLCTaskClose();
				// } else if (oSelObj.ddid === "T11_TMOD") {
				// 	this.onPressTrailModClose();
				// } else if (oSelObj.ddid === "T1_SORTIE") {
				// 	this.onPressSortieClose();
				// } else if (oSelObj.ddid === "T10_PASTD") {
				// 	this.onPressDefectsClose();
				// } else if (oSelObj.ddid === "T9_JDUE") {
				// 	this.onPressDueSoonClose();
				// }
			} catch (e) {
				Log.error("Exception in _fnNavigateTile function");
				this.handleException(e);
			}
		},

		_fnSetNextTile: function() {
			try {
				var that = this;
				var oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					oList = this.getView().byId("lstMasterApprovals"),
					oPilotAcceptCardList = oList.getBinding("items").getCurrentContexts();
				for (var i in oPilotAcceptCardList) {
					var sPath = oPilotAcceptCardList[i].getPath();
					var oObject = oPilotAccpModel.getObject(sPath);
					//if (oObject.sign === "X" || oObject.value === 0) {
					if (oObject.sign === "X" || oObject.sign === "") {
						continue;
					} else {
						i = parseInt(i, 10) + 1;
						if (i === 6) {
							i = parseInt(i, 10) + 1;
						}
						if (oList.getItems()[i].getTitle() === "Others") {
							i = i + 1;
						}

						var oEvent = new sap.ui.base.Event("customSelect", oList, {
							"item": oList.getItems()[i]
						});

						oList.setSelectedItem(oList.getItems()[i]);
						this.onListItemPress(oEvent);
						break;
						// var sDDID = oObject.ddid;
						// if (sDDID === "T6_FLC") {
						// 	oPilotAccpModel.setProperty("/bFLCTask", true);
						// 	window.setTimeout(function() {
						// 		that._setRadialChartText();
						// 	}, 10);
						// } else if (sDDID === "T7_WCONF") {
						// 	oPilotAccpModel.setProperty("/bWeaponConfig", true);

						// } else if (sDDID === "T5_FREQ") {
						// 	oPilotAccpModel.setProperty("/bFlyReq", true);
						// } else if (sDDID === "T4_ADD") {
						// 	oPilotAccpModel.setProperty("/bADD", true);
						// 	this.onSelectionDefectAreaChange("Top", "ADD");
						// } else if (sDDID === "T3_LIMIT") {
						// 	oPilotAccpModel.setProperty("/bLimitations", true);
						// } else if (sDDID === "T1_SORTIE") {
						// 	oPilotAccpModel.setProperty("/bSortie", true);
						// } else if (sDDID === "T8_OJOBS") {
						// 	oPilotAccpModel.setProperty("/bOutJobs", true);
						// } else if (sDDID === "T10_PASTD") {
						// 	oPilotAccpModel.setProperty("/bDefects", true);
						// } else if (sDDID === "T9_JDUE") {
						// 	oPilotAccpModel.setProperty("/bJobsDueSoon", true);
						// } else if (sDDID === "T11_TMOD") {
						// 	oPilotAccpModel.setProperty("/bTrailMod", true);
						// } else if (sDDID === "T2_PAPPR") {
						// 	oPilotAccpModel.setProperty("/bPendingApprovals", true);
						// }
						// oPilotAccpModel.setProperty("/oSelObj", oObject);
					}
				}
			} catch (e) {
				Log.error("Exception in _fnSetNextTile function");
				this.handleException(e);
			}
		},

		onPresSignOff: function() {
			try {
				var oPilotAccpModel = this.getView().getModel("oPilotAccpModel");
				var that = this,
					oParameter = {};
				var oSignOffPayload = {
					refid: this.getAircraftId(),
					ddid: "",
					reftyp: "",
					dftl: null,
					value: null,
					sgid: null,
					tailid: this.getTailId(),
					begda: null,
					endda: null,
					airid: null,
					modid: null,
					ddesc: "",
					srvid: "",
					srvtid: oPilotAccpModel.getProperty("/srvtid"),
					stepid: oPilotAccpModel.getProperty("/stepid"),
					tileid: null,
					sgusr: "test",
					sign: "X",
					T8_OJOBS: null,
					T2_PAPR: null,
					T6_FLC: null,
					T7_WCONF: null,
					T5_FREQ: null,
					T4_ADD: null,
					T3_LIMIT: null,
					T11_TMOD: null,
					T1_MCARD: null,
					T9_JDUE: null,
					T10_PASTD: null,
					T1_SORTIE: null,
					couts: null,
					cpend: null,
					CFLAG: null
				};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					that._signOffSuccess();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnUpdate("/PilotAcceptanceSvc", oParameter, [oSignOffPayload], "ZRM_FS_PA", this);
			} catch (e) {
				Log.error("Exception in onPresSignOff function");
				this.handleException(e);
			}
		},

		_signOffSuccess: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("DashboardInitial");
			} catch (e) {
				Log.error("Exception in _signOffSuccess function");
				this.handleException(e);
			}
		},

		onPressSortie: function(oEvent) {
			try {
				if (!this._oSortie) {
					this._oSortie = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.Sortie", this);
					this.getView().addDependent(this._oSortie);
				}
				this._getSortie();
				this._oSortie.open();
			} catch (e) {
				Log.error("Exception in onPressSortie function");
				this.handleException(e);
			}
		},
		onPressSortieClose: function(oEvent) {
			try {
				this._oSortie.close();
				this._oSortie.destroy();
				delete this._oSortie;
			} catch (e) {
				Log.error("Exception in onPressSortieClose function");
				this.handleException(e);
			}
		},

		onPressFLCTasks: function(oEvent) {
			try {
				if (!this._oFLCTasks) {
					this._oFLCTasks = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.FLCTasks", this);
					this.getView().addDependent(this._oFLCTasks);
				}
				this._oFLCTasks.open();
				var that = this;
				setTimeout(function() {
					that._setRadialChartText();
				}, 100);
			} catch (e) {
				Log.error("Exception in onPressFLCTasks function");
				this.handleException(e);
			}
		},
		onPressFLCTaskClose: function(oEvent) {
			try {
				this._oFLCTasks.close();
				this._oFLCTasks.destroy();
				delete this._oFLCTasks;
			} catch (e) {
				Log.error("Exception in onPressFLCTaskClose function");
				this.handleException(e);
			}
		},
		onPressLimitation: function(oEvent) {
			try {
				if (!this._oLimitation) {
					this._oLimitation = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.Limitations", this);
					this.getView().addDependent(this._oLimitation);
				}
				this._oLimitation.open();
			} catch (e) {
				Log.error("Exception in onPressLimitation function");
				this.handleException(e);
			}
		},
		onPressLimitationClose: function(oEvent) {
			try {
				this._oLimitation.close();
			} catch (e) {
				Log.error("Exception in onPressLimitationClose function");
				this.handleException(e);
			}
		},
		onPressFlyReq: function(oEvent) {
			try {
				if (!this._oFlyReq) {
					this._oFlyReq = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.FlyingRequirementDetails", this);
					this.getView().addDependent(this._oFlyReq);
				}
				this._oFlyReq.open();
			} catch (e) {
				Log.error("Exception in onPressFlyReq function");
				this.handleException(e);
			}
		},
		onPressFlyReqClose: function(oEvent) {
			try {
				this._oFlyReq.close();
			} catch (e) {
				Log.error("Exception in onPressFlyReqClose function");
				this.handleException(e);
			}
		},
		onPressADD: function(oEvent) {
			try {
				if (!this._oADD) {
					this._oADD = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.ADD", this);
					this.getView().addDependent(this._oADD);
				}
				this._oADD.open();
				this.onSelectionDefectAreaChange("DEA_T");
			} catch (e) {
				Log.error("Exception in onPressADD function");
				this.handleException(e);
			}
		},
		onPressADDClose: function(oEvent) {
			try {
				this._oADD.close();
				this._oADD.destroy();
				delete this._oADD;
			} catch (e) {
				Log.error("Exception in onPressADDClose function");
				this.handleException(e);
			}
		},
		onPressWeaponConfig: function(oEvent) {
			try {
				if (!this._oWeaponConfig) {
					this._oWeaponConfig = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.WeaponConfig", this);
					this.getView().addDependent(this._oWeaponConfig);
				}
				this._oWeaponConfig.open();
			} catch (e) {
				Log.error("Exception in onPressWeaponConfig function");
				this.handleException(e);
			}
		},
		onPressWeaponConfigClose: function(oEvent) {
			try {
				this._oWeaponConfig.close();
			} catch (e) {
				Log.error("Exception in onPressWeaponConfigClose function");
				this.handleException(e);
			}
		},
		onPilotAcceptReject: function() {
			try {
				this.getRouter().navTo("PilotUpdates", {
					//srvid: this.getSrvId(),
					airid: this.getAircraftId(),
					tailid: this.getTailId()
				});
			} catch (e) {
				Log.error("Exception in onPilotAcceptReject function");
				this.handleException(e);
			}
		},

		onLimitationInformationPress: function(oEvent, Tab) {
			try {
				if (!this._oLimitDialog) {
					this._oLimitDialog = sap.ui.xmlfragment("avmet.ah.view.ah.pilot.PilotLimitInformation", this);
					this.getView().addDependent(this._oLimitDialog);
				}
				var oObject = oEvent.getSource().getBindingContext("oPilotAccpModel").getObject();
				var that = this,
					oPrmJobDue = {};
				var oViewModel = dataUtil.createNewJsonModel(),
					oFlagModel = dataUtil.createNewJsonModel(),
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel");
				if (Tab === "ADD") {
					var oObj = {
						FLag: "A"
					};
				} else if (Tab === "Limit") {
					var oObj = {
						FLag: "L"
					};
				}
				oFlagModel.setData(oObj);
				that.getView().setModel(oFlagModel, "oFlagModel");
				oPrmJobDue.filter = "FLAG EQ O AND CAPID EQ " + oObject.CAPID + " AND JOBID EQ " + oObject.JOBID;
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					/*if (oData.results[0].DEAID !== '' && oData.results[0].DEAID !== null) {
						this.onSelectionDefectAreaChange(oData.results[0].DEAID, oData.results[0].JOBID, oData.results[0].TAILID);
					}*/
					if (oData.results[0].EXTEND !== '' && oData.results[0].EXTEND !== null) {
						//this._fnADDCapDataMultipleGet("E", oObject.JOBID, oObject.CAPID);
						oPilotAccpModel.setProperty("/tableFlag", true);
					}
					if (oData.results[0].CLFLAG === "1") {
						sap.ui.getCore().byId("VBColorId").addStyleClass("vboxOrangebgColorr");
						sap.ui.getCore().byId("VBColorId1").addStyleClass("vboxOrangebgColorr");
						//sap.ui.getCore().byId("VBColorIdCom1").addStyleClass("vboxOrangebgColorr");

					} else {
						sap.ui.getCore().byId("VBColorId").addStyleClass("vbox6BgColor");
						sap.ui.getCore().byId("VBColorId1").addStyleClass("vbox6BgColor");
						//sap.ui.getCore().byId("VBColorIdCom1").addStyleClass("vbox6BgColor");
					}
					oViewModel.setData(oData.results[0]);
					that.getView().setModel(oViewModel, "CapSet");
				}.bind(this);
				ajaxutil.fnRead("/ADDOVERVIEWSvc", oPrmJobDue);
				that._oLimitDialog.open();
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		onCloseLimitDetailDialog: function() {
			try {
				if (this._oLimitDialog) {
					this._oLimitDialog.close();
					this._oLimitDialog.destroy();
					delete this._oLimitDialog;
				}
			} catch (e) {
				Log.error("Exception in onCloseLimitDetailDialog function");
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
				this._fnRefreshModel();
				this.iSignOffCount = 0;
				this.getModel("oPilotAccpModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("oPilotAccpModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this._getPilotAcceptLists();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},
		_fnRefreshModel: function() {
			try {
				var oModel = new JSONModel({
					PilotAcceptToReview: [],
					PilotAcceptOthers: [],
					Sortie: [],
					"bFLCTask": false,
					"bWeaponConfig": false,
					"bFlyReq": false,
					"bADD": false,
					"bLimitations": false,
					"bSortie": true,
					"bOutJobs": false,
					"bPendingApprovals": false,
					"bDefects": false,
					"bJobsDueSoon": false,
					"bTrailMod": false,
					"bReplenishmentReviewed": false,
					"bWeaponConfigReviewed": false,
					"bFlyReqReviewed": false,
					"bADDReviewed": false,
					"bLimitationReviewed": false,
					"bTrailModReviewed": false,
					"bAirMonitorCardReviewed": false,
					"bJobsDueSoonReviewed": false,
					"bPastMonthReviewed": true,
					"PDSSelected": "T1_MCARD"
				});
				this.i = 1;
				this.getView().setModel(oModel, "oPilotAccpModel");
				var oMarkModel = dataUtil.createNewJsonModel();
				oMarkModel.setData({
					"Top": [],
					"Bottom": [],
					"Left": [],
					"Right": [],
					"Rear": []
				});
				this.getView().setModel(oMarkModel, "MarkModel");
				this.getView().byId("btnADDReview").setEnabled(true);
				//this.getView().byId("btnDefectReview").setEnabled(true);
				this.getView().byId("flcReviewBtnId").setEnabled(true);
				this.getView().byId("btnFlyReqReview").setEnabled(true);
				//this.getView().byId("btnJonDueReview").setEnabled(true);
				this.getView().byId("btnLimitReview").setEnabled(true);
				this.getView().byId("btnOutStandReview").setEnabled(true);
				this.getView().byId("btnPendApprReview").setEnabled(true);
				this.getView().byId("btnSortieReview").setEnabled(true);
				this.getView().byId("btnTrialModReview").setEnabled(true);
				this.getView().byId("weaponConfigReviewBtnId").setEnabled(true);
			} catch (e) {
				Log.error("Exception in _fnRefreshModel function");
				this.handleException(e);
			}
		},
		_getReplenishmentDetails: function() {
			try {
				var that = this,
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					srvtid = oPilotAccpModel.getProperty("/srvtid"),
					stepid = oPilotAccpModel.getProperty("/stepid"),
					Fuel = [],
					OilMisc = [],
					Tire = [],
					oParameter = {};
				var filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + srvtid + " and TAILID eq " + this.getTailId() +
					" and STEPID eq S_RE";
				oParameter.error = function() {};
				oParameter.filter = filter;
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].remid === "REM_F") {
								if (oData.results[i].srvamt !== null) {
									oData.results[i].srvamt = parseInt(oData.results[i].srvamt);
								}
								if (oData.results[i].totamt !== null) {
									oData.results[i].totamt = parseInt(oData.results[i].totamt);
								}
								Fuel.push(oData.results[i]);
							}
							if (oData.results[i].remid === "REM_O") {
								if (oData.results[i].srvamt !== null && oData.results[i].resdescription !== "LOX") {
									oData.results[i].srvamt = parseInt(oData.results[i].srvamt);
								}
								if (oData.results[i].totamt !== null && oData.results[i].resdescription !== "LOX") {
									oData.results[i].totamt = parseInt(oData.results[i].totamt);
								}
								OilMisc.push(oData.results[i]);
							}
							if (oData.results[i].remid === "REM_T") {
								if (oData.results[i].srvamt !== null) {
									oData.results[i].srvamt = parseInt(oData.results[i].srvamt);
								}
								if (oData.results[i].totamt !== null) {
									oData.results[i].totamt = parseInt(oData.results[i].totamt);
								}
								Tire.push(oData.results[i]);
							}
						}
						oPilotAccpModel.setProperty("/Fuel", Fuel);
						oPilotAccpModel.setProperty("/Tire", Tire);
						oPilotAccpModel.setProperty("/OilMisc", OilMisc);
						this._getFuelExtTanks();
						oPilotAccpModel.refresh(true);
						setTimeout(function() {
							that._setRadialChartText();
						}, 100);
					}
				}.bind(this);
				ajaxutil.fnRead("/ReplshmentSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getReplenishmentDetails function");
				this.handleException(e);
			}
		},

		_getFuelExtTanks: function() {
			try {
				var that = this,
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					srvtid = oPilotAccpModel.getProperty("/srvtid"),
					stepid = oPilotAccpModel.getProperty("/stepid"),
					Fuel = oPilotAccpModel.getProperty("/Fuel"),
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
								if (oData.results[i].srvamt !== null) {
									oData.results[i].srvamt = parseInt(oData.results[i].srvamt);
								}
								if (oData.results[i].totamt !== null) {
									oData.results[i].totamt = parseInt(oData.results[i].totamt);
								}
								Fuel.push(oData.results[i]);
							}
						}
						oPilotAccpModel.setProperty("/Fuel", Fuel);
						//oReplenishViewModel.setProperty("/OilMisc", OilMisc);
						//oReplenishViewModel.setProperty("/Tire", Tire);
						oPilotAccpModel.refresh(true);
						setTimeout(function() {
							that._setRadialChartText();
						}, 100);
					}
				}.bind(this);
				ajaxutil.fnRead("/ReplRoleSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getFuelExtTanks function");
				this.handleException(e);
			}
		},

		_getRTTasks: function(sFilter, sTab) {
			try {
				var oPDSSummaryViewModel = this.getView().getModel("oPilotAccpModel"),
					srvtid = oPDSSummaryViewModel.getProperty("/srvtid"),
					stepid = oPDSSummaryViewModel.getProperty("/stepid"),
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "refid eq '" + this.getAircraftId() + "'" + " and srvtid eq '" + srvtid + "'" + " and TAIL_ID eq " + this.getTailId() +
					" and stepid eq 'S_RT'";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						oPDSSummaryViewModel.setProperty("/RotineTask", oData.results);
					}
				}.bind(this);
				ajaxutil.fnRead("/RT2Svc", oParameter);
			} catch (e) {
				Log.error("Exception in _getRTTasks function");
				this.handleException(e);
			}
		},

		_getTasks: function() {
			try {
				var oPDSSummaryViewModel = this.getView().getModel("oPilotAccpModel"),
					srvtid = oPDSSummaryViewModel.getProperty("/srvtid"),
					OutStandingTask = [],
					PendingSupTask = [],
					CompletedTask = [],
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq S_FT and srvtid eq " + srvtid + " and PDSFLAG eq 'P'";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].ftstatus === "Out") {
								OutStandingTask.push(oData.results[i]);
							}
							if (oData.results[i].ftstatus === "Pend") {
								PendingSupTask.push(oData.results[i]);
							}
							if (oData.results[i].ftstatus === "Com") {
								CompletedTask.push(oData.results[i]);
							}
						}
						oPDSSummaryViewModel.setProperty("/FollowUpTasks", CompletedTask);
						//oPilotAccpModel.setProperty("/OutStandingTask", OutStandingTask);
						//oPilotAccpModel.setProperty("/PendingSupTask", PendingSupTask);
						//oPilotAccpModel.setProperty("/CompletedTask", CompletedTask);
					}
				}.bind(this);
				ajaxutil.fnRead("/FTSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getTasks function");
				this.handleException(e);
			}
		},
		_getCreatedTasks: function() {
			try {
				var oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					srvtid = oPilotAccpModel.getProperty("/srvtid"),
					OutStandingTask = [],
					PendingSupTask = [],
					CompletedTask = [],
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq S_CT and srvtid eq " + srvtid;
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].ftstatus === "C") {
								OutStandingTask.push(oData.results[i]);
							}
							if (oData.results[i].ftstatus === "P") {
								PendingSupTask.push(oData.results[i]);
							}
							if (oData.results[i].ftstatus === "X") {
								CompletedTask.push(oData.results[i]);
							}
						}
						oPilotAccpModel.setProperty("/CompletedTasks", CompletedTask);
					}
				}.bind(this);
				ajaxutil.fnRead("/GetFSTaskSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getCreatedTasks function");
				this.handleException(e);
			}
		},

		_getFLyReq: function() {
			try {
				var that = this,
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.success = function(oData) {
					if (oData.results.length) {
						oPilotAccpModel.setProperty("/aFlyReq", oData.results);
					}
				}.bind(this);
				ajaxutil.fnRead("/AH4StatusSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getFLyReq function");
				this.handleException(e);
			}
		},

		_getTrailMod: function() {
			try {
				var sPath = "/TRAILMONSvc/"; // + this.getTailId();
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var oTrial = oData.results;
					this.getModel("oPilotAccpModel").setProperty("/trial", oTrial);
					this.getModel("oPilotAccpModel").refresh(true);
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
				/*var that = this,
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					oParameter = {};
				oParameter.filter = "TAILID eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPilotAccpModel.setProperty("/aTrailMod", oData.results);
				}.bind(this);
				ajaxutil.fnRead("/TRAILMONSvc", oParameter);*/
			} catch (e) {
				Log.error("Exception in _getTrailMod function");
				this.handleException(e);
			}

		},

		_getJobDetails: function() {
			try {
				var that = this,
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					oParameter = {};
				oParameter.filter = "jobty eq Z and tailid eq " + that.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPilotAccpModel.setProperty("/aJobs", oData.results);
				}.bind(this);
				ajaxutil.fnRead("/DefectJobSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getJobDetails function");
				this.handleException(e);
			}
		},

		_getDueSoonJobDetails: function() {
			try {
				var that = this,
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					oParameter = {};
				oParameter.filter = "jobty eq S and tailid eq " + that.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPilotAccpModel.setProperty("/aDueJobs", oData.results);
				}.bind(this);

				ajaxutil.fnRead("/DefectJobSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getDueSoonJobDetails function");
				this.handleException(e);
			}
		},

		_getPastMonthDefects: function() {
			try {
				var that = this,
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					oParameter = {};
				oParameter.filter = "jobty eq pd and tailid eq " + that.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPilotAccpModel.setProperty("/aPastDefects", oData.results);
				}.bind(this);
				ajaxutil.fnRead("/FSDefectJobSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getPastMonthDefects function");
				this.handleException(e);
			}
		},

		_fnLimitationsGet: function() {
			try {
				var that = this,
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "CAPTY eq L and AIRID eq " + this.getAircraftId() + " and tailid eq " + this.getTailId();
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					// To calculate the time difference of two dates 
					if (oData.results.length) {
						oPilotAccpModel.setProperty("/aLimitations", oData.results);
					}
				}.bind(this);
				ajaxutil.fnRead("/GetAddLimitationsPDSICSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		_fnADDGet: function() {
			try {
				var that = this,
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "CAPTY eq A and AIRID eq " + this.getAircraftId() + " and tailid eq " + this.getTailId();
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					if (oData.results.length) {
						var sTempChar = "A",
							oMarkModel = this.getView().getModel("MarkModel").getData();
						for (var i = 0; i < oData.results.length; i++) {
							if ((oData.results[i].CAPTY === "A" || oData.results[i].CAPTY === "B") && oData.results[i].CSTAT === "A") {
								var TempMark = {
									"XAXIS": oData.results[i].XAXIS,
									"YAXIS": oData.results[i].YAXIS,
									"NAME1": sTempChar
								};
								switch (oData.results[i].DEAID_M) {
									case "DEA_T":
										oMarkModel.Top.push(TempMark);
										break;
									case "DEA_B":
										oMarkModel.Bottom.push(TempMark);
										break;
									case "DEA_l":
										oMarkModel.Left.push(TempMark);
										break;
									case "DEA_R":
										oMarkModel.Right.push(TempMark);
										break;
									case "DEA_X":
										oMarkModel.Rear.push(TempMark);
										break;
								}
								oData.results[i].NAME1 = sTempChar;
								sTempChar = String.fromCharCode(sTempChar.charCodeAt() + 1);
							}
						}
						this.onSelectionDefectAreaChange("DEA_T");
						oPilotAccpModel.setProperty("/aDefferedDefects", oData.results);
					}
				}.bind(this);
				ajaxutil.fnRead("/GetAddLimitationsPDSICSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		fnLoadStation: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and srvtid eq " + this.getModel("oPilotAccpModel").getProperty("/srvtid") +
					" and airid eq " + this.getAircraftId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					// oData.results[0].APPRCOUNT = 2;
					// oData.results[4].CONECT = "X";
					//this.getModel("oPilotAccpModel").setProperty("/apprvlevl", oData.results.length > 0 ? oData.results[0].NUM1 : 0);
					this.getModel("oPilotAccpModel").setProperty("/stns", oData.results);
					this.getModel("oPilotAccpModel").refresh();
					//this._fnStepCount();
				}.bind(this);
				ajaxutil.fnRead("/WeaponSvc", oParameter);
			} catch (e) {
				Log.error("Exception in fnLoadStation function");
				this.handleException(e);
			}
		},

		onSerialNoPress: function(oEvent) {
			try {
				var oStation = oEvent.getParameter("oSource").getParent().getBindingContext("oPDSSummaryViewModel").getObject();
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stnmid eq " + oStation.STNMID + " and stnsid eq " + oStation.STNSID;
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oPDSSummaryViewModel").setProperty("/srnos", oData.results);
					this.getModel("oPDSSummaryViewModel").refresh();
					this.openDialog("SerialNosDialog", ".fragments.pilot.");
				}.bind(this);
				ajaxutil.fnRead("/WeaponSernrSvc", oParameter);
			} catch (e) {
				Log.error("Exception in onSerialNoPress function");
				this.handleException(e);
			}
		},

		onSerialNoOkClose: function() {
			try {
				this.closeDialog("SerialNosDialog");
			} catch (e) {
				Log.error("Exception in onSerialNoOkClose function");
				this.handleException(e);
			}
		},
		_getPilotAcceptLists: function() {
			try {
				var that = this;
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("oPilotAccpModel").getProperty(
					"/srvtid");
				oParameter.success = function(oData) {
					if (oData.results.length) {
						this._fnGetDataSets(oData);

						/*oPilotAccpModel.setProperty("/PilotAcceptToReview", PilotAcceptToReview);
						oPilotAccpModel.setProperty("/PilotAcceptOthers", PilotAcceptOthers);*/
					}
				}.bind(this);
				ajaxutil.fnRead("/PilotAcceptanceSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getPilotAcceptLists function");
				this.handleException(e);
			}
		},

		_fnGetDataSets: function(oData) {
			try {
				var that = this;
				var oPilotAccpModel = this.getView().getModel("oPilotAccpModel");
				for (var i in oData.results) {
					oData.results[i].reviewFlag = "Pending";
					/*if (oData.results[i].reftyp === "REVIEWED") {
						PilotAcceptToReview.push(oData.results[i]);
					} else if (oData.results[i].reftyp === "OTHERS") {
						PilotAcceptOthers.push(oData.results[i]);
					}*/
				}
				oPilotAccpModel.setProperty("/PilotAcceptCards", oData.results);
				that._getCount();
				that._getReplenishmentDetails();
				that._getRTTasks();
				that._getTasks();
				that._getCreatedTasks();
				that._getFLyReq();
				that._getJobDetails();
				that._getPastMonthDefects();
				that._getDueSoonJobDetails();
				that._fnLimitationsGet();
				that._fnADDGet();
				that._getTrailMod();
				that.fnLoadStation();
				that._getSortie();
			} catch (e) {
				Log.error("Exception in _fnGetDataSets function");
				this.handleException(e);
			}
		},

		_getCount: function() {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "REFID eq " + this.getAircraftId() +
					" AND tailid eq " + this.getTailId() + " and CFLAG eq 'X'"; // "REFID eq "+ this.getAircraftId(); uncomment once we have data for AIR_11
				oParameter.success = function(oData) {
					if (oData.results.length) {
						this._fnSetCount(oData);

						//oPilotAccpModel.setProperty("/PilotAcceptCards", PilotAcceptCards);
					}
				}.bind(this);
				ajaxutil.fnRead("/PilotAcceptanceSvc", oParameter, "S_PA", this);
			} catch (e) {
				Log.error("Exception in _getCount function");
				this.handleException(e);
			}
		},

		_fnSetCount: function(oData) {
			try {

				var that = this,
					oPilotAccpModel = this.getView().getModel("oPilotAccpModel"),
					PilotAcceptCards = oPilotAccpModel.getProperty("/PilotAcceptCards"),
					PilotAcceptList = [],
					bFlag = false;
				if (PilotAcceptCards.length) {
					this.iReviwedCount = 0;
					for (var i in PilotAcceptCards) {
						if (PilotAcceptCards[i].ddid === "T1_MCARD") {
							PilotAcceptCards[i].value = oData.results[0].T1_MCARD;
							if (oData.results[0].T1_MCARD === 0) {
								var bChangeFirstItem = true;
								this.getView().byId("btnSortieReview").setEnabled(false);
							} else {
								var bChangeFirstItem = false;
								this.iReviwedCount = this.iReviwedCount + 1;
							}
						} else if (PilotAcceptCards[i].ddid === "T4_ADD") {
							PilotAcceptCards[i].value = oData.results[0].T4_ADD;
							PilotAcceptCards[i].value = oData.results[0].T4_ADD;
							if (oData.results[0].T4_ADD === 0) {
								this.getView().byId("btnADDReview").setEnabled(false);
							} else {
								this.iReviwedCount = this.iReviwedCount + 1;
							}
							this._fnReviewBtnCheck(oPilotAccpModel, PilotAcceptCards[i], "/ADDReviewBtn");
						} else if (PilotAcceptCards[i].ddid === "T5_FREQ") {
							PilotAcceptCards[i].value = oData.results[0].T5_FREQ;
							if (oData.results[0].T5_FREQ === 0) {
								this.getView().byId("btnFlyReqReview").setEnabled(false);
							} else {
								this.iReviwedCount = this.iReviwedCount + 1;
							}
							this._fnReviewBtnCheck(oPilotAccpModel, PilotAcceptCards[i], "/FlyReqReviewBtn");
						}
						/*else if (PilotAcceptCards[i].ddid === "T9_JDUE") {
							PilotAcceptCards[i].value = oData.results[0].T9_JDUE;
							if (oData.results[0].T9_JDUE === 0) {
								//this.getView().byId("btnJonDueReview").setEnabled(false);
							}
							this._fnReviewBtnCheck(oPilotAccpModel, PilotAcceptCards[i], "/JDueReviewBtn");
						}*/
						else if (PilotAcceptCards[i].ddid === "T3_LIMIT") {
							PilotAcceptCards[i].value = oData.results[0].T3_LIMIT;
							if (oData.results[0].T3_LIMIT === 0) {
								this.getView().byId("btnLimitReview").setEnabled(false);
							} else {
								this.iReviwedCount = this.iReviwedCount + 1;
							}
							this._fnReviewBtnCheck(oPilotAccpModel, PilotAcceptCards[i], "/LimitaionReviewBtn");
						} else if (PilotAcceptCards[i].ddid === "T1_MCARD") {
							PilotAcceptCards[i].value = oData.results[0].T1_MCARD;
						}
						/*else if (PilotAcceptCards[i].ddid === "T10_PASTD") {
							PilotAcceptCards[i].value = oData.results[0].T10_PASTD;
							if (oData.results[0].T10_PASTD === 0) {
								this.getView().byId("btnDefectReview").setEnabled(false);
							} else {
								//this.iReviwedCount = this.iReviwedCount + 1;
							}
							this._fnReviewBtnCheck(oPilotAccpModel, PilotAcceptCards[i], "/PastDefectsReviewBtn");
						}*/
						else if (PilotAcceptCards[i].ddid === "T1_SORTIE") {
							PilotAcceptCards[i].value = oData.results[0].T1_SORTIE;
							if (oData.results[0].T1_SORTIE === 0) {
								var bChangeFirstItem = true;
								this.getView().byId("btnSortieReview").setEnabled(false);
							} else {
								var bChangeFirstItem = false;
								this.iReviwedCount = this.iReviwedCount + 1;
							}
							this._fnReviewBtnCheck(oPilotAccpModel, PilotAcceptCards[i], "/SortieReviewBtn");
						} else if (PilotAcceptCards[i].ddid === "T11_TMOD") {
							PilotAcceptCards[i].value = oData.results[0].T11_TMOD;
							if (oData.results[0].T11_TMOD === 0) {
								this.getView().byId("btnTrialModReview").setEnabled(false);
							} else {
								this.iReviwedCount = this.iReviwedCount + 1;
							}
							this._fnReviewBtnCheck(oPilotAccpModel, PilotAcceptCards[i], "/TrialModReviewBtn");
						} else if (PilotAcceptCards[i].ddid === "T7_WCONF") {
							PilotAcceptCards[i].value = oData.results[0].T7_WCONF;
							this.iReviwedCount = this.iReviwedCount + 1;
							this._fnReviewBtnCheck(oPilotAccpModel, PilotAcceptCards[i], "/WeaponConfigReviewBtn");
						} else if (PilotAcceptCards[i].ddid === "T6_FLC") {
							this.iReviwedCount = this.iReviwedCount + 1;
							bFlag = PilotAcceptCards[i].sign === "X" ? false : true;
							oPilotAccpModel.setProperty("/FLCTaskReviewBtn", bFlag);
						}

						if (PilotAcceptCards[i].reftyp === "OTHERS") {
							PilotAcceptCards[i].reftyp = "Others";
							PilotAcceptList.push(PilotAcceptCards[i]);
						} else if (PilotAcceptCards[i].reftyp === "REVIEWED") {
							PilotAcceptCards[i].reftyp = "To be Reviewed";
							PilotAcceptList.push(PilotAcceptCards[i]);
						}

					}
					oPilotAccpModel.setProperty("/PilotAcceptList", PilotAcceptList);
					var aMasterItems = this.getView().byId("lstMasterApprovals").getItems();
					aMasterItems[1].setSelected(true);
					this.getView().byId("signOffBtnId").setEnabled(false);
					if (bChangeFirstItem) {
						window.setTimeout(function() {
							that._fnSetFirstItem();
						}, 10);
					}
				}
			} catch (e) {
				Log.error("Exception in _fnSetCount function");
				this.handleException(e);
			}
		},

		_fnReviewBtnCheck: function(oPilotAccpModel, aItem, sProperty) {
			try {
				//var bFlag = (aItem.sign !== "X" && aItem.value > 0) ? true : false;
				var bFlag = (aItem.sign !== "X") ? true : false;
				oPilotAccpModel.setProperty(sProperty, bFlag);
			} catch (e) {
				Log.error("Exception in _fnReviewBtnCheck function");
				this.handleException(e);
			}
		},

		_getSortie: function() {
			try {
				var oPilotAccpModel = this.getView().getModel("oPilotAccpModel");
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "TAILID EQ '" + this.getTailId() + "' and FLAG eq 'FS'";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						oPilotAccpModel.setProperty("/Sortie", oData.results);
					}
				}.bind(this);
				ajaxutil.fnRead("/SortieMonsvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getSortie function");
				this.handleException(e);
			}
		},

		_setRadialChartText: function() {
			try {
				var aItems = this.getView().byId("FuleTilesHBoxId").getItems();
				var aOilItems = this.getView().byId("OilTilesHBoxId").getItems();
				for (var i in aOilItems) {
					aItems.push(aOilItems[i]);
				}
				if (aItems.length) {
					for (var i in aItems) {
						var sSId = "#" + aItems[i].getContent()[0].sId + " > div > div > div";
						if (document.querySelector(sSId) !== null) {
							document.querySelector(sSId).textContent = "";
						}
					}
				}
			} catch (e) {
				Log.error("Exception in _setRadialChartText function");
				this.handleException(e);
			}
		},

		_fnSetFragmentsVisibleFalse: function() {
			try {
				var oPilotAccpModel = this.getView().getModel("oPilotAccpModel");
				oPilotAccpModel.setProperty("/bFLCTask", false);
				oPilotAccpModel.setProperty("/bWeaponConfig", false);
				oPilotAccpModel.setProperty("/bFlyReq", false);
				oPilotAccpModel.setProperty("/bADD", false);
				oPilotAccpModel.setProperty("/bLimitations", false);
				oPilotAccpModel.setProperty("/bSortie", false);
				oPilotAccpModel.setProperty("/bOutJobs", false);
				oPilotAccpModel.setProperty("/bPendingApprovals", false);
				oPilotAccpModel.setProperty("/bDefects", false);
				oPilotAccpModel.setProperty("/bJobsDueSoon", false);
				oPilotAccpModel.setProperty("/bTrailMod", false);
			} catch (e) {
				Log.error("Exception in _fnSetFragmentsVisibleFalse function");
				this.handleException(e);
			}
		},
		drawCoordinates: function(sDaid, oCanvas) {
			try {
				//	var oCanvas = document.getElementById("myCanvasTop");
				var oMarkModel = this.getView().getModel("MarkModel").getData(),
					oAppModel;
				switch (sDaid) {
					case "DEA_T":
						oAppModel = oMarkModel.Top;
						break;
					case "DEA_B":
						oAppModel = oMarkModel.Bottom;
						break;
					case "DEA_l":
						oAppModel = oMarkModel.Left;
						break;
					case "DEA_R":
						oAppModel = oMarkModel.Right;
						break;
					case "DEA_X":
						oAppModel = oMarkModel.Rear;
						break;
				}
				for (var i = 0; i < oAppModel.length; i++) {
					var ctx = oCanvas.getContext("2d");
					var grd = ctx.createLinearGradient(0, 0, 170, 0);
					grd.addColorStop(1, "red");
					ctx.fillStyle = "red"; // Red color
					ctx.strokeStyle = "black";
					ctx.font = "15px Arial";
					ctx.beginPath();
					ctx.arc(Number(oAppModel[i].XAXIS), Number(oAppModel[i].YAXIS), 10, 0, 2 * Math.PI);
					ctx.fill();
					//To print character on point. 
					ctx.beginPath();
					ctx.fillStyle = "black";
					ctx.fillText(oAppModel[i].NAME1, Number(oAppModel[i].XAXIS) - 6.5, Number(oAppModel[i].YAXIS) + 6);
					ctx.fill();
				}
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},
		onSelectionDefectAreaChange: function(sValue) {
			try {
				var that = this,
					sRootPath = jQuery.sap.getModulePath("avmet.ah"),
					oCanvas, sImagePath, oSelectedItemId, ctx,
					oSegmentedButton = this.byId("sbDfArea");
				if (sValue === "DEA_T") {
					oSelectedItemId = sValue;
				} else {
					oSelectedItemId = oSegmentedButton.getSelectedKey();
				}

				oSelectedItemId = oSegmentedButton.getSelectedKey();

				switch (oSelectedItemId) {
					case "DEA_T":
						this.getView().byId("topId").setVisible(true);
						this.getView().byId("FrontId").setVisible(false);
						this.getView().byId("LeftId").setVisible(false);
						this.getView().byId("RightId").setVisible(false);
						oCanvas = document.getElementById("myCanvasTop");
						sImagePath = sRootPath + "/css/img/AH/AH-Top.png";
						break;
					case "DEA_F":
						this.getView().byId("topId").setVisible(false);
						this.getView().byId("FrontId").setVisible(true);
						this.getView().byId("LeftId").setVisible(false);
						this.getView().byId("RightId").setVisible(false);
						oCanvas = document.getElementById("myCanvasFront");
						sImagePath = sRootPath + "/css/img/AH/AH-Front.png";
						break;
					case "DEA_l":
						this.getView().byId("topId").setVisible(false);
						this.getView().byId("FrontId").setVisible(false);
						this.getView().byId("LeftId").setVisible(true);
						this.getView().byId("RightId").setVisible(false);
						oCanvas = document.getElementById("myCanvasLeft");
						sImagePath = sRootPath + "/css/img/AH/AH-Left.png";
						break;
					case "DEA_R":
						this.getView().byId("topId").setVisible(false);
						this.getView().byId("FrontId").setVisible(false);
						this.getView().byId("LeftId").setVisible(false);
						this.getView().byId("RightId").setVisible(true);
						oCanvas = document.getElementById("myCanvasRight");
						sImagePath = sRootPath + "/css/img/AH/AH-Right.png";
						break;
				}
				setTimeout(function demo() {
					ctx = oCanvas.getContext("2d");
					oCanvas.style.backgroundImage = "url('" + sImagePath + "')";
					oCanvas.style.backgroundRepeat = "no-repeat";
					oCanvas.style.backgroundSize = "100%";
					that.drawCoordinates(oSelectedItemId, oCanvas);
				}, 500);
			} catch (e) {
				Log.error("Exception in Limitations:onSelectionDefectAreaChange function");
				this.handleException(e);
			}
		}
	});
});