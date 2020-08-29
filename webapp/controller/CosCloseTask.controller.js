sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil",
	"../model/AvMetInitialRecord",
	"sap/base/Log",
	"sap/m/MessageBox"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil, AvMetInitialRecord, Log, MessageBox) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAHUL THORAT   
	 *   Control name: Close Task          
	 *   Purpose : Close all tasks create under selected Job.
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
	return BaseController.extend("avmet.ah.controller.CosCloseTask", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var oDDT1Model, oDDT2Model;
				this._InitializeLimDialogModel();
				this.getView().setModel(dataUtil.createNewJsonModel(), "oViewGlobalModel");

				oDDT1Model = dataUtil.createNewJsonModel();
				oDDT1Model.setData([{
					"key": "Serial No. (S/N)",
					"text": "Serial No. (S/N)"
				}, {
					"key": "Batch No.",
					"text": "Batch No."
				}]);
				this.getView().setModel(oDDT1Model, "TT1Model");
				var oFollowModelOther = dataUtil.createNewJsonModel();
				oFollowModelOther.setData([{
					"key": "TT1_14",
					"text": "Others"
				}, {
					"key": "TT1_ADD",
					"text": "Transfer to Acceptable Deferred Defects Log"
				}]);
				this.getView().setModel(oFollowModelOther, "FollowOtherModel");

				var oFollowModelOPS = dataUtil.createNewJsonModel();
				oFollowModelOPS.setData([{
					"key": "TT1_11",
					"text": "OPS Check"
				}, {
					"key": "TT1_AD",
					"text": "Transfer to Acceptable Deferred Defects Log"
				}]);
				this.getView().setModel(oFollowModelOPS, "FollowOPSModel");

				oDDT2Model = dataUtil.createNewJsonModel();
				oDDT2Model.setData([{
					"key": "Material No.",
					"text": "Material No."
				}, {
					"key": "Part No.",
					"text": "Part No."
				}]);
				this.getView().setModel(oDDT2Model, "TT2Model");

				this.getRouter().getRoute("CosCloseTask").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onInit function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		//1.on segmented button selection change
		onSegmentedButtonSelection: function(oEvent) {
			try {
				var oModel = this.getView().getModel("ViewModel"),
					oSelectedKey = oEvent.getSource().getSelectedKey();
				if (oSelectedKey === "N") {
					oModel.setProperty("/tradeTable", false);
				} else {
					oModel.setProperty("/tradeTable", true);
				}
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onSegmentedButtonSelection function");
				this.handleException(e);
			}
		},
		//2.on icon bar selection change
		onIconSelected: function(oEvent) {
			try {
				var oModel = this.getView().getModel("ViewModel");
				if (oEvent.getParameter("item").getText() === "2.Tradesman Sign Off") {
					oModel.setProperty("/proccedBtn", false);
					oModel.setProperty("/backBtn", true);
					oModel.setProperty("/signOffBtn", true);
				} else {
					oModel.setProperty("/proccedBtn", true);
					oModel.setProperty("/backBtn", false);
					oModel.setProperty("/signOffBtn", false);
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onIconSelected function");
				this.handleException(e);
			}
		},
		//3.on click of procced button
		onProceed: function(oEvent) {
			try {
				/*FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}*/
				var oModel = this.getView().getModel("ViewModel");
				oModel.setProperty("/bTradesMan", true);
				oModel.setProperty("/selectedIcon", "tradesMan");
				oModel.setProperty("/signOffBtn", true);
				oModel.setProperty("/proccedBtn", false);
				oModel.setProperty("/backBtn", true);
				oModel.setProperty("/tradeTable", false);
				oModel.setProperty("/MulitiFlag", "noKey");
			} catch (e) {
				Log.error("Exception in CosCloseTask:onProceed function");
				this.handleException(e);
			}
		},
		//4.to add new tradesman to the list
		onAddTradesMan: function() {
			try {
				var oModel = this.getView().getModel("ViewModel").getProperty("/tradesManTable");
				oModel.push({
					"Name": "",
					"NRIC": "",
					"Delete": true
				});
				this.getView().getModel("ViewModel").setProperty("/tradesManTable", oModel);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onAddTradesMan function");
				this.handleException(e);
			}
		},

		_fnCreateMultiTradesmenPayload: function() {
			try {
				var that = this,
					oModelTrades = this.getView().getModel("ViewModel"),
					oTempPay = [],
					oPayload, oTradeMan, oTaskId;
				oTradeMan = oModelTrades.getProperty("/tradesManTable");
				oTaskId = oModelTrades.getProperty("/TaskId");

				for (var i = 0; i < oTaskId.length; i++) {
					for (var j = 0; j < oTradeMan.length; j++) {
						oTempPay.push({
							"TASKID": oTaskId[i],
							"NUM": j + 1,
							"ENDDA": null,
							"BEGDA": null,
							"USRID": oTradeMan[j].Name
						});

					}
				}
				that._fnMultiTradmanCreate(oTempPay);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnCreateMultiTradesmenPayload function");
				this.handleException(e);
			}
		},

		_fnMultiTradmanCreate: function(oPayLoad) {
			try {
				var that = this,
					oPrmTD = {},
					oAppModel = that.getView().getModel("LocalModel"),
					oViewModel = that.getView().getModel("ViewModel");

				oPrmTD.filter = "";
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					if (oViewModel.getProperty("/Flag") === "FS") {
						that.getRouter().navTo("CTCloseTask", {
							"srvtid": oViewModel.getProperty("/srvtid")
						});
					} else {
						that.getRouter().navTo("CosDefectsSummary", {
							"JobId": oViewModel.getProperty("/JobId"),
							"Flag": "Y"
						});
					}
				}.bind(this);
				ajaxutil.fnCreate("/CreTuserSvc", oPrmTD, oPayLoad);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnMultiTradmanCreate function");
				this.handleException(e);
			}
		},

		//5.delete the tradesman item
		onDeleteTradesMan: function(oEvent) {
			try {
				var oModel = this.getView().getModel("ViewModel").getProperty("/tradesManTable"),
					sPath = oEvent.getSource().getBindingContext("ViewModel").getPath().split("/")[2];
				oModel.splice(sPath, 1);
				this.getView().getModel("ViewModel").refresh(true);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onDeleteTradesMan function");
				this.handleException(e);
			}
		},
		//6. on Icon Tab selection change
		onIconTabSelection: function(oEvent) {
			try {
				var oModel = this.getView().getModel("ViewModel"),
					key = oEvent.getSource().getSelectedKey();
				if (key === "followUp") {
					oModel.setProperty("/signOffBtn", false);
					oModel.setProperty("/proccedBtn", true);
					oModel.setProperty("/backBtn", false);
				} else {
					oModel.setProperty("/signOffBtn", true);
					oModel.setProperty("/proccedBtn", false);
					oModel.setProperty("/backBtn", true);
					oModel.setProperty("/MulitiFlag", "noKey");
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onIconTabSelection function");
				this.handleException(e);
			}
		},
		//7.on click of back button
		onBack: function(oEvent) {
			try {
				var oModel = this.getView().getModel("ViewModel");
				oModel.setProperty("/selectedIcon", "followUp");
				oModel.setProperty("/signOffBtn", false);
				oModel.setProperty("/proccedBtn", true);
				oModel.setProperty("/backBtn", false);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onBack function");
				this.handleException(e);
			}
		},
		//8.on click of Sign Off button
		onSignOff: function(oEvent) {
			try {
				var oModel = this.getView().getModel("TaskModel"),
					oFLag = "0",
					sObject,
					oViewModel = this.getView().getModel("ViewModel"),
					oPrmTask = {},
					that = this,
					oPayload = [];

				oPayload = oModel.getData();
				if (oViewModel.getProperty("/MulitiFlag") === "Y") {
					oFLag = "1";
				}
				for (var i = 0; i < oPayload.length; i++) {
					oPayload[i].tstat = "P";
					oPayload[i].multi = oFLag;
					oPayload[i].sernr = oPayload[i].ftsernr;
					try {
						oPayload[i].ftcredt = formatter.defaultOdataDateFormat(oPayload[i].ftcredt);
					} catch (e) {
						oPayload[i].ftcredt = oPayload[i].ftcredt;
					}
					if (oPayload[i].CPRID !== null) {
						oPayload[i].ftdesc = "Transfer to Acceptable Deferred Defects Log";
					}
				}

				oPrmTask.filter = "";
				oPrmTask.error = function() {

				};
				oPrmTask.success = function(oData) {
					if (oData.results[0].multi !== "0") {
						that._fnCreateMultiTradesmenPayload();
					} else {
						that.getRouter().navTo("CosDefectsSummary", {
							"JobId": oViewModel.getProperty("/JobId"),
							"Flag": "Y"
						});
					}
				}.bind(this);
				if (oViewModel.getProperty("/Flag") === "FS") {
					sObject = "ZRM_FS_CTT";
				} else {
					sObject = "ZRM_COS_TT";
				}
					oPrmTask.activity = 4;

				ajaxutil.fnUpdate("/GetSelTaskSvc", oPrmTask, oPayload, sObject, this);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onSignOff function");
				this.handleException(e);
			}
		},

		onPrdOfDefermentChange: function(oEvent) {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel"),
					oModel = this.getView().getModel("oViewGlobalModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				if (sSelectedKey === "118_UC") {
					oViewLimitModel.setProperty("/bPrdOfDefermentDesc", true);
				} else {
					oViewLimitModel.setProperty("/bPrdOfDefermentDesc", false);
				}
				oModel.setProperty("/DEFPD", sSelectedKey);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onPrdOfDefermentChange function");
				this.handleException(e);
			}
		},

		onReasonForADDChange: function(oEvent) {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel"),
					oModel = this.getView().getModel("oViewGlobalModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				if (sSelectedKey === "CPR_10") {
					oViewLimitModel.setProperty("/bDemandNo", true);
				} else {
					oViewLimitModel.setProperty("/bDemandNo", false);
				}
				if (sSelectedKey === "CPR_14") {
					oViewLimitModel.setProperty("/bOtherReason", true);
				} else {
					oViewLimitModel.setProperty("/bOtherReason", false);
				}
				if (sSelectedKey === "CPR_11") {
					oViewLimitModel.setProperty("/bPeriodofDeferment", false);
				} else {
					oViewLimitModel.setProperty("/bPeriodofDeferment", true);
				}
				oModel.setProperty("/CPRID", sSelectedKey);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onReasonForADDChange function");
				this.handleException(e);
			}
		},

		onReasonTypeChange: function(oEvent) {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel"),
					oModel = this.getView().getModel("oViewGlobalModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				if (sSelectedKey === "D") {
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
				} else if (sSelectedKey === "B") {
					oViewLimitModel.setProperty("/bDateSection", true);
					oViewLimitModel.setProperty("/bUtilisationSection", true);
					oViewLimitModel.setProperty("/sSlectedKey", sSelectedKey);
				}
				oModel.setProperty("/OPPR", sSelectedKey);
				oViewLimitModel.setProperty("/bLimitationSection", true);
				/*	oViewLimitModel.setProperty("/bLimitation", false);
					oViewLimitModel.setProperty("/bAddLimitationBtn", true);*/
			} catch (e) {
				Log.error("Exception in CosCloseTask:onReasonTypeChange function");
				this.handleException(e);
			}
		},

		onUilisationChange: function(oEvent) {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel"),
					oModel = this.getView().getModel("oViewGlobalModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey();
				if (sSelectedKey === "UTIL1_10" || sSelectedKey === "UTIL1_11" || sSelectedKey === "UTIL1_12" || sSelectedKey === "UTIL1_13" ||
					sSelectedKey ===
					"UTIL1_14" || sSelectedKey === "UTIL1_15" || sSelectedKey === "UTIL1_21") {
					oViewLimitModel.setProperty("/bAirFrameAndTAC", true);
					oViewLimitModel.setProperty("/bScheduleService", false);
					oViewLimitModel.setProperty("/bPhaseService", false);
				} else if (sSelectedKey === "Next Scheduling Servicing") {
					oViewLimitModel.setProperty("/bAirFrameAndTAC", false);
					oViewLimitModel.setProperty("/bScheduleService", true);
					oViewLimitModel.setProperty("/bPhaseService", false);
				} else if (sSelectedKey === "Next Phase Servicing") {
					oViewLimitModel.setProperty("/bAirFrameAndTAC", false);
					oViewLimitModel.setProperty("/bScheduleService", false);
					oViewLimitModel.setProperty("/bPhaseService", true);
				}
				oModel.setProperty("/UTIL1", sSelectedKey);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onUilisationChange function");
				this.handleException(e);
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
			} catch (e) {
				Log.error("Exception in CosCloseTask:onRemoveLimitaionPress function");
				this.handleException(e);
			}
		},

		onAddLimitaionDialog: function(oEvent) {
			try {
				var that = this,
					oObject;
				oObject = oEvent.getSource().getBindingContext("TaskModel").getObject();
				if (!this._oAddLim) {
					this._oAddLim = sap.ui.xmlfragment(this.createId("idWorkCenterDialog"),
						"avmet.ah.fragments.AddTaskLimitation",
						this);
					this._InitializeLimDialogModel();
					this.getView().addDependent(this._oAddLim);
					this._fnUtilizationGet(oObject.tailid);
				}
				this._fnCreateLimitation(oObject);
				this._oAddLim.open(this);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onAddLimitaionDialog function");
				this.handleException(e);
			}
		},
		onCloseAddLimDialog: function() {
			try {
				if (this._oAddLim) {
					this._oAddLim.close(this);
					this._oAddLim.destroy();
					delete this._oAddLim;
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onCloseAddLimDialog function");
				this.handleException(e);
			}
		},

		onAddADDDialog: function(oEvent) {
			try {
				var that = this,
					oObject;
				oObject = oEvent.getSource().getBindingContext("TaskModel").getObject();
				if (!this._oAddADD) {
					this._oAddADD = sap.ui.xmlfragment(this.createId("idAddTaskADDDialog"),
						"avmet.ah.fragments.AddTaskADD",
						this);
					this._InitializeLimDialogModel();
					this._fnADDCountGet();
					this.getView().addDependent(this._oAddADD);
					this._fnUtilizationGet(oObject.tailid);
				}
				this._fnCreateLimitation(oObject);
				this._oAddADD.open(this);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onAddADDDialog function");
				this.handleException(e);
			}
		},
		onCloseADDDialog: function() {
			try {
				if (this._oAddADD) {
					this._oAddADD.close(this);
					this._oAddADD.destroy();
					delete this._oAddADD;
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onCloseADDDialog function");
				this.handleException(e);
			}
		},

		_fnADDCountGet: function() {
			try {
				var that = this,
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

		//-------------------------------------------------------------------------------------
		//  Private method: This will get called, to get Serial number for part number.
		// Table: ENGINE
		//--------------------------------------------------------------------------------------
		getSerialNoPress: function(oEvent) {
			try {
				var oPrmDD = {},
					oModel,
					oModelObj = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent()
					.getBindingContext("TaskModel"),
					that = this,
					oPayload;
				oModelObj.getObject("partno");
				oPrmDD.filter = "PARTNO eq " + oModelObj.getObject("partno") + " and ESTAT eq R and INSON eq "+this.getTailId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					if (oData.results.length !== 0) {
						oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						this.getView().setModel(oModel, "SerialNumModel");

					} else {
						MessageBox.error(
							"Part number is invalid.", {
								icon: sap.m.MessageBox.Icon.Error,
								title: "Error",
								styleClass: "sapUiSizeCompact"
							});
					}
				}.bind(this);

				ajaxutil.fnRead("/GetSerNoSvc", oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in getSerialNoPress function");
			}
		},

		_fnUtilizationGet: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + oModel.getProperty("/AirId") + " and ddid eq UTIL1_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "UtilizationCBModel");
				}.bind(this);

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnUtilizationGet function");
				this.handleException(e);
			}
		},

		_fnReasonforADDGet: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "airid eq " + oModel.getProperty("/AirId") + " and ddid eq CPR_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "ReasonforADDModel");
				}.bind(this);

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnReasonforADDGet function");
				this.handleException(e);
			}
		},
		_fnUtilization2Get: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "airid eq " + oModel.getProperty("/AirId") + " and ddid eq UTIL2_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "Utilization2CBModel");
				}.bind(this);

				ajaxutil.fnRead("/MasterDDVALSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnUtilization2Get function");
				this.handleException(e);
			}
		},

		_fnPerioOfDeferCBGet: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "airid eq " + oModel.getProperty("/AirId") + " and ddid eq 118_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "PerioOfDeferCBModel");
				}.bind(this);

				ajaxutil.fnRead("/MasterDDVALSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnPerioOfDeferCBGet function");
				this.handleException(e);
			}
		},

		_fnCreateLimitation: function(oObject) {
			try {
				this.getView().setModel(dataUtil.createNewJsonModel(), "oViewGlobalModel");
				var oTempData = AvMetInitialRecord.createInitialBlankRecord("ADDLimit");
				this.getModel("oViewGlobalModel").setData(oTempData[0]);
				this.getModel("oViewGlobalModel").setProperty("/JOBID", oObject.jobid);
				this.getModel("oViewGlobalModel").setProperty("/TAILID", oObject.tailid);
				this.getModel("oViewGlobalModel").setProperty("/FNDBY", oObject.creusr);
				this.getModel("oViewGlobalModel").setProperty("/TASKID", oObject.taskid);
				this.getModel("oViewGlobalModel").setProperty("/CAPDT", oObject.credtm);
				this.getModel("oViewGlobalModel").setProperty("/CAPTM", oObject.creuzt);
				this.getModel("oViewGlobalModel").setProperty("/BEGDA", oObject.credtm);
				this.getModel("oViewGlobalModel").setProperty("/CSTAT", "P");
				this.getModel("oViewGlobalModel").setProperty("/CAPTY", "L");
				this.getModel("oViewGlobalModel").setProperty("/ENDDA", "9999-12-31");
				this.getModel("oViewGlobalModel").setProperty("/FLAG_JT", "T");
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnCreateLimitation function");
				this.handleException(e);
			}
		},

		onCreateLimitationPress: function() {
			try {
				/*	FieldValidations.resetErrorStates(this);
						if (FieldValidations.validateFields(this)) {
							return;
						}*/
				var dDate = new Date(),
					oModel = this.getView().getModel("ViewModel");
				var oParameter = {};
				var oPayLoad = {};
				oPayLoad = this.getModel("oViewGlobalModel").getData();
				if (oPayLoad.EXPDT !== null && oPayLoad.EXPDT !== "") {
					oPayLoad.EXPDT = formatter.defaultOdataDateFormat(oPayLoad.EXPDT);
				} else {
					oPayLoad.EXPDT = null;
				}

				if ((oPayLoad.LDESC !== "" && oPayLoad.LDESC !== null) && (oPayLoad.CPRID !== "" && oPayLoad.CPRID !== null)) {
					oPayLoad.CAPTY = "B";
					oPayLoad.FLAG_ADD = "B";
				} else if ((oPayLoad.LDESC === "" && oPayLoad.LDESC === null) && (oPayLoad.CPRID !== "" && oPayLoad.CPRID !== null)) {
					oPayLoad.CAPTY = "A";
				} else {
					oPayLoad.CAPTY = "L";
				}

				oPayLoad.CSTAT = "P";

				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					this._fnTasksGet(oModel.getProperty("/TaskId"));
					this.onCloseAddLimDialog();
					this.onCloseADDDialog();
				}.bind(this);
				oParameter.activity = 1;
				ajaxutil.fnCreate("/ADDSvc", oParameter, [oPayLoad], "ZRM_ADDL", this);
				var ViewGlobalModel = this.getModel("oViewGlobalModel");
				ViewGlobalModel.setData(null);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onCreateLimitationPress function");
				this.handleException(e);
			}
		},

		onTypeChangeOther: function(oEvent) {
			try {
				var oSelectedKey = oEvent.getSource().getSelectedKey(),
					oModel = this.getView().getModel("ViewModel");
				oModel.setProperty("/bAddADDOther", oSelectedKey);
				if (oSelectedKey === "TT1_ADD") {
					this.onAddADDDialog(oEvent);
				} else {
					oEvent.getSource().setSelectedKey("TT1_14");
				}

			} catch (e) {
				Log.error("Exception in CosCloseTask:onTypeChangeOther function");
				this.handleException(e);
			}
		},

		onTypeChangeOPS: function(oEvent) {
			try {
				var oSelectedKey = oEvent.getSource().getSelectedKey(),
					oModel = this.getView().getModel("ViewModel");
				oModel.setProperty("/bAddADDOps", oSelectedKey);
				if (oSelectedKey === "TT1_AD") {
					this.onAddADDDialog(oEvent);
				} else {
					oEvent.getSource().setSelectedKey("TT1_11");
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onTypeChangeOPS function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				//var workcenter = oEvent.getParameters().arguments.WorkCenter;
				/*oModel = this.getView().getModel("ViewModel"),
						that = this;
					this.selectedWC = workcenter;
					oModel.loadData("model/localJobFunctionData.json", false).then(function (param) {
						that._fnInitialLoad();
					});*/

				var that = this,
					sWrkCenter = oEvent.getParameters().arguments.WorkCenter,
					sJobId = oEvent.getParameters().arguments.JobId,
					sTaskId = oEvent.getParameters().arguments.TaskId,
					sAirId = oEvent.getParameters().arguments.AirId,
					sTailId = oEvent.getParameters().arguments.TailId,
					sWorkKey = oEvent.getParameters().arguments.WorkKey,
					sflag = oEvent.getParameters().arguments.Flag,
					ssrvtid = oEvent.getParameters().arguments.srvtid,
					ViewModel = dataUtil.createNewJsonModel(),
					oDate = new Date(),
					oTempJB;

				oTempJB = JSON.parse(sTaskId);

				ViewModel.setData({
					JobId: sJobId,
					TaskId: oTempJB,
					WorkCenter: sWrkCenter,
					TailId: sTailId,
					AirId: sAirId,
					WorkKey: sWorkKey,
					Flag: sflag,
					srvtid: ssrvtid,
					sDate: oDate,
					Time: oDate.getHours() + ":" + oDate.getMinutes(),
					MulitiFlag: "noKey",
					proccedBtn: true,
					backBtn: true,
					signOffBtn: false,
					bTradesMan: false,
					selectedIcon: "followUp",
					bAddADDOther: false,
					bAddADDOps: false,
					ADDCount: "",
					tradesManTable: [{
						"Name": "",
						"NRIC": "",
						"Delete": true
					}, {
						"Name": "",
						"NRIC": "",
						"Delete": true
					}]

				});

				that.getView().setModel(ViewModel, "ViewModel");
				this._fnTasksGet(oTempJB);
				this._fnReasonforADDGet();
				this._fnUtilizationGet();
				this._fnPerioOfDeferCBGet();
				//that._fnInitialLoad();
			} catch (e) {
				Log.error("Exception in CosCloseTask:_onObjectMatched function");
				this.handleException(e);
			}
		},

		_fnTasksGet: function(oTempJB) {
			try {
				var that = this,
					filters = [],
					sFilter, bFlag = true,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				var Temp = oModel.getProperty("/TaskId");

				for (var i = 0; i < Temp.length; i++) {
					if (bFlag) {
						sFilter = "taskid eq " + Temp[i];
						bFlag = false;
					} else {
						var sFilterStr = " and taskid eq " + Temp[i];
						sFilter = sFilter.concat(sFilterStr);
					}
					/*filters.push(new sap.ui.model.Filter("taskid", sap.ui.model.FilterOperator.EQ, Temp[i]));*/
				}

				oPrmJobDue.filter = sFilter;
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].ftcredt = new Date();
						oData.results[i].ftcretm = new Date().getHours() + ":" + new Date().getMinutes();
						if (oData.results[i].tt1id === 'TT1_12' && oData.results[i].tt2id === '' && oData.results[i].tt3id === '' && oData.results[i].tt4id ===
							'') {
							oData.results[i].ftrsltgd = "NA";
						}
					}
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TaskModel");
					that.getView().byId("vbLimId").invalidate();
				}.bind(this);

				ajaxutil.fnRead("/GetSelTaskSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnTasksGet function");
				this.handleException(e);
			}
		},

		//Loads the data after the view initialised
		_fnInitialLoad: function() {
			try {
				var oModel = this.getView().getModel("ViewModel"),
					that = this;
				oModel.setProperty("/tradeTable", false);
				oModel.setProperty("/bTradesMan", false);
				oModel.setProperty("/proccedBtn", true);
				oModel.setProperty("/selectedIcon", "followUp");
				oModel.setProperty("/createdData", new Date());
				oModel.setProperty("/createdTime", new Date());
				oModel.setProperty("/backBtn", false);
				oModel.setProperty("/signOffBtn", false);
				this.model = dataUtil.getDataSet("createJobModel");
				oModel.setProperty("/singelSelect", this.model.singelSelect);
				oModel.setProperty("/multiSelect", this.model.multiSelect);
				this.model.oFilter.filter(function(arr) {
					if (arr.WorkCenter === that.selectedWC) {
						oModel.setProperty("/CloseTask", arr.CloseTask);
					}
				});
				oModel.refresh(true);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnInitialLoad function");
				this.handleException(e);
			}
		},
		_InitializeLimDialogModel: function() {
			try {
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData({
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
					Date: new Date(),
					Time: new Date().getHours() + ":" + new Date().getMinutes()
				});
				this.getView().setModel(oModel, "oViewLimitModel");
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		}
	});
});