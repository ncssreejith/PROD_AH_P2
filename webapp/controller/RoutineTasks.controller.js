sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, dataUtil, JSONModel, ajaxutil, formatter, Log) {
	"use strict";
	/* ***************************************************************************
	//Developer : Priya
	 *   This file is for Managing Tool page Framework               
	 *   1. Contain functions for top and side Toolbar items
	 *	Note: All Events must start with 'onXXXX' and Private functions '_XXXX'
	 *	Functions are not allowed to have more than 8 parameters and max 40 lines
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.RoutineTasks", {
		formatter: formatter,

		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************

		onInit: function() {
			try {
				var oModel = new JSONModel({
					"bTMSignOffEnable": false,
					"SignOffStep": "Tradesman Sign Off",
					"Date": new Date(),
					"Time": new Date().getHours() + ":" + new Date().getMinutes(),
					"Tradesman": [],
					"bNavBack": false,
					"bPageRefresh": true
				});
				this.getView().setModel(oModel, "oRoutineTasksViewModel");
				this.getRouter().getRoute("RoutineTasks").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		onAddRoutineTask: function() {
			try {
				var oModel = this.getModel("oRoutineTasksViewModel"),
					Tradesman = oModel.getProperty("/Tradesman");
				var oObj = {
					"DDDESC": "",
					"REFID": "AIR_10",
					"RTASKID": "",
					"DONE": null,
					"NA": null,
					"TAIL_ID": this.getTailId(),
					"SRVID": "",
					"SRVTID": "",
					"TASKID": "",
					"APR_NO": "1",
					"LOGIN_USER": "",
					"TRADE_USER": "",
					"TIME_S": null,
					"LEADFLAG": "X",
					"TLCDT": null,
					"TLCTM": null,
					"TLQTY": null,
					"PUBQTY": null,
					"TMPID": "",
					"stepid": "",
					"bSave": false,
					"bEdit": true,
					"bDelete": true
				};
				Tradesman.push(oObj);
				oModel.setProperty("/Tradesman", Tradesman);
				oModel.refresh(true);
				this._EnableSignOffButton();
			} catch (e) {
				Log.error("Exception in onAddRoutineTask function");
				this.handleException(e);
			}
		},

		onDeleteTradesManAdd: function(oEvent) {
			try {
				var oViewModel = this.getView().getModel("oRoutineTasksViewModel"),
					Tradesman = oViewModel.getProperty("/Tradesman"),
					iIndex = oEvent.getSource().getBindingContext("oRoutineTasksViewModel").sPath.split("/")[2];
				Tradesman.splice(iIndex, 1);
				oViewModel.refresh(true);
				this._EnableSignOffButton();
			} catch (e) {
				Log.error("Exception in onDeleteTradesManAdd function");
				this.handleException(e);
			}
		},

		onRTStatusChange: function(oEvent) {
			try {
				var oViewModel = this.getView().getModel("oRoutineTasksViewModel"),
					sSelectedKey = oEvent.getSource().getSelectedKey(),
					sPath = oEvent.getSource().getBindingContext("oRoutineTasksViewModel").sPath;
				if (sSelectedKey === "NA") {
					oViewModel.setProperty(sPath + "/NA", null);
					oViewModel.setProperty(sPath + "/DONE", "X");
				} else if (sSelectedKey === "Done") {
					oViewModel.setProperty(sPath + "/NA", null);
					oViewModel.setProperty(sPath + "/DONE", "Y");
				}
				this._EnableSignOffButton();
			} catch (e) {
				Log.error("Exception in onRTStatusChange function");
				this.handleException(e);
			}
		},
		onUndoPress: function(oEvent) {
			try {
				var oButton = oEvent.getSource();
				this.sPath = oEvent.getSource().getParent().getBindingContext("oRoutineTasksViewModel").sPath;
				if (!this._oUndo) {
					this._oUndo = sap.ui.xmlfragment("avmet.ah.fragments.flc.UndoSingOff", this);
					this.getView().addDependent(this._oUndo);
				}
				this._oUndo.openBy(oButton);
			} catch (e) {
				Log.error("Exception in onUndoPress function");
				this.handleException(e);
			}
		},
		onUnSingOff: function(oEvent) {
			try {
				var oViewModel = this.getView().getModel("oRoutineTasksViewModel"),
					Tradesman = oViewModel.getProperty("/Tradesman"),
					bValidation = false;
				this._oUndo.close();
				oViewModel.setProperty(this.sPath + "/DONE", null);
				oViewModel.setProperty(this.sPath + "/NA", null);
				for (var i in Tradesman) {
					if (Tradesman[i].DONE === null && Tradesman[i].NA === null) {
						bValidation = true;
					}
				}
				if (bValidation) {
					oViewModel.setProperty("/bTMSignOffEnable", false);
				} else {
					oViewModel.setProperty("/bTMSignOffEnable", true);
				}
			} catch (e) {
				Log.error("Exception in onUnSingOff function");
				this.handleException(e);
			}
		},

		onDpToolCheck: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sVal = oSrc.getDateValue().getTime(),
					sDate = "";
				if (oEvent.getParameter("valid")) {
					var tDate = new Date();
					var dd = tDate.getDate();
					var mm = tDate.getMonth();
					var yyyy = tDate.getFullYear();

					sDate =
						tDate = new Date(yyyy, mm, dd);
					if (sVal > tDate.getTime()) {
						oSrc.setValueState("Error");
						oSrc.setValueStateText("Selected date cannot be greater than current date");
					} else {
						oSrc.setValueState("None");
						oSrc.setValueStateText("");
					}
				} else {
					oSrc.setValueState("Error");
					oSrc.setValueStateText("Please Enter valid date");
				}
			} catch (e) {
				Log.error("Exception in onDpToolCheck function");
				this.handleException(e);
			}
		},

		onTpToolCheck: function(oEvent) {
			var oSrc = oEvent.getSource(),
				sTime = oSrc.getValue();
			if (sTime) {
				sTime = sTime.concat(":00");
				var tDate = new Date();
				var sCurrTime = tDate.getHours() + ":" + tDate.getMinutes() + ":00";
				if (Date.parse("01/01/2020 " + sTime) > Date.parse("01/01/2020 " + sCurrTime)) {
					oSrc.setValueState("Error");
					oSrc.setValueStateText("Selected time cannot be greater than current time");
				} else {
					oSrc.setValueState("None");
					oSrc.setValueStateText("");
				}
			}
		},

		onSignOffClick: function() {
			try {
				//this.onSignOffClk("Routine_Tasks");
				this.onSignOff();
			} catch (e) {
				Log.error("Exception in onSignOffClick function");
				this.handleException(e);
			}
		},
		onSignOff: function() {
			try {
				var that = this,
					oRoutineTaskModel = this.getView().getModel("oRoutineTasksViewModel"),
					aTradesmanSignItems = oRoutineTaskModel.getProperty("/Tradesman"),
					SignOffStep = oRoutineTaskModel.getProperty("/SignOffStep"),
					aPostPayload = oRoutineTaskModel.getProperty("/aPostPayload"),
					sStep = oRoutineTaskModel.getProperty("/sStep"),
					oParameter = {};
				if (aPostPayload !== undefined) {
					aPostPayload[0].stepid = oRoutineTaskModel.getProperty("/stepid");
					aPostPayload[0].SRVTID = oRoutineTaskModel.getProperty("/srvtid");
				}
				oRoutineTaskModel.setProperty("/bNavBack", false);
				if (sStep === "0") {
					var aPostPayload = [];
					for (var i in aTradesmanSignItems) {
						var oObj = {
							"APR_NO": "1",
							"DDDESC": aTradesmanSignItems[i].DDDESC,
							"DONE": aTradesmanSignItems[i].DONE,
							"LEADFLAG": "X",
							"LOGIN_USER": aTradesmanSignItems[i].LOGIN_USER,
							"NA": aTradesmanSignItems[i].NA,
							"PUBQTY": aTradesmanSignItems[i].PUBQTY,
							"REFID": aTradesmanSignItems[i].REFID,
							"RTASKID": aTradesmanSignItems[i].RTASKID,
							"SRVID": "",
							"SRVTID": oRoutineTaskModel.getProperty("/srvtid"),
							"TAIL_ID": this.getTailId(),
							"TASKID": aTradesmanSignItems[i].TASKID,
							"TIME_S": aTradesmanSignItems[i].TIME_S,
							"TLCDT": aTradesmanSignItems[i].TLCDT,
							"TLCTM": aTradesmanSignItems[i].TLCTM,
							"TLQTY": aTradesmanSignItems[i].TLQTY,
							"TMPID": aTradesmanSignItems[i].TMPID,
							"TRADE_USER": aTradesmanSignItems[i].TRADE_USER,
							"stepid": oRoutineTaskModel.getProperty("/stepid")
						};
						aPostPayload.push(oObj);
					}

					// for (var i in aTradesmanSignItems) {
					// 	aTradesmanSignItems[i].TRADE_USER = "User 1";
					// 	aTradesmanSignItems[i].LOGIN_USER = "User 1";
					// 	aTradesmanSignItems[i].APR_NO = "1";
					// 	aTradesmanSignItems[i].LEADFLAG = "X";
					// 	aTradesmanSignItems[i].TASKID = ""; //Hardcoded to run 'POST' service, as we are getting null in get Service
					// 	aTradesmanSignItems[i].TAIL_ID = this.getTailId();
					// 	aTradesmanSignItems[i].SRVID = "";
					// 	aTradesmanSignItems[i].SRVTID = oRoutineTaskModel.getProperty("/srvtid");
					// 	aTradesmanSignItems[i].stepid = oRoutineTaskModel.getProperty("/stepid");
					// 	//delete aTradesmanSignItems[i].bSave;
					// 	//delete aTradesmanSignItems[i].bEdit;
					// 	//delete aTradesmanSignItems[i].bDelete;
					// }
					oParameter = {};
					oParameter.error = function() {};
					oParameter.success = function(oData) {
						sap.m.MessageToast.show("Signoff Successfull.");
						oRoutineTaskModel.setProperty("/bPageRefresh", false);
						that._getRTLeadTasks();
					}.bind(this);
					oParameter.activity = 4;
					ajaxutil.fnCreate("/RT2Svc", oParameter, aPostPayload, "ZRM_FS_RTT", this);
				} else if (sStep === "1") {
					aPostPayload[0].APR_NO = "2";
					this._SignOffPost(aPostPayload);
				} else if (sStep === "2") {
					aPostPayload[0].APR_NO = "3";
					this._SignOffPost(aPostPayload);
				} else if (sStep === "3") {
					var dDate = this.getView().byId("date").getValue(),
						dTime = this.getView().byId("time").getValue();
					aPostPayload[0].APR_NO = "4";
					aPostPayload[0].TLCDT = dDate ? dDate : null;
					aPostPayload[0].TLCTM = dTime ? dTime : null;
					aPostPayload[0].TLQTY = oRoutineTaskModel.getProperty("/ToolQty") === undefined ? 1 : oRoutineTaskModel.getProperty("/ToolQty");
					aPostPayload[0].PUBQTY = oRoutineTaskModel.getProperty("/PubQty") === undefined ? 1 : oRoutineTaskModel.getProperty("/PubQty");
					var bValidation = true;
					oRoutineTaskModel.setProperty("/bNavBack", true);
					if (bValidation) {
						this._SignOffPost(aPostPayload);
					} else {
						sap.m.MessageToast.show("Please fill all mandatory fields");
					}
				}
			} catch (e) {
				Log.error("Exception in onSignOff function");
				this.handleException(e);
			}
		},

		_nextStep: function() {
			try {
				this.getView().byId("wizard").nextStep();
				var itemName = this.getView().byId("wizard").getCurrentStep(),
					name = itemName.split("--")[2];
				for (var i in this.getView().byId("wizard").getSteps()) {
					if (this.getView().byId("wizard").getSteps()[i].getId().split("--")[2] !== name) {
						this.getView().byId("wizard").getSteps()[i]._deactivate();
					}
				}
			} catch (e) {
				Log.error("Exception in _nextStep function");
				this.handleException(e);
			}
		},

		_SignOffPost: function(aPostPayload) {
			try {
				var that = this,
					oRoutineTaskModel = this.getView().getModel("oRoutineTasksViewModel"),
					oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oRoutineTaskModel.setProperty("/bPageRefresh", false);
					that._getRTLeadTasks();

				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/RT3Svc", oParameter, aPostPayload, "ZRM_FS_RTT", this);
			} catch (e) {
				Log.error("Exception in _SignOffPost function");
				this.handleException(e);
			}
		},

		onRTBack: function() {
			try {
				this.onNavBack();
			} catch (e) {
				Log.error("Exception in onRTBack function");
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
				this.getModel("oRoutineTasksViewModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("oRoutineTasksViewModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				var oRoutineTasksViewModel = this.getView().getModel("oRoutineTasksViewModel"),
					srvtid = oRoutineTasksViewModel.getProperty("/srvtid"),
					stepid = oRoutineTasksViewModel.getProperty("/stepid");
				oRoutineTasksViewModel.setProperty("/bNavBack", false);
				//this.setBasicDetails(oEvent);
				oRoutineTasksViewModel.setProperty("/sPageTitle", oEvent.getParameter("arguments").srvtid.split("_")[1]);
				this._getRTTasks("refid eq '" + this.getAircraftId() + "'" + " and srvtid eq '" + srvtid + "'" + " and TAIL_ID eq " + this.getTailId() +
					" and stepid eq '" + stepid + "'",
					"Tradesman");
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},
		_fnRefreshModel: function() {
			try {
				var oModel = new JSONModel({
					"bTMSignOffEnable": false,
					"SignOffStep": "Tradesman Sign Off",
					"Date": new Date(),
					"Time": new Date().getHours() + ":" + new Date().getMinutes(),
					"Tradesman": [],
					"Teamlead": [],
					"bNavBack": false,
					"bPageRefresh": true
				});
				this.getView().setModel(oModel, "oRoutineTasksViewModel");
			} catch (e) {
				Log.error("Exception in _fnRefreshModel function");
				this.handleException(e);
			}
		},

		_getRTTasks: function(sFilter, sTab) {
			try {
				var oRoutineTasksViewModel = this.getView().getModel("oRoutineTasksViewModel"),
					srvtid = oRoutineTasksViewModel.getProperty("/srvtid"),
					stepid = oRoutineTasksViewModel.getProperty("/stepid"),
					Tradesman = [],
					Teamlead = [],
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = sFilter; //"refid eq 'AIR_10'";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (sTab === "Tradesman") {
								oData.results[i].bEdit = false;
								oData.results[i].bSave = true;
								oData.results[i].bDelete = false;
								Tradesman.push(oData.results[i]);
							}
						}
					}
					oRoutineTasksViewModel.setProperty("/Tradesman", Tradesman);
					this._getRTLeadTasks();
					//oRoutineTasksViewModel.setProperty("/Teamlead", Teamlead);
				}.bind(this);
				ajaxutil.fnRead("/RT2Svc", oParameter);
			} catch (e) {
				Log.error("Exception in _getRTTasks function");
				this.handleException(e);
			}
		},

		_getRTLeadTasks: function() {
			try {
				var oRoutineTasksViewModel = this.getView().getModel("oRoutineTasksViewModel"),
					srvtid = oRoutineTasksViewModel.getProperty("/srvtid"),
					stepid = oRoutineTasksViewModel.getProperty("/stepid"),
					Tradesman = [],
					Teamlead = [],
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "TAIL_ID eq " + this.getTailId() + " and leadflag eq X";
				oParameter.success = function(oData) {
					if (oData.results.length) {
						if (oRoutineTasksViewModel.getProperty("/bNavBack")) {
							this.getRouter().navTo("UpdateFlightServicing", {
								srvid: srvtid
							});
						} else {
							oRoutineTasksViewModel.setProperty("/Teamlead", oData.results);
							oRoutineTasksViewModel.setProperty("/ToolQty", oData.results[0].TLQTY);
							oRoutineTasksViewModel.setProperty("/Date", oData.results[0].TLCDT);
							oRoutineTasksViewModel.setProperty("/Time", oData.results[0].TLCTM);
							oRoutineTasksViewModel.setProperty("/PubQty", oData.results[0].PUBQTY);
							oRoutineTasksViewModel.setProperty("/aPostPayload", [oData.results[0]]);
							oRoutineTasksViewModel.setProperty("/bTMSignOffEnable", true);
							this._fnActivate(oData.results[0].APR_NO);
						}

					} else {
						oRoutineTasksViewModel.setProperty("/sStep", "0");
						oRoutineTasksViewModel.setProperty("/bTMSignOffEnable", false);
					}
				}.bind(this);
				ajaxutil.fnRead("/RT3Svc", oParameter);
			} catch (e) {
				Log.error("Exception in _getRTLeadTasks function");
				this.handleException(e);
			}
		},

		_fnActivate: function(sStep) {
			try {
				var oRoutineTasksViewModel = this.getView().getModel("oRoutineTasksViewModel"),
					oWizard = this.getView().byId("wizard"),
					bPageRefresh = oRoutineTasksViewModel.getProperty("/bPageRefresh");
				oRoutineTasksViewModel.setProperty("/sStep", sStep);

				if (bPageRefresh) {
					if (sStep === "1") {
						oWizard.getSteps()[0]._deactivate();
						oWizard.setCurrentStep(oWizard.getSteps()[1]);
						oWizard.goToStep(oWizard.getSteps()[1], true);

					} else if (sStep === "2") {
						oWizard.getSteps()[0]._deactivate();
						oWizard.getSteps()[1]._deactivate();
						oWizard.setCurrentStep(oWizard.getSteps()[2]);
						oWizard.goToStep(oWizard.getSteps()[2], true);
					} else if (sStep === "3") {
						oWizard.getSteps()[0]._deactivate();
						oWizard.getSteps()[1]._deactivate();
						oWizard.getSteps()[2]._deactivate();
						oWizard.setCurrentStep(oWizard.getSteps()[3]);
						oWizard.goToStep(oWizard.getSteps()[3], true);
					} else if (sStep === "4") {
						oWizard.getSteps()[0]._activate();
						oWizard.getSteps()[1]._activate();
						oWizard.getSteps()[2]._activate();
						oWizard.getSteps()[3]._activate();
						oWizard.goToStep(oWizard.getSteps()[0], true);
						oRoutineTasksViewModel.setProperty("/bTMSignOffEnable", false);
					}
				} else {
					this._nextStep();
					if (sStep === "4") {
						oWizard.nextStep();
						oWizard.nextStep();
						oRoutineTasksViewModel.setProperty("/bTMSignOffEnable", false);
					}
				}

				//oWizard.nextStep();
				// this.getView().byId("wizard").nextStep();
				// var itemName = this.getView().byId("wizard").getCurrentStep(),
				// 	name = itemName.split("--")[2];
				// for (var i in this.getView().byId("wizard").getSteps()) {
				// 	if (this.getView().byId("wizard").getSteps()[i].getId().split("--")[2] !== name) {
				// 		this.getView().byId("wizard").getSteps()[i]._deactivate();
				// 	}
				// }
			} catch (e) {
				Log.error("Exception in _fnActivate function");
				this.handleException(e);
			}
		},

		_EnableSignOffButton: function() {
			try {
				var oViewModel = this.getView().getModel("oRoutineTasksViewModel"),
					Tradesman = oViewModel.getProperty("/Tradesman"),
					bValidation = true;
				for (var i in Tradesman) {
					if (Tradesman[i].DONE === null && Tradesman[i].NA === null) {
						bValidation = false;
					}
				}
				if (bValidation) {
					oViewModel.setProperty("/bTMSignOffEnable", true);
				} else {
					oViewModel.setProperty("/bTMSignOffEnable", false);
				}
			} catch (e) {
				Log.error("Exception in _EnableSignOffButton function");
				this.handleException(e);
			}
		}
	});
});