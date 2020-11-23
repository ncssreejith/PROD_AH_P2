sap.ui.define([
	"./BaseController",
	"../util/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log",
	"sap/ui/model/json/JSONModel",
	"../util/html2pdfbundle"
], function(BaseController, dataUtil, Fragment, FieldValidations, ajaxutil, formatter, Log, JSONModel, html2pdfbundle) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for Engine
	 *   1. Purpose for this file is to show the  engine details
	 *	Note: multi deimension chart is set based on the ux.
	 * IMPORTANT : Must give documentation for all functions
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.Engine", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				this.getRouter().getRoute("Engine").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in Engine:onInit function");
				this.handleException(e);
			}
		},

		onScheduleLinkPress: function() {
			try {
				this.getRouter().navTo("ESScheduleJobCreate", {
					ENGID: this.getModel("oEngineModel").getProperty("/headerDetails/ENGID"),
					SN: this.getModel("oEngineModel").getProperty("/headerDetails/SERIAL"),
					ENGTY: this.getModel("oEngineModel").getProperty("/headerDetails/ENGTY")
				});
			} catch (e) {
				Log.error("Exception in Engine:onScheduleLinkPress function");
				this.handleException(e);
			}
		},
		onSchedule2LinkPress: function() {
			try {
				this.getRouter().navTo("ESScheduleJobCreate", {
					ENGID: this.getModel("oEngineModel").getProperty("/header2Details/ENGID"),
					SN: this.getModel("oEngineModel").getProperty("/header2Details/SERIAL"),
					ENGTY: this.getModel("oEngineModel").getProperty("/header2Details/ENGTY")
				});
			} catch (e) {
				Log.error("Exception in Engine:onSchedule2LinkPress function");
				this.handleException(e);
			}
		},

		onDefectsDetailsPress: function(oEvent) {
			var oSource = oEvent.getSource();
			var sESJOBID = oSource.getBindingContext("oEngineModel").getObject().ESJOBID;
			try {
				this.getRouter().navTo("CosScheduleSummary", {
					ESJOBID: sESJOBID
				});
			} catch (e) {
				Log.error("Exception in Engine:onDefectsDetailsPress function");
				this.handleException(e);
			}
		},
		onETFEdit: function(oEvent) {
			var oSource = oEvent.getSource();
			var oObject = oSource.getBindingContext("oEngineModel").getObject();
			if (this.getModel("oEngineModel").getProperty(
					"/headerDetails/ETFEDIT")) {
				this.fnSubmitETFSignOff(oObject);
			}
			this.getModel("oEngineModel").setProperty("/headerDetails/ETFEDIT", !this.getModel("oEngineModel").getProperty(
				"/headerDetails/ETFEDIT"));

		},
		/** 
		 * On OOP job delete
		 * @param oEvent
		 */
		onDefectsDeleteDetailsPress: function(oEvent) {
			var oSource = oEvent.getSource();
			var oObject = oSource.getBindingContext("oEngineModel").getObject();
			try {
				this.fnSubmitDeleteJobSignOff(oObject);
			} catch (e) {
				Log.error("Exception in Engine:onDefectsDeleteDetailsPress function");
				this.handleException(e);
			}
		},

		/** 
		 * Update to ESCJOBS for deletion
		 */
		fnSubmitDeleteJobSignOff: function(oObject) {
			try {
				var sPath = this.getResourceBundle().getText("DELESJOBSSVC");
				var oData = [];
				var oParameter = {};
				oParameter.activity = 2;

				oObject.J_FLAG = "X";
				oData.push(oObject);

				oParameter.error = function() {};
				oParameter.success = function() {
					sap.m.MessageToast.show("Tables updated");
					this._getEngScheule(oObject.ENGNO, oObject.SN);
				}.bind(this);
				if (oData.length > 0) {
					ajaxutil.fnUpdate(sPath, oParameter, oData, "ZRM_WDNS_H", this);
				} else {
					sap.m.MessageToast.show("No table are changed");
				}
			} catch (e) {
				Log.error("Exception in Engine:fnSubmitDeleteJobSignOff function");
				this.handleException(e);
			}
		},
		/** 
		 * Update to ESCJOBS for deletion
		 */
		fnSubmitETFSignOff: function(oObject) {
			try {
				var sPath = this.getResourceBundle().getText("EHSERSVC");
				var oData = [];
				var oParameter = {};
				oParameter.activity = 2;

				// oObject.J_FLAG = "X";
				oData.push(oObject);

				oParameter.error = function() {};
				oParameter.success = function() {
					sap.m.MessageToast.show("Tables updated");
					this._getEngPowerCheck(oObject.ENGID, oObject.ENGNO);
				}.bind(this);
				if (oData.length > 0) {
					ajaxutil.fnUpdate(sPath, oParameter, oData, "ZRM_WDNS_H", this);
				} else {
					sap.m.MessageToast.show("No table are changed");
				}
			} catch (e) {
				Log.error("Exception in Engine:fnSubmitDeleteJobSignOff function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		//1.on press of the drop down displays the serial nos
		onDropDownPress: function(oEvent) {
			try {
				var sFragName = "avmet.ah.view.ah.engine.subview.serialNumbers",
					source = oEvent.getSource();
				Fragment.load({
					name: sFragName,
					controller: this
				}).then(function(oPopover) {
					this._oPopoverEdit = oPopover;
					this.getView().addDependent(this._oPopoverEdit);
					this._oPopoverEdit.openBy(source);
				}.bind(this));
			} catch (e) {
				Log.error("Exception in Engine:onDropDownPress function");
				this.handleException(e);
			}
		},
		onPowerCheckPress: function(oEvent) {
			try {
				if (this.getModel("oEngineModel").getProperty("/displayPowerLineChart")) {
					this.getModel("oEngineModel").setProperty("/displayPowerLineChart", false);
				} else {
					this.getModel("oEngineModel").setProperty("/displayPowerLineChart", true);
				}
				// var sFragName = "avmet.ah.view.ah.engine.subview.PowerCheckLineChart",
				// 	source = oEvent.getSource();
				// Fragment.load({
				// 	name: sFragName,
				// 	controller: this
				// }).then(function(oPopover) {
				// 	this._oPopoverEdit = oPopover;
				// 	this.getView().addDependent(this._oPopoverEdit);
				// 	this._oPopoverEdit.setModel(this.getModel("engine1Chart"));
				// 	this._oPopoverEdit.openBy(source);
				// }.bind(this));
			} catch (e) {
				Log.error("Exception in Engine:onPowerCheckPress function");
				this.handleException(e);
			}
		},
		/** 
		 * Reset cyclic count
		 */
		onResetEngCycLog: function() {
			try {
				this.getRouter().navTo("AddEngCyclicLog", {
					engid: this.getModel("oEngineModel").getProperty("/headerDetails/ENGID"),
					tailid: this.getTailId(),
					last: "X"
				});
			} catch (e) {
				Log.error("Exception in Engine:onResetEngCycLog function");
				this.handleException(e);
			}
		},
		/** 
		 * Reset cyclic count
		 */
		onResetEng2CycLog: function() {
			try {
				this.getRouter().navTo("AddEngCyclicLog", {
					engid: this.getModel("oEngineModel").getProperty("/header2Details/ENGID"),
					tailid: this.getTailId(),
					last: "X"
				});
			} catch (e) {
				Log.error("Exception in Engine:onResetEngCycLog function");
				this.handleException(e);
			}
		},
		/** 
		 * Add cyclic count
		 */
		onAddEngCycLog: function() {
			try {
				this.getRouter().navTo("AddEngCyclicLog", {
					engid: this.getModel("oEngineModel").getProperty("/headerDetails/ENGID"),
					tailid: this.getTailId(),
					last: " "
				});
			} catch (e) {
				Log.error("Exception in Engine:onAddEngCycLog function");
				this.handleException(e);
			}
		},
		/** 
		 * Add engine oil
		 */
		onAddEngOilLog: function() {
			try {
				//Check engine hours since last top up
				if (this.fnDateEngineHrsDiff("1")) {
					// sap.m.MessageBox.warning("Last top up is less than 10hrs.", {
					// 	actions: [sap.m.MessageBox.Action.OK],
					// 	emphasizedAction: sap.m.MessageBox.Action.OK,
					// 	onClose: function(sAction) {
					// 		if (sAction === "OK") {
								this.getRouter().navTo("AddEngOilLog", {
									engid: this.getModel("oEngineModel").getProperty("/headerDetails/ENGID"),
									tailid: this.getTailId(),
									SFLAG: "X"
								});
					// 		}
					// 	}.bind(this)
					// });
				} else {
					this.getRouter().navTo("AddEngOilLog", {
						engid: this.getModel("oEngineModel").getProperty("/headerDetails/ENGID"),
						tailid: this.getTailId(),
						SFLAG: " "
					});
				}
			} catch (e) {
				Log.error("Exception in Engine:onAddEngOilLog function");
				this.handleException(e);
			}
		},
		/** 
		 * Add cyclic count
		 */
		onAddEng2CycLog: function() {
			try {
				this.getRouter().navTo("AddEngCyclicLog", {
					engid: this.getModel("oEngineModel").getProperty("/header2Details/ENGID"),
					tailid: this.getTailId(),
					last: " "
				});
			} catch (e) {
				Log.error("Exception in Engine:onAddEngCycLog function");
				this.handleException(e);
			}
		},
		/** 
		 * Add engine oil
		 */
		onAddEng2OilLog: function() {
			try {
				//Check engine hours since last top up
				if (this.fnDateEngineHrsDiff("2")) {
				// 	sap.m.MessageBox.warning("Last top up is less than 10hrs.", {
				// 		actions: [sap.m.MessageBox.Action.OK],
				// 		emphasizedAction: sap.m.MessageBox.Action.OK,
				// 		onClose: function(sAction) {
				// 			if (sAction === "OK") {
								this.getRouter().navTo("AddEngOilLog", {
									engid: this.getModel("oEngineModel").getProperty("/header2Details/ENGID"),
									tailid: this.getTailId(),
									SFLAG: "X"
								});
					// 		}
					// 	}.bind(this)
					// });
				} else {
					this.getRouter().navTo("AddEngOilLog", {
						engid: this.getModel("oEngineModel").getProperty("/header2Details/ENGID"),
						tailid: this.getTailId(),
						SFLAG: " "
					});
				}

			} catch (e) {
				Log.error("Exception in Engine:onAddEngOilLog function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		/** 
		 * On nav to this page, load data
		 * @constructor 
		 */
		_onObjectMatched: function(oEvent) {
			try {

				var that = this;
				that.getView().setModel(new JSONModel({}), "oViewModel");
				// var oModel = dataUtil.createJsonModel({
				// 	lineChart: {}
				// });
				// this.getView().setModel(oModel, "engine1Chart");

				this.LastRepEngine1Hours = 999;
				this.LastRepEngine2Hours = 999;
				// this.LastEngine1Hours = ;

				var oEngineModel = dataUtil.createJsonModel({
					EngCyclicLife: [],
					EngPowerCheck: [],
					displayPowerLineChart: false
				});
				this.getView().setModel(oEngineModel, "oEngineModel");

				this.getModel("oEngineModel").setProperty("/ENGID", oEvent.getParameter("arguments").ENGID);
				this.getModel("oEngineModel").setProperty("/navType", oEvent.getParameter("arguments").navType);

				if (!this.fnCheckTailAvail()) {
					this.getModel("avmetModel").setProperty("/airSel/tailid", "NA");
					this.getModel("avmetModel").setProperty("/airSel/tailno", "NA");
					this.getModel("avmetModel").refresh(true);
				}
				this._getHeader();

			} catch (e) {
				Log.error("Exception in Engine:_onObjectMatched function");
				this.handleException(e);
			}
		},
		/** 
		 * Get engine header data
		 * @constructor 
		 */
		_getHeader: function() {
			try {
				var
					oEngineModel = this.getView().getModel("oEngineModel"),
					oParameter = {};
				var sEngID = oEngineModel.getProperty("/ENGID");
				if (sEngID && sEngID !== " ") {
					oParameter.filter = "ENGID eq '" + sEngID + "'";
				} else {
					oParameter.filter = "tailid eq '" + this.getTailId() + "'";
				}
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results && oData.results.length > 0) {
						oData.results.forEach(function(oItem) {
							if (oItem.ENGNO === null) {
								oItem.ENGNO = "1";
							}
							oEngineModel.setProperty("/" + (oItem.ENGNO === "2" ? "header2Details" : "headerDetails"), oItem);

							this._getEngPowerCheck(oItem.ENGID, oItem.ENGNO);
							this._getEngineOilRepl(oItem.ENGID, oItem.ENGNO);
							this._getEngCyclicLife(oItem.ENGID, oItem.ENGNO);
							this._getEngScheule(oItem.ENGNO, oItem.SERIAL);

						}.bind(this));

					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("ENGINEDISSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in Engine:_getHeader function");
				this.handleException(e);
			}
		},

		/** 
		 * Get Power check data
		 * @constructor 
		 */
		_getEngPowerCheck: function(sEngID, iEngine) {
			try {
				var that = this,
					oEngineModel = this.getView().getModel("oEngineModel"),
					oParameter = {};
				// var sEngID = oEngineModel.getProperty("/ENGID");
				if (sEngID) {
					oParameter.filter = "ENGID eq " + sEngID + " and FLAG eq P and tailid eq " + this.getTailId();
				} else {
					oParameter.filter = "tailid eq " + this.getTailId() + " and FLAG eq P";
				}
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results && oData.results.length) {
						//sort by date
						// oData.results.forEach(function(oItem) {
						// 	oItem.ID = that.fnDateTime(oItem.SPDT, oItem.SPTM); //, 
						// });
						oData.results.sort(function(b, a) {
							return parseInt(a.SRVID.split("_")[1]) - parseInt(b.SRVID.split("_")[1]);
						});
						var bFound = false;
						oData.results.forEach(function(oItem) {
							if (!bFound && oItem.CHKRN === "2") {
								oItem.Special = true;
								bFound = true;
								oItem.minValue = parseFloat(JSON.parse(JSON.stringify(
									oItem.ETF ? oItem.ETF : 0)));
							}
						});
						if (oData) {
							if (iEngine === "1") {
								oEngineModel.setProperty("/EngPowerCheck", oData.results);
								this._setData(iEngine);
							} else {
								oEngineModel.setProperty("/EngPowerCheck2", oData.results);
								this._setData(iEngine);
							}
							//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
							oEngineModel.refresh();
						}
						// oEngineModel.setProperty("/EngPowerCheck", oData.results);
						// this._setData();
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("EHSERSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in Engine:_getEngPowerCheck function");
				this.handleException(e);
			}
		},
		/** 
		 * Get Engine Oil replishment data
		 * @constructor 
		 * @param sEngID
		 * @param iEngine
		 */
		_getEngineOilRepl: function(sEngID, iEngine) {
			try {
				var oEngineModel = this.getView().getModel("oEngineModel");
				// 	sEngId1 = oEngineModel.getProperty("/headerDetails/ENGID"),
				// 	sEngId = sEngId1 === "" ? this.getEngine() : sEngId1;
				var oParameter = {};
				oParameter.filter = "engid eq " + sEngID + " AND sflag eq S AND tailid eq " + this.getTailId();
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					var that = this;
					if (oData && oData.results && oData.results.length && oData.results.length > 0) {
						//sort by date
						oData.results.forEach(function(oItem) {
							oItem.ID = that.fnDateTime(oItem.SPDT, oItem.SPTM); //, 
						});
						//sort by date
						oData.results.sort(function(a, b) {
							return new Date(b.ID).getTime() - new Date(a.ID).getTime();
						});

						if (iEngine === "1" || iEngine === null) {
							this.LastRepEngine1Hours = oData.results[0].ENGHR;
							oEngineModel.setProperty("/soapTableData", oData.results);
						} else {
							this.LastRepEngine2Hours = oData.results[0].ENGHR;
							oEngineModel.setProperty("/soapTableData2", oData.results);
						}
					}

				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("ENGSOAPSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in Engine:_getEngineOilRepl function");
				this.handleException(e);
			}
		},
		fnDateTime: function(sDate, sTime) {
			if (!sDate) {
				return " ";
			}
			if (!sTime) {
				return sDate;
			}
			return sDate + " " + sTime;
		},
		_getEngScheule: function(iEngine, sSerialNo) {
			try {
				var oEngineModel = this.getView().getModel("oEngineModel");
				var oParameter = {};
				// oParameter.filter = "SN eq " + sSerialNo;
				oParameter.filter = "CTYPE eq ENGINE and tailid eq " + this.getTailId() + " and SN eq " + sSerialNo;
				// oEngineModel.getProperty("/headerDetails/SERIAL");
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					var that = this;
					if (oData && oData.results && oData.results.length && oData.results.length > 0) {
						var aEng1 = [],
							aEng2 = [];
						//sort by date
						oData.results.forEach(function(oItem) {
							oItem.ID = that.fnDateTime(oItem.CREDT, oItem.CRETM);
							oItem.DUEIN = parseFloat(oItem.DUEIN);
						});

						oData.results.sort(function(a, b) {
							return new Date(b.ID).getTime() - new Date(a.ID).getTime();
						});

						oData.results.forEach(function(oItem) {
							if (that.getModel("oEngineModel").getProperty("/headerDetails/SERIAL") === oItem.SN) {
								aEng1.push(oItem);
							}
							if (that.getModel("oEngineModel").getProperty("/header2Details/SERIAL") === oItem.SN) {
								aEng2.push(oItem);
							}
						});

						// if (this.getModel("oEngineModel").getProperty("/headerDetails/SERIAL") === oData.results[0].SN) {
						oEngineModel.setProperty("/EngineSchedule", aEng1);
						// } 
						// if (this.getModel("oEngineModel").getProperty("/header2Details/SERIAL") === oData.results[0].SN) {
						oEngineModel.setProperty("/Engine2Schedule", aEng2);
						// }
					}
					// oEngineModel.setProperty("/EngineSchedule", oData.results);
				}.bind(this);
				// ajaxutil.fnRead(this.getResourceBundle().getText("DELESJOBSSVC"), oParameter);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETSERLOGSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in Engine:_getEngScheule function");
				this.handleException(e);
			}
		},

		/** 
		 * Get Engine Cyclic life data
		 * @constructor 
		 * @param sEngID
		 * @param iEngine
		 */
		_getEngCyclicLife: function(sEngID, iEngine) {
			try {
				var
					oEngineModel = this.getView().getModel("oEngineModel"),
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "FLAG eq L and TAILID eq " + this.getTailId() + " and ENGID eq " + sEngID;
				oParameter.success = function(oData) {
					if (oData && oData.results && oData.results.length) {
						
						oData.results.sort(function(b, a) {
							return parseInt(a.LOGID.split("_")[1]) - parseInt(b.LOGID.split("_")[1]);
						});
						
						// oData.results.sort(function(a, b) {
						// 	return b.LOGID - a.LOGID;
						// });

						if (iEngine === "1") {
							this.LastEngine1Hours = oData.results[0].TENGHR;
							oEngineModel.setProperty("/EngCyclicLife", oData.results);
						} else {
							this.LastEngine2Hours = oData.results[0].TENGHR;
							oEngineModel.setProperty("/EngCyclicLife2", oData.results);
						}
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("EHSERSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in Engine:_getEngCyclicLife function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		//  Get Method to get Reason for SOAP samplling
		//-------------------------------------------------------------
		/** 
		 * Calculate engine hours diff
		 * @param oItems
		 * @returns
		 */
		fnDateEngineHrsDiff: function(sEngNo) {
			var sDiff = 0;
			switch (sEngNo) {
				case "1":
					var sEngineHrs = this.LastEngine1Hours; //this.getModel("avmetModel").getProperty("/airutil/COL_13");
					if (this.LastRepEngine1Hours === "0" || !sEngineHrs) { //LastEngine1Hours
						return false;
					}

					sDiff = parseFloat(sEngineHrs) - parseFloat(this.LastRepEngine1Hours);
					break;
				case "2":
					sEngineHrs = this.LastEngine2Hours;//this.getModel("avmetModel").getProperty("/airutil/COL_14");
					if (this.LastRepEngine2Hours === "0" || !sEngineHrs) {
						return false;
					}

					sDiff = parseFloat(sEngineHrs) - parseFloat(this.LastRepEngine2Hours);
					break;
				default:
					return false;
			}

			return (sDiff < 10);
		},
		//2.Data for the chart 
		_setData: function(iEngine) {
			try {
				var oEngineModel = this.getView().getModel("oEngineModel");
				var aEngPowerCheck = {};
				if (iEngine === "1") {
					aEngPowerCheck = oEngineModel.getProperty("/EngPowerCheck");
				} else {
					aEngPowerCheck = oEngineModel.getProperty("/EngPowerCheck2");
				}
				var aXLabels = [];
				var aLowerLimit = [];
				var aUpperLimit = [];
				var aDataPoints = [];
				var aRedPoints = [];
				var aLDashPoints = [];
				var aUDashPoints = [];
				//Loop
				var aCopyPowerCheck = aEngPowerCheck;//JSON.parse(JSON.stringify(aEngPowerCheck));//aEngPowerCheck; //
				//Teck Meng change on 17/11/2020 13:00 AH Issue 1044,1043
				// aCopyPowerCheck.sort(function(a, b) {
				// 	return parseInt(a.SRVID.split("_")[1]) - parseInt(b.SRVID.split("_")[1]);
				// });
				aCopyPowerCheck.forEach(function(oItem) {
					if (oItem.CHKRN !== "1") {
						return;
					}
					
					var iULimit = parseInt(oItem.ULIMIT ? oItem.ULIMIT : 0) - 5;
					var iLLimit = parseInt(oItem.LLIMIT ? oItem.LLIMIT : 0) + 5;
					var iDiff = parseInt(oItem.TGTDIFF);
					if (iDiff > iULimit) { // upper limit
						oItem.ULimitFlag = true;
						// aRedPoints.push(iDiff);
						// aDataPoints.push(iDiff);
					}
					if (iDiff < iLLimit) { // lower limit
						oItem.LLimitFlag = true;
						// aRedPoints.push(iDiff);
						// aDataPoints.push(iDiff);
					}
					aXLabels.push(formatter.defaultDateFormatDisplay(oItem.BEGDA));

					aDataPoints.push(iDiff);
					aRedPoints.push(iDiff);

					aLDashPoints.push(iLLimit);
					aUDashPoints.push(iULimit);
					aLowerLimit.push(oItem.LLIMIT);
					aUpperLimit.push(oItem.ULIMIT);
				});

				var oModel, lineChartData = {
					// width:500,
					labels: aXLabels, // ["", "", "", "", ""],
					datasets: [{
							label: "Diff TGT",
							fill: false,
							lineTension: 0.1,
							backgroundColor: "rgba(75,192,192,0.4)",
							borderColor: "rgba(75,192,192,1)",
							borderCapStyle: 'butt',
							borderDash: [],
							borderDashOffset: 0.0,
							borderJoinStyle: 'miter',
							pointBorderColor: "rgba(75,192,192,1)",
							pointBackgroundColor: "rgba(75,192,192,1)",
							pointBorderWidth: 2,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: "rgba(75,192,192,1)",
							pointHoverBorderColor: "rgba(220,220,220,1)",
							pointHoverBorderWidth: 3,
							pointRadius: 10,
							pointStyle: 'crossRot',
							pointHitRadius: 5,
							data: aDataPoints, //[-3.5, 5, 16, 8.5, 12.5],
							spanGaps: false,
							showLine: false
						},
						// {
						// 	data: aRedPoints, //[20, 20, 20, 20, 20],
						// 	label: "Out",
						// 	borderColor: "red",
						// 	fill: false,
						// 	pointRadius: 10,
						// 	pointStyle: "crossRot",
						// 	showLine: false
						// }, 
						{
							data: aUpperLimit, //[20, 20, 20, 20, 20],
							label: "Upper Limit",
							borderColor: "red",
							fill: false
						}, {
							data: aLowerLimit, //[-15, -15, -15, -15, -15],
							label: "Lower Limit",
							borderColor: "blue",
							fill: false
						}, {
							data: aLDashPoints, //[20, 20, 20, 20, 20],
							label: "Limit",
							borderColor: "red",
							fill: false,
							borderDash: [5, 10]
						}, {
							data: aUDashPoints, //[20, 20, 20, 20, 20],
							label: "",
							borderColor: "red",
							fill: false,
							borderDash: [5, 10]
						}
					],
					options: {
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						},
						layout: {
							padding: {
								left: 150,
								right: 150,
								top: 150,
								bottom: 150
							}
						}
					}

				};
				oModel = dataUtil.createJsonModel({
					lineChart: lineChartData
				});
				// this.getView().getModel("engine1Chart");
				// oModel.setProperty("/lineChart", lineChartData);
				if (iEngine === "1") {
					this.getView().setModel(oModel, "engine1Chart");
				} else {
					this.getView().setModel(oModel, "engine2Chart");
				}
				oModel.refresh();
				// this.getView().byId("line_chart").invalidate();
			} catch (e) {
				Log.error("Exception in Engine:_setData function");
				this.handleException(e);
			}
		},

		onPrint: function(oEvent, id1, id2, id3) {
			var tabName = this.getSelectedTab();
			var engKey = this.getView().byId("itbEngines").getSelectedKey(),
				engText = this.getView().byId(engKey).getProperty("text"),
				engDetailKey = "",
				engDetailText = "";
			id1 = this.getView().byId(engKey).getContent()[0].getId();
			if (engKey.search("itfEng1") !== -1) {
				engDetailKey = this.getView().byId("itbEngine1").getSelectedKey();
				engDetailText = this.getView().byId(engDetailKey).getProperty("text");
				id2 = this.getView().byId(engDetailKey).getContent()[0].getId();
			} else {
				engDetailKey = this.getView().byId("itbEngine2").getSelectedKey();
				engDetailText = this.getView().byId(engDetailKey).getProperty("text");
				id2 = this.getView().byId(engDetailKey).getContent()[0].getId();
			}

			//oCanvase.style.width = ""
			tabName = engText + " - " + engDetailText;
			var html = "<html><body>";
			// <div  style='width:95%;'>";
			// html += "<div style='padding-left:3rem; padding-top:1rem;'>" + engText + "</div>";
			html = id1 !== undefined ? "<div style='width:95%;'>" + this.generateHtml(this, html, id1) + "</div>" : html;
			// html += "</div><div style='padding-left: 3rem;'>" + engDetailText + "</div>";
			// html += "<div style='padding:1rem;'>";
			html = id2 !== undefined ? this.generateHtml(this, html, id2) : html;
			// </div>
			html += "</body></html>";
			// 			{
			//   pagebreak: { mode: 'avoid-all', before: '#page2el' }
			// }
			html2pdf().from(html).set({
				margin: 0,
				filename: tabName + '.pdf',
				html2canvas: {
					scale: 2
				},
				pagebreak: {
					mode: 'avoid-all'
				},
				jsPDF: {
					orientation: 'landscape',
					unit: 'in',
					/*format: 'a0',*/
					compressPDF: true
				},
				mode: {
					avoidAll: 'avoid-all'
				}
			}).save();
		},
		onPrint2: function(id1, id2, id3) {
			var tabName = this.getSelectedTab();
			var html = "<html><body><div  style='width:95%;>";
			html = id1 !== undefined ? this.generateHtml(this, html, id1) : html;
			html += "</div><div style='padding: 0 3rem;'>" + tabName + "</div>";
			html += "<div style='padding:30px;'>";
			html = id2 !== undefined ? this.generateHtml(this, html, id2) : html;
			html += "</div></body></html>";
			html2pdf().from(html).set({
				margin: 0,
				filename: tabName + '.pdf',
				html2canvas: {
					scale: 2
				},
				jsPDF: {
					orientation: 'landscape',
					unit: 'in',
					/*format: 'a0',*/
					compressPDF: true
				}
			}).save();
		},
		fnDateTimeDiff: function(sDate) {
			var sDiff = 0;
			if (!sDate) {
				return "";
			}
			var sCurrentDate = new Date();
			sDiff = Math.abs(sCurrentDate - new Date(sDate)) / 36e5;
			return parseFloat(sDiff); // + " hrs";
		},
		/** 
		 * If tailid is available
		 * @returns
		 */
		fnCheckTailAvail: function() {
			return (this.getTailId() !== "NA");
		},
		getSelectedTab: function() {
			try {
				var tabTest = "";
				var oTab = this.getView().byId("itabEngine");
				oTab.getItems().forEach(function(item) {
					if (item.getId() === oTab.getSelectedKey()) {
						tabTest = item.getText();
						return false;
					}
				});
				return tabTest;
			} catch (e) {
				return "Print";
			}
		},

		generateHtml: function(that, html, id) {
			try {
				html += "<div style='padding:15px; page-break-before: always;'>";
				var oTarget1 = that.getView().byId(id);
				var $domTarget1 = oTarget1.$()[0];
				if ($domTarget1 !== undefined) {
					html += $domTarget1.innerHTML;
				}
				return html;
			} catch (e) {
				return null;
			}
		}
	});
});