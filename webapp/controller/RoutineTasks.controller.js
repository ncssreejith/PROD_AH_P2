sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, JSONModel, ajaxutil, formatter, Log, FilterOpEnum) {
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
					"selTab": "rt1",
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
				// var oObj = {
				// 	"DDDESC": "",
				// 	"REFID": "AIR_10",
				// 	"RTASKID": "",
				// 	"DONE": "",
				// 	"NA": "",
				// 	"Tailid": this.getTailId(),
				// 	"SRVID": "",
				// 	"SRVTID": this.getModel("rtModel").getProperty("/srvtid"),
				// 	"TASKID": "",
				// 	"APR_NO": this.getModel("rtModel").getProperty("/tasks/0/APR_NO"),
				// 	"LOGIN_USER": "",
				// 	"TRADE_USER": "",
				// 	"TIME_S": "",
				// 	"LEADFLAG": "",
				// 	"TLCDT": "",
				// 	"TLCTM": "",
				// 	"TLQTY": "",
				// 	"PUBQTY": "",
				// 	"TMPID": "",
				// 	"stepid": this.getModel("rtModel").getProperty("/stepid")
				// };
				var oObj = JSON.parse(JSON.stringify(this.getModel("rtModel").getProperty("/tasks")[0]));
				oObj.stepid = this.getModel("rtModel").getProperty("/stepid");
				oObj.engid =  "";
				oObj.DDDESC = "";
				oObj.REFID = "AIR_11";
				oObj.RTASKID = "";
				oObj.DONE = "";
				oObj.NA =  "";
				oObj.SRVID = "";
				oObj.SRVTID = this.getModel("rtModel").getProperty("/srvtid");
				oObj.TASKID = "";
				oObj.APR_NO = this.getModel("rtModel").getProperty("/tasks/0/APR_NO");
				oObj.LOGIN_USER = "";
				oObj.TRADE_USER = "";
				oObj.TIME_S =  "";
				oObj.LEADFLAG = "";
				oObj.TLCDT =  "";
				oObj.TLCTM =  "";
				oObj.TLQTY =  "";
				oObj.TRADE_USER =  "";
				oObj.PUBQTY =  "";
				oObj.TMPID = "";
				oObj.SOAPID =  "";
				oObj.SOAPFLAG =  "";
				oObj.tstat = 1; // by default item need to sign off
				oObj.tsign = "";
				oObj.stepid = this.getModel("rtModel").getProperty("/stepid");
				oObj.SERNR =  "";
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
				this.getModel("rtModel").setProperty(sPath + "/tstat", 1);
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
		onSelItem: function(oEvent) {
			var sSel = oEvent.getSource().getSelected();
			var sPath = oEvent.getSource().getBindingContext("rtModel").getPath();
			this.getModel("rtModel").setProperty(sPath + "/tstat", sSel ? 1 : 0);
			this.getModel("rtModel").refresh();
		},
		/** 
		 * On undo sign off
		 * @param oEvent
		 */
		onUndoSignoff: function(oEvent) {
			try {
				var oObject = oEvent.getSource().getBindingContext("rtModel").getObject();
				this.fnUndoSignOff(oObject);
			} catch (e) {
				Log.error("Exception in onUndoSignoff function");
				this.handleException(e);
			}
		},
		onSignOffClick: function() {
			try {

				// if (this.formatter.integerUnit(this.getModel("rtModel").getProperty("/tasks/0/APR_NO")) === 0) {
				// 	var isNotVaild = true;
				// 	this.getModel("rtModel").getProperty("/tasks").forEach(function(oItem) {
				// 		if (oItem.DONE === "" || oItem.DONE === null) {
				// 			isNotVaild = false;
				// 		}
				// 	});
				// 	if (!isNotVaild) {
				// 		var oData = {
				// 			messages: ["Please review every record."]
				// 		};
				// 		this.fnShowMessage("E", oData, null, function(oEvent) {});
				// 		return;
				// 	}
				// 	this.onSignOff();
				// } else {
				// 	this._SignOffR3();
				// }

				var sMsg = "";
				var oTaskData = this.getModel("rtModel").getProperty("/tasks");
				for (var i = 0; i < oTaskData.length; i++) {
					//Rahul Code changes 30/10/2020: to check table selection logic
					if ((oTaskData[i].tsign === "" && oTaskData[i].tstat === 0) && (oTaskData[i].DONE === "" || oTaskData[i].DONE === null)) {
						sMsg = "";
					} else {
						if ((oTaskData[i].tsign === "" && oTaskData[i].tstat !== 1)) {
							sMsg = "Please select at least one record";
							this._fnErrorMessage(sMsg);
							return;
						}
						if (oTaskData[i].DONE === "" || oTaskData[i].DONE ===  null) {
							sMsg = "Please review the record";
							this._fnErrorMessage(sMsg);
							return;
						}
						if (oTaskData[i].DDDESC === "" || oTaskData[i].DDDESC === null) {
							sMsg = "Please enter task details.";
							this._fnErrorMessage(sMsg);
							return;
						}
					}

				}
				this.onSignOff();
			} catch (e) {
				Log.error("Exception in onSignOffClick function");
				this.handleException(e);
			}
		},
		onTeamLeadUndoSignOffClick: function() {
			try {
				var aFinalPayload = [];
				var aPayloads = this.getModel("rtModel").getProperty("/tasks");

				aPayloads.forEach(function(oPayload) {
					var oCopy = JSON.parse(JSON.stringify(oPayload));
					aFinalPayload.push(oCopy);
				});

				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {
					this._getRTTasks();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnUpdate(this.getResourceBundle().getText("RoutineTask"), oParameter, aFinalPayload, "ZRM_FS_RTT", this);
			} catch (e) {
				Log.error("Exception in onTeamLeadUndoSignOffClick function");
				this.handleException(e);
			}
		},
		/** 
		 * Undo signoff
		 * @param oObject
		 * @returns
		 */
		fnUndoSignOff: function(oObject) {
			try {
				var aFinalPayload = [];
				var oCopy = JSON.parse(JSON.stringify(oObject));
				oCopy.tstat = 0;
				delete oCopy.selected;
				aFinalPayload.push(oCopy);

				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this._getRTTasks();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnUpdate(this.getResourceBundle().getText("RoutineTask"), oParameter, aFinalPayload, "ZRM_FS_RTT", this);

			} catch (e) {
				Log.error("Exception in fnUndoSignOff function");
				this.handleException(e);
			}
		},
		onSignOff: function() {
			try {
				var aFinalPayload = [];
				var bSelected = false;
				var aPayloads = this.getModel("rtModel").getProperty("/tasks");
				var objectId;  // changes added for tfoa check authorisation by lakshmi on 29012021 at 1017am
				aPayloads.forEach(function(oPayload) {
					// this.fnInsertValues(oPayload);
					var oCopy = JSON.parse(JSON.stringify(oPayload));
					if (oCopy.tstat === 1) {
						bSelected = true;
						oCopy.tstat = 1;
					}
					delete oCopy.selected;
					aFinalPayload.push(oCopy);
					if (this.formatter.srvTOFACheck(this.getModel("rtModel").getProperty("/srvtid"))) {
						objectId="ZRM_FS_TFOA";
					}else{
						objectId="ZRM_FS_RTT"; 
					}
				}.bind(this));
				if (!bSelected) {
					sap.m.MessageToast.show("Select at least one for sign off first");
					return;
				}

				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this._getRTTasks();
				}.bind(this);
				oParameter.activity = 4;
			//	ajaxutil.fnCreate(this.getResourceBundle().getText("RoutineTask"), oParameter, aFinalPayload, "ZRM_FS_RTT", this);// COMMENTED for tfoa check authorisation by lakshmi on 29012021 at 1017am
			   ajaxutil.fnCreate(this.getResourceBundle().getText("RoutineTask"), oParameter, aFinalPayload, objectId, this);// changes added for tfoa check authorisation by lakshmi on 29012021 at 1017am
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
				ajaxutil.fnCreate(this.getResourceBundle().getText("RoutineTask"), oParameter, [sPayload], "ZRM_FS_RTT", this);
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
		//Rahul Code changes 30/10/2020: show error message
		_fnErrorMessage: function(sMsg) {
			var oData = {
				messages: [sMsg]
			};
			this.fnShowMessage("E", oData, null, function(oEvent) {});

		},
		_getRTTasks: function() {
			try {
				// var sSrvIdFilter = this.getModel("rtModel").getProperty("/SRVID") ?
				// 	(" and SRVID eq " + this.getModel("rtModel").getProperty("/SRVID")) : "";
				var sSrvIdFilter = this.getModel("rtModel").getProperty("/srvid") ?
					("&SRVID=" + this.getModel("rtModel").getProperty("/srvid")) : "";
				var oParameter = {};
				// oParameter.filter = "refid eq " + this.getAircraftId() + " and srvtid eq " + this.getModel("rtModel").getProperty("/srvtid") +
				// 	" and Tailid eq " + this.getTailId() + " and stepid eq " + this.getModel("rtModel").getProperty("/stepid") + sSrvIdFilter;
				oParameter.filter = "refid=" + this.getAircraftId() + "&srvtid=" + this.getModel("rtModel").getProperty("/srvtid") +
					"&TAILID=" + this.getTailId() + "&stepid=" + this.getModel("rtModel").getProperty("/stepid") + sSrvIdFilter;
				// + " and srvid eq " + this.getModel("rtModel").getProperty("/SRVID");
				oParameter.error = function(hrex) {
					this.updateModel({
						busy: false
					}, "viewModel");
					this.fnShowMessage("E", {}, hrex, function(oEvent) {});
				}.bind(this);
				oParameter.success = function(oData) {
					var sTab = "rt1";
					var sCount = this.formatter.integerUnit((oData.results.length > 0 ? oData.results[0].APR_NO : 0));
					oData.results[0].TLCDT = new Date(oData.results[0].TLCDT);
					oData.results[0].TLCTM = this.formatter.defaultDateTimeFormat(new Date(oData.results[0].TLCTM),"HH:mm");
					this.getModel("rtModel").setProperty("/tasks", oData.results);
					var sSRVID = this.getModel("rtModel").getProperty("/SRVID");
					this.getModel("rtModel").setProperty("/sgEnable", (sCount < 4) && !sSRVID ? true : false);
					this._fnActivate();
					// sTab = oData.results.length > 0 ? (oData.results[0].APRNO === 1 ? "rt1" : "rt1") : "rt1";
					// this.getModel("rcModel").setProperty("/selTab", sTab);
					this.getModel("rtModel").refresh();

					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("RoutineTask"), oParameter);
			} catch (e) {
				Log.error("Exception in _getRTTasks function");
				this.handleException(e);
			}
		},

	
		_fnActivate: function() {
			try {
				var sStep = this.getModel("rtModel").getProperty("/tasks/0/APR_NO");
				var sKey = "rt1";
				switch (sStep) {
					case 1:
						sKey = "rt2";
						break;
					case 2: //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
						if (!formatter.srvTOFACheck(this.getModel("rtModel").getProperty("/srvtid"))) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
							sKey = "rt4"; //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
						} else { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
							sKey = "rt3"; //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
						} //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
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