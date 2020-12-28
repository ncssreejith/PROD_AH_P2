sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
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
	 *        1.2 onExit
	 *        1.3 onRefresh
	 *     2. Backend Calls
	 *        2.1 onLandingTyreUpdate
	 *        2.2 _fnMultiTradmanCreate
	 *        2.3 _fnUpdateLimitations
	 *        2.4 _fnUpdateLandingTyre
	 *        2.5 _fnADDCountGet
	 *        2.6 getSerialNoPress
	 *        2.7 _fnGetUtilisationDefaultVal
	 *        2.8 _fnReasonforADDGet
	 *        2.9 _fnPerioOfDeferCBGet
	 *        2.10 _fnTasksADDGet
	 *        2.11 _fnTasksGet
	 *        2.12 _fnCheckLandingTyre
	 *        2.13 _fnUtilization2Get
	 *        2.14 _fnUtilizationGet
	 *        2.14 onSignOff
	 *     3. Private calls
	 *        3.1 _onObjectMatched
	 *        3.2 handleChange
	 *        3.3 onSuggestTechOrder
	 *        3.4 onSegmentedButtonSelection
	 *        3.5 onIconSelected
	 *        3.6 onProceed
	 *        3.7 onAddTradesMan
	 *        3.8 _fnCreateMultiTradesmenPayload
	 *        3.9 onDeleteTradesMan
	 *        3.10 onIconTabSelection
	 *        3.11 onBack
	 *        3.12 onPrdOfDefermentChange
	 *        3.13 onReasonForADDChange
	 *        3.14 onReasonTypeChange
	 *        3.15 onUilisationChange
	 *        3.16 onAddLimitaionPress
	 *        3.17 onRemoveLimitaionPress
	 *        3.18 onEnterToTheErrorPress
	 *        3.19 onAddLimitaionDialog
	 *        3.20 onCloseAddLimDialog
	 *        3.21 onAddADDDialog
	 *        3.22 onCloseADDDialog
	 *        3.23 onTimeChange
	 *        3.24 _fnCreateLimitation
	 *        3.25 onCreateLimitationPress
	 *        3.26 onTypeChangeOther
	 *        3.27 onTypeChangeOPS
	 *        3.28 onTypeChange
	 *        3.29 _fnCreateTempTaskModel
	 *        3.30 _fnCheckTaskType
	 *        3.31 _fnGetLandingTyre
	 *        3.32 _fnOpenLandingTyreBox
	 *        3.33 onLandingTyreValChange
	 *        3.34 _fnInitialLoad
	 *        3.35 onChangeData
	 *        3.36 onChangeDataInput
	 *        3.37 onVIResultSelect
	 *        3.38 getVIResultStatus
	 *        3.39 onCloseVIStatus
	 *        3.40 onSaveVIStatus
	 *        3.41 handleLiveChange
	 *        3.42 _InitializeLimDialogModel
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
				this.getRouter().getRoute("CosCloseTask").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onInit function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onExit
		// Parameter: oEvent
		// Description: This will get called, on exit of the view.
		//------------------------------------------------------------------
		onExit: function() {
			try {
				if (dataUtil.getDataSet("TempCloseTaskModel")) {
					dataUtil.setDataSet("TempCloseTaskModel", null);
					dataUtil.setDataSet("TempCloseCAPModel", null);
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onExit function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onRefresh
		// Parameter: oEvent
		// Description: This will get called, to refresh the view.
		//------------------------------------------------------------------
		onRefresh: function() {
			try {
				var oViewModel = this.getView().getModel("ViewModel");
				this._fnTasksGet(oViewModel.getProperty("/TaskId"));
			} catch (e) {
				Log.error("Exception in CosCloseTask:onRefresh function");
				
			}
		},
		/* Function: handleChange
		 * Parameter:
		 * Description: Function to validate date/time
		 */
		handleChange: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sId = oSrc.getId(),
					sPath = oSrc.getBindingContext("TaskModel").getPath();
				var dpId = "";
				var tpId = "";
				if (sId.search("DP1") !== -1) {
					dpId = sId;
					tpId = sId.replace("DP1", "TP1");
				} else {
					tpId = sId;
					dpId = sId.replace("TP1", "DP1");
				}
				/* var prevDt = this.getModel("TaskModel").getProperty(sPath + "/credtm"); */
				var prevDt = formatter.defaultOdataDateFormat(this.getModel("TaskModel").getProperty(sPath + "/ftcredt"));
				var prevTime = this.getModel("TaskModel").getProperty(sPath + "/ftcretm");
				return formatter.validDateTimeChecker(this, dpId, tpId, "errorCloseTaskPast", "errorCloseTaskFuture", prevDt, prevTime);
			} catch (e) {
				Log.error("Exception in handleChange function");
			}
		},
		
		handleChangeEditTask: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sId = oSrc.getId(),
					sPath = oSrc.getBindingContext("TaskModel").getPath();
				var dpId = "";
				var tpId = "";
				if (sId.search("DP1") !== -1) {
					dpId = sId;
					tpId = sId.replace("DP1", "TP1");
				} else {
					tpId = sId;
					dpId = sId.replace("TP1", "DP1");
				}
				this.getModel("TaskModel").setProperty(sPath + "/ftcredt",oEvent.getSource().getDateValue());
				var prevDt = formatter.defaultOdataDateFormat(this.getModel("TaskModel").getProperty(sPath + "/ftcredt"));
				
				var prevTime = this.getModel("TaskModel").getProperty(sPath + "/ftcretm");
				return formatter.validDateTimeChecker(this, dpId, tpId, "errorCloseTaskPast", "errorCloseTaskFuture", prevDt, prevTime);
			} catch (e) {
				Log.error("Exception in handleChange function");
			}
		},
		
		

		//------------------------------------------------------------------
		// Function: handleChange
		// Parameter: oEvent
		// Description: This will get called, to handle change in date on view.
		//------------------------------------------------------------------
		handleChangeUtil: function(fragId) {
			var aData = this.getModel("TaskModel").getObject(this.oObjectPath);
			var sPastText = fragId === "idAddTaskADDDialog" ? "errorADDexpiryDatePast" : "errorLimitExpiryDatePast";
			return formatter.validDateTimeChecker(this, "DP2", "TP2", sPastText, "", aData.credtm, aData.creuzt, false, this.getView()
				.createId(fragId));
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		//------------------------------------------------------------------
		// Function: onSuggestTechOrder
		// Parameter: oEvent
		// Description: This will get called, to handle suggestion on technical order.
		//------------------------------------------------------------------
		onSuggestTechOrder: function(oEvent) {
			var sText = oEvent.getSource().getValue();
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "TAILID eq " + that.getTailId() + " and TOREF eq " + sText;
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TechRefSugg");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETTASKREFSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCreateTask:onSuggestTechOrder function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnMultiTradmanCreate
		// Parameter: oPayLoad
		// Description: This will get called, to create multi trademan record creation.
		//------------------------------------------------------------------
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
						}, true);
					} else {
						that.getRouter().navTo("CosDefectsSummary", {
							"JobId": oViewModel.getProperty("/JobId"),
							"Flag": "Y",
							"WcKey": oViewModel.getProperty("/WorkKey"),
							"goTo": "SP"
						}, true);
					}
				}.bind(this);
				ajaxutil.fnCreate(this.getResourceBundle().getText("CRETUSERSVC"), oPrmTD, oPayLoad);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnMultiTradmanCreate function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: onSignOff
		// Parameter: oEvent
		// Description: This will get called, on click of Sign Off button
		//------------------------------------------------------------------

		onSignOff: function(oEvent) {
			try {
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
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
					delete oPayload[i].ValueState;
					delete oPayload[i].ftcredtStateText;
					delete oPayload[i].ftcretmState;
					delete oPayload[i].addLimitAdded;
					delete oPayload[i].LNDPIN;
					delete oPayload[i].TIREID;
					//oPayload[i].sernr = oPayload[i].ftsernr;
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
					this._fnUpdateLimitations();
					this._fnUpdateLandingTyre(oData.results);
					if (dataUtil.getDataSet("TempCloseTaskModel")) {
						dataUtil.setDataSet("TempCloseTaskModel", null);
						dataUtil.setDataSet("TempCloseCAPModel", null);
					}
					if (oData.results[0].multi !== "0") {
						that._fnCreateMultiTradesmenPayload();
					} else {
						if (oViewModel.getProperty("/Flag") === "FS") {
							that.onNavBack();
						} else {
							that.getRouter().navTo("CosDefectsSummary", {
								"JobId": oViewModel.getProperty("/JobId"),
								"Flag": "Y",
								"WcKey": oViewModel.getProperty("/WorkKey"),
								"goTo": "SP"
							}, true);
						}
					}
				}.bind(this);
				if (oViewModel.getProperty("/Flag") === "FS") {
					sObject = "ZRM_FS_CTT";
				} else {
					sObject = "ZRM_COS_TT";
				}
				oPrmTask.activity = 4;
				oPrmTask.title = "Tradesman Sign Off";
				ajaxutil.fnUpdate(this.getResourceBundle().getText("GETSELTASKSVC"), oPrmTask, oPayload, sObject, this);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onSignOff function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: _fnUpdateLimitations
		// Parameter: 
		// Description: This will get called, to create ADD/Limitation record in cap table
		//------------------------------------------------------------------
		_fnUpdateLimitations: function() {
			try {
				var obj = this.getModel("ViewModel").getProperty("/LimitADD");
				if (obj && obj.length > 0) {
					var oParameter = {};
					oParameter.error = function() {};
					oParameter.success = function(oData) {};
					/*	oParameter.activity = 1;
						, "ZRM_ADDL", this*/
					ajaxutil.fnCreate(this.getResourceBundle().getText("ADDSVC"), oParameter, obj);
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnUpdateLimitations function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: _fnUpdateLandingTyre
		// Parameter: oData
		// Description: This will get called, to create leading tyre records.
		//------------------------------------------------------------------
		_fnUpdateLandingTyre: function(oData) {
			var oModel = this.getView().getModel("LandingTyreModel");
			if (!oModel) {
				return;
			}
			var oTyre = oModel.getData();
			if (oTyre && oTyre.length > 0) {
				var oPayload = [];
				var oParameter = {};
				for (var i in oData) {
					for (var j in oTyre) {
						if (oTyre[j].partno === oData[i].partno) {
							var tempObj = JSON.parse(JSON.stringify(oTyre[j]));
							var obj = {};
							obj.TAILID = tempObj.tailid;
							obj.PARTNO = oData[i].partno;
							obj.LNDPIN = tempObj.LNDPIN;
							obj.TASKID = tempObj.taskid;
							obj.TIREID = tempObj.TIREID;
							obj.ITMNO = null;
							obj.LATIS = null;
							obj.LATRE = null;
							obj.SERNR = oData[i].sernrs;
							obj.LTIREID = null;
							obj.TIREDESC = null;
							obj.REFID = null;
							obj.IRFLAG = null;
							obj.INSON = null;
							obj.RMVFR = null;
							obj.TOTLND = null;
							oPayload.push(JSON.parse(JSON.stringify(obj)));
						}
					}

				}

				oParameter.error = function() {};
				oParameter.success = function(oData) {};
				/*	oParameter.activity = 1;
					, "ZRM_ADDL", this*/
				ajaxutil.fnCreate(this.getResourceBundle().getText("LANDINGTYRESVC"), oParameter, oPayload);
			}
		},

		//------------------------------------------------------------------
		// Function: _fnADDCountGet
		// Parameter: oEvent
		// Description: This will get called,to get total add count as of now from DB.
		//------------------------------------------------------------------
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

				ajaxutil.fnRead(this.getResourceBundle().getText("GETADDCOUNTSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnADDCountGet function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: getSerialNoPress
		// Parameter: oEvent
		//Table: ENGINE
		// Description: This will get called, to get Serial number for part number.
		//------------------------------------------------------------------
		getSerialNoPress: function(oEvent) {
			try {
				var oPrmDD = {},
					oModel,
					oModelObj = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent()
					.getBindingContext("TaskModel"),
					that = this,
					oPayload;
				oModelObj.getObject("partno");
				oPrmDD.filter = "PARTNO eq " + oModelObj.getObject("partno") + " and ESTAT eq R and INSON eq " + this.getTailId();
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

				ajaxutil.fnRead(this.getResourceBundle().getText("GETSERNOSVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in CosCloseTask:getSerialNoPress function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnUtilizationGet
		// Parameter: oEvent
		// Description: This will get called,to get utilization dropdown master data.
		//------------------------------------------------------------------
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

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnUtilizationGet function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetUtilisationDefaultVal
		// Parameter: sAir
		// Description: This will get called,to get utilization record default values from DB.
		//------------------------------------------------------------------

		_fnGetUtilisationDefaultVal: function(sAir) {
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

				ajaxutil.fnRead(this.getResourceBundle().getText("UTILISATIONDUESVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnGetUtilisationDefaultVal function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnReasonforADDGet
		// Parameter: sAir
		// Description: This will get called,to get reason for ADD values from DB.
		//------------------------------------------------------------------
		_fnReasonforADDGet: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + oModel.getProperty("/AirId") + " and ddid eq CPR_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "ReasonforADDModel");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnReasonforADDGet function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnUtilization2Get
		// Parameter: sAir
		// Description: This will get called,to get utillization 2 combobox values from DB.
		//------------------------------------------------------------------
		_fnUtilization2Get: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				/*oPrmJobDue.filter = "airid eq " + oModel.getProperty("/AirId") + " and ddid eq UTIL2_";*/
				oPrmJobDue.filter = "ddid eq UTIL2_";
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "Utilization2CBModel");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDVALSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnUtilization2Get function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnPerioOfDeferCBGet
		// Parameter: 
		// Description: This will get called,to get Period of Deferment combobox values from DB.
		//------------------------------------------------------------------
		_fnPerioOfDeferCBGet: function() {
			try {
				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				/*oPrmJobDue.filter = "airid eq " + oModel.getProperty("/AirId") + " and ddid eq 118_";*/
				oPrmJobDue.filter = "ddid eq 118_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "PerioOfDeferCBModel");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDVALSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnPerioOfDeferCBGet function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: _fnTasksADDGet
		// Parameter: oEvent
		// Table: TASK
		// Description:  This will get called, to get data fro selected tasks.
		//------------------------------------------------------------------
		_fnTasksADDGet: function(oTempJB) {
			try {
				var that = this,
					filters = [],
					oModel,
					sFilter, bFlag = true,
					oModelView = this.getView().getModel("TaskModel"),
					oPrmJobDue = {};
				sFilter = "taskid eq " + oTempJB;
				oPrmJobDue.filter = sFilter;
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					oData.results[0].ftsernr = oModelView.getData()[this.oObjectPath.split("/")[1]].ftsernr;
					oData.results[0].ftdesc = oModelView.getData()[this.oObjectPath.split("/")[1]].ftdesc;
					oData.results[0].fttoref = oModelView.getData()[this.oObjectPath.split("/")[1]].fttoref;
					oData.results[0].ValueState = "None";
					oModelView.getData().splice(this.oObjectPath.split("/")[1], 1);
					oData.results[0].ftcredt = new Date();
					oData.results[0].ftcretm = new Date().getHours() + ":" + new Date().getMinutes();
					oModelView.getData().push(oData.results[0]);
					oModelView.updateBindings();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETSELTASKSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnTasksADDGet function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: _fnTasksGet
		// Parameter: oTempJB
		// Description: This will get called, to get selected tasks data from backend.
		//------------------------------------------------------------------

		_fnTasksGet: function(oTempJB) {
			try {
				var that = this,
					filters = [],
					sFilter, bFlag = true,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				this.handleBusyDialogOpen();
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
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setSizeLimit(1000);
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].ftcredt = new Date();
						oData.results[i].ftcretm = new Date().getHours() + ":" + new Date().getMinutes();
						if (oData.results[i].tt1id === 'TT1_12' && oData.results[i].tt2id === '' && oData.results[i].tt3id === '' && oData.results[i].tt4id ===
							'') {
							if (oData.results[i].ftrsltgd === "" || oData.results[i].ftrsltgd === null || oData.results[i].ftrsltgd === 0) {
								oData.results[i].ftrsltgd = 2;
							}
						}
						oData.results[i].ValueState = "None";
						// if (oData.results[i].util1 === "UTIL1_20") {
						// 	oData.results[i].util2 = oData.results[i].utilvl;
						// }
					}
					oModel.setData(oData.results);
					this._fnGetLandingTyre(oData.results);
					that.getView().setModel(oModel, "TaskModel");
					that.getView().byId("vbLimId").invalidate();
					that.getView().byId("vbTaskId").invalidate();
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
					this.byId("pageCloseTaskId").scrollTo(0);
					that.handleBusyDialogClose();
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("GETSELTASKSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnTasksGet function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: _fnCheckLandingTyre
		// Parameter: obj, partNo
		// Description: This will get called, to get data for the landing tyre record with respective TAILID and PARTNO.
		//------------------------------------------------------------------
		_fnCheckLandingTyre: function(obj, partNo) {
			try {
				var oPayload = [],
					oPrmTask = {};
				oPrmTask.filter = "TAILID eq " + obj.tailid + " and PARTNO eq " + partNo;
				oPrmTask.error = function() {};
				oPrmTask.success = function(oData) {
					if (oData && oData.results && oData.results.length > 0) {
						this._fnOpenLandingTyreBox(oData.results);
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("LANDINGTYRESVC"), oPrmTask, oPayload);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnCheckLandingTyre function");
				
			}
		},

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		//------------------------------------------------------------------
		// Function: onSegmentedButtonSelection
		// Parameter: oEvent
		// Description: This will get called, on segmented button selection change.
		//------------------------------------------------------------------
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
				
			}
		},
		//------------------------------------------------------------------
		// Function: onIconSelected
		// Parameter: oEvent
		// Description: This will get called, on icon bar selection change.
		//------------------------------------------------------------------
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
				
			}
		},
		//------------------------------------------------------------------
		// Function: onProceed
		// Parameter: oEvent
		// Description: This will get called, on click of procced button.
		//------------------------------------------------------------------
		onProceed: function(oEvent) {
			try {
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				var oTaskModel = this.getView().getModel("TaskModel"),
					oFlag = true;
				var aFlag = [];
				for (var i in oTaskModel.getData()) {
					var obj = JSON.parse(JSON.stringify(oTaskModel.getData()[i]));
					var bFlag = formatter.validDateTimeCloseTaskChecker(this, obj.ftcredt, obj.ftcretm, "errorCloseTaskPast", "errorCloseTaskFuture",
						obj.credtm,
						obj.creuzt);
					if (bFlag === "L") {
						oTaskModel.setProperty("/" + i + "/ftcretmState", "Error");
						oTaskModel.setProperty("/" + i + "/ftcredtStateText", "Date/Time should be greater than Task creation Date/Time");
					} else if (bFlag === "G") {
						oTaskModel.setProperty("/" + i + "/ftcretmState", "Error");
						oTaskModel.setProperty("/" + i + "/ftcredtStateText", "Date/Time should be less than current Date/Time");
					} else {
						oTaskModel.setProperty("/" + i + "/ftcretmState", "None");
					}
					aFlag.push(bFlag);
				}
				if (aFlag.indexOf("L") !== -1 || aFlag.indexOf("G") !== -1) {
					oTaskModel.updateBindings(true);
					sap.m.MessageBox.error("Please fill correct date and time");
					return;
				}
				for (var i = 0; i < oTaskModel.getData().length; i++) {
					if (oTaskModel.getData()[i].tt1id === 'TT1_12') {
						if (oTaskModel.getData()[i].ftrsltgd === 2) {
							oFlag = false;
							oTaskModel.getData()[i].ValueState = "Error";
							oTaskModel.refresh();
						}
					}
				}

				if (oFlag) {
					var oModel = this.getView().getModel("ViewModel");
					oModel.setProperty("/bTradesMan", true);
					oModel.setProperty("/selectedIcon", "tradesMan");
					oModel.setProperty("/signOffBtn", true);
					oModel.setProperty("/proccedBtn", false);
					oModel.setProperty("/backBtn", true);
					oModel.setProperty("/tradeTable", false);
					oModel.setProperty("/MulitiFlag", "N");
				} else {
					sap.m.MessageToast.show("Please fill all the required fields");
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onProceed function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onAddTradesMan
		// Parameter: oEvent
		// Description: This will get called, to add new tradesman to the list.
		//------------------------------------------------------------------
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
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnCreateMultiTradesmenPayload
		// Parameter: oEvent
		// Description: This will get called, to create payload for multi trademan creation.
		//------------------------------------------------------------------
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
							"JOBID": null,
							"USRID": oTradeMan[j].Name
						});

					}
				}
				that._fnMultiTradmanCreate(oTempPay);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnCreateMultiTradesmenPayload function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: onDeleteTradesMan
		// Parameter: oEvent
		// Description: This will get called, to delete the tradesman item.
		//------------------------------------------------------------------
		onDeleteTradesMan: function(oEvent) {
			try {
				var oModel = this.getView().getModel("ViewModel").getProperty("/tradesManTable"),
					sPath = oEvent.getSource().getBindingContext("ViewModel").getPath().split("/")[2];
				oModel.splice(sPath, 1);
				this.getView().getModel("ViewModel").refresh(true);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onDeleteTradesMan function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onIconTabSelection
		// Parameter: oEvent
		// Description: This will get called, on Icon Tab selection change
		//------------------------------------------------------------------
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
					oModel.setProperty("/MulitiFlag", "N");
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onIconTabSelection function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onBack
		// Parameter: oEvent
		// Description: This will get called, on click of back button
		//------------------------------------------------------------------
		onBack: function(oEvent) {
			try {
				var oModel = this.getView().getModel("ViewModel");
				oModel.setProperty("/selectedIcon", "followUp");
				oModel.setProperty("/signOffBtn", false);
				oModel.setProperty("/proccedBtn", true);
				oModel.setProperty("/backBtn", false);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onBack function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: onPrdOfDefermentChange
		// Parameter: oEvent
		// Description: This will get called, to set called when Period Deferment change.
		//------------------------------------------------------------------

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
				
			}
		},
		//------------------------------------------------------------------
		// Function: onReasonForADDChange
		// Parameter: oEvent
		// Description: This will get called, to set called when Reason for ADD change.
		//------------------------------------------------------------------
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
				
			}
		},
		//------------------------------------------------------------------
		// Function: onReasonForADDChange
		// Parameter: oEvent
		// Description: This will get called, to set called when Reason for ADD change.
		//------------------------------------------------------------------
		onReasonTypeChange: function(oEvent) {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel"),
					oModel = this.getView().getModel("oViewGlobalModel"),
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
				oViewLimitModel.setProperty("/bLimitationSection", true);
				oViewLimitModel.setProperty("/bLimitation", false);
				oViewLimitModel.setProperty("/bAddLimitationBtn", true);
			} catch (e) {
				Log.error("Exception in onReasonTypeChange function");
			}
		},
		//------------------------------------------------------------------
		// Function: onUilisationChange
		// Parameter: oEvent
		// Description: This will get called, to set called when utilization selection change.
		//------------------------------------------------------------------
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
				if (sSelectedKey.length > 0) {
					if (this.oObject && this.oObject[sSelectedKey] && this.oObject[sSelectedKey].VALUE) {
						var minVal = parseFloat(this.oObject[sSelectedKey].VALUE, [10]);
						oModel.setProperty("/UTILMinVL", minVal);
						var sVal = oModel.getProperty("/UTILVL") ? oModel.getProperty("/UTILVL") : 0;
						sVal = parseFloat(sVal, [10]);
						var iPrec = formatter.JobDueDecimalPrecision(sSelectedKey);
						oModel.setProperty("/UTILVL", parseFloat(minVal, [10]).toFixed(iPrec));

					}

				}
				oModel.setProperty("/UTIL1", sSelectedKey);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onUilisationChange function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onAddLimitaionPress
		// Parameter: oEvent
		// Description: This will get called, when add limitation button clicked.
		//------------------------------------------------------------------
		onAddLimitaionPress: function() {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel");
				oViewLimitModel.setProperty("/bLimitation", true);
				oViewLimitModel.setProperty("/bAddLimitationBtn", false);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onAddLimitaionPress function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onRemoveLimitaionPress
		// Parameter: oEvent
		// Description: This will get called, when remove limitation button clicked.
		//------------------------------------------------------------------
		onRemoveLimitaionPress: function() {
			try {
				var oViewLimitModel = this.getModel("oViewLimitModel");
				oViewLimitModel.setProperty("/bLimitation", false);
				oViewLimitModel.setProperty("/bAddLimitationBtn", true);
				this.getView().getModel("oViewGlobalModel").setProperty("/LDESC", null);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onRemoveLimitaionPress function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onEnterToTheErrorPress
		// Parameter: oEvent
		// Description: This will get called, when Enter To The Error button clicked.
		//------------------------------------------------------------------
		onEnterToTheErrorPress: function(oEvent) {
			try {
				var oModel = this.getView().getModel("TaskModel"),
					oModelError = oEvent.getSource().getBindingContext("TaskModel").getPath();
				oModel.setProperty(oModelError + "/ftdesc", "Entry Enter in Error. No Discrepancy Found.");
				oModel.refresh();
			} catch (e) {
				Log.error("Exception in CosCloseTask:onEnterToTheErrorPress function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onAddLimitaionDialog
		// Parameter: oEvent
		// Description: This will get called,to open Limitation dialog.
		//------------------------------------------------------------------
		onAddLimitaionDialog: function(oEvent) {
			try {
				var that = this,
					oTempCDESC,
					oViewModel = this.getView().getModel("oViewLimitModel"),
					oModel = this.getView().getModel("oViewGlobalModel"),
					oObject;
				oObject = oEvent.getSource().getBindingContext("TaskModel").getObject();
				this.oObjectPath = oEvent.getSource().getBindingContext("TaskModel").getPath();
				this.oObjectTask = oObject.tt1id;
				if (!this._oAddLim) {
					this._oAddLim = sap.ui.xmlfragment(this.createId("idWorkCenterDialog"),
						"avmet.ah.fragments.AddTaskLimitation",
						this);
					oModel.setProperty("/EXPDT", null);
					oModel.setProperty("/EXPTM", "23:59");
					oTempCDESC = this._fnCheckTaskType(oObject.tt1id, oObject.tt2id, oObject.tt3id, oObject.tt4id);
					if (oTempCDESC) {
						oViewModel.setProperty("/CDESC", oObject.cdesc);
						oViewModel.setProperty("/bCDESC", true);
					} else {
						oViewModel.setProperty("/CDESC", "");
						oViewModel.setProperty("/bCDESC", false);
					}
					oViewModel.refresh();
					/*	this._InitializeLimDialogModel();*/
					this.getView().addDependent(this._oAddLim);
					this._fnUtilizationGet(oObject.tailid);
				}
				this._fnCreateLimitation(oObject);
				this._oAddLim.open(this);

			} catch (e) {
				Log.error("Exception in CosCloseTask:onAddLimitaionDialog function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: onCloseAddLimDialog
		// Parameter: oEvent
		// Description: This will get called,to close Limitation dialog.
		//------------------------------------------------------------------
		onCloseAddLimDialog: function() {
			try {
				var oViewModel = this.getView().getModel("TaskModel");
				oViewModel.setProperty(this.oObjectPath + "/tt1id", this.oObjectTask);
				oViewModel.updateBindings(true);
				if (this._oAddLim) {
					this._oAddLim.close(this);
					this._oAddLim.destroy();
					delete this._oAddLim;
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onCloseAddLimDialog function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: onAddADDDialog
		// Parameter: oEvent
		// Description: This will get called,to open add ADD dialog..
		//------------------------------------------------------------------
		onAddADDDialog: function(oEvent) {
			try {
				var that = this,
					oObject,
					oViewModel = this.getView().getModel("ViewModel"),
					oModel = this.getView().getModel("oViewGlobalModel");

				oObject = oEvent.getSource().getBindingContext("TaskModel").getObject();
				this.oObjectPath = oEvent.getSource().getBindingContext("TaskModel").getPath();

				if (!this._oAddADD) {
					this._oAddADD = sap.ui.xmlfragment(this.createId("idAddTaskADDDialog"),
						"avmet.ah.fragments.AddTaskADD",
						this);
					oModel.setProperty("/EXPDT", null);
					oModel.setProperty("/EXPTM", "23:59");
					this._InitializeLimDialogModel();
					this._fnADDCountGet();
					this.getView().addDependent(this._oAddADD);
					this._fnUtilizationGet(oObject.tailid);
				}
				this._fnCreateLimitation(oObject);
				this._oAddADD.open(this);

			} catch (e) {
				Log.error("Exception in CosCloseTask:onAddADDDialog function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onCloseADDDialog
		// Parameter: oEvent
		// Description: This will get called,to close add ADD dialog..
		//------------------------------------------------------------------
		onCloseADDDialog: function() {
			try {
				var oViewModel = this.getView().getModel("TaskModel"),
					oModel = this.getView().getModel("oViewLimitModel");
				oViewModel.setProperty(this.oObjectPath + "/tt1id", this.oObjectTask);
				oModel.setProperty("/bDateSection", false);
				oModel.setProperty("/bUtilisationSection", false);
				oModel.refresh();
				oViewModel.updateBindings(true);
				if (this._oAddADD) {
					this._oAddADD.close(this);
					this._oAddADD.destroy();
					delete this._oAddADD;
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onCloseADDDialog function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onTimeChange
		// Parameter: oEvent
		// Description: This will get called,icon bar selection change.
		//------------------------------------------------------------------
		onTimeChange: function(oEvent) {
			try {
				var oTime = oEvent.getSource().getValue(),
					oObject = oEvent.getSource().getBindingContext("TaskModel").getObject();
				oObject.ftcretm = oTime;
				this.handleChange(oEvent);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onTimeChange function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: _fnCreateLimitation
		// Parameter: oObject
		// Description: This will get called,to create limitation payload.
		//------------------------------------------------------------------

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
				
			}
		},
		//------------------------------------------------------------------
		// Function: onCreateLimitationPress
		// Parameter: sFragId
		// Description: This will get called,to create limitation and stored locally.
		//------------------------------------------------------------------
		onCreateLimitationPress: function(sFragId) {
			try {
				var sFragTempId,
					fragId;
				if (sFragId === "ADD") {
					sFragTempId = this._oAddADD;
					fragId = "idAddTaskADDDialog";
				} else {
					sFragTempId = this._oAddLim;
					fragId = "idWorkCenterDialog";
				}
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this, sFragTempId, true)) {
					return;
				}
				var dDate = new Date(),
					oModel = this.getView().getModel("ViewModel");
				var oParameter = {};
				var oPayLoad = {};
				oPayLoad = this.getModel("oViewGlobalModel").getData();
				if (oPayLoad.OPPR !== "U" && !this.handleChangeUtil(fragId)) {
					return;
				}
				if ((oPayLoad.LDESC !== null) && (oPayLoad.CPRID !== null)) {
					oPayLoad.CAPTY = "B";
					oPayLoad.FLAG_ADD = "B";
				} else if ((oPayLoad.LDESC === null) && (oPayLoad.CPRID !== "" || oPayLoad.CPRID !== null)) {
					oPayLoad.CAPTY = "A";
				} else {
					oPayLoad.CAPTY = "L";
				}
				if (oPayLoad.EXPDT !== null && oPayLoad.EXPDT !== "") {
					try {
						oPayLoad.EXPDT = formatter.defaultOdataDateFormat(oPayLoad.EXPDT);
					} catch (e) {
						oPayLoad.EXPDT = oPayLoad.EXPDT;
					}
				} else {
					oPayLoad.EXPDT = null;
				}
				try {
					if (oPayLoad.UTILVL) {
						var iPrecision = formatter.JobDueDecimalPrecision(oPayLoad.UTIL1);
						oPayLoad.UTILVL = parseFloat(oPayLoad.UTILVL, [10]).toFixed(iPrecision);
					}

				} catch (e) {
					oPayLoad.UTILVL = oPayLoad.UTILVL;
				}

				oPayLoad.CSTAT = "C";

				delete oPayLoad.UTILMinVL;
				delete oPayLoad.bUtilisationSection;
				var oLimit = this.getModel("ViewModel").getProperty("/LimitADD");
				if (!oLimit) {
					oLimit = [];
				}
				oLimit.push(JSON.parse(JSON.stringify(oPayLoad)));
				this.getModel("ViewModel").setProperty("/LimitADD", oLimit);
				var oTaskModel = this.getModel("TaskModel").getData();
				for (var i in oTaskModel) {
					if (oTaskModel[i].taskid === oPayLoad.TASKID) {
						oTaskModel[i].CPRID = oPayLoad.CPRID;
						oTaskModel[i].DEFPD = oPayLoad.DEFPD;
						oTaskModel[i].DMDID = oPayLoad.DMDID;
						oTaskModel[i].OTHER_RSN = oPayLoad.OTHER_RSN;
						oTaskModel[i].ldesc = oPayLoad.LDESC;
						oTaskModel[i].oppr = oPayLoad.OPPR;
						oTaskModel[i].expdt = oPayLoad.EXPDT;
						oTaskModel[i].exptm = oPayLoad.EXPTM;
						oTaskModel[i].util1 = oPayLoad.UTIL1;
						oTaskModel[i].utilvl = oPayLoad.UTILVL;
						oTaskModel[i].addLimitAdded = true;

					}
				}
				this.getModel("TaskModel").setData(oTaskModel);
				this.onCloseAddLimDialog();
				this.onCloseADDDialog();
				// oParameter.error = function() {};
				// oParameter.success = function(oData) {
				// 	this._fnTasksADDGet(oData.results[0].TASKID);
				// 	this.onCloseAddLimDialog();
				// 	this.onCloseADDDialog();
				// 	var ViewGlobalModel = this.getModel("oViewGlobalModel");
				// 	ViewGlobalModel.setData(null);
				// }.bind(this);
				// /*	oParameter.activity = 1;
				// 	, "ZRM_ADDL", this*/
				// ajaxutil.fnCreate(this.getResourceBundle().getText("ADDSVC"), oParameter, [oPayLoad]);

			} catch (e) {
				Log.error("Exception in CosCloseTask:onCreateLimitationPress function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onTypeChangeOther
		// Parameter: oEvent
		// Description: This will get called,when task combobox selection chnage for Task Type Other.
		//------------------------------------------------------------------
		onTypeChangeOther: function(oEvent) {
			try {
				var oSelectedKey = oEvent.getSource().getSelectedKey(),
					oModel = this.getView().getModel("ViewModel");
				//oModel.setProperty("/bLiveChnage", false);
				//	oModel.setProperty("/bAddADDOther", oSelectedKey);
				this.oObjectTask = "TT1_14";
				if (oSelectedKey === "TT1_ADD") {
					this.onAddADDDialog(oEvent);
				} else {
					oEvent.getSource().setSelectedKey("TT1_14");
				}

			} catch (e) {
				Log.error("Exception in CosCloseTask:onTypeChangeOther function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onTypeChangeOPS
		// Parameter: oEvent
		// Description: This will get called,when task combobox selection chnage for Task Type Other.
		//------------------------------------------------------------------
		onTypeChangeOPS: function(oEvent) {
			try {
				var oSelectedKey = oEvent.getSource().getSelectedKey(),
					oModel = this.getView().getModel("ViewModel");
				this.oObjectTask = "TT1_11";
				//oModel.setProperty("/bAddADDOps", oSelectedKey);
				if (oSelectedKey === "TT1_AD") {
					this.onAddADDDialog(oEvent);
				} else {
					oEvent.getSource().setSelectedKey("TT1_11");
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onTypeChangeOPS function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: onTypeChange
		// Parameter: oEvent
		// Description:  This will get called,whene type change.
		//------------------------------------------------------------------
		onTypeChange: function(oEvent) {
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
				Log.error("Exception in onTypeChange function");
			}
		},
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************

		//------------------------------------------------------------------
		// Function: _onObjectMatched
		// Parameter: sJobId
		// Description: This will get called, This will called to handle route matched.
		//------------------------------------------------------------------
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
					jbDate = oEvent.getParameters().arguments.jbDate,
					jbTime = oEvent.getParameters().arguments.jbTime,
					ViewModel = dataUtil.createNewJsonModel(),
					oDate = new Date(),
					oDDT1Model = dataUtil.createNewJsonModel(),
					oDDT2Model = dataUtil.createNewJsonModel(),
					oTempJB;
				oTempJB = JSON.parse(sTaskId);

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

				oDDT2Model.setData([{
					"key": "Material No.",
					"text": "Material No."
				}, {
					"key": "Part No.",
					"text": "Part No."
				}]);
				this.getView().setModel(oDDT2Model, "TT2Model");

				ViewModel.setData({
					JobId: sJobId,
					TaskId: oTempJB,
					WorkCenter: sWrkCenter,
					TailId: sTailId,
					AirId: sAirId,
					WorkKey: sWorkKey,
					Flag: sflag,
					srvtid: ssrvtid,
					jbDate: jbDate,
					jbTime: jbTime,
					sDate: oDate,
					Time: oDate.getHours() + ":" + oDate.getMinutes(),
					MulitiFlag: "N",
					proccedBtn: true,
					backBtn: false,
					signOffBtn: false,
					bTradesMan: false,
					selectedIcon: "followUp",
					bAddADDOther: false,
					bAddADDOps: false,
					bLiveChnage: true,
					ADDCount: "",
					ResultStatus: "",
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
				var oTempCTModel = dataUtil.getDataSet("TempCloseTaskModel");
				if (oTempCTModel) {
					this._fnCreateTempTaskModel();
					this.getView().getModel("ViewModel").setProperty("/LimitADD", dataUtil.getDataSet("TempCloseCAPModel"));
				} else {
					this._fnTasksGet(oTempJB);
				}
				this.landTyre = {};
				//this._fnTasksGet(oTempJB);
				this._fnReasonforADDGet();
				this._fnUtilizationGet();
				this._fnUtilization2Get();
				this._fnGetUtilisationDefaultVal(sAirId);
				this._fnPerioOfDeferCBGet();
				//that._fnInitialLoad();
			} catch (e) {
				Log.error("Exception in CosCloseTask:_onObjectMatched function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnCreateTempTaskModel
		// Parameter: oEvent
		// Description: This will get called, to create temporary task model.
		//------------------------------------------------------------------
		_fnCreateTempTaskModel: function() {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel(),
					oTempModel = dataUtil.getDataSet("TempCloseTaskModel");
				for (var i = 0; i < oTempModel.length; i++) {
					oTempModel[i].ftcredt = new Date(oTempModel[i].ftcredt);
				}
				oModel.setData(oTempModel);
				that.getView().setModel(oModel, "TaskModel");
				that.getView().byId("vbLimId").invalidate();
				that.getView().byId("vbTaskId").invalidate();
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
				this.byId("pageCloseTaskId").scrollTo(0);
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnCreateTempTaskModel function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnCheckTaskType
		// Parameter: tt1id, tt2id, tt3id, tt4id
		// Description: This will get called, to create check task type.
		//------------------------------------------------------------------
		_fnCheckTaskType: function(tt1id, tt2id, tt3id, tt4id) {
			try {
				if ((tt1id === "TT1_10" && tt2id === "TT2_10") || (tt1id === "TT1_10" && tt2id === "TT2_13")) {
					return true;
				} else {
					return false;
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnCheckTaskType function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: _fnGetLandingTyre
		// Parameter: aData
		// Description: This will get called, to add partno for the landing tyre record.
		//------------------------------------------------------------------

		_fnGetLandingTyre: function(aData) {
			try {
				var partNo = "";
				for (var i in aData) {
					if (aData[i].tt1id === "TT1_10" && (aData[i].tt2id === "TT2_10" || aData[i].tt2id === "TT2_15") && aData[i].engflag === "NE" &&
						aData[i].partno && aData[i].partno.trim() !== "") {
						this.landTyre[aData[i].partno] = aData[i];
						if (partNo === "") {
							partNo = partNo.concat(aData[i].partno);
						} else {
							partNo = partNo.concat("," + aData[i].partno);
						}
					}
				}
				if (partNo !== "") {
					this._fnCheckLandingTyre(aData[i], partNo);
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnGetLandingTyre function");
				
			}
		},

		//------------------------------------------------------------------
		// Function: _fnOpenLandingTyreBox
		// Parameter: aData
		// Description: This will get called, Update landing tyre locally and close fragment.
		//------------------------------------------------------------------
		_fnOpenLandingTyreBox: function(aData) {
			try {
				var aItem,
					oData = [];
				for (var i in aData) {
					if (this.landTyre[aData[i].PARTNO]) {
						this.landTyre[aData[i].PARTNO].TIREID = aData[i].TIREID;
						oData.push(this.landTyre[aData[i].PARTNO]);
					}
				}
				if (oData.length > 0) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(JSON.parse(JSON.stringify(oData)));
					this.getView().setModel(oModel, "LandingTyreModel");
					if (!this._oLandingTyre) {
						this._oLandingTyre = sap.ui.xmlfragment(this.createId("idLandingTyre"),
							"avmet.ah.fragments.LandingTyreCannibalized",
							this);
						this.getView().addDependent(this._oLandingTyre);
					}
					this._oLandingTyre.open(this);
				}

			} catch (e) {
				Log.error("Exception in CosCloseTask:_fnOpenLandingTyreBox function");
				
			}

		},
		//------------------------------------------------------------------
		// Function: onLandingTyreValChange
		// Parameter: oEvent
		// Description: This will get called, Open landing tyre fragment.
		//------------------------------------------------------------------

		onLandingTyreValChange: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sText = oSrc.getValue(),
					sPath = oSrc.getBindingContext("LandingTyreModel").getPath();
				this.getModel("LandingTyreModel").setProperty(sPath + "/LNDPIN", sText);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onLandingTyreValChange function");
				
			}

		},

		//------------------------------------------------------------------
		// Function: onLandingTyreUpdate
		// Parameter: oEvent
		// Description: This will get called, Update landing tyre locally and close fragment
		//------------------------------------------------------------------

		onLandingTyreUpdate: function() {
			try {
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this, this._oLandingTyre, true)) {
					return;
				}

				if (this._oLandingTyre) {
					this._oLandingTyre.close(this);
					this._oLandingTyre.destroy();
					delete this._oLandingTyre;
				}
			} catch (e) {
				Log.error("Exception in CosCloseTask:onLandingTyreUpdate function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnInitialLoad
		// Parameter: oEvent
		// Description: This will get called, Loads the data after the view initialised
		//------------------------------------------------------------------

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
				
			}
		},
		//------------------------------------------------------------------
		// Function: onChangeData
		// Parameter: oEvent
		// Description: showing the message text and validation of maxlength
		//------------------------------------------------------------------

		onChangeData: function(oEvent) {
			try {
				this.getView().getModel("ViewModel").setProperty("/bLiveChnage", false);
			} catch (e) {
				Log.error("Exception in CosCloseTask:onChangeData function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onChangeDataInput
		// Parameter: oEvent
		// Description: Function to save sernr value in local model
		//------------------------------------------------------------------
		onChangeDataInput: function(oEvent) {
			try {
				var sPath = oEvent.getSource().getBindingContext("TaskModel").getPath();
				this.getModel("TaskModel").setProperty(sPath + "/ftsernr", oEvent.getParameter("value"));
				// this.getView().getModel("TaskModel").updateBindings(true);
				this.getView().getModel("ViewModel").setProperty("/bLiveChnage", false);
			} catch (e) {
				Log.error("Exception in handleLiveChangeFlyingRequire function");
			}
		},
		//------------------------------------------------------------------
		// Function: onVIResultSelect
		// Parameter: oEvent
		// Description: Function on click VI result type selection
		//------------------------------------------------------------------
		onVIResultSelect: function(oEvent) {
			try {
				var that = this,
					sPath = oEvent.getSource().getBindingContext("TaskModel").getPath();

				if (oEvent.getSource().getSelectedIndex() === 1) {
					dataUtil.setDataSet("TempCloseTaskModel", this.getView().getModel("TaskModel").getData());
					dataUtil.setDataSet("TempCloseCAPModel", this.getView().getModel("ViewModel").getProperty("/LimitADD"));
					that.getVIResultStatus();
				}
			} catch (e) {
				Log.error("Exception in handleLiveChangeFlyingRequire function");
			}
		},
		//------------------------------------------------------------------
		// Function: getVIResultStatus
		// Parameter: oEvent
		// Description:  Function to open fragment for VI results
		//------------------------------------------------------------------
		getVIResultStatus: function() {
			try {
				if (!this._oVIDialog) {
					this._oVIDialog = sap.ui.xmlfragment(this.createId("idVTResultStatus"),
						"avmet.ah.fragments.VisualInspectionDialog",
						this);
					this.getView().addDependent(this._oVIDialog);
				}
				this._oVIDialog.open(this);
			} catch (e) {
				Log.error("Exception in getVIResultStatus function");
			}
		},
		//------------------------------------------------------------------
		// Function: onCloseVIStatus
		// Parameter: oEvent
		// Description: Function to close fragment for VI results
		//------------------------------------------------------------------
		onCloseVIStatus: function() {
			try {
				if (this._oVIDialog) {
					this._oVIDialog.close(this);
					this._oVIDialog.destroy();
					delete this._oVIDialog;
				}
			} catch (e) {
				Log.error("Exception in onCloseVIStatus function");
			}
		},
		//------------------------------------------------------------------
		// Function: onSaveVIStatus
		// Parameter: oEvent
		// Description: Function to navigate to selected screen.
		//------------------------------------------------------------------
		onSaveVIStatus: function(oEvent) {
			try {
				var that = this,
					oSelectedIndex,
					oModel = this.getView().getModel("ViewModel");

				oSelectedIndex = that.getFragmentControl("idVTResultStatus", "rbVIStatus").getSelectedIndex();
				if (oSelectedIndex === 1) {
					that.getRouter().navTo("RouteCreateTask", {
						"JobId": oModel.getProperty("/JobId"),
						"AirId": oModel.getProperty("/AirId"),
						"TailId": oModel.getProperty("/TailId"),
						"WorkCenter": oModel.getProperty("/WorkCenter"),
						"WorkKey": oModel.getProperty("/WorkKey"),
						"Flag": "TS",
						"srvid": "NA",
						"jbDate": oModel.getProperty("/jbDate"),
						"jbTime": oModel.getProperty("/jbTime")
					});
				} else {
					//that.getRouter().navTo("CosCreateJob");
					that.getRouter().navTo("CosCreateJob", {
						"JobId": oModel.getProperty("/JobId"),
						"RJobId": "T"
					});
				}
				this.onCloseVIStatus();
			} catch (e) {
				Log.error("Exception in onCloseVIStatus function");
			}
		},

		//-------------------------------------------------------------------------------------
		//  Private method: This will get called,to add new tradesman to the list.
		// Table: 
		//--------------------------------------------------------------------------------------
		//------------------------------------------------------------------
		// Function: handleLiveChange
		// Parameter: oEvent
		// Description: showing the message text and validation of maxlength.
		//------------------------------------------------------------------

		handleLiveChange: function(oEvent) {
			try {

				var oSource = oEvent.getSource(),
					sValue = oSource.getValue(),
					iMaxLen = oSource.getMaxLength(),
					iLen = sValue.length;
				this.getView().getModel("ViewModel").setProperty("/bLiveChnage", false);
				if (iLen && iMaxLen && iLen > iMaxLen) {
					sValue = sValue.substring(0, iMaxLen);
					oSource.setValue(sValue);
				}
			} catch (e) {
				Log.error("Exception in handleLiveChangeFlyingRequirements function");
			}
		},
		//------------------------------------------------------------------
		// Function: _InitializeLimDialogModel
		// Parameter: oEvent
		// Description: This will get called, to add initialize limitation model
		//------------------------------------------------------------------
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
					bAddLimitationBtn: false,
					sSlectedKey: "N",
					DatePrev: DatePrev,
					CDESC: "",
					bCDESC: false,
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
				Log.error("Exception in _InitializeLimDialogModel function");
			}
		}
	});
});