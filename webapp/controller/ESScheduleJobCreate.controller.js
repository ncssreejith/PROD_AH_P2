sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log",
	"../model/AvMetInitialRecord",
	"../util/ajaxutilNew",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil, Log, AvMetInitialRecord, ajaxutilNew, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *   Control name:            
	 *   Purpose : 
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.ESScheduleJobCreate", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var that = this,
					oDDT2Model,
					oDDT1Model;
				oDDT1Model = dataUtil.createNewJsonModel();
				oDDT1Model.setData([{
					"key": "1",
					"text": "Serial No. (S/N)"
				}, {
					"key": "2",
					"text": "Batch No."
				}]);
				this.getView().setModel(oDDT1Model, "TT1Model");
				oDDT2Model = dataUtil.createNewJsonModel();
				oDDT2Model.setData([{
					"key": "1",
					"text": "Material No."
				}, {
					"key": "2",
					"text": "Part No."
				}]);
				that.getView().setModel(oDDT2Model, "TT2Model");
				this.getRouter().getRoute("ESScheduleJobCreate").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
			}

		},
		// ***************************************************************************
		//     2. Backend Calls
		// ***************************************************************************
		/* Function: onClearFilterBar
		 * Parameter: oEvt
		 * Description: function to populate job due drop down
		 */
		_fnJobDueGet: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid" + FilterOpEnum.EQ + that.getAircraftId() + "&ddid" + FilterOpEnum.EQ + "JDU";
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var aJobDue = [];
					//If coming from engine page
					if (!this.fnCheckTailAvail() && oData.results) {
						oData.results.forEach(function(oItem) {
							switch (oItem.ddid) {
								case "JDU_10":
									aJobDue.push(oItem);
									break;
								case "JDU_22":
									aJobDue.push(oItem);
									break;
							}
						});
					} else {
						oData.results.forEach(function(oItem) {
							switch (oItem.ddid) {
								case "JDU_22":
									break;
								default:
									aJobDue.push(oItem);
									break;
							}
						});
					}
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(aJobDue);
					that.getView().setModel(oModel, "JobDueSet");
				}.bind(this);
				ajaxutilNew.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmJobDue);
			} catch (e) {
				Log.error("Exception in ESScheduleJobCreate:_fnJobDueGet function");

			}
		},
		/* Function: _fnGetUtilisation
		 * Parameter: oEvt
		 * Description: function to populate local model minimum values for utilisation
		 */
		_fnGetUtilisation: function(sAir) {
			try {
				var oPrmJobDue = {};
				oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + sAir + " and JDUID eq JDU";
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
				Log.error("Exception in _fnGetUtilisation function");
			}
		},
		/* Function: getEngineHeader
		 * Parameter: oEvt
		 * Description: function to Get engine header data
		 */

		getEngineHeader: function() {
			try {
				var
					oEngineModel = this.getView().getModel("JobCreateModel"),
					oParameter = {};
				var sEngID = oEngineModel.getProperty("/ENGID");
				if (sEngID && sEngID !== " ") {
					oParameter.filter = "ENGID eq '" + sEngID + "'";
				} else {
					oParameter.filter = "tailid eq '" + this.getTailId() + "'";
				}
				oParameter.error = function() {};
				oParameter.success = function(oData) {

					if (oData && oData.results.length > 0) {
						// this.oObject = {};
						for (var i in oData.results) {
							this.oObject["JDU_22"] = {
								VALUE: oData.results[i].EOT
							};
						}
					}

					// if (oData && oData.results && oData.results.length > 0) {
					// 	oData.results.forEach(function(oItem) {
					// 		if (oItem.ENGNO === null) {
					// 			oItem.ENGNO = "1";
					// 		}
					// 		oEngineModel.setProperty("/" + (oItem.ENGNO === "2" ? "header2Details" : "headerDetails"), oItem);
					// 	}.bind(this));

					// }
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("ENGINEDISSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in getEngineHeader function");
			}
		},
		/* Function: _fnWorkCenterGet
		 * Parameter: sAir
		 * Description: function to populate work center drop down
		 */
		_fnWorkCenterGet: function(sAir) {
			try {
				var that = this,
					oPrmWorkCen = {};
				oPrmWorkCen.filter = "REFID eq " + sAir;
				oPrmWorkCen.error = function() {

				};

				oPrmWorkCen.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.setModel(oModel, "WorkCenterSet");
				}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("GETWORKCENTERSVC"), oPrmWorkCen);
			} catch (e) {
				Log.error("Exception in _fnWorkCenterGet function");
			}
		},
		/* Function: ESJobCreate
		 * Parameter: oEvt
		 * Description: function to validate and save data at back end to create job
		 */
		ESJobCreate: function() {
			try {
				if (!this.handleChange()) {
					return;
				}
				var that = this,
					oPayload,
					oPrmTD = {};
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				oPayload = this.getView().getModel("JobCreateModel").getData();
				if (oPayload.UMKEY === "JDU_10" && parseInt(oPayload.INTERVAL, 10) === 0) {
					if (!oPayload.SERVDT) {
						this.getView().byId("DP2").setValueState("Error");
						return;
					}
				}
				try {
					oPayload.CREDT = formatter.defaultOdataDateFormat(oPayload.CREDT);
				} catch (e) {
					oPayload.CREDT = oPayload.CREDT;
				}

				try {
					if (oPayload.SERVDUE) {
						var iPrec = formatter.JobDueDecimalPrecision(oPayload.UMKEY);
						oPayload.SERVDUE = parseFloat(oPayload.SERVDUE, [10]).toFixed(iPrec);
					}

				} catch (e) {
					oPayload.SERVDUE = oPayload.SERVDUE;
				}
				oPayload.J_FLAG = "N";
				oPayload.FLAG = "ES";
				oPayload.TAILID = this.getTailId();
				oPayload.AIRID = this.getAircraftId();
				oPayload.MODID = this.getModelId();

				switch (oPayload.CTYPE) {
					case "AIRCRAFT":
						oPayload.JOBTY = "ZP";
						break;
					case "ENGINE":
						oPayload.JOBTY = "ZQ";
						break;
					case "COMPONENT":
						oPayload.JOBTY = "ZM";
						break;
					case "MODSTI":
						if (oPayload.MODTYPE === 3) {
							oPayload.JOBTY = "ZD";
						} else {
							oPayload.JOBTY = "ZT";
						}
						break;
				}

				/*	switch (oPayload.TYPE2) {
						case "LTO":
							oPayload.JOBTY = "ZP";
							break;
						case "SI":
							oPayload.JOBTY = "ZQ";
							break;
						case "STI":
							oPayload.JOBTY = "ZQ";
							break;
						case "MOD":
							oPayload.JOBTY = "ZE";
							break;
						case "TRIAL MOD":
							oPayload.JOBTY = "ZD";
							break;
					}*/
				oPrmTD.error = function() {};
				oPrmTD.success = function(oData) {
					if (!this.getModel("JobCreateModel").getProperty("/ENGID")) {
						this.getRouter().navTo("Cosjobs", {
							State: "SCH"
						}, true);
					} else {
						if (!this.fnCheckTailAvail()) {
							this.getRouter().navTo("Engine", {
								ENGID: this.getModel("JobCreateModel").getProperty("/ENGID")
							}, true);
						} else {
							this.getRouter().navTo("Engine", {}, true);
						}
					}
				}.bind(this);
				oPrmTD.activity = 1;
				ajaxutil.fnCreate(this.getResourceBundle().getText("GETSERLOGSVC"), oPrmTD, [oPayload], "ZRM_COS_JB", this);
			} catch (e) {
				Log.error("Exception in ESJobCreate function");
			}
		},
		// ***************************************************************************
		//     3.  Specific Methods  
		// ***************************************************************************
		/* Function: onNavBackSortie
		 * Parameter: oEvt
		 * Description: function to handle when back button is pressed
		 */
		onNavBackSortie: function() {
			try {
				this.getRouter().navTo("SortieMonitoring");
			} catch (e) {
				Log.error("Exception in onNavBackSortie function");
			}
		},
		/* Function: onSelectionNatureofJobChange
		 * Parameter: oEvt
		 * Description: function call when job type is changed
		 */
		onSelectionNatureofJobChange: function(oEvent) {
			try {
				this.getModel("JobCreateModel").setProperty("/MODTYPE", 0);
			} catch (e) {
				Log.error("Exception in onNavBackSortie function");
			}
		},
		/* Function: handleChange
		 * Parameter: oEvt
		 * Description: function to check validation on date/time
		 */
		handleChange: function() {
			try {
				return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorCreateJobPast", "errorCreateJobFuture");
			} catch (e) {
				Log.error("Exception in onNavBackSortie function");
			}

		},
		/* Function: onDueDateChange
		 * Parameter: oEvt
		 * Description: function set value state when date is changed
		 */
		onDueDateChange: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					oAppModel = this.getView().getModel("JobCreateModel"),
					sKey = oAppModel.getProperty("/UMKEY"),
					sInt = oAppModel.getProperty("/INTERVAL");
				oSrc.setValueState("None");
				var iPrec = formatter.JobDueDecimalPrecision(sKey);
				/*if (parseFloat(sInt, [10]) > 0) {
					oAppModel.setProperty("/INTERVAL", parseFloat(0, [10]).toFixed(iPrec));
					sap.m.MessageBox.warning("As you are changing Job Due By, Interval value has been reset");
				}*/
			} catch (e) {
				Log.error("Exception in onDueDateChange function");
			}
		},

		/* Function: onDueSelectChange
		 * Parameter: oEvent
		 * Description: To  sheduled defect on change of due type.
		 */
		onDueSelectChange: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					sKey = oSrc.getSelectedKey(),
					sDue = oEvent.getSource().getSelectedItem().getText(),
					oAppModel = this.getView().getModel("JobCreateModel");
				if (sKey.length > 0) {
					oSrc.setValueState("None");
					if (this.oObject && this.oObject[sKey] && this.oObject[sKey].VALUE) {
						var minVal = parseFloat(this.oObject[sKey].VALUE, [10]);
						oAppModel.setProperty("/DefValue", minVal);
						var sVal = oAppModel.getProperty("/SERVDUE") ? oAppModel.getProperty("/SERVDUE") : 0;
						sVal = parseFloat(sVal, [10]);
						var iPrec = formatter.JobDueDecimalPrecision(sKey);
						oAppModel.setProperty("/SERVDUE", parseFloat(minVal, [10]).toFixed(iPrec));
						oAppModel.setProperty("/INTERVAL", parseFloat(0, [10]).toFixed(iPrec));
					} else {
						oAppModel.setProperty("/INTERVAL", parseFloat(0, [10]).toFixed(0));
					}
				}

				oAppModel.setProperty("/UM", sDue);
				oAppModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in onDueSelectChange function");
			}
		},
		/* Function: onStepChangeSchedule
		 * Parameter: oEvt
		 * Description: function call when step input value is changed
		 */
		onStepChangeSchedule: function(oEvent) {
			try {
				this.onStepChange(oEvent);
				var oSrc = oEvent.getSource(),
					oAppModel = this.getView().getModel("JobCreateModel"),
					sKey = oAppModel.getProperty("/UMKEY"),
					sInt = oAppModel.getProperty("/INTERVAL");
				oSrc.setValueState("None");
				var iPrec = formatter.JobDueDecimalPrecision(sKey);
				/*if (parseFloat(sInt, [10]) > 0) {
					oAppModel.setProperty("/INTERVAL", parseFloat(0, [10]).toFixed(iPrec));
					sap.m.MessageBox.warning("As you are changing Job Due By, Interval value has been reset");
				}*/
			} catch (e) {
				Log.error("Exception in onStepChangeSchedule function");
			}
		},
		/* Function: onIntervalChange
		 * Parameter: oEvt
		 * Description: function call when interval value is changed
		 */
		onIntervalChange: function(oEvent) {
			try {
				var oSrc = oEvent.getSource(),
					oAppModel = this.getView().getModel("JobCreateModel"),
					sVal = oSrc.getValue(),
					sKey = oAppModel.getProperty("/UMKEY"),
					sDue = oAppModel.getProperty("/SERVDUE"),
					sDate = oAppModel.getProperty("/SERVDT"),
					bFlag = false;
				oSrc.setValueState("None");
				var iPrec = formatter.JobDueDecimalPrecision(sKey);
				if (!sVal || sVal === "") {
					sVal = 0;
				}
				oAppModel.setProperty("/INTERVAL", parseFloat(sVal, [10]).toFixed(iPrec));
				/*	if (sKey !== "JDU_10") {
						if (this.oObject && this.oObject[sKey] && this.oObject[sKey].VALUE) {
							var minVal = parseFloat(this.oObject[sKey].VALUE, [10]);
							var val = parseFloat(minVal, [10]).toFixed(iPrec);
							if (sDue !== val) {
								oAppModel.setProperty("/SERVDUE", val);
								bFlag = true;
							}
						}
					} else if (sKey === "JDU_10") {
						if (sDate && sDate !== "") {
							oAppModel.setProperty("/SERVDT", null);
							bFlag = true;
						}
					}

					if (bFlag) {
						sap.m.MessageBox.warning("As you are changing interval, Job Due By value has been reset");
					}*/

			} catch (e) {
				Log.error("Exception in onIntervalChange function");
			}
		},
		// ***************************************************************************
		//   4. Private Function   
		// ***************************************************************************
		/* Function: _onObjectMatched
		 * Parameter: oEvt
		 * Description: function to intialize local model when route is matched
		 */
		_onObjectMatched: function(oEvent) {
			try {
				var that = this,
					oAppModel, oJobModel, oTempData,
					sAir = this.getAircraftId();

				oAppModel = dataUtil.createNewJsonModel();
				oAppModel.setData({
					sSelectedKey: "NA"

				});
				this.getView().setModel(oAppModel, "appModel");
				oJobModel = dataUtil.createNewJsonModel();
				oTempData = AvMetInitialRecord.createInitialBlankRecord("SCHJob");
				oTempData[0].CREDT = new Date();
				oTempData[0].CRETM = new Date().getHours() + ":" + new Date().getMinutes();
				oTempData[0].ENGNO = "1";
				oJobModel.setData(oTempData[0]);

				this.getView().setModel(oJobModel, "JobCreateModel");

				var sEngID = oEvent.getParameter("arguments").ENGID;
				this.getModel("JobCreateModel").setProperty("/ENGID", sEngID);
				this.getModel("JobCreateModel").setProperty("/SERIAL", oEvent.getParameter("arguments").SN);
				if (sEngID) {
					this.getModel("JobCreateModel").setProperty("/SN", oEvent.getParameter("arguments").SN);
					this.getModel("JobCreateModel").setProperty("/PN", oEvent.getParameter("arguments").ENGTY);

					this.getModel("JobCreateModel").setProperty("/CTYPE", "ENGINE");
				}

				this._fnJobDueGet(sAir);
				this._fnGetUtilisation(sAir);
				this.getEngineHeader();
				this._fnWorkCenterGet(sAir);

			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		}

	});
});