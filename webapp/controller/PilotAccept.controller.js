sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log",
	"../util/ajaxutilNew",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, MessageToast, dataUtil, JSONModel, formatter, ajaxutil, Log, ajaxutilNew, FilterOpEnum) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.PilotAccept", {
		formatter: formatter,

		/** 
		 * On Init of object //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		onInit: function() {
			try {
				this.getRouter().getRoute("PilotAccept").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(new JSONModel({}), "paModel");
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},

		onAfterRendering: function() {},

		onListItemPress: function(oEvent) {
			try {
				var sPath = oEvent.getSource().getSelectedItem().getBindingContext("paModel").getPath();
				this._fnNavToDetail(sPath);
			} catch (e) {
				Log.error("Exception in onListItemPress function");
			}
		},
		onJobDueUpdateFinished: function(oEvent) {
			// if (oEvent.getSource().getBindingContext("paModel")) {
			// 	var oCount = oEvent.getSource().getItems().length;
			// 	var sPath = oEvent.getSource().getBindingContext("paModel").getPath();
			// 	this.getModel("paModel").setProperty(sPath.replace("data", "") + "count", oCount);
			// 	this.getModel("paModel").refresh();
			// }
		},
		onClickSortieDetails: function(oEvent) {
			try {
				var oSortiDialog = this.openDialog("SortieDetailDialog", ".fragments.fs.pilot.");
				var oObj = oEvent.getSource().getBindingContext("paModel").getObject();
				var sPath = oEvent.getSource().getBindingContext("paModel").getPath();
				oSortiDialog.bindElement({
					path: sPath,
					model: "paModel"
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
				var selArea = oEvent.getParameter("item").getBindingContext("paModel").getObject();
				var oMarks = oEvent.getSource().getBindingContext("paModel").getProperty("marks");
				this.fnDrawDefect(oMarks, selArea);
			} catch (e) {
				var selArea1 = this.getModel("paModel").getProperty("/defectArea")[0];
				var oMarks1 = oEvent.getBindingContext("paModel").getProperty("marks");
				this.getModel("paModel").setProperty("/addViewSel", selArea1.key);
				this.getModel("paModel").refresh();
				this.fnDrawDefect(oMarks1, selArea1);
			}

		},
		onReviewedPress: function(oEvent) {
			try {
				var sBindingContext = oEvent.getSource().getBindingContext("paModel");
				this.getModel("paModel").setProperty(sBindingContext.getPath() + "/reviewd", true);

				var sNextIndex = -1;
				var sCurrentIndex = parseInt(sBindingContext.getPath().split("/")[2]);
				var oList = this.getModel("paModel").getProperty("/masterList");
				for (var i = 0; i < oList.length; i++) {
					if (i > sCurrentIndex && !oList[i].data.reviewd && oList[i].reftyp !== "OTHERS") {
						sNextIndex = i;
						break;
					}
				}
				if (sNextIndex >= 0) {
					this._fnNavToDetail("/masterList/" + sNextIndex);
					return;
				}
				this.getModel("paModel").setProperty("/enableSign", true);
				this.getModel("paModel").refresh();
			} catch (e) {
				Log.error("Exception in onReviewedPress function");
			}
		},
		onAddDefectPress: function(oEvent) {
			try {
				var oItems = {
					"tailid": this.getTailId(),
					"jobid": null,
					"fr_no": null,
					"sgusr": null,
					"astid": null,
					"fair": "N",
					"srvtid": this.getModel("paModel").getProperty("/srvtid"),
					"stepid": this.getModel("paModel").getProperty("/stepid"),
					"jobdesc": null,
					"fstat": null,
					"jobty": "",
					"jstat": "",
					"symbol": "",
					"purpose": "",
					"srvid": ""
				};
				this.getModel("paModel").getProperty("/defects").push(oItems);
				this.getModel("paModel").refresh();
			} catch (e) {
				Log.error("Exception in PilotAccept:onAddDefectPress function");
				this.handleException(e);
			}
		},
		onDeleteDefectPress: function(oEvent) {
			try {
				var oIndex = oEvent.getSource().getBindingContext("paModel").getPath().split("/")[2];
				this.getModel("paModel").getProperty("/defects").splice(oIndex, 1);
				this.getModel("paModel").refresh(true);
			} catch (e) {
				Log.error("Exception in PilotAccept:onDeleteDefectPress function");
				this.handleException(e);
			}
		},

		onRejectPress: function(oEvent) {
			this.openDialog("PARejectDefectDialog", ".fragments.fs.pilot.");
		},
		onPARejctDefectDialogClose: function() {
			this.closeDialog("PARejectDefectDialog");
		},
		onPARejctDefectDialogReject: function(oEvent) {
			this.onPressSignOffConfirm(oEvent, "R");
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 * @returns
		 */
		onPresSignOff: function(oEvent) {
			try {
				var sNextIndex = -1;
				var oList = this.getModel("paModel").getProperty("/masterList");
				for (var i = 0; i < oList.length; i++) {
					if (!oList[i].data.reviewd && oList[i].reftyp !== "OTHERS") {
						sNextIndex = i;
						break;
					}
				}
				if (sNextIndex >= 0) {
					this._fnNavToDetail("/masterList/" + sNextIndex);
					return;
				}
				this.onPressSignOffPreflightDone(oEvent); //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
			} catch (e) {
				Log.error("Exception in onPresSignOff function");
			}
		},

		onLimitationItemPress: function(oEvent) {
			try {
				this.openDialog("ADDLimitationDialog", ".fragments.fs.pilot.");
				var sContext = oEvent.getSource().getBindingContext("paModel");
				this.fnLoadAddLimitationDetail(sContext);
			} catch (e) {
				Log.error("Exception in onLimitationItemPress function");
			}
		},
		onADDLimitationItemPress: function(oEvent) {
			try {
				this.openDialog("ADDLimitationDialog", ".fragments.fs.pilot.");
				var sContext = oEvent.getSource().getBindingContext("paModel");
				this.fnLoadAddLimitationDetail(sContext);
			} catch (e) {
				Log.error("Exception in onADDLimitationItemPress function");
			}
		},

		onDefectsDetailsPress: function(oEvent) {
			var sObject = oEvent.getSource().getBindingContext("paModel").getObject();
			this.getRouter().navTo("CosDefectsSummary", {
				JobId: sObject.jobid,
				Flag: "N"
			});
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
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 * @param oEvent
		 */
		_onObjectMatched: function(oEvent) {
			try {

				this.getModel("paModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("paModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				// this.getModel("paModel").setProperty("/enableSign", true);
				// this.getModel("paModel").setProperty("/masterList", []);
				// this.getModel("paModel").setProperty("/confirm/signOffOption", []);
				// this.getModel("paModel").setProperty("/confirm/chk1", false);
				// this.getModel("paModel").setProperty("/confirm/chk2", false);
				this.getModel("paModel").setData(this.fnCreateData());
				this.getModel("paModel").refresh();
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
			//	oPrmJobDue.filter = "FLAG EQ O AND CAPID EQ " + sContext.getObject().CAPID + " AND JOBID EQ " + sContext.getObject().JOBID;
			oPrmJobDue.filter = "FLAG" + FilterOpEnum.EQ + "O" + "&CAPID" + FilterOpEnum.EQ + sContext.getObject().CAPID + "&JOBID" +
				FilterOpEnum.EQ + sContext.getObject().JOBID;
			oPrmJobDue.error = function() {};
			oPrmJobDue.success = function(oData) {
				this.getModel("paModel").setProperty(sContext.getPath() + "/ADDLimit", oData.results.length > 0 ? oData.results[0] : {});
				this.getModel("paModel").refresh();
				this.getDialog("ADDLimitationDialog").bindElement({
					path: sContext.getPath(),
					model: "paModel"
				});

			}.bind(this);
			// ajaxutil.fnRead(this.getResourceBundle().getText("REPLROLESVC"), oPrmJobDue); //Teck Meng 27/11/2020 09:30
			ajaxutilNew.fnRead(this.getResourceBundle().getText("ADDOVERVIEWSVC"), oPrmJobDue); //Teck Meng 27/11/2020 09:30
		},
		onSerialNoPress: function(oEvent) {
			try {
				var oStation = oEvent.getParameter("oSource").getParent().getBindingContext("paModel").getObject();
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stnmid eq " + oStation.STNMID + " and stnsid eq " + oStation.STNSID +
					" and ADPID eq " + oStation.ADPID + " and adpflag eq S";
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.getModel("paModel").setProperty("/srnos", oData.results);
					this.getModel("paModel").refresh();
					this.openDialog("SerialNosDialog", ".fragments.pilot.");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("WEAPONSERNRSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in onSerialNoPress function");
			}
		},
		onSerialNoOkClose: function() {
			try {
				this.closeDialog("SerialNosDialog");
			} catch (e) {
				Log.error("Exception in onSerialNoOkClose function");
			}
		},
		_getPDSLists: function() {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				// oParameter.filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("paModel").getProperty(
				// 	"/srvtid") + " and TAILID eq " + this.getTailId();
				oParameter.filter = "REFID=" + this.getAircraftId() +
					"&SRVTID=" + this.getModel("paModel").getProperty("/srvtid") +
					"&TAILID=" + this.getTailId();
				oParameter.success = function(oData) {
					this.getModel("paModel").setProperty("/masterList", oData.results);
					this.getModel("paModel").refresh();
					if (oData.results.length >= 0) {
						this.fnGetAllData();
					}
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("PILOTACCEPTANCESVCHEL"), oParameter);
			} catch (e) {
				Log.error("Exception in _getPDSLists function");
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
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_getSortie: function() {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				//	oParameter.filter = "TAILID EQ '" + this.getTailId() + "' and FLAG eq 'FS'";
				oParameter.filter = "TAILID" + FilterOpEnum.EQ + this.getTailId() + "&FLAG" + FilterOpEnum.EQ + "FS"; // + sSrvIdFilter;
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T1_MCARD");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/sortList", oData.results);
					this.getModel("paModel").refresh();
					this._fnNavToDetail("/masterList/0");
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("SORTIEMONSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getSortie function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_getReplenishmentDetails: function() {
			try {
				var oParameter = {};
				// var filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("paModel").getProperty("/srvtid") +
				// 	" and TAILID eq " + this.getTailId() +
				// 	" and STEPID eq S_RE";
				var filter = "REFID=" + this.getAircraftId() + "&SRVTID=" + this.getModel("paModel").getProperty("/srvtid") +
					"&TAILID=" + this.getTailId() +
					"&STEPID=S_RE";
				oParameter.error = function() {};
				oParameter.filter = filter;
				oParameter.success = function(oData) {
					this.fnSetReplData(oData);
					this._getRTTasks();
					this._getTasks();
					this._getCreatedTasks();
					// this._getFuelExtTanks();//Teck Meng change on 25/11/2020 13:00 
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("REPLENISHMENTSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getReplenishmentDetails function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oData
		 */
		fnSetReplData: function(oData) {
			var sIndex = this._fnGetIndexById("T6_FLC");
			this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", "");
			this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
			this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
			this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/repl", {});
			this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/repl/fuel", []);
			this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/repl/tire", []);
			this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/repl/oil", []);
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
				this.getModel("paModel").getProperty("/masterList/" + sIndex + "/data/repl/" + sPath).push(oItem);
			}.bind(this));
			this.getModel("paModel").refresh();
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_getFuelExtTanks: function() {
			try {

				var oParameter = {};
				var filter = "REFID eq " + this.getAircraftId() + " and SRVTID eq " + this.getModel("paModel").getProperty("/srvtid") +
					" and TAILID eq " + this.getTailId() +
					" and STEPID eq S_RE";
				oParameter.error = function() {};
				oParameter.filter = filter; //"REFID eq AIR_10 and SRVID eq  and TAILID eq TAIL_1015";
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T6_FLC");
					var oFules = this.getModel("paModel").getProperty("/masterList/" + sIndex + "/data/repl/fuel").concat(oData.results);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/repl/fuel", oFules);
					this.getModel("paModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("REPLROLESVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getFuelExtTanks function");
			}
		},
		/** 
		 * 
		 * @constructor 
		 */
		_getTasks: function() {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq S_FT and srvtid eq " + this.getModel("paModel").getProperty(
					"/srvtid") + " and PDSFLAG eq 'P'";
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T6_FLC");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/ft", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("FTSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getTasks function");
			}
		},
		_getCreatedTasks: function() {
			try {

				var oParameter = {};
				oParameter.error = function() {};
				// oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq S_CT and srvtid eq " + this.getModel("paModel").getProperty(
				// 	"/srvtid");
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId() + FilterOpEnum.AND + "stepid" + FilterOpEnum.EQ + "S_CT" +
					FilterOpEnum.AND + "srvtid" + FilterOpEnum.EQ + this.getModel("paModel").getProperty(
						"/srvtid"); // Phase 2 Changes 
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T6_FLC");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/ct", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETFSTASKSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getCreatedTasks function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 * @param sFilter
		 * @param sTab
		 */
		_getRTTasks: function(sFilter, sTab) {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "refid eq " + this.getAircraftId() + " and srvtid eq " + this.getModel("paModel").getProperty(
					"/srvtid") + " and TAIL_ID eq " + this.getTailId() + " and stepid eq S_RT";
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T6_FLC");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/rt", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("RT2SVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getRTTasks function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_getFLyReq: function() {
			try {

				var oParameter = {};
				oParameter.error = function() {};
				//	oParameter.filter = "ftype eq S and tailid eq " + this.getTailId(); //Change by Teck Meng on 25/11/2020 11:30
				oParameter.filter = "ftype" + FilterOpEnum.EQ + "S" + FilterOpEnum.AND + "tailid" + FilterOpEnum.EQ + this.getTailId();
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T5_FREQ");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/flyReq", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);
				// ajaxutil.fnRead(this.getResourceBundle().getText("AH4STATUSSVC"), oParameter);//Change by Teck Meng on 25/11/2020 11:30
				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETFLYREQSVC"), oParameter); //Change by Teck Meng on 25/11/2020 11:30
			} catch (e) {
				Log.error("Exception in _getFLyReq function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_getJobDetails: function() {
			try {
				var that = this,
					oParameter = {};
				oParameter.filter = "CTYPE" + FilterOpEnum.EQ + "ALL&tailid" + FilterOpEnum.EQ + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					oData.results = this.fnDueJob(oData.results);
					var sIndex = this._fnGetIndexById("T9_JDUE");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/dueJobs", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(that.getResourceBundle().getText("GETSERLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getDueSoonJobDetails function");
				this.handleException(e);
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oData
		 * @returns
		 */
		fnDueJob: function(oData) {
			for (var i = oData.length - 1; i >= 0; i--) {
				if ((parseInt(oData[i].DUEIN) > 5 && oData[i].UM === "DAYS") || (parseInt(oData[i].DUEIN) > 10 && oData[i].UM !== "DAYS")) {
					oData.splice(i, 1);
				}
			}
			return oData;
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_getOutstandingJob: function() {
			try {
				var oParameter = {};
				oParameter.filter = "jobty" + FilterOpEnum.EQ + "Z&tailid" + FilterOpEnum.EQ + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T8_OJOBS");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/outJobs", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("DEFECTJOBSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getOutstandingJob function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_getPastMonthDefects: function() {
			try {
				var oParameter = {};
				//	oParameter.filter = "jobty eq pd and tailid eq " + this.getTailId();
				oParameter.filter = "jobty" + FilterOpEnum.EQ + "pd" + FilterOpEnum.AND + "tailid" + FilterOpEnum.EQ + this.getTailId(); // Phase 2 Changes
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T10_PASTD");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/pastDef", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("FSDEFECTJOBSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getPastMonthDefects function");
				this.handleException(e);
			}
		},
		/** 
		 * Pending Approvals //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_getPendingApprovals: function() {
			try {

				var oParameter = {};
				//	oParameter.filter = "AIRID eq " + this.getAircraftId() + " and TAILID eq " + this.getTailId();
				oParameter.filter = "AIRID" + FilterOpEnum.EQ + this.getAircraftId() + "&TAILID" + FilterOpEnum.EQ + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T2_PAPPR");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/appr", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("APPROVALSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getPendingApprovals function");
			}
		},
		/** 
		 * Limitation //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_fnLimitationsGet: function() {
			try {
				var oPrmJobDue = {};
				oPrmJobDue.filter = "CAPTY eq L and AIRID eq " + this.getAircraftId() + " and tailid eq " + this.getTailId();
				oPrmJobDue.filter = "CAPTY" + FilterOpEnum.EQ + "L&AIRID" + FilterOpEnum.EQ + this.getAircraftId() + "&tailid" + FilterOpEnum.EQ +
					this.getTailId();
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var sIndex = this._fnGetIndexById("T3_LIMIT");
					// oData.results[0].CAPTY = "A";
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/addLimit", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETADDLIMITATIONSPDSICSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnLimitationsGet function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_fnADDGet: function() {
			try {
				var oPrmJobDue = {};
				//	oPrmJobDue.filter = "CAPTY eq A and AIRID eq " + this.getAircraftId() + " and tailid eq " + this.getTailId();
				oPrmJobDue.filter = "CAPTY" + FilterOpEnum.EQ + "A&AIRID" + FilterOpEnum.EQ + this.getAircraftId() + "&tailid" + FilterOpEnum.EQ +
					this.getTailId();
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var sIndex = this._fnGetIndexById("T4_ADD");
					var sMarks = this._fnCreateMarks(oData);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/marks", sMarks);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/add", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETADDLIMITATIONSPDSICSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnADDGet function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_getTrailMod: function() {
			try {
				var oParameter = {};
				//		oParameter.filter = "tailid eq " + this.getTailId();
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T11_TMOD");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", oData.results.length);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/trailMod", oData.results);
					this.getModel("paModel").refresh();
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("TRAILMONSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getTrailMod function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @constructor 
		 */
		_getWeaponConfig: function() {
			try {
				var oParameter = {};
				oParameter.filter = "airid eq " + this.getAircraftId() + " and tailid eq " + this.getTailId() + " and srvtid eq " + this.getModel(
					"paModel").getProperty("/srvtid");
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var sIndex = this._fnGetIndexById("T7_WCONF");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/count", "");
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data", {});
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/reviewd", oData.results.length > 0 ? false : true);
					this.getModel("paModel").setProperty("/masterList/" + sIndex + "/data/stns", oData.results);
					this.getModel("paModel").refresh();
					// this._fnNavToDetail("/masterList/0");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("WEAPONSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getWeaponConfig function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * Sortie monitoring
		 * @constructor 
		 * @param sJobId
		 * @param sSORNO
		 */
		_fnSortieMonitoringDetailsGet: function(sJobId, sSORNO) {
			try {
				var oPrmTD = {};
				//	oPrmTD.filter = "TAILID eq " + this.getTailId() + " AND FLAG EQ D AND JOBID EQ " + sJobId + " AND SORNO EQ " + sSORNO;
				oPrmTD.filter = "TAILID" + FilterOpEnum.EQ + this.getTailId() + "&FLAG" + FilterOpEnum.EQ + "D&JOBID" + FilterOpEnum.EQ + sJobId +
					"&SORNO" + FilterOpEnum.EQ + sSORNO;
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					this.getView().setModel(oModel, "SortiDetails");
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETSORTIAISVC"), oPrmTD);
			} catch (e) {
				Log.error("Exception in _fnSortieMonitoringDetailsGet function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @param oEvent
		 * @param sign
		 */
		onPressSignOffPreflightDone: function(oEvent, sign) {
			this.getModel("paModel").setProperty("/confirm/pfreq", false);
			this.getModel("paModel").refresh();

			var oDialog = this.openDialog("SignOffConfirmDialog", ".fragments.fs.pilot.");
			oDialog.bindElement({
				path: "/confirm",
				model: "paModel"
			});
		},

		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 */
		onPressSignOffClose: function() {
			this.closeDialog("SignOffConfirmDialog");
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * Confirm signoff
		 */
		onPressSignOffConfirm: function() {
			try {
				var sAction = this.getModel("paModel").getProperty("/confirm/pfreq"); //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				// var oPayloads = this.getModel("paModel").getProperty("/masterList");//Teck Meng change on 27/11/2020 13:00 AH Issue 1044,1043
				var oPayloads = JSON.parse(JSON.stringify(this.getModel("paModel").getProperty("/masterList"))); //Teck Meng change on 27/11/2020 13:00 AH Issue 1044,1043
				oPayloads.forEach(function(oItem) {
					oItem.value = oItem.data.reviewd ? 1 : 0;
					oItem.pfreq = sAction ? "X" : ""; // X FOR POST FLIGHT DONE  '' FOR NOT REQ//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
					delete oItem.data;
				});
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.onNavBack();
				}.bind(this);
				oParameter.activity = 4;
				ajaxutilNew.fnCreate(this.getResourceBundle().getText("PILOTACCEPTANCESVCHEL"), oParameter, oPayloads, "ZRM_FS_PA", this);
				this.closeDialog("SignOffConfirmDialog");
			} catch (e) {
				Log.error("Exception in onPressSignOffConfirm function");
			}
		},
		/** 
		 * //Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
		 * @returns
		 */
		fnCreateDefect: function() {
			try {
				var oPayloads = this.getModel("paModel").getProperty("/defects");
				if (oPayloads.length === 0) {
					return;
				}
				oPayloads.forEach(function(oItem) {
					oItem.astid = this.getModel("paModel").getProperty("/srvable");
					oItem.fair = oItem.astid === "AST_S" ? "N" : oItem.fair;
				}.bind(this));
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function() {
					this.closeDialog("PARejectDefectDialog");
					this.onNavBack();
				}.bind(this);
				ajaxutil.fnCreate(this.getResourceBundle().getText("PILOTDEFECTF16SVC"), oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in PilotUpdate:fnCreateDefect function");
				this.handleException(e);
			}
		},
		_fnGetIndexById: function(sId) {
			var sIndex = -1;
			this.getModel("paModel").getProperty("/masterList").forEach(function(oItem, oIndx) {
				if (oItem.ddid === sId) {
					sIndex = oIndx;
				}
			}.bind(this));
			this.getModel("paModel").setProperty("/setItem", sIndex);
			this.getModel("paModel").refresh();
			return sIndex;
		},
		_fnNavToDetail: function(sPath) {
			var oData = this.getModel("paModel").getProperty(sPath);
			var viewId = this.createId(oData.ddid);
			this.getSplitAppObj().toDetail(viewId);
			this.getView().byId(viewId).bindElement({
				path: sPath + "/data",
				model: "paModel"
			});
			this.getModel("paModel").setProperty("/selItem", oData.ddid);
			this.getModel("paModel").refresh();
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
			var oCanvas = document.getElementById("myPACanvas"); //Teck Meng 04/12/2020 11:15
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

		fnCreateData: function() {
			var oPayload = {
				"srvtid": this.getModel("paModel").getProperty("/srvtid"),
				"stepid": this.getModel("paModel").getProperty("/stepid"),
				"selItem": "",
				"enableSign": true,
				"addViewSel": "DEA_T",
				"masterList": [],
				"srvable": "AST_US",
				"yn": [{
					"text": "Yes",
					"key": "Y"
				}, {
					"text": "No",
					"key": "N"
				}],
				"srvStates": [{
					"text": "Serviceable (S)",
					"key": "AST_S"
				}, {
					"text": "Unserviceable (US)",
					"key": "AST_US"
				}],
				"confirm": {
					"signOffOption": [],
					"selSignOff": {},
					"chk1": false,
					"chk2": false,
					"sgEnable": false
				},
				"defects": [{
					"tailid": this.getTailId(),
					"jobid": null,
					"fr_no": null,
					"sgusr": null,
					"astid": "AST_US",
					"fair": "N",
					"srvtid": this.getModel("paModel").getProperty("/srvtid"),
					"stepid": this.getModel("paModel").getProperty("/stepid"),
					"jobdesc": null,
					"fstat": null,
					"jobty": "",
					"jstat": "",
					"symbol": "",
					"purpose": "",
					"srvid": ""
				}],
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
			};
			return oPayload;
		}

	});
});