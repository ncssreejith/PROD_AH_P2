sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, dataUtil, Fragment, FieldValidations, ajaxutil, formatter, Log) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.Approvals", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var that = this,
					model = dataUtil.createJsonModel("model/approvalModel.json");
				that.getView().setModel(model, "oViewModel");
				this.getRouter().getRoute("Approvals").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},

		onAfterRendering: function() {
			var that = this;
			// Retrieve backend posting messages of dashboard status every 30 secs.
			if (!this._LoadMessageInterval) {
				this._LoadMessageInterval = setInterval(function() {
					that._fnApprovalRequestGet();
				}, 30000);
			}
		},

		/** 
		 * Exit clean up.
		 */
		onExit: function() {
			// Clear off state.
			this.destroyState();
		},
		/** 
		 * Clean up state object.
		 */
		destroyState: function() {
			// Clear load message interval.
			clearInterval(this._LoadMessageInterval);
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		//1.on selection change
		onSelectionChange: function(oEvt) {
			try {
				var oData,
					oModel = this.getView().getModel("ViewModel");
				try {
					oData = oEvt.getSource().getSelectedContexts()[0].getObject();
				} catch (e) {
					try {
						oData = this.getView().byId("lstMasterApprovals").getSelectedContexts()[0].getObject();
					} catch (e) {
						oData = undefined;
					}
				}
				if (oData !== undefined) {
					this.Obj = oData;
					oModel.setProperty("/flag", oData.flag);
					oModel.setProperty("/dialogTitle", oData.text);
					oModel.setProperty("/btnText", "Edit");
					switch (oData.flag) {
						case "B":
							oModel.setProperty("/text", oData.text);
							oModel.setProperty("/Capid", oData.id);
							oModel.setProperty("/description", oData.description);
							oModel.setProperty("/flag", oData.flag);
							this._fnApprovalDetailsRequestGet(oData.id);
							this._fnCAPDataGet("O", oData.jobid, oData.id);
							break;
						case "L":
							oModel.setProperty("/text", oData.text);
							oModel.setProperty("/Capid", oData.id);
							oModel.setProperty("/description", oData.description);
							oModel.setProperty("/flag", oData.flag);
							this._fnApprovalDetailsRequestGet(oData.id);
							this._fnCAPDataGet("O", oData.jobid, oData.id);
							break;
						case "A":
							oModel.setProperty("/text", oData.text);
							oModel.setProperty("/Capid", oData.id);
							oModel.setProperty("/description", oData.description);
							oModel.setProperty("/flag", oData.flag);
							this._fnApprovalDetailsRequestGet(oData.id);
							this._fnCAPDataGet("O", oData.jobid, oData.id);
							break;
						case "W":
							oModel.setProperty("/flag", oData.flag);
							oModel.setProperty("/successText", "Weight and Balance data is approved");
							oModel.setProperty("/Capid", oData.id);
							this._fnWeightBalanceGet(oData.TAILID);
							break;
						case "LP":
							oModel.setProperty("/flag", oData.flag);
							oModel.setProperty("/successText", "Leading Particular data is endorsed");
							oModel.setProperty("/Capid", oData.USSERNR);
							oModel.setProperty("/TAILID", oData.TAILID);
							this._fnAirOverViewHeaderGet(oData.TAILID);
							break;
						case "TM":
							oModel.setProperty("/flag", oData.flag);
							oModel.setProperty("/successText", "Trial Mod is endorsed");
							oModel.setProperty("/JOBID", oData.JOBID);
							oModel.setProperty("/TAILID", oData.TAILID);
							this._fnTrialModGet(oData.JOBID);
							break;
					}
					/*	if (oData.flag === 'B' || oData.flag === 'L' || oData.flag === 'A') {

						} else {

						}*/

					oModel.updateBindings(true);
				} else {
					this.getView().byId("MasterId").setVisible(false);
				}
			} catch (e) {
				Log.error("Exception in onSelectionChange function");
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		onApprovalUpdateFinished: function(oEvent) {
			try {
				var listItem = this.getView().byId("lstMasterApprovals");
				if (listItem.length !== 0) {
					this.getView().byId("lstMasterApprovals").setSelectedItem(listItem.getItems()[0], true);
					this.onSelectionChange();
				} else {
					this.getView().byId("MasterId").setVisible(false);
				}
			} catch (e) {
				Log.error("Exception in onApprovalUpdateFinished function");
			}
		},

		onUilisationChange: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sKey = oSrc.getSelectedKey(),
					sDue = oEvent.getSource().getSelectedItem().getText(),
					oAppModel = this.getView().getModel("CapExtendSet");
				if (sKey.length > 0) {
					if (sKey !== "UTIL1_20") {
						oSrc.setValueState("None");
						if (this.oObject && this.oObject[sKey] && this.oObject[sKey].VALUE) {
							var minVal = parseFloat(this.oObject[sKey].VALUE, [10]);
							oAppModel.setProperty("/UTILMINVL", minVal);
							var sVal = oAppModel.getProperty("/UTILVL") ? oAppModel.getProperty("/UTILVL") : 0;
							sVal = parseFloat(sVal, [10]);
							var iPrec = formatter.JobDueDecimalPrecision(sKey);
							oAppModel.setProperty("/UTILVL", parseFloat(minVal, [10]).toFixed(iPrec));

						}
					}
				}

				oAppModel.setProperty("/UM", sDue);
				oAppModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		//2.on Manage request click
		onManageRequest: function(oEvent) {
			try {
				var oButton = oEvent.getSource();
				// create popover
				if (!this._oPopover) {
					Fragment.load({
						id: "popoverNavCon",
						name: "avmet.ah.view.ah.approvals.manageRequests",
						controller: this
					}).then(function(oPopover) {
						this._oPopover = oPopover;
						this.getView().addDependent(this._oPopover);
						this._oPopover.openBy(oButton);
					}.bind(this));
				} else {
					this._oPopover.openBy(oButton);
				}
			} catch (e) {
				Log.error("Exception in onManageRequest function");
			}
		},
		
		handleChange: function() {
			var prevDt = this.getModel("ViewModel").getProperty("/backDt");
			var prevTime = this.getModel("ViewModel").getProperty("/backTm");
			return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorADDexpiryDatePast", "", prevDt, prevTime, false, "EditLimId");
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		_fnApprovalRequestGet: function() {
			try {
				var that = this,
					oPrmAppr = {};
				oPrmAppr.filter = "AIRID eq " + this.getAircraftId() + " and TAILID eq " + this.getTailId();
				oPrmAppr.error = function() {

				};

				oPrmAppr.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "ApprovalListModel");
				}.bind(this);

				ajaxutil.fnRead("/ApprovalSvc", oPrmAppr);
			} catch (e) {
				Log.error("Exception in _fnApprovalRequestGet function");
			}
		},

		_fnGetUtilisationDefaultValue: function(sAir) {
			try {
				var oPrmJobDue = {};
				oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + sAir + " and JDUID eq UTIL";
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.oObject = {};
						for (var i in oData.results) {
							this.oObject[oData.results[i].JDUID] = oData.results[i];
						}
					}
				}.bind(this);

				ajaxutil.fnRead("/UtilisationDueSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnGetUtilisationDefaultValue function");
			}
		},

		onReasonTypeChange: function(oEvent) {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel"),
					oModel = this.getView().getModel("CapExtendSet"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				oModel.setProperty("/EXPDT", null);
				oModel.setProperty("/EXPTM", null);
				oModel.setProperty("/UTILVL", null);
				oModel.setProperty("/UTIL1", null);
				if (sSelectedKey === "D") {
					oModel.setProperty("/EXPTM", "23:59");
					oViewLimitModel.setProperty("/bDateSection", true);
					oViewLimitModel.setProperty("/bUtilisationSection", false);
					oViewLimitModel.setProperty("/sSlectedKey", sSelectedKey);
				} else if (sSelectedKey === "U") {
					oViewLimitModel.setProperty("/bDateSection", false);
					oViewLimitModel.setProperty("/bUtilisationSection", true);
					oViewLimitModel.setProperty("/sUtilKey", "");
					oViewLimitModel.setProperty("/bAirFrameAndTAC", false);
					oViewLimitModel.setProperty("/bScheduleService", false);
					oViewLimitModel.setProperty("/bPhaseService", false);
					oViewLimitModel.setProperty("/sSlectedKey", sSelectedKey);
					oModel.setProperty("/bUtilisationSection", true);
				} else if (sSelectedKey === "B") {
					oModel.setProperty("/EXPTM", "23:59");
					oViewLimitModel.setProperty("/bDateSection", true);
					oViewLimitModel.setProperty("/bUtilisationSection", true);
					oViewLimitModel.setProperty("/sSlectedKey", sSelectedKey);
				}
				oModel.setProperty("/OPPR", sSelectedKey);
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in onReasonTypeChange function");
			}
		},

		onAddLimitaionPress: function() {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel");
				oViewLimitModel.setProperty("/bLimitation", true);
				oViewLimitModel.setProperty("/bAddLimitationBtn", false);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onAddLimitaionPress function");
				this.handleException(e);
			}
		},

		onRemoveLimitaionPress: function() {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel");
				oViewLimitModel.setProperty("/bLimitation", false);
				oViewLimitModel.setProperty("/bAddLimitationBtn", true);
				this.getModel("CapExtendSet").setProperty("/LDESC", null);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onRemoveLimitaionPress function");
				this.handleException(e);
			}
		},

		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		//on Approve Request
		onApproveRequest: function(sValue, oEvent) {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel");
				switch (oModel.getProperty("/flag")) {
					case "W":
						if (sValue === "A") {
							oModel.setProperty("/successText", "This Weight and Balance is approved");
						} else {
							oModel.setProperty("/successText", "This Weight and Balance is rejected");
						}
						this._fnUpdateWB(sValue);
						break;
					case "A":
						if (sValue === "A") {
							oModel.setProperty("/successText", "This Acceptable Deferred Defect (ADD) is approved");
						} else {
							oModel.setProperty("/successText", "This Acceptable Deferred Defect (ADD) is rejected");
						}
						this._fnUpdateADD(sValue);
						break;
					case "B":
						if (sValue === "A") {
							oModel.setProperty("/successText", "This ADD with Limitation is approved");
						} else {
							oModel.setProperty("/successText", "This ADD with Limitation is rejected");
						}
						this._fnUpdateADD(sValue);
						break;
					case "L":
						if (sValue === "A") {
							oModel.setProperty("/successText", "This Limitation is approved");
						} else {
							oModel.setProperty("/successText", "This Limitation is rejected");
						}

						this._fnUpdateADD(sValue);
						break;
					case "LP":
						this._fnUpdateLP(sValue);
						break;
					case "TM":
						this.fnUpdateDeMod(sValue);
						break;
				}
			} catch (e) {
				Log.error("Exception in onApproveRequest function");
			}
		},

		/*	defaultUtil2FormatText: function(oEvent) {
				var oModel = this.getView().getModel("");
			},*/
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		/* Function: onUpdateJob
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */
		_fnUpdateWB: function(sValue) {
			try {
				var that = this,
					sjobid = "",
					oModel = this.getView().getModel("ViewModel"),
					oModel,
					oPayload;
				var dDate = new Date();
				/*	if (sValue === "R") {
						oPayload.Cstat = "R";
					} else {
						oPayload.Cstat = "A";
					}*/

				var oParameter = {};
				oPayload = {
					"jobid": null,
					"flag": "W",
					"TAILID": "",
					"fndby": null,
					"prime": null,
					"credt": null,
					"cretm": null,
					"CAPID": oModel.getProperty("/Capid"),
					"capdt": null,
					"captm": null,
					"cprid": null,
					"PAST_COUNT": null,
					"defpd": "",
					"defpdtx": "",
					"ini_date": null,
					"UTIL1": "",
					"UTIL1Text": "",
					"UTILVL": "",
					"TASKID": "",
					"TDESC": "",
					"AddRsn": null,
					"subusr": "Test User1",
					"expdt": formatter.defaultOdataDateFormat(dDate),
					"exptm": "23:59",
					"fndduring": null,
					"jobdesc": null,
					"Capty": null,
					"Cstat": sValue,
					"Apprusr": "Test User1",
					"Apprdtm": formatter.defaultOdataDateFormat(dDate),
					"Appruzt": new Date().getHours() + ":" + new Date().getMinutes(),
					"ldesc": null,
					"fndid": "",
					"JDUID": "",
					"JDUVL": "",
					"JDUDT": "",
					"CREUSR": "",
					"DMDID": "",
					"OTHER_RSN": "",
					"CDESC": null,
					"remarks":""
				};

				oParameter.error = function(response) {

				};

				oParameter.success = function(oData) {
					that.getView().byId("MasterId").setVisible(false);
					that.onOpenDialogApp();
				}.bind(this);
				oParameter.activity = 5;
				ajaxutil.fnUpdate("/ApprovalNavSvc", oParameter, [oPayload], "ZRM_WNB", this);
			} catch (e) {
				Log.error("Exception in _fnUpdateWB function");
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		_fnUpdateLP: function(sValue) {
			try {
				var that = this,
					sjobid = "",
					oModel = this.getView().getModel("ViewModel"),
					oModel,
					oPayload;

				var oParameter = {};
				oPayload = {
					"jobid": null,
					"TAILID": oModel.getProperty("/TAILID"),
					"flag": "LP",
					"fndby": null,
					"prime": null,
					"credt": null,
					"cretm": null,
					"CAPID": oModel.getProperty("/Capid"),
					"capdt": null,
					"captm": null,
					"cprid": null,
					"PAST_COUNT": null,
					"defpd": "",
					"defpdtx": "",
					"ini_date": null,
					"UTIL1": "",
					"UTIL1Text": "",
					"UTILVL": "",
					"TASKID": "",
					"TDESC": "",
					"AddRsn": null,
					"subusr": "Test User1",
					"expdt": "2020-07-29",
					"exptm": "23:59",
					"fndduring": null,
					"jobdesc": null,
					"Capty": null,
					"Cstat": sValue,
					"Apprusr": "Test User1",
					"Apprdtm": "2020-07-29",
					"Appruzt": "22:9",
					"ldesc": null,
					"fndid": "",
					"JDUID": "",
					"JDUVL": "",
					"JDUDT": "",
					"CREUSR": "",
					"DMDID": "",
					"OTHER_RSN": "",
					"CDESC": null,
					"remarks":""
				};

				oParameter.error = function(response) {

				};

				oParameter.success = function(oData) {
					that.getView().byId("MasterId").setVisible(false);
					that.onOpenDialogApp();
				}.bind(this);
				oParameter.activity = 5;
				ajaxutil.fnUpdate("/ApprovalNavSvc", oParameter, [oPayload], "ZRM_AC_O", this);
			} catch (e) {
				Log.error("Exception in _fnUpdateLP function");
			}
		},

		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_fnUtilization2Get: function() {
			try {

				var that = this,
					oPrmJobDue = {};
				/*oPrmJobDue.filter = "airid eq " + this.getAircraftId() + " and ddid eq UTIL2_";*/

				oPrmJobDue.filter = "ddid eq UTIL2_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "Utilization2CBModel");
					}
				}.bind(this);

				ajaxutil.fnRead("/MasterDDVALSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:_fnUtilization2Get function");
				this.handleException(e);
			}
		},

		/* Function: onUpdateJob
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */
		_fnUpdateADD: function(sValue) {
			try {
				var that = this,
					oObject,
					sjobid = "",
					oModel,
					oPayload;
				var dDate = new Date();

				var oParameter = {};
				oPayload = this.getView().getModel("ApprovalDetailstModel").getData();
				oPayload.Apprdtm = formatter.defaultOdataDateFormat(dDate);
				oPayload.Appruzt = new Date().getHours() + ":" + new Date().getMinutes();
				oPayload.Apprusr = "Test User";
				if (sValue === "R") {
					oPayload.Cstat = "R";
				} else {
					oPayload.Cstat = "A";
				}

				oParameter.error = function(response) {

				};

				oParameter.success = function(oData) {
					/*if (sValue === "R") {
						that.getRouter().navTo("Cosjobs");
					} else {
						that.onOpenDialogApp();
					}*/
					this.getView().byId("MasterId").setVisible(false);
					that.onOpenDialogApp(sValue);
				}.bind(this);
				if (oPayload.Capty === "L") {
					oObject = "ZRM_LIM_S";
				} else {
					oObject = "ZRM_ADDL";
				}
				oParameter.activity = 5;
				ajaxutil.fnUpdate("/ApprovalNavSvc", oParameter, [oPayload], oObject, this);
			} catch (e) {
				Log.error("Exception in _fnUpdateADD function");
			}
		},

		_fnApprovalDetailsRequestGet: function(sCapId) {
			try {
				var that = this,
					oPrmAppr = {};
				oPrmAppr.filter = "CAPID eq " + sCapId;
				oPrmAppr.error = function() {

				};

				oPrmAppr.success = function(oData) {
					if (oData.results.length !== 0) {
						this._fnUtilization2Get();
						var oModel = dataUtil.createNewJsonModel();
						that._fnCAPDataGet("O", oData.results[0].jobid, oData.results[0].capid);
						oModel.setData(oData.results[0]);
						this._fnADDCountGet(oData.results[0].Capty);
						that.getView().setModel(oModel, "ApprovalDetailstModel");
						that.getView().byId("MasterId").setVisible(true);
						this.byId("pageApprovalId").scrollTo(0);
					}
				}.bind(this);

				ajaxutil.fnRead("/ApprovalNavSvc", oPrmAppr);
			} catch (e) {
				Log.error("Exception in _fnApprovalDetailsRequestGet function");
			}
		},

		onOpenDialogApp: function() {
			try {
				var that = this;
				if (!this._oApprove) {
					this._oApprove = sap.ui.xmlfragment(this.createId("idWorkCenterDialog"),
						"avmet.ah.fragments.ApprovalDialog",
						this);
					this.getView().addDependent(this._oApprove);
				}
				this._oApprove.open(this);
			} catch (e) {
				Log.error("Exception in onOpenDialogApp function");
			}
		},

		onCloseDialogAppDialog: function(sValue) {
			try {
				var that = this;
				if (this._oApprove) {
					this._oApprove.close(this);
					this._oApprove.destroy();
					delete this._oApprove;
					if (sValue === 'B') {
						that._fnApprovalRequestGet();
					}
				}
			} catch (e) {
				Log.error("Exception in onCloseDialogAppDialog function");
			}
		},

		handleLinkPress: function() {
			try {
				var that = this;
				that.getRouter().navTo("Limitations");
			} catch (e) {
				Log.error("Exception in handleLinkPress function");
			}
		},

		handleDashBordress: function() {
			try {
				var that = this;
				that.getRouter().navTo("DashboardInitial");
			} catch (e) {
				Log.error("Exception in handleDashBordress function");
			}
		},
		_fnTrialModGet: function(sJOBID) {
			try {
				var that = this,
					oPrmWB = {};
				oPrmWB.filter = "FLAG eq TM and JOBID eq " + sJOBID;
				oPrmWB.error = function() {

				};

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
		fnUpdateDeMod: function() {
			try {
				var sPath = "/ApprovalNavSvc"; //ApprovalNavSvc
				var oParameter = {};
				var oPayload = this.getModel("trialModel").getProperty("/");
				oPayload.flag = "TM";
				oParameter.error = function() {};
				oParameter.success = function() {
					this.getView().byId("MasterId").setVisible(false);
					this.onOpenDialogApp();
				}.bind(this);
				oParameter.activity = 5;
				ajaxutil.fnUpdate(sPath, oParameter, [oPayload], "ZRM_T_MOD", this);
			} catch (e) {
				Log.error("Exception in fnUpdateDeMod function");
			}
		},

		_fnWeightBalanceGet: function(sTailId) {
			try {
				var that = this,
					oPrmWBM = {};
				oPrmWBM.filter = "tailid eq " + sTailId + " and MOD eq P";
				oPrmWBM.error = function() {

				};

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
			}
		},

		_fnAirOverViewHeaderGet: function(sTailID) {
			try {
				var that = this,
					oPrmWB = {};
				oPrmWB.filter = "FLAG eq H and TAILID eq " + sTailID + " AND LPTYPE EQ LPHEADER";
				oPrmWB.error = function() {

				};

				oPrmWB.success = function(oData) {
					this.getView().byId("MasterId").setVisible(true);
					if (oData.results[0] !== undefined) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results[0]);
						that.getView().setModel(oModel, "OverViewHeaderModel");
						this._fnAirOverViewItemGet(oData.results[0].AIRID, oData.results[0].MODID, oData.results[0].TAILID);
						this._fnAirOverViewItemTankGet(oData.results[0].AIRID, oData.results[0].MODID, oData.results[0].TAILID);
						this._fnAirOverViewItemOilGet(oData.results[0].AIRID, oData.results[0].MODID, oData.results[0].TAILID);
					}
				}.bind(this);

				ajaxutil.fnRead("/LeadPartiSvc", oPrmWB);
			} catch (e) {
				Log.error("Exception in _fnAirOverViewHeaderGet function");
			}
		},

		_fnAirOverViewItemGet: function(sAirID, sMODID, sTAILDID) {
			try {
				var that = this,
					oPrmWB = {};
				oPrmWB.filter = "FLAG eq I and AIRID eq " + sAirID + " and MODID eq " + sMODID + " and TAILID eq " + sTAILDID +
					" AND LPTYPE EQ LPTYREPRES";
				oPrmWB.error = function() {

				};

				oPrmWB.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "OverViewItemModel");
				}.bind(this);

				ajaxutil.fnRead("/LeadPartiSvc", oPrmWB);
			} catch (e) {
				Log.error("Exception in _fnAirOverViewItemGet function");
			}
		},

		_fnAirOverViewItemTankGet: function(sAirID, sMODID, sTAILDID) {
			try {
				var that = this,
					oPrmWB = {};
				oPrmWB.filter = "FLAG eq I and AIRID eq " + sAirID + " and MODID eq " + sMODID + " and TAILID eq " + sTAILDID +
					" AND LPTYPE EQ LPTANK";
				oPrmWB.error = function() {

				};

				oPrmWB.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "OverViewItemTankModel");
				}.bind(this);

				ajaxutil.fnRead("/LeadPartiSvc", oPrmWB);
			} catch (e) {
				Log.error("Exception in _fnAirOverViewItemTankGet function");
			}
		},

		_fnAirOverViewItemOilGet: function(sAirID, sMODID, sTAILDID) {
			try {
				var that = this,
					oPrmWB = {};
				oPrmWB.filter = "FLAG eq I and AIRID eq " + sAirID + " and MODID eq " + sMODID + " and TAILID eq " + sTAILDID +
					" AND LPTYPE EQ LPFUELOIL";
				oPrmWB.error = function() {

				};

				oPrmWB.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "OverViewItemOILModel");
				}.bind(this);

				ajaxutil.fnRead("/LeadPartiSvc", oPrmWB);
			} catch (e) {
				Log.error("Exception in _fnAirOverViewItemOilGet function");
			}
		},

		_fnCAPDataGet: function(sFlag, sJobId, sCapId) {
			try {
				var that = this,

					oPrmJobDue = {};
				var oViewModel = dataUtil.createNewJsonModel();
				oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData.results.length !== 0) {
						oViewModel.setData(oData.results[0]);
						if (oData.results[0].EXPDT !== null) {
							oData.results[0].EXPDT = new Date(oData.results[0].EXPDT);
							oData.results[0].EXPTM = formatter.defaultTimeFormatDisplay(oData.results[0].EXPTM);
							oData.results[0].SUBUZT = new Date().getHours() + ":" + new Date().getMinutes();
						}
						if (oData.results[0].UTIL1 !== "UTIL1_20" && this.oObject && this.oObject[oData.results[0].UTIL1]) {
							oViewModel.getData().UTILMINVL = parseFloat(this.oObject[oData.results[0].UTIL1].VALUE);
						}
						var bFlag = (oData.results[0].LDESC && oData.results[0].LDESC.length > 0) ? true : false;
						this.getModel("oViewLimitModel").setProperty("/bLimitation", bFlag);
						this.getModel("oViewLimitModel").setProperty("/bAddLimitationBtn", !bFlag);
						that.getView().setModel(oViewModel, "CapExtendSet");
					}

				}.bind(this);

				ajaxutil.fnRead("/EDITLIMITATIONSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnCAPDataGet function");
			}
		},

		CAPDataUpdate: function() {
			try {
				var that = this,
					oPayload,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				if (!this.handleChange()) {
					return;
				}
				oPayload = this.getView().getModel("CapExtendSet").getData();

				if (oPayload.OPPR === "U") {
					oPayload.EXPDT = null;
					oPayload.EXPTM = null;
				} else if (oPayload.OPPR === "D") {
					oPayload.UTILVL = null;
					oPayload.UTIL1 = null;
				}
				if (oPayload.UTILVL) {
					var iPrec = formatter.JobDueDecimalPrecision(oPayload.UTIL1);
					oPayload.UTILVL = parseFloat(oPayload.UTILVL, [10]).toFixed(iPrec);
				}
				//oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					that.onCloseMangeLimitaionDialog();
					that._fnApprovalDetailsRequestGet(that.Obj.id);
				}.bind(this);
				oPrmJobDue.activity = 2;
				ajaxutil.fnUpdate("/EDITLIMITATIONSvc", oPrmJobDue, [oPayload], "ZRM_ADDL", this);
			} catch (e) {
				Log.error("Exception in CAPDataUpdate function");
			}
		},

		CAPDataCancel: function() {
			try {
				var that = this,
					oPayload,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				oPayload = this.getView().getModel("CapExtendSet").getData();
				//oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
				oPayload.CSTAT = "X";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					that.onCloseMangeLimitaionDialog();
					that.getView().byId("MasterId").setVisible(false);
					/*	that._fnApprovalRequestGet();*/
					this.getRouter().navTo("Cosjobs");

				}.bind(this);
				oPrmJobDue.activity = 2;
				ajaxutil.fnUpdate("/EDITLIMITATIONSvc", oPrmJobDue, [oPayload], "ZRM_ADDL", this);
			} catch (e) {
				Log.error("Exception in CAPDataCancel function");
			}
		},

		//-------------------------------------------------------------------------------------
		//  Private method: This will get called, to get ADD count.
		// Table: CAP
		//--------------------------------------------------------------------------------------
		_fnADDCountGet: function(sCapTy) {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					sCount,
					oPrmJobDue = {};
				oPrmJobDue.filter = "TAILID eq " + this.getTailId();
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						sCount = oData.results[0].COUNT;
					} else {
						sCount = "0";
					}
					this.getView().getModel("ViewModel").setProperty("/ADDCount", sCount);
				}.bind(this);

				ajaxutil.fnRead("/GetAddCountSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:_fnADDCountGet function");
				this.handleException(e);
			}
		},

		_fnReasonforADDGet: function(sAirId) {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + sAirId + " and ddid eq CPR_";

				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "ReasonforADDModel");
				}.bind(this);

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnReasonforADDGet function");
			}
		},

		_fnPerioOfDeferCBGet: function(sAirId) {
			try {
				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				/*oPrmJobDue.filter = "airid eq " + sAirId + " and ddid eq 118_";*/
				oPrmJobDue.filter = "ddid eq 118_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "PerioOfDeferCBModel");
				}.bind(this);

				ajaxutil.fnRead("/MasterDDVALSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnPerioOfDeferCBGet function");
			}
		},
		_fnUtilizationGet: function(sAirId) {
			try {
				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + sAirId + " and ddid eq UTIL1_";
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "UtilizationCBModel");
				}.bind(this);

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnUtilizationGet function");
			}
		},
		
		_fnGetDateValidation: function(sJobId) {
			try {
				var oPrmTaskDue = {};
				oPrmTaskDue.filter = "TAILID eq " + this.getTailId() + " and JFLAG eq T and AFLAG eq I and jobid eq " + sJobId;
				oPrmTaskDue.error = function() {};
				oPrmTaskDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("ViewModel").setProperty("/backDt", oData.results[0].VDATE);
						this.getModel("ViewModel").setProperty("/backTm", oData.results[0].VTIME);
					}
				}.bind(this);
				ajaxutil.fnRead("/JobsDateValidSvc", oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in _fnGetDateValidation function");
			}
		},

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var that = this;
				this.fnCheckCapStatus();
				this._fnApprovalRequestGet();
				this._InitializeLimDialogModel();
				var oViewModel = dataUtil.createNewJsonModel();
				oViewModel.setData({
					Capid: "",
					description: "",
					flag: "",
					text: "",
					oFlag: "",
					SGUSR: "",
					SGDTM: "",
					editableFlag: true,
					dialogTitle: "",
					btnText: "Edit",
					DatePrev: new Date(),
					ADDCount: ""
				});

				this.getView().setModel(oViewModel, "ViewModel");
				var sAirId = that.getAircraftId();
				this._fnADDCountGet();
				this._fnReasonforADDGet(sAirId);
				this._fnPerioOfDeferCBGet(sAirId);
				this._fnUtilizationGet(sAirId);
				this._fnUtilization2Get();
				this._fnGetUtilisationDefaultValue(sAirId);
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		},
		onEditRequest: function(oEvent) {
			try {
				var that = this,
					oNavModel = this.getModel("ApprovalDetailstModel"),
					oModel = this.getView().getModel("CapExtendSet"),
					oModelDialog = this.getView().getModel("ViewModel");
				this._fnCAPDataGet("O", oNavModel.getProperty("/jobid"), oNavModel.getProperty("/capid"));
				this._fnGetDateValidation(oNavModel.getProperty("/jobid"));
				if (!this._oManageLim) {
					this._oManageLim = sap.ui.xmlfragment("EditLimId",
						"avmet.ah.fragments.ApprovalManageLimitation",
						this);
					this.getView().addDependent(this._oManageLim);
				}
				if (oModel.getProperty("/EXTEND") === "X") {
					oModelDialog.setProperty("/editableFlag", false);
				}

				this._oManageLim.open(this);
			} catch (e) {
				Log.error("Exception in onEditRequest function");
			}
		},

		onCloseMangeLimitaionDialog: function() {
			try {
				if (this._oManageLim) {
					this._oManageLim.close(this);
					this._oManageLim.destroy();
					delete this._oManageLim;
				}
			} catch (e) {
				Log.error("Exception in onCloseMangeLimitaionDialog function");
			}
		},
		_InitializeLimDialogModel: function() {
			try {
				var oModel = dataUtil.createNewJsonModel();
				var DatePrev = new Date();
				var aData = {
					sAddReason: "noKey",
					bDateSection: false,
					bUtilisationSection: false,
					bLimitationSection: false,
					bPrdOfDefermentDesc: false,
					bDemandNo: false,
					bOtherReason: false,
					bPeriodofDeferment: false,
					sUtilKey: "",
					bAirFrameAndTAC: false,
					bScheduleService: false,
					bPhaseService: false,
					bLimitation: false,
					bAddLimitationBtn: true,
					sSlectedKey: "N",
					DatePrev: DatePrev,
					Date: new Date(),
					Time: new Date().getHours() + ":" + new Date().getMinutes()
				};
				oModel.setData(aData);
				if (this.getModel("oViewLimitModel")) {
					this.getModel("oViewLimitModel").setData(aData);
				} else {
					this.getView().setModel(oModel, "oViewLimitModel");
				}

			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		}

	});
});