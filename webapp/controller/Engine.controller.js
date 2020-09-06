sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
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
				this.getRouter().navTo("AHCosjobs", {
					State: "SCH"
				});
			} catch (e) {
				Log.error("Exception in Engine:onScheduleLinkPress function");
				this.handleException(e);
			}
		},

		onDefectsDetailsPress: function() {
			try {
				this.getRouter().navTo("RouteDefectSummaryADD");
			} catch (e) {
				Log.error("Exception in Engine:onDefectsDetailsPress function");
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
		 * Add cyclic count
		 */
		onAddEngOilLog: function() {
			try {
				this.getRouter().navTo("AddEngOilLog", {
					engid: this.getModel("oEngineModel").getProperty("/headerDetails/ENGID"),
					tailid: this.getTailId()
				});
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
		 * Add cyclic count
		 */
		onAddEng2OilLog: function() {
			try {
				this.getRouter().navTo("AddEngOilLog", {
					engid: this.getModel("oEngineModel").getProperty("/header2Details/ENGID"),
					tailid: this.getTailId()
				});
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

				var oEngineModel = dataUtil.createJsonModel({
					EngCyclicLife: [],
					EngPowerCheck: [],
					displayPowerLineChart: false
				});
				this.getView().setModel(oEngineModel, "oEngineModel");

				this.getModel("oEngineModel").setProperty("/ENGID", oEvent.getParameter("arguments").ENGID);
				this.getModel("oEngineModel").setProperty("/navType", oEvent.getParameter("arguments").navType);
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
							oEngineModel.setProperty("/" + (oItem.ENGNO === "2" ? "header2Details" : "headerDetails"), oItem);
							this._getEngPowerCheck(oItem.ENGID, oItem.ENGNO);
							this._getEngineOilRepl(oItem.ENGID, oItem.ENGNO);
							this._getEngCyclicLife(oItem.ENGID, oItem.ENGNO);
							this._getEngScheule();

						}.bind(this));

						//oEngineModel.setProperty("/headerDetails", oData.results[0]);
						//if (oData.results && oData.results.length > 1) { // Get Engine 2 data
						//	oEngineModel.setProperty("/header2Details", oData.results[1]);
						//	this._getEngPowerCheck(oData.results[1].ENGID, 2);
						//	this._getEngCyclicLife(oData.results[1].ENGID, 2);
						//	this._getEngineOilRepl(oData.results[1].ENGID, 2);
						//}
						//this._getEngPowerCheck(oData.results[0].ENGID, 1);
						//this._getEngineOilRepl(oData.results[0].ENGID, 1);
						//this._getEngCyclicLife(oData.results[0].ENGID, 1);
						//this._getEngScheule();
					}
				}.bind(this);
				ajaxutil.fnRead("/EngineDisSvc", oParameter);
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
				var
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

						if (oData) {
							if (iEngine === "1") {
								oEngineModel.setProperty("/EngPowerCheck", oData.results);
								this._setData(iEngine);
								// oEngineModel.setProperty("/soapTableData", oData.results);
							} else {
								oEngineModel.setProperty("/EngPowerCheck2", oData.results);
								this._setData(iEngine);
								// oEngineModel.setProperty("/soapTableData2", oData.results);
							}
						}
						// oEngineModel.setProperty("/EngPowerCheck", oData.results);
						// this._setData();
					}
				}.bind(this);
				ajaxutil.fnRead("/EHSERSvc", oParameter);
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
					// var oLabel = [],
					// 	Data = [];
					// for (var i = 0; i < oData.results.length; i++) {
					// 	var oTemp = oData.results[i].SPTM;
					// 	oData.results[i].SPTM = oTemp.substring(0, 5);
					// 	if (oData.results[i].SOAP === "") {
					// 		Data.push(oData.results[i].SRVAMT);
					// 		oLabel.push(oData.results[i].ENGHR);
					// 	}
					// }
					var that = this;
					if (oData && oData.results) {
						oData.results.forEach(function(oItem) {
							oItem.ID = that.fnDateTime(oItem.SPDT,oItem.SPTM); //, 
						});
						if (iEngine === "1") {
							oEngineModel.setProperty("/soapTableData", oData.results);
						} else {
							oEngineModel.setProperty("/soapTableData2", oData.results);
						}
					}
					// oEngineModel.setProperty("/Label", oLabel);
					// oEngineModel.setProperty("/Data", Data);
				}.bind(this);
				ajaxutil.fnRead("/EngSoapSvc", oParameter);
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
		_getEngScheule: function() {
			try {
				var oEngineModel = this.getView().getModel("oEngineModel");
				var oParameter = {};
				oParameter.filter = "CTYPE eq ENGINE and tailid eq " + this.getTailId();
				oParameter.error = function() {

				};
				oParameter.success = function(oData) {
					for (var i = 0; i < oData.results.length; i++) {
						var date1 = new Date(oData.results[i].JDUVL);
						var date2 = new Date();
						var DiffDate = date1.getTime() - date2.getTime();
						var DiffIndays = DiffDate / (1000 * 3600 * 24);
						oData.results[i].DUEIN = Math.round(DiffIndays);
					}
					oEngineModel.setProperty("/EngineSchedule", oData.results);
				}.bind(this);
				ajaxutil.fnRead("/EngSoapSvc", oParameter);
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
				var that = this,
					oEngineModel = this.getView().getModel("oEngineModel"),
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "FLAG eq L and TAILID eq " + this.getTailId() + " and ENGID eq " + sEngID;
				oParameter.success = function(oData) {
					if (oData && oData.results.length) {
						if (iEngine === "1") {
							oEngineModel.setProperty("/EngCyclicLife", oData.results);
							// if(this.getModel("oEngineModel").getProperty("/navType") === "X"){
							// 	this.onAddEngCycLog();
							// }
						} else {
							oEngineModel.setProperty("/EngCyclicLife2", oData.results);
						}
					}
				}.bind(this);
				ajaxutil.fnRead("/EHSERSvc", oParameter);
			} catch (e) {
				Log.error("Exception in Engine:_getEngCyclicLife function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		//  Get Method to get Reason for SOAP samplling
		//-------------------------------------------------------------

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
				var aLowerLimit = [];
				var aUpperLimit = [];
				var aDataPoints = [];
				var aRedPoints = [];
				var aLDashPoints = [];
				var aUDashPoints = [];
				aEngPowerCheck.forEach(function(oItem) {
					var iULimit = parseInt(oItem.ULIMIT ? oItem.ULIMIT : 0) - 5;
					var iLLimit = parseInt(oItem.LLIMIT ? oItem.LLIMIT : 0) + 5;
					var iDiff = parseInt(oItem.TGTDIFF);
					if (iDiff > iULimit) {
						oItem.ULimitFlag = true;
						aRedPoints.push(iDiff);
						aDataPoints.push(iDiff);
					} else if (iDiff < iLLimit) {
						oItem.LLimitFlag = true;
						aRedPoints.push(iDiff);
						aDataPoints.push(iDiff);
					} else {
						aDataPoints.push(iDiff);
						aRedPoints.push(NaN);
					}
					aLDashPoints.push(iLLimit);
					aUDashPoints.push(iULimit);
					aLowerLimit.push(oItem.LLIMIT);
					aUpperLimit.push(oItem.ULIMIT);
				});

				var oModel, lineChartData = {
					// width:500,
					labels: ["", "", "", "", ""],
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
							pointBorderWidth: 1,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: "rgba(75,192,192,1)",
							pointHoverBorderColor: "rgba(220,220,220,1)",
							pointHoverBorderWidth: 2,
							pointRadius: 10,
							pointStyle: 'circle',
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
			var html = "<html><body><div  style='width:95%;'>";
			html += "<div style='padding-left:3rem; padding-top:1rem;'>" + engText + "</div>";
			html = id1 !== undefined ? "<div style='width:95%;'>" + this.generateHtml(this, html, id1) + "</div>" : html;
			html += "</div><div style='padding-left: 3rem;'>" + engDetailText + "</div>";
			html += "<div style='padding:1rem;'>";
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
				},
				mode: {
					avoidAll: 'avoid-all'
				}
			}).save();
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