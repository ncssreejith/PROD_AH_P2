sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function(DateFormat) {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */

		//return new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0];
		defaultDateTimeFormat: function(dDate, sFormat) {
			if (!dDate) {
				dDate = new Date();
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy HH:mm"
			});
			if (dDate instanceof Date) {
				var sDate = fnDateFormatter.format(dDate);
				return sDate;
			} else {
				sDate = fnDateFormatter.format(new Date(dDate));
				return sDate;
			}
		},

		defaultDateFormat: function(dDate, sFormat) {
			if (!dDate || typeof dDate.getMonth !== "function") {
				return "";
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy"
			});
			var sDate = fnDateFormatter.format(dDate);
			return sDate;
		},

		defaultTimeFormat: function(dDate, sFormat) {
			if (!dDate || typeof dDate.getMonth !== "function") {
				return "";
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy"
			});
			var sDate = fnDateFormatter.format(dDate);
			return sDate;
		},

		defaultOdataDateFormat: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "yyyy-MM-dd"
			});
			var sDate = fnDateFormatter.format(dDate);
			return sDate;
		},

		defaultDateFormatDisplay: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			var res, Temp;
			try {
				res = dDate.split("-");
				Temp = res[2].concat("/", res[1], "/", res[0]);
			} catch (e) {
				Temp = dDate;
			}

			return Temp;
		},

		defaultDateFormatLimDisplay: function(dDate, sFormat) {
			if (dDate === "-" || dDate === "_" || dDate === null) {
				return "_";
			}
			/*var nDate=new Date(dDate);
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy"
			});
			var sDate = fnDateFormatter.format(nDate);*/
			var res = dDate.split("-");
			var Temp = res[2].concat("/", res[1], "/", res[0]);

			return Temp;
		},

		defaultDatetoDateFormatDisplay: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			var nDate = new Date(dDate);
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy"
			});
			var sDate = fnDateFormatter.format(nDate);

			return sDate;
		},

		defaultTimeFormatDisplay: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			var oResTemp = "0";
			var res = dDate.split(":");
			if (res[1].length === 1) {
				oResTemp = oResTemp.concat(res[1]);
				res[1] = oResTemp;
			}
			var Temp = res[0].concat(":", res[1]);

			return " " + Temp;
		},

		approvalText: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "A":
					oTemp = "ADD Information";
					break;
				case "B":
					oTemp = "ADD & Limitation Information";
					break;
				case "L":
					oTemp = "Limitation Information";
					break;
				case "W":
					oTemp = "Weight and Balance Information";
					break;
				case "TM":
					oTemp = "Trial Modification";
					break;
			}
			return oTemp;
		},

		LimOverViewText: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "A":
					oTemp = "Acceptable Deferred Defects";
					break;
				case "B":
					oTemp = "ADD & Limitation Information";
					break;
				case "L":
					oTemp = "Limitation";
					break;
			}
			return oTemp;
		},

		approvalMasterText: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "A":
					oTemp = "Acceptable Deferred Defect";
					break;
				case "B":
					oTemp = "Acceptable Deferred Defect & Limitation";
					break;
				case "L":
					oTemp = "Limitation";
					break;
				case "W":
					oTemp = "Weight and Balance";
					break;
				case "LP":
					oTemp = "Leading Particulars";
					break;
				case "TM":
					oTemp = "Trial Mod";
			}
			return oTemp;
		},

		FormattBlank: function(sValue) {
			if (sValue === "" || sValue === null) {
				return "_";
			} else {
				return sValue;
			}
		},

		defaultJobType: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "D":
					oTemp = "Defect";
					break;
				case "S":
				case "ZQ":
					oTemp = "Scheduled";
					break;
				case "U":
					oTemp = "Unscheduled";
					break;
			}
			return oTemp;
		},

		fndIdFormatter: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "FND_10":
					oTemp = "BF";
					break;
				case "FND_11":
					oTemp = "PR";
					break;
				case "FND_12":
					oTemp = "TH";
					break;
				case "FND_13":
					oTemp = "QTR";
					break;
				case "FND_14":
					oTemp = "BPO";
					break;
				case "FND_15":
					oTemp = "PR/BPO";
					break;
				case "FND_16":
					oTemp = "AF";
					break;
				case "FND_17":
					oTemp = "WAI";
					break;
				case "FND_18":
					oTemp = "PTR TAXI";
					break;
				case "FND_19":
					oTemp = "PTR";
					break;
				case "FND_20":
					oTemp = "ICT";
					break;
				case "FND_21":
					oTemp = "HOT ICT";
					break;
				case "FND_22":
					oTemp = "TR";
					break;
				case "FND_23":
					oTemp = "WPT";
					break;
				case "FND_24":
					oTemp = "PMS FLIGHT";
					break;
				case "FND_25":
					oTemp = "PMS NON-FLIGHT";
					break;
				case "FND_26":
					oTemp = "ARMING";
					break;
				case "FND_27":
					oTemp = "DISARMING";
					break;
				case "FND_28":
					oTemp = "POST THUNDERSTORM CHECK";
					break;
				case "FND_29":
					oTemp = "SCHEDULE";
					break;
				case "FND_30":
					oTemp = "IN FLIGHT";
					break;
				case "FND_31":
					oTemp = "RECTIFICATION";
					break;
				case "FND_32":
					oTemp = "START-UP";
					break;
				case "FND_33":
					oTemp = "RED-BALL";
					break;
				case "FND_34":
					oTemp = "ON GROUND";
					break;
				case "FND_35":
					oTemp = "FAIR";
					break;
				case "FND_36":
					oTemp = "POST FLIGHT";
					break;

			}
			return oTemp;
		},

		sumAmount: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		decimal1Unit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(1);
		},
		integerUnit: function(sValue) {
			if (!sValue) {
				return 0;
			}
			return parseInt(sValue);
		},
		// From BF
		SignoffEnable: function(bAllToolsAcc, bCerfify) {
			if (bAllToolsAcc && bCerfify) {
				return true;
			} else {
				return false;
			}
		},

		taskFF3Visible: function(stTask1) {
			if (stTask1 === "TT1_14" || stTask1 === "TT1_15" || stTask1 === "TT1_17" || stTask1 === "TT1_18") {
				return true;
			} else {
				return false;
			}
		},

		taskFF2Visible: function(stTask1) {
			if (stTask1 === "TT1_11") {
				return true;
			} else {
				return false;
			}
		},

		taskContentVisibleToolCheck: function(stTask1) {
			if (stTask1 === "TT1_13") {
				return true;
			} else {
				return false;
			}
		},

		taskFF21Visible: function(stTask1) {
			if ((stTask1 !== "TT1_11") || (stTask1 !== "TT1_14") || (stTask1 === "TT1_15") || (stTask1 === "TT1_17") || (stTask1 === "TT1_18")) {
				return true;
			} else {
				return false;
			}
		},

		taskContentVisible: function(stTask1, stTask2) { /*(stTask1 === "TT1_14") || (stTask1 === "TT1_10" && stTask2 === "TT2_13") ||*/
			if ((stTask1 === "TT1_10" && stTask2 === "TT2_10") || (stTask1 === "TT1_10" && stTask2 === "TT2_15") || (stTask1 === "TT1_10" &&
					stTask2 === "TT2_12")) {
				return true;
			} else {
				return false;
			}
		},
		taskContentVisible1: function(stTask1, stTask2) {
			if (stTask1 !== "TT1_99") {
				if ((stTask1 === "TT1_14" && stTask2 === null) || (stTask1 === "TT1_11" && stTask2 === null) || (stTask1 === "TT1_15" && stTask2 ===
						null) || (stTask1 === "TT1_18" && stTask2 === null) || (stTask1 === "TT1_17" && stTask2 === null)) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		taskContentVisible2: function(stTask1, stTask2, stTask3) {
			if ((stTask1 === "TT1_11" && stTask3 === null) || (stTask1 === "TT1_10" && stTask2 === "TT2_12" && stTask3 === null)) {
				return true;
			} else {
				return false;
			}
		},
		taskContentTitle: function(stTask1, stTask2, stTask3) {
			if (stTask1 === "TT1_10" && stTask2 === "TT2_12" && stTask3 === null) {
				return "Follow-Up Task/Findings";
			} else {
				return "Follow-Up Task";
			}
		},

		taskContentVisible3: function(stTask1, stTask2, stTask3, stTask4) {
			if (((stTask1 === "TT1_14" && stTask3 === null) || (stTask1 === "TT1_11" && stTask3 === null) || (stTask1 === "TT1_12" && stTask3 ===
						null) || (stTask1 === "TT1_10" && stTask2 ===
						"TT2_13" && stTask3 === null) || (stTask1 === "TT1_10" &&
						stTask2 === "TT2_14" && stTask3 === null) || (stTask1 === "TT1_10" &&
						stTask2 === "TT2_10" && stTask3 === null) || (stTask1 === "TT1_10" &&
						stTask2 === "TT2_12" && stTask3 === null) || (stTask1 ===
						"TT1_10" && stTask2 === "TT2_11" && stTask3 === null) || (stTask1 === "TT1_15" && stTask3 === null) || (stTask1 === "TT1_16" &&
						stTask3 === null) || (stTask1 === "TT1_17" &&
						stTask3 === null) || (stTask1 === "TT1_18" && stTask3 === null) ||
					(stTask1 === "TT1_19" && stTask3 === null)) && (stTask4 === "" || stTask4 === null)) {
				return true;
			} else {
				return false;
			}
		},

		 taskContentVisibleTB: function(stTask1, stTask2, stTask3, stTask4) {
            if (stTask1 !== "TT1_99") {
                if (((stTask1 === "TT1_14" && stTask3 === null) || (stTask1 === "TT1_10" && stTask2 ===
                            "TT2_13" && stTask3 === null) || (stTask1 === "TT1_10" &&
                            stTask2 === "TT2_14" && stTask3 === null) || (stTask1 === "TT1_10" &&
                            stTask2 === "TT2_10" && stTask3 === null) || (stTask1 === "TT1_10" &&
                            stTask2 === "TT2_12" && stTask3 === null) || (stTask1 ===
                            "TT1_10" && stTask2 === "TT2_11" && stTask3 === null) || (stTask1 === "TT1_11" && stTask3 === null) || (stTask1 === null &&
                            stTask2 === null && stTask3 === null) || (stTask1 ===
                            "TT1_16" && stTask3 === null) ||
                        (stTask1 === "TT1_19" && stTask3 === null)) && (stTask4 === '' || stTask4 === null)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
		taskContentVisible4: function(stTask1, stTask2, stTask3) {
			if ((stTask1 === "TT1_10" && stTask2 === "TT2_10" && stTask3 === null) || (stTask1 === "TT1_14" && stTask3 === null) || (stTask1 ===
					"TT1_10" && stTask2 ===
					"TT2_13" && stTask3 === null)) {
				/*	|| (stTask1 === "TT1_10" && stTask2 === "TT2_12" && stTask3 === null)*/
				return true;
			} else {
				return false;
			}
		},
		taskWorkCenterText: function(stTask1, stTask2) {
			/*var stTask1, stTask2;*/
			if (stTask2) {
				for (var i in stTask2) {
					if (stTask2[i].wrctr === stTask1) {
						return stTask2[i].wrctrtx;
					}
				}
				return stTask2;
			}
		},
		taskNameText: function(stTask1, stTask2) {

			if (stTask2) {
				for (var i in stTask2) {
					if (stTask2[i].ttid === stTask1) {
						return stTask2[i].ttype;
					}
				}
				return stTask2;
			}
		},

		FoundDuringText: function(stFndId, stModel) {
			if (stModel) {
				for (var i in stModel) {
					if (stModel[i].ddid === stFndId) {
						return stModel[i].description;
					}
				}
				return null;
			}
		},

		serialNoInputVisible: function(engFlag, isser, tTask2) {
			if ((engFlag === "NE" && isser === "Serial No. (S/N)") || (engFlag === "NA" && isser ===
					"Serial No. (S/N)") || (engFlag === "NA" && isser ===
					"Batch No.") || (engFlag === "NE" && isser ===
					"Batch No.")) {
				if (tTask2 !== "TT2_14" && tTask2 !== "TT2_13") {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		serialNoInputRequired: function(engFlag, isser, tTask2, tTask1) {
			if ((engFlag === "NE" && isser === "Serial No. (S/N)" && tTask1 !== "TT1_99") || (engFlag === "NA" && isser ===
					"Serial No. (S/N)" && tTask1 !== "TT1_99")) {
				if (tTask2 !== "TT2_14" && tTask2 !== "TT2_13" && tTask1 !== "TT1_99") {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		setItemVisible: function(stTask2, stTask1) {
			if ((stTask2 === "TT2_11" && stTask1 === "TT4_11") || (stTask2 === "TT2_11" && stTask1 === "TT4_14") || (stTask2 === "TT2_11" &&
					stTask1 === "TT4_15") || (stTask2 === "TT2_11" && stTask1 === "TT4_16") || (
					stTask2 === "TT2_11" && stTask1 === "TT4_10")) {
				return true;
			} else {
				return false;
			}
		},
		serialNoInputGroupVisible: function(engFlag, isser, tTask2) {
			if ((engFlag === "NE" && isser === "Serial No. (S/N)") || (engFlag === "NA" && isser === "Serial No. (S/N)") || (engFlag === "NA" &&
					isser ===
					"Batch No.") || (engFlag === "NE" && isser ===
					"Batch No.")) {
				if (tTask2 !== "TT2_14" && tTask2 !== "TT2_13") {
					return "fgInput";
				} else {
					return "";
				}
			} else {
				return "";
			}
		},
		serialNoCBVisible: function(engFlag, isser, tTask1) {
			if (engFlag === "EG" && isser === "Serial No. (S/N)" && tTask1 !== "TT1_99") {
				return true;
			} else {
				return false;
			}
		},
		serialNoCBGroupVisible: function(engFlag, isser) {
			if (engFlag === "EG" && isser === "Serial No. (S/N)") {
				return "fgCmbBox";
			} else {
				return "";
			}
		},
		taskTextDisplay: function(stTask1) {
			var sImageSrc = "";
			switch (stTask1) {
				case "TT1_15":
					sImageSrc = "Warning Message";
					break;
				case "TT1_17":
					sImageSrc = "QA Task";
					break;
				case "TT1_18":
					sImageSrc = "Independent Checker Task";
					break;
				default:
					sImageSrc = "";
			}
			return sImageSrc;

		},

		FLCTaskTitle: function(sViewName) {
			if (sViewName === "PDS") {
				return "FLC Tasks & Replenishment";
			} else {
				return "Replenishment";
			}
		},

		OutstandingSNDialog: function(sType) {
			if (sType === "Remove and/or Installation" || sType === "Ops Check" || sType === "Visual Inspection" || sType ===
				"Remove and/or Installation" || sType === "Others") {
				return true;
			} else {
				return false;
			}
		},

		EnablePilotAccSingOff: function(sRep, sFly, sADD, sLim, sWeap) {
			if (sRep === "Reviewed" && sFly === "Reviewed" && sADD === "Reviewed" && sLim === "Reviewed" && sWeap === "Reviewed") {
				return true;
			} else {
				return false;
			}
		},
		ManageFRVisibility: function(AirFlightStatus) {
			if (AirFlightStatus !== "NF") {
				return true;
			} else {
				return false;
			}
		},

		ManageSortieMonitoringVisible: function(sFlyReq) {
			if (sFlyReq === "NCO") {
				return true;
			} else {
				return false;
			}
		},

		ManageStatusTestVisible: function(sFlyReq) {
			if (sFlyReq === "Fail" || sFlyReq === "NCO") {
				return true;
			} else {
				return false;
			}
		},
		DBSchedule: function(iPercentage) {
			if (iPercentage < 40) {
				return "Critical";
			} else {
				return "Good";
			}
		},
		DBFuelPercentage: function(iPercentage) {
			if (iPercentage < 40) {
				return "Critical";
			} else {
				return "Good";
			}
		},

		WeaponConfigSignOff: function(bSignOff) {
			if (bSignOff) {
				return "#0a6cd6";
			} else {
				return "#EEF1F8";
			}
		},

		FaitrStat: function(sValue) {
			if (sValue === 'R') {
				return "Release for Rectification";
			} else if (sValue === 'A') {
				return "FAIR";
			}
		},

		checkboxDispatch: function(sDispatch) {
			return (sDispatch === "Yes");
		},
		TradesmanStatus: function(sDone, sNA) {
			if (sDone === null && sNA === null) {
				return "noKey";
			} else if (sDone === "" && sNA === null) {
				return "noKey";
			} else if (sDone === null && sNA === "") {
				return "noKey";
			} else if (sDone === "X" && sNA === null) {
				return "NA";
			} else if (sNA === null && sDone === "Y") {
				return "Done";
			} else {
				return "noKey";
			}
		},

		///////////////////////////////////////////////////AMIT KUMAR //////////////////////////////////////////////

		stnsQty: function(isSer, srCount, sTotQty) {
			var sQty = 0;
			if (isSer === "X") {
				sQty = srCount;
			}
			sQty = sTotQty;
			if (sQty === 0) {
				sQty = "";
			}
			return sQty;
		},

		fnFuelMaxAmt: function(srvtId, maxAmt, orgAmt) {
			if (srvtId === "SRVT_DE") {
				return parseInt(orgAmt);
			}
			return parseInt(maxAmt - orgAmt);
		},
		reviewedStatus: function(sStatus) {
			var sTxt = "None";
			if (sStatus) {
				sTxt = "Success";
			}
			return sTxt;
		},
		reviewedStatusTxt: function(sStatus) {
			var sTxt = "To be reviewed";
			if (sStatus) {
				sTxt = "Reviewed";
			}
			return sTxt;
		},

		wcQuanty: function(TOTQTY, SERNR) {
			if (TOTQTY) {
				return "Qty " + TOTQTY;
			}
			if (SERNR) {
				return "Qty " + 1;
			}
			return "Qty " + 0;
		},
		jdsDueInFormat: function(duein, uom) {
			if (!duein || !uom) {
				return 0;
			}
			if (uom === "AFH" || uom === "EOT") {
				return parseFloat(duein);
			}
			return parseInt(duein);
		},
		sortieMonitoringFormat: function(sValue, sKey) {
			if (sValue && sKey) {
				var temp = null;
				var i = sKey === "SORTI_5" ? 1 : 0;
				temp = sValue.split("@");
				return temp[i];
			}
		},

		fnTimeFormat: function(dDate, sFormat) {
			if (!dDate) {
				dDate = new Date();
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "HH:mm"
			});
			if (dDate instanceof Date) {
				var sDate = fnDateFormatter.format(dDate);
				return sDate;
			} else {
				return dDate;
			}
		},
		fnRTDeleteBtn: function(sTotalLeng) {
			var srNo = parseInt(this.getId().split("-")[this.getId().split("-").length - 1], 0) + 1;
			if (srNo > sTotalLeng) {
				return true;
			}
			return false;
		},
		fnDateDiff: function(oDate) {
			var sBindInfo = this.getBindingInfo("footerRightInfo") ? "footerRightInfo" : "text";

			var sModel = this.getBindingInfo(sBindInfo).parts[0].model;
			var resId = this.getBindingContext(sModel).getProperty("resid");
			//{path:'avmetModel>/airutil/COL_13'
			switch (resId) {
				case "RES_105":
					break;
				case "RES_106":
					break;
					// case "RES_107": //Issue 826
					// 	break;
					// case "RES_108":
					// 	break;
				default:
					return "";
			}

			var sDiff = 0;
			if (!oDate) {
				return sDiff + " hrs";
			}
			var sCurrentDate = new Date();
			sDiff = Math.abs(sCurrentDate - new Date(oDate)) / 36e5;
			return "Top up " + parseFloat(sDiff).toFixed(2) + "hrs ago";
		},
		fnEngHrsDiff: function(sHrsince, sEngineHrs) {
			var sBindInfo = this.getBindingInfo("footerRightInfo") ? "footerRightInfo" : "text";

			var sModel = this.getBindingInfo(sBindInfo).parts[0].model;
			var resId = this.getBindingContext(sModel).getProperty("resid");

			switch (resId) {
				case "RES_105":
					break;
				case "RES_106":
					break;
					// case "RES_107": //Issue 826
					// 	break;
					// case "RES_108":
					// 	break;
				default:
					return "";
			}
			var sDiff = parseFloat(sEngineHrs) - parseFloat(sHrsince);
			if (!sDiff) {
				return sDiff + " hrs";
			}
			return "Top up " + parseFloat(sDiff).toFixed(1) + " engine hours ago";
		},
		fnDateEngineHrsInfoDiff: function(sHrsince, sEngineHrs) {
			var sBindInfo = this.getBindingInfo("footerRightInfo") ? "footerRightInfo" : "visible";

			var sModel = this.getBindingInfo(sBindInfo).parts[0].model;
			var resId = this.getBindingContext(sModel).getProperty("resid");
			switch (resId) {
				case "RES_105":
					break;
				case "RES_106":
					break;
				default:
					return false;
			}
			var sDiff = parseFloat(sEngineHrs) - parseFloat(sHrsince);
			if (!sDiff) {
				return false;
			}
			return (sDiff < 10);
		},
		fnDateTimeDiff: function(sDate, sTime) {
			var sDiff = 0;
			if (!sDate) {
				return "";
			}
			if (!sTime) {
				return "";
			}
			var sCurrentDate = new Date();
			sDiff = Math.abs(sCurrentDate - new Date(sDate + " " + sTime)) / 36e5;
			return parseFloat(sDiff).toFixed(2); // + " hrs";
		},
		fnDateEngineHrsDiff: function(sDate) {
			var sBindInfo = this.getBindingInfo("footerRightInfo") ? "footerRightInfo" : "visible";

			var sModel = this.getBindingInfo(sBindInfo).parts[0].model;
			var resId = this.getBindingContext(sModel).getProperty("resid");
			switch (resId) {
				case "RES_105":
					break;
				case "RES_106":
					break;
				default:
					return false;
			}
			var sDiff = 0;
			if (!sDate) {
				return false;
			}

			var sCurrentDate = new Date();
			sDiff = Math.abs(sCurrentDate - new Date(sDate)) / 36e5;
			return (sDiff < 10); // + " hrs";
		},
		FuelMCState1: function(sValue, iMax) {
			// if(this.getId() && document.querySelector("#"+this.getId()+" > div > div > div")){
			// 	document.querySelector("#"+this.getId()+" > div > div > div").textContent="";
			// }
			var iValue = 0;
			if (sValue === null || iMax === null) {
				return "Neutral";
			} else if ((parseInt(sValue) < parseInt(iMax))) {
				return "Critical";
			} else if ((parseInt(sValue) === parseInt(iMax))) {
				return "Good";
			}
		},

		ADDLimitColorByDay: function(sValue) {
			this.removeStyleClass("vboxOrangebgColorr");
			this.removeStyleClass("vbox6BgColor");
			if (sValue === "1") {
				this.addStyleClass("vboxOrangebgColorr");
			} else {
				this.addStyleClass("vbox6BgColor");
			}
			return "13%";
		},
		fnLblAddLimit: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "A":
				case "B":
					oTemp = "Acceptable Deferred Defects";
					break;
				case "L":
					oTemp = "Limitation";
					break;
			}
			return oTemp;
		},
		wConnect: function(sState, isCart) {
			var sCText = "";
			if (sState === "C") {
				sCText = "Disconnect \n connector";
				if (isCart === 'X') {
					sCText = "Uninstall \n impulse cart";
				}
				return sCText;
			}
			sCText = "Connect \n connector";
			if (isCart === "X") {
				sCText = "Install \n impulse cart";
			}
			return sCText;
		},
		wConnectColor: function(sState) {
			// CONTOR ICART
			if (sState) {
				return sap.m.ValueColor.Error;
			}
			return sap.m.ValueColor.Critical;
		},
		srvWeaponImage: function(oStationId) {
			var oSrvImg = "";
			switch (oStationId) {
				case "STNS_100":
					oSrvImg = "css/img/Section-1.png";
					break;
				case "STNS_101":
					oSrvImg = "css/img/Section-2.png";
					break;
				case "STNS_102":
					oSrvImg = "css/img/Section-3.png";
					break;
				case "STNS_103":
					oSrvImg = "css/img/Section-4.png";
					break;
				case "STNS_104":
					oSrvImg = "css/img/Section-5.png";
					break;
				case "STNS_105":
					oSrvImg = "css/img/Section-6.png";
					break;
				case "STNS_106":
					oSrvImg = "css/img/Section-7.png";
					break;
				case "STNS_107":
					oSrvImg = "css/img/Section-8.png";
					break;
				case "STNS_108":
					oSrvImg = "css/img/Section-9.png";
					break;
				case "STNS_109":
					oSrvImg = "css/img/Section-10.png";
					break;
				case "STNS_110":
					oSrvImg = "css/img/Section-1.png";
					break;
			}
			return oSrvImg;
		},

		srvWeaponAHImage: function(oStationId) {
			var oSrvImg = "";
			switch (oStationId) {
				case "STNS_100":
					oSrvImg = "css/img/ConfigCHAFF.png"; // CHAFF
					break;
				case "STNS_101":
					oSrvImg = "css/img/ConfigFLARE.png"; //FLARE
					break;
				case "STNS_102":
					oSrvImg = "css/img/ConfigGUN.png";
					break;
				case "STNS_109":
					oSrvImg = "css/img/ConfigLOB.png";
					break;
				case "STNS_110":
					oSrvImg = "css/img/ConfigLIB.png";
					break;
				case "STNS_111":
					oSrvImg = "css/img/ConfigRIB.png";
					break;
				case "STNS_112":
					oSrvImg = "css/img/ConfigROB.png";
					break;
			}
			return oSrvImg;
		},

		wcStationColor: function(oTotal) {
			// if (oTotal === undefined || oTotal === '' || oTotal === null || oTotal === 0) {
			if (oTotal === undefined || oTotal === '' || oTotal === null || oTotal === 0) {
				return "#e8e4e4";
			}
			return "#0a6cd6";
		},
		/** 
		 * AVMET frame button status color
		 * @param oSt
		 * @param sSttxt
		 * @returns
		 */
		statusColor: function(oSt, sSttxt) {
			switch (oSt) {
				case "AST_S":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greenbtn");
					break;
				case "AST_FS":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greenbtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greybtn");
					break;
				case "AST_FFF":
				case "AST_FFF0":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greenbtn");
					break;
				case "AST_RFF":
				case "AST_RFF0":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greenbtn");
					break;
				case "AST_US":
				case "AST_US0":
				case "AST_US1":
				case "AST_US2":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("greenbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("yellowbtn");
					break;
				case "AST_RECT":
				case "AST_RECT1":
				case "AST_RECT2":
				case "AST_FAIR":
				case "AST_FAIR0":
				case "AST_FAIR1":
				case "AST_FAIR2":
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greenbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("redbtn");
					break;
				case "AST_FFC":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greenbtn");
					break;
				case "AST_FFG":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greenbtn");
					break;
				case "AST_REC":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("greenbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("yellowbtn");
					break;
				default:
					this.removeStyleClass("redbtn");
					this.removeStyleClass("greenbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("yellowbtn");
					this.addStyleClass("infobtn");
					break;
			}

			return sSttxt;
		},
		statusFlightColor: function(oSt) {
			switch (oSt) {
				case "AST_RFF":
					this.addStyleClass("dashButtonRole");
					return "Transparent";

				default:
					this.addStyleClass("sapMBtnInner");
					return "Emphasized";

			}

			return "Emphasized";
		},
		srvImage: function(statusId) {
			var sImageSrc = "";
			switch (statusId) {
				case "SRVT_AF":
					sImageSrc = "css/img/BFFlight.JPG";
					break;
				case "SRVT_BF":
					sImageSrc = "css/img/BFFlight.JPG";
					break;
				case "SRVT_BPO":
					sImageSrc = "css/img/BFFlight.JPG";
					break;
				case "SRVT_HCT":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_ICT":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_PO":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_PR":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_PRO":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_PTR":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_PTX":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_QT":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_QTR":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_TH":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_TR":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_WA":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_WAI":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_DE":
					sImageSrc = "css/img/Defuel.jpg";
					break;
				case "SRVT_RE":
					sImageSrc = "css/img/Refuel.jpg";
					break;
				default:
					sImageSrc = "css/img/BFFlight.jpg";
			}
			return sImageSrc;
		},
		srvImageHover: function(statusId) {
			var sImageSrc = "";
			switch (statusId) {
				case "SRVT_AF":
					sImageSrc = "css/img/BFFlightBlu.JPG";
					break;
				case "SRVT_BF":
					sImageSrc = "css/img/BFFlightBlu.JPG";
					break;
				case "SRVT_BPO":
					sImageSrc = "css/img/BFFlightBlu.JPG";
					break;
				case "SRVT_HCT":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_ICT":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_PO":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_PR":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_PRO":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_PTR":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_PTX":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_QT":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_QTR":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_TH":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_TR":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_WA":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_WAI":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_DE":
					sImageSrc = "css/img/DefuelBlu.jpg";
					break;
				case "SRVT_RE":
					sImageSrc = "css/img/RefuelBlu.jpg";
					break;
				default:
					sImageSrc = "css/img/BFFlightBlu.jpg";
			}
			return sImageSrc;
		},

		srvLbl: function(srvId) {
			var sSrvTitle = "";
			switch (srvId) {
				case "SRVT_AF":
					sSrvTitle = "AF";
					break;
				case "SRVT_BF":
					sSrvTitle = "BF";
					break;
				case "SRVT_BPO":
					sSrvTitle = "BPO";
					break;
				case "SRVT_HCT":
					sSrvTitle = "HCT";
					break;
				case "SRVT_ICT":
					sSrvTitle = "ICT";
					break;
				case "SRVT_PO":
					sSrvTitle = "PO";
					break;
				case "SRVT_PR":
					sSrvTitle = "PR";
					break;
				case "SRVT_PRO":
					sSrvTitle = "PR/BPO";
					break;
				case "SRVT_PTR":
					sSrvTitle = "PTR";
					break;
				case "SRVT_PTX":
					sSrvTitle = "PTX";
					break;
				case "SRVT_QT":
					sSrvTitle = "QT";
					break;
				case "SRVT_QTR":
					sSrvTitle = "QTR";
					break;
				case "SRVT_TH":
					sSrvTitle = "TH";
					break;
				case "SRVT_TR":
					sSrvTitle = "TR";
					break;
				case "SRVT_WA":
					sSrvTitle = "WA";
					break;
				case "SRVT_WAI":
					sSrvTitle = "WAI";
					break;
				case "SRVT_DE":
					sSrvTitle = "Defuel";
					break;
				case "SRVT_RE":
					sSrvTitle = "Refuel";
					break;
				case "SRVT_PMSF":
					sSrvTitle = "PMSF";
					break;
				case "SRVT_HICT":
					sSrvTitle = "HOT ICT";
					break;
				case "SRVT_OSC":
					sSrvTitle = "Outstation checks";
					break;
				case "SRVT_PTRT":
					sSrvTitle = "PTR-Taxi";
					break;
				case "SRVT_PMSN":
					sSrvTitle = "PMS Non-Flight";
					break;
				case "SRVT_PTC":
					sSrvTitle = "Post Thunderstorm Check";
					break;
				case "SRVT_WPT":
					sSrvTitle = "WPT";
					break;

			}
			return sSrvTitle;
		},

		serialNumber: function(oItem) {
			var srNo = parseInt(this.getId().split("-")[this.getId().split("-").length - 1], 0) + 1;
			// var oModel = this.getBindingInfo("text").parts[0].model;
			if (this.getBindingContext("oPilotUpdatesViewModel")) {
				this.getBindingContext("oPilotUpdatesViewModel").getObject().num2 = srNo;
			}

			return srNo;
		},

		formatMaxValue: function(oMax) {
			if (!oMax) {
				oMax = 0;
			}
			oMax = parseInt(oMax, 0);
			if (isNaN(oMax)) {
				return 0;
			}
			return oMax;
		},
		percentAge: function(oState, sState1) {
			var sPercentAge = 0;
			if (oState === undefined || oState === null || oState === 0) {
				return sPercentAge;
			}
			sPercentAge = ((oState * 100) / sState1);
			if (sPercentAge > 100) {
				sPercentAge = 100;
			}
			return sPercentAge;
		},
		fuelMC: function(oState, sState1) {
			if (!oState || !sState1) {
				return 0;
			}
			var sPercentAge = 0;
			if (oState === undefined || oState === null) {
				return sPercentAge;
			}
			sPercentAge = ((oState * 100) / sState1);
			return sPercentAge;
		},
		fnMarkLable: function(sNumber) {
			// var sNumber = parseInt(this.getId().split("-")[this.getId().split("-").length - 1], 0) + 1;
			var sChar = "A";
			switch (sNumber) {
				case 0:
					sChar = "A";
					break;
				case 1:
					sChar = "B";
					break;
				case 2:
					sChar = "C";
					break;
				case 3:
					sChar = "D";
					break;
				case 4:
					sChar = "E";
					break;
				case 5:
					sChar = "F";
					break;
				case 6:
					sChar = "G";
					break;
				case 7:
					sChar = "H";
					break;
				case 8:
					sChar = "I";
					break;
			}
			return sChar;
		},
		fnOrgSrvAmt: function(orgAmt, srvAmt) {
			if (!orgAmt) {
				orgAmt = 0;
			}
			if (srvAmt) {
				srvAmt = 0;
			}
			return parseInt(orgAmt) + parseInt(srvAmt);
		},
		///////////////////////////////////////////////////AMIT KUMAR //////////////////////////////////////////////

		//////////////////////********************    PRIYA - STARTS   *****************************///////////////

		FormatMaxValue: function(sValue, max) {
			if (!isNaN(sValue) && sValue !== null && sValue !== 0) {
				return parseInt(sValue);
			} else if (!isNaN(max) && max !== null) {
				return parseInt(max);
			}
		},

		FormatMaxValueText: function(srvamt, totamt) {
			if (totamt !== 0 && srvamt > totamt) {
				return "test123";
			} else {
				return "";
			}
		},

		FormatRoleMaxValue: function(sMax) {
			if (!isNaN(sMax) && sMax !== null && sMax !== 0) {
				return parseFloat(sMax);
			}

		},

		FormatMaxValueState: function(srvamt, totamt) {
			if (totamt !== 0 && srvamt > totamt) {
				return "Error";
			} else {
				return "None";
			}
		},

		FormatMaxValueFloat: function(sValue, max) {
			if (!isNaN(sValue) && sValue !== null && sValue !== 0) {
				return parseFloat(sValue);
			} else if (!isNaN(max) && max !== null) {
				return parseFloat(max);
			}
		},
		FormatDeFuel: function(sValue) {
			if (sValue === "X") {
				return true;
			} else {
				return false;
			}
		},
		FuelMC: function(sValue, iMax) {
			if (!sValue || !iMax) {
				return 0;
			}
			var iValue = 0;
			if (sValue === null || iMax === null) {
				return iValue;
			} else {
				iValue = ((parseFloat(sValue) / parseInt(iMax))) * 100;
				return iValue;
			}
		},
		FuelMCState: function(sValue, iMax) {
			var iValue = 0;
			if (sValue === null || iMax === null) {
				return "Neutral";
			} else if ((parseInt(sValue) < parseInt(iMax))) {
				return "Critical";
			} else if ((parseInt(sValue) === parseInt(iMax))) {
				return "Good";
			}
		},
		formatDecimalOil: function(sValue) {
			if (sValue === "LOX") {
				return 1;
			}
			if (sValue === "Eng Oil #1") {
				return 2;
			}
			if (sValue === "Eng Oil #2") {
				return 2;
			}
		},

		formatStepOil: function(sValue) {
			if (sValue === "LOX") {
				return 0.1;
			}
		},
		ImpulseCart: function(bTanks) {
			if (bTanks) {
				return false;
			} else {
				return true;
			}
		},
		EnablePDSSignOff: function(bOutSignOffEnable, bFinalSignOffEnable) {
			if (bOutSignOffEnable && bFinalSignOffEnable) {
				return true;
			} else {
				return false;
			}
		},

		ShowTire: function(sSrvtId) {
			if (sSrvtId === "SRVT_BF" || sSrvtId === "SRVT_PR" || sSrvtId === "SRVT_WAI") {
				return true;
			} else {
				return false;
			}
		},
		PageTitle: function(sPageTitle) {
			if (sPageTitle === "PTRT") {
				return "PTR-Taxi";
			} else if (sPageTitle === "HICT") {
				return "HOT ICT";
			} else if (sPageTitle === "PRO") {
				return "PR/BPO";
			} else if (!isNaN(sPageTitle)) {
				return "";
			} else {
				return sPageTitle;
			}
		},
		TradesmanStatusDisplay: function(sDone, sNA) {
			if (sDone === null && sNA === null) {
				return "";
			} else if (sDone === "" && sNA === null) {
				return "";
			} else if (sDone === null && sNA === "") {
				return "";
			} else if (sDone === "X" && sNA === null) {
				return "NA";
			} else if (sNA === null && sDone === "Y") {
				return "Done";
			} else {
				return "";
			}
		},
		CheckTailStatus: function(aState) {
			switch (aState) {
				case "AST_FFF":
				case "AST_RFF":
				case "AST_FAIR":
				case "AST_FAIR0":
				case "AST_FAIR1":
				case "AST_FAIR2":
					return false;
				default:
					return true;
			}
		},

		CloseJobBtnStatus: function(sStatus1, sStatus2) {
			if ((sStatus1 === true && sStatus2 === true)) {
				return true;
			} else {
				return false;
			}
		},
		FormatRoleChangeSLNo: function(sSlNo) {
			if (sSlNo !== "") {
				return "S/N: " + sSlNo;
			} else {
				return sSlNo;
			}
		},
		//////////////////////********************    PRIYA - ENDS   *****************************///////////////
		fnEditableCol: function(iColId) {
			var bEditable = true;
			var oRow = this.getBindingContext("oWDNSDataModel").getObject();
			// iColId === oRow.COL_15 &&
			if (oRow && (oRow.COL_12 === "GUN DH" || (iColId && iColId.toUpperCase() === "N/A"))) {
				bEditable = false;
			}
			return bEditable;
		},
		fnWDNSEditableCol: function(iColId) {
			var bEditable = true;
			if (iColId && iColId.toUpperCase() === "N/A") {
				bEditable = false;
			}
			return bEditable;
		},
		fnWDNSVisibleRow: function(iColId) {
			var bVisible = false;
			var oRow = this.getBindingContext("oWDNSDataModel").getObject();
			if (oRow && (oRow.COL_12 === "GUN DH" && oRow.bPilot)) {
				bVisible = true;
			}
			if (oRow && (oRow.COL_12 !== "GUN DH" && !oRow.bPilot)) {
				bVisible = true;
			}
			return bVisible;
		},

		intFormat: function(sValue) {
			if (sValue) {
				return parseInt(sValue, 10);
			}
			return sValue;
		},

		JobDueDecimalPrecision: function(sKey) {
			if (sKey === "JDU_11" || sKey === "JDU_18" || sKey === "JDU_19" || sKey === "JDU_20" || sKey === "SORTI_2" || sKey === "SORTI_3" ||
				sKey === "SORTI_6" || sKey === "UTIL1_10" || sKey === "UTIL1_16" || sKey === "UTIL1_17" || sKey === "UTIL1_18") {
				return 1;
			} else {
				return 0;
			}
		},

		decimalForTableFormatter: function(sValue) {
			if (sValue) {
				return sValue;
			}
		},

		validDateTimeChecker: function(that, idDate, idTime, errorMessagePast, errorMessageFuture, prevDate, prevTime) {
			var maxDt = new Date(),
				oDatePicker = that.getView().byId(idDate),
				creDt = oDatePicker.getDateValue(),
				oTimePick = that.getView().byId(idTime),
				creTm = oTimePick.getValue(),
				date = creDt.getDate(),
				year = creDt.getFullYear(),
				month = creDt.getMonth() + 1;
			var dateString = '' + year + '-' + month + '-' + date;
			var timeString = creTm + ':00';
			var crDtTime = new Date(dateString + ' ' + timeString);
			var minDate = "";
			if (prevDate) {
				var dateParts = prevDate.split("-");
				minDate = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
				var timeParts = prevTime.split(":");
				minDate.setHours(timeParts[0]);
				minDate.setMinutes(timeParts[1]);
			} else {
				minDate = new Date();
				minDate.setDate(minDate.getDate() - 1);
				minDate.setMinutes(minDate.getMinutes() - 1);
				minDate.setSeconds(0);
			}
			if (crDtTime.getTime() <= maxDt.getTime()) {
				if (crDtTime.getTime() >= minDate.getTime()) {
					oDatePicker.setValueState("None");
					oTimePick.setValueState("None");
					return true;
				} else {
					oDatePicker.setValueState("Error");
					oTimePick.setValueState("Error");
					sap.m.MessageBox.error(that.getResourceBundle().getText(errorMessagePast));
					return false;
				}
			} else {
				oDatePicker.setValueState("Error");
				oTimePick.setValueState("Error");
				sap.m.MessageBox.error(that.getResourceBundle().getText(errorMessageFuture));
				return false;
			}
		},

		validDateTimeCloseTaskChecker: function(that, currDate, currTime, errorMessagePast, errorMessageFuture, prevDate, prevTime) {
			var maxDt = new Date(),
				creDt = new Date(currDate),
				creTm = currTime,
				date = creDt.getDate(),
				year = creDt.getFullYear(),
				month = creDt.getMonth() + 1;
			var dateString = '' + year + '-' + month + '-' + date;
			var timeString = creTm + ':00';
			var crDtTime = new Date(dateString + ' ' + timeString);

			var minDate = "";
			if (prevDate) {
				var dateParts = prevDate.split("-");
				minDate = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
				var timeParts = prevTime.split(":");
				minDate.setHours(timeParts[0]);
				minDate.setMinutes(timeParts[1]);
			} else {
				minDate = new Date();
				minDate.setDate(minDate.getDate() - 1);
				minDate.setMinutes(minDate.getMinutes() - 1);
				minDate.setSeconds(0);
			}

			if (crDtTime.getTime() <= maxDt.getTime()) {
				if (crDtTime.getTime() >= minDate.getTime()) {
					return "C";
				} else {
					return "L";
				}
			} else {
				return "G";
			}
		},

		serialTemplateBtnVisibility: function(stt1, stt2) {
			if (stt1 === "TT1_10" && (stt2 === "TT2_10" || stt2 === "TT2_12" || stt2 === "TT2_13" || stt2 === "TT2_14")) {
				return true;
			}
			return false;
		},

		batchTemplateBtnVisibility: function(stt1, stt2) {
			if (stt1 === "TT1_10" && stt2 === "TT2_15") {
				return true;
			}
			return false;
		},

		getTimeValueForDate: function(aData, datePath, timePath) {
			if (aData && datePath && timePath && aData[datePath] && aData[timePath]) {
				var obj = JSON.parse(JSON.stringify(aData));
				var date = obj[datePath],
					time = obj[timePath],
					dateParts = date.split("-"),
					timeParts = time.split(":");
				var newDate = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
				newDate.setHours(timeParts[0]);
				newDate.setMinutes(timeParts[1]);
				newDate.setSeconds(timeParts[2].split(".")[0], [timeParts[2].split(".")[1]]);
				return newDate.getTime();
			}

		},

		formatUtilValApproval: function(sVal, sKey) {
			if (sVal && sKey) {
				var sParts = sVal.split("@");
				if (sKey === "UTIL1_20") {
					return sParts[1];
				} else {
					return sParts[0];
				}
			}
			return sVal;
		},

		jobAction: function(sStatus) {
			if (sStatus) {
				var sText = "-";
				switch (sStatus) {
					// case "R":
					// 	sText = "Released for Rectification";
					// 	break;
					case "A":
						sText = "FAIR";
						break;
				}
				return sText;
			}
		},

		textAreaRequiredFUTask: function(sTmpId, sTT1Id) {
			if (sTmpId) {
				return true;
			}
			if (sTT1Id !== "TT1_11" && sTT1Id !== "TT1_14" && sTT1Id !== "TT1_15" && sTT1Id !== "TT1_16" && sTT1Id !== "TT1_19") {
				return true;
			}
			return false;
		},

		textAreaFieldGrpFUTask: function(sTmpId, sTT1Id) {
			if (sTmpId) {
				return "fgTxtArea";
			}
			if (sTT1Id !== "TT1_11" && sTT1Id !== "TT1_14" && sTT1Id !== "TT1_15" && sTT1Id !== "TT1_16" && sTT1Id !== "TT1_19") {
				return "fgTxtArea";
			}
			return "";
		}

	};

}, true);