sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"../model/FieldValidations",
	"../model/formatter",
	"../model/AvMetInitialRecord",
	"../util/ajaxutil",
	"sap/base/Log",
	"sap/m/MessageBox",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, FieldValidations, formatter, AvMetInitialRecord, ajaxutil, Log, MessageBox, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAHUL THORAT   
	 *   Control name: Create Task          
	 *   Purpose : Create New Task 
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *   2. Backend Calls
	 *        2.1 onSubmit
	 *        2.2 _fnGetMainTaskDropDown
	 *        2.3 _fnGetMainTaskDropDown
	 *        2.4 _fnGetTaskDescDropDown
	 *        2.5 _fnGetTaskDescDropDown
	 *        2.6 _fnGetTaskTT311DropDown
	 *        2.7 getSerialNoPress
	 *        2.8 _fnGetDateValidation
	 *        2.9 onSubmit
	 *        2.10 onSuggestTechOrder
	 *        2.10 _fnGetMainTaskDropDown
	 *        2.10 _fnGetTaskDescDropDown 
     *        2.10 onSubmit
	 *     3. Private calls
	 *        3.1 onNavToDefectSummaryADD
	 *        3.2 onTaskTypeChange
	 *        	 3.3 _ResetTaskType
	 *        	 3.4 onSegmentOtherSelected
	 *        	 3.5 onRemoveInstallTaskChange
	 *        	 3.6 onTypeDescChange
	 *        	 3.7 onOpenForAccessChange
	 *        	 3.8 onRemoveForAccessChange
	 *        	 3.9 onAddTaskPress
	 *        	 3.10 onCancelCreateTaskPress
	 *        	 3.11 onCreateTaskPress
	 *        	 3.12 onEditTaskPress
	 *        	 3.13 onUpdateTaskPress
	 *        	 3.14 onDeleteTaskPress
	 *        	 3.15 _onObjectMatched
	 *        	 3.16 _ResetRemoveAndInstall
	 *        	 3.17 _fnCreateTask
	 *        	 3.18 onNavToDefectSummaryADD
	 *   Note :
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.CosCreateTask", {
		formatter: formatter,

		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var that = this,
					oModelSr,
					oModel, oDDT2Model,
					oDDT1Model;
				oDDT1Model = dataUtil.createNewJsonModel();
				oDDT1Model.setData([{
					"key": "Serial No. (S/N)",
					"text": "Serial No. (S/N)"
				}, {
					"key": "Batch No.",
					"text": "Batch No."
				}]);
				this.getView().setModel(oDDT1Model, "TT1Model");
				oDDT2Model = dataUtil.createNewJsonModel();
				oDDT2Model.setData([{
					"key": "Material No.",
					"text": "Material No."
				}, {
					"key": "Part No.",
					"text": "Part No."
				}]);
				that.getView().setModel(oDDT2Model, "TT2Model");
				oModelSr = dataUtil.createNewJsonModel();
				this.getView().setModel(oModelSr, "SerialNumModel");
				that._fnGetMainTaskDropDown();
				that._fnGetTaskDropDown();
				that._fnGetTaskTT310DropDown();
				that._fnGetTaskTT311DropDown();
				that.getRouter().getRoute("RouteCreateTask").attachPatternMatched(that._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in CosCreateTask:onInit function");
			}
		},

		/* Function: handleChange
		 * Parameter:
		 * Description: Function to validate date/time
		 */
		handleChange: function() {
			try {
				var prevDt = this.getModel("ViewModel").getProperty("/backDt");
				var prevTime = this.getModel("ViewModel").getProperty("/backTm");
				return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorCreateTaskPast", "errorCreateTaskFuture", prevDt, prevTime);
			} catch (e) {
				Log.error("Exception in handleChange function");
			}
		},
		
			/* Function: handleChangeTAsk
		 * Parameter:
		 * Description: Function to validate date/time
		 */
       /*Rahul: 12/12/2020:03:28PM: New code added*/
		handleChangeTAsk: function(oEvent) {
			try {
			var prevDt = this.getModel("ViewModel").getProperty("/backDt");
			var prevTime = this.getModel("ViewModel").getProperty("/backTm");
			this.getModel("ViewModel").setProperty("/sDate",oEvent.getSource().getDateValue());
			return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorCreateTaskPast", "errorCreateTaskFuture", prevDt, prevTime);
			} catch (e) {
				Log.error("Exception in handleChangeTAsk function");
			}
		},
	

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		/* Function: getSerialNoPress
		 * Parameter: oEvent
		 * Description: Private method: This will get called, to get Serial number for part number.
		 */
		getSerialNoPress: function() {
			try {
				var oPrmDD = {},
					oModelSr,
					oModel = this.getModel("oCreateTaskModel"),
					that = this,
					oPayload;
			//	oPrmDD.filter = "PARTNO eq " + oModel.getProperty("/sType2Value") + " and ESTAT eq I and INSON eq " + this.getTailId();
				oPrmDD.filter = "PARTNO"+ FilterOpEnum.EQ + oModel.getProperty("/sType2Value") +  FilterOpEnum.AND+ "ESTAT" +FilterOpEnum.EQ+ "I" +FilterOpEnum.AND+ "INSON" +FilterOpEnum.EQ+ this.getTailId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					if (oData.results.length !== 0) {
						oModelSr = this.getView().getModel("SerialNumModel");
						oModelSr.setData(oData.results);
						oModelSr.updateBindings(true);
						oModel.setProperty("/bSrComFlag", "Y");
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
				Log.error("Exception in getSerialNoPress function");
			}
		},
		/* Function: _fnGetDateValidation
		 * Parameter:
		 * Description: Function to retreive min allowed date/time
		 */
		_fnGetDateValidation: function(sJobId) {
			try {
				var oPrmTaskDue = {};
		//		oPrmTaskDue.filter = "TAILID eq " + this.getTailId() + " and JFLAG eq T and AFLAG eq I and jobid eq " + sJobId;
					oPrmTaskDue.filter = "TAILID" + FilterOpEnum.EQ + this.getTailId() + "&JFLAG" + FilterOpEnum.EQ + "T&AFLAG" + FilterOpEnum.EQ +
					"I&jobid" + FilterOpEnum.EQ + sJobId;
				oPrmTaskDue.error = function() {};
				oPrmTaskDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("ViewModel").setProperty("/backDt", oData.results[0].VDATE);
						this.getModel("ViewModel").setProperty("/backTm", oData.results[0].VTIME);
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("JOBSDATEVALIDSVC"), oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in _fnGetDateValidation function");
			}
		},
		//------------------------------------------------------------------
		// Function: onSubmit
		// Parameter: 
		// Description: This will get called, when create task button press 
		//              to create task paylod to create records in backend.
		//Table: 
		//------------------------------------------------------------------
		onSubmit: function() {
			try {
				if (!this.handleChange()) {
					return;
				}
				var that = this,
					oCreateTaskModel = that.getModel("oCreateTaskModel"),
					aTasks = oCreateTaskModel.getProperty("/aTasks"),
					sjobid = "",
					oModel = that.getView().getModel("ViewModel"),
					oTempData = AvMetInitialRecord.createInitialBlankRecord("NewTask"),
					oPayLoad = [];
				var dDate = new Date();
				if (!aTasks || aTasks.length === 0) {
					sap.m.MessageBox.error("Please add task(s) to proceed");
					return;
				}
				for (var i = 0; i < aTasks.length; i++) {
					oTempData = AvMetInitialRecord.createInitialBlankRecord("NewTask");

					oTempData[0].taskid = sjobid.concat("TASK_", dDate.getFullYear(), dDate.getMonth(), dDate.getDate(), dDate.getHours(), dDate.getMinutes(),
						dDate.getSeconds(), i);
					oTempData[0].jobid = aTasks[i].JobId;
					oTempData[0].tailid = aTasks[i].TailId;
					oTempData[0].wrctr = aTasks[i].WorkKey;
					oTempData[0].tt1id = aTasks[i].sTaskType;
					if (aTasks[i].sTask === "TT2_10") {
						oTempData[0].tt2id = aTasks[i].sType1 === "Serial No. (S/N)" ? "TT2_10" : "TT2_15";
					} else {
						oTempData[0].tt2id = aTasks[i].sTask;
					}
					if (aTasks[i].sTypDesc !== "" || aTasks[i].sTypDesc !== undefined) {
						oTempData[0].tt3id = aTasks[i].sTypDesc;
					} else {
						oTempData[0].tt3id = "";
					}
					if (aTasks[i].sTypDescKey !== "" || aTasks[i].sTypDescKey !== undefined) {
						oTempData[0].tt4id = aTasks[i].sTypDescKey;
					} else {
						oTempData[0].tt4id = "";
					}
					/*oTempData[0].credtm = formatter.defaultOdataDateFormat(oModel.getProperty("/sDate"));*/
					try {
						oTempData[0].credtm = formatter.defaultOdataDateFormat(oModel.getProperty("/sDate"));
					} catch (e) {
						oTempData[0].credtm = oTempData[0].credtm;
					}
					oTempData[0].creuzt = formatter.defaultTimeFormatDisplay(oModel.getProperty("/Time"));
					if (aTasks[i].sCheckfor !== "") {
						oTempData[0].chkfor = aTasks[i].sCheckfor;
						oTempData[0].ftchkfor = aTasks[i].sCheckfor;
					}
					oTempData[0].indarea = aTasks[i].sIndicateArea;
					switch (aTasks[i].sTaskType) {
						case "TT1_14":
						case "TT1_15":
						case "TT1_16":
						case "TT1_17":
						case "TT1_18":
						case "TT1_19":
							oTempData[0].tdesc = aTasks[i].sOtherDesc;
							break;
						case "TT1_11":
							oTempData[0].tdesc = aTasks[i].sOpsDesc;
							break;
						default:
							oTempData[0].tdesc = "";
							break;
					}
					if (aTasks[i].sTaskType === "TT1_10" && aTasks[i].sTask === "TT2_12") {
						oTempData[0].ftsernr = aTasks[i].sType1Value;
					}

					//oTempData[0].tdesc = aTasks[i].sOpsDesc;
					/*	oTempData[0].symbol = aTasks[i].sSymbol;*/
					oTempData[0].toref = aTasks[i].sTechOrderRef;
					oTempData[0].fttoref = aTasks[i].sTechOrderRef;
					oTempData[0].isser = aTasks[i].sType1;
					/*oTempData[0].servl = aTasks[i].sType1Value;*/
					if (aTasks[i].sSLNo !== "") {
						oTempData[0].sernr = aTasks[i].sSLNo;
					} else {
						oTempData[0].sernr = aTasks[i].sType1Value;
					}
					oTempData[0].engflag = aTasks[i].sEngFlag;
					/*oTempData[0].ftsernr = aTasks[i].sType1Value;*/
					oTempData[0].ismat = aTasks[i].sType2;
					oTempData[0].partno = aTasks[i].sType2Value;
					oTempData[0].otherss = aTasks[i].sIndicateItem;
					oTempData[0].itemno = aTasks[i].sItemNo;
					oTempData[0].ftitemno = aTasks[i].sItemNo;
					if (oModel.getProperty("/sFlag") === "FS") {
						oTempData[0].ttid = "2";
						oTempData[0].srvtid = oModel.getProperty("/ssrvid");
						oTempData[0].stepid = "S_CT";
					} else {
						oTempData[0].ttid = "1";
					}

					if (aTasks[i].sCompDesc !== "") {
						oTempData[0].cdesc = aTasks[i].sCompDesc;
						oTempData[0].ftcdesc = aTasks[i].sCompDesc;
					} else if (aTasks[i].sOpsDesc !== "") {
						oTempData[0].cdesc = aTasks[i].sOpsDesc;
						oTempData[0].ftcdesc = aTasks[i].sOpsDesc;
						oTempData[0].tdesc = aTasks[i].sOpsDesc;
						oTempData[0].ftdesc = aTasks[i].sOpsDesc;
					} else if (aTasks[i].sOtherDesc !== "") {
						oTempData[0].cdesc = aTasks[i].sOtherDesc;
						oTempData[0].ftcdesc = aTasks[i].sOtherDesc;
						oTempData[0].tdesc = aTasks[i].sOtherDesc;
					} else if (aTasks[i].sCompCompDesc !== "") {
						oTempData[0].cdesc = aTasks[i].sCompCompDesc;
						oTempData[0].ftcdesc = aTasks[i].sCompCompDesc;
					}

					oPayLoad.push(oTempData[0]);
				}
				that._fnCreateTask(oPayLoad);
			} catch (e) {
				Log.error("Exception in CosCreateTask:onSubmit function");
				
			}
		},

		/* Function: onSuggestTechOrder
		 * Parameter: oEvent
		 * Description: Function to show suggestive search for technical order reference
		 */
		onSuggestTechOrder: function(oEvent) {
			var sText = oEvent.getSource().getValue();
			try {
				var that = this,
					oPrmJobDue = {};
			//	oPrmJobDue.filter = "TAILID eq " + that.getTailId() + " and TOREF eq " + sText;
				oPrmJobDue.filter = "TAILID"+FilterOpEnum.EQ+ that.getTailId() + FilterOpEnum.AND+ "TOREF"+ FilterOpEnum.EQ + sText;
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
		// Function: _fnGetMainTaskDropDown
		// Parameter: 
		// Description: This will get called, when to get main task for dropdown from backend.
		//Table: TTYPE
		//------------------------------------------------------------------
		_fnGetMainTaskDropDown: function() {
			try {
				var oPrmDD = {},
					oModel,
					that = this,
					oPayload;
			//	oPrmDD.filter = "ttid eq TT1_ and airid eq " + that.getAircraftId();
				oPrmDD.filter = "ttid"+FilterOpEnum.EQ+"TT1_"+FilterOpEnum.AND+"airid"+FilterOpEnum.EQ+that.getAircraftId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TaskMainListModel");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKTYPESVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in CosCreateTask:_fnGetMainTaskDropDown function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetTaskDropDown
		// Parameter: 
		// Description: This will get called, when to get sub task TT2 type for dropdown from backend.
		//Table: TTYPE
		//------------------------------------------------------------------
		_fnGetTaskDropDown: function() {
			try {
				var oPrmDD = {},
					oModel,
					that = this,
					oPayload;
			//	oPrmDD.filter = "ttid eq TT2_ and airid eq " + that.getAircraftId();
				oPrmDD.filter = "ttid"+FilterOpEnum.EQ+"TT2_"+FilterOpEnum.AND+"airid"+FilterOpEnum.EQ+that.getAircraftId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					this.getView().setModel(oModel, "TaskListModel");
					this._fnGetTaskDescDropDown();
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKTYPESVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in CosCreateTask:_fnGetTaskDropDown function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetTaskDescDropDown
		// Parameter: 
		// Description: This will get called, when to get sub task TT3 type for dropdown from backend.
		//Table: TTYPE
		//------------------------------------------------------------------
		_fnGetTaskDescDropDown: function() {
			try {
				var oPrmDD = {},
					oModel,
					that = this,
					oPayload;
			//	oPrmDD.filter = "ttid eq TT3_ and airid eq " + that.getAircraftId();
			oPrmDD.filter = "ttid"+FilterOpEnum.EQ+"TT3_"+FilterOpEnum.AND+"airid"+FilterOpEnum.EQ+that.getAircraftId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TaskDescModel");
					//that._fnGetTaskSubDescDropDown();
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKTYPESVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in CosCreateTask:_fnGetTaskDescDropDown function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetTaskTT310DropDown
		// Parameter: 
		// Description: This will get called, when to get sub task TT3_10 type for dropdown from backend.
		//Table: TTYPE and TT34
		//------------------------------------------------------------------
		_fnGetTaskTT310DropDown: function() {
			try {
				var oPrmDD = {},
					oModel,
					that = this,
					oPayload;
			//	oPrmDD.filter = "ttid eq TT3_10 and tflag eq X and airid eq " + that.getAircraftId();
				oPrmDD.filter = "ttid"+FilterOpEnum.EQ+"TT3_10"+FilterOpEnum.AND+"tflag"+FilterOpEnum.EQ+"X"+FilterOpEnum.AND+"airid"+FilterOpEnum.EQ+that.getAircraftId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TT310Model");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKTYPESVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in CosCreateTask:_fnGetTaskTT310DropDown function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _fnGetTaskTT311DropDown
		// Parameter: 
		// Description: This will get called, when to get sub task TT3_11 type for dropdown from backend.
		//Table: TTYPE and TT34
		//------------------------------------------------------------------
		_fnGetTaskTT311DropDown: function() {
			try {
				var oPrmDD = {},
					oModel,
					that = this,
					oPayload;
			//	oPrmDD.filter = "ttid eq TT3_11 and tflag eq X and airid eq " + that.getAircraftId();
			oPrmDD.filter = "ttid"+FilterOpEnum.EQ+"TT3_11"+FilterOpEnum.AND+"tflag"+FilterOpEnum.EQ+"X"+FilterOpEnum.AND+"airid"+FilterOpEnum.EQ+that.getAircraftId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "TT311Model");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("TASKTYPESVC"), oPrmDD, oPayload);
			} catch (e) {
				Log.error("Exception in CosCreateTask:_fnGetTaskTT311DropDown function");
				
			}
		},

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		//------------------------------------------------------------------
		// Function: onNavToDefectSummaryADD
		// Parameter: 
		// Description: This will get called, when to nav back to Defect Summary ADD.
		//Table: 
		//------------------------------------------------------------------
		onNavToDefectSummaryADD: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("RouteDefectSummaryADD", {}, true);
			} catch (e) {
				Log.error("Exception in CosCreateTask:onNavToDefectSummaryADD function");
				
			}
		},

		/* Function: handleChange
		 * Parameter:
		 * Description: Function to validate date/time
		 */

		// handleChange: function() {
		// 	var prevDt = this.getModel("ViewModel").getProperty("/backDt");
		// 	var prevTime = this.getModel("ViewModel").getProperty("/backTm");
		// 	return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorCreateTaskPast", "errorCreateTaskFuture", prevDt, prevTime);
		// },
		
			/* Function: handleChange
		 * Parameter:
		 * Description: Function to validate date/time
		 */
       /*Rahul: 12/12/2020:03:28PM: New code added*/
		// handleChangeTAsk: function(oEvent) {
		// 	var prevDt = this.getModel("ViewModel").getProperty("/backDt");
		// 	var prevTime = this.getModel("ViewModel").getProperty("/backTm");
		// 	this.getModel("ViewModel").setProperty("/sDate",oEvent.getSource().getDateValue());
		// 	return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorCreateTaskPast", "errorCreateTaskFuture", prevDt, prevTime);
		// },
		//------------------------------------------------------------------
		// Function: onTaskTypeChange
		// Parameter: 
		// Description: This will get called, when task type selected from create task fragment.
		//Table: 
		//------------------------------------------------------------------
		onTaskTypeChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey(),
					sSelectedText = oEvent.getParameter("selectedItem").getText(),
					oCreateTaskModel = this.getModel("oCreateTaskModel");
				this._ResetTaskType();
				this._ResetRemoveAndInstall();
				if (sSelectedKey === "TT1_10") {
					oCreateTaskModel.setProperty("/bRemoveOrInstall", true);
					oCreateTaskModel.setProperty("/sTask", "");
				} else if (sSelectedKey === "TT1_11") {
					oCreateTaskModel.setProperty("/bOpsCheck", true);
				} else if (sSelectedKey === "TT1_12") {
					oCreateTaskModel.setProperty("/bVisualInspection", true);
				} else if (sSelectedKey === "TT1_13") {
					oCreateTaskModel.setProperty("/bToolsCheck", true);
				} else if (sSelectedKey === "TT1_14" || sSelectedKey === "TT1_15" || sSelectedKey === "TT1_16" || sSelectedKey === "TT1_17" ||
					sSelectedKey === "TT1_18" || sSelectedKey === "TT1_19") {
					oCreateTaskModel.setProperty("/bOthers", true);
				}
				oCreateTaskModel.setProperty("/sTaskType", sSelectedKey);
				oCreateTaskModel.setProperty("/sTaskTypeText", sSelectedText);
				oCreateTaskModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosCreateTask:onTaskTypeChange function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: _ResetTaskType
		// Parameter: 
		// Description: This will get called, when reset task model data.
		//Table: 
		//------------------------------------------------------------------
		_ResetTaskType: function() {
			try {
				var oCreateTaskModel = this.getModel("oCreateTaskModel");
				oCreateTaskModel.setProperty("/bRemoveOrInstall", false);
				oCreateTaskModel.setProperty("/bOpsCheck", false);
				oCreateTaskModel.setProperty("/bVisualInspection", false);
				oCreateTaskModel.setProperty("/bToolsCheck", false);
				oCreateTaskModel.setProperty("/bOthers", false);
				//Removal and/or Install Fields Reset
				oCreateTaskModel.setProperty("/sOpnForAccKey", "");
				oCreateTaskModel.setProperty("/sRemoveForAccKey", "");
				oCreateTaskModel.setProperty("/sOpnForAccKeyText", "");
				oCreateTaskModel.setProperty("/sRemoveForAccKeyText", "");
				oCreateTaskModel.setProperty("/sTypDescKey", "");
				oCreateTaskModel.setProperty("/sTechOrderRef", "IETM");
				oCreateTaskModel.setProperty("/sType1", "");
				oCreateTaskModel.setProperty("/sType1Value", "");
				oCreateTaskModel.setProperty("/sEngFlag", "NA");
				oCreateTaskModel.setProperty("/bEngFlag", false);
				oCreateTaskModel.setProperty("/sType2", "");
				oCreateTaskModel.setProperty("/sType2Value", "");
				oCreateTaskModel.setProperty("/sCompDesc", "");
				oCreateTaskModel.setProperty("/sIndicateItem", "");
				oCreateTaskModel.setProperty("/sItemNo", "");
				oCreateTaskModel.setProperty("/sSLNo", "");
				oCreateTaskModel.setProperty("/sCompCompDesc", "");
				oCreateTaskModel.setProperty("/sTypDesc", "");
				oCreateTaskModel.setProperty("/sTaskType", "");
				oCreateTaskModel.setProperty("/sTypDescValue", "");
				oCreateTaskModel.setProperty("/sTypDescValue", "");
				oCreateTaskModel.setProperty("/sTaskTypeText", "");
				oCreateTaskModel.setProperty("/sOpsDesc", "");
				oCreateTaskModel.setProperty("/sVisualInspection", "");
				oCreateTaskModel.setProperty("/sOtherDesc", "");
				oCreateTaskModel.setProperty("/sTechOrderRef", "IETM");
				//oCreateTaskModel.setProperty("/sSymbol", "0");
			} catch (e) {
				Log.error("Exception in CosCreateTask:_ResetTaskType function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onSegmentOtherSelected
		// Parameter: 
		// Description: This will get called, when symbol from Task type selected from Create Task fragment.
		//Table: 
		//------------------------------------------------------------------
		onSegmentOtherSelected: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey(),
					oCreateTaskModel = this.getModel("oCreateTaskModel");
				//	oCreateTaskModel.setProperty("/sSymbol", sSelectedKey);
			} catch (e) {
				Log.error("Exception in CosCreateTask:onSegmentOtherSelected function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onRemoveInstallTaskChange
		// Parameter: 
		// Description: This will get called, when Remove and/or Install Sub Task Selected from Create Task fragment.
		//Table: 
		//------------------------------------------------------------------
		onRemoveInstallTaskChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey(),
					oCreateTaskModel = this.getModel("oCreateTaskModel");
				this._ResetRemoveAndInstall();
				if (sSelectedKey === "TT2_10" || sSelectedKey === "TT2_12") {
					oCreateTaskModel.setProperty("/bTechOrderRef", true);
					oCreateTaskModel.setProperty("/bType", true);
					if (sSelectedKey === "TT2_10") {
						oCreateTaskModel.setProperty("/bEngFlag", true);
					} else {
						oCreateTaskModel.setProperty("/bEngFlag", false);
					}
					oCreateTaskModel.setProperty("/sType1", "Serial No. (S/N)");
					oCreateTaskModel.setProperty("/sType2", "Part No.");
					oCreateTaskModel.setProperty("/bCompDesc", true);
				} else if (sSelectedKey === "TT2_11") {
					oCreateTaskModel.setProperty("/bTechOrderRef", true);
					oCreateTaskModel.setProperty("/bAccess", true);
					oCreateTaskModel.setProperty("/bEngFlag", false);
				} else if (sSelectedKey === "TT2_13" || sSelectedKey === "TT2_14") {
					oCreateTaskModel.setProperty("/bTechOrderRef", true);
					oCreateTaskModel.setProperty("/bType", true);
					oCreateTaskModel.setProperty("/bEngFlag", false);
					oCreateTaskModel.setProperty("/bCompDesc", true);
					oCreateTaskModel.setProperty("/sType1", "Serial No. (S/N)");
					oCreateTaskModel.setProperty("/sType2", "Part No.");
					oCreateTaskModel.setProperty("/bOptionalLabel", true);
				}
				/*oCreateTaskModel.setProperty("/sTaskText", oEvent.getParameters("").value);*/
				oCreateTaskModel.setProperty("/sTaskText", oEvent.getSource().getSelectedItem().getText());
			} catch (e) {
				Log.error("Exception in CosCreateTask:onRemoveInstallTaskChange function");
				
			}
		},
		/* Function: onSelectionTaskTypeChange
		 * Parameter: oEvent
		 * Description: Private method: This will get called, when task type is selected from drop down
		 */

		onSelectionTaskTypeChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey(),
					oCreateTaskModel = this.getModel("oCreateTaskModel");
				oCreateTaskModel.setProperty("/sEngFlag", sSelectedKey);
				if (sSelectedKey !== "NE") {
					oCreateTaskModel.setProperty("/sType1Value", "");
				}
			} catch (e) {
				Log.error("Exception in CosCreateTask:onRemoveInstallTaskChange function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onTypeDescChange
		// Parameter: 
		// Description: This will get called, when type of decription selected from Create Task fragment.
		//Table: 
		//------------------------------------------------------------------
		onTypeDescChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey(),
					sSelectedText = oEvent.getSource().getSelectedItem().getText(),
					oCreateTaskModel = this.getModel("oCreateTaskModel");
				oCreateTaskModel.setProperty("/bOpenForAccess", false);
				oCreateTaskModel.setProperty("/bRemoveForAccess", false);
				oCreateTaskModel.setProperty("/bIndicateItem", false);
				oCreateTaskModel.setProperty("/bItemNo", false);
				oCreateTaskModel.setProperty("/bSLNo", false);
				oCreateTaskModel.setProperty("/bCompCompDesc", false);

				if (sSelectedKey === "TT3_10") {
					oCreateTaskModel.setProperty("/bOpenForAccess", true);
					oCreateTaskModel.setProperty("/bOpenForAccessText", sSelectedText);
					this._fnGetTaskTT310DropDown();
				} else if (sSelectedKey === "TT3_11") {
					oCreateTaskModel.setProperty("/bRemoveForAccess", true);
					oCreateTaskModel.setProperty("/bRemoveForAccessText", sSelectedText);
					this._fnGetTaskTT311DropDown();
				}
			} catch (e) {
				Log.error("Exception in CosCreateTask:onTypeDescChange function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onOpenForAccessChange
		// Parameter: 
		// Description: This will get called, when Open For Access dropdown selected from Create Task fragment.
		//Table: 
		//------------------------------------------------------------------
		onOpenForAccessChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey(),
					sSelectedText = oEvent.getSource().getSelectedItem().getText(),
					oCreateTaskModel = this.getModel("oCreateTaskModel");
				oCreateTaskModel.setProperty("/bIndicateItem", false);
				oCreateTaskModel.setProperty("/bItemNo", false);
				oCreateTaskModel.setProperty("/bSLNo", false);
				oCreateTaskModel.setProperty("/bCompCompDesc", false);
				oCreateTaskModel.setProperty("/sTypDescValue", sSelectedText);
				if (sSelectedKey === "TT4_10" || sSelectedKey === "TT4_11") {
					oCreateTaskModel.setProperty("/bItemNo", true);
				} else if (sSelectedKey === "TT4_14" || sSelectedKey === "TT1_15") {
					oCreateTaskModel.setProperty("/bItemNo", true);
					oCreateTaskModel.setProperty("/bIndicateItem", true);
				}
			} catch (e) {
				Log.error("Exception in CosCreateTask:onOpenForAccessChange function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onRemoveForAccessChange
		// Parameter: 
		// Description: This will get called, when Open For Access dropdown selected from Create Task fragment.
		//Table: 
		//------------------------------------------------------------------
		onRemoveForAccessChange: function(oEvent) {
			try {
				var sSelectedKey = oEvent.getSource().getSelectedKey(),
					sSelectedText = oEvent.getSource().getSelectedItem().getText(),
					oCreateTaskModel = this.getModel("oCreateTaskModel");
				oCreateTaskModel.setProperty("/bIndicateItem", false);
				oCreateTaskModel.setProperty("/bItemNo", false);
				oCreateTaskModel.setProperty("/bSLNo", false);
				oCreateTaskModel.setProperty("/bCompCompDesc", false);
				oCreateTaskModel.setProperty("/sTypDescValue", sSelectedText);
				if (sSelectedKey === "TT4_11" || sSelectedKey === "TT4_13" || sSelectedKey === "TT4_15") {
					oCreateTaskModel.setProperty("/bItemNo", true);
				} else if (sSelectedKey === "TT4_12") {
					oCreateTaskModel.setProperty("/bSLNo", true);
					oCreateTaskModel.setProperty("/bCompCompDesc", true);
				} else if (sSelectedKey === "TT4_14" || sSelectedKey === "TT4_16") {
					oCreateTaskModel.setProperty("/bItemNo", true);
					oCreateTaskModel.setProperty("/bIndicateItem", true);
				}
			} catch (e) {
				Log.error("Exception in CosCreateTask:onRemoveForAccessChange function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onAddTaskPress
		// Parameter: 
		// Description: This will get called, when create task button press in view.
		//Table: 
		//------------------------------------------------------------------
		onAddTaskPress: function(oEvent) {
			try {
				var that = this;
				var oCreateTaskModel = this.getModel("oCreateTaskModel");
				oCreateTaskModel.setProperty("/bCreateTaskBtn", true);
				oCreateTaskModel.setProperty("/bUpdateTaskBtn", false);
				oCreateTaskModel.setProperty("/bSrComFlag", "N");
				oCreateTaskModel.setProperty("/sEngFlag", "NA");
				oCreateTaskModel.setProperty("/bEngFlag", false);
				try {

					if (this._oDialog !== undefined && this._oDialog.isOpen()) {
						return;
					}
					this._oDialog = that.createoDialog(this, "ADDCreateTask", "CreateTask");
					this._oDialog.open();
					oCreateTaskModel.setProperty("/sTaskType", "");
					this._ResetTaskType();
				} catch (e) {
						Log.error("Exception in CosCreateTask:onAddTaskPress inner function");
				}
			} catch (e) {
				Log.error("Exception in CosCreateTask:onAddTaskPress function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onCancelCreateTaskPress
		// Parameter: 
		// Description: This will get called, when cancel task button press on fragment.
		//Table: 
		//------------------------------------------------------------------
		onCancelCreateTaskPress: function(oFlag) {
			try {
				if (oFlag === "UP") {
					FieldValidations.resetErrorStates(this);
					if (FieldValidations.validateFields(this)) {
						return;
					}
				}
				if (this._oDialog) {
					this._oDialog.close(this);
					this._oDialog.destroy();
					delete this._oDialog;
				}
			} catch (e) {
				Log.error("Exception in CosCreateTask:onCancelCreateTaskPress function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onCreateTaskPress
		// Parameter: 
		// Description: This will get called, when Create button press on fragment to create task template for selected task.
		//Table: 
		//------------------------------------------------------------------

		onCreateTaskPress: function() {
			try {
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				var that = this;
				var oCreateTaskModel = that.getModel("oCreateTaskModel"),
					oFlag = true,
					oModel = that.getView().getModel("ViewModel"),
					sTaskType = oCreateTaskModel.getProperty("/sTaskType"),
					sTaskType2 = oCreateTaskModel.getProperty("/sTask"),
					aTasks = oCreateTaskModel.getProperty("/aTasks"),
					oObj = {
						sTaskType: sTaskType,
						sTaskTypeText: "",
						bRemovalInstall: false,
						bOpsCheck: false,
						bVisualInspection: false,
						bOthers: false,
						sTask: "",
						sTaskText: "",
						sTechOrderRef: "",
						sOpnForAccKey: "",
						sRemoveForAccKey: "",
						sOpnForAccKeyText: "",
						sRemoveForAccKeyText: "",
						sTypDescKey: "",
						sTypDescValue: "",
						sTypDesc: "",
						sType1: "",
						sType1Value: "",
						sEngFlag: "NA",
						bEngFlag: false,
						sType2: "",
						sType2Value: "",
						sCompDesc: "",
						sIndicateItem: "",
						sItemNo: "",
						sSLNo: "",
						sCompCompDesc: "",
						bTechOrderRef: false,
						bType: false,
						bOptionalLabel: false,
						bCompDesc: false,
						bAccess: false,
						bOpenForAccess: false,
						bRemoveForAccess: false,
						bOpenForAccessText: "",
						bRemoveForAccessText: "",
						bSLNo: false,
						bItemNo: false,
						bIndicateItem: false,
						bCompCompDesc: false,
						sOpsDesc: "",
						sVisualInspection: "",
						sOtherDesc: "",
						sTechOrder: "",
						//sSymbol: "",
						JobId: oModel.getProperty("/JobId"),
						WorkCenter: oModel.getProperty("/WorkCenter"),
						TailId: oModel.getProperty("/TailId"),
						WorkKey: oModel.getProperty("/WorkKey"),
						sDate: oModel.getProperty("/sDate"),
						Time: oModel.getProperty("/Time"),
						sCheckfor: "",
						sIndicateArea: ""
					};
				if (sTaskType === "TT1_10" && sTaskType2 === "TT2_10") {
					if (oCreateTaskModel.getProperty("/sEngFlag") !== "NA" && oCreateTaskModel.getProperty("/sEngFlag") !== "") {
						oFlag = true;
					} else {
						MessageBox.error(
							"Please select request type 'Engine' or 'Non-Engine'", {
								icon: sap.m.MessageBox.Icon.Error,
								title: "Error",
								styleClass: "sapUiSizeCompact"
							});
						oFlag = false;
					}
				}

				if (sTaskType === "TT1_10" && oFlag) {

					oObj.bRemovalInstall = true;
					oObj.sTask = oCreateTaskModel.getProperty("/sTask");
					oObj.sTaskText = oCreateTaskModel.getProperty("/sTaskText");
					oObj.sTaskTypeText = oCreateTaskModel.getProperty("/sTaskTypeText");
					oObj.bTechOrderRef = oCreateTaskModel.getProperty("/bTechOrderRef");
					oObj.sTechOrderRef = oCreateTaskModel.getProperty("/sTechOrderRef");
					oObj.bType = oCreateTaskModel.getProperty("/bType");
					oObj.sType1 = oCreateTaskModel.getProperty("/sType1");
					oObj.sType1Value = oCreateTaskModel.getProperty("/sType1Value");
					oObj.sEngFlag = oCreateTaskModel.getProperty("/sEngFlag");
					oObj.bEngFlag = oCreateTaskModel.getProperty("/bEngFlag");
					oObj.sType2 = oCreateTaskModel.getProperty("/sType2");
					oObj.sType2Value = oCreateTaskModel.getProperty("/sType2Value");
					oObj.bOptionalLabel = oCreateTaskModel.getProperty("/bOptionalLabel");
					oObj.bCompDesc = oCreateTaskModel.getProperty("/bCompDesc");
					oObj.sCompDesc = oCreateTaskModel.getProperty("/sCompDesc");
					oObj.bAccess = oCreateTaskModel.getProperty("/bAccess");
					oObj.sTypDesc = oCreateTaskModel.getProperty("/sTypDescKey");
					oObj.sTypDescValue = oCreateTaskModel.getProperty("/sTypDescValue");
					if (oCreateTaskModel.getProperty("/bOpenForAccess")) {
						oObj.sTypDescKey = oCreateTaskModel.getProperty("/sOpnForAccKey");
						oObj.bOpenForAccess = oCreateTaskModel.getProperty("/bOpenForAccess");
					} else if (oCreateTaskModel.getProperty("/bRemoveForAccess")) {
						oObj.sTypDescKey = oCreateTaskModel.getProperty("/sRemoveForAccKey");
						oObj.bRemoveForAccess = oCreateTaskModel.getProperty("/bRemoveForAccess");
					}
					oObj.bIndicateItem = oCreateTaskModel.getProperty("/bIndicateItem");
					oObj.sIndicateItem = oCreateTaskModel.getProperty("/sIndicateItem");
					oObj.bItemNo = oCreateTaskModel.getProperty("/bItemNo");
					oObj.sItemNo = oCreateTaskModel.getProperty("/sItemNo");
					oObj.bSLNo = oCreateTaskModel.getProperty("/bSLNo");
					oObj.sSLNo = oCreateTaskModel.getProperty("/sSLNo");
					oObj.bCompCompDesc = oCreateTaskModel.getProperty("/bCompCompDesc");
					oObj.sCompCompDesc = oCreateTaskModel.getProperty("/sCompCompDesc");
					//oObj.sSymbol = "1";

				} else if (sTaskType === "TT1_11") {
					oObj.bOpsCheck = true;
					oObj.sTaskText = oCreateTaskModel.getProperty("/sTaskText");
					oObj.sTaskTypeText = oCreateTaskModel.getProperty("/sTaskTypeText");
					oObj.sTechOrderRef = oCreateTaskModel.getProperty("/sTechOrderRef");
					oObj.sOpsDesc = oCreateTaskModel.getProperty("/sOpsDesc");
					//oObj.sSymbol = "3";
				} else if (sTaskType === "TT1_12") {
					oObj.bVisualInspection = true;
					oObj.sTaskText = oCreateTaskModel.getProperty("/sTaskText");
					oObj.sTaskTypeText = oCreateTaskModel.getProperty("/sTaskTypeText");
					oObj.sOtherDesc = oCreateTaskModel.getProperty("/sOtherDesc");
					oObj.bVisualInspection = oCreateTaskModel.getProperty("/bVisualInspection");
					oObj.sVisualInspection = oCreateTaskModel.getProperty("/sVisualInspection");
					//oObj.sSymbol = "3";
				} else if (sTaskType === "TT1_13") {
					oObj.sTaskText = oCreateTaskModel.getProperty("/sTaskText");
					oObj.sTaskTypeText = oCreateTaskModel.getProperty("/sTaskTypeText");
					//oObj.sSymbol = "3";
				} else if (sTaskType === "TT1_14" || sTaskType === "TT1_15" || sTaskType === "TT1_16" || sTaskType === "TT1_17" || sTaskType ===
					"TT1_18" || sTaskType === "TT1_19") {
					oObj.bOthers = true;
					oObj.sTaskText = oCreateTaskModel.getProperty("/sTaskText");
					oObj.sTaskTypeText = oCreateTaskModel.getProperty("/sTaskTypeText");
					oObj.sOtherDesc = oCreateTaskModel.getProperty("/sOtherDesc");
					oObj.sTechOrderRef = oCreateTaskModel.getProperty("/sTechOrderRef");
					//oObj.sSymbol = oCreateTaskModel.getProperty("/sSymbol");
				}
				if (oFlag) {
					aTasks.push(oObj);
					oCreateTaskModel.setProperty("/aTasks", aTasks);
					that._oDialog.close();
				}

			} catch (e) {
				Log.error("Exception in CosCreateTask:onCreateTaskPress function");
				
			}
		},
		//------------------------------------------------------------------
		// Function: onEditTaskPress
		// Parameter: 
		// Description: This will get called, when edit button press on fragment for created task to edit details.
		//Table: 
		//------------------------------------------------------------------
		onEditTaskPress: function(oEvent) {
			try {
				var that = this;
				var oCreateTaskModel = that.getModel("oCreateTaskModel"),
					oSelectedObj = oEvent.getSource().getBindingContext("oCreateTaskModel").getObject(),
					sEditTaskPath = oEvent.getSource().getBindingContext("oCreateTaskModel").sPath;
				oCreateTaskModel.setProperty("/sEditTaskPath", sEditTaskPath);
				oCreateTaskModel.setProperty("/bAccess", oSelectedObj.bAccess);
				oCreateTaskModel.setProperty("/bCompCompDesc", oSelectedObj.bCompCompDesc);
				oCreateTaskModel.setProperty("/bCompDesc", oSelectedObj.bCompDesc);
				oCreateTaskModel.setProperty("/bIndicateItem", oSelectedObj.bIndicateItem);
				oCreateTaskModel.setProperty("/bItemNo", oSelectedObj.bItemNo);
				oCreateTaskModel.setProperty("/bOpenForAccess", oSelectedObj.bOpenForAccess);
				oCreateTaskModel.setProperty("/bOpsCheck", oSelectedObj.bOpsCheck);
				oCreateTaskModel.setProperty("/bOptionalLabel", oSelectedObj.bOptionalLabel);
				oCreateTaskModel.setProperty("/bOthers", oSelectedObj.bOthers);
				oCreateTaskModel.setProperty("/bRemoveOrInstall", oSelectedObj.bRemovalInstall);
				oCreateTaskModel.setProperty("/bRemoveForAccess", oSelectedObj.bRemoveForAccess);
				oCreateTaskModel.setProperty("/bSLNo", oSelectedObj.bSLNo);
				oCreateTaskModel.setProperty("/bTechOrderRef", oSelectedObj.bTechOrderRef);
				oCreateTaskModel.setProperty("/bType", oSelectedObj.bType);
				oCreateTaskModel.setProperty("/bVisualInspection", oSelectedObj.bVisualInspection);
				oCreateTaskModel.setProperty("/sCompCompDesc", oSelectedObj.sCompCompDesc);
				oCreateTaskModel.setProperty("/sCompDesc", oSelectedObj.sCompDesc);
				oCreateTaskModel.setProperty("/sIndicateItem", oSelectedObj.sIndicateItem);
				oCreateTaskModel.setProperty("/sTask", oSelectedObj.sTask);
				oCreateTaskModel.setProperty("/sItemNo", oSelectedObj.sItemNo);
				oCreateTaskModel.setProperty("/sOpsDesc", oSelectedObj.sOpsDesc);
				oCreateTaskModel.setProperty("/sOtherDesc", oSelectedObj.sOtherDesc);
				oCreateTaskModel.setProperty("/sRemoveForAccKey", oSelectedObj.sRemoveForAccKey);
				oCreateTaskModel.setProperty("/sSLNo", oSelectedObj.sSLNo);
				//oCreateTaskModel.setProperty("/sSymbol", oSelectedObj.sSymbol);
				//oCreateTaskModel.setProperty("/sTaskType", oSelectedObj.sTask);
				oCreateTaskModel.setProperty("/sTaskType", oSelectedObj.sTaskType);
				/*	oCreateTaskModel.setProperty("/sTechOrder", oSelectedObj.sTechOrder);*/
				oCreateTaskModel.setProperty("/sTechOrderRef", oSelectedObj.sTechOrderRef);
				oCreateTaskModel.setProperty("/sType1", oSelectedObj.sType1);
				oCreateTaskModel.setProperty("/sType1Value", oSelectedObj.sType1Value);
				oCreateTaskModel.setProperty("/sEngFlag", oSelectedObj.sEngFlag);
				oCreateTaskModel.setProperty("/sType2", oSelectedObj.sType2);
				oCreateTaskModel.setProperty("/sType2Value", oSelectedObj.sType2Value);
				oCreateTaskModel.setProperty("/sVisualInspection", oSelectedObj.sVisualInspection);
				oCreateTaskModel.setProperty("/sTypDescKey", oSelectedObj.sTypDesc);
				if (oSelectedObj.sTypDesc === "TT3_10") {
					oCreateTaskModel.setProperty("/sOpnForAccKey", oSelectedObj.sTypDescKey);
					oCreateTaskModel.setProperty("/bOpenForAccess", true);
				} else if (oSelectedObj.sTypDesc === "TT3_11") {
					oCreateTaskModel.setProperty("/sRemoveForAccKey", oSelectedObj.sTypDescKey);
					oCreateTaskModel.setProperty("/bRemoveForAccess", true);
				}

				oCreateTaskModel.setProperty("/bCreateTaskBtn", false);
				oCreateTaskModel.setProperty("/bUpdateTaskBtn", true);

				try {
					var that = this;
					if (that._oDialog !== undefined && that._oDialog.isOpen()) {
						return;
					}
					that._oDialog = that.createoDialog(that, "ADDCreateTask", "CreateTask");
					that._oDialog.open();
				} catch (e) {
					Log.error("Exception in CosCreateTask:onEditTaskPress inner function");
				}
			} catch (e) {
				Log.error("Exception in CosCreateTask:onEditTaskPress function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: onUpdateTaskPress
		// Parameter: 
		// Description: This will get called, when Update button press on fragment for edited task to update details.
		//Table: 
		//------------------------------------------------------------------
		onUpdateTaskPress: function(oEvent) {
			try {
				var that = this;
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				var oCreateTaskModel = that.getModel("oCreateTaskModel"),
					sEditTaskPath = oCreateTaskModel.getProperty("/sEditTaskPath"),
					sTaskType = oCreateTaskModel.getProperty("/sTaskType");
				oCreateTaskModel.setProperty(sEditTaskPath + "/bRemovalInstall", false);
				oCreateTaskModel.setProperty(sEditTaskPath + "/bOpsCheck", false);
				oCreateTaskModel.setProperty(sEditTaskPath + "/bVisualInspection", false);
				oCreateTaskModel.setProperty(sEditTaskPath + "/bTT1_14", false);
				if (sTaskType === "TT1_10") {
					oCreateTaskModel.setProperty(sEditTaskPath + "/bRemovalInstall", true);
					oCreateTaskModel.setProperty(sEditTaskPath + "/sTaskType", "TT1_10");
					oCreateTaskModel.setProperty(sEditTaskPath + "/sTypDescValue", oCreateTaskModel.getProperty("/sTypDescValue"));
				} else if (sTaskType === "TT1_11") {
					oCreateTaskModel.setProperty(sEditTaskPath + "/bOpsCheck", true);
					oCreateTaskModel.setProperty(sEditTaskPath + "/sOpsDesc", oCreateTaskModel.getProperty("/sOpsDesc"));
					oCreateTaskModel.setProperty(sEditTaskPath + "/sTaskType", "TT1_11");
				} else if (sTaskType === "TT1_12") {
					oCreateTaskModel.setProperty(sEditTaskPath + "/bVisualInspection", true);
					oCreateTaskModel.setProperty(sEditTaskPath + "/sOtherDesc", oCreateTaskModel.getProperty("/sOtherDesc"));
					oCreateTaskModel.setProperty(sEditTaskPath + "/sTaskType", "TT1_12");
				} else if (sTaskType === "TT1_14" || sTaskType === "TT1_15" || sTaskType === "TT1_16" || sTaskType === "TT1_17" || sTaskType ===
					"TT1_18" || sTaskType === "TT1_19") {
					oCreateTaskModel.setProperty(sEditTaskPath + "/bOthers", true);
					oCreateTaskModel.setProperty(sEditTaskPath + "/sOtherDesc", oCreateTaskModel.getProperty("/sOtherDesc"));
					oCreateTaskModel.setProperty(sEditTaskPath + "/sTechOrderRef", oCreateTaskModel.getProperty("/sTechOrderRef"));
					//oCreateTaskModel.setProperty(sEditTaskPath + "/sSymbol", oCreateTaskModel.getProperty("/sSymbol"));
					switch (sTaskType) {
						case "TT1_14":
							oCreateTaskModel.setProperty(sEditTaskPath + "/sTaskType", sTaskType);
							break;
						case "TT1_15":
							oCreateTaskModel.setProperty(sEditTaskPath + "/sTaskType", sTaskType);
							break;
						case "TT1_16":
							oCreateTaskModel.setProperty(sEditTaskPath + "/sTaskType", sTaskType);
							break;
						case "TT1_17":
							oCreateTaskModel.setProperty(sEditTaskPath + "/sTaskType", sTaskType);
							break;
						case "TT1_18":
							oCreateTaskModel.setProperty(sEditTaskPath + "/sTaskType", sTaskType);
							break;
						case "TT1_19":
							oCreateTaskModel.setProperty(sEditTaskPath + "/sTaskType", sTaskType);
							break;
					}
				}
				oCreateTaskModel.setProperty(sEditTaskPath + "/sTask", oCreateTaskModel.getProperty("/sTask"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sTaskText", oCreateTaskModel.getProperty("/sTaskText"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/bTechOrderRef", oCreateTaskModel.getProperty("/bTechOrderRef"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sTechOrderRef", oCreateTaskModel.getProperty("/sTechOrderRef"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/bType", oCreateTaskModel.getProperty("/bType"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sType1", oCreateTaskModel.getProperty("/sType1"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sType1Value", oCreateTaskModel.getProperty("/sType1Value"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sEngFlag", oCreateTaskModel.getProperty("/sEngFlag"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/bEngFlag", oCreateTaskModel.getProperty("/bEngFlag"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sType2", oCreateTaskModel.getProperty("/sType2"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sType2Value", oCreateTaskModel.getProperty("/sType2Value"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/bOptionalLabel", oCreateTaskModel.getProperty("/bOptionalLabel"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/bCompDesc", oCreateTaskModel.getProperty("/bCompDesc"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sCompDesc", oCreateTaskModel.getProperty("/sCompDesc"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/bAccess", oCreateTaskModel.getProperty("/bAccess"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sTypDesc", oCreateTaskModel.getProperty("/sTypDescKey"));
				if (oCreateTaskModel.getProperty("/bOpenForAccess")) {
					oCreateTaskModel.setProperty(sEditTaskPath + "/sTypDescKey", oCreateTaskModel.getProperty("/sOpnForAccKey"));
				} else if (oCreateTaskModel.getProperty("/bRemoveForAccess")) {
					oCreateTaskModel.setProperty(sEditTaskPath + "/sTypDescKey", oCreateTaskModel.getProperty("/sRemoveForAccKey"));
				}
				oCreateTaskModel.setProperty(sEditTaskPath + "/bIndicateItem", oCreateTaskModel.getProperty("/bIndicateItem"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sIndicateItem", oCreateTaskModel.getProperty("/sIndicateItem"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/bItemNo", oCreateTaskModel.getProperty("/bItemNo"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sItemNo", oCreateTaskModel.getProperty("/sItemNo"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/bSLNo", oCreateTaskModel.getProperty("/bSLNo"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sSLNo", oCreateTaskModel.getProperty("/sSLNo"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/bCompCompDesc", oCreateTaskModel.getProperty("/bCompCompDesc"));
				oCreateTaskModel.setProperty(sEditTaskPath + "/sCompCompDesc", oCreateTaskModel.getProperty("/sCompCompDesc"));
				this._oDialog.close();
			} catch (e) {
				Log.error("Exception in CosCreateTask:onUpdateTaskPress function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: onDeleteTaskPress
		// Parameter: 
		// Description: This will get called, when delete button press on view for created task.
		//Table: 
		//------------------------------------------------------------------
		onDeleteTaskPress: function(oEvent) {
			try {
				var that = this;
				var oCreateTaskModel = that.getModel("oCreateTaskModel"),
					aTasks = oCreateTaskModel.getProperty("/aTasks"),
					iDeleteIndex = oEvent.getSource().getBindingContext("oCreateTaskModel").sPath.split("/")[2];
				aTasks.splice(iDeleteIndex, 1);
				oCreateTaskModel.setProperty("/aTasks", aTasks);
			} catch (e) {
				Log.error("Exception in CosCreateTask:onDeleteTaskPress function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		/* Function: _onObjectMatched
		 * Parameter:
		 * Description: This will called to handle route matched.
		 */
		_onObjectMatched: function(oEvent) {
			try {
				var that = this,
					oModel,
					sWrkCenter = oEvent.getParameters().arguments.WorkCenter,
					sJobId = oEvent.getParameters().arguments.JobId,
					sAirId = oEvent.getParameters().arguments.AirId,
					sTailId = oEvent.getParameters().arguments.TailId,
					sWorkKey = oEvent.getParameters().arguments.WorkKey,
					sFlag = oEvent.getParameters().arguments.Flag,
					ssrvid = oEvent.getParameters().arguments.srvid,
					oViewModel = dataUtil.createNewJsonModel(),
					oDate = new Date(),
					sJobId = sJobId === undefined ? "" : sJobId;
				sAirId = sAirId === undefined ? this.getAircraftId() : sAirId;
				sTailId = sTailId === undefined ? this.getTailId() : sTailId;
				sWrkCenter = sWrkCenter === undefined ? "" : sWrkCenter;
				sWorkKey = sWorkKey === undefined ? "" : sWorkKey;
				oViewModel.setData({
					JobId: sJobId,
					WorkCenter: sWrkCenter,
					TailId: sTailId,
					AirId: sAirId,
					WorkKey: sWorkKey,
					sFlag: sFlag,
					ssrvid: ssrvid,
					sDate: oDate,
					Time: oDate.getHours() + ":" + oDate.getMinutes(),
					flag: sFlag
				});
				that.getView().setModel(oViewModel, "ViewModel");
				oModel = dataUtil.createNewJsonModel();
				oModel.setSizeLimit("400");
				oModel.setData({
					bRemoveOrInstall: false,
					bOpsCheck: false,
					bVisualInspection: false,
					bToolsCheck: false,
					bOthers: false,
					//Remove and/or Install Propertites
					bTechOrderRef: false,
					bType: false,
					bOptionalLabel: false,
					bCompDesc: false,
					bAccess: false,
					bOpenForAccess: false,
					bRemoveForAccess: false,
					bSLNo: false,
					bItemNo: false,
					bIndicateItem: false,
					bCompCompDesc: false,
					sTask: "",
					sTaskText: "",
					//Removal and/or Install
					sOpnForAccKey: "",
					sRemoveForAccKey: "",
					sOpnForAccKeyText: "",
					sRemoveForAccKeyText: "",
					sTypDescKey: "",
					sTypDescValue: "",
					sTypDesc: "",
					sTaskType: "",
					sTaskTypeText: "",
					sTechOrderRef: "IETM",
					sType1: "1",
					sType1Value: "",
					sEngFlag: "NA",
					bEngFlag: false,
					sType2: "1",
					sType2Value: "",
					sCompDesc: "",
					sIndicateItem: "",
					sItemNo: "",
					sSLNo: "",
					sCompCompDesc: "",
					//TT1_11 
					sOpsDesc: "",
					sVisualInspection: "",
					sOtherDesc: "",
					sTechOrder: "",
					//sSymbol: "0",
					bCreateTaskBtn: true,
					bUpdateTaskBtn: false,
					aTasks: [],
					JobId: "",
					WorkCenter: "",
					TailId: "",
					WorkKey: "",
					sDate: "",
					Time: "",
					sCheckfor: "",
					sIndicateArea: "",
					bSrComFlag: "N"
				});
				that.getView().setModel(oModel, "oCreateTaskModel");
				this._fnGetDateValidation(sJobId);
			} catch (e) {
				Log.error("Exception in CosCreateTask:_onObjectMatched function");
				this.handleException(e);
			}
		},

		//------------------------------------------------------------------
		// Function: _ResetRemoveAndInstall
		// Parameter: 
		// Description: This will get called, when reset remove and install JSON model data model data.
		//Table: 
		//------------------------------------------------------------------
		_ResetRemoveAndInstall: function() {
			try {
				var oCreateTaskModel = this.getModel("oCreateTaskModel");
				oCreateTaskModel.setProperty("/bTechOrderRef", false);
				oCreateTaskModel.setProperty("/bType", false);
				oCreateTaskModel.setProperty("/sEngFlag", "NA");
				oCreateTaskModel.setProperty("/bEngFlag", false);
				oCreateTaskModel.setProperty("/bOptionalLabel", false);
				oCreateTaskModel.setProperty("/bCompDesc", false);
				oCreateTaskModel.setProperty("/bAccess", false);
				oCreateTaskModel.setProperty("/bOpenForAccess", false);
				oCreateTaskModel.setProperty("/bRemoveForAccess", false);
				oCreateTaskModel.setProperty("/bSLNo", false);
				oCreateTaskModel.setProperty("/bItemNo", false);
				oCreateTaskModel.setProperty("/bIndicateItem", false);
				oCreateTaskModel.setProperty("/bCompCompDesc", false);
				oCreateTaskModel.setProperty("/sOpnForAccKey", "");
				oCreateTaskModel.setProperty("/sRemoveForAccKey", "");
				oCreateTaskModel.setProperty("/sTypDescKey", "");
				oCreateTaskModel.setProperty("/sType1", "");
				oCreateTaskModel.setProperty("/sType2", "");
			} catch (e) {
				Log.error("Exception in CosCreateTask:_ResetRemoveAndInstall function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: _fnCreateTask
		// Parameter: oPayload
		// Description: This will get called, when to create new task in backend.
		//Table: TASK
		//------------------------------------------------------------------
		_fnCreateTask: function(oPayload) {
			try {
				var that = this;
				var oPrmTask = {},
					oCreateTaskModel = this.getModel("oCreateTaskModel"),
					oModel = that.getView().getModel("ViewModel");
				oPrmTask.error = function() {

				};

				oPrmTask.success = function(oData) {
					this._fnSubmitTireSignOff(oPayload);
					sap.m.MessageToast.show("Task Created Successfully");
					if (oModel.getProperty("/sFlag") === "FS" || oModel.getProperty("/sFlag") === "TS") {
						/*that.getRouter().navTo("CTCloseTask", {
							"srvtid": oModel.getProperty("/ssrvid")
						}, true);*/
						//that.onNavBack();
						window.history.go(-1);
					} else {
						that.getRouter().navTo("CosDefectsSummary", {
							"JobId": oModel.getProperty("/JobId"),
							"Flag": "Y",
							"WcKey": oModel.getProperty("/WorkKey"),
							"goTo": "OS"
						}, true);
					}
				}.bind(this);
				oPrmTask.activity = 1;
				ajaxutil.fnCreate(this.getResourceBundle().getText("TASKSVC"), oPrmTask, oPayload, "ZRM_COS_TK", this);
			} catch (e) {
				Log.error("Exception in CosCreateTask:_fnCreateTask function");
				this.handleException(e);
			}
		},
		/* Function: _fnSubmitTireSignOff
		 * Parameter: oData
		 * Description: Function to submit landing tire records
		 */
		_fnSubmitTireSignOff: function(oData) {
			try {
				var oPayload = [],
					oPrmTask = {};
				for (var i in oData) {
					if (oData[i].tt1id === "TT1_10" && (oData[i].tt2id === "TT2_10" || oData[i].tt2id === "TT2_15") && oData[i].engflag === "NE" &&
						oData[i].partno && oData[i].partno.trim() !== "") {
						var tempObj = JSON.parse(JSON.stringify(oData[i]));
						var obj = {};
						obj.TAILID = tempObj.tailid;
						obj.PARTNO = tempObj.partno;
						obj.LNDPIN = "";
						obj.TIREID = "";
						obj.ITMNO = "";
						obj.LATIS = "";
						obj.LATRE = "";
						obj.SERNR = tempObj.sernr;
						obj.LTIREID = "";
						obj.TIREDESC = "";
						obj.REFID = "";
						obj.IRFLAG = "";
						obj.INSON = "";
						obj.RMVFR = "";
						obj.TOTLND = "";
						obj.TASKID = "";
						oPayload.push(JSON.parse(JSON.stringify(obj)));
					}
				}
				if (oPayload.length > 0) {
					oPrmTask.error = function() {};
					oPrmTask.success = function(oData) {}.bind(this);
					ajaxutil.fnUpdate(this.getResourceBundle().getText("LANDINGTYRESVC"), oPrmTask, oPayload);
				}

			} catch (e) {
				Log.error("Exception in _fnSubmitTireSignOff function");
			}

		}
	});
});