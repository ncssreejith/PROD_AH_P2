sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"../model/formatter",
	"../model/AvMetInitialRecord",
	"sap/base/Log"
], function(BaseController, dataUtil, FieldValidations, ajaxutil, formatter, AvMetInitialRecord, Log) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAJAT GUPTA 
	 *   Control name: TransferToADD          
	 *   Purpose : Transfer job to add functionality
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onSignOffPress
	 *     2. Backend Calls
	 *        2.1 fnLogById
	 *     3. Private calls
	 *        3.1 _onObjectMatched
	 *        3.2 fnSetReason
	 *   Note :
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.TransferToADD", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {

				this.getView().setModel(dataUtil.createNewJsonModel(), "oViewGlobalModel");
				this.getView().setModel(dataUtil.createNewJsonModel(), "UtilizationCBModel");
				this.getView().setModel(dataUtil.createNewJsonModel(), "ReasonforADDModel");
				this.getView().setModel(dataUtil.createNewJsonModel(), "Utilization2CBModel");
				this.getView().setModel(dataUtil.createNewJsonModel(), "PerioOfDeferCBModel");
				this.getRouter().getRoute("RouteTransferToADD").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:onInit function");
				this.handleException(e);
			}
		},
		
		handleChange: function() {
			var prevDt = this.getModel("oViewModel").getProperty("/backDt");
			var prevTime = this.getModel("oViewModel").getProperty("/backTm");
			return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorCreateADDpast", "errorCreateADDfuture", prevDt, prevTime);
		},
		
		handleChangeExpiry : function (){
			var prevDt = this.getModel("oViewModel").getProperty("/backDt");
			var prevTime = this.getModel("oViewModel").getProperty("/backTm");
			return formatter.validDateTimeChecker(this, "DP2", "TP2", "errorADDexpiryDatePast", "", prevDt, prevTime, false);
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onReasonForADDChange: function(oEvent) {
			try {

				var oViewModel = this.getModel("oViewModel"),
					oModel = this.getView().getModel("oViewGlobalModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				if (sSelectedKey === "CPR_10") {
					oViewModel.setProperty("/bDemandNo", true);
				} else {
					oViewModel.setProperty("/bDemandNo", false);
				}
				if (sSelectedKey === "CPR_14") {
					oViewModel.setProperty("/bOtherReason", true);
				} else {
					oViewModel.setProperty("/bOtherReason", false);
				}
				if (sSelectedKey === "CPR_11") {
					oViewModel.setProperty("/bPeriodofDeferment", false);
				} else {
					oViewModel.setProperty("/bPeriodofDeferment", true);
				}
				oModel.setProperty("/CPRID", sSelectedKey);
				oViewModel.updateBindings(true);
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:onReasonForADDChange function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onPrdOfDefermentChange: function(oEvent) {
			try {

				var oViewModel = this.getModel("oViewModel"),
					oModel = this.getView().getModel("oViewGlobalModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				if (sSelectedKey === "118_UC") {
					oViewModel.setProperty("/bPrdOfDefermentDesc", true);
				} else {
					oViewModel.setProperty("/bPrdOfDefermentDesc", false);
				}
				oModel.setProperty("/DEFPD", sSelectedKey);
				oViewModel.updateBindings(true);
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:onPrdOfDefermentChange function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onReasonTypeChange: function(oEvent) {
			try {

				var oViewModel = this.getModel("oViewModel"),
					oModel = this.getView().getModel("oViewGlobalModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				oModel.setProperty("/UTIL1", null);
				oModel.setProperty("/UTILVL", null);
				oModel.setProperty("/EXPDT", null);
				oModel.setProperty("/EXPTM", null);
				if (sSelectedKey === "D") {
					oModel.setProperty("/EXPTM", "23:59");
					oViewModel.setProperty("/bDateSection", true);
					oViewModel.setProperty("/bUtilisationSection", false);
					oViewModel.setProperty("/sSlectedKey", sSelectedKey);
				} else if (sSelectedKey === "U") {
					oViewModel.setProperty("/bDateSection", false);
					oViewModel.setProperty("/bUtilisationSection", true);
					oViewModel.setProperty("/sUtilKey", "");
					oViewModel.setProperty("/bAirFrameAndTAC", false);
					oViewModel.setProperty("/bScheduleService", false);
					oViewModel.setProperty("/bPhaseService", false);
					oViewModel.setProperty("/sSlectedKey", sSelectedKey);
				} else if (sSelectedKey === "B") {
					oModel.setProperty("/EXPTM", "23:59");
					oViewModel.setProperty("/bDateSection", true);
					oViewModel.setProperty("/bUtilisationSection", true);
					oViewModel.setProperty("/sSlectedKey", sSelectedKey);
				}
				oModel.setProperty("/OPPR", sSelectedKey);
				oViewModel.setProperty("/bLimitationSection", true);
				oViewModel.setProperty("/bLimitation", false);
				oViewModel.setProperty("/bAddLimitationBtn", true);
				oViewModel.updateBindings(true);
				//oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:onReasonTypeChange function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onUilisationChange: function(oEvent) {
			try {

				var oViewModel = this.getModel("oViewModel"),
					oModel = this.getView().getModel("oViewGlobalModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				if (sSelectedKey === "UTIL1_18" || sSelectedKey === "UTIL1_19" || sSelectedKey === "UTIL1_16" || sSelectedKey === "UTIL1_17" ||
					sSelectedKey === "UTIL1_10") {
					oViewModel.setProperty("/bAirFrameAndTAC", true);
					oViewModel.setProperty("/bScheduleService", false);
					oViewModel.setProperty("/bPhaseService", false);
				} else if (sSelectedKey === "UTIL1_21") {
					oViewModel.setProperty("/bAirFrameAndTAC", false);
					oViewModel.setProperty("/bDate", true);
					oViewModel.setProperty("/bPhaseService", false);
				} else if (sSelectedKey === "UTIL1_20") {
					oViewModel.setProperty("/bAirFrameAndTAC", false);
					oViewModel.setProperty("/bScheduleService", false);
					oViewModel.setProperty("/bPhaseService", true);
				}

				if (sSelectedKey.length > 0) {
					if (this.oObject && this.oObject[sSelectedKey] && this.oObject[sSelectedKey].VALUE) {
						var minVal = parseFloat(this.oObject[sSelectedKey].VALUE, [10]);
						oModel.setProperty("/UTILMINLVL", minVal);
						var sVal = oModel.getProperty("/UTILVL") ? oModel.getProperty("/UTILVL") : 0;
						sVal = parseFloat(sVal, [10]);
						var iPrec = formatter.JobDueDecimalPrecision(sSelectedKey);
						oModel.setProperty("/UTILVL", parseFloat(minVal, [10]).toFixed(iPrec));
					}

				}

				oModel.setProperty("/UTIL1", sSelectedKey);
				oViewModel.updateBindings(true);
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:onUilisationChange function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onAddLimitaionPress: function() {
			try {

				var oViewModel = this.getModel("oViewModel");
				oViewModel.setProperty("/bLimitation", true);
				oViewModel.setProperty("/bAddLimitationBtn", false);
				oViewModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:onAddLimitaionPress function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onRemoveLimitaionPress: function() {
			try {

				var oViewModel = this.getModel("oViewModel");
				oViewModel.setProperty("/bLimitation", false);
				oViewModel.setProperty("/bAddLimitationBtn", true);
				this.getView().getModel("oViewGlobalModel").setProperty("/LDESC","");
				oViewModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:onRemoveLimitaionPress function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onNavToDefectSummaryADD: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("RouteDefectSummaryADD");
			} catch (e) {
				Log.error("Exception in TrasnferToADD:onNavToDefectSummaryADD function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onSubmitTransferJobAdd: function() {
			try {
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				
				if (!this.handleChange()) {
					return;
				}
				if (!this.handleChangeExpiry()) {
					return;
				}
				var dDate = new Date();
				var oParameter = {};
				var oPayLoad = {};
				oPayLoad = this.getModel("oViewGlobalModel").getData();
				if (oPayLoad.OPPR === "N") {
					sap.m.MessageBox.error("Please select 'But not later than'");
					return;
				}
				if (oPayLoad.EXPDT !== null) {
					try {
						oPayLoad.ENDDA = formatter.defaultOdataDateFormat(oPayLoad.EXPDT);
					} catch (e) {
						oPayLoad.ENDDA = oPayLoad.EXPDT;
					}
					try {
						oPayLoad.EXPDT = formatter.defaultOdataDateFormat(oPayLoad.EXPDT);
					} catch (e) {
						oPayLoad.EXPDT = oPayLoad.EXPDT;
					}
				} else {
					oPayLoad.ENDDA = formatter.defaultOdataDateFormat(new Date());
					oPayLoad.EXPDT = null;
				}
				oPayLoad.BEGDA = oPayLoad.ENDDA;
				try {
					oPayLoad.CAPDT = formatter.defaultOdataDateFormat(oPayLoad.CAPDT);
				} catch (e) {
					oPayLoad.CAPDT = oPayLoad.CAPDT;
				}

				try {
					if (oPayLoad.UTILVL) {
						var iPrec = formatter.JobDueDecimalPrecision(oPayLoad.UTIL1);
						oPayLoad.UTILVL = parseFloat(oPayLoad.UTILVL, [10]).toFixed(iPrec);
					}
				} catch (e) {
					oPayLoad.UTILVL = oPayLoad.UTILVL;
				}

				oPayLoad.SUBDTM = formatter.defaultOdataDateFormat(dDate);
				oPayLoad.SUBUSR = "Test User";
				oPayLoad.SUBUZT = new Date().getHours() + ":" + new Date().getMinutes();
				if (oPayLoad.LDESC !== "" && oPayLoad.LDESC !== null) {
					oPayLoad.CAPTY = "B";
					oPayLoad.FLAG_ADD = "B";
				} else {
					oPayLoad.CAPTY = "A";
				}
				oPayLoad.CSTAT = "P";
				oPayLoad.FLAG_JT = "J";
				var oTemp = "";
				var ddDate = new Date();
				/*oPayLoad.CAPID = oTemp.concat("CAP_", ddDate.getFullYear(), ddDate.getMonth(), ddDate.getDate(), ddDate.getHours(), ddDate.getMinutes(),
					ddDate.getSeconds(), ddDate.getMilliseconds());*/

				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					this.getRouter().navTo("DashboardInitial", true);
					var ViewGlobalModel = this.getModel("oViewGlobalModel");
					ViewGlobalModel.setData(null);
				}.bind(this);
				oParameter.activity = 1;
				ajaxutil.fnCreate("/ADDSvc", oParameter, [oPayLoad], "ZRM_ADDL", this);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:onSubmitTransferJobAdd function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 2. Backend calls  
		// ***************************************************************************	

		_fnReasonforADDGet: function() {
			try {

				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + oModel.getProperty("/sAirId") + " and ddid eq CPR_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						that.getView().getModel("ReasonforADDModel").setData(oData.results);
						that.getView().getModel("ReasonforADDModel").updateBindings(true);
					}
				}.bind(this);

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:_fnReasonforADDGet function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_fnUtilizationGet: function() {
			try {

				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + oModel.getProperty("/sAirId") + " and ddid eq UTIL1_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						that.getView().getModel("UtilizationCBModel").setData(oData.results);
						that.getView().getModel("UtilizationCBModel").updateBindings(true);
					}
				}.bind(this);

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:_fnUtilizationGet function");
				this.handleException(e);
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

		_fnADDCountGet: function() {
			try {
				var that = this,
					sCount,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "TAILID eq " + this.getTailId();
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						sCount = oData.results[0].COUNT;
					} else {
						sCount = "0";
					}
					this.getView().getModel("oViewModel").setProperty("/ADDCount", sCount);
				}.bind(this);

				ajaxutil.fnRead("/GetAddCountSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:_fnADDCountGet function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_fnUtilization2Get: function() {
			try {

				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				/*oPrmJobDue.filter = "airid eq " + oModel.getProperty("/sAirId") + " and ddid eq UTIL2_";*/
				oPrmJobDue.filter = "ddid eq UTIL2_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						that.getView().getModel("Utilization2CBModel").setData(oData.results);
						that.getView().getModel("Utilization2CBModel").updateBindings(true);
					}
				}.bind(this);

				ajaxutil.fnRead("/MasterDDVALSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:_fnUtilization2Get function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_fnPerioOfDeferCBGet: function() {
			try {

				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				/*oPrmJobDue.filter = "airid eq " + oModel.getProperty("/sAirId") + " and ddid eq 118_";*/
				oPrmJobDue.filter = "ddid eq 118_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						that.getView().getModel("PerioOfDeferCBModel").setData(oData.results);
						that.getView().getModel("PerioOfDeferCBModel").updateBindings(true);
					}
				}.bind(this);

				ajaxutil.fnRead("/MasterDDVALSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:_fnPerioOfDeferCBGet function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		/*	_fnADDCountGet: function(sJobId, sTailId, sJobDesc, sFndId, sFndBy) {
				try {

					var that = this,
						oModel = this.getView().getModel("oViewModel"),
						oPrmJobDue = {};
					oPrmJobDue.filter = "JOBID eq " + sJobId;
					oPrmJobDue.error = function() {

					};
					oPrmJobDue.success = function(oData) {
						if (oData.results[0].COUNT === null || oData.results[0].COUNT === "0") {
							var oTempData = AvMetInitialRecord.createInitialBlankRecord("ADDLimit");
							this.getModel("oViewGlobalModel").setData(oTempData[0]);
							this.getModel("oViewGlobalModel").setProperty("/CAPTM", new Date().getHours() + ":" + new Date().getMinutes());
							this.getModel("oViewGlobalModel").setProperty("/CAPDT", new Date());
							this.getModel("oViewGlobalModel").setProperty("/JOBID", sJobId);
							this.getModel("oViewGlobalModel").setProperty("/TAILID", sTailId);
							this.getModel("oViewGlobalModel").setProperty("/FNDURING", sFndId);
							this.getModel("oViewGlobalModel").setProperty("/FNDBY", sFndBy);
							this.getModel("oViewGlobalModel").setProperty("/JOBDESC", sJobDesc);
							this.getModel("oViewGlobalModel").updateBindings(true);
						} else {
							this._fnADDCapDataGet();
							this.getModel("oViewGlobalModel").setData(oData.results[0]);
							this.getModel("oViewGlobalModel").updateBindings(true);
						}
					}.bind(this);

					ajaxutil.fnRead("/ADDSvc", oPrmJobDue);
				} catch (e) {
					Log.error("Exception in xxxxx function");
				}
			},*/
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_fnADDCapDataGet: function(sCapId) {
			try {

				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "CAPID eq " + sCapId;
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						this.getModel("oViewGlobalModel").setData(oData.results[0]);
						this.getModel("oViewGlobalModel").updateBindings(true);
					}
				}.bind(this);

				ajaxutil.fnRead("/ADDSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:_fnADDCapDataGet function");
				this.handleException(e);
			}
		},
		
		_fnGetDateValidation: function(sJobId) {
			try {
				var oPrmTaskDue = {};
				oPrmTaskDue.filter = "TAILID eq " + this.getTailId() + " and JFLAG eq T and AFLAG eq I and jobid eq " + sJobId;
				oPrmTaskDue.error = function() {};
				oPrmTaskDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("oViewModel").setProperty("/backDt", oData.results[0].VDATE);
						this.getModel("oViewModel").setProperty("/backTm", oData.results[0].VTIME);
					}
				}.bind(this);
				ajaxutil.fnRead("/JobsDateValidSvc", oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in _fnGetDateValidation function");
			}
		},

		// ***************************************************************************
		//                 3. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var oADDTransferModel = dataUtil.getDataSet("ADDTransferModel");
				var sJobId = oEvent.getParameters("").arguments.JobId;
				var sTailId = this.getTailId();
				var sAirId = this.getAircraftId();
				var sJobDesc = oADDTransferModel[0].JobDesc;
				var sFndId = oEvent.getParameters("").arguments.FndId;
				var sFndBy = oEvent.getParameters("").arguments.FndBy;
				var oTempData = AvMetInitialRecord.createInitialBlankRecord("ADDLimit");
				var oViewModel = this.getView().getModel("oViewGlobalModel");
				oViewModel.setData(oTempData[0]);
				oViewModel.setProperty("/CAPTM", new Date().getHours() + ":" + new Date().getMinutes());
				oViewModel.setProperty("/CAPDT", new Date());
				oViewModel.setProperty("/JOBID", sJobId);
				oViewModel.setProperty("/TAILID", sTailId);
				oViewModel.setProperty("/FNDURING", sFndId);
				oViewModel.setProperty("/FNDBY", sFndBy);
				oViewModel.setProperty("/JOBDESC", sJobDesc);
				oViewModel.updateBindings(true);
				var PrevDate = new Date();
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData({
					"sJobId": sJobId,
					"sTailId": sTailId,
					"sAirId": sAirId,
					"sJobDesc": sJobDesc,
					"sFndId": sFndId,
					"sFndBy": sFndBy,
					"sAddReason": "noKey",
					"bDateSection": false,
					"bUtilisationSection": false,
					"bLimitationSection": false,
					"bPrdOfDefermentDesc": false,
					"bDemandNo": false,
					"bOtherReason": false,
					"bPeriodofDeferment": false,
					"sUtilKey": "",
					"bAirFrameAndTAC": false,
					"bScheduleService": false,
					"bPhaseService": false,
					"bLimitation": false,
					"bAddLimitationBtn": true,
					"sSlectedKey": "",
					"bDate": false,
					"DatePrev": PrevDate,
					"ADDCount": "",
					"ADDRemark": ""
				});
				this.getView().setModel(oModel, "oViewModel");
				var oModelSS = dataUtil.createNewJsonModel();
				oModelSS.setData({
					"key": "150",
					"Text": "150 hrly servicing"
				}, {
					"key": "200",
					"Text": "200 hrly servicing"
				}, {
					"key": "250",
					"Text": "250 hrly servicing"
				});
				this.getView().setModel(oModelSS, "ScheSerModel");
				this._fnADDCountGet();

				this._fnReasonforADDGet();
				this._fnUtilizationGet();
				this._fnUtilization2Get();
				this._fnGetUtilisationDefaultValue(sAirId);
				this._fnPerioOfDeferCBGet();
				this._fnGetDateValidation(sJobId);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:_onObjectMatched function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------------------------------
		//  Private method: This will get called,to open Limitation dialog.
		// Table: 
		//--------------------------------------------------------------------------------------
		onGetRemarkDialog: function(oEvent) {
			try {
				var that = this,
					oModel;
				oModel = this.getView().getModel("oViewGlobalModel");
				if (!this._oAddGetRemark) {
					this._oAddGetRemark = sap.ui.xmlfragment(this.createId("idRemarksDialog"),
						"avmet.ah.fragments.RemarksDialog",
						this);
					this.getView().addDependent(this._oAddGetRemark);
				}
				that._oAddGetRemark.setModel(oModel, "ADDSet");
				this._oAddGetRemark.open(this);
			} catch (e) {
				Log.error("Exception in onGetRemarkDialog function");
			}
		},
		//-------------------------------------------------------------------------------------
		//  Private method: This will get called,to close Limitation dialog.
		// Table: 
		//--------------------------------------------------------------------------------------
		onCloseGetRemarkDialog: function() {
			try {
				if (this._oAddGetRemark) {
					this._oAddGetRemark.close(this);
					this._oAddGetRemark.destroy();
					delete this._oAddGetRemark;
				}
			} catch (e) {
				Log.error("Exception in onCloseAddLimDialog function");
			}
		},
		onSubmitADD: function() {
			try {
				var sCount = this.getView().getModel("oViewModel").getProperty("/ADDCount");

				if (sCount >= "8") {
					this.onGetRemarkDialog();
				} else {
					this.onSubmitTransferJobAdd();
				}

			} catch (e) {
				Log.error("Exception in onSubmitADD function");
			}
		},

		onSaveRemark: function() {
			this.onCloseGetRemarkDialog();
			this.onSubmitTransferJobAdd();
		}

	});
});