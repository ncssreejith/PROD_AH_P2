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
			return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorCreateTaskPast", "errorCreateTaskFuture");
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
				this.getView().byId("tbSummary").getItems().forEach(function(oItem, i) {
					oItem = oItem.getBindingContext("applTmplModel").getObject();
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
					if (oItem.SERNR !== "") {
						oTask.tt1id = "TT1_10";
						oTask.tt2id = "TT2_10";
						oTask.sernr = oItem.SERNR;
						oTask.ftsernr = oItem.SERNR;
						oTask.isser = oItem.ISSER;

					}
					if (oItem.PARTNO !== "") {
						oTask.tt1id = "TT1_10";
						oTask.tt2id = "TT2_10";
						oTask.partno = oItem.PARTNO;
						oTask.ismat = oItem.ISMAT;
					}
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
				}.bind(this));
				this.getView().byId("tbTask").getSelectedItems().forEach(function(oItem, i) {
					oItem = oItem.getBindingContext("applTmplModel").getObject();
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

					if (oItem.SERNR !== "") {
						oTask.tt1id = "TT1_10";
						oTask.tt2id = "TT2_10";
						oTask.sernr = oItem.SERNR;
						oTask.ftsernr = oItem.SERNR;
						oTask.isser = oItem.ISSER;

					}
					if (oItem.PARTNO !== "") {
						oTask.tt1id = "TT1_10";
						oTask.tt2id = "TT2_10";
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
				}.bind(this));

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

		onSerialNumPress: function(oEvent) {
			try {
				var that = this,
					oObj = oEvent.getSource().getParent().getBindingContext("applTmplModel").getObject(),
					oModel = dataUtil.createNewJsonModel();
				if (!that._oAddSR) {
					that._oAddSR = sap.ui.xmlfragment(that.createId("idAddSRDialog"),
						"avmet.ah.fragments.TemplateAddSerialNum",
						this);
					oObj.ISMAT = "Material No.";
					oObj.ISSER = "Serial No. (S/N)";
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
				this.fnLoadTask("WR", oSelectedKey);
				oModel.setProperty("/SelectTaskTable", false);
				oModel.setProperty("/ApplyTempTable", false);
				this.getModel("applTmplModel").setProperty("/tmpls", []);
				this.getModel("applTmplModel").setProperty("/WorkText", oSelectedText);
				this.getModel("applTmplModel").setProperty("/header/selTmpl", "");
				this.getModel("applTmplModel").refresh();

			} catch (e) {
				Log.error("Exception in onWorkCenterChange function");
			}
		},

		onSerialNumUpdatePress: function(oEvent) {
			var that = this,
				oModel = this.getView().getModel("applTmplModel");
			oModel.updateBindings(true);
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
				oPrmWorkCen.filter = "REFID eq " + sAirId;
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
					oParameter.filter = "WRCTR eq " + oSelectedKey + " and TAIILID EQ " + this.getTailId();
				} else {
					oParameter.filter = "tmpid eq '" + this.getModel("applTmplModel").getProperty("/header/selTmpl") + "'";
				}
				this.handleBusyDialogOpen();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData.results.length !== 0) {
						if (oFlag === "WR") {
							oModel.setProperty("/header/bWorkCenter", true);
							oModel.setProperty("/tmpls", oData.results);
							oModel.setProperty("/header/selTmpl", oData.results.length > 0 ? oData.results[0].ddid : "");
						} else {
							oModel.setProperty("/tasks", oData.results);
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