sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/formatter",
	"sap/m/MessageBox",
	"../util/ajaxutil",
	"../model/FieldValidations",
	"../model/AvMetInitialRecord",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function(BaseController, dataUtil, Fragment, formatter, MessageBox, ajaxutil, FieldValidations, AvMetInitialRecord, JSONModel, Log) {
	"use strict";

	/* ***************************************************************************
	 *     Developer : Rahul Thorat
	 *   Control name: CosApplyTemplate        
	 *   Purpose : Create apply template functionality
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *   2. Backend Calls
	 *        2.1 getSerialNoPress
	 *        2.2 _fnWorkCenterGet
	 *        2.3 fnLoadTask
	 *   3. Private calls
	 *        3.1 _onObjectMatched
	 *        3.2 onTemplateChange
	 *        3.3 handleChange
	 *        3.4 onTemplateApply
	 *        3.5 onApplySelection
	 *        3.6 onSerialNumPress
	 *        3.7 onSerialNumClose
	 *        3.8 onTypePartChange
	 *        3.9 onTypeSRChange
	 *        3.10 onWorkCenterChange
	 *        3.11 onWorkCenterTempChange
	 *        3.12 onSerialNumUpdatePress
	 *        3.13 _onObjectMatched
	 *   Note :
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.CosApplyTemplate", {
		formatter: formatter,
		avmentUtil: AvMetInitialRecord,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("CosApplyTemplate").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		//------------------------------------------------------------------
		// Function: getSerialNoPress
		// Parameter: oEvent
		// Description: This will get called, to handle change to get serial number dat for selected partno.
		//------------------------------------------------------------------
		getSerialNoPress: function() {
			try {
				var oPrmDD = {},
					oModelSr,
					oModel = this._oAddSR.getModel("SerialAddSet"),
					that = this,
					oPayload;
				oPrmDD.filter = "PARTNO eq " + oModel.getProperty("/PARTNO") + " and ESTAT eq I and INSON eq " + this.getTailId();
				oPrmDD.error = function() {};

				oPrmDD.success = function(oData) {
					if (oData && oData.results && oData.results.length !== 0) {
						if (!this._oAddSR.getModel("SerialNumModel")) {
							this._oAddSR.setModel(new JSONModel({}), "SerialNumModel");
						}
						oModelSr = this._oAddSR.getModel("SerialNumModel");
						oModelSr.setData(oData.results);
						oModelSr.updateBindings(true);
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
				Log.error("Exception in CosApplyTemplate:getSerialNoPress function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: _fnWorkCenterGet
		// Parameter: oEvent
		// Description: General Method: This will get called, when to get workcenter data from backend.
		// Table: WRCTR
		//------------------------------------------------------------------
		_fnWorkCenterGet: function(sAirId) {
			try {
				var that = this,
					oPrmWorkCen = {};
				oPrmWorkCen.filter = "REFID eq " + this.getAircraftId();
				oPrmWorkCen.error = function() {};
				oPrmWorkCen.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.setModel(oModel, "WorkCenterSet");
				}.bind(this);
				ajaxutil.fnRead("/GetWorkCenterSvc", oPrmWorkCen);
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:_fnWorkCenterGet function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: fnLoadTask
		// Parameter: oEvent
		// Description: This will get called, to handle to load task for selected template.
		//------------------------------------------------------------------
		fnLoadTask: function(oFlag, oSelectedKey) {
			try {
				var oParameter = {},
					oModel = this.getModel("applTmplModel");
				if (oFlag === "WR") {
					/*	oParameter.filter = "WRCTR eq " + oSelectedKey + " and TAILID EQ " + this.getTailId();*/
					if (oSelectedKey !== undefined) {
						oParameter.filter = "WRCTR eq " + oSelectedKey + " and TAILID EQ " + this.getTailId();
					} else {
						sap.m.MessageBox.information("Please select workcenter to proceed.");
						return;
					}
				} else {
					/*oParameter.filter = "tmpid eq '" + this.getModel("applTmplModel").getProperty("/header/selTmpl") + "'";*/
					var oTempId = this.getModel("applTmplModel").getProperty("/header/selTmpl");
					if (oTempId !== -1 && oTempId !== "") {
						var jobId = this.getModel("applTmplModel").getProperty("/header/selJobId");
						oParameter.filter = "tmpid eq '" + this.getModel("applTmplModel").getProperty("/header/selTmpl") + "' and JOBID eq " + jobId;
					} else {
						sap.m.MessageBox.information("Please select template to proceed.");
						return;
					}
				}
				this.handleBusyDialogOpen();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData.results.length !== 0) {
						if (oFlag === "WR") {
							oModel.setProperty("/header/bWorkCenter", true);
							oModel.setProperty("/tmpls", oData.results);
						} else {
							oModel.setProperty("/tasks", oData.results);
							oModel.setProperty("/tasksCopy", JSON.parse(JSON.stringify(oData.results)));
							oModel.setProperty("/ApplyTempTable", true);
							oModel.setProperty("/SelectTaskTable", true);
							oModel.setProperty("/MasterTableMode", oData.results[0].dflag);
						}
						this.getModel("applTmplModel").refresh();
					} else {
						sap.m.MessageBox.information("No Template data present for workcenter : '" + oModel.getProperty("/WorkText") + "'");
						this.handleBusyDialogClose();
						return;
					}
					this.handleBusyDialogClose();
					// this.fnLoadTails();
				}.bind(this);
				ajaxutil.fnRead("/GetrTaskSvc", oParameter);
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:fnLoadTask function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		//------------------------------------------------------------------
		// Function: onTemplateChange
		// Parameter: oEvent
		// Description: This will get called, to handle template change.
		//------------------------------------------------------------------
		onTemplateChange: function(oEvent) {
			try {
				var oModel = this.getView().getModel("applTmplModel"),
					oSelectedItem;
				oSelectedItem = this.getView().byId("cbTempId").getSelectedItem();
				if (oSelectedItem === undefined || oSelectedItem === null) {
					oModel.setProperty("/SelectTaskTable", false);
					oModel.setProperty("/ApplyTempTable", false);
				} else {
					FieldValidations.resetErrorStates(this);
				}
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:onTemplateChange function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: handleChange
		// Parameter: oEvent
		// Description: This will get called, to handle date change for validation.
		//------------------------------------------------------------------
		handleChange: function() {
			try {
				var prevDt = this.getModel("applTmplModel").getProperty("/jobDate");
				var prevTime = this.getModel("applTmplModel").getProperty("/jobTime");
				return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorCreateTaskPast", "errorCreateTaskFuture", prevDt, prevTime);
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:handleChange function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: onTemplateApply
		// Parameter: oEvent
		// Description: This will get called, to handle change in template.
		//------------------------------------------------------------------
		onTemplateApply: function(oEvent) {
			try {
				this.fnLoadTask("TM");
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:onTemplateApply function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: onApplySelection
		// Parameter: oEvent
		// Description: This will get called, to handle change to create the template records in backend.
		//------------------------------------------------------------------
		onApplySelection: function(oEvent) {
			try {
				if (!this.handleChange()) {
					return;
				}
				var that = this,
					oPayloads = [],
					srvtid = this.getModel("applTmplModel").getProperty("/srvtid");
				var sMode = this.getModel("applTmplModel").getProperty("/MasterTableMode");
				var iLen = this.getView().byId("tbTask").getSelectedItems().length;
				if (sMode !== "X" && iLen === 0) {
					sap.m.MessageBox.error("Please select task(s) to proceed");
					return;
				}
				var oMasterTable = this.getView().byId("tbSummary");
				var oItems = sMode === "X" ? oMasterTable.getSelectedItems() : oMasterTable.getItems();
				if (sMode === "X" && iLen === 0 && oItems.length === 0) {
					sap.m.MessageBox.error("Please select task(s) to proceed");
					return;
				}
				for (var i in oItems) {
					var oItem = oItems[i].getBindingContext("applTmplModel").getObject();
					if ((oItem.TT1ID === "TT1_10" && (oItem.TT2ID === "TT2_10" || oItem.TT2ID === "TT2_12" || oItem.TT2ID === "TT2_13" || oItem.TT2ID ===
							"TT2_14" || oItem.TT2ID === "TT2_15")) && oItem.SERNR === "") {
						sap.m.MessageBox.error("Please add Serial No for Main Task");
						return;
					}
					var oTask = this.avmentUtil.createInitialBlankRecord("NewTask")[0];
					/*oTask.taskid = sjobid.concat("TASK_", dDate.getFullYear(), dDate.getMonth(), dDate.getDate(), dDate.getHours(), dDate.getMinutes(),
						dDate.getSeconds(), i);*/
					var sDateMaI;
					try {
						sDateMaI = formatter.defaultOdataDateFormat(this.getModel("applTmplModel").getProperty("/header/dDate"));
					} catch (e) {
						sDateMaI = this.getModel("applTmplModel").getProperty("/header/dDate");
					}
					oTask.taskid = null;
					oTask.jobid = this.getModel("applTmplModel").getProperty("/header/selJobId");
					oTask.wrctr = this.getModel("applTmplModel").getProperty("/header/selWC");
					oTask.tailid = this.getModel("applTmplModel").getProperty("/header/selTailId");
					oTask.credtm = sDateMaI;
					oTask.creuzt = this.getModel("applTmplModel").getProperty("/header/dTime");
					oTask.tmpid = oItem.TMPID;
					oTask.rtaskid = oItem.RTASKID;
					oTask.fragid = oItem.FRAGID;
					oTask.tdesc = oItem.TDESC;
					oTask.symbol = oItem.SYMBOL;
					oTask.tt1id = oItem.TT1ID;
					oTask.tt2id = oItem.TT2ID;
					oTask.engflag = oItem.ENGFLAG ? oItem.ENGFLAG : "NA";
					oTask.rtty = oItem.RTTY;
					if (oItem.SERNR !== "") {
						oTask.sernr = oItem.SERNR;
					}
					oTask.isser = oItem.ISSER;
					if (oItem.PARTNO !== "") {
						oTask.tt1id = "TT1_10";
						oTask.tt2id = "TT2_10";
						oTask.partno = oItem.PARTNO;

					}
					oTask.ismat = oItem.ISMAT;
					// oTask.itemno = "";
					// oTask.sernr = oItem.ddfdf;
					oTask.ftdesc = oItem.FTDESC;
					if (this.getModel("applTmplModel").getProperty("/Flag") === "FS") {
						oTask.jobid = "";
						oTask.wrctr = "";
						oTask.ttid = "2";
						//AMIT CHANGE FOR FS ONLY
						oTask.srvtid = srvtid;
						oTask.stepid = "S_CT";
					}
					// oTask.ftitemno = oItem.ddfdf;
					// oTask.ftsernr = oItem.ddfdf;
					oPayloads.push(oTask);
				}
				var ftTasks = this.getView().byId("tbTask").getSelectedItems();
				for (var i in ftTasks) {
					var oItem = ftTasks[i].getBindingContext("applTmplModel").getObject();
					if ((oItem.TT1ID === "TT1_10" && (oItem.TT2ID === "TT2_10" || oItem.TT2ID === "TT2_12" || oItem.TT2ID === "TT2_13" || oItem.TT2ID ===
							"TT2_14" || oItem.TT2ID === "TT2_15")) && oItem.SERNR === "") {
						sap.m.MessageBox.error("Please add Serial No for Sub Task");
						return;
					}
					var oTask = this.avmentUtil.createInitialBlankRecord("NewTask")[0];
					/*	oTask.taskid = sjobid.concat("TASK_", dDate.getFullYear(), dDate.getMonth(), dDate.getDate(), dDate.getHours(), dDate.getMinutes(),
							dDate.getSeconds(), i);*/
					var sDateMa;
					try {
						sDateMa = formatter.defaultOdataDateFormat(this.getModel("applTmplModel").getProperty("/header/dDate"));
					} catch (e) {
						sDateMa = this.getModel("applTmplModel").getProperty("/header/dDate");
					}
					oTask.taskid = null;
					oTask.jobid = this.getModel("applTmplModel").getProperty("/header/selJobId");
					oTask.wrctr = this.getModel("applTmplModel").getProperty("/header/selWC");
					oTask.tailid = this.getModel("applTmplModel").getProperty("/header/selTailId");
					oTask.credtm = sDateMa;
					oTask.creuzt = this.getModel("applTmplModel").getProperty("/header/dTime");
					oTask.tmpid = oItem.TMPID;
					oTask.rtaskid = oItem.RTASKID;
					oTask.fragid = oItem.FRAGID;
					oTask.tdesc = oItem.TDESC;
					oTask.symbol = oItem.SYMBOL;
					oTask.ftdesc = oItem.FTDESC;
					oTask.tt1id = oItem.TT1ID;
					oTask.tt2id = oItem.TT2ID;
					oTask.engflag = oItem.ENGFLAG ? oItem.ENGFLAG : "NA";
					oTask.rtty = oItem.RTTY;

					if (oItem.SERNR !== "") {
						oTask.sernr = oItem.SERNR;
					}
					oTask.isser = oItem.ISSER;
					if (oItem.PARTNO !== "") {
						oTask.partno = oItem.PARTNO;
					}
					oTask.ismat = oItem.ISMAT;
					if (this.getModel("applTmplModel").getProperty("/Flag") === "FS") {
						oTask.jobid = "";
						oTask.wrctr = "";
						oTask.ttid = "2";
						//AMIT CHANGE FOR FS ONLY
						oTask.srvtid = srvtid;
						oTask.stepid = "S_CT";
					}
					oPayloads.push(oTask);
				}

				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (this.getModel("applTmplModel").getProperty("/Flag") === "FS") {
						/*	that.getRouter().navTo("FSCreateTask", {
								"srvtid": srvtid,
								"stepid": "S_CT"
							},false);*/
						this.onNavBack();
					} else {
						that.getRouter().navTo("CosDefectsSummary", {
							"JobId": this.getModel("applTmplModel").getProperty("/header/selJobId"),
							"Flag": "Y"
						}, true);
					}
				}.bind(this);
				oParameter.activity = 2;
				ajaxutil.fnCreate("/TaskSvc", oParameter, oPayloads, "ZRM_COS_TP", this);
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:onApplySelection function");
				this.handleException(e);
			}
		},

		//------------------------------------------------------------------
		// Function: onSerialNumPress
		// Parameter: oEvent,sKey
		// Description: This will get called, to handle change to add serial number in task description.
		//------------------------------------------------------------------
		onSerialNumPress: function(oEvent, sKey) {
			try {
				var that = this,
					oObj = oEvent.getSource().getParent().getBindingContext("applTmplModel").getObject(),
					oModel = dataUtil.createNewJsonModel();
				this.serialContext = oEvent.getSource().getParent().getBindingContext("applTmplModel");
				if (!that._oAddSR) {
					that._oAddSR = sap.ui.xmlfragment(that.createId("idAddTemplateSerialNumDialog"),
						"avmet.ah.fragments.TemplateAddSerialNum",
						this);
					oObj.ISMAT = "Part No.";
					oObj.ISSER = sKey === "SERIAL" ? "Serial No. (S/N)" : "Batch No.";
					oObj.ENGFLAG = oObj.ENGFLAG ? oObj.ENGFLAG : "NA";
					if (oObj.EDITFLAG) {
						oObj.Title = sKey === "SERIAL" ? "Edit Serial Number" : "Edit Batch Number";
					} else {
						oObj.Title = sKey === "SERIAL" ? "Add Serial Number" : "Add Batch Number";
					}
					oModel.setData(oObj);
					that._oAddSR.setModel(oModel, "SerialAddSet");
					that.getView().addDependent(that._oAddSR);
					that._oAddSR.open(that);
				}
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:onSerialNumPress function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: onSerialNumClose
		// Parameter: 
		// Description: This will get called, to handle serial number dialog close.
		//------------------------------------------------------------------
		onSerialNumClose: function() {
			try {
				if (this._oAddSR) {
					this._oAddSR.close(this);
					this._oAddSR.destroy();
					delete this._oAddSR;
				}
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:onSerialNumClose function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: onTypePartChange
		// Parameter: oEvent
		// Description: This will get called, to handle part number combobox value change .
		//------------------------------------------------------------------
		onTypePartChange: function(oEvent) {
			try {
				var that = this,
					oSelectedKey = oEvent.getSource().getSelectedKey();
				if (oSelectedKey === "Material No.") {
					that._oAddSR.getModel("SerialAddSet").setProperty("/ISMAT", oSelectedKey);
				} else {
					that._oAddSR.getModel("SerialAddSet").setProperty("/ISMAT", "");
				}
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:onTypePartChange function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: onTypeSRChange
		// Parameter: oEvent
		// Description: This will get called, to handle serial number combobox value change .
		//------------------------------------------------------------------
		onTypeSRChange: function(oEvent) {
			try {
				var that = this,
					oSelectedKey = oEvent.getSource().getSelectedKey();
				if (oSelectedKey === "Serial No. (S/N)") {
					that._oAddSR.getModel("SerialAddSet").setProperty("/ISSER", oSelectedKey);
				} else {
					that._oAddSR.getModel("SerialAddSet").setProperty("/ISSER", "");
				}
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:onTypeSRChange function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: onWorkCenterChange
		// Parameter: oEvent
		// Description: This will get called, to handle workcenter combobox value change .
		//------------------------------------------------------------------
		onWorkCenterChange: function(oEvent) {
			try {
				var that = this,
					oModel = this.getModel("applTmplModel"),
					oSelectedKey = oEvent.getSource().getSelectedKey(),
					oSelectedText = oEvent.getSource().getValue();
				oModel.setProperty("/SelectTaskTable", false);
				oModel.setProperty("/ApplyTempTable", false);
				oModel.setProperty("/header/bWorkCenter", false);
				oModel.setProperty("/tmpls", []);
				oModel.setProperty("/WorkText", oSelectedText);
				oModel.setProperty("/header/selTmpl", -1);
				this.getModel("applTmplModel").refresh();
				this.fnLoadTask("WR", oSelectedKey);

			} catch (e) {
				Log.error("Exception in CosApplyTemplate:onWorkCenterChange function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: onWorkCenterTempChange
		// Parameter: oEvent
		// Description: This will get called, to handle workcenter template combobox value change .
		//------------------------------------------------------------------
		onWorkCenterTempChange: function(oEvent) {
			try {
				var that = this,
					oModel = this.getModel("applTmplModel");
				oModel.setProperty("/SelectTaskTable", false);
				oModel.setProperty("/ApplyTempTable", false);
				this.getModel("applTmplModel").refresh();
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:onWorkCenterTempChange function");
				this.handleException(e);
			}
		},
		//------------------------------------------------------------------
		// Function: onSerialNumUpdatePress
		// Parameter: oEvent
		// Description: This will get called, to handle updateserial number pressed.
		//------------------------------------------------------------------
		onSerialNumUpdatePress: function(oEvent) {
			try {
				var that = this,
					oModel = this.getView().getModel("applTmplModel");
				var sKey = this._oAddSR.getModel("SerialAddSet").getProperty("/ENGFLAG");
				if (!(sKey === "EG" || sKey === "NE")) {
					sap.m.MessageBox.error("Please select request type");
					return;
				}
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				var obj = this.serialContext.getObject();
				var sContext = this.serialContext.getPath();
				sContext = sContext.replace("tasks", "tasksCopy");
				var objCopy = this.getModel("applTmplModel").getProperty(sContext);
				var desc = objCopy.TDESC;
				if (obj.ISSER === "Serial No. (S/N)") {
					desc = desc.replace("&SERNR&", obj.SERNR);
				} else {
					if (obj.SERNR && obj.SERNR.trim() !== "") {
						desc = desc.replace("Batch No:&SERNR&", "Batch No:" + obj.SERNR);
					} else {
						desc = desc.replace(",Batch No:&SERNR&", "");
					}

				}
				oModel.setProperty(this.serialContext.getPath() + "/TDESC", desc);
				oModel.setProperty(this.serialContext.getPath() + "/ENGFLAG", sKey);
				oModel.setProperty(this.serialContext.getPath() + "/EDITFLAG", true);

				//oModel.updateBindings(true);
				that.onSerialNumClose();
			} catch (e) {
				Log.error("Exception in CosApplyTemplate:onSerialNumUpdatePress function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var oApplTmplData = {},
					sAirID = oEvent.getParameter("arguments").airid;
				oApplTmplData.header = {
					selTmpl: "",
					selTask: "",
					selDat: null,
					selTim: null,
					selJobId: "",
					selWC: "",
					selAirId: "",
					bWorkCenter: false,
					selTailId: "",
					dDate: new Date(),
					dTime: new Date().getHours() + ":" + new Date().getMinutes()

				};
				oApplTmplData.tmpls = [];
				oApplTmplData.tasks = [];
				oApplTmplData.workCenterKey = "";
				oApplTmplData.jobDate = oEvent.getParameters().arguments.jbDate;
				oApplTmplData.jobTime = oEvent.getParameters().arguments.jbTime;
				this.getView().setModel(new JSONModel(oApplTmplData), "applTmplModel");
				this.getModel("applTmplModel").setProperty("/header/selWC", oEvent.getParameter("arguments").wc);
				this.getModel("applTmplModel").setProperty("/header/selJobId", oEvent.getParameter("arguments").jobid);
				this.getModel("applTmplModel").setProperty("/header/selAirId", sAirID);
				this.getModel("applTmplModel").setProperty("/header/selTailId", oEvent.getParameter("arguments").tailid);
				this.getModel("applTmplModel").setProperty("/Flag", oEvent.getParameter("arguments").Flag);
				this.getModel("applTmplModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("applTmplModel").setProperty("/ApplyTempTable", false);
				this.getModel("applTmplModel").setProperty("/SelectTaskTable", false);
				this.getModel("applTmplModel").setProperty("/WorkText", false);

				this.getModel("applTmplModel").refresh();
				this._fnWorkCenterGet(sAirID);
				//this.fnLoadTemplate();
				var that = this,
					oDDT2Model,
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

			} catch (e) {
				Log.error("Exception in CosApplyTemplate:_onObjectMatched function");
				this.handleException(e);
			}
		}

	});
});