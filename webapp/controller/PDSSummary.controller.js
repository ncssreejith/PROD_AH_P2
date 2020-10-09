sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../model/dataUtil",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, MessageToast, dataUtil, JSONModel, formatter, ajaxutil, Log, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.PDSSummary", {
		formatter: formatter,

		onInit: function() {
			try {
				this.getRouter().getRoute("PDSSummary").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(new JSONModel({
					"selItem": "",
					"enableSign": true,
					"addViewSel": "DEA_T",

					"masterList": [],
					"confirm": {
						"signOffOption": [],
						"selSignOff": {},
						"selDDID": {},
						"selDesc": {},
						"chk1": false,
						"chk2": false,
						"sgEnable": true,
						"outjob": ""
					},
					"defectArea": [{
						"key": "DEA_T",
						"text": "Top",
						"img": "AH-Top.png"
					}, {
						"key": "DEA_F",
						"text": "Front",
						"img": "AH-Front.png"
					}, {
						"key": "DEA_l",
						"text": "Left",
						"img": "AH-Left.png"
					}, {
						"key": "DEA_R",
						"text": "Right",
						"img": "AH-Right.png"
					}]
				}), "pdsSummaryModel");
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		onAfterRendering: function() {
			// this.fnRemovePerFromRadial();
		},

		onListItemPress: function(oEvent) {
			try {
				var sPath = oEvent.getSource().getSelectedItem().getBindingContext("pdsSummaryModel").getPath();
				this._fnNavToDetail(sPath);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		onJobDueUpdateFinished: function(oEvent) {
			if (oEvent.getSource().getBindingContext("pdsSummaryModel")) {
				var oCount = oEvent.getSource().getItems().length;
				var sPath = oEvent.getSource().getBindingContext("pdsSummaryModel").getPath();
				this.getModel("pdsSummaryModel").setProperty(sPath.replace("data", "") + "count", oCount);
				this.getModel("pdsSummaryModel").refresh();
			}
		},
		onClickSortieDetails: function(oEvent) {
			try {
				var oSortiDialog = this.openDialog("SortieDetailDialog", ".fragments.fs.pdsic.");
				var oObj = oEvent.getSource().getBindingContext("pdsSummaryModel").getObject();
				var sPath = oEvent.getSource().getBindingContext("pdsSummaryModel").getPath();
				oSortiDialog.bindElement({
					path: sPath,
					model: "pdsSummaryModel"
				});
				this._fnSortieMonitoringDetailsGet(oObj.JOBID, oObj.SORNO);
			} catch (e) {
				Log.error("Exception in onClickSortieDetails function");
			}
		},
		onSortieDetailsClose: function() {
			try {
				this.closeDialog("SortieDetailDialog");
			} catch (e) {
				Log.error("Exception in onSortieDetailsClose function");
			}
		},
		onSelectionDefectAreaChange: function(oEvent) {
			try {
				var selArea = oEvent.getParameter("item").getBindingContext("pdsSummaryModel").getObject();
				var oMarks = oEvent.getSource().getBindingContext("pdsSummaryModel").getProperty("marks");
				this.fnDrawDefect(oMarks, selArea);
			} catch (e) {
				var selArea1 = this.getModel("pdsSummaryModel").getProperty("/defectArea")[0];
				var oMarks1 = oEvent.getBindingContext("pdsSummaryModel").getProperty("marks");
				this.getModel("pdsSummaryModel").setProperty("/addViewSel", selArea1.key);
				this.getModel("pdsSummaryModel").refresh();
				this.fnDrawDefect(oMarks1, selArea1);
			}

		},
		onSignOffOptionChange: function(oEvent) {
			var sFlag = true;
			var selItem = oEvent.getSource().getSelectedItem().getBindingContext("pdsSummaryModel").getObject();
			var oJobCount = this.getModel("pdsSummaryModel").getProperty("/masterList/" + this._fnGetIndexById("T8_OJOBS") + "/count");
			if ((selItem.ddid === "AST_FFC" || selItem.ddid === "AST_FFF") && parseInt(oJobCount) > 0) {
				sFlag = false;
				// MessageToast.show("There is " + parseInt(oJobCount) + " outstanding jobs");
			}

			this.getModel("pdsSummaryModel").setProperty("/confirm/selDesc", selItem.description);
			this.getModel("pdsSummaryModel").setProperty("/confirm/sgEnable", sFlag);
			this.getModel("pdsSummaryModel").refresh();
		},
		onReviewedPress: function(oEvent) {
			try {
				var sBindingContext = oEvent.getSource().getBindingContext("pdsSummaryModel");
				this.getModel("pdsSummaryModel").setProperty(sBindingContext.getPath() + "/reviewd", true);
				var sNextIndex = -1;
				var sCurrentIndex = parseInt(sBindingContext.getPath().split("/")[2]);
				var oList = this.getModel("pdsSummaryModel").getProperty("/masterList");
				for (var i = 0; i < oList.length; i++) {
					if (i > sCurrentIndex && !oList[i].data.reviewd) {
						sNextIndex = i;
						break;
					}
				}
				if (sNextIndex >= 0) {
					this._fnNavToDetail("/masterList/" + sNextIndex);
					return;
				}
				this.getModel("pdsSummaryModel").setProperty("/enableSign", true);
				if (this.getModel("pdsSummaryModel").getProperty("/srvid")) {
					this.getModel("pdsSummaryModel").setProperty("/enableSign", false);
				}
				this.getModel("pdsSummaryModel").refresh();
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		onDefectsDetailsPress: function(oEvent) {
			var sObject = oEvent.getSource().getBindingContext("pdsSummaryModel").getObject();
			this.getRouter().navTo("CosDefectsSummary", {
				JobId: sObject.jobid,
				Flag: "N"
			});
		},
		onPresSignOff: function() {
			try {
				var sNextIndex = -1;
				var oList = this.getModel("pdsSummaryModel").getProperty("/masterList");
				for (var i = 0; i < oList.length; i++) {
					if (!oList[i].data.reviewd) {
						sNextIndex = i;
						break;
					}
				}
				if (sNextIndex >= 0) {
					this._fnNavToDetail("/masterList/" + sNextIndex);
					return;
				}
				var oJobCount = this.getModel("pdsSummaryModel").getProperty("/masterList/" + this._fnGetIndexById("T8_OJOBS") + "/count");
				var sFlag = true;

				var selDDID = this.getModel("pdsSummaryModel").getProperty("/confirm/selDDID");
				var sMsg = "";
				if ((selDDID === "AST_FFC" || selDDID === "AST_FFF") && parseInt(oJobCount) > 0) {
					sFlag = false;
					if (parseInt(oJobCount) > 1) {
						sMsg = "There is " + parseInt(oJobCount) + " outstanding jobs you can not do Fit-for-Flight or Fit-for-Check Flight";
					} else {
						sMsg = "There is " + parseInt(oJobCount) + " outstanding job you can't do Fit-for-Flight or Fit-for-Check Flight";
					}
				}
				this.getModel("pdsSummaryModel").setProperty("/confirm/outjob", sMsg);
				this.getModel("pdsSummaryModel").setProperty("/confirm/sgEnable", sFlag);
				this.getModel("pdsSummaryModel").refresh();

				var oDialog = this.openDialog("SignOffConfirmDialog", ".fragments.fs.pdsic.");
				oDialog.bindElement({
					path: "/confirm",
					model: "pdsSummaryModel"
				});
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		onPressSignOffClose: function() {
			this.closeDialog("SignOffConfirmDialog");
		},
		onLimitationItemPress: function(oEvent) {
			try {
				this.openDialog("ADDLimitationDialog", ".fragments.fs.pdsic.");
				var sContext = oEvent.getSource().getBindingContext("pdsSummaryModel");
				this.fnLoadAddLimitationDetail(sContext);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		onADDLimitationItemPress: function(oEvent) {
			try {
				this.openDialog("ADDLimitationDialog", ".fragments.fs.pdsic.");
				var sContext = oEvent.getSource().getBindingContext("pdsSummaryModel");
				this.fnLoadAddLimitationDetail(sContext);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		onWeightWUpdateFinished: function(oEvent) {
			var sFlag = false;
			if (oEvent.getSource().getItems().length > 0) {
				var sObject = oEvent.getSource().getItems()[0].getBindingContext("pdsSummaryModel").getObject();
				if (sObject.WTIND === "W" && sObject.FLAG === "X") {
					sFlag = true;
				}
			}
			oEvent.getSource().setVisible(sFlag);
		},
		onPDSReject: function() {},

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
				this.getModel("pdsSummaryModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("pdsSummaryModel").setProperty("/srvid", oEvent.getParameter("arguments").srvid);
				this.getModel("pdsSummaryModel").setProperty("/enableSign", true);

				if (this.getModel("pdsSummaryModel").getProperty("/srvid")) {
					this.getModel("pdsSummaryModel").setProperty("/enableSign", false);
				}

				this.getModel("pdsSummaryModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this.getModel("pdsSummaryModel").setProperty("/masterList", []);
				this.getModel("pdsSummaryModel").setProperty("/confirm/signOffOption", []);
				this.getModel("pdsSummaryModel").setProperty("/confirm/chk1", false);
				this.getModel("pdsSummaryModel").setProperty("/confirm/chk2", false);
				this.getModel("pdsSummaryModel").refresh();
				this._getPDSLists();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		},
		onCancelLimitationDetail: function() {
			this.closeDialog("ADDLimitationDialog");
		},
		fnLoadAddLimitationDetail: function(sContext) {
			var oPrmJobDue = {};
			oPrmJobDue.filter = "FLAG EQ O AND CAPID EQ " + sContext.getObject().CAPID + " AND JOBID EQ " + sContext.getObject().JOBID;
			oPrmJobDue.error = function() {};
			oPrmJobDue.success = function(oData) {
				this.getModel("pdsSummaryModel").setProperty(sContext.getPath() + "/ADDLimit", oData.results.length > 0 ? oData.results[0] : {});
				this.getModel("pdsSummaryModel").refresh();
				this.getDialog("ADDLimitationDialog").bindElement({
					path: sContext.getPath(),
					model: "pdsSummaryModel"
				});

			}.bind(this);
			ajaxutil.fnRead("/ADDOVERVIEWSvc", oPrmJobDue);
		},
		onSerialNoPress: function(oEvent) {
			try {
				var oStation = oEvent.getParameter("oSource").getParent().getBindingContext("pdsSummaryModel").getObject();
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stnmid eq " + oStation.STNMID + " and stnsid eq " + oStation.STNSID +
					" and ADPID eq " + oStation.ADPID;
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("pdsSummaryModel").setProperty("/srnos", oData.results);
					this.getModel("pdsSummaryModel").refresh();
					this.openDialog("SerialNosDialog", ".fragments.fs.pdsic.");
				}.bind(this);
				ajaxutil.fnRead("/WeaponSernrSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		onSerialNoOkClose: function() {
			try {
				this.closeDialog("SerialNosDialog");
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getPDSLists: function() {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("pdsSummaryModel").getProperty(
					"/srvtid");
				oParameter.success = function(oData) {
					this.getModel("pdsSummaryModel").setProperty("/masterList", oData.results);
					this.getModel("pdsSummaryModel").refresh();
					if (oData.results.length >= 0) {
						this.fnGetAllData();
					}
				}.bind(this);
				ajaxutil.fnRead("/PDSSummarySvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		fnGetAllData: function() {
			this._getSortie();
			this._getReplenishmentDetails();
			this._getFLyReq();
			this._getJobDetails();
			this._getOutstandingJob();
			this._getPastMonthDefects();
			this._getPendingApprovals();
			this._fnLimitationsGet();
			this._fnADDGet();
			this._getTrailMod();
			this._getWeaponConfig();
			this._getSignOffOptions();
		},

		_getSortie: function() {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "TAILID EQ '" + this.getTailId() + "' and FLAG eq 'FS'";
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T1_MCARD");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/sortList", oData.results);
					this.getModel("pdsSummaryModel").refresh();
					this._fnNavToDetail("/masterList/0");
				}.bind(this);
				ajaxutil.fnRead("/SortieMonsvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getReplenishmentDetails: function() {
			try {
				var oParameter = {};
				var filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("pdsSummaryModel").getProperty("/srvtid") +
					" and TAILID eq " + this.getTailId() +
					" and STEPID eq S_RE";
				oParameter.error = function() {};
				oParameter.filter = filter;
				oParameter.success = function(oData) {
					this.fnSetReplData(oData);
					this._getRTTasks();
					this._getTasks();
					this._getCreatedTasks();
					this._getFuelExtTanks();
				}.bind(this);
				ajaxutil.fnRead("/ReplshmentSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		fnSetReplData: function(oData) {
			var sIndex = this._fnGetIndexById("T6_FLC");
			this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", "");
			this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
			this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
			this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/repl", {});
			this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/repl/fuel", []);
			this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/repl/tire", []);
			this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/repl/oil", []);
			oData.results.forEach(function(oItem) {
				var sPath = "fuel";
				switch (oItem.remid) {
					case "REM_F":
						sPath = "fuel";
						break;
					case "REM_T":
						sPath = "tire";
						break;
					case "REM_O":
						sPath = "oil";
						break;
				}
				this.getModel("pdsSummaryModel").getProperty("/masterList/" + sIndex + "/data/repl/" + sPath).push(oItem);
			}.bind(this));
			this.getModel("pdsSummaryModel").refresh();
		},
		_getFuelExtTanks: function() {
			try {

				var oParameter = {};
				var filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("pdsSummaryModel").getProperty("/srvtid") +
					" and TAILID eq " + this.getTailId() +
					" and STEPID eq S_RE";
				oParameter.error = function() {};
				oParameter.filter = filter; //"REFID eq AIR_10 and SRVID eq  and TAILID eq TAIL_1015";
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T6_FLC");
					var oFules = this.getModel("pdsSummaryModel").getProperty("/masterList/" + sIndex + "/data/repl/fuel").concat(oData.results);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/repl/fuel", oFules);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/ReplRoleSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getTasks: function() {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq S_FT and srvtid eq " + this.getModel("pdsSummaryModel").getProperty(
					"/srvtid") + " and PDSFLAG eq 'P'";
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T6_FLC");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/ft", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/FTSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getCreatedTasks: function() {
			try {

				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq S_CT and srvtid eq " + this.getModel("pdsSummaryModel").getProperty(
					"/srvtid");
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T6_FLC");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/ct", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/GetFSTaskSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getRTTasks: function(sFilter, sTab) {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and srvtid eq " + this.getModel("pdsSummaryModel").getProperty(
					"/srvtid") + " and TAIL_ID eq " + this.getTailId() + " and stepid eq S_RT";
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T6_FLC");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/rt", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/RT2Svc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getFLyReq: function() {
			try {

				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T5_FREQ");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/flyReq", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/AH4StatusSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getJobDetails: function() {
			try {
				var oParameter = {};
				oParameter.filter = "CTYPE eq ALL and tailid eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oData.results = this.fnDueJob(oData.results);
					var sIndex = this._fnGetIndexById("T9_JDUE");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/dueJobs", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/GetSerLogSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getDueSoonJobDetails function");
				this.handleException(e);
			}
		},
		fnDueJob: function(oData) {
			for (var i = oData.length - 1; i >= 0; i--) {
				if ((parseInt(oData[i].DUEIN) > 5 && oData[i].UM === "DAYS") || (parseInt(oData[i].DUEIN) > 10 && oData[i].UM !== "DAYS")) {
					oData.splice(i, 1);
				}
			}
			return oData;
		},
		_getOutstandingJob: function() {
			try {
				var oParameter = {};
				oParameter.filter = "jobty eq Z and tailid eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T8_OJOBS");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/outJobs", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);

				ajaxutil.fnRead("/DefectJobSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getPastMonthDefects: function() {
			try {
				var oParameter = {};
				oParameter.filter = "jobty eq pd and tailid eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T10_PASTD");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/pastDef", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/FSDefectJobSvc", oParameter);
			} catch (e) {
				Log.error("Exception in _getPastMonthDefects function");
				this.handleException(e);
			}
		},
		_getPendingApprovals: function() {
			try {

				var oParameter = {};
				oParameter.filter = "AIRID eq " + this.getAircraftId() + " and TAILID eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T2_PAPPR");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/appr", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/ApprovalSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnLimitationsGet: function() {
			try {
				var oPrmJobDue = {};
				oPrmJobDue.filter = "CAPTY eq L and AIRID eq " + this.getAircraftId() + " and tailid eq " + this.getTailId();
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var sIndex = this._fnGetIndexById("T3_LIMIT");
					// oData.results[0].CAPTY = "A";
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/addLimit", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/GetAddLimitationsPDSICSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnADDGet: function() {
			try {
				var oPrmJobDue = {};
				oPrmJobDue.filter = "CAPTY eq A and AIRID eq " + this.getAircraftId() + " and tailid eq " + this.getTailId();
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var sIndex = this._fnGetIndexById("T4_ADD");
					var sMarks = this._fnCreateMarks(oData);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/marks", sMarks);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/add", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/GetAddLimitationsPDSICSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getTrailMod: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T11_TMOD");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/trailMod", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/TRAILMONSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getWeaponConfig: function() {
			try {
				var oParameter = {};
				oParameter.filter = "airid eq " + this.getAircraftId() + " and tailid eq " + this.getTailId() + " and srvtid eq " + this.getModel(
					"pdsSummaryModel").getProperty("/srvtid");
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T7_WCONF");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/count", "");
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("pdsSummaryModel").setProperty("/masterList/" + sIndex + "/data/stns", oData.results);
					this.getModel("pdsSummaryModel").refresh();
					// this._fnNavToDetail("/masterList/0");
				}.bind(this);
				ajaxutil.fnRead("/WeaponSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_getSignOffOptions: function() {
			try {
				var oParameter = {};
				oParameter.filter = "DDID eq AST_ and REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("pdsSummaryModel").getProperty(
					"/srvtid");
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("pdsSummaryModel").setProperty("/confirm/signOffOption", oData.results);
					this.getModel("pdsSummaryModel").setProperty("/confirm/selDDID", oData.results.length > 0 ? oData.results[0].ddid : "");
					this.getModel("pdsSummaryModel").setProperty("/confirm/selDesc", oData.results.length > 0 ? oData.results[0].description : "");
					this.getModel("pdsSummaryModel").setProperty("/confirm/selSignOff", oData.results.length > 0 ? oData.results[0] : "");
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/MasterDDREFSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnSortieMonitoringDetailsGet: function(sJobId, sSORNO) {
			try {
				var oPrmTD = {};
				oPrmTD.filter = "TAILID eq " + this.getTailId() + " AND FLAG EQ D AND JOBID EQ " + sJobId + " AND SORNO EQ " + sSORNO;
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					this.getView().setModel(oModel, "SortiDetails");
				}.bind(this);
				ajaxutil.fnRead("/GetSortiAISvc", oPrmTD);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		onApprovalDetails: function(oEvent) {
			try {
				var oDialogName = "";
				var oContext = oEvent.getSource().getBindingContext("pdsSummaryModel");
				switch (oContext.getObject().flag) {
					case "A":
					case "B":
					case "L":
						oDialogName = "ALBApprovalDetailDialog";
						this._fnApprovalDetailsRequestGet(oContext);
						break;
					case "W":
						oDialogName = "WBApprovalDetailDialog";
						this._fnWeightBalanceGet(oContext);
						this._fnGetWeightBalanceItemSet(oContext);
						break;
					case "LP":
						oDialogName = "LPApprovalDetailDialog";
						this._fnAirOverViewHeaderGet(oContext);
						break;
					case "TM":
						oDialogName = "TrialModApprovalDetailDialog";
						this._fnTrialModGet(oContext);
						break;
				}
				var oDialog = this.openDialog(oDialogName, ".fragments.fs.pdsic.");
				oDialog.bindElement({
					path: oContext.getPath(),
					model: "pdsSummaryModel"
				});
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		onCancelApprovalDetail: function(oEvent, oDialogName) {
			this.closeDialog(oDialogName);
		},
		_fnApprovalDetailsRequestGet: function(oContext) {
			try {
				var oPrmAppr = {};
				oPrmAppr.filter = "CAPID eq " + oContext.getObject().id;
				oPrmAppr.error = function() {};
				oPrmAppr.success = function(oData) {
					this.getModel("pdsSummaryModel").setProperty(oContext.getPath() + "/detail", oData.results.length > 0 ? oData.results[0] : {});
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/ApprovalNavSvc", oPrmAppr);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnWeightBalanceGet: function(oContext) {
			try {
				var oPrmWBM = {};
				oPrmWBM.filter = "tailid eq " + this.getTailId() + " and MOD eq P";
				oPrmWBM.error = function() {};
				oPrmWBM.success = function(oData) {
					this.getModel("pdsSummaryModel").setProperty(oContext.getPath() + "/detail", oData.results);
					this.getModel("pdsSummaryModel").refresh();

				}.bind(this);
				ajaxutil.fnRead("/WeBalHSvc", oPrmWBM);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnGetWeightBalanceItemSet: function(oContext) {
			try {
				var oPrmWBM = {};
				oPrmWBM.filter = "WABID eq " + oContext.getObject().id;
				oPrmWBM.error = function() {};
				oPrmWBM.success = function(oData) {
					this.getModel("pdsSummaryModel").setProperty(oContext.getPath() + "/inoutDetail", oData.results);
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/WeBalISvc", oPrmWBM);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnAirOverViewHeaderGet: function(oContext) {
			try {
				var oPrmWB = {};
				oPrmWB.filter = "FLAG eq H and TAILID eq " + this.getTailId() + " AND LPTYPE EQ LPHEADER";
				oPrmWB.error = function() {};
				oPrmWB.success = function(oData) {
					this.getModel("pdsSummaryModel").setProperty(oContext.getPath() + "/detail", oData.results.length > 0 ? oData.results[0] : {});
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/LeadPartiSvc", oPrmWB);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnTrialModGet: function(oContext) {
			try {
				var oPrmWB = {};
				oPrmWB.filter = "FLAG eq TM and JOBID eq " + oContext.getObject().JOBID;
				oPrmWB.error = function() {};
				oPrmWB.success = function(oData) {
					this.getModel("pdsSummaryModel").setProperty(oContext.getPath() + "/detail", oData.results.length > 0 ? oData.results[0] : {});
					this.getModel("pdsSummaryModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/ApprovalNavSvc", oPrmWB);
			} catch (e) {
				Log.error("Exception in _fnTrialModGet function");
			}
		},
		onPressSignOffConfirm: function(oEvent) {
			try {

				var oSignOffPayload = {
					srvid: "",
					refid: this.getAircraftId(),
					tailid: this.getTailId(),
					stepid: this.getModel("pdsSummaryModel").getProperty("/stepid"),
					FFDT: this.getModel("pdsSummaryModel").getProperty("/confirm/selDDID"),
					srvtid: this.getModel("pdsSummaryModel").getProperty("/srvtid"),
					reftyp: "AIR",
					ddid: "HC_SG_S_FF",
					dftl: "",
					num1: "",
					uom: "",
					value: null,
					sgid: null,
					begda: "",
					endda: "",
					airid: "",
					modid: "",
					ddesc: " ",
					sign: "",
					sgusr: "",
					T8_OJOBS: null,
					T2_PAPPR: null,
					T6_FLC: null,
					T7_WCONF: null,
					T5_FREQ: null,
					T4_ADD: null,
					T3_LIMIT: null,
					T11_TMOD: null,
					T1_MCARD: null,
					T9_JDUE: null,
					T10_PASTD: null,
					T1_SORTIE: null,
					visrt: null,
					visft: null,
					visct: null,
					couts: null,
					cpend: null,
					CFLAG: null
				};
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.closeDialog("FitForFlightSignOff");
					this.getRouter().navTo("DashboardInitial", false);
				}.bind(this);
				oParameter.activity = 4;
				ajaxutil.fnCreate("/PDSSummarySvc", oParameter, [oSignOffPayload], "ZRM_FS_FFF", this);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		_fnGetIndexById: function(sId) {
			var sIndex = -1;
			this.getModel("pdsSummaryModel").getProperty("/masterList").forEach(function(oItem, oIndx) {
				if (oItem.ddid === sId) {
					sIndex = oIndx;
				}
			}.bind(this));
			this.getModel("pdsSummaryModel").setProperty("/setItem", sIndex);
			this.getModel("pdsSummaryModel").refresh();
			return sIndex;
		},
		_fnNavToDetail: function(sPath) {
			var oData = this.getModel("pdsSummaryModel").getProperty(sPath);
			var viewId = this.createId(oData.ddid);
			this.getSplitAppObj().toDetail(viewId);
			this.getView().byId(viewId).bindElement({
				path: sPath + "/data",
				model: "pdsSummaryModel"
			});
			this.getModel("pdsSummaryModel").setProperty("/selItem", oData.ddid);
			this.getModel("pdsSummaryModel").refresh();
			if (oData.ddid === "T4_ADD") {
				this.onSelectionDefectAreaChange(this.getView().byId(viewId));
			}
		},
		getSplitAppObj: function() {
			var result = this.byId("splitAppId");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},
		_fnCreateMarks: function(oData) {
			var oMark = [];
			if (oData.results.length === 0) {
				return oMark;
			}
			var sCount = 0;
			oData.results.forEach(function(oItem, sIndex) {
				oItem.NAME1 = this.formatter.fnMarkLable(sIndex);
				if (oItem.DEAID_M !== "" && oItem.DEAID_M !== null) {
					var sMark = {
						name: this.formatter.fnMarkLable(sIndex),
						place: oItem.DEAID,
						placeId: oItem.DEAID_M,
						x: oItem.XAXIS,
						y: oItem.YAXIS
					};
					sCount++;
					oMark.push(sMark);
				}
			}.bind(this));

			return oMark;
		},
		fnDrawDefect: function(oMarks, selArea) {
			var oCanvas = document.getElementById("myCanvas");
			oCanvas.getContext("2d").clearRect(0, 0, oCanvas.width, oCanvas.height);
			oCanvas.style.backgroundImage = "url('" + jQuery.sap.getModulePath("avmet.ah") + "/css/img/AH/" + selArea.img + "')";
			oMarks.forEach(function(mark) {
				if (selArea.key === mark.placeId) {
					var ctx = oCanvas.getContext("2d");
					var grd = ctx.createLinearGradient(0, 0, 170, 0);
					grd.addColorStop(1, "red");
					ctx.fillStyle = "red"; // Red color
					ctx.strokeStyle = "black";
					ctx.font = "15px Arial";
					ctx.beginPath();
					ctx.arc(Number(mark.x), Number(mark.y), 10, 0, 2 * Math.PI);
					ctx.fill();
					//To print character on point. 
					ctx.beginPath();
					ctx.fillStyle = "black";
					ctx.fillText(mark.name, Number(mark.x) - 6.5, Number(mark.y) + 6);
					ctx.fill();
				}
			});
		},

		fnRemovePerFromRadial: function(oEvent) {
			oEvent.getSource().onAfterRendering = function(oEvt) {
				oEvt.srcControl.getItems().forEach(function(oItem) {
					if (document.querySelector("#" + oItem.getId() + ">div>div>div>div>div>div>div")) {
						document.querySelector("#" + oItem.getId() + ">div>div>div>div>div>div>div").textContent = "";
					}
				}.bind(this));
			};
		}

	});
});