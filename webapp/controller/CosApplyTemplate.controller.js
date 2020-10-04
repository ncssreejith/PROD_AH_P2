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
	 *   This file is for ???????            
	 *   1. Purpose for this file ????
	 *	Note: ??????????
	 * IMPORTANT : Must give documentation for all functions
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
				Log.error("Exception in xxxxx function");
			}
		},
		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

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
				Log.error("Exception in xxxxx function");
			}
		},

		handleChange: function() {
			var prevDt = this.getModel("applTmplModel").getProperty("/jobDate");
			var prevTime = this.getModel("applTmplModel").getProperty("/jobTime");
			return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorCreateTaskPast", "errorCreateTaskFuture", prevDt, prevTime);
		},

		onTemplateApply: function(oEvent) {
			try {
				this.fnLoadTask("TM");
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		onApplySelection: function(oEvent) {
			try {
				if (!this.handleChange()) {
					return;
				}
				var that = this,
					oPayloads = [],
					sjobid = "",
					srvtid = this.getModel("applTmplModel").getProperty("/srvtid"),
					dDate = new Date();
				if (this.getView().byId("tbTask").getSelectedItems().length === 0) {
					sap.m.MessageBox.error("Please select task(s) to proceed");
					return;
				}
				var oItems = this.getView().byId("tbSummary").getItems();
				for (var i in oItems) {
					var oItem = oItems[i].getBindingContext("applTmplModel").getObject();
					if ((oItem.TT1ID || oItem.TT2ID) && oItem.SERNR === "") {
						sap.m.MessageBox.error("Please add Serial No for Main Task");
						return;
					}
					var oTask = this.avmentUtil.createInitialBlankRecord("NewTask")[0];
					/*oTask.taskid = sjobid.concat("TASK_", dDate.getFullYear(), dDate.getMonth(), dDate.getDate(), dDate.getHours(), dDate.getMinutes(),
						dDate.getSeconds(), i);*/
					oTask.taskid = null;
					oTask.jobid = this.getModel("applTmplModel").getProperty("/header/selJobId");
					oTask.wrctr = this.getModel("applTmplModel").getProperty("/header/selWC");
					oTask.tailid = this.getModel("applTmplModel").getProperty("/header/selTailId");
					oTask.credtm = this.getModel("applTmplModel").getProperty("/header/dDate");
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
					if ((oItem.TT1ID || oItem.TT2ID) && oItem.SERNR === "") {
						sap.m.MessageBox.error("Please add Serial No for Sub Task");
						return;
					}
					var oTask = this.avmentUtil.createInitialBlankRecord("NewTask")[0];
					/*	oTask.taskid = sjobid.concat("TASK_", dDate.getFullYear(), dDate.getMonth(), dDate.getDate(), dDate.getHours(), dDate.getMinutes(),
							dDate.getSeconds(), i);*/
					oTask.taskid = null;
					oTask.jobid = this.getModel("applTmplModel").getProperty("/header/selJobId");
					oTask.wrctr = this.getModel("applTmplModel").getProperty("/header/selWC");
					oTask.tailid = this.getModel("applTmplModel").getProperty("/header/selTailId");
					oTask.credtm = this.getModel("applTmplModel").getProperty("/header/dDate");
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
						oTask.isser = oItem.ISSER;

					}
					if (oItem.PARTNO !== "") {
						oTask.partno = oItem.PARTNO;
						oTask.ismat = oItem.ISMAT;
					}
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
						});
					}
				}.bind(this);
				oParameter.activity = 2;
				ajaxutil.fnCreate("/TaskSvc", oParameter, oPayloads, "ZRM_COS_TP", this);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

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
					if (oData.results.length !== 0) {
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
				Log.error("Exception in getSerialNoPress function");
			}
		},

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
				Log.error("Exception in onSerialNumPress function");
			}
		},
		onSerialNumClose: function() {
			try {
				if (this._oAddSR) {
					this._oAddSR.close(this);
					this._oAddSR.destroy();
					delete this._oAddSR;
				}
			} catch (e) {
				Log.error("Exception in onSerialNumClose function");
			}
		},

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
				Log.error("Exception in onTypePartChange function");
			}
		},
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
				Log.error("Exception in onTypePartChange function");
			}
		},

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
				Log.error("Exception in onWorkCenterChange function");
			}
		},

		onWorkCenterTempChange: function(oEvent) {
			try {
				var that = this,
					oModel = this.getModel("applTmplModel");
				oModel.setProperty("/SelectTaskTable", false);
				oModel.setProperty("/ApplyTempTable", false);
				this.getModel("applTmplModel").refresh();
			} catch (e) {
				Log.error("Exception in onWorkCenterTempChange function");
			}
		},

		onSerialNumUpdatePress: function(oEvent) {
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
			desc = desc.replace("&SERNR&", obj.SERNR);
			oModel.setProperty(this.serialContext.getPath() + "/TDESC", desc);
			oModel.setProperty(this.serialContext.getPath() + "/ENGFLAG", sKey);
			oModel.setProperty(this.serialContext.getPath() + "/EDITFLAG", true);

			//oModel.updateBindings(true);
			that.onSerialNumClose();
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
				Log.error("Exception in _onObjectMatched function");
			}
		},
		/*	fnLoadTemplate: function(oSelectedKey) {
				try {
					var oParameter = {};
					oParameter.filter = "refid eq " + this.getAircraftId() + " and ddid eq TMP";
					oParameter.error = function() {};
					oParameter.success = function(oData) {
						this.getModel("applTmplModel").setProperty("/tmpls", oData.results);
						this.getModel("applTmplModel").setProperty("/header/selTmpl", oData.results.length > 0 ? oData.results[0].ddid : "");
						this.getModel("applTmplModel").refresh();
						this.fnLoadTask();
					}.bind(this);
					ajaxutil.fnRead("/MasterDDREFSvc", oParameter);
				} catch (e) {
					Log.error("Exception in xxxxx function");
				}
			},*/
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
				Log.error("Exception in _fnWorkCenterGet function");
			}
		},

		fnLoadTask: function(oFlag, oSelectedKey) {
			try {
				var oParameter = {},
					oModel = this.getModel("applTmplModel");
				if (oFlag === "WR") {
					/*	oParameter.filter = "WRCTR eq " + oSelectedKey + " and TAILID EQ " + this.getTailId();*/
					if (oSelectedKey !== undefined) {
						oParameter.filter = "WRCTR eq " + oSelectedKey + " and TAIILID EQ " + this.getTailId();
					} else {
						sap.m.MessageBox.information("Please select workcenter to proceed.");
						return;
					}
				} else {
					/*oParameter.filter = "tmpid eq '" + this.getModel("applTmplModel").getProperty("/header/selTmpl") + "'";*/
					var oTempId = this.getModel("applTmplModel").getProperty("/header/selTmpl");
					if (oTempId !== -1 && oTempId !== "") {
						oParameter.filter = "tmpid eq '" + this.getModel("applTmplModel").getProperty("/header/selTmpl") + "'";
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
				Log.error("Exception in xxxxx function");
			}
		}
	});
});