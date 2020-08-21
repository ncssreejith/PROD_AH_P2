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

	return BaseController.extend("avmet.ah.controller.PDSSummary", {
		formatter: formatter,
		// ***************************************************************************
		//Developer : Priya
		//                 1. UI Events  
		// 
		// ***************************************************************************

		onInit: function() {
			try {
				var oModel = new JSONModel({
					"SelectedKey": "",
					"bAllToolsAcc": false,
					"bCerfify": false,
					"PDSSelected": "T1_MCARD",
					"iIndex": 0,
					"bReplenishmentReviewed": false,
					"bWeaponConfigReviewed": false,
					"bFlyReqReviewed": false,
					"bADDReviewed": false,
					"bLimitationReviewed": false,
					"bTrailModReviewed": false,
					"bAirMonitorCardReviewed": false,
					"bJobsDueSoonReviewed": false,
					"bPastMonthReviewed": true,
					"sSelectedSignOffOpt": "",
					"AircraftStatus": "Fit-For-Flight",
					"MasterPDS": [],
					"Sortie": [],
					"bOutStandSignOffEnable": true,
					"bFinalSignOffEnable": false,
					"bFollowupShow": true
				});
				this.getView().setModel(oModel, "oPDSSummaryViewModel");
				var oMarkModel = dataUtil.createNewJsonModel();
				oMarkModel.setData({
					"Top": [],
					"Bottom": [],
					"Left": [],
					"Right": [],
					"Rear": []
				});
				this.getView().setModel(oMarkModel, "MarkModel");
				this.getRouter().getRoute("PDSSummary").attachPatternMatched(this._onObjectMatched, this);
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
					oSelectedbj = oEvent.getSource().getSelectedItem().getBindingContext("oPDSSummaryViewModel").getObject(),
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					sDDID = oSelectedbj.ddid;
				oPDSSummaryViewModel.setProperty("/PDSSelected", sDDID);
				var oList = this.getView().byId("lstMasterApprovals"),
					iIndex = oList.getSelectedItem().getBindingContext("oPDSSummaryViewModel").sPath.split("/")[2];
				if (iIndex !== "0") {
					this.i = parseInt(iIndex) - 1;
				} else {
					this.i = parseInt(iIndex);
				}
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

		onApprovalDetails: function(oEvent) {
			try {
				var oViewModel = this.getView().getModel("oPDSSummaryViewModel"),
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

		_fnWeightBalanceGet: function(sTailId) {
			try {
				var that = this,
					oPrmWBM = {};
				oPrmWBM.filter = "tailid eq " + this.getTailId() + " and MOD eq P";
				oPrmWBM.error = function() {};
				oPrmWBM.success = function(oData) {
					//that.getView().byId("MasterId").setVisible(true);
					if (oData.results.length) {
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
					}
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
				oPrmWBM.error = function() {};
				oPrmWBM.success = function(oData) {
					if (oData.results.length) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "WeightBalanceSet");
					}
				}.bind(this);
				ajaxutil.fnRead("/WeBalISvc", oPrmWBM);
			} catch (e) {
				Log.error("Exception in _fnGetWeightBalanceItemSet function");
				this.handleException(e);
			}
		},

		_fnAirOverViewHeaderGet: function(sTailID) {
			try {
				var that = this,
					oPrmWB = {};
				oPrmWB.filter = "FLAG eq H and TAILID eq " + this.getTailId() + " AND LPTYPE EQ LPHEADER";
				oPrmWB.error = function() {};
				oPrmWB.success = function(oData) {
					//this.getView().byId("MasterId").setVisible(true);
					if (oData.results.length) {
						if (oData.results[0] !== undefined) {
							var oModel = dataUtil.createNewJsonModel();
							oModel.setData(oData.results[0]);
							that.getView().setModel(oModel, "OverViewHeaderModel");
							this._fnAirOverViewItemGet(oData.results[0].AIRID, oData.results[0].MODID);
							this._fnAirOverViewItemTankGet(oData.results[0].AIRID, oData.results[0].MODID);
							this._fnAirOverViewItemOilGet(oData.results[0].AIRID, oData.results[0].MODID);
						}
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
				var oViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					oObj = oEvent.getSource().getBindingContext("oPDSSummaryViewModel").getObject();
				if (!this._oSortieDetails) {
					this._oSortieDetails = sap.ui.xmlfragment("avmet.ah.view.ah.pdsic.SortieDetails", this);
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

		onReviewedPress: function(oEvent) {
			try {
				oEvent.getSource().setEnabled(false);
				// var that = this,
				// 	oViewModel = this.getView().getModel("oPDSSummaryViewModel"),
				// 	aMasterItems = this.getView().byId("lstMasterApprovals").getItems(),
				// 	iIndex = oViewModel.getProperty("/iIndex"),
				// 	MasterPDS = oViewModel.getProperty("/MasterPDS"),
				// 	bSignOff = true,
				// 	oList = this.getView().byId("lstMasterApprovals"),
				// 	sPath = oList.getSelectedItem().getBindingContext("oPDSSummaryViewModel").sPath,
				// 	iNextItemIndex = iIndex + 1;
				// oViewModel.setProperty(sPath + "/Reviewed", true);
				// oViewModel.setProperty("/iIndex", iNextItemIndex);

				// if (aMasterItems[iNextItemIndex] !== undefined) {
				// 	var oNextObj = aMasterItems[iNextItemIndex].getBindingContext("oPDSSummaryViewModel").getObject();
				// 	oViewModel.setProperty("/PDSSelected", oNextObj.ddid);
				// 	oList.getItems()[iNextItemIndex].setSelected(true);
				// }
				var that = this,
					oViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					MasterPDS = oViewModel.getProperty("/MasterPDS"),
					aItems = this.getView().byId("lstMasterApprovals").getItems(),
					iTotalItems = aItems.length;
				if (this.i === undefined) {
					var i = 0;
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
						var oNextObj = aItems[ii].getBindingContext("oPDSSummaryViewModel").getObject();

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
			} catch (e) {
				Log.error("Exception in onReviewedPress function");
				this.handleException(e);
			}
		},
		_fnSetFirstItem: function() {
			try {
				var that = this,
					oViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					aItems = this.getView().byId("lstMasterApprovals").getItems(),
					iTotalItems = aItems.length;
				if (this.i === undefined) {
					var i = 0;
				} else {
					var i = this.i;
				}
				for (i; i < aItems.length - 1; i++) {
					var ii = parseInt(i) + 1;
					if (ii <= iTotalItems) {
						this.i = ii;
						var oNextObj = aItems[ii].getBindingContext("oPDSSummaryViewModel").getObject();

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
		onPresSignOff: function() {
			try {
				if (!this._oSignOff) {
					this._oSignOff = sap.ui.xmlfragment("avmet.ah.fragments.pdsic.FitForFlightSignOff", this);
					this.getView().addDependent(this._oSignOff);
				}
				this._oSignOff.open();
			} catch (e) {
				Log.error("Exception in onPresSignOff function");
				this.handleException(e);
			}
		},

		onPressSignOffConfirm: function(oEvent) {
			try {
				var oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					sSelectedSignOffOpt = sap.ui.getCore().byId("signOffOptnId").getSelectedKey();
				if (!oPDSSummaryViewModel.getProperty("/bShowDropDown")) {
					sSelectedSignOffOpt = "";
				}
				var that = this,
					oParameter = {};
				var oSignOffPayload = {
					refid: this.getAircraftId(),
					srvid: "",
					ddid: "HC_SG_S_FF",
					stepid: oPDSSummaryViewModel.getProperty("/stepid"), //"SRVT_BF",
					reftyp: "AIR",
					dftl: "",
					num1: "1",
					uom: "",
					srvtid: oPDSSummaryViewModel.getProperty("/srvtid"),
					value: null,
					sgid: null,
					tailid: this.getTailId(),
					begda: "",
					endda: "",
					airid: "",
					modid: "",
					ddesc: " ",
					sign: "X",
					sgusr: "user1",
					T8_OJOBS: null,
					T2_PAPPR: null,
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
					FFDT: sSelectedSignOffOpt,
					couts: null,
					cpend: null,
					CFLAG: null
				};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					that._SignOffConfirmSuccess();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/PDSSummarySvc", oParameter, [oSignOffPayload], "ZRM_FS_FFF", this);
			} catch (e) {
				Log.error("Exception in onPressSignOffConfirm function");
				this.handleException(e);
			}
		},
		onPressSignOffClose: function(oEvent) {
			try {
				this._oSignOff.close();
			} catch (e) {
				Log.error("Exception in onPressSignOffClose function");
				this.handleException(e);
			}
		},
		_SignOffConfirmSuccess: function(oEvent) {
			try {
				var oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel");
				this._oSignOff.close();
				this.getOwnerComponent().getRouter().navTo("DashboardInitial");
			} catch (e) {
				Log.error("Exception in _SignOffConfirmSuccess function");
				this.handleException(e);
			}
		},

		onPDSReject: function() {

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
				this.getModel("oPDSSummaryViewModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("oPDSSummaryViewModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				if (oEvent.getParameter("arguments").srvtid === "SRVT_AF") {
					//this.getModel("oPDSSummaryViewModel").setProperty("/bFollowupShow", false);
					this.getModel("oPDSSummaryViewModel").setProperty("/bShowDropDown", false);
					this.getModel("oPDSSummaryViewModel").setProperty("/sStatusText", "Completed AF Servicing");
				} else if (oEvent.getParameter("arguments").srvtid === "SRVT_BPO") {
					//this.getModel("oPDSSummaryViewModel").setProperty("/bFollowupShow", false);
					this.getModel("oPDSSummaryViewModel").setProperty("/bShowDropDown", false);
					this.getModel("oPDSSummaryViewModel").setProperty("/sStatusText", "Completed BPO Servicing");
				} else {
					this.getModel("oPDSSummaryViewModel").setProperty("/bShowDropDown", true);
				}
				this._getPDSLists();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},
		_fnRefreshModel: function() {
			try {
				var oModel = new JSONModel({
					"SelectedKey": "",
					"bAllToolsAcc": false,
					"bCerfify": false,
					"PDSSelected": "T1_MCARD",
					"iIndex": 0,
					"bReplenishmentReviewed": false,
					"bWeaponConfigReviewed": false,
					"bFlyReqReviewed": false,
					"bADDReviewed": false,
					"bLimitationReviewed": false,
					"bTrailModReviewed": false,
					"bAirMonitorCardReviewed": false,
					"bJobsDueSoonReviewed": false,
					"bPastMonthReviewed": true,
					"sSelectedSignOffOpt": "",
					"AircraftStatus": "Fit-For-Flight",
					"MasterPDS": [],
					"Sortie": [],
					"bOutStandSignOffEnable": true,
					"bFinalSignOffEnable": false,
					"bFollowupShow": true
				});
				this.i = 0;
				this.getView().setModel(oModel, "oPDSSummaryViewModel");
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
				this.getView().byId("btnDefectReview").setEnabled(true);
				this.getView().byId("flcReviewBtnId").setEnabled(true);
				this.getView().byId("btnJonDueReview").setEnabled(true);
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
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					srvtid = oPDSSummaryViewModel.getProperty("/srvtid"),
					stepid = oPDSSummaryViewModel.getProperty("/stepid"),
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
						oPDSSummaryViewModel.setProperty("/Fuel", Fuel);
						oPDSSummaryViewModel.setProperty("/Tire", Tire);
						oPDSSummaryViewModel.setProperty("/OilMisc", OilMisc);
						this._getFuelExtTanks();
						oPDSSummaryViewModel.refresh(true);
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
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					srvtid = oPDSSummaryViewModel.getProperty("/srvtid"),
					stepid = oPDSSummaryViewModel.getProperty("/stepid"),
					Fuel = oPDSSummaryViewModel.getProperty("/Fuel"),
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
						oPDSSummaryViewModel.setProperty("/Fuel", Fuel);
						//oReplenishViewModel.setProperty("/OilMisc", OilMisc);
						//oReplenishViewModel.setProperty("/Tire", Tire);
						oPDSSummaryViewModel.refresh(true);
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

		_getTasks: function() {
			try {
				var oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
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
				var oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					srvtid = oPDSSummaryViewModel.getProperty("/srvtid"),
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
						oPDSSummaryViewModel.setProperty("/CompletedTasks", CompletedTask);
					}
				}.bind(this);
				ajaxutil.fnRead("/GetFSTaskSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getCreatedTasks function");
				this.handleException(e);
			}
		},

		_getRTTasks: function(sFilter, sTab) {
			try {
				var oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
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
		_getFLyReq: function() {
			try {
				var that = this,
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					oParameter = {},
					aFlyReq = [];
				oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.success = function(oData) {
					if (oData.results.length) {
						oPDSSummaryViewModel.setProperty("/aFlyReq", aFlyReq);
					}
				}.bind(this);
				ajaxutil.fnRead("/AH4StatusSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getFLyReq function");
				this.handleException(e);
			}
		},

		_getWeaponConfig: function() {
			try {
				var that = this,
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					srvtid = oPDSSummaryViewModel.getProperty("/srvtid"),
					oParameter = {};
				oParameter.filter = "airid eq " + this.getAircraftId() + " and tailid eq " + this.getTailId() + " and srvtid eq " + srvtid;
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPDSSummaryViewModel.setProperty("/aStations", oData.results);
				}.bind(this);
				ajaxutil.fnRead("/WeaponSummSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getWeaponConfig function");
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
					this.getModel("oPDSSummaryViewModel").setProperty("/trial", oTrial);
					this.getModel("oPDSSummaryViewModel").refresh(true);
				}.bind(this);
				ajaxutil.fnRead(sPath, oParameter);
				/*var that = this,
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					oParameter = {};
				oParameter.filter = "TAILID eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPDSSummaryViewModel.setProperty("/aTrailMod", oData.results);
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
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					oParameter = {};
				oParameter.filter = "jobty eq Z and tailid eq " + that.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPDSSummaryViewModel.setProperty("/aJobs", oData.results);
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
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					oParameter = {};
				oParameter.filter = "jobty eq S and tailid eq " + that.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPDSSummaryViewModel.setProperty("/aDueJobs", oData.results);
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
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					oParameter = {};
				oParameter.filter = "jobty eq pd and tailid eq " + that.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPDSSummaryViewModel.setProperty("/aPastDefects", oData.results);
				}.bind(this);
				ajaxutil.fnRead("/FSDefectJobSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getPastMonthDefects function");
				this.handleException(e);
			}
		},

		_getPendingApprovals: function() {
			try {
				var that = this,
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					oParameter = {};
				oParameter.filter = "AIRID eq " + this.getAircraftId() + " and TAILID eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPDSSummaryViewModel.setProperty("/aPendApprovals", oData.results);
				}.bind(this);
				ajaxutil.fnRead("/ApprovalSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getPendingApprovals function");
				this.handleException(e);
			}
		},

		_getSignOffOptions: function() {
			try {
				var that = this,
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					srvtid = oPDSSummaryViewModel.getProperty("/srvtid"),
					oParameter = {};
				oParameter.filter = "DDID eq AST_ and REFID eq " + this.getAircraftId() + " and SRVTID eq " + srvtid;
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oPDSSummaryViewModel.setProperty("/aSignOffOptions", oData.results);
				}.bind(this);
				ajaxutil.fnRead("/MasterDDREFSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getSignOffOptions function");
				this.handleException(e);
			}
		},

		onLimitationInformationPress: function(oEvent, Tab) {
			try {
				if (!this._oLimitDialog) {
					this._oLimitDialog = sap.ui.xmlfragment("avmet.ah.view.ah.pilot.PilotLimitInformation", this);
					this.getView().addDependent(this._oLimitDialog);
				}
				var oObject = oEvent.getSource().getBindingContext("oPDSSummaryViewModel").getObject();
				var that = this,
					oPrmJobDue = {};
				var oViewModel = dataUtil.createNewJsonModel(),
					oFlagModel = dataUtil.createNewJsonModel(),
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel");
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
						oPDSSummaryViewModel.setProperty("/tableFlag", true);
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

		_fnLimitationsGet: function() {
			try {
				var that = this,
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "CAPTY eq L and AIRID eq " + this.getAircraftId() + " and tailid eq " + this.getTailId();
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					// To calculate the time difference of two dates 
					if (oData.results.length) {
						oPDSSummaryViewModel.setProperty("/aLimitations", oData.results);
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
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
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
						oPDSSummaryViewModel.setProperty("/aDefferedDefects", oData.results);
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
				oParameter.filter = "tailid eq " + this.getTailId() + " and srvtid eq " + this.getModel("oPDSSummaryViewModel").getProperty(
						"/srvtid") +
					" and airid eq " + this.getAircraftId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("oPDSSummaryViewModel").setProperty("/stns", oData.results);
					this.getModel("oPDSSummaryViewModel").refresh();
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
					this.openDialog("SerialNosDialog", ".fragments.pdsic.");
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

		_getPDSLists: function() {
			try {
				var oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel");
				var oParameter = {};
				var that = this;
				oParameter.error = function() {};
				oParameter.filter = "REFID eq '" + this.getAircraftId() + "' and SRVTID eq " + this.getModel("oPDSSummaryViewModel").getProperty(
					"/srvtid"); //+ this.getAircraftId(); // "REFID eq "+ this.getAircraftId(); uncomment once we have data for AIR_11
				oParameter.success = function(oData) {
					if (oData.results.length) {
						oPDSSummaryViewModel.setProperty("/MasterPDS", oData.results);
						for (var i in oData.results) {
							var sStr = oData.results[i].ddid.split("_")[0];
							oData.results[i].sequence = parseInt(sStr.substr(1, sStr.length));
						}
						that._getCount();
						that._getReplenishmentDetails();
						that._getRTTasks();
						that._getTasks();
						that._getCreatedTasks();
						that._getFLyReq();
						that._getJobDetails();
						that._getDueSoonJobDetails();
						that._getPastMonthDefects();
						that._getPendingApprovals();
						that._fnLimitationsGet();
						that._fnADDGet();
						that._getTrailMod();
						that._getWeaponConfig();
						that._getSignOffOptions();
						that.fnLoadStation();
						var aMasterItems = this.getView().byId("lstMasterApprovals").getItems();
						aMasterItems[0].setSelected(true);
					}
				}.bind(this);
				ajaxutil.fnRead("/PDSSummarySvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getPDSLists function");
				this.handleException(e);
			}
		},

		_getCount: function() {
			try {
				var that = this,
					oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel"),
					MasterPDS = oPDSSummaryViewModel.getProperty("/MasterPDS");
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "REFID eq " + this.getAircraftId() +
					" AND tailid eq " + this.getTailId() + " and srvid eq 'SRV_202007071205_978' and CFLAG eq 'X'"; // "REFID eq "+ this.getAircraftId(); uncomment once we have data for AIR_11
				oParameter.success = function(oData) {
					if (oData.results.length) {
						if (MasterPDS.length) {
							this.iReviwedCount = 0;
							for (var i in MasterPDS) {
								MasterPDS[i].Reviewed = false;
								if (MasterPDS[i].ddid === "T1_MCARD") {
									MasterPDS[i].value = oData.results[0].T1_MCARD;
									if (oData.results[0].T1_MCARD === 0) {
										var bChangeFirstItem = true;
										this.getView().byId("btnSortieReview").setEnabled(false);
									} else {
										var bChangeFirstItem = false;
										this.iReviwedCount = this.iReviwedCount + 1;
									}
								} else if (MasterPDS[i].ddid === "T4_ADD") {
									MasterPDS[i].value = oData.results[0].T4_ADD;
									if (oData.results[0].T4_ADD === 0) {
										this.getView().byId("btnADDReview").setEnabled(false);
									} else {
										this.iReviwedCount = this.iReviwedCount + 1;
									}
								} else if (MasterPDS[i].ddid === "T5_FREQ") {
									MasterPDS[i].value = oData.results[0].T5_FREQ;
									if (oData.results[0].T5_FREQ === 0) {
										this.getView().byId("btnFlyReqReview").setEnabled(false);
									} else {
										this.iReviwedCount = this.iReviwedCount + 1;
									}
								} else if (MasterPDS[i].ddid === "T9_JDUE") {
									MasterPDS[i].value = oData.results[0].T9_JDUE;
									if (oData.results[0].T9_JDUE === 0) {
										this.getView().byId("btnJonDueReview").setEnabled(false);
									} else {
										this.iReviwedCount = this.iReviwedCount + 1;
									}
								} else if (MasterPDS[i].ddid === "T3_LIMIT") {
									MasterPDS[i].value = oData.results[0].T3_LIMIT;
									if (oData.results[0].T3_LIMIT === 0) {
										this.getView().byId("btnLimitReview").setEnabled(false);
									} else {
										this.iReviwedCount = this.iReviwedCount + 1;
									}
								} else if (MasterPDS[i].ddid === "T2_PAPPR") {
									MasterPDS[i].value = oData.results[0].T2_PAPPR;
									if (oData.results[0].T2_PAPPR === 0) {
										this.getView().byId("btnPendApprReview").setEnabled(false);
									} else {
										this.iReviwedCount = this.iReviwedCount + 1;
									}
								} else if (MasterPDS[i].ddid === "T10_PASTD") {
									MasterPDS[i].value = oData.results[0].T10_PASTD;
									if (oData.results[0].T10_PASTD === 0) {
										this.getView().byId("btnDefectReview").setEnabled(false);
									} else {
										this.iReviwedCount = this.iReviwedCount + 1;
									}
								} else if (MasterPDS[i].ddid === "T1_SORTIE") {
									MasterPDS[i].value = oData.results[0].T1_SORTIE;
									if (oData.results[0].T1_SORTIE === 0) {
										var bChangeFirstItem = true;
										this.getView().byId("btnSortieReview").setEnabled(false);
									} else {
										var bChangeFirstItem = false;
										this.iReviwedCount = this.iReviwedCount + 1;
									}
								} else if (MasterPDS[i].ddid === "T11_TMOD") {
									MasterPDS[i].value = oData.results[0].T11_TMOD;
									if (oData.results[0].T11_TMOD === 0) {
										this.getView().byId("btnTrialModReview").setEnabled(false);
									} else {
										this.iReviwedCount = this.iReviwedCount + 1;
									}
								} else if (MasterPDS[i].ddid === "T7_WCONF") {
									MasterPDS[i].value = oData.results[0].T7_WCONF;
									this.iReviwedCount = this.iReviwedCount + 1;
								} else if (MasterPDS[i].ddid === "T6_FLC") {
									this.iReviwedCount = this.iReviwedCount + 1;
								}
								//Changes July 22 - Priya Starts Here
								else if (MasterPDS[i].ddid === "T8_OJOBS") {
									MasterPDS[i].value = oData.results[0].T8_OJOBS;
									if (oData.results[0].T8_OJOBS === 0) {
										this.getView().byId("btnOutStandReview").setEnabled(false);
									} else {
										this.iReviwedCount = this.iReviwedCount + 1;
									}
									if (!isNaN(parseInt(MasterPDS[i].value))) {
										if (parseInt(MasterPDS[i].value) > 0) {
											this.getView().byId("btnOutStandReview").setEnabled(true);
										} else {
											this.getView().byId("btnOutStandReview").setEnabled(false);
										}
									}
								}
								//Changes July 22 - Priya Ends Here
							}
						}
						oPDSSummaryViewModel.setProperty("/MasterPDS", MasterPDS);
						this.getView().byId("signOffBtnId").setEnabled(false);
						if (bChangeFirstItem) {
							window.setTimeout(function() {
								that._fnSetFirstItem();
							}, 10);
						}
						that._getSortie();
					}
				}.bind(this);
				ajaxutil.fnRead("/PDSSummarySvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getCount function");
				this.handleException(e);
			}
		},

		_getSortie: function() {
			try {
				var oPDSSummaryViewModel = this.getView().getModel("oPDSSummaryViewModel");
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "TAILID EQ '" + this.getTailId() + "' and FLAG eq 'FS'";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						oPDSSummaryViewModel.setProperty("/Sortie", oData.results);
					}
				}.bind(this);
				ajaxutil.fnRead("/SortieMonsvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getSortie function");
				this.handleException(e);
			}
		},

		/* 27/06/2020 Priya */
		_setRadialChartText: function() {
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