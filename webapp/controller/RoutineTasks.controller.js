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
				this.getRouter().getRoute("RoutineTasks").attachPatternMatched(this._onObjectMatched, this);
				var sCurrentDateTime = new Date();
				var oModel = new JSONModel({
					"srvtid": "",
					"stepid": "",
					"selTab": "",
					"sgEnable": false,
					"isChange": false,
					"currentDate": sCurrentDateTime,
					"currentTime": sCurrentDateTime.getHours() + ":" + sCurrentDateTime.getMinutes(),
					"tasks": [],
					"rtasks": [],
					"toolcheck": {}
				});
				this.setModel(oModel, "rtModel");
				this.setModel(new JSONModel({
					busy: true,
					delay: 0
				}), "viewModel");
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		onAddRoutineTask: function() {
			try {
				var oObj = {
					"DDDESC": "",
					"REFID": "AIR_10",
					"RTASKID": "",
					"DONE": "",
					"NA": null,
					"TAIL_ID": this.getTailId(),
					"SRVID": "",
					"SRVTID": this.getModel("rtModel").getProperty("/srvtid"),
					"TASKID": "",
					"APR_NO": this.getModel("rtModel").getProperty("/tasks/0/APR_NO"),
					"LOGIN_USER": "",
					"TRADE_USER": "",
					"TIME_S": null,
					"LEADFLAG": "",
					"TLCDT": null,
					"TLCTM": null,
					"TLQTY": null,
					"PUBQTY": null,
					"TMPID": "",
					"stepid": this.getModel("rtModel").getProperty("/stepid")
				};
				this.getModel("rtModel").getProperty("/tasks").push(oObj);
				this.getModel("rtModel").refresh();
			} catch (e) {
				Log.error("Exception in onAddRoutineTask function");
				this.handleException(e);
			}
		},

		onDeleteTaskPress: function(oEvent) {
			try {
				var sTasks = this.getModel("rtModel").getProperty("/tasks");
				var sIndex = sTasks.indexOf(oEvent.getSource().getBindingContext("rtModel").getObject());
				sTasks.splice(sIndex, 1);
				this.getModel("rtModel").refresh();
			} catch (e) {
				Log.error("Exception in onDeleteTaskPress function");
				this.handleException(e);
			}
		},

		onCompleteTaskPress: function(oEvent) {
			this.openDialog("CompletedTasks", ".fragments.flc.");
		},
		onCompletedTaskClose: function(oEvent) {
			this.closeDialog("CompletedTasks");
		},

		onRTStatusChange: function(oEvent) {
			try {
				var sPath = oEvent.getSource().getBindingContext("rtModel").getPath();
				this.getModel("rtModel").setProperty(sPath + "/DONE", oEvent.getSource().getSelectedKey());
				this.getModel("rtModel").setProperty("/isChange", true);
				this.getModel("rtModel").refresh();
			} catch (e) {
				Log.error("Exception in onRTStatusChange function");
				this.handleException(e);
			}
		},

		onTimeChange: function(oEvent) {
			var currentDate = new Date();
			var selDate = this.getView().byId("dpToolChkId").getDateValue();
			var sValue = oEvent.getSource().getDateValue();
			sValue.setSeconds(selDate.getSeconds());
			sValue.setDate(selDate.getDate());
			sValue.setMonth(selDate.getMonth());
			sValue.setFullYear(selDate.getFullYear());
			if (sValue > currentDate) {
				var oData = {
					messages: ["You can not select future time."]
				};
				oEvent.getSource().setValue(this.getModel("rtModel").getProperty("/currentTime"));
				this.fnShowMessage("E", oData, null, function(oEvent) {});
			}
		},
		onSignOffClick: function() {
			try {

				if (this.formatter.integerUnit(this.getModel("rtModel").getProperty("/tasks/0/APR_NO")) === 0) {
					var isNotVaild = true;
					this.getModel("rtModel").getProperty("/tasks").forEach(function(oItem) {
						if (oItem.DONE === "" || oItem.DONE === null) {
							isNotVaild = false;
						}
					});
					if (!isNotVaild) {
						var oData = {
							messages: ["Please review every record."]
						};
						this.fnShowMessage("E", oData, null, function(oEvent) {});
						return;
					}
					this.onSignOff();
				} else {
					this._SignOffR3();
				}

			} catch (e) {
				Log.error("Exception in onSignOffClick function");
				this.handleException(e);
			}
		},
		onSignOff: function() {
			try {
				var oPayloads = this.getModel("rtModel").getProperty("/tasks");
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this._getRTTasks();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/RT2Svc", oParameter, oPayloads, "ZRM_FS_RTT", this);
			} catch (e) {
				Log.error("Exception in onSignOff function");
				this.handleException(e);
			}
		},

		_SignOffR3: function() {
			try {
				var sPayload = this.getModel("rtModel").getProperty("/rtasks");
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData.results.length > 0 && this.formatter.integerUnit(oData.results[0].APR_NO) >= 3) {
						this.onNavBack();
					}
					this._getRTTasks();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/RT3Svc", oParameter, [sPayload], "ZRM_FS_RTT", this);
			} catch (e) {
				Log.error("Exception in _SignOffPost function");
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
				this.getModel("rtModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("rtModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this.getModel("rtModel").setProperty("/SRVID", oEvent.getParameter("arguments").srvid);
				this.getModel("rtModel").setProperty("/isChange", false);
				this.getModel("rtModel").setProperty("/sgEnable", false);
				this.getModel("rtModel").setProperty("/tasks", []);
				this._getRTTasks();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},

		_getRTTasks: function() {
			try {
				var sSrvIdFilter = this.getModel("rtModel").getProperty("/SRVID") ? 
				 (" and SRVID eq " + this.getModel("rtModel").getProperty("/SRVID") )
				 : "";
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and srvtid eq " + this.getModel("rtModel").getProperty("/srvtid") +
					" and TAIL_ID eq " + this.getTailId() + " and stepid eq " + this.getModel("rtModel").getProperty("/stepid") + sSrvIdFilter;
					// + " and srvid eq " + this.getModel("rtModel").getProperty("/SRVID");
				oParameter.error = function(hrex) {
					this.updateModel({
						busy: false
					}, "viewModel");
					this.fnShowMessage("E", {}, hrex, function(oEvent) {});
				}.bind(this);
				oParameter.success = function(oData) {
					// oData.results[0].APR_NO = 0;
					var sCount = this.formatter.integerUnit((oData.results.length > 0 ? oData.results[0].APR_NO : 0));
					this.getModel("rtModel").setProperty("/tasks", oData.results);
					var sSRVID = this.getModel("rtModel").getProperty("/SRVID");
					this.getModel("rtModel").setProperty("/sgEnable", (sCount < 4) && !sSRVID ? true : false);
					// this.getModel("rtModel").setProperty("/tasks/0/APR_NO", sCount > 3 ? 3 : sCount);
					this.getModel("rtModel").refresh();

					this.updateModel({
						busy: false
					}, "viewModel");
					// this._getRTLeadTasks();
				}.bind(this);
				ajaxutil.fnRead("/RT2Svc", oParameter);
			} catch (e) {
				Log.error("Exception in _getRTTasks function");
				this.handleException(e);
			}
		},

		_getRTLeadTasks: function() {
			try {
				var sSrvIdFilter = this.getModel("rtModel").getProperty("/SRVID") ? 
				 (" and SRVID eq " + this.getModel("rtModel").getProperty("/SRVID") )
				 : "";
				var oParameter = {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and srvtid eq " + this.getModel("rtModel").getProperty("/srvtid") +
					" and TAIL_ID eq " + this.getTailId() + " and stepid eq " + this.getModel("rtModel").getProperty("/stepid") +
					" and leadflag eq X" + sSrvIdFilter;
				oParameter.error = function(hrex) {
					this.updateModel({
						busy: false
					}, "viewModel");
					this.fnShowMessage("E", {}, hrex, function(oEvent) {});
				}.bind(this);
				oParameter.success = function(oData) {

					this.getModel("rtModel").setProperty("/rtasks", oData.results.length > 0 ? oData.results[0] : {});
					this.getModel("rtModel").setProperty("/rtasks/TLCDT", this.getModel("rtModel").getProperty("/currentDate"));
					this.getModel("rtModel").setProperty("/rtasks/TLCTM", this.getModel("rtModel").getProperty("/currentTime"));
					this.getModel("rtModel").setProperty("/rtasks/TLQTY", 1);
					this.getModel("rtModel").setProperty("/rtasks/PUBQTY", 1);
					this.getModel("rtModel").refresh();
					this.updateModel({
						busy: false
					}, "viewModel");
					this._fnActivate();
				}.bind(this);
				ajaxutil.fnRead("/RT2Svc", oParameter);
			} catch (e) {
				Log.error("Exception in _getRTLeadTasks function");
				this.handleException(e);
			}
		},

		_fnActivate: function() {
			try {
				var sStep = this.getModel("rtModel").getProperty("/tasks/0/APR_NO");
				var sKey = "rt1";
				switch(sStep){
					case 1:
						sKey = "rt2";
						break;
					case 2:
						sKey = "rt3";
						break;
					case 3:
						sKey = "rt4";
						break;
				}
				this.getModel("rtModel").setProperty("/selTab", sKey);
				this.getView().byId("idIconTabBar").setSelectedKey(sKey);
			} catch (e) {
				Log.error("Exception in _fnActivate function");
				this.handleException(e);
			}
		}
	});
});

// 	oWizard.getSteps()[0]._activate();
// 	oWizard.getSteps()[1]._activate();
// 	oWizard.getSteps()[2]._activate();
// 	oWizard.getSteps()[3]._activate();
// 	oWizard.goToStep(oWizard.getSteps()[0], true);